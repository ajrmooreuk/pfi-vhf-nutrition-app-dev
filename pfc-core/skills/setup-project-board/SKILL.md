---
name: setup-project-board
description: Creates Engineering and Product GitHub Projects v2 boards for a PFI dev repo. Outputs PVT node IDs for registry. Hub admin only — requires PROJECT_PAT.
argument-hint: "[--owner login] [--repo owner/repo] [--pfi-id PFI-ID] [--type engineering|product|both]"
user-invocable: true
allowed-tools: "Bash(gh *),Read"
---

# Setup Project Board

Create Engineering and/or Product GitHub Projects v2 boards for a PFI instance, capture PVT node IDs, and register them in `ont-registry-index.json`.

> **Hub admin only.** Requires `PROJECT_PAT` (classic PAT, `project` scope). PFI collaborators cannot run this skill — they do not hold PROJECT_PAT. See ARCH-CICD-003 glossary for PAT definitions.

## What You Do

When the user invokes `/azlan-github-workflow:setup-project-board`, follow these steps:

### 1. Parse Arguments

- `--owner` = GitHub user or org login (required)
- `--repo` = `owner/repo` to link the board to (required)
- `--pfi-id` = registry `@id` for this instance (e.g. `PFI-AIRL-CAF-AZA`) — required to write back to registry
- `--type` = `engineering`, `product`, or `both` (default: `both`)

If not provided, ask the user.

### 2. Create Boards

For each board type requested:

```bash
gh project create --owner OWNER --title "PFI [INSTANCE] Engineering" --format json
gh project create --owner OWNER --title "PFI [INSTANCE] Product" --format json
```

**Engineering board** — tracks CI/CD, scaffold, devops, infrastructure, operational epics. Hub admin = Admin; collaborators = Read.
**Product board** — tracks epics, features, stories, RAID, briefs. Collaborators = Write.

### 3. Capture PVT Node ID (CRITICAL)

After each board is created, extract its `PVT_...` node ID via GraphQL. This is NOT shown in the GitHub UI — it must be captured now and stored in the registry.

```bash
gh api graphql -f query='
  query($owner: String!, $number: Int!) {
    user(login: $owner) {
      projectV2(number: $number) {
        id
        title
      }
    }
  }' -f owner="OWNER" -F number=PROJECT_NUMBER \
  --jq '.data.user.projectV2.id'
```

Record both IDs immediately:

- `engineering_project_id: PVT_...`
- `product_project_id: PVT_...`

### 4. Add Standard Fields

Add each field to both boards if it doesn't already exist:

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

### 5. Link Repository

```bash
gh project link NUMBER --owner OWNER --repo OWNER/REPO
```

### 6. Write PVT Node IDs to Registry

Update `PBS/ONTOLOGIES/ontology-library/ont-registry-index.json` in `Azlan-EA-AAA` — add `engineering_project_id` and `product_project_id` to the PFI entry matching `--pfi-id`:

```json
"engineering_project_id": "PVT_...",
"product_project_id": "PVT_..."
```

Commit with message: `feat(registry): add project board PVT IDs for [PFI-ID] [setup-project-board]`

### 7. Report

Output a summary table:

| Item | Value |
| --- | --- |
| Engineering board | URL + PVT node ID |
| Product board | URL + PVT node ID |
| Registry updated | ✓ / ✗ |
| Fields created | Count |
| Repo linked | owner/repo |

Also remind: PVT node IDs must be baked into `auto-add-to-projects.yml` in the PFI dev repo — run `/setup-repo --engineering-project-id PVT_... --product-project-id PVT_...` or update the workflow file directly.
