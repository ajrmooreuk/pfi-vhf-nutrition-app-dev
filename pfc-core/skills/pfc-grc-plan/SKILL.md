---
name: pfc-grc-plan
description: AGENT_SUPERVISED MCSB compliance implementation planning — generates phased costed plan from benchmark gap analysis, integrates VE priority matrix, produces OKR-aligned milestones, resource requirements, and risk-adjusted timeline. Requires HC-GRC-PLAN-1 before execution begins.
argument-hint: "[benchmark context or 'use findings'] [--budget £N] [--timeline months:N] [--team-size N]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-grc-plan — MCSB Compliance Implementation Plan

**Skill ID:** SKL-096
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.20
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 6.5 — phased planning, VE priority integration, OKR generation, resource modelling, risk adjustment
HG-02 (Autonomy):   5.5 — human checkpoint to approve plan before execution commitment
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You generate a phased, costed, resource-planned MCSB compliance implementation plan. You consume the benchmark gap analysis from `pfc-grc-mcsb-benchmark` and the prioritised remediation sequence from `pfc-grc-remediate`, apply resource constraints from the customer's FDN context, generate OKR-aligned milestones, estimate effort and cost per phase, and produce a risk-adjusted delivery timeline.

You pause at HC-GRC-PLAN-1 for the customer and architect to approve the plan before commitment to execution.

---

## Section 1: Input Ingestion & Resource Context

**Quality Gate G1: All inputs loaded, resource constraints established**

1. Load benchmark output: three-state gap matrix, domain gap magnitudes, VE-prioritised sequence (from `pfc-grc-mcsb-benchmark`)
2. Load remediation backlog: ordered control list with effort estimates (from `pfc-grc-remediate`)
3. Load FDN context: resource constraints
   - Team size and composition (Azure engineers, security analysts, GRC analysts)
   - Budget envelope (from `--budget` or FDN context)
   - Timeline constraint (from `--timeline` or FDN context)
   - Change management constraints (change windows, freeze periods, CAB cadence)
4. Load VE profile: strategic priorities, OKR targets, Kano domain classification
5. Calculate maximum implementation velocity: (team size × available hours) / average control effort

**G1 checkpoint:** Benchmark and remediation inputs loaded ✓ | Resource constraints established ✓ | VE profile loaded ✓

---

## Section 2: Phase Construction

**Quality Gate G2: Implementation phases constructed with control assignments**

Construct 3–5 phases based on Kano priority, risk, and effort:

**Phase 1 — Foundation & Critical Risk Removal**
Rule: Include all controls meeting ANY of:
- Kano = MUST-BE AND Risk = Critical
- Quick win (effort ≤3 days) regardless of domain
- Prerequisite for Phase 2 controls

Typical Phase 1 scope: identity baseline (PA/IM critical), policy assignments, monitoring deployment, diagnostic settings.
Target duration: Weeks 1–4 (non-negotiable start for Critical).

**Phase 2 — MUST-BE Domain Closure**
Rule: MUST-BE domain controls not in Phase 1, sorted by risk (High first).
Controls: IM, PA, GS, DP — close all Critical and High findings.
Target: MUST-BE domains reach interim milestone (Desired − 15%) by Phase 2 end.

**Phase 3 — PERFORMANCE Domain Progress**
Rule: NS, LT, PV, IR controls; MUST-BE controls remaining (Medium findings).
Target: PERFORMANCE domains close > 50% of Gap₂.

**Phase 4 — Completion & Destination**
Rule: Remaining Medium controls across all domains; ENABLING domains (AM, ES, BR, DS).
Target: All domains reach desired destination score.

**Phase 5 — Continuous Assurance** (ongoing, not a delivery phase)
Rule: SPC baselines set, recurring drift detection, quarterly re-assessment.
Handover: `pfc-grc-drift` + `pfc-grc-baseline` take over.

For each phase: list of controls, domain, effort estimate (days), resource requirement, expected score delta.

**G2 checkpoint:** All Gap₂ controls assigned to a phase ✓ | Phase scope and sequence validated ✓

---

## Section 3: Effort & Cost Estimation

**Quality Gate G3: Effort and cost estimated per phase**

Effort estimation per control category (default calibration, VE-adjustable):

| Control Category | Effort Estimate | Notes |
|---|---|---|
| Policy assignment (audit mode) | 0.5 days | Portal/CLI, no change control |
| Policy assignment (deny mode) | 1 day | Requires change control, testing |
| RBAC restructuring | 2–5 days | PIM enablement, access reviews |
| Defender plan enablement | 0.5–1 day | Per subscription |
| Key Vault migration (secrets) | 3–10 days | Per application |
| Network reconfiguration | 5–15 days | NSG, private endpoints, firewall |
| Monitoring deployment | 2–5 days | Log Analytics, alert rules |
| Architectural change | 10–30 days | Estimated per specific finding |

Total effort per phase (days). At `--team-size N` and average 70% utilisation: duration in calendar weeks.

Cost estimate per phase:
- Internal team: effort × average day rate (from FDN context or default £800/day)
- External support (AIRL/W4M-RCS engagement): identify controls requiring specialist input
- Tool/licence costs: Defender plan tier upgrades (if required)

**G3 checkpoint:** Effort and cost estimated per phase ✓ | Total programme effort and cost calculated ✓

---

## Section 4: OKR-Aligned Milestones

**Quality Gate G4: OKR framework with phase-aligned milestones produced**

Generate OKR framework for compliance programme:

```
OBJECTIVE 1: "Eliminate critical MCSB compliance risk by [Phase 1 end date]"
  KR1: Zero Critical findings across all MUST-BE domains
  KR2: Defender for Cloud Standard tier active across all subscriptions
  KR3: PIM enabled for all Owner/Contributor roles at subscription scope

OBJECTIVE 2: "Achieve MUST-BE domain targets by [Phase 2 end date]"
  KR1: IM domain ≥ [desired]%
  KR2: PA domain ≥ [desired]%
  KR3: GS domain ≥ [desired]%

OBJECTIVE 3: "Full MCSB compliance programme complete by [Phase 4 end date]"
  KR1: All 12 domains at or above desired destination score
  KR2: Zero High findings remaining
  KR3: SPC baseline established and drift detection operational

OBJECTIVE 4: "Continuous compliance assurance operational"
  KR1: Monthly drift detection running, zero undetected breaches
  KR2: Quarterly re-assessment integrated into security governance calendar
  KR3: MCSB compliance included in board-level security reporting
```

Phase gates: each phase has a measurable gate condition (domain scores, finding counts).

**G4 checkpoint:** OKR framework with 3–4 objectives produced ✓ | Phase gates defined ✓

---

## Section 5: Plan Approval & Output

**Quality Gate G5: HC-GRC-PLAN-1 confirmed, final plan package produced**

**HC-GRC-PLAN-1 (Human Checkpoint — Plan Approval):**

Present complete implementation plan for customer and architect review:
- Phase summary: scope, duration, cost, expected compliance score improvement per phase
- Resource requirements: team composition, skills needed, external support
- Risk-adjusted timeline: identify controls with long lead times (e.g., app-level Key Vault migration)
- OKR milestones: confirm these are commercially meaningful targets

Await sign-off. Adjust phases if budget or timeline constraint requires reprioritisation.

Final plan output:
1. **Programme Overview**: phase summary, total effort, total cost, ROI vs. risk reduction
2. **Phase Detail**: per phase — controls, effort, cost, resources, dependencies, gate condition
3. **Resource Plan**: per phase team composition, RACI for control ownership
4. **OKR Milestone Schedule**: dated milestones, measurement approach
5. **Risk Register Fragment**: delivery risks (resource availability, change control delays, scope creep)
6. **Quick Wins List**: top 10 controls to start immediately before formal Phase 1

**G5 checkpoint:** HC-GRC-PLAN-1 confirmed ✓ | All 6 output artefacts produced ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| MCSB-ONT | v2.0.0 | Control domain entities, control categorisation |
| GRC-FW-ONT | v3.0.0 | Governance process for plan approval |
| ERM-ONT | v1.0.0 | Delivery risk register format |
| VP-ONT | v1.0.0 | Problem/Solution/Benefit for OKR alignment |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-grc-mcsb-policy` (SKL-097) | Phase 1 policy assignment list |
| `pfc-grc-mcsb-report` (SKL-100) | Programme plan for reporting to stakeholders |
| `pfc-alz-strategy` (SKL-090) | Compliance plan integrates with ALZ strategy roadmap |
| `pfc-hcr-roadmap` (SKL-109) | Implementation plan feeds HCR roadmap section |
