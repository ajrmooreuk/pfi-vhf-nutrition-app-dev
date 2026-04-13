---
name: pfc-okr
description: Cascades VSOM strategic objectives into quarterly OKRs with 2-5 key results each. Follows OKR-ONT v2.1.0 with BSC perspective classification and VSOM traceability.
argument-hint: "[vsom output file or PFI instance name]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-OKR: OKR Cascade Generator

Cascade VSOM strategic objectives into quarterly OKRs with quantitative key results, BSC perspective classification, and initiative mapping. Outputs JSON-LD to the VE pipeline.

## Dtree Classification

`SKILL_STANDALONE` — Low autonomy (structured cascade workflow), no orchestration, single-concern.

**Path:** HG-01 FAIL (3.3) → HG-04 PASS (6.8) → SKILL_STANDALONE

## What You Do

When the user invokes `/azlan-github-workflow:pfc-okr`, follow these 8 sections in order. Each section has a quality gate that MUST pass before proceeding.

---

### Section 1: VSOM Loading

Load the upstream VSOM output. Accept any of:
- **VSOM JSON-LD file** — `ve-pipeline-output/04-vsom-{instance}-v*.jsonld`
- **PFI instance name** — resolves to the latest VSOM output for that instance
- **Manual VSOM context** — user provides objectives directly

Extract and confirm:
- **Vision statement** (from VSOM L1)
- **Strategic objectives** (each with VSOM ID)
- **BSC perspective assignments** (Financial, Customer, Internal, Learning & Growth)
- **Metrics/measures** (from VSOM if available, for KR seeding)

If no VSOM output exists, prompt the user to run `/azlan-github-workflow:pfc-vsom` first.

**Quality Gate G1 — VSOM Loaded:**
- [ ] VSOM loaded with BSC perspective assignments
- [ ] At least one strategic objective with VSOM ID
- [ ] BSC perspectives identified for each objective

---

### Section 2: Cadence Selection

Define the OKR time period:

| Field | Description |
|-------|-------------|
| `cadence` | Quarterly (default), Annual, or Custom |
| `startDate` | Period start date (ISO 8601) |
| `endDate` | Period end date (ISO 8601) |
| `periodLabel` | e.g. `Q2-2026`, `FY2026-H1` |

Produce an `okr:TimePeriod` entity:
```json
{
  "@type": "okr:TimePeriod",
  "okr:cadence": "quarterly",
  "okr:startDate": "2026-04-01",
  "okr:endDate": "2026-06-30",
  "okr:periodLabel": "Q2-2026"
}
```

Default to current quarter unless the user specifies otherwise.

---

### Section 3: Objective Formulation

For each VSOM strategic objective, formulate 1-3 OKR objectives.

**OKR Objective Rules:**
- **Qualitative** — no numbers in the objective itself
- **Inspirational** — motivates the team
- **Time-bound** — scoped to the selected cadence
- **Max 100 characters** — concise and memorable
- **Cascade levels:** Company > Department > Team

For each objective, define:

| Field | Description |
|-------|-------------|
| `objectiveId` | `OKR-{INSTANCE}-{SEQ}` |
| `statement` | Qualitative objective (max 100 chars) |
| `cascadeLevel` | `company` / `department` / `team` |
| `bscPerspective` | Financial / Customer / Internal / Learning & Growth |
| `alignsToVSOM` | VSOM objective reference ID |
| `owner` | Role or team responsible |

**Quality Gate G2 — Objective Quality:**
- [ ] Every objective is qualitative (no numbers)
- [ ] Every objective is time-bound to selected cadence
- [ ] Every objective is max 100 characters
- [ ] Every objective traces to a VSOM strategic objective

---

### Section 4: Key Result Design

For each OKR objective, design 2-5 key results (BR-OBJ-001).

**Key Result Rules:**
- **Quantitative** — measurable with a number
- **Start value and target value** — where we are vs where we want to be
- **Unit of measure** — %, count, currency, rating, etc.
- **Weight** — percentage weight within the objective (all weights sum to 100%)
- **Start != Target** — a KR with no gap is not a KR

For each key result, define:

| Field | Description |
|-------|-------------|
| `krId` | `KR-{INSTANCE}-{OBJ_SEQ}.{KR_SEQ}` |
| `statement` | Quantitative result statement |
| `metricType` | `leading` / `lagging` |
| `startValue` | Baseline value |
| `targetValue` | Target value |
| `unit` | Unit of measure |
| `weight` | Percentage weight (sums to 100% per objective) |
| `dataSource` | Where the metric is measured |

**Quality Gate G3 — Key Result Rigour:**
- [ ] Every objective has 2-5 key results (BR-OBJ-001)
- [ ] Start value != target value for every KR
- [ ] Weights sum to exactly 100% per objective
- [ ] Every KR is quantitative with unit and target

---

### Section 5: Initiative Mapping

For each key result, identify 1-3 initiatives (actions/projects) that will move the metric.

For each initiative, define:

| Field | Description |
|-------|-------------|
| `initiativeId` | `INI-{INSTANCE}-{KR_SEQ}.{INI_SEQ}` |
| `name` | Initiative name |
| `description` | What this initiative does |
| `efsEpicRef` | EFS epic reference (if applicable) |
| `owner` | Team or role responsible |
| `effort` | T-shirt size (S/M/L/XL) |

**EFS Bridge:** Where an initiative maps to an existing EFS epic (from `/azlan-github-workflow:pfc-efs`), cross-reference using the epic ID. This creates the OKR-to-delivery traceability chain.

---

### Section 6: Alignment Verification

Run a full alignment check across the cascade:

1. **VSOM Traceability** — every OKR objective traces to a VSOM strategic objective
2. **Weight Integrity** — KR weights sum to exactly 100% per objective
3. **BSC Balance** — objectives cover at least 3 of 4 BSC perspectives
4. **Cascade Coherence** — company objectives decompose cleanly into department/team objectives
5. **No Orphans** — every KR has at least one initiative; every initiative maps to a KR

Produce an alignment report table:

| Check | Status | Detail |
|-------|--------|--------|
| VSOM traceability | PASS/FAIL | {count} objectives traced |
| Weight integrity | PASS/FAIL | {issues} |
| BSC balance | PASS/FAIL | {perspectives covered}/4 |
| Cascade coherence | PASS/FAIL | {notes} |
| Orphan check | PASS/FAIL | {orphans found} |

**Quality Gate G4 — Alignment Integrity:**
- [ ] Every OKR objective traces to a VSOM objective
- [ ] All KR weights sum to 100% per objective
- [ ] At least 3 of 4 BSC perspectives represented
- [ ] No orphan KRs or initiatives

---

### Section 7: Output Assembly

Assemble the OKR cascade into JSON-LD following OKR-ONT v2.1.0 schema.

**Output file:** `ve-pipeline-output/05-okr-{instance}-{quarter}-v1.0.0.jsonld`

**JSON-LD structure:**
```json
{
  "@context": {
    "okr": "https://baiv.co.uk/ontology/okr/v2.1.0#",
    "vsom": "https://baiv.co.uk/ontology/vsom/v3.0.0#",
    "bsc": "https://baiv.co.uk/ontology/bsc/v1.0.0#"
  },
  "@type": "okr:OKRCascade",
  "okr:instance": "{instance}",
  "okr:timePeriod": { ... },
  "okr:objectives": [ ... ],
  "okr:alignmentReport": { ... }
}
```

Also produce a human-readable summary:
- Total objectives / key results / initiatives
- BSC perspective distribution
- Weight allocation summary
- VSOM coverage heatmap

**Quality Gate G5 — Output Completeness:**
- [ ] JSON-LD file written to ve-pipeline-output/
- [ ] At least 3 BSC perspectives covered in the cascade
- [ ] All mandatory OKR-ONT fields populated
- [ ] Alignment report included in output

---

### Section 8: Validation

Run final validation checks:

1. **Schema validation** — OKR-ONT v2.1.0 entity/relationship compliance
2. **Cross-reference check** — VSOM IDs resolve, BSC perspective IDs valid
3. **Business rule check** — BR-OBJ-001 (2-5 KRs per objective), weight sums, no duplicate IDs
4. **Pipeline readiness** — output is consumable by downstream skills (pfc-kpi, pfc-vp)

**Summary output:**
```
OKR Cascade Summary
===================
Instance:     {instance}
Period:       {quarter}
Objectives:   {count} ({company}/{dept}/{team})
Key Results:  {count} (avg {avg} per objective)
Initiatives:  {count}
BSC Coverage: {perspectives}/4
VSOM Traced:  {count}/{total} objectives (100%)
Status:       PASS / FAIL
```

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| OKR-ONT v2.1.0 | Core OKR schema | `okr:` |
| VSOM-ONT v3.0.0 | Upstream strategic context | `vsom:` |
| BSC-ONT v1.0.0 | Perspective classification | `bsc:` |
| RRR-ONT v4.0.0 | Role ownership for objectives | `rrr:` |
| KPI-ONT | Downstream metric bridge | `kpi:` |
| EFS-ONT | Initiative-to-epic mapping | `efs:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| `JP-BSC-005` | BSC perspective → OKR objective cascade |
| `VSOM→OKR` | VSOM strategic objective → OKR objective alignment |
| `OKR→KPI` | OKR key result → KPI metric bridge (downstream) |
| `OKR→EFS` | OKR initiative → EFS epic cross-reference |
