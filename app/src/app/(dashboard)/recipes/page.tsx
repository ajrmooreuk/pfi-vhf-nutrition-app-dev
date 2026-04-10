import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function RecipesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: recipes, error } = await supabase
    .from("vhf_recipes")
    .select("*")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Recipes</h2>
          <p className="mt-1 text-muted-foreground">
            Browse and manage your recipe library.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load recipes: {error.message}
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              No recipes yet. Create your first recipe to build your library.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Record<string, unknown> }) {
  const totalTime =
    ((recipe.prep_time_mins as number) ?? 0) + ((recipe.cook_time_mins as number) ?? 0);
  const servings = recipe.servings as number;
  const themes = recipe.themes as string[] | null;

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h3 className="font-bold text-card-foreground">{recipe.name as string}</h3>
      {typeof recipe.description === "string" && (
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {recipe.description}
        </p>
      )}

      {/* Nutrition badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        {recipe.calories != null && (
          <NutritionBadge label="kcal" value={recipe.calories as number} />
        )}
        {recipe.protein_g != null && (
          <NutritionBadge label="protein" value={recipe.protein_g as number} unit="g" />
        )}
        {recipe.carbs_g != null && (
          <NutritionBadge label="carbs" value={recipe.carbs_g as number} unit="g" />
        )}
        {recipe.fat_g != null && (
          <NutritionBadge label="fat" value={recipe.fat_g as number} unit="g" />
        )}
      </div>

      {/* Meta */}
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        {totalTime > 0 && <span>{totalTime} min</span>}
        {servings && <span>{servings} serving{servings !== 1 ? "s" : ""}</span>}
        {typeof recipe.cuisine === "string" && <span>{recipe.cuisine}</span>}
      </div>

      {/* Themes */}
      {themes && themes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {themes.map((theme) => (
            <span
              key={theme}
              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {theme}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function NutritionBadge({
  label,
  value,
  unit = "",
}: {
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
      {value}
      {unit} {label}
    </span>
  );
}
