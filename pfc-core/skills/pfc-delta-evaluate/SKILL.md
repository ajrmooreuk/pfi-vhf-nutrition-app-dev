---
name: pfc-delta-evaluate
description: Phase 2 (Evaluate) of the DELTA process. Comparative Gap Analysis (CGA) engine — scores current state, defines future state, quantifies the delta per dimension. Invokes SA tools conditionally on scope. Produces the CGA artifact.
argument-hint: "[scope artifact path] [--scope narrow|functional|enterprise|market]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-DELTA-EVALUATE: Comparative Gap Analysis & Gap Quantification

Phase 2 (Evaluate) of the DELTA process. The analytical core — establishes current state, defines desired future state, and quantifies the gap (delta) across every dimension. Invokes SA tools (MACRO, INDUSTRY) conditionally based on scope scale. Produces the CGA artifact that all downstream phases consume.

## Dtree Classification

`SKILL_STANDALONE` — Medium autonomy (interprets scope artifact, selects analysis depth), no orchestration, single-concern.

Path: HG-01 PASS (5.8) → HG-03 FAIL (3.5) → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:pfc-delta-evaluate`, follow these 8 sections in order.

---

### Section 1: Scope Artifact Loading

Read the Phase 1 scope artifact from: `{working_dir}/delta-output/01-delta-scope-{instance}.jsonld`

Extract:
- **Scale** — narrow / functional / enterprise / market
- **Discovery template** — which CGA dimensions to use
- **Context layers** — which are required and which have data
- **Evidence gathering plan** — what data is available now
- **Stakeholders** — who validated the scope

Also load any existing context data:
- `{working_dir}/delta-output/02-delta-context-{instance}.jsonld` (if previous context exists)
- Any upstream VE pipeline outputs referenced by the scope

**Quality Gate G-eval-1 — Scope Loaded:**
- [ ] Scope artifact parsed successfully
- [ ] Scale and template extracted
- [ ] Data availability assessed

---

### Section 2: SA Tool Invocation (Scope-Conditional)

Based on scope scale, invoke Strategy Analysis tools:

| Scale | SA Tools | What They Feed |
|-------|----------|---------------|
| `narrow` | None | Direct analysis from existing data |
| `functional` | pfc-industry-analysis | Competitive context for the function |
| `enterprise` | pfc-macro-analysis + pfc-industry-analysis | Macro trends + competitive position |
| `market` | pfc-macro-analysis + pfc-industry-analysis + external benchmarks | Full external context |

If SA tools are invoked:
1. Check if their outputs already exist in `ve-pipeline-output/` or `delta-output/`
2. If not, invoke them with the organisation context
3. Store outputs as: `{working_dir}/delta-output/02-delta-context-{instance}.jsonld`

The context artifact aggregates:
- PESTEL factors (enterprise+ scope)
- SWOT analysis (functional+ scope)
- Porter's Five Forces (market scope)
- Industry benchmarks (functional+ scope)

**Quality Gate G-eval-2 — Context Established:**
- [ ] All scope-required SA tools have produced output
- [ ] Context artifact written or existing data loaded

---

### Section 3: Current-State Scoring

For each CGA dimension (from the discovery template), score the current state:

**CGA Dimension Structure:**
```json
{
  "dimensionId": "dim-{n}",
  "dimensionName": "e.g., AI Search Visibility",
  "category": "e.g., Marketing Effectiveness",
  "currentState": {
    "score": 3.2,
    "scoreScale": "1-10",
    "evidence": ["list of evidence items supporting this score"],
    "dataQuality": "high|medium|low",
    "measuredAt": "2026-02-26",
    "metrics": [
      {
        "metricName": "e.g., ChatGPT mention rate",
        "currentValue": 0.02,
        "unit": "percentage",
        "source": "manual audit"
      }
    ]
  }
}
```

Scoring rules:
- Every score MUST have at least one evidence item
- Data quality must be assessed honestly — low-quality data gets flagged
- Use quantitative metrics where available, qualitative assessment where not
- Compare against industry benchmarks when available (from SA tools)

**Quality Gate G-eval-3 — Current State Scored:**
- [ ] Every CGA dimension has a current-state score
- [ ] Every score has evidence
- [ ] Data quality flagged for each dimension

---

### Section 4: Future-State Definition

For each CGA dimension, define the desired future state:

```json
{
  "futureState": {
    "targetScore": 7.5,
    "rationale": "Why this target is appropriate",
    "benchmarkReference": "Industry average / best-in-class / custom",
    "timeHorizon": "3-month / 6-month / 12-month / 24-month",
    "targetMetrics": [
      {
        "metricName": "ChatGPT mention rate",
        "targetValue": 0.15,
        "unit": "percentage",
        "basis": "Industry top-quartile benchmark"
      }
    ],
    "constraints": ["Budget", "Team size", "Technical capability"],
    "dependencies": ["Other dimensions that must improve first"]
  }
}
```

Future-state rules:
- Targets must be justified (benchmark, strategic objective, or stakeholder requirement)
- Time horizons must be realistic given constraints
- Dependencies between dimensions must be identified (improving X requires Y first)
- Map each target to a VSOM layer: which strategic objective does closing this gap serve?

**Quality Gate G-eval-4 — Future State Defined:**
- [ ] Every CGA dimension has a future-state target
- [ ] Targets are justified with rationale
- [ ] Time horizons set
- [ ] Cross-dimension dependencies identified

---

### Section 5: Gap Quantification (The Delta)

For each CGA dimension, calculate the gap:

```json
{
  "gap": {
    "absoluteGap": 4.3,
    "relativeGap": "57.3%",
    "gapSeverity": "critical|significant|moderate|minor",
    "gapPriority": 1,
    "meceDecomposition": "ref to rsn:MECETree if decomposed",
    "rootCauses": ["identified root causes"],
    "vsomAlignment": "Which VSOM objective this gap threatens"
  }
}
```

Gap severity classification:
- **Critical** — Gap threatens strategic viability (>70% relative gap or blocking dependency)
- **Significant** — Gap materially impacts objectives (40-70% relative gap)
- **Moderate** — Gap is meaningful but manageable (20-40% relative gap)
- **Minor** — Gap exists but low impact (<20% relative gap)

Priority ranking:
1. Rank all gaps by severity × strategic importance
2. Identify the top-3 gaps for immediate focus
3. Group gaps into clusters where they share root causes

**MECE Decomposition (for significant+ gaps):**
Invoke `pfc-reason` in `mece` mode to decompose each significant+ gap into analysable branches. This produces the tree structure that Phase 3 (Leverage) will use to identify levers.

**Quality Gate G-eval-5 — Gaps Quantified:**
- [ ] Every dimension has a calculated gap
- [ ] Gaps are severity-classified and priority-ranked
- [ ] Top-3 gaps identified
- [ ] Significant+ gaps have MECE decomposition

---

### Section 6: CGA Summary Table

Assemble the CGA summary — the primary analytical output of DELTA Phase 2:

```markdown
## Comparative Gap Analysis — {Organisation} ({Instance})

| # | Dimension | Current | Target | Gap | Severity | Priority | VSOM Alignment |
|---|-----------|---------|--------|-----|----------|----------|----------------|
| 1 | {dim1} | {score} | {target} | {gap} | Critical | 1 | {objective} |
| 2 | {dim2} | {score} | {target} | {gap} | Significant | 2 | {objective} |
| ... | | | | | | | |

### Gap Clusters
- **Cluster A: {name}** — Dimensions {x, y, z} share root cause: {cause}
- **Cluster B: {name}** — Dimensions {a, b} share root cause: {cause}

### Critical Dependencies
- Dimension {x} blocks dimension {y} — must be addressed first
- Dimension {a} and {b} are mutually reinforcing — address together

### Data Quality Assessment
- High confidence: {dimensions with high-quality data}
- Medium confidence: {dimensions with medium-quality data}
- Low confidence: {dimensions with low-quality data — flag for additional evidence}
```

---

### Section 7: CGA Artifact Output

Write the complete CGA artifact:

**JSON-LD output:** `{working_dir}/delta-output/04-delta-cga-{instance}.jsonld`

```json
{
  "@context": {
    "delta": "https://pf-core.dev/delta/v1/",
    "rsn": "https://oaa-ontology.org/v6/reason/",
    "kpi": "https://oaa-ontology.org/v6/kpi/",
    "vsom": "https://oaa-ontology.org/v6/vsom/"
  },
  "@type": "delta:ComparativeGapAnalysis",
  "@id": "delta:cga-{instance}-{date}",
  "scopeRef": "delta:scope-{instance}-{date}",
  "scale": "{scope}",
  "dimensions": [],
  "gapClusters": [],
  "criticalDependencies": [],
  "topGaps": [],
  "meceDecompositions": [],
  "dataQualityAssessment": {},
  "saToolOutputRefs": [],
  "evaluatedAt": "{timestamp}"
}
```

**Evidence artifact:** `{working_dir}/delta-output/03-delta-evidence-{instance}.jsonld`

Contains all raw evidence items collected during current-state scoring, linked to their CGA dimensions.

**Human-readable summary:** `{working_dir}/delta-output/04-delta-cga-{instance}-summary.md`

---

### Section 8: Gate Validation (G2)

**DELTA Gate G2 — Evaluation Complete:**
- [ ] All CGA dimensions scored (current and future state)
- [ ] All gaps quantified with severity classification
- [ ] Top-3 gaps identified and priority-ranked
- [ ] Significant+ gaps have MECE decomposition
- [ ] Evidence artifact written with source linkage
- [ ] CGA artifact written to delta-output/
- [ ] SA tool outputs stored (if invoked)

G2 is a **blocking gate**. If any condition fails, the DELTA process cannot proceed to Phase 3 (Leverage). Report failures and request user input to resolve.

**Re-entry handling:** If this is a re-entry from Phase 5 (Adapt) or Phase 3 (Leverage — BR-DELTA-001), load the previous CGA and update only the changed dimensions. Flag which dimensions have been re-evaluated.

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| REASON-ONT v1.0.0 | MECE decomposition of gaps | `rsn:` |
| MACRO-ONT v1.0.0 | Macro environment (enterprise+) | `macro:` |
| INDUSTRY-ONT v1.0.0 | Industry benchmarks + competition | `ind:` |
| KPI-ONT v1.0.0 | Metric definitions | `kpi:` |
| VSOM-ONT v3.0.0 | Strategic alignment | `vsom:` |
| BSC-ONT v1.0.0 | Scorecard perspectives | `bsc:` |
| VP-ONT v4.0.0 | Product/service dimensions | `vp:` |
| ORG-CONTEXT-ONT v3.1.0 | Organisation foundation | `orgctx:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| JP-DELTA-003 | CGA.dimension.vsomAlignment → vsom:StrategicObjective |
| JP-DELTA-004 | CGA.gap.meceDecomposition → rsn:MECETree (feeds Phase 3) |
| JP-DELTA-005 | CGA.evidence → rsn:EvidenceItem (traceability chain) |
