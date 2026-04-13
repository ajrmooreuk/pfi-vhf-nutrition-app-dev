---
name: pfc-alz-assess-waf
description: AGENT_SUPERVISED WAF pillar assessment — assesses Azure environment against all 5 Well-Architected Framework pillars using live MCP data, scored via EA-MSFT-ONT, with DMAIC backcasting roadmap and VE value quantification.
argument-hint: "[Azure tenant context] [--pillars all|reliability|security|cost|opex|perf] [--desired-scores reliability:80,security:85,cost:70,opex:75,perf:75]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write,Bash(az *),mcp__azure-skills__*"
---

# pfc-alz-assess-waf — WAF Pillar Assessment

**Skill ID:** SKL-087
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** [F74.2](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 7.2 — 5 pillars, live MCP, cross-framework correlation, DMAIC backcasting, VE quantification
HG-02 (Autonomy):   6.5 — human checkpoints at pillar prioritisation and Critical findings review
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You assess an Azure environment against all 5 Microsoft Well-Architected Framework pillars (Reliability, Security, Cost Optimization, Operational Excellence, Performance Efficiency). You invoke azure-skills MCP tools to collect live evidence per pillar, score each 0–100% using EA-MSFT-ONT:WAFPillar entities, correlate findings to MCSB controls and NCSC CAF outcomes, then produce a DMAIC-backcasted 4-phase roadmap with VE value quantification.

You pause at two human checkpoints: pillar prioritisation (before deep assessment) and Critical/High findings review (before roadmap generation).

---

## Section 1: VE Context Ingestion & Pillar Prioritisation

**Quality Gate G1: VE profile loaded, pillar priorities confirmed by human**

1. Load VE profile from conversation context: customer VSOM priorities, OKR targets, Kano feature classification, risk appetite, regulatory obligations
2. Apply Kano classification to WAF pillars:
   - **MUST-BE**: Security (always), Reliability (if SLA-sensitive workloads)
   - **PERFORMANCE**: Cost Optimization, Operational Excellence (typically)
   - **DELIGHTER**: Performance Efficiency at scale (depends on workload type)
3. Map customer OKR targets to desired pillar scores (use defaults if not specified: Reliability 80, Security 85, Cost 70, OpEx 75, Performance 75)
4. Determine scope: `--pillars all` or specific subset based on customer priority
5. Invoke `azure-resource-lookup` → enumerate workload types (web apps, VMs, databases, AI services, containers) to determine pillar relevance

**HC-WAF-1 (Human Checkpoint):** Present pillar priorities and desired scores to human. Confirm before proceeding to deep assessment.
- "Security pillar set as MUST-BE with desired score 85%. Confirming this aligns with [customer] regulatory obligations?"
- Await confirmation before Section 2.

**G1 checkpoint:** VE profile loaded ✓ | Pillar priorities Kano-classified ✓ | HC-WAF-1 confirmed ✓

---

## Section 2: Live Pillar Evidence Collection

**Quality Gate G2: All in-scope pillars have live MCP evidence**

Execute pillar evidence collection (parallelise where possible):

### Pillar 1: Reliability (`EA-MSFT-ONT:WAFPillar:Reliability`)
- Invoke `azure-validate` → availability zones, redundancy config per service tier
- Invoke `azure-storage` → geo-redundant storage, backup policies, soft-delete status
- Check: SLA-defining resources (databases, app services, storage) have zone-redundant SKUs
- Check: Disaster recovery runbooks documented (DR capability flag)
- Check: Auto-scaling configured on compute workloads
- Score inputs: Zone redundancy %, backup coverage %, DR capability

### Pillar 2: Security (`EA-MSFT-ONT:WAFPillar:Security`)
- Invoke `azure-compliance` → Defender for Cloud secure score, regulatory compliance posture
- Invoke `azure-rbac` → privileged access patterns, PIM status
- Check: Defender for Cloud Standard tier on all subscriptions
- Check: Key Vault for all secrets/certs (no secrets in app config)
- Check: Private endpoints for PaaS services vs. public endpoints
- Check: WAF deployed in front of all internet-facing web workloads
- Score inputs: Defender secure score, policy compliance %, private endpoint coverage %

### Pillar 3: Cost Optimization (`EA-MSFT-ONT:WAFPillar:CostOptimization`)
- Invoke `azure-cost-optimization` → cost analysis, right-sizing recommendations, idle resources
- Check: Reserved instances/savings plans utilisation
- Check: Dev/test environments using B-series or spot instances
- Check: Storage tier alignment (hot/cool/archive by access frequency)
- Check: Orphaned resources (unattached disks, unused public IPs, empty resource groups)
- Score inputs: Right-sizing coverage %, reservation utilisation %, orphaned resource count

### Pillar 4: Operational Excellence (`EA-MSFT-ONT:WAFPillar:OperationalExcellence`)
- Invoke `azure-observability` → monitoring coverage, alert rules, Log Analytics workspace topology
- Check: All production workloads have Application Insights or equivalent
- Check: Azure Monitor baseline alerts deployed (CPU, memory, disk, availability)
- Check: IaC coverage (what % of resources are IaC-managed — Bicep/Terraform)
- Check: CI/CD pipelines operational (from Epic 33 E33.x IaC coverage)
- Score inputs: Monitoring coverage %, alert coverage %, IaC coverage %, MTTR capability

### Pillar 5: Performance Efficiency (`EA-MSFT-ONT:WAFPillar:PerformanceEfficiency`)
- Invoke `azure-compute` → compute SKU selection, scaling configuration
- Check: App Service Plan tiers match workload SLA requirements
- Check: CDN/Front Door deployed for globally distributed workloads
- Check: Database tier right-sized for query patterns (no under/over-provisioning flags)
- Check: Caching layers present (Redis Cache, CDN) where applicable
- Score inputs: Compute right-sizing %, scaling config coverage %, performance test evidence

**G2 checkpoint:** All in-scope pillars have MCP evidence ✓ | Raw findings per pillar collected ✓

---

## Section 3: Cross-Framework Correlation

**Quality Gate G3: All findings mapped to cross-framework references**

For each finding, apply cross-framework mapping:

| Finding Source | Cross-Framework Maps |
|---|---|
| Security pillar finding | → `mcsb:SecurityControl` (MCSB-ONT v2.0.0) → `ncsc:ContributingOutcome` (NCSC-CAF-ONT) → `grc-fw:GovernanceControl` |
| Reliability finding | → `rmf:Risk` category (availability) → `erm:RiskCategory` (operational risk) |
| Cost finding | → `vp:Problem` (cost overrun) → `erm:RiskCategory` (financial risk) |
| OpEx finding | → `rmf:Risk` (operational capability gap) → `erm:RiskCategory` (operational risk) |
| Performance finding | → `vp:Problem` (performance degradation risk) → `erm:RiskCategory` (operational risk) |

Apply RMF-IS27005-ONT risk rating per finding:
- Impact: confidentiality / integrity / availability classification
- Likelihood: exposure level + threat landscape
- Risk rating: Critical / High / Medium / Low

Apply VP-ONT tagging:
- `vp:Problem` — current state pain point
- `vp:Solution` — recommended control/fix
- `vp:Benefit` — value of closing the gap (feeds VE quantification)

**G3 checkpoint:** All findings have cross-framework references ✓ | RMF risk rating assigned ✓ | VP tags applied ✓

---

## Section 4: Pillar Scoring & DMAIC Gap Analysis

**Quality Gate G4: Per-pillar scores and gap analysis produced; human checkpoint HC-WAF-2 passed**

Score each pillar 0–100%:

```
Pillar Score = (compliance checks passed / total applicable checks) × 100
             − deductions: Critical −20, High −10, Medium −5, Low −2
```

Three-state gap analysis per pillar:

```
Pillar: Security
  Best Practice:  95%   ████████████████████
  Desired State:  85%   █████████████████░░░   ← from HC-WAF-1 confirmed target
  Current State:  52%   ██████████░░░░░░░░░░   ← from Section 2 MCP evidence
  Gap to Desired: 33 points
```

DMAIC structure:
- **Define**: Customer CTQs per pillar (from VE profile)
- **Measure**: Current state per pillar (Section 2 scores)
- **Analyse**: Gap to desired, root cause per finding
- **Improve**: Remediation recommendations (Section 5)
- **Control**: SPC baselines, recurring compliance monitoring

**HC-WAF-2 (Human Checkpoint):** Present scored results and all Critical/High findings. Human reviews before roadmap phase.
- List all Critical/High findings with proposed remediation
- Human confirms severity classification and priority ordering

**G4 checkpoint:** Per-pillar scores ✓ | Three-state gap analysis ✓ | HC-WAF-2 confirmed ✓

---

## Section 5: Remediation Roadmap (DMAIC Backcasting)

**Quality Gate G5: 4-phase backcasted roadmap produced with VE quantification**

Backcast from desired pillar scores:

**Phase 1 — Foundation (Weeks 1–4): Quick wins & critical risk removal**
- Address all Critical findings (automatic inclusion)
- Low-effort, high-impact security controls (Defender tiers, Key Vault migration)
- Baseline monitoring deployed
- Value: Immediate Critical → High risk reduction

**Phase 2 — Transform (Months 2–4): Core gap closure**
- Address all High findings across all pillars
- Reliability: zone redundancy for tier-1 workloads
- Security: private endpoints, WAF deployment, PIM enablement
- Cost: reserved instances, right-sizing of flagged resources
- Value: High → Medium risk reduction, material cost saving

**Phase 3 — Sustain (Months 4–6): Continuous assurance**
- IaC coverage for remaining manually-configured resources
- SPC baselines set for each pillar score
- Recurring compliance checks, drift detection operational
- Value: Regression prevention, audit readiness

**Phase 4 — Destination (Month 6+): Target state achieved**
- All desired pillar scores met
- Continuous monitoring maintaining score stability
- Full VE value realisation
- Value: All benefits realised, risk at target level

Per phase: investment estimate, risk reduction delta, value created, cumulative ROI (via `pfc-value-calc`)

**G5 checkpoint:** 4-phase roadmap produced ✓ | VE quantification per phase ✓ | Finding set ready for pipeline ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| EA-MSFT-ONT | v1.1.0 | WAFPillar entities (5 pillars), scoring model |
| MCSB-ONT | v2.0.0 | Security control family cross-reference |
| NCSC-CAF-ONT | v1.0.0 | Cyber outcome mapping for Security pillar |
| GRC-FW-ONT | v3.0.0 | Governance controls for OpEx/Security |
| ERM-ONT | v1.0.0 | Risk category mapping (23 categories) |
| RMF-IS27005-ONT | v1.0.0 | Risk rating per finding |
| VP-ONT | v1.0.0 | Problem/Solution/Benefit tagging for VE |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-WAF-MCSB-001 | `ea-msft:WAFPillar:Security` → `mcsb:SecurityControl` | alignsToControl |
| JP-WAF-NCSC-001 | `ea-msft:WAFPillar:Security` → `ncsc:ContributingOutcome` | mapsToCyberOutcome |
| JP-WAF-ERM-001 | `ea-msft:WAFPillarFinding` → `erm:Risk` | mapsToRisk |
| JP-WAF-VP-001 | `ea-msft:WAFPillarFinding` → `vp:Problem` | identifiesProblem |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-alz-assess-cyber` (SKL-089) | Security pillar findings feed cyber posture cross-reference |
| `pfc-alz-strategy` (SKL-090) | Per-pillar scores + finding set feed gap analysis and roadmap |
| `pfc-hcr-analyse` (SKL-108) | Pillar scores feed HCR WAF section |
| `pfc-alz-pipeline` (SKL-112) | Stage 3 output — parallel assessment alongside CAF/Cyber |
