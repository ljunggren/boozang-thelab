# Multi-Agent Workflow Case Study: Devin + Claude Code

> Documenting the outcome of the experimental multi-agent workflow defined in
> [multi-agent-workflow.md](multi-agent-workflow.md). This is an honest
> assessment based on the actual results observed across all tasks.

---

## Experiment Overview

| Parameter | Value |
|-----------|-------|
| **Start date** | 2026-02-10 |
| **Assessment date** | 2026-02-14 |
| **Duration** | 4 days |
| **Agents** | Devin (autonomous dev), Claude Code (reviewer/merge master) |
| **Human** | Mats Ljunggren (oversight, direction) |
| **Tasks defined** | 5 |
| **Tasks completed** | 1 (Task 4) |
| **PRs merged (workflow period)** | 3 (#12, #13, #14) |

---

## Task Outcomes

### Task 1: Expand Playwright E2E coverage (Issue #7)

**Status:** Not started

**Scope:** Add Playwright tests for 5+ scenarios (FormFill, AddTodo, SortedList,
WaitGame, YellowOrBlue).

**Outcome:** This task was never picked up during the workflow period. The
existing Playwright infrastructure (smoke tests in `e2e/smoke.spec.js`,
config in `playwright.config.js`) was established in pre-workflow PR #5 and
remains at 4 basic smoke tests.

### Task 2: Add Playwright HTML report publishing (Issue #8)

**Status:** Not started

**Scope:** Configure the test pipeline to generate and publish Playwright HTML
reports to GitHub Pages.

**Outcome:** Not attempted. The test pipeline (`test-pipeline.yml`) runs
Playwright tests but does not publish HTML reports.

### Task 3: Create visual timeline for case study (Issue #9)

**Status:** Not started

**Scope:** Add a Mermaid diagram to the case study showing the PR sequence with
dates, dependencies, and outcomes.

**Outcome:** Not attempted. The original scope referenced a file in the
`bz-business` repo (`../bz-business/devin-case-study.md`) which does not
exist in the ljunggren GitHub organization, making this task unactionable as
specified.

### Task 4: Dependency audit and update (Issue #10)

**Status:** Completed (PR #12, merged 2026-02-14)

**Scope:** Audit `package.json`, pin all `"latest"` dependencies, ensure build
and tests pass.

**Outcome:** Successfully completed by Devin. PR #12 pinned 10 runtime
dependencies and 2 devDependencies from `"latest"` to specific semver ranges.
Build and all 20 unit tests passed after the change.

**Iteration details:**
- Devin created the branch and opened the PR autonomously
- The PR had merge conflicts with `main` (test file fixes from PR #5 had
  already landed)
- The human reviewer (Mats) commented asking Devin to rebase and force-push
- Devin resolved the conflicts and updated the PR
- After rebase, the diff was clean: only `package.json` and `package-lock.json`
  changed
- CI passed (3/3 checks) and the PR was merged

### Task 5: Document the multi-agent workflow outcome (Issue #11)

**Status:** This document.

---

## What Worked

### Devin's autonomous execution on well-scoped tasks

Task 4 (dependency audit) was the clearest example. The task had concrete
acceptance criteria ("no `latest` in dependencies, build passes, tests pass")
and Devin delivered a correct solution autonomously. The PR description was
thorough, including a review checklist and clear explanation of changes.

### Pre-workflow foundation was solid

Before the multi-agent experiment started, Devin completed 5 PRs (#2-#6) that
established critical infrastructure:

| PR | Description | Outcome |
|----|-------------|---------|
| #2 | Fix frontend-backend integration | Merged |
| #3 | Add `.devin/` agentic documentation | Merged |
| #4 | Fix GitHub Actions workflow | Merged |
| #5 | Add sequential test pipeline (unit + Playwright + Boozang) | Merged (5 commits, significant iteration) |
| #6 | Fix workflow syntax | Merged |

PR #5 is notable: Devin iterated through 5 commits to fix deprecated jest-dom
imports, incorrect button selectors, an obsolete snapshot, Playwright CI config,
and Boozang secret handling. This demonstrates effective self-correction when CI
feedback is available.

### Claude Code's infrastructure contributions

Claude Code contributed valuable infrastructure work during the workflow period:

- **PR #13:** Added `scripts/trigger-devin.sh` and `scripts/poll-devin-pr.sh`
  for programmatic Devin session management via API
- **PR #14:** Removed the obsolete `github-actions-example.yml` workflow that
  was causing CI noise on PRs
- Created the `CLAUDE.md` file with reviewer role documentation
- Designed the multi-agent workflow specification itself

### No broken merges

Throughout the entire experiment (and the pre-workflow period), no merge to
`main` introduced regressions. The combination of CI checks and review caught
issues before they reached the default branch.

---

## What Did Not Work

### 4 of 5 tasks were not completed

The most significant failure: only 1 of 5 defined tasks was completed in 4
days. Tasks 1-3 were never started. Possible contributing factors:

- **No automated task dispatch:** Tasks were defined in a markdown file but
  there was no mechanism to automatically assign or trigger Devin sessions for
  each task. The `scripts/trigger-devin.sh` script was created but the tasks
  needed to be filed as individual GitHub issues and triggered manually.
- **Sequential dependency assumption:** Task 5 was explicitly dependent on tasks
  1-4. Tasks 1 and 2 had implicit ordering (expand tests before publishing
  reports). This serial structure meant delays cascaded.
- **Cross-repo reference in Task 3:** The scope referenced
  `../bz-business/devin-case-study.md` in a repo that does not exist, making
  the task unactionable as written.

### Merge conflict handling required human intervention

PR #12 developed merge conflicts because test file fixes (from the earlier
PR #5) had already been merged to `main`. The human had to explicitly comment
asking Devin to rebase. In a fully autonomous workflow, the agent should detect
and resolve merge conflicts without prompting.

### Review protocol was underutilized

The detailed review protocol in `multi-agent-workflow.md` (6-step checklist,
escalation criteria) was designed for Claude Code to review Devin's PRs. In
practice, only one Devin PR (#12) was created during the workflow period, and
the review was handled by the human rather than Claude Code acting
autonomously as reviewer.

### Workflow setup overhead was high relative to output

Significant effort went into designing the workflow:
- `multi-agent-workflow.md` (139 lines)
- `CLAUDE.md` (76 lines)
- Trigger and polling scripts (PR #13)
- 5 detailed task specifications

This infrastructure produced one completed task. The setup-to-output ratio
suggests the workflow is better suited to longer-running engagements where the
upfront investment amortizes across many tasks.

---

## Metrics

| Metric | Value |
|--------|-------|
| Total tasks defined | 5 |
| Tasks completed | 1 (20%) |
| Tasks not started | 3 (60%) |
| Tasks in progress (this doc) | 1 (20%) |
| Devin PRs created (workflow period) | 1 (#12) |
| Claude Code PRs created | 2 (#13, #14) |
| Total PRs merged to main (all time) | 8 (#2-#6, #12-#14) |
| Devin PRs merged (all time) | 6 (#2-#6, #12) |
| CI failures on merged PRs | 0 |
| Human interventions on Devin PRs | 1 (merge conflict on #12) |
| Devin self-corrections (pre-workflow) | 5+ commits on PR #5 |

---

## Evaluation Against Success Criteria

The workflow defined 5 success criteria in `multi-agent-workflow.md`:

| Criterion | Result |
|-----------|--------|
| At least 3 of 5 tasks completed and merged | **Not met.** 1 of 5 completed. |
| Claude Code catches at least one issue in review | **Partially met.** Claude Code contributed infrastructure fixes (PRs #13, #14) and designed the workflow, but did not perform a formal code review on Devin's PR #12. The human caught the merge conflict. |
| No broken merges to main | **Met.** No regressions introduced across all 8 merged PRs. |
| Workflow overhead lower than direct human review | **Not met.** The overhead of defining the workflow, tasks, review protocol, and scripts exceeded the output of one completed task. |
| Enough material for a compelling case study | **Partially met.** The experiment produced useful observations about multi-agent coordination, but the limited task completion constrains the depth of analysis. |

---

## Recommendations

### 1. Automate task dispatch

Replace the manual "file issue, then trigger Devin" process with automation.
The `trigger-devin.sh` script exists; connect it to issue creation events via
GitHub Actions so Devin sessions start automatically when issues are labeled
`devin`.

### 2. Keep tasks independent

Avoid sequential dependencies between tasks. Tasks 1-4 could have been executed
in parallel. The dependency chain (especially Task 5 depending on all others)
creates bottlenecks.

### 3. Validate task specifications before dispatch

Task 3 referenced a non-existent repository. Add a pre-flight check: before
creating a Devin session, verify that all referenced files and repos exist.

### 4. Enable autonomous merge conflict resolution

Configure Devin to detect and resolve merge conflicts automatically rather than
waiting for human prompts. This was the single point of friction on the one
completed task.

### 5. Start smaller

The 5-task scope with a formal review protocol was ambitious for a first
experiment. A tighter loop of 2-3 independent tasks with simpler coordination
would produce faster learnings.

### 6. Use Claude Code as an active reviewer, not just a protocol

The review protocol was well-designed but not exercised. Consider having Claude
Code automatically triggered on PR creation (via webhook or polling) to perform
reviews without human initiation.

---

## Conclusion

The multi-agent workflow experiment demonstrated that Devin can execute
well-scoped, concrete tasks autonomously (Task 4, plus the pre-workflow PRs
#2-#6). The combination of CI checks and structured PR descriptions produces
reliable, reviewable output. However, the experiment fell short of its goals:
only 1 of 5 tasks completed, the Claude Code reviewer role was underutilized,
and the workflow setup overhead was disproportionate to the output.

The core insight is that multi-agent coordination requires more than role
definitions and review protocols. It requires automated dispatch, parallel
task execution, and active (not passive) review triggers. The individual agents
performed well in isolation; the coordination layer between them is what needs
iteration.

---

*Written 2026-02-14 as part of Task 5 (Issue #11) of the multi-agent workflow
experiment.*
