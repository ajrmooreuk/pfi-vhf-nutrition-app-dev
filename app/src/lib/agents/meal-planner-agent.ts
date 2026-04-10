import Anthropic from "@anthropic-ai/sdk";
import { BaseAgent } from "./base-agent";
import { ClientProfile } from "./types";
import { searchRecipes } from "@/lib/tools/recipe-search";
import { calculateMacros } from "@/lib/tools/macro-calculator";
import { generateShoppingList } from "@/lib/tools/shopping-list";
import { RecipeResult } from "./types";

interface MealPlannerContext {
  client: ClientProfile;
  duration_days: number;
  preferences?: {
    avoidRepetition?: boolean;
    mealPrepFriendly?: boolean;
  };
}

export class MealPlannerAgent extends BaseAgent {
  name = "meal-planner";
  model = "claude-sonnet-4-6";
  maxTokens = 8000;
  temperature = 0.3;

  // Cache recipes fetched during tool calls for shopping list generation
  private fetchedRecipes: Map<string, RecipeResult> = new Map();

  getSystemPrompt(
    context: MealPlannerContext
  ): Anthropic.MessageCreateParams["system"] {
    const { client, duration_days, preferences } = context;

    const allergenWarning =
      client.allergens.length > 0
        ? `CRITICAL SAFETY CONSTRAINT: The client has the following allergens: ${client.allergens.join(", ")}. Every recipe MUST exclude these allergens. Never suggest a recipe containing these ingredients.`
        : "No allergens reported.";

    const dietInfo =
      client.diets.length > 0
        ? `Dietary requirements: ${client.diets.join(", ")}`
        : "No specific dietary requirements.";

    const restrictionInfo =
      client.dietary_restrictions.length > 0
        ? `Dietary restrictions: ${client.dietary_restrictions.join(", ")}`
        : "No dietary restrictions.";

    const macroTargets = client.daily_calories
      ? `Daily targets: ${client.daily_calories} kcal, ${client.protein_grams}g protein, ${client.carbs_grams}g carbs, ${client.fats_grams}g fats`
      : "No macro targets set. Use the macro_calculator tool to calculate targets based on the client profile.";

    const preferencesInfo = preferences
      ? [
          preferences.avoidRepetition
            ? "Avoid repeating the same recipe within the plan."
            : null,
          preferences.mealPrepFriendly
            ? "Favour meal-prep-friendly recipes (batch cooking, good reheating)."
            : null,
        ]
          .filter(Boolean)
          .join(" ")
      : "";

    return `You are a specialist meal planning assistant for Viridian Health & Fitness (VHF), a UK-based nutrition coaching practice.

Your task is to create a structured ${duration_days}-day meal plan for the following client.

CLIENT PROFILE:
- Name: ${client.given_name} ${client.family_name}
- Gender: ${client.gender ?? "Not specified"}
- Date of birth: ${client.birth_date ?? "Not specified"}
- Height: ${client.height_cm ? `${client.height_cm} cm` : "Not specified"}
- Weight: ${client.weight_kg ? `${client.weight_kg} kg` : "Not specified"}
- Activity level: ${client.activity_level ?? "Not specified"}
- Goal: ${client.goal ?? "Not specified"}
- Medical conditions: ${client.medical_conditions?.map((c) => `${c.name} (${c.status})`).join(", ") ?? "None"}

NUTRITION:
${macroTargets}
${dietInfo}
${restrictionInfo}
${allergenWarning}

Preferred meal themes: ${client.preferred_themes.length > 0 ? client.preferred_themes.join(", ") : "No preference"}

${preferencesInfo}

INSTRUCTIONS:
1. If no macro targets are set, first use the macro_calculator tool to calculate appropriate targets.
2. Use the recipe_search tool to find suitable recipes. Search by category (breakfast, lunch, dinner, snack) and filter by the client's dietary requirements, allergens, and macro constraints.
3. Build a ${duration_days}-day plan with breakfast, lunch, dinner, and optional snacks (AM and PM) for each day.
4. Ensure daily totals are within 5% of the calorie target and macro splits are reasonable.
5. Ensure variety: do not repeat the same recipe more than twice across the plan.
6. All recipes must be available in the UK.
7. After planning all days, use generate_shopping_list to produce a consolidated shopping list.

OUTPUT FORMAT:
Respond with a single JSON object (no markdown fences) with this exact structure:
{
  "client_id": "${client.id}",
  "duration_days": ${duration_days},
  "start_date": "<YYYY-MM-DD, tomorrow's date>",
  "daily_targets": { "calories": <number>, "protein": <number>, "carbs": <number>, "fats": <number> },
  "days": [
    {
      "day": 1,
      "date": "<YYYY-MM-DD>",
      "meals": {
        "breakfast": { "recipe_id": "<id>", "recipe_name": "<name>", "servings": <n>, "nutrition": { "calories": <n>, "protein": <n>, "carbs": <n>, "fats": <n> } },
        "snack_am": <same structure or null>,
        "lunch": <same structure>,
        "snack_pm": <same structure or null>,
        "dinner": <same structure>
      },
      "daily_totals": { "calories": <n>, "protein": <n>, "carbs": <n>, "fats": <n> }
    }
  ],
  "shopping_list": [{ "item": "<name>", "quantity": <n>, "unit": "<unit>", "aisle_category": "<category>" }],
  "notes": "<brief summary of the plan>"
}`;
  }

  getTools(): Anthropic.Tool[] {
    return [
      {
        name: "recipe_search",
        description:
          "Search the recipe database for recipes matching filters. Returns an array of recipes with nutritional data.",
        input_schema: {
          type: "object" as const,
          properties: {
            category: {
              type: "string",
              description:
                "Recipe category: breakfast, lunch, dinner, snack, or dessert",
            },
            max_calories: {
              type: "number",
              description: "Maximum calories per serving",
            },
            min_protein: {
              type: "number",
              description: "Minimum protein in grams per serving",
            },
            exclude_allergens: {
              type: "array",
              items: { type: "string" },
              description:
                "Allergens to exclude (recipes must exclude all of these)",
            },
            suitable_diets: {
              type: "array",
              items: { type: "string" },
              description:
                "Diets the recipe must be suitable for (e.g. vegetarian, vegan, gluten-free)",
            },
            themes: {
              type: "array",
              items: { type: "string" },
              description:
                "Preferred cuisine themes (e.g. mediterranean, asian, british)",
            },
            limit: {
              type: "number",
              description:
                "Maximum number of results to return (default 50)",
            },
          },
          required: [],
        },
      },
      {
        name: "macro_calculator",
        description:
          "Calculate daily macro targets using the Mifflin-St Jeor equation. Returns BMR, TDEE, and macro breakdown.",
        input_schema: {
          type: "object" as const,
          properties: {
            age: { type: "number", description: "Client age in years" },
            gender: {
              type: "string",
              enum: ["male", "female"],
              description: "Client gender",
            },
            weight_kg: {
              type: "number",
              description: "Client weight in kilograms",
            },
            height_cm: {
              type: "number",
              description: "Client height in centimetres",
            },
            activity_level: {
              type: "string",
              enum: [
                "sedentary",
                "lightly_active",
                "moderately_active",
                "very_active",
                "extremely_active",
              ],
              description: "Client activity level",
            },
            goal: {
              type: "string",
              enum: [
                "weight_loss",
                "muscle_gain",
                "maintenance",
                "sports_performance",
              ],
              description: "Client nutritional goal",
            },
          },
          required: [
            "age",
            "gender",
            "weight_kg",
            "height_cm",
            "activity_level",
            "goal",
          ],
        },
      },
      {
        name: "generate_shopping_list",
        description:
          "Generate a consolidated, deduplicated shopping list from a set of recipe IDs and servings. Groups items by aisle category.",
        input_schema: {
          type: "object" as const,
          properties: {
            recipe_servings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  recipe_id: { type: "string" },
                  servings: { type: "number" },
                },
                required: ["recipe_id", "servings"],
              },
              description:
                "Array of recipe IDs with desired servings for shopping list generation",
            },
          },
          required: ["recipe_servings"],
        },
      },
    ];
  }

  async executeToolCall(
    toolName: string,
    toolInput: Record<string, unknown>
  ): Promise<unknown> {
    switch (toolName) {
      case "recipe_search": {
        const results = await searchRecipes({
          category: toolInput.category as string | undefined,
          max_calories: toolInput.max_calories as number | undefined,
          min_protein: toolInput.min_protein as number | undefined,
          exclude_allergens: toolInput.exclude_allergens as
            | string[]
            | undefined,
          suitable_diets: toolInput.suitable_diets as string[] | undefined,
          themes: toolInput.themes as string[] | undefined,
          limit: toolInput.limit as number | undefined,
        });
        // Cache for shopping list generation
        for (const r of results) {
          this.fetchedRecipes.set(r.id, r);
        }
        return results;
      }

      case "macro_calculator": {
        return calculateMacros({
          age: toolInput.age as number,
          gender: toolInput.gender as "male" | "female",
          weight_kg: toolInput.weight_kg as number,
          height_cm: toolInput.height_cm as number,
          activity_level: toolInput.activity_level as
            | "sedentary"
            | "lightly_active"
            | "moderately_active"
            | "very_active"
            | "extremely_active",
          goal: toolInput.goal as
            | "weight_loss"
            | "muscle_gain"
            | "maintenance"
            | "sports_performance",
        });
      }

      case "generate_shopping_list": {
        const recipeServings = toolInput.recipe_servings as {
          recipe_id: string;
          servings: number;
        }[];
        const recipes: RecipeResult[] = [];
        const servingsMap: Record<string, number> = {};

        for (const entry of recipeServings) {
          const cached = this.fetchedRecipes.get(entry.recipe_id);
          if (cached) {
            recipes.push(cached);
            servingsMap[entry.recipe_id] = entry.servings;
          }
        }

        return generateShoppingList(recipes, servingsMap);
      }

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}
