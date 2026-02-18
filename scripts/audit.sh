#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# audit.sh — Visual audit of E2E tests in headed browser
#
# Usage:
#   scripts/audit.sh [--step] [--watch] [--diff=<ref>] [--slow=<ms>] [spec...]
#
# Modes:
#   --step   (default) Run one spec at a time, pause between each for review
#   --watch  Run all specs continuously with slowMo, no pauses
#   --diff=<ref>       Only audit specs changed since <ref> (commit/branch)
#
# Options:
#   --slow=<ms>  SlowMo milliseconds (default: 400 for step, 300 for watch)
#   spec...      Specific spec files to audit (e.g. formfill sortedlist)
#
# Examples:
#   scripts/audit.sh                          # Step through all specs
#   scripts/audit.sh formfill sortedlist      # Step through specific specs
#   scripts/audit.sh --watch                  # Watch all specs auto-play
#   scripts/audit.sh --diff=main~5            # Audit specs changed in last 5 commits
###############################################################################

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
E2E_DIR="$PROJECT_ROOT/e2e"

MODE="step"
SLOW_MO=""
DIFF_REF=""
SPECS=()

# Parse arguments
for arg in "$@"; do
  case "$arg" in
    --step)       MODE="step" ;;
    --watch)      MODE="watch" ;;
    --diff=*)     DIFF_REF="${arg#--diff=}"; MODE="step" ;;
    --slow=*)     SLOW_MO="${arg#--slow=}" ;;
    --help|-h)
      cat <<'HELP'
audit.sh — Visual audit of E2E tests in headed browser

Usage: scripts/audit.sh [--step] [--watch] [--diff=<ref>] [--slow=<ms>] [spec...]

Modes:
  --step   (default) Run one spec at a time, pause between each
  --watch  Run all specs continuously with slowMo
  --diff=<ref>       Only audit specs changed since <ref>

Options:
  --slow=<ms>  SlowMo milliseconds (default: 400 step, 300 watch)
  spec...      Specific spec names (e.g. formfill sortedlist)

Examples:
  scripts/audit.sh                        Step through all specs
  scripts/audit.sh formfill sortedlist    Step through specific specs
  scripts/audit.sh --watch                Watch all specs auto-play
  scripts/audit.sh --diff=main~5          Audit specs changed in last 5 commits
HELP
      exit 0
      ;;
    -*)           echo "Unknown option: $arg"; exit 1 ;;
    *)            SPECS+=("$arg") ;;
  esac
done

# Defaults for slowMo
if [ -z "$SLOW_MO" ]; then
  case "$MODE" in
    step)  SLOW_MO=400 ;;
    watch) SLOW_MO=300 ;;
  esac
fi

# Route map: spec basename -> route (extracted from goto calls)
get_route() {
  local spec_file="$1"
  grep -oE "goto\('[^']+'\)" "$spec_file" | head -1 | sed "s/goto('//;s/')//" || echo "/unknown"
}

# Test count in a spec file
get_test_count() {
  local spec_file="$1"
  grep -c "test(" "$spec_file" 2>/dev/null || echo "?"
}

# Resolve which specs to run
resolve_specs() {
  if [ ${#SPECS[@]} -gt 0 ]; then
    # Explicit spec names provided
    for name in "${SPECS[@]}"; do
      local file="$E2E_DIR/${name}.spec.js"
      if [ ! -f "$file" ]; then
        # Try lowercase
        file="$E2E_DIR/$(echo "$name" | tr '[:upper:]' '[:lower:]').spec.js"
      fi
      if [ -f "$file" ]; then
        echo "$file"
      else
        echo "Warning: spec not found for '$name'" >&2
      fi
    done
  elif [ -n "$DIFF_REF" ]; then
    # Only specs changed since ref
    git diff --name-only "$DIFF_REF" -- e2e/ 2>/dev/null | while read -r f; do
      [ -f "$PROJECT_ROOT/$f" ] && echo "$PROJECT_ROOT/$f"
    done
  else
    # All specs (skip smoke — it's a meta-test)
    find "$E2E_DIR" -name "*.spec.js" ! -name "smoke.spec.js" | sort
  fi
}

# Print a formatted header for a spec
print_spec_header() {
  local spec_file="$1" index="$2" total="$3"
  local name route tests
  name=$(basename "$spec_file" .spec.js)
  route=$(get_route "$spec_file")
  tests=$(get_test_count "$spec_file")

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  printf "  [%d/%d] %s\n" "$index" "$total" "$name"
  echo "  Route: $route"
  echo "  Tests: $tests"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Run a single spec in headed mode
run_spec() {
  local spec_file="$1"
  npx playwright test "$spec_file" \
    --headed \
    --project=chromium \
    --reporter=list \
    --workers=1 \
    2>&1 || true
}

###############################################################################
# Main
###############################################################################

# Collect specs
SPEC_FILES=()
while IFS= read -r f; do
  [ -n "$f" ] && SPEC_FILES+=("$f")
done < <(resolve_specs)

if [ ${#SPEC_FILES[@]} -eq 0 ]; then
  echo "No specs to audit."
  exit 0
fi

TOTAL=${#SPEC_FILES[@]}

echo ""
echo "=== Visual Audit ==="
echo "Mode: $MODE"
echo "SlowMo: ${SLOW_MO}ms"
echo "Specs: $TOTAL"
if [ -n "$DIFF_REF" ]; then
  echo "Diff ref: $DIFF_REF"
fi

# Export slowMo for Playwright — we'll use a custom config
export AUDIT_SLOW_MO="$SLOW_MO"

# Create a temporary Playwright config inside the project (so module resolution works)
AUDIT_CONFIG="$PROJECT_ROOT/.audit-playwright.config.js"
cat > "$AUDIT_CONFIG" <<JSEOF
const base = require('./playwright.config.js');
module.exports = {
  ...base,
  workers: 1,
  use: {
    ...base.use,
    headless: false,
    launchOptions: {
      slowMo: ${SLOW_MO},
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
};
JSEOF

cleanup() {
  rm -f "$AUDIT_CONFIG"
}
trap cleanup EXIT

case "$MODE" in
  step)
    INDEX=0
    for spec in "${SPEC_FILES[@]}"; do
      INDEX=$((INDEX + 1))
      print_spec_header "$spec" "$INDEX" "$TOTAL"

      npx playwright test "$spec" \
        --config="$AUDIT_CONFIG" \
        --reporter=list \
        2>&1 || true

      if [ "$INDEX" -lt "$TOTAL" ]; then
        echo ""
        if [ -t 0 ] || [ -c /dev/tty ]; then
          echo "  Press Enter for next, 's' to skip remaining, 'q' to quit..."
          read -r -n1 key < /dev/tty 2>/dev/null || key=""
        else
          echo "  (non-interactive — auto-advancing)"
          key=""
        fi
        echo ""
        case "$key" in
          q|Q) echo "Audit stopped."; break ;;
          s|S) echo "Skipping remaining specs."; break ;;
        esac
      fi
    done
    ;;

  watch)
    echo ""
    echo "Running all specs in headed mode..."
    echo ""
    npx playwright test "${SPEC_FILES[@]}" \
      --config="$AUDIT_CONFIG" \
      --reporter=list \
      2>&1 || true
    ;;
esac

echo ""
echo "=== Audit complete ==="
