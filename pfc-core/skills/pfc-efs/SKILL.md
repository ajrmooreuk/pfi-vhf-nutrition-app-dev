---
name: pfc-efs
description: Generates PRDs with Epic-Feature-Story hierarchies from Terms of Reference and VSOM context, outputting GH-compatible issue creation scripts. Follows EFS-ONT v2.0.0 lineage specification.
argument-hint: "[ToR file or VSOM context]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-EFS: Epic-Feature-Story Generator

Generate a complete PRD with Agile Epic-Feature-Story hierarchy from a Terms of Reference (ToR), VSOM context, or Value Proposition brief. Outputs GitHub-ready issue creation scripts.

## Dtree Classification

`SKILL_STANDALONE` — Low autonomy (structured template workflow), no orchestration, single-concern.

## What You Do

When the user invokes `/azlan-github-workflow:pfc-efs`, follow these 8 sections in order. Each section has a quality gate that MUST pass before proceeding.

---

### Section 1: Context Ingestion

Read the input document(s) provided by the user. Accept any of:
- **Terms of Reference (ToR)** — a brief, RFP, or scope document
- **VSOM context** — Vision, Strategy, Objectives, Measures
- **VP brief** — Value Proposition with problems/solutions/benefits
- **Existing PRD** — to decompose into EFS hierarchy

Extract and confirm:
- **Product/project name**
- **Strategic objective** (VSOM Initiative ID if available)
- **Target personas** (ICP segments)
- **Key problems/pain points**
- **Proposed solutions/capabilities**
- **Success metrics** (KPIs, OKRs)

If the input is thin, ask the user to clarify. Do NOT guess strategic alignment.

**Quality Gate G1 — Context Completeness:**
- [ ] Product name identified
- [ ] At least one strategic objective stated or inferable
- [ ] At least one persona/segment identified
- [ ] At least two problems or capabilities listed

---

### Section 2: Lineage Mapping (5-Layer)

Map the extracted context to the EFS Lineage Architecture:

```
L1 STRATEGY:            VSOM/VSEM → Vision → Strategy → Objectives → Measures
L2 CONTEXT/MEASUREMENT: OKR/KPI → Objectives & Key Results → KPIs
L3 VALUE DEFINITION:    VP → Problems / Solutions / Benefits (+ RRR alignment)
L4 CUSTOMER DEFINITION: ICP → Personas → Pains → Gains → JTBD
L5 SPECIFICATION:       EFS → Epics → Features → Stories → Tasks
```

For each layer, capture what the input provides. Mark gaps as `[TBD - needs input]`.

**VP-RRR Alignment (mandatory):**
- Every `vp:Problem` maps to an `rrr:Risk`
- Every `vp:Solution` maps to an `rrr:Requirement`
- Every `vp:Benefit` maps to an `rrr:Result`

**Quality Gate G2 — Strategic Traceability:**
- [ ] L1-L2 connection established (objective → measure)
- [ ] L3 VP elements have RRR alignment
- [ ] L4 at least one persona with pains/gains

---

### Section 3: Epic Decomposition

Decompose the scope into Epics. Each epic represents a **customer-facing outcome**.

For each epic, define:

| Field | Description |
|-------|-------------|
| `epicId` | `E-{PRODUCT_CODE}-{SEQ}` |
| `name` | Concise outcome statement |
| `businessOutcome` | What value this delivers |
| `alignsToObjective` | VSOM objective reference |
| `targetRelease` | Release version or quarter |
| `priority` | MUST / SHOULD / COULD (MoSCoW) |

**Naming convention:** Follow `Epic N: <concise outcome>` where N is auto-detected from existing issues.

**MECE check:** Epics must be Mutually Exclusive (no overlap) and Collectively Exhaustive (full scope covered).

**Quality Gate G3 — Epic Alignment:**
- [ ] Every epic traces to at least one L1-L2 objective
- [ ] Epics are MECE against the input scope
- [ ] Each epic has a clear business outcome (not a technical task)

---

### Section 4: Feature Breakdown

For each Epic, decompose into Features. Each feature is a **functional capability**.

For each feature, define:

| Field | Description |
|-------|-------------|
| `featureId` | `FN.x` (scoped under parent epic) |
| `name` | Capability statement |
| `featureType` | `functional` / `enabler` / `integration` |
| `acceptanceCriteria` | Testable conditions (Given/When/Then or checklist) |
| `dependencies` | Other features or enablers required |
| `storyPoints` | T-shirt size estimate (S/M/L/XL) |

**Quality Gate G4 — Feature Completeness:**
- [ ] Every feature has acceptance criteria
- [ ] Dependencies identified (no orphan features)
- [ ] Each epic has 2-7 features (if >7, consider splitting the epic)

---

### Section 5: User Story Generation

For each Feature, generate User Stories in standard format:

```
As a [persona],
I want to [action],
So that [benefit].
```

For each story, define:

| Field | Description |
|-------|-------------|
| `storyId` | `SN.x.y` (scoped under parent feature) |
| `persona` | From L4 persona list |
| `action` | What the user does |
| `benefit` | Why — maps to `rrr:Result` |
| `acceptanceCriteria` | Testable conditions |
| `priority` | P1-P4 |

**Quality Gate G5 — Story Quality:**
- [ ] Every story follows As/Want/SoThat format
- [ ] Benefits trace to VP benefits (L3) or RRR results
- [ ] Stories are independently deliverable (INVEST criteria)
- [ ] Each feature has 2-5 stories (if >5, consider splitting)

---

### Section 6: PRD Document Assembly

Assemble the full PRD using the EFS-PRD template structure:

1. **Document Control** — PRD ID, version, author, status
2. **Executive Summary** — Vision, strategic alignment table, success metrics
3. **Problem Statement** — Current state, pain points, business impact
4. **Target Personas** — From L4 mapping
5. **Epic Specification** — Full epic table with business outcomes
6. **Features** — Per-epic feature breakdown with acceptance criteria
7. **User Stories** — Per-feature story list
8. **Dependencies & Risks** — Cross-references, enablers
9. **Release Planning** — Phased delivery with milestones

Write the PRD to the user's preferred location (default: working directory as `PRD-{PRODUCT_CODE}-v0.1.md`).

---

### Section 7: GitHub Issue Script Generation

Generate `gh` CLI commands to create all issues in the target repo.

**Determine target repo:**
```bash
gh repo view --json nameWithOwner --jq '.nameWithOwner'
```

If the user specifies a PFI triad repo, use that. Otherwise ask.

**Auto-detect epic numbering:**
```bash
gh issue list --repo REPO --state all --limit 500 --json title --jq '.[].title' | grep -oP '^Epic\s+\K\d+' | sort -n | tail -1
```

**Generate epic issues:**
```bash
gh issue create --repo REPO \
  --title "Epic N: <outcome>" \
  --label "type:epic,visualiser" \
  --body-file /tmp/epic-N-body.md
```

**Generate feature issues:**
```bash
gh issue create --repo REPO \
  --title "FN.x: <capability>" \
  --label "type:feature,visualiser" \
  --body-file /tmp/feature-N.x-body.md
```

**Generate story issues:**
```bash
gh issue create --repo REPO \
  --title "SN.x.y: <story summary>" \
  --label "type:story,visualiser" \
  --body-file /tmp/story-N.x.y-body.md
```

**Issue body format** (write each to temp file first — never inline complex bodies):

Epic body template:
```markdown
## Objective
{businessOutcome}

## Strategic Alignment
- VSOM Objective: {alignsToObjective}
- Value Proposition: {vpReference}
- Target Release: {targetRelease}

## Features
- [ ] FN.1: {feature1Name}
- [ ] FN.2: {feature2Name}

## Success Criteria
{acceptanceCriteria}
```

Feature body template:
```markdown
## Description
{featureDescription}

## Parent Epic
#{epicIssueNumber}

## Acceptance Criteria
{acceptanceCriteria}

## Stories
- [ ] SN.x.1: {story1}
- [ ] SN.x.2: {story2}
```

Story body template:
```markdown
## User Story
As a {persona}, I want to {action}, so that {benefit}.

## Parent Feature
#{featureIssueNumber}

## Acceptance Criteria
{acceptanceCriteria}

## RRR Alignment
- Risk: {rrrRisk}
- Requirement: {rrrRequirement}
- Result: {rrrResult}
```

**Output classification labels** (for triad distribution):
- `output:core-contribution` — reusable patterns going back to PFC-Core
- `output:instance-specific` — PFI-specific implementation
- `output:shared-pattern` — cross-instance pattern

Ask the user before executing. Offer to:
1. Execute all commands now
2. Write commands to a shell script for review first
3. Generate only the PRD (skip GH issues)

---

### Section 8: Triad CI/CD Deployment

This skill is deployed across PFI triad repos via the Programme Distribution Strategy.

**Skill location in each triad repo:**
```
pfi-{instance}-{env}/
  azlan-github-workflow/
    skills/
      pfc-efs/
        SKILL.md          ← this file
```

**Distribution flow:**
1. Skill authored/updated in `Azlan-EA-AAA` (PFC-Core hub repo)
2. `pfc-release.yml` workflow copies `azlan-github-workflow/skills/**` to each PFI dev repo
3. `promote.yml` promotes dev → test → prod within each triad

**To port this skill to a new PFI triad:**
```bash
# 1. Check the skill exists in core
ls azlan-github-workflow/skills/pfc-efs/SKILL.md

# 2. Copy to target PFI dev repo (or rely on pfc-release.yml)
gh repo clone ajrmooreuk/pfi-{instance}-dev
cp -r azlan-github-workflow/skills/pfc-efs pfi-{instance}-dev/azlan-github-workflow/skills/

# 3. Commit and push
cd pfi-{instance}-dev
git add azlan-github-workflow/skills/pfc-efs/
git commit -m "Add pfc-efs skill from PFC-Core"
git push

# 4. Promote through triad
gh workflow run promote.yml --repo ajrmooreuk/pfi-{instance}-dev
```

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| EFS-ONT v2.0.0 | Core hierarchy | `efs:` |
| VSOM-ONT | L1 Strategy context | `vsom:` |
| OKR-ONT / KPI-ONT | L2 Measurement | `okr:` / `kpi:` |
| VP-ONT | L3 Value definition | `vp:` |
| RRR-ONT | L3 Risk/Req/Result alignment | `rrr:` |
| ORG-ONT / ORG-CONTEXT | L4 Customer definition | `org:` |
| PMF-ONT | Market fit validation | `pmf:` |
| PE-ONT | Process execution | `pe:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| `JP-VP-RRR-001` | VP Problem→Risk, Solution→Requirement, Benefit→Result |
| `JP-EFS-VSOM-001` | Epic.alignsToObjective → vsom:StrategicObjective |
| `JP-EFS-KPI-001` | Epic.successMetric → kpi:KeyPerformanceIndicator |
| `JP-EFS-GH-001` | Epic→Milestone, Feature→Issue(feature), Story→Issue(story) |
