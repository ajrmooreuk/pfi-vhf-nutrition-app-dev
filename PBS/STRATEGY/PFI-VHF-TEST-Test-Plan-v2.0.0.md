# PFI-VHF-TEST: Test Plan

**Product Code:** PFI-VHF
**Document Type:** TEST — Test Plan
**Version:** v2.0.0
**Date:** 2026-04-10
**Status:** Active
**Scope:** Manual test coverage for static app + Supabase backend
**Author:** Design Director + Claude Code

---

## Document Control

| Field | Value |
|---|---|
| Tier | PFI-VHF |
| Product | VHF Nutrition App |
| Classification | Internal |
| Supersedes | v1.0.0 |

---

## 1. What Has Been Tested

| Area | Status | Notes |
|---|---|---|
| Promotion pipeline (dev-to-test) | Tested | PR merged on test repo |
| Promotion pipeline (dev-to-prod) | Tested | PR merged on prod repo |
| RLS: coach sees own clients | Tested | Authenticated user fetches only their clients |
| Seed data loads | Tested | 1 coach, 12 clients, 30 recipes, 1 plan confirmed in Supabase |
| Login (local) | Tested | email/password via `localhost` |
| Dashboard renders 12 clients | Tested | All client cards visible after login |
| Recipe browser loads 30 recipes | Tested | Search and filter functional |

---

## 2. What Needs Testing

### P1 — Critical Path

| # | Test Case | Prerequisite | Expected Result |
|---|---|---|---|
| T1 | Edge Function end-to-end | `ANTHROPIC_API_KEY` set as Supabase secret | POST with `client_id` returns structured plan, plan saved to `vhf_meal_plans` + days + entries |
| T2 | Login on GitHub Pages | Deployed to GitHub Pages | Login with `james@viridian.fitness` / `Viridian2026!` succeeds, dashboard loads |
| T3 | Generate plan from Coach Panel | T1 passing | Click "Generate 7-Day Plan" for a client, plan appears in Plan Viewer |
| T4 | Approve plan | T3 passing | Click Approve, plan status changes to `approved` in UI and Supabase |
| T5 | Reject plan | T3 passing | Click Reject, plan status changes to `rejected` in UI and Supabase |

### P2 — Functional Coverage

| # | Test Case | Expected Result |
|---|---|---|
| T6 | Plan generation for all 12 clients | Each client gets a valid 7-day plan respecting their macros, diets, allergens |
| T7 | Recipe search | Typing in search box filters recipes by name |
| T8 | Recipe filter by cuisine | Selecting a cuisine shows only matching recipes |
| T9 | Shopping list from plan | Viewing a plan's shopping list shows grouped ingredients |
| T10 | Quality dashboard metrics | Macro adherence %, variety score, allergen compliance shown for active plan |
| T11 | Client profile detail | Clicking a client card shows health profile, macros, allergens, conditions |

### P3 — Edge Cases

| # | Test Case | Expected Result |
|---|---|---|
| T12 | Client with no allergens | Plan generates without allergen constraints |
| T13 | Client with multiple allergens | Plan excludes all listed allergens |
| T14 | Client with no macro targets | Edge Function estimates reasonable targets from profile |
| T15 | Invalid client_id to Edge Function | Returns 404 with descriptive error |
| T16 | No suitable recipes for client | Returns 422 with "No suitable recipes" message |
| T17 | Session expiry | After token expires, app shows login screen |

---

## 3. Manual Test Checklist — Demo Walkthrough

Follow these steps in order for a complete demo verification.

### Pre-requisites

- GitHub Pages deployment is current (push to `main` completed)
- Supabase project is running (check dashboard)

### Steps

| Step | Action | Verify |
|---|---|---|
| 1 | Open `https://ajrmooreuk.github.io/pfi-vhf-nutrition-app-dev/application/browser-viewer.html` | Page loads, login form visible, VHF branding (teal/orange) applied |
| 2 | Enter `james@viridian.fitness` / `Viridian2026!`, click Sign In | Login overlay disappears, dashboard loads |
| 3 | Count client cards on dashboard | 12 client cards visible |
| 4 | Click "Sarah Mitchell" card | Profile panel opens showing health data, BMI, macros, allergens |
| 5 | Click "Recipes" in nav | Recipe browser zone shows, 30 recipes listed |
| 6 | Type "chicken" in search box | Recipes filter to those containing "chicken" in name |
| 7 | Clear search, verify all 30 return | Full list restored |
| 8 | Click "Coach" in nav | Coach Panel zone shows client list with Generate buttons |
| 9 | Click "Sarah Mitchell" in Coach Panel | Sarah's plan loads in Plan Viewer (she has 1 generated plan) |
| 10 | Verify Plan Viewer shows daily meals | 7 days displayed with breakfast/lunch/dinner/snacks and macro totals |
| 11 | Click "Approve" on the plan | Status changes to "Approved" in UI |
| 12 | Click "Shopping List" in nav | Grouped ingredients for the active plan displayed |
| 13 | Click "Quality" in nav | Quality dashboard shows macro adherence, variety score, allergen check |
| 14 | Click "Dashboard" in nav | Returns to 12-client overview |

---

## 4. Automated Testing

**Current state:** No automated tests are configured for the static app. The codebase has no `vitest`, `jest`, or Playwright setup.

### Future plan

| Layer | Tool | Scope |
|---|---|---|
| Unit | Vitest | State management, data transformations, token bridge |
| Integration | Vitest + MSW | Supabase client mocking, Edge Function response handling |
| E2E | Playwright | Full login-to-plan-generation flow on GitHub Pages |

### Blockers

- Static app uses vanilla ES modules with browser import maps — test runner needs compatible module resolution
- Edge Function testing requires Supabase local emulator or live project with API key

---

## 5. RLS Test Matrix

| Table | Policy | Test |
|---|---|---|
| `vhf_coaches` | Coach sees own record | Login as James, verify only James's coach record returned |
| `vhf_clients` | Coach sees own clients | Login as James, verify 12 clients returned (all his) |
| `vhf_recipes` | All authenticated can read | Login as any user, verify 30 recipes returned |
| `vhf_meal_plans` | Coach sees own plans | Login as James, verify only plans for his clients returned |
| `vhf_progress_logs` | Coach sees own clients' logs | Insert a log, verify it appears for James, not for other coaches |
| `vhf_stripe_events` | Service role only | Verify anon/authenticated user gets zero rows |
