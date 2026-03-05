# /meal-plan-test — VHF Meal Plan Test Suite

## Arguments

$ARGUMENTS — Optional: `all` (default), `good` (9 good-data personas only), `poor` (3 poor-data only), or a single persona ID

## Context

This skill runs the full test matrix from the VHF-RMP-ONT traceability matrix against the `/meal-plan` generation pipeline. It validates that:
- Good-data personas produce compliant 30-day plans
- Poor-data personas are correctly rejected with specific errors
- All acceptance criteria from Epic 1 (#7) and F1.1 (#8) are met

## Data Sources

Read these files:

1. **Ontology**: `PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/VHF-Recipe-MealPlan-Ontology-v1.0.0.jsonld`
2. **Test Personas**: `PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/test-data/test-personas.jsonld`
3. **Test Recipes**: `PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/test-data/test-recipes.jsonld`
4. **Traceability Matrix**: `PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/test-data/TRACEABILITY-MATRIX.md`
5. **Generated Plans**: `PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/generated-plans/` (if plans already exist)

## Test Process

### Phase 1: Data Quality Validation (all 12 personas)

For each persona, validate the profile data and record:
- Data quality classification (good/poor)
- Any BLOCK or WARN errors found
- Whether the system correctly identifies poor data

Expected results from traceability matrix:
| ID | Name | Quality | Expected Outcome |
|---|---|---|---|
| tp-001 | Sarah Mitchell | good | PASS — generate plan |
| tp-002 | Raj Patel | good | PASS — generate plan |
| tp-003 | Fatima Al-Rashid | good | PASS — generate plan |
| tp-004 | Tom Jeffries | good | PASS — generate plan |
| tp-005 | Emma Chen | good | PASS — generate plan |
| tp-006 | David Goldstein | good | PASS — generate plan |
| tp-007 | Karen Whitfield | good | PASS — generate plan |
| tp-008 | Marcus Williams | poor | BLOCK — missing height, impossible macros |
| tp-009 | Priya Sharma | good | PASS — generate plan |
| tp-010 | Jake Thompson | poor | BLOCK — mutually exclusive diets |
| tp-011 | Linda Okafor | good | PASS — generate plan |
| tp-012 | Ben Fraser | poor | BLOCK — no goal, wrong units, incomplete |

### Phase 2: Recipe Filtering (9 good-data personas)

For each good-data persona, run the constraint resolution and recipe filtering. Compare matched recipe count against the traceability matrix predictions:

| ID | Name | Expected Matches | Feasibility |
|---|---|---|---|
| tp-001 | Sarah Mitchell | 11/30 (37%) | YES |
| tp-002 | Raj Patel | 6/30 (20%) | MARGINAL |
| tp-003 | Fatima Al-Rashid | 12/30 (40%) | YES |
| tp-004 | Tom Jeffries | 10/30 (33%) | YES |
| tp-005 | Emma Chen | 5/30 (17%) | CRITICAL — needs expansion |
| tp-006 | David Goldstein | 2/30 (7%) | CRITICAL — needs heavy expansion |
| tp-007 | Karen Whitfield | 3/30 (10%) | CRITICAL — needs heavy expansion |
| tp-009 | Priya Sharma | 1/30 (3%) | CRITICAL — needs heavy expansion |
| tp-011 | Linda Okafor | 5/30 (17%) | MARGINAL |

Record: actual matched count, variance from prediction, expansion needed (Y/N), recipes to generate

### Phase 3: Plan Generation (9 good-data personas)

For each good-data persona, generate a 30-day plan using the `/meal-plan` process (Steps 1-8). For each plan, check:

1. **Allergen safety**: Zero violations (HARD FAIL if any)
2. **Diet compliance**: 100% of meals comply with declared diet types
3. **Macro adherence**: 30-day average within 5% of targets for calories and protein
4. **Variety**: At least 12 unique recipes, variety score >60%
5. **Protein diversity**: At least 4 distinct protein sources per week
6. **Repetition**: Max 2 uses per recipe per 7-day block
7. **Shopping list**: Generated for all 4 weeks
8. **JSON-LD output**: Valid file saved to generated-plans/

### Phase 4: Poor Data Rejection (3 poor-data personas)

For each poor-data persona, verify the system produces the correct error messages:

**tp-008 (Marcus Williams)**:
- [ ] DQ-01: Flags null height
- [ ] DQ-02: Flags 800kcal below 1500 minimum for males
- [ ] DQ-03: Flags protein (200g*4=800kcal) exceeding total calories
- [ ] DQ-04: Warns missing ICD-10 code on asthma
- [ ] DQ-05: Warns allergen/diet mismatch (nut-free restriction, no allergen)
- [ ] Result: BLOCKED — no plan generated

**tp-010 (Jake Thompson)**:
- [ ] DQ-06: Rejects vegan + carnivore as mutually exclusive
- [ ] DQ-07: Warns dairy allergen conflicts with keto
- [ ] Result: BLOCKED — no plan generated

**tp-012 (Ben Fraser)**:
- [ ] DQ-08: Flags weight in stones, converts to kg
- [ ] DQ-09: Blocks on null goal
- [ ] DQ-10: Parses free-text "i dont eat much meat" as flexitarian
- [ ] DQ-11: Defaults null activity level to sedentary
- [ ] Result: BLOCKED — no plan generated (no goal)

## Output Format

Display a test results dashboard:

```markdown
# VHF Meal Plan Test Results
**Date**: {today} | **Personas tested**: {count} | **Duration**: {time}

## Phase 1: Data Quality Validation
| ID | Name | Quality | Expected | Actual | Status |
|---|---|---|---|---|---|
| tp-001 | Sarah Mitchell | good | PASS | PASS | PASS |
| ... | ... | ... | ... | ... | ... |
| tp-012 | Ben Fraser | poor | BLOCK | BLOCK | PASS |

**Result: X/12 correct**

## Phase 2: Recipe Filtering
| ID | Name | Predicted | Actual | Delta | Expansion | Status |
|---|---|---|---|---|---|---|
| tp-001 | Sarah Mitchell | 11 | X | X | N/Y | PASS/WARN |
| ... | ... | ... | ... | ... | ... | ... |

**Result: X/9 within tolerance**

## Phase 3: Plan Generation
| ID | Name | Allergens | Diet | Macros | Variety | Protein | Reps | Shop | File | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| tp-001 | Sarah | 0 viol | 100% | X% | X% | X src | OK | OK | OK | PASS |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Result: X/9 plans generated successfully**

## Phase 4: Poor Data Rejection
| ID | Name | Errors Detected | Expected Errors | All Caught? | Status |
|---|---|---|---|---|---|
| tp-008 | Marcus | DQ-01,02,03,04,05 | DQ-01,02,03,04,05 | YES | PASS |
| tp-010 | Jake | DQ-06,07 | DQ-06,07 | YES | PASS |
| tp-012 | Ben | DQ-08,09,10,11 | DQ-08,09,10,11 | YES | PASS |

**Result: X/3 correctly rejected**

## Summary
| Metric | Result | Target | Status |
|---|---|---|---|
| Data quality validation | X/12 | 12/12 | PASS/FAIL |
| Recipe filtering accuracy | X/9 | 9/9 | PASS/FAIL |
| Plans generated | X/9 | 9/9 | PASS/FAIL |
| Allergen violations | X | 0 | PASS/FAIL |
| Poor data rejections | X/3 | 3/3 | PASS/FAIL |
| Overall | | | **PASS/FAIL** |

## Recommendations
- {any gaps, recipe expansion needs, macro target issues discovered}
- {persona-specific coaching insights surfaced during generation}
```

## Important Notes

- This test does NOT call `/meal-plan` as a sub-skill — it runs the same logic inline to avoid context window issues
- For `$ARGUMENTS` = `good`, skip Phase 4. For `poor`, skip Phases 2 and 3
- If a plan file already exists for a persona in generated-plans/, use it for Phases 2-3 instead of regenerating (saves tokens). To force regeneration, delete the existing file first
- Save the test report to `PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/generated-plans/test-report-{date}.md`
