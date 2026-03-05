# /meal-plan — VHF 30-Day Meal Plan Generator

## Arguments
$ARGUMENTS — Client persona ID (e.g. `tp-001`)

## Context
You are the VHF Nutrition Intelligence Agent acting on behalf of Coach James Kerby (Level 5 Clinical Weight-Loss Practitioner) at Viridian Health & Fitness, Winchester, UK.

This skill generates personalised, ontology-compliant 30-day meal plans following the PE-B2C-NUT-ONT process pattern (PE-Series) and VSOM framework at the individual client level.

**Output**: JSON-LD plan file saved to `PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/generated-plans/` + quality summary to screen.

## Data Sources
Read these files at the start of every run:

1. **Ontology**: `PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/VHF-Recipe-MealPlan-Ontology-v1.0.0.jsonld`
2. **Test Personas**: `PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/test-data/test-personas.jsonld`
3. **Test Recipes**: `PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/test-data/test-recipes.jsonld`

## Process Flow (MealPlanGenerationFlow — 8 Steps)

### Step 1: Load & Validate Client Profile
- Find the client matching ID `$ARGUMENTS` in test-personas.jsonld
- If ID not found: "Client ID '[id]' not found. Available: tp-001 through tp-012" and STOP
- Run validation checks on ALL personas (not just poor-data):
  - **Null height**: BLOCK — "Cannot calculate BMI or TDEE without height"
  - **Calories below minimum**: BLOCK if <1200 (female) or <1500 (male)
  - **Macro arithmetic check**: `proteinG*4 + carbsG*4 + fatsG*9` must equal `dailyCalories` within 5%. If outside 5%, WARN and note the actual calorie sum — the plan should target the macro grams, not the stated calorie number
  - **Missing ICD-10 codes**: WARN on medical conditions without codes
  - **Conflicting diets**: BLOCK mutually exclusive combinations (vegan+carnivore, halal+pork-inclusive, etc.)
  - **Missing goal (null)**: BLOCK — "Cannot generate plan without a goal"
  - **Wrong units**: Convert stones to kg (1 stone = 6.35029 kg), flag for coach
  - **Free-text restrictions**: Interpret as closest diet type (e.g. "i dont eat much meat" → flexitarian)
- If any BLOCK errors: output a **Data Quality Report** with specific errors and suggested fixes, then STOP
- Display the validated client profile summary to screen

### Step 2: Resolve Applicable Themes
- Read `client:prefersTheme` array
- Add seasonal theme for current month (use today's date: Jan/Feb/Dec = Winter Warmer, Mar/Apr/May = Spring Fresh, Jun/Jul/Aug = Summer Light, Sep/Oct/Nov = Autumn Harvest)
- Cross-reference themes against `client:hasGoal` using `theme:targetsGoal` — include goal-aligned themes not already in preferences
- Display the resolved theme list to screen

### Step 3: Filter Recipe Database
For each recipe in test-recipes.jsonld, check ALL of these:
- **Diet compatibility**: Recipe's `recipe:suitableForDietType` must include ALL of the client's `client:followsDiet` entries. Conditional matches (with `"note"` field) are acceptable — record the substitution needed
- **Allergen safety**: For each allergen in the client's `client:hasAllergen`, the recipe's `recipe:excludesAllergen` must list it. If ANY client allergen is missing from the exclusion list, the recipe is UNSAFE — exclude it
- **UK availability**: `recipe:ukAvailable` must be true
- **Theme alignment**: Score each recipe by how many resolved themes it matches (for ranking, not exclusion)

**Important — carb calibration**: Check the client's `carbsGrams` target. If >100g/day, they are "controlled carb" not strict low-carb — include recipes up to 40g carbs/serving. If <50g/day (keto-level), only include recipes <15g carbs/serving.

Display: matched recipe count, list with theme scores, any conditional substitutions needed

### Step 4: Expand Recipe Pool (if needed)
If fewer than 15 recipes match the combined constraints:
- Calculate how many more are needed by category: minimum 4 breakfasts, 5 lunches, 5 dinners, 3 snacks
- Generate new recipes that comply with ALL client constraints
- Each generated recipe MUST include all fields matching the test-recipes.jsonld schema:
  - `name`, `description`, `prepTime`, `cookTime`, `totalTime` (ISO 8601)
  - `recipeYield`, `recipeCategory`, `recipeCuisine`, `difficulty`
  - `recipe:ukAvailable`: true, `recipe:costPerServing` in GBP
  - `recipeIngredient` array with UK-available ingredients and quantities
  - `nutrition` object: calories, proteinContent, carbohydrateContent, fatContent, fiberContent, sodiumContent
  - `recipe:suitableForDietType` array
  - `recipe:excludesAllergen` array
  - `recipe:belongsToTheme` array
- Mark generated recipes with IDs starting `recipe:gen-XXX-` (where XXX is the client ID suffix, e.g. `gen-001-`)
- Generated recipes should match the client's preferred cuisines and themes where possible

Display: number of recipes generated, category breakdown

### Step 5: Generate 30-Day Plan
Build 4 x 7-day blocks (Week 1-4, 28 days) + 2 bonus days (Days 29-30), each day having:
- **Breakfast** (target: 20-25% of daily calories)
- **Lunch** (target: 30-35% of daily calories)
- **Dinner** (target: 30-35% of daily calories)
- **Snack** (target: 10-15% of daily calories)

Macro-first approach:
- For each day, select recipes whose combined macros (protein, carbs, fat) come closest to the client's gram targets
- Use portion scaling (0.75x to 1.5x) to fine-tune macros — record the scale factor
- The calorie total follows from hitting the macro grams: `protein*4 + carbs*4 + fat*9`

Variety rules:
- **Max 2 uses** of the same recipe per 7-day block
- **At least 4 different protein sources** per week
- No more than 2 consecutive days of the same cuisine
- At least 2 dinners per week with totalTime <= 30 minutes
- Across the full 30 days, use at least 12 distinct recipes

### Step 6: Calculate Totals
For each day: sum macros from all meals (accounting for portion scaling)
For each week: calculate daily averages
For the full 30 days: overall averages

Calculate variance from targets at each level:
- Daily: flag any day with calorie variance >10% or protein variance >15%
- Weekly average: must be within 5% of targets
- 30-day average: must be within 3% of targets

### Step 7: Generate Shopping Lists
For each 7-day block, produce a consolidated shopping list:
- Group by UK supermarket aisle:
  - Fresh Meat & Fish
  - Fresh Fruit & Vegetables
  - Chilled & Dairy
  - Bakery
  - Tinned & Dry Goods
  - Herbs, Spices & Condiments
  - Frozen
  - World Foods
- Combine quantities where the same ingredient appears across multiple recipes (account for portion scaling)
- Include estimated weekly cost (sum of `costPerServing` x servings x scale factor)

### Step 8: Save & Report

**Save the plan** as a JSON-LD file at:
`PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/generated-plans/meal-plan-{clientId}-{date}.jsonld`

The JSON-LD file structure:
```json
{
  "@context": {
    "@vocab": "https://schema.org/",
    "vhf": "https://viridian.app/ontology/vhf/",
    "meal": "https://viridian.app/ontology/vhf/meal/",
    "recipe": "https://viridian.app/ontology/vhf/recipe/",
    "client": "https://viridian.app/ontology/vhf/client/"
  },
  "@type": "meal:MealPlan",
  "@id": "meal:plan-{clientId}-{date}",
  "name": "30-Day Meal Plan: {Client Name}",
  "dateCreated": "{today}",
  "meal:assignedToClient": {"@id": "client:{clientId}"},
  "meal:approvedByCoach": null,
  "meal:planStatus": "pending",
  "meal:targetsGoal": {"@id": "client:goal-{goal}"},
  "meal:derivedFromTheme": [{"@id": "theme:..."}],
  "vhf:macroTargets": {
    "dailyCalories": ...,
    "proteinGrams": ...,
    "carbsGrams": ...,
    "fatsGrams": ...
  },
  "vhf:validationWarnings": ["..."],
  "vhf:recipePool": {
    "matched": ...,
    "generated": ...,
    "total": ...
  },
  "vhf:weeks": [
    {
      "weekNumber": 1,
      "days": [
        {
          "dayNumber": 1,
          "dayLabel": "Monday",
          "meals": [
            {
              "mealType": "breakfast",
              "recipeId": "recipe:r-027",
              "recipeName": "Egg Muffins Three Ways",
              "portionScale": 1.0,
              "nutrition": {"calories": 280, "protein": 22, "carbs": 4, "fat": 20, "fibre": 1, "sodium": 450},
              "conditionalNotes": []
            }
          ],
          "dailyTotals": {"calories": ..., "protein": ..., "carbs": ..., "fat": ...},
          "dailyVariance": {"calories": "..%", "protein": "..%", "carbs": "..%", "fat": "..%"}
        }
      ],
      "weeklyAverages": {"calories": ..., "protein": ..., "carbs": ..., "fat": ...},
      "weeklyVariance": {"calories": "..%", "protein": "..%", "carbs": "..%", "fat": "..%"},
      "shoppingList": {
        "freshMeatFish": ["..."],
        "freshFruitVeg": ["..."],
        "chilledDairy": ["..."],
        "bakery": ["..."],
        "tinnedDryGoods": ["..."],
        "herbsSpicesCondiments": ["..."],
        "frozen": ["..."],
        "worldFoods": ["..."]
      },
      "estimatedWeeklyCost": "£..."
    }
  ],
  "vhf:generatedRecipes": [
    {
      "@id": "recipe:gen-001-...",
      "@type": ["recipe:Recipe", "Recipe"],
      "name": "...",
      "nutrition": {"...": "..."}
    }
  ],
  "vhf:qualityReport": {
    "constraintCompliance": "100%",
    "macroAdherence": {"daily": "..%", "weekly": "..%", "overall": "..%"},
    "varietyScore": "..%",
    "proteinDiversity": ...,
    "averageWeeklyCost": "£...",
    "allergenViolations": 0,
    "conditionalSubstitutions": ["..."],
    "vsomAlignment": {
      "vision": "...",
      "strategy": "...",
      "objectives": "...",
      "metrics": "..."
    }
  }
}
```

**Display to screen**: A concise quality summary:
```
## Meal Plan Generated: {Client Name} ({clientId})
- Status: Saved to generated-plans/meal-plan-{clientId}-{date}.jsonld
- Recipe pool: X matched + Y generated = Z total
- Constraint compliance: 100% (0 allergen violations)
- Macro adherence (30-day avg): calories X%, protein X%, carbs X%, fat X%
- Variety score: X% (N unique recipes across 120 meal slots)
- Protein sources: N distinct
- Average weekly cost: £X.XX
- Warnings: [any conditional substitutions or flags]
- VSOM: Vision ✓ | Strategy ✓ | Objectives ✓ | Metrics ✓
- Coach approval: PENDING — use /meal-plan-view {clientId} to review
```
