# PFI-VHF -- Reference Implementation

| Field | Value |
|-------|-------|
| **Type** | Entity |
| **Last Compiled** | 2026-04-06 |
| **Sources** | 2 docs |
| **Cross-Refs** | [GRC](../../../Azlan-EA-AAA/PBS/RESEARCH/entities/grc.md), [PE](../../../Azlan-EA-AAA/PBS/RESEARCH/entities/pe.md) |

---

## Summary

PFI-VHF (Nutrition App) is a nutrition recipe and client management proof-of-concept that serves as the first PFI triad bootstrapped on the PFC platform, validating multi-instance platform delivery via the Hub-and-Spoke architecture (ARCH-CICD-001). It is the reference implementation against which all subsequent PFI deployments are modelled, covering triad repo structure, convention sync, ontology subscription, promotion pipelines, and instance data patterns.

## Key Facts

- VHF is a **nutrition recipe and client management** PoC, purpose-built to validate multi-instance platform delivery -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- VHF is the **first PFI triad bootstrapped**, serving as the reference implementation for all subsequent PFI deployments -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- Architecture follows the **Hub-and-Spoke** pattern (ARCH-CICD-001), with the hub being Azlan-EA-AAA and VHF as a spoke instance -- *Source: [PFI-VHF-Setup-Guide.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Setup-Guide.md)*
- License type is **pfc-enterprise** -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- The triad bootstrap was encoded in a **1156-line script** (`bootstrap-triad.sh`) pushed to the AZLAN-CI-CD master repo -- *Source: [PFI-VHF-Setup-Guide.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Setup-Guide.md)*
- All three repos contain the **full Azlan convention set** plus PFI instance structure, with 28 labels each -- *Source: [PFI-VHF-Setup-Guide.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Setup-Guide.md)*
- Version pinning is set to **"latest"** (auto-accepts every convention sync from azlan-workflow-prod) -- *Source: [PFI-VHF-Setup-Guide.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Setup-Guide.md)*

## Relationships

- **Parent epics**: Epic 31 (#394, Multi-Instance Platform Delivery) and Epic 39 (#562, PFI Strategy Cascade) -- *Source: [PFI-VHF-Setup-Guide.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Setup-Guide.md)*
- **VSOM Master**: Epic 60 Briefing governs platform delivery infrastructure -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- **PFC Triad**: Epic 58 (#837) -- PFC releases will originate from pfc-prod triad -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- **DB Cascade**: Epic 59 (#840) -- VHF will gain per-stage Supabase and promote-db.yml -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- **Freshness audit**: Under monthly KPI-PD-07 governance via Epic 60 (#859) -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*

## Architecture

### Triad Structure

| Tier | Repo | Branch Mode | Board |
|------|------|-------------|-------|
| Dev | pfi-vhf-nutrition-app-dev | solo (0 reviews, no force push) | #36 |
| Test | pfi-vhf-nutrition-app-test | team (1 review, dismiss stale, enforce admins) | #37 |
| Prod | pfi-vhf-nutrition-app-prod | team (1 review, dismiss stale, enforce admins) | #38 |

All three repos are public under `ajrmooreuk`. -- *Source: [PFI-VHF-Setup-Guide.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Setup-Guide.md)*

### Ontology Instances

| Ontology | Role |
|----------|------|
| NUT-ONT (custom) | Nutrition domain -- recipes, ingredients, clients, dietary requirements. Instance data: `nut-vhf-instance-v1.0.0.jsonld` with 12 clients, 5 recipes, full nutrition taxonomy |
| VP-ONT / RRR-ONT | Value proposition and risk-requirement-result alignment |
| EMC-ONT v5.0.0 | Instance configuration with pfiOverrides |
| VE-Series (full) | VSOM, OKR, KPI, BSC strategic cascade |
| Foundation | ORG, ORG-CONTEXT, CTX |

-- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*

### Convention Sync

VHF Prod is registered in `azlan-workflow-prod/promotion/live-repos.json` with ontology subscription to VE-Series, PE-Series, RCSG-Series, Foundation, and Orchestration. The `sync-to-live.yml` workflow includes VHF prod when a tag is pushed. -- *Source: [PFI-VHF-Setup-Guide.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Setup-Guide.md)*

### What VHF Validates About PFC

1. **Triad repo bootstrap** -- 3-repo (dev/test/prod) pattern with branch protection, labels, issue templates, and promotion workflow -- *Source: [PFI-VHF-Setup-Guide.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Setup-Guide.md)*
2. **Convention hub registration** -- automated sync from azlan-workflow-prod to PFI instances -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
3. **Ontology registry integration** -- PFI instance entry in ont-registry-index.json with hubSpokeConfig -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
4. **Instance data pattern** -- custom domain ontology (NUT-ONT) + EMC config + design tokens -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
5. **Promotion pipeline** -- dev-to-test-to-prod promotion via promote.yml -- *Source: [PFI-VHF-Setup-Guide.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Setup-Guide.md)*
6. **Claude Code plugin** -- 6 skills (create-epic, create-feature, create-story, review-hierarchy, setup-project-board, setup-repo) -- *Source: [PFI-VHF-Setup-Guide.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Setup-Guide.md)*

## Current Status

### Completed

- Triad bootstrap (3 repos, conventions, labels, branch protection, Claude Code plugin) -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- Convention hub registration in azlan-workflow-prod -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- Ontology registry entry (hubSpokeConfig) -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- NUT-ONT instance data (12 clients, 5 recipes) -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- EMC instance config with pfiOverrides -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- Epic 1 issue hierarchy on dev board -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*

### Outstanding

- PROMOTION_PAT not set on repos -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- Supabase secrets not set on dev -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- Promotion pipeline not yet tested end-to-end -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- Epic 2 implementation in planning -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- F1.2 (Application Data Model), F1.3 (DB Security/RLS), F1.4 (Core Logic), F1.5 (MVP Dashboard UI) all pending -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*

### Readiness Level

Infrastructure complete. The triad is bootstrapped, registered, and convention-synced. Application development (data model, business logic, UI) has not started. VHF is at **infrastructure readiness**, not application readiness.

## Open Questions

- CRT-ONT and DS-ONT instances are referenced in task scope but not present in the source docs as delivered ontology instances. Their status for VHF is unclear.
- Promotion pipeline has not been tested end-to-end -- the dev-to-test-to-prod flow is wired but unvalidated. -- *Source: [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*
- The ontology registry update was noted as "unstaged" in the setup guide but marked "Done" in the build summary -- status may need reconciliation. -- *Source: [PFI-VHF-Setup-Guide.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Setup-Guide.md), [PFI-VHF-Build-Summary.md](../../../Azlan-EA-AAA/PBS/ARCHITECTURE/PFI-CICD/PFI-VHF-Build-Summary.md)*

## Changelog

| Date | Action | Sources Ingested |
|------|--------|-----------------|
| 2026-04-06 | Initial compilation | PFI-VHF-Setup-Guide.md, PFI-VHF-Build-Summary.md |
