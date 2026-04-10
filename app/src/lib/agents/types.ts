export interface ClientProfile {
  id: string;
  given_name: string;
  family_name: string;
  gender: string | null;
  birth_date: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: string | null;
  medical_conditions:
    | { name: string; icd10?: string; status: string }[]
    | null;
  goal: string | null;
  daily_calories: number | null;
  protein_grams: number | null;
  carbs_grams: number | null;
  fats_grams: number | null;
  diets: string[];
  dietary_restrictions: string[];
  allergens: string[];
  preferred_themes: string[];
}

export interface RecipeResult {
  id: string;
  name: string;
  category: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  prep_time_mins: number | null;
  cook_time_mins: number | null;
  servings: number | null;
  ingredients: string[];
  suitable_diets: string[];
  excluded_allergens: string[];
  themes: string[];
  cost_per_serving_gbp: number | null;
}

export interface MealEntry {
  recipe_id: string;
  recipe_name: string;
  servings: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface DailyMeals {
  day: number;
  date: string;
  meals: {
    breakfast: MealEntry;
    snack_am: MealEntry | null;
    lunch: MealEntry;
    snack_pm: MealEntry | null;
    dinner: MealEntry;
  };
  daily_totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface ShoppingItem {
  item: string;
  quantity: number;
  unit: string;
  aisle_category: string;
}

export interface MealPlan {
  client_id: string;
  duration_days: number;
  start_date: string;
  daily_targets: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  days: DailyMeals[];
  shopping_list: ShoppingItem[];
  notes: string;
}

export interface MacroResult {
  daily_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  tdee: number;
  bmr: number;
}
