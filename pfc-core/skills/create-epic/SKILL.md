---
name: create-epic
description: Creates a correctly-formatted Epic issue with auto-detected numbering, labels, and project board integration. Use when starting a new epic.
argument-hint: "[title]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep"
---

# Create Epic

Create a new Epic issue following the Azlan naming conventions.

## What You Do

When the user invokes `/azlan-github-workflow:create-epic`, follow these steps:

### 1. Determine the Next Epic Number
Scan existing issue titles to find the highest epic number in use:

```bash
gh issue list --repo REPO --state all --limit 500 --json title --jq '.[].title' | grep -oP '^Epic\s+\K\d+' | sort -n | tail -1
```

The next epic number is `highest + 1`. If no epics exist, start at `1`.

If the user provides a letter suffix (e.g., "9K"), use that exactly.

### 2. Gather Details
If the user provided `$ARGUMENTS` as a title, use it. Otherwise ask for:
- **Title**: The epic's customer-facing outcome (do NOT include the prefix — you add it)
- **Objective**: What this epic delivers
- **Success Criteria**: How we know it's done

### 3. Create the Issue
Format the title as `Epic N: <title>` where N is the next number.

```bash
gh issue create --repo REPO \
  --title "Epic N: Title" \
  --label "type:epic" \
  --body "## Objective
<objective>

## Success Criteria
<criteria>

## Features
- [ ] FN.1: (to be created)
"
```

### 4. Add to Project Board (if configured)
If the repo has a linked project, add the issue and set `Type = Epic`:

```bash
gh project item-add PROJECT_NUMBER --owner OWNER --url ISSUE_URL
```

### Naming Convention Rules
- Format: `Epic N: <concise outcome>` where N is sequential
- Letter suffixes for sub-epics: `Epic 9K:`, `Epic 11A:`
- Always apply `type:epic` label
- Always add project-specific label if one exists (e.g., `visualiser`)
