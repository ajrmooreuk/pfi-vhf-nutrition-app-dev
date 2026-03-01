---
name: pfc-macro-analysis
description: PESTEL analysis and scenario planning providing 5-10 year macro-environment context for VE strategy formulation. Produces macro:PESTELFactor and macro:Scenario JSON-LD entities.
argument-hint: "[org-context file or PFI instance name]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-MACRO-ANALYSIS: Macro Environment & Scenario Planner

Analyse the macro environment using PESTEL and scenario planning frameworks from MACRO-ONT. Provides the 5-10 year external context that informs VSOM vision and strategy formulation.

## Dtree Classification

`SKILL_STANDALONE` — Moderate autonomy (analytical reasoning for factor scoring and scenario construction), no orchestration, single-concern.

Path: HG-01 PARTIAL (4.3) → HG-03 FAIL (2.5) → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:pfc-macro-analysis`, follow these 8 sections in order. Each section has a quality gate that MUST pass before proceeding.

---

### Section 1: Context Loading

Load the organizational context from upstream:

1. **Find ORG-CONTEXT:** Look for `ve-pipeline-output/01-org-context-{instance}.jsonld` or accept a path from user
2. **Extract scoping data:** Industry sector, geography, org stage, market segments
3. **Load existing MACRO data:** Check for existing `macro-analysis-{instance}*.jsonld` files
4. **Summarise scope:** Present to user: "Analysing macro environment for {orgName} in {industry} sector, operating in {geography}"

If no ORG-CONTEXT is available, elicit: industry sector, primary geography, and org description. Do NOT proceed without scoping.

**Quality Gate G1 — Context Loaded:**
- [ ] Industry sector identified
- [ ] Primary geography identified
- [ ] Org stage/maturity known (or estimated)

---

### Section 2: PESTEL Factor Elicitation

Walk through all 6 PESTEL dimensions systematically. For each dimension, elicit 2-5 factors:

#### Political Factors
- Government stability, trade policies, tax regimes, regulation changes, subsidies
- Ask: "What political factors affect {orgName}'s ability to operate or grow?"

#### Economic Factors
- Interest rates, inflation, exchange rates, economic growth, employment levels
- Ask: "What economic forces impact your market or pricing?"

#### Social Factors
- Demographics, cultural trends, health consciousness, work-life attitudes, education
- Ask: "What social or demographic shifts affect demand for your products?"

#### Technological Factors
- Automation, R&D activity, technology adoption rates, digital infrastructure
- Ask: "What technological changes could disrupt or enable your business?"

#### Environmental Factors
- Climate change, sustainability regulations, carbon targets, resource scarcity
- Ask: "What environmental or sustainability pressures affect your industry?"

#### Legal Factors
- Employment law, consumer protection, data privacy, IP regulation, industry-specific compliance
- Ask: "What legal or compliance requirements constrain or shape your operations?"

For each factor, capture:

| Field | Description |
|-------|-------------|
| `factorId` | `mac:pestel-{dim}-{seq}` |
| `dimension` | Political / Economic / Social / Technological / Environmental / Legal |
| `factorName` | Concise label |
| `description` | 1-2 sentence explanation |
| `direction` | Positive (opportunity) / Negative (threat) / Neutral |
| `timeframe` | Near (1-2yr) / Medium (3-5yr) / Far (5-10yr) |

**Quality Gate G2 — PESTEL Coverage (MECE):**
- [ ] All 6 dimensions addressed (minimum 1 factor each)
- [ ] At least 12 total factors identified across all dimensions
- [ ] Each factor has dimension, name, description, direction, timeframe

---

### Section 3: Impact Scoring

Score each PESTEL factor on two axes:

| Axis | Scale | Description |
|------|-------|-------------|
| Impact | 1-5 | How much this factor affects the business (1=negligible, 5=transformative) |
| Probability | 1-5 | Likelihood of this factor materialising or intensifying (1=unlikely, 5=certain) |

Calculate composite score: `composite = impact * probability` (range 1-25)

Classify factors:
- **Critical** (composite >= 16): Must address in strategy
- **Important** (composite 9-15): Should address in strategy
- **Monitor** (composite < 9): Watch but don't prioritise

Present the scored matrix to the user sorted by composite score descending.

---

### Section 4: Scenario Construction

Build 3-4 plausible future scenarios from the Critical and Important factors:

1. **Identify uncertainty axes:** Select 2 high-impact, high-uncertainty factors as axes for a 2x2 matrix
2. **Name the quadrants:** Each quadrant = 1 scenario with a memorable name
3. **Optional 4th scenario:** A "wild card" combining low-probability, high-impact factors

For each scenario:

| Field | Description |
|-------|-------------|
| `scenarioId` | `mac:scenario-{instance}-{seq}` |
| `scenarioName` | Memorable, evocative name |
| `narrative` | 3-5 sentence description of this future |
| `keyDrivers` | Which PESTEL factors dominate |
| `probability` | Estimated likelihood (probabilities across scenarios should sum to ~1.0) |
| `earlyWarningSignals` | 2-3 observable indicators that this scenario is emerging |
| `strategicImplication` | What it means for vision and strategy |

**Quality Gate G3 — Scenario Plausibility:**
- [ ] 3-4 scenarios constructed
- [ ] Each scenario has narrative, drivers, and probability
- [ ] Probability assignments sum to approximately 1.0 (0.9-1.1 acceptable)
- [ ] Each scenario has at least 2 early warning signals

---

### Section 5: VSOM Implications

For each scenario, identify implications for Vision and Strategy:

| Field | Description |
|-------|-------------|
| `implicationId` | `mac:impl-{scenario-seq}-{seq}` |
| `scenarioRef` | Which scenario this relates to |
| `vsomLayer` | Vision / Strategy / Objective |
| `implication` | What this means for the VSOM layer |
| `urgency` | Immediate / Medium-term / Long-term |
| `actionType` | Pursue / Defend / Monitor / Pivot |

Build a scenario-strategy assessment matrix:

| Scenario | Strategy A Effectiveness | Strategy B Effectiveness | Strategy C Effectiveness |
|----------|-------------------------|-------------------------|-------------------------|
| Scenario 1 | Strong / Moderate / Weak | ... | ... |
| ... | ... | ... | ... |

(Strategies are placeholders — will be defined in pfc-vsom)

**Quality Gate G4 — VSOM Linkage:**
- [ ] Every scenario has at least 1 VSOM implication
- [ ] At least 1 implication per VSOM layer (Vision, Strategy, Objective)
- [ ] Urgency and action type assigned to each implication

---

### Section 6: Futures Funnel

Place scenarios and key factors on a temporal horizon:

```
                    Possible (could happen)
                   /
            Plausible (could reasonably happen)
           /
     Probable (likely to happen)
    /
Preferable (what we want)
|
NOW ──────────────────────────────> 10+ YEARS
```

For each scenario, classify:
- **Probable:** Most likely based on current trends
- **Plausible:** Reasonable given known drivers
- **Possible:** Conceivable but requires significant change
- **Preferable:** The desired future state (link to VSOM Vision)

Optionally, if user wants backcasting:
- Start from the preferable scenario
- Work backwards to identify milestones needed at 7yr, 5yr, 3yr, 1yr

---

### Section 7: Output Assembly

Assemble the complete MACRO analysis JSON-LD:

```json
{
  "@context": {
    "macro": "https://platformcore.io/ontology/macro/",
    "orgctx": "https://platformcore.io/ontology/org-context/",
    "pfc": "https://platformcore.io/ontology/"
  },
  "@type": "macro:MacroAnalysis",
  "@id": "macro:analysis-{instance}",
  "macro:organizationContextRef": "org:ctx-{instance-code}",
  "macro:pestelAnalysis": {
    "@type": "macro:PESTELAnalysis",
    "macro:factors": [ "...from S2+S3..." ]
  },
  "macro:scenarioSet": {
    "@type": "macro:ScenarioSet",
    "macro:scenarios": [ "...from S4..." ],
    "macro:uncertaintyAxes": [ "...axis1...", "...axis2..." ]
  },
  "macro:vsomImplications": [ "...from S5..." ],
  "macro:futuresFunnel": { "...from S6..." },
  "pfc:version": "1.0.0",
  "pfc:status": "draft",
  "pfc:createdDate": "YYYY-MM-DD"
}
```

**MECE Validation:**
- All 6 PESTEL dimensions represented (MECE by framework design)
- Scenarios cover the 2x2 uncertainty space (MECE by construction)

Write to: `{working_dir}/ve-pipeline-output/02-macro-analysis-{instance}.jsonld`

---

### Section 8: Validation

Run final validation checks:

- [ ] All G1-G4 gates passed
- [ ] JSON-LD is well-formed
- [ ] All 6 PESTEL dimensions have at least 1 factor
- [ ] Critical factors (composite >= 16) have scenario coverage
- [ ] Every scenario has VSOM implications
- [ ] Output file written successfully

Present summary:
```
MACRO ANALYSIS Summary: {orgName} ({instance-code})
  PESTEL Factors:  {count} ({critical} critical, {important} important, {monitor} monitor)
  Scenarios:       {count} constructed
  VSOM Implications: {count} identified
  Highest Risk:    {top-factor-name} (composite {score})
  Output:          {file_path}
```

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| MACRO-ONT v1.0.0 | Primary schema | `macro:` |
| ORG-CONTEXT-ONT v3.1.0 | Upstream context | `orgctx:` |
| VSOM-ONT v3.0.0 | Downstream linkage | `vsom:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| `JP-MAC-001` | `macro:PESTELFactor.informs` → `vsom:Strategy` (consumed by pfc-vsom) |
| `JP-MAC-002` | `macro:Scenario.constrains` → `vsom:Vision` (vision stress-testing) |
| `JP-MAC-003` | `macro:PESTELFactor` → `ind:SWOTFactor` (PESTEL external factors feed SWOT O/T) |
