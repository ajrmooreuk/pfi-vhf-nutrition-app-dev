---
name: create-feature
description: Creates a correctly-formatted Feature issue linked to a parent Epic. Use when adding a feature under an existing epic.
argument-hint: "[title] [--epic N]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep"
---

# Create Feature

Create a new Feature issue following the Azlan naming conventions.

## What You Do

When the user invokes `/azlan-github-workflow:create-feature`, follow these steps:

### 1. Identify the Parent Epic
- If `--epic N` is in the arguments, use epic number N
- Otherwise, ask the user which epic this feature belongs to
- Look up the epic issue number: `gh issue list --repo REPO --label "type:epic" --json number,title`

### 2. Determine the Next Feature Sequence
Find existing features under this epic to get the next sequence number:

```bash
gh issue list --repo REPO --state all --limit 500 --json title --jq '.[].title' | grep -oP '^FN[A-Z]?\.\K\d+' | sort -n | tail -1
```

Next feature = `highest + 1`. If no features exist under this epic, start at `1`.

### 3. Gather Details
If the user provided `$ARGUMENTS` as a title, use it. Otherwise ask for:
- **Title**: The capability this feature delivers
- **Acceptance Criteria**: What must be true for this feature to be complete

### 4. Create the Issue
Format the title as `FN.x: <title>` where N is the epic number and x is the sequence.

```bash
gh issue create --repo REPO \
  --title "FN.x: Title" \
  --label "type:feature" \
  --body "## Parent Epic
- Epic N: Name (#epic-issue-number)

## Objective
<objective>

## Acceptance Criteria
<criteria>

## Stories
- [ ] SN.x.1: (to be created)
"
```

### 5. Update Parent Epic
Add the new feature to the parent epic's Features checklist if possible.

### Naming Convention Rules
- Format: `FN.x: <capability>` where N = epic number, x = feature sequence
- Letter suffixes match parent: `F9K.1:`, `F11A.2:`
- Always apply `type:feature` label
- Always reference parent epic in body
