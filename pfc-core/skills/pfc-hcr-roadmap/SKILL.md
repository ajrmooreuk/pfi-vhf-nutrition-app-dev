---
name: pfc-hcr-roadmap
description: AGENT_SUPERVISED backcast-driven roadmap generation — works backwards from the desired destination (OKR-ONT key results, rmf:RiskCriteria) through 4 phases (Foundation→Transform→Sustain→Optimise) to current state. Produces phased delivery plan with OKRs, investment model, benefits timeline, resource requirements, and risk reduction trajectory. Assembles hcr:Roadmap for HCR Part III.
argument-hint: "[strategy and QVF outputs or 'use findings'] [--phases 4] [--budget-ceiling £N] [--timeline-weeks N]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-hcr-roadmap — Backcast-Driven Roadmap Generation

**Skill ID:** SKL-111
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.25e
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 7.0 — backcasting logic, 4-phase construction, OKR derivation, investment model, benefits schedule, resource plan, dependency mapping
HG-02 (Autonomy):   6.0 — human checkpoint for roadmap approval before inclusion in final report
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You generate the backcasted strategic roadmap that is the core of Part III of the Health Check Report. You work backwards from the desired destination (confirmed at HC-STRAT-1 in `pfc-alz-strategy`) through four phases — Optimise → Sustain → Transform → Foundation — determining what must be true at each phase for the next phase to succeed. For each phase you assemble recommendations (from `pfc-hcr-analyse` root-cause clusters), OKRs, projected scores, investment, value created, risk trajectory, resource requirements, and dependencies. You pause at HC-HCR-ROADMAP-1 for customer stakeholder approval before the roadmap enters the final report.

---

## Section 1: Destination & Phase Architecture

**Quality Gate G1: Destination confirmed, 4-phase architecture constructed by backcasting**

Load destination definition:

| Input | Source | Content |
|---|---|---|
| Desired domain scores | `pfc-grc-mcsb-benchmark` (SKL-093) | Per-domain desired destination scores |
| OKR framework | `pfc-alz-strategy` (SKL-090) | 3 objectives + key results at destination |
| Risk criteria | `rmf:RiskCriteria` (RMF-IS27005-ONT) | Target risk level (Critical → Medium) |
| Compliance thresholds | MCSB-ONT | ≥85% all MUST-BE domains, zero Critical at destination |
| Financial outcomes | `pfc-qvf-grc-roi` (SKL-105) | Insurance tier, ALE ceiling at destination |
| Root-cause clusters | `pfc-hcr-analyse` (SKL-108) | Governance / Identity / Monitoring clusters |
| Customer constraints | FDN context + `--budget-ceiling`, `--timeline-weeks` | Budget and timeline envelope |

Backcast architecture — work backwards from destination:

```
DESTINATION (Phase 4 complete):
  MCSB all domains ≥ desired destination scores
  Zero Critical findings
  Risk level ≤ Medium across all scenarios
  Insurance optimised (posture evidence submitted)
  SPC baseline established, continuous drift detection running
  ↑
PHASE 4 — OPTIMISE (continuous improvement, steady state):
  Question: What must be true for destination to be MAINTAINED?
  Answers: drift detection operational, quarterly assessment cadence,
           MCSB drift ≤ ±3% monthly, OKR review cycle active
  ↑
PHASE 3 — SUSTAIN (stabilisation):
  Question: What must be true for Phase 4 to START?
  Answers: Phase 2 remediation complete, SPC baseline established (pfc-grc-baseline),
           monitoring cluster findings resolved, IR plan tested
  ↑
PHASE 2 — TRANSFORM (critical and high gap closure):
  Question: What must be true for Phase 3 to START?
  Answers: Identity cluster root causes fixed (MFA, RBAC),
           all Critical MCSB findings remediated, data protection controls active
  ↑
PHASE 1 — FOUNDATION (quick wins, governance, blockers removed):
  Question: What must be true for Phase 2 to START?
  Answers: Governance cluster root causes fixed (Azure Policy, tagging, naming),
           assessment baseline established, team trained, blockers removed
  ↑
CURRENT STATE (assessment complete, roadmap approved — NOW)
```

**G1 checkpoint:** Destination confirmed ✓ | 4-phase backcast logic verified ✓ | Prerequisites chain validated ✓

---

## Section 2: Phase Content Construction

**Quality Gate G2: All 4 phases constructed with recommendations, OKRs, scores, and investment**

For each phase, construct `hcr:RoadmapPhase` with all required elements:

**Phase 1 — Foundation:**
```
Recommendations (from pfc-hcr-analyse Governance cluster root causes):
  - Deploy Azure Policy governance initiative (naming, tagging, cost allocation)
  - Establish centralised Log Analytics workspace (monitoring blind spot removal)
  - Quick wins: MFA enforcement for all Global Admins (IM-1, Identity cluster)
  - Enable Microsoft Defender for Cloud (MCSB foundation)
  - Establish RBAC model and remove standing admin access (PA, IM)

Projected MCSB scores at Phase 1 complete (from benchmark milestone data):
  Identity Management: [current]% → [+N]%
  Policy & Compliance: [current]% → [+N]%
  Governance & Strategy: [current]% → [+N]%

OKRs (Phase 1):
  Objective: Establish governance foundations
    KR-1.1: Azure Policy initiative deployed to all subscriptions
    KR-1.2: MFA enforced for 100% of privileged accounts
    KR-1.3: Log Analytics workspace active with MCSB diagnostic pipeline

Investment (from pfc-grc-plan + pfc-qvf-grc-roi):
  Implementation: £[N] (Phase 1 remediation cost)
  Effort: [N] days

Value created:
  ΔALE Phase 1: £[N]/year risk reduction (Foundation controls)
  ΔPremium Phase 1: £[N]/year insurance saving (MFA + basic posture gain)

Duration: [N] weeks (within --timeline-weeks constraint)
```

**Phase 2 — Transform:**
```
Recommendations (from pfc-hcr-analyse Identity cluster + Critical gap closure):
  - Close all Critical MCSB findings (ES, NS, DP, LT priority domains)
  - Deploy EDR to all workloads (ES domain)
  - Implement network segmentation (NS domain)
  - Activate data protection controls (DP domain)
  - Deploy Conditional Access policies (full set, IM/PA)

Projected MCSB scores at Phase 2 complete:
  Endpoint Security: [current]% → [+N]%
  Network Security: [current]% → [+N]%
  Data Protection: [current]% → [+N]%

OKRs (Phase 2):
  Objective: Eliminate critical security control gaps
    KR-2.1: All Critical MCSB findings remediated (zero Critical open)
    KR-2.2: EDR coverage ≥90% of workloads
    KR-2.3: Network segmentation complete (hub-spoke NSG rules active)

Investment: £[N]
Value created: ΔALE Phase 2: £[N]/year | ΔPremium Phase 2: £[N]/year
Duration: [N] weeks
```

**Phase 3 — Sustain:**
```
Recommendations (from pfc-hcr-analyse Monitoring cluster + High gap closure):
  - Establish SPC compliance baseline (pfc-grc-baseline operational)
  - Activate continuous drift detection (pfc-grc-drift scheduled)
  - Implement and test IR plan
  - Close all High MCSB findings
  - Submit insurer evidence pack (pfc-qvf-cyber-insure broker package)

OKRs (Phase 3):
  Objective: Sustain improved posture and establish continuous assurance
    KR-3.1: SPC baseline established, UCL/LCL active
    KR-3.2: IR plan written, tested, signed off
    KR-3.3: Insurance broker evidence package submitted

Investment: £[N] | Value created: ΔALE Phase 3: £[N]/year | Duration: [N] weeks
```

**Phase 4 — Optimise:**
```
Recommendations (continuous improvement cadence):
  - Monthly drift check (pfc-grc-drift operational)
  - Quarterly posture assessment (pfc-grc-mcsb-assess)
  - Annual full Health Check reassessment
  - OKR review and refresh cycle

OKRs (Phase 4):
  Objective: Achieve and sustain best-in-class Azure security posture
    KR-4.1: MCSB all domains ≥ desired destination scores sustained over 6 months
    KR-4.2: Zero new Critical findings in monthly drift checks
    KR-4.3: Cyber Value Equation value ≥ target (from pfc-qvf-grc-value)

Investment: £[N]/year (continuous assurance operational cost)
Value created: Full destination ΔALE + insurance savings
Duration: Ongoing (steady state)
```

**G2 checkpoint:** All 4 phases constructed ✓ | OKRs per phase ✓ | Scores, investment, value per phase ✓

---

## Section 3: Investment Model & Benefits Schedule

**Quality Gate G3: Cumulative investment, value, and ROI curve produced**

Build cumulative financial model:

```
Cumulative Cash Flow by Phase:

Phase 1:
  Investment:      −£[N]
  Value created:   +£[N]  (ΔALE P1 + ΔPremium P1 annualised)
  Cumulative net:  £[N]

Phase 2 (cumulative Phase 1+2):
  Investment:      −£[N] total
  Value created:   +£[N] total
  Cumulative net:  £[N]

Phase 3 (cumulative Phase 1+2+3):
  Investment:      −£[N] total
  Value created:   +£[N] total
  Cumulative net:  £[N]  ← payback point typically here

Phase 4+ (steady state):
  Annual investment:  −£[N]/year (continuous assurance)
  Annual value:       +£[N]/year (full destination benefits)
  Net annual value:   +£[N]/year

Programme ROI:  [N]%  (from pfc-qvf-grc-roi)
NPV (5-year):   £[N]
Payback:        Month [N]
```

Benefits realisation schedule (projected vs baseline):
```
Baseline: no programme — posture continues declining, ALE increases
Projected: programme delivered on schedule — posture trajectory per phase milestones
Conservative: programme delayed 25% — value realisation shifted right by [N] months
```

**G3 checkpoint:** Investment model complete ✓ | Benefits schedule produced ✓ | ROI curve calculated ✓

---

## Section 4: Risk Trajectory & Resource Plan

**Quality Gate G4: Risk reduction trajectory and resource allocation model produced**

Risk reduction trajectory:

```
Current state:   [N] Critical, [N] High, [N] Medium, [N] Low findings
                 ALE: £[N]/year | Risk level: CRITICAL
Phase 1 complete: [N] Critical, [N] High → ALE: £[N]/year | Risk: HIGH
Phase 2 complete: 0 Critical, [N] High  → ALE: £[N]/year | Risk: MEDIUM
Phase 3 complete: 0 Critical, [N] High  → ALE: £[N]/year | Risk: MEDIUM-LOW
Destination:     0 Critical, 0 High     → ALE: £[N]/year | Risk: LOW
```

Resource plan:

```
Phase 1 — Foundation:
  Lead: Security Architect (Azlan) — [N] days
  Support: Customer IT (Azure admin) — [N] days
  Skills required: Azure Policy, Entra ID (MFA/CA), Log Analytics
  Change windows: [from FDN context or TBD]

Phase 2 — Transform:
  Lead: Security Engineer (Azlan) — [N] days
  Support: Customer IT (network admin, endpoint team) — [N] days
  Skills required: EDR deployment, NSG configuration, DLP

Phase 3 — Sustain:
  Lead: GRC Analyst (Azlan or customer) — [N] days
  Skills required: SPC, IR planning, insurance evidence packaging

Phase 4 — Optimise:
  Ongoing: [N] days/month (Azlan continuous assurance service) or
           [N] FTE equivalent (customer internal)
```

**G4 checkpoint:** Risk reduction trajectory produced ✓ | Resource plan complete ✓

---

## Section 5: HC-HCR-ROADMAP-1 & Roadmap Output Package

**Quality Gate G5: Roadmap approved, full hcr:Roadmap output package produced**

**HC-HCR-ROADMAP-1 (Human Checkpoint — Roadmap Approval):**

Present roadmap to customer stakeholders for validation:
- Phase summary: objectives, duration, investment, value per phase
- Total programme investment vs. total value created
- Key assumptions driving phase boundaries and investment estimates
- Resource requirements: customer vs. Azlan involvement per phase
- Dependencies: change windows, procurement lead times, customer readiness blockers
- "Are phase priorities, investment, and timeline acceptable?"
- "Are there constraints we have not accounted for?"

Await stakeholder sign-off before roadmap enters final report.

Output artefacts:
1. **Roadmap Document**: 4-phase plan with all phase elements
2. **Phase Gantt Chart Data**: timeline representation for dashboard and slides
3. **OKR Framework**: per-phase objectives and key results (for hcr:Roadmap section)
4. **Investment Model**: cumulative cost, value, and ROI curve data
5. **Risk Reduction Trajectory**: risk level per phase + ALE reduction curve
6. **Benefits Realisation Schedule**: projected vs. baseline vs. conservative
7. **Resource Plan**: FTE allocation per phase (Azlan + customer)
8. **`hcr:Roadmap` + `hcr:RoadmapPhase` entities**: complete HCR-ONT graph objects

**G5 checkpoint:** HC-HCR-ROADMAP-1 confirmed ✓ | All 8 output artefacts produced ✓ | hcr:Roadmap entity ready for pfc-hcr-compose ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| HCR-ONT | v1.0.0 | `hcr:Roadmap`, `hcr:RoadmapPhase`, `hcr:Recommendation`, `hcr:BenefitsSchedule` |
| OKR-ONT | v1.0.0 | Objectives + Key Results per phase |
| QVF-ONT | v1.0.0 | `qvf:ValueModel`, `qvf:CashFlow` investment/value per phase |
| RMF-IS27005-ONT | v1.0.0 | `rmf:RiskTreatment`, `rmf:RiskCriteria` risk trajectory |
| MCSB-ONT | v2.0.0 | Domain score trajectories per phase |
| PE-ONT | v1.0.0 | Process phases, resource allocation |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-ROADMAP-PHASE-001 | `hcr:Roadmap` → `hcr:RoadmapPhase` | hasPhase |
| JP-ROADMAP-OKR-001 | `hcr:RoadmapPhase` → `okr:Objective` | achieves |
| JP-ROADMAP-QVF-001 | `hcr:RoadmapPhase` → `qvf:CashFlow` | generates |
| JP-ROADMAP-REC-001 | `hcr:RoadmapPhase` → `hcr:Recommendation` | contains |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-hcr-compose` (SKL-107) | `hcr:Roadmap` entity + phase content for Part III §16 |
| `pfc-hcr-dashboard` (SKL-110) | Phase Gantt data, OKR framework, risk trajectory, investment curve |
| `pfc-alz-strategy` (SKL-090) | Validated roadmap feeds strategy commercial model |
