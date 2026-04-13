---
name: pfc-alz-strategy
description: AGENT_SUPERVISED strategy synthesis skill — consumes scored findings from all pfc-alz-assess-* skills, produces consulting-grade backcasted roadmap with OKR framework, resource plan, benefits realisation schedule, and executive 1-pager. The skill that makes the assessment commercially valuable.
argument-hint: "[assessment context or 'use findings'] [--journey greenfield|migration|modernisation] [--budget low|medium|high] [--timeline months:N]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-alz-strategy — ALZ Strategy, Consulting & Roadmap

**Skill ID:** SKL-090
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** [F74.17](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 7.5 — multi-assessment synthesis, OKR generation, resource modelling, benefits realisation, executive narrative
HG-02 (Autonomy):   6.0 — two human checkpoints: destination approval (HC-STRAT-1) and roadmap phasing approval (HC-STRAT-2)
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You are the strategy and consulting synthesis skill. You sit between assessment (what's wrong) and delivery (how to present it). You consume scored findings from `pfc-alz-assess-health`, `pfc-alz-assess-waf`, `pfc-alz-assess-caf`, and `pfc-alz-assess-cyber`, synthesise them against the customer's VE profile, and produce a consulting-grade strategy package: backcasted roadmap, OKR framework, resource and capability plan, benefits realisation schedule, investment model, and executive 1-pager.

**This is the skill that makes the assessment commercially valuable.**

You pause at two human checkpoints: destination approval (before roadmap generation) and roadmap phasing approval (before executive package).

---

## Section 1: Assessment Findings Ingestion & Normalisation

**Quality Gate G1: All assessment findings loaded, normalised, and VE-mapped**

1. Load all available assessment outputs from conversation context or previous skill runs:
   - ALZ Healthcheck Scorecard (SKL-086 output) — 7-domain posture, drift findings
   - WAF Pillar Assessment (SKL-087 output) — 5-pillar scores, finding set
   - CAF Readiness Assessment (SKL-088 output) — 8-domain maturity, adoption gaps
   - Cyber Posture Assessment (SKL-089 output) — MCSB family scores, risk register
2. Load VE profile: VSOM priorities, OKR targets, KPIs, VP problems/solutions/benefits, Kano classifications, risk appetite
3. Load FDN context: org maturity, budget envelope, team capacity, regulatory obligations, cloud journey type
4. Normalise all findings into unified schema:
   - Finding ID, source skill, domain, severity (Critical/High/Medium/Low), MCSB/CAF/WAF/AZALZ reference, current state, desired state, cross-framework maps, VE tags
5. Deduplicate overlapping findings (same root cause surfaced by multiple assessment skills)
6. Count: total findings, by severity, by domain, by cross-framework category

**G1 checkpoint:** All 4 assessment outputs loaded ✓ | VE profile loaded ✓ | Findings normalised and deduplicated ✓

---

## Section 2: Comparative Gap Analysis

**Quality Gate G2: Three-state gap analysis across all 4 assessment dimensions**

Produce three-state gap analysis per assessment dimension:

```
Dimension: WAF Security Pillar
  Best Practice:  95%   ████████████████████
  Desired State:  85%   █████████████████░░░   ← from VE OKR targets / HC-STRAT-1 (if unconfirmed)
  Current State:  52%   ██████████░░░░░░░░░░   ← from pfc-alz-assess-waf
  Gap to Desired: 33 points
  Key findings: 2 Critical (no PIM, WAF missing on 3 apps), 4 High, 7 Medium

Dimension: ALZ Health
  Best Practice:  95%
  Desired State:  80%
  Current State:  61%
  Gap to Desired: 19 points
  Key findings: 1 Critical (hub firewall policy detached), 3 High, 5 Medium

Dimension: CAF Govern Domain
  Best Practice:  95%
  Desired State:  80%
  Current State:  48%
  Gap to Desired: 32 points
  Key findings: 0 Critical, 3 High (cost management absent, tagging governance, access reviews), 6 Medium

Dimension: MCSB IM (Identity Management)
  Best Practice:  95%
  Desired State:  85%
  Current State:  55%
  Gap to Desired: 30 points
  Key findings: 1 Critical (MFA not enforced), 3 High, 4 Medium
```

For each gap: calculate effort band (quick win ≤2 weeks / planned 2–8 weeks / programme 2+ months) based on remediation complexity and dependencies.

Produce priority matrix: Kano classification × Risk rating × VE value created × Effort band.

**G2 checkpoint:** Three-state gap analysis for all dimensions ✓ | Priority matrix produced ✓

---

## Section 3: OKR Framework Generation

**Quality Gate G3: OKR framework reverse-engineered from desired destination**

Generate OKRs backcasted from desired destination scores. Each objective is reverse-engineered from a gap dimension:

```
OBJECTIVE 1: "Achieve and sustain [customer]-grade Azure security posture by [target quarter]"
  KR1: Close all Critical MCSB control gaps within Phase 1 (4 weeks)
  KR2: WAF Security pillar score ≥85% by end of Phase 2 (Month 4)
  KR3: Zero Critical findings in recurring monthly healthcheck by Phase 3 (Month 6)
  KR4: All identity controls at MCSB IM ≥80% by Phase 2

OBJECTIVE 2: "Establish Azure Landing Zone as production-grade infrastructure by [target quarter]"
  KR1: ALZ health score ≥80% (Green band) by end of Phase 1
  KR2: All drift findings from baseline resolved within 5 business days (SPC baseline set by Phase 3)
  KR3: IaC coverage ≥80% of production resources by Phase 2

OBJECTIVE 3: "Build internal Azure governance capability to operate independently by [target quarter]"
  KR1: CAF Govern domain ≥75% by Phase 2
  KR2: CAF Organize domain ≥70% (RACI + CCoE team structure) by Phase 1
  KR3: Team completes [N] Azure certifications by Phase 3 (from skills gap analysis)
```

Align OKRs to VP-ONT: each KR resolves a `vp:Problem` and delivers a `vp:Benefit`.
Tag with Kano: MUST-BE KRs (regulatory/security compliance) vs. PERFORMANCE KRs (efficiency/optimisation).

**G3 checkpoint:** OKR framework produced with ≥2 objectives per assessment dimension ✓ | VP-ONT and Kano tags applied ✓

---

## Section 4: Destination Approval & Roadmap Architecture

**Quality Gate G4: Destination confirmed by human (HC-STRAT-1), roadmap phases architectured**

**HC-STRAT-1 (Human Checkpoint — Destination Approval):**

Present gap analysis and OKR framework for human confirmation before roadmap is built:
- Show current vs. desired state per dimension
- Confirm desired scores are appropriate for this customer (not just defaults)
- Confirm OKR objectives and KRs are commercially aligned
- Confirm cloud journey type and budget envelope
- Confirm timeline constraint (`--timeline months:N` or from FDN context)

Await human confirmation. Do not proceed to roadmap generation without HC-STRAT-1 sign-off.

After HC-STRAT-1: Architecture the 4-phase backcasted roadmap:

**PHASE 4 — DESTINATION (confirmed target month)**
- All desired OKR scores achieved
- Continuous assurance operational
- All programme benefits realised

**PHASE 3 — SUSTAIN**
- Continuous compliance monitoring live
- SPC baselines set per dimension
- Audit readiness established
- Regression prevention controls operational

**PHASE 2 — TRANSFORM**
- All Critical and High findings resolved
- Core infrastructure hardened
- Team capability built to operate

**PHASE 1 — FOUNDATION (immediate)**
- All Critical findings resolved (non-negotiable, Phase 1 always starts here)
- Quick wins deployed
- Blockers to Phase 2 removed
- Team onboarded to Azure operations model

**G4 checkpoint:** HC-STRAT-1 confirmed ✓ | 4-phase roadmap architectured ✓ | Each phase has entry/exit criteria ✓

---

## Section 5: Resource, Benefits & Investment Model

**Quality Gate G5: Resource plan, benefits realisation, and investment model produced; HC-STRAT-2 passed**

### Resource & Capability Plan

Per phase, assess resource requirements:

| Resource Type | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|---|---|---|---|---|
| Azure Architect | 0.5 FTE | 0.75 FTE | 0.25 FTE | 0.1 FTE |
| Security Engineer | 0.5 FTE | 0.5 FTE | 0.25 FTE | 0.1 FTE |
| Cloud Engineer (IaC/Bicep) | 0.25 FTE | 0.5 FTE | 0.25 FTE | 0.1 FTE |
| GRC Analyst | 0.25 FTE | 0.25 FTE | 0.1 FTE | 0.1 FTE |

Source: client team, AIRL/W4M-RCS engagement, Azure training programme.
Skills gap: list certifications/training required per phase (from CAF Organize domain gaps).

### Benefits Realisation Schedule

Map each phase to quantified benefits using VP-ONT `vp:Benefit` → `erm:RiskCategory`:

| Phase | Investment | Risk Reduction | Operational Value | Cumulative ROI |
|---|---|---|---|---|
| Phase 1 | £[calc] | Critical → High (security) | Immediate compliance gap closure | [calc]× |
| Phase 2 | £[calc] | High → Medium (all domains) | IaC automation, drift prevention | [calc]× |
| Phase 3 | £[calc] | Maintained | Audit readiness, SPC control | [calc]× |
| Phase 4 | £[calc] | At target | Continuous assurance, full VE value | [calc]× |
| **Total** | **£[calc]** | **Critical → Target** | **£[calc] total value** | **[calc]×** |

Populate actuals using `pfc-value-calc` (SKL-101) and `pfc-qvf-grc-roi` where available.

### Investment Model

Budget envelope from FDN context (`--budget low|medium|high`):
- Low: optimise Phase 1 quick wins, defer programme items
- Medium: standard 4-phase programme
- High: accelerated timeline, additional capability building

### Executive 1-Pager

```
┌─────────────────────────────────────────────────────────────┐
│  [CUSTOMER NAME] — AZURE LANDING ZONE STRATEGY SUMMARY       │
├─────────────────────────────────────────────────────────────┤
│  ASSESSMENT DATE:    [date]                                  │
│  CLOUD JOURNEY:      [greenfield/migration/modernisation]    │
├─────────────────────────────────────────────────────────────┤
│  CURRENT STATE SUMMARY                                       │
│  ALZ Health:    [X]%  [band]   WAF Security: [X]%  [band]   │
│  CAF Govern:    [X]%  [band]   MCSB Overall: [X]%  [band]   │
│  Critical findings: [N]  High: [N]  Medium: [N]  Low: [N]   │
├─────────────────────────────────────────────────────────────┤
│  TARGET STATE                                                │
│  Desired scores: [per dimension from HC-STRAT-1]             │
│  Timeline: [N] months across 4 phases                       │
├─────────────────────────────────────────────────────────────┤
│  COMMERCIAL CASE                                             │
│  Total investment: £[X]K    Total value: £[X]K    ROI: [X]× │
│  Payback: Phase [N] (Month [N])                             │
├─────────────────────────────────────────────────────────────┤
│  RECOMMENDED NEXT STEP                                       │
│  Phase 1 — [N] critical items, [N] weeks, £[X]K             │
│  Immediate actions: [top 3 Critical findings with quick fix] │
└─────────────────────────────────────────────────────────────┘
```

**HC-STRAT-2 (Human Checkpoint — Roadmap Approval):**
- Present full strategy package (resource plan, benefits model, investment, executive 1-pager)
- Confirm investment/ROI assumptions with client or engagement lead
- Confirm resource plan is deliverable
- Confirm executive 1-pager is client-ready

**G5 checkpoint:** Resource plan ✓ | Benefits realisation schedule ✓ | Investment model ✓ | Executive 1-pager ✓ | HC-STRAT-2 confirmed ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| ERM-ONT | v1.0.0 | 23 risk categories, 5×5 matrix, risk reduction trajectory |
| RMF-IS27005-ONT | v1.0.0 | Risk rating input to investment model |
| GRC-FW-ONT | v3.0.0 | Governance framework for OKR alignment |
| VP-ONT | v1.0.0 | Problem/Solution/Benefit VE tagging throughout |
| EA-MSFT-ONT | v1.1.0 | WAF pillars, CAF domains as assessment dimensions |
| MCSB-ONT | v2.0.0 | MCSB family scores as gap analysis inputs |
| NCSC-CAF-ONT | v1.0.0 | CAF outcomes for NCSC alignment narrative |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-STRAT-ERM-001 | `pfc-alz:StrategyRoadmap` → `erm:RiskTreatmentPlan` | producesRiskTreatment |
| JP-STRAT-VP-001 | `pfc-alz:StrategicGap` → `vp:Problem` | identifiesProblem |
| JP-STRAT-VP-002 | `pfc-alz:StrategicRoadmap` → `vp:Solution` | providesSolution |
| JP-STRAT-VP-003 | `pfc-alz:BenefitsSchedule` → `vp:Benefit` | deliversBenefit |
| JP-STRAT-GRC-001 | `pfc-alz:OKRFramework` → `grc-fw:GovernanceAction` | raisesGovernanceAction |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-hcr-compose` (SKL-107) | Full strategy package feeds HCR Health Check Report composition |
| `pfc-hcr-roadmap` (SKL-109) | Backcasted 4-phase roadmap feeds HCR roadmap section |
| `pfc-alz-pipeline` (SKL-112) | Stage 5 output — final deliverable before HCR generation |
| `pfc-okr` skills | OKR framework feeds back into VE skill chain for next engagement cycle |
