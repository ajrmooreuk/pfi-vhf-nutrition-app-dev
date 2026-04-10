import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MealPlannerAgent } from "@/lib/agents/meal-planner-agent";
import { ClientProfile, MealPlan } from "@/lib/agents/types";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      client_id,
      duration_days = 7,
      preferences,
    } = body as {
      client_id: string;
      duration_days?: number;
      preferences?: { avoidRepetition?: boolean; mealPrepFriendly?: boolean };
    };

    if (!client_id) {
      return NextResponse.json(
        { error: "client_id is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    // Fetch client profile
    const { data: clientData, error: clientError } = await supabase
      .from("vhf_clients")
      .select(
        "id, given_name, family_name, gender, birth_date, height_cm, weight_kg, activity_level, medical_conditions, goal, daily_calories, protein_grams, carbs_grams, fats_grams, diets, dietary_restrictions, allergens, preferred_themes"
      )
      .eq("id", client_id)
      .single();

    if (clientError || !clientData) {
      return NextResponse.json(
        { error: `Client not found: ${clientError?.message ?? "no data"}` },
        { status: 404 }
      );
    }

    const clientProfile: ClientProfile = {
      ...clientData,
      diets: clientData.diets ?? [],
      dietary_restrictions: clientData.dietary_restrictions ?? [],
      allergens: clientData.allergens ?? [],
      preferred_themes: clientData.preferred_themes ?? [],
      medical_conditions: clientData.medical_conditions ?? null,
    };

    // Create and run the agent
    const agent = new MealPlannerAgent();
    const startTime = Date.now();

    const rawResponse = await agent.generate(
      `Create a ${duration_days}-day meal plan for ${clientProfile.given_name} ${clientProfile.family_name}.`,
      {
        client: clientProfile,
        duration_days,
        preferences,
      }
    );

    const durationMs = Date.now() - startTime;

    // Parse JSON from the response
    let mealPlan: MealPlan;
    try {
      // Strip any markdown code fences if present
      const jsonStr = rawResponse
        .replace(/^```(?:json)?\s*/m, "")
        .replace(/```\s*$/m, "")
        .trim();
      mealPlan = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        {
          error: "Failed to parse meal plan from agent response",
          raw_response: rawResponse,
        },
        { status: 500 }
      );
    }

    // Save the meal plan to Supabase
    const { data: savedPlan, error: planError } = await supabase
      .from("vhf_meal_plans")
      .insert({
        client_id,
        duration_days: mealPlan.duration_days,
        start_date: mealPlan.start_date,
        daily_targets: mealPlan.daily_targets,
        shopping_list: mealPlan.shopping_list,
        notes: mealPlan.notes,
        status: "draft",
      })
      .select("id")
      .single();

    if (planError || !savedPlan) {
      console.error("Failed to save meal plan:", planError);
      // Return the plan even if save fails
      return NextResponse.json({
        plan: mealPlan,
        saved: false,
        error: planError?.message,
      });
    }

    // Save daily entries
    for (const day of mealPlan.days) {
      const { data: savedDay, error: dayError } = await supabase
        .from("vhf_meal_plan_days")
        .insert({
          meal_plan_id: savedPlan.id,
          day_number: day.day,
          date: day.date,
          daily_totals: day.daily_totals,
        })
        .select("id")
        .single();

      if (dayError || !savedDay) {
        console.error(`Failed to save day ${day.day}:`, dayError);
        continue;
      }

      // Save individual meal entries
      const mealSlots = ["breakfast", "snack_am", "lunch", "snack_pm", "dinner"] as const;
      for (const slot of mealSlots) {
        const meal = day.meals[slot];
        if (!meal) continue;

        await supabase.from("vhf_meal_plan_entries").insert({
          meal_plan_day_id: savedDay.id,
          meal_slot: slot,
          recipe_id: meal.recipe_id,
          recipe_name: meal.recipe_name,
          servings: meal.servings,
          nutrition: meal.nutrition,
        });
      }
    }

    // Save agent session
    await supabase.from("vhf_agent_sessions").insert({
      agent_name: "meal-planner",
      client_id,
      duration_ms: durationMs,
      model: "claude-sonnet-4-6",
      status: "completed",
      metadata: {
        duration_days,
        preferences,
        plan_id: savedPlan.id,
      },
    });

    // Save the conversation as an agent message
    await supabase.from("vhf_agent_messages").insert({
      session_id: savedPlan.id,
      role: "assistant",
      content: rawResponse,
      metadata: { parsed: true },
    });

    return NextResponse.json({
      plan: mealPlan,
      plan_id: savedPlan.id,
      saved: true,
    });
  } catch (error) {
    console.error("Meal planner error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
