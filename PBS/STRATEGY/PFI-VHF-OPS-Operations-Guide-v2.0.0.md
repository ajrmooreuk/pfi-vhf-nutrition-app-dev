# PFI-VHF-OPS: Operations Guide

**Product Code:** PFI-VHF
**Document Type:** OPS — Operations Guide
**Version:** v2.0.0
**Date:** 2026-04-10
**Status:** Active
**Scope:** Deployment, hosting, secrets, monitoring, promotion pipeline
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

## 1. Hosting Overview

| Component | Host | Cost |
|---|---|---|
| Static UI | GitHub Pages (`ajrmooreuk.github.io/pfi-vhf-nutrition-app-dev/`) | Free |
| Database | Supabase (free tier) | Free |
| Auth | Supabase Auth (email/password) | Free |
| Edge Functions | Supabase Edge Functions (Deno) | Free tier |
| AI inference | Anthropic API (claude-sonnet-4-6) | Pay-per-use |

**No Vercel.** The static app runs entirely on GitHub Pages. There is no server-side rendering, no serverless functions on Vercel, no hosting cost beyond the Anthropic API usage for meal plan generation.

---

## 2. Supabase Project

| Field | Value |
|---|---|
| Project name | pfi-vhf-nutrition |
| Organisation | PFC |
| Region | London (eu-west-2) |
| Ref | `qtxoueunjaqefrgadkcc` |
| Dashboard URL | `https://supabase.com/dashboard/project/qtxoueunjaqefrgadkcc` |
| API URL | `https://qtxoueunjaqefrgadkcc.supabase.co` |

### Database

- 17 tables across 6 groups (core, meal planning, shopping, agents, progress, payments)
- RLS enabled on all tables
- Seed data: 1 coach, 12 clients, 30 recipes, 1 generated plan
- Backup: Supabase free tier provides 7-day point-in-time recovery

### Auth

- Provider: email/password (Supabase native)
- Test user: `james@viridian.fitness` / `Viridian2026!`
- No SSO, no social auth configured

---

## 3. Edge Function: generate-meal-plan

| Field | Value |
|---|---|
| Name | `generate-meal-plan` |
| Runtime | Deno (Supabase Edge Functions) |
| Method | POST |
| Input | `{ client_id: string, duration_days?: number }` |
| Secret required | `ANTHROPIC_API_KEY` |
| CORS origins | `ajrmooreuk.github.io`, `localhost:5173`, `127.0.0.1:5173` |

### Deploy

```bash
supabase functions deploy generate-meal-plan --project-ref qtxoueunjaqefrgadkcc
```

### Set API Key

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-... --project-ref qtxoueunjaqefrgadkcc
```

### Verify Secrets

```bash
supabase secrets list --project-ref qtxoueunjaqefrgadkcc
```

### Known Issue

The Edge Function is code-complete and deployed but has **not been tested end-to-end** with a live Anthropic API key. The `ANTHROPIC_API_KEY` secret must be set before the generate button in the Coach Panel will produce results.

---

## 4. Deployment: GitHub Pages

The static app deploys automatically when changes are pushed to `main`. GitHub Pages serves the `application/` directory.

**Production URL:**
`https://ajrmooreuk.github.io/pfi-vhf-nutrition-app-dev/application/browser-viewer.html`

No build step. No CI required for the static app itself — push and it's live.

---

## 5. Promotion Pipeline

The repo uses a promotion workflow to synchronise code across the PFI triad (dev/test/prod).

```bash
# Promote dev to test
gh workflow run promote.yml -f direction=dev-to-test

# Promote dev to prod
gh workflow run promote.yml -f direction=dev-to-prod
```

| Repo | Purpose |
|---|---|
| `ajrmooreuk/pfi-vhf-nutrition-app-dev` | Development (active) |
| `ajrmooreuk/pfi-vhf-nutrition-app-test` | Staging / QA |
| `ajrmooreuk/pfi-vhf-nutrition-app-prod` | Production release |

Promotion has been tested — PRs have been merged on both test and prod repos.

---

## 6. Secrets Management

| Secret | Where | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | Supabase secrets | Claude API access for meal plan generation |
| `PROMOTION_PAT` | GitHub repo secrets (dev) | PAT for cross-repo promotion workflow |
| Supabase `anon` key | Hardcoded in `supabase-client.js` | Client-side API access (safe — RLS enforced) |
| Supabase `service_role` key | Supabase Edge Function env (auto) | Server-side full access in Edge Functions |

The anon key is safe to expose in client-side code because all tables have RLS policies. The service role key is only used within Edge Functions (server-side).

---

## 7. CORS

The Edge Function explicitly allows these origins:

- `https://ajrmooreuk.github.io` (production)
- `http://localhost:5173` (local dev)
- `http://127.0.0.1:5173` (local dev)

If the static app is served on a different port locally (e.g. `python -m http.server 8080`), Edge Function calls will fail with CORS errors. For local testing of Edge Functions, use port 5173 or update the CORS list in `supabase/functions/generate-meal-plan/index.ts`.

---

## 8. Monitoring

| What | Where |
|---|---|
| Edge Function logs | Supabase Dashboard → Edge Functions → generate-meal-plan → Logs |
| DB queries | Supabase Dashboard → SQL Editor or Table Editor |
| Auth events | Supabase Dashboard → Authentication → Users |
| GitHub Pages deploys | GitHub repo → Actions tab → `pages-build-deployment` |
| Promotion runs | GitHub repo → Actions tab → `promote.yml` |

There is no application-level logging, error tracking (Sentry), or uptime monitoring configured. For a single-coach app on free tier, Supabase dashboard monitoring is sufficient.

---

## 9. Incident Response

Given the current scale (1 coach, 12 clients, free tier), incident response is manual:

1. **App not loading:** Check GitHub Pages deployment status in Actions tab
2. **Auth failing:** Check Supabase Auth dashboard for user status
3. **Data missing:** Check RLS policies, verify coach `auth_user_id` matches
4. **Edge Function failing:** Check Edge Function logs in Supabase dashboard
5. **Plans not generating:** Verify `ANTHROPIC_API_KEY` is set and valid
