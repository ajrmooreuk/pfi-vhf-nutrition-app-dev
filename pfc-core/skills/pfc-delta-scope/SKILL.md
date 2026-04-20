---
name: pfc-delta-scope
description: Phase 1 (Discover) of the DELTA process. Scopes the discovery engagement — stakeholder mapping, context layer identification, scale determination, and discovery template selection. Produces the DELTA scope artifact.
argument-hint: "[org context or brief] [--scope narrow|functional|enterprise|market] [--instance PFI-ID]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-DELTA-SCOPE: Discovery Scoping & Stakeholder Mapping

Phase 1 (Discover) of the DELTA process. Determines what we're discovering, for whom, at what scale, and through which lens. Produces the scope artifact that all downstream phases depend on.

## Dtree Classification

`SKILL_STANDALONE` — Low autonomy (structured scoping workflow), no orchestration, single-concern.

Path: HG-01 PASS (5.5) → HG-03 FAIL (3.2) → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:pfc-delta-scope`, follow these 8 sections in order. Each section has a quality gate that MUST pass before proceeding.

---

### Section 1: Context Ingestion

Read input documents provided by the user. Accept any of:
- **Organisational context** — existing `orgctx:OrganizationContext` JSON-LD
- **Client brief** — unstructured description of what needs discovering
- **PFI instance data** — existing instance configuration from registry
- **Previous DELTA cycle output** — for multi-cycle re-entry

Extract and confirm:
- **Organisation name** and sector
- **Engagement trigger** — What prompted this discovery? (new client, strategic review, competitive threat, compliance, growth opportunity)
- **Initial problem statement** — What does the client think the issue is?
- **Existing data sources** — What's already available? (analytics, surveys, reports, interviews)

If a PFI instance is specified (via `--instance`), load its configuration from the registry to pre-populate ontology scope and discovery templates.

**Quality Gate G-scope-1 — Context Received:**
- [ ] Organisation identified
- [ ] Engagement trigger stated
- [ ] Initial problem statement captured (even if vague)

---

### Section 2: Scale Determination

Determine the scope scale from the `--scope` flag or by analysing the problem statement:

| Scale | Characteristics | SA Tools Invoked | Typical Duration |
|-------|----------------|-----------------|-----------------|
| `narrow` | Single process, channel, or metric | None (direct analysis) | 1-2 weeks |
| `functional` | Department or function (e.g., marketing, sales) | pfc-industry-analysis | 2-4 weeks |
| `enterprise` | Whole organisation or business unit | pfc-macro-analysis + pfc-industry-analysis | 4-8 weeks |
| `market` | Organisation within competitive landscape | pfc-macro-analysis + pfc-industry-analysis + external benchmarks | 6-12 weeks |

**Scale inference rules:**
- Problem mentions a single KPI, channel, or process → `narrow`
- Problem mentions a department, function, or team capability → `functional`
- Problem mentions strategy, transformation, or organisational change → `enterprise`
- Problem mentions competitors, market position, or industry trends → `market`

Confirm scale with user. Scale determines which downstream skills are invoked.

**Quality Gate G-scope-2 — Scale Confirmed:**
- [ ] Scale is one of: narrow / functional / enterprise / market
- [ ] User has confirmed the scale is appropriate

---

### Section 3: Stakeholder Mapping

Identify key stakeholders for the discovery engagement:

For each stakeholder:
- `name`: Stakeholder name or role
- `role`: Sponsor / Champion / Subject Matter Expert / Data Owner / Approver / End User
- `interest`: What do they care about? (mapped to VSOM layer)
- `influence`: High / Medium / Low
- `dataProvides`: What data or insight can they contribute?

Map stakeholders to RRR executive roles where applicable:
- Financial sponsor → `rrr:FinancialSteward`
- Customer champion → `rrr:CustomerAdvocate`
- Operations lead → `rrr:ProcessOwner`
- Growth lead → `rrr:GrowthChampion`

**Quality Gate G-scope-3 — Stakeholders Mapped:**
- [ ] At least one Sponsor identified
- [ ] At least one data-providing stakeholder identified
- [ ] Stakeholder interest mapped to VSOM layers

---

### Section 4: Context Layer Identification

Determine which context layers need activating based on scale:

| Layer | Source Ontology | narrow | functional | enterprise | market |
|-------|----------------|--------|-----------|-----------|--------|
| Macro environment | MACRO-ONT | - | - | Required | Required |
| Industry position | INDUSTRY-ONT | - | Required | Required | Required |
| Organisation context | ORG-CONTEXT-ONT | Optional | Required | Required | Required |
| Product/service landscape | VP-ONT + LSC-ONT | Required | Required | Required | Required |
| Competitive position | INDUSTRY-ONT | - | Optional | Optional | Required |
| Financial health | BSC-ONT (Financial) | Optional | Optional | Required | Required |
| Customer landscape | VP-ONT (ICP) | Required | Required | Required | Required |

For each required layer, identify:
- **Existing data:** Already available from previous analyses or client data
- **Gaps:** Need to be gathered during discovery
- **Source:** Where to get it (interviews, analytics, public data, existing JSON-LD)

**Quality Gate G-scope-4 — Context Layers Mapped:**
- [ ] All required layers for the chosen scale are identified
- [ ] Data gaps documented with planned acquisition method
- [ ] Existing data sources catalogued

---

### Section 5: Discovery Template Selection

If a PFI instance is specified, select from its declared discovery templates. Otherwise, define a custom template.

**Template structure:**
```json
{
  "templateId": "template-name",
  "templateScope": "narrow|functional|enterprise|market",
  "description": "What this template discovers",
  "contextLayers": ["list of active layers"],
  "saToolsRequired": ["pfc-macro-analysis", "pfc-industry-analysis"],
  "primaryMetrics": ["KPIs to measure"],
  "cgaDimensions": ["dimensions for gap analysis"],
  "expectedArtifacts": ["what Phase 2-5 will produce"]
}
```

For the default PFC (no PFI instance), offer standard templates:
- `strategic-review` — Enterprise/market: full VSOM-SA stack
- `operational-assessment` — Functional: process/capability focus
- `competitive-analysis` — Market: industry position focus
- `growth-opportunity` — Functional/enterprise: expansion focus
- `compliance-readiness` — Functional: GRC alignment focus

**Quality Gate G-scope-5 — Template Selected:**
- [ ] Template selected or custom template defined
- [ ] Template scope matches determined scale
- [ ] SA tools requirements documented

---

### Section 6: Current-State Evidence Gathering Plan

Define what evidence needs to be gathered to establish the current state:

For each context layer, specify:
- **Quantitative data:** Metrics, KPIs, financial figures, usage stats
- **Qualitative data:** Interviews, surveys, observation notes
- **External data:** Market reports, competitor analysis, benchmarks
- **Timeline:** When each data point will be available

Create the evidence gathering plan as a structured checklist:
```markdown
## Evidence Gathering Plan

### Layer: [Context Layer Name]
- [ ] [Data point 1] — Source: [source] — Owner: [stakeholder] — Due: [date]
- [ ] [Data point 2] — Source: [source] — Owner: [stakeholder] — Due: [date]
```

**Quality Gate G-scope-6 — Evidence Plan Complete:**
- [ ] Every required context layer has at least one data point planned
- [ ] Each data point has an owner and source
- [ ] No critical data gaps without a mitigation plan

---

### Section 7: Scope Artifact Output

Assemble the complete DELTA scope artifact:

Write to: `{working_dir}/delta-output/01-delta-scope-{instance}.jsonld`

```json
{
  "@context": {
    "delta": "https://pf-core.dev/delta/v1/",
    "orgctx": "https://oaa-ontology.org/v6/org-context/",
    "rrr": "https://oaa-ontology.org/v6/rrr/"
  },
  "@type": "delta:DiscoveryScope",
  "@id": "delta:scope-{instance}-{date}",
  "organisation": "{org name}",
  "engagementTrigger": "{trigger}",
  "problemStatement": "{initial problem}",
  "scale": "{narrow|functional|enterprise|market}",
  "discoveryTemplate": "{template-id}",
  "stakeholders": [],
  "contextLayers": [],
  "evidenceGatheringPlan": [],
  "saToolsRequired": [],
  "estimatedDuration": "{duration}",
  "cycleNumber": 1,
  "previousCycleRef": null
}
```

Also write a human-readable summary: `{working_dir}/delta-output/01-delta-scope-{instance}-summary.md`

---

### Section 8: Gate Validation (G1)

**DELTA Gate G1 — Scope Complete:**
- [ ] Organisation and engagement context established
- [ ] Scale determined and confirmed
- [ ] Stakeholders mapped with VSOM layer interests
- [ ] Context layers identified with data sources
- [ ] Discovery template selected
- [ ] Evidence gathering plan defined
- [ ] Scope artifact written to delta-output/

G1 is a **blocking gate**. If any condition fails, the DELTA process cannot proceed to Phase 2 (Evaluate). Report failures and request user input to resolve.

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| ORG-CONTEXT-ONT v3.1.0 | Organisation foundation | `orgctx:` |
| MACRO-ONT v1.0.0 | Macro environment (enterprise+) | `macro:` |
| INDUSTRY-ONT v1.0.0 | Industry context (functional+) | `ind:` |
| VP-ONT v4.0.0 | Product/service landscape | `vp:` |
| RRR-ONT v4.0.0 | Stakeholder role mapping | `rrr:` |
| BSC-ONT v1.0.0 | Financial health context | `bsc:` |
| KPI-ONT v1.0.0 | Metrics identification | `kpi:` |
| EMC-ONT v5.0.0 | PFI instance configuration | `emc:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| JP-DELTA-001 | DiscoveryScope.scale → determines SA tool invocation at Phase 2 |
| JP-DELTA-002 | DiscoveryScope.stakeholders → rrr:ExecutiveRole → Phase 4 audience profiling |
