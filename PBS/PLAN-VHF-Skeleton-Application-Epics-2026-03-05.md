# VHF Application Framework — Epic & Feature Plan

**Date:** 2026-03-05
**Version:** 1.0.0
**Status:** Draft — Pending Review
**Repo:** `ajrmooreuk/VHF-App-Mk3`
**Scope:** PFI-VHF skeleton application framework, zone-based UI, design token bridge, `.pen` artefacts
**Parent Strategy:** Azlan Epic 34 (#518) — PF-Core Graph-Based Agentic Platform Strategy
**Upstream Prioritisation:** `Azlan-EA-AAA/PBS/STRATEGY/PRIORITISATION-Epics-and-Strategy-Alignment-2026-03-05.md`
**Governing Ontologies:** DS-ONT v3.0.0, NUT-ONT (proposed), EMC-ONT v5.0.0, EFS-ONT v2.0.0

---

## 1. Executive Summary

VHF-App-Mk3 delivered Epic 1 (30-Day Meal Plan Generator) — 4 Claude Code skills, 12 test personas, 30 recipes, validated first plan output (tp-001 Sarah Mitchell). The repo also holds comprehensive design documentation (45+ docs), design tokens v3.0, and a DS-ONT instance with 118 tokens extracted from Figma.

**What's missing is the application itself.** There is no skeleton framework, no zone-based UI, no browser viewer, no runtime token rendering, and no `.pen` design artefacts. Generated plans output as static HTML/JSON-LD with hardcoded styling.

**This plan bridges VHF into the PFC skeleton-driven application framework** — the same architecture proven in the Azlan visualiser (22 zones, 10 nav layers, 62 actions, 25 zone components, 4-tier EMC cascade). VHF becomes the **first PFI instance to deliver a standalone skeleton-driven web application** outside the visualiser.

### What This Enables

- **For Coach James Kerby:** A branded, interactive meal plan viewer replacing static HTML output
- **For PFC Platform:** Proof that the skeleton/zone/token cascade works for standalone apps (not just the visualiser)
- **For F49.9 Strategy:** First real implementation of Figma → DS-ONT → Pencil → runtime CSS token flow
- **For Epic 56:** A concrete PFI instance validating the component-led strategy-to-build pipeline

---

## 2. Current State

### 2.1 What Exists (VHF-App-Mk3)

| Layer | Status | Key Artefacts |
|-------|--------|---------------|
| Meal Plan Skills | ✅ Delivered | `/meal-plan`, `/meal-plan-view`, `/meal-plan-html`, `/meal-plan-test` |
| Ontology | ✅ Draft (not OAA) | VHF-RMP-ONT v1.0.0 — 39 entities, Schema.org alignment |
| DS-ONT Instance | ✅ Draft v1.0.0 | 43 primitive + 75 semantic tokens, `Entry-ONT-VHF-DS-001.json` |
| Design Tokens | ✅ v3.0 JSON | Viridian Teal #007c74, PT Sans, full token hierarchy |
| Figma Source | ✅ v1.1 | File key `CWQqQv1fk9SLYjZFQKA2lE` — extracted via Figma MCP |
| Test Data | ✅ Comprehensive | 12 personas, 30 recipes, traceability matrix, 6 gap analyses |
| Architecture Docs | ✅ 45+ documents | HLD v2.0, Ontology Implementation, Figma Architecture, Agent Specs |
| Generated Plan | ✅ 1 plan | tp-001 Sarah Mitchell — 96KB JSON-LD + 75KB HTML |
| GitHub Issues | 4 total | #7 (Epic 1), #8 (F1.1), #9 (F1.2), #5 (Figma palettes) |

### 2.2 What's Missing

| Layer | Gap | Blocks |
|-------|-----|--------|
| App Skeleton JSONLD | No zones, nav layers, actions, zone components | Everything |
| Skeleton Loader | No `parseAppSkeleton`, no cascade merge | UI rendering |
| Browser Viewer HTML | No zone `<div>` framework, no dynamic nav | User interaction |
| Token-to-CSS Bridge | Tokens exist but don't render at runtime | Brand fidelity |
| `.pen` Design Artefacts | Zero Pencil files | Agentic design execution |
| NUT-ONT (OAA v7) | Ontology not OAA-compliant | Registry integration, visualiser |
| EMC InstanceConfiguration | No VHF EMC config | Cascade composition |
| Supabase | Schema designed but not created | Persistence, multi-user |

### 2.3 What VHF Inherits from PFC (Azlan)

| Pattern | Source | VHF Reuse Strategy |
|---------|--------|-------------------|
| DS-ONT v3.0.0 schema | `PE-Series/DS-ONT/ds-v3.0.0-oaa-v6.json` | Schema inherited; VHF creates PFI instance |
| PFI Skeleton Template | `pfi-app-skeleton-template-v1.0.0.jsonld` | Clone → customise with VHF zones |
| App Skeleton Loader | `app-skeleton-loader.js` (F40.13) | Port parsing + cascade merge patterns |
| Dynamic Nav Bar | `renderDynamicNavBar()` (F40.20) | Inherit; add L4-VHF nav items |
| Token Extraction | PE-DS-EXTRACT-001 v2.2.0 | Re-extract VHF tokens to v3.0 schema |
| EMC Cascade | 4-tier merge (PFC→PFI→Product→App) | VHF is a PFI-tier override |
| Zone Types | Fixed, Floating, Sliding, Overlay, Conditional | Reuse type system; define VHF-specific zones |

---

## 3. Cross-Project Dependencies

```
Azlan Epic 50 (#748)  NUT-ONT Ontology Conversion  ──→  VHF Epic 3 (Ontology Integration)
Azlan Epic 8  (#80)   Design-Director DS-ONT        ──→  VHF Epic 4 (Token Bridge)
Azlan Epic 10A (#127) Security MVP Supabase          ──→  VHF Epic 8 (Supabase)
Azlan Epic 56 (TBD)   Strategy-to-Build Pipeline     ──→  VHF = proof-of-concept PFI instance
VHF   Epic 1  (#7)  ✅ Meal Plan Skills              ──→  VHF Epic 5 (Meal Plan UI data source)
```

**Critical dependency:** Azlan Epic 50 (NUT-ONT) must deliver F50.1–F50.3 before VHF Epic 3 can fully complete. However, VHF Epics 2, 4, 5 can proceed independently using existing VHF-RMP-ONT as interim data source.

---

## 4. Epic & Feature Plan

---

### Epic 2: VHF Application Skeleton & Zone Framework
**Priority:** P1 — Critical Path
**Estimated Stories:** 8
**Depends On:** DS-ONT v3.0.0 schema (available), PFI skeleton template (available)

> Foundation epic. Every subsequent epic renders into the zones defined here.

| Feature | Title | Est. Stories | Description |
|---------|-------|:------------:|-------------|
| **F2.1** | VHF App Skeleton JSONLD | 2 | Create `vhf-app-skeleton-v1.0.0.jsonld` from PFI template. Define 8 VHF-specific zones + 2 PFC inherited. Define L4-VHF nav items (6 items). Register 12 VHF-specific actions. Conform to DS-ONT v3.0.0 entity schema. |
| **F2.2** | Skeleton Loader & Registry Builder | 2 | Port `app-skeleton-loader.js` — `parseAppSkeleton()`, `mergeSkeletonCascade()`, `buildSkeletonRegistries()`. Fetch PFC base + merge VHF PFI override. `cache:'no-store'` + timestamp bust for GitHub Pages. |
| **F2.3** | Browser Viewer HTML Shell | 2 | Create `browser-viewer.html` with zone `<div>` placeholders matching skeleton. Zero hardcoded buttons. CSS for zone types (fixed, floating, sliding, overlay). Responsive layout. VHF brand header. |
| **F2.4** | Dynamic Nav Bar & Action Wiring | 2 | Render NavItems from skeleton into Z2. Action resolution: `ds:executesAction` → `ds:functionRef` → `window[fn]`. State bindings for toggles. L1–L3 inherited PFC; L4-VHF custom items. |

**Proposed VHF Zone Map:**

| Zone ID | Name | Type | Position | Default Visible | Purpose |
|---------|------|------|----------|:---------------:|---------|
| Z1 | Header | Fixed | top | Yes | VHF brand, client count, version badge |
| Z2 | Navigation | Fixed | top | Yes | L1–L4 nav layers (PFC + VHF) |
| Z-VHF-001 | Dashboard | Fixed | center | Yes | Client overview, plan status cards |
| Z-VHF-002 | Meal Plan Viewer | Sliding | center | No | 30-day plan with week/day drill-down |
| Z-VHF-003 | Client Profile | Sliding | right | No | Health profile, diet types, allergens |
| Z-VHF-004 | Recipe Browser | Sliding | right | No | Filter/search by constraint set |
| Z-VHF-005 | Shopping List | Sliding | right | No | Weekly aisles from plan data |
| Z-VHF-006 | Coach Panel | Sliding | left | No | Plan approval, client management |
| Z-VHF-007 | Quality Dashboard | Sliding | left | No | Compliance, adherence, VSOM alignment |
| Z-VHF-008 | AI Chat | Overlay | right | No | Nutrition advisor agent (future) |

**Proposed L4-VHF Nav Items:**

| Item ID | Label | Type | Action | Target Zone |
|---------|-------|------|--------|-------------|
| nav-L4-vhf-clients | Clients | Button | showClientProfile | Z-VHF-003 |
| nav-L4-vhf-plans | Plans | Button | showMealPlanViewer | Z-VHF-002 |
| nav-L4-vhf-recipes | Recipes | Button | showRecipeBrowser | Z-VHF-004 |
| nav-L4-vhf-generate | Generate | Button | openPlanGenerator | Z-VHF-002 |
| nav-L4-vhf-coach | Coach | Button | showCoachPanel | Z-VHF-006 |
| nav-L4-vhf-chat | Chat | Toggle | toggleNutritionChat | Z-VHF-008 |

**Files Created:**
- `application/vhf-app-skeleton-v1.0.0.jsonld`
- `application/app-skeleton-loader.js`
- `application/browser-viewer.html`
- `application/css/viewer.css`
- `application/js/dynamic-nav.js`

---

### Epic 3: NUT-ONT Integration & OAA Compliance
**Priority:** P1 — Critical Path (parallel with Epic 2)
**Estimated Stories:** 6
**Depends On:** Azlan Epic 50 (#748) delivers NUT-ONT v1.0.0

> Brings VHF ontology into the PFC ecosystem. Without this, no visualiser loading, no registry integration, no cross-ontology bridges.

| Feature | Title | Est. Stories | Description |
|---------|-------|:------------:|-------------|
| **F3.1** | NUT-ONT Consumption in VHF | 2 | Once Azlan E50 delivers NUT-ONT, update VHF references from `vhf:` → `nut:` namespace. Load NUT-ONT in browser viewer via registry fetch. Verify graph renders. |
| **F3.2** | EMC InstanceConfiguration for VHF | 2 | Create VHF EMC config following W4M-WWG pattern. `instanceOntologies`: [NUT, VP, RRR, KPI, BSC, EMC, DS]. `requirementScopes`: [PRODUCT, OPERATIONAL]. `maturityLevel`: 1. |
| **F3.3** | Instance Data Migration | 2 | Migrate 12 test personas + 30 recipes from Schema.org → NUT-ONT entity format. Create VP instances (3 problems, 3 solutions, 3 benefits). Create RRR instances with VP-RRR alignment convention. |

**Interim Strategy:** If Azlan E50 is delayed, VHF Epics 2, 4, 5 proceed using existing VHF-RMP-ONT. Epic 3 catches up when NUT-ONT lands.

---

### Epic 4: DS-ONT Token Bridge & Brand Rendering
**Priority:** P2 — High (blocks visual quality, not structure)
**Estimated Stories:** 6
**Depends On:** Epic 2 (skeleton loader exists)

> Connects the 118 Figma-extracted tokens to runtime CSS. Turns the skeleton from wireframe to branded app.

| Feature | Title | Est. Stories | Description |
|---------|-------|:------------:|-------------|
| **F4.1** | DS-ONT Instance Upgrade to v3.0.0 | 2 | Upgrade `vhf-viridian-ds-instance-v1.0.0.jsonld` from DS-ONT v1.0 → v3.0.0 schema. Add Action entities (12), ComponentToken bindings, AppZone references. Update `Entry-ONT-VHF-DS-001.json`. |
| **F4.2** | Token-to-CSS Runtime Bridge | 2 | At skeleton load, generate CSS custom properties from DS-ONT JSONLD: `--ds-color-primary: #007c74`, `--ds-font-family: 'PT Sans'`, `--ds-spacing-md: 1rem` etc. Apply to zones via `ds:tokenOverrides`. Theme mode support (light only initially). |
| **F4.3** | Brand Verification & Token Map Audit | 2 | Side-by-side comparison: Figma source → DS-ONT JSONLD → rendered CSS → visual output. Fix any token drift. Produce audit report. Cross-check against `VHF-NI-App-Mk3-Design-Tokens-v3.0.json`. |

**Key Token Groups:**

| Category | Primitive Count | Semantic Count | Example |
|----------|:--------------:|:--------------:|---------|
| Colors | 18 | 32 | `--ds-color-primary: #007c74` (Viridian Teal) |
| Typography | 8 | 12 | `--ds-font-family: 'PT Sans'` |
| Spacing | 7 | 10 | `--ds-spacing-md: 1rem` |
| Border Radius | 4 | 6 | `--ds-radius-sm: 0.25rem` |
| Surface | 3 | 8 | `--ds-surface-default: #FFFFFF` |
| Border | 2 | 4 | `--ds-border-subtle: #E5E7EB` |
| Text | 1 | 3 | `--ds-text-primary: #1F2937` |

---

### Epic 5: Meal Plan UI — Skeleton Zone Views
**Priority:** P2 — High (core user value)
**Estimated Stories:** 10
**Depends On:** Epic 2 (zones exist), Epic 1 ✅ (data source)

> The reason the app exists. Each zone renders meal plan data from the generated JSON-LD.

| Feature | Title | Est. Stories | Description |
|---------|-------|:------------:|-------------|
| **F5.1** | Dashboard Zone (Z-VHF-001) | 2 | Client overview cards with plan status badges (pending/approved/active). Macro summary tiles. At-a-glance coach view. Data from `test-personas.jsonld` + `generated-plans/*.jsonld`. |
| **F5.2** | Meal Plan Viewer Zone (Z-VHF-002) | 3 | 30-day plan viewer: 4-week block → 7-day week → 4-meal day. Nutrition bars per meal. Recipe names with links. Portion scaling notes. Conditional substitution callouts. Driven by `vhf:weeks[]` array in plan JSONLD. |
| **F5.3** | Recipe Browser Zone (Z-VHF-004) | 2 | Card-based recipe grid. Filter by: diet type (18), allergen exclusion (14), theme (16), cuisine, meal type. Sort by calories, prep time, cost. From `test-recipes.jsonld`. |
| **F5.4** | Shopping List Zone (Z-VHF-005) | 1 | Weekly shopping list grouped by 8 UK supermarket aisles: fresh meat/fish, fruit/veg, chilled/dairy, bakery, tinned/dry, herbs/spices, frozen, world foods. Estimated weekly cost. From `vhf:weeks[].shoppingList`. |
| **F5.5** | Quality Dashboard Zone (Z-VHF-007) | 2 | Coach-facing quality report: constraint compliance %, macro adherence (daily/weekly/30-day with variance), variety score, allergen violations count (must be 0), cost analysis, VSOM alignment checkmarks. From `vhf:qualityReport`. |

**Data Flow:**
```
test-personas.jsonld ──→ Z-VHF-001 (Dashboard), Z-VHF-003 (Client Profile)
test-recipes.jsonld  ──→ Z-VHF-004 (Recipe Browser)
generated-plans/*.jsonld ──→ Z-VHF-002 (Meal Plan), Z-VHF-005 (Shopping), Z-VHF-007 (Quality)
```

---

### Epic 6: Coach Workflow & Plan Lifecycle
**Priority:** P3 — Medium
**Estimated Stories:** 6
**Depends On:** Epic 5 (plan viewer exists)

> Transforms the viewer from read-only display to interactive coach tool.

| Feature | Title | Est. Stories | Description |
|---------|-------|:------------:|-------------|
| **F6.1** | Coach Panel Zone (Z-VHF-006) | 2 | Client list with status badges. Plan approval/rejection actions. Coach notes field. Generate plan button per client. |
| **F6.2** | Plan State Machine | 2 | Lifecycle: `draft` → `pending_review` → `approved` → `active` → `completed`. Status tracked in plan JSONLD `vhf:planStatus`. Coach actions update state. Visual state indicator in Z-VHF-001 dashboard. |
| **F6.3** | Multi-Client Plan Management | 2 | Select client from persona list → trigger plan generation → view multiple saved plans per client. Plan comparison view (side-by-side week summaries). Plan archive. |

---

### Epic 7: Pencil (`.pen`) Design Artefacts
**Priority:** P3 — Medium
**Estimated Stories:** 5
**Depends On:** Epic 2 (skeleton exists), F49.9 strategy
**Reference:** `Azlan-EA-AAA/PBS/STRATEGY/BRIEFING-F49.9-Figma-Pencil-Design-Tooling-Strategy.md`

> Per F49.9: Figma = human design source of truth; Pencil = agentic design execution engine. `.pen` files are git-native design artefacts.

| Feature | Title | Est. Stories | Description |
|---------|-------|:------------:|-------------|
| **F7.1** | `.pen` Convention & Folder Structure | 1 | Establish `PBS/DESIGNS/` folder. Naming convention: `vhf-{zone}-{version}.pen`. Document convention in `PBS/DESIGNS/CONVENTION-PEN-FILES.md`. |
| **F7.2** | Skeleton → `.pen` Zone Wireframes | 2 | Auto-generate `.pen` wireframes from `vhf-app-skeleton-v1.0.0.jsonld` — each zone as a frame with correct positioning, placeholder content, VHF Viridian brand tokens applied. |
| **F7.3** | Token Verification in `.pen` | 2 | Apply DS-ONT v3.0 semantic tokens to `.pen` designs. Verify Viridian brand renders correctly in Pencil editor. Cross-check primary (#007c74), secondary (#f16a21), typography (PT Sans). |

---

### Epic 8: Supabase Persistence & Security
**Priority:** P4 — Deferred
**Estimated Stories:** 8
**Depends On:** Azlan Epic 10A (#127, Security MVP patterns), Epic 5 (UI proven)

> Infrastructure layer. Deferred until the skeleton-driven UI is validated with file-based data.

| Feature | Title | Est. Stories | Description |
|---------|-------|:------------:|-------------|
| **F8.1** | Supabase Schema for Plans | 2 | `meal_plans` table: JSONB `plan_data`, `client_id` FK, `status` enum, `coach_id`, `created_at`. RLS: coach sees own clients only. Aligns with Azlan `pfc_nodes` pattern. |
| **F8.2** | Client Profile Persistence | 2 | `clients` table: JSONB `health_profile`, `diet_types[]`, `allergens[]`, `macro_targets`. Seed from `test-personas.jsonld`. Auth integration via Supabase Auth. |
| **F8.3** | Recipe Database | 2 | `recipes` table: JSONB `nutrition`, `diet_suitability[]`, `allergen_exclusions[]`, `themes[]`. Seed from `test-recipes.jsonld`. Support runtime recipe expansion (`gen-` IDs). |
| **F8.4** | `.pen` Artefacts as JSONB | 2 | Per F49.9.5 — `.pen` content stored in `design_artefacts` table. `resolve_cascaded_config()` extends to include `brand_tokens` resolution. |

---

## 5. Dependency Graph

```
                    ┌──────────────────────────────────────────────┐
                    │           Azlan-EA-AAA (PFC Hub)             │
                    │                                              │
                    │  E50 NUT-ONT ─────┐   E8 Design-Dir ────┐  │
                    │  E10A Security ──┐ │   DS-ONT v3.0.0 ──┐ │  │
                    │  E56 Build Pipe ─┼─┼───────────────────┤ │  │
                    └──────────────────┼─┼───────────────────┼─┼──┘
                                       │ │                   │ │
                    ┌──────────────────▼─▼───────────────────▼─▼──┐
                    │           VHF-App-Mk3 (PFI-VHF)             │
                    │                                              │
                    │  Epic 1 ✅ (Skills) ─────────┐              │
                    │                               │              │
                    │  Epic 2 (Skeleton) ──┬──→ Epic 5 (UI Views) │
                    │       │              │         │              │
                    │       ├──→ Epic 4    │    Epic 6 (Workflow)  │
                    │       │   (Tokens)   │         │              │
                    │       │              │    Epic 8 (Supabase)  │
                    │       ├──→ Epic 7    │         ▲              │
                    │       │   (.pen)     │         │              │
                    │       │              │    E10A (Azlan) ──────┘
                    │  Epic 3 (NUT-ONT) ◄──── E50 (Azlan)        │
                    │                                              │
                    └──────────────────────────────────────────────┘
```

---

## 6. Phased Delivery

### Phase 1: Foundation — Skeleton + Ontology (Sprint 1–2)
**Goal:** Browser viewer loads with zones; ontology is OAA-compliant.

| Step | Epic | Feature | Deliverable | Azlan Dep |
|:----:|------|---------|-------------|-----------|
| 1 | E2 | F2.1 | `vhf-app-skeleton-v1.0.0.jsonld` | DS-ONT v3.0 schema |
| 2 | E2 | F2.2 | Skeleton loader + registry builder | — |
| 3 | E2 | F2.3 | `browser-viewer.html` with zone divs | — |
| 4 | E2 | F2.4 | Dynamic nav bar rendering | — |
| 5 | E3 | F3.1 | NUT-ONT consumed in VHF | **E50 F50.1–F50.3** |
| 6 | E3 | F3.2 | EMC InstanceConfiguration | E50 F50.4 |
| 7 | E3 | F3.3 | Instance data migrated | E50 F50.5 |

**Exit Criteria:** `browser-viewer.html` renders all zones. Nav bar works. NUT-ONT loads via registry.

### Phase 2: Brand & Data Views (Sprint 3–4)
**Goal:** Viridian-branded UI with populated meal plan data.

| Step | Epic | Feature | Deliverable | Azlan Dep |
|:----:|------|---------|-------------|-----------|
| 8 | E4 | F4.1 | DS-ONT instance v3.0.0 | DS-ONT v3.0 schema |
| 9 | E4 | F4.2 | Token-to-CSS runtime bridge | — |
| 10 | E5 | F5.1 | Dashboard zone (client cards) | — |
| 11 | E5 | F5.2 | Meal plan viewer (30-day drill-down) | — |
| 12 | E5 | F5.3 | Recipe browser (filters) | — |
| 13 | E5 | F5.4 | Shopping list (aisles) | — |
| 14 | E5 | F5.5 | Quality dashboard | — |
| 15 | E4 | F4.3 | Brand verification pass | — |

**Exit Criteria:** All meal plan data renders in Viridian-branded zones. Token Map verified against Figma.

### Phase 3: Workflow & Design (Sprint 5–6)
**Goal:** Coach James can manage plans interactively. `.pen` artefacts committed.

| Step | Epic | Feature | Deliverable | Azlan Dep |
|:----:|------|---------|-------------|-----------|
| 16 | E6 | F6.1 | Coach panel zone | — |
| 17 | E6 | F6.2 | Plan state machine | — |
| 18 | E6 | F6.3 | Multi-client plan management | — |
| 19 | E7 | F7.1 | `.pen` convention established | F49.9 strategy |
| 20 | E7 | F7.2 | Zone wireframes in `.pen` | — |
| 21 | E7 | F7.3 | Token verification in Pencil | — |

**Exit Criteria:** Coach can generate → review → approve plans for multiple clients. Zone wireframes exist as git-native `.pen` artefacts.

### Phase 4: Persistence (Sprint 7–8, deferred)
**Goal:** Database-backed, production-ready.

| Step | Epic | Feature | Deliverable | Azlan Dep |
|:----:|------|---------|-------------|-----------|
| 22 | E8 | F8.1 | Supabase meal_plans table | **E10A** |
| 23 | E8 | F8.2 | Client profile persistence | E10A |
| 24 | E8 | F8.3 | Recipe database | E10A |
| 25 | E8 | F8.4 | `.pen` artefacts as JSONB | E10A, F49.9.5 |

**Exit Criteria:** All data in Supabase. RLS enforced. File-based JSONLD still works as fallback.

---

## 7. Totals

| Metric | Count |
|--------|-------|
| **New Epics** | 7 (Epic 2–8) |
| **New Features** | 23 (F2.1–F8.4) |
| **Estimated Stories** | 49 |
| **Existing Epics** | 1 (Epic 1 ✅) |
| **Azlan Cross-Dependencies** | 3 (Epic 50, Epic 8, Epic 10A) |
| **VHF-Specific Zones** | 8 (Z-VHF-001 to Z-VHF-008) |
| **PFC Inherited Zones** | 2 (Z1 Header, Z2 Nav) |
| **L4-VHF Nav Items** | 6 |
| **VHF-Specific Actions** | ~12 |
| **Files to Create** | ~8 (skeleton, loader, viewer, CSS, JS, convention doc) |
| **Phase 1 Exit** | Skeleton renders with zones + NUT-ONT loaded |
| **Phase 2 Exit** | Branded meal plan UI with all data views |
| **Phase 3 Exit** | Coach workflow + `.pen` artefacts |
| **Phase 4 Exit** | Supabase persistence, production-ready |

---

## 8. Strategy Alignment

### 8.1 VSOM Mapping (PFI-VHF)

| VSOM Layer | VHF Application | Epic |
|------------|----------------|------|
| **Vision** | AI-augmented clinical nutrition coaching at scale | All |
| **Strategy S1** (Graph-First) | NUT-ONT + EMC cascade composition | Epic 3 |
| **Strategy S2** (VE-Driven) | VSOM at individual client level (goal → diet → macros → adherence) | Epic 5, 6 |
| **Strategy S3** (Agentic) | Meal planner agent, nutrition advisor agent | Epic 1 ✅ |
| **Strategy S4** (Instance+Client) | PFI-VHF skeleton override, VHF brand tokens | Epic 2, 4 |
| **Strategy S5** (Figma Make) | Figma source of truth + Pencil execution engine | Epic 7 |
| **Strategy S6** (Integration+EA) | Supabase persistence, cross-repo registry | Epic 8 |

### 8.2 F49.9 Alignment (Figma vs Pencil)

| F49.9 Principle | VHF Implementation |
|-----------------|-------------------|
| Figma = human design authority | `CWQqQv1fk9SLYjZFQKA2lE` remains canonical |
| Pencil = agentic execution | `.pen` wireframes from skeleton (F7.2) |
| Token bridge | DS-ONT v3.0 upgrade (F4.1) → CSS (F4.2) → `.pen` (F7.3) |
| Git-native artefacts | `.pen` files in `PBS/DESIGNS/`, committed to VHF repo |

### 8.3 Azlan Prioritisation Alignment

| Azlan Tier | Relevance to VHF |
|------------|-----------------|
| **Tier 1 P1.4** (Design-Director) | VHF Epic 4 consumes DS-ONT + Design Director patterns |
| **Tier 1 P1.5** (Epic 56 Build Pipeline) | VHF is the proof-of-concept PFI instance for component-led build |
| **Tier 2 P2.4** (WWG DS-ONT extraction) | Parallel PFI — proves same token bridge pattern |
| **Tier 3 P3.5** (NUT-ONT) | Direct dependency for VHF Epic 3 |

### 8.4 PFI Instance Readiness Progression

| Phase | Maturity Level | Description |
|-------|:--------------:|-------------|
| Current (Epic 1 only) | 0–1 (PoC) | Skills work, no application framework |
| After Phase 2 | **2 (MVP)** | Skeleton-driven UI, branded, data-populated |
| After Phase 3 | **2+ (MVP+)** | Coach workflow, `.pen` artefacts, interactive |
| After Phase 4 | **3 (Production)** | Supabase persistence, RLS, multi-user |

---

## 9. Risk Register

| # | Risk | Impact | Likelihood | Mitigation |
|---|------|--------|:----------:|------------|
| R1 | Azlan E50 delayed → VHF E3 blocked | High | Medium | E2, E4, E5 proceed independently. E3 uses existing VHF-RMP-ONT as interim. |
| R2 | DS-ONT v3.0 → v3.1 schema changes | Medium | Low | Pin VHF instance to v3.0.0. Upgrade path via F4.1. |
| R3 | Recipe pool gaps (6 identified) | Medium | High | `/meal-plan` generates at runtime. Expand `test-recipes.jsonld` in parallel. |
| R4 | Skeleton portability (visualiser → standalone) | Medium | Medium | PFI template exists and is proven. VHF is first standalone test — may surface edge cases. |
| R5 | Supabase schema drift from Azlan patterns | Low | Low | Follow E10A conventions. Shared migration patterns. |
| R6 | Figma MCP token extraction breaks | Low | Low | Tokens already extracted. Re-extraction is incremental (PE-DS-EXTRACT-001 v2.2.0). |

---

## 10. Test Strategy

### 10.1 Per-Epic Validation

| Epic | Test Approach |
|------|--------------|
| E2 (Skeleton) | Skeleton loads without errors. All zones render. Nav items resolve to actions. PFC merge doesn't overwrite VHF items. |
| E3 (NUT-ONT) | OAA audit passes G1–G8, G20–G23. NUT-ONT renders in visualiser. EMC composition constrains correctly. |
| E4 (Tokens) | All 118 tokens generate CSS custom properties. Visual match to Figma source. No unresolved token references. |
| E5 (UI Views) | All 12 personas load. Plan data renders in meal plan viewer. Recipe filters return correct subsets. Shopping list matches plan. Quality report matches plan `vhf:qualityReport`. |
| E6 (Workflow) | Plan state transitions work (draft → approved). Multi-plan per client. Coach actions produce correct state changes. |
| E7 (.pen) | `.pen` files open in Pencil editor. Tokens apply correctly. Zone frames match skeleton positioning. |
| E8 (Supabase) | CRUD operations work. RLS blocks cross-coach access. Seed data loads correctly. |

### 10.2 Meal Plan Test Matrix (from Epic 1)

The existing `/meal-plan-test` skill provides a 4-phase test matrix across all 12 personas. This remains the data quality validation backbone:

| Phase | Tests | Scope |
|-------|:-----:|-------|
| Phase 1: Data Quality | 12 | All personas — profile completeness, macro arithmetic, conflict detection |
| Phase 2: Recipe Filtering | 9 | Good-data personas — diet compatibility, allergen safety, UK availability |
| Phase 3: Plan Generation | 9 | Good-data personas — 30-day structure, macro adherence, variety, shopping lists |
| Phase 4: Poor Data Rejection | 3 | Poor-data personas — TP-008 (missing data), TP-010 (conflicting diets), TP-012 (wrong units) |

---

## 11. GitHub Issues — Creation Plan

When approved, create the following issues in `ajrmooreuk/VHF-App-Mk3`:

### Epics (7)

| Issue Title | Labels |
|-------------|--------|
| Epic 2: VHF Application Skeleton & Zone Framework | `type:epic`, `priority:high`, `skeleton` |
| Epic 3: NUT-ONT Integration & OAA Compliance | `type:epic`, `ontology` |
| Epic 4: DS-ONT Token Bridge & Brand Rendering | `type:epic`, `design-system` |
| Epic 5: Meal Plan UI — Skeleton Zone Views | `type:epic`, `priority:high`, `ui` |
| Epic 6: Coach Workflow & Plan Lifecycle | `type:epic`, `workflow` |
| Epic 7: Pencil Design Artefacts | `type:epic`, `design-system` |
| Epic 8: Supabase Persistence & Security | `type:epic`, `infrastructure` |

### Features (23)

| Issue Title | Parent | Labels |
|-------------|--------|--------|
| F2.1: VHF App Skeleton JSONLD | Epic 2 | `enhancement`, `skeleton` |
| F2.2: Skeleton Loader & Registry Builder | Epic 2 | `enhancement`, `skeleton` |
| F2.3: Browser Viewer HTML Shell | Epic 2 | `enhancement`, `skeleton` |
| F2.4: Dynamic Nav Bar & Action Wiring | Epic 2 | `enhancement`, `skeleton` |
| F3.1: NUT-ONT Consumption in VHF | Epic 3 | `enhancement`, `ontology` |
| F3.2: EMC InstanceConfiguration for VHF | Epic 3 | `enhancement`, `ontology` |
| F3.3: Instance Data Migration | Epic 3 | `enhancement`, `ontology` |
| F4.1: DS-ONT Instance Upgrade to v3.0.0 | Epic 4 | `enhancement`, `design-system` |
| F4.2: Token-to-CSS Runtime Bridge | Epic 4 | `enhancement`, `design-system` |
| F4.3: Brand Verification & Token Map Audit | Epic 4 | `enhancement`, `design-system` |
| F5.1: Dashboard Zone | Epic 5 | `enhancement`, `ui` |
| F5.2: Meal Plan Viewer Zone | Epic 5 | `enhancement`, `ui` |
| F5.3: Recipe Browser Zone | Epic 5 | `enhancement`, `ui` |
| F5.4: Shopping List Zone | Epic 5 | `enhancement`, `ui` |
| F5.5: Quality Dashboard Zone | Epic 5 | `enhancement`, `ui` |
| F6.1: Coach Panel Zone | Epic 6 | `enhancement`, `workflow` |
| F6.2: Plan State Machine | Epic 6 | `enhancement`, `workflow` |
| F6.3: Multi-Client Plan Management | Epic 6 | `enhancement`, `workflow` |
| F7.1: `.pen` Convention & Folder Structure | Epic 7 | `enhancement`, `design-system` |
| F7.2: Skeleton → `.pen` Zone Wireframes | Epic 7 | `enhancement`, `design-system` |
| F7.3: Token Verification in `.pen` | Epic 7 | `enhancement`, `design-system` |
| F8.1: Supabase Schema for Plans | Epic 8 | `enhancement`, `infrastructure` |
| F8.2: Client Profile Persistence | Epic 8 | `enhancement`, `infrastructure` |
| F8.3: Recipe Database | Epic 8 | `enhancement`, `infrastructure` |
| F8.4: `.pen` Artefacts as JSONB | Epic 8 | `enhancement`, `infrastructure` |

**Total: 7 epics + 23 features = 30 GitHub issues**

---

## 12. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-03-05 | PFC Programme | Initial draft — 7 epics, 23 features, 4-phase delivery |

---

*Cross-refs: Azlan PRIORITISATION-Epics-and-Strategy-Alignment-2026-03-05.md, BRIEFING-F49.9-Figma-Pencil-Design-Tooling-Strategy.md, ARCH-Skeleton-Application-Specification-Framework.md, Epic 50 (#748), Epic 56 (proposed)*
