---
name: pfc-grc-baseline
description: AGENT_AUTONOMOUS SPC baseline establishment — records domain scores from pfc-grc-mcsb-assess to historical store, calculates mean/σ/UCL/LCL per domain, classifies process stability, sets target lines from VE desired destination. Enables drift detection.
argument-hint: "[assessment output or 'use context'] [--force-reset] [--min-points <n>]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-grc-baseline — Compliance Baseline & SPC Control Limits

**Skill ID:** SKL-092
**Version:** v1.0.0
**Type:** AGENT_AUTONOMOUS
**Feature:** F74.20
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 5.5 — SPC calculations, historical data management, stability classification
HG-02 (Autonomy):   8.0 — fully autonomous; no human intervention required for standard baseline runs
Classification:     AGENT_AUTONOMOUS
```

---

## What You Do

You establish and maintain the statistical process control (SPC) baseline for MCSB compliance monitoring. On each run you record the current domain scores from `pfc-grc-mcsb-assess`, accumulate historical data points, calculate control limits (UCL/LCL at ±2σ), classify each domain as stable or unstable, and set target lines from the customer's VE desired destination. This baseline is the reference state for `pfc-grc-drift` to detect compliance regression.

You are fully autonomous — no human checkpoint. `--force-reset` clears historical data and establishes a fresh baseline (use after major remediation waves).

---

## Section 1: Assessment Output Ingestion

**Quality Gate G1: Current assessment scores loaded and validated**

1. Load domain scores from `pfc-grc-mcsb-assess` output (conversation context or file reference)
2. Validate: 12 domain scores present, each 0–100, timestamp attached
3. Load customer desired destination per domain from VE profile (from `pfc-grc-mcsb-benchmark` output or VE context)
4. Load historical baseline file (JSON format: `baseline-<tenantId>.json`) if exists
5. If `--force-reset`: archive existing historical file with timestamp, start fresh
6. Check minimum data points: SPC is meaningful at n≥3 (warn if <3), reliable at n≥10

**G1 checkpoint:** Current scores loaded ✓ | Historical file loaded or initialised ✓ | Min-points status checked ✓

---

## Section 2: Historical Data Recording

**Quality Gate G2: Current data point appended to historical store**

Append current assessment data point to historical store:

```json
{
  "assessmentDate": "YYYY-MM-DD",
  "version": "MCSB v2",
  "scope": "<tenantId>",
  "domainScores": {
    "NS": 72, "IM": 58, "PA": 45, "DP": 80,
    "AM": 65, "LT": 70, "IR": 55, "PV": 68,
    "ES": 85, "BR": 75, "DS": 60, "GS": 62
  },
  "overallPosture": 66,
  "dataPointIndex": 4
}
```

Maintain rolling window: default 24 data points (configurable). Prune oldest if window exceeded.
Save updated historical file.

**G2 checkpoint:** Data point appended ✓ | Historical file saved ✓

---

## Section 3: SPC Control Limit Calculation

**Quality Gate G3: UCL/LCL calculated for all domains with sufficient data points**

For each domain with n≥3 data points:

```
Mean (x̄)  = Σ(scores) / n
Std Dev (σ) = √(Σ(score - x̄)² / n)
UCL         = x̄ + (2 × σ)   [Upper Control Limit]
LCL         = max(0, x̄ - (2 × σ))  [Lower Control Limit — floor at 0]
Target      = customer desired destination score for this domain
```

Process stability classification per domain:
- **Stable (In Control)**: Current score between LCL and UCL, no run rules triggered
- **Unstable — High Variance** (σ > 15): Process is unpredictable, investigation needed
- **Unstable — Breach**: Current score below LCL (triggers drift alert)
- **Trending Down**: 3+ consecutive data points decreasing (triggers drift alert)
- **Trending Up**: 3+ consecutive data points increasing (positive signal)
- **Insufficient Data** (n<3): Cannot calculate — record as "establishing"

Run rules checked (Nelson rules):
- Rule 1: One point beyond ±2σ (breach)
- Rule 2: Nine consecutive points on same side of mean
- Rule 3: Six consecutive points trending in one direction
- Rule 4: Fourteen consecutive alternating points (unusual instability)

**G3 checkpoint:** UCL/LCL calculated for all domains with n≥3 ✓ | Stability classification per domain ✓ | Run rules checked ✓

---

## Section 4: Baseline Record & SPC Output

**Quality Gate G4: Baseline record produced and saved**

Produce baseline record:

```json
{
  "baselineVersion": "v<n>",
  "generatedDate": "YYYY-MM-DD",
  "tenantId": "<id>",
  "mscbVersion": "v2",
  "dataPoints": 7,
  "domains": {
    "NS": {
      "mean": 68.4, "stdDev": 8.2,
      "UCL": 84.8, "LCL": 52.0,
      "target": 80,
      "current": 72,
      "stability": "Stable",
      "trend": "improving",
      "belowTarget": true,
      "gapToTarget": 8
    }
  },
  "overallPosture": {
    "mean": 65.1, "stdDev": 6.8,
    "UCL": 78.7, "LCL": 51.5,
    "current": 66,
    "stability": "Stable"
  }
}
```

SPC control chart data (per domain): list of (date, score, UCL, LCL, target) tuples — for chart rendering by `pfc-grc-mcsb-report`.

Domains below target: list for `pfc-grc-drift` priority monitoring.
Unstable domains: list with instability type — flag for investigation.

**G4 checkpoint:** Baseline record produced ✓ | SPC chart data produced ✓ | Unstable domains flagged ✓

---

## Section 5: Baseline Summary Output

**Quality Gate G5: Summary artefact produced, drift detection configuration updated**

Produce baseline summary:
- Overall stability status: Stable / Unstable (% domains stable)
- Domains at or above target: n/12
- Domains below target: list with gap magnitude
- Domains with insufficient data: list (n<3, "establishing")
- Unstable domains: list with instability type and recommended action
- Drift detection thresholds: LCL per domain (handed to `pfc-grc-drift`)
- Next recommended assessment date (based on instability — unstable domains → weekly, stable → monthly)

**G5 checkpoint:** Summary produced ✓ | Drift thresholds ready for pfc-grc-drift ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| MCSB-ONT | v2.0.0 | Domain entities for baseline structure |
| GRC-FW-ONT | v3.0.0 | Governance context for stability classification |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-grc-drift` (SKL-094) | LCL per domain, unstable domains, drift thresholds |
| `pfc-grc-mcsb-report` (SKL-100) | SPC chart data for trend reporting |
| `pfc-grc-posture` (SKL-098) | Trend direction per domain feeds posture trend delta |
