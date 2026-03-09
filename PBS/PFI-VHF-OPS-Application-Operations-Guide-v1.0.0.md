# PFI-VHF-OPS: Application Operations Guide

**Product Code:** PFI-VHF
**Document Type:** OPS — Operations Guide
**Version:** v1.0.0
**Date:** 2026-03-09
**Status:** Active
**Epic Refs:** Epic 2 (#26) · Epic 5 (#29)
**Author:** Design Director + Claude Code
**Related:** [PFI-VHF-ARCH-Application-Architecture-Guide-v1.0.0.md](ARCHITECTURE/PFI-VHF-ARCH-Application-Architecture-Guide-v1.0.0.md)

---

## Quick Start

### Live Demo (GitHub Pages)

```
https://ajrmooreuk.github.io/pfi-vhf-nutrition-app-dev/application/browser-viewer.html
```

No setup required. Loads all data from the repository. Allow 1–2 minutes for GitHub Pages CDN after a push.

### Local Development

```bash
# Start from the REPO ROOT (not application/ subfolder)
cd pfi-vhf-nutrition-app-dev
python3 -m http.server 8080

# Open in browser:
# http://localhost:8080/application/browser-viewer.html
```

> **Important:** The server must be started from the repo root. Data paths like `../instance-data/` are resolved relative to `browser-viewer.html`. Starting from `application/` causes 404 errors on all JSONLD fetches.

Alternatively, with Node.js:
```bash
npx serve . -p 8080
# Then open http://localhost:8080/application/browser-viewer.html
```

---

## What the App Does

On load, the app:

1. Fetches the app skeleton JSONLD → builds zone and nav registries
2. Applies Viridian brand tokens to CSS custom properties
3. Renders the navigation bar from skeleton nav items
4. Sets initial zone visibility (Dashboard is default)
5. Loads all test data in parallel (personas, recipes, plans)
6. Renders the dashboard with 12 client cards

From the dashboard, coaches can:
- Click any client card to open their meal plan (if one exists) or profile
- Navigate to Recipe Browser, Coach Panel via nav buttons
- Open the Nutrition Advisor chat overlay (top right)

---

## File Layout (Operations Perspective)

| File | Purpose | Edit Frequency |
|------|---------|---------------|
| `application/browser-viewer.html` | HTML shell, zone containers | Rarely |
| `application/css/viewer.css` | All styles, CSS custom property defaults | Occasionally |
| `application/js/app.js` | Init sequence, data loading, dashboard render | When adding zones/data |
| `application/vhf-app-skeleton-v1.0.0.jsonld` | Zone definitions, nav items, actions | When adding zones/nav |
| `instance-data/tokens/.../vhf-viridian-ds-instance-v1.0.0.jsonld` | Brand tokens | Rarely |
| `instance-data/.../test-personas.jsonld` | Client test data | When adding clients |
| `instance-data/.../test-recipes.jsonld` | Recipe library | When adding recipes |
| `instance-data/.../generated-plans/*.jsonld` | Meal plans per client | When generating plans |

---

## Adding a New Client Plan

1. Generate a new plan JSONLD in `instance-data/ontologies/VHF-RECIPE-MEALPLAN-ONT/generated-plans/`

   Filename convention: `meal-plan-<persona-id>-<date>.jsonld`
   Example: `meal-plan-tp-002-2026-03-09.jsonld`

2. Add the filename to `PATHS.planFiles` in `application/js/app.js`:

   ```js
   planFiles: [
     'meal-plan-tp-001-2026-02-26.jsonld',
     'meal-plan-tp-002-2026-03-09.jsonld',   // ← add here
   ],
   ```

3. The plan will be loaded on next app start and linked to the client by matching `meal:assignedToClient['@id']` against the persona `@id`.

4. Commit and push to update GitHub Pages.

### Plan JSONLD Minimum Structure

```jsonld
{
  "@context": { ... },
  "@graph": [{
    "@id": "plan:tp-002-2026-03-09",
    "@type": "meal:MealPlan",
    "vhf:planStatus": "pending",
    "meal:assignedToClient": { "@id": "client:tp-002" },
    "vhf:weeks": [
      {
        "weekLabel": "Week 1",
        "days": [
          {
            "dayOfWeek": "Monday",
            "meals": [
              { "mealType": "Breakfast", "recipeName": "Overnight Oats", "calories": 350 },
              { "mealType": "Lunch", "recipeName": "Chicken Salad", "calories": 450 },
              { "mealType": "Dinner", "recipeName": "Grilled Salmon", "calories": 520 },
              { "mealType": "Snack", "recipeName": "Greek Yogurt", "calories": 180 }
            ]
          }
          // ... 6 more days
        ],
        "shoppingList": [
          { "aisle": "Produce", "items": ["2 avocados", "baby spinach 200g"] }
        ]
      }
      // ... weeks 2, 3, 4
    ],
    "vhf:qualityReport": {
      "vhf:constraintCompliance": 0.96,
      "vhf:macroAdherence": { "daily": 0.91 },
      "vhf:varietyScore": 0.87,
      "vhf:allergenViolations": 0,
      "vhf:estimatedCostPerWeek": 52.50
    }
  }]
}
```

---

## Adding a New Client Persona

Add an entry to `test-personas.jsonld`:

```jsonld
{
  "@id": "client:tp-013",
  "@type": ["client:Client"],
  "name": "Full Name",
  "givenName": "First",
  "familyName": "Last",
  "client:hasProfile": {
    "weight": { "value": 72, "unit": "kg" },
    "activityLevel": "moderately_active"
  },
  "client:hasMacroTarget": {
    "dailyCalories": 1800,
    "proteinGrams": 140,
    "carbsGrams": 180,
    "fatsGrams": 60
  },
  "client:followsDiet": [{ "@id": "diet:mediterranean" }],
  "client:hasGoal": [{ "@id": "client:goal-weight-loss" }],
  "client:hasAllergen": []
}
```

No code changes needed — the app filters `@graph` nodes by type on load.

---

## Adding a New Recipe

Add an entry to `test-recipes.jsonld`. Include `nutrition` for recipe card badges:

```jsonld
{
  "@id": "recipe:r-031",
  "@type": ["recipe:Recipe", "Recipe"],
  "name": "Recipe Name",
  "recipeCategory": "Dinner",
  "recipeCuisine": "British",
  "prepTime": "PT15M",
  "cookTime": "PT20M",
  "recipeYield": "2 servings",
  "difficulty": "easy",
  "recipe:costPerServing": "GBP 2.50",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "380 kcal",
    "proteinContent": "35g",
    "carbohydrateContent": "30g",
    "fatContent": "12g",
    "fiberContent": "6g"
  },
  "recipeIngredient": ["ingredient 1", "ingredient 2"],
  "recipe:suitableForDietType": [{ "@id": "diet:gluten-free" }]
}
```

---

## Updating Brand Tokens

Tokens can be updated at two levels:

### Level 1 — Skeleton ZoneComponent (highest priority)

Edit `application/vhf-app-skeleton-v1.0.0.jsonld`, find `cmp-vhf-context-bar`, update `ds:tokenOverrides`:

```jsonld
{
  "@id": "cmp:cmp-vhf-context-bar",
  "@type": "ds:ZoneComponent",
  "ds:tokenOverrides": {
    "--ds-color-primary": "#007c74",
    "--ds-color-secondary": "#f16a21"
  }
}
```

### Level 2 — DS-ONT Instance JSONLD

Edit `instance-data/tokens/VHF-DESIGN-SYSTEM-ONT/vhf-viridian-ds-instance-v1.0.0.jsonld`. Update `ds:tokenValue` on the relevant `ds:DesignToken` node.

### Level 3 — viewer.css fallbacks

Edit `application/css/viewer.css` `:root` block. These are fallbacks only — overridden by Levels 1 and 2 at runtime.

---

## Deployment

### GitHub Pages (Hosted)

All pushes to `main` are automatically served. No build step. URL:
```
https://ajrmooreuk.github.io/pfi-vhf-nutrition-app-dev/application/browser-viewer.html
```

Cache behaviour: GitHub Pages CDN caches aggressively. The app bypasses this with `?_t=<timestamp>` on all JSONLD fetches and `cache: 'no-store'`. Expect 1–2 min delay after push.

### Promotion Pipeline (Epic 1 — pending PAT setup)

When Epic 1 F1.4 is complete, the repo has a promotion workflow (`promote.yml`):
```
dev → test → prod
```
See [Epic 1 Status](#epic-1-pfi-vhf-hub-and-spoke-instance-setup) — requires `PROMOTION_PAT` secret.

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Loading spinner never goes away | JSONLD fetch failed | Check browser console for 404; verify HTTP server started from repo root |
| No clients in dashboard | `test-personas.jsonld` 404 | Check path `../instance-data/...` resolves from server root |
| "No plan available" for all clients | Plan files 404 or planFiles array empty | Check `PATHS.planFiles` in app.js; check file exists in generated-plans/ |
| Brand tokens wrong colour | token-bridge.js not loading | Check console for `[tokens]` log; verify DS-ONT JSONLD path |
| Nav bar empty | Skeleton load failed | Check console for `[skeleton]` log; verify skeleton JSONLD path |
| App shell hidden (white screen) | JS error before hideLoading() | Open browser DevTools → Console → fix error |
| CORS errors | Opened HTML directly as file:// | Must serve via HTTP server; file:// blocks ES module fetches |

---

## Console Log Reference

The app logs its init sequence to the browser console. Expected output on successful load:

```
[skeleton] Loaded: 8 zones, 6 nav items, 12 actions
[tokens] 12 token overrides from skeleton
[tokens] Loaded 8 token overrides from DS-ONT
[tokens] Applied 12 CSS custom properties
[skeleton] Nav rendered: 6 items
[app] Loaded 12 personas
[app] Loaded 30 recipes
[app] Loaded 1 plans
[app] VHF ready — PFC Platform v1.0.0
```

---

*Generated: 2026-03-09 · VHF Nutrition Coaching App · `pfi-vhf-nutrition-app-dev`*
