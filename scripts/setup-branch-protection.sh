#!/usr/bin/env bash
# setup-branch-protection.sh — Configure branch protection rules
# Part of Azlan Workflow Packaging (Epic 9K, F9K.3)
#
# Usage: ./scripts/setup-branch-protection.sh [--repo owner/repo] [--mode solo|team]

set -euo pipefail

REPO=""
MODE="solo"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)   REPO="$2"; shift 2 ;;
    --mode)   MODE="$2"; shift 2 ;;
    --help|-h)
      echo "Usage: $0 [--repo owner/repo] [--mode solo|team]"
      echo ""
      echo "Configures branch protection rules for the main branch."
      echo ""
      echo "Options:"
      echo "  --repo owner/repo   Target repository (default: current repo)"
      echo "  --mode solo|team    Protection level (default: solo)"
      echo "    solo: No force push, no deletions, 0 required reviews"
      echo "    team: 1 required review, status checks, conversation resolution"
      echo "  --help              Show this help message"
      echo ""
      echo "Emergency Override (team mode):"
      echo "  Admins can temporarily disable protection via repo settings."
      echo "  Re-run this script after emergency to restore protection."
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# Determine repo
if [[ -z "$REPO" ]]; then
  REPO=$(gh repo view --json nameWithOwner --jq '.nameWithOwner')
fi

echo "Configuring branch protection for $REPO (mode: $MODE)..."

if [[ "$MODE" == "solo" ]]; then
  gh api "repos/$REPO/branches/main/protection" \
    --method PUT \
    --input - <<'EOF'
{
  "required_pull_request_reviews": {
    "required_approving_review_count": 0
  },
  "enforce_admins": false,
  "required_status_checks": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF

elif [[ "$MODE" == "team" ]]; then
  gh api "repos/$REPO/branches/main/protection" \
    --method PUT \
    --input - <<'EOF'
{
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "require_code_owner_reviews": false,
    "dismiss_stale_reviews": true
  },
  "enforce_admins": true,
  "required_status_checks": {
    "strict": true,
    "contexts": []
  },
  "required_conversation_resolution": true,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF

else
  echo "Error: --mode must be 'solo' or 'team'"
  exit 1
fi

echo ""
echo "Branch protection configured for main branch."
echo ""
echo "Verification: try 'git push --force origin main' — it should be rejected."
