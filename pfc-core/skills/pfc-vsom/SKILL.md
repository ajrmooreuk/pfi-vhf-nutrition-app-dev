---
name: pfc-vsom
description: Vision-Strategy-Objectives-Metrics formulation with Balanced Scorecard strategy mapping. Consumes org context and SA analysis, produces vsom:Vision, vsom:Strategy[], vsom:StrategicObjective[], bsc:BalancedScorecard, and bsc:StrategyMap JSON-LD entities.
argument-hint: "[org-context file, SA analysis files, or PFI instance name]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-VSOM: Vision-Strategy-Objectives-Metrics + BSC Strategy Map

Formulate the strategic spine — Vision, Strategy, Objectives, and Metrics — following VSOM-ONT v3.0.0, with Balanced Scorecard operationalisation from BSC-ONT v1.0.0. This is the central node in the VE chain: everything upstream (MACRO, INDUSTRY) feeds in, everything downstream (OKR, KPI, VP) cascades from it.

## Dtree Classification

`SKILL_STANDALONE` — Moderate-high autonomy (BSC causal chain construction, MECE validation, strategy decomposition), no orchestration, single-concern.

Path: HG-01 PARTIAL (5.3) → HG-03 FAIL (3.5) → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:pfc-vsom`, follow these 8 sections in order. This skill has 7 quality gates — the most of any standalone skill in the VE chain.

---

### Section 1: Context Ingestion

Load all available upstream context:

1. **ORG-CONTEXT (mandatory):** Load `01-org-context-{instance}.jsonld`
2. **MACRO analysis (recommended):** Load `02-macro-analysis-{instance}.jsonld` — scenarios, PESTEL factors
3. **INDUSTRY analysis (recommended):** Load `03-industry-analysis-{instance}.jsonld` — TOWS strategies, Ansoff vectors, Porter forces
4. **Existing VSOM (optional):** Load any existing `vsom-{instance}*.jsonld` for review/refinement
5. **RRR instance data (recommended):** Load RRR roles for ownership assignment

**Synthesis brief:** Present to user:
```
VSOM Context for {orgName} ({instance-code})

Org Profile: {industry}, {orgType}, {orgStage}, {geography}
Products:    {count} ({product-names})
Maturity:    Level {level}

SA Analysis Available:
  MACRO:    {yes/no} — {count} PESTEL factors, {count} scenarios
  INDUSTRY: {yes/no} — Attractiveness {score}/5, {count} TOWS strategies

Key Strategic Inputs:
  - {top TOWS strategy 1}
  - {top TOWS strategy 2}
  - {top scenario implication}
```

If SA analysis is absent, warn: "MACRO and INDUSTRY analysis not available. VSOM formulation will lack analytical grounding. Recommend running pfc-macro-analysis and pfc-industry-analysis first."

**Quality Gate G1 — Context Complete:**
- [ ] ORG-CONTEXT loaded with org profile, products, market
- [ ] SA analysis status confirmed (present or acknowledged absent)
- [ ] Synthesis brief presented and confirmed by user

---

### Section 2: Vision Formulation

Draft the strategic vision:

| Field | Constraint | Description |
|-------|-----------|-------------|
| `visionId` | `vsom:vision-{instance}` | Unique identifier |
| `visionStatement` | 50-500 characters | Aspirational future state |
| `visionScope` | organizational / functional | Scope level |
| `visionHorizon` | 3-10 years | Time horizon (must be >= strategy horizon) |
| `visionOwner` | RRR C-Suite role ref | Who owns the vision (CEO, CTO, etc.) |
| `status` | draft | Initial status |

**Vision statement guidance:**
- Start with "To be..." or "To become..." or a declarative future state
- Must be aspirational but achievable
- Should reference the customer/market value, not internal process
- If scenarios available: stress-test vision against all scenarios — does it hold?

If MACRO scenarios available, validate:
- Does the vision remain relevant in the most likely scenario?
- Does it survive the worst-case scenario?
- Is it ambitious enough for the best-case scenario?

**Quality Gate G2 — Vision Coherent:**
- [ ] Vision statement 50-500 characters
- [ ] Horizon >= any strategy horizon (e.g., vision 5yr >= strategy 3yr)
- [ ] Owner is a C-Suite role (CEO, CMO, CTO, COO, CFO)
- [ ] If scenarios available: vision validated against all scenarios

---

### Section 3: Strategy Definition

Define 2-5 strategies that operationalise the vision:

For each strategy:

| Field | Description |
|-------|-------------|
| `strategyId` | `vsom:strategy-{instance}-{seq}` |
| `strategyName` | Concise action-oriented name |
| `strategyDescription` | 1-3 sentences |
| `strategyType` | growth / transformation / innovation / operational_excellence / customer_centricity / risk_management |
| `strategicFocus` | Primary focus area |
| `timeHorizon` | 1-3 years |
| `strategyScope` | organizational / functional |
| `setByRole` | RRR role who owns this strategy |
| `informedBy` | Vision reference + SA analysis references |
| `status` | draft |

**SA Integration:**
- If TOWS strategies available: every strategy should trace to at least 1 TOWS output (JP-IND-002)
- If scenarios available: link to scenario implications (JP-MAC-001)
- If Ansoff available: growth strategies should reference Ansoff vectors

**MECE check:** Strategies must be mutually exclusive within their scope (no overlapping remit) and collectively exhaustive (full strategic agenda covered).

**Quality Gate G3 — Strategy Traceability:**
- [ ] 2-5 strategies defined
- [ ] Every strategy `informedBy` the Vision
- [ ] If TOWS available: at least 1 strategy traces to a TOWS output
- [ ] If scenarios available: strategies validated against scenario implications
- [ ] MECE: no overlapping strategies within the same scope

---

### Section 4: Objective Cascade

For each strategy, define 2-5 strategic objectives:

| Field | Description |
|-------|-------------|
| `objectiveId` | `vsom:obj-{instance}-{strategy-seq}-{seq}` |
| `objectiveName` | Outcome-oriented statement |
| `objectiveDescription` | What success looks like |
| `bscPerspective` | Financial / Customer / InternalProcess / LearningGrowth |
| `priority` | P1-Critical / P2-High / P3-Medium / P4-Low |
| `ownerRole` | RRR role responsible |
| `parentStrategy` | Strategy reference |
| `timeframe` | Annual / Multi-year |

**BSC Perspective Classification:**
- **Financial:** Revenue, margin, cost, shareholder value
- **Customer:** Satisfaction, retention, acquisition, market share
- **Internal Process:** Efficiency, quality, innovation, operations
- **Learning & Growth:** Skills, culture, technology, knowledge

**Quality Gate G4 — Objective Balance:**
- [ ] 2-5 objectives per strategy
- [ ] All 4 BSC perspectives represented across the full objective set
- [ ] Each objective has a named owner (RRR role reference)
- [ ] Each objective classified by BSC perspective
- [ ] Priority assigned (P1-P4)

---

### Section 5: BSC Perspective Mapping & Strategy Map

Build the Balanced Scorecard and Strategy Map:

**Step 1:** Create BSC container:
```json
{
  "@type": "bsc:BalancedScorecard",
  "@id": "bsc:scorecard-{instance}",
  "bsc:perspectives": [
    { "@type": "bsc:BSCPerspective", "bsc:perspectiveName": "Financial", "bsc:perspectiveOwnedBy": "rrr:{CFO-role}" },
    { "@type": "bsc:BSCPerspective", "bsc:perspectiveName": "Customer", "bsc:perspectiveOwnedBy": "rrr:{CMO-role}" },
    { "@type": "bsc:BSCPerspective", "bsc:perspectiveName": "InternalProcess", "bsc:perspectiveOwnedBy": "rrr:{COO-role}" },
    { "@type": "bsc:BSCPerspective", "bsc:perspectiveName": "LearningGrowth", "bsc:perspectiveOwnedBy": "rrr:{CTO-role}" }
  ]
}
```

**Step 2:** Assign each objective to its BSC perspective.

**Step 3:** Build Causal Links (Strategy Map):

Causal chains flow bottom-up: Learning & Growth → Internal Process → Customer → Financial

For each causal link:
| Field | Description |
|-------|-------------|
| `linkId` | `bsc:link-{instance}-{seq}` |
| `fromObjective` | Lower-perspective objective |
| `toObjective` | Higher-perspective objective |
| `hypothesis` | "If we [from], then [to]" |
| `confidence` | High / Medium / Low |

Build at least 1 complete chain spanning all 4 perspectives.

**Quality Gate G6 — BSC Causal Chain:**
- [ ] All 4 BSC perspectives have at least 1 objective assigned
- [ ] Each perspective has an RRR role owner (JP-BSC-002)
- [ ] At least 1 complete causal chain (L&G → Internal → Customer → Financial)
- [ ] Each causal link has a testable hypothesis

---

### Section 6: Metric Definition

For each objective, define 1-3 metrics:

| Field | Description |
|-------|-------------|
| `metricId` | `vsom:metric-{instance}-{obj-seq}-{seq}` |
| `metricName` | What is measured |
| `metricType` | Leading (predictive) / Lagging (outcome) |
| `formula` | How it is calculated |
| `unit` | Measurement unit (%, count, GBP, days, score) |
| `baselineValue` | Current state |
| `targetValue` | Desired state |
| `dataSource` | Where data comes from |
| `frequency` | Daily / Weekly / Monthly / Quarterly / Annual |

**Leading vs Lagging mix:**
- Leading indicators: predict future performance (e.g., pipeline volume, training hours)
- Lagging indicators: measure outcomes (e.g., revenue, churn rate)
- Best practice: at least 1 leading + 1 lagging per strategy

**Quality Gate G5 — Metric Coverage:**
- [ ] Every objective has at least 1 metric
- [ ] Mix of leading and lagging indicators across the metric set
- [ ] Each metric has formula, unit, baseline, and target
- [ ] Data source identified for each metric

---

### Section 7: Output Assembly

Assemble the complete VSOM + BSC JSON-LD:

```json
{
  "@context": {
    "vsom": "https://platformcore.io/ontology/vsom/",
    "bsc": "https://platformcore.io/ontology/bsc/",
    "orgctx": "https://platformcore.io/ontology/org-context/",
    "rrr": "https://platformcore.io/ontology/rrr/",
    "pfc": "https://platformcore.io/ontology/"
  },
  "@type": "vsom:VSOMFramework",
  "@id": "vsom:framework-{instance}",
  "vsom:organizationContextRef": "org:ctx-{instance-code}",
  "vsom:vision": { "...from S2..." },
  "vsom:strategies": [ "...from S3..." ],
  "vsom:objectives": [ "...from S4..." ],
  "vsom:metrics": [ "...from S6..." ],
  "bsc:balancedScorecard": { "...from S5..." },
  "bsc:strategyMap": { "...from S5 causal links..." },
  "pfc:version": "1.0.0",
  "pfc:status": "draft",
  "pfc:createdDate": "YYYY-MM-DD"
}
```

**MECE Validation:**
- Strategies MECE within scope (no overlap)
- Objectives collectively exhaustive per strategy
- BSC 4 perspectives = MECE by design
- Metrics cover all objectives (no gaps)

Write to: `{working_dir}/ve-pipeline-output/04-vsom-{instance}.jsonld`

**Quality Gate G7 — MECE Compliance:**
- [ ] Strategies mutually exclusive within scope
- [ ] Objectives collectively exhaustive for each strategy
- [ ] Metrics cover every objective (no orphan objectives)
- [ ] BSC perspectives balanced (no empty perspective)

---

### Section 8: Validation

Run final validation checks:

- [ ] All G1-G7 gates passed
- [ ] JSON-LD well-formed with correct `@context`
- [ ] Vision horizon >= max strategy horizon
- [ ] Every strategy traces to Vision
- [ ] Every objective traces to a Strategy and BSC Perspective
- [ ] Every metric traces to an Objective
- [ ] At least 1 complete BSC causal chain
- [ ] All RRR role references are valid

Present summary:
```
VSOM + BSC Summary: {orgName} ({instance-code})
  Vision:      "{visionStatement}" ({horizon}yr)
  Strategies:  {count} ({types})
  Objectives:  {count} (F:{f-count} C:{c-count} I:{i-count} L&G:{lg-count})
  Metrics:     {count} ({leading} leading, {lagging} lagging)
  BSC:         4 perspectives, {causal-chains} causal chains
  SA Grounding: MACRO={yes/no}, INDUSTRY={yes/no}
  Output:      {file_path}
```

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| VSOM-ONT v3.0.0 | Primary schema | `vsom:` |
| BSC-ONT v1.0.0 | Scorecard & strategy map | `bsc:` |
| ORG-CONTEXT-ONT v3.1.0 | Upstream context | `orgctx:` |
| RRR-ONT v4.0.0 | Role ownership | `rrr:` |
| MACRO-ONT v1.0.0 | SA feeder | `macro:` |
| INDUSTRY-ONT v1.0.0 | SA feeder | `ind:` |
| REASON-ONT v1.0.0 | MECE validation | `rsn:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| `JP-BSC-001` | `vsom:VSOMFramework` → `bsc:operationalizedBy` → `bsc:BalancedScorecard` → `kpi:KPI` |
| `JP-BSC-002` | `bsc:BSCPerspective` → `perspectiveOwnedBy` → `rrr:ExecutiveRole` |
| `JP-BSC-005` | `bsc:BSCObjective` → `cascadesToOKR` → `okr:Objective` (consumed by pfc-okr) |
| `JP-IND-002` | `ind:TOWSStrategy` → `informsStrategy` → `vsom:Strategy` |
| `JP-MAC-001` | `macro:PESTELFactor.informs` → `vsom:Strategy` |
| `JP-MAC-002` | `macro:Scenario.constrains` → `vsom:Vision` |
