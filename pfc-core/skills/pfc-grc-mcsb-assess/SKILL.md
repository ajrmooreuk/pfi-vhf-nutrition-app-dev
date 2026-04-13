---
name: pfc-grc-mcsb-assess
description: AGENT_SUPERVISED full MCSB v2.0.0 compliance assessment — scores all 12 control domains via live azure-compliance MCP, maps to MCSB-ONT entities, produces RMF risk register and cross-framework references. Gateway skill for entire GRC-MCSB pipeline.
argument-hint: "[Azure tenant context] [--version v1|v2] [--scope mg:<id>|sub:<id>] [--include-ai]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write,Bash(az *),mcp__azure-skills__*"
---

# pfc-grc-mcsb-assess — MCSB Compliance Assessment

**Skill ID:** SKL-091
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.20a
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 7.6 — 12+ MCSB domains, live MCP, RMF risk rating, multi-framework correlation, AI domain optional
HG-02 (Autonomy):   6.5 — human checkpoint at findings review before downstream pipeline feeds
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You are the gateway assessment skill for the entire GRC-MCSB pipeline. You invoke `azure-compliance` to extract live MCSB compliance posture, map every finding to MCSB-ONT `SecurityControl` entities, score each of the 12 control domains 0–100%, generate RMF risk statements, and produce cross-framework references to NCSC CAF, GRC-FW-ONT governance controls, and WAF Security pillar.

If `--include-ai` or AI services are detected in scope, you include the MCSB v2 AI Security domain (AI-1 to AI-7).

You pause at one human checkpoint: findings review before scores flow into benchmark, posture, and remediation skills.

---

## Section 1: Scope Ingestion & Compliance Snapshot

**Quality Gate G1: Scope confirmed, MCSB initiative version detected, compliance snapshot taken**

1. Resolve scope from argument or context: management group ID or subscription ID(s)
2. Auto-detect MCSB version in tenant:
   - Check for MCSB v2 initiative assignment → use `--version v2`
   - Check for MCSB v1 initiative → use `--version v1`
   - Check for legacy ASB initiatives → flag for `pfc-grc-mcsb-migrate`
   - None found → flag as greenfield, default to v2
3. Invoke `azure-compliance` → pull full regulatory compliance state for detected MCSB initiative
4. Invoke `azure-resource-lookup` → resource inventory for scope (subscription/resource counts by type)
5. Detect AI workloads (Azure OpenAI, ML Workspace, AI Foundry, AI Hub) → set `--include-ai` flag
6. Record: scope, MCSB version, initiative assignment ID, compliance state timestamp

**G1 checkpoint:** Scope confirmed ✓ | MCSB version detected ✓ | Compliance snapshot taken ✓ | AI flag set ✓

---

## Section 2: Control Domain Assessment — All 12 MCSB Domains

**Quality Gate G2: All in-scope domains assessed with compliance evidence**

For each control domain, extract compliance state from `azure-compliance` initiative results and supplement with targeted MCP calls:

**NS — Network Security** (NS-1 to NS-10)
- `azure-validate` → network topology, NSG rules, firewall policy assignments
- Per-control compliance: % resources compliant, list of non-compliant resources

**IM — Identity Management** (IM-1 to IM-9)
- `azure-rbac` → Entra ID config, MFA CA policies, managed identity usage
- `entra-app-registration` → service principal inventory, legacy auth status

**PA — Privileged Access** (PA-1 to PA-8)
- `azure-rbac` → Owner/Contributor assignments, PIM status, access reviews
- Count: Owner assignments at subscription scope, standing privileged access

**DP — Data Protection** (DP-1 to DP-8)
- `azure-storage` → encryption config, access policies, CMK usage
- Key Vault inventory: secrets vs. app config (inline secrets = non-compliant)

**AM — Asset Management** (AM-1 to AM-5)
- `azure-resource-lookup` → tagging coverage, orphaned resources, allowed resource type compliance
- Policy audit: Allowed-Locations, Allowed-SKUs, Tag-Governance assignments

**LT — Logging & Threat Detection** (LT-1 to LT-7)
- `azure-diagnostics` → diagnostic settings coverage
- `azure-observability` → Log Analytics workspace topology, Defender plan tiers

**IR — Incident Response** (IR-1 to IR-6)
- `azure-compliance` → Defender for Cloud alert configuration
- Evidence check: IR plan documentation flag (manual input or doc library)

**PV — Posture & Vulnerability** (PV-1 to PV-6)
- `azure-compliance` → Defender vulnerability assessment coverage
- Container image scanning status (Defender for Containers)

**ES — Endpoint Security** (ES-1 to ES-3)
- `azure-compliance` → Defender for Endpoint deployment coverage %
- Anti-malware policy compliance across VM inventory

**BR — Backup & Recovery** (BR-1 to BR-4)
- `azure-storage` + `azure-validate` → Azure Backup coverage, soft-delete, immutable backup
- DR capability: ASR configuration for tier-1 VMs

**DS — DevOps Security** (DS-1 to DS-7)
- `azure-validate` → Defender for DevOps, branch protection, CODEOWNERS
- SAST/DAST tooling presence in pipeline configuration

**GS — Governance & Strategy** (GS-1 to GS-10)
- `azure-compliance` → overall governance posture
- CSPM coverage: Defender for Cloud plans active across all subscriptions in scope

**AI — AI Security** (AI-1 to AI-7, v2 only, if `--include-ai`)
- `azure-ai` → Azure OpenAI network isolation, private endpoint, data residency
- `azure-aigateway` → content filtering, rate limiting, responsible AI policies
- AI-1: Network isolation for AI services
- AI-2: Authentication to AI services (managed identity vs. keys)
- AI-3: Data protection for AI training/inference data
- AI-4: Monitoring of AI model behaviour
- AI-5: Responsible AI policy enforcement
- AI-6: AI supply chain security (model provenance)
- AI-7: AI incident response capability

**G2 checkpoint:** All in-scope domains assessed ✓ | Per-control compliance evidence collected ✓ | Non-compliant resources listed per domain ✓

---

## Section 3: Scoring & Traffic Light Classification

**Quality Gate G3: Domain scores calculated, overall posture score produced**

Score each domain 0–100%:
```
Domain Score = (compliant controls / total applicable controls) × 100
Deductions: Critical finding −20, High −10, Medium −5, Low −2
```

Domain weight for overall score (default; VE-configurable):

| Domain | Default Weight |
|---|---|
| GS (Governance & Strategy) | 12% |
| IM (Identity Management) | 12% |
| PA (Privileged Access) | 12% |
| NS (Network Security) | 10% |
| DP (Data Protection) | 10% |
| LT (Logging & Threat Detection) | 10% |
| PV (Posture & Vulnerability) | 8% |
| IR (Incident Response) | 8% |
| AM (Asset Management) | 6% |
| DS (DevOps Security) | 6% |
| ES (Endpoint Security) | 4% |
| BR (Backup & Recovery) | 2% |

Traffic light per domain: Green ≥80% | Amber 60–79% | Red <60%

**G3 checkpoint:** Per-domain scores ✓ | Overall weighted posture score ✓ | Traffic light status per domain ✓

---

## Section 4: Cross-Framework Correlation & RMF Risk Rating

**Quality Gate G4: All non-compliant controls have cross-framework map and RMF risk statement**

For every non-compliant control:

1. **NCSC-CAF-ONT mapping**: map to contributing outcome (B1–B6, C1–C4, D1–D2)
2. **GRC-FW-ONT mapping**: map to governance control category
3. **WAF Security pillar**: flag findings that affect WAF Security pillar score
4. **OWASP flag**: tag if finding maps to OWASP Top 10 / LLM Top 10 / Agentic category (triggers `pfc-owasp-pipeline` recommendation)
5. **RMF-IS27005-ONT risk statement**:
   - Impact: C/I/A classification
   - Likelihood: exposure × exploitability
   - Risk rating: Critical / High / Medium / Low
   - Treatment recommendation: control/accept/transfer/avoid

**HC-GRC-ASSESS-1 (Human Checkpoint):** Present domain scorecard and non-compliant control list. Human architect validates scores and severity classifications before downstream consumption.

**G4 checkpoint:** All non-compliant controls have cross-framework references ✓ | RMF risk statements ✓ | HC-GRC-ASSESS-1 confirmed ✓

---

## Section 5: Output Package

**Quality Gate G5: Full assessment output package produced**

Produce:

1. **MCSB Compliance Scorecard** — domain scores, traffic lights, overall posture, MCSB version
2. **Non-Compliant Controls Register** — control ID, domain, resource list, severity, RMF risk, cross-framework refs
3. **Cross-Framework Matrix** — per-domain: NCSC CAF outcome, GRC-FW control, WAF pillar, OWASP flag
4. **RMF Risk Register Fragment** — ERM-ONT format, ready for `pfc-grc-posture` aggregation
5. **Assessment Metadata** — scope, timestamp, MCSB version, resource counts, AI flag

**G5 checkpoint:** All 5 output artefacts produced ✓ | Output ready for pfc-grc-mcsb-benchmark, pfc-grc-posture, pfc-grc-remediate ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| MCSB-ONT | v2.0.0 | 12 control domains, individual control entities, scoring model |
| NCSC-CAF-ONT | v1.0.0 | Contributing outcome mapping |
| GRC-FW-ONT | v3.0.0 | Governance control categories |
| ERM-ONT | v1.0.0 | RMF risk register format, 23 risk categories |
| RMF-IS27005-ONT | v1.0.0 | Risk rating methodology |
| EA-MSFT-ONT | v1.1.0 | WAF Security pillar cross-reference |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-GRC-MCSB-NCSC-001 | `mcsb:SecurityControl` → `ncsc:ContributingOutcome` | mapsToCyberOutcome |
| JP-GRC-MCSB-GRC-001 | `mcsb:SecurityControl` → `grc-fw:GovernanceControl` | implementsControl |
| JP-GRC-MCSB-ERM-001 | `mcsb:ControlFinding` → `erm:Risk` | mapsToRisk |
| JP-GRC-MCSB-WAF-001 | `mcsb:ControlDomain:IM` → `ea-msft:WAFPillar:Security` | contributesToPillar |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-grc-mcsb-benchmark` (SKL-093) | Domain scores + gap analysis input |
| `pfc-grc-posture` (SKL-098) | Domain scores feed unified posture score |
| `pfc-grc-remediate` (SKL-099) | Non-compliant control list feeds remediation backlog |
| `pfc-grc-baseline` (SKL-092) | Domain scores feed SPC baseline calculation |
| `pfc-alz-assess-cyber` (SKL-088) | Deep MCSB assessment feeds cyber posture |
| `pfc-alz-pipeline` (SKL-112) | Stage 4 GRC output |
