---
name: pfc-org-context
description: Establishes organizational context for a PFI instance — products, brands, competitive landscape, market context, and maturity assessment. Required foundation for all VE chain skills.
argument-hint: "[PFI instance name or org context file]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-ORG-CONTEXT: Organization Context Builder

Establish the foundational organizational context for a PFI instance. This skill produces the `orgctx:OrganizationContext` entity that scopes every downstream VE chain skill (VSOM, OKR, KPI, VP).

## Dtree Classification

`SKILL_STANDALONE` — Low autonomy (structured elicitation workflow), no orchestration, single-concern.

Path: HG-01 FAIL (2.7) → HG-04 PASS (6.5) → `SKILL_STANDALONE`

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

Extract and confirm:
- **PFI instance name** (canonical identifier)
- **Instance code** (e.g., WWG, BAIV, AIRL)
- **Existing declared ontologies** (from EMC config if available)
- **Existing instance data files** (search `PBS/PFI-*` and `PBS/ONTOLOGIES/*/instance-data/`)

If no existing data is found, proceed with fresh elicitation. Do NOT guess instance configuration.

**Quality Gate G1 — Instance Identification:**
- [ ] PFI instance name confirmed
- [ ] Instance code assigned (3-5 chars, uppercase)
- [ ] Existing data inventory complete (may be empty for new instances)

---

### Section 2: Organization Profile

Elicit the core organizational identity:

| Field | Description | Required |
|-------|-------------|----------|
| `orgName` | Legal/trading name | Yes |
| `orgIndustry` | Primary industry sector (NAICS/SIC or free text) | Yes |
| `orgSize` | Employee count range (1-10, 11-50, 51-200, 201-1000, 1001-5000, 5000+) | Yes |
| `orgGeography` | HQ country + operating regions | Yes |
| `orgType` | B2B / B2C / B2B2C / Marketplace | Yes |
| `orgStage` | Startup / Growth / Scale-up / Mature / Enterprise | Yes |
| `orgDescription` | 1-3 sentence elevator pitch | Yes |
| `annualRevenue` | Revenue range (optional but recommended) | No |

Build the `orgctx:OrganizationContext` entity shell:
```json
{
  "@type": "orgctx:OrganizationContext",
  "@id": "org:ctx-{instance-code}",
  "orgctx:orgName": "",
  "orgctx:orgIndustry": "",
  "orgctx:orgSize": "",
  "orgctx:orgGeography": "",
  "orgctx:orgType": "",
  "orgctx:orgStage": ""
}
```

**Quality Gate G2 — Organization Profile:**
- [ ] Organization name, industry, and geography captured
- [ ] Org type (B2B/B2C) and stage identified
- [ ] Entity shell constructed with `@id` using instance code

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

Output as `orgctx:MarketContext` entity.

**Quality Gate G4 — Market Scoping:**
- [ ] At least 1 target market segment defined with size estimate
- [ ] Growth stage identified
- [ ] Geographic scope established

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

Output as maturity profile within the `orgctx:OrganizationContext` entity.

---

### Section 7: Output Assembly

Assemble the complete ORG-CONTEXT JSON-LD instance file:

```json
{
  "@context": {
    "orgctx": "https://platformcore.io/ontology/org-context/",
    "org": "https://platformcore.io/ontology/org/",
    "pfc": "https://platformcore.io/ontology/"
  },
  "@type": "orgctx:OrganizationContext",
  "@id": "org:ctx-{instance-code}",
  "orgctx:instanceRef": "pfi:{instance-name}",
  "orgctx:orgProfile": { "...from S2..." },
  "orgctx:products": [ "...from S3..." ],
  "orgctx:marketContext": { "...from S4..." },
  "orgctx:competitiveLandscape": { "...from S5..." },
  "orgctx:maturityAssessment": { "...from S6..." },
  "pfc:version": "1.0.0",
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

Present summary to user:
```
ORG-CONTEXT Summary: {orgName} ({instance-code})
  Industry:    {orgIndustry}
  Type:        {orgType} | Stage: {orgStage}
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
| ORG-CONTEXT-ONT v3.1.0 | Primary schema | `orgctx:` |
| ORG-ONT v3.0.0 | Organization base | `org:` |
| CTX-ONT v1.0.0 | Context types | `ctx:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| `JP-CTX-001` | `orgctx:OrganizationContext` referenced by all downstream VE skills via `organizationContextRef` |
| `JP-CTX-002` | `orgctx:Product.productValuePropositionRef` → `vp:ValueProposition` (filled by pfc-vp) |
| `JP-CTX-003` | `orgctx:CompetitiveLandscape` → consumed by `ind:PortersFiveForces` (pfc-industry-analysis) |
