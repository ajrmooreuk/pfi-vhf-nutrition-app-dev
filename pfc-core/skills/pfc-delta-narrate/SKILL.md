---
name: pfc-delta-narrate
description: Phase 4 (Transform) of the DELTA process. Client-facing narrative generation using VE-SC patterns. 5-section arc (Context, Challenge, Choice, Commitment, Cadence). Traces claims to evidence. Communication pattern selection by audience. The stakeholder brief that secures buy-in.
argument-hint: "[recommendations artifact path]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-DELTA-NARRATE: VE-SC Transformation Narrative

Phase 4 (Transform) of the DELTA process. Generates client-facing narratives that translate analytical findings into compelling, evidence-backed communication. Uses VE-SC ontology patterns (NARRATIVE-ONT, CASCADE-ONT) to ensure every claim traces to evidence and every recommendation has a clear path to action. This is the "lock in and approve" artifact.

## Dtree Classification

`SKILL_STANDALONE` — Medium autonomy (selects communication patterns based on audience), no orchestration, single-concern.

Path: HG-01 PASS (5.5) → HG-03 FAIL (3.2) → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:pfc-delta-narrate`, follow these 8 sections in order.

---

### Section 1: Recommendation Loading

Read the Phase 3 outputs:
- `{working_dir}/delta-output/06-delta-recommendations-{instance}.jsonld` — Strategic recommendations
- `{working_dir}/delta-output/05-delta-levers-{instance}.jsonld` — Prioritised levers
- `{working_dir}/delta-output/04-delta-cga-{instance}.jsonld` — CGA for context

Extract:
- All recommendations with priority, confidence, and evidence chains
- The top-3 levers with their sensitivity analysis
- CGA summary (current state, future state, gap severity)
- VSOM alignment for each recommendation

**Quality Gate G-narr-1 — Recommendations Loaded:**
- [ ] Recommendations parsed with evidence chains intact
- [ ] Lever prioritisation available
- [ ] CGA context accessible

---

### Section 2: Audience Profiling

Identify the target audiences for the narrative. Load stakeholders from the scope artifact:
`{working_dir}/delta-output/01-delta-scope-{instance}.jsonld`

Map each stakeholder to an audience profile:

| Audience | Interest | Communication Need | Depth |
|----------|----------|-------------------|-------|
| Board / C-Suite | Strategic impact, ROI, risk | High-level, number-driven | Executive summary |
| Department Head | Operational impact, resource needs | Tactical, actionable | Department brief |
| Team / Practitioners | What changes for them, how to execute | Detailed, practical | Implementation guide |
| Client (external) | Value received, outcomes expected | Outcome-focused, jargon-free | Client report |
| Investor | Growth potential, competitive moat | Market-focused, metric-driven | Investor update |

For each audience, determine:
- What do they need to know?
- What do they need to approve?
- What do they need to do?
- What metrics matter to them? (mapped to BSC perspective)

**Quality Gate G-narr-2 — Audiences Profiled:**
- [ ] At least one audience identified
- [ ] Each audience has communication needs documented
- [ ] BSC perspective mapping per audience

---

### Section 3: Communication Pattern Selection

Select a VE-SC communication pattern per audience:

| Pattern | When to Use | Structure |
|---------|------------|-----------|
| **30-Second Answer** | Time-pressed executives | Conclusion first, 3 supporting points, ask |
| **Rented Brain** | Advisory/consulting context | Situation, finding, implication, recommendation |
| **Pyramid Principle** | Complex multi-stakeholder | Key message → supporting arguments → data |
| **Situation-Complication-Resolution** | Problem-focused narrative | Context, what's wrong, what to do |
| **OKR Cascade** | Execution-oriented teams | Objective → Key Results → Initiatives → Tasks |
| **Evidence-Based Brief** | Data-heavy audiences | Data → Analysis → Insight → Action |

Pattern selection rules:
- Board → 30-Second Answer or Pyramid Principle
- Client (external) → Rented Brain or SCR
- Team → OKR Cascade or Evidence-Based Brief
- Investor → 30-Second Answer with market data

**Quality Gate G-narr-3 — Patterns Selected:**
- [ ] Each audience has a communication pattern assigned
- [ ] Pattern matches audience communication needs

---

### Section 4: Narrative Arc Construction

For each audience, construct the 5-section narrative arc:

**1. Context** — Where are we now?
- Organisation situation (from ORG-CONTEXT)
- Market position (from SA tools if available)
- Current performance (from CGA current-state scores)

**2. Challenge** — What's the gap?
- Top gaps from CGA with severity
- What happens if we don't act (risk framing from RRR)
- Competitive implications (from INDUSTRY analysis if available)

**3. Choice** — What are the options?
- Top levers from sensitivity analysis
- Prioritisation matrix (Quick Wins vs Strategic Bets vs Long Plays)
- Trade-offs between options

**4. Commitment** — What do we recommend?
- Strategic recommendations with evidence chains
- Resource requirements and timeline
- Expected outcomes (metrics, targets, time horizons)
- Risk mitigation plan

**5. Cadence** — What happens next?
- Implementation phases
- Review checkpoints (maps to Phase 5 Adapt cycle)
- KPI monitoring schedule
- Escalation triggers (maps to BR-DELTA-002 threshold breaches)

**Quality Gate G-narr-4 — Narrative Arc Complete:**
- [ ] All 5 sections populated per audience
- [ ] Context grounded in CGA data (not generic)
- [ ] Recommendations are specific and actionable

---

### Section 5: Evidence Traceability

**JP-DELTA-006 enforcement:** Every factual claim in the narrative MUST trace back to an evidence item.

For each claim in the narrative:
1. Link to `rsn:EvidenceItem` from the evidence artifact
2. Note evidence strength (Strong / Moderate / Weak)
3. Note evidence direction (Supporting the claim)

Build the evidence traceability map:
```markdown
| Narrative Claim | Evidence Ref | Strength | Source |
|-----------------|-------------|----------|--------|
| "Current AI visibility score is 3.2/10" | ev-001 | Strong | Platform audit Feb 2026 |
| "Schema markup increases citation rate by 40%" | ev-003 | Moderate | Industry study 2025 |
```

Flag any claims without evidence — these must be either:
- Removed from the narrative
- Clearly marked as assumptions (with risk noted)
- Supported by additional evidence gathering

**Quality Gate G-narr-5 — Evidence Traced:**
- [ ] Every factual claim has an evidence reference
- [ ] No unsupported claims in the narrative
- [ ] Weak evidence flagged with caveats

---

### Section 6: Cascade Translation

Generate audience-specific versions of the narrative:

**Executive Summary** (Board/C-Suite — 1 page):
- The gap in one sentence
- Top-3 recommendations with expected ROI
- Resource ask and timeline
- Decision required

**Client Report** (External — 3-5 pages):
- Professional formatting with charts/tables
- Outcome-focused language (not internal jargon)
- Clear next steps and engagement model
- Branded per PFI instance if applicable

**Team Brief** (Practitioners — 2-3 pages):
- Specific actions and owners
- OKR cascade from recommendations
- Timeline with milestones
- How success will be measured

**Investor Update** (if applicable — 1 page):
- Market context and competitive positioning
- Growth opportunity from gap closure
- Metrics trajectory

**Quality Gate G-narr-6 — Cascade Complete:**
- [ ] At least 2 audience versions generated
- [ ] Each version matches its communication pattern
- [ ] Client-facing versions free of internal jargon

---

### Section 7: Narrative Output

Write the narrative artifacts:

**JSON-LD output:** `{working_dir}/delta-output/08-delta-narrative-{instance}.md`

The primary narrative in Markdown format with:
- Table of contents
- Executive summary
- Full 5-section narrative arc
- Evidence traceability table
- Audience-specific cascade versions as appendices

**Structured metadata:** embedded in the Markdown as YAML frontmatter:
```yaml
---
type: delta-narrative
instance: {instance}
date: {date}
audiences: [board, client, team]
patterns: [30-second-answer, rented-brain, okr-cascade]
recommendations: {count}
evidenceItems: {count}
traceabilityScore: {percentage of claims with evidence}
---
```

Also write the transformation plan artifact:
`{working_dir}/delta-output/07-delta-plan-{instance}.jsonld`

This maps recommendations to:
- OKR objectives (via pfc-okr patterns)
- KPI targets (via pfc-kpi patterns)
- VP alignment (via pfc-vp patterns)
- PPM initiatives (enterprise+ scope)
- EFS epics/features (for implementation planning)

---

### Section 8: Gate Validation (G4)

**DELTA Gate G4 — Transform Complete:**
- [ ] Narrative arc constructed for all target audiences
- [ ] Communication patterns selected and applied
- [ ] Evidence traceability complete (no unsupported claims)
- [ ] At least 2 audience cascade versions generated
- [ ] Narrative artifact written to delta-output/
- [ ] Transformation plan artifact written with OKR/KPI/VP mapping

G4 is a **blocking gate**. If any condition fails, the DELTA process cannot proceed to Phase 5 (Adapt). This gate also requires **stakeholder approval** — the narrative must be reviewed and accepted before implementation begins.

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| NARRATIVE-ONT v1.0.0 | Narrative structure patterns | `nar:` |
| CASCADE-ONT v1.0.0 | Audience cascade translation | `cas:` |
| REASON-ONT v1.0.0 | Evidence traceability | `rsn:` |
| VSOM-ONT v3.0.0 | Strategic alignment | `vsom:` |
| OKR-ONT v2.0.0 | Objective cascade | `okr:` |
| KPI-ONT v1.0.0 | Metric targets | `kpi:` |
| VP-ONT v4.0.0 | Value alignment | `vp:` |
| RRR-ONT v4.0.0 | Risk framing, role ownership | `rrr:` |
| BSC-ONT v1.0.0 | Perspective-based audience mapping | `bsc:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| JP-DELTA-006 | Narrative claim → rsn:EvidenceItem (every claim traced) |
| JP-DELTA-007 | Recommendation → okr:Objective → kpi:KPI (transformation plan) |
