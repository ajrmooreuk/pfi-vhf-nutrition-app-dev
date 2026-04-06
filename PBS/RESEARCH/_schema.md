# PFI-VHF Research Wiki Schema

**Version:** 1.1.0
**Inherited From:** [PFC Research Wiki Schema](https://github.com/ajrmooreuk/Azlan-EA-AAA/blob/main/PBS/RESEARCH/_schema.md)
**Epic:** [Epic 17 (pfc-dev #86)](https://github.com/ajrmooreuk/pfc-dev/issues/86)
**Status:** Active
**Last Updated:** 2026-04-06

---

## Purpose

This schema governs the PFI-VHF Research Wiki — a PFI-instance-scoped compiled knowledge layer. It inherits the PFC wiki schema (page types, structure, lint criteria) and applies it to PFI-VHF's niche domain: B2C Nutrition, Reference PoC Implementation. PFC team can read this wiki for cross-PFI discovery via Farsight. PFI-VHF team writes and curates.

---

## Page Types

| Type | Directory | Purpose | Naming Convention |
|------|-----------|---------|-------------------|
| **Entity** | `entities/` | One page per major entity (product, capability, skill family, ontology) | `{entity-slug}.md` |
| **Concept** | `concepts/` | One page per cross-cutting concept within the PFI niche | `{concept-slug}.md` |
| **Domain** | `domains/` | One page per functional domain or ontology series relevant to PFI | `{domain-slug}.md` |
| **Query** | `queries/` | High-value synthesised answers written back from CAST or manual queries | `{date}-{question-slug}.md` |

---

## Page Structure (All Types)

Every wiki page follows this structure:

    # {Page Title}

    | Field | Value |
    |-------|-------|
    | **Type** | Entity / Concept / Domain / Query |
    | **Last Compiled** | {ISO date} |
    | **Sources** | {count} strategy docs |
    | **Cross-Refs** | [{linked page}]({path}), ... |
    | **Published** | false |
    | **Security Classification** | INTERNAL |
    | **Source Epic** | E17 |

    ---

    ## Summary
    {2-3 sentence compiled summary}

    ## Key Facts
    - Fact — *Source: [{doc-name}]({relative-path})*

    ## Relationships
    {Cross-references to other pages}

    ## Open Questions
    {Gaps or contradictions}

    ## Changelog
    | Date | Action | Sources Ingested |
    |------|--------|-----------------|
    | {date} | Initial compilation | {list} |

---

## Publication Metadata

Three metadata fields enable future external hosting (F17.12). All default to safe values.

| Field | Values | Default | Purpose |
|-------|--------|---------|---------|
| **Published** | `true` / `false` | `false` | Opt-in for external content library |
| **Security Classification** | `PUBLIC` / `INTERNAL` / `CONFIDENTIAL` / `SENSITIVE` | `INTERNAL` | URG-aligned visibility control |
| **Source Epic** | `E17` / `E18` / etc. | `E17` | Content source tracking |

Inherited from [PFC schema v1.1.0](https://github.com/ajrmooreuk/Azlan-EA-AAA/blob/main/PBS/RESEARCH/_schema.md). See PFC schema for full classification rules and tagging guidelines.

---

## Citation Convention

Every factual claim must cite its source: `— *Source: [{doc-name}]({relative-path})*`

Claims without citations flagged by lint as `UNCITED`.

---

## Cross-Reference Convention

Cross-refs use relative links: `[Entity Name](../entities/slug.md)`

Pages with zero cross-refs flagged as `ORPHAN`.

---

## Lint Criteria

| Metric | Target | Lint Flag |
|--------|--------|-----------|
| Coverage | > 80% | `LOW_COVERAGE` |
| Currency (90 days) | > 70% | `STALE` |
| Citation depth | > 3 avg | `SHALLOW` |
| Cross-ref density | > 2 avg | `ORPHAN` |
| Contradiction density | < 5/100 | `CONTRADICTION` |

---

## Immutable Boundaries

| Layer | Mutability | Owner |
|-------|-----------|-------|
| Raw Sources (`PBS/STRATEGY/`) | Immutable | Human-authored |
| Wiki Schema (`_schema.md`) | Co-evolved | Human + LLM (inherits PFC) |
| Wiki Pages | LLM-compiled | LLM writes, human curates |
| Wiki Index (`_index.md`) | Auto-maintained | LLM-generated |
| Wiki Log (`_log.md`) | Append-only | LLM appends |
