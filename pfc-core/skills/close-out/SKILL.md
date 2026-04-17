---
name: close-out
description: Runs after a revision, update, addition, or review is complete. Supports PR-based, story-level, feature-level, commit-based, and session-based entry points. Closes out epics, features, and stories, updates architecture docs and operating guides, generates test plans with results, and produces a release or update bulletin with deployment and configuration requirements.
argument-hint: "[PR/#N | --stories S40.21.1,S40.21.2 | --feature F40.21 | --commit SHA | --session] [--scope story|feature|epic|session] [--status done|partial|blocked] [--reason \"text\"] [--update-only] [--validate-only] [--skip stage1,stage2] [--bulletin-type release|update] [--repo owner/repo]"
user-invocable: true
allowed-tools: "Bash(gh *),Bash(npx vitest *),Bash(git *),Bash(wc *),Bash(mkdir *),Read,Grep,Glob,Write,Edit"
---

# Close-Out: Post-Change Housekeeping Pipeline v2.0

6-stage pipeline that handles all post-change documentation, issue management, and team communication after a revision, update, addition, or review. Supports 5 entry modes (PR, story, feature, commit, session), scope-conditional stage execution, partial completion tracking, and validate-only dry runs. Each stage confirms with the user before proceeding. Any stage can be skipped.

## Dtree Classification

`SKILL_STANDALONE` — Structured, repeatable, template-driven, no autonomous reasoning.

Path: HG-01 FAIL (3.5) → HG-04 PASS (8.2) → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:close-out`, determine the entry mode from the arguments, resolve scope, then execute the 6-stage pipeline with scope-conditional gating.

**Entry Modes:**

| Mode | Argument | Default Scope | Example |
|------|----------|:-------------:|---------|
| PR-based | `#123` or `(none)` | epic | `/close-out #123` |
| Story-level | `--stories S40.21.1,S40.21.2` | story | `/close-out --stories S49.10.1,S49.10.2` |
| Feature-level | `--feature F40.21` | feature | `/close-out --feature F49.10` |
| Commit-based | `--commit SHA` | auto-detect | `/close-out --commit 0cf35da` |
| Session-based | `--session` | session | `/close-out --session` |

**Modifiers:**

| Flag | Effect |
|------|--------|
| `--scope story\|feature\|epic\|session` | Override default scope |
| `--status done\|partial\|blocked` | Story completion status (default: done) |
| `--reason "text"` | Reason for partial/blocked status (mandatory for blocked) |
| `--update-only` | Run Stage 1 only, skip stages 2-6 |
| `--validate-only` | Dry run — report what WOULD happen, make no changes |
| `--skip stage1,stage3` | Skip specific stages |
| `--bulletin-type release\|update` | Force bulletin type |
| `--repo owner/repo` | Target repository |

---

### Step 0: Context Discovery

Parse arguments, determine entry mode, resolve scope, discover the issue hierarchy, and present a confirmation summary.

#### 0.1 Argument Parsing

Determine the entry mode from the first positional argument or flags:

```
Entry Mode Resolution
━━━━━━━━━━━━━━━━━━━━
Argument provided       →  Entry mode
──────────────────────────────────────
$0 = #N (number)        →  PR-based (existing flow)
--stories S...,...       →  Story-level
--feature F...          →  Feature-level
--commit SHA            →  Commit-based
--session               →  Session-based
(none, on a branch)     →  Auto-discover PR from current branch
(none, no branch PR)    →  Ask user for entry mode
```

#### 0.2 Scope Resolution

Once entry mode is determined, resolve the effective scope:

| Entry Mode | Default Scope | Can Override To |
|-----------|:-------------:|-----------------|
| PR-based | epic | story, feature |
| Story-level | story | feature, epic |
| Feature-level | feature | story, epic |
| Commit-based | auto-detect | story, feature, epic |
| Session-based | session (= epic) | story, feature |

If `--scope` is explicitly provided, it overrides the default.

**Scope determines which stages execute:**

| Stage | story | feature | epic/session |
|-------|:-----:|:-------:|:------------:|
| 1: Issue Close-Out | Partial | Full | Full |
| 2: Arch Delta | Skip | If impact | Execute |
| 3: Op Guide | Skip | If user-facing | Execute |
| 4: Test Plan | Run tests only | Full plan | Full plan |
| 5: Bulletin | Skip | Update bulletin | Release bulletin |
| 6: Deploy | Skip | If config | Execute |

#### 0.3 PR-Based Discovery (existing flow)

When `$0` is a PR number or auto-discovered from the current branch:

```bash
# Get PR details including linked issues
gh pr view $PR --json number,title,body,files,commits,labels,milestone --repo $REPO

# Get linked issues from PR body (Resolves: #N, Closes: #N, Fixes: #N)
# Extract all issue references
```

From the linked issue title, detect if it is a Story (SN.x.y), Feature (FN.x), or Epic (Epic N). Trace upward: Story → parent Feature → parent Epic. Collect all issue numbers in the hierarchy.

Determine change scope:
```bash
# Files changed in PR
gh pr diff $PR --name-only --repo $REPO

# Commit messages
gh pr view $PR --json commits --jq '.commits[].messageHeadline' --repo $REPO
```

#### 0.4 Story-Level Discovery

When `--stories S40.21.1,S40.21.2` is provided:

```bash
# Parse comma-separated story identifiers
# For each story, extract epic number (N) and feature number (N.x) from pattern SN.x.y

# Look up each story issue by title pattern
gh issue list --repo $REPO --state all --limit 500 --json number,title,state \
  --jq '[.[] | select(.title | test("^S40\\.21\\.[12]:"))]'

# Trace upward to parent feature
gh issue list --repo $REPO --state all --limit 500 --json number,title,state \
  --jq '[.[] | select(.title | startswith("F40.21:"))]'

# Trace upward to parent epic
gh issue list --repo $REPO --state all --limit 500 --json number,title,state \
  --jq '[.[] | select(.title | startswith("Epic 40:"))]'
```

Collect: story issue numbers + states, parent feature issue number, parent epic issue number.

#### 0.5 Feature-Level Discovery

When `--feature F40.21` is provided:

```bash
# Look up the feature issue
gh issue list --repo $REPO --state all --limit 500 --json number,title,state \
  --jq '[.[] | select(.title | test("^F40\\.21:"))]'

# List ALL stories under this feature
gh issue list --repo $REPO --state all --limit 500 --json number,title,state \
  --jq '[.[] | select(.title | test("^S40\\.21\\."))]'

# Count done vs open vs blocked
# Trace upward to parent epic
gh issue list --repo $REPO --state all --limit 500 --json number,title,state \
  --jq '[.[] | select(.title | startswith("Epic 40:"))]'
```

If no stories are found as separate issues, read the feature body to extract story lines from checkboxes.

#### 0.6 Commit-Based Discovery

When `--commit 0cf35da` is provided:

```bash
# Get commit message and changed files
git log --format="%s%n%n%b" -1 0cf35da
git diff-tree --no-commit-id --name-only -r 0cf35da
```

Parse the commit message for story/feature references:
- Patterns: `S40.21.1`, `F40.21`, `#123`, `Resolves #N`, `Closes #N`
- From commit title conventional-commit format: `feat(kano):` → domain hint

If no explicit references found, present the changed files and ask the user to confirm which stories/features this commit relates to.

#### 0.7 Session-Based Discovery

When `--session` is provided:

```bash
# Find the last close-out tag (if any)
git tag -l "close-out/*" --sort=-creatordate | head -1

# If no close-out tag exists, find branch divergence point
git merge-base HEAD main

# If merge-base equals HEAD (on main, no branch), use last close-out tag
# If no tag either, ask user for a reference point (commit SHA or date)

# Get all commits since the reference point
git log --oneline $REFERENCE..HEAD

# Parse ALL commit messages for story/feature references
# Aggregate all unique stories and features touched
```

Present the aggregated scope to the user for confirmation before proceeding.

#### 0.8 Status and Reason Handling

When `--status` is provided:

| Status | Behaviour |
|--------|-----------|
| `done` (default) | Mark stories as complete `[x]` |
| `partial` | Mark stories as in-progress `[~]` with "(in progress)" suffix |
| `blocked` | Mark stories as blocked `[!]` with "(BLOCKED — {reason})" suffix |

If `--status blocked` and no `--reason` provided → prompt the user for a reason (mandatory for blocked status).

If `--reason` is provided, store the reason text for use in Stage 1 story checkpoint comments.

#### 0.9 Validate-Only Mode

When `--validate-only` is provided:

- Set a global flag `DRY_RUN=true`
- All subsequent stages report what they WOULD do but make no `gh` API calls and write no files
- The discovery summary uses a `[DRY RUN]` prefix
- No session tag is created
- No issue bodies are modified

#### 0.10 Bulletin Type Detection

Determine bulletin type (if not forced with `--bulletin-type`):

- If PR closes/resolves an issue: `update` bulletin for bug fixes, `release` bulletin for features
- If PR title contains "fix", "patch", "regression", "hotfix": `update` bulletin
- If PR title contains "feat", "add", "implement", "epic": `release` bulletin
- For story scope: no bulletin (skipped)
- For feature scope: default `update`
- For epic scope: default `release`

#### 0.11 Discovery Summary

Present to user and confirm before proceeding:

**PR-based example:**
```
Close-Out Pipeline Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entry Mode:      PR-based
PR:              #123 — "F40.21: Dynamic Nav Accessibility"
Linked Issues:   #124 (S40.21.1), #125 (S40.21.2)
Parent Feature:  #120 (F40.21)
Parent Epic:     #577 (Epic 40)
Files Changed:   12
Scope:           epic
Status:          done
Bulletin Type:   release
Stages:          1 ✓  2 ✓  3 ✓  4 ✓  5 ✓  6 ✓

Proceed? (User confirms or adjusts)
```

**Story-level example:**
```
Close-Out Pipeline Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entry Mode:      story-level
Stories:         S40.21.1 (#124), S40.21.2 (#125)
Status:          done
Parent Feature:  F40.21 (#120) — 5/7 stories done (will be 7/7 after close-out)
Parent Epic:     Epic 40 (#577)
Scope:           story
Stages:          1 ✓  2 ○  3 ○  4 ○  5 ○  6 ○
                 (○ = skipped at story scope)

Proceed?
```

**Validate-only example:**
```
[DRY RUN] Close-Out Pipeline Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entry Mode:      feature-level
Feature:         F49.10 (#816) — 7/7 stories done
Parent Epic:     Epic 49 (#747)
Scope:           feature
Stages:          1 ✓  2 ✓  3 ✓  4 ✓  5 ✓  6 ✓
                 (no changes will be made — dry run only)

Proceed?
```

---

### Stage 1: Issue Close-Out (Epic/Feature/Story Body Updates)

**Purpose:** Update GitHub issue bodies to reflect completed work. This is the MANDATORY step from the standing project rule.

**1.0 Scope Gate:**

```
if --update-only is NOT set AND scope is "story":
    Execute 1.1 only (mark specified stories)
    Execute 1.2 only IF all stories in the feature are now done
    Skip 1.3 (epic update) unless feature just completed
if scope is "feature":
    Execute 1.1 (mark all done stories)
    Execute 1.2 (check feature completion)
    Execute 1.3 only if feature is fully complete
if scope is "epic" or "session":
    Execute 1.1, 1.2, 1.3 (full existing behaviour)
if --validate-only:
    Report what WOULD change, make no modifications
```

**1.1 Mark stories as done in parent feature body:**

For each story being closed out:

```bash
# Read the parent feature issue body
gh issue view $FEATURE_NUMBER --json body --jq '.body' --repo $REPO > /tmp/feature-body.md
```

Apply status-specific marking:

| Status | Checkbox | Suffix |
|--------|----------|--------|
| `done` | `[ ]` → `[x]` | (none) |
| `partial` | `[ ]` → `[~]` | `(in progress)` |
| `blocked` | `[ ]` → `[!]` | `(BLOCKED — {reason})` |

Insert or update a progress line in the feature body:
```
**Progress:** 5/7 stories done (1 in progress, 1 blocked)
```

Write back:
```bash
gh issue edit $FEATURE_NUMBER --body-file /tmp/feature-body.md --repo $REPO
```

**CRITICAL: Always use `--body-file` with a temp file. NEVER use `sed` on issue bodies — special characters cause regex errors and can wipe the body.**

**1.1b Session checkpoint for blocked stories:**

When `--status blocked`:

```bash
# Add a comment to each blocked story issue
gh issue comment $STORY_NUMBER --repo $REPO --body-file /tmp/session-checkpoint.md
```

Where the checkpoint content is:

```markdown
## Session Checkpoint — {date}

**Status:** BLOCKED
**Reason:** {--reason text}
**Blocker:** {blocker reference if extractable from reason}
**Session commits:** {commit range or "N/A"}
**Next action:** {inferred from reason or "User to specify"}
```

**1.2 Feature completion check:**

Check if ALL stories under the feature are now marked `[x]`:

```bash
# List stories that reference this feature
gh issue list --repo $REPO --state all --label "type:story" --limit 200 --json number,title,state \
  --jq '[.[] | select(.title | test("^S'$EPIC_NUM'\\.'$FEAT_NUM'\\."))]'
```

**If ALL stories are `[x]` (done):**
- Read the epic body
- Add ✅ to the feature heading (e.g. `### F40.21: Title` → `### ✅ F40.21: Title`)
- Tick the feature checkbox (e.g. `- [ ] F40.21` → `- [x] F40.21`)
- Tick any related acceptance criteria checkboxes
- Update the "Completed Features" count in any totals line
- Write back with `--body-file`

**If NOT all stories are done:**
- Do NOT mark the feature as ✅
- Do NOT update the epic body
- Report: `"Feature F40.21 — 5/7 stories done — not yet complete"`

**1.3 Report:**

```
Stage 1: Issue Close-Out
━━━━━━━━━━━━━━━━━━━━━━━━
Stories marked done:    S40.21.1 ✓, S40.21.2 ✓
Stories blocked:        (none)
Feature progress:       F40.21 — 5/7 stories done (not complete)
Epic updated:           (skipped — feature not complete)
```

Or for a completed feature:

```
Stage 1: Issue Close-Out
━━━━━━━━━━━━━━━━━━━━━━━━
Stories marked done:    S40.21.1 ✓, S40.21.2 ✓
Feature completed:      F40.21 ✅ (all 7/7 stories done)
Epic updated:           Epic 40 — 18/22 features complete
```

---

### Stage 2: Architecture Documentation Delta

**Purpose:** Document any architectural changes, new modules, design decisions, or ADR updates.

**Scope Gate:**
```
story scope    → Skip. Report: "Stage 2: Skipped (story scope)"
feature scope  → Execute only if changed files include new modules, interface
                 changes, or cross-module dependency shifts. Otherwise skip.
epic scope     → Execute (full analysis)
--update-only  → Skip
--validate-only → Report what WOULD happen
```

**2.1 Analyse changed files for architectural impact:**

Categorise the changed files:
- **New modules** — new `.js` files in `js/` or new directories
- **New HTML structure** — changes to `browser-viewer.html`
- **New dependencies** — changes to `package.json`
- **Changed interfaces** — exported function signature changes
- **New business rules** — new validation logic or constraints
- **Config changes** — new env vars, localStorage keys, settings

**2.2 Determine if architecture doc update is needed:**

Architecture doc update is needed if ANY of:
- New module added
- Existing module interface changed (exports, parameters)
- New design pattern introduced
- Cross-module dependency changed
- New ADR warranted (technology choice, pattern decision)

If no architectural impact → report "No architecture changes detected" and skip to Stage 3.

**2.3 Generate architecture delta:**

If changes affect an existing ARCH-*.md file, edit it directly with the new information.

If the change warrants a standalone delta document, follow the DELTA-ARCHITECTURE template:

```markdown
# Architecture Delta — [Feature/Fix Name]

**Date:** {date} | **PR:** #{pr} | **Epic:** {N} (#{epic-issue})

## Changes

| Module | Change Type | Description |
|--------|------------|-------------|
| {file} | New / Modified / Removed | {what changed and why} |

## Design Decisions

### D-{ID}: {Decision Title}
- **Context:** {why this decision was needed}
- **Decision:** {what was decided}
- **Consequences:** {impact on existing code}

## Module Dependencies (if changed)

{Updated dependency diagram if relevant}
```

**2.4 ADR-LOG update (if warranted):**

If a technology or pattern decision was made, append to `ADR-LOG.md`:

```markdown
### ADR-{N}: {Title}
**Date:** {date} | **Status:** Accepted | **Authority:** {SA/EA/CTO}
**Context:** {problem}
**Decision:** {chosen approach}
**Rationale:** {why}
**Consequences:** {trade-offs}
```

**2.5 Report:**

```
Stage 2: Architecture Delta
━━━━━━━━━━━━━━━━━━━━━━━━━━
Files with arch impact:  3 (new-module.js, app.js, browser-viewer.html)
ARCH docs updated:       ARCH-NAVIGATION.md (Section 14 added)
ADR logged:              ADR-014: Keyboard Nav Pattern
```

---

### Stage 3: Operating Guide Delta

**Purpose:** Update operating guides to reflect new or changed user-facing behaviour.

**Scope Gate:**
```
story scope    → Skip. Report: "Stage 3: Skipped (story scope)"
feature scope  → Execute only if changed files include user-facing changes.
                 Otherwise skip.
epic scope     → Execute (full analysis)
--update-only  → Skip
--validate-only → Report what WOULD happen
```

**3.1 Identify user-facing changes:**

From the changed files, identify:
- New toolbar buttons or menu items
- Changed keyboard shortcuts
- New panels, modals, or views
- Modified workflows or procedures
- New configuration options
- Changed defaults or behaviours

If no user-facing changes → report "No user-facing changes detected" and skip to Stage 4.

**3.2 Determine which operating guide to update:**

| Change Domain | Operating Guide |
|---------------|----------------|
| General visualiser | `OPERATING-GUIDE.md` |
| PFI-specific workflows | `PBS/PFI-{instance}/OPERATING-GUIDE-Visualiser.md` |
| Graph canvas interaction | `GRAPH-CANVAS-OPERATING-GUIDE.md` |
| Navigation system | `OPERATING-GUIDE-Navigation.md` |
| Skeleton/workbench | `OAA-WORKBENCH-GUIDE.md` |

**3.3 Edit the relevant operating guide:**

Add or update sections following the existing guide's format:
- Step-by-step numbered workflows
- Tables for configuration/reference
- Keyboard shortcut entries
- Known limitations with issue references

If the change is small (1-2 new items), edit inline. If it is a major section, add a new numbered section.

**3.4 Report:**

```
Stage 3: Operating Guide Delta
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User-facing changes:     2 (new keyboard shortcut, new panel toggle)
Guides updated:          OPERATING-GUIDE-Navigation.md (Section 8.4)
```

---

### Stage 4: Test Plan and Results

**Purpose:** Document what was tested and the results.

**Scope Gate:**
```
story scope    → Run tests, report pass/fail count. Skip test plan document.
                 Report: "Stage 4: Tests run ({N}/{N} pass). Plan skipped (story scope)."
feature scope  → Run tests AND generate test plan document.
epic scope     → Run tests AND generate test plan document.
--update-only  → Skip entirely
--validate-only → Report test file count without running tests
```

**4.1 Gather test results:**

Run the test suite:

```bash
cd PBS/TOOLS/ontology-visualiser && npx vitest run 2>&1
```

Capture:
- Total tests, passed, failed
- Per-file breakdown
- Any new test files added in the PR

**4.2 Generate test plan document (feature/epic scope only):**

Follow the TEST-PLAN template format:

```markdown
# Test Plan — [Feature/Fix Name]

**Date:** {date}
**PR:** #{pr}
**Feature:** F{N.x} (#{issue})
**Branch:** {branch}

## Scope

{What is being tested and why}

## Files Modified

| File | Change Type |
|------|------------|
| {file} | New / Modified |

## Test Categories

### TC-1: Regression (Existing Tests)

| ID | Test Case | Status |
|----|-----------|--------|
| All existing tests | {count} tests | {pass/fail} |

### TC-2: New Feature Tests

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| TC-2.1 | {test description} | {steps} | {expected} | Pass |

### TC-3: Manual Verification

| ID | Check | Result |
|----|-------|--------|
| TC-3.1 | {manual check description} | {pass/fail/not-tested} |

## Test Coverage Summary

| Test File | Tests | Status |
|-----------|-------|--------|
| {new-test.test.js} | {N} | All pass |
| Existing tests | {N} | {N} pass |
| **Total** | **{N}** | **{N} pass** |
```

Write to: `PBS/TOOLS/ontology-visualiser/TEST-PLAN-{feature-id}-v1.0.0.md`

**4.3 Report:**

```
Stage 4: Test Plan & Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Test suite:        1527/1527 pass
New tests added:   24 (in 2 test files)
Test plan written: TEST-PLAN-F40.21-v1.0.0.md
```

---

### Stage 5: Release/Update Bulletin

**Purpose:** Produce a team/user communication document summarising the change.

**Scope Gate:**
```
story scope    → Skip. Report: "Stage 5: Skipped (story scope)"
feature scope  → Generate update bulletin (not release)
epic scope     → Generate release bulletin
--update-only  → Skip
--validate-only → Report which bulletin type WOULD be generated
```

**5.1 Determine bulletin type:**

Use the auto-detected or forced bulletin type from Step 0.

**5.2 Generate RELEASE bulletin (for features/epics):**

Follow the RELEASE-BULLETIN template:

```markdown
# Release Bulletin — [Epic/Feature]: [Title]

**Version:** {version}
**Date:** {date}
**Branch:** {branch}

---

## Summary

{2-3 sentence overview of what was delivered and why it matters}

---

## New Features

### {Feature Name} (Stories {N.x.y})
- {Bullet list of user-facing capabilities}
- {What the user can now do that they couldn't before}

## Technical Details

| Component | Change |
|-----------|--------|
| {module} | {what changed} |

## Test Coverage

| Test File | Tests | Status |
|-----------|-------|--------|
| {from Stage 4} |

## Files Changed

| File | Change Type |
|------|------------|
| {from git diff} |

## Known Limitations

| Issue | Status | Ref |
|-------|--------|-----|
| {any known issues} |

## Deployment / Configuration Requirements

{See Stage 6 output — merged here if present}
```

Write to: `PBS/TOOLS/ontology-visualiser/RELEASE-BULLETIN-{identifier}.md`

**5.3 Generate UPDATE bulletin (for fixes/patches):**

Follow the UPDATE-BULLETIN template:

```markdown
# Update Bulletin: [Fix Title]

**Date:** {date}
**Priority:** {P0-P3}
**Commit:** {sha}
**Epic:** {N} (#{issue}) | **Caused by:** {root cause ref if applicable}
**Affects:** {who is impacted}

---

## Summary

{Context and what happened}

## Root Cause

{Why it happened — be specific}

## What Changed

| File | Change |
|------|--------|
| {file} | {description} |

## Cross-Check Table

{Related systems verification}

## Lesson Learned

{Prevention for future}

## Verification

{Steps to confirm fix works}

## Action Required

{None / Upgrade / Manual step — be explicit}
```

Write to: `PBS/TOOLS/ontology-visualiser/UPDATE-BULLETIN-{identifier}.md`

**5.4 Report:**

```
Stage 5: Bulletin
━━━━━━━━━━━━━━━━━
Type:     Release Bulletin
Written:  RELEASE-BULLETIN-F40.21-Dynamic-Nav-Accessibility.md
```

---

### Stage 6: Deployment & Configuration Requirements

**Purpose:** Identify and document any deployment or configuration requirements.

**Scope Gate:**
```
story scope    → Skip. Report: "Stage 6: Skipped (story scope)"
feature scope  → Execute only if changed files include config/deployment changes.
                 Otherwise skip.
epic scope     → Execute (full analysis)
--update-only  → Skip
--validate-only → Report what WOULD be scanned
```

**6.1 Scan for deployment impact:**

Check the changed files for:
- **New environment variables** — grep for `process.env`, new config keys
- **New localStorage keys** — grep for `localStorage.setItem`, `localStorage.getItem`
- **Database migrations** — new SQL files, schema changes
- **New dependencies** — `package.json` changes
- **Breaking changes** — removed exports, changed function signatures, renamed DOM IDs
- **New GitHub workflow changes** — `.github/workflows/` modifications
- **New file paths that other systems reference** — registry entries, config paths

**6.2 Generate deployment section:**

If deployment requirements exist, append to the Stage 5 bulletin:

```markdown
## Deployment & Configuration Requirements

### Pre-Deployment
- [ ] {Any prerequisite — e.g. "Run database migration X"}

### Configuration Changes
| Setting | Type | Default | Required | Notes |
|---------|------|---------|----------|-------|
| {key} | {env/localStorage/config} | {default} | {yes/no} | {description} |

### Breaking Changes
| Change | Impact | Migration |
|--------|--------|-----------|
| {what broke} | {who is affected} | {how to migrate} |

### Post-Deployment Verification
- [ ] {Verification step 1}
- [ ] {Verification step 2}

### Rollback Plan
{How to roll back if something goes wrong}
```

If no deployment requirements → append `## Deployment & Configuration Requirements\n\n**None** — pull latest main. No configuration changes required.`

**6.3 Report:**

```
Stage 6: Deployment Requirements
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Breaking changes:     None
New config:           1 localStorage key (nav-accessibility-mode)
Pre-deployment:       None
Post-deploy checks:   2 items added to bulletin
```

---

### Step 7: Pipeline Summary

After all stages complete, output the final summary. The summary is dynamic — it reflects what was actually executed, not all 6 stages.

**Full execution (epic scope):**

```
Close-Out Pipeline Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entry Mode:   PR-based (#123)
Scope:        epic
Status:       done
Stages:       6/6 executed (0 skipped)

Stage 1: Issue Close-Out ✓
  Stories done:     S40.21.1, S40.21.2
  Feature done:     F40.21 ✅
  Epic progress:    Epic 40 — 18/22 features

Stage 2: Architecture Delta ✓
  ARCH docs:        ARCH-NAVIGATION.md updated
  ADR:              ADR-014 logged

Stage 3: Operating Guide ✓
  Guides updated:   OPERATING-GUIDE-Navigation.md

Stage 4: Test Plan ✓
  Tests:            1551/1551 pass (+24 new)
  Plan:             TEST-PLAN-F40.21-v1.0.0.md

Stage 5: Bulletin ✓
  Type:             Release
  File:             RELEASE-BULLETIN-F40.21.md

Stage 6: Deployment ✓
  Config:           1 new localStorage key
  Breaking:         None

All artifacts committed? [User confirms]
```

**Partial execution (story scope):**

```
Close-Out Pipeline Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entry Mode:   story-level (--stories S40.21.1,S40.21.2)
Scope:        story
Status:       done
Stages:       1/6 executed (5 skipped)

Stage 1: Issue Close-Out ✓
  Stories done:     S40.21.1 ✓, S40.21.2 ✓
  Feature progress: F40.21 — 5/7 stories done (not complete)
  Epic:             (not updated — feature incomplete)

Stage 2: Architecture Delta ○ (skipped — story scope)
Stage 3: Operating Guide ○ (skipped — story scope)
Stage 4: Test Plan ○ (skipped — story scope)
Stage 5: Bulletin ○ (skipped — story scope)
Stage 6: Deployment ○ (skipped — story scope)
```

**Blocked story:**

```
Close-Out Pipeline Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entry Mode:   story-level (--stories S40.21.3)
Scope:        story
Status:       blocked
Reason:       "Waiting for API key from vendor"
Stages:       1/6 executed (5 skipped)

Stage 1: Issue Close-Out ✓
  Stories blocked:  S40.21.3 [!] (BLOCKED — Waiting for API key from vendor)
  Checkpoint:       Comment added to #126
  Feature progress: F40.21 — 4/7 done, 1 blocked
  Epic:             (not updated — feature incomplete)
```

**Validate-only:**

```
[DRY RUN] Close-Out Pipeline Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entry Mode:   feature-level (--feature F49.10)
Scope:        feature
Status:       done
Stages:       6 analysed (no changes made)

Stage 1: WOULD mark 7/7 stories done, WOULD mark F49.10 ✅
Stage 2: WOULD skip (no arch impact detected)
Stage 3: WOULD skip (no user-facing changes)
Stage 4: WOULD run tests and generate TEST-PLAN-F49.10-v1.0.0.md
Stage 5: WOULD generate UPDATE-BULLETIN-F49.10.md
Stage 6: WOULD skip (no config changes)

No changes were made. Remove --validate-only to execute.
```

**Session-based with tag:**

```
Close-Out Pipeline Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entry Mode:   session-based
Reference:    close-out/2026-02-28-1600 → HEAD (5 commits)
Scope:        epic
...

Session tag:  close-out/2026-03-01-1430
```

---

## Error Handling

- **Stage fails:** Report the failure, offer to retry or skip that stage. Never silently continue past a failure.
- **Issue body too large for `gh`:** Split the body into sections, or warn and ask user to update manually.
- **No linked issues found:** Ask user for the relevant issue numbers manually.
- **Test suite fails:** Report failures in Stage 4 but do NOT mark the stage as failed — document the failures in the test plan. Flag them in the bulletin.
- **No PR provided and no current branch PR:** Ask the user for the PR or issue number, or suggest `--stories`, `--feature`, `--commit`, or `--session` entry modes.
- **Story not found by title pattern:** Warn and ask user for the issue number directly. Retry with a broader search (`gh issue list --search "S40.21.1"`) if the title-based lookup fails.
- **Commit has no story/feature references:** Present the changed files and ask user to manually specify which stories/features this commit relates to.
- **Session discovery finds no commits since last close-out:** Report "No new work found since last close-out tag" and exit cleanly.
- **`--status blocked` without `--reason`:** Prompt the user for a reason (mandatory for blocked status). Do not proceed until a reason is provided.

## Standing Rules Enforced

- **NEVER use `sed` on GitHub issue bodies** — special chars cause regex errors and can wipe the body. Always use `--body-file` with a temp file.
- **Epic body updates are MANDATORY** when a feature is closed (MEMORY.md standing rule).
- **Epic body updates are ONLY triggered when a feature is FULLY complete** — partial story close-out must NOT prematurely mark features or update epic completion counts.
- **Labels are validated** by existing `validate-issue-naming.yml` and `validate-labels.yml` workflows.
- **Bulletin format follows existing templates** — RELEASE-BULLETIN-*.md and UPDATE-BULLETIN-*.md in the repo.
- **Session tags** use lightweight format `close-out/YYYY-MM-DD-HHMM` and are only created when close-out actually executes (not in `--validate-only` mode).
