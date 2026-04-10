-- VHF Nutrition App — Seed Data
-- Source: test-personas.jsonld (13 records) + test-recipes.jsonld (30 records)
-- Generated from VHF-RECIPE-MEALPLAN-ONT test data
-- Uses deterministic UUIDs for reproducible seeding

BEGIN;

-- ============================================================
-- COACH: James Kerby
-- ============================================================

INSERT INTO vhf_coaches (id, auth_user_id, given_name, family_name, job_title, qualifications, specialisms, organisation_name, organisation_address)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  NULL,
  'James',
  'Kerby',
  'Personal Trainer Coach & Clinical Weight-Loss Practitioner',
  ARRAY['Level 5 Clinical Weight Loss Practitioner', 'Diploma in Sports Science', 'Nutrition and Weight Management Qualified'],
  ARRAY['weight-loss', 'strength-training', 'injury-rehabilitation', 'seniors', 'sports-performance'],
  'Viridian Health & Fitness',
  '{"streetAddress": "Woodhams Farm, Kings Worthy", "addressLocality": "Winchester", "addressRegion": "Hampshire", "addressCountry": "GB"}'::jsonb
);

-- ============================================================
-- CLIENTS (12 test personas)
-- ============================================================

-- tp-001: Sarah Mitchell — GOOD DATA
INSERT INTO vhf_clients (id, coach_id, external_id, given_name, family_name, gender, birth_date, data_quality,
  height_cm, weight_kg, activity_level, medical_conditions,
  goal, daily_calories, protein_grams, carbs_grams, fats_grams, macro_rationale,
  diets, dietary_restrictions, allergens, preferred_themes)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'tp-001', 'Sarah', 'Mitchell', 'Female', '1985-03-15', 'good',
  168, 82, 'moderately_active',
  '[{"name": "Type 2 Diabetes", "icd10": "E11", "status": "managed"}]'::jsonb,
  'weight_loss', 1650, 120, 140, 55,
  '500kcal deficit from TDEE 2150. High protein for satiety and muscle preservation. Carbs controlled for blood sugar.',
  ARRAY['diabetic', 'low-carb'],
  ARRAY['low-glycemic', 'controlled-carbs'],
  ARRAY['nuts', 'peanuts'],
  ARRAY['QuickWeeknight', 'HighProtein', 'DiabeticFriendly']
);

-- tp-002: Raj Patel — GOOD DATA
INSERT INTO vhf_clients (id, coach_id, external_id, given_name, family_name, gender, birth_date, data_quality,
  height_cm, weight_kg, activity_level, medical_conditions,
  goal, daily_calories, protein_grams, carbs_grams, fats_grams, macro_rationale,
  diets, dietary_restrictions, allergens, preferred_themes)
VALUES (
  '10000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'tp-002', 'Raj', 'Patel', 'Male', '1990-07-22', 'good',
  178, 72, 'very_active',
  '[]'::jsonb,
  'muscle_gain', 2800, 168, 350, 78,
  '300kcal surplus. 2.0g/kg protein via dairy, legumes, paneer. High carbs for training fuel.',
  ARRAY['hindu-vegetarian', 'high-protein'],
  ARRAY['lacto-vegetarian', 'no-eggs'],
  ARRAY[]::text[],
  ARRAY['HighProtein', 'AsianFusion', 'BatchCookSunday']
);

-- tp-003: Fatima Al-Rashid — GOOD DATA
INSERT INTO vhf_clients (id, coach_id, external_id, given_name, family_name, gender, birth_date, data_quality,
  height_cm, weight_kg, activity_level, medical_conditions,
  goal, daily_calories, protein_grams, carbs_grams, fats_grams, macro_rationale,
  diets, dietary_restrictions, allergens, preferred_themes)
VALUES (
  '10000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'tp-003', 'Fatima', 'Al-Rashid', 'Female', '1988-11-03', 'good',
  162, 78, 'lightly_active',
  '[{"name": "Polycystic Ovary Syndrome (PCOS)", "icd10": "E28.2", "status": "active"}]'::jsonb,
  'weight_loss', 1500, 112, 120, 58,
  'Moderate deficit. Anti-inflammatory ratio. Low refined carbs for insulin sensitivity.',
  ARRAY['halal', 'anti-inflammatory'],
  ARRAY['halal-certified-meat', 'no-pork', 'no-alcohol', 'low-refined-sugar'],
  ARRAY['sesame'],
  ARRAY['PCOSSupport', 'Mediterranean', 'BudgetFriendly']
);

-- tp-004: Tom Jeffries — GOOD DATA
INSERT INTO vhf_clients (id, coach_id, external_id, given_name, family_name, gender, birth_date, data_quality,
  height_cm, weight_kg, activity_level, medical_conditions,
  goal, daily_calories, protein_grams, carbs_grams, fats_grams, macro_rationale,
  diets, dietary_restrictions, allergens, preferred_themes)
VALUES (
  '10000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'tp-004', 'Tom', 'Jeffries', 'Male', '1972-01-19', 'good',
  180, 88, 'lightly_active',
  '[{"name": "Osteoarthritis (knee)", "icd10": "M17", "status": "post-operative"}, {"name": "Hypertension", "icd10": "I10", "status": "managed"}]'::jsonb,
  'maintenance', 2100, 105, 240, 75,
  'Maintenance TDEE. Moderate protein for recovery. Emphasis on calcium, vitamin D, omega-3.',
  ARRAY['mediterranean', 'low-sodium', 'anti-inflammatory'],
  ARRAY['low-sodium', 'anti-inflammatory'],
  ARRAY[]::text[],
  ARRAY['Mediterranean', 'AntiInflammatory', 'BritishComfort']
);

-- tp-005: Emma Chen — GOOD DATA
INSERT INTO vhf_clients (id, coach_id, external_id, given_name, family_name, gender, birth_date, data_quality,
  height_cm, weight_kg, activity_level, medical_conditions,
  goal, daily_calories, protein_grams, carbs_grams, fats_grams, macro_rationale,
  diets, dietary_restrictions, allergens, preferred_themes)
VALUES (
  '10000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  'tp-005', 'Emma', 'Chen', 'Female', '1995-06-30', 'good',
  170, 60, 'extremely_active',
  '[]'::jsonb,
  'sports_performance', 2600, 130, 390, 65,
  'High carb for endurance training. Plant protein 2.0g/kg via legumes, seeds, seitan. Low fat for performance.',
  ARRAY['vegan', 'high-protein'],
  ARRAY['vegan', 'no-animal-products'],
  ARRAY['soya', 'nuts', 'peanuts'],
  ARRAY['HighProtein', 'EnergyBoost', 'AsianFusion']
);

-- tp-006: David Goldstein — GOOD DATA
INSERT INTO vhf_clients (id, coach_id, external_id, given_name, family_name, gender, birth_date, data_quality,
  height_cm, weight_kg, activity_level, medical_conditions,
  goal, daily_calories, protein_grams, carbs_grams, fats_grams, macro_rationale,
  diets, dietary_restrictions, allergens, preferred_themes)
VALUES (
  '10000000-0000-0000-0000-000000000006',
  '00000000-0000-0000-0000-000000000001',
  'tp-006', 'David', 'Goldstein', 'Male', '1980-09-14', 'good',
  175, 95, 'sedentary',
  '[{"name": "Irritable Bowel Syndrome (IBS-D)", "icd10": "K58.0", "status": "active"}]'::jsonb,
  'weight_loss', 1800, 135, 160, 65,
  '600kcal deficit from TDEE 2400. High protein for satiety. Low-FODMAP carb sources only.',
  ARRAY['kosher', 'low-fodmap'],
  ARRAY['kosher-certified', 'no-meat-dairy-mixing', 'low-fodmap'],
  ARRAY['crustaceans', 'molluscs'],
  ARRAY['LowFODMAP', 'HighProtein', 'FamilyMeals']
);

-- tp-007: Karen Whitfield — GOOD DATA
INSERT INTO vhf_clients (id, coach_id, external_id, given_name, family_name, gender, birth_date, data_quality,
  height_cm, weight_kg, activity_level, medical_conditions,
  goal, daily_calories, protein_grams, carbs_grams, fats_grams, macro_rationale,
  diets, dietary_restrictions, allergens, preferred_themes)
VALUES (
  '10000000-0000-0000-0000-000000000007',
  '00000000-0000-0000-0000-000000000001',
  'tp-007', 'Karen', 'Whitfield', 'Female', '1968-04-07', 'good',
  165, 90, 'lightly_active',
  '[{"name": "Hypothyroidism", "icd10": "E03.9", "status": "managed"}]'::jsonb,
  'weight_loss', 1500, 94, 20, 117,
  'Ketogenic ratio 75:20:5. Strict <20g net carbs for ketosis. Moderate protein to prevent gluconeogenesis.',
  ARRAY['keto'],
  ARRAY['ketogenic', 'net-carbs-under-20g'],
  ARRAY['eggs', 'milk'],
  ARRAY['LowCarb', 'BritishComfort', 'QuickWeeknight']
);

-- tp-008: Marcus Williams — POOR DATA (missing height, invalid macros)
INSERT INTO vhf_clients (id, coach_id, external_id, given_name, family_name, gender, birth_date, data_quality,
  height_cm, weight_kg, activity_level, medical_conditions,
  goal, daily_calories, protein_grams, carbs_grams, fats_grams, macro_rationale,
  diets, dietary_restrictions, allergens, preferred_themes)
VALUES (
  '10000000-0000-0000-0000-000000000008',
  '00000000-0000-0000-0000-000000000001',
  'tp-008', 'Marcus', 'Williams', 'Male', '1998-12-01', 'poor',
  NULL, 110, 'very_active',
  '[{"name": "asthma", "icd10": null, "status": "active"}]'::jsonb,
  'weight_loss', 800, 200, 50, 20,
  'INVALID: 800kcal is below safe minimum. 200g protein at 800kcal is impossible (protein alone = 800kcal). Macros don''t add to calorie total.',
  ARRAY['carnivore'],
  ARRAY['nut-free'],
  ARRAY[]::text[],
  ARRAY[]::text[]
);

-- tp-009: Priya Sharma — GOOD DATA
INSERT INTO vhf_clients (id, coach_id, external_id, given_name, family_name, gender, birth_date, data_quality,
  height_cm, weight_kg, activity_level, medical_conditions,
  goal, daily_calories, protein_grams, carbs_grams, fats_grams, macro_rationale,
  diets, dietary_restrictions, allergens, preferred_themes)
VALUES (
  '10000000-0000-0000-0000-000000000009',
  '00000000-0000-0000-0000-000000000001',
  'tp-009', 'Priya', 'Sharma', 'Female', '1992-08-25', 'good',
  158, 52, 'moderately_active',
  '[]'::jsonb,
  'muscle_gain', 2000, 104, 260, 56,
  '250kcal surplus. 2.0g/kg protein via paneer, dal, chickpeas, quinoa. No alliums in any recipe.',
  ARRAY['jain', 'high-protein'],
  ARRAY['jain-strict', 'no-root-vegetables', 'no-eggs', 'no-honey', 'no-alcohol'],
  ARRAY[]::text[],
  ARRAY['HighProtein', 'AsianFusion', 'BudgetFriendly']
);

-- tp-010: Jake Thompson — POOR DATA (conflicting diets)
INSERT INTO vhf_clients (id, coach_id, external_id, given_name, family_name, gender, birth_date, data_quality,
  height_cm, weight_kg, activity_level, medical_conditions,
  goal, daily_calories, protein_grams, carbs_grams, fats_grams, macro_rationale,
  diets, dietary_restrictions, allergens, preferred_themes)
VALUES (
  '10000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'tp-010', 'Jake', 'Thompson', 'Male', '2001-03-10', 'poor',
  185, 78, 'moderately_active',
  '[]'::jsonb,
  'maintenance', 2500, 150, 250, 83,
  'INVALID: Macros are reasonable but diet types conflict. Vegan + Carnivore is impossible.',
  ARRAY['vegan', 'carnivore', 'keto'],
  ARRAY['vegan', 'carnivore', 'keto'],
  ARRAY['milk'],
  ARRAY[]::text[]
);

-- tp-011: Linda Okafor — GOOD DATA
INSERT INTO vhf_clients (id, coach_id, external_id, given_name, family_name, gender, birth_date, data_quality,
  height_cm, weight_kg, activity_level, medical_conditions,
  goal, daily_calories, protein_grams, carbs_grams, fats_grams, macro_rationale,
  diets, dietary_restrictions, allergens, preferred_themes)
VALUES (
  '10000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000001',
  'tp-011', 'Linda', 'Okafor', 'Female', '1975-02-28', 'good',
  172, 68, 'lightly_active',
  '[{"name": "Coeliac Disease", "icd10": "K90.0", "status": "active"}, {"name": "Chronic Kidney Disease Stage 2", "icd10": "N18.2", "status": "active"}]'::jsonb,
  'medical_management', 1800, 72, 230, 65,
  'Moderate protein (0.8g/kg capped for CKD). Gluten-free carb sources: rice, potato, quinoa. Low sodium <1500mg.',
  ARRAY['gluten-free', 'renal', 'pescatarian'],
  ARRAY['gluten-free', 'low-sodium', 'low-potassium', 'low-phosphorus', 'pescatarian'],
  ARRAY['cereals'],
  ARRAY['Mediterranean', 'GutHealth', 'SpringFresh']
);

-- tp-012: Ben Fraser — POOR DATA (no goal, no macros, weight in stones converted to kg)
INSERT INTO vhf_clients (id, coach_id, external_id, given_name, family_name, gender, birth_date, data_quality,
  height_cm, weight_kg, activity_level, medical_conditions,
  goal, daily_calories, protein_grams, carbs_grams, fats_grams, macro_rationale,
  diets, dietary_restrictions, allergens, preferred_themes)
VALUES (
  '10000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000001',
  'tp-012', 'Ben', 'Fraser', 'Male', '1993-10-17', 'poor',
  182, 82.5, NULL,  -- weight converted from 13 STN to kg; activity_level null
  NULL,              -- no medical conditions
  NULL, NULL, NULL, NULL, NULL, NULL,  -- no goal, no macros
  ARRAY[]::text[],
  ARRAY['i dont eat much meat'],
  ARRAY[]::text[],
  ARRAY[]::text[]
);

-- ============================================================
-- RECIPES (30 test recipes)
-- ============================================================

-- r-001: Grilled Chicken Breast with Roasted Mediterranean Vegetables
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000001',
  'r-001',
  'Grilled Chicken Breast with Roasted Mediterranean Vegetables',
  'Simple high-protein dinner with colourful roasted veg. UK supermarket staples.',
  'British', 'Dinner', 'easy',
  15, 25, 40, 2,
  2.80, true, false,
  380, 42, 12, 18, 4, 180,
  ARRAY['2 chicken breasts (300g)', '1 courgette', '1 red pepper', '1 red onion', '2 tbsp olive oil', '1 tsp mixed herbs', 'salt and pepper'],
  ARRAY['halal', 'kosher', 'high-protein', 'low-carb', 'mediterranean', 'paleo', 'gluten-free', 'dairy-free', 'low-fodmap'],
  ARRAY['milk', 'eggs', 'nuts', 'soya', 'cereals'],
  ARRAY['HighProtein', 'Mediterranean', 'QuickWeeknight'],
  false
);

-- r-002: Paneer Tikka with Cucumber Raita and Brown Rice
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000002',
  'r-002',
  'Paneer Tikka with Cucumber Raita and Brown Rice',
  'High-protein lacto-vegetarian meal. Paneer marinated in spiced yoghurt, grilled.',
  'Indian', 'Dinner', 'easy',
  20, 15, 35, 2,
  2.50, true, false,
  520, 32, 48, 22, 4, 220,
  ARRAY['225g paneer', '150g Greek yoghurt', '1 tsp turmeric', '1 tsp garam masala', '1 tsp cumin', '1 cucumber', '200g brown rice', 'fresh mint'],
  ARRAY['vegetarian', 'hindu-vegetarian', 'high-protein', 'halal'],
  ARRAY['nuts', 'eggs', 'soya', 'fish'],
  ARRAY['HighProtein', 'AsianFusion', 'BudgetFriendly'],
  false
);

-- r-003: Salmon and Sweet Potato Tray Bake
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000003',
  'r-003',
  'Salmon and Sweet Potato Tray Bake',
  'Omega-3 rich one-tray dinner. Anti-inflammatory, heart-healthy.',
  'British', 'Dinner', 'easy',
  10, 30, 40, 2,
  3.50, true, false,
  450, 35, 38, 18, 7, 120,
  ARRAY['2 salmon fillets (250g)', '2 medium sweet potatoes', '1 broccoli head', '1 tbsp olive oil', '1 lemon', '2 garlic cloves', 'fresh dill'],
  ARRAY['pescatarian', 'anti-inflammatory', 'mediterranean', 'gluten-free', 'dairy-free', 'high-protein'],
  ARRAY['milk', 'eggs', 'nuts', 'soya', 'cereals'],
  ARRAY['AntiInflammatory', 'HighProtein', 'QuickWeeknight', 'WinterWarmer'],
  false
);

-- r-004: Keto Bacon Avocado Egg Cups
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000004',
  'r-004',
  'Keto Bacon Avocado Egg Cups',
  'High-fat, ultra-low carb breakfast. Avocado halves filled with bacon and baked egg.',
  'British', 'Breakfast', 'easy',
  5, 15, 20, 2,
  1.80, true, false,
  420, 24, 4, 35, 7, 680,
  ARRAY['2 ripe avocados', '4 rashers back bacon', '4 eggs', 'black pepper', 'chilli flakes'],
  ARRAY['keto', 'low-carb', 'paleo', 'gluten-free'],
  ARRAY['milk', 'nuts', 'soya', 'cereals'],
  ARRAY['LowCarb', 'QuickWeeknight'],
  false
);

-- r-005: Chickpea and Spinach Coconut Curry (Vegan)
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000005',
  'r-005',
  'Chickpea and Spinach Coconut Curry (Vegan)',
  'Creamy plant-based curry. High fibre, budget-friendly. No nuts or soya.',
  'Indian', 'Dinner', 'easy',
  10, 25, 35, 4,
  1.20, true, false,
  380, 16, 48, 14, 10, 150,
  ARRAY['2 tins chickpeas (800g)', '400ml coconut milk', '200g spinach', '1 tin chopped tomatoes', '2 tsp curry powder', '1 tsp turmeric', '1 onion', '3 garlic cloves', 'fresh coriander', 'rice to serve'],
  ARRAY['vegan', 'vegetarian', 'hindu-vegetarian', 'halal', 'kosher', 'gluten-free', 'dairy-free', 'anti-inflammatory', 'mediterranean'],
  ARRAY['milk', 'eggs', 'nuts', 'peanuts', 'soya', 'cereals', 'fish', 'crustaceans'],
  ARRAY['BudgetFriendly', 'BatchCookSunday', 'AsianFusion', 'AntiInflammatory'],
  false
);

-- r-006: Turkey Mince Lettuce Wraps with Ginger Soy Glaze
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000006',
  'r-006',
  'Turkey Mince Lettuce Wraps with Ginger Soy Glaze',
  'Low-carb, high-protein Asian-style wraps. Quick weeknight dinner.',
  'Asian', 'Dinner', 'easy',
  10, 12, 22, 2,
  2.20, true, false,
  290, 38, 8, 12, 2, 820,
  ARRAY['300g turkey mince', '1 gem lettuce', '2 tbsp soy sauce', '1 tbsp rice vinegar', '1 thumb ginger', '1 spring onion', '1 carrot (julienned)', '1 tsp sesame oil'],
  ARRAY['high-protein', 'low-carb', 'halal', 'paleo', 'dairy-free', 'egg-free'],
  ARRAY['milk', 'eggs', 'nuts', 'cereals'],
  ARRAY['HighProtein', 'LowCarb', 'AsianFusion', 'QuickWeeknight'],
  false
);

-- r-007: Overnight Protein Oats with Berries
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000007',
  'r-007',
  'Overnight Protein Oats with Berries',
  'No-cook breakfast. Oats soaked in protein shake overnight. Grab-and-go.',
  'British', 'Breakfast', 'easy',
  5, 0, 5, 1,
  1.10, true, true,
  380, 32, 42, 10, 8, 90,
  ARRAY['50g rolled oats', '1 scoop whey protein (30g)', '150ml semi-skimmed milk', '50g mixed berries', '1 tbsp chia seeds'],
  ARRAY['vegetarian', 'high-protein'],
  ARRAY['nuts', 'eggs', 'soya', 'fish'],
  ARRAY['HighProtein', 'QuickWeeknight', 'SummerLight', 'BudgetFriendly'],
  false
);

-- r-008: Lamb Kofta with Tabbouleh Salad
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000008',
  'r-008',
  'Lamb Kofta with Tabbouleh Salad',
  'Middle Eastern spiced lamb with fresh herb bulgur salad. Halal-friendly.',
  'Middle Eastern', 'Dinner', 'medium',
  20, 15, 35, 2,
  3.20, true, false,
  520, 36, 35, 25, 6, 280,
  ARRAY['400g lamb mince', '1 tsp cumin', '1 tsp coriander', '1 tsp paprika', '100g bulgur wheat', '1 bunch flat-leaf parsley', '1 bunch mint', '2 tomatoes', '1 lemon', '2 tbsp olive oil'],
  ARRAY['halal', 'high-protein', 'mediterranean', 'dairy-free'],
  ARRAY['milk', 'eggs', 'nuts', 'soya', 'fish'],
  ARRAY['HighProtein', 'Mediterranean'],
  false
);

-- r-009: Cottage Pie with Cauliflower Mash (Low Carb)
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000009',
  'r-009',
  'Cottage Pie with Cauliflower Mash (Low Carb)',
  'British comfort classic. Swapped potato mash for cauliflower to cut carbs by 60%.',
  'British', 'Dinner', 'medium',
  20, 35, 55, 4,
  2.00, true, false,
  340, 32, 14, 18, 5, 450,
  ARRAY['500g beef mince (5% fat)', '1 large cauliflower', '1 onion', '2 carrots', '200ml beef stock', '2 tbsp tomato puree', '1 tsp Worcestershire sauce', '30g cheddar cheese', '1 tbsp olive oil'],
  ARRAY['low-carb', 'high-protein', 'halal', 'gluten-free'],
  ARRAY['nuts', 'eggs', 'soya', 'fish'],
  ARRAY['BritishComfort', 'LowCarb', 'BatchCookSunday', 'FamilyMeals', 'WinterWarmer'],
  false
);

-- r-010: Lentil and Roasted Aubergine Bowl (Vegan, Nut-Free)
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000010',
  'r-010',
  'Lentil and Roasted Aubergine Bowl (Vegan, Nut-Free)',
  'Protein-rich vegan bowl. No nuts, no soya. Uses lentils and seeds for protein.',
  'Mediterranean', 'Lunch', 'easy',
  15, 30, 45, 2,
  1.60, true, false,
  420, 22, 42, 18, 14, 95,
  ARRAY['200g puy lentils', '1 large aubergine', '100g cherry tomatoes', '1 tbsp tahini', '1 lemon', '2 tbsp olive oil', '1 tsp cumin', 'fresh parsley', '2 tbsp pumpkin seeds'],
  ARRAY['vegan', 'vegetarian', 'hindu-vegetarian', 'halal', 'kosher', 'gluten-free', 'dairy-free', 'anti-inflammatory', 'mediterranean'],
  ARRAY['milk', 'eggs', 'nuts', 'peanuts', 'soya', 'cereals', 'fish', 'crustaceans'],
  ARRAY['Mediterranean', 'BudgetFriendly', 'AntiInflammatory', 'BatchCookSunday'],
  false
);

-- r-011: Scrambled Tofu on Sourdough (Vegan Breakfast)
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000011',
  'r-011',
  'Scrambled Tofu on Sourdough (Vegan Breakfast)',
  'Plant-based scramble with turmeric, nutritional yeast, and spinach on toast.',
  'British', 'Breakfast', 'easy',
  5, 8, 13, 1,
  1.40, true, false,
  350, 24, 32, 14, 5, 380,
  ARRAY['200g firm tofu', '2 slices sourdough', '50g spinach', '1 tsp turmeric', '2 tbsp nutritional yeast', '1 tsp olive oil', 'black pepper'],
  ARRAY['vegan', 'vegetarian', 'halal', 'kosher', 'dairy-free'],
  ARRAY['milk', 'eggs', 'nuts', 'fish'],
  ARRAY['QuickWeeknight', 'BudgetFriendly'],
  false
);

-- r-012: Beef Stir-Fry with Pak Choi and Rice Noodles
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000012',
  'r-012',
  'Beef Stir-Fry with Pak Choi and Rice Noodles',
  'Quick high-protein Asian stir-fry. Gluten-free with tamari instead of soy.',
  'Asian', 'Dinner', 'easy',
  10, 10, 20, 2,
  3.00, true, false,
  480, 38, 45, 16, 3, 720,
  ARRAY['300g beef sirloin strips', '200g rice noodles', '2 pak choi', '2 tbsp tamari', '1 thumb ginger', '2 garlic cloves', '1 red chilli', '1 tbsp sesame oil'],
  ARRAY['high-protein', 'gluten-free', 'dairy-free', 'halal'],
  ARRAY['milk', 'eggs', 'nuts', 'cereals'],
  ARRAY['AsianFusion', 'HighProtein', 'QuickWeeknight'],
  false
);

-- r-013: Greek Yoghurt Parfait with Granola and Honey
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000013',
  'r-013',
  'Greek Yoghurt Parfait with Granola and Honey',
  'High-protein breakfast. Layer yoghurt, homemade granola, seasonal fruit, drizzle of honey.',
  'British', 'Breakfast', 'easy',
  5, 0, 5, 1,
  1.30, true, false,
  310, 24, 38, 6, 3, 60,
  ARRAY['200g Greek yoghurt (0% fat)', '40g granola (oat-based)', '1 tbsp honey', '80g seasonal berries'],
  ARRAY['vegetarian', 'high-protein'],
  ARRAY['eggs', 'soya', 'nuts', 'fish'],
  ARRAY['HighProtein', 'QuickWeeknight', 'SummerLight'],
  false
);

-- r-014: Slow-Cooker Chicken and White Bean Stew
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000014',
  'r-014',
  'Slow-Cooker Chicken and White Bean Stew',
  'Batch-cook Sunday hero. Set and forget for 6 hours. Freezes brilliantly.',
  'British', 'Dinner', 'easy',
  15, 360, 375, 6,
  1.50, true, true,
  380, 34, 28, 14, 8, 520,
  ARRAY['6 chicken thighs (bone-in)', '2 tins white beans (800g)', '2 carrots', '2 celery sticks', '1 onion', '3 garlic cloves', '500ml chicken stock', '1 tsp thyme', '1 bay leaf'],
  ARRAY['high-protein', 'gluten-free', 'dairy-free', 'halal', 'anti-inflammatory'],
  ARRAY['milk', 'eggs', 'nuts', 'soya', 'cereals'],
  ARRAY['BatchCookSunday', 'BritishComfort', 'WinterWarmer', 'BudgetFriendly', 'FamilyMeals'],
  false
);

-- r-015: Jain Dal Tadka with Jeera Rice (No Onion/Garlic)
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000015',
  'r-015',
  'Jain Dal Tadka with Jeera Rice (No Onion/Garlic)',
  'Jain-compliant lentil dal. No root vegetables, no onion, no garlic. Uses asafoetida for flavour.',
  'Indian', 'Dinner', 'easy',
  10, 25, 35, 2,
  0.90, true, false,
  440, 20, 68, 8, 10, 45,
  ARRAY['200g yellow moong dal', '1 tomato', '1 green chilli', '1/4 tsp asafoetida (hing)', '1 tsp cumin seeds', '1 tsp turmeric', '200g basmati rice', '1 tbsp ghee', 'fresh coriander'],
  ARRAY['jain', 'hindu-vegetarian', 'vegetarian', 'halal', 'gluten-free'],
  ARRAY['nuts', 'peanuts', 'eggs', 'soya', 'fish', 'cereals', 'crustaceans'],
  ARRAY['AsianFusion', 'BudgetFriendly'],
  false
);

-- r-016: Smoked Mackerel Salad with Beetroot and Horseradish
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000016',
  'r-016',
  'Smoked Mackerel Salad with Beetroot and Horseradish',
  'Omega-3 rich lunch. Low-FODMAP friendly. Excellent for anti-inflammatory diets.',
  'British', 'Lunch', 'easy',
  10, 0, 10, 1,
  2.50, true, true,
  380, 26, 12, 26, 3, 680,
  ARRAY['1 smoked mackerel fillet (120g)', '2 cooked beetroot', '1 tbsp horseradish sauce', '60g mixed leaves', '1 tbsp olive oil', '1 lemon'],
  ARRAY['pescatarian', 'gluten-free', 'dairy-free', 'low-carb', 'anti-inflammatory', 'low-fodmap', 'paleo'],
  ARRAY['milk', 'eggs', 'nuts', 'soya', 'cereals'],
  ARRAY['AntiInflammatory', 'AutumnHarvest', 'LowCarb', 'QuickWeeknight'],
  false
);

-- r-017: Seitan Stir-Fry with Broccoli and Sesame (Vegan, Nut-Free, Soya-Free)
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000017',
  'r-017',
  'Seitan Stir-Fry with Broccoli and Sesame (Vegan, Nut-Free, Soya-Free)',
  'High-protein vegan stir-fry using seitan. No soya, no nuts. Uses coconut aminos.',
  'Asian', 'Dinner', 'easy',
  10, 10, 20, 2,
  2.80, true, false,
  480, 38, 52, 12, 6, 420,
  ARRAY['250g seitan', '1 broccoli head', '2 tbsp coconut aminos', '1 tbsp sesame oil', '1 thumb ginger', '1 red chilli', '1 tbsp sesame seeds', '200g jasmine rice'],
  ARRAY['vegan', 'high-protein', 'dairy-free'],
  ARRAY['milk', 'eggs', 'nuts', 'peanuts', 'soya', 'fish'],
  ARRAY['HighProtein', 'AsianFusion', 'QuickWeeknight'],
  false
);

-- r-018: Egg-Free Coconut Pancakes (Keto)
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000018',
  'r-018',
  'Egg-Free Coconut Pancakes (Keto)',
  'Keto breakfast. No eggs, no dairy. Uses coconut flour and flax eggs.',
  'British', 'Breakfast', 'easy',
  10, 10, 20, 2,
  1.60, true, false,
  320, 8, 10, 28, 8, 120,
  ARRAY['30g coconut flour', '2 tbsp ground flaxseed', '100ml coconut cream', '1 tsp vanilla extract', '1/2 tsp baking powder', 'coconut oil for frying', '50g raspberries'],
  ARRAY['keto', 'vegan', 'gluten-free', 'dairy-free', 'egg-free', 'paleo'],
  ARRAY['milk', 'eggs', 'nuts', 'soya', 'cereals'],
  ARRAY['LowCarb', 'QuickWeeknight'],
  false
);

-- r-019: Tuna Nicoise Salad
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000019',
  'r-019',
  'Tuna Niçoise Salad',
  'Classic French protein salad. Low-FODMAP compatible. Anti-inflammatory omega-3.',
  'French', 'Lunch', 'easy',
  15, 10, 25, 2,
  2.80, true, true,
  420, 40, 22, 20, 5, 380,
  ARRAY['2 fresh tuna steaks (200g)', '200g green beans', '4 eggs', '100g cherry tomatoes', '50g black olives', '200g new potatoes', '1 tbsp olive oil', '1 tbsp Dijon mustard', '1 lemon'],
  ARRAY['pescatarian', 'high-protein', 'gluten-free', 'dairy-free', 'mediterranean', 'anti-inflammatory', 'low-fodmap'],
  ARRAY['milk', 'nuts', 'soya', 'cereals'],
  ARRAY['HighProtein', 'Mediterranean', 'SummerLight', 'AntiInflammatory'],
  false
);

-- r-020: Chicken Shawarma Bowl with Hummus and Pickled Red Cabbage
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000020',
  'r-020',
  'Chicken Shawarma Bowl with Hummus and Pickled Red Cabbage',
  'Middle Eastern spiced chicken bowl. Halal-friendly. High protein, moderate carbs.',
  'Middle Eastern', 'Lunch', 'medium',
  20, 15, 35, 2,
  2.60, true, false,
  520, 38, 42, 22, 8, 520,
  ARRAY['300g chicken thigh', '2 flatbreads', '100g hummus', '100g pickled red cabbage', '1 cucumber', '2 tomatoes', '1 tsp cumin', '1 tsp coriander', '1 tsp turmeric', '1 tsp paprika', '2 tbsp olive oil'],
  ARRAY['halal', 'high-protein', 'dairy-free'],
  ARRAY['milk', 'eggs', 'nuts', 'soya', 'fish'],
  ARRAY['HighProtein', 'Mediterranean'],
  false
);

-- r-021: Venison Sausage Casserole with Root Vegetables
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000021',
  'r-021',
  'Venison Sausage Casserole with Root Vegetables',
  'Low-fat game meat casserole. Rich in iron and B12. Autumn/winter seasonal.',
  'British', 'Dinner', 'easy',
  15, 45, 60, 4,
  2.80, true, true,
  380, 28, 32, 14, 8, 580,
  ARRAY['8 venison sausages', '2 parsnips', '2 carrots', '1 swede', '1 onion', '400ml beef stock', '2 tbsp tomato puree', '1 tsp rosemary', '1 tsp thyme'],
  ARRAY['high-protein', 'dairy-free', 'gluten-free'],
  ARRAY['milk', 'eggs', 'nuts', 'soya', 'fish'],
  ARRAY['BritishComfort', 'AutumnHarvest', 'WinterWarmer', 'BatchCookSunday', 'FamilyMeals'],
  false
);

-- r-022: Prawn and Courgette Noodles (Low Carb)
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000022',
  'r-022',
  'Prawn and Courgette Noodles (Low Carb)',
  'Spiralised courgette replaces noodles. High protein, low carb, very quick.',
  'Asian', 'Dinner', 'easy',
  10, 8, 18, 2,
  3.50, true, true,
  220, 32, 8, 8, 2, 720,
  ARRAY['300g king prawns', '2 large courgettes (spiralised)', '2 tbsp tamari', '1 tbsp sesame oil', '1 red chilli', '2 garlic cloves', '1 lime'],
  ARRAY['pescatarian', 'high-protein', 'low-carb', 'keto', 'gluten-free', 'dairy-free', 'paleo'],
  ARRAY['milk', 'eggs', 'nuts', 'soya', 'cereals'],
  ARRAY['LowCarb', 'HighProtein', 'AsianFusion', 'SummerLight', 'QuickWeeknight'],
  false
);

-- r-023: Quinoa Power Bowl with Roasted Chickpeas and Tahini
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000023',
  'r-023',
  'Quinoa Power Bowl with Roasted Chickpeas and Tahini',
  'Complete vegan protein bowl. Quinoa + chickpeas = complete amino acid profile.',
  'Mediterranean', 'Lunch', 'easy',
  10, 25, 35, 2,
  1.80, true, false,
  480, 20, 58, 18, 12, 140,
  ARRAY['150g quinoa', '1 tin chickpeas (400g)', '1 sweet potato', '100g kale', '2 tbsp tahini', '1 lemon', '1 tsp cumin', '1 tsp smoked paprika', '2 tbsp olive oil'],
  ARRAY['vegan', 'vegetarian', 'hindu-vegetarian', 'halal', 'kosher', 'gluten-free', 'dairy-free', 'mediterranean', 'anti-inflammatory'],
  ARRAY['milk', 'eggs', 'nuts', 'peanuts', 'soya', 'cereals', 'fish'],
  ARRAY['BudgetFriendly', 'BatchCookSunday', 'EnergyBoost', 'AntiInflammatory'],
  false
);

-- r-024: Baked Cod with Lemon Caper Butter and Asparagus
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000024',
  'r-024',
  'Baked Cod with Lemon Caper Butter and Asparagus',
  'Light spring fish dish. Low-FODMAP, gluten-free, anti-inflammatory.',
  'British', 'Dinner', 'easy',
  10, 18, 28, 2,
  3.80, true, true,
  300, 36, 6, 14, 3, 380,
  ARRAY['2 cod fillets (300g)', '200g asparagus', '30g butter', '2 tbsp capers', '1 lemon', 'fresh dill', 'black pepper'],
  ARRAY['pescatarian', 'high-protein', 'low-carb', 'keto', 'gluten-free', 'low-fodmap', 'anti-inflammatory', 'mediterranean', 'kosher'],
  ARRAY['eggs', 'nuts', 'soya', 'cereals'],
  ARRAY['SpringFresh', 'LowCarb', 'AntiInflammatory', 'LowFODMAP', 'HighProtein'],
  false
);

-- r-025: Steak and Egg Keto Plate
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000025',
  'r-025',
  'Steak and Egg Keto Plate',
  'Carnivore/keto breakfast or dinner. Ribeye with fried eggs and wilted spinach.',
  'British', 'Dinner', 'easy',
  5, 12, 17, 1,
  5.50, true, false,
  620, 52, 3, 44, 2, 320,
  ARRAY['1 ribeye steak (250g)', '2 eggs', '100g spinach', '1 tbsp butter', 'salt and pepper'],
  ARRAY['keto', 'carnivore', 'low-carb', 'high-protein', 'paleo', 'gluten-free'],
  ARRAY['nuts', 'soya', 'cereals', 'fish'],
  ARRAY['LowCarb', 'HighProtein', 'QuickWeeknight'],
  false
);

-- r-026: Butternut Squash and Sage Risotto
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000026',
  'r-026',
  'Butternut Squash and Sage Risotto',
  'Creamy autumn risotto. Vegetarian comfort food. Rich in beta-carotene.',
  'Italian', 'Dinner', 'medium',
  15, 30, 45, 4,
  1.50, true, true,
  420, 10, 68, 12, 4, 480,
  ARRAY['300g arborio rice', '1 butternut squash', '1 onion', '150ml white wine', '800ml vegetable stock', '30g parmesan', 'fresh sage', '2 tbsp butter'],
  ARRAY['vegetarian', 'gluten-free'],
  ARRAY['nuts', 'eggs', 'soya', 'fish'],
  ARRAY['AutumnHarvest', 'BritishComfort', 'BatchCookSunday'],
  false
);

-- r-027: Egg Muffins Three Ways (Meal Prep)
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000027',
  'r-027',
  'Egg Muffins Three Ways (Meal Prep)',
  'Batch-cook breakfast muffins. Make 12, fridge for 4 days. Three flavour combos.',
  'British', 'Breakfast', 'easy',
  15, 20, 35, 4,
  0.80, true, false,
  280, 22, 4, 20, 1, 450,
  ARRAY['12 eggs', '100g spinach', '100g cherry tomatoes', '50g feta cheese', '4 rashers bacon', '1 red pepper', 'salt and pepper'],
  ARRAY['keto', 'low-carb', 'high-protein', 'gluten-free'],
  ARRAY['nuts', 'soya', 'cereals', 'fish'],
  ARRAY['BatchCookSunday', 'LowCarb', 'BudgetFriendly', 'QuickWeeknight'],
  false
);

-- r-028: Thai Green Curry with Tofu (Vegan)
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000028',
  'r-028',
  'Thai Green Curry with Tofu (Vegan)',
  'Fragrant coconut curry. Soya-based tofu but can sub chickpeas for soya-free.',
  'Thai', 'Dinner', 'medium',
  15, 20, 35, 2,
  2.20, true, false,
  520, 22, 54, 24, 5, 480,
  ARRAY['300g firm tofu', '400ml coconut milk', '2 tbsp green curry paste', '1 courgette', '100g mangetout', '100g baby corn', 'fresh basil', '200g jasmine rice'],
  ARRAY['vegan', 'vegetarian', 'halal', 'gluten-free', 'dairy-free'],
  ARRAY['milk', 'eggs', 'nuts', 'cereals', 'fish'],
  ARRAY['AsianFusion', 'BudgetFriendly'],
  false
);

-- r-029: Grilled Halloumi and Roasted Veg Wrap
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000029',
  'r-029',
  'Grilled Halloumi and Roasted Veg Wrap',
  'Vegetarian lunch. High protein from halloumi. Quick assembly.',
  'Mediterranean', 'Lunch', 'easy',
  10, 12, 22, 2,
  2.40, true, false,
  480, 26, 36, 26, 6, 680,
  ARRAY['200g halloumi', '2 large wholemeal wraps', '1 courgette', '1 red pepper', '50g rocket', '2 tbsp hummus', '1 tbsp olive oil'],
  ARRAY['vegetarian', 'halal'],
  ARRAY['nuts', 'eggs', 'soya', 'fish'],
  ARRAY['QuickWeeknight', 'Mediterranean'],
  false
);

-- r-030: Banana Oat Energy Balls (Snack)
INSERT INTO vhf_recipes (id, external_id, name, description, cuisine, category, difficulty,
  prep_time_mins, cook_time_mins, total_time_mins, servings,
  cost_per_serving_gbp, uk_available, seasonal,
  calories, protein_g, carbs_g, fat_g, fibre_g, sodium_mg,
  ingredients, suitable_diets, excluded_allergens, themes, is_generated)
VALUES (
  '20000000-0000-0000-0000-000000000030',
  'r-030',
  'Banana Oat Energy Balls (Snack)',
  'No-bake snack. 5 ingredients. Great for pre/post workout energy.',
  'British', 'Snack', 'easy',
  10, 0, 10, 4,
  0.60, true, false,
  210, 6, 32, 7, 3, 40,
  ARRAY['2 ripe bananas', '100g rolled oats', '2 tbsp peanut butter', '1 tbsp honey', '2 tbsp dark chocolate chips'],
  ARRAY['vegetarian'],
  ARRAY['milk', 'eggs', 'soya', 'fish'],
  ARRAY['EnergyBoost', 'BatchCookSunday', 'BudgetFriendly'],
  false
);

COMMIT;
