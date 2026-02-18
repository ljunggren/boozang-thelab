#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# orchestrate.sh — Detect gaps, create GitHub issues, trigger Devin sessions
#
# Usage: scripts/orchestrate.sh [--execute] [--max=N]
#
# Dry-run by default. Pass --execute to create issues and trigger Devin.
###############################################################################

REPO="ljunggren/boozang-thelab"
GH_USER="ljunggren"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
APP_JS="$PROJECT_ROOT/src/App.js"
E2E_DIR="$PROJECT_ROOT/e2e"
COMPONENTS_DIR="$PROJECT_ROOT/src/components"

DRY_RUN=true
MAX_ISSUES=3

# Components to skip (games, meta pages — not useful for automation tasks)
SKIP_LIST="KittenCollect|CanvasGame|Home|Introduction|Overview|NotFound"

# Parse arguments
for arg in "$@"; do
  case "$arg" in
    --execute) DRY_RUN=false ;;
    --max=*) MAX_ISSUES="${arg#--max=}" ;;
    *) echo "Unknown arg: $arg"; exit 1 ;;
  esac
done

###############################################################################
# Auth
###############################################################################
ensure_gh_auth() {
  ACTIVE=$(gh auth status 2>&1 | grep -B2 'Active account: true' | head -1 || true)
  if ! echo "$ACTIVE" | grep -q "$GH_USER"; then
    echo "Switching gh auth to ${GH_USER}..."
    gh auth switch --user "$GH_USER" 2>/dev/null || true
  fi
}

###############################################################################
# Gap detectors — each prints "CATEGORY|ComponentName|route|file" lines
###############################################################################

detect_missing_e2e() {
  # Extract routes and component names from App.js
  # Collapse Route+Component pairs onto single lines, then extract
  sed -n '/path="\//{N;s/\n/ /;p;}' "$APP_JS" \
    | sed -n 's/.*path="\(\/[^"]*\)".*<\([A-Z][a-zA-Z]*\) \/>.*/\2\t\1/p' \
  | while IFS=$'\t' read -r comp route; do
    # Skip list
    if echo "$comp" | grep -qE "^($SKIP_LIST)$"; then
      continue
    fi

    # Normalize: SortedList -> sortedlist, ScrambleItems -> scrambleitems
    spec_name=$(echo "$comp" | tr '[:upper:]' '[:lower:]')
    if ! ls "$E2E_DIR"/${spec_name}.spec.js 2>/dev/null | grep -q .; then
      # Find the component file
      comp_file=$(find "$COMPONENTS_DIR" -name "${comp}.js" -o -name "${comp}.jsx" 2>/dev/null | head -1)
      comp_file="${comp_file:-unknown}"
      echo "e2e|${comp}|${route}|${comp_file}"
    fi
  done
}

detect_a11y_issues() {
  # Find onClick on non-button elements (div, span, td, i) without onKeyDown
  find "$COMPONENTS_DIR" -name "*.js" -o -name "*.jsx" | while read -r file; do
    # Skip files in the skip list
    basename_no_ext=$(basename "$file" | sed 's/\.\(js\|jsx\)$//')
    if echo "$basename_no_ext" | grep -qE "^($SKIP_LIST)$"; then
      continue
    fi

    # Look for elements with onClick but no onKeyDown on the same element
    # We check for non-button/a/input elements with onClick
    awk '
      /<(div|span|td|tr|i|li|p|section|article)\b/ && /onClick/ && !/onKeyDown/ && !/onKeyPress/ {
        found = 1
      }
      END { if (found) print FILENAME }
    ' "$file"
  done | sort -u | while read -r file; do
    comp_name=$(basename "$file" | sed 's/\.\(js\|jsx\)$//')
    # Find route for this component from App.js (best effort)
    route=$(sed -n '/path="\//{N;s/\n/ /;p;}' "$APP_JS" \
      | grep "<${comp_name} />" \
      | sed -n 's/.*path="\(\/[^"]*\)".*/\1/p' \
      | head -1)
    route="${route:-/unknown}"
    echo "a11y|${comp_name}|${route}|${file}"
  done
}

detect_missing_testid() {
  # Find button/input/select elements without data-testid
  find "$COMPONENTS_DIR" -name "*.js" -o -name "*.jsx" | while read -r file; do
    basename_no_ext=$(basename "$file" | sed 's/\.\(js\|jsx\)$//')
    if echo "$basename_no_ext" | grep -qE "^($SKIP_LIST)$"; then
      continue
    fi

    # Check for button/input/select without data-testid
    awk '
      /<(button|input|select)\b/ && !/data-testid/ {
        found = 1
      }
      END { if (found) print FILENAME }
    ' "$file"
  done | sort -u | while read -r file; do
    comp_name=$(basename "$file" | sed 's/\.\(js\|jsx\)$//')
    route=$(sed -n '/path="\//{N;s/\n/ /;p;}' "$APP_JS" \
      | grep "<${comp_name} />" \
      | sed -n 's/.*path="\(\/[^"]*\)".*/\1/p' \
      | head -1)
    route="${route:-/unknown}"
    echo "testid|${comp_name}|${route}|${file}"
  done
}

###############################################################################
# Deduplication — filter out gaps that already have open "devin" issues
###############################################################################
deduplicate_gaps() {
  local gaps="$1"

  # Fetch open issues with "devin" label
  local existing
  existing=$(gh issue list --repo "$REPO" --label devin --state open --json title --jq '.[].title' 2>/dev/null || true)

  echo "$gaps" | while IFS='|' read -r category comp route file; do
    [ -z "$category" ] && continue
    # Check if any open issue title mentions this component
    if echo "$existing" | grep -qi "$comp"; then
      echo "  [skip] ${category}: ${comp} — already has open issue" >&2
      continue
    fi
    echo "${category}|${comp}|${route}|${file}"
  done
}

###############################################################################
# Issue templates
###############################################################################
issue_template() {
  local category="$1" comp="$2" route="$3" file="$4"

  case "$category" in
    e2e)
      cat <<EOF
## Task: Add E2E tests for ${comp}

**Component:** \`${comp}\`
**Route:** \`${route}\`
**File:** \`${file}\`

### Requirements

Write Playwright E2E tests for the ${comp} component following the existing pattern in \`e2e/sortedlist.spec.js\`.

1. Create \`e2e/$(echo "$comp" | tr '[:upper:]' '[:lower:]').spec.js\`
2. Navigate to \`${route}\` in beforeEach
3. Test core user interactions visible on the page
4. Use \`data-testid\` attributes for selectors where available
5. Run \`npx playwright test e2e/$(echo "$comp" | tr '[:upper:]' '[:lower:]').spec.js\` to verify

### Acceptance Criteria
- [ ] Tests pass locally with \`npx playwright test\`
- [ ] No hardcoded localhost URLs (use relative paths)
- [ ] Follows existing test patterns
EOF
      ;;
    a11y)
      cat <<EOF
## Task: Fix accessibility — add keyboard handlers in ${comp}

**Component:** \`${comp}\`
**Route:** \`${route}\`
**File:** \`${file}\`

### Requirements

Add keyboard event handlers to interactive non-button elements that currently only have \`onClick\`.

1. Find all \`<div>\`, \`<span>\`, \`<td>\`, \`<tr>\`, \`<i>\`, \`<li>\` elements with \`onClick\` but no \`onKeyDown\`
2. Add \`onKeyDown\` handler that triggers the same action on Enter/Space
3. Add \`role="button"\` and \`tabIndex={0}\` where missing
4. Do NOT change any visual styling or behavior

### Acceptance Criteria
- [ ] All clickable non-button elements have keyboard handlers
- [ ] Elements have appropriate ARIA roles and tabIndex
- [ ] Existing functionality unchanged
- [ ] \`npm run build\` succeeds
EOF
      ;;
    testid)
      cat <<EOF
## Task: Add missing data-testid attributes in ${comp}

**Component:** \`${comp}\`
**Route:** \`${route}\`
**File:** \`${file}\`

### Requirements

Add \`data-testid\` attributes to interactive elements missing them.

1. Find all \`<button>\`, \`<input>\`, \`<select>\` elements without \`data-testid\`
2. Add descriptive \`data-testid\` values following the pattern: \`component-action\` (e.g., \`formfill-submit\`, \`table-sort-name\`)
3. Do NOT change any behavior or styling

### Acceptance Criteria
- [ ] All button/input/select elements have data-testid
- [ ] Test IDs follow consistent naming convention
- [ ] \`npm run build\` succeeds
- [ ] Existing tests still pass (\`npm test\`)
EOF
      ;;
  esac
}

###############################################################################
# Create issues & trigger Devin
###############################################################################
create_and_trigger() {
  local gaps="$1"
  local count=0

  echo "$gaps" | while IFS='|' read -r category comp route file; do
    [ -z "$category" ] && continue
    if [ "$count" -ge "$MAX_ISSUES" ]; then
      echo "  [cap] Reached max issues (${MAX_ISSUES}), stopping"
      break
    fi

    local title
    case "$category" in
      e2e)    title="Add E2E tests for ${comp}" ;;
      a11y)   title="Fix accessibility: keyboard handlers in ${comp}" ;;
      testid) title="Add missing data-testid in ${comp}" ;;
    esac

    local body
    body=$(issue_template "$category" "$comp" "$route" "$file")

    if $DRY_RUN; then
      echo "  [dry-run] Would create: ${title}"
    else
      echo "  Creating issue: ${title}"
      ensure_gh_auth
      issue_url=$(gh issue create --repo "$REPO" \
        --title "$title" \
        --label "devin" \
        --body "$body")
      issue_num=$(echo "$issue_url" | grep -oE '[0-9]+$')
      echo "  Created: ${issue_url}"

      echo "  Triggering Devin for #${issue_num}..."
      "$SCRIPT_DIR/trigger-devin.sh" "$issue_num" || echo "  Warning: trigger failed for #${issue_num}"
    fi

    count=$((count + 1))
  done
}

###############################################################################
# Main
###############################################################################
main() {
  echo "=== Devin Orchestrator ==="
  echo "Mode: $( $DRY_RUN && echo 'DRY RUN' || echo 'EXECUTE' )"
  echo "Max issues per run: ${MAX_ISSUES}"
  echo ""

  # Detect gaps
  echo "--- Detecting gaps ---"

  echo "[1/3] Missing E2E tests..."
  e2e_gaps=$(detect_missing_e2e)
  [ -n "$e2e_gaps" ] && echo "$e2e_gaps" | while IFS='|' read -r _ comp _ _; do echo "  Found: ${comp}"; done

  echo "[2/3] Accessibility issues..."
  a11y_gaps=$(detect_a11y_issues)
  [ -n "$a11y_gaps" ] && echo "$a11y_gaps" | while IFS='|' read -r _ comp _ _; do echo "  Found: ${comp}"; done

  echo "[3/3] Missing data-testid..."
  testid_gaps=$(detect_missing_testid)
  [ -n "$testid_gaps" ] && echo "$testid_gaps" | while IFS='|' read -r _ comp _ _; do echo "  Found: ${comp}"; done

  # Combine all gaps
  all_gaps=$(printf '%s\n%s\n%s' "$e2e_gaps" "$a11y_gaps" "$testid_gaps" | sed '/^$/d')

  if [ -z "$all_gaps" ]; then
    echo ""
    echo "No gaps detected. Everything looks good!"
    exit 0
  fi

  total=$(echo "$all_gaps" | wc -l | tr -d ' ')
  echo ""
  echo "Total gaps found: ${total}"

  # Deduplicate against open issues
  echo ""
  echo "--- Deduplicating against open issues ---"
  new_gaps=$(deduplicate_gaps "$all_gaps")

  if [ -z "$new_gaps" ]; then
    echo ""
    echo "All gaps already have open issues. Nothing to do."
    exit 0
  fi

  new_count=$(echo "$new_gaps" | wc -l | tr -d ' ')
  echo "New gaps (no existing issue): ${new_count}"

  # Create issues
  echo ""
  echo "--- Creating issues ---"
  create_and_trigger "$new_gaps"

  # Start poller if we created issues in execute mode
  if ! $DRY_RUN; then
    echo ""
    echo "--- Starting poll script in background ---"
    "$SCRIPT_DIR/poll-devin-pr.sh" 60 true &
    POLL_PID=$!
    echo "Poller running (PID: ${POLL_PID}). Use 'kill ${POLL_PID}' to stop."
  fi

  echo ""
  echo "=== Done ==="
}

main
