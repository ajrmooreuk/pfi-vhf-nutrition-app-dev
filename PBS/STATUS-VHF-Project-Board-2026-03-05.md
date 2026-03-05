# VHF Nutrition App — Project Status & Action Board

**Date:** 2026-03-05
**Repo:** [`ajrmooreuk/pfi-vhf-nutrition-app-dev`](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev)
**Architecture:** Standalone app — cascade PFC → PFI-VHF → NUT-ONT → Micro-SaaS
**Model:** 80% PFC toolkit leverage, 20% custom (own DB, NUT-ONT specifics, branded UI)

---

## Session Completed (2026-03-05)

| Done | Detail |
|------|--------|
| ✅ | NUT-ONT VHF instance data created — 12 clients, 5 goals, 16 themes, 14 allergens, 18 diets, 5 recipes |
| ✅ | VHF app skeleton JSONLD created — 8 zones, 6 L4 nav items, 12 actions, Viridian brand tokens |
| ✅ | VHF EMC instance updated — `appSkeletonConfig.pfiOverrides` set to skeleton path |
| ✅ | Plan doc updated to v1.1.0 — 80/20 PFC leverage model |
| ✅ | Epic 9 created — VE Skill Chain Evaluation + Skill Registry (5 features) |
| ✅ | 6 issues closed (#4, #6, #14, #19, #20, #21) |
| ✅ | All pushed to Azlan main + VHF dev main |

---

## Epics Overview

| # | Epic | Priority | Status | Features | Open | URL |
|---|------|----------|--------|:--------:|:----:|-----|
| 1 | PFI-VHF Hub-and-Spoke Instance Setup | P0 | **4/5 done** | 5 | 1 | [#1](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/1) |
| 9 | VE Skill Chain Evaluation & Skill Registry | P1 | Not started | 5 | 5 | [#58](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/58) |
| 2 | VHF Application Skeleton & Zone Framework | P1 | Not started | 4 | 4 | [#26](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/26) |
| 3 | NUT-ONT Integration & OAA Compliance | P1 | Not started | 3 | 3 | [#27](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/27) |
| 4 | DS-ONT Token Bridge & Brand Rendering | P2 | Not started | 3 | 3 | [#28](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/28) |
| 5 | Meal Plan UI — Skeleton Zone Views | P2 | Not started | 5 | 5 | [#29](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/29) |
| 6 | Coach Workflow & Plan Lifecycle | P3 | Not started | 3 | 3 | [#30](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/30) |
| 7 | Pencil Design Artefacts | P3 | Not started | 3 | 3 | [#31](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/31) |
| 8 | Supabase Persistence & Security | P4 | Deferred | 4 | 4 | [#32](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/32) |

**Totals:** 9 epics, 35 features, 51 open issues

---

## Immediate Actions (What's Next)

### 🔴 Action Required — User (F1.4 PAT Secrets)

| Story | Action | URL |
|-------|--------|-----|
| S1.4.1 | Create/locate Classic PAT with `repo + workflow` scopes | [#15](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/15) |
| S1.4.2 | Set `PROMOTION_PAT` secret on all 3 VHF repos (dev/test/prod) | [#16](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/16) |
| S1.4.3 | Test promotion dev → test | [#17](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/17) |
| S1.4.4 | Test convention sync & drift detection | [#18](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/18) |

Once F1.4 is done → **close Epic 1** ([#1](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/1)).

### 🟡 Next Sprint — Epic 9 (VE Skill Chain, run before building)

| # | Feature | Purpose | URL |
|---|---------|---------|-----|
| F9.1 | VSOM Refresh | Validate VHF vision + strategies top-down | [#59](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/59) |
| F9.2 | OKR + KPI Validation | Create missing KPI instance, ground in NUT-ONT | [#60](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/60) |
| F9.3 | VP Evaluation | Validate 4 VP canvases against NUT-ONT entities | [#61](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/61) |
| F9.4 | EFS Scope Validation | Confirm 8 epics / 30 features is right-sized | [#62](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/62) |
| F9.5 | Skill Registry Integration | Register 4 VHF skills in UniRegistry + Dtree scores | [#63](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/63) |

### 🟢 Build Phase — Epics 2 + 3 (parallel, after E9 validates scope)

| # | Feature | What It Delivers | URL |
|---|---------|-----------------|-----|
| F2.1 | VHF App Skeleton JSONLD | ✅ **Already created** (`vhf-app-skeleton-v1.0.0.jsonld`) | [#33](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/33) |
| F2.2 | Skeleton Loader & Registry Builder | Port `app-skeleton-loader.js` patterns to VHF | [#34](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/34) |
| F2.3 | Browser Viewer HTML Shell | Zone `<div>` framework, CSS for zone types | [#35](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/35) |
| F2.4 | Dynamic Nav Bar & Action Wiring | L4-VHF nav items render from skeleton | [#36](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/36) |
| F3.1 | NUT-ONT Consumption in VHF | Update refs from `vhf:` → `nut:` namespace | [#37](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/37) |
| F3.2 | EMC InstanceConfiguration | ✅ **EMC config exists** — refine post-E9 | [#38](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/38) |
| F3.3 | Instance Data Migration | Migrate 12 personas + 30 recipes to NUT-ONT format | [#39](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/39) |

---

## Full Feature Board

### Epic 1: Hub-and-Spoke Setup — 4/5 features ✅

| # | Feature | Status | URL |
|---|---------|--------|-----|
| F1.1 | Infrastructure Bootstrap | ✅ Done | [#2](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/2) |
| F1.2 | PFI Instance Structure | ✅ Done | [#3](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/3) |
| F1.3 | Hub Registration | ✅ Done | [#4](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/4) |
| **F1.4** | **Secrets & Validation** | **⚠️ Blocked (PAT)** | [**#5**](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/5) |
| F1.5 | Instance Data & Go-Live | ✅ Done | [#6](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/6) |

### Epic 9: VE Skill Chain & Skill Registry — 0/5

| # | Feature | Status | URL |
|---|---------|--------|-----|
| F9.1 | VSOM Refresh | Pending | [#59](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/59) |
| F9.2 | OKR + KPI Validation | Pending | [#60](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/60) |
| F9.3 | VP Evaluation | Pending | [#61](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/61) |
| F9.4 | EFS Scope Validation | Pending | [#62](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/62) |
| F9.5 | Skill Registry Integration | Pending | [#63](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/63) |

### Epic 2: Application Skeleton — 0/4 (F2.1 artefact created, issue still open)

| # | Feature | Status | URL |
|---|---------|--------|-----|
| F2.1 | VHF App Skeleton JSONLD | Artefact created | [#33](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/33) |
| F2.2 | Skeleton Loader & Registry Builder | Pending | [#34](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/34) |
| F2.3 | Browser Viewer HTML Shell | Pending | [#35](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/35) |
| F2.4 | Dynamic Nav Bar & Action Wiring | Pending | [#36](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/36) |

### Epic 3: NUT-ONT Integration — 0/3

| # | Feature | Status | URL |
|---|---------|--------|-----|
| F3.1 | NUT-ONT Consumption in VHF | Pending | [#37](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/37) |
| F3.2 | EMC InstanceConfiguration | EMC exists, refine | [#38](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/38) |
| F3.3 | Instance Data Migration | Pending | [#39](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/39) |

### Epic 4: DS-ONT Token Bridge — 0/3

| # | Feature | Status | URL |
|---|---------|--------|-----|
| F4.1 | DS-ONT Instance Upgrade to v3.0.0 | Pending — current instance on v1.0.0 | [#40](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/40) |
| F4.2 | Token-to-CSS Runtime Bridge | Pending | [#41](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/41) |
| F4.3 | Brand Verification & Token Map Audit | Pending | [#42](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/42) |

### Epic 5: Meal Plan UI — 0/5

| # | Feature | Status | URL |
|---|---------|--------|-----|
| F5.1 | Dashboard Zone (Z-VHF-001) | Pending | [#43](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/43) |
| F5.2 | Meal Plan Viewer Zone (Z-VHF-002) | Pending | [#44](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/44) |
| F5.3 | Recipe Browser Zone (Z-VHF-004) | Pending | [#45](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/45) |
| F5.4 | Shopping List Zone (Z-VHF-005) | Pending | [#46](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/46) |
| F5.5 | Quality Dashboard Zone (Z-VHF-007) | Pending | [#47](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/47) |

### Epic 6: Coach Workflow — 0/3

| # | Feature | Status | URL |
|---|---------|--------|-----|
| F6.1 | Coach Panel Zone (Z-VHF-006) | Pending | [#48](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/48) |
| F6.2 | Plan State Machine | Pending | [#49](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/49) |
| F6.3 | Multi-Client Plan Management | Pending | [#50](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/50) |

### Epic 7: Pencil Design Artefacts — 0/3

| # | Feature | Status | URL |
|---|---------|--------|-----|
| F7.1 | .pen Convention & Folder Structure | Pending | [#51](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/51) |
| F7.2 | Skeleton → .pen Zone Wireframes | Pending | [#52](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/52) |
| F7.3 | Token Verification in .pen | Pending | [#53](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/53) |

### Epic 8: Supabase Persistence — 0/4 (deferred)

| # | Feature | Status | URL |
|---|---------|--------|-----|
| F8.1 | Supabase Schema for Plans | Deferred (needs E10A) | [#54](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/54) |
| F8.2 | Client Profile Persistence | Deferred | [#55](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/55) |
| F8.3 | Recipe Database | Deferred | [#56](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/56) |
| F8.4 | .pen Artefacts as JSONB | Deferred | [#57](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/57) |

---

## Three Pillars of VHF Registration

| Pillar | Registry | Status | Action |
|--------|----------|--------|--------|
| **Ontologies** | `ont-registry-index.json` | ✅ NUT-ONT registered, instance data created | F3.1-F3.3 refine |
| **Design System** | DS-ONT instance | ⚠️ v1.0.0 schema — needs v3.0.0 upgrade | [F4.1 #40](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/40) |
| **Skills** | `skills-register-index.json` | ❌ 4 VHF skills not registered | [F9.5 #63](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev/issues/63) |

---

## Dependency Graph

```
  F1.4 (PAT) ──→ Close Epic 1
       │
  Epic 9 (VE Skill Chain) ──→ Validates scope before building
       │
  Epic 2 (Skeleton) + Epic 3 (NUT-ONT) ──→ run in parallel
       │                          │
  Epic 4 (Tokens) ←──────────────┘
       │
  Epic 5 (UI Zones) ←── Epic 2 + data from Epic 3
       │
  Epic 6 (Workflow) ←── Epic 5
       │
  Epic 7 (.pen) ←── Epic 2 + Epic 4
       │
  Epic 8 (Supabase) ←── Azlan E10A + Epic 5 proven
```

---

## Artefacts Created This Session

| File | Location | Pushed |
|------|----------|:------:|
| VHF NUT-ONT instance data | `Azlan/PE-Series/NUT-ONT/instance-data/vhf/vhf-nut-instance-v1.0.0.jsonld` | ✅ |
| VHF app skeleton JSONLD | `pfi-vhf-nutrition-app-dev/application/vhf-app-skeleton-v1.0.0.jsonld` | ✅ |
| VHF EMC instance (updated) | `Azlan/Orchestration/EMC-ONT/instance-data/vhf/vhf-emc-instance-v1.0.0.jsonld` | ✅ |
| Plan doc v1.1.0 | `pfi-vhf-nutrition-app-dev/PBS/PLAN-VHF-Skeleton-Application-Epics-2026-03-05.md` | ✅ |
| This status doc | `pfi-vhf-nutrition-app-dev/PBS/STATUS-VHF-Project-Board-2026-03-05.md` | pending |

---

## Noted for Future Scope

- **Pricing Strategy Review** — Add to website; scope as feature or separate epic
- **Tutorial/Training Use** — VHF as reference PFC → PFI → Product instance exemplar for onboarding

---

*Generated 2026-03-05. Full plan: [PLAN-VHF-Skeleton-Application-Epics-2026-03-05.md](./PLAN-VHF-Skeleton-Application-Epics-2026-03-05.md)*
