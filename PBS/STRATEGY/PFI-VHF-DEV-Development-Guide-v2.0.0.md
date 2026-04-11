# PFI-VHF-DEV: Development Guide

**Product Code:** PFI-VHF
**Document Type:** DEV — Development Guide
**Version:** v2.0.0
**Date:** 2026-04-10
**Status:** Active
**Scope:** Local development, module ownership, common tasks
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

## 1. Repo Structure

```
pfi-vhf-nutrition-app-dev/
  application/                  ← Production static app (GitHub Pages)
    browser-viewer.html         ← Single-page entry point
    css/viewer.css              ← Styles with DS-ONT token CSS vars
    js/                         ← 8 vanilla ES modules (no bundler)
    vhf-app-skeleton-v1.0.0.jsonld
  supabase/
    migrations/                 ← YYYYMMDDHHMMSS_name.sql (mandatory format)
    functions/generate-meal-plan/ ← Deno Edge Function
  instance-data/
    config/pfi-config.json      ← PFI instance config (version, brand, skills, repos)
    tokens/                     ← DS-ONT Viridian brand tokens (JSONLD)
  app/                          ← Next.js app (NOT production — parked)
  PBS/STRATEGY/                 ← Strategy docs (this directory)
  promotion/                    ← GitHub Actions promote workflows
  scripts/                      ← Utility scripts
```

---

## 2. Local Development

### Run the static app locally

```bash
cd application
python -m http.server 8080
# Open http://localhost:8080/browser-viewer.html
```

No build step. No bundler. No node_modules. The app uses browser-native ES modules with an import map for `@supabase/supabase-js` via esm.sh CDN.

### Login

| Field | Value |
|---|---|
| Email | `james@viridian.fitness` |
| Password | `Viridian2026!` |

This is a real Supabase auth user, not a mock. The account exists in the `pfi-vhf-nutrition` Supabase project.

---

## 3. Supabase Project

| Field | Value |
|---|---|
| Project name | pfi-vhf-nutrition |
| Organisation | PFC |
| Region | London (eu-west-2) |
| Ref | `qtxoueunjaqefrgadkcc` |
| URL | `https://qtxoueunjaqefrgadkcc.supabase.co` |
| Dashboard | `https://supabase.com/dashboard/project/qtxoueunjaqefrgadkcc` |

### Supabase CLI Commands

```bash
# Push migrations to Supabase
supabase db push --project-ref qtxoueunjaqefrgadkcc

# Deploy Edge Functions
supabase functions deploy generate-meal-plan --project-ref qtxoueunjaqefrgadkcc

# Set secrets
supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref qtxoueunjaqefrgadkcc

# List secrets
supabase secrets list --project-ref qtxoueunjaqefrgadkcc
```

---

## 4. Module Ownership

| Module | Owns | Key Exports |
|---|---|---|
| `app.js` | Boot sequence: skeleton → tokens → nav → zones → data → render | None (entry point) |
| `state.js` | Centralised state object: clients, recipes, plans, activeZone, session | `state` |
| `skeleton-loader.js` | Fetches JSONLD, parses zones/nav/actions, renders nav bar | `loadAppSkeleton`, `renderNavFromSkeleton`, `initZoneVisibility` |
| `token-bridge.js` | Reads DS-ONT Viridian tokens, writes CSS custom properties | `initTokenBridge` |
| `nav-actions.js` | Zone switch handlers, action dispatch | `VHF_ACTIONS` |
| `supabase-client.js` | Supabase client init, data fetching | `fetchClients`, `fetchRecipes`, `fetchPlans` |
| `auth.js` | Login form, session listener, sign-out | Auth side effects |
| `admin-overlay.js` | Debug overlay for inspecting state | Dev-only |

---

## 5. Common Tasks

### Add a recipe

**Option A — Supabase Dashboard:**
1. Open the dashboard (link above) → Table Editor → `vhf_recipes`
2. Click "Insert Row" and fill in the fields

**Option B — SQL:**
```sql
insert into vhf_recipes (
  external_id, name, description, cuisine, category,
  calories, protein_g, carbs_g, fat_g,
  ingredients, instructions,
  suitable_diets, excluded_allergens, themes
) values (
  'r-031', 'Grilled Halloumi Salad', 'Mediterranean salad with grilled halloumi',
  'Mediterranean', 'Lunch',
  420, 22, 35, 24,
  array['200g halloumi', '100g mixed leaves', '1 red pepper', '50g olives'],
  'Slice and grill halloumi. Toss with leaves, sliced pepper, and olives.',
  array['vegetarian', 'gluten-free'], array['gluten', 'soya'], array['Mediterranean', 'HighProtein']
);
```

### Generate a meal plan

**Option A — Via Claude Code (free with Max subscription):**
Use the `/meal-plan` skill command in this repo's Claude Code session.

**Option B — Via Edge Function:**
```bash
curl -X POST \
  https://qtxoueunjaqefrgadkcc.supabase.co/functions/v1/generate-meal-plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user-jwt>" \
  -H "apikey: <anon-key>" \
  -d '{"client_id": "<uuid>", "duration_days": 7}'
```

Requires `ANTHROPIC_API_KEY` to be set as a Supabase secret.

### Modify a zone

1. Identify the zone ID (e.g. `Z-VHF-003` for Recipe Browser)
2. Find the rendering code in `app.js` or the relevant zone section in `browser-viewer.html`
3. The zone container is a `<section id="zone-Z-VHF-003">` element
4. Modify HTML/JS, commit, push — GitHub Pages auto-deploys

---

## 6. Environment

| Concern | Detail |
|---|---|
| Build step | None. Vanilla ES modules loaded via `<script type="module">` |
| Bundler | None |
| Package manager | None for static app. Supabase CLI for backend. |
| Import maps | `@supabase/supabase-js` via `https://esm.sh/@supabase/supabase-js@2` |
| Fonts | PT Sans via Google Fonts CDN |
| CSS | Single `viewer.css` with DS-ONT token CSS custom properties |

---

## 7. Git Workflow

- **Branch:** `main` (no feature branches currently)
- **Deploy:** Commit to `main` → GitHub Pages auto-deploys the `application/` directory
- **Promotion:** `gh workflow run promote.yml -f direction=dev-to-test` (or `dev-to-prod`)
- **Migration naming:** Always `YYYYMMDDHHMMSS_name.sql` — never `0NN_*`

---

## 8. Next.js App (`app/`) — Parked

The `app/` directory contains a Next.js application with ~29 files. It builds cleanly but is **not** the production UI. It contains duplicate implementations of the agent layer, Stripe checkout routes, and dashboard pages. It exists as a future upgrade path if the static app outgrows vanilla JS. Do not invest development time here without a deliberate decision.
