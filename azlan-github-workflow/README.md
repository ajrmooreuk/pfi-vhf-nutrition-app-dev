# Azlan GitHub Workflow

Packaged conventions for the Azlan Epic/Feature/Story/PBS/WBS hierarchy — issue templates, enforcement workflows, setup scripts, and a Claude Code plugin.

## What's Inside

```
azlan-github-workflow/
├── .claude-plugin/plugin.json       ← Claude Code plugin manifest
├── skills/                          ← 6 plugin skills
│   ├── setup-repo/
│   ├── create-epic/
│   ├── create-feature/
│   ├── create-story/
│   ├── setup-project-board/
│   └── review-hierarchy/
├── docs/                            ← Guides and references
│   ├── onboarding.md
│   ├── quick-reference.md
│   ├── adr-001-packaging-approach.md
│   └── migration-checklist.md
└── README.md
```

**Also in the repo root:**

```
.github/
├── ISSUE_TEMPLATE/                  ← Epic, Feature, Story, PBS, WBS forms
├── pull_request_template.md         ← PR template with registry traceability
├── labels.yml                       ← Label definitions
└── workflows/
    ├── enforce-registry-link.yml    ← Block PRs missing registry artifact
    ├── validate-issue-naming.yml    ← Warn on naming convention violations
    └── validate-labels.yml          ← Warn on missing hierarchy labels

scripts/
├── setup-labels.sh                  ← Idempotent label creation
├── setup-branch-protection.sh       ← Branch protection (solo/team)
├── setup-gh-project.sh              ← Project board with standard fields
├── migrate-issues-into-hierarchy.sh ← Classify existing issues
└── setup-all.sh                     ← Run all setup in one command
```

## Quick Start

### New repo (interactive — recommended)

Run this directly in your **terminal** (requires a TTY for the prompts):

```bash
gh api repos/ajrmooreuk/Azlan-EA-AAA/contents/scripts/bootstrap-new-repo.sh \
  -q '.content' | base64 -d | bash -s --
```

The wizard prompts you for repo name, project board title, visibility, protection mode, and whether to install the Claude Code plugin.

> **Note:** Interactive mode requires a real terminal. It will not work inside CI pipelines, Docker builds, or non-interactive tool runners. Use the non-interactive form below for those environments.

### New repo (non-interactive)

Pass all options as arguments — no TTY needed, suitable for scripts and CI:

```bash
gh api repos/ajrmooreuk/Azlan-EA-AAA/contents/scripts/bootstrap-new-repo.sh \
  -q '.content' | base64 -d | bash -s -- my-repo

# With plugin:  ... | bash -s -- my-repo --with-plugin
# Private repo: ... | bash -s -- my-repo --private
# Team mode:    ... | bash -s -- my-repo --mode team
```

### Existing repo
```bash
# 1. Copy .github/ and scripts/ from this repo
# 2. Run setup
./scripts/setup-all.sh --repo OWNER/my-repo --owner OWNER --project-title "My Project"

# 3. Classify existing issues
./scripts/migrate-issues-into-hierarchy.sh --repo OWNER/my-repo
```

See [docs/onboarding.md](docs/onboarding.md) for the full guide.

## Naming Convention

| Type | Format | Example |
|------|--------|---------|
| Epic | `Epic N:` | `Epic 10: Customer Onboarding` |
| Feature | `FN.x:` | `F10.1: Registration Flow` |
| Story | `SN.x.y:` | `S10.1.1: Email Validation` |
| PBS | `[PBS]` | `[PBS] Auth Module` |
| WBS | `[WBS]` | `[WBS] Implement OAuth` |

## Plugin Skills

| Skill | Purpose |
|-------|---------|
| `/azlan-github-workflow:setup-repo` | Full repo provisioning |
| `/azlan-github-workflow:create-epic` | Create correctly-numbered epic |
| `/azlan-github-workflow:create-feature` | Create feature under epic |
| `/azlan-github-workflow:create-story` | Create story under feature |
| `/azlan-github-workflow:setup-project-board` | Configure project board fields |
| `/azlan-github-workflow:review-hierarchy` | Compliance audit |

## Documentation

- [Onboarding Guide](docs/onboarding.md) — Three adoption paths
- [Quick Reference](docs/quick-reference.md) — Single-page cheatsheet
- [ADR-001](docs/adr-001-packaging-approach.md) — Why three layers
- [Migration Checklist](docs/migration-checklist.md) — Step-by-step for existing repos
