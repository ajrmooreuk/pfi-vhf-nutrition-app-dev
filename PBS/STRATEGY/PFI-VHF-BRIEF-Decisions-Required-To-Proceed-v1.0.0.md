# PFI-VHF-BRIEF: Decisions Required to Proceed

**Product Code:** PFI-VHF
**Document Type:** BRIEF — Decision Record
**Version:** v1.0.0
**Date:** 2026-03-09
**Status:** Active — Awaiting Design Director Input
**Scope:** Epics 1–6 · VHF Nutrition Coaching App
**Author:** Design Director + Claude Code
**Related:** [PFI-VHF-STATUS-Epic-1-5-Complete-Status-Report-v1.0.0.md](../PFI-VHF-STATUS-Epic-1-5-Complete-Status-Report-v1.0.0.md)

---

## Summary

The VHF app is live and functional. This document captures the decisions that **must be made before significant further build work** to avoid rework. Each decision has a clear owner (Design Director or Claude Code) and an impact statement.

---

## D1: PAT Secrets — Epic 1 F1.4 (BLOCKED)

**Decision Required:** Set `PROMOTION_PAT` secrets to unblock the CI/CD promotion pipeline.
**Owner:** Design Director (user action — cannot be automated)
**Impact:** Without this, Epic 1 remains open and the `dev → test → prod` promotion pipeline is inoperative.
**Effort:** 15 minutes

### Steps

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Classic
2. Create a new Classic PAT with scopes: `repo` (all), `workflow`
3. Copy the token value
4. For each of the 3 repos (`pfi-vhf-nutrition-app-dev`, `pfi-vhf-nutrition-app-test`, `pfi-vhf-nutrition-app-prod`):
   - Settings → Secrets and Variables → Actions → New repository secret
   - Name: `PROMOTION_PAT` · Value: the PAT copied above
5. Notify Claude Code — Epic 1 F1.4 can then be closed, F1.5 started, Epic 1 closed

**Consequence of not deciding:** Epic 1 stays open indefinitely. No impact on app functionality or GitHub Pages demo.

---

## D2: F5.4 / F5.5 Test & Eval — Accept or Extend?

**Decision Required:** Are F5.4 (Shopping List) and F5.5 (Quality Dashboard) sufficient to close, or do they need additional work?
**Owner:** Design Director
**Deadline:** Before starting Epic 6 (Coach Workflow)

### Current State

| Zone | What Renders | What's Missing |
|------|-------------|----------------|
| F5.4 Shopping List | Aisle-grouped items from plan JSON. Week 1 only. | ✓ Check-off (mark item as bought) — local state only, not persisted |
| F5.5 Quality Dashboard | Constraint compliance %, macro adherence %, variety score %, allergen violations count, estimated weekly cost | None — all 5 metrics render if data present |

### Options

**Option A — Accept as done (recommended)**
Close F5.4 and F5.5 as-is. Shopping list check-off is a UX enhancement, not a blocking requirement. Quality dashboard renders all 5 metrics. Mark both closed.

- Unblocks Epic 5 full close
- Shopping list check-off is a candidate for a new story under Epic 6

**Option B — Add shopping list check-off before closing F5.4**
Add a click-to-toggle "bought" state on shopping items (local state, no persistence). Adds ~2 hours.

**Option C — Full multi-week shopping list with week selector**
Add week selector to shopping list zone (Week 1–4). Adds ~3 hours.

### Recommendation

**Option A** — close F5.4 and F5.5, log check-off as an enhancement story under Epic 6 or new epic.

---

## D3: Epic 3 NUT-ONT Namespace Migration — When?

**Decision Required:** When should Epic 3 (NUT-ONT namespace migration) begin?
**Owner:** Design Director
**Impact:** Currently `vhf:`, `client:`, `recipe:`, `meal:` namespaces used in test data. OAA compliance requires `nut:` namespace. All field accessors in `app.js` and `nav-actions.js` use fallbacks (e.g. `meal.mealType || meal['vhf:mealType']`) to handle both.

### Options

**Option A — Now (before Epic 5 close)**
Migrate all instance data to `nut:` namespace. Update all accessors. Closes OAA debt.
Risk: breaks accessors if any field mapping is wrong. Requires careful diff.

**Option B — After Epic 5 closes (recommended)**
Migrate as Epic 3 F3.3 once all zone renders are confirmed working. This is the logical sequence (2 → 3) from the plan.

**Option C — Post-MVP (before Supabase)**
Defer until Epic 8 database schema is designed. Migrate data format once, in the Supabase schema. Avoids double migration.

### Recommendation

**Option B** — begin Epic 3 after Epic 5 is closed (D2 resolved).

---

## D4: DS-ONT Instance Upgrade (F4.1) — Scope & Priority

**Decision Required:** Is F4.1 (DS-ONT instance upgrade to v3.0.0 schema) needed before Epic 5 closes?
**Owner:** Design Director
**Context:** The current DS-ONT instance (`vhf-viridian-ds-instance-v1.0.0.jsonld`) was created pre-v3.0.0 schema. F4.2 (token bridge) is done and working. F4.1 would add:
- Action entities (12) to the DS-ONT instance
- ComponentToken bindings linking DS-ONT tokens to ZoneComponents
- AppZone references in the instance

### Options

**Option A — Skip F4.1 (recommended for MVP)**
The current DS-ONT instance provides enough tokens for the Viridian brand. The skeleton `ds:tokenOverrides` cover all remaining gaps. F4.3 (brand audit vs Figma) is more valuable.

**Option B — Do F4.1 before F4.3**
Proper order: schema upgrade → audit. Adds ~1 day. Required for full OAA compliance.

**Option C — Fold F4.1 into Epic 7 (Pencil artefacts)**
DS-ONT v3.0.0 schema is closely related to Pencil design artefacts work. Defer to Epic 7.

### Recommendation

**Option A for MVP** — skip or defer F4.1, close Epic 4 after F4.3 brand audit. Log as technical debt.

---

## D5: Client Plan Generation — 11 Missing Plans

**Decision Required:** Generate meal plans for the remaining 11 clients (tp-002 through tp-012)?
**Owner:** Claude Code (can execute) — Design Director authorises
**Context:** Dashboard shows 11 of 12 clients with "No plan" status. This makes the plan viewer, shopping list, and quality dashboard underutilised.

### Impact of No Action

- Dashboard looks 92% empty (plan-wise)
- Cannot test approve/reject/shopping list for most clients
- Weakens the demo for stakeholders

### Options

**Option A — Generate all 11 plans (recommended)**
Claude Code generates 11 JSONLD plans using the same structure as `meal-plan-tp-001-2026-02-26.jsonld`, varied for each client's dietary requirements, macro targets, and allergen exclusions.
Effort: ~2 hours (batch generation with variation per client).

**Option B — Generate 3–4 representative plans**
Cover key diet types (Mediterranean, vegetarian, high-protein, dairy-free). Demonstrates variety without full coverage.

**Option C — Single demo plan (current state)**
Continue with 1 plan. Acceptable for architecture validation, poor for stakeholder demos.

### Recommendation

**Option A** — authorise and Claude Code will generate all 11 plans in a follow-up session.

---

## D6: Figma Token Map Audit (F4.3) — Input Needed

**Decision Required:** Which Figma file to audit for the token verification?
**Owner:** Design Director
**Context:** F4.3 requires comparing Figma source → JSONLD → CSS → visual. The Figma file key referenced in Epic 4 is `CWQqQv1fk9SLYjZFQKA2lE`.

### Questions for Design Director

1. Is `CWQqQv1fk9SLYjZFQKA2lE` the current Viridian VHF Figma file?
2. Are the Figma tokens exported or do they need to be manually extracted?
3. Is `PE-DS-EXTRACT-001 v2.2.0` skill available and should it be run?
4. Any known divergences between the Figma design and current app appearance?

---

## D7: Epic 5 Closure — Confirm F5.4 / F5.5 Scope

**Decision Required:** Formal closure decision on Epic 5.
**Owner:** Design Director

### What's needed to close Epic 5

1. Decision D2 (F5.4/F5.5 accept or extend) → resolved → close F5.4, F5.5
2. Update Epic 5 body with completion status
3. Close GitHub issue #29

### What's NOT needed (already done)

- F5.1 (#43) ✅ closed
- F5.2 (#44) ✅ closed
- F5.3 (#45) ✅ closed

---

## Decision Log

| # | Decision | Date | By | Resolution |
|---|----------|------|----|-----------|
| D1 | PAT secrets setup | — | User | **Pending** |
| D2 | F5.4/F5.5 accept or extend | — | DD | **Pending** |
| D3 | NUT-ONT migration timing | — | DD | **Pending** |
| D4 | DS-ONT F4.1 priority | — | DD | **Pending** |
| D5 | Generate 11 client plans | — | DD | **Pending** |
| D6 | Figma audit file confirmation | — | DD | **Pending** |
| D7 | Epic 5 formal closure | — | DD | **Pending** |

---

## Recommended Decision Order

1. **D2** first → closes F5.4/F5.5 → closes Epic 5 → clean board
2. **D5** → authorise plan generation → Claude Code executes → dashboard populated
3. **D1** → enables promotion pipeline (can be done any time)
4. **D3** → after Epic 5 closes, begin Epic 3 namespace migration
5. **D6** → enables F4.3 brand audit
6. **D4** → resolve before Epic 4 close

---

*Generated: 2026-03-09 · VHF Nutrition Coaching App · `pfi-vhf-nutrition-app-dev`*
