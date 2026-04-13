---
name: pfc-qvf-grc-roi
description: AGENT_SUPERVISED GRC investment ROI and economic case — calculates ROI%, NPV, payback period, and 5-year TCO comparison (adaptive GRC vs. point-in-time audit) using ΔALE from cyber-impact and remediation costs. Produces board-ready investment case. Maps rmf:RiskTreatment[mitigate] to financial outcomes.
argument-hint: "[impact and cost context or 'use findings'] [--discount-rate 0.05] [--horizon years:5] [--compare-model point-in-time|adaptive]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-qvf-grc-roi — GRC Investment ROI & Economic Case

**Skill ID:** SKL-105
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.24a
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 7.0 — ROI, NPV, payback, TCO comparison, sensitivity, adaptive vs point-in-time model, economic case composition
HG-02 (Autonomy):   6.0 — human checkpoint to confirm investment figures before board presentation
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You calculate the full GRC investment return using the core FAIR-aligned formula: ROI = (ΔALE − Remediation_Cost) / Remediation_Cost × 100. You build a multi-year NPV model with cash flows phased to match the implementation plan, calculate payback period, and compare adaptive GRC TCO against periodic point-in-time audit. You pause at HC-QVF-ROI-1 before the economic case is used in board-level investment justification.

---

## Section 1: Input Assembly

**Quality Gate G1: All financial inputs loaded and validated**

Load required inputs:

| Input | Source | What Is Used |
|---|---|---|
| ΔALE per phase | `pfc-qvf-cyber-impact` | Risk reduction value (numerator component) |
| ΔPremium per year | `pfc-qvf-cyber-insure` | Insurance savings (additional benefit) |
| Remediation costs per phase | `pfc-grc-plan` | Investment costs (denominator) |
| Phase schedule | `pfc-grc-plan` | Cash flow timing |
| Risk appetite threshold | ERM-ONT `erm:RiskAppetite` | Investment floor (min viable risk reduction) |
| Discount rate | `--discount-rate` or default 5% | NPV calculation |
| Horizon | `--horizon` or default 5 years | NPV window |

Validate: ΔALE, remediation costs, and phase timeline all from consistent planning round.
Flag if inputs are from different assessment dates (stale data risk).

**G1 checkpoint:** All inputs loaded ✓ | Temporal consistency validated ✓

---

## Section 2: GRC ROI Calculation

**Quality Gate G2: ROI calculated per phase and cumulatively**

Core GRC ROI formula:

```
GRC ROI = (ALE_before − ALE_after − Remediation_Cost) / Remediation_Cost × 100

Expanded:
  Benefit = ΔALE (risk reduction) + ΔPremium (insurance saving)
  Cost    = Remediation_Cost (implementation + tooling + people)

ROI = (Benefit − Cost) / Cost × 100
```

Calculate ROI per phase and cumulative:

```
Phase 1 — Foundation (Year 1):
  Investment:    £[N]  (Phase 1 remediation cost)
  ΔALE benefit:  £[N]  (ALE reduction from Phase 1 controls)
  ΔPremium:      £[N]  (insurance saving from Phase 1 posture gain)
  Net benefit:   £[N]
  Phase 1 ROI:   [N]%

Cumulative (Phases 1+2):
  Cumulative investment: £[N]
  Cumulative benefit:    £[N]
  Cumulative ROI:        [N]%

Cumulative (Full programme, Phase 1–4):
  Total investment:  £[N]
  Total benefit:     £[N]
  Programme ROI:     [N]%  ← headline board figure
```

Apply `qvf:ValueModel.roi` entity with all ROI figures.

**G2 checkpoint:** Per-phase and programme ROI calculated ✓ | `qvf:ValueModel.roi` populated ✓

---

## Section 3: NPV Model & Payback Period

**Quality Gate G3: 5-year NPV model produced, payback period identified**

Build annual cash flow model:

```
Year 0 (Phase 1):
  Outflows: −£[Phase 1 cost]
  Inflows:  +£[ΔALE Phase 1] + £[ΔPremium Year 1]
  Net Year 0: £[N]
  Discounted: £[N] / (1.05)^0

Year 1 (Phase 2):
  Outflows: −£[Phase 2 cost]
  Inflows:  +£[ΔALE cumulative Phase 2] + £[ΔPremium Year 2]
  Net Year 1: £[N]
  Discounted: £[N] / (1.05)^1

Year 2 (Phase 3–4):
  ...

Years 3–4 (Continuous assurance):
  Outflows: −£[continuous assurance operational cost: pfc-grc-drift + quarterly assessment]
  Inflows:  +£[full ΔALE at destination] + £[full ΔPremium at destination]
```

NPV = Σ(Net Year n / (1 + discount_rate)^n) for n=0 to horizon

Payback period: month in which cumulative net cash flow first becomes positive.
```
Cumulative cash flow by month:
  Month 1–4  (Phase 1): −£[N] (investment outflow)
  Month 5    (Phase 1 complete): +£[N] ΔALE starts flowing
  Month [N]  (Payback): cumulative = £0 → BREAK-EVEN
  Month [N]+ : net positive
```

**G3 checkpoint:** 5-year NPV produced ✓ | Payback period identified ✓ | Break-even month identified ✓

---

## Section 4: Adaptive GRC vs. Point-in-Time TCO Comparison

**Quality Gate G4: 5-year TCO comparison produced**

Compare two delivery models over 5 years:

**Model A — Point-in-Time Audit (traditional):**
```
Year 1: Annual penetration test (£20–40K) + ISO 27001 assessment (£15–30K)
Year 2: Repeat assessments (same cost)
Year 3: Recertification (£20–35K additional)
Year 4–5: Repeat
Continuous monitoring: manual (2 FTE security analyst × £60K = £120K/year)
5-year TCO: £[N]

Posture improvement: LIMITED (point-in-time, not continuous)
ΔALE over 5 years: £[N] (lower — gaps reopen between audits)
```

**Model B — Adaptive GRC (pfc-alz-pipeline + skills):**
```
Year 1: Phase 1–2 implementation (£[N])
Year 2: Phase 3–4 completion (£[N])
Years 3–5: Continuous assurance (pfc-grc-drift operational, quarterly assessment: £[N]/year)
5-year TCO: £[N]

Posture improvement: CONTINUOUS (drift detection, monthly posture checks)
ΔALE over 5 years: £[N] (higher — continuous risk reduction maintained)
```

Comparison:
```
5-year TCO difference:  Adaptive − Point-in-Time = £[N] (Adaptive may cost more or less)
5-year ΔALE difference: Adaptive − Point-in-Time = £[N] (Adaptive delivers significantly more)
Net 5-year advantage of Adaptive GRC = ΔALE difference − TCO difference = £[N]
```

**G4 checkpoint:** 5-year TCO comparison produced ✓ | Adaptive GRC advantage quantified ✓

---

## Section 5: Economic Case & HC-QVF-ROI-1

**Quality Gate G5: Board-ready economic case produced, HC-QVF-ROI-1 confirmed**

**HC-QVF-ROI-1 (Human Checkpoint — Investment Case Confirmation):**

Present economic case summary for human validation before board use:
- Programme ROI and NPV figures
- Key assumptions driving ROI (ΔALE estimates, implementation costs)
- Payback period
- Adaptive vs. point-in-time comparison
- Confirm: "Are implementation cost estimates accurate? Is ΔALE modelling reasonable?"

Await confirmation. Record validation as `qvf:Assumption[status=validated]`.

Board-ready investment case output:

```
╔══════════════════════════════════════════════════════════════╗
║  GRC PROGRAMME INVESTMENT CASE — [CUSTOMER] — [DATE]         ║
╠══════════════════════════════════════════════════════════════╣
║  INVESTMENT                                                  ║
║  Total programme cost:    £[N]  (over [N] months)            ║
║  Annual running cost:     £[N]  (continuous assurance)       ║
╠══════════════════════════════════════════════════════════════╣
║  RETURN                                                      ║
║  Risk reduction value:    £[N]/yr  (ΔALE)                    ║
║  Insurance savings:       £[N]/yr  (premium + excess)        ║
║  Total annual benefit:    £[N]/yr                            ║
╠══════════════════════════════════════════════════════════════╣
║  ECONOMICS                                                   ║
║  Programme ROI:           [N]%                               ║
║  NPV (5-year):            £[N]                               ║
║  Payback:                 Month [N]                          ║
╠══════════════════════════════════════════════════════════════╣
║  VS. ALTERNATIVE                                             ║
║  5-yr adaptive advantage: £[N] vs. point-in-time audit       ║
╚══════════════════════════════════════════════════════════════╝
```

Full output:
1. **Investment Case**: headline ROI, NPV, payback, programme summary
2. **Cash Flow Model**: year-by-year phased cash flows (investment + benefit)
3. **Sensitivity Analysis**: optimistic/base/pessimistic NPV
4. **TCO Comparison**: 5-year adaptive vs. point-in-time
5. **`qvf:EconomicCase`**: complete structured object with all financial model data
6. **`qvf:BreakEvenAnalysis`**: payback period detail

**G5 checkpoint:** HC-QVF-ROI-1 confirmed ✓ | All 6 output artefacts produced ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| RMF-IS27005-ONT | v1.0.0 | `rmf:RiskTreatment[mitigate]`, `rmf:RiskTreatment.costEstimate` |
| QVF-ONT | v1.0.0 | `qvf:ValueModel`, `qvf:CashFlow`, `qvf:EconomicCase`, `qvf:BreakEvenAnalysis` |
| Cyber-Risk-ONT | v1.0.0 | `cra:BusinessImpact.annualisedLossExpectancy` |
| ERM-ONT | v1.0.0 | `erm:RiskAppetite` for investment floor |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-ROI-QVF-001 | `rmf:RiskTreatment[mitigate]` → `qvf:EconomicCase` | producesInvestmentCase |
| JP-ROI-VP-001 | `qvf:EconomicCase` → `vp:Benefit` | deliversBenefit |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-qvf-grc-value` (SKL-106) | ROI, NPV, payback as Investment Case component |
| `pfc-hcr-analyse` (SKL-108) | Economic case feeds HCR financial justification |
| `pfc-alz-strategy` (SKL-090) | Investment case feeds ALZ strategy commercial model |
