#!/usr/bin/env bash
# migrate-issues-into-hierarchy.sh — Classify existing issues into the hierarchy
# Part of Azlan Workflow Packaging (Epic 9K, F9K.3)
#
# Usage: ./scripts/migrate-issues-into-hierarchy.sh --repo owner/repo [--project-owner login] [--project-number N] [--dry-run]

set -euo pipefail

REPO=""
PROJECT_OWNER=""
PROJECT_NUMBER=""
DRY_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)             REPO="$2"; shift 2 ;;
    --project-owner)    PROJECT_OWNER="$2"; shift 2 ;;
    --project-number)   PROJECT_NUMBER="$2"; shift 2 ;;
    --dry-run)          DRY_RUN=true; shift ;;
    --help|-h)
      echo "Usage: $0 --repo owner/repo [--project-owner login] [--project-number N] [--dry-run]"
      echo ""
      echo "Scans existing issues and applies hierarchy labels based on title patterns."
      echo ""
      echo "Options:"
      echo "  --repo owner/repo        Target repository (required)"
      echo "  --project-owner login    Project owner for adding to project board"
      echo "  --project-number N       Project number for adding to project board"
      echo "  --dry-run                Report changes without applying"
      echo "  --help                   Show this help message"
      echo ""
      echo "Detected Patterns:"
      echo "  'Epic N:'     → type:epic"
      echo "  'FN.x:'       → type:feature"
      echo "  'SN.x.y:'     → type:story"
      echo "  '[PBS]'        → type:pbs"
      echo "  '[WBS]'        → type:wbs"
      echo "  '[Registry]'   → type:registry"
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ -z "$REPO" ]]; then
  echo "Error: --repo is required."
  exit 1
fi

PREFIX=""
if $DRY_RUN; then
  PREFIX="[DRY RUN] "
fi

echo "${PREFIX}Scanning issues in $REPO..."
echo ""

TOTAL=0
LABELED=0
SKIPPED=0
ADDED_TO_PROJECT=0

# Fetch all open issues
ISSUES=$(gh issue list --repo "$REPO" --state open --limit 500 --json number,title,labels)

# Process each pattern
process_pattern() {
  local pattern="$1"
  local label="$2"
  local type_name="$3"

  echo "=== Scanning for $type_name issues ==="

  local matches
  matches=$(echo "$ISSUES" | jq -r --arg pat "$pattern" '.[] | select(.title | test($pat)) | "\(.number)\t\(.title)\t\([.labels[].name] | join(","))"')

  if [[ -z "$matches" ]]; then
    echo "  No matches found."
    echo ""
    return
  fi

  while IFS=$'\t' read -r number title labels; do
    TOTAL=$((TOTAL + 1))

    if echo "$labels" | grep -qF "$label"; then
      echo "  [skip] #$number — already has $label"
      SKIPPED=$((SKIPPED + 1))
    else
      if $DRY_RUN; then
        echo "  [would label] #$number — $title → $label"
      else
        gh issue edit "$number" --repo "$REPO" --add-label "$label"
        echo "  [labeled] #$number — $title → $label"
      fi
      LABELED=$((LABELED + 1))
    fi

    # Add to project if configured
    if [[ -n "$PROJECT_OWNER" && -n "$PROJECT_NUMBER" ]]; then
      if $DRY_RUN; then
        echo "  [would add to project] #$number"
      else
        gh project item-add "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --url "https://github.com/$REPO/issues/$number" 2>/dev/null && \
          ADDED_TO_PROJECT=$((ADDED_TO_PROJECT + 1)) || true
      fi
    fi
  done <<< "$matches"

  echo ""
}

process_pattern "^Epic\\s+\\d+" "type:epic" "Epic"
process_pattern "^F\\d+[A-Z]?\\.\\d+" "type:feature" "Feature"
process_pattern "^S\\d+[A-Z]?\\.\\d+\\.\\d+" "type:story" "Story"
process_pattern "^\\[PBS\\]" "type:pbs" "PBS"
process_pattern "^\\[WBS\\]" "type:wbs" "WBS"
process_pattern "^\\[Registry\\]" "type:registry" "Registry"

echo "=== Summary ==="
echo "${PREFIX}Issues scanned: $TOTAL"
echo "${PREFIX}Labels applied: $LABELED"
echo "${PREFIX}Already correct: $SKIPPED"
if [[ -n "$PROJECT_OWNER" && -n "$PROJECT_NUMBER" ]]; then
  echo "${PREFIX}Added to project: $ADDED_TO_PROJECT"
fi
