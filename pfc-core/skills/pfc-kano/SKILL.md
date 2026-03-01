---
name: pfc-kano
description: Applies Kano satisfaction analysis to VP features/benefits, classifying by 5 categories (Must-Be/Performance/Attractive/Indifferent/Reverse) with decay tracking and PMF signal enrichment. Follows KANO-ONT v1.0.0.
argument-hint: "[VP output file, or PFI instance name]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-KANO: Kano Feature Classification

Apply Kano satisfaction analysis to Value Proposition features/benefits, producing category classifications, non-linear satisfaction curves, decay projections, and investment priority rankings. This is a **parallel analytical lens** enriching the VP→PMF bridge — same pattern as L6S in PE-Series.

## Dtree Classification

`SKILL_STANDALONE` — Moderate autonomy (analytical reasoning for survey interpretation within structured Kano framework), no orchestration, single-concern.

Path: HG-01 PARTIAL (4.2) → HG-03 FAIL (2.8) → HG-04 PARTIAL → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:pfc-kano`, follow these 8 sections in order. This skill has 8 quality gates.

---

### Section 1: Context Loading

Load all available upstream context:

1. **VP instance data (mandatory):** Load `07-vp-{instance}-{icp}.jsonld` or `vp-{instance}-instance-*.jsonld`
   - Extract: `vp:Benefit[]`, `vp:Solution`, `vp:IdealCustomerProfile[]`, `vp:Gain[]`, `vp:CompetitiveAlternative[]`
2. **PMF instance data (recommended):** Load `08-pmf-{instance}.jsonld` or `pmf-{instance}-instance-*.json`
   - Extract: `pmf:ProductMarketFit`, `pmf:CustomerSegmentFit[]`, `pmf:PMFIteration[]`
3. **Prior Kano data (if exists):** Load `kano-{instance}-instance-*.json`
   - Extract: prior `kano:KanoClassification[]` for decay comparison
4. **ORG-CONTEXT (recommended):** Load `01-org-context-{instance}.jsonld`
   - Extract: competitive landscape for decay pressure assessment

Present context summary:
```
KANO Context for {orgName} ({instance-code})

VP Foundation:
  Benefits:    {count} ({benefit-names})
  Solution:    {solutionName} ({deliveryMethod})
  ICPs:        {count} ({icp-names})
  Competitors: {count} ({competitor-names})

PMF Status:
  fitScore:    {score} | fitStatus: {status}
  Segments:    {count} with fit data
  Iterations:  {count} completed

Prior Kano Data:
  {count} features previously classified | Last survey: {date}
```

**Quality Gate G1 — Context Loaded:**
- [ ] VP instance data loaded with at least 1 Benefit
- [ ] At least 1 ICP identified as survey target
- [ ] Context summary confirmed by user

---

### Section 2: Feature Inventory

Build the feature inventory to classify. Extract from VP data:

| # | Feature | Source Entity | VP gainType | Initial Hypothesis |
|---|---------|--------------|-------------|-------------------|
| 1 | {benefit description} | vp:Benefit | {Required/Expected/Desired/Unexpected} | {Must-Be/Performance/Attractive/Indifferent} |

**gainType → Kano initial hypothesis mapping** (hypothesis only — survey data overrides):
- Required → likely Must-Be
- Expected → likely Performance
- Desired → could be Performance or Attractive
- Unexpected → likely Attractive

Include `vp:Solution.coreFunctionality` items not already covered by Benefits.

**Quality Gate G2 — Feature Inventory:**
- [ ] All VP Benefits listed
- [ ] Initial hypothesis assigned per feature
- [ ] No duplicate features

---

### Section 3: Survey Design

For each feature, generate functional/dysfunctional question pairs:

| Feature | Functional Question | Dysfunctional Question |
|---------|-------------------|----------------------|
| {name} | "If {feature} were available, how would you feel?" | "If {feature} were NOT available, how would you feel?" |

Response scale (5-point Kano standard):
1. I like it
2. I expect it
3. I am neutral
4. I can tolerate it
5. I dislike it

Create `kano:KanoSurvey` entity:
```json
{
  "@type": "kano:KanoSurvey",
  "surveyId": "kano:survey-{instance}-{seq}",
  "targetICP": "vp:icp-{instance}-{seq}",
  "surveyDate": "{ISO date}",
  "sampleSize": {n},
  "confidenceLevel": {0.0-1.0},
  "status": "planned|active|completed",
  "questions": [...]
}
```

**Quality Gate G3 — Survey Designed:**
- [ ] Every feature has a functional/dysfunctional question pair
- [ ] Questions are segment-specific where ICP variation expected
- [ ] KanoSurvey entity created with targetICP reference

---

### Section 4: Classification

Apply the Kano evaluation matrix to classify each feature.

**Cross-reference functional × dysfunctional responses:**

|  | **Dys: Like** | **Dys: Expect** | **Dys: Neutral** | **Dys: Tolerate** | **Dys: Dislike** |
|---|---|---|---|---|---|
| **Func: Like** | Q | A | A | A | O |
| **Func: Expect** | R | I | I | I | M |
| **Func: Neutral** | R | I | I | I | M |
| **Func: Tolerate** | R | I | I | I | M |
| **Func: Dislike** | R | R | R | R | Q |

M = Must-Be, O = One-dimensional (Performance), A = Attractive, I = Indifferent, R = Reverse, Q = Questionable

**When survey data is unavailable:** Synthesise classification from:
- VP ValidationEvidence (evidenceStrength)
- PMF retention/churn correlation per feature
- Competitive landscape (if all competitors have it → likely Must-Be)
- Customer interview notes (from VP problem discovery)

Mark synthesised classifications with `evidenceStrength: "Weak"` and `confidence: 0.5`.

Create `kano:KanoClassification` per feature:
```json
{
  "@type": "kano:KanoClassification",
  "classificationId": "kano:class-{instance}-{seq}",
  "featureRef": "vp:ben-{instance}-{seq}",
  "category": "MustBe|Performance|Attractive|Indifferent|Reverse",
  "confidence": {0.0-1.0},
  "sampleSize": {n},
  "classificationDate": "{ISO date}",
  "surveyRef": "kano:survey-{instance}-{seq}",
  "segmentRef": "pmf:segment-{instance}-{seq}",
  "evidenceStrength": "Strong|Moderate|Weak"
}
```

**Quality Gate G4 — Classification Complete:**
- [ ] Every feature classified with a Kano category
- [ ] Confidence ≥0.6 for production use (BR-KANO-003)
- [ ] No Questionable (Q) classifications remaining — re-examine if found
- [ ] Segment-specific classifications created where variation detected

---

### Section 5: Satisfaction Curve Modelling

For each Kano category present, define the satisfaction curve:

| Category | Curve Function | Behaviour |
|----------|---------------|-----------|
| Must-Be | asymptotic | Diminishing returns — 0→80% implementation gives 80% of satisfaction benefit |
| Performance | linear | Proportional — each % implementation yields proportional satisfaction |
| Attractive | exponential | Accelerating — satisfaction grows faster than implementation |
| Indifferent | flat | No change regardless of implementation level |
| Reverse | inverse | Satisfaction decreases as implementation increases |

Create `kano:SatisfactionCurve` per category:
```json
{
  "@type": "kano:SatisfactionCurve",
  "curveId": "kano:curve-{instance}-{category}",
  "categoryType": "MustBe|Performance|Attractive|Indifferent|Reverse",
  "curveFunction": "asymptotic|linear|exponential|flat|inverse",
  "customerSegment": "vp:icp-{instance}-{seq}",
  "implementationLevel": {0-100},
  "satisfactionLevel": {0-100}
}
```

**Quality Gate G5 — Curves Defined:**
- [ ] Satisfaction curve assigned per category present in classifications
- [ ] Curve function matches category type (BR-KANO-005)

---

### Section 6: Decay Assessment

Compare current classifications against prior data (if available). If no prior data, project decay based on competitive landscape.

**Decay detection logic:**
```
For each feature with prior + current classification:
  IF prior.category ≠ current.category:
    CREATE kano:KanoDecay
  ELSE IF competitivePressure = "High" AND category = "Attractive":
    CREATE projected kano:KanoDecay with recommendedAction = "monitor"
```

**Decay velocity factors:**
- Competitive pressure (High/Medium/Low)
- Market maturity (early/growth/mature/declining)
- Technology commoditisation (open-source, API availability)
- Customer education level (higher = faster expectations rise)

Create `kano:KanoDecay` per detected/projected migration:
```json
{
  "@type": "kano:KanoDecay",
  "decayId": "kano:decay-{instance}-{seq}",
  "featureRef": "vp:ben-{instance}-{seq}",
  "fromCategory": "Attractive",
  "toCategory": "Performance",
  "decayPeriodMonths": 12,
  "detectionDate": "{ISO date}",
  "evidence": "{description}",
  "competitivePressure": "High|Medium|Low",
  "recommendedAction": "innovate|accelerate|accept|monitor"
}
```

If decay triggers strategic concern, create PMF pivot trigger:
```json
{
  "@type": "pmf:PivotAssessment",
  "trigger": "kano-decay-threshold",
  "urgency": "high|medium|low",
  "recommendation": "{action description}",
  "kanoDecayRef": "kano:decay-{instance}-{seq}"
}
```

**Quality Gate G6 — Decay Assessed:**
- [ ] Prior classifications compared (if available)
- [ ] Decay events flagged with evidence (BR-KANO-004: fromCategory ≠ toCategory)
- [ ] Competitive pressure assessed for all Attractive features
- [ ] PMF pivot triggers created for high-urgency decay events

---

### Section 7: Priority Synthesis

Aggregate classifications into investment recommendations:

| Category | Default Recommendation | WTP Elasticity | Budget Allocation |
|----------|----------------------|----------------|-------------------|
| Must-Be | maintain | Low (inelastic) | 10-20% — ensure parity |
| Performance | invest | Medium-High | 25-35% — outperform competitors |
| Attractive | sprint | High (elastic) | 30-40% — first-mover advantage |
| Indifferent | deprioritise | None | 0-5% — redirect budget |
| Reverse | eliminate | Negative | 0% — remove or segment-gate |

Create `kano:FeaturePriority` per feature:
```json
{
  "@type": "kano:FeaturePriority",
  "priorityId": "kano:priority-{instance}-{seq}",
  "featureRef": "vp:ben-{instance}-{seq}",
  "priorityRank": {1-N},
  "investmentRecommendation": "invest|maintain|deprioritise|eliminate",
  "kanoEvidence": ["kano:class-{instance}-{seq}"],
  "wtpElasticity": {0.0-2.0},
  "segmentVariation": true|false,
  "strategicAction": "{description}"
}
```

Generate segment heatmap if multiple ICPs:

| Feature | Segment A | Segment B | Segment C | Dominant |
|---------|-----------|-----------|-----------|----------|
| {name} | {category} | {category} | {category} | {most common} |

**Quality Gate G7 — Priority Synthesised:**
- [ ] Priority ranking covers all features
- [ ] Investment recommendation aligns with category (BR-KANO-005)
- [ ] WTP elasticity estimated per feature
- [ ] Segment variation flagged where detected

---

### Section 8: Output Assembly

Assemble the complete Kano JSON-LD:

```json
{
  "@context": {
    "kano": "https://oaa-ontology.org/v7/kano/",
    "vp": "https://oaa-ontology.org/v6/value-proposition/",
    "pmf": "https://oaa-ontology.org/v6/pmf/",
    "kpi": "https://oaa-ontology.org/v6/kpi/",
    "pfc": "https://platformcore.io/ontology/"
  },
  "@type": "kano:KanoAnalysisInstance",
  "@id": "kano:instance-{instance}",
  "kano:surveys": [ "...from S3..." ],
  "kano:classifications": [ "...from S4..." ],
  "kano:satisfactionCurves": [ "...from S5..." ],
  "kano:decayEvents": [ "...from S6..." ],
  "kano:featurePriorities": [ "...from S7..." ],
  "kano:segmentHeatmap": { "...from S7..." },
  "kano:pmfSignals": [ "...PMF validation signals..." ],
  "pfc:version": "1.0.0",
  "pfc:status": "draft",
  "pfc:createdDate": "YYYY-MM-DD"
}
```

Write to: `{working_dir}/ve-pipeline-output/09-kano-{instance}.jsonld`

Also write to ontology library if confirmed:
`VE-Series/VSOM-SA/KANO-ONT/instance-data/kano-{instance}-instance-v1.0.0.json`

**Quality Gate G8 — Output Valid:**
- [ ] All G1-G7 gates passed
- [ ] JSON-LD well-formed
- [ ] All BR-KANO rules checked (BR-KANO-001 through BR-KANO-007)
- [ ] Output file written successfully
- [ ] VP→KANO join patterns valid (JP-KANO-VP-001)
- [ ] KANO→PMF join patterns valid (JP-KANO-PMF-001, JP-KANO-PMF-002)

Present summary:
```
KANO ANALYSIS Summary: {orgName} ({instance-code})
  Features Classified: {count}
    Must-Be:      {count} ({feature-names})
    Performance:  {count} ({feature-names})
    Attractive:   {count} ({feature-names})
    Indifferent:  {count} ({feature-names})
    Reverse:      {count} ({feature-names})
  Decay Events:   {count} ({from→to transitions})
  Decay Alerts:   {count} high-urgency
  PMF Signals:    {count} generated
  Segments:       {count} with variation detected
  Confidence:     avg {score} across classifications
  Priority #1:    {feature} — {recommendation}
  Output:         {file-path}
```

---

## Cross-Ontology Integration

### Upstream (Input)
- **VP-ONT v1.2.3** — Benefits, Solutions, ICPs, Gains, CompetitiveAlternatives
- **PMF-ONT v2.0.0** — CustomerSegmentFit, PMFIteration, PivotAssessment
- **REASON-ONT v1.0.0** — MECETree.assignedFramework = "Kano" (reasoning bridge)

### Downstream (Output)
- **PMF-ONT** — ValidationSignal (enriched), PivotAssessment (decay-triggered)
- **KPI-ONT** — SatisfactionCurve → KPI measurement binding
- **EMC-ONT** — Activates under PRODUCT/COMPETITIVE/STRATEGIC categories

### Skill Chain Position
```
pfc-org-context → pfc-vsom → pfc-okr → pfc-kpi → pfc-vp → pfc-kano → pfc-efs
                                                     ↑                    ↑
                                              consumes VP output    feeds PMF signals
```

This skill is a **parallel lens** — the VE chain operates without it. Kano enriches VP→PMF precision but does not interrupt the chain.
