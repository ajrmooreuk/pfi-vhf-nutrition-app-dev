---
name: pfc-grc-mcsb-benchmark
description: AGENT_SUPERVISED MCSB benchmarking — three-state DMAIC gap analysis (Best Practice × Current State × Desired Destination) per domain, backcasted remediation milestones, VE-prioritised remediation sequence. Requires HC-GRC-BENCH-1 before roadmap generation.
argument-hint: "[assessment context or 'use findings'] [--desired-scores NS:80,IM:85,PA:80,...] [--cohort <industry-vertical>]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-grc-mcsb-benchmark — MCSB Compliance Benchmarking

**Skill ID:** SKL-093
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.20b
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 6.8 — three-state gap analysis, DMAIC backcasting, VE priority matrix, milestone generation
HG-02 (Autonomy):   6.5 — human checkpoint to confirm desired destination scores before roadmap generation
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You benchmark the customer's MCSB compliance posture using a three-state DMAIC gap analysis. You take current state scores from `pfc-grc-mcsb-assess`, set best practice at 100% (MCSB-ONT defined), and load or confirm desired destination scores from the VE profile. For each domain you calculate two gaps: the acceptable gap (best practice minus desired destination, VE-justified) and the remediation gap (desired destination minus current state, requiring action). You produce a backcasted remediation roadmap with milestones and a VE-prioritised remediation sequence.

You pause once: HC-GRC-BENCH-1 confirms desired destination scores before the roadmap is generated.

---

## Section 1: Current State Ingestion & Best Practice Anchoring

**Quality Gate G1: Current state loaded, best practice anchors set, desired destinations loaded or defaulted**

1. Load domain scores from `pfc-grc-mcsb-assess` output (current state per domain)
2. Load VE profile: customer strategic priorities, Kano domain classification, risk appetite, regulatory obligations
3. Set best practice anchor per domain: 100% (MCSB-ONT full compliance)
4. Load desired destination per domain:
   - From `--desired-scores` argument (explicit), or
   - From VE profile OKR targets, or
   - Apply VE-derived defaults based on Kano classification:
     - MUST-BE domains (IM, PA, GS): default desired = 85%
     - PERFORMANCE domains (NS, DP, LT, PV): default = 80%
     - ENABLING domains (AM, IR, ES, BR, DS): default = 75%
5. Kano-classify each domain from VE profile (customer industry shapes this):
   - Financial services / public sector: IM, PA, DP, GS → MUST-BE
   - AI/ML-heavy workloads: AI domain → MUST-BE (if v2)

**G1 checkpoint:** Current state loaded ✓ | Best practice anchors set ✓ | Desired destinations loaded or defaulted ✓ | Kano classification applied ✓

---

## Section 2: Three-State Gap Analysis

**Quality Gate G2: Gap₁ and Gap₂ calculated for all 12 domains**

For each domain:

```
Gap₁ = Best Practice (100%) − Desired Destination
         → "Accepted risk" — customer has explicitly chosen not to reach best practice
         → Document VE justification for any Gap₁ > 20 points

Gap₂ = Desired Destination − Current State
         → "Remediation gap" — requires active work
         → Gap₂ > 0 means action required; Gap₂ ≤ 0 means target met

Visual per domain:
─────────────────────────────────────────────────────
Best Practice:      100%  ████████████████████████████
                    Gap₁ ↕ (accepted risk)
Desired Dest:        85%  ████████████████████████░░░░
                    Gap₂ ↕ (remediation gap)
Current State:       52%  ██████████████░░░░░░░░░░░░░░
─────────────────────────────────────────────────────
Gap₁ = 15 pts (accepted: MCSB IM 100% impractical for this org size)
Gap₂ = 33 pts (remediation: HC-GRC-BENCH-1 to confirm priority)
```

For each non-zero Gap₂:
- Classify remediation complexity: Quick win (Gap₂ ≤15, few controls), Planned (Gap₂ 15–30), Programme (Gap₂ >30 or foundational controls)
- Count: number of non-compliant controls to close Gap₂

Overall gap summary: total Gap₂ points across all domains, weighted by domain importance.

**G2 checkpoint:** Gap₁ and Gap₂ calculated for all domains ✓ | Remediation complexity classified ✓

---

## Section 3: Desired Destination Validation

**Quality Gate G3: HC-GRC-BENCH-1 human checkpoint passed**

**HC-GRC-BENCH-1 (Human Checkpoint — Destination Approval):**

Present three-state gap matrix for human confirmation:

```
Domain  | Current | Desired | Gap₂ | Kano       | Complexity
--------|---------|---------|------|------------|------------
NS      |   72%   |   80%   |  8pts| PERFORMANCE| Quick win
IM      |   52%   |   85%   | 33pts| MUST-BE    | Programme
PA      |   45%   |   85%   | 40pts| MUST-BE    | Programme
DP      |   80%   |   80%   |  0pts| PERFORMANCE| ✅ Met
...
```

Confirm:
- Are desired destination scores appropriate for this customer's size, sector, and maturity?
- Are MUST-BE domain targets non-negotiable for regulatory compliance?
- Are there any domains where Gap₁ (accepted risk) requires explicit sign-off?
- Is the overall remediation scope (total Gap₂) commercially aligned with budget?

Await confirmation before roadmap generation. Adjust desired scores if human provides corrections.

**G3 checkpoint:** HC-GRC-BENCH-1 confirmed ✓ | Desired scores finalised ✓

---

## Section 4: Backcasted Remediation Roadmap

**Quality Gate G4: Phased roadmap with milestones produced**

Backcast from confirmed desired destination:

**Phase 1 — Foundation (Weeks 1–4):**
- All domains with Gap₂ ≤15 (quick wins) — close these first
- MUST-BE domains: close all Critical findings regardless of Gap₂
- Milestone: Critical risk removed, quick wins deployed

**Phase 2 — Core Closure (Months 2–4):**
- MUST-BE domains: close all High findings, reach interim target (Desired − 15%)
- PERFORMANCE domains: begin planned remediation
- Milestone: No Critical findings remain in MUST-BE domains

**Phase 3 — Destination Approach (Months 4–6):**
- All domains: close High findings
- MUST-BE domains: reach desired destination score
- Milestone: All MUST-BE domains at target

**Phase 4 — Full Destination (Month 6+):**
- All domains reach desired destination
- ENABLING domains stabilised
- Milestone: All Gap₂ = 0, continuous assurance operational

Per phase: domains targeted, controls to close, expected score improvement per domain.

**G4 checkpoint:** 4-phase roadmap produced ✓ | Milestones defined ✓ | Score trajectory per phase calculated ✓

---

## Section 5: VE-Prioritised Remediation Sequence

**Quality Gate G5: VE-prioritised remediation sequence produced**

Produce the ordered remediation sequence for `pfc-grc-remediate`:

Priority sort: Kano(MUST-BE first) → Risk rating(Critical→Low) → VE value created → Effort(low first)

Output:
- Ordered control list (highest priority first) with: domain, control ID, current state, gap, estimated effort, expected score impact, VE value tag
- Quick wins list: top 10 controls closeable in ≤1 week, no change control
- Programme items: controls requiring architectural change, >4 weeks

**G5 checkpoint:** VE-prioritised sequence produced ✓ | Quick wins list produced ✓ | Ready for pfc-grc-remediate ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| MCSB-ONT | v2.0.0 | Best practice anchors (100% per domain), control entities |
| GRC-FW-ONT | v3.0.0 | Governance controls for Gap₁ justification |
| ERM-ONT | v1.0.0 | Risk categorisation for gap severity |
| VP-ONT | v1.0.0 | Problem/Benefit tagging for VE prioritisation |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-GRC-BENCH-VP-001 | `mcsb:ComplianceGap` → `vp:Problem` | identifiesProblem |
| JP-GRC-BENCH-ERM-001 | `mcsb:ComplianceGap` → `erm:Risk` | mapsToRisk |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-grc-remediate` (SKL-099) | VE-prioritised remediation sequence |
| `pfc-grc-plan` (SKL-096) | Phased roadmap milestones + gap magnitudes |
| `pfc-grc-mcsb-report` (SKL-100) | Three-state gap matrix for reporting |
| `pfc-alz-strategy` (SKL-090) | Gap analysis feeds ALZ strategy roadmap |
