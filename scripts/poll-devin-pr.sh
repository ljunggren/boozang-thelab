#!/usr/bin/env bash
set -euo pipefail

REPO="ljunggren/boozang-thelab"
INTERVAL="${1:-60}"
AUTO_MERGE="${2:-true}"

echo "Polling for Devin PRs every ${INTERVAL}s on ${REPO} (auto-merge: ${AUTO_MERGE})..."
echo "Press Ctrl+C to stop."

SEEN_PRS=""
MERGED_PRS=""

while true; do
  PRS=$(gh pr list --repo "$REPO" --author "devin-ai-integration[bot]" --json number,title,url --jq '.[] | "\(.number)\t\(.title)\t\(.url)"' 2>/dev/null || true)

  if [ -n "$PRS" ]; then
    while IFS= read -r line; do
      PR_NUM=$(echo "$line" | cut -f1)

      # Notify on new PRs
      if [[ ! " $SEEN_PRS " =~ " $PR_NUM " ]]; then
        SEEN_PRS="$SEEN_PRS $PR_NUM"
        echo ""
        echo "🔔 NEW PR from Devin!"
        echo "$line" | awk -F'\t' '{printf "  #%s: %s\n  %s\n", $1, $2, $3}'
        osascript -e "display notification \"PR #${PR_NUM} opened by Devin\" with title \"Devin PR Ready\" sound name \"Glass\"" 2>/dev/null || true
      fi

      # Auto-merge if CI passed
      if [[ "$AUTO_MERGE" == "true" && ! " $MERGED_PRS " =~ " $PR_NUM " ]]; then
        CHECKS=$(gh pr checks "$PR_NUM" --repo "$REPO" 2>&1 || true)

        if echo "$CHECKS" | grep -q "fail"; then
          echo "  ⏳ PR #${PR_NUM}: CI has failures, skipping merge"
        elif echo "$CHECKS" | grep -q "pending"; then
          echo "  ⏳ PR #${PR_NUM}: CI still running..."
        elif echo "$CHECKS" | grep -q "pass"; then
          echo "  ✅ PR #${PR_NUM}: CI passed — merging..."
          if gh pr merge "$PR_NUM" --repo "$REPO" --merge 2>&1; then
            MERGED_PRS="$MERGED_PRS $PR_NUM"
            echo "  🎉 PR #${PR_NUM} merged!"
            osascript -e "display notification \"PR #${PR_NUM} auto-merged\" with title \"Devin PR Merged\" sound name \"Glass\"" 2>/dev/null || true
          else
            echo "  ❌ PR #${PR_NUM}: merge failed"
          fi
        fi
      fi

    done <<< "$PRS"
  fi

  sleep "$INTERVAL"
done
