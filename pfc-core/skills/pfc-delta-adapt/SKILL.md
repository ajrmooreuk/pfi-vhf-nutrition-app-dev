---
name: pfc-delta-adapt
description: Phase 5 (Adapt) of the DELTA process. Variance analysis against gap-closure baseline, threshold breach detection, hypothesis outcome review, lesson capture, and cycle determination (None/Adjust/Pivot/Revise). Closes the feedback loop.
argument-hint: "[plan artifact path] [--cycle-number N]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-DELTA-ADAPT: Variance Analysis & Cycle Adaptation

Phase 5 (Adapt) of the DELTA process. Closes the feedback loop. Monitors KPIs against gap-closure baseline, performs variance analysis, detects threshold breaches, determines cycle output, and prepares next-cycle inputs. For SaaS product: maps to [Service-fit] > [Benefits-realised] > [Adoption Secured] > [Retention/Upsell] lifecycle.

## Dtree Classification

`SKILL_STANDALONE` — Medium autonomy (interprets variance data, determines cycle output), no orchestration, single-concern.

Path: HG-01 PASS (5.5) → HG-03 FAIL (3.2) → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:pfc-delta-adapt`, follow these 8 sections in order.

---

### Section 1: Baseline & Current KPI Loading

Read the Phase 4 transformation plan: `{working_dir}/delta-output/07-delta-plan-{instance}.jsonld`

Extract the baseline metrics established at Phase 4 approval:
- KPI targets per recommendation
- Timeline milestones
- Leading and lagging indicators
- Threshold definitions (warning and critical levels)

Load current KPI values:
- From client-provided data (analytics, reports, dashboards)
- From previous adaptation cycle outputs (if cycle > 1)
- From automated monitoring feeds (if available)

Also load:
- Original CGA: `{working_dir}/delta-output/04-delta-cga-{instance}.jsonld`
- Recommendations: `{working_dir}/delta-output/06-delta-recommendations-{instance}.jsonld`
- Previous adaptation (if cycle > 1): `{working_dir}/delta-output/09-delta-adaptation-{instance}-cycle-{n-1}.jsonld`

**Quality Gate G-adapt-1 — Data Loaded:**
- [ ] Baseline KPIs from transformation plan extracted
- [ ] Current KPI values loaded
- [ ] Previous cycle data loaded (if applicable)

---

### Section 2: Variance Analysis

For each KPI, calculate variance:

```json
{
  "kpiId": "kpi-{n}",
  "kpiName": "AI Visibility Score",
  "baseline": 3.2,
  "target": 7.5,
  "current": 4.8,
  "variance": {
    "absoluteVariance": 1.6,
    "plannedProgress": "37.2%",
    "actualProgress": "37.2%",
    "progressVariance": "0.0%",
    "onTrack": true
  },
  "trend": "Improving",
  "trendPeriods": 3,
  "trendConfidence": "medium"
}
```

Trend assessment:
- **Improving** — Consecutive positive movement for >= 2 periods
- **Stable** — Within +/- 5% of baseline for >= 2 periods
- **Declining** — Consecutive negative movement for >= 2 periods
- **Volatile** — Alternating positive/negative, no clear direction

**Quality Gate G-adapt-2 — Variance Calculated:**
- [ ] Every KPI has variance calculated
- [ ] Trends assessed with period count
- [ ] Progress against plan quantified

---

### Section 3: Threshold Breach Detection

Check each KPI against defined thresholds:

| Level | Condition | Action |
|-------|-----------|--------|
| **On Track** | Progress within +/- 10% of plan | Continue monitoring |
| **Warning** | Progress 10-25% behind plan, or trend = Declining for 1 period | Flag for review |
| **Critical** | Progress >25% behind plan, or trend = Declining for 2+ periods | Trigger MetricBreach |

**BR-DELTA-002 enforcement:**
If a **Critical** threshold breach is detected:
- Generate a `MetricBreach` alert
- The breach MUST trigger a review cycle
- Re-enter Phase 2 (Evaluate) with updated evidence
- The CGA must be updated with current data showing the breach

For each breach:
```json
{
  "breachId": "breach-{n}",
  "kpiRef": "kpi-{n}",
  "breachLevel": "critical|warning",
  "breachDetails": "Progress 32% behind plan, declining trend for 3 periods",
  "recommendedAction": "Re-enter Phase 2 with updated evidence",
  "affectedRecommendations": ["rec-001", "rec-003"]
}
```

**Quality Gate G-adapt-3 — Thresholds Checked:**
- [ ] All KPIs checked against thresholds
- [ ] Warning breaches flagged
- [ ] Critical breaches trigger MetricBreach (BR-DELTA-002)

---

### Section 4: Leading Factor Assessment

Separate leading indicators from lagging outcomes:

**Leading indicators** (predictive, act now):
- Input metrics (effort applied, resources deployed)
- Activity metrics (content published, outreach completed)
- Early signal metrics (engagement rates, pipeline velocity)

**Lagging indicators** (outcome, confirm later):
- Revenue impact
- Market share movement
- Customer satisfaction scores
- Brand awareness shifts

For each leading indicator:
- Is the leading indicator moving before the lagging outcome?
- If leading indicators are positive but lagging are flat → be patient, effects are delayed
- If leading indicators are flat but lagging are declining → the lever isn't working, consider pivot

**Quality Gate G-adapt-4 — Factors Assessed:**
- [ ] Leading vs lagging indicators separated
- [ ] Leading indicator health assessed
- [ ] Predictive signals documented

---

### Section 5: Hypothesis Outcome Review

For each `rsn:StrategicHypothesis` from Phase 3:
- **Validated** — Evidence confirms the hypothesis was correct; the lever is working
- **Invalidated** — Evidence contradicts the hypothesis; the lever is not working
- **Pivoted** — Original hypothesis failed but reframed version is showing promise
- **Inconclusive** — Insufficient data or time to determine (needs more cycles)

For validated hypotheses:
- Document what worked and why
- Identify if the effect is stronger/weaker than predicted
- Update confidence levels

For invalidated hypotheses:
- Document why it failed
- Identify what was wrong (assumption failure, execution failure, external change)
- Recommend whether to retry, pivot, or abandon

**Quality Gate G-adapt-5 — Hypotheses Reviewed:**
- [ ] Each hypothesis has an outcome assessment
- [ ] Invalidated hypotheses have failure analysis
- [ ] Updated confidence levels recorded

---

### Section 6: Lesson Capture

Structured lesson capture across three categories:

**What worked:**
- Which levers moved the gap metrics?
- Which communication patterns drove stakeholder buy-in?
- Which execution approaches were most effective?

**What didn't work:**
- Which levers underperformed?
- Where were assumptions wrong?
- What unexpected obstacles emerged?

**What was surprising:**
- Unexpected positive outcomes
- Unexpected dependencies discovered
- External factors that changed the landscape

Each lesson:
```json
{
  "lessonId": "lesson-{n}",
  "category": "worked|didnt-work|surprising",
  "description": "Schema markup implementation drove 40% citation increase in 6 weeks",
  "affectedRecommendations": ["rec-001"],
  "applicableTo": "Future DELTA cycles, other PFI instances",
  "confidenceLevel": "high"
}
```

**Quality Gate G-adapt-6 — Lessons Captured:**
- [ ] At least one lesson per category
- [ ] Each lesson linked to recommendations/hypotheses
- [ ] Cross-applicability assessed

---

### Section 7: Cycle Determination

Determine the DELTA cycle output based on the overall adaptation assessment:

| Cycle Output | Condition | Next Action |
|-------------|-----------|-------------|
| **None** | All KPIs on track, hypotheses validated, no breaches | Complete — move to monitoring/retention |
| **Minor-Adjustment** | Some KPIs slightly off track, minor course corrections needed | Adjust lever intensity, update timelines |
| **Major-Pivot** | Key hypotheses invalidated, significant underperformance | Re-enter Phase 2 (Evaluate) with lessons, reframe gaps |
| **Full-Revision** | Fundamental assumptions wrong, landscape has changed | Re-enter Phase 1 (Discover) with new context |

Decision rules:
- `None` → All trends Improving or Stable AND no Critical breaches AND >80% of KPIs on track
- `Minor-Adjustment` → Some warnings but no critical breaches AND leading indicators positive
- `Major-Pivot` → Critical breach OR >50% of hypotheses invalidated OR multiple declining trends
- `Full-Revision` → External landscape change OR engagement trigger fundamentally altered

**SaaS Lifecycle Mapping:**

| Cycle Output | SaaS Stage | Client Action |
|-------------|-----------|---------------|
| None (complete) | Retention/Upsell | Renew engagement, expand scope to next DELTA cycle at higher scale |
| Minor-Adjustment | Benefits-realised | Continue current engagement, adjust tactics |
| Major-Pivot | Service-fit | Re-evaluate engagement scope, may need new discovery template |
| Full-Revision | Pre-Service-fit | Fundamental re-engagement, new discovery cycle |

**Quality Gate G-adapt-7 — Cycle Determined:**
- [ ] Cycle output determined with rationale
- [ ] SaaS lifecycle stage mapped
- [ ] Next-cycle inputs prepared (if not None)

---

### Section 8: Gate Validation (G5) & Artifact Output

Write the adaptation artifact:
`{working_dir}/delta-output/09-delta-adaptation-{instance}.jsonld`

```json
{
  "@context": {
    "delta": "https://pf-core.dev/delta/v1/",
    "vsom": "https://oaa-ontology.org/v6/vsom/",
    "kpi": "https://oaa-ontology.org/v6/kpi/"
  },
  "@type": "delta:AdaptationAssessment",
  "@id": "delta:adaptation-{instance}-cycle-{n}",
  "cycleNumber": 1,
  "planRef": "delta:plan-{instance}",
  "cgaRef": "delta:cga-{instance}",
  "varianceAnalysis": [],
  "thresholdBreaches": [],
  "leadingFactorAssessment": {},
  "hypothesisOutcomes": [],
  "lessons": [],
  "cycleOutput": "None|Minor-Adjustment|Major-Pivot|Full-Revision",
  "cycleRationale": "",
  "saasLifecycleStage": "",
  "nextCycleInputs": null,
  "assessedAt": "{timestamp}"
}
```

Also generate the traceability summary:
`{working_dir}/delta-output/10-delta-summary.md`

**Traceability Matrix (Golden Thread):**
```markdown
| Evidence | Gap | Lever | Hypothesis | Recommendation | KPI | Variance | Outcome |
|----------|-----|-------|-----------|----------------|-----|----------|---------|
| ev-001 | gap-001 | lever-001 | hyp-001 | rec-001 | kpi-001 | +37.2% | Validated |
```

**DELTA Gate G5 — Adaptation Complete:**
- [ ] Variance analysis complete for all KPIs
- [ ] Threshold breaches detected and actioned (BR-DELTA-002)
- [ ] Leading vs lagging indicators assessed
- [ ] Hypothesis outcomes reviewed
- [ ] Lessons captured
- [ ] Cycle output determined
- [ ] Next-cycle inputs prepared (if applicable)
- [ ] Traceability matrix complete (golden thread)
- [ ] Adaptation artifact written to delta-output/

G5 is a **blocking gate**. If cycle output is `Major-Pivot` or `Full-Revision`, the process loops back to Phase 2 or Phase 1 respectively.

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| VSOM-ONT v3.0.0 | Strategic review cycle | `vsom:` |
| KPI-ONT v1.0.0 | Metric monitoring | `kpi:` |
| REASON-ONT v1.0.0 | Hypothesis outcomes | `rsn:` |
| RRR-ONT v4.0.0 | Risk framing for breaches | `rrr:` |
| BSC-ONT v1.0.0 | Perspective-based variance grouping | `bsc:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| JP-DELTA-008 | Adaptation.cycleOutput → determines re-entry point (Phase 1 or Phase 2) |
| JP-DELTA-009 | Adaptation.lessons → feed next DELTA cycle and cross-PFI learning |
