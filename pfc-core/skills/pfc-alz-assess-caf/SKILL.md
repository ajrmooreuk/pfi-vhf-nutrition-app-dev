---
name: pfc-alz-assess-caf
description: AGENT_SUPERVISED CAF readiness assessment — assesses Cloud Adoption Framework maturity across all 8 CAF domains using NCSC-CAF-ONT outcome mapping and live Azure MCP data. Produces phased adoption roadmap backcasted from desired maturity.
argument-hint: "[Azure tenant context] [--journey greenfield|migration|modernisation] [--domains all|strategy|plan|ready|migrate|innovate|govern|manage|organize]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write,Bash(az *),mcp__azure-skills__*"
---

# pfc-alz-assess-caf — CAF Readiness Assessment

**Skill ID:** SKL-088
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** [F74.3](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 7.0 — 8 CAF domains, NCSC-CAF-ONT outcome mapping, migration readiness 6R classification, DMAIC backcasting
HG-02 (Autonomy):   6.2 — human checkpoint at destination approval; cloud journey type requires human validation
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You assess Cloud Adoption Framework readiness across all 8 CAF domains (Strategy, Plan, Ready, Migrate, Innovate, Govern, Manage, Organize). You invoke azure-skills MCP tools to collect live evidence, map findings to NCSC-CAF-ONT contributing outcomes (B1–B6, C1–C4, D1–D2), classify workload migration readiness using 6R taxonomy, and produce a phased adoption roadmap backcasted from the customer's desired CAF maturity state.

You pause at one human checkpoint: before finalising the phased adoption roadmap, confirm the customer's cloud journey type and destination with a human.

---

## Section 1: Cloud Journey Classification & VE Context

**Quality Gate G1: Cloud journey type confirmed, CAF domain scope set**

1. Determine cloud journey type from argument or context:
   - **Greenfield**: New Azure environment; focus on Strategy, Plan, Ready, Govern domains
   - **Migration**: Existing workloads moving to Azure; all 8 domains, Migrate emphasis
   - **Modernisation**: Existing Azure estate modernising; Innovate, Manage, Govern emphasis
2. Load VE profile: customer OKRs, strategic drivers (cost, agility, compliance, innovation), Kano priorities
3. Map VE strategic drivers to CAF domains:
   - Cost driver → Govern (cost management), Manage (operations baseline)
   - Compliance driver → Govern (policy), Ready (LZ compliance config)
   - Agility driver → Plan (adoption plan), Innovate, Manage (automation)
   - Innovation driver → Innovate (AI/ML capability), Ready (LZ innovation patterns)
4. Invoke `azure-resource-lookup` → subscription inventory, resource type distribution (used to infer cloud journey progress)
5. Invoke `azure-resource-visualizer` → MG hierarchy, workload topology

**G1 checkpoint:** Cloud journey type confirmed ✓ | CAF domain scope set ✓ | VE drivers mapped ✓

---

## Section 2: CAF Domain Assessment — All 8 Domains

**Quality Gate G2: All in-scope domains assessed with evidence**

Assess each domain:

### Domain 1: Strategy (`caf:Strategy`)
- Evidence: Documented cloud business case, executive sponsorship, defined motivations
- Check: Business outcomes documented (cost, risk, agility, customer experience, operational)
- Check: Cloud economics model exists (TCO comparison, license optimisation)
- Check: Digital transformation strategy alignment
- Score inputs: Business case maturity, motivation clarity, stakeholder alignment

### Domain 2: Plan (`caf:Plan`)
- Invoke `azure-cloud-migrate` → digital estate assessment, dependency mapping
- Check: Workload inventory complete (business value, technical complexity per workload)
- Check: Skills readiness assessment done (Azure fundamentals, specific role certifications)
- Check: Adoption plan documented (phased migration sequence)
- Score inputs: Estate completeness %, skills gap coverage, plan specificity

### Domain 3: Ready (`caf:Ready`)
- Invoke `azure-prepare` → environment readiness, prerequisites
- Check: Landing zone deployed and validated (feeds from `pfc-alz-assess-health` if available)
- Check: Azure subscriptions structured per CAF guidance (Corp/Online/Sandbox)
- Check: Identity baseline (Entra ID Connect sync if hybrid, B2B policies, PIM)
- Check: Connectivity architecture deployed (hub/spoke or VWAN)
- Score inputs: LZ health score (from health skill), subscription structure compliance, identity baseline

### Domain 4: Migrate (`caf:Migrate`)
- Invoke `azure-cloud-migrate` → migration readiness per workload
- Classify workloads using 6R taxonomy per workload:
  - **Rehost** (lift & shift): No refactoring, fastest to migrate
  - **Replatform** (lift & reshape): Minor optimisations (managed DB, App Service)
  - **Refactor** (re-architect): Significant code changes for cloud-native
  - **Rebuild** (re-create): Rewrite in cloud-native
  - **Replace** (drop & shop): Replace with SaaS
  - **Retire**: Decommission — no longer needed
- Invoke `azure-validate` → for already-migrated workloads, validate landing zone compliance
- Score inputs: Migration readiness %, 6R distribution, dependency complexity

### Domain 5: Innovate (`caf:Innovate`)
- Invoke `azure-ai` → AI/ML service deployment, AI Gateway config
- Check: AI/ML capability present (Azure OpenAI, ML Workspace, AI Foundry)
- Check: Data platform for AI (Azure Data Factory, Synapse, Fabric readiness)
- Check: Innovation labs / sandbox subscriptions for experimentation
- Score inputs: AI platform maturity, data platform readiness, innovation velocity (deployment frequency)

### Domain 6: Govern (`caf:Govern`)
- Invoke `azure-compliance` → policy posture, Defender for Cloud, regulatory compliance
- Check: Cost management policies (budget alerts, tag governance, spending limits)
- Check: Security baseline (Defender plans, Azure Policy assignments — from `pfc-alz-assess-health` Domain 4)
- Check: Resource consistency (naming conventions, tagging, allowed locations, allowed SKUs)
- Check: Identity governance (access reviews, PIM — from `pfc-alz-assess-health` Domain 5)
- Score inputs: Policy compliance %, cost management coverage, resource consistency %, identity governance

### Domain 7: Manage (`caf:Manage`)
- Invoke `azure-observability` → operations baseline coverage
- Check: Operations baseline deployed (Azure Monitor, Log Analytics, Automation Account)
- Check: Business continuity: backup policies, Azure Site Recovery for tier-1 workloads
- Check: Platform operations (patch management, update management)
- Check: Workload operations (application-specific monitoring, SLAs defined)
- Score inputs: Operations baseline %, backup coverage %, MTTR capability, SLA coverage

### Domain 8: Organize (`caf:Organize`)
- Evidence: Team structure documentation, RACI, CoE or enablement team present
- Check: Cloud Centre of Excellence (CCoE) or enablement team operational
- Check: RACI defined for cloud operations (who operates, who governs, who develops)
- Check: Skills development plan (Azure certifications roadmap for team)
- Check: Platform team / product team model clear
- Score inputs: RACI completeness, team structure clarity, skills plan maturity

**G2 checkpoint:** All 8 domains assessed ✓ | 6R classification per workload (if Migration) ✓ | Evidence collected ✓

---

## Section 3: NCSC-CAF-ONT Outcome Mapping

**Quality Gate G3: All domain findings mapped to NCSC CAF contributing outcomes**

Map CAF domain findings to NCSC-CAF-ONT contributing outcomes:

| CAF Domain | NCSC CAF Contributing Outcomes |
|---|---|
| Govern (Security Baseline) | B1 (Policy), B3 (Asset Management), B6 (Supply Chain) |
| Govern (Identity) | B2 (Identity & Access Control) |
| Manage (Operations) | C1 (Service Protection), C2 (Proactive Security) |
| Manage (Monitoring) | C3 (Detection), C4 (Situation Awareness) |
| Ready (LZ) | B1, B3, B5 (Resilience) |
| Migrate (Workload Security) | B1, B2, B4 (Data Security) |
| Innovate (AI Workloads) | B4 (Data Security), GRC-FW-ONT AI Governance |

For each mapped finding:
- Record NCSC contributing outcome ID and description
- Apply `ncsc:OutcomeLevel` maturity rating (Initial / Developing / Established / Advanced)
- Flag where current NCSC outcome level is below desired level

**G3 checkpoint:** All findings have NCSC-CAF-ONT outcome references ✓ | Outcome maturity levels assigned ✓

---

## Section 4: CAF Domain Scoring & Three-State Gap Analysis

**Quality Gate G4: Per-domain scores, gap analysis, and human checkpoint HC-CAF-1 passed**

Score each domain 0–100%:
- Evidence-based scoring: (documented/validated items / total check items) × 100
- Deductions: Critical gap −20, High gap −10, Medium gap −5

Three-state gap analysis per domain:

```
Domain: Govern
  Best Practice:  95%   ████████████████████
  Desired State:  80%   █████████████████░░░   ← from VE profile OKRs
  Current State:  48%   █████████░░░░░░░░░░░   ← from Section 2 evidence
  Gap to Desired: 32 points
  Key Gaps: Cost management policies, resource tagging governance, access reviews
```

**HC-CAF-1 (Human Checkpoint):** Present domain scores and gaps. Confirm:
- Desired destination scores per domain (are defaults appropriate for this customer's journey?)
- Cloud journey type confirmed (greenfield/migration/modernisation)
- 6R workload classifications reviewed (migration customers only)
- Prioritisation: which domains are critical path for this customer?

**G4 checkpoint:** Domain scores ✓ | Gap analysis ✓ | HC-CAF-1 confirmed ✓

---

## Section 5: Phased Adoption Roadmap (DMAIC Backcasting)

**Quality Gate G5: Adoption roadmap produced per cloud journey type**

Backcast from confirmed desired destination:

**Greenfield roadmap pattern:**
- Phase 1 (Foundation): LZ deployment, identity baseline, governance framework, connectivity
- Phase 2 (Workload Onboarding): First workloads deployed, monitoring baseline, team trained
- Phase 3 (Optimise): Cost management, security hardening, IaC coverage, automation
- Phase 4 (Destination): All desired domain scores met, CCoE operational

**Migration roadmap pattern:**
- Phase 1 (Foundation): LZ ready, migration factory established, Rehost wave 1 candidates
- Phase 2 (Migration Waves): Systematic migration by 6R bucket (Rehost first, then Replatform)
- Phase 3 (Optimise): Post-migration optimisation, Refactor priorities, Govern maturity
- Phase 4 (Destination): Estate migrated, innovation pipeline active, Manage maturity

**Modernisation roadmap pattern:**
- Phase 1 (Assessment & Baseline): Govern and Manage gaps closed, observability complete
- Phase 2 (Modernise Workloads): Refactor/Rebuild priority workloads, AI/ML introduction
- Phase 3 (Innovate): AI platform operational, data platform mature, innovation cadence established
- Phase 4 (Destination): Cloud-native estate, Innovate maturity, all desired scores met

Each phase: domain maturity targets, key activities, VE value realisation, skills required

**G5 checkpoint:** Adoption roadmap produced (journey-type appropriate) ✓ | Phase targets set ✓ | Skills gap per phase identified ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| NCSC-CAF-ONT | v1.0.0 | Contributing outcomes B1–B6, C1–C4, D1–D2; outcome maturity levels |
| EA-MSFT-ONT | v1.1.0 | CAF domain entities, 6R taxonomy |
| GRC-FW-ONT | v3.0.0 | Governance framework for Govern domain |
| ERM-ONT | v1.0.0 | Risk categorisation for programme risk (adoption risk) |
| RMF-IS27005-ONT | v1.0.0 | Risk rating for capability gaps |
| VP-ONT | v1.0.0 | Problem/Solution/Benefit for VE integration |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-CAF-NCSC-001 | `ea-msft:CAFDomain` → `ncsc:ContributingOutcome` | mapsToOutcome |
| JP-CAF-ERM-001 | `ea-msft:CAFGap` → `erm:Risk` | mapsToRisk |
| JP-CAF-GRC-001 | `ea-msft:CAFDomain:Govern` → `grc-fw:GovernanceControl` | implementsControl |
| JP-CAF-VP-001 | `ea-msft:CAFGap` → `vp:Problem` | identifiesProblem |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-alz-assess-health` (SKL-086) | CAF Ready domain informs LZ health baseline |
| `pfc-alz-strategy` (SKL-090) | Domain scores + gap analysis feeds strategy roadmap |
| `pfc-hcr-analyse` (SKL-108) | CAF maturity feeds HCR cloud adoption section |
| `pfc-alz-pipeline` (SKL-112) | Stage 3 output — parallel alongside WAF/Cyber |
