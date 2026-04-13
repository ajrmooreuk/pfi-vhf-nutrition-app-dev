---
name: pfc-qvf-cyber-impact
description: AGENT_SUPERVISED Annualised Loss Expectancy calculator — applies FAIR methodology to compute ALE per threat scenario (SLE × ARO), aggregates portfolio cyber risk exposure, produces ΔALE before/after remediation. Wires cra:BusinessImpact.annualisedLossExpectancy to QVF cash flows.
argument-hint: "[threat model context or 'use findings'] [--horizon years:3] [--scenarios all|ransomware|breach|supply-chain|insider|ai|cloud-misconfig]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-qvf-cyber-impact — Annualised Loss Expectancy Calculator

**Skill ID:** SKL-101
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.22a
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 7.2 — FAIR methodology, multi-scenario ALE, sensitivity analysis, portfolio aggregation, ΔALE modelling
HG-02 (Autonomy):   6.0 — human checkpoint to validate assumptions before ALE is used in executive reporting
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You calculate Annualised Loss Expectancy (ALE) per threat scenario using the FAIR methodology. You consume financially-parameterised threat scenarios from `pfc-qvf-threat-econ` and breach cost components from `pfc-qvf-breach-model`, compute SLE × ARO per scenario, run sensitivity analysis, aggregate the portfolio Expected ALE, and calculate ΔALE (before vs. after remediation) for ROI downstream. All outputs are stored as `cra:BusinessImpact.annualisedLossExpectancy` and `qvf:CashFlow[COST_AVOIDANCE]` entries.

You pause at HC-QVF-IMPACT-1 to validate FAIR assumptions before ALE figures are used in board-level reporting.

---

## Section 1: Threat Scenario & Cost Component Ingestion

**Quality Gate G1: All threat scenarios loaded with FAIR parameters, SLE components available**

1. Load financially-parameterised threat scenarios from `pfc-qvf-threat-econ`:
   - Per scenario: threat actor, attack technique, asset, ARO estimate (with confidence interval), Exposure Factor
2. Load SLE cost components from `pfc-qvf-breach-model`:
   - Per scenario type: Direct + Indirect + Regulatory + Reputational + Recovery + Third-Party = SLE
3. Load MCSB domain scores from `pfc-grc-mcsb-assess`:
   - Control effectiveness → used to refine Exposure Factor (better controls = lower EF)
4. Load `erm:RiskAppetite` threshold (acceptable ALE per risk category) from ERM-ONT context
5. Load `--horizon` (default 3 years) for NPV calculation in Section 4
6. Determine active scenarios: `--scenarios all` or specific subset

Control effectiveness → Exposure Factor adjustment:
```
If MCSB domain score ≥ 85%: EF × 0.5  (strong controls, much lower exposure)
If MCSB domain score 60–84%: EF × 0.75
If MCSB domain score < 60%:  EF × 1.0  (no reduction — controls not effective)
```

**G1 checkpoint:** All scenarios loaded ✓ | SLE components available ✓ | EF adjustments calculated ✓

---

## Section 2: ALE Calculation — Per Threat Scenario

**Quality Gate G2: ALE calculated for all in-scope scenarios with sensitivity ranges**

FAIR calculation per scenario:

```
SLE  = Asset Value × Exposure Factor
ALE  = SLE × ARO

Sensitivity scenarios:
  Optimistic: ARO × 0.5, EF × 0.7  (lower frequency, stronger controls)
  Base:       ARO × 1.0, EF × 1.0  (most likely estimate)
  Pessimistic: ARO × 2.0, EF × 1.3  (higher frequency, control failures)
```

Per scenario output:

```
Scenario: Ransomware — Production Azure workloads
  Asset Value:       £2.4M (revenue × 72hr downtime estimate)
  Exposure Factor:   0.60 (EF=0.80 × 0.75 for MCSB LT domain 72%)
  SLE:               £1.44M
  ARO:               0.25 (once every 4 years — base UK sector benchmark)
  ALE (base):        £360K/year

  Sensitivity:
    Optimistic ALE:  £126K/year
    Base ALE:        £360K/year
    Pessimistic ALE: £748K/year

  Store as: cra:BusinessImpact{
    scenario: "ransomware-prod",
    annualisedLossExpectancy: 360000,
    currency: "GBP",
    sensitivityRange: [126000, 748000]
  }
```

Apply across all active scenarios (ransomware, data breach, supply chain, insider, AI/LLM, cloud misconfig).

Tag each ARO and EF input as `qvf:Assumption[sensitivity]`:
- HIGH sensitivity: ARO (frequency estimates are uncertain)
- MEDIUM sensitivity: Exposure Factor (control effectiveness)
- LOW sensitivity: Asset Value (revenue data is known)

**G2 checkpoint:** ALE calculated for all scenarios ✓ | Sensitivity ranges produced ✓ | Assumptions tagged ✓

---

## Section 3: ΔALE Calculation — Before vs. After Remediation

**Quality Gate G3: ΔALE produced for each remediation phase**

Calculate ALE in two states for each scenario:

**Current State ALE** (inherent — before remediation):
- Use current MCSB domain scores for EF adjustment
- Use current ARO estimates

**Projected ALE After Remediation** (residual — by phase):
- Phase 1 complete: apply EF adjustment for domains reaching Phase 1 target scores
- Phase 2 complete: apply EF adjustment for all MUST-BE domains at target
- Phase 4 (destination): apply EF for all domains at desired destination

```
ΔALE per phase = ALE_current − ALE_projected_after_phase
```

Per scenario × per phase matrix:
```
Scenario     | ALE_now  | ALE_P1   | ΔALE_P1  | ALE_P2   | ΔALE_P2  | ALE_dest | ΔALE_dest
Ransomware   | £360K    | £288K    | £72K     | £216K    | £144K    | £144K    | £216K
Data breach  | £480K    | £384K    | £96K     | £288K    | £192K    | £192K    | £288K
Cloud misconfig | £180K | £108K    | £72K     | £90K     | £90K     | £72K     | £108K
```

Portfolio ΔALE (sum across all scenarios per phase) — this is the numerator in `pfc-qvf-grc-roi` ROI formula.

**G3 checkpoint:** ΔALE per phase per scenario calculated ✓ | Portfolio ΔALE aggregated ✓

---

## Section 4: Assumption Validation — HC-QVF-IMPACT-1

**Quality Gate G4: HC-QVF-IMPACT-1 human checkpoint passed**

**HC-QVF-IMPACT-1 (Human Checkpoint — FAIR Assumption Validation):**

Present key assumptions for human validation before ALE figures enter executive reporting:

```
HIGH SENSITIVITY ASSUMPTIONS (most impact on ALE):
1. Ransomware ARO: 0.25/year (once every 4 years)
   Source: UK NCSC sector benchmark [2024]
   Question: Does this reflect your specific threat profile?

2. Data breach exposure: 15,000 PII records estimated
   Source: Purview classification output
   Question: Is this record count accurate?

3. Business interruption: £2.4M per 72-hour downtime
   Source: Revenue ÷ 8,760 hours × 72
   Question: Is revenue figure correct for this business unit?
```

Human validates or overrides each HIGH sensitivity assumption.
Record overrides as `qvf:Assumption[status=validated]` or `qvf:Assumption[status=overridden, humanJustification=...]`.

Recalculate ALE with validated/overridden assumptions.

**G4 checkpoint:** HC-QVF-IMPACT-1 confirmed ✓ | All HIGH sensitivity assumptions validated ✓ | ALE recalculated with validated inputs ✓

---

## Section 5: Portfolio ALE & QVF Output

**Quality Gate G5: Portfolio Expected ALE, QVF cash flows, and output artefacts produced**

Portfolio Expected ALE:
```
Expected ALE = Σ(scenario_weight × scenario_ALE_base) across all scenarios
Confidence range: [Σ optimistic ALEs, Σ pessimistic ALEs]
```

`rmf:Risk.inherentRiskLevel` vs `rmf:Risk.residualRiskLevel`:
- Map portfolio ALE to ERM-ONT risk appetite threshold: above/within/below appetite?
- Flag if any scenario ALE exceeds `erm:RiskAppetite.threshold`

QVF output — for each phase, produce:
```json
{
  "type": "qvf:CashFlow",
  "category": "COST_AVOIDANCE",
  "period": "Phase 1 (Year 1)",
  "amount": 240000,
  "currency": "GBP",
  "source": "ΔALE across all scenarios — Phase 1",
  "confidence": "medium",
  "provenance": "pfc-qvf-cyber-impact v1.0.0"
}
```

Output artefacts:
1. **ALE Register**: per scenario — SLE, ARO, ALE base, sensitivity range, ΔALE by phase
2. **Portfolio ALE Summary**: total expected ALE, confidence range, vs risk appetite
3. **ΔALE Schedule**: ΔALE per phase (feeds `pfc-qvf-grc-roi` ROI formula numerator)
4. **QVF CashFlow entries**: `COST_AVOIDANCE` per phase
5. **Assumption Log**: all `qvf:Assumption` entries with sensitivity, source, validation status

**G5 checkpoint:** Portfolio ALE produced ✓ | ΔALE schedule ready for grc-roi ✓ | QVF cash flows produced ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| Cyber-Risk-ONT | v1.0.0 | `cra:BusinessImpact.annualisedLossExpectancy`, `cra:RiskScenario` |
| RMF-IS27005-ONT | v1.0.0 | `rmf:Risk.inherentRiskLevel`, `rmf:Risk.residualRiskLevel` |
| ERM-ONT | v1.0.0 | `erm:RiskAppetite` threshold, 23 risk categories |
| QVF-ONT | v1.0.0 | `qvf:CashFlow[COST_AVOIDANCE]`, `qvf:Assumption`, `qvf:SensitivityScenario` |
| MCSB-ONT | v2.0.0 | Domain scores for control effectiveness → EF adjustment |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-QVF-IMPACT-ERM-001 | `cra:BusinessImpact` → `erm:Risk` | quantifiesRisk |
| JP-QVF-IMPACT-RMF-001 | `cra:RiskScenario` → `rmf:Risk` | mapsToRiskAssessment |
| JP-QVF-IMPACT-QVF-001 | `cra:BusinessImpact.annualisedLossExpectancy` → `qvf:CashFlow:COST_AVOIDANCE` | generatesValueClaim |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-qvf-grc-roi` (SKL-105) | ΔALE schedule for ROI formula numerator |
| `pfc-qvf-cyber-insure` (SKL-104) | Residual ALE for insurance transfer decision |
| `pfc-qvf-grc-value` (SKL-106) | Risk Reduction Value component of Cyber Value Equation |
| `pfc-hcr-analyse` (SKL-108) | ALE data feeds HCR financial quantification section |
