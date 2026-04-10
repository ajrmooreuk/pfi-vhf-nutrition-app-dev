import { MacroResult } from "@/lib/agents/types";

type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extremely_active";

type Goal =
  | "weight_loss"
  | "muscle_gain"
  | "maintenance"
  | "sports_performance";

interface MacroCalculatorOptions {
  age: number;
  gender: "male" | "female";
  weight_kg: number;
  height_cm: number;
  activity_level: ActivityLevel;
  goal: Goal;
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

const GOAL_CALORIE_ADJUSTMENTS: Record<Goal, number> = {
  weight_loss: -500,
  muscle_gain: 300,
  maintenance: 0,
  sports_performance: 0,
};

const PROTEIN_PER_KG: Record<Goal, number> = {
  weight_loss: 2.0,
  muscle_gain: 2.0,
  maintenance: 1.6,
  sports_performance: 2.2,
};

/**
 * Mifflin-St Jeor equation for BMR, then TDEE and macro split.
 */
export function calculateMacros(options: MacroCalculatorOptions): MacroResult {
  const { age, gender, weight_kg, height_cm, activity_level, goal } = options;

  // Mifflin-St Jeor BMR
  let bmr: number;
  if (gender === "male") {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }

  const tdee = bmr * ACTIVITY_MULTIPLIERS[activity_level];
  const daily_calories = Math.round(
    tdee + GOAL_CALORIE_ADJUSTMENTS[goal]
  );

  // Protein: goal-specific g/kg
  const protein_grams = Math.round(PROTEIN_PER_KG[goal] * weight_kg);
  const protein_calories = protein_grams * 4;

  // Fat: 25% of total calories
  const fat_calories = daily_calories * 0.25;
  const fats_grams = Math.round(fat_calories / 9);

  // Carbs: remainder
  const carb_calories = daily_calories - protein_calories - fat_calories;
  const carbs_grams = Math.round(Math.max(0, carb_calories / 4));

  return {
    daily_calories,
    protein_grams,
    carbs_grams,
    fats_grams,
    tdee: Math.round(tdee),
    bmr: Math.round(bmr),
  };
}
