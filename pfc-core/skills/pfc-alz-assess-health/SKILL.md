---
name: pfc-alz-assess-health
description: Autonomous ALZ healthcheck — validates deployed Azure Landing Zone against AZALZ-ONT policy definitions, detects drift across 7 domains, produces scored evidence pack. Evolves INS ALZ Snapshot Audit from manual KQL to agentic MCP.
argument-hint: "[Azure tenant ID or 'use context'] [--baseline <date>] [--domains all|mg|hub|spoke|policy|rbac|diag|identity]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write,Bash(az *),mcp__azure-skills__*"
---

# pfc-alz-assess-health — ALZ Healthcheck

**Skill ID:** SKL-086
**Version:** v1.0.0
**Type:** AGENT_AUTONOMOUS
**Feature:** [F74.5](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 6.8 — 7 assessment domains, live MCP data, drift detection, evidence compilation
HG-02 (Autonomy):   7.5 — runs without human intervention; escalates only on Critical drift or first-run
Classification:     AGENT_AUTONOMOUS
```

---

## What You Do

You autonomously healthcheck a deployed Azure Landing Zone. You invoke azure-skills MCP tools to pull live configuration across all 7 AZALZ-ONT domains, compare against policy definitions and IaC desired state, detect drift, score each domain 0–100%, and produce a structured evidence pack. You require no human in the loop for standard runs — only for first-run baseline establishment or Critical drift findings.

This skill operationalises the INS ALZ Snapshot Audit: what previously required manual KQL queries (`14-Tenant-Discovery-v1.py`, `11-Query-Executor-v1.py`, `05-KQL-Queries-v1.json`) is now fully agentic via MCP.

---

## Section 1: Environment Ingestion & Domain Scoping

**Quality Gate G1: Tenant context established, domains confirmed**

1. Resolve Azure tenant from argument or conversation context
2. Determine assessment scope: `--domains all` (default) or specific subset
3. Invoke `azure-resource-lookup` → enumerate Management Group hierarchy, subscription inventory, resource counts by type
4. Invoke `azure-resource-visualizer` → topology snapshot (hub/spoke diagram, MG tree)
5. Confirm prior baseline exists (lookup `health-baseline-<tenantId>-<date>` artefact) — if none, flag as first-run
6. Produce domain scope manifest: list of 7 domains to assess, resource counts per domain

**G1 checkpoint:** Tenant resolved ✓ | Domain manifest produced ✓ | First-run flag set ✓

---

## Section 2: Domain Assessment — AZALZ-ONT 7 Domains

**Quality Gate G2: All in-scope domains assessed, raw findings collected**

Execute domain assessments (parallelise where possible):

### Domain 1: Management Group Hierarchy (`azalz:ManagementGroupHierarchy`)
- Invoke `azure-resource-lookup` → MG structure
- Validate against AZALZ-ONT policy: root MG present, Corp/Online/Sandbox/Decommissioned hierarchy correct, no orphaned subscriptions
- Check: subscription placement matches workload classification

### Domain 2: Hub Network (`azalz:HubNetwork`)
- Invoke `azure-validate` → hub VNet config
- Validate: Azure Firewall deployed + policy attached, DNS resolver configured, VPN/ExpressRoute gateway present if required, Bastion host configuration, DDoS Protection Plan
- Check routing: UDR 0.0.0.0/0 → Azure Firewall across all connected spokes

### Domain 3: Spoke Networks (`azalz:SpokeNetwork`)
- Invoke `azure-validate` → all spoke VNets
- Validate: VNet peering to hub, NSG on all subnets, route table present, no direct internet egress bypassing hub firewall
- Per spoke: private endpoint usage, service endpoint policies

### Domain 4: Policy Assignments (`azalz:PolicyAssignment`)
- Invoke `azure-compliance` → policy compliance state
- Validate: ALZ baseline initiatives assigned at MG level (Deploy-MDFC-Config, Enforce-GR-KeyVault, Deny-RDP-From-Internet, Deny-Subnet-Without-Nsg, Deny-PublicIP, etc.)
- Compliance percentage per assignment; list non-compliant resources

### Domain 5: RBAC & Identity (`azalz:RBACBinding`, `azalz:IdentityBaseline`)
- Invoke `azure-rbac` → role assignments across MG hierarchy
- Invoke `entra-app-registration` → service principal inventory
- Validate: Owner assignments at subscription scope (should be <5), no standing Guest Owner, PIM enabled for privileged roles, no legacy auth app registrations, Entra ID P2 licences for PIM

### Domain 6: Diagnostic Settings (`azalz:DiagnosticSetting`)
- Invoke `azure-diagnostics` → diagnostic settings inventory
- Validate: All resources with diagnostic capability have settings routing to central Log Analytics workspace, activity log retention ≥90 days, diagnostic categories include Security/Audit/Administrative
- Coverage percentage: (resources with diagnostics / total diagnosable resources)

### Domain 7: Identity Baseline (`azalz:IdentityBaseline`)
- Invoke `azure-compliance` → Defender for Identity posture
- Validate: MFA enforced (Conditional Access or Entra ID security defaults), break-glass accounts documented and monitored, emergency access excluded from CA policies

**G2 checkpoint:** All 7 domains assessed ✓ | Raw findings collected per domain ✓

---

## Section 3: Drift Detection

**Quality Gate G3: Drift categorised and delta from baseline quantified**

Compare live state against three references:

1. **Design intent drift** — compare against AZALZ-ONT policy definitions
2. **IaC desired state drift** — compare against Epic 33 Bicep module intent (where baseline established)
3. **Historical drift** — compare against previous healthcheck baseline (if exists)

Drift classification:

| Drift Category | Definition | Severity Logic |
|---|---|---|
| Configuration drift | Resource config changed from desired state | Critical if security control; High if reliability/cost; Medium otherwise |
| Policy drift | Policy assignments removed, disabled, or compliance dropped >10% | Critical if security policy; High otherwise |
| RBAC drift | New Owner/Contributor assignments at subscription scope; role removed from required group | Critical if Owner added; High if Contributor; Medium otherwise |
| Topology drift | Spoke added/removed without IaC; hub component missing | High if security component; Medium otherwise |

For each drift finding:
- Record: domain, resource ID, expected state, actual state, severity, delta from previous (if baseline exists)
- Map to `azalz:DriftFinding` entity

**G3 checkpoint:** All drift findings categorised ✓ | Severity assigned ✓ | Delta from baseline recorded ✓

---

## Section 4: Domain Scoring & Posture Calculation

**Quality Gate G4: Per-domain scores and overall posture score produced**

Score each domain 0–100% using weighted model:

| Domain | Max Score | Weighting |
|---|---|---|
| Management Group Hierarchy | 100 | 10% |
| Hub Network | 100 | 20% |
| Spoke Networks | 100 | 15% |
| Policy Assignments | 100 | 20% |
| RBAC & Identity | 100 | 20% |
| Diagnostic Settings | 100 | 10% |
| Identity Baseline | 100 | 5% |

Scoring deductions:
- Critical finding: −20 points from domain score
- High finding: −10 points
- Medium finding: −5 points
- Low finding: −2 points

Overall ALZ posture = weighted average across all 7 domains.

Posture bands:
- **Green (85–100%)**: ALZ healthy, minor improvements only
- **Amber (60–84%)**: Attention required, moderate remediation
- **Red (0–59%)**: Critical gaps, urgent remediation required

**G4 checkpoint:** Per-domain scores produced ✓ | Overall posture score calculated ✓ | Posture band assigned ✓

---

## Section 5: Evidence Pack & Output Artefacts

**Quality Gate G5: Complete evidence pack produced, escalation triggered if required**

Produce the following output artefacts:

1. **ALZ Healthcheck Scorecard** — domain scores, posture band, trend vs. previous (if baseline)
2. **Drift Findings Register** — all findings: domain, resource, severity, expected vs. actual, recommended remediation
3. **Resource Topology Summary** — MG hierarchy, hub/spoke map, subscription inventory
4. **Policy Compliance Report** — per-assignment compliance percentages, non-compliant resources
5. **Evidence References** — KQL query results, azure-validate outputs, azure-compliance exports

Escalation triggers (auto-generated HC-ALZ-HEALTH-1 human checkpoint):
- Any Critical finding (RBAC Owner added, security policy removed, hub firewall missing)
- First-run baseline establishment (requires human review before baseline is committed)
- Overall posture drops >15 points from previous baseline

Save baseline: `health-baseline-<tenantId>-<YYYY-MM-DD>.json`

**G5 checkpoint:** All 5 artefacts produced ✓ | Escalation triggered if Critical ✓ | Baseline saved ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| AZALZ-ONT | v1.0.0 | 7 domain entities, policy definitions, drift classification |
| EA-MSFT-ONT | v1.1.0 | Azure resource types, WAF alignment |
| MCSB-ONT | v2.0.0 | Security control families for RBAC/policy findings |
| GRC-FW-ONT | v3.0.0 | Governance framework for policy compliance findings |
| RMF-IS27005-ONT | v1.0.0 | Risk rating for drift findings |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-ALZ-HEALTH-ERM-001 | `azalz:DriftFinding` → `erm:Risk` | mapsToRisk |
| JP-ALZ-HEALTH-MCSB-001 | `azalz:PolicyAssignment` → `mcsb:SecurityControl` | implementsControl |
| JP-ALZ-HEALTH-WAF-001 | `azalz:HubNetwork` → `ea-msft:WAFPillar:Reliability` | assessesPillar |

---

## INS ALZ Snapshot Audit Evolution

| INS Artefact | Replaced By | Improvement |
|---|---|---|
| `14-Tenant-Discovery-v1.py` | `azure-resource-lookup` MCP | Live MCP vs. manual script |
| `11-Query-Executor-v1.py` | `azure-kusto` MCP | Structured MCP vs. Python |
| `05-KQL-Queries-v1.json` | `azure-validate` + `azure-compliance` | Live validation vs. static queries |
| `06-Compliance-Mapping-v1.json` | AZALZ-ONT + EMC Composer | Ontology graph vs. static JSON |
| `04-Azure-Workbook-v1.workbook` | Section 4 scoring model | Automated scoring vs. manual workbook |
| `15-Full-Auto-v1.sh` | pfc-alz-pipeline (SKL-112) | MCP orchestration vs. shell script |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-alz-assess-waf` (SKL-087) | Domain scores feed WAF Reliability/Security pillar scoring |
| `pfc-alz-assess-cyber` (SKL-089) | Policy and RBAC findings feed cyber posture assessment |
| `pfc-alz-strategy` (SKL-090) | Healthcheck scorecard feeds gap analysis and roadmap |
| `pfc-hcr-analyse` (SKL-108) | Evidence pack feeds HCR report generation |
| `pfc-alz-pipeline` (SKL-112) | Stage 3 output — feeds directly into pipeline orchestration |
