---
name: pfc-hcr-analyse
description: AGENT_AUTONOMOUS cross-domain finding analysis and correlation — normalises findings from WAF, CAF, MCSB, OWASP, and AZALZ assessments into a unified hcr:Finding set, identifies systemic patterns (governance/identity/monitoring root causes), traces amplification chains, and clusters findings by root cause for efficient phasing.
argument-hint: "[assessment outputs or 'use findings'] [--depth full|executive] [--focus governance|identity|monitoring|all]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-hcr-analyse — Cross-Domain Finding Analysis & Correlation

**Skill ID:** SKL-108
**Version:** v1.0.0
**Type:** AGENT_AUTONOMOUS
**Feature:** F74.25b
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 6.8 — multi-framework normalisation, cross-reference logic, amplification chains, root-cause clustering, regulatory intersection mapping
HG-02 (Autonomy):   7.5 — fully autonomous; correlation is deterministic given findings input
Classification:     AGENT_AUTONOMOUS
```

---

## What You Do

You are the correlation engine for the HCR pipeline. You ingest finding sets from all upstream assessment skills (WAF, CAF, Cyber/MCSB, AZALZ Health), normalise them into a common `hcr:Finding` schema, cross-reference findings that span multiple frameworks, identify systemic root causes (governance gaps, identity weaknesses, monitoring blind spots), trace amplification chains where single weaknesses cascade into compound risk, and cluster findings by root cause for efficient phasing in `pfc-hcr-roadmap`. You are fully autonomous — no human checkpoint; all correlation logic is deterministic given the findings.

---

## Section 1: Finding Ingestion & Normalisation

**Quality Gate G1: All upstream findings loaded and normalised to hcr:Finding format**

Load all available assessment outputs:

| Source Skill | Finding Type | Entity |
|---|---|---|
| `pfc-alz-assess-waf` (SKL-086) | WAF pillar findings | `waf:PillarFinding` per pillar |
| `pfc-alz-assess-caf` (SKL-087) | CAF readiness gaps | `caf:ReadinessGap` per domain |
| `pfc-alz-assess-cyber` (SKL-088) | MCSB domain findings | `mcsb:ControlFinding` per control family |
| `pfc-alz-assess-cyber` (SKL-088) | OWASP findings | `owasp:Finding` per risk item |
| `pfc-alz-assess-health` (SKL-089) | ALZ drift/config findings | `azalz:DriftFinding` per domain |
| `pfc-grc-mcsb-assess` (SKL-091) | MCSB compliance findings | `mcsb:ComplianceFinding` per control |

Normalise each finding to common `hcr:Finding` schema:

```json
{
  "findingId": "F-[SKL]-[N]",
  "type": "hcr:Finding",
  "sourceSkill": "pfc-alz-assess-cyber",
  "sourceFramework": "MCSB v2.0.0",
  "domain": "Identity Management",
  "controlRef": "IM-1",
  "title": "MFA not enforced for privileged accounts",
  "severity": "Critical",
  "currentState": "MFA disabled for 8 of 12 Global Admin accounts",
  "desiredState": "MFA enforced for all privileged accounts (MCSB IM-1 ≥85%)",
  "rmfRiskScore": { "impact": 5, "likelihood": 4, "composite": "Critical" },
  "veWeight": "HIGH",
  "kanoClass": "MUST-BE",
  "phaseAssigned": null,
  "crossReferences": [],
  "amplificationChains": []
}
```

Deduplication: if the same underlying issue is raised by multiple frameworks (e.g., missing MFA → WAF Security + MCSB IM + CAF readiness), merge into a single `hcr:Finding` with multiple `sourceFramework` entries and `crossReferences` populated.

**G1 checkpoint:** All upstream findings loaded ✓ | Normalised to hcr:Finding format ✓ | Duplicates merged ✓

---

## Section 2: Cross-Framework Correlation

**Quality Gate G2: All cross-framework finding overlaps identified and linked**

Apply four correlation pattern types:

**Pattern 1 — Same Control, Multiple Frameworks:**
```
Identify findings where the same Azure control maps to findings in ≥2 frameworks.

High-frequency multi-framework controls:
  MFA/Conditional Access → MCSB IM, WAF Security, CAF readiness
  NSG misconfiguration   → MCSB NS, WAF Reliability, AZALZ Health
  Logging gaps           → MCSB LT, WAF Operational Excellence, AZALZ Health
  Backup gaps            → MCSB BR, WAF Reliability, CAF readiness
  Patch management       → MCSB PV, WAF Security, AZALZ Health

For each: tag all correlated findings with identical crossReference IDs.
Annotate: "Single remediation action closes [N] findings across [N] frameworks."
```

**Pattern 2 — Root Cause Chain:**
```
Identify upstream root causes that generate multiple downstream findings.

Root cause chains to detect:
  No Azure Policy framework → naming gaps + tagging gaps + cost allocation gaps + compliance visibility gaps
  No centralised identity (no AAD) → RBAC over-permission + MFA gaps + audit trail gaps
  No monitoring baseline → logging gaps + alerting gaps + DR gaps + forensic gaps
  No patch management process → PV domain fail + exploit exposure + compliance drift

For each chain: identify the single root-cause finding and tag all downstream findings as dependents.
```

**Pattern 3 — Amplification Chain:**
```
Identify combinations where co-occurring findings multiply risk beyond their individual scores.

Amplification combinations to detect:
  Missing EDR + Missing LT (logging) → undetectable malware persistence
  Missing backup (BR) + Missing IR plan → ransomware with no recovery path
  PII data + Missing DP controls + Missing breach notification process → GDPR Art 83 Tier 2 exposure
  Admin accounts + No MFA + No LT logging → privileged access compromise undetectable

For each amplification: calculate compound RMF risk score (individual scores × amplification multiplier 1.3–1.8).
```

**Pattern 4 — Regulatory Intersection:**
```
Identify findings with regulatory fine exposure (from pfc-qvf-breach-model context):
  PII data exposure → GDPR Art 83 + MCSB DP domain + NCSC CAF gap
  Critical service disruption → NIS2 + WAF Reliability + AZALZ health
  Financial service incident → DORA + WAF all pillars

For each regulatory intersection: tag with regulatory framework and estimated exposure band.
```

**G2 checkpoint:** All 4 correlation patterns applied ✓ | Cross-references linked ✓ | Amplification chains scored ✓

---

## Section 3: Systemic Pattern Classification

**Quality Gate G3: Findings clustered by systemic pattern and root cause type**

Classify all findings into three systemic pattern clusters:

**Cluster A — Governance Root Causes:**
```
Pattern: Azure Policy, naming standards, tagging, cost allocation, compliance visibility
Characteristics: Many downstream findings stem from absent governance controls
Examples:
  - No Azure Policy initiative → cascades to naming/tagging/compliance drift
  - No RBAC governance model → cascades to over-permission, audit gaps, MCSB IM fail
  - No GRC programme → cascades to compliance drift, MCSB posture decline

Output: Governance gap summary — root cause findings + downstream dependents count
```

**Cluster B — Identity & Access Root Causes:**
```
Pattern: Conditional Access, MFA, RBAC, privileged identity management
Characteristics: Identity weaknesses are the highest-amplification root causes
Examples:
  - No MFA → cascades to account compromise, MCSB IM/PA, WAF Security
  - Over-privileged service principals → cascades to lateral movement, MCSB IM
  - No PIM → cascades to standing access exposure, MCSB PA

Output: Identity gap summary — privileged access exposure + cascade finding count
```

**Cluster C — Monitoring Blind Spots:**
```
Pattern: Log analytics, alerting, diagnostic settings, IR plan
Characteristics: Monitoring gaps compound every other finding (undetectable)
Examples:
  - No Log Analytics workspace → cascades to undetectable threats, MCSB LT fail
  - No diagnostic settings → cascades to audit trail absence, AZALZ Health fail
  - No IR plan → cascades to undetectable + unrecoverable compound risk

Output: Monitoring blind spot summary — undetectable finding count + unrecoverable risk chains
```

Cross-cluster dependencies: identify findings that are root causes for multiple clusters (e.g., no Azure Policy is both Governance and Monitoring).

**G3 checkpoint:** All findings classified into systemic clusters ✓ | Root cause → dependent finding trees built ✓

---

## Section 4: Correlation Matrix & Amplification Scoring

**Quality Gate G4: Correlation matrix produced, compound risk scores calculated**

Produce cross-framework correlation matrix:

```
Framework × Framework Correlation Matrix:
           WAF   CAF   MCSB  OWASP  AZALZ
WAF        —     [N]   [N]   [N]    [N]    ← N = count of shared findings
CAF        [N]   —     [N]   [N]    [N]
MCSB       [N]   [N]   —     [N]    [N]
OWASP      [N]   [N]   [N]   —      [N]
AZALZ      [N]   [N]   [N]   [N]    —

Key multi-framework findings (top 5 by cross-reference count):
1. [Finding] — affects [N] frameworks — fix priority: CRITICAL
2. ...
```

Amplification scoring for compound risk chains:

```
Individual finding RMF scores:
  F-088-01 (No MFA):       Impact 5 × Likelihood 4 = 20 (Critical)
  F-089-02 (No LT logging): Impact 4 × Likelihood 5 = 20 (Critical)

Amplification chain A+B:
  Compound score = max(A, B) × amplification_factor
  amplification_factor: 2 findings = 1.3, 3 findings = 1.5, 4+ findings = 1.8
  Compound score: 20 × 1.3 = 26 (beyond individual Critical → label: CRITICAL-COMPOUND)

All CRITICAL-COMPOUND chains → automatically surfaced to Section 5 priority output.
```

**G4 checkpoint:** Correlation matrix produced ✓ | CRITICAL-COMPOUND chains identified ✓ | Amplification scores applied ✓

---

## Section 5: Correlated Finding Output & Root Cause Report

**Quality Gate G5: Full correlated finding set output, ready for pfc-hcr-compose and pfc-hcr-roadmap**

Output artefacts:

1. **Correlated Finding Set**: all `hcr:Finding` entities enriched with cross-references, amplification chains, root-cause links, and cluster assignments
2. **Systemic Pattern Report**: one-page narrative per cluster (Governance, Identity, Monitoring) — root causes, dependent findings, fix-one-improve-many opportunities
3. **Amplification Chain Report**: all CRITICAL-COMPOUND chains with compound risk score, findings involved, and single-action resolution recommendations
4. **Correlation Matrix**: framework × framework finding overlap counts + top 5 multi-framework findings
5. **Root Cause Prioritisation List**: ranked by (downstream finding count × compound risk score) — top root causes to address for maximum risk reduction
6. **Phase Clustering Pre-work**: findings grouped by root-cause cluster ready for `pfc-hcr-roadmap` phase assignment

Handoff to downstream consumers:
- `pfc-hcr-compose` receives enriched `hcr:Finding` set for all report sections
- `pfc-hcr-roadmap` receives root-cause clusters and phase clustering pre-work
- `pfc-hcr-dashboard` receives correlation matrix and amplification chain data for visual views
- `pfc-hcr-verify` receives finding cross-references for consistency checking

**G5 checkpoint:** Correlated finding set complete ✓ | All 6 output artefacts produced ✓ | Downstream consumer handoffs ready ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| HCR-ONT | v1.0.0 | `hcr:Finding`, `hcr:ReportSection`, `hcr:CrossReference`, `hcr:AmplificationChain` |
| MCSB-ONT | v2.0.0 | `mcsb:ControlFamily`, `mcsb:ControlFinding` |
| EA-MSFT-ONT | v1.1.0 | WAF pillar findings |
| AZALZ-ONT | v1.0.0 | `azalz:DriftFinding` |
| NCSC-CAF-ONT | v1.0.0 | CAF readiness gap entities |
| RMF-IS27005-ONT | v1.0.0 | `rmf:RiskScore`, `rmf:RiskContext` for amplification scoring |
| GRC-FW-ONT | v3.0.0 | Regulatory intersection mapping (GDPR, NIS2, DORA) |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-ANALYSE-FIND-001 | `hcr:Finding[source=waf]` → `hcr:Finding[source=mcsb]` | crossReferences |
| JP-ANALYSE-AMP-001 | `hcr:Finding` → `hcr:AmplificationChain` | amplifiesRisk |
| JP-ANALYSE-ROOT-001 | `hcr:Finding[type=rootCause]` → `hcr:Finding[type=dependent]` | causesDownstream |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-hcr-compose` (SKL-107) | Enriched `hcr:Finding` set for all report sections |
| `pfc-hcr-roadmap` (SKL-111) | Root-cause clusters + phase clustering pre-work |
| `pfc-hcr-dashboard` (SKL-110) | Correlation matrix + amplification chain data |
| `pfc-hcr-verify` (SKL-109) | Finding cross-references for consistency validation |
