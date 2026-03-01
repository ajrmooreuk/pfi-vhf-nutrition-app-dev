---
name: pfc-delta-pipeline
description: Master orchestrator for the DELTA 5-phase discovery process. Sequences scope, evaluate, leverage, narrate, adapt with gate enforcement, scope-conditional SA tool invocation, and feedback loops. Follows pfc-ve-pipeline pattern.
argument-hint: "[PFI instance name] [--scope narrow|functional|enterprise|market] [--start-from phase] [--stop-after phase] [--cycle-number N]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-DELTA-PIPELINE: DELTA Process Orchestrator

Master orchestrator that runs the full DELTA 5-phase cycle: Discover > Evaluate > Leverage > Transform > Adapt. Manages gate enforcement, scope-conditional skill invocation, feedback loops (Phase 5 > Phase 2 re-entry), and multi-cycle tracking. Follows the pfc-ve-pipeline AGENT_STANDALONE pattern.

## Dtree Classification

`AGENT_STANDALONE` — High autonomy (interprets upstream output quality, decides progression), full orchestration (5 phase skills + conditional SA tools + reasoning plugin), dev-only distribution.

Path: HG-01 PASS (7.2) → HG-02 PASS (7.1, AGENT_ORCHESTRATOR) → HG-05 FAIL (3.1) → `AGENT_STANDALONE`

## Architecture

### Pipeline Phases

```
Phase 1: Discover      pfc-delta-scope       delta:DiscoveryScope
                              │
                         [G1 blocking]
                              │
Phase 2: Evaluate      pfc-delta-evaluate     delta:ComparativeGapAnalysis
         (conditional)  ├─ pfc-macro-analysis    (enterprise+ scope)
                        ├─ pfc-industry-analysis (functional+ scope)
                        └─ pfc-reason [mece]     (significant+ gaps)
                              │
                         [G2 blocking]
                              │
Phase 3: Leverage      pfc-delta-leverage     delta:Levers + Recommendations
                        └─ pfc-reason [hypothesis, logic-tree, synthesis]
                              │
                         [G3 blocking]
                              │  ┌──────────────────────────────────┐
                              │  │ BR-DELTA-001: MustBeTrue         │
                              │  │ invalidated? → loop to Phase 2   │
                              │  └──────────────────────────────────┘
                              │
Phase 4: Transform     pfc-delta-narrate      delta:Narrative + Plan
         (conditional)  ├─ pfc-okr               (enterprise+ scope)
                        ├─ pfc-kpi               (all scopes)
                        └─ pfc-vp                (all scopes)
                              │
                         [G4 blocking + stakeholder approval]
                              │
Phase 5: Adapt         pfc-delta-adapt        delta:Adaptation + Summary
                              │
                         [G5 blocking]
                              │
                    ┌─────────┼──────────┐
                    │         │          │
                  None    Adjust     Pivot/Revise
                    │         │          │
                 Complete  Continue   Loop to P2/P1
```

### Data Flow Contract

All artifacts written to a predictable directory:

```
{working_dir}/delta-output/
  01-delta-scope-{instance}.jsonld          (Phase 1: Discover)
  01-delta-scope-{instance}-summary.md      (Phase 1: Discover)
  02-delta-context-{instance}.jsonld        (Phase 2: SA tool outputs)
  03-delta-evidence-{instance}.jsonld       (Phase 2: Evidence items)
  04-delta-cga-{instance}.jsonld            (Phase 2: CGA)
  04-delta-cga-{instance}-summary.md        (Phase 2: CGA summary)
  05-delta-levers-{instance}.jsonld         (Phase 3: Lever analysis)
  06-delta-recommendations-{instance}.jsonld (Phase 3: Recommendations)
  07-delta-plan-{instance}.jsonld           (Phase 4: Transformation plan)
  08-delta-narrative-{instance}.md          (Phase 4: Client narrative)
  09-delta-adaptation-{instance}.jsonld     (Phase 5: Adaptation assessment)
  10-delta-summary.md                       (Phase 5: Traceability matrix)
```

## What You Do

When the user invokes `/azlan-github-workflow:pfc-delta-pipeline`, execute the following orchestration protocol.

---

### Step 0: Pipeline Configuration

Parse arguments and configure:

**Instance identification:**
- Accept PFI instance name as first argument (e.g., `PFI-BAIV`, `PFI-W4M`)
- If not provided, ask the user
- If instance is specified, load its EMC configuration from registry for template selection

**Flags:**
- `--scope narrow|functional|enterprise|market` — Override scope determination (otherwise auto-detected at Phase 1)
- `--start-from discover|evaluate|leverage|transform|adapt` — Skip earlier phases (requires existing artifacts)
- `--stop-after discover|evaluate|leverage|transform|adapt` — Stop after named phase
- `--instance {pfi-instance-id}` — PFI instance identifier
- `--cycle-number {n}` — For multi-cycle tracking (default: 1)

**Create output directory:**
```bash
mkdir -p delta-output
```

**Determine execution plan:**
```
DELTA Pipeline Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Instance:      {name}
Scope:         {scope or "auto-detect at Phase 1"}
Phases:        {list of phases to execute}
Cycle:         {n}
Start from:    {phase}
Stop after:    {phase}
```

Confirm with user before proceeding.

---

### Step 1: Phase 1 — Discover (pfc-delta-scope)

**Skip condition:** `--start-from` is after `discover`

If executing:
1. Invoke `/azlan-github-workflow:pfc-delta-scope` with instance and scope arguments
2. Wait for completion
3. Verify G1 gate passed
4. Verify output: `delta-output/01-delta-scope-{instance}.jsonld`
5. Extract confirmed scope scale for downstream conditional logic

If skipping:
1. Verify existing scope artifact exists
2. Load and validate structure
3. Extract scope scale

**Checkpoint:** Report: "Phase 1 (Discover) complete. Scope: {scale}. Template: {template}. {stakeholder-count} stakeholders mapped."

---

### Step 2: Phase 2 — Evaluate (pfc-delta-evaluate)

**Skip condition:** `--start-from` is after `evaluate`

If executing:
1. Invoke `/azlan-github-workflow:pfc-delta-evaluate` with scope artifact path
2. This skill internally handles SA tool invocation based on scope:
   - `narrow` → no SA tools
   - `functional` → pfc-industry-analysis
   - `enterprise` → pfc-macro-analysis + pfc-industry-analysis
   - `market` → pfc-macro-analysis + pfc-industry-analysis + benchmarks
3. Wait for completion
4. Verify G2 gate passed
5. Verify outputs: CGA, evidence, context artifacts

**Re-entry handling:** If this is a re-entry from Phase 5 (Adapt) or Phase 3 (BR-DELTA-001):
- Pass the previous CGA as context
- Flag which dimensions need re-evaluation
- Increment cycle-specific identifiers

**Checkpoint:** Report: "Phase 2 (Evaluate) complete. {dimension-count} CGA dimensions. Top gaps: {top-3 summary}. {severity} critical, {severity} significant."

---

### Step 3: Phase 3 — Leverage (pfc-delta-leverage)

**Skip condition:** `--start-from` is after `leverage`

If executing:
1. Invoke `/azlan-github-workflow:pfc-delta-leverage` with CGA artifact path
2. This skill internally invokes pfc-reason in logic-tree, hypothesis, and synthesis modes
3. Wait for completion
4. **BR-DELTA-001 check:** If any MustBeTrue assumption was invalidated:
   - Report the invalidation to the user
   - Offer: (a) Loop back to Phase 2 with updated evidence, (b) Override and continue (with warning)
   - If looping → go back to Step 2 with re-entry flag
5. Verify G3 gate passed
6. Verify outputs: levers, recommendations artifacts

**Checkpoint:** Report: "Phase 3 (Leverage) complete. {lever-count} levers identified. Top lever: {name} (sensitivity rank 1). {rec-count} recommendations. {hypothesis-count} hypotheses tested."

---

### Step 4: Phase 4 — Transform (pfc-delta-narrate)

**Skip condition:** `--stop-after` was before `transform`

If executing:
1. Invoke `/azlan-github-workflow:pfc-delta-narrate` with recommendations artifact path
2. Wait for completion
3. Verify G4 gate passed
4. Verify outputs: narrative, transformation plan

**Scope-conditional VE tools at Phase 4:**
For `enterprise+` scope, also invoke:
- `pfc-okr` — Cascade recommendations into quarterly objectives
- `pfc-kpi` — Define monitoring KPIs from transformation plan

For all scopes:
- `pfc-vp` — Update value proposition alignment
- Map recommendations to existing KPIs from the CGA

**Stakeholder approval checkpoint:**
- Present the narrative summary to the user
- Request approval before proceeding to Phase 5
- If not approved → iterate on Phase 4 or loop back to Phase 3

**Checkpoint:** Report: "Phase 4 (Transform) complete. Narrative: {audience-count} audience versions. Plan: {okr-count} objectives, {kpi-count} KPIs."

---

### Step 5: Phase 5 — Adapt (pfc-delta-adapt)

**Skip condition:** `--stop-after` was before `adapt`

If executing:
1. Invoke `/azlan-github-workflow:pfc-delta-adapt` with plan artifact path and cycle number
2. Wait for completion
3. Verify G5 gate passed
4. Extract cycle output

**Cycle output handling:**
- `None` → Pipeline complete. Report final summary.
- `Minor-Adjustment` → Pipeline complete for this cycle. Schedule next review.
- `Major-Pivot` → Loop back to Step 2 (Phase 2) with lessons and updated evidence. Increment cycle number.
- `Full-Revision` → Loop back to Step 1 (Phase 1) with fundamentally changed context. Increment cycle number.

**BR-DELTA-002 handling:**
If Phase 5 detects a critical KPI threshold breach:
- The breach triggers an immediate re-entry to Phase 2
- Do not wait for full adaptation assessment
- Pass the breach details as urgent context

**Checkpoint:** Report: "Phase 5 (Adapt) complete. Cycle output: {output}. {lesson-count} lessons captured. SaaS stage: {stage}."

---

### Step 6: Pipeline Summary & Traceability

After the pipeline completes (or stops at a gate), generate the full traceability summary:

```markdown
# DELTA Pipeline Summary: {Organisation} ({Instance})

**Generated:** {date}
**Cycle:** {n}
**Scope:** {scale}
**Phases Executed:** {phase-list}
**Cycle Output:** {None|Adjust|Pivot|Revise}

## Golden Thread: Evidence → Hypothesis → Recommendation → Objective → KPI

| Evidence | Gap | Lever | Hypothesis | Recommendation | KPI | Status |
|----------|-----|-------|-----------|----------------|-----|--------|
| ev-001 | gap-001 | lever-001 | hyp-001 | rec-001 | kpi-001 | Proposed |

## Gate Summary

| Gate | Phase | Status | Notes |
|------|-------|--------|-------|
| G1 | Discover | PASS | Scope: {scale}, Template: {template} |
| G2 | Evaluate | PASS | {dim-count} dimensions, {gap-count} gaps |
| G3 | Leverage | PASS | {lever-count} levers, BR-DELTA-001: {status} |
| G4 | Transform | PASS | Stakeholder approved: {date} |
| G5 | Adapt | PASS | Cycle: {output} |

## Artifact Manifest

| # | Artifact | Path | Size |
|---|----------|------|------|
| 01 | Discovery Scope | delta-output/01-delta-scope-{instance}.jsonld | {size} |
| 02 | Context | delta-output/02-delta-context-{instance}.jsonld | {size} |
| 03 | Evidence | delta-output/03-delta-evidence-{instance}.jsonld | {size} |
| 04 | CGA | delta-output/04-delta-cga-{instance}.jsonld | {size} |
| 05 | Levers | delta-output/05-delta-levers-{instance}.jsonld | {size} |
| 06 | Recommendations | delta-output/06-delta-recommendations-{instance}.jsonld | {size} |
| 07 | Plan | delta-output/07-delta-plan-{instance}.jsonld | {size} |
| 08 | Narrative | delta-output/08-delta-narrative-{instance}.md | {size} |
| 09 | Adaptation | delta-output/09-delta-adaptation-{instance}.jsonld | {size} |
| 10 | Summary | delta-output/10-delta-summary.md | {size} |

## SaaS Lifecycle Position

**Current stage:** {Service-fit|Benefits-realised|Adoption Secured|Retention/Upsell}
**Next action:** {description}
**Estimated next review:** {date}
```

Write to: `delta-output/10-delta-summary.md`

---

## Error Handling

If any phase skill fails:
1. Report the failure with gate details and specific failures
2. Offer options:
   a. **Retry** the failed phase with user clarification
   b. **Skip** the failed phase and continue (with strong warnings about downstream impact)
   c. **Stop** the pipeline and preserve partial output
3. Never delete partial output — the user may want to resume later with `--start-from`

If mid-chain entry is used with missing upstream data:
1. Check which upstream artifacts exist in `delta-output/`
2. Warn about missing files and their downstream impact
3. Proceed only if the immediate upstream dependency is satisfied

---

## Sub-Skill Invocations

| Phase | Skill | Invocation | Conditional |
|-------|-------|------------|-------------|
| 1 | pfc-delta-scope | `/azlan-github-workflow:pfc-delta-scope {instance}` | Always |
| 2 | pfc-delta-evaluate | `/azlan-github-workflow:pfc-delta-evaluate` | Always |
| 2a | pfc-macro-analysis | `/azlan-github-workflow:pfc-macro-analysis` | enterprise+ scope |
| 2b | pfc-industry-analysis | `/azlan-github-workflow:pfc-industry-analysis` | functional+ scope |
| 2c | pfc-reason (mece) | Invoked by pfc-delta-evaluate | significant+ gaps |
| 3 | pfc-delta-leverage | `/azlan-github-workflow:pfc-delta-leverage` | Always |
| 3a | pfc-reason (hypothesis, logic-tree, synthesis) | Invoked by pfc-delta-leverage | Always |
| 4 | pfc-delta-narrate | `/azlan-github-workflow:pfc-delta-narrate` | Always |
| 4a | pfc-okr | `/azlan-github-workflow:pfc-okr` | enterprise+ scope |
| 4b | pfc-kpi | `/azlan-github-workflow:pfc-kpi` | All scopes |
| 4c | pfc-vp | `/azlan-github-workflow:pfc-vp` | All scopes |
| 5 | pfc-delta-adapt | `/azlan-github-workflow:pfc-delta-adapt` | Always |

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| PE-ONT v4.0.0 | Process template (pe-delta-process-template) | `pe:` |
| EMC-ONT v5.0.0 | PFI instance configuration | `emc:` |
| REASON-ONT v1.0.0 | MECE, hypothesis, logic trees, synthesis | `rsn:` |
| All VE-Series | Consumed via sub-skills | `vsom:`, `okr:`, `kpi:`, `vp:`, `bsc:` |
| All VE-SA Series | Conditional analysis | `macro:`, `ind:`, `rsn:` |
| All VE-SC Series | Narrative patterns | `nar:`, `cas:` |
| Foundation | Context | `orgctx:`, `org:` |
| RRR-ONT v4.0.0 | Cross-cutting alignment | `rrr:` |
