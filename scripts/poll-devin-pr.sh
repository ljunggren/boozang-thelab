#!/usr/bin/env bash
set -euo pipefail

REPO="ljunggren/boozang-thelab"
INTERVAL="${1:-60}"

echo "Polling for new Devin PRs every ${INTERVAL}s on ${REPO}..."
echo "Press Ctrl+C to stop."

SEEN_PRS=""

while true; do
  PRS=$(gh pr list --repo "$REPO" --author "devin-ai-integration[bot]" --json number,title,url,createdAt --jq '.[] | "\(.number)\t\(.title)\t\(.url)"' 2>/dev/null || true)

  if [ -n "$PRS" ]; then
    while IFS= read -r line; do
      PR_NUM=$(echo "$line" | cut -f1)
      if [[ ! " $SEEN_PRS " =~ " $PR_NUM " ]]; then
        SEEN_PRS="$SEEN_PRS $PR_NUM"
        echo ""
        echo "🔔 NEW PR from Devin!"
        echo "$line" | awk -F'\t' '{printf "  #%s: %s\n  %s\n", $1, $2, $3}'
        # macOS notification
        osascript -e "display notification \"PR #${PR_NUM} opened by Devin\" with title \"Devin PR Ready\" sound name \"Glass\"" 2>/dev/null || true
      fi
    done <<< "$PRS"
  fi

  sleep "$INTERVAL"
done
