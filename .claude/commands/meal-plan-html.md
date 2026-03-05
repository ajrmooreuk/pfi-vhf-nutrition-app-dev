# /meal-plan-html — Render Meal Plan as Single-Page HTML App

## Arguments

$ARGUMENTS — Client persona ID (e.g. `tp-001`)

## Context

This skill renders a saved 30-day meal plan as a single-page HTML file styled with the VHF Viridian Design System tokens from `VHF-DS-ONT v1.1.0`. The output is a self-contained HTML file (no external dependencies) that the coach can open in any browser, print, or send to a client.

**This is a short-term output skill** — to be replaced by the production app UI. Can be removed once the Supabase + Figma Make frontend is live.

## Data Sources

Read these files:

1. **Saved plan**: `PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/generated-plans/meal-plan-{clientId}-*.jsonld` (most recent)
2. **Design system tokens**: `PBS/ONTOLOGIES/VHF-DESIGN-SYSTEM-ONT/vhf-viridian-ds-instance-v1.0.0.jsonld`

If no plan exists for the client: "No plan found for '{clientId}'. Run `/meal-plan {clientId}` first."

## VHF Design System Token Map

Extract these tokens from the DS ontology and map to CSS custom properties:

```css
:root {
  /* Primary — Viridian */
  --vhf-primary-subtle: #9dfff5;
  --vhf-primary-lighter: #00b0a5;
  --vhf-primary-default: #017c75;
  --vhf-primary-darker: #00423d;
  --vhf-primary-border: #017c75;
  --vhf-primary-text: #002f2b;

  /* Secondary — Warm Orange */
  --vhf-secondary-subtle: #fff3ee;
  --vhf-secondary-lighter: #ffb48e;
  --vhf-secondary-default: #ea923a;
  --vhf-secondary-darker: #834a22;
  --vhf-secondary-text: #553016;

  /* Success — Sky Blue */
  --vhf-success-subtle: #e6f8fd;
  --vhf-success-default: #49bad4;
  --vhf-success-darker: #0b3f49;
  --vhf-success-text: #0b3f49;

  /* Warning — Chartreuse */
  --vhf-warning-subtle: #f8ffe6;
  --vhf-warning-default: #cbea00;
  --vhf-warning-text: #414e10;

  /* Error — Red-Orange */
  --vhf-error-subtle: #ffeae9;
  --vhf-error-default: #e54525;
  --vhf-error-text: #5a1710;

  /* Information — Sage Jade */
  --vhf-info-subtle: #f2f6f2;
  --vhf-info-default: #a0afa1;
  --vhf-info-text: #353c36;

  /* Accent — Coral Orange */
  --vhf-accent-subtle: #ffefec;
  --vhf-accent-default: #f16a21;
  --vhf-accent-text: #5c2310;

  /* Neutral */
  --vhf-neutral-bg: #ffffff;
  --vhf-neutral-bg-alt: #f7f6f8;
  --vhf-neutral-surface: #f2f1f1;
  --vhf-neutral-border: #d9d9d9;
  --vhf-neutral-border-dark: #686462;
  --vhf-neutral-text-title: #1e1d1d;
  --vhf-neutral-text-body: #322f2f;
  --vhf-neutral-text-caption: #4b4847;
  --vhf-neutral-text-disabled: #ccc7c6;

  /* Typography */
  --vhf-font-headings: 'PT Sans', sans-serif;
  --vhf-font-body: 'PT Sans', sans-serif;
  --vhf-font-captions: 'Open Sans', sans-serif;
  --vhf-font-size-5xl: 40px;
  --vhf-font-size-4xl: 36px;
  --vhf-font-size-3xl: 32px;
  --vhf-font-size-2xl: 28px;
  --vhf-font-size-xl: 24px;
  --vhf-font-size-lg: 20px;
  --vhf-font-size-base: 16px;

  /* Spacing */
  --vhf-space-xxs: 2px;
  --vhf-space-xs: 4px;
  --vhf-space-sm: 8px;
  --vhf-space-md: 12px;
  --vhf-space-lg: 20px;
  --vhf-space-xl: 30px;

  /* Radius */
  --vhf-radius-xs: 4px;
  --vhf-radius-sm: 8px;
  --vhf-radius-md: 12px;
  --vhf-radius-lg: 20px;
  --vhf-radius-xl: 24px;
  --vhf-radius-full: 999px;
}
```

## HTML Structure

Generate a single self-contained `.html` file with embedded CSS and JS (no external deps except Google Fonts for PT Sans + Open Sans). Save to:

`PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/generated-plans/meal-plan-{clientId}-{date}.html`

### Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  VHF Logo Area (viridian bar)                           │
│  "Viridian Health & Fitness — 30-Day Meal Plan"         │
├─────────────────────────────────────────────────────────┤
│  CLIENT PROFILE CARD                                     │
│  Name | Goal | Diets | Allergens | Conditions            │
│  Macro Targets: kcal / protein / carbs / fat             │
├─────────────────────────────────────────────────────────┤
│  QUALITY DASHBOARD (grid of metric cards)                │
│  [Compliance] [Macros] [Variety] [Cost] [VSOM]           │
├─────────────────────────────────────────────────────────┤
│  WEEK TABS: [Week 1] [Week 2] [Week 3] [Week 4]         │
├─────────────────────────────────────────────────────────┤
│  DAY CARDS (7 per week tab)                              │
│  ┌──────────────────────────────────────────┐            │
│  │ Day 1 — Monday                           │            │
│  │ ┌──────┬──────┬──────┬──────┐            │            │
│  │ │Bkfst │Lunch │Dinner│Snack │  ← meal    │            │
│  │ │name  │name  │name  │name  │    cards    │            │
│  │ │cal/p │cal/p │cal/p │cal/p │            │            │
│  │ └──────┴──────┴──────┴──────┘            │            │
│  │ Day totals: cal | prot | carbs | fat      │            │
│  │ Variance bar (green/amber/red)            │            │
│  └──────────────────────────────────────────┘            │
│  [repeat x7 days]                                        │
├─────────────────────────────────────────────────────────┤
│  SHOPPING LIST (collapsible per week)                    │
│  Grouped by aisle with quantities                        │
├─────────────────────────────────────────────────────────┤
│  GENERATED RECIPES (if any, collapsible)                 │
│  Full recipe cards with ingredients + nutrition           │
├─────────────────────────────────────────────────────────┤
│  Footer: "Generated by VHF Nutrition Intelligence Agent" │
│  "Coach: James Kerby | Date: {date} | Status: Pending"  │
└─────────────────────────────────────────────────────────┘
```

### Component Styling Rules (using DS tokens)

**Header bar**: `background: var(--vhf-primary-default)`, white text, `font-family: var(--vhf-font-headings)`

**Client profile card**: `background: var(--vhf-neutral-bg)`, `border: 1px solid var(--vhf-neutral-border)`, `border-radius: var(--vhf-radius-md)`, `padding: var(--vhf-space-lg)`

**Metric cards** (quality dashboard):
- Compliance: `border-left: 4px solid var(--vhf-success-default)` if 100%, else `var(--vhf-error-default)`
- Macros: colour-code each macro variance — green (<5%), amber (5-10%), red (>10%)
- Variety: `border-left: 4px solid var(--vhf-info-default)`
- Cost: `border-left: 4px solid var(--vhf-secondary-default)`
- VSOM: `border-left: 4px solid var(--vhf-primary-default)`

**Week tabs**: Active tab `background: var(--vhf-primary-default)`, `color: white`. Inactive: `background: var(--vhf-neutral-surface)`, `color: var(--vhf-neutral-text-body)`

**Day cards**: `background: var(--vhf-neutral-bg)`, `border: 1px solid var(--vhf-neutral-border)`, `border-radius: var(--vhf-radius-sm)`

**Meal cards within day**:
- Breakfast: subtle tint `background: var(--vhf-secondary-subtle)` (warm morning)
- Lunch: `background: var(--vhf-success-subtle)` (fresh midday)
- Dinner: `background: var(--vhf-primary-subtle)` (viridian evening)
- Snack: `background: var(--vhf-info-subtle)` (light sage)

**Variance indicator**: horizontal bar showing daily macro hit vs target
- Within 5%: `var(--vhf-success-default)`
- 5-10%: `var(--vhf-warning-default)`
- Over 10%: `var(--vhf-error-default)`

**Shopping list**: collapsible `<details>` per week. Aisle headings in `font-weight: bold`, `color: var(--vhf-primary-darker)`

**Generated recipe cards**: `border: 2px dashed var(--vhf-accent-default)` to distinguish from database recipes. Label: "AI-Generated Recipe"

**Typography**:
- Page title: `var(--vhf-font-headings)`, `var(--vhf-font-size-3xl)`, `var(--vhf-neutral-text-title)`
- Section headings: `var(--vhf-font-headings)`, `var(--vhf-font-size-xl)`
- Body text: `var(--vhf-font-body)`, `var(--vhf-font-size-base)`, `var(--vhf-neutral-text-body)`
- Captions/labels: `var(--vhf-font-captions)`, `14px`, `var(--vhf-neutral-text-caption)`
- Nutrition numbers: `var(--vhf-font-captions)`, tabular-nums

**Print styles**: `@media print` — hide week tabs (show all weeks), remove background colours, ensure tables don't break across pages

### JavaScript (minimal, embedded)

- Week tab switching (show/hide week content divs)
- Shopping list `<details>` toggle
- Generated recipes `<details>` toggle
- No frameworks, no build step — vanilla JS only

## Output

1. Save HTML file to: `generated-plans/meal-plan-{clientId}-{date}.html`
2. Display to screen:
```
HTML plan rendered: generated-plans/meal-plan-{clientId}-{date}.html
Open in browser: open generated-plans/meal-plan-{clientId}-{date}.html
Styled with: VHF Viridian DS v1.1.0 ({N} tokens applied)
```
3. Offer to open it: run `open {filepath}` to launch in default browser
