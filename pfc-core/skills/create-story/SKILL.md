---
name: create-story
description: Creates a correctly-formatted Story issue linked to a parent Feature. Use when adding a user story under an existing feature.
argument-hint: "[title] [--feature FN.x]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep"
---

# Create Story

Create a new Story issue following the Azlan naming conventions.

## What You Do

When the user invokes `/azlan-github-workflow:create-story`, follow these steps:

### 1. Identify the Parent Feature
- If `--feature FN.x` is in the arguments, use that feature identifier
- Otherwise, ask the user which feature this story belongs to
- Look up the feature issue: `gh issue list --repo REPO --label "type:feature" --json number,title`

### 2. Determine the Next Story Sequence
Parse the feature identifier to get the epic number (N) and feature sequence (x), then find existing stories:

```bash
gh issue list --repo REPO --state all --limit 500 --json title --jq '.[].title' | grep -oP '^SN[A-Z]?\.x\.\K\d+' | sort -n | tail -1
```

Next story = `highest + 1`. If no stories exist under this feature, start at `1`.

### 3. Gather Details
If the user provided `$ARGUMENTS` as a title, use it. Otherwise ask for:
- **Title**: The user action or outcome
- **User Story**: As a ___, I want ___, so that ___
- **Acceptance Criteria**: GIVEN/WHEN/THEN format preferred

### 4. Create the Issue
Format the title as `SN.x.y: <title>` where N.x is the feature and y is the sequence.

```bash
gh issue create --repo REPO \
  --title "SN.x.y: Title" \
  --label "type:story" \
  --body "## Parent Feature
- FN.x: Name (#feature-issue-number)

## User Story
As a **<role>**,
I want **<capability>**,
so that **<outcome>**.

## Acceptance Criteria
GIVEN <condition>
WHEN <action>
THEN <result>
"
```

### 5. Update Parent Feature
Add the new story to the parent feature's Stories checklist if possible.

### Naming Convention Rules
- Format: `SN.x.y: <user action>` where N.x = feature, y = story sequence
- Letter suffixes match parent: `S9K.1.1:`, `S11A.2.3:`
- Always apply `type:story` label
- Always reference parent feature in body
