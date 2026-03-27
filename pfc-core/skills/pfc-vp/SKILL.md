---
name: pfc-vp
description: Builds a complete Value Proposition for a given ICP, aligned with VSOM/OKR/KPI and enforcing mandatory VP-RRR alignment (Problem>Risk, Solution>Requirement, Benefit>Result). Follows VP-ONT v1.2.3.
argument-hint: "[vsom output, org-context, or PFI instance name]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-VP: Value Proposition Builder

Build a complete Value Proposition for a given Ideal Customer Profile (ICP), grounded in strategic context from VSOM/OKR/KPI and enforcing the mandatory VP-RRR alignment convention. This is the culminating skill in the VE chain — everything upstream converges here.

## Dtree Classification

`SKILL_STANDALONE` — Moderate autonomy (creative synthesis for ICP definition, problem discovery, benefit articulation), no orchestration, single-concern. Most entity-rich output (15 VP-ONT entity types).

Path: HG-01 PARTIAL (5.1) → HG-03 FAIL (3.5) → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:pfc-vp`, follow these 8 sections in order. This skill has 7 quality gates including the **mandatory zero-tolerance VP-RRR alignment gate (G4)**.

---

### Section 1: Context Loading

Load all available upstream context:

1. **ORG-CONTEXT (mandatory):** Load `01-org-context-{instance}.jsonld` — products, market, competitors
2. **VSOM (mandatory):** Load `04-vsom-{instance}.jsonld` — vision, strategies, objectives
3. **OKR (recommended):** Load `05-okr-{instance}-{quarter}.jsonld` — key results for metric alignment
4. **KPI (recommended):** Load `06-kpi-{instance}.jsonld` — measurement linkage
5. **RRR instance data (mandatory):** Load RRR roles for alignment. Search:
   - `PBS/ONTOLOGIES/ontology-library/VE-Series/RRR-ONT/instance-data/rrr-{instance}*.jsonld`
   - If no instance data exists, use RRR-ONT base roles (C-Suite executive roles)

Present context summary:
```
VP Context for {orgName} ({instance-code})

Strategic Foundation:
  Vision:     "{visionStatement}" ({horizon}yr)
  Strategies: {count} ({strategy-names})
  Objectives: {count} across {perspectives} BSC perspectives
  KPIs:       {count} defined

Available for Alignment:
  RRR Roles:  {count} ({role-names})
  Products:   {count} ({product-names})
  Markets:    {count} segments
```

**Quality Gate G1 — Context Loaded:**
- [ ] ORG-CONTEXT loaded with products and market segments
- [ ] VSOM loaded with at least 1 strategy and objectives
- [ ] RRR roles loaded (instance data or base ontology)
- [ ] Context summary confirmed by user

---

### Section 2: ICP Definition

Define 1-3 Ideal Customer Profiles. For each ICP:

| Field | Description |
|-------|-------------|
| `icpId` | `vp:icp-{instance}-{seq}` |
| `icpName` | Descriptive segment name |
| `demographics` | Age, role, education, income level |
| `firmographics` | Company size, industry, revenue range, geography |
| `psychographics` | Values, motivations, decision-making style |
| `willingnessToPayRange` | Min-Max annual spend estimate |
| `decisionAuthority` | Budget holder / Influencer / User |
| `buyingCriteria` | Top 3-5 criteria ranked |

**For B2B ICPs: Build RoleBasedICP Hierarchy:**

| Level | Role | Decision Type |
|-------|------|---------------|
| Strategic | C-Suite (CEO, CTO, CMO) | Final approval, budget authority |
| Tactical | Director/VP | Evaluation, recommendation |
| Operational | Manager/Individual Contributor | Daily use, implementation |

For each RoleBasedICP:
| Field | Description |
|-------|-------------|
| `roleBasedIcpId` | `vp:role-icp-{instance}-{level}-{seq}` |
| `icpLevel` | Strategic / Tactical / Operational |
| `roleRef` | RRR role reference (JP-VP-008) |
| `icpReportsTo` | Parent RoleBasedICP (hierarchy) |
| `budgetRange` | Decision authority budget |
| `keyPainPoints` | Level-specific pains |
| `keyGains` | Level-specific desired outcomes |

**Quality Gate G2 — ICP Defined:**
- [ ] At least 1 ICP with demographics and firmographics
- [ ] At least 1 stakeholder per ICP
- [ ] For B2B: RoleBasedICP hierarchy with roleRef to RRR roles
- [ ] Willingness-to-pay range estimated

---

### Section 3: Problem Discovery

For each ICP, identify 3-5 problems. Problems have hierarchical scope:

**Problem Hierarchy (JP-VP-009):**
```
Strategic Problems  (C-Suite concern, long-term impact)
    ↑ rollsUpTo
Tactical Problems   (Manager concern, quarterly impact)
    ↑ rollsUpTo
Operational Problems (User concern, daily impact)
```

For each problem:

| Field | Description |
|-------|-------------|
| `problemId` | `vp:prob-{instance}-{scope}-{seq}` |
| `problemName` | Concise label |
| `problemDescription` | 1-3 sentences |
| `problemCategory` | functional / economic / emotional / social |
| `severity` | Critical / High / Medium / Low |
| `frequency` | Daily / Weekly / Monthly / Quarterly / Annual |
| `scopeLevel` | Strategic / Tactical / Operational |
| `problemRollsUpTo` | Parent problem reference (if applicable) |
| `marketSizeImpact` | Revenue/cost impact estimate |

For each problem, define 2-3 pain points:

| Field | Description |
|-------|-------------|
| `painPointId` | `vp:pain-{instance}-{seq}` |
| `painDescription` | Specific frustration or cost |
| `businessImpact` | Quantified where possible (GBP, hours, %) |
| `currentWorkaround` | How they cope today |
| `workaroundCost` | Cost of the workaround |

**Quality Gate G3 — Problem-Solution Fit:**
- [ ] 3-5 problems per ICP with severity and frequency
- [ ] Every problem has at least 1 pain point (BR-VP-007)
- [ ] Problem hierarchy established (operational → tactical → strategic)
- [ ] Business impact quantified for at least 2 problems

---

### Section 4: Solution Design

Define the solution addressing the discovered problems:

| Field | Description |
|-------|-------------|
| `solutionId` | `vp:sol-{instance}-001` |
| `solutionName` | Product/service name |
| `coreFunctionality` | 3-5 core capabilities |
| `deliveryMethod` | SaaS / Platform / Service / Physical / Hybrid |
| `pricingModel` | Subscription / Per-unit / License / Freemium |
| `timeToValue` | How quickly customer sees results |
| `implementationComplexity` | Low / Medium / High |

Define 2-4 differentiators:

| Field | Description |
|-------|-------------|
| `differentiatorId` | `vp:diff-{instance}-{seq}` |
| `differentiatorName` | What makes this unique |
| `differentiatorType` | Technology / Capability / Process / Experience / Data |
| `defensibility` | High (patent/network) / Medium (expertise) / Low (replicable) |
| `evidenceBase` | How you prove this differentiator |

---

### Section 5: Benefit Articulation

For each pain point mitigated, define a benefit:

| Field | Description |
|-------|-------------|
| `benefitId` | `vp:ben-{instance}-{seq}` |
| `benefitStatement` | Clear, outcome-oriented statement |
| `benefitType` | Quantifiable / Qualitative |
| `benefitCategory` | Revenue-increase / Cost-reduction / Risk-reduction / Time-saving / Quality-improvement |
| `mitigatesPainPoint` | Pain point reference |
| `realizationTimeframe` | When the benefit is expected |
| `kpiRef` | KPI reference (from pfc-kpi output) |
| `measurement` | How this benefit is measured |

**Quantification guidance:**
- Revenue benefits: "$X increase in Y over Z period"
- Cost benefits: "$X saved per year by eliminating Y"
- Time benefits: "X hours/days saved per Z cycle"
- Risk benefits: "Y% reduction in Z risk"

---

### Section 6: VP Statement + RRR Alignment

**Step 1:** Craft the primary VP statement:

```
For [ICP] who [NEED/PROBLEM],
our [SOLUTION] provides [KEY BENEFITS],
unlike [COMPETITIVE ALTERNATIVE] which [LIMITATION].
```

Also generate the alternative statement format:
```
[PRODUCT] helps [ICP] [ACHIEVE OUTCOME] by [HOW],
so they can [ULTIMATE BENEFIT].
```

**Step 2: MANDATORY VP-RRR Alignment (JP-VP-RRR-001)**

This is a **ZERO-TOLERANCE** gate. Every VP entity must have an RRR counterpart:

| VP Entity | RRR Entity | Alignment Rule |
|-----------|-----------|----------------|
| Every `vp:Problem` | → `rrr:Risk` | Problems are risks to the customer |
| Every `vp:Solution` | → `rrr:Requirement` | Solutions are requirements to build |
| Every `vp:Benefit` | → `rrr:Result` | Benefits are measurable results |

For each alignment, capture:

| Field | Description |
|-------|-------------|
| `vpRef` | VP entity reference |
| `rrrRef` | RRR entity reference (create if not in RRR instance data) |
| `alignmentType` | Problem-Risk / Solution-Requirement / Benefit-Result |
| `alignmentRationale` | Why this mapping holds |

**Quality Gate G4 — VP-RRR Alignment (MANDATORY, ZERO-TOLERANCE):**
- [ ] **Every** `vp:Problem` has a corresponding `rrr:Risk`
- [ ] **Every** `vp:Solution` has a corresponding `rrr:Requirement`
- [ ] **Every** `vp:Benefit` has a corresponding `rrr:Result`
- [ ] Alignment rationale provided for each mapping
- [ ] No orphan VP entities without RRR counterpart

**This gate CANNOT be skipped or deferred.** If RRR instance data is incomplete, create the missing RRR entities as part of this step.

---

### Section 7: Output Assembly

Assemble the complete VP JSON-LD:

```json
{
  "@context": {
    "vp": "https://platformcore.io/ontology/vp/",
    "rrr": "https://platformcore.io/ontology/rrr/",
    "vsom": "https://platformcore.io/ontology/vsom/",
    "kpi": "https://platformcore.io/ontology/kpi/",
    "orgctx": "https://platformcore.io/ontology/org-context/",
    "pfc": "https://platformcore.io/ontology/"
  },
  "@type": "vp:ValuePropositionInstance",
  "@id": "vp:instance-{instance}",
  "vp:organizationContextRef": "org:ctx-{instance-code}",
  "vp:valueProposition": { "...from S6 step 1..." },
  "vp:idealCustomerProfiles": [ "...from S2..." ],
  "vp:roleBasedICPs": [ "...from S2 B2B hierarchy..." ],
  "vp:problems": [ "...from S3..." ],
  "vp:painPoints": [ "...from S3..." ],
  "vp:solution": { "...from S4..." },
  "vp:differentiators": [ "...from S4..." ],
  "vp:benefits": [ "...from S5..." ],
  "vp:vpRrrAlignment": [ "...from S6 step 2..." ],
  "vp:competitiveAlternatives": [ "...from ORG-CONTEXT competitive landscape..." ],
  "vp:validationEvidence": [],
  "vp:successMetrics": [],
  "pfc:version": "1.0.0",
  "pfc:status": "draft",
  "pfc:createdDate": "YYYY-MM-DD"
}
```

**VSOM Alignment Links:**
- `vp:alignsToObjective` → VSOM strategic objective (BR-VP-005)
- `vp:organizationContextRef` → ORG-CONTEXT (BR-VP-006)

Write to: `{working_dir}/ve-pipeline-output/07-vp-{instance}-{icp}.jsonld`

**Quality Gate G5 — VSOM Alignment:**
- [ ] VP.alignsToObjective links to at least 1 VSOM StrategicObjective
- [ ] VP.organizationContextRef is valid

**Quality Gate G6 — Evidence & Metrics:**
- [ ] At least 1 validation evidence item per problem (or noted as TBD)
- [ ] At least 1 success metric linked to a KPI from pfc-kpi output

**Quality Gate G7 — Competitive Differentiation:**
- [ ] At least 1 differentiator with defensibility assessment
- [ ] At least 2 competitive alternatives identified (including "do nothing")

---

### Section 8: Validation

Run final validation checks:

- [ ] All G1-G7 gates passed (G4 is zero-tolerance)
- [ ] JSON-LD well-formed
- [ ] VP-RRR alignment complete (no orphan VP entities)
- [ ] All VP business rules from VP-ONT v1.2.3 checked
- [ ] Output file written successfully

Present summary:
```
VALUE PROPOSITION Summary: {orgName} ({instance-code})
  VP Statement: "{primaryStatement}"
  ICPs:         {count} ({icp-names})
  Problems:     {count} (S:{strategic} T:{tactical} O:{operational})
  Pain Points:  {count}
  Solution:     {solutionName} ({deliveryMethod})
  Benefits:     {count} ({quantifiable} quantifiable, {qualitative} qualitative)
  Differentiators: {count}
  VP-RRR Alignment: {problem-risk}/{solution-req}/{benefit-result} mappings
  VSOM Alignment:   {objective-name}
  KPI Linkage:      {count} metrics linked
  Output:           {file_path}
```

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| VP-ONT v1.2.3 | Primary schema (15 entity types, 22 business rules) | `vp:` |
| RRR-ONT v4.0.0 | Mandatory alignment | `rrr:` |
| VSOM-ONT v3.0.0 | Strategic alignment | `vsom:` |
| OKR-ONT v2.1.0 | Metric alignment | `okr:` |
| KPI-ONT v1.0.0 | Measurement linkage | `kpi:` |
| ORG-CONTEXT-ONT v3.1.0 | Instance scoping | `orgctx:` |
| BSC-ONT v1.0.0 | Perspective context | `bsc:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| `JP-VP-RRR-001` | **MANDATORY:** Problem→Risk, Solution→Requirement, Benefit→Result |
| `JP-VP-001` | VP.alignsToObjective → vsom:ObjectivesComponent |
| `JP-VP-004` | VP.organizationContextRef → orgctx:OrganizationContext |
| `JP-VP-008` | rrr:ExecutiveRole ↔ vp:RoleBasedICP.roleRef |
| `JP-VP-009` | Problem roll-up: Operational → Tactical → Strategic |
| `JP-VP-010` | RACI-VP Activity Chain |
