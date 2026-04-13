---
name: pfc-grc-mcsb-report
description: AGENT_AUTONOMOUS MCSB compliance report generation — produces 4 report types (domain detail, executive summary, trend analysis, regulatory mapping) from assessment and posture data. Multi-format output ready for pfc-hcr-compose and SlideDeck pipeline.
argument-hint: "[assessment context or 'use findings'] [--type domain|executive|trend|regulatory|all] [--format md|json|slide-data]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-grc-mcsb-report — MCSB Compliance Reporting

**Skill ID:** SKL-100
**Version:** v1.0.0
**Type:** AGENT_AUTONOMOUS
**Feature:** F74.20d
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 5.8 — 4 report types, multi-format output, regulatory cross-mapping, trend narrative
HG-02 (Autonomy):   8.0 — fully autonomous; no human checkpoint required for report generation
Classification:     AGENT_AUTONOMOUS
```

---

## What You Do

You generate MCSB compliance reports in four types for different audiences. You consume assessment outputs from `pfc-grc-mcsb-assess`, posture scores from `pfc-grc-posture`, benchmark gap data from `pfc-grc-mcsb-benchmark`, and historical trend data from `pfc-grc-baseline`. You produce report content in Markdown, structured JSON (for `pfc-hcr-compose`), or slide data (for the SlideDeck pipeline). You are fully autonomous — reports are always a synthesis task, not a decision task.

Default `--type all` produces all four report types in a single run.

---

## Section 1: Input Assembly

**Quality Gate G1: All available report inputs loaded, report type scope confirmed**

1. Load all available assessment outputs from context:
   - MCSB domain scores and non-compliant controls (`pfc-grc-mcsb-assess`)
   - Unified posture score and executive paragraph (`pfc-grc-posture`)
   - Three-state gap matrix (`pfc-grc-mcsb-benchmark`)
   - SPC baseline and trend data (`pfc-grc-baseline`)
   - Remediation backlog summary (`pfc-grc-remediate`)
   - Drift findings (if recent drift run)
2. Confirm `--type` scope: domain / executive / trend / regulatory / all
3. Confirm `--format`: md (default), json, slide-data, or all
4. Load FDN context: customer name, assessment date, regulatory frameworks (NCSC CAF / ISO 27001 / PCI-DSS / UK GDPR)
5. Load MCSB-ONT regulatory mapping table for `--type regulatory`

**G1 checkpoint:** Inputs loaded ✓ | Report type and format confirmed ✓ | FDN context loaded ✓

---

## Section 2: Domain Detail Report

**Quality Gate G2: Domain detail report produced (if `--type domain` or `--type all`)**

Audience: technical architects, security engineers.

Structure:
```
# MCSB Compliance Domain Report — [Customer] — [Date]
Assessment scope: [tenant/subscriptions/MG]
MCSB version: [v1/v2]
Overall posture: [score]/100 [traffic light]

## Executive Overview
[3 sentences from pfc-grc-posture executive paragraph]

## Domain Results

### NS — Network Security: [score]% [🟢/🟡/🔴]
| Control | Status | Evidence | Risk | Remediation |
|---|---|---|---|---|
| NS-1 | ✅ Compliant | Policy: Deny-Subnet-Without-Nsg | — | — |
| NS-3 | ❌ Non-compliant | Azure Firewall missing on hub | Critical | Deploy Azure Firewall + policy |
| NS-6 | ⚠️ Partial | WAF missing on 3/5 web apps | High | Deploy Application Gateway WAF |

[... repeat for all 12 domains ...]

## Critical Findings Summary
[Table: domain, control, severity, recommended action, effort estimate]

## Remediation Priority
[Top 20 from pfc-grc-remediate ordered backlog]
```

**G2 checkpoint:** Domain detail report produced ✓ | All non-compliant controls listed with remediation ✓

---

## Section 3: Executive Summary Report

**Quality Gate G3: Executive summary report produced (1 page, board-ready)**

Audience: CISO, CTO, board-level stakeholders.

Structure:
```
# Azure Security Posture — Executive Summary — [Customer] — [Date]

## Headline
[Posture traffic light icon] Security posture: [score]/100 — [GREEN/AMBER/RED]
Trend: [▲ Improving +N pts / ▼ Declining -N pts / → Stable] vs. [previous date]

## Domain Heatmap
[12 domains with traffic light status and score — 3-column layout]
NS: 72% 🟡  |  IM: 52% 🔴  |  PA: 45% 🔴
DP: 80% 🟢  |  AM: 65% 🟡  |  LT: 70% 🟡
IR: 55% 🔴  |  PV: 68% 🟡  |  ES: 85% 🟢
BR: 75% 🟡  |  DS: 60% 🟡  |  GS: 62% 🟡

## Key Risks
[Top 3 Critical/High findings in plain English — one sentence each]

## Recommended Actions
[Top 3 immediate actions — one sentence each with expected impact]

## Compliance Programme Status
Phase 1 (Foundation): [Not started / In progress / Complete]
Target posture (Green band): [Month N] — [estimated date from trajectory]
Investment to date: £[N]  |  Remaining: £[N]  |  Projected ROI: [N]×

## Summary
[Executive paragraph from pfc-grc-posture — 100 words max]
```

**G3 checkpoint:** Executive summary produced, 1-page constraint respected ✓ | Board-readable language confirmed ✓

---

## Section 4: Trend Report

**Quality Gate G4: Trend report produced (if `--type trend` or `--type all`, requires ≥2 data points)**

Audience: security managers, programme governance.

Structure:
```
# MCSB Compliance Trend Report — [Customer] — [Date Range]

## Posture Trend
[Table: Date | Overall Posture | Delta | Key Movement]
2026-01-15 | 54% | — | Baseline
2026-02-12 | 61% | +7 | Phase 1 complete: critical findings closed
2026-03-16 | 66% | +5 | Phase 2 in progress: IM and PA improving

## Domain Trend Table
[Domain × date matrix — scores and delta per period]

## SPC Control Chart Summary
[Per domain: current score vs UCL/LCL, stability status, trend direction]
Stable domains (in control limits): [N]
Unstable domains (investigation required): [list]
Improving trend (3+ consecutive): [list]
Declining trend (3+ consecutive): [list — flag if any]

## Drift Findings (Period)
[Summary of drift findings raised since last assessment]

## Compliance Programme Velocity
Controls closed this period: [N]
Expected vs actual trajectory: [on track / ahead / behind]
Phase [N] gate condition: [met / not met / projected date]
```

If fewer than 2 data points: produce "Establishing trend — baseline recorded, trend visible from next assessment" note.

**G4 checkpoint:** Trend report produced ✓ | SPC chart narrative included ✓

---

## Section 5: Regulatory Mapping Report & Format Output

**Quality Gate G5: Regulatory mapping report produced, all formats output**

Audience: compliance officers, external auditors.

Structure: MCSB control → regulatory framework mapping:

```
# MCSB Regulatory Mapping — [Customer] — [Date]

## Mapping Framework
Each MCSB control is mapped to applicable regulatory requirements.
[Customer] compliance obligations: [NCSC CAF / ISO 27001 / PCI-DSS / UK GDPR]

## Control Compliance by Regulatory Requirement

### NCSC CAF — Cyber Outcomes
| CAF Outcome | MCSB Controls | Current Compliance | Status |
|---|---|---|---|
| B1 — Policy & Standards | GS-1, GS-2, GS-3 | 67% | 🟡 |
| B2 — Identity & Access Control | IM-1, IM-2, IM-7, IM-8, IM-9 | 44% | 🔴 |
| B3 — Asset Management | AM-1, AM-2, AM-3 | 73% | 🟡 |
[... all CAF outcomes ...]

### ISO 27001:2022 — Annex A Controls
[MCSB controls mapped to ISO 27001 Annex A domains]

### UK GDPR — Technical Measures (Art. 32)
[MCSB controls mapped to GDPR Art. 32 security requirements — DP, IM, LT domains]

### PCI-DSS v4.0 (if applicable)
[MCSB controls mapped to PCI-DSS requirements]

## Compliance Gaps with Regulatory Implications
[Non-compliant controls that affect a regulatory obligation — flagged by framework]
```

Multi-format output generation:

**Markdown** (`--format md`): Human-readable report files per type.

**JSON** (`--format json`): Structured data for `pfc-hcr-compose`:
```json
{
  "reportType": "grc-mcsb",
  "date": "YYYY-MM-DD",
  "overallPosture": 66,
  "trafficLight": "amber",
  "domainScores": {...},
  "criticalFindings": [...],
  "executiveParagraph": "...",
  "trendData": [...],
  "regulatoryMapping": {...}
}
```

**Slide data** (`--format slide-data`): Structured content blocks for SlideDeck pipeline:
- Slide 1: Executive headline (posture score, traffic light, trend)
- Slide 2: Domain heatmap (12 domains, traffic lights, scores)
- Slide 3: Critical findings (top 3, plain English)
- Slide 4: Compliance trajectory (chart data)
- Slide 5: Next steps (top 3 actions)

**G5 checkpoint:** Regulatory mapping report produced ✓ | All requested formats output ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| MCSB-ONT | v2.0.0 | Control entities, regulatory mapping table |
| NCSC-CAF-ONT | v1.0.0 | CAF outcome mapping |
| GRC-FW-ONT | v3.0.0 | Governance framework for regulatory mapping |
| ERM-ONT | v1.0.0 | Risk category context for findings |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-hcr-compose` (SKL-107) | JSON report data feeds HCR Health Check Report |
| SlideDeck pipeline | Slide data blocks feed MCSB compliance presentation |
| `pfc-alz-strategy` (SKL-090) | Executive summary paragraph feeds ALZ strategy executive 1-pager |
| `pfc-hcr-analyse` (SKL-108) | Trend data and regulatory mapping feed HCR analysis section |
