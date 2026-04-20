---
name: review-hierarchy
description: Audits a GitHub repository for Azlan workflow compliance — checks naming conventions, labels, parent references, and project board assignment. Use for compliance checks.
argument-hint: "[owner/repo]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep"
---

# Review Hierarchy

Audit a GitHub repository for compliance with Azlan workflow conventions.

## What You Do

When the user invokes `/azlan-github-workflow:review-hierarchy`, follow these steps:

### 1. Parse Arguments
- `$0` = repository in `owner/repo` format (required)
- If not provided, use the current repo or ask the user

### 2. Fetch All Open Issues
```bash
gh issue list --repo REPO --state open --limit 500 --json number,title,labels,body
```

### 3. Run Compliance Checks

For each issue, check the following and track pass/fail/warning:

#### A. Naming Convention Check
| Label | Expected Pattern | Example |
|-------|-----------------|---------|
| `type:epic` | `Epic \d+[A-Z]?: .+` | `Epic 10: Title` |
| `type:feature` | `F\d+[A-Z]?\.\d+: .+` | `F10.1: Title` |
| `type:story` | `S\d+[A-Z]?\.\d+\.\d+: .+` | `S10.1.1: Title` |
| `type:pbs` | `\[PBS\] .+` | `[PBS] Deliverable` |
| `type:wbs` | `\[WBS\] .+` | `[WBS] Task` |

- **FAIL**: Has hierarchy label but title doesn't match pattern
- **WARN**: Title looks like a hierarchy issue but missing the label

#### B. Label Check
- **FAIL**: Issue with hierarchy title pattern has no matching `type:*` label
- **WARN**: Epic issue missing project-specific label (e.g., `visualiser`)

#### C. Parent Reference Check
- **WARN**: Feature issue body doesn't contain `Epic` or `#` reference
- **WARN**: Story issue body doesn't contain `Feature` or `F\d+` reference

#### D. Orphan Detection
- **WARN**: Issue has `type:story` but body contains no parent feature reference
- **WARN**: Issue has `type:feature` but body contains no parent epic reference

### 4. Generate Report

Output a structured compliance report:

```
=== Azlan Workflow Compliance Report ===
Repository: owner/repo
Issues scanned: N

PASS: X issues fully compliant
WARN: Y issues with warnings
FAIL: Z issues with failures

--- Failures ---
#123 — "Epic ten: Bad title" — naming violation (expected "Epic 10: ...")
#456 — "F10.1: Feature" — missing type:feature label

--- Warnings ---
#789 — "S10.1.1: Story" — no parent feature reference in body
#101 — "Epic 11: Title" — missing project label

--- Summary ---
Naming compliance:   X/N (percentage%)
Label compliance:    X/N (percentage%)
Parent references:   X/N (percentage%)
```

### 5. Offer Fixes
After the report, ask the user if they want to auto-fix any issues:
- Add missing labels
- Add missing parent references (requires user input for parent)

Only fix with explicit user approval — never auto-fix silently.
