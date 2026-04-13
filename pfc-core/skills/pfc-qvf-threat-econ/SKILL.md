---
name: pfc-qvf-threat-econ
description: AGENT_SUPERVISED FAIR financial overlay on threat model — maps threat actors to ARO via MITRE ATT&CK frequency, vulnerabilities to Exposure Factor via CVSS, assets to financial value. Produces fully-parameterised FAIR risk scenarios for cyber-impact ALE calculation.
argument-hint: "[threat model context or 'use findings'] [--sector finance|healthcare|public-sector|manufacturing|retail] [--asset-data 'revenue:£Nm,employees:N']"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-qvf-threat-econ — Threat Model Financial Overlay (FAIR)

**Skill ID:** SKL-102
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.22b
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 7.0 — FAIR parameterisation, MITRE ATT&CK frequency mapping, CVSS→EF translation, asset valuation, assumption tagging
HG-02 (Autonomy):   6.5 — human checkpoint to confirm asset valuations before scenarios are parameterised
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You apply the FAIR (Factor Analysis of Information Risk) financial overlay to qualitative threat model outputs. You transform threat actors into ARO estimates using MITRE ATT&CK frequency data and sector benchmarks, translate CVSS vulnerability scores into Exposure Factors, and value assets using business criticality and revenue attribution. The result is a set of fully-parameterised FAIR risk scenarios ready for `pfc-qvf-cyber-impact` ALE calculation.

You pause at HC-QVF-ECON-1 to confirm asset valuations with a human before scenarios are finalised.

---

## Section 1: Threat Model Output Ingestion

**Quality Gate G1: Threat scenarios, assets, and vulnerabilities loaded from threat model**

1. Load threat model output from context — expected from `pfc-owasp-threat-model` or RAID-ONT threat log:
   - Threat actors (type, capability, motivation)
   - Attack techniques (MITRE ATT&CK technique IDs where available)
   - Vulnerabilities (with CVSS scores or severity classification)
   - Assets at risk per scenario
2. Load `rmf:RiskContext` from RMF-IS27005-ONT:
   - Business context (sector, scale, regulatory obligations)
   - Asset inventory from `rmf:Asset` entities
3. Load FDN context: annual revenue, employee count, sector, key dependencies
4. Load `--sector` for benchmark calibration (affects ARO estimates)
5. If no threat model available: generate FAIR scenarios from MCSB domain gaps (each Critical/High finding is a scenario seed)

**G1 checkpoint:** Threat scenarios loaded ✓ | Assets identified ✓ | FDN context loaded ✓

---

## Section 2: Asset Valuation

**Quality Gate G2: Financial value assigned to all at-risk assets, HC-QVF-ECON-1 confirmed**

Asset valuation methodology per `rmf:Asset` type:

**Revenue-generating assets** (production workloads, e-commerce, APIs):
```
Asset Value = Annual Revenue × Revenue Attribution % × (1 + Strategic Multiplier)
Business Interruption Component = (Revenue / 8760 hours) × Mean Time to Recover (hrs)
```

**Data assets** (customer PII, IP, financial records):
```
Asset Value = Record Count × Per-Record Cost (sector benchmark)
  PII records: £75–£150 per record (UK ICO precedent)
  Financial records: £150–£350 per record (FCA precedent)
  IP/trade secrets: Revenue × Market Advantage % (estimated)
```

**Infrastructure assets** (Azure LZ, hub network, identity):
```
Asset Value = Rebuild Cost + Business Interruption during rebuild
  Azure LZ: Engineering days × day rate + workload downtime
```

**Brand/reputational asset** (implicit — affects all scenarios):
```
Reputational Value = Customer Lifetime Value × At-Risk Customer %
  At-risk customer % from Kano classification (MUST-BE failures = highest churn)
```

**HC-QVF-ECON-1 (Human Checkpoint — Asset Valuation Confirmation):**

Present asset valuations for human validation:
- Revenue figure used and source
- Revenue attribution % per workload (e.g., "Production API: 40% of revenue")
- Record count for PII assets (from Purview classification or estimate)
- Strategic multiplier for crown-jewel assets

Await confirmation or correction before parameterising scenarios.

**G2 checkpoint:** Asset valuations confirmed ✓ | HC-QVF-ECON-1 passed ✓

---

## Section 3: ARO Estimation via MITRE ATT&CK & Sector Benchmarks

**Quality Gate G3: ARO estimated per threat actor/technique combination**

ARO estimation methodology:

**Step 1 — Threat Actor Capability Classification:**
```
Nation-state actor:    High capability, targeted — ARO 0.1–0.5 (niche targeting)
Organised crime:       High capability, opportunistic — ARO 0.5–2.0 (sector-dependent)
Hacktivist:            Medium capability — ARO 0.1–0.3 (event-driven)
Script kiddie:         Low capability — ARO 2.0–5.0 (commodity attacks, high frequency)
Insider (malicious):   — ARO 0.05–0.2 (low frequency, high impact)
Insider (accidental):  — ARO 0.5–2.0 (more frequent, lower impact)
```

**Step 2 — MITRE ATT&CK Technique Frequency:**
Map technique IDs to frequency data:
- T1566 (Phishing): High frequency — ARO × 1.5 for organisations without email security controls
- T1078 (Valid Accounts): High — ARO × 1.3 if MFA not enforced (maps to MCSB IM domain gap)
- T1486 (Ransomware Encrypt): Medium — ARO from sector ransomware incident data
- T1190 (Exploit Public-Facing): High if MCSB PV domain < 70%

**Step 3 — Sector Benchmark Calibration:**
| Sector | Ransomware ARO | Data Breach ARO | Supply Chain ARO |
|---|---|---|---|
| Finance | 0.15 | 0.20 | 0.10 |
| Healthcare | 0.35 | 0.30 | 0.15 |
| Public Sector | 0.30 | 0.25 | 0.20 |
| Manufacturing | 0.25 | 0.10 | 0.25 |
| Retail | 0.20 | 0.35 | 0.15 |

**Step 4 — Control Effectiveness Adjustment:**
Reduce ARO where strong preventive controls detected:
- Email security (SPF/DKIM/DMARC + mail filter): Phishing ARO × 0.4
- MFA enforced (IM domain ≥85%): Account compromise ARO × 0.3
- EDR deployed (ES domain ≥80%): Ransomware ARO × 0.5
- Patch management (PV domain ≥75%): Exploit ARO × 0.5

Tag all ARO estimates as `qvf:Assumption[sensitivity=HIGH]` with source reference.

**G3 checkpoint:** ARO estimated for all threat actor/technique combinations ✓ | Sector benchmarks applied ✓ | Control adjustments applied ✓

---

## Section 4: Exposure Factor from CVSS & Vulnerability Analysis

**Quality Gate G4: Exposure Factor calculated per vulnerability/scenario**

CVSS → Exposure Factor translation:

```
CVSS Score    → Base EF
9.0–10.0 (Critical) → 0.90–1.00
7.0–8.9 (High)      → 0.60–0.80
4.0–6.9 (Medium)    → 0.30–0.55
0.1–3.9 (Low)       → 0.10–0.25

EF Modifiers:
  Network vector (remote): EF × 1.0 (no reduction)
  Adjacent/Local vector: EF × 0.6
  Active exploitation in wild (CISA KEV): EF × 1.2 (cap at 1.0)
  Compensating control present: EF × 0.5
```

For non-CVSS scenarios (business process risks, insider, AI):
- Use qualitative EF: High=0.7, Medium=0.4, Low=0.2 (with `qvf:Assumption[confidence=low]`)

**G4 checkpoint:** Exposure Factor calculated per vulnerability/scenario ✓ | CVSS sources referenced ✓

---

## Section 5: Parameterised FAIR Scenarios Output

**Quality Gate G5: All scenarios fully parameterised as FAIR risk scenario objects**

For each scenario, produce complete FAIR risk scenario object:

```json
{
  "scenarioId": "FAIR-001",
  "type": "cra:RiskScenario",
  "name": "Ransomware — Production Azure Workloads",
  "threatActor": { "type": "organised-crime", "capability": "high", "motivation": "financial" },
  "attackTechnique": "T1486 (Data Encrypted for Impact)",
  "assetAtRisk": "Production workloads — 40% revenue attribution",
  "assetValue": 2400000,
  "exposureFactor": 0.60,
  "sle": 1440000,
  "aro": { "base": 0.25, "optimistic": 0.12, "pessimistic": 0.50 },
  "assumptions": [
    { "type": "qvf:Assumption", "parameter": "ARO", "sensitivity": "HIGH", "source": "NCSC UK Sector Data 2024" },
    { "type": "qvf:Assumption", "parameter": "Asset Value", "sensitivity": "LOW", "source": "Revenue confirmed by HC-QVF-ECON-1" }
  ],
  "controlEffectivenessAdjustments": ["ES domain 82% → ARO × 0.5"],
  "regulatoryExposure": { "NIS2": "€10M cap", "GDPR": "N/A (no PII in ransomware scenario)" }
}
```

Produce one FAIR scenario object per active threat scenario. Include:
1. All scenarios listed with complete parameters
2. Assumption register (all `qvf:Assumption` entries with sensitivity)
3. Scenario dependency map (which MCSB controls, if improved, most reduce EF/ARO)
4. `qvf:CalculationProvenance` (methodology: FAIR, data sources, date)

**G5 checkpoint:** All FAIR scenarios fully parameterised ✓ | Assumption register complete ✓ | Ready for pfc-qvf-cyber-impact ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| Cyber-Risk-ONT | v1.0.0 | `cra:ThreatActor`, `cra:AttackTechnique`, `cra:Vulnerability`, `cra:RiskScenario` |
| RMF-IS27005-ONT | v1.0.0 | `rmf:RiskContext`, `rmf:Asset`, `rmf:Threat`, `rmf:Vulnerability` |
| QVF-ONT | v1.0.0 | `qvf:Assumption`, `qvf:CalculationProvenance` |
| MCSB-ONT | v2.0.0 | Domain scores for ARO and EF control adjustments |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-qvf-cyber-impact` (SKL-101) | Fully-parameterised FAIR scenarios for ALE calculation |
| `pfc-qvf-breach-model` (SKL-103) | Scenario types for cost component estimation |
