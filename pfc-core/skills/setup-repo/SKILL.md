---
name: setup-repo
description: Provisions a GitHub repository with the full Azlan workflow — labels, branch protection, and project board. Use when setting up a new or existing repo.
argument-hint: "[owner/repo] [--mode solo|team]"
user-invocable: true
allowed-tools: "Bash(gh *),Bash(./scripts/*),Read,Grep,Glob"
---

# Setup Repository

Provision a GitHub repository with the complete Azlan workflow conventions.

## What You Do

When the user invokes `/azlan-github-workflow:setup-repo`, follow these steps:

### 1. Parse Arguments
- `$0` = repository in `owner/repo` format (required)
- `$1` = `--mode solo` or `--mode team` (optional, default: `solo`)
- If no arguments provided, ask the user for the repo name

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

### 4. Report
Summarize what was created:
- Number of labels created vs skipped
- Branch protection status
- Next steps (copy issue templates, add workflows, create project board)
