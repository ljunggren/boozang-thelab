# Devin Commands - Boozang TheLab

This document defines a set of commands that can be invoked during AI-assisted development sessions. These commands standardize workflows and ensure consistent documentation.

## Available Commands

### `start session`

**Purpose:** Initialize a new development session with proper context.

**Instructions:**
1. Read all files in the `.devin` directory to understand project context
2. Review the most recent entries in `journal.md` for relevant learnings
3. Check `guidelines.md` for repository-specific best practices
4. Create a new session entry in `journal.md` with:
   - Date and session ID
   - Initial objective from user request
   - Status: "In Progress"
5. Create a todo list for the task at hand
6. Acknowledge to the user that context has been loaded

**Example Response:**
```
Session started. I've reviewed the .devin documentation:
- Last session: [date] - [brief summary]
- Key learnings relevant to this task: [if any]
- Ready to work on: [user's objective]
```

---

### `end session`

**Purpose:** Properly close a development session with documentation.

**Instructions:**
1. Update the current session entry in `journal.md` with:
   - Actions taken (summarized)
   - Outcome (success/partial/blocked)
   - Any new learnings discovered
   - Links to PRs or commits created
2. If a PR was created or updated, ensure the journal reflects this
3. Commit the journal update (if there are changes)
4. Provide a summary to the user

**Example Response:**
```
Session ended. Summary:
- Completed: [list of completed items]
- PR: [link if applicable]
- New learnings documented: [brief description]
```

---

### `journal`

**Purpose:** Add an entry or update to the session journal.

**Instructions:**
1. If no current session entry exists, create one
2. Add the specified information to the journal under the current session
3. Categories of journal entries:
   - **Learning:** Something new discovered about the codebase or tools
   - **Issue:** A problem encountered and how it was resolved
   - **Decision:** A technical decision made and the reasoning
   - **Note:** General observation or reminder for future sessions

**Usage:**
```
journal learning: [description of what was learned]
journal issue: [problem] -> [solution]
journal decision: [what was decided] because [reasoning]
journal note: [observation]
```

**Example:**
```
User: journal learning: The build fails if SCSS variables are not imported correctly
Agent: Added to journal under current session:
  - Learning: The build fails if SCSS variables are not imported correctly
```

---

## Command Aliases

For convenience, these shortened forms are also recognized:

| Full Command | Alias |
|--------------|-------|
| `start session` | `start`, `begin` |
| `end session` | `end`, `finish`, `done` |
| `journal` | `log`, `note` |

---

## Automatic Behaviors

### On Session Start (Always)
When beginning any work on this repository, the agent should automatically:
1. Read `.devin/journal.md`
2. Read `.devin/guidelines.md`
3. Check for any unfinished sessions or pending items

### On PR Creation
When a pull request is created, the agent should:
1. Add a journal entry with the PR link and description
2. Update the session entry with PR status
3. Note any CI/CD results

### On Session End (Always)
Before finishing work, the agent should:
1. Ensure all learnings are documented
2. Update session status in journal
3. Commit any documentation changes
