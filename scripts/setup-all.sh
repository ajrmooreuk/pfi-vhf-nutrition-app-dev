#!/usr/bin/env bash
# setup-all.sh — Run all Azlan workflow setup scripts in sequence
# Part of Azlan Workflow Packaging (Epic 9K, F9K.3)
#
# Usage: ./scripts/setup-all.sh --repo owner/repo --owner login --project-title name [--mode solo|team]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

REPO=""
OWNER=""
PROJECT_TITLE=""
MODE="solo"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)            REPO="$2"; shift 2 ;;
    --owner)           OWNER="$2"; shift 2 ;;
    --project-title)   PROJECT_TITLE="$2"; shift 2 ;;
    --mode)            MODE="$2"; shift 2 ;;
    --help|-h)
      echo "Usage: $0 --repo owner/repo --owner login --project-title name [--mode solo|team]"
      echo ""
      echo "Provisions a repository with the full Azlan workflow in one command."
      echo "Runs: setup-labels → setup-branch-protection → setup-gh-project"
      echo ""
      echo "Options:"
      echo "  --repo owner/repo        Target repository (required)"
      echo "  --owner login            GitHub user or org for project board (required)"
      echo "  --project-title name     Project board name (required)"
      echo "  --mode solo|team         Branch protection mode (default: solo)"
      echo "  --help                   Show this help message"
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ -z "$REPO" || -z "$OWNER" || -z "$PROJECT_TITLE" ]]; then
  echo "Error: --repo, --owner, and --project-title are all required."
  echo "Run with --help for usage."
  exit 1
fi

echo "============================================"
echo " Azlan Workflow — Full Repository Setup"
echo "============================================"
echo ""
echo "  Repository:    $REPO"
echo "  Owner:         $OWNER"
echo "  Project:       $PROJECT_TITLE"
echo "  Branch Mode:   $MODE"
echo ""

echo "============================================"
echo " Step 1/3: Labels"
echo "============================================"
"$SCRIPT_DIR/setup-labels.sh" --repo "$REPO"

echo ""
echo "============================================"
echo " Step 2/3: Branch Protection"
echo "============================================"
"$SCRIPT_DIR/setup-branch-protection.sh" --repo "$REPO" --mode "$MODE"

echo ""
echo "============================================"
echo " Step 3/3: Project Board"
echo "============================================"
"$SCRIPT_DIR/setup-gh-project.sh" --owner "$OWNER" --project-title "$PROJECT_TITLE" --repo "$REPO"

echo ""
echo "============================================"
echo " Setup Complete"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Copy .github/ISSUE_TEMPLATE/ to your repo if using template"
echo "  2. Copy .github/pull_request_template.md to your repo"
echo "  3. Copy .github/workflows/ enforcement workflows to your repo"
echo "  4. Run: ./scripts/migrate-issues-into-hierarchy.sh --repo $REPO"
echo "     (to classify existing issues)"
