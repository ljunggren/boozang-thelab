# Multi-Agent Workflow: Devin + Claude Code

> **EXPERIMENTAL** — This workflow is an experiment in multi-agent collaboration.
> It may be revised or abandoned based on outcomes. Document everything.

---

## Overview

This experiment uses two AI agents in complementary roles:

- **Devin** — Autonomous engineer. Creates branches, writes code, opens PRs.
- **Claude Code** — Reviewer and merge master. Reviews Devin's PRs, runs checks, merges or requests changes.
- **Human (Mats)** — Oversight. Spot-checks, sets direction, breaks ties, approves anything destructive.

```
Human (direction + oversight)
        │
        ▼
   Devin (autonomous work)
        │
        ▼
     PR created
        │
        ▼
  Claude Code (review + merge)
        │
        ▼
  Human (spot-check if needed)
```

---

## Roles & Responsibilities

### Devin
- Pick up tasks from the task list below
- Create feature branches using `devin/{timestamp}-{description}`
- Implement changes autonomously
- Open PRs with clear descriptions
- Self-correct when CI fails
- Document learnings in `.devin/journal.md`

### Claude Code
- Review Devin's PRs: check diff, run `npm run build`, verify tests pass
- Approve and merge if changes are clean and match the task spec
- Request changes with specific feedback if something is off
- **Escalate to human** when:
  - Changes touch CI/CD or deployment config
  - Scope creep beyond the original task
  - Conflicting approaches or ambiguous requirements
  - Anything destructive or hard to reverse
- Update `.devin/journal.md` with review outcomes

### Human
- Define tasks and priorities
- Spot-check merged PRs periodically (not every one)
- Resolve escalations from Claude Code
- Adjust workflow based on what's working

---

## Task List for Devin

### Task 1: Expand Playwright E2E coverage
**Branch:** `devin/{timestamp}-expand-e2e-tests`
**Scope:** Add Playwright tests for at least 5 more scenarios beyond the current smoke test. Prioritize: forms (FormFill), lists (AddTodo, SortedList), timing (WaitGame), and conditional (YellowOrBlue).
**Acceptance:** Tests pass locally and in CI. Each test file covers at least one meaningful user interaction.
**Estimated files:** `e2e/` directory, possibly `playwright.config.js`

### Task 2: Add Playwright HTML report publishing
**Branch:** `devin/{timestamp}-playwright-reports`
**Scope:** Configure the test pipeline to generate and publish Playwright HTML reports to GitHub Pages, alongside existing Boozang reports.
**Acceptance:** After pipeline runs, reports are accessible on GitHub Pages.
**Estimated files:** `.github/workflows/test-pipeline.yml`, `playwright.config.js`

### Task 3: Create visual timeline for case study
**Branch:** `devin/{timestamp}-case-study-timeline`
**Scope:** Add a Mermaid diagram to `../bz-business/devin-case-study.md` showing the PR sequence with dates, dependencies, and outcomes. Add a before/after section comparing the CI pipeline state.
**Acceptance:** Diagram renders correctly in GitHub markdown.
**Estimated files:** `../bz-business/devin-case-study.md`

### Task 4: Dependency audit and update
**Branch:** `devin/{timestamp}-dependency-update`
**Scope:** Audit `package.json` dependencies (many are set to `"latest"`). Pin to specific versions. Resolve any breaking changes. Ensure build and tests pass.
**Acceptance:** `npm run build` passes, `npm test` passes, no `"latest"` in dependencies.
**Estimated files:** `package.json`, `package-lock.json`, possibly component files if APIs changed

### Task 5: Document the multi-agent workflow outcome
**Branch:** `devin/{timestamp}-workflow-case-study`
**Scope:** After tasks 1–4 are complete, write a section in the case study documenting how the Devin + Claude Code workflow performed. Include: what worked, what didn't, time/iteration metrics, and recommendations.
**Acceptance:** Honest assessment with specific examples from the completed tasks.
**Estimated files:** `.devin/workflow-case-study.md`
**Status:** Completed (PR pending). See [workflow-case-study.md](workflow-case-study.md).

---

## Review Protocol for Claude Code

When reviewing a Devin PR:

1. **Read the task spec** from this file to understand the expected scope
2. **Check the diff** — does it match the task? Any scope creep?
3. **Run `npm run build`** — does it compile?
4. **Run `npm test`** — do existing tests pass?
5. **Check for common issues:**
   - Hardcoded URLs (should use existing patterns)
   - Missing SCSS variable imports
   - Broken responsive layout
   - Security issues (exposed secrets, injection vectors)
6. **Decision:**
   - **Merge** — if clean and matches spec
   - **Request changes** — with specific line-level feedback
   - **Escalate** — if unsure or out of scope

---

## Success Criteria for This Experiment

- [ ] At least 3 of 5 tasks completed and merged via the workflow — **Not met** (1 of 5)
- [ ] Claude Code catches at least one issue in review that Devin missed — **Partially met**
- [x] No broken merges to main — **Met**
- [ ] Workflow overhead is lower than direct human review — **Not met**
- [ ] Enough material generated for a compelling case study section — **Partially met**

See [workflow-case-study.md](workflow-case-study.md) for the full assessment.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Both agents miss the same class of bug | Human spot-checks 1 in 3 merges |
| Devin generates changes that look good but break subtly | Always run build + tests before merge |
| Scope creep across tasks | Each task has explicit acceptance criteria |
| Experiment produces nothing useful | Document failures too — honest case study |

---

*Created 2026-02-10. This is an experiment. Iterate on the process, not just the code.*
