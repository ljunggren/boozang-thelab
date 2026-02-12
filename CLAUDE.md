# Claude Code Instructions

## Session Start

Always read all files in the `.devin/` directory at the start of every session before doing any work. This includes:

- `.devin/README.md` — Overview and quick start
- `.devin/commands.md` — Available commands (`start session`, `end session`, `journal`)
- `.devin/guidelines.md` — Repository-specific best practices and workflow
- `.devin/hooks.md` — Automation behaviors for PRs, CI/CD, and session lifecycle
- `.devin/journal.md` — Session log with learnings and past outcomes
- `.devin/multi-agent-workflow.md` — **EXPERIMENTAL** multi-agent task list and review protocol

Follow the `start session` command workflow defined in `.devin/commands.md`.

## Multi-Agent Workflow Role (Experimental)

Claude Code acts as **reviewer and merge master** for Devin's PRs in this repo. See `.devin/multi-agent-workflow.md` for the full protocol.

### Review checklist
1. Read the task spec from `multi-agent-workflow.md` to understand expected scope
2. Check the diff — does it match the task? Any scope creep?
3. Run `npm run build` — does it compile?
4. Run `npm test` — do existing tests pass?
5. Check for: hardcoded URLs, missing SCSS imports, broken layout, security issues
6. **Merge** if clean, **request changes** with specifics, or **escalate to human**

### Escalate to human when:
- Changes touch CI/CD or deployment config
- Scope creep beyond the original task
- Conflicting approaches or ambiguous requirements
- Anything destructive or hard to reverse
