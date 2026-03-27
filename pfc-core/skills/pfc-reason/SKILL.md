---
name: pfc-reason
description: MECE decomposition, logic tree analysis, hypothesis testing, and synthesis. Cross-cutting reasoning substrate invoked by analytical skills (DELTA, VE pipeline). Implements REASON-ONT v1.0.0.
argument-hint: "[strategic question or gap statement] [--mode mece|hypothesis|logic-tree|synthesis]"
user-invocable: false
allowed-tools: "Read,Grep,Glob,Write"
---

# PFC-REASON: Structured Reasoning Plugin

Provides structured reasoning capabilities to analytical skills. Not invoked directly by users — called by orchestrators (pfc-delta-pipeline, pfc-ve-pipeline) or phase skills (pfc-delta-evaluate, pfc-delta-leverage). Implements REASON-ONT v1.0.0 entity patterns.

## Dtree Classification

`PLUGIN_LIGHTWEIGHT` — Low autonomy (structured decomposition rules), no orchestration, embedded within calling skills, no independent distribution.

Path: HG-01 FAIL (4.8) → `PLUGIN_LIGHTWEIGHT`

## Modes

This plugin operates in four modes, selected by the calling skill:

| Mode | Entry Point | Produces | Used By |
|------|-------------|----------|---------|
| `mece` | Strategic question or gap statement | rsn:MECETree + rsn:MECEBranch[] | pfc-delta-evaluate |
| `hypothesis` | MECE branches or levers | rsn:StrategicHypothesis + HypothesisAssumption[] + EvidenceItem[] | pfc-delta-leverage |
| `logic-tree` | Gap metric or driver model | rsn:LogicTree + LogicTreeNode[] with sensitivity ranks | pfc-delta-leverage |
| `synthesis` | Multiple analysis outputs | rsn:AnalysisSynthesis + SynthesisFinding[] + StrategicRecommendation[] | pfc-delta-leverage, pfc-delta-narrate |

---

## Mode 1: MECE Decomposition

**Input:** A strategic question (rsn:StrategicQuestion) or CGA gap statement.

### Step 1: Question Framing

Classify the question:
- `vsomLayerTarget`: Which VSOM layer does this target? (Vision / Strategy / Objectives / Metrics)
- `scope`: narrow / functional / enterprise / market
- `urgency`: Immediate / Short-term / Medium-term / Long-term

**BR-RSN-001 (mandatory):** StrategicQuestion MUST have vsomLayerTarget.

### Step 2: Tree Type Selection

Select the appropriate MECE tree type based on the question:

| Tree Type | When to Use |
|-----------|------------|
| `IssueTree` | "What are all the factors causing X?" |
| `HypothesisTree` | "Which of these explanations is correct?" |
| `DecisionTree` | "What are all the options for X?" |
| `DriverTree` | "What drives the metric X?" (quantitative) |
| `ProcessTree` | "What are all the steps in X?" |
| `SegmentationTree` | "How can we segment X?" |

### Step 3: Branch Decomposition

Decompose into MECE branches. For each branch:
- `branchId`: Sequential identifier
- `label`: Concise branch label
- `isLeaf`: true if no further decomposition needed
- `assignedFramework`: For leaf nodes — which analytical framework applies (Porter, SWOT, BSC, LogicTree, PESTEL, Ansoff, ValueChain, Scenario, Benchmarking, Custom)

**BR-RSN-002 (advisory):** Validate MECE — document gaps or overlaps in `meceValidationNotes`.
**BR-RSN-003 (advisory):** Leaf nodes SHOULD have `assignedFramework` for AI routing.

### Step 4: MECE Validation

Check:
- [ ] Branches are **Mutually Exclusive** — no overlap between any two branches
- [ ] Branches are **Collectively Exhaustive** — full coverage of the question scope
- [ ] Each leaf has a clear analytical path (framework assignment or further decomposition needed)

**Output:** `rsn:MECETree` with nested `rsn:MECEBranch[]` as JSON-LD.

---

## Mode 2: Hypothesis Testing

**Input:** MECE branches (from Mode 1) or lever candidates (from Mode 3).

### Step 1: Hypothesis Formation

For each input branch/lever, form a testable hypothesis:
- `hypothesisStatement`: Clear, falsifiable statement
- `confidenceLevel`: Initial confidence (0.0–1.0)
- `status`: Formed (initial state)

### Step 2: Assumption Identification

For each hypothesis, identify critical assumptions:
- `assumptionStatement`: What must be true for the hypothesis to hold
- `criticality`: **MustBeTrue** / Important / NiceToHave
- `status`: Untested (initial state)

**BR-RSN-004 (mandatory):** Every hypothesis MUST have at least one MustBeTrue assumption.

### Step 3: Evidence Collection

For each hypothesis, gather evidence:
- `evidenceDescription`: What was found
- `source`: Where the evidence comes from
- `direction`: **Supporting** / **Contradicting** / **Neutral**
- `strength`: Strong / Moderate / Weak

**BR-RSN-007 (mandatory):** Every evidence item MUST declare direction — no ambiguous evidence allowed.
**BR-RSN-008 (advisory):** SHOULD seek contradicting evidence. Flag if only supporting evidence found — potential confirmation bias.

### Step 4: Assumption Testing

Test MustBeTrue assumptions first:
- **BR-RSN-005 (mandatory):** MustBeTrue assumptions MUST be tested before hypothesis validation.
- **BR-RSN-006 (mandatory):** If any MustBeTrue assumption is Invalidated → parent hypothesis MUST be Invalidated or Pivoted.

Update hypothesis status:
- `Validated` — MustBeTrue assumptions hold, evidence net positive
- `Invalidated` — MustBeTrue assumption failed
- `Pivoted` — MustBeTrue failed but hypothesis reframed to remain viable

**Output:** `rsn:StrategicHypothesis[]` with nested assumptions and evidence as JSON-LD.

---

## Mode 3: Logic Tree Analysis

**Input:** A gap metric (from CGA) or quantitative driver model.

### Step 1: Root Metric Definition

Define the root node:
- `metricName`: The KPI or measure being decomposed
- `currentValue`: Current state measurement
- `targetValue`: Desired future state
- `unit`: Measurement unit

### Step 2: Driver Decomposition

Decompose the root metric into quantitative drivers:
- Each internal node has an `operator`: Add / Subtract / Multiply / Divide
- **BR-RSN-009 (mandatory):** Non-leaf nodes MUST have an operator.
- Leaf nodes represent the actionable levers

Example (Revenue decomposition):
```
Revenue [Multiply]
├── Volume [Add]
│   ├── New Customers [leaf]
│   ├── Returning Customers [leaf]
│   └── Expansion Revenue [leaf]
└── Average Deal Size [Multiply]
    ├── Base Price [leaf]
    └── Upsell Factor [leaf]
```

### Step 3: Sensitivity Analysis

For each leaf node, calculate sensitivity rank:
- Impact on root metric if this lever changes by 10%
- Rank all leaves by impact magnitude
- Top-3 leaves become the priority levers

**BR-RSN-010 (advisory):** Leaf nodes SHOULD map to `kpi:KPI`.
**BR-RSN-011 (advisory):** Nodes with sensitivityRank ≤ 3 SHOULD reference `vsom:ObjectivesComponent`.

### Step 4: Lever-to-Strategy Mapping

For top-N levers:
- Map each to a potential strategic action
- Identify cross-dependencies between levers
- Flag any levers that conflict

**Output:** `rsn:LogicTree` with nested `rsn:LogicTreeNode[]` as JSON-LD.

---

## Mode 4: Analysis Synthesis

**Input:** Multiple analysis outputs (MECE trees, hypotheses, logic trees, external framework results).

### Step 1: Source Aggregation

Collect all inputs and tag their source framework:
- MECE decomposition findings
- Hypothesis test results (validated/invalidated/pivoted)
- Logic tree sensitivity results
- External framework outputs (SWOT, PESTEL, Porter, BSC)

**BR-RSN-012 (mandatory):** Synthesis MUST reference the original `questionRef`.

### Step 2: Convergence/Divergence Detection

For each finding, classify:
- **Convergent** — Multiple frameworks agree on this finding (high confidence)
- **Divergent** — Frameworks disagree — document the contradiction and resolution
- **BlindSpot** — Gap in framework coverage

**BR-RSN-013 (mandatory):** When multiple frameworks are synthesised, contradictions MUST be documented as `Divergent` findings.

### Step 3: Recommendation Formation

For each significant finding, form a recommendation:
- `recommendationStatement`: Clear actionable recommendation
- `targetVSOMLayer`: Which VSOM component this targets
- `priority`: Critical / High / Medium / Low
- `confidence`: Based on evidence strength
- `evidenceChainRefs`: Links to supporting evidence items
- `adoptionStatus`: Proposed (initial)

**BR-RSN-014 (mandatory):** Critical/High recommendations MUST have evidenceChainRefs.
**BR-RSN-015 (mandatory):** Accepted recommendations MUST reference vsomComponentRef.

### Step 4: Strategy Update Preparation

Package recommendations for VSOM update:
- Group by target VSOM layer
- Identify which strategies to create/modify/retire
- Prepare the `updatesStrategy` relationship links

**Output:** `rsn:AnalysisSynthesis` with `rsn:SynthesisFinding[]` and `rsn:StrategicRecommendation[]` as JSON-LD.

---

## Anti-Patterns (Mandatory Avoidance)

1. **Confirmation Bias** — Never accept a hypothesis with only supporting evidence. BR-RSN-008 requires actively seeking contradicting evidence.
2. **MECE Violations** — Overlapping branches create double-counting. Missing branches create blind spots. Always validate.
3. **Untested Assumptions** — Never proceed to recommendations with untested MustBeTrue assumptions. BR-RSN-005 is a hard gate.
4. **Orphan Recommendations** — Every recommendation must trace back through evidence chains to the original question. No free-floating advice.
5. **Sensitivity Blindness** — In logic trees, the highest-sensitivity lever might not be the most obvious. Rank by impact, not by intuition.

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| REASON-ONT v1.0.0 | Core schema | `rsn:` |
| VSOM-ONT v3.0.0 | Strategy target | `vsom:` |
| KPI-ONT v1.0.0 | Metric linkage | `kpi:` |
| INDUSTRY-ONT v1.0.0 | Framework inputs | `ind:` |
| BSC-ONT v1.0.0 | Scorecard linkage | `bsc:` |
| RRR-ONT v4.0.0 | Role ownership | `rrr:` |
| PPM-ONT v4.0.0 | Initiative funding | `ppm:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| JP-RSN-001 | Question → MECE → Analyse → Synthesise → Update VSOM |
| JP-RSN-002 | Hypothesis → Assumptions → Evidence → Validate/Invalidate → Act |
| JP-RSN-003 | Logic Tree → Sensitivity → Top Levers → Strategic Objectives |
| JP-RSN-004 | Synthesis → Recommendations → VSOM → BSC Operationalisation |
| JP-RSN-005 | MECEBranch.assignedFramework → AI agent routes to analytical tool |
