---
name: pfc-qvf-breach-model
description: AGENT_AUTONOMOUS breach cost modelling — produces SLE breakdown (Direct + Indirect + Regulatory + Reputational + Recovery + Third-Party) per threat scenario type. Six scenario templates covering ransomware, PII breach, supply chain, insider, AI/LLM, and cloud misconfig. Feeds ALE calculation as SLE.
argument-hint: "[threat scenarios or 'use context'] [--scenario ransomware|breach-pii|supply-chain|insider|ai-llm|cloud-misconfig|all] [--regulatory gdpr|nis2|dora|pci-dss]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-qvf-breach-model — Breach Cost Model

**Skill ID:** SKL-103
**Version:** v1.0.0
**Type:** AGENT_AUTONOMOUS
**Feature:** F74.22c
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 6.5 — 6 scenario templates, 6 cost components each, regulatory multipliers, sensitivity ranges
HG-02 (Autonomy):   7.5 — fully autonomous; no human checkpoint (cost model is deterministic given inputs)
Classification:     AGENT_AUTONOMOUS
```

---

## What You Do

You model breach costs per threat scenario type using six structured cost components: Direct, Indirect, Regulatory, Reputational, Recovery, and Third-Party. You select the appropriate scenario template, parameterise cost components from the organisation's FDN context (revenue, employee count, record count, regulatory obligations), apply regulatory fine multipliers, run sensitivity analysis, and produce SLE breakdowns as `qvf:CashFlow` entries. This is the SLE engine that feeds `pfc-qvf-cyber-impact`.

You are fully autonomous — no human checkpoint. All inputs are deterministic given FDN context.

---

## Section 1: Scenario Selection & Organisational Context

**Quality Gate G1: Active scenarios selected, organisational parameters loaded**

1. Load FDN context:
   - Annual revenue (for Indirect component — downtime cost per hour)
   - Employee count (for productivity loss, insider scenario scope)
   - PII record count estimate (from Purview classification output or FDN estimate)
   - Industry sector and regulatory obligations (`--regulatory`)
   - Azure cloud spend (for recovery cost estimation — cloud resource rebuild)
2. Load active threat scenarios from `pfc-qvf-threat-econ` (scenario type list)
3. Select templates matching active scenario types:
   - `ransomware` — business interruption + recovery + NIS2/DORA
   - `breach-pii` — notification + ICO/GDPR + reputational churn
   - `supply-chain` — third-party liability + SLA penalties
   - `insider` — investigation + IP theft + employment legal
   - `ai-llm` — model remediation + AI Act + data poisoning recovery
   - `cloud-misconfig` — data exposure + compliance remediation + MCSB impact
4. Load GDPR-ONT Art 83 thresholds, NIS2 fine caps, DORA requirements where `--regulatory` flags active

**G1 checkpoint:** FDN context loaded ✓ | Active scenarios selected ✓ | Regulatory parameters loaded ✓

---

## Section 2: SLE Calculation — Direct & Indirect Components

**Quality Gate G2: Direct and Indirect cost components calculated for all active scenarios**

**Direct Costs** (incident response, forensics, legal, notification):

```
IR & Forensics:
  Internal: Security team hours × day rate (est. 5–20 days per incident)
  External: DFIR retainer call-off or emergency engagement (£15K–£150K UK range)

Legal (external counsel):
  Data breach: £20K–£100K (ICO notification, contracts review)
  Ransomware: £15K–£50K (ransom negotiation counsel, legal advice)
  Supply chain: £30K–£200K (contractual liability defence)

Notification:
  GDPR notification: per-record cost × affected records
    UK benchmark: £20–£40 per notification letter (postage, staff, tracking)
  Credit monitoring: £15–£30 per affected customer per year (12-month minimum)
```

**Indirect Costs** (business interruption):

```
Revenue Impact = (Annual Revenue / 8760 hours) × Mean Time to Recover (MTTR hours)

MTTR benchmarks by scenario (UK/Azure environment):
  Ransomware:          72–240 hours (3–10 days) — dependent on backup maturity
  Cloud misconfig:     4–24 hours
  Supply chain:        24–96 hours (dependent on third-party response)
  Insider:             48–168 hours (investigation-dependent)
  AI/LLM exploit:      24–72 hours (model rollback + revalidation)

Productivity loss (employees):
  = Employee count × Daily productivity cost × (MTTR / 24)
  UK average: £350–£600/day per knowledge worker affected
```

**G2 checkpoint:** Direct and Indirect components calculated for all scenarios ✓

---

## Section 3: Regulatory Fine Calculation

**Quality Gate G3: Regulatory fine exposure calculated per active regulatory framework**

Apply regulatory multipliers:

**GDPR Art 83 (UK GDPR / EU GDPR):**
```
Tier 1 (Art 83.4): Up to £8.7M or 2% global annual turnover (whichever higher)
  Applies to: operational/process violations
Tier 2 (Art 83.5): Up to £17.5M or 4% global annual turnover (whichever higher)
  Applies to: core principle violations (lawfulness, data subject rights)

Breach fine estimate:
  Base = min(4% × Annual Revenue, £17.5M)
  Adjust down for: voluntary disclosure, good-faith cooperation, prior compliance evidence
  Typical ICO fine range: 0.5–3% of UK turnover (based on precedent)
  Use: 1.5% of annual revenue as base estimate (ICO precedent average)
```

**NIS2 (Network and Information Security Directive 2):**
```
Essential entities: up to €10M or 2% global annual turnover
Important entities: up to €7M or 1.4% global annual turnover
NIS2 applies to: ransomware impacting critical services, supply chain incidents
Fine estimate: 1.0–1.5% annual revenue (for qualifying incidents)
```

**DORA (Digital Operational Resilience Act — financial sector):**
```
Applies if customer is financial services
ICT disruption fine: up to €5M or 1% average daily global turnover
For Azure LZ disruption to financial services: apply if Indirect downtime > 2 hours
```

**PCI-DSS (if applicable):**
```
Card brand fines: £5K–£100K per month until compliance restored
Card replacement: £3–£7 per card × affected cards
```

Regulatory fine = Most likely fine (median precedent), not maximum exposure. Flag maximum as pessimistic scenario.

**G3 checkpoint:** Regulatory fine exposure calculated for all active frameworks ✓ | Pessimistic (max) and base (median) flagged ✓

---

## Section 4: Reputational, Recovery & Third-Party Components

**Quality Gate G4: All remaining SLE components calculated, full SLE assembled**

**Reputational Costs:**
```
Customer Churn:
  = At-Risk Customers × Churn Probability × Customer Lifetime Value
  At-risk customers: PII breach = all notified; ransomware = 15% (service disruption)
  Churn probability post-breach: 20–35% (UK consumer data — NatWest, ICO survey)
  CLV: Annual revenue / Customer count × Average retention years

Brand damage multiplier:
  B2B: lower churn but longer sales cycle impact — model as 3-6 month revenue delay
  B2C: higher churn, faster — apply within 90-day window
```

**Recovery Costs:**
```
Technical recovery:
  Ransomware: Rebuild infra (Azure rebuild cost) + data restore (backup retrieval time)
  Data breach: Remediate exposed systems, rotate credentials, patch vector
  AI/LLM: Model retraining cost + validation + redeployment
  Azure rebuild estimate: Azure cloud spend × 0.25 (25% of annual spend for full rebuild)

Security hardening post-incident:
  Accelerated MCSB remediation: Phase 1 implementation cost (from pfc-grc-plan)
```

**Third-Party Costs:**
```
Contractual SLA penalties:
  = Contracted SLA uptime % shortfall × penalty rate per contract
  Typical: £10K–£500K per major contract breach

Supply chain liability (if applicable):
  = Downstream partner losses attributable to breach × % liability under contract

Class action / collective redress:
  PII breach: estimated settlement per claimant × projected claimants
  UK GDPR Art 82 individual compensation: £500–£3,000 per affected individual (precedent)
```

**Assemble Full SLE:**
```
SLE = Direct + Indirect + Regulatory + Reputational + Recovery + Third-Party

Sensitivity:
  Optimistic: −40% on Regulatory, −30% on Reputational, −20% on Direct
  Base: as calculated
  Pessimistic: +50% on Regulatory (max fine), +40% on Reputational, +30% on Indirect
```

**G4 checkpoint:** All 6 components calculated ✓ | Full SLE assembled with sensitivity ranges ✓

---

## Section 5: QVF Cash Flow Output & Scenario Register

**Quality Gate G5: qvf:CashFlow entries produced, scenario SLE register output**

For each cost component per scenario, produce `qvf:CashFlow` entry:

```json
{
  "type": "qvf:CashFlow",
  "scenario": "ransomware-prod",
  "component": "Indirect — Business Interruption",
  "amount": 288000,
  "currency": "GBP",
  "basis": "£2.4M revenue × 120hr MTTR / 8760hrs",
  "sensitivity": "MEDIUM",
  "optimistic": 172800,
  "pessimistic": 432000,
  "provenance": "pfc-qvf-breach-model v1.0.0"
}
```

Output:
1. **SLE Register**: per scenario — all 6 components, base/optimistic/pessimistic, total SLE
2. **Regulatory Exposure Summary**: per framework — fine estimate, maximum exposure, basis
3. **QVF CashFlow Entries**: structured objects for `pfc-qvf-cyber-impact` consumption
4. **`qvf:CalculationProvenance`**: data sources, methodology, assumptions, confidence per scenario

**G5 checkpoint:** SLE Register produced ✓ | QVF CashFlow entries ready ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| Cyber-Risk-ONT | v1.0.0 | `cra:RiskScenario`, `cra:BusinessImpact` |
| RMF-IS27005-ONT | v1.0.0 | `rmf:RiskContext`, `rmf:Asset` |
| QVF-ONT | v1.0.0 | `qvf:CashFlow`, `qvf:Assumption`, `qvf:CalculationProvenance` |
| GRC-FW-ONT | v3.0.0 | Regulatory framework context |
| ERM-ONT | v1.0.0 | Risk category mapping for cost components |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-qvf-cyber-impact` (SKL-101) | SLE breakdown per scenario for ALE calculation |
| `pfc-qvf-grc-roi` (SKL-105) | Recovery + Direct costs in ROI denominator context |
| `pfc-qvf-grc-value` (SKL-106) | Regulatory fine avoidance = Compliance Value component |
