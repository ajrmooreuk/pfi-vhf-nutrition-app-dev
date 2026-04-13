---
name: pfc-alz-pipeline
description: AGENT_ORCHESTRATOR master pipeline for the full Azure Landing Zone assessment — chains all 27 Epic 74 skills across 7 phases (ENGAGE→EXTRACT→ASSESS→ANALYSE→STRATEGISE→DOCUMENT→ASSURE) with 4 human checkpoints. 57-step pipeline covering VE discovery, live Azure data extraction via MCP, multi-framework scoring, GRC economics, HCR composition, and continuous assurance. Resumable from any phase via pipeline-state.json.
argument-hint: "[--tenant tenant-id] [--start-from ENGAGE|EXTRACT|ASSESS|ANALYSE|STRATEGISE|DOCUMENT|ASSURE] [--stop-after phase] [--customer-name 'name'] [--engagement-ref 'REF']"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write,Bash(gh *),mcp__azure-skills__*"
---

# pfc-alz-pipeline — Azure Assessment Master Pipeline

**Skill ID:** SKL-112
**Version:** v1.0.0
**Type:** AGENT_ORCHESTRATOR
**Feature:** F74.7 + F74.18
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 9.0 — 57-step pipeline, 7 phases, 4 human checkpoints, 27 skills, resumable state, MCP integration, full VE chain
HG-02 (Autonomy):   5.5 — 4 mandatory human checkpoints (scope, findings, roadmap, report sign-off); fully autonomous between checkpoints
Classification:     AGENT_ORCHESTRATOR
```

---

## What You Do

You are the master orchestrator for the Azure Landing Zone Health Check. You chain all 27 Epic 74 skills and 12 azure-skills MCP tools across 7 phases — from VE discovery and scope setting through live Azure data extraction, multi-framework assessment, GRC economics quantification, HCR report composition, and continuous assurance. You maintain a `pipeline-manifest.json` execution log and `pipeline-state.json` resumable state at every phase boundary so the pipeline can be re-entered at any point without re-running completed phases. You enforce 4 human checkpoints (HC-1 through HC-4) at scope approval, findings review, roadmap approval, and report sign-off. All autonomous phases run at full speed between checkpoints.

You follow the orchestrator pattern established by `pfc-dmaic-ve` and `pfc-ve-pipeline`.

---

## Section 1: Pipeline Initialisation & Phase 1 ENGAGE + Phase 2 EXTRACT

**Quality Gate G1: Pipeline initialised, VE context established, live Azure data extracted**

**Pipeline Initialisation:**

```
Create output directory structure:
  pfc-alz-pipeline-output/
  ├── engage/
  ├── extract/
  ├── assess/
  ├── analyse/
  ├── strategise/
  ├── document/
  ├── assure/
  ├── pipeline-manifest.json   ← execution log, timestamps, checkpoint status
  └── pipeline-state.json      ← resumable state (phase, step, outputs produced)

Initialise pipeline-manifest.json:
{
  "pipelineId": "ALZ-[engagement-ref]-[date]",
  "customer": "--customer-name",
  "tenant": "--tenant",
  "engagementRef": "--engagement-ref",
  "startTime": "[ISO-8601]",
  "phases": {
    "ENGAGE": "pending", "EXTRACT": "pending", "ASSESS": "pending",
    "ANALYSE": "pending", "STRATEGISE": "pending", "DOCUMENT": "pending", "ASSURE": "pending"
  },
  "checkpoints": { "HC-1": "pending", "HC-2": "pending", "HC-3": "pending", "HC-4": "pending" }
}
```

If `--start-from` is set: load `pipeline-state.json`, skip to specified phase. Do NOT re-execute completed phases.

---

**Phase 1 — ENGAGE** (7 steps, fully autonomous except HC-1):

| Step | Skill | Action |
|---|---|---|
| 1.1 | `pfc-org-context` | Load customer organisational context, sector, scale |
| 1.2 | `pfc-vsom` | Establish strategic context (mission, vision, strategic objectives) |
| 1.3 | `pfc-okr` | Draft OKR framework for Azure security and compliance |
| 1.4 | `pfc-kpi --mode baseline` | Establish baseline KPIs (current posture metrics) |
| 1.5 | `pfc-vp --scope problems` | Identify Value Proposition problems (current pain points) |
| 1.6 | `pfc-kano` | Classify assessment domains by Kano priority (MUST-BE/PERFORMANCE/DELIGHTER) |
| 1.7 | `pfc-delta-scope` | Define DELTA-scoped assessment boundaries (inclusions/exclusions) |

**HC-1 — Scope Approval:**
```
Present to customer:
  - VE profile: VSOM objectives, OKR draft, KPI baseline, VP problem statement
  - Assessment scope: domains included/excluded, depth per domain
  - Kano prioritisation: which domains are MUST-BE for this engagement
  - "Does the scope and VE focus reflect your priorities?"

Await customer confirmation. Record as checkpoint[HC-1] = "approved".
```

Outputs → `engage/org-context.jsonld`, `engage/ve-profile.jsonld`, `engage/scope.jsonld`
Update `pipeline-state.json`: ENGAGE = complete.

---

**Phase 2 — EXTRACT** (12 MCP steps, fully autonomous):

| Step | MCP Tool | Data Extracted |
|---|---|---|
| 2.1 | `azure-resource-lookup` | Subscription inventory, resource groups, key resources |
| 2.2 | `azure-prepare` | Tenant configuration, management group hierarchy |
| 2.3 | `azure-validate` | ALZ architecture validation, configuration checks |
| 2.4 | `azure-compliance` | MCSB v2.0.0 compliance status per control |
| 2.5 | `azure-rbac` | RBAC role assignments, privileged roles, service principals |
| 2.6 | `azure-diagnostics` | Diagnostic settings per resource type |
| 2.7 | `azure-kusto` | KQL evidence queries (Log Analytics workspace data) |
| 2.8 | `azure-observability` | Monitoring coverage, alert rules, workbook health |
| 2.9 | `azure-cost-optimization` | Cost data, Reserved Instances, advisor recommendations |
| 2.10 | `azure-compute` | VM inventory, sizing, availability zones |
| 2.11 | `azure-storage` | Storage accounts, replication, access controls |
| 2.12 | `entra-app-registration` | App registrations, service principal permissions |

Each MCP response saved as `extract/raw-mcp-[tool].json` with timestamp and call ID.
Produce `extract/extraction-manifest.json` — what was extracted, timestamps, scope, coverage gaps.

Update `pipeline-state.json`: EXTRACT = complete.

**G1 checkpoint:** Pipeline initialised ✓ | HC-1 scope approved ✓ | All 12 MCP extraction calls complete ✓ | extraction-manifest.json produced ✓

---

## Section 2: Phase 3 ASSESS

**Quality Gate G2: All assessment frameworks scored, cross-framework map produced, HC-2 confirmed**

**Phase 3 — ASSESS** (8 steps — 4 skills + 4 plugins):

| Step | Skill | Classification | SKL |
|---|---|---|---|
| 3.1 | `pfc-alz-assess-waf` | AGENT_SUPERVISED | SKL-086 |
| 3.2 | `pfc-alz-assess-caf` | AGENT_SUPERVISED | SKL-087 |
| 3.3 | `pfc-alz-assess-cyber` | AGENT_SUPERVISED | SKL-088 |
| 3.4 | `pfc-alz-assess-health` | AGENT_AUTONOMOUS | SKL-089 |
| 3.5 | `ontology-adapter` (plugin) | Maps extracted data to ontology entity types | — |
| 3.6 | `cross-framework` (plugin) | Initial cross-reference of shared findings | — |
| 3.7 | `rmf-scorer` (plugin) | Applies RMF IS27005 risk scores (Impact × Likelihood) | — |
| 3.8 | `ve-tagger` (plugin) | Tags all findings with VE weight and Kano class from engage/ve-profile | — |

Execution notes:
- Steps 3.1–3.4 run in parallel (independent frameworks, same source data)
- Steps 3.5–3.8 run sequentially after all 4 assessment skills complete (depend on finding sets)
- HC-CYBER-1 (internal to SKL-088): fires automatically for ANY Critical MCSB finding — do not bypass

Outputs:
```
assess/waf-findings.jsonld      ← WAF pillar scores + findings
assess/caf-findings.jsonld      ← CAF readiness scores + findings
assess/cyber-findings.jsonld    ← MCSB/GRC posture scores + findings
assess/health-findings.jsonld   ← ALZ healthcheck 7-domain results
assess/cross-framework-map.jsonld ← initial cross-reference map
```

**HC-2 — Findings Review:**
```
Present to lead architect (not customer-facing):
  - Finding counts by severity: [N] Critical, [N] High, [N] Medium, [N] Low
  - Domain scores summary (all frameworks)
  - Any unexpected findings that change assessment scope or depth
  - "Are scored findings accurate? Any items to reclassify before analysis?"

Await architect confirmation. Record checkpoint[HC-2] = "approved".
Update pipeline-state.json: ASSESS = complete.
```

**G2 checkpoint:** All 4 assessment frameworks scored ✓ | Plugins run ✓ | HC-2 findings review confirmed ✓

---

## Section 3: Phase 4 ANALYSE

**Quality Gate G3: Full analysis complete — correlation, economics, posture, root causes**

**Phase 4 — ANALYSE** (12 steps):

| Step | Skill | Classification | SKL | Depends On |
|---|---|---|---|---|
| 4.1 | `pfc-hcr-analyse` | AGENT_AUTONOMOUS | SKL-108 | 3.1–3.8 complete |
| 4.2 | `pfc-grc-mcsb-assess` | AGENT_SUPERVISED | SKL-091 | 3.3 cyber-findings |
| 4.3 | `pfc-grc-mcsb-benchmark` | AGENT_SUPERVISED | SKL-093 | 4.2 complete |
| 4.4 | `pfc-grc-baseline` | AGENT_AUTONOMOUS | SKL-092 | 4.2 complete |
| 4.5 | `pfc-grc-drift` | AGENT_AUTONOMOUS | SKL-094 | 4.4 baseline |
| 4.6 | `pfc-grc-mcsb-migrate` | AGENT_SUPERVISED | SKL-095 | 4.2 complete |
| 4.7 | `pfc-grc-mcsb-policy` | AGENT_AUTONOMOUS | SKL-097 | 2.4 compliance data |
| 4.8 | `pfc-grc-posture` | AGENT_SUPERVISED | SKL-098 | 4.2–4.4 complete |
| 4.9 | `pfc-qvf-cyber-impact` | AGENT_SUPERVISED | SKL-101 | 4.1, 4.3 complete |
| 4.10 | `pfc-qvf-threat-econ` | AGENT_SUPERVISED | SKL-102 | 4.1 complete |
| 4.11 | `pfc-qvf-breach-model` | AGENT_AUTONOMOUS | SKL-103 | 4.10 complete |
| 4.12 | `pfc-reason` | SKILL_STANDALONE | — | All 4.1–4.11 complete |

Parallelisation:
```
Batch A (run in parallel after HC-2):
  4.1 pfc-hcr-analyse  ←→  4.7 pfc-grc-mcsb-policy  ←→  4.2 pfc-grc-mcsb-assess

Batch B (after batch A completes):
  4.3 benchmark  ←→  4.4 baseline  ←→  4.6 migrate

Batch C (after batch B):
  4.5 drift  ←→  4.8 posture  ←→  4.10 threat-econ

Batch D (after batch C):
  4.9 cyber-impact  ←→  4.11 breach-model

Sequential:
  4.12 pfc-reason (after all of batch D — synthesis step)
```

Human checkpoints within Phase 4:
- HC-QVF-ECON-1 (internal to SKL-102): asset valuation confirmation — fires automatically
- HC-QVF-IMPACT-1 (internal to SKL-101): HIGH sensitivity assumption validation — fires automatically

Outputs:
```
analyse/cross-domain-correlation.jsonld  ← from 4.1
analyse/mcsb-benchmark.jsonld            ← from 4.2–4.3
analyse/posture-score.jsonld             ← from 4.8
analyse/cyber-economics.jsonld           ← from 4.9–4.11
analyse/root-cause.jsonld                ← from 4.12 (pfc-reason synthesis)
```

Update `pipeline-state.json`: ANALYSE = complete.

**G3 checkpoint:** Cross-domain correlation complete ✓ | GRC MCSB analysis complete ✓ | Cyber economics quantified ✓ | Root cause synthesis complete ✓

---

## Section 4: Phase 5 STRATEGISE

**Quality Gate G4: Roadmap and business case produced, HC-3 roadmap approval confirmed**

**Phase 5 — STRATEGISE** (6 steps):

| Step | Skill | Classification | SKL | Depends On |
|---|---|---|---|---|
| 5.1 | `pfc-alz-strategy` | AGENT_SUPERVISED | SKL-090 | Phase 4 complete |
| 5.2 | `pfc-grc-plan` | AGENT_SUPERVISED | SKL-096 | 5.1 complete |
| 5.3 | `pfc-grc-remediate` | AGENT_SUPERVISED | SKL-099 | 5.2 complete |
| 5.4 | `pfc-qvf-cyber-insure` | AGENT_SUPERVISED | SKL-104 | 4.8, 4.9 complete |
| 5.5 | `pfc-qvf-grc-roi` | AGENT_SUPERVISED | SKL-105 | 5.2, 4.9 complete |
| 5.6 | `pfc-qvf-grc-value` | AGENT_SUPERVISED | SKL-106 | 5.4, 5.5 complete |

Parallelisation:
```
5.1 pfc-alz-strategy → then:
  5.2 pfc-grc-plan → 5.3 pfc-grc-remediate (sequential)
  5.4 pfc-qvf-cyber-insure (parallel with 5.2)

After 5.2 and 5.4 complete:
  5.5 pfc-qvf-grc-roi → 5.6 pfc-qvf-grc-value (sequential)
```

Human checkpoints within Phase 5:
- HC-STRAT-1 (internal to SKL-090): destination approval — fires automatically
- HC-QVF-INSURE-1 (internal to SKL-104): policy confirmation — fires automatically
- HC-QVF-ROI-1 (internal to SKL-105): investment case confirmation — fires automatically
- HC-QVF-VALUE-1 (internal to SKL-106): unified value validation — fires automatically
- HC-GRC-PLAN-1 (internal to SKL-096): implementation plan approval — fires automatically

Outputs:
```
strategise/roadmap.jsonld             ← from 5.1 (strategic gap + 4-phase roadmap)
strategise/implementation-plan.jsonld ← from 5.2 (phased MCSB plan)
strategise/remediation-backlog.jsonld ← from 5.3 (P0–P3 backlog)
strategise/business-case.jsonld       ← from 5.5–5.6 (ROI, NPV, Cyber Value Equation)
strategise/insurance-economics.jsonld ← from 5.4 (premium trajectory, broker pack)
```

**HC-3 — Roadmap Approval:**
```
Present to customer stakeholders:
  - Strategic gap analysis summary (three-state per dimension)
  - Backcasted roadmap (4 phases: Foundation→Transform→Sustain→Optimise)
  - Programme investment vs. Cyber Value (ROI%, NPV, payback month)
  - OKR framework (3 objectives, key results per phase)
  - "Are phase priorities, investment, and timeline acceptable?"

Await customer confirmation. Record checkpoint[HC-3] = "approved".
Update pipeline-state.json: STRATEGISE = complete.
```

**G4 checkpoint:** Strategy complete ✓ | Business case complete ✓ | HC-3 roadmap approved ✓ | All strategise/ outputs produced ✓

---

## Section 5: Phase 6 DOCUMENT + Phase 7 ASSURE

**Quality Gate G5: Report delivered, continuous assurance operational, pipeline complete**

**Phase 6 — DOCUMENT** (7 steps):

| Step | Skill | Classification | SKL | Depends On |
|---|---|---|---|---|
| 6.1 | `pfc-hcr-analyse` | AGENT_AUTONOMOUS | SKL-108 | (already complete from Phase 4; output consumed here) |
| 6.2 | `pfc-hcr-roadmap` | AGENT_SUPERVISED | SKL-111 | HC-3 confirmed + Phase 5 complete |
| 6.3 | `pfc-hcr-verify` | AGENT_SUPERVISED | SKL-109 | Phase 3 + 4 evidence set |
| 6.4 | `pfc-hcr-compose` | AGENT_SUPERVISED | SKL-107 | 6.2 + 6.3 complete |
| 6.5 | `pfc-hcr-dashboard` | AGENT_AUTONOMOUS | SKL-110 | 6.4 hcr:Report complete |
| 6.6 | `pfc-grc-mcsb-report` | AGENT_AUTONOMOUS | SKL-100 | Phase 4 GRC analysis |
| 6.7 | `pfc-narrative` + `pfc-slide-engine` | SKILL_STANDALONE | — | 6.4 complete |

Parallelisation:
```
6.2 pfc-hcr-roadmap  ←→  6.3 pfc-hcr-verify  ←→  6.6 pfc-grc-mcsb-report (parallel)
After 6.2 + 6.3 complete:
  6.4 pfc-hcr-compose → 6.5 pfc-hcr-dashboard (sequential)
  6.7 narrative/slides (parallel with 6.5)
```

Human checkpoints in Phase 6:
- HC-HCR-ROADMAP-1 (internal to SKL-111): roadmap approval (bridges from HC-3) — fires automatically
- HC-HCR-VERIFY-1 (internal to SKL-109): verification attestation sign-off — fires automatically
- HC-HCR-COMPOSE-1 (internal to SKL-107): report draft review — fires automatically

**HC-4 — Report Sign-off:**
```
Present final deliverables to customer:
  - HCR v2.0 report (HTML interactive, PDF, DOCX)
  - Executive dashboard (4-level drill-down)
  - MCSB compliance report
  - Slide deck

"Do you approve this report for distribution and final delivery?"

Await customer sign-off. Record checkpoint[HC-4] = "approved".
```

Outputs:
```
document/health-check-report.html  ← HCR v2.0 interactive
document/health-check-report.pdf   ← print version
document/health-check-report.docx  ← Word deliverable
document/executive-dashboard.html  ← standalone dashboard
document/mcsb-compliance-report.md ← MCSB domain detail
document/strategic-roadmap.md      ← roadmap narrative
document/presentation.md           ← slide deck source
```

Update `pipeline-state.json`: DOCUMENT = complete.

---

**Phase 7 — ASSURE** (5 steps, operational / recurring):

| Step | Skill | Classification | Schedule |
|---|---|---|---|
| 7.1 | `pfc-grc-drift` | AGENT_AUTONOMOUS | Monthly |
| 7.2 | `pfc-grc-baseline` | AGENT_AUTONOMOUS | On Phase 3 completion / quarterly refresh |
| 7.3 | `azure-compliance` (MCP recurring) | EXTERNAL | Monthly |
| 7.4 | `pfc-kpi --mode monitor` | SKILL_STANDALONE | Monthly |
| 7.5 | `pfc-vp --scope full` | SKILL_STANDALONE | Quarterly |

Assure phase invocation (recurring, after delivery):
```bash
# Monthly drift check
/pfc-dev:pfc-alz-pipeline --tenant <id> --start-from ASSURE --stop-after ASSURE

# Trigger: pfc-grc-drift auto-escalation (HC-GRC-DRIFT-1) on new Critical findings
# → pipeline re-enters at ASSESS for the affected domain only
```

Outputs:
```
assure/drift-report.jsonld       ← monthly compliance drift from baseline
assure/spc-control-chart.jsonld  ← SPC UCL/LCL monitoring data
assure/kpi-monitor.jsonld        ← KPI tracking vs. baseline
```

Update `pipeline-state.json`: ASSURE = running (recurring).

---

**Pipeline completion summary:**

```
pipeline-manifest.json final state:
{
  "completionTime": "[ISO-8601]",
  "phases": {
    "ENGAGE": "complete", "EXTRACT": "complete", "ASSESS": "complete",
    "ANALYSE": "complete", "STRATEGISE": "complete", "DOCUMENT": "complete",
    "ASSURE": "running"
  },
  "checkpoints": {
    "HC-1": "approved", "HC-2": "approved", "HC-3": "approved", "HC-4": "approved"
  },
  "deliverables": ["health-check-report.html", "health-check-report.pdf", "executive-dashboard.html", "..."],
  "skillsExecuted": 57,
  "findingsTotal": "[N]",
  "postureScore": "[N]%",
  "cyberValue": "£[N]",
  "programmeROI": "[N]%"
}
```

**G5 checkpoint:** Report signed off HC-4 ✓ | All 7 deliverables produced ✓ | Continuous assurance operational ✓ | pipeline-manifest.json complete ✓

---

## Pipeline Summary

| Phase | Steps | Checkpoint | Key Output |
|---|---|---|---|
| 1. ENGAGE | 7 skills | HC-1 Scope Approval | VE profile + scope |
| 2. EXTRACT | 12 MCP | — | Raw Azure data |
| 3. ASSESS | 8 | HC-2 Findings Review | Scored findings |
| 4. ANALYSE | 12 | — | Correlation + economics |
| 5. STRATEGISE | 6 | HC-3 Roadmap Approval | Roadmap + business case |
| 6. DOCUMENT | 7 | HC-4 Report Sign-off | HCR + deliverables |
| 7. ASSURE | 5 | — (recurring) | Drift monitoring |
| **Total** | **57** | **4** | |

---

## Methodology Integration

| Methodology | Pipeline Phases |
|---|---|
| **DELTA** (F74.9) | Ph.1–2 = Discover+Evaluate; Ph.3–4 = Learn; Ph.5 = Transform; Ph.7 = Assure |
| **DMAIC** (F74.10) | Ph.1 = Define; Ph.2–3 = Measure; Ph.4 = Analyse; Ph.5 = Improve; Ph.7 = Control |
| **INS** (F74.11) | Ph.2 = Extract; Ph.3 = Assess; HC-2 = Review; Ph.4 = Score+Project; Ph.7 = Assure |
| **Backcasting** (F74.14) | Ph.4 benchmark (SKL-093) + Ph.5 roadmap (SKL-111) |
| **VE Chain** | Ph.1 VSOM→OKR→KPI→VP→Kano; Ph.5 QVF; Ph.6 HCR narrative |

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| HCR-ONT | v1.0.0 | `hcr:Report`, pipeline output container |
| MCSB-ONT | v2.0.0 | Assessment framework throughout Phase 3 and 4 |
| AZALZ-ONT | v1.0.0 | Phase 2 extraction schema, Phase 3.4 health assessment |
| EA-MSFT-ONT | v1.1.0 | WAF framework (Phase 3.1) |
| NCSC-CAF-ONT | v1.0.0 | CAF framework (Phase 3.2) |
| RMF-IS27005-ONT | v1.0.0 | Risk scoring throughout Phase 3–5 |
| QVF-ONT | v1.0.0 | `qvf:ValueModel`, cash flows (Phase 4–5) |
| VP-ONT | v1.0.0 | VE chain integration (Phase 1 and 5) |
| Cyber-Risk-ONT | v1.0.0 | FAIR scenarios (Phase 4.9–4.11) |
| OKR-ONT | v1.0.0 | OKR framework (Phase 1 and 5) |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-PIPE-PHASE-001 | `pipeline:Phase[EXTRACT]` → `pipeline:Phase[ASSESS]` | providesInputTo |
| JP-PIPE-PHASE-002 | `pipeline:Phase[ASSESS]` → `pipeline:Phase[ANALYSE]` | providesInputTo |
| JP-PIPE-PHASE-003 | `pipeline:Phase[ANALYSE]` → `pipeline:Phase[STRATEGISE]` | providesInputTo |
| JP-PIPE-PHASE-004 | `pipeline:Phase[STRATEGISE]` → `pipeline:Phase[DOCUMENT]` | providesInputTo |
| JP-PIPE-STATE-001 | `pipeline:State` → `pipeline:Phase` | resumesAt |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| Customer | HCR v2.0 report (HTML, PDF, DOCX) + executive dashboard |
| `pfc-alz-strategy` (SKL-090) | Feeds back from STRATEGISE phase into strategy commercial model |
| `pfc-hcr-dashboard` (SKL-110) | `hcr:Report` graph instance → interactive views |
| Azlan continuous assurance service | `assure/` outputs for ongoing monitoring cadence |
| SlideDeck pipeline | Phase 6 slide data for presentation generation |
