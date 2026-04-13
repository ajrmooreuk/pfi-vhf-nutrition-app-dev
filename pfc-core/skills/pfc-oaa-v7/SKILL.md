---
name: pfc-oaa-v7
description: Ontology Architect Agent v7.2 — creates, converts, validates, and migrates/removes OAA v7.0.0 compliant ontologies with full quality gates G1-G23, competency questions, namespace governance, and registry integration. Workflow D adds entity lifecycle operations.
argument-hint: "[workflow A|B|C|D] [ontology code or domain name]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-OAA-V7: Ontology Architect Agent Skill v7.2

Systematically create, convert, validate, and manage entity lifecycle for production-grade ontologies following OAA v7.0.0 standards. This skill wraps the OAA v7 system prompt (`PBS/AGENTS/oaa-v7/system-prompt.md`) as an executable Claude Code skill with structured workflow routing, quality gate enforcement, and registry integration.

## Dtree Classification

`SKILL_STANDALONE` — High autonomy (ontology generation, gate validation, registry entry creation), no orchestration dependency, single-concern.

Path: HG-01 PARTIAL (6.1) → HG-03 FAIL (4.0) → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:pfc-oaa-v7`, determine which workflow to run (A, B, C, or D), then execute the corresponding section sequence. All workflows end with artifact generation and registry integration.

---

### Section 1: Workflow Router

Determine the workflow from the user's argument or ask:

| Argument | Workflow | Description |
|----------|----------|-------------|
| `A {domain}` | **New Creation** | Create a new ontology from scratch |
| `B {ONT-CODE}` | **v6 → v7 Conversion** | Convert an existing v6 ontology to v7 |
| `C {ONT-CODE}` | **Interactive Validation** | Validate an existing ontology against v7 gates |
| `D {SOURCE-ONT} {TARGET-ONT} {entity1,entity2,...}` | **Entity Migrate/Remove** | Migrate entities between ontologies, deprecate, or remove |

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

---

### Section 9: Workflow D — Entity Migrate / Deprecate / Remove

**New in v7.2.** Workflow D handles entity lifecycle operations that Workflows A/B/C cannot — moving entities between ontologies, deprecating entities, or removing them entirely.

When Workflow D is selected, determine the sub-operation:

| Sub-Op | Argument | Description |
|--------|----------|-------------|
| `D1` | `D {SOURCE-ONT} {TARGET-ONT} {entities}` | **Migrate** entities from source to target ontology |
| `D2` | `D deprecate {ONT-CODE} {entities}` | **Deprecate** entities within an ontology |
| `D3` | `D remove {ONT-CODE} {entities}` | **Remove** entities from an ontology |

---

#### D1: Entity Migration (between ontologies)

**Step D1.1 — Safety Scan (REQ-OAA-D10)**

Before any modification, scan for references to the entities being migrated:

```bash
# Scan SKILL.md files for entity references
Grep "{source-prefix}:{EntityName}" azlan-github-workflow/skills/ --include="*.md"

# Scan ProcessPath JSONLDs for entity references
Grep "{source-prefix}:{EntityName}" PBS/ --include="*.jsonld" --include="*.json"

# Scan PFI instance data
Grep "{source-prefix}:{EntityName}" PBS/ONTOLOGIES/ontology-library/ --include="*instance*"
```

If references found → **WARN** the user with full list. User must confirm before proceeding. If references are in active skills or ProcessPaths, recommend updating those files as part of the migration.

**Gate D-Q1:** Safety scan complete. User confirmed if references found.

**Step D1.2 — Load Source & Target Ontologies**

```bash
# Load source ontology
Read PBS/ONTOLOGIES/ontology-library/{series}/{SOURCE-ONT}/{source-file}.json

# Load target ontology
Read PBS/ONTOLOGIES/ontology-library/{series}/{TARGET-ONT}/{target-file}.json

# Load registry index
Read PBS/ONTOLOGIES/ontology-library/ont-registry-index.json
```

For each entity to migrate, extract:
- Entity definition (`@id`, `@type`, `rdfs:label`, `rdfs:comment`, `oaa:description`, `oaa:properties`)
- All properties belonging to this entity
- All relationships WHERE this entity is domain or range
- `rdfs:subClassOf` hierarchy (if entity has a parent)
- Competency questions referencing this entity

**Gate D-Q2:** All entities located in source with full definitions extracted.

**Step D1.3 — Re-namespace**

For each entity and its properties/relationships:

1. Change `@id` prefix: `{source-prefix}:{EntityName}` → `{target-prefix}:{EntityName}`
2. Change all property `@id` prefixes similarly
3. Update `rdfs:subClassOf`:
   - If parent entity is ALSO being migrated → keep hierarchy, update prefix
   - If parent entity STAYS in source → create new local parent in target (e.g., `{target-prefix}:MigratedEntity`) — do NOT create cross-ontology inheritance
4. For relationships where migrated entity is the **range** (pointed TO by other entities):
   - Keep the relationship in the SOURCE ontology
   - Change `rangeIncludes` to `{target-prefix}:{EntityName}`
   - Add `"oaa:crossOntologyRef": "{TARGET-ONT}"` to the relationship

**Gate D-Q3:** All entities re-namespaced. subClassOf re-parented. Cross-ontology refs set.

**Step D1.4 — Insert into Target Ontology**

Add to the target ontology:
1. Entity definitions (re-namespaced)
2. Properties (re-namespaced)
3. Internal relationships between migrated entities (re-namespaced)
4. New competency questions for migrated entities (minimum 1 CQ per entity)

Validate the target ontology:
- G2B: No isolated nodes (migrated entities must connect to existing target entities)
- G2C: Single connected component maintained
- G8: Naming conventions (PascalCase/camelCase)
- G20: CQ coverage still >=80%

**Gate D-Q4:** Target ontology valid with migrated entities. G2B/G2C/G8/G20 PASS.

**Step D1.5 — Remove from Source Ontology**

From the source ontology:
1. Remove entity definitions
2. Remove entity properties
3. Remove internal-only relationships (both domain and range were migrated)
4. Update relationships that NOW point cross-ontology (already done in D1.3)
5. Remove competency questions that ONLY referenced removed entities
6. Update entity/relationship counts in metadata

Validate the source ontology:
- G2B: No isolated nodes remain
- G2C: Still a single connected component (or flag if migration broke connectivity)
- G20: CQ coverage still >=80%

**Gate D-Q5:** Source ontology valid post-removal. No orphaned nodes/relationships.

**Step D1.6 — Version Bump & Registry Update**

- **Source ontology:** MAJOR version bump (entity removal = breaking change)
- **Target ontology:** MAJOR version bump (new entity surface = breaking change)
- Update `oaa:moduleVersion`, `version`, `dateModified` on both

Update registry entries:
```bash
# Update source Entry-ONT-{CODE}-001.json
# Update target Entry-ONT-{CODE}-001.json
# Update ont-registry-index.json (bump version, update entry versions)
```

Update unified glossary:
```bash
Read PBS/ONTOLOGIES/ontology-library/unified-glossary-v3.0.0.json
# Update namespace references for migrated entities
```

**Step D1.7 — Full Validation (both ontologies)**

Run ALL gates on BOTH ontologies (Section 7 validation). Both must PASS G1-G8, G20-G23.

Present migration summary:
```
OAA v7.2 — Entity Migration Summary

Source:     {SOURCE-ONT} v{old} → v{new}
Target:     {TARGET-ONT} v{old} → v{new}
Migrated:   {count} entities, {count} properties, {count} relationships
Re-parented: {count} subClassOf references
Cross-refs:  {count} oaa:crossOntologyRef added to source
CQs moved:  {count} competency questions
Gates:       Source G1-G23 PASS | Target G1-G23 PASS
Registry:    v{new-version} (was v{old-version})
Glossary:    {count} entries updated
```

**Gate D-Q6:** Both ontologies PASS all gates. Registry updated. Migration complete.

---

#### D2: Entity Deprecation (within ontology)

For each entity to deprecate, add these optional v7.1.0 fields:

```json
{
  "oaa:deprecated": true,
  "oaa:deprecationDate": "YYYY-MM-DD",
  "oaa:supersededBy": "{prefix}:{ReplacementEntity}",
  "oaa:deprecationNote": "Reason for deprecation"
}
```

Steps:
1. Safety scan (same as D1.1)
2. Add deprecation fields to each entity
3. Add deprecation note to ontology README
4. MINOR version bump (additive metadata, not breaking)
5. Update registry entry
6. Validate G1-G23

---

#### D3: Entity Removal (from ontology)

Steps:
1. Safety scan (same as D1.1) — **HARD BLOCK** if active SKILL.md or ProcessPath references found
2. Remove entity definitions, properties, relationships
3. Clean up orphaned relationships (G2B enforcement)
4. Remove or update competency questions
5. MAJOR version bump (breaking change)
6. Update registry entry and index
7. Update glossary
8. Validate G1-G23

**D3 is destructive.** Always recommend D2 (deprecation) first unless the entity is confirmed unused and removal is intentional.

---

## Error Handling

- **Gate failure:** Fix the failing gate, re-validate, do not proceed until PASS
- **Duplicate detected (G21):** Present to user — recommend reuse/extension over new creation
- **Legacy prefix found:** Auto-migrate to canonical (Workflow B) or reject (Workflow A)
- **Registry conflict:** Halt and ask user — never overwrite existing registry entries silently
