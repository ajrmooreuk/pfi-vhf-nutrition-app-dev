# /meal-plan-view — View a Saved VHF Meal Plan

## Arguments

$ARGUMENTS — Client ID and optional scope, in the format: `{clientId}` or `{clientId} {scope}`

Scope options:
- (no scope) — Show the quality summary + week-by-week overview
- `week-1` through `week-4` — Show detailed day-by-day tables for that week + shopping list
- `day-3` — Show a single day in detail (day 1-30)
- `shopping` — Show all 4 weekly shopping lists consolidated
- `recipes` — List the full recipe pool (matched + generated) with nutrition data
- `quality` — Show the full quality report with VSOM alignment

## Data Source

Read the most recent plan file matching the client ID from:
`PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/generated-plans/meal-plan-{clientId}-*.jsonld`

If multiple files exist for the same client, use the most recent (by date in filename).
If no plan file exists: "No plan found for '{clientId}'. Run /meal-plan {clientId} first."

## Output Formats

### Default (no scope) — Overview

```markdown
# Meal Plan: {Client Name} ({clientId})
**Created**: {date} | **Status**: {planStatus} | **Goal**: {goal}
**Diets**: {diets} | **Allergens**: {allergens}

## Macro Targets
| | Calories | Protein | Carbs | Fat |
|---|---|---|---|---|
| Daily Target | X kcal | Xg | Xg | Xg |
| 30-Day Average | X kcal | Xg | Xg | Xg |
| Variance | X% | X% | X% | X% |

## Week-by-Week Summary
| Week | Avg Cal | Avg Prot | Avg Carbs | Avg Fat | Cost | Variance |
|------|---------|----------|-----------|---------|------|----------|
| 1 | ... | ... | ... | ... | £... | ...% |
| 2 | ... | ... | ... | ... | £... | ...% |
| 3 | ... | ... | ... | ... | £... | ...% |
| 4 | ... | ... | ... | ... | £... | ...% |

## Quality Score
- Constraint compliance: X%
- Allergen violations: X
- Variety score: X%
- Protein sources: X

Use `/meal-plan-view {clientId} week-1` to drill into a specific week.
```

### week-N — Detailed Week View

```markdown
# Week {N}: {Client Name}

### Day {X} — {DayName}
| Meal | Recipe | Portion | Cal | Prot | Carbs | Fat |
|------|--------|---------|-----|------|-------|-----|
| Breakfast | {name} | {scale}x | ... | ... | ... | ... |
| Lunch | {name} | {scale}x | ... | ... | ... | ... |
| Dinner | {name} | {scale}x | ... | ... | ... | ... |
| Snack | {name} | {scale}x | ... | ... | ... | ... |
| **Day Total** | | | **X** | **Xg** | **Xg** | **Xg** |
| Variance | | | X% | X% | X% | X% |

[repeat for each day in the week]

### Week {N} Shopping List
**Estimated cost: £X.XX**

**Fresh Meat & Fish**
- {item} — {quantity}

**Fresh Fruit & Vegetables**
- {item} — {quantity}

**Chilled & Dairy**
- {item} — {quantity}

[... etc for all aisles with items]

### Week {N} Averages
| | Calories | Protein | Carbs | Fat |
|---|---|---|---|---|
| Average | X | Xg | Xg | Xg |
| Target | X | Xg | Xg | Xg |
| Variance | X% | X% | X% | X% |
```

### day-N — Single Day Detail

```markdown
# Day {N} ({DayName}, Week {W}): {Client Name}

| Meal | Recipe | Portion | Calories | Protein | Carbs | Fat | Fibre | Sodium |
|------|--------|---------|----------|---------|-------|-----|-------|--------|
| Breakfast | {name} | {scale}x | ... | ... | ... | ... | ... | ... |
| Lunch | {name} | {scale}x | ... | ... | ... | ... | ... | ... |
| Dinner | {name} | {scale}x | ... | ... | ... | ... | ... | ... |
| Snack | {name} | {scale}x | ... | ... | ... | ... | ... | ... |
| **Total** | | | **X** | **Xg** | **Xg** | **Xg** | **Xg** | **Xmg** |

### Ingredients Needed (this day only)
**Breakfast — {recipe name}**
- {ingredient} — {quantity scaled}

**Lunch — {recipe name}**
- {ingredient} — {quantity scaled}

[... etc]

### Conditional Notes
- {any substitution notes for conditional recipe matches}
```

### shopping — All Shopping Lists

```markdown
# Shopping Lists: {Client Name} — 30-Day Plan

## Week 1 (Est. £X.XX)
[grouped by aisle]

## Week 2 (Est. £X.XX)
[grouped by aisle]

## Week 3 (Est. £X.XX)
[grouped by aisle]

## Week 4 (Est. £X.XX)
[grouped by aisle]

## 30-Day Total: £X.XX (avg £X.XX/week)
```

### recipes — Recipe Pool

```markdown
# Recipe Pool: {Client Name}

## Matched from Database ({X} recipes)
| ID | Recipe | Category | Cal | Prot | Carbs | Fat | Cost | Themes | Conditional? |
|----|--------|----------|-----|------|-------|-----|------|--------|-------------|
| R-001 | ... | Dinner | ... | ... | ... | ... | £... | ... | ... |

## Generated to Fill Gaps ({Y} recipes)
| ID | Recipe | Category | Cal | Prot | Carbs | Fat | Cost | Themes |
|----|--------|----------|-----|------|-------|-----|------|--------|
| gen-001-... | ... | ... | ... | ... | ... | ... | £... | ... |

## Coverage by Category
| Category | Matched | Generated | Total | Minimum |
|----------|---------|-----------|-------|---------|
| Breakfast | X | X | X | 4 |
| Lunch | X | X | X | 5 |
| Dinner | X | X | X | 5 |
| Snack | X | X | X | 3 |
```

### quality — Full Quality Report

```markdown
# Quality Report: {Client Name} — 30-Day Plan

## Constraint Compliance
- Diet compliance: X% (X/120 meals compliant)
- Allergen violations: X (target: 0)
- Medical condition adherence: {details}

## Macro Adherence
| Metric | Calories | Protein | Carbs | Fat |
|--------|----------|---------|-------|-----|
| Target | X | Xg | Xg | Xg |
| 30-day avg | X | Xg | Xg | Xg |
| Variance | X% | X% | X% | X% |
| Days >10% off | X/30 | X/30 | X/30 | X/30 |

## Variety
- Unique recipes used: X
- Total meal slots: 120
- Variety score: X%
- Protein sources: X distinct (target: >=5)
- Cuisines covered: X

## Cost
- Average weekly cost: £X.XX
- Total 30-day cost: £X.XX
- Cost per meal: £X.XX

## VSOM Alignment
| Layer | Target | Achieved | Status |
|-------|--------|----------|--------|
| Vision | {goal} | {assessment} | ✓/✗ |
| Strategy | {diets + themes} | {assessment} | ✓/✗ |
| Objectives | {macro targets} | {assessment} | ✓/✗ |
| Metrics | {adherence, variety, cost} | {assessment} | ✓/✗ |

## Warnings & Recommendations
- {list of any issues, conditional substitutions, or coach review items}
```
