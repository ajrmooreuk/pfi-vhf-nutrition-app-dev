# PFI-VHF-PLAN: Forward Plan

**Version:** v1.0.0 · **Date:** 2026-03-09 · **Status:** Active
**Subject to:** [Decisions Required to Proceed](STRATEGY/PFI-VHF-BRIEF-Decisions-Required-To-Proceed-v1.0.0.md)
**Repo:** [`ajrmooreuk/pfi-vhf-nutrition-app-dev`](https://github.com/ajrmooreuk/pfi-vhf-nutrition-app-dev)
**Live demo:** https://ajrmooreuk.github.io/pfi-vhf-nutrition-app-dev/application/browser-viewer.html

---

## Current State

| Epic | Title | Status |
|------|-------|--------|
| Epic 1 | PFI-VHF Hub-and-Spoke Instance Setup | 🔴 Blocked — awaiting D1 (PAT) |
| Epic 2 | VHF Application Skeleton & Zone Framework | ✅ Closed |
| Epic 3 | NUT-ONT Integration & OAA Compliance | ⚪ Not started — awaiting D3 |
| Epic 4 | DS-ONT Token Bridge & Brand Rendering | 🟡 F4.2 done · F4.1, F4.3 pending |
| Epic 5 | Meal Plan UI — Skeleton Zone Views | 🟡 F5.1–5.3 done · F5.4–5.5 awaiting D2 |

---

## Forward Plan — Epics & Features

### Epic 1: PFI-VHF Hub-and-Spoke Instance Setup [#1]
*Blocked. Unblocks on D1 (PAT secrets).*

| Feature | Headline | Gate |
|---------|----------|------|
| F1.3 | Hub registration — register in `ont-registry-index.json` | D1 |
| F1.4 | Secrets & validation — set `PROMOTION_PAT`, test dev→test promotion | **D1 — user action** |
| F1.5 | Instance data & go-live — seed VP data, promote through environments | After F1.4 |

---

### Epic 3: NUT-ONT Integration & OAA Compliance [#27]
*Not started. Begin after Epic 5 closes (D3).*

| Feature | Headline | Gate |
|---------|----------|------|
| F3.1 | NUT-ONT consumption — migrate `vhf:` / `client:` namespace to `nut:` in app accessors | D3 |
| F3.2 | EMC InstanceConfiguration — formal VHF instance config in EMC | F3.1 |
| F3.3 | Instance data migration — migrate all 12 personas + 30 recipes to `nut:` namespace | F3.2 |

---

### Epic 4: DS-ONT Token Bridge & Brand Rendering [#28]
*F4.2 done. F4.1 scope subject to D4.*

| Feature | Headline | Gate |
|---------|----------|------|
| F4.1 | DS-ONT instance upgrade to v3.0.0 — add Action entities, ComponentToken bindings | D4 |
| F4.3 | Brand verification & token map audit — Figma source vs JSONLD vs CSS vs visual | D6 (Figma file) |

---

### Epic 5: Meal Plan UI — Skeleton Zone Views [#29]
*F5.1–5.3 closed. Close F5.4/F5.5 subject to D2.*

| Feature | Headline | Gate |
|---------|----------|------|
| F5.4 | Shopping List Zone — aisle-grouped items; check-off (if Option B selected) | D2 |
| F5.5 | Quality Dashboard Zone — 5 metrics; validate full AC | D2 |
| — | Generate 11 remaining client plans — populate dashboard | D5 |

---

### Epic 6: Coach Workflow & Plan Lifecycle [#30]
*Begins after Epic 5 closes.*

| Feature | Headline |
|---------|----------|
| F6.1 | Coach Panel Zone — client list, plan actions, generate plan trigger |
| F6.2 | Plan state machine — draft → pending → approved → active → completed lifecycle |
| F6.3 | Multi-client plan management — compare plans, bulk actions |

---

### Epic 7: Pencil Design Artefacts [#31]
*P3 — after Epic 6.*

| Feature | Headline |
|---------|----------|
| F7.1 | `.pen` convention & folder structure — VHF design artefact layout |
| F7.2 | Skeleton to `.pen` zone wireframes — zone scaffolding in Pencil |
| F7.3 | Token verification in `.pen` — Viridian brand token map validation |

---

### Epic 8: Supabase Persistence & Security [#32]
*P4 — deferred. No gate until Epic 6 complete.*

| Feature | Headline |
|---------|----------|
| F8.1 | Supabase schema for plans — meal plan table + RLS |
| F8.2 | Client profile persistence — save/load client selections |
| F8.3 | Recipe database — migrate recipes to Supabase |
| F8.4 | `.pen` artefacts as JSONB — design artefact storage |

---

### Epic 9: VE Skill Chain Evaluation & Skill Registry [#58]
*P1 — can run in parallel with Epics 3–5.*

| Feature | Headline |
|---------|----------|
| F9.1 | VSOM Refresh — validate VHF vision + 6 strategies top-down |
| F9.2 | OKR + KPI Validation — ground KPIs in NUT-ONT entities |
| F9.3 | VP Evaluation — validate 4 VP canvases |
| F9.4 | EFS Scope Validation — confirm 8 epics / 35 features is right-sized |
| F9.5 | Skill Registry Integration — register VHF skills in UniRegistry |

---

## Recommended Sprint Order

```
Now         → D2 decision → close F5.4/F5.5 → close Epic 5
            → D5 authorise → generate 11 plans
            → D1 user action (PAT) → unblock Epic 1

Next sprint → Epic 6 (Coach Workflow)
           → Epic 9 F9.1–F9.3 (VE validation, parallel)

Following   → Epic 3 (NUT-ONT migration, D3 resolved)
           → Epic 4 F4.3 (Figma audit, D6 resolved)
           → Epic 7 (Pencil artefacts)

Horizon     → Epic 8 (Supabase, P4)
```

---

*PFI-VHF Forward Plan v1.0.0 · 2026-03-09*
