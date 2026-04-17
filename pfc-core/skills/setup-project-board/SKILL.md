---
name: setup-project-board
description: Creates or configures a GitHub Projects v2 board with the standard Azlan workflow fields and views. Use when setting up project tracking.
argument-hint: "[project-title] [--owner login]"
user-invocable: true
allowed-tools: "Bash(gh *),Read"
---

# Setup Project Board

Create or configure a GitHub Projects v2 board with the standard Azlan workflow fields.

## What You Do

When the user invokes `/azlan-github-workflow:setup-project-board`, follow these steps:

### 1. Parse Arguments
- `$0` = project title (required)
- `--owner` = GitHub user or org login (required)
- If not provided, ask the user

### 2. Check for Existing Project
```bash
gh project list --owner OWNER --format json --jq ".projects[] | select(.title==\"TITLE\") | .number"
```

If found, use existing. Otherwise create:
```bash
gh project create --owner OWNER --title "TITLE" --format json --jq '.number'
```

### 3. Create Standard Fields
Add each field if it doesn't already exist:

| Field | Type | Options |
|-------|------|---------|
| **Type** | Single Select | Epic, Feature, Story, PBS, WBS, Registry |
| **Status** | Single Select | Backlog, Ready, In Progress, In Review, Done |
| **Priority** | Single Select | P0, P1, P2, P3 |
| **Estimate** | Number | — |
| **Registry ID** | Text | — |
| **PBS ID** | Text | — |
| **WBS Code** | Text | — |

```bash
gh project field-create NUMBER --owner OWNER --name "Type" --data-type SINGLE_SELECT --single-select-options "Epic,Feature,Story,PBS,WBS,Registry"
gh project field-create NUMBER --owner OWNER --name "Status" --data-type SINGLE_SELECT --single-select-options "Backlog,Ready,In Progress,In Review,Done"
gh project field-create NUMBER --owner OWNER --name "Priority" --data-type SINGLE_SELECT --single-select-options "P0,P1,P2,P3"
gh project field-create NUMBER --owner OWNER --name "Estimate" --data-type NUMBER
gh project field-create NUMBER --owner OWNER --name "Registry ID" --data-type TEXT
gh project field-create NUMBER --owner OWNER --name "PBS ID" --data-type TEXT
gh project field-create NUMBER --owner OWNER --name "WBS Code" --data-type TEXT
```

### 4. Link Repository (if in a repo context)
```bash
gh project link NUMBER --owner OWNER --repo OWNER/REPO
```

### 5. Report
- Project URL
- Fields created vs skipped
- Recommended views to create manually (Epic Progress, PBS Delivery, Registry Coverage)
