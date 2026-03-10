# PFI-VHF-BRIEF: DS Token Map — Component & Typographic Extension via VE Skills Chain

**Product Code:** PFI-VHF
**Document Type:** BRIEF — VE Skills Chain Analysis
**Version:** v1.0.0
**Date:** 2026-03-10
**Status:** Active
**Epic Refs:** Epic 4 F4.3, Epic 7 — DS-ONT Token Bridge & Brand Rendering
**Author:** Design Director + Claude Code
**Related:**
- [PFI-VHF-PLAN-Forward-Plan-v1.0.0.md](../PFI-VHF-PLAN-Forward-Plan-v1.0.0.md)
- [PFC-DSY-BRIEF-App-Skeleton-Component-Framework-PoC-v1.0.0.md](~/Azlan-EA-AAA/PBS/STRATEGY/)
- [PFC-DSY-BRIEF-DS-ONT-Typography-Component-Token-Structure-v1.0.0.md](~/Azlan-EA-AAA/PBS/STRATEGY/)
- DS-ONT v3.1.0 `ds-v3.1.0-oaa-v6.json` (PE-Series ontology library)

---

## 1. The Design Director Inspection Problem

The VHF Admin Overlay (deployed F4.3 tooling, commit 88c67e4) gives the Design Director two runtime inspection views:

1. **CSS Live tab** — every `--ds-*` custom property as computed in the browser, with source badges (Skeleton Override vs DS-ONT Instance)
2. **DS-ONT Source tab** — tokens as defined in `vhf-viridian-ds-instance-v1.0.0.jsonld`, with amber divergence flags where the live CSS deviates from the ontology definition

What the token map currently **cannot show** is anything below the primitive token layer:

| Layer | Currently Mapped | Gap |
|-------|-----------------|-----|
| Primitive tokens (colour scales, spacing, type sizes) | ✅ 33 tokens in TOKEN_REGISTRY | None — complete |
| Semantic tokens (text.primary, surface.default roles) | ✅ Partially — 14 `--ds-surface-*` / `--ds-text-*` vars | Namespacing is flat, not role-tree |
| **Component tokens** (button.primary, card.surface) | ❌ Not defined | Blocked on DS-ONT v4.0.0 |
| **Typographic tokens** (heading.1–6, body, label roles) | ❌ Not defined | Blocked on DS-ONT v3.2.0 |

This briefing analyses how to close those gaps — using the VE skills chain and lifting the production pattern from the Azlan-EA-AAA OAA Visualiser.

---

## 2. Vision Statement

> **Enable the Design Director to inspect, validate, and govern the full VHF Viridian brand token cascade — from DS-ONT ontology definition through to zone-level CSS resolution — using the same admin overlay tooling already deployed on the VHF app and the OAA Visualiser.**

---

## 3. Strategic Context (VE Skills Chain)

### 3.1 VSOM — Why This Matters

| Strategy | Relevance |
|----------|-----------|
| S1 Graph-First Architecture | DS-ONT defines the token graph; VHF renders it. Admin overlay makes the graph inspectable at runtime. |
| S3 Agentic Orchestration | Claude Code generates & validates JSONLD token instances. Token map is the verification surface. |
| S5 UI/UX Figma Make | F4.3 (brand audit) cannot close without a token map that spans all 3 tiers. Figma source → JSONLD → CSS visual chain requires component + typographic layers. |

### 3.2 OKR Connection

| OKR | Connection |
|-----|-----------|
| **OBJ-F1: 100 clients, 12 months** | VHF is the PoC PFI instance. Brand correctness at component token level is a client-demo prerequisite. |
| **OBJ-DS-1: DS-ONT v4.0.0** | Component tokens (ds:UIComponent, ds:ComponentToken) are the primary v4.0.0 deliverable. VHF PoC exercises them first. |

### 3.3 Value Proposition (Kano Analysis)

| Feature | Kano Type | Value |
|---------|-----------|-------|
| Primitive token map (CSS Live tab, deployed) | Basic | Expected. Absent = obvious failure. |
| DS-ONT Source tab with divergence flags | Performance | More completeness = more value linearly. |
| Component token map (button, card, nav) | Excitement | Unexpected at this stage. High DD value — first time zone components become token-inspectable. |
| Typographic token roles (heading.1–6, body, label) | Performance | Directly visible in rendered UI; absence creates text brand debt. |
| WCAG contrast guard in token map | Excitement | Auto-flags accessibility failures at audit time. |

---

## 4. Current OAA Visualiser Pattern — What Exists

The Azlan-EA-AAA OAA Visualiser (Epic 40, F40.18) has already solved several of these problems in production. The following patterns are available to lift directly.

### 4.1 Token Inheritance Engine (`token-inheritance.js`)

The visualiser's `resolveToken()` function implements a **4-tier cascade resolver**:

```
Tier 1 (CORE):      PF-Core immutable — viewer.css :root → locked
Tier 2 (INHERITED): PF-Instance DS semantic → generateCSSVars
Tier 3 (BRAND):     BrandVariant.tokenOverrides → applyBrandOverrides
Tier 4 (LOCAL):     Computed CSS diverges from all known tiers
```

**Function signature:**
```javascript
resolveToken(cssVar, dsToken, defaultHex): ResolutionResult
// → { source, resolvedTier, value, locked, chain[], brandOverride }
```

**What VHF currently has:** Tiers 2+3 (DS-ONT instance + skeleton ZoneComponent overrides).
**What VHF is missing:** Tier 1 (locked PFC-Core tokens), Tier 4 (local divergence detection).

The admin overlay's DS-ONT Source tab approximates Tier 4 via the amber divergence badge, but does not walk the full resolution chain.

### 4.2 Zone Spatial Diagram (`app-skeleton-panel.js`)

The visualiser renders a **CSS Grid mini-wireframe** of all zones via `renderSpatialDiagram()`:

```javascript
_zoneBlock(zoneId, label, extraClass) → HTML div
_zoneTypeClass(zoneType: string) → CSS class: zone-type-fixed | zone-type-sliding | ...
_isZoneVisible(zoneId: string) → boolean (from getVisibleZones() per view mode)
_cascadeTierBadge(tier: string) → HTML badge: PFC | PFI | Product | App
```

The VHF Zone Overlay uses `getBoundingClientRect()` on live DOM elements — more accurate for an active 8-zone app than a mini-wireframe. Both patterns serve different purposes:

| Pattern | Best For |
|---------|----------|
| VHF live overlay (getBoundingClientRect) | Inspecting live zone positions and slide-in states |
| OAA spatial diagram (CSS Grid wireframe) | Structural zone map without needing a live DOM |

**Recommendation:** VHF should add a **Zones tab** to the admin token map panel showing the spatial diagram alongside the live overlay — completing the skeleton inspection picture.

### 4.3 Token Tree (`design-token-tree.js`)

The visualiser's `design-token-tree.js` implements the full zone × token matrix, rendering a collapsible tree per zone with all token groups (surface, text, border, button, indicator). The VHF token map is a flat list — the tree pattern is the upgrade path.

---

## 5. DS-ONT Extension Path — VHF Impact

### 5.1 DS-ONT v3.2.0 — Semantic Colour + Typographic Tokens

**New entities (planned):**

| Entity | Purpose | VHF Impact |
|--------|---------|------------|
| `ds:SemanticColourToken` | Named colour roles: `primary.surface.default`, `status.error.default` | Enables token map to show role → primitive chain |
| `ds:SemanticTypographyToken` | Named type roles: `heading.1–6`, `body`, `label`, `caption` | Unlocks typographic token tab in admin overlay |

**VHF current typography gap:**

The `vhf-viridian-ds-instance-v1.0.0.jsonld` defines:
```
--ds-font-family: PT Sans
--ds-font-size-sm / base / lg / xl / 2xl
--ds-font-weight-medium / bold
```

What it **cannot currently express** (blocked on v3.2.0):
- `heading.1` = `font-size: 2xl, weight: bold, color: primary`
- `body.default` = `font-size: base, weight: normal, color: text.primary`
- `label.small` = `font-size: sm, weight: medium, color: text.secondary`

These are the token types that govern `h1–h3`, zone panel titles, stat card values, client card names — the visible typographic hierarchy the Design Director needs to inspect and verify against Figma.

### 5.2 DS-ONT v4.0.0 — Component Tokens + UIComponent

**New entities (planned, Epic 64 Stream A):**

| Entity | Purpose | VHF Zone Components |
|--------|---------|---------------------|
| `ds:UIComponent` | Resolves `ds:placesComponent` references | `dc-vhf-stat-card`, `dc-vhf-client-card`, `dc-vhf-nav-button` |
| `ds:ComponentToken` | `button.primary`, `card.surface`, `badge.status` — scoped token values | Each zone component carries a token scope |
| `ds:RendererSlotBinding[UI]` | ComponentToken → CSS variable binding for browser rendering | `button.primary` → `--primary` (shadcn slot) |

**shadcn Slot → DS-ONT Semantic Token Mapping (planned):**

| shadcn `--slot` | DS-ONT Semantic Token | VHF CSS Var |
|----------------|----------------------|-------------|
| `--primary` | `primary.surface.default` | `--ds-color-primary` |
| `--primary-foreground` | `neutral.text.inverse` | `--ds-text-on-brand` |
| `--card` | `neutral.surface.elevated` | `--ds-surface-default` |
| `--muted` | `neutral.surface.subtle` | `--ds-surface-muted` |
| `--border` | `neutral.border.subtle` | `--ds-border-default` |
| `--destructive` | `status.error.default` | *(not yet defined)* |

The `--destructive` gap is relevant to VHF: the Reject button in the plan viewer header has no dedicated error token — it uses `#dc2626` inline.

---

## 6. Recommended Feature Additions — VHF Token Map

### Phase 1 (Now, within current admin overlay architecture)

| # | Addition | Effort | Value |
|---|----------|--------|-------|
| 1 | **Zones tab** in token map panel — spatial diagram showing all 8 zones with type + visibility (lift from OAA `_zoneBlock` pattern) | 2h | Design Director gets skeletal zone map without hunting in DOM |
| 2 | **Typographic preview tab** — computed font-size/weight/family for key UI text elements (h1, h2, `.client-name`, `.stat-card-value`) via `getComputedStyle` on real elements | 2h | Closes the "what does heading.1 actually render as?" question |
| 3 | **WCAG contrast check** — for all colour token pairs in CSS Live tab, compute contrast ratio and flag failures | 3h | F4.3 brand audit prereq |

### Phase 2 (After DS-ONT v3.2.0 — adds `ds:SemanticTypographyToken`)

| # | Addition | Gate |
|---|----------|------|
| 4 | **Typography token chain** — DS-ONT Source tab expands to show semantic type roles (`heading.1` → `font-size-2xl` + `weight-bold`) | DS-ONT v3.2.0 instance data |
| 5 | **Token resolution chain view** — click any token in DS-ONT Source tab to see the full 4-tier resolution chain (Tier 1 CORE → Tier 4 LOCAL) | `token-inheritance.js` lift from OAA Visualiser |

### Phase 3 (After DS-ONT v4.0.0 + Epic 64 Stream D VHF PoC)

| # | Addition | Gate |
|---|----------|------|
| 6 | **Component token map** — per-zone component token inspection. Click zone in admin overlay → open component token breakdown | ds:UIComponent + ds:ComponentToken defined for VHF components |
| 7 | **Zone × Token matrix** — full collapsible tree view (lift from `design-token-tree.js`) | Epic 64 Stream D complete |
| 8 | **Brand switch test** — toggle between Viridian and BAIV brand in the admin panel and verify all tokens update | Epic 64 Stream D success criterion 1 |

---

## 7. Lifting the Pattern — Technical Implementation Notes

### 7.1 What to Lift from OAA Visualiser

| Module | Lift Strategy |
|--------|--------------|
| `token-inheritance.js` `resolveToken()` | Extract pure function — no visualiser deps. Drop into VHF as `token-resolver.js`. |
| `app-skeleton-panel.js` `_zoneBlock()` / `_zoneTypeClass()` / `_cascadeTierBadge()` | Pure HTML string helpers — trivial to copy with VHF zone naming. |
| `app-skeleton-panel.js` `renderSpatialDiagram()` | Requires zone CSS Grid layout — needs VHF-specific grid map for 8 zones. |
| `design-token-tree.js` zone × token tree | Heavy — lift tree rendering pattern; replace hardcoded zone tokens with VHF TOKEN_REGISTRY. |

### 7.2 What Not to Lift

| Module | Reason |
|--------|--------|
| Full `app-skeleton-panel.js` | Tightly coupled to OAA 22-zone skeleton and PFC cascade logic. VHF admin overlay is simpler and more focused. |
| `ds-authoring.js` + `ds-codegen.js` | Design authoring/codegen — out of scope for VHF (admin inspect only, no edit). |
| Full `design-token-tree.js` | 80KB — lift the tree render pattern, not the whole module. VHF token set is 33 tokens vs OAA's 200+. |

### 7.3 VHF Token Name → OAA Token Name Mapping

The VHF `--ds-*` prefix maps to the OAA `--viz-*` prefix:

| VHF CSS Var | OAA Equivalent | DS-ONT Semantic Token |
|------------|---------------|----------------------|
| `--ds-color-primary` | `--viz-accent` | `primary.surface.default` |
| `--ds-surface-default` | `--viz-surface-default` | `neutral.surface.default` |
| `--ds-text-primary` | `--viz-text-primary` | `neutral.text.primary` |
| `--ds-border-default` | `--viz-border-default` | `neutral.border.subtle` |
| `--ds-surface-muted` | `--viz-surface-subtle` | `neutral.surface.subtle` |

This mapping is the foundation of the future `ds-css-bridge.mjs` (Epic 64 Stream B) and confirms that VHF's token naming convention is semantically compatible with the OAA visualiser's — the bridge is an alignment step, not a rename.

---

## 8. Decision Required

### D-DSONT-1: When to add WCAG contrast check to token map?

**Recommended:** Phase 1 (now). No DS-ONT extension required — pure CSS computation.
```javascript
// Pseudocode — all values available in CSS Live tab
const contrast = wcagContrastRatio(foreground, background);
const pass = contrast >= 4.5; // AA normal text
```

**Owner:** Design Director — confirm WCAG AA as the target threshold.

### D-DSONT-2: Who drives DS-ONT v3.2.0 (`ds:SemanticTypographyToken`)?

The entity is specified in the Azlan-EA-AAA strategy (Epic 64 F61.12, issue #984). VHF will be a consumer — VHF instance data for semantic typography tokens needs authoring once the entity type is defined.

**Owner:** Claude Code (Azlan-EA-AAA) — implement entity; Design Director (VHF) — author VHF instance data.

### D-DSONT-3: VHF PoC participation in Epic 64 Stream D?

Epic 64 Stream D (from PFC-DSY-BRIEF-App-Skeleton-Component-Framework-PoC-v1.0.0.md) explicitly lists VHF as the PoC instance for component token wiring. This aligns with VHF Epic 7 F7.3 (Token verification in `.pen`).

**Recommendation:** Confirm VHF PoC participation in Epic 64 Stream D as part of Epic 7 scope.

---

## 9. Summary — What the Token Map Reveals Today

When the Design Director opens the DS Token Map panel on the live VHF app, the **DS-ONT Source tab** shows 14 token nodes from the DS-ONT JSONLD. This is a small number — and that is the finding.

The current `vhf-viridian-ds-instance-v1.0.0.jsonld` covers:
- ✅ Colour primitives (5)
- ✅ Surface tokens (4)
- ✅ Typography scale (font-family + 5 sizes + 2 weights = 8)
- ✅ Spacing scale (5)
- ✅ Radius scale (4)
- ✅ Shadow scale (2)
- ❌ Semantic colour roles (0)
- ❌ Typographic roles (0)
- ❌ Component tokens (0)
- ❌ Status/error/warning tokens (0)

The token map's divergence detection will show several amber badges where the `viewer.css` defaults (`:root`) are not yet being overridden by the DS-ONT instance. These are gaps in instance data coverage — and surfacing them is precisely the purpose of the Design Director tooling.

**Next action:** Run F4.3 brand audit using the token map panel, record all divergences and missing tokens, produce a gap report, then sequence the instance data additions against DS-ONT version milestones.

---

*PFI-VHF-BRIEF DS Token Map Component Extension VE v1.0.0 · 2026-03-10*
