---
name: pfc-grc-posture
description: AGENT_SUPERVISED unified security posture score — aggregates MCSB infrastructure scores, OWASP application findings, WAF Security pillar, and AI security into single VE-weighted posture score. Produces traffic light status, trend delta, weakest domain identification, and executive summary paragraph.
argument-hint: "[assessment context or 'use findings'] [--weights mcsb:0.4,owasp:0.25,waf:0.2,ai:0.15] [--include-ai]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-grc-posture — Unified Security Posture Score

**Skill ID:** SKL-098
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.20e
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 6.0 — multi-source aggregation, VE-weighted scoring, trend analysis, narrative generation
HG-02 (Autonomy):   6.5 — human checkpoint to confirm VE weight configuration before score is used in executive reporting
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You aggregate security scores from multiple assessment dimensions into a single unified posture score. You consume MCSB infrastructure domain scores, OWASP application/AI finding severity, WAF Security pillar score, and AI Security scores; apply VE-configurable weights; produce a traffic light status, trend delta versus previous assessment, weakest domain identification, and a concise executive summary paragraph. This score is the headline number in the HCR Health Check Report and executive 1-pager.

You pause at HC-GRC-POSTURE-1 to confirm weight configuration reflects this customer's priorities before the score is used in reporting.

---

## Section 1: Input Source Loading

**Quality Gate G1: All available assessment scores loaded, coverage flags set**

Load available inputs (all optional — skill adapts to available data):

| Source | Expected From | What Is Loaded |
|---|---|---|
| MCSB domain scores | `pfc-grc-mcsb-assess` | 12 domain scores (0–100%), overall weighted |
| OWASP findings | `pfc-owasp-web`, `pfc-owasp-code-review`, `pfc-owasp-threat-model` | Finding counts by severity (Critical/High/Medium/Low), remediation status |
| WAF Security pillar | `pfc-alz-assess-waf` | Security pillar score (0–100%) |
| AI Security | `pfc-owasp-agentic`, `pfc-owasp-llm`, MCSB AI domain | AI risk score (0–100%) |
| Previous posture | Baseline or context history | Previous overall posture score + date |

Coverage flags:
- `mcsb_available`: MCSB scores present (required — all others optional)
- `owasp_available`: OWASP findings present
- `waf_available`: WAF Security pillar score present
- `ai_available`: AI security scores present

Adjust weights if components unavailable (normalise to sum = 1.0 across available components).

**G1 checkpoint:** All available inputs loaded ✓ | Coverage flags set ✓ | Weight normalisation calculated ✓

---

## Section 2: Weight Configuration & Kano Alignment

**Quality Gate G2: VE-aligned weights confirmed via HC-GRC-POSTURE-1**

Default weight configuration:

```
MCSB infrastructure:  0.40 (foundation — always highest)
OWASP application:    0.25 (if web/API workloads)
WAF Security pillar:  0.20 (if ALZ deployed)
AI Security:          0.15 (if AI workloads)
```

VE weight adjustment logic:
- If customer is AI-first (AI workloads dominate): shift AI weight to 0.25, reduce OWASP to 0.15
- If web/API-only (no AI): remove AI component, redistribute weight to MCSB (0.50) + OWASP (0.30) + WAF (0.20)
- If pure infrastructure (no web apps): MCSB 0.70 + WAF Security 0.30
- If Kano = MUST-BE for compliance (public sector, financial): MCSB weight minimum 0.45

**HC-GRC-POSTURE-1 (Human Checkpoint — Weight Confirmation):**

Present weight configuration with justification. Confirm:
- Weight profile matches customer's workload composition
- MCSB weight appropriate for regulatory exposure
- AI weight set correctly if AI workloads are emerging (higher strategic importance)

Await confirmation before scoring.

**G2 checkpoint:** HC-GRC-POSTURE-1 confirmed ✓ | Final weights set ✓

---

## Section 3: OWASP Finding Conversion to Score

**Quality Gate G3: OWASP findings converted to 0–100 score for aggregation**

Convert OWASP finding counts to a comparable 0–100 score:

```
OWASP Score = 100 − (Critical × 20) − (High × 10) − (Medium × 5) − (Low × 2)
              floored at 0

Adjustment: subtract 5 for each OWASP finding without a remediation plan
```

If `pfc-owasp-pipeline` produced an integrated score → use that directly.

If OWASP not run: set OWASP score = 0, weight = 0 (redistribute).

For AI Security conversion:
```
AI Score = average of:
  - MCSB AI domain score (AI-1 to AI-7) if v2
  - OWASP LLM Top 10 posture score (from pfc-owasp-llm)
  - OWASP Agentic posture score (from pfc-owasp-agentic)
  weighted equally
```

**G3 checkpoint:** OWASP findings converted to scores ✓ | AI Security score calculated ✓

---

## Section 4: Unified Posture Score Calculation

**Quality Gate G4: Unified posture score calculated with all components**

```
Unified Posture Score = Σ(component_score × weight) for all available components

Example:
  MCSB:  66 × 0.40 = 26.4
  OWASP: 58 × 0.25 = 14.5
  WAF:   52 × 0.20 = 10.4
  AI:    74 × 0.15 = 11.1
  ─────────────────────────
  Unified: 62.4  →  62  (rounded)
```

Traffic light classification:
- **Green (80–100)**: Strong posture — maintain and monitor
- **Amber (60–79)**: Moderate exposure — scheduled remediation, management attention
- **Red (0–59)**: Significant exposure — urgent action, board-level visibility

Trend delta: `current - previous` (if previous score available)
- Improving: +n points
- Declining: −n points
- Stable: ±2 points

Weakest component: lowest contributing score (before weight) — drives remediation priority.
Weakest domain within MCSB: lowest individual domain score.

**G4 checkpoint:** Unified posture score calculated ✓ | Traffic light assigned ✓ | Trend delta and weakest domain identified ✓

---

## Section 5: Executive Summary & Output

**Quality Gate G5: Full posture report produced**

Executive summary paragraph (150 words, board-ready):

```
[Customer] Azure security posture is currently [AMBER/GREEN/RED] at [score]/100,
representing a [improvement/decline] of [N] points since the previous assessment
on [date]. The overall score reflects [MCSB infrastructure at N%], [application
security at N% based on OWASP assessment], and [WAF Security pillar at N%].

The most significant exposure is [weakest domain/component] at [score]%, where
[top 2 risk findings summarised]. [N] Critical and [N] High findings require
priority attention. Based on the current trajectory and implementation plan,
we expect posture to reach [Green/Amber] band by [Phase 2 end date].

Recommended immediate actions: [top 3 from remediation backlog].
```

Full posture report output:
1. **Posture Dashboard**: unified score, traffic light, component breakdown, trend delta
2. **Component Detail**: per-component score, weight, contribution, traffic light
3. **MCSB Domain Heatmap**: 12 domains traffic-lighted with scores
4. **Trend Chart Data**: historical posture scores for `pfc-grc-mcsb-report`
5. **Executive Summary Paragraph**: board-ready text
6. **Priority Actions**: top 5 actions with expected score improvement per action

**G5 checkpoint:** All 6 output artefacts produced ✓ | Executive summary paragraph drafted ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| MCSB-ONT | v2.0.0 | Domain scores, control compliance |
| GRC-FW-ONT | v3.0.0 | Governance framing for posture narrative |
| ERM-ONT | v1.0.0 | Risk categorisation for posture components |
| VP-ONT | v1.0.0 | Benefit/Problem tagging for executive summary |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-POSTURE-ERM-001 | `pfc-grc:UnifiedPostureScore` → `erm:Risk:SecurityRisk` | quantifiesRisk |
| JP-POSTURE-VP-001 | `pfc-grc:PostureGap` → `vp:Problem` | identifiesProblem |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-grc-mcsb-report` (SKL-100) | Unified score, trend chart data, executive summary |
| `pfc-alz-strategy` (SKL-090) | Posture score feeds strategic recommendations |
| `pfc-hcr-analyse` (SKL-108) | Posture score feeds HCR health check section |
| `pfc-grc-baseline` (SKL-092) | Posture score added to baseline historical record |
