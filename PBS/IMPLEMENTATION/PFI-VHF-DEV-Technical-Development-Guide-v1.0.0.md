# PFI-VHF-DEV: Technical Development Guide

**Product Code:** PFI-VHF
**Document Type:** DEV — Technical Development Guide
**Version:** v1.0.0
**Date:** 2026-03-09
**Status:** Active
**Epic Refs:** Epic 2 (#26) · Epic 4 (#28) · Epic 5 (#29)
**Author:** Design Director + Claude Code
**Related:** [PFI-VHF-ARCH-Application-Architecture-Guide-v1.0.0.md](../ARCHITECTURE/PFI-VHF-ARCH-Application-Architecture-Guide-v1.0.0.md)

---

## Prerequisites

- Modern browser (Chrome 90+, Firefox 88+, Safari 15+) — native ES modules required
- HTTP server (Python, Node.js, or VS Code Live Server)
- Text editor / Claude Code
- Git access to `ajrmooreuk/pfi-vhf-nutrition-app-dev`

No npm, no build tools, no dependencies to install.

---

## Module Reference

### state.js — Shared Singleton

```js
import { state } from './state.js';
```

| Field | Type | Description |
|-------|------|-------------|
| `state.skeleton` | Object | Parsed skeleton (zones, navItems, etc.) |
| `state.zoneRegistry` | `Map<string, {zone, components[]}>` | Keyed by `ds:zoneId` |
| `state.navLayerRegistry` | `Map<string, {layer, items[]}>` | Keyed by `ds:layerId` |
| `state.actionIndex` | `Map<string, Action>` | Keyed by `@id` and `ds:actionId` |
| `state.visibleZones` | `Set<string>` | Currently visible zone IDs |
| `state.activeClient` | Object\|null | Selected persona JSONLD node |
| `state.activePlan` | Object\|null | Selected plan JSONLD |
| `state.personas` | Array | All loaded client nodes |
| `state.recipes` | Array | All loaded recipe nodes |
| `state.plans` | Array | All loaded plan JSONLD objects |
| `state.tokenOverrides` | Object | Applied `{ '--ds-css-var': 'value' }` map |
| `state.isLoading` | boolean | True until `hideLoading()` called |

**Rule:** All modules read/write `state` directly. No getter/setter wrappers.

---

### skeleton-loader.js — Zone & Nav Framework

```js
import {
  loadAppSkeleton,       // fetch + parse + build registries
  renderNavFromSkeleton, // render nav into container element
  initZoneVisibility,    // apply defaultVisible from skeleton
  showZone,              // show a zone by ID
  hideZone,              // hide a zone by ID
  toggleZone,            // flip zone visibility
  activateZone,          // show one, hide all mainZones
} from './skeleton-loader.js';
```

#### Adding a New Zone

1. **Skeleton JSONLD** — add `ds:AppZone` node to `vhf-app-skeleton-v1.0.0.jsonld`:

```jsonld
{
  "@id": "zone:Z-VHF-009",
  "@type": "ds:AppZone",
  "ds:zoneId": "Z-VHF-009",
  "ds:zoneName": "New Zone Name",
  "ds:zoneType": "Sliding",
  "ds:slideDirection": "right",
  "ds:defaultVisible": false,
  "ds:renderOrder": 9
}
```

2. **HTML** — add zone section to `browser-viewer.html`:

```html
<section
  id="zone-Z-VHF-009"
  class="vhf-zone zone-sliding from-right zone-hidden"
  data-zone-id="Z-VHF-009"
  data-zone-type="Sliding"
  aria-label="New Zone"
>
  <div class="zone-panel-header">
    <span class="zone-panel-title">New Zone</span>
    <button class="zone-close-btn" onclick="window.VHF_ACTIONS?.showDashboard()">×</button>
  </div>
  <div id="new-zone-content" style="padding: var(--ds-spacing-md)">
    <!-- Populated by nav-actions.js -->
  </div>
</section>
```

3. **CSS** — add zone-specific styles in `viewer.css`:

```css
#zone-Z-VHF-009 {
  padding: var(--ds-spacing-md);
  overflow-y: auto;
}
```

4. **If it's a main content zone** — add its ID to `mainZones` in `skeleton-loader.js`:

```js
const mainZones = ['Z-VHF-001', 'Z-VHF-002', ..., 'Z-VHF-009'];
```

---

### nav-actions.js — Action Handlers

All 12 action handlers are in `VHF_ACTIONS`. The pattern for adding a new action:

#### Adding a New Action

1. **Skeleton JSONLD** — add `ds:Action` node and reference it from a `ds:NavItem`:

```jsonld
{
  "@id": "action:showNewZone",
  "@type": "ds:Action",
  "ds:actionId": "showNewZone",
  "ds:actionLabel": "New Zone",
  "ds:targetZone": { "@id": "zone:Z-VHF-009" }
}
```

2. **nav-actions.js** — add the function and export it:

```js
function showNewZone() {
  _renderNewZone();
  showZone('Z-VHF-009');
}

function _renderNewZone() {
  const container = document.getElementById('new-zone-content');
  if (!container) return;
  container.innerHTML = `<p>Content here</p>`;
}

export const VHF_ACTIONS = {
  // ... existing actions ...
  showNewZone,   // ← add here
};
```

3. **Nav item** — add to skeleton JSONLD:

```jsonld
{
  "@id": "navItem:ni-l4-vhf-009",
  "@type": "ds:NavItem",
  "ds:itemId": "ni-l4-vhf-009",
  "ds:label": "New Zone",
  "ds:itemType": "Button",
  "ds:action": "showNewZone",
  "ds:renderOrder": 7,
  "ds:belongsToLayer": { "@id": "navLayer:L4-VHF" },
  "ds:cascadeTier": "PFI-VHF"
}
```

The nav button will be rendered automatically by `renderNavFromSkeleton()` and the click handler resolves `window.VHF_ACTIONS.showNewZone` at click time.

---

### token-bridge.js — CSS Token System

#### Adding a New Token

1. Add the token name → CSS var mapping to `TOKEN_NAME_TO_CSS`:

```js
const TOKEN_NAME_TO_CSS = {
  // ... existing ...
  'shadow-md': '--ds-shadow-md',   // ← add here
};
```

2. Add the CSS var with fallback to `viewer.css` `:root`:

```css
:root {
  /* ... existing ... */
  --ds-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);   /* fallback */
}
```

3. Add `ds:DesignToken` node to the DS-ONT JSONLD if needed.

---

## CSS Custom Property Conventions

| Convention | Rule | Example |
|------------|------|---------|
| All design tokens | `--ds-*` prefix | `--ds-color-primary` |
| Colour tokens | `--ds-color-*` | `--ds-color-primary: #007c74` |
| Surface backgrounds | `--ds-surface-*` | `--ds-surface-subtle` |
| Text colours | `--ds-text-*` | `--ds-text-muted` |
| Borders | `--ds-border-*` | `--ds-border-default` |
| Typography | `--ds-font-*` | `--ds-font-family` |
| Spacing | `--ds-spacing-*` | `--ds-spacing-md` |
| Radius | `--ds-radius-*` | `--ds-radius-lg` |
| Shadows | `--ds-shadow-*` | `--ds-shadow-sm` |
| Transitions | `--ds-transition-*` | `--ds-transition-fast` |

**Never hardcode colour values in CSS rules.** Always use a `--ds-*` var. This ensures the token bridge can override them at runtime.

---

## JSONLD Field Name Reference

The app reads data from JSONLD files. Actual field names (confirmed from test data files):

### Client Personas (`test-personas.jsonld`)

| Field | Path | Notes |
|-------|------|-------|
| ID | `p['@id']` | e.g. `"client:tp-001"` |
| Name | `p.name` | Full name |
| Given name | `p.givenName` | First name |
| Family name | `p.familyName` | Last name |
| Weight | `p['client:hasProfile'].weight.value` | Number (kg) |
| Activity | `p['client:hasProfile'].activityLevel` | String |
| Calorie target | `p['client:hasMacroTarget'].dailyCalories` | Number |
| Protein target | `p['client:hasMacroTarget'].proteinGrams` | Number |
| Carbs target | `p['client:hasMacroTarget'].carbsGrams` | Number |
| Fat target | `p['client:hasMacroTarget'].fatsGrams` | Number |
| Diet types | `p['client:followsDiet']` | Array of `{ "@id": "diet:xxx" }` |
| Goals | `p['client:hasGoal']` | Array of `{ "@id": "client:goal-xxx" }` |
| Allergens | `p['client:hasAllergen']` | Array of `{ "@id": "client:allergen-xxx" }` |
| Restrictions | `p['client:hasDietaryRestriction']` | Array of strings |

### Recipes (`test-recipes.jsonld`)

| Field | Path | Notes |
|-------|------|-------|
| ID | `r['@id']` | e.g. `"recipe:r-001"` |
| Name | `r.name` | String |
| Category | `r.recipeCategory` | e.g. `"Dinner"` |
| Cuisine | `r.recipeCuisine` | e.g. `"British"` |
| Prep time | `r.prepTime` | ISO 8601 `"PT15M"` |
| Cook time | `r.cookTime` | ISO 8601 |
| Serves | `r.recipeYield` | e.g. `"2 servings"` |
| Difficulty | `r.difficulty` | `"easy"` / `"medium"` / `"hard"` |
| Cost | `r['recipe:costPerServing']` | `"GBP 2.80"` |
| Calories | `r.nutrition.calories` | `"380 kcal"` (string) |
| Protein | `r.nutrition.proteinContent` | `"42g"` (string) |
| Carbs | `r.nutrition.carbohydrateContent` | `"12g"` |
| Fat | `r.nutrition.fatContent` | `"18g"` |
| Ingredients | `r.recipeIngredient` | Array of strings |
| Diet types | `r['recipe:suitableForDietType']` | Array of `{ "@id": "diet:xxx" }` |

### Meal Plans (`generated-plans/*.jsonld`)

| Field | Path | Notes |
|-------|------|-------|
| Client link | `plan['meal:assignedToClient']['@id']` | Links to persona `@id` |
| Plan status | `plan['vhf:planStatus']` | `draft` / `pending` / `approved` / `active` / `completed` |
| Weeks | `plan['vhf:weeks']` | Array |
| Week label | `week['vhf:weekLabel']` or `week.weekLabel` | `"Week 1"` |
| Days | `week.days` | Array |
| Day of week | `day.dayOfWeek` | Full name: `"Monday"` |
| Meals | `day.meals` | Array |
| Meal type | `meal.mealType` | `"Breakfast"` / `"Lunch"` / `"Dinner"` / `"Snack"` |
| Recipe name | `meal.recipeName` | String |
| Meal calories | `meal.calories` | Number |
| Shopping list | `week.shoppingList` | Array of `{ aisle, items[] }` |
| Quality report | `plan['vhf:qualityReport']` | Object (see quality section) |

---

## ES Module Patterns

### Import conventions

```js
// Named exports — always use destructuring
import { state } from './state.js';
import { showZone, hideZone, activateZone } from './skeleton-loader.js';

// Never use default exports in this project
```

### Global window exposure

Only three things are intentionally global:
- `window.VHF_ACTIONS` — the action registry (set by app.js at end of init)
- `window.vhfSelectWeek` — week tab onclick handler
- `window.vhfDashboardSelectClient` — client card onclick handler

Other `window.*` functions (filter, send chat, select recipe, etc.) are set in `nav-actions.js` for inline onclick attributes in HTML.

### Deferred action pattern

```js
// In skeleton-loader.js _createNavElement():
el.addEventListener('click', (e) => {
  e.preventDefault();
  const actions = window.VHF_ACTIONS;           // resolved at click time
  if (actions && typeof actions[action] === 'function') {
    actions[action](el);
  }
});
```

This avoids circular import issues between `skeleton-loader.js` and `nav-actions.js`.

---

## Common Development Tasks

### Inspect what data loaded

Open browser DevTools console and type:
```js
// Check loaded data
state.personas.length    // 12
state.recipes.length     // 30
state.plans.length       // 1

// Check zone registry
[...state.zoneRegistry.keys()]   // ['Z-VHF-001', 'Z-VHF-002', ...]

// Check active client/plan
state.activeClient
state.activePlan

// Check visible zones
[...state.visibleZones]          // ['Z-VHF-001']
```

### Trigger actions manually

```js
window.VHF_ACTIONS.showRecipeBrowser()
window.VHF_ACTIONS.showCoachPanel()
window.VHF_ACTIONS.showMealPlanViewer()
```

### Inspect applied tokens

```js
getComputedStyle(document.documentElement).getPropertyValue('--ds-color-primary')
// → ' #007c74'
state.tokenOverrides   // full map of applied tokens
```

---

## Code Quality Standards

- **No `var`** — use `const` / `let`
- **No unused parameters** — prefix with `_` if required by interface but unused
- **Template literals** for HTML generation — never string concatenation
- **`?.` optional chaining** for JSONLD field access (fields may be absent)
- **Fallbacks on all JSONLD reads** — e.g. `meal.recipeName || meal['vhf:recipeName'] || '—'`
- **No `console.error` in render helpers** — log warnings; the UI should degrade gracefully
- **No hardcoded colours** in CSS rules — use `--ds-*` vars

---

## Known Limitations (MVP)

| Limitation | Impact | Resolution |
|------------|--------|-----------|
| No automated tests | Manual AC validation only | Epic 6 test harness / Epic 9 skill chain |
| 1 of 12 clients has a plan | Dashboard shows 11 "No plan" badges | Generate 11 more plans |
| No state persistence | Selections lost on page reload | Deferred to Epic 8 (Supabase) |
| No auth/roles | `state.userRole = 'coach'` hardcoded | Epic 8 Supabase Auth |
| Shopping list check-off is UI-only | Not persisted | Epic 8 |
| `vhf:` namespace not fully migrated to `nut:` | OAA non-compliant | Epic 3 |

---

*Generated: 2026-03-09 · VHF Nutrition Coaching App · `pfi-vhf-nutrition-app-dev`*
