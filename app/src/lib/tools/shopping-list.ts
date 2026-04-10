import { RecipeResult, ShoppingItem } from "@/lib/agents/types";

/**
 * Heuristic aisle classification based on common ingredient keywords.
 */
function classifyAisle(ingredient: string): string {
  const lower = ingredient.toLowerCase();

  const proteinKeywords = [
    "chicken", "beef", "pork", "lamb", "turkey", "salmon", "cod", "tuna",
    "prawns", "shrimp", "tofu", "tempeh", "mince", "steak", "fillet",
    "breast", "thigh", "sausage", "bacon", "ham", "egg",
  ];
  if (proteinKeywords.some((k) => lower.includes(k))) return "Protein";

  const dairyKeywords = [
    "milk", "cheese", "yogurt", "yoghurt", "cream", "butter", "cheddar",
    "mozzarella", "parmesan", "ricotta", "quark", "skyr", "whey",
  ];
  if (dairyKeywords.some((k) => lower.includes(k))) return "Dairy";

  const produceKeywords = [
    "lettuce", "spinach", "kale", "tomato", "onion", "garlic", "pepper",
    "carrot", "broccoli", "cauliflower", "courgette", "zucchini",
    "aubergine", "mushroom", "avocado", "cucumber", "celery", "leek",
    "sweet potato", "potato", "banana", "apple", "berry", "berries",
    "lemon", "lime", "orange", "mango", "pear", "ginger", "chilli",
    "herbs", "basil", "coriander", "parsley", "mint", "rocket",
  ];
  if (produceKeywords.some((k) => lower.includes(k))) return "Produce";

  const grainKeywords = [
    "rice", "pasta", "bread", "oats", "quinoa", "couscous", "noodle",
    "flour", "tortilla", "wrap", "pitta", "bagel", "cereal", "granola",
    "bulgur", "barley",
  ];
  if (grainKeywords.some((k) => lower.includes(k))) return "Grains";

  const pantryKeywords = [
    "oil", "vinegar", "salt", "pepper", "sugar", "honey", "maple",
    "soy sauce", "stock", "broth", "tomato paste", "passata", "coconut",
    "spice", "cumin", "paprika", "turmeric", "cinnamon", "nutmeg",
    "oregano", "thyme", "bay", "chili flakes", "sriracha", "mustard",
    "ketchup", "mayo", "peanut butter", "almond butter", "jam",
    "baked beans", "chickpeas", "lentils", "beans", "tinned", "canned",
    "nuts", "seeds", "dried", "chia", "flax",
  ];
  if (pantryKeywords.some((k) => lower.includes(k))) return "Pantry";

  return "Other";
}

/**
 * Parse a simple ingredient string into item/quantity/unit.
 * Handles formats like "200g chicken breast" or "2 tbsp olive oil".
 */
function parseIngredient(raw: string): {
  item: string;
  quantity: number;
  unit: string;
} {
  const match = raw.match(
    /^(\d+(?:\.\d+)?)\s*(g|kg|ml|l|tbsp|tsp|cups?|pieces?|slices?|cloves?|bunch|handful|pinch)?\s*(.+)$/i
  );
  if (match) {
    return {
      quantity: parseFloat(match[1]),
      unit: (match[2] ?? "unit").toLowerCase(),
      item: match[3].trim(),
    };
  }
  return { quantity: 1, unit: "unit", item: raw.trim() };
}

/**
 * Aggregate ingredients from selected recipes, grouped by aisle.
 * @param recipes - The recipes to aggregate.
 * @param servingsMap - Map of recipe ID to desired servings (defaults to recipe's own servings).
 */
export function generateShoppingList(
  recipes: RecipeResult[],
  servingsMap: Record<string, number> = {}
): ShoppingItem[] {
  const aggregated = new Map<
    string,
    { quantity: number; unit: string; aisle_category: string }
  >();

  for (const recipe of recipes) {
    const desiredServings = servingsMap[recipe.id] ?? recipe.servings ?? 1;
    const recipeServings = recipe.servings ?? 1;
    const multiplier = desiredServings / recipeServings;

    for (const rawIngredient of recipe.ingredients) {
      const parsed = parseIngredient(rawIngredient);
      const key = `${parsed.item.toLowerCase()}|${parsed.unit}`;
      const existing = aggregated.get(key);

      if (existing) {
        existing.quantity += parsed.quantity * multiplier;
      } else {
        aggregated.set(key, {
          quantity: parsed.quantity * multiplier,
          unit: parsed.unit,
          aisle_category: classifyAisle(parsed.item),
        });
      }
    }
  }

  const items: ShoppingItem[] = [];
  for (const [key, value] of Array.from(aggregated.entries())) {
    const item = key.split("|")[0];
    items.push({
      item,
      quantity: Math.round(value.quantity * 100) / 100,
      unit: value.unit,
      aisle_category: value.aisle_category,
    });
  }

  // Sort by aisle category then item name
  items.sort((a, b) => {
    const aisleOrder = [
      "Protein",
      "Dairy",
      "Produce",
      "Grains",
      "Pantry",
      "Other",
    ];
    const aIdx = aisleOrder.indexOf(a.aisle_category);
    const bIdx = aisleOrder.indexOf(b.aisle_category);
    if (aIdx !== bIdx) return aIdx - bIdx;
    return a.item.localeCompare(b.item);
  });

  return items;
}
