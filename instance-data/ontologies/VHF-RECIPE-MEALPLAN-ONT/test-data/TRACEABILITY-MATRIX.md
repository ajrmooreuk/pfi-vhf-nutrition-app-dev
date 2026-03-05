# Test Data Traceability Matrix

## VHF Recipe & Meal Plan Ontology — Test Use Case Analysis

**Date:** 2026-02-10
**Version:** 1.0.0
**Recipes:** 30 | **Personas:** 12 (9 good, 3 poor data) | **Diet Types:** 30 | **Themes:** 16

---

## 1. Persona-to-Diet Type Mapping

| ID | Persona | Data Quality | Diet Types | Allergens | Goal | Constraint Complexity |
|----|---------|-------------|------------|-----------|------|-----------------------|
| TP-001 | Sarah Mitchell | GOOD | Diabetic, Low Carb | Nuts, Peanuts | Weight Loss | Medium — medical + macro |
| TP-002 | Raj Patel | GOOD | Hindu Vegetarian, High Protein | None | Muscle Gain | Medium — religious + macro |
| TP-003 | Fatima Al-Rashid | GOOD | Halal, Anti-Inflammatory | Sesame | Weight Loss | High — religious + medical + allergen |
| TP-004 | Tom Jeffries | GOOD | Mediterranean, Low Sodium, Anti-Inflammatory | None | Maintenance | Medium — lifestyle + medical |
| TP-005 | Emma Chen | GOOD | Vegan, High Protein | Soya, Nuts, Peanuts | Sports Performance | Very High — ethical + allergens + performance |
| TP-006 | David Goldstein | GOOD | Kosher, Low-FODMAP | Crustaceans, Molluscs | Weight Loss | Very High — religious law + medical |
| TP-007 | Karen Whitfield | GOOD | Keto | Eggs, Milk | Weight Loss | High — strict keto + dairy/egg-free |
| TP-008 | Marcus Williams | POOR | Carnivore | None declared | Weight Loss | INVALID — missing height, impossible macros |
| TP-009 | Priya Sharma | GOOD | Jain, High Protein | None | Muscle Gain | Very High — strictest religious + narrow pool |
| TP-010 | Jake Thompson | POOR | Vegan + Carnivore + Keto | Milk | Maintenance | INVALID — mutually exclusive diets |
| TP-011 | Linda Okafor | GOOD | Gluten-Free, Renal, Pescatarian | Cereals | Medical Mgmt | Very High — triple medical constraint |
| TP-012 | Ben Fraser | POOR | None | None | None | INVALID — incomplete profile, wrong units |

---

## 2. Recipe-to-Diet Compatibility Matrix

| Recipe | Veg | Vgn | Pesc | Halal | Kosher | Hindu | Jain | Keto | LCarb | HProt | LFat | MedDiet | Diab | FODMAP | AntiInfl | Renal | GF | DF | EF |
|--------|-----|-----|------|-------|--------|-------|------|------|-------|-------|------|---------|------|--------|----------|-------|----|----|-----|
| R-001 Grilled Chicken Med Veg | - | - | - | * | * | - | - | - | Y | Y | - | Y | - | * | - | - | Y | Y | Y |
| R-002 Paneer Tikka | Y | - | - | Y | - | Y | - | - | - | Y | - | - | - | - | - | - | - | - | Y |
| R-003 Salmon Sweet Potato | - | - | Y | - | - | - | - | - | - | Y | - | Y | - | - | Y | - | Y | Y | Y |
| R-004 Keto Bacon Avocado Egg | - | - | - | - | - | - | - | Y | Y | - | - | - | - | - | - | - | Y | Y | - |
| R-005 Chickpea Spinach Curry | Y | Y | Y | Y | Y | Y | - | - | - | - | - | Y | - | - | Y | - | Y | Y | Y |
| R-006 Turkey Lettuce Wraps | - | - | - | * | - | - | - | - | Y | Y | - | - | - | - | - | - | Y | Y | Y |
| R-007 Protein Oats Berries | Y | - | - | - | - | - | - | - | - | Y | - | - | - | - | - | - | - | - | Y |
| R-008 Lamb Kofta Tabbouleh | - | - | - | * | - | - | - | - | - | Y | - | Y | - | - | - | - | - | Y | Y |
| R-009 Cottage Pie Cauli Mash | - | - | - | * | - | - | - | - | Y | Y | - | - | - | - | - | - | * | - | Y |
| R-010 Lentil Aubergine Bowl | Y | Y | Y | Y | Y | Y | - | - | - | - | - | Y | - | - | Y | - | Y | Y | Y |
| R-011 Scrambled Tofu Sourdough | Y | Y | Y | Y | Y | - | - | - | - | - | - | - | - | - | - | - | - | Y | Y |
| R-012 Beef Stir-Fry Rice Noodles | - | - | - | * | - | - | - | - | - | Y | - | - | - | - | - | - | Y | Y | Y |
| R-013 Greek Yoghurt Parfait | Y | - | - | - | - | - | - | - | - | Y | - | - | - | - | - | - | - | - | Y |
| R-014 Slow-Cooker Chicken Bean | - | - | - | * | - | - | - | - | - | Y | - | - | - | - | Y | - | Y | Y | Y |
| R-015 Jain Dal Tadka | Y | - | - | Y | - | Y | Y | - | - | - | - | - | - | - | - | - | Y | - | Y |
| R-016 Smoked Mackerel Salad | - | - | Y | - | - | - | - | - | Y | - | - | - | - | Y | Y | - | Y | Y | Y |
| R-017 Seitan Stir-Fry | - | Y | - | - | - | - | - | - | - | Y | - | - | - | - | - | - | - | Y | Y |
| R-018 Coconut Pancakes Keto | - | Y | - | - | - | - | - | Y | - | - | - | - | - | - | - | - | Y | Y | Y |
| R-019 Tuna Niçoise | - | - | Y | - | - | - | - | - | - | Y | - | Y | - | Y | Y | - | Y | Y | - |
| R-020 Chicken Shawarma Bowl | - | - | - | * | - | - | - | - | - | Y | - | - | - | - | - | - | - | Y | Y |
| R-021 Venison Sausage Casserole | - | - | - | - | - | - | - | - | - | Y | - | - | - | - | - | - | * | Y | Y |
| R-022 Prawn Courgette Noodles | - | - | Y | - | - | - | - | Y | Y | Y | - | - | - | - | - | - | Y | Y | Y |
| R-023 Quinoa Power Bowl | Y | Y | Y | Y | Y | Y | - | - | - | - | - | Y | - | - | Y | - | Y | Y | Y |
| R-024 Baked Cod Lemon Caper | - | - | Y | - | Y | - | - | Y | Y | Y | - | Y | - | Y | Y | - | Y | - | Y |
| R-025 Steak Egg Keto Plate | - | - | - | - | - | - | - | Y | Y | Y | - | - | - | - | - | - | Y | - | - |
| R-026 Butternut Squash Risotto | Y | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | Y | - | Y |
| R-027 Egg Muffins Three Ways | - | - | - | - | - | - | - | Y | Y | Y | - | - | - | - | - | - | Y | - | - |
| R-028 Thai Green Curry Tofu | Y | Y | Y | Y | - | - | - | - | - | - | - | - | - | - | - | - | Y | Y | Y |
| R-029 Halloumi Veg Wrap | Y | - | - | * | - | - | - | - | - | - | - | - | - | - | - | - | - | - | Y |
| R-030 Banana Oat Energy Balls | Y | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | Y |

**Key:** Y = Suitable, * = Conditional (requires certified ingredient/substitution), - = Not suitable

---

## 3. Persona-to-Recipe Match Count

This table shows how many of the 30 recipes each persona can consume based on their combined constraints (diet + allergens + medical).

| Persona | Diet Constraints | Allergen Filter | Matching Recipes | Coverage % | 30-Day Feasibility |
|---------|-----------------|-----------------|------------------|------------|-------------------|
| **TP-001** Sarah (Diabetic, Low Carb, Nut-Free) | Low carb + low GI | Nuts, Peanuts | R-001, R-003, R-004, R-006, R-009, R-012, R-016, R-022, R-024, R-025, R-027 | **11/30 (37%)** | YES — 11 recipes, good variety |
| **TP-002** Raj (Hindu Veg, High Protein) | Lacto-veg, no eggs | None | R-002, R-005, R-010, R-015, R-023, R-026 | **6/30 (20%)** | MARGINAL — needs recipe expansion |
| **TP-003** Fatima (Halal, Anti-Inflam, Sesame-Free) | Halal meat, anti-inflam | Sesame | R-001*, R-003, R-005, R-006*, R-008*, R-009*, R-010, R-011, R-014*, R-020*, R-023, R-028 | **12/30 (40%)** | YES — 12 recipes with substitutions |
| **TP-004** Tom (Med, Low Sodium, Anti-Inflam) | Med diet, <2000mg Na | None | R-001, R-003, R-005, R-010, R-015, R-016, R-019, R-023, R-024, R-026 | **10/30 (33%)** | YES — 10 recipes, some need Na reduction |
| **TP-005** Emma (Vegan, HProt, Soya/Nut-Free) | Vegan, no soya/nuts | Soya, Nuts, Peanuts | R-005, R-010, R-017, R-018, R-023 | **5/30 (17%)** | CRITICAL — needs 10+ more vegan nut/soya-free recipes |
| **TP-006** David (Kosher, Low-FODMAP) | Kosher law, FODMAP | Crustaceans, Molluscs | R-016, R-024 | **2/30 (7%)** | FAIL — only 2 recipes match. Needs 15+ kosher low-FODMAP recipes |
| **TP-007** Karen (Keto, Egg/Dairy-Free) | <20g carbs, no egg/dairy | Eggs, Milk | R-018, R-022, R-025(no egg) | **3/30 (10%)** | FAIL — keto without dairy/eggs is very narrow. Needs expansion |
| **TP-008** Marcus (POOR DATA) | Carnivore + invalid macros | None | N/A — data validation fails | **N/A** | BLOCKED — system should reject/flag |
| **TP-009** Priya (Jain, High Protein) | No root veg/onion/garlic | None | R-015 | **1/30 (3%)** | FAIL — only 1 Jain recipe. Needs 15+ Jain-compliant recipes |
| **TP-010** Jake (POOR DATA) | Conflicting diets | Milk | N/A — contradictory constraints | **N/A** | BLOCKED — system should reject/flag |
| **TP-011** Linda (GF, Renal, Pescatarian) | GF + low Na/K/P + fish | Cereals | R-003, R-016, R-019, R-022, R-024 | **5/30 (17%)** | MARGINAL — 5 recipes but need Na/K/P checks |
| **TP-012** Ben (POOR DATA) | None defined | None | All 30 (no constraints) | **30/30 (100%)** | BLOCKED — no goal, no macros, system can't generate plan |

---

## 4. Recipe Coverage by Diet Type

| Diet Type | Recipes Available | Recipe IDs | Sufficient for 30-Day? |
|-----------|-------------------|------------|----------------------|
| Vegetarian | 12 | R-002,005,007,010,011,013,015,023,026,028,029,030 | YES |
| Vegan | 8 | R-005,010,011,017,018,023,028 (+r-023 variants) | MARGINAL |
| Pescatarian | 8 | R-003,005,010,016,019,022,023,024 | MARGINAL |
| Halal (conditional) | 12 | R-001*,005,006*,008*,009*,010,011,014*,015,020*,023,028 | YES |
| Kosher | 6 | R-005,010,011,015,023,024 | MARGINAL |
| Hindu Vegetarian | 6 | R-002,005,010,015,023,026 | MARGINAL |
| Jain | 1 | R-015 | FAIL |
| Keto | 6 | R-004,018,022,024,025,027 | MARGINAL |
| Low Carb | 9 | R-001,004,006,009,016,022,024,025,027 | YES |
| High Protein | 16 | R-001-003,006-008,012-014,017,019-022,024,025,027 | YES |
| Mediterranean | 8 | R-001,003,005,008,010,019,023,024 | MARGINAL |
| Anti-Inflammatory | 7 | R-003,005,010,014,016,019,023 | MARGINAL |
| Low-FODMAP | 3 | R-016,019,024 | FAIL |
| Gluten-Free | 18 | R-001,003-006,010,012,014-016,018,019,021-026 | YES |
| Dairy-Free | 14 | R-001,003,005,006,008,010-012,014,017,018,021-023 | YES |
| Renal | 0 (need Na/K/P <threshold) | Requires nutrient filtering | FAIL |

---

## 5. Gap Analysis — Recipes Needed for Full 30-Day Coverage

To support a 30-day meal plan with 3 meals + 1 snack per day (120 meal slots) with max 2 repetitions per recipe per week:

**Minimum recipe pool per constraint set: ~15 unique recipes (3 breakfast, 5 lunch, 5 dinner, 2 snack)**

| Gap | Diet/Constraint | Current | Needed | Priority |
|-----|----------------|---------|--------|----------|
| GAP-01 | Jain-compliant | 1 | +14 | P0 — CRITICAL |
| GAP-02 | Kosher + Low-FODMAP intersection | 2 | +13 | P0 — CRITICAL |
| GAP-03 | Keto + Egg-Free + Dairy-Free | 3 | +12 | P1 — HIGH |
| GAP-04 | Vegan + Nut-Free + Soya-Free | 5 | +10 | P1 — HIGH |
| GAP-05 | Low-FODMAP (general) | 3 | +12 | P1 — HIGH |
| GAP-06 | Renal-safe (low Na/K/P) | 0 | +15 | P0 — CRITICAL |
| GAP-07 | Vegan breakfasts | 2 | +3 | P2 — MEDIUM |
| GAP-08 | Kosher general | 6 | +9 | P2 — MEDIUM |
| GAP-09 | Hindu Vegetarian | 6 | +9 | P2 — MEDIUM |
| GAP-10 | Snack recipes (all diets) | 1 | +8 | P2 — MEDIUM |

---

## 6. Security Test Matrix

| Test Case | Actor | Action | Target | Expected Result |
|-----------|-------|--------|--------|----------------|
| SEC-01 | Client Sarah (TP-001) | SELECT clients | All clients | Only sees own record |
| SEC-02 | Client Sarah (TP-001) | SELECT meal_plans | All plans | Only sees own plans |
| SEC-03 | Client Sarah (TP-001) | SELECT clients WHERE id = TP-002 | Raj's record | Empty result (blocked by RLS) |
| SEC-04 | Coach James | SELECT clients | All clients | Sees all 12 assigned clients |
| SEC-05 | Coach James | UPDATE clients SET profile = '...' | Any client | DENIED (coach read-only until RRR) |
| SEC-06 | Coach James | INSERT meal_plans | For assigned client | ALLOWED |
| SEC-07 | Coach James | SELECT meal_plans | All plans | Sees plans for assigned clients only |
| SEC-08 | Client Raj (TP-002) | SELECT meal_plans WHERE client_id = TP-001 | Sarah's plans | Empty result (blocked by RLS) |
| SEC-09 | Different tenant user | SELECT clients | Any VHF client | Empty result (tenant isolation) |
| SEC-10 | Service role | SELECT clients | All | Full access (bypass RLS) |
| SEC-11 | Client Sarah | INSERT progress_logs | Own record | ALLOWED |
| SEC-12 | Client Sarah | SELECT progress_logs WHERE client_id = TP-002 | Raj's logs | Empty result |
| SEC-13 | Admin | SELECT audit_log | All | Sees all tenant audit entries |
| SEC-14 | Client | SELECT audit_log | All | Empty result (admin only) |

---

## 7. Data Quality Validation Test Cases

| Test Case | Persona | Error Type | Expected AI Behaviour |
|-----------|---------|-----------|----------------------|
| DQ-01 | TP-008 Marcus | Missing height (null) | Flag: "Cannot calculate BMI or TDEE without height" |
| DQ-02 | TP-008 Marcus | 800kcal daily target | Flag: "Below 1500kcal minimum for males. Risk of malnutrition." |
| DQ-03 | TP-008 Marcus | Protein 200g at 800kcal | Flag: "Protein alone = 800kcal. Exceeds total calorie budget." |
| DQ-04 | TP-008 Marcus | No ICD code on condition | Warn: "Medical condition 'asthma' has no ICD-10 code. Cannot verify." |
| DQ-05 | TP-008 Marcus | Allergen/diet mismatch | Warn: "Dietary restriction 'nut-free' but no allergen declared." |
| DQ-06 | TP-010 Jake | Vegan + Carnivore | Reject: "Mutually exclusive diet types. Cannot generate plan." |
| DQ-07 | TP-010 Jake | Dairy allergen + Keto | Warn: "Keto typically relies on dairy. Milk allergen severely limits options." |
| DQ-08 | TP-012 Ben | Weight in stones | Flag: "Weight unit STN (stones). Convert to KGM: 13 STN = 82.55 kg." |
| DQ-09 | TP-012 Ben | No goal selected | Block: "Cannot generate meal plan without a goal. Prompt client to select." |
| DQ-10 | TP-012 Ben | Free-text restriction | Parse: "Interpret 'i dont eat much meat' as flexitarian preference." |
| DQ-11 | TP-012 Ben | Null activity level | Default: "Assume sedentary (1.2x multiplier) and flag for coach review." |
| DQ-12 | All good personas | Macro calorie check | Verify: proteinG*4 + carbsG*4 + fatsG*9 within 5% of dailyCalories |

---

## 8. AI Meal Plan Generation Test Scenarios

| Scenario | Persona | Expected Outcome | Metrics |
|----------|---------|-----------------|---------|
| PLAN-01 | TP-001 Sarah | 7-day diabetic low-carb plan, nut-free | All meals <25g carbs, 0 nut recipes, ~1650kcal/day avg |
| PLAN-02 | TP-002 Raj | 7-day Hindu vegetarian high-protein | All meals lacto-veg, no eggs, >168g protein/day |
| PLAN-03 | TP-003 Fatima | 7-day halal anti-inflammatory | All meat halal-certified, anti-inflam ingredients, sesame-free |
| PLAN-04 | TP-004 Tom | 7-day Mediterranean low-sodium | All meals <500mg Na, omega-3 rich, no processed food |
| PLAN-05 | TP-005 Emma | 7-day vegan high-protein, no soya/nuts | >130g plant protein/day, soya-free, nut-free — HARDEST |
| PLAN-06 | TP-006 David | 7-day kosher low-FODMAP | No meat-dairy mixing, FODMAP safe — VERY FEW OPTIONS |
| PLAN-07 | TP-009 Priya | 7-day Jain high-protein | No root veg, no alliums, no eggs — EXTREMELY LIMITED |
| PLAN-08 | TP-011 Linda | 7-day GF renal pescatarian | GF, low Na/K/P, fish-based protein |
| PLAN-09 | TP-008 Marcus | Attempt generation | SHOULD FAIL with data quality errors |
| PLAN-10 | TP-010 Jake | Attempt generation | SHOULD FAIL with constraint conflict errors |
| PLAN-11 | TP-012 Ben | Attempt generation | SHOULD FAIL with incomplete profile errors |

---

## 9. Summary Statistics

| Metric | Value |
|--------|-------|
| Total test personas | 12 |
| Good data personas | 9 |
| Poor data personas (validation testing) | 3 |
| Unique diet types exercised | 18 of 30 |
| Unique allergens exercised | 9 of 14 |
| Unique goals exercised | 5 of 5 |
| Unique themes exercised | 14 of 16 |
| Total recipes | 30 |
| Recipe-diet pairings | 142 |
| Critical recipe gaps identified | 6 (Jain, Kosher+FODMAP, Keto+EF+DF, Vegan+NF+SF, FODMAP, Renal) |
| Security test cases | 14 |
| Data quality test cases | 12 |
| AI plan generation scenarios | 11 |
