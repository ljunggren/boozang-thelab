#!/usr/bin/env bash
set -euo pipefail

REPO="ljunggren/boozang-thelab"
GH_USER="ljunggren"
INTERVAL="${1:-60}"
AUTO_MERGE="${2:-true}"

# Checks to ignore when evaluating CI status (flaky or legacy workflows)
IGNORED_CHECKS="run-boozang-tests|github-actions-example"

echo "Polling for Devin PRs every ${INTERVAL}s on ${REPO} (auto-merge: ${AUTO_MERGE})..."
echo "Press Ctrl+C to stop."

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SEEN_PRS=""
MERGED_PRS=""
FAILED_LOCAL=""
REBASE_REQUESTED=""

ensure_gh_auth() {
  ACTIVE=$(gh auth status 2>&1 | grep -B2 'Active account: true' | head -1 || true)
  if ! echo "$ACTIVE" | grep -q "$GH_USER"; then
    echo "  🔑 Switching gh auth to ${GH_USER}..."
    gh auth switch --user "$GH_USER" 2>/dev/null || true
  fi
}

# Run local tests on a PR branch, return 0 if pass, 1 if fail
run_local_tests() {
  local pr_num="$1"
  local pr_branch

  pr_branch=$(gh pr view "$pr_num" --repo "$REPO" --json headRefName --jq '.headRefName' 2>/dev/null || true)
  if [ -z "$pr_branch" ]; then
    echo "  ⚠️  PR #${pr_num}: could not determine branch name, skipping local tests"
    return 0
  fi

  echo "  🔬 PR #${pr_num}: running local tests on branch '${pr_branch}'..."

  # Save current branch
  local original_branch
  original_branch=$(git -C "$PROJECT_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")

  # Fetch and checkout the PR branch
  if ! git -C "$PROJECT_ROOT" fetch origin "$pr_branch" 2>/dev/null; then
    echo "  ⚠️  PR #${pr_num}: could not fetch branch, skipping local tests"
    return 0
  fi

  git -C "$PROJECT_ROOT" checkout "$pr_branch" 2>/dev/null || {
    echo "  ⚠️  PR #${pr_num}: could not checkout branch, skipping local tests"
    return 0
  }

  git -C "$PROJECT_ROOT" pull origin "$pr_branch" 2>/dev/null || true

  # Install deps if needed
  (cd "$PROJECT_ROOT" && npm install --silent 2>/dev/null) || true

  # Run build
  local build_ok=true test_ok=true
  echo "  📦 PR #${pr_num}: running npm run build..."
  if ! (cd "$PROJECT_ROOT" && npm run build 2>&1 | tail -3); then
    echo "  ❌ PR #${pr_num}: build failed"
    build_ok=false
  fi

  # Run tests
  if $build_ok; then
    echo "  🧪 PR #${pr_num}: running npm test..."
    if ! (cd "$PROJECT_ROOT" && CI=true npm test 2>&1 | tail -5); then
      echo "  ❌ PR #${pr_num}: tests failed"
      test_ok=false
    fi
  fi

  # Return to original branch
  git -C "$PROJECT_ROOT" checkout "$original_branch" 2>/dev/null || true

  if $build_ok && $test_ok; then
    echo "  ✅ PR #${pr_num}: local tests passed"
    return 0
  else
    return 1
  fi
}

while true; do
  PRS=$(gh pr list --repo "$REPO" --author "devin-ai-integration[bot]" --json number,title,url,mergeable --jq '.[] | "\(.number)\t\(.title)\t\(.url)\t\(.mergeable)"' 2>/dev/null || true)

  if [ -n "$PRS" ]; then
    while IFS= read -r line; do
      PR_NUM=$(echo "$line" | cut -f1)
      PR_MERGEABLE=$(echo "$line" | cut -f4)

      # Notify on new PRs
      if [[ ! " $SEEN_PRS " =~ " $PR_NUM " ]]; then
        SEEN_PRS="$SEEN_PRS $PR_NUM"
        echo ""
        echo "🔔 NEW PR from Devin!"
        echo "$line" | awk -F'\t' '{printf "  #%s: %s\n  %s\n", $1, $2, $3}'
        osascript -e "display notification \"PR #${PR_NUM} opened by Devin\" with title \"Devin PR Ready\" sound name \"Glass\"" 2>/dev/null || true
      fi

      # Skip already merged PRs
      if [[ " $MERGED_PRS " =~ " $PR_NUM " ]]; then
        continue
      fi

      # Detect merge conflicts and ask Devin to rebase (once per PR)
      if [[ "$PR_MERGEABLE" == "CONFLICTING" && ! " $REBASE_REQUESTED " =~ " $PR_NUM " ]]; then
        echo "  ⚠️  PR #${PR_NUM}: merge conflict detected — asking Devin to rebase..."
        ensure_gh_auth
        gh pr comment "$PR_NUM" --repo "$REPO" \
          --body "@devin-ai-integration This PR has a merge conflict. Please rebase on main, resolve conflicts, and force-push." 2>/dev/null || true
        REBASE_REQUESTED="$REBASE_REQUESTED $PR_NUM"
        osascript -e "display notification \"PR #${PR_NUM} has merge conflicts\" with title \"Devin PR Conflict\" sound name \"Basso\"" 2>/dev/null || true
        continue
      fi

      # Skip if still conflicting (waiting for Devin to rebase)
      if [[ "$PR_MERGEABLE" == "CONFLICTING" ]]; then
        continue
      fi

      # Reset rebase flag if conflict is resolved
      if [[ " $REBASE_REQUESTED " =~ " $PR_NUM " && "$PR_MERGEABLE" != "CONFLICTING" ]]; then
        REBASE_REQUESTED=$(echo "$REBASE_REQUESTED" | sed "s/ $PR_NUM / /g")
        echo "  ✅ PR #${PR_NUM}: conflict resolved!"
      fi

      # Auto-merge if CI passed
      if [[ "$AUTO_MERGE" == "true" ]]; then
        CHECKS=$(gh pr checks "$PR_NUM" --repo "$REPO" 2>&1 || true)

        # Filter out ignored checks
        FILTERED_CHECKS=$(echo "$CHECKS" | grep -vE "$IGNORED_CHECKS" || true)

        if echo "$FILTERED_CHECKS" | grep -q "fail"; then
          echo "  ⏳ PR #${PR_NUM}: CI has failures, skipping merge"
        elif echo "$FILTERED_CHECKS" | grep -q "pending"; then
          echo "  ⏳ PR #${PR_NUM}: CI still running..."
        elif echo "$FILTERED_CHECKS" | grep -q "pass"; then
          echo "  ✅ PR #${PR_NUM}: CI passed"

          # Skip if local tests already failed for this PR
          if [[ " $FAILED_LOCAL " =~ " $PR_NUM " ]]; then
            echo "  ⏭️  PR #${PR_NUM}: local tests previously failed, skipping"
            continue
          fi

          # Run local build + tests before merging
          if run_local_tests "$PR_NUM"; then
            echo "  🚀 PR #${PR_NUM}: merging..."
            ensure_gh_auth
            if gh pr merge "$PR_NUM" --repo "$REPO" --merge --delete-branch 2>&1; then
              MERGED_PRS="$MERGED_PRS $PR_NUM"
              echo "  🎉 PR #${PR_NUM} merged! (branch deleted)"
              osascript -e "display notification \"PR #${PR_NUM} auto-merged\" with title \"Devin PR Merged\" sound name \"Glass\"" 2>/dev/null || true
            else
              echo "  ❌ PR #${PR_NUM}: merge failed"
            fi
          else
            FAILED_LOCAL="$FAILED_LOCAL $PR_NUM"
            echo "  🛑 PR #${PR_NUM}: local tests failed — not merging"
            osascript -e "display notification \"PR #${PR_NUM} failed local tests\" with title \"Devin PR Blocked\" sound name \"Basso\"" 2>/dev/null || true
          fi
        fi
      fi

    done <<< "$PRS"
  fi

  sleep "$INTERVAL"
done
