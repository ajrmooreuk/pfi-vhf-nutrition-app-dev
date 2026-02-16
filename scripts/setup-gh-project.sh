#!/usr/bin/env bash
# setup-gh-project.sh — Create/update a GitHub Project v2 with standard fields and views
# Part of Azlan Workflow Packaging (Epic 9K, F9K.3)
#
# Usage: ./scripts/setup-gh-project.sh --owner <login> --project-title <name> [--repo owner/repo]

set -euo pipefail

OWNER=""
PROJECT_TITLE=""
REPO=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --owner)          OWNER="$2"; shift 2 ;;
    --project-title)  PROJECT_TITLE="$2"; shift 2 ;;
    --repo)           REPO="$2"; shift 2 ;;
    --help|-h)
      echo "Usage: $0 --owner <login> --project-title <name> [--repo owner/repo]"
      echo ""
      echo "Creates or updates a GitHub Project v2 with standard Azlan workflow fields."
      echo ""
      echo "Options:"
      echo "  --owner <login>          GitHub user or org that owns the project"
      echo "  --project-title <name>   Name of the project"
      echo "  --repo owner/repo        Link this repo to the project (optional)"
      echo "  --help                   Show this help message"
      echo ""
      echo "Standard Fields Created:"
      echo "  Type        (Single Select): Epic, Feature, Story, PBS, WBS, Registry"
      echo "  Status      (Single Select): Backlog, Ready, In Progress, In Review, Done"
      echo "  Priority    (Single Select): P0, P1, P2, P3"
      echo "  Estimate    (Number)"
      echo "  Registry ID (Text)"
      echo "  PBS ID      (Text)"
      echo "  WBS Code    (Text)"
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ -z "$OWNER" || -z "$PROJECT_TITLE" ]]; then
  echo "Error: --owner and --project-title are required."
  echo "Run with --help for usage."
  exit 1
fi

# Check if project already exists
echo "Checking for existing project '$PROJECT_TITLE'..."
PROJECT_NUMBER=$(gh project list --owner "$OWNER" --format json --jq ".projects[] | select(.title==\"$PROJECT_TITLE\") | .number" 2>/dev/null || true)

if [[ -n "$PROJECT_NUMBER" ]]; then
  echo "Project already exists: #$PROJECT_NUMBER"
else
  echo "Creating project '$PROJECT_TITLE'..."
  PROJECT_NUMBER=$(gh project create --owner "$OWNER" --title "$PROJECT_TITLE" --format json --jq '.number')
  echo "Created project #$PROJECT_NUMBER"
fi

echo ""
echo "=== Adding Standard Fields ==="

# Helper to create a field (gh project field-create is idempotent-ish — errors if exists)
create_field() {
  local name="$1"
  local type="$2"
  shift 2
  local extra_args=()
  if [[ $# -gt 0 ]]; then extra_args=("$@"); fi

  if gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json --jq ".[].name" 2>/dev/null | grep -qxF "$name"; then
    echo "  [skip] $name (already exists)"
  else
    gh project field-create "$PROJECT_NUMBER" --owner "$OWNER" --name "$name" --data-type "$type" ${extra_args[@]+"${extra_args[@]}"} 2>/dev/null && \
      echo "  [created] $name" || \
      echo "  [skip] $name (may already exist)"
  fi
}

create_field "Type"        "SINGLE_SELECT" --single-select-options "Epic,Feature,Story,PBS,WBS,Registry"
create_field "Status"      "SINGLE_SELECT" --single-select-options "Backlog,Ready,In Progress,In Review,Done"
create_field "Priority"    "SINGLE_SELECT" --single-select-options "P0,P1,P2,P3"
create_field "Estimate"    "NUMBER"
create_field "Registry ID" "TEXT"
create_field "PBS ID"      "TEXT"
create_field "WBS Code"    "TEXT"

# Link repo to project if specified
if [[ -n "$REPO" ]]; then
  echo ""
  echo "Linking repository $REPO to project..."
  gh project link "$PROJECT_NUMBER" --owner "$OWNER" --repo "$REPO" 2>/dev/null && \
    echo "Repository linked." || \
    echo "Repository may already be linked."
fi

echo ""
echo "Done. Project URL: https://github.com/users/$OWNER/projects/$PROJECT_NUMBER"
