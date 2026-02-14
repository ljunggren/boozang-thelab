#!/usr/bin/env bash
set -euo pipefail

REPO="ljunggren/boozang-thelab"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if [ -z "${1:-}" ]; then
  echo "Usage: $0 <issue-number>"
  exit 1
fi

ISSUE_NUMBER="$1"

# Load API key
if [ -f "$ENV_FILE" ]; then
  source "$ENV_FILE"
fi

if [ -z "${DEVIN_API_KEY:-}" ]; then
  echo "Error: DEVIN_API_KEY not set. Add it to .env or export it."
  exit 1
fi

# Fetch issue details from GitHub
ISSUE_JSON=$(gh issue view "$ISSUE_NUMBER" --repo "$REPO" --json title,url)
ISSUE_TITLE=$(echo "$ISSUE_JSON" | jq -r '.title')
ISSUE_URL=$(echo "$ISSUE_JSON" | jq -r '.url')

PROMPT="Work on issue #${ISSUE_NUMBER} in ${REPO}: ${ISSUE_TITLE}

Issue URL: ${ISSUE_URL}

Read the full issue description at the URL above. Follow the branch naming, scope, and acceptance criteria specified in the issue. Open a PR when done."

echo "Triggering Devin for issue #${ISSUE_NUMBER}: ${ISSUE_TITLE}"

RESPONSE=$(curl -s -X POST https://api.devin.ai/v1/sessions \
  -H "Authorization: Bearer ${DEVIN_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg prompt "$PROMPT" --arg title "Issue #${ISSUE_NUMBER}: ${ISSUE_TITLE}" '{prompt: $prompt, title: $title, idempotent: true}')")

SESSION_URL=$(echo "$RESPONSE" | jq -r '.url // empty')

if [ -z "$SESSION_URL" ]; then
  echo "Error: Failed to create Devin session"
  echo "$RESPONSE" | jq .
  exit 1
fi

echo "Session created: $SESSION_URL"

# Comment on the issue
gh issue comment "$ISSUE_NUMBER" --repo "$REPO" \
  --body "🤖 Devin session triggered via API: ${SESSION_URL}"

echo "Commented session link on issue #${ISSUE_NUMBER}"
