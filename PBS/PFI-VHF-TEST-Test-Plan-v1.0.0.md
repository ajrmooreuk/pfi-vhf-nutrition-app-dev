# PFI-VHF-TEST: Test Plan

**Product Code:** PFI-VHF
**Document Type:** TEST — Test Plan
**Version:** v1.0.0
**Date:** 2026-03-09
**Status:** Active
**Epic Refs:** Epics 2, 4, 5 · VHF Nutrition Coaching App
**Author:** Design Director + Claude Code
**Related:** [PFI-VHF-ARCH-Application-Architecture-Guide-v1.0.0.md](ARCHITECTURE/PFI-VHF-ARCH-Application-Architecture-Guide-v1.0.0.md)

---

## Test Strategy

### Approach

The VHF app is a **zero-build-step browser application** with no existing automated test framework. This test plan defines:

1. **Smoke Tests** — quick checklist to verify the app loads and core data is present
2. **Acceptance Criteria Validation** — per-feature AC tests mapped to GitHub issues
3. **Zone Render Tests** — functional tests for each of the 8 zones
4. **Token Bridge Tests** — verify Viridian brand tokens applied correctly
5. **Regression Checklist** — run after every push to main

### Test Environments

| Environment | URL | When to Test |
|-------------|-----|-------------|
| Local HTTP server | `http://localhost:8080/application/browser-viewer.html` | During development |
| GitHub Pages | https://ajrmooreuk.github.io/pfi-vhf-nutrition-app-dev/application/browser-viewer.html | After every push (allow 1–2 min) |

### Browser Coverage

| Browser | Required | Notes |
|---------|:--------:|-------|
| Chrome (latest) | ✅ | Primary test browser |
| Firefox (latest) | ✅ | Secondary |
| Safari (macOS latest) | ✅ | iOS compatibility proxy |
| Edge (latest) | Optional | Chromium-based, covered by Chrome |

---

## T1: Smoke Tests

Run after every deploy. Pass/fail each item. Expected: all ✅ in < 30 seconds.

| # | Test | Expected Result | Pass? |
|---|------|----------------|-------|
| T1.01 | Open app URL | Loading spinner visible, then app shell appears | |
| T1.02 | Console errors | Zero red errors in DevTools console | |
| T1.03 | Console log sequence | `[skeleton] Loaded: 8 zones` visible | |
| T1.04 | Console log sequence | `[tokens] Applied X CSS custom properties` visible | |
| T1.05 | Console log sequence | `[app] Loaded 12 personas` visible | |
| T1.06 | Console log sequence | `[app] Loaded 30 recipes` visible | |
| T1.07 | Console log sequence | `[app] Loaded 1 plans` visible | |
| T1.08 | Dashboard visible | Client dashboard renders with stat cards | |
| T1.09 | Viridian brand | Header/buttons are teal (`#007c74`), not grey | |
| T1.10 | PT Sans font | Body text uses PT Sans (check DevTools → Computed → font-family) | |

---

## T2: Epic 2 Acceptance Criteria

**Status: All passed (Epic 2 closed)**

| AC | Test | Expected | Status |
|----|------|----------|--------|
| E2.1 | Inspect Network tab — JSONLD requests | 3+ JSONLD files fetched on load | ✅ |
| E2.2 | Check zone IDs | `document.getElementById('zone-Z-VHF-001')` returns element | ✅ |
| E2.3 | Nav renders | 6 buttons visible in nav bar | ✅ |
| E2.4 | Actions wired | Click any nav button — zone changes | ✅ |
| E2.5 | Zone show/hide | Dashboard shows, others hidden on load | ✅ |
| E2.6 | Default zone | Z-VHF-001 visible, Z-VHF-002 through 008 hidden | ✅ |
| E2.7 | Live demo | GitHub Pages URL loads successfully | ✅ |

---

## T3: Epic 4 — Token Bridge Tests

### T3.1 Token Application Test

```js
// In browser console after load:
const root = getComputedStyle(document.documentElement);
const tests = {
  'Primary colour':    root.getPropertyValue('--ds-color-primary').trim() === '#007c74',
  'Secondary colour':  root.getPropertyValue('--ds-color-secondary').trim() === '#f16a21',
  'Font family':       root.getPropertyValue('--ds-font-family').includes('PT Sans'),
  'Spacing md':        root.getPropertyValue('--ds-spacing-md').trim() === '1rem',
  'Radius lg':         root.getPropertyValue('--ds-radius-lg').trim() === '0.75rem',
};
Object.entries(tests).forEach(([k, v]) => console.log(v ? '✅' : '❌', k));
```

| # | Token | Expected Value | Pass? |
|---|-------|---------------|-------|
| T3.01 | `--ds-color-primary` | `#007c74` | |
| T3.02 | `--ds-color-secondary` | `#f16a21` | |
| T3.03 | `--ds-color-primary-light` | `#e6f4f3` | |
| T3.04 | `--ds-surface-default` | `#ffffff` | |
| T3.05 | `--ds-font-family` | Contains `PT Sans` | |
| T3.06 | `--ds-spacing-md` | `1rem` | |
| T3.07 | `--ds-radius-lg` | `0.75rem` | |

### T3.2 Token Priority Test

1. Manually add a conflicting value to `vhf-viridian-ds-instance-v1.0.0.jsonld` (change `color-primary` to `#ff0000`)
2. Reload — verify primary is `#007c74` (skeleton override wins)
3. Revert change

---

## T4: Epic 5 — Feature Acceptance Criteria

### T4.1 F5.1 Dashboard Zone

| AC | Test Steps | Expected | Pass? |
|----|-----------|----------|-------|
| AC1: 12 personas display | Count client cards on dashboard | 12 cards visible | |
| AC2: Plan status badges | Check each card has a badge (No plan / Draft / Pending / Approved / Active) | Badges visible with correct colours | |
| AC3: Avg kcal stat card | Look at dashboard stat cards | 5th stat card shows numeric value | |
| AC4: Default visible | Reload page — no navigation needed | Dashboard is first view | |

### T4.2 F5.2 Meal Plan Viewer Zone

| AC | Test Steps | Expected | Pass? |
|----|-----------|----------|-------|
| AC1: Select Sarah Mitchell | Click "Sarah Mitchell" card on dashboard | Meal plan viewer opens | |
| AC2: Plan status badge | Check plan viewer header | Badge shows "Pending" in blue | |
| AC3: Dynamic week tabs | Count week tabs | 4 tabs (Week 1–4) generated from plan data | |
| AC4: Week 1 renders | Click Week 1 tab | 7 day cards with meals visible | |
| AC5: Navigate weeks | Click Week 2, 3, 4 | Grid updates for each week | |
| AC6: Approve button | Click Approve | Badge changes to "Approved" (green) | |
| AC7: Shopping List button | Click "Shopping List" | Shopping list zone opens | |
| AC8: Quality Report button | Click "Quality Report" | Quality dashboard zone opens | |
| AC9: Back to dashboard | Click × (close) | Dashboard becomes visible | |

### T4.3 F5.3 Recipe Browser Zone

| AC | Test Steps | Expected | Pass? |
|----|-----------|----------|-------|
| AC1: Nav opens recipe browser | Click "Recipes" nav button | Recipe browser zone opens | |
| AC2: All 30 recipes visible | Count visible recipe cards | 30 cards | |
| AC3: Nutrition badges | Inspect first recipe card | Green "kcal" badge and blue "protein" badge visible | |
| AC4: Search — match | Type "chicken" in search | Filtered list of chicken recipes | |
| AC5: Search — no match | Type "zzz" in search | Count shows "0 recipes matching 'zzz'" | |
| AC6: Search — clear | Clear search box | All 30 recipes return | |
| AC7: Recipe detail panel | Click any recipe card | Detail panel opens (right column) | |
| AC8: Detail — name | Check detail panel | Recipe name shown as heading | |
| AC9: Detail — nutrition | Check detail panel | Nutrition grid: kcal, protein, carbs, fat, fibre | |
| AC10: Detail — ingredients | Scroll detail panel | Ingredient list visible | |
| AC11: Detail — diet tags | Check detail panel | Diet suitability tags visible | |
| AC12: Close detail | Click × on detail panel | Panel closes, card deselected | |

### T4.4 F5.4 Shopping List Zone

| AC | Test Steps | Expected | Pass? |
|----|-----------|----------|-------|
| AC1: Open from plan viewer | Select Sarah Mitchell → click "Shopping List" | Shopping list zone opens | |
| AC2: Aisle grouping | Inspect list | Items grouped by aisle (e.g. "Produce", "Meat & Fish") | |
| AC3: Items visible | Count items | Items from Week 1 shopping list visible | |
| AC4-TBD: Check-off | Click an item | *(Decision D2 pending — check-off not yet implemented)* | TBD |

### T4.5 F5.5 Quality Dashboard Zone

| AC | Test Steps | Expected | Pass? |
|----|-----------|----------|-------|
| AC1: Open from plan viewer | Select Sarah Mitchell → click "Quality Report" | Quality dashboard zone opens | |
| AC2: Constraint compliance bar | Inspect rendered bars | Green bar with % value visible | |
| AC3: Macro adherence bar | Inspect rendered bars | Bar with % value visible | |
| AC4: Variety score bar | Inspect rendered bars | Bar with score visible | |
| AC5: Allergen violations | Look for allergen row | "✓ None" (green) if 0 violations | |
| AC6: Weekly cost | Look for cost row | "£XX.XX" format visible | |

---

## T5: Zone Functional Tests

### T5.1 Zone Show/Hide/Toggle

```js
// Manual test in console:
import('/application/js/skeleton-loader.js').then(m => {
  m.showZone('Z-VHF-003');   // should show profile panel
  m.hideZone('Z-VHF-003');   // should hide it
  m.toggleZone('Z-VHF-003'); // should show again
});
```

| Test | Expected |
|------|----------|
| `showZone('Z-VHF-003')` | Element visible, `zone-visible` class added |
| `hideZone('Z-VHF-003')` | Element hidden, `zone-hidden` class added |
| `toggleZone('Z-VHF-003')` | Toggles correctly |
| `activateZone('Z-VHF-001')` | Z-VHF-001 visible, all other mainZones hidden |

### T5.2 Zone Overlap Test

| Test | Steps | Expected |
|------|-------|----------|
| Meal plan + Coach panel | Open meal plan, then open coach panel | Both zones visible (different sides) |
| Chat overlay | Open chat while any zone is active | Chat floats over without hiding content |
| Close overlay | Click × on chat | Chat hides, content zones unaffected |

---

## T6: Nav Bar Tests

| Test | Steps | Expected |
|------|-------|----------|
| Nav renders from skeleton | Reload page | 6 buttons in nav bar, labels match skeleton `ds:label` |
| Dashboard button | Click "Dashboard" | Z-VHF-001 shown, others hidden |
| Meal Plans button | Click "Meal Plans" | Meal plan viewer opens (or prompt if no plan) |
| Recipes button | Click "Recipes" | Recipe browser opens |
| Coach button | Click "Coach" | Coach panel opens |
| Chat toggle | Click "Nutrition Chat" | Chat overlay opens; click again closes |
| aria-pressed | Click any toggle button | `aria-pressed` attribute updates correctly |

---

## T7: Responsive Layout Tests

| Viewport | Test | Expected |
|----------|------|----------|
| 1280px+ | Full layout | All elements visible, no overflow |
| 1024px | Reduced width | Day grid wraps gracefully |
| 768px (tablet) | Nav + content | Nav stays accessible, zones scroll |
| 375px (mobile) | Not a primary target | App degrades gracefully |

---

## T8: GitHub Pages Regression Checklist

Run after every push to `main` (allow 1–2 min for CDN):

- [ ] Page loads without spinner hanging
- [ ] No 404 errors in Network tab
- [ ] 12 client cards render
- [ ] Sarah Mitchell card shows "Pending" badge
- [ ] Click Sarah Mitchell → meal plan viewer opens
- [ ] Week 1 shows 7 day cards with meals
- [ ] Click Recipes → 30 recipe cards
- [ ] Click any recipe → detail panel opens with nutrition
- [ ] Brand is Viridian teal, not default blue/grey

---

## Test Results Log

| Date | Version | Environment | T1 | T2 | T3 | T4 | T5 | T6 | T7 | Notes |
|------|---------|-------------|----|----|----|----|----|----|-------|-------|
| 2026-03-09 | v1.0.0 | GH Pages | ✅ | ✅ | — | Partial | — | — | — | T4.4 check-off pending; T3 not run |

---

## Planned Test Improvements (Post-MVP)

| # | Item | Priority | Epic |
|---|------|----------|------|
| TEST-01 | Vitest browser tests for zone show/hide functions | P2 | Epic 6 |
| TEST-02 | Playwright E2E smoke test for GH Pages | P2 | Epic 6 |
| TEST-03 | Automated token value assertions | P3 | Epic 4 |
| TEST-04 | JSONLD schema validation tests (OAA compliance) | P2 | Epic 3 |

---

*Generated: 2026-03-09 · VHF Nutrition Coaching App · `pfi-vhf-nutrition-app-dev`*
