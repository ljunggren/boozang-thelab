# Automation Hooks - Boozang TheLab

This document defines automated behaviors that should be triggered during specific events in the development workflow.

## PR Creation Hook

**Trigger:** When a pull request is created for this repository.

**Actions:**
1. Add a journal entry with:
   ```markdown
   **PR Created:** [PR Title]
   - Link: [PR URL]
   - Branch: [branch name]
   - Description: [brief summary of changes]
   - Status: Awaiting review
   ```

2. If the PR includes code changes, document:
   - Files modified
   - Key changes made
   - Any breaking changes or migration notes

3. Update the current session entry to reference the PR

---

## PR Merge Hook

**Trigger:** When a pull request is merged.

**Actions:**
1. Update the journal entry for that PR:
   ```markdown
   **PR Merged:** [PR Title]
   - Merged by: [username]
   - Date: [date]
   - Final status: Merged to [branch]
   ```

2. Document any post-merge learnings or issues discovered

---

## CI/CD Hook

**Trigger:** When CI/CD pipeline completes (success or failure).

**Actions:**

**On Success:**
1. Note in journal: "CI passed for [branch/PR]"
2. If tests generated reports, note the report location

**On Failure:**
1. Document the failure in journal:
   ```markdown
   **CI Failed:** [branch/PR]
   - Failed job: [job name]
   - Error summary: [brief description]
   - Resolution: [how it was fixed, if applicable]
   ```

2. This becomes a learning opportunity - document what caused the failure and how to prevent it

---

## Session Start Hook

**Trigger:** When an AI agent begins working on this repository.

**Actions:**
1. Read all files in `.devin/` directory
2. Parse `journal.md` for:
   - Recent session entries (last 5)
   - Unresolved issues
   - Recent learnings relevant to common tasks
3. Check for any "In Progress" sessions that may have been interrupted
4. Load `guidelines.md` for repository-specific practices
5. Acknowledge context loading to user

---

## Session End Hook

**Trigger:** When an AI agent completes work on this repository.

**Actions:**
1. Ensure current session entry in `journal.md` is complete:
   - All actions documented
   - Outcome recorded
   - Learnings captured
2. If any files in `.devin/` were modified, commit them:
   ```bash
   git add .devin/
   git commit -m "docs: update .devin documentation"
   ```
3. Push documentation updates if on a feature branch

---

## Error Recovery Hook

**Trigger:** When an error is encountered during development.

**Actions:**
1. Check `journal.md` for similar past errors
2. If error is new, document it:
   ```markdown
   **Error Encountered:**
   - Type: [error type]
   - Context: [what was being attempted]
   - Error message: [relevant portion]
   - Resolution: [how it was fixed]
   ```
3. Add to learnings if the resolution reveals something important

---

## Implementation Notes

These hooks are behavioral guidelines for AI agents working on this repository. They are not automated scripts but rather documented procedures that agents should follow. The goal is to maintain consistent documentation and capture institutional knowledge over time.

To ensure these hooks are followed:
1. Agents should read this file at session start
2. The commands in `commands.md` reference these hooks
3. The journal format in `journal.md` supports these entries
