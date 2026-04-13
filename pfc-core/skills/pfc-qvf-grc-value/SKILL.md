---
name: pfc-qvf-grc-value
description: AGENT_SUPERVISED unified Cyber Value Equation — aggregates all QVF cyber economics (risk reduction, insurance savings, compliance value, operational value) minus GRC investment cost into a single £ figure with confidence range. Maps vp:Benefit → rrr:Result per JP-VP-RRR-001 convention. Produces the "What is our cyber GRC programme worth?" answer.
argument-hint: "[all QVF cyber outputs or 'use findings'] [--horizon years:3] [--include-operational] [--market-access £N]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-qvf-grc-value — Unified Cyber Value Equation

**Skill ID:** SKL-106
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.24b
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 7.0 — 4-component aggregation, sensitivity envelope, VE chain integration, VP-RRR mapping, narrative synthesis
HG-02 (Autonomy):   6.0 — human checkpoint to review unified figure before it appears in client-facing deliverables
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You are the capstone QVF skill for the cyber economics chain. You aggregate all four components of the Cyber Value Equation (Risk Reduction, Insurance Savings, Compliance Value, Operational Value), subtract GRC Investment Cost, and produce a single £ figure with a confidence range. You map every benefit component to VP-ONT and RRR-ONT per the JP-VP-RRR-001 convention, integrate with the VE skill chain (VSOM → OKR → KPI → QVF), and produce the financial narrative that answers: "What is our cyber GRC programme worth?"

You pause at HC-QVF-VALUE-1 to validate the unified figure before it appears in client proposals and board reports.

---

## Section 1: Component Aggregation Setup

**Quality Gate G1: All available QVF cyber outputs loaded, component completeness assessed**

Load all available inputs:

| Component | Source Skill | Entity |
|---|---|---|
| Risk Reduction Value (ΔALE) | `pfc-qvf-cyber-impact` | `qvf:CashFlow[COST_AVOIDANCE]` per phase |
| Insurance Savings | `pfc-qvf-cyber-insure` | `qvf:CashFlow[COST_SAVING]` per year |
| Compliance Value | `pfc-qvf-breach-model` (regulatory fine avoidance) | Regulatory component |
| Operational Value | Calculated in Section 3 (from FDN context) | Downtime + productivity |
| GRC Investment Cost | `pfc-grc-plan` / `pfc-qvf-grc-roi` | Implementation + running cost |

Completeness assessment:
- All 4 inputs available → full Cyber Value Equation
- Insurance inputs missing → use insurance savings = £0 (conservative)
- OWASP inputs missing → note application risk not quantified

**G1 checkpoint:** All available inputs loaded ✓ | Completeness gaps documented ✓

---

## Section 2: Four-Component Value Assembly

**Quality Gate G2: All four value components calculated and assembled**

**Component 1 — Risk Reduction Value (ΔALE):**
```
Source: pfc-qvf-cyber-impact ΔALE schedule
Annual risk reduction = ΔALE_phase4 (at destination, annualised)
Over horizon: ΔALE_Y1 + ΔALE_Y2 + ΔALE_Y3...

Sensitivity: optimistic/base/pessimistic from cyber-impact
Map to: vp:Benefit "Reduced cyber incident financial loss"
       rrr:Result "Annual loss expectancy reduced by £[N]/year"
```

**Component 2 — Insurance Savings:**
```
Source: pfc-qvf-cyber-insure ΔPremium + ΔExcess
Annual saving = ΔPremium_Year3 (full saving at destination)
Over horizon: ΔPremium_Y1 + ΔPremium_Y2 + ΔPremium_Y3...

Sensitivity: medium (depends on insurer renewal negotiation outcome)
Map to: vp:Benefit "Reduced cyber insurance premium"
       rrr:Result "Annual premium saving of £[N]/year from improved posture evidence"
```

**Component 3 — Compliance Value:**
```
Two sub-components:

a) Regulatory penalties avoided:
   Source: pfc-qvf-breach-model Regulatory component × ARO
   Annual value = Regulatory_SLE × ARO × (EF_before − EF_after)
   Sensitivity: HIGH (depends on whether incident occurs)

b) Market access / compliance-gated contracts:
   If `--market-access £N`: direct input
   Else: estimate from FDN context
     Public sector contracts requiring Cyber Essentials Plus, ISO 27001, or MCSB evidence
     Estimated revenue at risk if compliance not achieved = £[N]
     Annual compliance value = Revenue_at_risk × Contract_win_probability_uplift

Map to: vp:Benefit "Regulatory risk avoidance + compliance-gated market access"
       rrr:Result "£[N]/year regulatory exposure reduction; £[N] market access enabled"
```

**Component 4 — Operational Value (if `--include-operational`):**
```
a) Downtime avoidance:
   Source: ΔALE Indirect component (business interruption reduction)
   Annual value = ΔALE_Indirect component

b) Security operations productivity:
   Automated MCSB monitoring (pfc-grc-drift) vs. manual:
   Manual equiv: 1.0 FTE × £[day rate] × 52 weeks = £[N]/year
   Automated cost: negligible vs manual (skill execution cost)
   Productivity saving: £[N]/year

c) Audit preparation time reduction:
   With continuous evidence (pfc-grc-mcsb-report + posture history):
   Annual audit prep time: 10–15 days → 2–3 days
   Saving: [N days × team day rate] = £[N]/year

Map to: vp:Benefit "Operational efficiency from continuous GRC automation"
       rrr:Result "£[N]/year FTE saving from automated compliance monitoring"
```

**G2 checkpoint:** All 4 value components assembled ✓ | VP-ONT and RRR-ONT tags applied to each ✓

---

## Section 3: Unified Cyber Value Calculation

**Quality Gate G3: Unified Cyber Value produced with sensitivity envelope**

```
Cyber Value = Risk Reduction + Insurance Savings + Compliance Value + Operational Value
            − GRC Investment Cost

Annual Cyber Value (Year 3+ at destination, steady state):
  Risk Reduction:    £[N]/year
  Insurance Savings: £[N]/year
  Compliance Value:  £[N]/year
  Operational Value: £[N]/year
  ─────────────────
  Gross Annual Value: £[N]/year
  Less: GRC running cost (continuous assurance): −£[N]/year
  Net Annual Cyber Value: £[N]/year

Horizon Value (over [N] years, phased):
  Year 1: £[N]   (Phase 1 benefits only, full investment)
  Year 2: £[N]   (Phase 2 benefits + Year 1 cumulative)
  Year 3+: £[N]  (Full destination benefits, reduced investment)
  Total Horizon Cyber Value: £[N]

Sensitivity envelope:
  Optimistic: ΔALE × 1.4, Insurance × 1.2, Compliance × 1.3
  Base:       as calculated
  Pessimistic: ΔALE × 0.6, Insurance × 0.8, Compliance × 0.7
  Range: [optimistic, base, pessimistic]
```

**G3 checkpoint:** Unified Cyber Value calculated ✓ | Sensitivity envelope produced ✓ | VP-RRR convention applied ✓

---

## Section 4: VE Chain Integration & HC-QVF-VALUE-1

**Quality Gate G4: VE chain integration points mapped, HC-QVF-VALUE-1 confirmed**

Map Cyber Value back to VE skill chain:

```
VSOM (Strategic Objective):
  "Achieve and sustain best-in-class Azure security posture"
    ↓
OKR:
  Objective 1: "Eliminate critical MCSB compliance risk by Q[N]"
    KR: All MUST-BE domains ≥85% → enables Risk Reduction Value
    ↓
KPI:
  KPI-1: MCSB posture score ≥80% Green band
  KPI-2: Zero Critical findings in monthly drift check
    ↓
VP (Value Proposition):
  vp:Problem: "Critical Azure security gaps create £[N]/year financial exposure"
  vp:Solution: "Adaptive GRC programme closes gaps and maintains continuous assurance"
  vp:Benefit: "£[N]/year Net Cyber Value — 4× ROI over 3 years"
    ↓
QVF (Quantified Value):
  Cyber Value = £[N] (this skill's output)
```

Integration with `pfc-value-calc` (Tier 1 QVF):
- All `qvf:CashFlow[COST_AVOIDANCE]` from cyber-impact → feeds Tier 1 value model
- All `qvf:CashFlow[COST_SAVING]` from cyber-insure → feeds Tier 1 value model
- `qvf:ValueModel` assembled here consumed by pfc-value-calc for portfolio view

**HC-QVF-VALUE-1 (Human Checkpoint — Unified Value Validation):**

Present Cyber Value breakdown for human validation:
- Component breakdown (risk/insurance/compliance/operational/cost)
- Key assumptions driving the figure
- "Does the headline £[N] Cyber Value figure fairly represent the programme value?"
- "Is the VE narrative accurate for this customer?"

Await sign-off before figures enter client-facing deliverables.

**G4 checkpoint:** VE chain integration points mapped ✓ | HC-QVF-VALUE-1 confirmed ✓

---

## Section 5: Cyber Value Narrative & Output Package

**Quality Gate G5: Full Cyber Value output package produced**

Cyber Value narrative (client-facing, 200 words):

```
[Customer] Azure GRC programme delivers a projected [N]-year Cyber Value of £[N],
representing a [N]× return on the £[N] programme investment.

The value comes from four sources: Risk reduction worth £[N]/year as annual
loss expectancy falls from £[N] to £[N]/year after the MCSB remediation programme
closes critical control gaps; insurance savings of £[N]/year as improved posture
unlocks premium reductions and excess renegotiation at renewal; compliance value
of £[N]/year from regulatory fine avoidance and compliance-gated contract access;
and operational savings of £[N]/year through automated continuous compliance
monitoring replacing manual security review effort.

The programme pays back in Month [N], with a 5-year NPV of £[N]. Operating
as continuous adaptive GRC rather than periodic point-in-time audits delivers
£[N] more value over 5 years.
```

Output artefacts:
1. **Cyber Value Dashboard**: component breakdown, unified figure, confidence range
2. **Sensitivity Report**: optimistic/base/pessimistic with assumptions
3. **VE Chain Map**: VSOM → OKR → KPI → VP → QVF linkage
4. **VP-RRR Statement Set**: per benefit component (per JP-VP-RRR-001)
5. **`qvf:ValueModel`**: complete structured object ready for pfc-value-calc
6. **Cyber Value Narrative**: 200-word client-facing paragraph
7. **Slide data**: component breakdown chart data for SlideDeck pipeline

**G5 checkpoint:** HC-QVF-VALUE-1 confirmed ✓ | All 7 output artefacts produced ✓ | qvf:ValueModel ready for Tier 1 QVF ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| QVF-ONT | v1.0.0 | `qvf:ValueModel`, `qvf:CashFlow`, `qvf:EconomicCase` |
| VP-ONT | v1.0.0 | `vp:Problem`, `vp:Solution`, `vp:Benefit` per VE chain |
| RRR-ONT | v1.0.0 | `rrr:Result` per JP-VP-RRR-001 alignment convention |
| Cyber-Risk-ONT | v1.0.0 | `cra:BusinessImpact` — risk reduction value source |
| RMF-IS27005-ONT | v1.0.0 | Risk treatment economics context |
| ERM-ONT | v1.0.0 | Risk appetite context for value floor |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-GRCVAL-VP-001 | `pfc-qvf:CyberValue` → `vp:Benefit` | quantifiesBenefit |
| JP-GRCVAL-RRR-001 | `vp:Benefit` → `rrr:Result` | per JP-VP-RRR-001 convention |
| JP-GRCVAL-QVF-001 | `pfc-qvf:CyberValue` → `qvf:ValueModel` | populatesValueModel |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-value-calc` | `qvf:ValueModel` with all COST_AVOIDANCE + COST_SAVING cash flows |
| `pfc-hcr-compose` (SKL-107) | Cyber Value narrative and component breakdown for HCR |
| `pfc-alz-strategy` (SKL-090) | Unified Cyber Value feeds commercial model and executive 1-pager |
| SlideDeck pipeline | Slide data for cyber value equation presentation |
