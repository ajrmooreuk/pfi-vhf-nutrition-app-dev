---
name: pfc-grc-remediate
description: AGENT_SUPERVISED VE-prioritised remediation backlog generation — applies Priority Formula (Risk × VE Value × Effort Inverse) to produce ordered remediation backlog with quick wins, cumulative compliance trajectory, and effort estimates. Feeds pfc-grc-plan.
argument-hint: "[assessment and benchmark context or 'use findings'] [--risk-weight 0.4] [--value-weight 0.3] [--effort-weight 0.3]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-grc-remediate — Prioritised Remediation Backlog

**Skill ID:** SKL-099
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.20
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 6.0 — priority formula, backlog construction, trajectory modelling, quick wins extraction
HG-02 (Autonomy):   6.5 — human checkpoint to confirm priority formula weights before backlog is used for planning
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You generate a VE-prioritised remediation backlog from MCSB assessment findings. You apply the Priority Formula (Risk Score × VE Value Impact × Effort Inverse) to every non-compliant control, produce an ordered remediation backlog, extract quick wins, model the cumulative compliance trajectory as items are closed, and calculate expected score improvement per item. This backlog is the primary input to `pfc-grc-plan` and the action queue for `pfc-grc-drift`.

You pause at HC-GRC-REM-1 to confirm priority formula weights before the backlog is used for planning commitment.

---

## Section 1: Findings Ingestion & Enrichment

**Quality Gate G1: All non-compliant controls loaded, enriched with risk and value data**

1. Load non-compliant controls from `pfc-grc-mcsb-assess` output:
   - Control ID, domain, compliance state, non-compliant resources, RMF risk rating
2. Load VE priority weighting from `pfc-grc-mcsb-benchmark`:
   - Kano classification per domain
   - Customer strategic priority per domain (from VE profile)
3. Load effort estimates per control (from standard catalogue — overrideable):
   - Policy assignment: 0.5–1 day
   - Config remediation (automated): 0.5–2 days
   - Config remediation (manual): 1–5 days
   - Architectural change: 5–30 days (estimate from finding context)
4. For each control, calculate:
   - Risk score numeric: Critical=1.0, High=0.75, Medium=0.5, Low=0.25
   - VE value impact: Kano(MUST-BE=1.0, PERFORMANCE=0.7, ENABLING=0.4) × domain weight
   - Expected score improvement: (control compliance gain) × (domain weight) = posture points gained

**G1 checkpoint:** All non-compliant controls loaded ✓ | Risk scores, VE weights, effort, score improvement calculated ✓

---

## Section 2: Priority Formula Application

**Quality Gate G2: Priority score calculated for all controls, HC-GRC-REM-1 confirmed**

Priority Formula (configurable weights, default as shown):

```
Priority Score = (Risk Score × 0.4) + (VE Value Impact × 0.3) + (Effort Inverse × 0.3)

Where:
  Risk Score     = P0 (Critical)=1.0 | P1 (High)=0.75 | P2 (Medium)=0.5 | P3 (Low)=0.25
  VE Value Impact = Kano weight × domain strategic priority (0–1.0)
  Effort Inverse  = 1 / normalised_effort  (quick wins score higher — effort normalised 0–1)

Example:
  PA-2 (PIM enforcement) — Critical, MUST-BE, Policy assignment (0.5 days)
  Priority = (1.0 × 0.4) + (1.0 × 0.3) + (0.95 × 0.3) = 0.985  → P0 IMMEDIATE

  DS-4 (SAST tooling) — Medium, PERFORMANCE, 5 days effort
  Priority = (0.5 × 0.4) + (0.7 × 0.3) + (0.3 × 0.3) = 0.50  → P2 PLANNED
```

**HC-GRC-REM-1 (Human Checkpoint — Weight Confirmation):**

Present top 10 priority items with formula breakdown. Confirm:
- Risk weight (0.4) appropriate — increase if risk-averse customer
- VE weight (0.3) appropriate — increase if value/compliance-driven
- Effort inverse weight (0.3) appropriate — reduce if customer has high capacity and prefers risk-first
- Are any items clearly mis-prioritised? (override available)

Await confirmation before backlog finalisation.

**G2 checkpoint:** Priority score calculated for all controls ✓ | HC-GRC-REM-1 confirmed ✓ | Any overrides applied ✓

---

## Section 3: Backlog Construction & Categorisation

**Quality Gate G3: Ordered backlog produced with categories**

Sort all controls by Priority Score (descending). Categorise:

**P0 — Immediate** (Priority Score ≥ 0.90 OR any Critical+MUST-BE):
- Start before Phase 1 formal kick-off
- Escalate to on-call if Critical policy has been removed

**P1 — Phase 1** (Priority Score 0.70–0.89):
- Phase 1 delivery (Weeks 1–4)
- Owner assigned, change request raised

**P2 — Phase 2/3** (Priority Score 0.40–0.69):
- Planned delivery — assigned to phases by implementation plan

**P3 — Backlog** (Priority Score < 0.40):
- Address in Phase 4 or continuous improvement
- Review quarterly

Quick Wins list: all controls with:
- Effort ≤ 1 day AND Priority Score ≥ 0.60
- These are the "start today" items regardless of formal phase gates

**G3 checkpoint:** Ordered backlog produced ✓ | P0/P1/P2/P3 categorised ✓ | Quick wins list extracted ✓

---

## Section 4: Compliance Trajectory Modelling

**Quality Gate G4: Cumulative compliance trajectory chart data produced**

Model the expected compliance improvement trajectory if items are closed in priority order:

For each item in ordered backlog:
```
Running domain score = domain_score + (expected_score_improvement_per_item)
Running overall posture = Σ(running_domain_scores × domain_weights)
```

Produce trajectory data points (item n → expected overall posture after closing top n items):
```
After P0 items (n=8):   Posture 62 → 71  (+9 points, Critical risk eliminated)
After P1 items (n=22):  Posture 71 → 79  (+8 points, Amber band reached)
After P2 items (n=45):  Posture 79 → 85  (+6 points, Green band reached)
After P3 items (n=68):  Posture 85 → 89  (+4 points, destination achieved)
```

Identify "Green threshold crossing": how many items to close to reach Green band (80+)?
Identify "quick win posture jump": posture gain from closing quick wins list only.

**G4 checkpoint:** Trajectory data produced ✓ | Green threshold identified ✓ | Quick win impact quantified ✓

---

## Section 5: Backlog Output Package

**Quality Gate G5: Full remediation backlog package produced**

Output:

1. **Ordered Remediation Backlog**: full list sorted by priority score, with per-item:
   - Control ID, domain, Kano, risk rating, priority score, category (P0–P3), effort estimate, expected posture improvement, VE value tag

2. **Quick Wins List** (top 10, effort ≤1 day):
   - Recommended for immediate start — can begin before Phase 1 formal kick-off

3. **Cumulative Trajectory Chart Data**:
   - (items closed, expected posture) pairs for visualisation

4. **Domain Improvement Schedule**:
   - Per domain: current score, P0 items, score after P0, P1 score, P2 score, destination

5. **Action Queue** (for `pfc-grc-drift`):
   - P0 items formatted as immediate action objects with owner slot

**G5 checkpoint:** All 5 output artefacts produced ✓ | Action queue ready for pfc-grc-drift ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| MCSB-ONT | v2.0.0 | Control entities, domain scoring model |
| ERM-ONT | v1.0.0 | Risk score mapping (Critical/High/Medium/Low) |
| VP-ONT | v1.0.0 | VE value impact (Problem/Benefit) |
| GRC-FW-ONT | v3.0.0 | Governance action context |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-grc-plan` (SKL-096) | Ordered backlog feeds phased implementation plan |
| `pfc-grc-drift` (SKL-094) | P0 action queue for immediate escalation |
| `pfc-grc-mcsb-report` (SKL-100) | Trajectory chart data for compliance reporting |
| `pfc-hcr-roadmap` (SKL-109) | Quick wins and trajectory feed HCR roadmap |
