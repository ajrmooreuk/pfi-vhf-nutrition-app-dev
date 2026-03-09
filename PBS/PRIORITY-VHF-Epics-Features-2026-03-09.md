# VHF Nutrition App — Priority Board

**Date:** 2026-03-09
**Repo:** `ajrmooreuk/pfi-vhf-nutrition-app-dev`
**Focus:** Build the application — skeleton-first, Figma assets available to inform design

---

## Decision Required: Application Skeleton Input Strategy

The skeleton JSONLD exists (`application/vhf-app-skeleton-v1.0.0.jsonld`) with 8 zones, 6 nav items, 12 actions, and Viridian brand tokens. **But there is no application code yet** — no HTML, no JS, no CSS.

### Option A: Skeleton-First (Code from JSONLD)
Build `browser-viewer.html` + loader + nav directly from the skeleton JSONLD. Zones render as `<div>` containers. Token bridge applies Viridian CSS variables. Figma informs visual polish later.
- **Pro:** Fastest to runnable app. Proven pattern from PFC visualiser.
- **Con:** UI will be functional but plain until token bridge + Figma alignment.

### Option B: Figma-First (Extract → Code → Wire to Skeleton)
Pull current Figma designs (`CWQqQv1fk9SLYjZFQKA2lE`) via Figma MCP → generate component code → wire into skeleton zone framework.
- **Pro:** Pixel-accurate from day one. Design tokens already extracted (118 tokens, v3.0).
- **Con:** Slower start. Risk of Figma designs not matching skeleton zone map.

### Option C: Hybrid (Skeleton Shell + Figma Zone Content)
Build skeleton HTML shell (zones, nav, action wiring) first. Then pull Figma designs per-zone to populate content within each zone container.
- **Pro:** Best of both — structural integrity from skeleton, visual quality from Figma.
- **Con:** Two-step process per zone, but each step is small.

**Recommendation:** Option C — skeleton gives structure, Figma fills it.

---

## Priority 1 — CRITICAL PATH (Build the App)

### Epic 2: Application Skeleton & Zone Framework (#26) — P1
> Everything else renders into these zones. This is the foundation.

| # | Feature | Status | What It Does | Issue |
|---|---------|--------|-------------|-------|
| **F2.1** | VHF App Skeleton JSONLD | **Artefact exists** | 8 zones + 6 nav items + 12 actions defined | [#33](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/33) |
| **F2.2** | Skeleton Loader & Registry Builder | Not started | Port `parseAppSkeleton()` + `buildSkeletonRegistries()` → VHF app | [#34](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/34) |
| **F2.3** | Browser Viewer HTML Shell | Not started | Zone `<div>` framework + CSS for zone types (fixed/sliding/overlay) | [#35](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/35) |
| **F2.4** | Dynamic Nav Bar & Action Wiring | Not started | L4-VHF nav items render from skeleton → actions fire | [#36](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/36) |

**Files to create:** `browser-viewer.html`, `app-skeleton-loader.js`, `css/viewer.css`, `js/dynamic-nav.js`
**Skeleton JSONLD done:** `application/vhf-app-skeleton-v1.0.0.jsonld` (8 zones, 6 nav, 12 actions, Viridian tokens)

### Epic 4: DS-ONT Token Bridge & Brand Rendering (#28) — P1 (parallel)
> Tokens exist (118 extracted from Figma) but don't render at runtime. This makes the app look like VHF.

| # | Feature | Status | What It Does | Issue |
|---|---------|--------|-------------|-------|
| **F4.1** | DS-ONT Instance Upgrade to v3.0.0 | Not started | Upgrade VHF DS instance from v1.0 → v3.0.0 schema | [#40](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/40) |
| **F4.2** | Token-to-CSS Runtime Bridge | Not started | Generate `--ds-color-primary: #007c74` etc. from JSONLD at load | [#41](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/41) |
| **F4.3** | Brand Verification & Token Map Audit | Not started | Figma source → DS-ONT → rendered CSS → visual match | [#42](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/42) |

**Figma file key:** `CWQqQv1fk9SLYjZFQKA2lE` — 118 tokens already extracted (43 primitive + 75 semantic)
**Design docs:** 16 files in `PBS/DESIGN-SYSTEM/` including tokens v3.0 JSON, Figma architecture, brand guidelines

---

## Priority 2 — CORE USER VALUE (Populate the Zones)

### Epic 5: Meal Plan UI — Skeleton Zone Views (#29) — P2
> The reason the app exists. Each zone renders meal plan data from generated JSON-LD.
> **Depends on:** Epic 2 (zones exist), Epic 1 data (12 personas, 30 recipes, 1 generated plan)

| # | Feature | Status | Zone | What It Renders | Issue |
|---|---------|--------|------|----------------|-------|
| **F5.1** | Dashboard Zone | Not started | Z-VHF-001 | Client cards, plan status badges, macro summary | [#43](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/43) |
| **F5.2** | Meal Plan Viewer | Not started | Z-VHF-002 | 30-day plan: 4 weeks → 7 days → 4 meals, nutrition bars | [#44](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/44) |
| **F5.3** | Recipe Browser | Not started | Z-VHF-004 | Card grid, filter by diet/allergen/theme/cuisine | [#45](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/45) |
| **F5.4** | Shopping List | Not started | Z-VHF-005 | Weekly list by 8 UK supermarket aisles | [#46](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/46) |
| **F5.5** | Quality Dashboard | Not started | Z-VHF-007 | Compliance %, macro adherence, variety, allergen violations | [#47](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/47) |

---

## Priority 3 — WORKFLOW & DESIGN

### Epic 6: Coach Workflow & Plan Lifecycle (#30) — P3
> Transforms viewer from read-only to interactive coach tool.
> **Depends on:** Epic 5 (plan viewer exists)

| # | Feature | Status | What It Does | Issue |
|---|---------|--------|-------------|-------|
| **F6.1** | Coach Panel Zone (Z-VHF-006) | Not started | Client list, plan approval/rejection, coach notes | [#48](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/48) |
| **F6.2** | Plan State Machine | Not started | draft → pending_review → approved → active → completed | [#49](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/49) |
| **F6.3** | Multi-Client Plan Management | Not started | Multiple plans per client, comparison view | [#50](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/50) |

### Epic 7: Pencil Design Artefacts (#31) — P3
> `.pen` files as git-native design execution artefacts (per F49.9 strategy).
> **Depends on:** Epic 2 (skeleton), Epic 4 (tokens)

| # | Feature | Status | What It Does | Issue |
|---|---------|--------|-------------|-------|
| **F7.1** | .pen Convention & Folder Structure | Not started | `PBS/DESIGNS/` folder + naming convention | [#51](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/51) |
| **F7.2** | Skeleton → .pen Zone Wireframes | Not started | Auto-generate `.pen` wireframes from skeleton JSONLD | [#52](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/52) |
| **F7.3** | Token Verification in .pen | Not started | Verify Viridian brand renders correctly in Pencil | [#53](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/53) |

---

## Priority 4 — ONTOLOGY & STRATEGY (Can Run in Parallel)

### Epic 3: NUT-ONT Integration & OAA Compliance (#27) — P1 (blocked by Azlan E50)
> Blocked on Azlan Epic 50 (#748) delivering NUT-ONT. Epics 2/4/5 proceed independently.

| # | Feature | Status | What It Does | Issue |
|---|---------|--------|-------------|-------|
| **F3.1** | NUT-ONT Consumption | Not started — **blocked** | Update `vhf:` → `nut:` namespace when E50 lands | [#37](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/37) |
| **F3.2** | EMC InstanceConfiguration | EMC exists, needs refinement | Update VHF EMC config post-E9 validation | [#38](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/38) |
| **F3.3** | Instance Data Migration | Not started | Migrate 12 personas + 30 recipes to NUT-ONT format | [#39](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/39) |

### Epic 9: VE Skill Chain Evaluation (#58) — P1 (strategy validation)
> Originally planned to run BEFORE building. Can run in parallel if we accept scope may adjust.

| # | Feature | Status | What It Does | Issue |
|---|---------|--------|-------------|-------|
| **F9.1** | VSOM Refresh | Not started | Validate VHF vision + strategies top-down | [#59](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/59) |
| **F9.2** | OKR + KPI Validation | Not started | Create missing KPI instance, ground in NUT-ONT | [#60](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/60) |
| **F9.3** | VP Evaluation | Not started | Validate 4 VP canvases against NUT-ONT entities | [#61](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/61) |
| **F9.4** | EFS Scope Validation | Not started | Confirm 8 epics / 30 features is right-sized | [#62](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/62) |
| **F9.5** | Skill Registry Integration | Not started | Register 4 VHF skills in UniRegistry + Dtree | [#63](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/63) |

---

## Priority 5 — DEFERRED

### Epic 1: Hub-and-Spoke Setup (#1) — 4/5 done, blocked on PAT
> F1.4 needs manual PAT creation. Non-blocking for app build.

| # | Feature | Status | Issue |
|---|---------|--------|-------|
| F1.4 | Secrets & Validation | Blocked (PAT) | [#15](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/15)–[#18](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/18) |

### Epic 8: Supabase Persistence (#32) — P4
> Deferred until skeleton UI is proven with file-based data. Needs Azlan E10A.

| # | Feature | Status | Issue |
|---|---------|--------|-------|
| F8.1 | Supabase Schema for Plans | Deferred | [#54](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/54) |
| F8.2 | Client Profile Persistence | Deferred | [#55](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/55) |
| F8.3 | Recipe Database | Deferred | [#56](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/56) |
| F8.4 | .pen Artefacts as JSONB | Deferred | [#57](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/57) |

---

## Figma Assets Available

| Asset | Status | Detail |
|-------|--------|--------|
| Figma file | Exists | Key `CWQqQv1fk9SLYjZFQKA2lE` — v1.1 |
| Design tokens v3.0 | Extracted | `PBS/DESIGN-SYSTEM/VHF-NI-App-Mk3-Design-Tokens-v3.0.json` (118 tokens) |
| Brand guidelines | Documented | `PBS/DESIGN-SYSTEM/viridian-brand-guidelines-v2.md` |
| Figma architecture | Documented | `PBS/DESIGN-SYSTEM/VHF-NI-App-Mk3-Figma-Architecture-v1.0.md` |
| Figma-to-code guide | Documented | `PBS/DESIGN-SYSTEM/VHF-NI-App-Mk3-Figma-to-Code-v1.0.md` |
| Component examples | Documented | `PBS/DESIGN-SYSTEM/viridian-component-usage-examples-v2.md` |
| Mockup PRD | Documented | `PBS/DESIGN-SYSTEM/VHF-Mockup-FigmaMake-PRD-v1.0.md` |

**Key question:** Do we pull Figma designs now via MCP to inform zone content, or build skeleton shell first and layer Figma visuals in at F4.2/F4.3?

---

## Summary — What to Build Next

```
 NOW           ──→  F2.2 Skeleton Loader    ──→  F2.3 Browser Viewer HTML
 (F2.1 done)        F2.4 Dynamic Nav              F4.1 DS-ONT Upgrade
                     (+ Figma pull?)               F4.2 Token-to-CSS Bridge
                                                        │
                                              ──→  F5.1 Dashboard Zone
                                                   F5.2 Meal Plan Viewer
                                                   F5.3 Recipe Browser
                                                   F5.4 Shopping List
                                                   F5.5 Quality Dashboard
```

**Totals:** 9 epics | 35 features | 51 open issues | 0 features completed (excluding E1)

---

*Generated 2026-03-09. Source: [PLAN-VHF-Skeleton-Application-Epics-2026-03-05.md](./PLAN-VHF-Skeleton-Application-Epics-2026-03-05.md), [STATUS-VHF-Project-Board-2026-03-05.md](./STATUS-VHF-Project-Board-2026-03-05.md)*
