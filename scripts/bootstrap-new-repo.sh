#!/usr/bin/env bash
# bootstrap-new-repo.sh — One-command setup for a new Azlan workflow repo
# Part of Azlan Workflow Packaging (Epic 9K)
#
# Usage:
#   gh api repos/ajrmooreuk/Azlan-EA-AAA/contents/scripts/bootstrap-new-repo.sh -q '.content' | base64 -d | bash -s -- my-repo-name
#
# Or locally (interactive — prompts for name/options):
#   ./scripts/bootstrap-new-repo.sh
#
# Or with arguments (non-interactive):
#   ./scripts/bootstrap-new-repo.sh my-repo-name [--mode solo|team] [--private] [--with-plugin] [--project-title "Name"]

set -euo pipefail

# ─── Defaults ───────────────────────────────────────────────
REPO_NAME=""
MODE="solo"
VISIBILITY="--public"
WITH_PLUGIN=false
PROJECT_TITLE=""
SOURCE_REPO="ajrmooreuk/Azlan-EA-AAA"
SOURCE_BRANCH="main"

# ─── Colours (if terminal supports them) ────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

banner()  { echo -e "\n${BLUE}${BOLD}══════════════════════════════════════════${NC}"; echo -e "${BLUE}${BOLD}  $1${NC}"; echo -e "${BLUE}${BOLD}══════════════════════════════════════════${NC}\n"; }
step()    { echo -e "${GREEN}✓${NC} $1"; }
info()    { echo -e "${YELLOW}→${NC} $1"; }
fail()    { echo -e "${RED}✗ $1${NC}"; exit 1; }

# ─── Parse arguments ────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)           MODE="$2"; shift 2 ;;
    --private)        VISIBILITY="--private"; shift ;;
    --with-plugin)    WITH_PLUGIN=true; shift ;;
    --project-title)  PROJECT_TITLE="$2"; shift 2 ;;
    --source-branch)  SOURCE_BRANCH="$2"; shift 2 ;;
    --help|-h)
      cat <<'HELP'
Usage: bootstrap-new-repo.sh [<repo-name>] [options]

Creates a new GitHub repository fully configured with the Azlan workflow.
Run with no arguments for interactive mode (prompts for name and options).

Arguments:
  <repo-name>              Name for the new repository (interactive if omitted)

Options:
  --mode solo|team         Branch protection level (default: solo)
  --private                Create a private repo (default: public)
  --with-plugin            Also install the Claude Code plugin
  --project-title "Name"   Project board name (default: repo name)
  --help                   Show this help message

What it does (in order):
  1. Creates the GitHub repository
  2. Downloads issue templates, PR template, workflows, scripts
  3. Commits and pushes everything to main
  4. Creates standard labels (type, domain, tier, phase)
  5. Configures branch protection on main
  6. Creates a project board with standard fields
  7. (Optional) Downloads the Claude Code plugin

Examples:
  ./scripts/bootstrap-new-repo.sh                                    # interactive mode
  ./scripts/bootstrap-new-repo.sh my-new-project
  ./scripts/bootstrap-new-repo.sh my-new-project --mode team --private
  ./scripts/bootstrap-new-repo.sh my-new-project --with-plugin --project-title "Sprint Board"

One-liner (downloads and runs — works with private repos):
  gh api repos/ajrmooreuk/Azlan-EA-AAA/contents/scripts/bootstrap-new-repo.sh -q '.content' | base64 -d | bash -s --              # interactive
  gh api repos/ajrmooreuk/Azlan-EA-AAA/contents/scripts/bootstrap-new-repo.sh -q '.content' | base64 -d | bash -s -- my-new-project
HELP
      exit 0
      ;;
    -*)  fail "Unknown option: $1 (run with --help)" ;;
    *)   REPO_NAME="$1"; shift ;;
  esac
done

# ─── Validation ─────────────────────────────────────────────
command -v gh >/dev/null 2>&1 || fail "GitHub CLI (gh) is not installed.\n  Install it from: https://cli.github.com/"
gh auth status >/dev/null 2>&1 || fail "GitHub CLI is not authenticated.\n  Run: gh auth login"

OWNER=$(gh api user --jq '.login')

# ─── Interactive mode (when no repo name supplied) ──────────
if [[ -z "$REPO_NAME" ]]; then
  banner "Azlan Workflow — Interactive Setup"
  echo -e "  Logged in as: ${BOLD}$OWNER${NC}"
  echo ""

  # Read from /dev/tty so prompts work even when script is piped via stdin
  read -rp "  Repository name: " REPO_NAME < /dev/tty
  [[ -z "$REPO_NAME" ]] && fail "Repository name cannot be empty."

  read -rp "  Project board title [${REPO_NAME}]: " PROJECT_TITLE < /dev/tty
  PROJECT_TITLE="${PROJECT_TITLE:-$REPO_NAME}"

  echo ""
  echo "  Visibility:"
  echo "    1) public  (default)"
  echo "    2) private"
  read -rp "  Choose [1]: " vis_choice < /dev/tty
  case "${vis_choice:-1}" in
    2) VISIBILITY="--private" ;;
    *) VISIBILITY="--public"  ;;
  esac

  echo ""
  echo "  Branch protection mode:"
  echo "    1) solo  (default) — PRs optional, force-push blocked"
  echo "    2) team  — PRs required, 1 approval"
  read -rp "  Choose [1]: " mode_choice < /dev/tty
  case "${mode_choice:-1}" in
    2) MODE="team" ;;
    *) MODE="solo" ;;
  esac

  echo ""
  read -rp "  Install Claude Code plugin? (y/N): " plugin_choice < /dev/tty
  case "${plugin_choice:-n}" in
    [yY]*) WITH_PLUGIN=true ;;
    *)     WITH_PLUGIN=false ;;
  esac

  echo ""
fi

FULL_REPO="$OWNER/$REPO_NAME"

if [[ -z "$PROJECT_TITLE" ]]; then
  PROJECT_TITLE="$REPO_NAME"
fi

banner "Azlan Workflow — Bootstrap"
echo "  Repository:    $FULL_REPO"
echo "  Visibility:    ${VISIBILITY#--}"
echo "  Protection:    $MODE"
echo "  Project board: $PROJECT_TITLE"
echo "  Plugin:        $WITH_PLUGIN"
echo ""

# ─── Helper: download a file from source repo ──────────────
download_file() {
  local remote_path="$1"
  local local_path="$2"
  local dir
  dir=$(dirname "$local_path")
  mkdir -p "$dir"
  gh api "repos/$SOURCE_REPO/contents/$remote_path?ref=$SOURCE_BRANCH" -q '.content' | base64 -d > "$local_path" 2>/dev/null
}

# ─── Step 1: Create repository ──────────────────────────────
banner "Step 1/7 — Create Repository"

if gh repo view "$FULL_REPO" >/dev/null 2>&1; then
  info "Repository $FULL_REPO already exists — using it."
  if [[ -d "$REPO_NAME" ]]; then
    info "Directory $REPO_NAME already exists locally — using it."
  else
    gh repo clone "$FULL_REPO" "$REPO_NAME" -- --quiet 2>/dev/null || true
  fi
else
  gh repo create "$REPO_NAME" $VISIBILITY --clone
  step "Created $FULL_REPO"
fi

cd "$REPO_NAME"

# Ensure we have at least one commit (for branch protection to work)
if ! git log --oneline -1 >/dev/null 2>&1; then
  echo "# $REPO_NAME" > README.md
  git add README.md
  git commit -m "Initial commit" --quiet
  git push --quiet 2>/dev/null || git push --set-upstream origin main --quiet
fi
step "Repository ready"

# ─── Step 2: Download templates and workflows ───────────────
banner "Step 2/7 — Download Workflow Files"

TEMPLATE_FILES=(
  ".github/ISSUE_TEMPLATE/epic.yml"
  ".github/ISSUE_TEMPLATE/feature.yml"
  ".github/ISSUE_TEMPLATE/story.yml"
  ".github/ISSUE_TEMPLATE/pbs.yml"
  ".github/ISSUE_TEMPLATE/wbs.yml"
  ".github/ISSUE_TEMPLATE/config.yml"
  ".github/pull_request_template.md"
  ".github/labels.yml"
  ".github/workflows/enforce-registry-link.yml"
  ".github/workflows/validate-issue-naming.yml"
  ".github/workflows/validate-labels.yml"
)

for f in "${TEMPLATE_FILES[@]}"; do
  download_file "$f" "$f"
  step "$f"
done

# ─── Step 3: Download setup scripts ─────────────────────────
banner "Step 3/7 — Download Setup Scripts"

SCRIPT_FILES=(
  "scripts/setup-labels.sh"
  "scripts/setup-branch-protection.sh"
  "scripts/setup-gh-project.sh"
  "scripts/migrate-issues-into-hierarchy.sh"
  "scripts/setup-all.sh"
  "scripts/bootstrap-new-repo.sh"
)

for f in "${SCRIPT_FILES[@]}"; do
  download_file "$f" "$f"
  step "$f"
done
chmod +x scripts/*.sh
step "Scripts made executable"

# ─── Step 4: Commit and push ────────────────────────────────
banner "Step 4/7 — Commit & Push"

git add .
git commit -m "feat: add Azlan workflow conventions (bootstrapped)" --quiet
git push --quiet
step "All files pushed to main"

# ─── Step 5: Create labels ──────────────────────────────────
banner "Step 5/7 — Create Labels"

./scripts/setup-labels.sh --repo "$FULL_REPO"
step "Labels configured"

# ─── Step 6: Branch protection ──────────────────────────────
banner "Step 6/7 — Branch Protection"

./scripts/setup-branch-protection.sh --repo "$FULL_REPO" --mode "$MODE"
step "Branch protection set ($MODE mode)"

# ─── Step 7: Project board ──────────────────────────────────
banner "Step 7/7 — Project Board"

./scripts/setup-gh-project.sh --owner "$OWNER" --project-title "$PROJECT_TITLE" --repo "$FULL_REPO"
step "Project board created"

# ─── Optional: Plugin ────────────────────────────────────────
if $WITH_PLUGIN; then
  banner "Bonus — Claude Code Plugin"

  PLUGIN_FILES=(
    "azlan-github-workflow/.claude-plugin/plugin.json"
    "azlan-github-workflow/skills/setup-repo/SKILL.md"
    "azlan-github-workflow/skills/create-epic/SKILL.md"
    "azlan-github-workflow/skills/create-feature/SKILL.md"
    "azlan-github-workflow/skills/create-story/SKILL.md"
    "azlan-github-workflow/skills/setup-project-board/SKILL.md"
    "azlan-github-workflow/skills/review-hierarchy/SKILL.md"
    "azlan-github-workflow/README.md"
  )

  for f in "${PLUGIN_FILES[@]}"; do
    download_file "$f" "$f"
    step "$f"
  done

  git add azlan-github-workflow/
  git commit -m "feat: add Azlan Claude Code plugin" --quiet
  git push --quiet
  step "Plugin installed"

  echo ""
  info "To use the plugin, launch Claude Code with:"
  echo "  claude --plugin-dir ./azlan-github-workflow"
fi

# ─── Done ────────────────────────────────────────────────────
banner "Setup Complete"

echo "  Repository:    https://github.com/$FULL_REPO"
echo "  Issues:        https://github.com/$FULL_REPO/issues/new/choose"
echo "  Labels:        https://github.com/$FULL_REPO/labels"
echo "  Actions:       https://github.com/$FULL_REPO/actions"
echo "  Project:       https://github.com/users/$OWNER/projects/"
echo ""
echo "  Try creating your first Epic:"
echo "    gh issue create --repo $FULL_REPO --label 'type:epic' --title 'Epic 1: My First Epic' --body 'Testing the workflow'"
echo ""
if $WITH_PLUGIN; then
  echo "  Or use the Claude Code plugin:"
  echo "    claude --plugin-dir ./azlan-github-workflow"
  echo "    Then type: /azlan-github-workflow:create-epic My First Epic"
  echo ""
fi
step "All done. Your repo is fully configured."
