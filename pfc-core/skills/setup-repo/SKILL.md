---
name: setup-repo
description: Provisions a GitHub repository with the full Azlan workflow — labels, branch protection, auto-add routing, and registry entry. Use when setting up a new PFI dev repo.
argument-hint: "[owner/repo] [--mode solo|team] [--pfi-id PFI-ID] [--instance-type OWNER_INSTANCE|PRODUCT|CLIENT_SUB_INSTANCE|CLIENT_PFI] [--parent-pfi PFI-ID|null] [--engineering-project-id PVT_...] [--product-project-id PVT_...]"
user-invocable: true
allowed-tools: "Bash(gh *),Bash(./scripts/*),Read,Grep,Glob"
---

# Setup Repository

Provision a GitHub repository with the complete Azlan workflow conventions, including auto-add routing and registry entry with full hierarchy fields.

## What You Do

When the user invokes `/azlan-github-workflow:setup-repo`, follow these steps:

### 1. Parse Arguments

- `$0` = repository in `owner/repo` format (required)
- `--mode` = `solo` or `team` (default: `solo`)
- `--pfi-id` = registry `@id` for this instance (e.g. `PFI-AIRL-CAF-AZA`) — required for registry write
- `--instance-type` = `OWNER_INSTANCE`, `PRODUCT`, `CLIENT_SUB_INSTANCE`, or `CLIENT_PFI`
- `--parent-pfi` = owner PFI `@id` (null for `OWNER_INSTANCE`)
- `--engineering-project-id` = `PVT_...` node ID from `/setup-project-board`
- `--product-project-id` = `PVT_...` node ID from `/setup-project-board`

If `--engineering-project-id` / `--product-project-id` are not provided, `auto-add-to-projects.yml` will be skipped and a warning issued. Run `/setup-project-board` first.

### 2. Create Labels

Run the label setup, creating all standard labels if they don't exist:

```bash
gh label create "type:epic"     --color "BFD4F2" --description "Epic-level customer problem" --repo $REPO 2>/dev/null || true
gh label create "type:feature"  --color "BFD4F2" --description "Feature-level solution capability" --repo $REPO 2>/dev/null || true
gh label create "type:story"    --color "BFD4F2" --description "User story" --repo $REPO 2>/dev/null || true
gh label create "type:pbs"      --color "BFD4F2" --description "PBS Component (Deliverable)" --repo $REPO 2>/dev/null || true
gh label create "type:wbs"      --color "BFD4F2" --description "WBS Task (Work Package)" --repo $REPO 2>/dev/null || true
gh label create "type:registry" --color "BFD4F2" --description "Registry Artifact" --repo $REPO 2>/dev/null || true
gh label create "domain:pf-core" --color "D4C5F9" --description "PF Core domain" --repo $REPO 2>/dev/null || true
gh label create "domain:baiv"    --color "D4C5F9" --description "BAIV domain" --repo $REPO 2>/dev/null || true
gh label create "domain:w4m"     --color "D4C5F9" --description "W4M domain" --repo $REPO 2>/dev/null || true
gh label create "domain:air"     --color "D4C5F9" --description "AIR domain" --repo $REPO 2>/dev/null || true
gh label create "tier:t1" --color "FBCA04" --description "Tier 1 — Core" --repo $REPO 2>/dev/null || true
gh label create "tier:t2" --color "FBCA04" --description "Tier 2 — Extended" --repo $REPO 2>/dev/null || true
gh label create "tier:t3" --color "FBCA04" --description "Tier 3 — Experimental" --repo $REPO 2>/dev/null || true
```

### 3. Configure Branch Protection

Apply protection to the `main` branch based on mode:

**Solo mode** (default): require PR, no force push, no deletions, 0 required reviews.
**Team mode**: require 1 review, status checks, conversation resolution.

```bash
gh api repos/$REPO/branches/main/protection --method PUT --input - <<EOF
{
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "enforce_admins": false,
  "required_status_checks": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```

### 4. Generate and Commit auto-add-to-projects.yml

If `--engineering-project-id` and `--product-project-id` are provided, generate and commit `auto-add-to-projects.yml` to `.github/workflows/` in the target repo with the PVT node IDs baked in.

Routing logic:

- `type:epic`, `type:feature`, `type:story`, `type:wbs`, `type:pbs` → Product project (`--product-project-id`)
- All other issues → Engineering project (`--engineering-project-id`)

Commit message: `feat(cicd): add auto-add-to-projects routing workflow [setup-repo]`

### 5. Deploy workflow_call Stubs

Commit the three standard `workflow_call` stub files to `.github/workflows/` in the target repo:

- `validate-issue-naming.yml` → delegates to `ajrmooreuk/Azlan-EA-AAA/.github/workflows/validate-issue-naming.yml@main`
- `validate-labels.yml` → delegates to `ajrmooreuk/Azlan-EA-AAA/.github/workflows/validate-labels.yml@main`
- `enforce-registry-link.yml` → delegates to `ajrmooreuk/Azlan-EA-AAA/.github/workflows/enforce-registry-link.yml@main`

Commit message: `feat(cicd): add workflow_call stubs for hub validation workflows [setup-repo]`

### 6. Write Registry Entry

Update `PBS/ONTOLOGIES/ontology-library/ont-registry-index.json` in `Azlan-EA-AAA` — add or update the PFI entry with full hierarchy fields:

```json
{
  "@id": "--pfi-id",
  "instance_type": "--instance-type",
  "parent_pfi": "--parent-pfi",
  "backup_tier": "T1",
  "engineering_project_id": "--engineering-project-id",
  "product_project_id": "--product-project-id",
  "hubSpokeConfig": {
    "repos": { "dev": "owner/repo" }
  }
}
```

Commit with message: `feat(registry): add PFI registry entry for [PFI-ID] [setup-repo]`

### 7. Report

Summarize what was created:

| Step | Status |
| --- | --- |
| Labels | N created, N skipped |
| Branch protection | Applied (solo/team) |
| auto-add-to-projects.yml | ✓ committed / ⚠ skipped (no PVT IDs) |
| workflow_call stubs | ✓ 3 committed |
| Registry entry | ✓ written / ✗ skipped |

Next steps reminder:

- Set `PROMOTION_PAT` secret on dev + test repos
- Set `PROJECT_PAT` secret on dev repo
- Run `/setup-project-board` if not done (to get PVT node IDs)
