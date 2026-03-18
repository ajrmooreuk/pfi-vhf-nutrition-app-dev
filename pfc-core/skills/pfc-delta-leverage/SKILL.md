---
name: pfc-delta-leverage
description: Phase 3 (Leverage) of the DELTA process. Sensitivity analysis on logic tree nodes to identify top-N levers, hypothesis formation and testing, impact-effort prioritisation, and strategic recommendation synthesis.
argument-hint: "[CGA artifact path]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-DELTA-LEVERAGE: Lever Analysis & Recommendations

Phase 3 (Leverage) of the DELTA process. Takes CGA gaps and their MECE decompositions, builds quantitative driver models (logic trees), identifies the highest-sensitivity levers, tests hypotheses with evidence, and synthesises strategic recommendations. The logic tree provides plan options.

## Dtree Classification

`SKILL_STANDALONE` — Medium autonomy (interprets CGA output, determines analytical depth), no orchestration, single-concern.

Path: HG-01 PASS (6.0) → HG-03 FAIL (3.5) → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:pfc-delta-leverage`, follow these 8 sections in order.

---

### Section 1: CGA Gap Loading

Read the Phase 2 CGA artifact: `{working_dir}/delta-output/04-delta-cga-{instance}.jsonld`

Extract:
- **Top-3 gaps** (priority-ranked from CGA)
- **MECE decompositions** for significant+ gaps
- **Gap clusters** and their shared root causes
- **Evidence items** from the evidence artifact
- **VSOM alignment** per gap

For each top-3 gap, load its full context:
- Current-state score and metrics
- Future-state target and rationale
- Gap severity and relative gap percentage
- MECE tree branches (from pfc-reason Mode 1 output)

**Quality Gate G-lev-1 — Gaps Loaded:**
- [ ] Top-3 gaps extracted with full context
- [ ] MECE decompositions available for significant+ gaps
- [ ] Evidence base accessible

---

### Section 2: Logic Tree Construction

For each top-3 gap, invoke `pfc-reason` in `logic-tree` mode:

Build a quantitative driver model that decomposes the gap metric:
- Root node = the gap metric (current value → target value)
- Internal nodes = drivers with mathematical operators (Add/Subtract/Multiply/Divide)
- Leaf nodes = actionable levers

Example (AI Visibility gap):
```
AI Visibility Score [Add]
├── LLM Citation Rate [Multiply]
│   ├── Content Authority Score [leaf] ← schema markup, E-E-A-T
│   ├── Brand Mention Frequency [leaf] ← PR, social proof
│   └── Source Indexing Coverage [leaf] ← technical SEO for AI crawlers
├── Direct AI Search Presence [Add]
│   ├── ChatGPT Mentions [leaf] ← brand seeding
│   ├── Perplexity Citations [leaf] ← structured data
│   └── Gemini/Claude References [leaf] ← cross-platform authority
└── Competitive Delta [Subtract]
    ├── Own Score [leaf]
    └── Competitor Average [leaf]
```

**Quality Gate G-lev-2 — Logic Trees Built:**
- [ ] Each top-3 gap has a logic tree
- [ ] All non-leaf nodes have operators (BR-RSN-009)
- [ ] Leaf nodes are actionable levers

---

### Section 3: Sensitivity Analysis

For each logic tree, invoke `pfc-reason` in `logic-tree` mode (sensitivity step):

- Calculate the impact on the root metric if each leaf changes by 10%
- Rank all leaves by impact magnitude
- Identify the **top-3 levers** per gap (top-9 across all gaps)

Output per lever:
```json
{
  "leverId": "lever-{n}",
  "leverName": "Content Authority Score",
  "parentGap": "AI Visibility Score",
  "sensitivityRank": 1,
  "impactEstimate": "+2.3 points on root metric per 10% improvement",
  "currentValue": 3.1,
  "targetValue": 7.0,
  "effort": "medium",
  "timeToImpact": "3-6 months"
}
```

Cross-gap analysis:
- Identify levers that appear in multiple gap trees (high-value multipliers)
- Identify conflicting levers (improving one worsens another)
- Flag cross-dependencies

**Quality Gate G-lev-3 — Levers Identified:**
- [ ] Top-3 levers per gap identified with sensitivity ranks
- [ ] Cross-gap multipliers flagged
- [ ] Conflicts and dependencies documented

---

### Section 4: Hypothesis Formation

For each top lever, invoke `pfc-reason` in `hypothesis` mode:

Form a testable hypothesis:
- "If we improve {lever} from {current} to {target}, then {gap metric} will improve by {estimated impact}"
- Identify MustBeTrue assumptions (BR-RSN-004)
- Identify Important and NiceToHave assumptions

Example:
```
Hypothesis: "If we implement structured data markup (schema.org) across all product pages,
             then LLM Citation Rate will increase from 2% to 8% within 3 months"

Assumptions:
  [MustBeTrue] LLM platforms index schema.org markup when generating responses
  [MustBeTrue] Our content is factually accurate and E-E-A-T compliant
  [Important]  Competitors are not already saturating schema markup
  [NiceToHave] Google AI Overviews will increase in market share
```

**Quality Gate G-lev-4 — Hypotheses Formed:**
- [ ] Each top lever has a testable hypothesis
- [ ] Each hypothesis has at least one MustBeTrue assumption (BR-RSN-004)
- [ ] Assumptions are prioritised by criticality

---

### Section 5: Assumption Testing

Invoke `pfc-reason` in `hypothesis` mode (testing step):

Test MustBeTrue assumptions FIRST (BR-RSN-005):
1. Gather evidence for each MustBeTrue assumption
2. Actively seek contradicting evidence (BR-RSN-008 — anti-confirmation-bias)
3. Classify evidence direction: Supporting / Contradicting / Neutral
4. Determine assumption status: Validated / Invalidated / Uncertain

**BR-DELTA-001 enforcement:**
If any MustBeTrue assumption is **Invalidated**:
- The parent hypothesis MUST be Invalidated or Pivoted (BR-RSN-006)
- If invalidated → the gap framing may be wrong
- **Loop back to Phase 2 (Evaluate)** to reframe the gap with updated evidence
- Do NOT proceed to recommendations on false premises

If all MustBeTrue assumptions hold, proceed.

**Quality Gate G-lev-5 — Assumptions Tested:**
- [ ] All MustBeTrue assumptions tested with evidence
- [ ] Contradicting evidence sought (not just confirmation)
- [ ] No invalidated MustBeTrue assumptions remaining (or loop triggered)

---

### Section 6: Impact-Effort Prioritisation

For each validated lever + hypothesis:

Score on three dimensions:
- **Impact**: How much does this lever move the gap metric? (1-10)
- **Effort**: How much resource/time/cost does this require? (1-10, where 10 = least effort)
- **Time-to-Impact**: How quickly will results appear? (1-10, where 10 = fastest)

Calculate composite priority: `(Impact × 0.5) + (Effort × 0.3) + (TimeToImpact × 0.2)`

Build the prioritisation matrix:
```markdown
| Lever | Impact | Effort | Time | Composite | Quadrant |
|-------|--------|--------|------|-----------|----------|
| Schema markup | 8 | 7 | 6 | 7.3 | Quick Win |
| Brand seeding | 7 | 4 | 3 | 5.3 | Strategic Bet |
| Content authority | 9 | 3 | 2 | 5.9 | Long Play |
```

Quadrant assignment:
- **Quick Win**: High impact, low effort, fast
- **Strategic Bet**: High impact, high effort, slow
- **Long Play**: High impact, medium effort, slow
- **Deprioritise**: Low impact regardless of effort

**Quality Gate G-lev-6 — Levers Prioritised:**
- [ ] All levers scored on 3 dimensions
- [ ] Composite priority calculated
- [ ] Quadrant assignment complete

---

### Section 7: Recommendation Synthesis

Invoke `pfc-reason` in `synthesis` mode:

For each prioritised lever, synthesise a strategic recommendation:
```json
{
  "recommendationId": "rec-{n}",
  "recommendationStatement": "Implement structured schema markup across all product/service pages",
  "targetVSOMLayer": "Objectives",
  "targetVSOMComponent": "vsom:ObjectivesComponent-AI-Visibility",
  "priority": "High",
  "confidence": 0.82,
  "evidenceChainRefs": ["ev-001", "ev-003", "ev-007"],
  "leverRef": "lever-001",
  "hypothesisRef": "hyp-001",
  "gapRef": "gap-001",
  "adoptionStatus": "Proposed",
  "estimatedImpact": "+2.3 points on AI Visibility Score",
  "estimatedEffort": "2 sprints, 1 developer",
  "recommendedOwner": "rrr:ProcessOwner (Marketing Operations)"
}
```

**BR-RSN-014 enforcement:** Critical/High recommendations MUST have evidenceChainRefs — no unsupported recommendations.

Write lever and recommendation artifacts:
- `{working_dir}/delta-output/05-delta-levers-{instance}.jsonld`
- `{working_dir}/delta-output/06-delta-recommendations-{instance}.jsonld`

---

### Section 8: Gate Validation (G3)

**DELTA Gate G3 — Leverage Complete:**
- [ ] Top-3 levers per gap identified with sensitivity analysis
- [ ] All hypotheses tested — no invalidated MustBeTrue remaining
- [ ] If MustBeTrue invalidated → loop back to Phase 2 triggered (BR-DELTA-001)
- [ ] Impact-effort prioritisation complete
- [ ] Strategic recommendations synthesised with evidence chains
- [ ] Lever and recommendation artifacts written to delta-output/

G3 is a **blocking gate**. If any condition fails, the DELTA process cannot proceed to Phase 4 (Transform). Report failures and request user input to resolve.

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| REASON-ONT v1.0.0 | Logic trees, hypotheses, synthesis | `rsn:` |
| VSOM-ONT v3.0.0 | Strategy/objective targets | `vsom:` |
| KPI-ONT v1.0.0 | Metric linkage for sensitivity | `kpi:` |
| RRR-ONT v4.0.0 | Recommendation ownership | `rrr:` |
| PPM-ONT v4.0.0 | Initiative funding | `ppm:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| JP-RSN-003 | LogicTree → Sensitivity → Top Levers → Strategic Objectives |
| JP-RSN-002 | Hypothesis → Assumptions → Evidence → Validate/Invalidate |
| JP-RSN-004 | Synthesis → Recommendations → VSOM Operationalisation |
| JP-DELTA-006 | Recommendation.evidenceChainRefs → rsn:EvidenceItem (golden thread) |
