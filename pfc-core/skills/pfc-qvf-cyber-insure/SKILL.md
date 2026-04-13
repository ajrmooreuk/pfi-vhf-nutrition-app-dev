---
name: pfc-qvf-cyber-insure
description: AGENT_SUPERVISED cyber insurance economics — models premium optimisation from improved GRC posture, excess/deductible reduction, coverage gap analysis against ALE, transfer vs. mitigate decision logic, and insurer evidence packaging. Maps rmf:RiskTreatment[transfer] to financial outcomes.
argument-hint: "[posture and ALE context or 'use findings'] [--current-premium £N] [--excess £N] [--coverage £N] [--policy-horizon years:3]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-qvf-cyber-insure — Cyber Insurance Premium Optimisation

**Skill ID:** SKL-104
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.23
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 6.8 — premium modelling, transfer decision logic, coverage gap analysis, NPV, insurer evidence package
HG-02 (Autonomy):   6.0 — human checkpoint to confirm current policy details before modelling premium delta
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You quantify cyber insurance economics in the context of a GRC remediation programme. You model how improving MCSB posture reduces premiums, narrows excess exposure, and expands coverage; calculate the optimal risk treatment strategy (transfer vs. mitigate vs. accept) per scenario; and package the GRC assessment outputs as an insurer evidence file. All outputs flow into `pfc-qvf-grc-value` as Insurance Savings components of the Cyber Value Equation.

You pause at HC-QVF-INSURE-1 to confirm current policy details before modelling the premium delta.

---

## Section 1: Current Policy & Posture Ingestion

**Quality Gate G1: Current policy terms loaded, current and projected posture available**

1. Load current policy details:
   - From `--current-premium`, `--excess`, `--coverage` arguments, or
   - From FDN context (if policy details documented), or
   - Use market benchmarks if policy not available (flag as estimated)
2. Load unified posture scores:
   - Current posture: from `pfc-grc-posture` SKL-098 output
   - Projected posture by phase: from `pfc-grc-mcsb-benchmark` milestone scores
3. Load residual ALE by phase: from `pfc-qvf-cyber-impact` SKL-101 output
4. Load MCSB domain scores: insurer underwriting typically uses 8 key domains (IM, PA, DP, NS, LT, IR, PV, GS)
5. Load `rmf:RiskTreatment[treatmentStrategy=transfer]` entries from RMF-IS27005-ONT context

**HC-QVF-INSURE-1 (Human Checkpoint — Policy Confirmation):**

If policy details provided via arguments: auto-confirmed.
If estimated from benchmarks: present to human:
- "Current premium estimated at £[N] based on UK cyber insurance market rates for [sector] at [posture]% posture."
- "Please confirm or provide actual premium, excess, and coverage limits."

Await confirmation before modelling delta.

**G1 checkpoint:** Current policy terms confirmed ✓ | Current and projected posture loaded ✓ | Residual ALE schedule loaded ✓

---

## Section 2: Premium Optimisation Modelling

**Quality Gate G2: Projected premium reductions by phase calculated**

Premium-to-posture relationship model (UK cyber insurance market calibration):

```
Premium Reduction % ≈ Posture Improvement % × Sensitivity Factor

Sensitivity Factor by coverage band:
  < £1M coverage:   0.6 (less sensitive — smaller accounts)
  £1M–£5M:          0.8 (moderate sensitivity)
  £5M–£25M:         1.0 (full sensitivity — enterprise underwriting)
  > £25M:           1.1 (high sensitivity — specialist market scrutiny)

Key insurer underwriting factors and their premium impact:
  MFA enforced (IM/PA ≥80%):       −15–25% premium
  EDR deployed (ES ≥80%):          −10–20% premium
  Offline/immutable backups (BR):  −10–15% premium
  IR plan + tested (IR ≥75%):      −5–10% premium
  Cyber awareness training:        −5–10% premium
  MDR/SOC operational (LT ≥80%):  −10–20% premium
```

Calculate premium trajectory:

```
Current Premium:  £[N] at [posture]% overall / IM:[%] PA:[%] ES:[%] BR:[%]

Phase 1 complete: [posture]% → IM gain, PA gain, ES gain
  ΔPremium Phase 1: −£[N] (MFA + EDR deployed = −[%] combined)

Phase 2 complete: [posture]%
  ΔPremium Phase 2: −£[N] (IR plan + backups = −[%])

Destination: [posture]%
  ΔPremium Destination: −£[N] total annual saving
  Projected premium: £[N] (vs current £[N])
```

**G2 checkpoint:** Premium trajectory modelled per phase ✓ | Annual ΔPremium per phase calculated ✓

---

## Section 3: Excess Reduction & Coverage Gap Analysis

**Quality Gate G3: Excess reduction modelled, coverage gaps vs ALE identified**

**Excess (Deductible) Reduction:**
```
At improved posture, insurer may reduce excess requirement:
  Current excess: £[N] (self-insured retention)
  Improved posture: excess reduction −20–40% (negotiation leverage from evidence)
  ΔExcess (annual exposure reduction): £[N]

Excess exposure quantification:
  Expected excess claims per year = ARO × P(claim exceeds excess)
  Annual excess exposure = Expected excess claims × Excess amount
  Post-improvement excess exposure = same formula with revised ARO
```

**Coverage Gap Analysis:**
```
For each threat scenario:
  ALE (base) = £[N]
  Coverage limit for this scenario type = £[N]

  If ALE > Coverage limit:
    Gap = ALE − Coverage limit
    Uninsured exposure = Gap × ARO
    → Recommend coverage uplift (quantified by gap)

  If ALE < Excess:
    → Risk acceptance is optimal (transfer cost > expected loss)
    → Recommend reducing coverage for this scenario, redirect premium

  Exclusion risk:
    Identify policy exclusions matching active threat scenarios
    (e.g., "nation-state" exclusion vs. state-attributed ransomware)
    Exclusion exposure = ALE of excluded scenarios × ARO
```

**G3 checkpoint:** Excess reduction modelled ✓ | Coverage gaps vs ALE identified ✓ | Uninsured exposure quantified ✓

---

## Section 4: Transfer vs. Mitigate Decision Logic

**Quality Gate G4: Optimal risk treatment determined per scenario**

Apply ISO 27005 risk treatment decision logic per scenario:

```
For each threat scenario:

Transfer Cost     = Annual Premium Attributed % + Expected Excess Claims
Mitigation Cost   = Remediation cost (from pfc-grc-plan) / Policy Horizon years
Residual ALE      = ALE after all planned remediation (from pfc-qvf-cyber-impact Phase 4)
Accepted ALE      = Residual ALE if no additional treatment

Decision:
  If Transfer Cost < Mitigation Cost AND Transfer Cost < Residual ALE:
    → TRANSFER (insurance is cost-optimal)
  If Mitigation Cost < Transfer Cost AND ΔALE > Mitigation Cost:
    → MITIGATE (remediation is cost-optimal, better ROI)
  If Residual ALE < min(Transfer Cost, Mitigation Cost):
    → ACCEPT (risk is tolerable, no additional treatment needed)
  If Residual ALE > erm:RiskAppetite.threshold:
    → ESCALATE (risk exceeds appetite, mandatory treatment required)
```

Produce decision table per scenario:

| Scenario | Transfer Cost/yr | Mitigate Cost/yr | Residual ALE | Decision |
|---|---|---|---|---|
| Ransomware | £45K | £18K | £144K | MITIGATE (phase 1–2) then TRANSFER |
| PII Breach | £20K | £25K | £96K | TRANSFER (insurance cheaper) |
| Cloud misconfig | £8K | £12K | £36K | ACCEPT (below appetite) |

**G4 checkpoint:** Transfer/Mitigate/Accept decision produced per scenario ✓ | rmf:RiskTreatment strategy confirmed ✓

---

## Section 5: Insurance NPV, Evidence Package & Output

**Quality Gate G5: Insurance NPV calculated, broker evidence package produced**

**Insurance NPV** (over `--policy-horizon` years):

```
Year 1: ΔPremium_Phase1 + ΔExcess_Phase1
Year 2: ΔPremium_Phase2 + ΔExcess_Phase2
Year 3: ΔPremium_Dest (full saving locked in at renewal)

Insurance NPV = Σ(Year n savings / (1 + discount_rate)^n)
  Discount rate: 5% (default UK commercial rate)

Total insurance economics:
  3-year NPV of premium savings:  £[N]
  3-year NPV of excess reduction: £[N]
  Coverage optimisation value:    £[N]
  Total insurance economic value: £[N]
```

**Broker Evidence Package** (for renewal negotiation):
- Executive summary: posture improvement narrative and trajectory
- MCSB domain scorecard (current + projected phases)
- Key control evidence: MFA, EDR, backup, IR plan status
- Trend chart: posture over last N assessments (from pfc-grc-baseline)
- Remediation programme summary (phased plan, committed investment)

QVF output — `qvf:CashFlow[COST_SAVING]` per year:
```json
{
  "type": "qvf:CashFlow",
  "category": "COST_SAVING",
  "label": "Cyber Insurance Premium Reduction",
  "year": 2,
  "amount": 28000,
  "currency": "GBP",
  "basis": "MFA + EDR deployed (Phase 1) — 18% premium reduction on £155K annual premium"
}
```

Output artefacts:
1. **Premium Trajectory**: current → Phase 1 → Phase 2 → Destination premiums + ΔPremium per year
2. **Coverage Gap Report**: scenarios, ALE vs. coverage, uninsured exposure, recommendations
3. **Transfer Decision Table**: per scenario with recommendation
4. **Insurance NPV**: 3-year model with sensitivity
5. **Broker Evidence Package**: formatted for insurer submission
6. **QVF CashFlow entries**: COST_SAVING per year for `pfc-qvf-grc-value`

**G5 checkpoint:** Insurance NPV produced ✓ | Broker evidence package ready ✓ | QVF cash flows produced ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| RMF-IS27005-ONT | v1.0.0 | `rmf:RiskTreatment[treatmentStrategy=transfer]`, cost estimate |
| QVF-ONT | v1.0.0 | `qvf:CashFlow[COST_SAVING]`, `qvf:EconomicCase` |
| MCSB-ONT | v2.0.0 | Domain scores as underwriting evidence |
| ERM-ONT | v1.0.0 | `erm:RiskAppetite` threshold for accept/transfer/mitigate boundary |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-qvf-grc-value` (SKL-106) | ΔPremium + ΔExcess = Insurance Savings component |
| `pfc-hcr-analyse` (SKL-108) | Insurance economics feeds HCR financial section |
| `pfc-alz-strategy` (SKL-090) | Transfer decision table feeds strategy risk treatment section |
