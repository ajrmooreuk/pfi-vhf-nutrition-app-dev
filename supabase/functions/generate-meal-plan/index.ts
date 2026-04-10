/**
 * VHF Meal Plan Generator — Supabase Edge Function
 *
 * POST { client_id: string, duration_days?: number }
 *
 * 1. Fetches client profile from vhf_clients
 * 2. Fetches suitable recipes from vhf_recipes (filtered by diets/allergens)
 * 3. Calls Claude to generate a structured meal plan
 * 4. Saves plan to vhf_meal_plans + vhf_meal_plan_days + vhf_meal_plan_entries
 * 5. Returns the generated plan as JSON
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk";

// ── CORS ────────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  "https://ajrmooreuk.github.io",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
    "Access-Control-Max-Age": "86400",
  };
}

// ── Types ───────────────────────────────────────────────────────────────────

interface ClientRow {
  id: string;
  given_name: string;
  family_name: string;
  gender: string | null;
  birth_date: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: string | null;
  goal: string | null;
  daily_calories: number | null;
  protein_grams: number | null;
  carbs_grams: number | null;
  fats_grams: number | null;
  diets: string[];
  dietary_restrictions: string[];
  allergens: string[];
  preferred_themes: string[];
  medical_conditions: { name: string; icd10?: string; status: string }[] | null;
}

interface RecipeRow {
  id: string;
  name: string;
  category: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  prep_time_mins: number | null;
  servings: number | null;
  suitable_diets: string[];
  excluded_allergens: string[];
  themes: string[];
  cost_per_serving_gbp: number | null;
}

// ── Main handler ────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const clientId: string = body.client_id;
    const durationDays: number = body.duration_days ?? 7;

    if (!clientId) {
      return new Response(JSON.stringify({ error: "client_id is required" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // ── Supabase client (service role for full access) ───────────────────

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ── 1. Fetch client profile ─────────────────────────────────────────

    const { data: client, error: clientError } = await supabase
      .from("vhf_clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return new Response(
        JSON.stringify({ error: `Client not found: ${clientError?.message ?? clientId}` }),
        { status: 404, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    const c = client as ClientRow;

    // ── 2. Fetch suitable recipes ───────────────────────────────────────

    let recipeQuery = supabase
      .from("vhf_recipes")
      .select("id, name, category, calories, protein_g, carbs_g, fat_g, prep_time_mins, servings, suitable_diets, excluded_allergens, themes, cost_per_serving_gbp")
      .limit(200);

    // Filter by diet suitability if client has diets
    if (c.diets && c.diets.length > 0) {
      recipeQuery = recipeQuery.overlaps("suitable_diets", c.diets);
    }

    // Filter by allergen exclusion — recipes must exclude the client's allergens
    if (c.allergens && c.allergens.length > 0) {
      recipeQuery = recipeQuery.contains("excluded_allergens", c.allergens);
    }

    const { data: recipes, error: recipeError } = await recipeQuery;

    if (recipeError) {
      return new Response(
        JSON.stringify({ error: `Recipe fetch failed: ${recipeError.message}` }),
        { status: 500, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    const recipeList = (recipes ?? []) as RecipeRow[];

    if (recipeList.length === 0) {
      return new Response(
        JSON.stringify({ error: "No suitable recipes found for this client's dietary requirements" }),
        { status: 422, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    // ── 3. Build Claude prompt ──────────────────────────────────────────

    const allergenWarning = c.allergens.length > 0
      ? `CRITICAL SAFETY CONSTRAINT: The client has the following allergens: ${c.allergens.join(", ")}. Every recipe MUST exclude these allergens. Never include a recipe containing these ingredients.`
      : "No allergens reported.";

    const dietInfo = c.diets.length > 0
      ? `Dietary requirements: ${c.diets.join(", ")}`
      : "No specific dietary requirements.";

    const restrictionInfo = c.dietary_restrictions.length > 0
      ? `Dietary restrictions: ${c.dietary_restrictions.join(", ")}`
      : "No dietary restrictions.";

    const macroTargets = c.daily_calories
      ? `Daily targets: ${c.daily_calories} kcal, ${c.protein_grams}g protein, ${c.carbs_grams}g carbs, ${c.fats_grams}g fats`
      : "No macro targets set. Estimate reasonable targets based on the client profile.";

    const medicalInfo = c.medical_conditions && c.medical_conditions.length > 0
      ? `Medical conditions: ${c.medical_conditions.map(m => `${m.name} (${m.status})`).join(", ")}`
      : "No medical conditions reported.";

    const recipeContext = recipeList.map(r =>
      `- ${r.name} [ID: ${r.id}] | ${r.category ?? "meal"} | ${r.calories ?? "?"}kcal | P:${r.protein_g ?? "?"}g C:${r.carbs_g ?? "?"}g F:${r.fat_g ?? "?"}g | Diets: ${(r.suitable_diets ?? []).join(",")} | Cost: £${r.cost_per_serving_gbp ?? "?"}`
    ).join("\n");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startDate = tomorrow.toISOString().split("T")[0];

    const systemPrompt = `You are a specialist meal planning assistant for Viridian Health & Fitness (VHF), a UK-based nutrition coaching practice.

Your task is to create a structured ${durationDays}-day meal plan for the following client.

CLIENT PROFILE:
- Name: ${c.given_name} ${c.family_name}
- Gender: ${c.gender ?? "Not specified"}
- Date of birth: ${c.birth_date ?? "Not specified"}
- Height: ${c.height_cm ? `${c.height_cm} cm` : "Not specified"}
- Weight: ${c.weight_kg ? `${c.weight_kg} kg` : "Not specified"}
- Activity level: ${c.activity_level ?? "Not specified"}
- Goal: ${c.goal ?? "Not specified"}
- ${medicalInfo}

NUTRITION:
${macroTargets}
${dietInfo}
${restrictionInfo}
${allergenWarning}

Preferred meal themes: ${c.preferred_themes.length > 0 ? c.preferred_themes.join(", ") : "No preference"}

AVAILABLE RECIPES (use ONLY these — reference by ID):
${recipeContext}

INSTRUCTIONS:
1. Build a ${durationDays}-day plan with breakfast, lunch, dinner, and optional snacks (snack_am, snack_pm) for each day.
2. Ensure daily totals are within ±5% of the calorie target and macro splits are reasonable.
3. Ensure variety: do not repeat the same recipe more than twice across the ${durationDays} days.
4. All recipes must be from the AVAILABLE RECIPES list above. Use exact recipe IDs.
5. ${allergenWarning}
6. All recipes must be available in the UK.
7. Start date: ${startDate}

OUTPUT FORMAT:
Respond with ONLY a valid JSON object (no markdown fences, no explanation) with this exact structure:
{
  "client_id": "${c.id}",
  "duration_days": ${durationDays},
  "start_date": "${startDate}",
  "daily_targets": { "calories": <number>, "protein": <number>, "carbs": <number>, "fats": <number> },
  "days": [
    {
      "day": 1,
      "date": "<YYYY-MM-DD>",
      "meals": {
        "breakfast": { "recipe_id": "<uuid>", "recipe_name": "<name>", "servings": <n>, "nutrition": { "calories": <n>, "protein": <n>, "carbs": <n>, "fats": <n> } },
        "snack_am": <same structure or null>,
        "lunch": <same structure>,
        "snack_pm": <same structure or null>,
        "dinner": <same structure>
      },
      "daily_totals": { "calories": <n>, "protein": <n>, "carbs": <n>, "fats": <n> }
    }
  ],
  "notes": "<brief summary of the plan>"
}`;

    // ── 4. Call Claude ──────────────────────────────────────────────────

    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    const anthropic = new Anthropic({ apiKey: anthropicApiKey });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Generate the ${durationDays}-day meal plan for ${c.given_name} ${c.family_name} now. Output only the JSON object.`,
        },
      ],
    });

    // Extract text content from Claude response
    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return new Response(
        JSON.stringify({ error: "No text response from Claude" }),
        { status: 500, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    let plan: Record<string, unknown>;
    try {
      plan = JSON.parse(textBlock.text);
    } catch {
      return new Response(
        JSON.stringify({ error: "Failed to parse Claude response as JSON", raw: textBlock.text.slice(0, 500) }),
        { status: 500, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
      );
    }

    // ── 5. Save to database ─────────────────────────────────────────────

    const planDays = (plan.days as Array<Record<string, unknown>>) ?? [];
    const dailyTargets = (plan.daily_targets as Record<string, number>) ?? {};

    // Insert meal plan
    const { data: savedPlan, error: planError } = await supabase
      .from("vhf_meal_plans")
      .insert({
        client_id: c.id,
        duration_days: durationDays,
        start_date: plan.start_date ?? startDate,
        status: "pending_review",
        daily_calories_target: dailyTargets.calories ?? c.daily_calories,
        daily_protein_target: dailyTargets.protein ?? c.protein_grams,
        daily_carbs_target: dailyTargets.carbs ?? c.carbs_grams,
        daily_fats_target: dailyTargets.fats ?? c.fats_grams,
        notes: (plan.notes as string) ?? null,
        generated_by: "claude-sonnet-4-6",
      })
      .select("id")
      .single();

    if (planError || !savedPlan) {
      console.error("Plan insert error:", planError);
      // Return the plan even if DB save fails — client still gets the result
      return new Response(JSON.stringify({ plan, db_error: planError?.message }), {
        status: 200,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const planId = savedPlan.id;

    // Insert plan days and entries
    for (const day of planDays) {
      const dayNum = day.day as number;
      const dayDate = day.date as string;
      const dayTotals = (day.daily_totals as Record<string, number>) ?? {};

      const { data: savedDay, error: dayError } = await supabase
        .from("vhf_meal_plan_days")
        .insert({
          meal_plan_id: planId,
          day_number: dayNum,
          date: dayDate,
          total_calories: dayTotals.calories ?? null,
          total_protein: dayTotals.protein ?? null,
          total_carbs: dayTotals.carbs ?? null,
          total_fats: dayTotals.fats ?? null,
        })
        .select("id")
        .single();

      if (dayError || !savedDay) {
        console.error(`Day ${dayNum} insert error:`, dayError);
        continue;
      }

      const meals = (day.meals as Record<string, Record<string, unknown> | null>) ?? {};
      const mealTypes = ["breakfast", "snack_am", "lunch", "snack_pm", "dinner"];

      for (const mealType of mealTypes) {
        const meal = meals[mealType];
        if (!meal) continue;

        const nutrition = (meal.nutrition as Record<string, number>) ?? {};

        await supabase.from("vhf_meal_plan_entries").insert({
          meal_plan_day_id: savedDay.id,
          meal_type: mealType,
          recipe_id: (meal.recipe_id as string) ?? null,
          recipe_name: (meal.recipe_name as string) ?? null,
          servings: (meal.servings as number) ?? 1,
          calories: nutrition.calories ?? null,
          protein_g: nutrition.protein ?? null,
          carbs_g: nutrition.carbs ?? null,
          fat_g: nutrition.fats ?? null,
        });
      }
    }

    // ── 6. Return the plan ──────────────────────────────────────────────

    return new Response(
      JSON.stringify({
        id: planId,
        ...plan,
        status: "pending_review",
      }),
      {
        status: 200,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      }
    );

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders(req), "Content-Type": "application/json" } }
    );
  }
});
