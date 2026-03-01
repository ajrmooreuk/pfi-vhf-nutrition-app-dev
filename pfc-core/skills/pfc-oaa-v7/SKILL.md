---
name: pfc-oaa-v7
description: Ontology Architect Agent v7.1 — creates, converts, and validates OAA v7.0.0 compliant ontologies with full quality gates G1-G23, competency questions, namespace governance, and registry integration.
argument-hint: "[workflow A|B|C] [ontology code or domain name]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-OAA-V7: Ontology Architect Agent Skill v7.1

Systematically create, convert, and validate production-grade ontologies following OAA v7.0.0 standards. This skill wraps the OAA v7 system prompt (`PBS/AGENTS/oaa-v7/system-prompt.md`) as an executable Claude Code skill with structured workflow routing, quality gate enforcement, and registry integration.

## Dtree Classification

`SKILL_STANDALONE` — High autonomy (ontology generation, gate validation, registry entry creation), no orchestration dependency, single-concern.

Path: HG-01 PARTIAL (6.1) → HG-03 FAIL (4.0) → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:pfc-oaa-v7`, determine which workflow to run (A, B, or C), then execute the corresponding section sequence. All workflows end with artifact generation and registry integration.

---

### Section 1: Workflow Router

Determine the workflow from the user's argument or ask:

| Argument | Workflow | Description |
|----------|----------|-------------|
| `A {domain}` | **New Creation** | Create a new ontology from scratch |
| `B {ONT-CODE}` | **v6 → v7 Conversion** | Convert an existing v6 ontology to v7 |
| `C {ONT-CODE}` | **Interactive Validation** | Validate an existing ontology against v7 gates |

If no workflow letter is provided, infer from context:
- If the argument matches an existing ontology code in the registry → Workflow B or C
- If the argument is a new domain name → Workflow A
- If ambiguous → ask the user

**Load the OAA v7 system prompt** for full reference:
```
Read PBS/AGENTS/oaa-v7/system-prompt.md
```

**Gate Q1:** Workflow identified and confirmed with user.

---

### Section 2: Discovery & Registry Check

1. **Load the registry index:**
   ```
   Read ontology-library/ont-registry-index.json
   ```

2. **Check for duplicates (G21 pre-screen):**
   - Search registry for ontologies in the same domain
   - Flag any >70% Jaccard similarity with existing ontologies
   - If duplicate detected → recommend reuse or extension, not new creation

3. **Identify target series:**
   - VE-Series (core, VSOM-SA, VSOM-SC)
   - PE-Series
   - RCSG-Series
   - Foundation
   - Orchestration

4. **Workflow B only:** Load the existing v6 ontology file and assess migration scope.

5. **Workflow C only:** Load the target ontology and skip to Section 7 (validation).

**Gate Q2:** Registry checked, no unresolved duplicates, series identified.

---

### Section 3: Competency Analysis (Workflow A only)

Define what the ontology must answer:

1. **Domain scoping:** Identify the business domain, bounded context, and stakeholders
2. **Entity candidates:** List 5-15 candidate entities from domain analysis
3. **Relationship candidates:** Identify key relationships (composition, hierarchy, alignment, measurement)
4. **Business rule candidates:** Identify constraints, invariants, and state transitions
5. **Cross-ontology joins:** Check `join-pattern-registry.json` for existing JP-* patterns with adjacent ontologies

Present competency brief to user:
```
OAA v7 Competency Analysis: {DOMAIN}

Candidate Entities:    {count} ({list})
Candidate Rels:        {count}
Cross-Ontology Joins:  {count} existing JP-* patterns found
Business Rules:        {count} ({error}/{warning}/{info})
Series:                {series-name}
Prefix:                {proposed-prefix}:
```

**Gate Q3:** User confirms entity/relationship scope and proposed prefix.

---

### Section 4: Schema Design & Entity Definition

Follow OAA v7 entity format strictly:

1. **schema.org grounding:** Map each entity to schema.org base class (>=80% alignment target)
2. **Entity definition:** For each entity:
   - `@id`: `{prefix}:{PascalCaseName}` (ENT-01 to ENT-05)
   - `@type`: `rdfs:Class`
   - `rdfs:label`, `rdfs:comment`, `oaa:description` (>=50 chars)
   - `oaa:properties` array with types, required flags, schema.org mappings
3. **Enum definition:** Types/subtypes trees with PascalCase values (ENUM-01 to ENUM-03)
4. **Hub entity:** If applicable, mark the hub entity (HUB-01 to HUB-03, <=15 direct properties)

**Workflow B:** Preserve ALL existing v6 fields. Add v7 mandatory fields non-destructively. Migrate legacy prefixes (pf:→org:, pfc:→kpi:, etc.) and spaced-phrase relationships to camelCase.

**Gate Q4:** All entities follow Style Guide (ENT/HUB/ENUM rules), schema.org alignment >=80%.

---

### Section 5: Relationship Modelling

1. **Internal relationships:** camelCase, verb-object pattern (REL-01 to REL-06)
   - Define domain, range, cardinality, inverse
2. **Cross-ontology relationships:** MUST include `oaa:crossOntologyRef`
   - Use ONLY canonical prefixes from the Namespace Registry
   - Check banned prefix list (pf:, pfc:, ns:, sp:, ca:, cl:, rcsg-fw:)
3. **Join patterns:** Register new JP-{SOURCE}-{TARGET}-{NNN} patterns for any new cross-series joins
4. **VP↔RRR alignment:** If this ontology touches VP or RRR, enforce the standing alignment convention

**Gate Q5:** All relationships valid, cross-refs use canonical prefixes, no banned prefixes.

---

### Section 6: Business Rules & Competency Questions

1. **Business rules** (BR-01 to BR-06):
   - Format: IF {condition} THEN {action}
   - Severity: error (blocks) | warning (flags) | info (advisory)
   - Each rule has description explaining the "why"

2. **Competency questions** (G20 requirement):
   - Minimum 1 CQ per entity (mandatory)
   - 1 CQ per major relationship (recommended)
   - 1 CQ per error-severity business rule (recommended)
   - Format: `@id`, `question`, `targetEntities`, `targetRelationships`, `targetRules`, `expectedAnswer`, `priority` (P0/P1/P2)
   - Coverage target: >=80% = compliant, >=95% = gold

**Gate Q6:** CQ coverage >=80%, all business rules in IF-THEN format with severity.

---

### Section 7: Quality Gate Validation (All Workflows)

Run ALL gates mentally and report results:

**Production Gates (G1-G8):**
| Gate | Check | Result |
|------|-------|--------|
| G1 | Schema Structure (valid JSON-LD) | PASS/FAIL |
| G2 | Relationship Cardinality (domain/range) | PASS/FAIL |
| G2B | Entity Connectivity (no isolated nodes) | PASS/FAIL |
| G2C | Graph Connectivity (single connected component) | PASS/FAIL |
| G3 | Business Rules Format (IF-THEN) | PASS/FAIL |
| G4 | Semantic Consistency (no duplicate entities) | PASS/FAIL |
| G5 | Completeness (metadata fields) | PASS/FAIL |
| G6 | Metadata (version, author, dates, creator) | PASS/FAIL |
| G7 | Schema Properties validation | PASS/FAIL |
| G8 | Naming Conventions (PascalCase/camelCase) | PASS/FAIL |

**v7 Quality Gates:**
| Gate | Check | Result |
|------|-------|--------|
| G8+ | Style Guide Compliance (full) | PASS/ADVISORY |
| G20 | Competency Coverage (>=80%) | PASS/FAIL ({pct}%) |
| G21 | Semantic Duplication (<70% Jaccard) | PASS/WARNING/FAIL |
| G22 | Cross-Ontology Rule Enforcement | PASS/FAIL |
| G23 | Lineage Chain Integrity (VE-Series only) | PASS/FAIL/N-A |

**100% Completeness Gates:**
| Gate | Check | Result |
|------|-------|--------|
| CG1 | Entity Descriptions (100%) | PASS/FAIL |
| CG2 | Relationship Cardinality (100%) | PASS/FAIL |
| CG3 | Business Rules IF-THEN (100%) | PASS/FAIL |
| CG4 | Property Mappings (schema.org or rationale) | PASS/FAIL |
| CG5 | Test Data Coverage (>=5 instances/entity) | PASS/FAIL |
| CG6 | Metadata Completeness | PASS/FAIL |

**All gates must PASS for production status.** Fix any failures before proceeding.

**Gate Q7:** All G1-G8 PASS, all G20-G23 PASS, all CG1-CG6 PASS.

---

### Section 8: Artifact Generation & Registry Integration

Generate all required output files:

1. **Ontology file** (FILE-01):
   ```
   ontology-library/{Series}/{Sub-Series?}/{CODE}-ONT/{name}-ontology-v{semver}-oaa-v7.json
   ```
   Include v7 header with `oaa:schemaVersion`, `oaa:ontologyId`, `oaa:series`, `oaa:complianceLevel`.

2. **Registry entry** (FILE-03):
   ```
   ontology-library/{Series}/{Sub-Series?}/{CODE}-ONT/Entry-ONT-{CODE}-001.json
   ```
   With gate results, compliance status, and cross-references.

3. **Update ont-registry-index.json:**
   - Add ontology to correct series/sub-series `ontologies` array
   - Bump registry version (MINOR for new ontology, PATCH for conversion)
   - Update any PFI `instanceOntologies` arrays if applicable

4. **Instance data** (if applicable):
   ```
   ontology-library/{Series}/{Sub-Series?}/{CODE}-ONT/instance-data/{name}-{context}-instance-v{semver}.json
   ```
   Minimum 5 instances per entity, 60-20-10-10 distribution.

5. **EMC composer integration** (if applicable):
   - Add to `NAME_TO_PREFIX` in `emc-composer.js`
   - Add to `DEPENDENCY_MAP` with upstream dependencies
   - Add to relevant `CATEGORY_COMPOSITIONS` as optional/required tier

6. **Test coverage:**
   - Add namespace resolution tests to `emc-composer.test.js`
   - Add composition constraint tests for relevant categories
   - Run `npx vitest run` from visualiser directory — all tests must pass

Present final summary:
```
OAA v7.1 — Artifact Summary

Ontology:    {CODE}-ONT v{semver} (OAA v7.0.0 compliant)
Series:      {series} / {sub-series}
Entities:    {count}
Rels:        {count}
Rules:       {count} ({error}/{warning}/{info})
CQs:         {count} ({coverage}% coverage)
Gates:       G1-G8 PASS, G20-G23 PASS
Files:       {count} files written
Registry:    v{new-version} (was v{old-version})
Tests:       {total} pass ({new} new)
```

**Gate Q8:** All artifacts written, registry updated, tests green.

---

## Namespace Registry (Quick Reference)

Use ONLY these canonical prefixes — see full list in `PBS/AGENTS/oaa-v7/system-prompt.md`:

| Series | Prefixes |
|--------|----------|
| Orchestration | `emc:` |
| Foundation | `org:` `org-ctx:` `org-mat:` `ctx:` `ga:` |
| VE-Core | `vsom:` `okr:` `vp:` `rrr:` `pmf:` `kpi:` `crt:` |
| VSOM-SA | `bsc:` `ind:` `rsn:` `mac:` `pfl:` `kano:` |
| VSOM-SC | `nar:` `csc:` `cul:` `viz:` |
| PE-Series | `ppm:` `pe:` `efs:` `ea:` `ea-core:` `ea-togaf:` `ea-msft:` `ds:` `cicd:` `lsc:` |
| RCSG-Series | `grc-fw:` `erm:` `mcsb:` `gdpr:` `pii:` `rmf:` `ncsc-caf:` `dspt:` |

**Banned:** `pf:` `pfc:` `ns:` `sp:` `ca:` `cl:` `rcsg-fw:`

## VE Lineage Chain (G23)

```
VSOM → OKR → VP → PMF → EFS
```

Each VE-Series ontology MUST reference upstream and downstream neighbours.

## VP ↔ RRR Alignment (Standing Convention)

```
vp:Problem  → rrr:Risk         (problems are risks)
vp:Solution → rrr:Requirement  (solutions are requirements)
vp:Benefit  → rrr:Result       (benefits are results)
```

## Error Handling

- **Gate failure:** Fix the failing gate, re-validate, do not proceed until PASS
- **Duplicate detected (G21):** Present to user — recommend reuse/extension over new creation
- **Legacy prefix found:** Auto-migrate to canonical (Workflow B) or reject (Workflow A)
- **Registry conflict:** Halt and ask user — never overwrite existing registry entries silently
