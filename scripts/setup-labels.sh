#!/usr/bin/env bash
# setup-labels.sh — Idempotent label creation via gh CLI
# Part of Azlan Workflow Packaging (Epic 9K, F9K.3)
#
# Usage: ./scripts/setup-labels.sh [--repo owner/repo]
# If --repo is omitted, uses the current repository.

set -euo pipefail

REPO=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)   REPO="$2"; shift 2 ;;
    --help|-h)
      echo "Usage: $0 [--repo owner/repo]"
      echo ""
      echo "Creates the standard Azlan workflow label set."
      echo "Idempotent — safe to run multiple times."
      echo ""
      echo "Options:"
      echo "  --repo owner/repo   Target repository (default: current repo)"
      echo "  --help              Show this help message"
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# Build repo flag
REPO_FLAG=""
if [[ -n "$REPO" ]]; then
  REPO_FLAG="--repo $REPO"
fi

# Get existing labels
echo "Fetching existing labels..."
EXISTING=$(gh label list $REPO_FLAG --limit 200 --json name --jq '.[].name')

create_label() {
  local name="$1"
  local color="$2"
  local description="$3"

  if echo "$EXISTING" | grep -qxF "$name"; then
    echo "  [skip] $name (already exists)"
  else
    gh label create "$name" --color "$color" --description "$description" $REPO_FLAG
    echo "  [created] $name"
  fi
}

echo ""
echo "=== Hierarchy Type Labels ==="
create_label "type:epic"     "BFD4F2" "Epic-level customer problem"
create_label "type:feature"  "BFD4F2" "Feature-level solution capability"
create_label "type:story"    "BFD4F2" "User story"
create_label "type:pbs"      "BFD4F2" "PBS Component (Deliverable)"
create_label "type:wbs"      "BFD4F2" "WBS Task (Work Package)"
create_label "type:registry" "BFD4F2" "Registry Artifact"

echo ""
echo "=== Domain Labels ==="
create_label "domain:pf-core" "D4C5F9" "PF Core domain"
create_label "domain:baiv"    "D4C5F9" "BAIV domain"
create_label "domain:w4m"     "D4C5F9" "W4M domain"
create_label "domain:air"     "D4C5F9" "AIR domain"

echo ""
echo "=== Tier Labels ==="
create_label "tier:t1" "FBCA04" "Tier 1 — Core"
create_label "tier:t2" "FBCA04" "Tier 2 — Extended"
create_label "tier:t3" "FBCA04" "Tier 3 — Experimental"

echo ""
echo "=== Phase Labels ==="
create_label "phase:0" "C2E0C6" "Phase 0 — Ideation"
create_label "phase:1" "C2E0C6" "Phase 1 — Definition"
create_label "phase:2" "C2E0C6" "Phase 2 — Design"
create_label "phase:3" "C2E0C6" "Phase 3 — Build"
create_label "phase:4" "C2E0C6" "Phase 4 — Test"
create_label "phase:5" "C2E0C6" "Phase 5 — Deploy"

echo ""
echo "=== Project Labels ==="
create_label "visualiser" "0075CA" "Ontology Visualiser project"

echo ""
echo "Done. All labels are in place."
