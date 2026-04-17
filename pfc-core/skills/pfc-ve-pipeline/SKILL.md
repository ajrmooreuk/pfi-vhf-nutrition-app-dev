---
name: pfc-ve-pipeline
description: Master orchestrator for the VE (Value Engineering) process chain. Sequences 7 standalone skills from org-context through to value proposition, managing data flow and mid-chain entry points.
argument-hint: "[PFI instance name] [--start-from phase] [--stop-after phase]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-VE-PIPELINE: Value Engineering Process Orchestrator

Orchestrate the complete VE (Value Engineering) process chain from organizational context through to value proposition. This agent sequences 7 standalone skills, manages data flow between them, supports mid-chain entry, and produces a traceability summary.

## Dtree Classification

`AGENT_STANDALONE` — High autonomy (interprets upstream output quality, decides progression), full orchestration (7 sub-skills in sequence with parallel analysis phase), dev-only distribution.

Path: HG-01 PASS (7.2) → HG-02 PASS (7.1, AGENT_ORCHESTRATOR) → HG-05 FAIL (3.1) → `AGENT_STANDALONE`

## Architecture

### Pipeline Phases

```
Phase 1: Foundation    pfc-org-context       orgctx:OrganizationContext
                              |
Phase 2: Analysis      pfc-macro-analysis     macro:PESTELFactor[] + Scenario[]
         (parallel)    pfc-industry-analysis  ind:SWOT + TOWS[] + Ansoff
                              |
Phase 3: Strategy      pfc-vsom              vsom:Vision + Strategy[] + BSC
                              |
Phase 4: Execution     pfc-okr               okr:Objective[] + KeyResult[]
                              |
Phase 5: Measurement   pfc-kpi               kpi:KPI[]
                              |
Phase 6: Value         pfc-vp                Full VP entity set + RRR alignment
                              |
Phase 7: Summary       [this orchestrator]   Traceability matrix + summary
```

### Data Flow Contract

Each skill writes its output to a predictable path:

```
{working_dir}/ve-pipeline-output/
  01-org-context-{instance}.jsonld
  02-macro-analysis-{instance}.jsonld
  03-industry-analysis-{instance}.jsonld
  04-vsom-{instance}.jsonld
  05-okr-{instance}-{quarter}.jsonld
  06-kpi-{instance}.jsonld
  07-vp-{instance}-{icp}.jsonld
  08-ve-pipeline-summary.md
```

Each downstream skill reads upstream outputs from this directory.

## What You Do

When the user invokes `/azlan-github-workflow:pfc-ve-pipeline`, execute the following orchestration protocol.

---

### Step 0: Pipeline Configuration

Parse arguments and configure the pipeline:

**Instance identification:**
- Accept PFI instance name as first argument
- If not provided, ask the user

**Optional flags:**
- `--start-from {phase}` — Skip phases before the named phase. Valid values: `org-context`, `macro`, `industry`, `vsom`, `okr`, `kpi`, `vp`
- `--stop-after {phase}` — Stop after the named phase completes
- `--skip-analysis` — Skip Phase 2 (macro + industry) and proceed directly to VSOM
- `--org-context {path}` — Use an existing ORG-CONTEXT file instead of generating one
- `--quarter {Q1-Q4 YYYY}` — Set the OKR quarter (default: current quarter)

**Create output directory:**
```bash
mkdir -p ve-pipeline-output
```

**Determine execution plan:**
```
Phases to execute: {list}
Instance: {name}
Quarter: {quarter}
```

Confirm with user before proceeding.

---

### Step 1: Phase 1 — Foundation (pfc-org-context)

**Skip condition:** `--start-from` is after `org-context`, OR `--org-context {path}` provided

If executing:
1. Invoke `pfc-org-context` with instance name
2. Wait for completion
3. Verify output file exists: `ve-pipeline-output/01-org-context-{instance}.jsonld`
4. Load and validate: `@type` is `orgctx:OrganizationContext`, `@id` is present

If skipping with `--org-context`:
1. Copy/symlink provided file to `ve-pipeline-output/01-org-context-{instance}.jsonld`
2. Validate structure

**Checkpoint:** Report to user: "Phase 1 complete. Org context for {orgName} established."

---

### Step 2: Phase 2 — Analysis (parallel: pfc-macro-analysis + pfc-industry-analysis)

**Skip condition:** `--start-from` is after `industry`, OR `--skip-analysis`

If executing:
1. These two skills are **independent** — they can conceptually run in sequence (Claude Code is single-threaded but the data flow allows either order)
2. Run `pfc-macro-analysis` first (PESTEL feeds SWOT external factors)
3. Run `pfc-industry-analysis` second (benefits from PESTEL data)
4. Verify output files:
   - `ve-pipeline-output/02-macro-analysis-{instance}.jsonld`
   - `ve-pipeline-output/03-industry-analysis-{instance}.jsonld`

**Checkpoint:** Report: "Phase 2 complete. {factor-count} PESTEL factors, {scenario-count} scenarios, {tows-count} TOWS strategies identified."

---

### Step 3: Phase 3 — Strategy (pfc-vsom)

**Skip condition:** `--start-from` is after `vsom`

1. Invoke `pfc-vsom` with instance name
2. This skill will automatically load outputs from Phase 1 and Phase 2
3. Verify output: `ve-pipeline-output/04-vsom-{instance}.jsonld`
4. Validate: Vision present, strategies defined, BSC scorecard constructed

**Checkpoint:** Report: "Phase 3 complete. Vision: '{visionStatement}'. {strategy-count} strategies, {objective-count} objectives across 4 BSC perspectives."

---

### Step 4: Phase 4 — Execution (pfc-okr)

**Skip condition:** `--start-from` is after `okr`

1. Invoke `pfc-okr` with instance name and quarter
2. Verify output: `ve-pipeline-output/05-okr-{instance}-{quarter}.jsonld`
3. Validate: OKR objectives trace to VSOM objectives, 2-5 KRs per objective

**Checkpoint:** Report: "Phase 4 complete. {objective-count} OKR objectives with {kr-count} key results for {quarter}."

---

### Step 5: Phase 5 — Measurement (pfc-kpi)

**Skip condition:** `--start-from` is after `kpi`

1. Invoke `pfc-kpi` with instance name
2. Verify output: `ve-pipeline-output/06-kpi-{instance}.jsonld`
3. Validate: VSOM→BSC→KPI golden chain intact, all 4 BSC perspectives have KPIs

**Checkpoint:** Report: "Phase 5 complete. {kpi-count} KPIs defined (F:{f} C:{c} I:{i} L&G:{lg})."

---

### Step 6: Phase 6 — Value (pfc-vp)

**Skip condition:** `--stop-after` was before `vp`

1. Invoke `pfc-vp` with instance name
2. Verify output: `ve-pipeline-output/07-vp-{instance}-{icp}.jsonld`
3. **Critical validation:** VP-RRR alignment complete (G4 zero-tolerance gate must have passed)

**Checkpoint:** Report: "Phase 6 complete. VP: '{primaryStatement}'. {icp-count} ICPs, {problem-count} problems, VP-RRR alignment: {mapping-count} mappings."

---

### Step 7: Phase 7 — Summary & Traceability

Generate the VE pipeline summary document:

```markdown
# VE Pipeline Summary: {orgName} ({instance-code})

**Generated:** {date}
**Instance:** {instance-name}
**Phases Executed:** {phase-list}

## Traceability Matrix

| Layer | Entity | Count | Traces To |
|-------|--------|-------|-----------|
| ORG-CONTEXT | OrganizationContext | 1 | — (foundation) |
| MACRO | PESTELFactor | {n} | → VSOM Strategy |
| MACRO | Scenario | {n} | → VSOM Vision |
| INDUSTRY | CompetitiveForce | 5 | → ORG-CONTEXT |
| INDUSTRY | TOWSStrategy | {n} | → VSOM Strategy |
| INDUSTRY | AnsoffVector | {n} | → OKR Objective |
| VSOM | Vision | 1 | ← MACRO Scenarios |
| VSOM | Strategy | {n} | ← TOWS, ← PESTEL |
| VSOM | Objective | {n} | → OKR, → BSC Perspective |
| BSC | Perspective | 4 | → RRR Executive Role |
| BSC | CausalLink | {n} | L&G → Internal → Customer → Financial |
| OKR | Objective | {n} | ← VSOM Objective |
| OKR | KeyResult | {n} | → KPI |
| KPI | KPI | {n} | ← OKR KR, → BSC Perspective |
| VP | ValueProposition | 1 | ← VSOM Objective |
| VP | ICP | {n} | → RRR RoleBasedICP |
| VP | Problem | {n} | → RRR Risk (JP-VP-RRR-001) |
| VP | Solution | {n} | → RRR Requirement (JP-VP-RRR-001) |
| VP | Benefit | {n} | → RRR Result (JP-VP-RRR-001) |

## Join Pattern Verification

| Pattern | Status | Details |
|---------|--------|---------|
| JP-VP-RRR-001 | {pass/fail} | {count} Problem→Risk, {count} Solution→Req, {count} Benefit→Result |
| JP-BSC-001 | {pass/fail} | VSOM → BSC → KPI golden chain |
| JP-BSC-002 | {pass/fail} | BSC perspectives → RRR executive roles |
| JP-BSC-005 | {pass/fail} | BSC objectives → OKR cascade |
| JP-IND-002 | {pass/fail/skipped} | TOWS → VSOM strategy |
| JP-MAC-001 | {pass/fail/skipped} | PESTEL → VSOM strategy |

## Output Files

| # | File | Size | Entities |
|---|------|------|----------|
| 01 | org-context-{instance}.jsonld | {size} | {count} |
| 02 | macro-analysis-{instance}.jsonld | {size} | {count} |
| 03 | industry-analysis-{instance}.jsonld | {size} | {count} |
| 04 | vsom-{instance}.jsonld | {size} | {count} |
| 05 | okr-{instance}-{quarter}.jsonld | {size} | {count} |
| 06 | kpi-{instance}.jsonld | {size} | {count} |
| 07 | vp-{instance}-{icp}.jsonld | {size} | {count} |

## Strategic Spine

**Vision:** {visionStatement} ({horizon}yr)

**Strategies:**
{for each strategy: name, type, BSC perspective focus}

**Top OKRs ({quarter}):**
{for each top-3 OKR: objective + key results}

**VP Statement:**
{primaryStatement}
```

Write to: `ve-pipeline-output/08-ve-pipeline-summary.md`

---

## Error Handling

If any skill fails:
1. Report the failure with gate details
2. Offer options:
   a. **Retry** the failed skill with user clarification
   b. **Skip** the failed skill and continue (with warnings about downstream impact)
   c. **Stop** the pipeline and preserve partial output
3. Never delete partial output — the user may want to resume later

If mid-chain entry is used with missing upstream data:
1. Check which upstream files exist in `ve-pipeline-output/`
2. Warn about missing files and their downstream impact
3. Proceed if the immediate upstream dependency is satisfied

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| All VE-Series ontologies | Consumed via sub-skills | vsom:, okr:, kpi:, vp:, bsc: |
| ORG-CONTEXT-ONT v3.1.0 | Foundation | orgctx: |
| RRR-ONT v4.0.0 | Cross-cutting alignment | rrr: |
| MACRO-ONT v1.0.0 | Analysis feeder | macro: |
| INDUSTRY-ONT v1.0.0 | Analysis feeder | ind: |

## Sub-Skill Invocations

| Phase | Skill | Invocation |
|-------|-------|------------|
| 1 | pfc-org-context | `/azlan-github-workflow:pfc-org-context {instance}` |
| 2a | pfc-macro-analysis | `/azlan-github-workflow:pfc-macro-analysis {instance}` |
| 2b | pfc-industry-analysis | `/azlan-github-workflow:pfc-industry-analysis {instance}` |
| 3 | pfc-vsom | `/azlan-github-workflow:pfc-vsom {instance}` |
| 4 | pfc-okr | `/azlan-github-workflow:pfc-okr {instance}` |
| 5 | pfc-kpi | `/azlan-github-workflow:pfc-kpi {instance}` |
| 6 | pfc-vp | `/azlan-github-workflow:pfc-vp {instance}` |
