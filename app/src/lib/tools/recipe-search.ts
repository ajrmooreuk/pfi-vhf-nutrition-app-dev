import { createClient } from "@supabase/supabase-js";
import { RecipeResult } from "@/lib/agents/types";

interface RecipeSearchOptions {
  category?: string;
  max_calories?: number;
  min_protein?: number;
  exclude_allergens?: string[];
  suitable_diets?: string[];
  themes?: string[];
  limit?: number;
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Search recipes from the vhf_recipes table with filters.
 */
export async function searchRecipes(
  options: RecipeSearchOptions
): Promise<RecipeResult[]> {
  const supabase = getServiceClient();
  const limit = options.limit ?? 50;

  let query = supabase
    .from("vhf_recipes")
    .select(
      "id, name, category, calories, protein_g, carbs_g, fat_g, prep_time_mins, cook_time_mins, servings, ingredients, suitable_diets, excluded_allergens, themes, cost_per_serving_gbp"
    )
    .limit(limit);

  if (options.category) {
    query = query.eq("category", options.category);
  }

  if (options.max_calories !== undefined) {
    query = query.lte("calories", options.max_calories);
  }

  if (options.min_protein !== undefined) {
    query = query.gte("protein_g", options.min_protein);
  }

  // Allergen exclusion: recipes whose excluded_allergens contain all of the
  // client's allergens (i.e. the recipe explicitly excludes those allergens)
  if (options.exclude_allergens && options.exclude_allergens.length > 0) {
    query = query.contains(
      "excluded_allergens",
      options.exclude_allergens
    );
  }

  // Diet suitability: recipe must support at least one of the requested diets
  if (options.suitable_diets && options.suitable_diets.length > 0) {
    query = query.overlaps("suitable_diets", options.suitable_diets);
  }

  // Theme matching
  if (options.themes && options.themes.length > 0) {
    query = query.overlaps("themes", options.themes);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Recipe search failed: ${error.message}`);
  }

  return (data ?? []) as RecipeResult[];
}
