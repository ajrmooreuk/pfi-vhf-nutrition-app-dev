---
name: pfc-org-context
description: Establishes organizational context for a PFI instance — products, brands, competitive landscape, market context, and maturity assessment. Required foundation for all VE chain skills. Routes through ORG-CONTEXT universal hub with org-ctx:ContextType system.
argument-hint: "[PFI instance name or org context file]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-ORG-CONTEXT: Organization Context Builder

Establish the foundational organizational context for a PFI instance. This skill produces the `orgctx:OrganizationContext` entity that scopes every downstream VE chain skill (VSOM, OKR, KPI, VP). All context dimensions are now routed through the ORG-CONTEXT universal hub with typed relationships to `org-ctx:ContextType` sub-entities.

> **Status:** active | **Version:** 2.0.0 | **SKL-002**
> **Category:** foundation | **PE-ONT:** pe:Process
> **Ontology:** ORG-CONTEXT-ONT v4.0.0 | **Namespace:** `orgctx:`
> **Output:** `ve-pipeline-output/01-org-context-{instance}.jsonld`
> **Chain position:** Second in FDN chain ← receives pfc-ctx (SKL-029) output

## Dtree Classification

`SKILL_STANDALONE` — Low autonomy (structured elicitation workflow), no orchestration, single-concern.

Path: HG-01 FAIL (2.7) → HG-04 PASS (6.5) → `SKILL_STANDALONE`

### Breaking Change Note (v2.0.0)

This skill version aligns with ORG-ONT v4.0.0 which **removed** `type`, `industry`, `size` inline properties from Organization. These are now provided by the upstream pfc-ctx skill (SKL-029) as typed org-ctx: entities:

- `org:Organization.type` → `org-ctx:OrganizationType` (via `org:typedByContext` cross-ref)
- `org:Organization.industry` → `org-ctx:MarketClassification` (via ORG-CONTEXT hub routing)
- `org:Organization.size` → `org-ctx:OrganisationSize` (via `org-ctx:sizedByContext` cross-ref)

Section 2 (Organization Profile) no longer elicits these fields — they come from the pfc-ctx output file.

## What You Do

When the user invokes `/azlan-github-workflow:pfc-org-context`, follow these 8 sections in order. Each section has a quality gate that MUST pass before proceeding.

---

### Section 1: Instance Identification

Identify the target PFI instance. Accept any of:

- **PFI instance name** — e.g., "W4M-WWG", "BAIV", "AIRL-CAF-AZA"
- **Existing org-context file** — a JSON-LD file to review/extend
- **Organization brief** — website URL, annual report, or plain description

Check the ontology-library registry for existing instance configuration:

```bash
grep -l "{instance}" PBS/ONTOLOGIES/ontology-library/ont-registry-index.json
```

Check for existing EMC instance configuration:

```bash
grep -r "instanceId.*{instance}" PBS/TOOLS/ontology-visualiser/js/emc-composer.js
```

Load the upstream pfc-ctx output if available:

```bash
Read ve-pipeline-output/00-ctx-{instance}.jsonld
```

Extract and confirm:

- **PFI instance name** (canonical identifier)
- **Instance code** (e.g., WWG, BAIV, AIRL)
- **Existing declared ontologies** (from EMC config if available)
- **Existing instance data files** (search `PBS/PFI-*` and `PBS/ONTOLOGIES/*/instance-data/`)
- **pfc-ctx output** (org-ctx:ContextAssignment — provides OrganizationType, MarketClassification, OrganisationSize)

If no existing data is found, proceed with fresh elicitation. Do NOT guess instance configuration.

**Quality Gate G1 — Instance Identification:**

- [ ] PFI instance name confirmed
- [ ] Instance code assigned (3-5 chars, uppercase)
- [ ] Existing data inventory complete (may be empty for new instances)
- [ ] pfc-ctx output loaded (if available — provides type, industry, size context)

---

### Section 2: Organization Profile

Elicit the core organizational identity. Note: `type`, `industry`, and `size` are no longer captured here — they are provided by the upstream pfc-ctx skill via `org-ctx:OrganizationType`, `org-ctx:MarketClassification`, and `org-ctx:OrganisationSize` entities.

| Field | Description | Required |
|-------|-------------|----------|
| `orgName` | Legal/trading name | Yes |
| `orgGeography` | HQ country + operating regions | Yes |
| `orgStage` | Startup / Growth / Scale-up / Mature / Enterprise | Yes |
| `orgDescription` | 1-3 sentence elevator pitch | Yes |
| `annualRevenue` | Revenue range (optional but recommended) | No |

If pfc-ctx output is available, cross-reference:

- `org-ctx:OrganizationType` → confirm org type alignment
- `org-ctx:MarketClassification` → confirm industry alignment
- `org-ctx:OrganisationSize` → confirm size alignment

Build the `orgctx:OrganizationContext` entity shell:

```json
{
  "@type": "orgctx:OrganizationContext",
  "@id": "org:ctx-{instance-code}",
  "orgctx:orgName": "",
  "orgctx:orgGeography": "",
  "orgctx:orgStage": "",
  "orgctx:contextAssignmentRef": "org-ctx:assignment-{instance-code}",
  "orgctx:typedByContext": { "@ref": "org-ctx:OrganizationType" }
}
```

**Quality Gate G2 — Organization Profile:**

- [ ] Organization name and geography captured
- [ ] Org stage identified
- [ ] Entity shell constructed with `@id` using instance code
- [ ] Cross-references to pfc-ctx context dimensions established

---

### Section 3: Product Catalogue

Enumerate the products and/or services offered:

For each product/service, capture:

| Field | Description |
|-------|-------------|
| `productId` | `prod-{instance}-{seq}` |
| `productName` | Trading name |
| `productCategory` | Product type (SaaS, Platform, Service, Physical, Hybrid) |
| `productSegment` | Target market segment |
| `deliveryMethod` | How it reaches customers (Direct, Channel, Platform, Marketplace) |
| `pricingModel` | Revenue model (Subscription, Per-unit, License, Freemium, Custom) |
| `productStatus` | active / planned / discontinued |
| `productValuePropositionRef` | VP reference (to be filled by pfc-vp downstream) |

Output as `orgctx:Product[]` entities.

**Quality Gate G3 — Product Coverage:**

- [ ] At least 1 product/service defined with delivery method and pricing model
- [ ] Each product has a unique `productId`
- [ ] Product status is set (active/planned/discontinued)

---

### Section 4: Market Context

Define the target market environment:

| Field | Description |
|-------|-------------|
| `targetMarkets` | Geographic markets served (countries/regions) |
| `marketSegments` | 1-5 customer segments with size estimates |
| `marketSize` | TAM/SAM/SOM estimates (if known) |
| `growthStage` | Emerging / Growing / Mature / Declining |
| `regulatoryEnvironment` | Key regulatory frameworks affecting the business |
| `localization` | Language/currency/compliance requirements |

For each market segment, capture:

- Segment name
- Estimated addressable size (revenue or customer count)
- Growth rate (if known)
- Primary need/pain

Cross-reference with `org-ctx:MarketClassification` from pfc-ctx output to ensure segment alignment with assigned classification scheme.

Output as `orgctx:MarketContext` entity.

**Quality Gate G4 — Market Scoping:**

- [ ] At least 1 target market segment defined with size estimate
- [ ] Growth stage identified
- [ ] Geographic scope established
- [ ] Market segments aligned with org-ctx:MarketClassification (if available)

---

### Section 5: Competitive Landscape

Map the competitive environment:

For each competitor/alternative (minimum 3, including "do nothing"):

| Field | Description |
|-------|-------------|
| `competitorName` | Name or category |
| `competitorType` | Direct / Substitute / Workaround / DoNothing |
| `marketShare` | Estimated share (if known) |
| `strengths` | 2-3 key strengths |
| `weaknesses` | 2-3 key weaknesses |
| `differentiator` | What sets them apart |

Always include a "Do Nothing / Status Quo" alternative — this is the most common competitor.

Output as `orgctx:CompetitiveLandscape` entity.

**Quality Gate G5 — Competitive Awareness:**

- [ ] At least 3 competitive alternatives identified (including "do nothing")
- [ ] Each alternative has type, strengths, and weaknesses
- [ ] At least 1 direct competitor identified (if market exists)

---

### Section 6: Maturity Assessment

Assess organizational maturity across 5 dimensions (1-5 scale):

| Dimension | Description | Score Range |
|-----------|-------------|-------------|
| Process Maturity | Formalized processes, documentation, repeatability | 1=Ad hoc, 5=Optimized |
| Technology Maturity | Tech stack sophistication, automation, integration | 1=Manual, 5=AI-augmented |
| Data Maturity | Data quality, governance, analytics capability | 1=Siloed, 5=Predictive |
| People Maturity | Skills, culture, org learning capacity | 1=Reactive, 5=Innovative |
| Strategy Maturity | Strategic planning capability, execution discipline | 1=Informal, 5=Adaptive |

Calculate overall maturity score: `average(5 dimensions)`.

Classify maturity level:

- 1.0-2.0: Level 1 (Initial) — ad hoc, reactive
- 2.1-3.0: Level 2 (Developing) — some structure, inconsistent
- 3.1-3.5: Level 3 (Defined) — standardized, documented
- 3.6-4.0: Level 4 (Managed) — measured, controlled
- 4.1-5.0: Level 5 (Optimized) — continuous improvement

Each dimension is typed via `org-ctx:MaturityDimensionType` from the pfc-ctx output, enabling the ORG-MAT skill to bridge scoring to the context type system.

Output as maturity profile within the `orgctx:OrganizationContext` entity.

---

### Section 7: Output Assembly

Assemble the complete ORG-CONTEXT JSON-LD instance file:

```json
{
  "@context": {
    "orgctx": "https://platformcore.io/ontology/org-context/",
    "org": "https://platformcore.io/ontology/org/",
    "org-ctx": "https://platformcore.io/ontology/org-context/",
    "pfc": "https://platformcore.io/ontology/"
  },
  "@type": "orgctx:OrganizationContext",
  "@id": "org:ctx-{instance-code}",
  "orgctx:instanceRef": "pfi:{instance-name}",
  "orgctx:contextAssignmentRef": "org-ctx:assignment-{instance-code}",
  "orgctx:orgProfile": { "...from S2..." },
  "orgctx:products": [ "...from S3..." ],
  "orgctx:marketContext": { "...from S4..." },
  "orgctx:competitiveLandscape": { "...from S5..." },
  "orgctx:maturityAssessment": { "...from S6..." },
  "pfc:version": "2.0.0",
  "pfc:status": "draft",
  "pfc:createdDate": "YYYY-MM-DD"
}
```

Write to: `{working_dir}/ve-pipeline-output/01-org-context-{instance}.jsonld`

If a `PBS/PFI-{instance}/` directory exists, also offer to write there.

---

### Section 8: Validation

Run final validation checks:

- [ ] All G1-G5 gates passed
- [ ] JSON-LD is well-formed (valid JSON, `@context` present, `@type` correct)
- [ ] `@id` follows `org:ctx-{code}` pattern
- [ ] No empty required fields
- [ ] Instance code matches PFI naming convention
- [ ] Output file written successfully
- [ ] Cross-references to pfc-ctx output are valid (org-ctx:ContextAssignment exists)

Present summary to user:

```
ORG-CONTEXT Summary: {orgName} ({instance-code})
  Type:        {orgType} (via org-ctx:OrganizationType)
  Industry:    {industry} (via org-ctx:MarketClassification)
  Size:        {size} (via org-ctx:OrganisationSize)
  Stage:       {orgStage}
  Products:    {count} defined
  Markets:     {count} segments
  Competitors: {count} alternatives
  Maturity:    Level {level} ({score}/5.0)
  Output:      {file_path}
```

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| ORG-CONTEXT-ONT v4.0.0 | Primary schema | `orgctx:` |
| ORG-ONT v4.0.0 | Organization base (type/industry/size removed — via cross-refs) | `org:` |
| CTX-ONT v2.1.0 | Context types (org-ctx: namespace) | `org-ctx:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| `JP-CTX-001` | `orgctx:OrganizationContext` referenced by all downstream VE skills via `organizationContextRef` |
| `JP-CTX-002` | `orgctx:Product.productValuePropositionRef` → `vp:ValueProposition` (filled by pfc-vp) |
| `JP-CTX-003` | `orgctx:CompetitiveLandscape` → consumed by `ind-sa:PortersFiveForces` (pfc-industry-analysis) |
| `JP-CTX-004` | `org:typedByContext` → `org-ctx:OrganizationType` (ORG-ONT v4.0.0 cross-ref) |
| `JP-CTX-005` | `orgctx:contextAssignmentRef` → `org-ctx:ContextAssignment` (pfc-ctx output linkage) |
