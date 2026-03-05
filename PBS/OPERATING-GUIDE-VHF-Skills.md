# VHF Custom Skills — Operating Guide

**Version**: 1.1.0
**Date**: 2026-02-26
**Epic**: #7 (Epic 1: VHF Custom Skills — 30-Day Meal Plan Generator)
**Feature**: #8 (F1.1: /meal-plan Custom Skill — MVP)
**Repo**: `ajrmooreuk/VHF-App-Mk3`

---

## 1. Architecture

### 1.1 PFC-Core vs PFI-VHF Boundary

```
PFC-Core (shared infrastructure)
├── Skill runner pattern (Claude Code custom commands)
├── VSOM framework (Vision → Strategy → Objectives → Metrics)
├── PE-Series process conventions (PE-B2C-NUT-ONT)
├── EMC composition engine
├── Schema.org alignment / JSON-LD format
└── Validation logic patterns

PFI-VHF (instance-scoped)
├── VHF-RMP-ONT v1.0.0 (reclassified → PE-B2C-NUT-ONT)
│   ├── 39 entity classes
│   ├── 30 diet types (ethical, religious, medical, macro, lifestyle, allergen-free)
│   ├── 16 meal themes (seasonal, cuisine, goal, lifestyle, clinical)
│   ├── 14 UK allergens
│   ├── 5 client goals
│   ├── 8-step MealPlanGenerationFlow
│   └── Supabase database mapping (future)
├── VHF-DS-ONT (design system ontology)
├── Test data (12 personas, 30 recipes)
├── Coach protocols (James Kerby)
└── Custom skills (.claude/commands/)
```

### 1.2 VSOM at Individual Client Level

The PFC VSOM framework maps to individual nutrition coaching:

- **Vision** → `client:Goal` — what the client wants to achieve (weight loss, muscle gain, sports performance, medical management, maintenance)
- **Strategy** → `client:followsDiet` + `client:prefersTheme` — the dietary approach and meal style preferences
- **Objectives** → `client:MacroTarget` — daily calorie and macro gram targets set by coach
- **Metrics** → `meal:DailyTotals`, `meal:WeeklyTotals` — adherence %, variety score, cost, allergen compliance

### 1.3 PE-B2C-NUT-ONT Process Flow

The meal plan generation follows an 8-step process defined in the ontology:

1. **Assemble client context** — load profile, goal, macros, diets, allergens, conditions
2. **Resolve applicable themes** — client preferences + seasonal + goal-aligned
3. **Search recipe database** — filter by diet compatibility, allergen safety, UK availability
4. **Generate 30-day plan** — assign recipes to 120 meal slots, portion-scale to hit macros
5. **Calculate totals** — daily/weekly/30-day macro sums and variance from targets
6. **Generate shopping lists** — consolidated per week, grouped by UK supermarket aisle
7. **Coach review** — plan saved as pending, coach uses view skill to inspect
8. **Deliver to client** — coach approves, plan status → active

### 1.4 File Structure

```
VHF-App-Mk3/
├── .claude/
│   └── commands/
│       ├── meal-plan.md          ← Generate a 30-day plan for one client
│       ├── meal-plan-view.md     ← View/drill into a saved plan
│       ├── meal-plan-html.md     ← Render plan as single-page HTML
│       └── meal-plan-test.md     ← Run test suite across all personas
├── PBS/
│   └── ONTOLOGIES/
│       └── VHF-RECIPE-MEALPLAN-ONT/
│           ├── VHF-Recipe-MealPlan-Ontology-v1.0.0.jsonld
│           ├── Entry-ONT-VHF-RMP-001.json
│           └── test-data/
│               ├── test-personas.jsonld     ← 12 client profiles
│               ├── test-recipes.jsonld      ← 30 recipes
│               └── TRACEABILITY-MATRIX.md   ← Gap analysis & test scenarios
│           └── generated-plans/
│               ├── meal-plan-{id}-{date}.jsonld  ← Generated plans
│               ├── meal-plan-{id}-{date}.html    ← HTML rendered plans
│               └── test-report-{date}.md         ← Test sweep results
```

---

## 2. Skills Reference

### 2.1 `/meal-plan` — Generate a 30-Day Plan

**Purpose**: Generate a personalised, ontology-compliant 30-day meal plan for a specific client persona.

**Usage**:
```
/meal-plan tp-001
```

**Arguments**:
- Client persona ID (e.g. `tp-001` through `tp-012`)

**What it does**:
- Loads client profile from test-personas.jsonld
- Validates data quality (blocks poor-data personas with specific errors)
- Resolves applicable themes (preferences + seasonal + goal-aligned)
- Filters 30-recipe database against diet/allergen/availability constraints
- Expands recipe pool if <15 matches (generates new compliant recipes)
- Builds 30-day plan (4 weeks + 2 days, 4 meals/day)
- Portion-scales recipes (0.75x–1.5x) to hit macro gram targets
- Calculates daily/weekly/30-day totals and variance
- Generates 4 weekly shopping lists (UK supermarket aisles)
- Saves JSON-LD plan file to `generated-plans/`

**Output**:
- JSON-LD file: `generated-plans/meal-plan-{clientId}-{date}.jsonld`
- Screen: quality summary (compliance, macros, variety, cost, VSOM status)

**Validation rules**:
- Null height → BLOCK
- Calories below gender minimum → BLOCK
- Macro arithmetic >5% off → WARN (target grams not stated kcal)
- Conflicting diets → BLOCK
- Missing goal → BLOCK
- Wrong units → convert and WARN

### 2.2 `/meal-plan-view` — View a Saved Plan

**Purpose**: Render a saved plan as readable markdown at different zoom levels.

**Usage**:
```
/meal-plan-view tp-001              ← Overview + quality summary
/meal-plan-view tp-001 week-2       ← Detailed week with day-by-day tables
/meal-plan-view tp-001 day-15       ← Single day detail with ingredients
/meal-plan-view tp-001 shopping     ← All 4 weekly shopping lists
/meal-plan-view tp-001 recipes      ← Full recipe pool (matched + generated)
/meal-plan-view tp-001 quality      ← Detailed quality report + VSOM
```

**Arguments**:
- Client ID (required)
- Scope (optional): `week-N`, `day-N`, `shopping`, `recipes`, `quality`

**Reads from**: most recent `generated-plans/meal-plan-{clientId}-*.jsonld`

### 2.3 `/meal-plan-test` — Test Suite

**Purpose**: Run the full traceability matrix test sweep across all 12 personas.

**Usage**:
```
/meal-plan-test all                 ← Full test (all 12 personas, all 4 phases)
/meal-plan-test good                ← 9 good-data personas only
/meal-plan-test poor                ← 3 poor-data personas only
/meal-plan-test tp-005              ← Single persona test
```

**4 test phases**:
1. **Data quality validation** — all 12 personas, checks correct pass/block classification
2. **Recipe filtering** — 9 good personas, compares match count against traceability matrix predictions
3. **Plan generation** — 9 good personas, validates allergen safety, diet compliance, macro adherence, variety
4. **Poor data rejection** — 3 poor personas, verifies correct error messages (DQ-01 to DQ-12)

**Output**:
- Screen: test results dashboard with pass/fail per persona per phase
- File: `generated-plans/test-report-{date}.md`

### 2.4 `/meal-plan-html` — Render Plan as HTML

**Purpose**: Render a saved 30-day meal plan as a self-contained single-page HTML file styled with VHF design system tokens. The coach can open it in any browser, print, or send to a client.

**Usage**:
```
/meal-plan-html tp-001
```

**Arguments**:
- Client persona ID (e.g. `tp-001`)

**What it does**:
- Reads the most recent saved plan for the client from `generated-plans/`
- Extracts VHF Viridian design system tokens (CSS custom properties)
- Generates a self-contained HTML file with embedded CSS and JS (no external deps except Google Fonts)
- Applies branded styling: viridian header, colour-coded meal cards, variance indicators, metric dashboard
- Includes week tab navigation, collapsible shopping lists, generated recipe cards
- Print-optimised with `@media print` styles

**Layout sections**:
- Header bar (viridian branding)
- Client profile card (goal, diets, allergens, macro targets)
- Quality dashboard (compliance, macros, variety, cost, VSOM metrics)
- Week tabs with day cards (4 meals per day, colour-coded by meal type)
- Shopping lists (collapsible per week, grouped by UK supermarket aisle)
- Generated recipes section (if any, marked with dashed border)
- Footer (coach name, date, status)

**Output**:
- HTML file: `generated-plans/meal-plan-{clientId}-{date}.html`
- Offer to open in default browser

**Note**: This is a short-term output skill — to be replaced by the production Supabase + Figma Make frontend. The design system token map is currently a placeholder using VHF instance tokens; the actual PF-Core design system tokens will be provided from Azlan when available. A future enhancement will add GitHub Pages hosting as a configurable option.

---

## 3. Test Data Summary

### 3.1 Personas (12)

| ID | Name | Quality | Goal | Key Constraints | Complexity |
|---|---|---|---|---|---|
| tp-001 | Sarah Mitchell | Good | Weight Loss | Diabetic, Low Carb, Nut-free | Medium |
| tp-002 | Raj Patel | Good | Muscle Gain | Hindu Vegetarian, High Protein | Medium |
| tp-003 | Fatima Al-Rashid | Good | Weight Loss | Halal, Anti-Inflammatory, Sesame-free | High |
| tp-004 | Tom Jeffries | Good | Maintenance | Mediterranean, Low Sodium, Anti-Inflam | Medium |
| tp-005 | Emma Chen | Good | Sports Perf | Vegan, High Protein, Soya/Nut-free | Very High |
| tp-006 | David Goldstein | Good | Weight Loss | Kosher, Low-FODMAP | Very High |
| tp-007 | Karen Whitfield | Good | Weight Loss | Keto, Egg-free, Dairy-free | High |
| tp-008 | Marcus Williams | Poor | Weight Loss | Missing height, impossible macros | INVALID |
| tp-009 | Priya Sharma | Good | Muscle Gain | Jain, High Protein | Very High |
| tp-010 | Jake Thompson | Poor | Maintenance | Vegan + Carnivore + Keto (conflicting) | INVALID |
| tp-011 | Linda Okafor | Good | Medical Mgmt | Gluten-free, Renal, Pescatarian | Very High |
| tp-012 | Ben Fraser | Poor | None | No goal, wrong units, free-text | INVALID |

### 3.2 Recipes (30)

- 30 recipes covering: British, Indian, Asian, Mediterranean, Middle Eastern, French, Italian, Thai cuisines
- Categories: 5 breakfasts, 7 lunches, 15 dinners, 3 snacks
- Diet coverage: 18 of 30 diet types exercised, 142 recipe-diet pairings
- All UK-available, costed in GBP

### 3.3 Known Gaps

| Gap | Constraint Set | Recipes Available | Needed |
|---|---|---|---|
| GAP-01 | Jain-compliant | 1 | +14 |
| GAP-02 | Kosher + Low-FODMAP | 2 | +13 |
| GAP-03 | Keto + Egg-free + Dairy-free | 3 | +12 |
| GAP-04 | Vegan + Nut-free + Soya-free | 5 | +10 |
| GAP-05 | Low-FODMAP general | 3 | +12 |
| GAP-06 | Renal-safe | 0 | +15 |

The `/meal-plan` skill handles gaps by generating new compliant recipes at runtime (marked with `gen-` IDs).

---

## 4. Generated Plan Format (JSON-LD)

Plans are saved as ontology-compliant JSON-LD with:

- **@context**: Schema.org + VHF namespaces
- **@type**: `meal:MealPlan`
- **Client reference**: links to persona via `@id`
- **4 weeks**: each containing 7+ days
- **Per day**: 4 meals (breakfast/lunch/dinner/snack) with recipeId, recipeName, portionScale, nutrition
- **Per day**: dailyTotals and dailyVariance objects
- **Per week**: weeklyAverages, weeklyVariance, shoppingList (by aisle), estimatedWeeklyCost
- **Generated recipes**: full recipe objects for any `gen-` recipes created during expansion
- **Quality report**: constraint compliance, macro adherence, variety, cost, VSOM alignment

---

## 5. First Run Results (tp-001 Sarah Mitchell)

**Date**: 2026-02-26
**File**: `generated-plans/meal-plan-tp-001-2026-02-26.jsonld` (3,218 lines, 96KB)

| Metric | Result |
|---|---|
| Recipe pool | 13 matched + 6 generated = 19 total |
| Allergen violations | 0 |
| Constraint compliance | 100% |
| Protein (30-day avg) | 135.2g vs 120g target (+12.7%) |
| Carbs (30-day avg) | 122.1g vs 140g target (-12.8%) |
| Fat (30-day avg) | 58.5g vs 55g target (+6.4%) |
| Calories (30-day avg) | 1576.6 kcal vs 1535 kcal macro sum (+2.7%) |
| Unique recipes | 19 across 120 meal slots |
| Protein sources | 8-13 distinct per week |
| Quick dinners | 3+ per week (target: 2) |
| JSON validity | Valid |

**Coach note**: Protein slightly elevated (+12.7%) is clinically appropriate for T2D weight loss — supports satiety and glycaemic control. Carb shortfall (-12.8%) reflects low-carb recipe pool; coach may adjust with whole grain sides.

---

## 6. Workflow for Coach

1. **Generate**: `/meal-plan tp-001` — creates the plan, saves JSON-LD
2. **Review overview**: `/meal-plan-view tp-001` — check quality summary
3. **Drill in**: `/meal-plan-view tp-001 week-1` — inspect day-by-day detail
4. **Check shopping**: `/meal-plan-view tp-001 shopping` — verify ingredient lists
5. **Full QA**: `/meal-plan-view tp-001 quality` — VSOM alignment and full metrics
6. **Render HTML**: `/meal-plan-html tp-001` — branded single-page HTML for client delivery
7. **Test all clients**: `/meal-plan-test all` — validate across entire caseload

---

## 7. Future Work

- **F1.x: Pool assessment** — evaluate whether PE-B2C-NUT-ONT process template should be promoted to PFC-core ontology-library for reuse by other PFI instances
- **Recipe database expansion** — address GAP-01 to GAP-06 with dedicated recipe sets for Jain, Kosher+FODMAP, Keto+EF+DF, Vegan+NF+SF, Renal
- **Supabase integration** — persist plans to database using the ontology-to-DB mapping
- **Coach approval workflow** — plan status lifecycle (pending → approved → active → completed)
- **GitHub Pages hosting** — configurable option in `/meal-plan-html` to deploy rendered plans to GH Pages for coach/client access via URL
- **PF-Core DS token integration** — replace placeholder VHF tokens in HTML skill with actual PF-Core design system tokens from Azlan
- **Client-facing delivery** — UI rendering of approved plans (Supabase + Figma Make frontend replaces HTML skill)
- **Progress tracking** — `client:ProgressLog` integration for adherence monitoring
