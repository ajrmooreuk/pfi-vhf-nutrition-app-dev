# Bulletin: Epic 1 — VHF Custom Skills — State of Play

**Date**: 2026-02-26
**Epic**: #7 (Epic 1: VHF Custom Skills — 30-Day Meal Plan Generator)
**Feature**: #8 (F1.1: /meal-plan Custom Skill — MVP)
**Repo**: `ajrmooreuk/VHF-App-Mk3`
**Branch**: `main`

---

## Summary

Epic 1 delivers a Claude Code custom skill system for Coach James Kerby at Viridian Health & Fitness. The skills generate personalised, ontology-compliant 30-day meal plans for individual clients using the VHF-RMP-ONT ontology and test data.

This is a **PFI-VHF instance** implementation using PFC-Core infrastructure (VSOM, PE-Series process conventions, JSON-LD, Schema.org alignment).

---

## What Was Delivered

### 4 Custom Skills (`.claude/commands/`)

| Skill | Purpose | Status |
|---|---|---|
| `/meal-plan` | Generate a 30-day plan for one client | Ready |
| `/meal-plan-view` | View/drill into a saved plan at multiple zoom levels | Ready |
| `/meal-plan-html` | Render plan as branded single-page HTML | Ready |
| `/meal-plan-test` | Run test suite across all 12 personas | Ready |

### Supporting Artefacts

| File | Description |
|---|---|
| `PBS/OPERATING-GUIDE-VHF-Skills.md` (v1.1.0) | Full operating guide — architecture, skills reference, test data, coach workflow, future work |
| `generated-plans/meal-plan-tp-001-2026-02-26.jsonld` | First generated plan (Sarah Mitchell, 96KB, 3,218 lines, valid JSON-LD) |
| `generated-plans/meal-plan-tp-001-2026-02-26.html` | HTML render of tp-001 plan (75KB, VHF Viridian DS tokens) |

### GitHub Issues

| Issue | Title | Status |
|---|---|---|
| #7 | Epic 1: VHF Custom Skills — 30-Day Meal Plan Generator | Open |
| #8 | F1.1: /meal-plan Custom Skill — MVP | Open |
| #9 | F1.2: GitHub Pages Hosting for Rendered Meal Plans | Open (future) |

---

## Architecture Decisions

1. **PFI-VHF scoped** — Skills and ontologies stay instance-level, not pooled for other PFI instances. Future issue (F1.x) to evaluate pool promotion of PE-B2C-NUT-ONT.
2. **PE-Series classification** — Ontology reclassified as PE-B2C-NUT-ONT (process engineering, B2C nutrition).
3. **VSOM at individual level** — Vision=client goal, Strategy=diet+themes, Objectives=macro targets, Metrics=adherence/variety/cost.
4. **3+1 skill split** — Generate (JSON-LD) + View (markdown) + Test (matrix) + HTML (branded output). Separates concerns and manages token budget.
5. **DS tokens placeholder** — HTML skill uses VHF Viridian tokens hardcoded. Actual PF-Core DS from Azlan to be integrated later.

---

## First Run Results (tp-001 Sarah Mitchell)

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
| JSON validity | Valid |
| HTML render | 75KB, all 30 days, shopping lists, quality dashboard |

**Coach note**: Protein elevated (+12.7%) is clinically appropriate for T2D weight loss. Carb shortfall (-12.8%) reflects low-carb recipe pool; coach may adjust.

---

## Known Gaps & Recipe Expansion Needs

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

## Next Steps

- [ ] Run `/meal-plan-test all` — full 12-persona test sweep
- [ ] Recipe database expansion for GAP-01 to GAP-06
- [ ] GitHub Pages hosting for HTML plans (#9)
- [ ] PF-Core DS token integration from Azlan
- [ ] Supabase integration for plan persistence
- [ ] Coach approval workflow (pending → approved → active)
- [ ] Pool assessment (F1.x) — evaluate PE-B2C-NUT-ONT for PFC-core promotion

---

## Files in This Commit

```
.claude/commands/
  meal-plan.md
  meal-plan-view.md
  meal-plan-html.md
  meal-plan-test.md
PBS/OPERATING-GUIDE-VHF-Skills.md
PBS/BULLETIN-Epic1-VHF-Skills-State-of-Play.md
PBS/ONTOLOGIES/VHF-RECIPE-MEALPLAN-ONT/generated-plans/
  meal-plan-tp-001-2026-02-26.jsonld
  meal-plan-tp-001-2026-02-26.html
```
