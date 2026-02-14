# CLAUDE.md

Guidance for Claude Code working with Boozang TheLab.

## Project Overview

Boozang TheLab — Interactive educational web app for teaching test automation concepts (17+ testing scenarios).

## Quick Commands

```bash
npm start        # Dev server (port 3000)
npm run server   # JSON Server API (port 9000)
npm run build    # Production build
npm test         # Run tests
```

## Key Paths

| Path | Purpose |
|------|---------|
| `src/components/` | All feature components |
| `src/variables.scss` | Shared SCSS variables |
| `src/components/fetchFunctions/` | API integration helpers |
| `.agent/` | Agent instructions, flows, memory (gitignored) |
| `.devin/` | Devin-specific config (committed) |
| `.readonly/` | Protected specs and ADRs |

## Session Sync

**Always read `.agent/session/sync.md` at the start of every session.** This file is a gitignored scratchpad used to pass context between concurrent Claude sessions (CLI, web, IDE). It contains handoff notes, current working context, decisions made, and blockers from other sessions. Update it when ending a session or whenever context changes that another session should know about.

## Session Commands

| Command | Action |
|---------|--------|
| `start session` | Read sync file + instructions, check journal, remind context |
| `end session` | Update sync file, summarize work, update journal |

## Detailed Instructions

See `.agent/instructions.md` for comprehensive documentation:
- Architecture and patterns
- Scripts and operations
- Testing procedures
- Decision flows (Mermaid diagrams)
- Wellbeing awareness

## Multi-Agent Setup

This repo runs two AI agents:
- **Claude Code** — Uses `.agent/` for instructions, memory, and session sync
- **Devin** — Uses `.devin/` for its own config (committed to git)

Claude Code also acts as **reviewer and merge master** for Devin's PRs. See `.devin/multi-agent-workflow.md` for the review protocol.

### Review Checklist (for Devin PRs)
1. Read the task spec from `.devin/multi-agent-workflow.md` to understand expected scope
2. Check the diff — does it match the task? Any scope creep?
3. Run `npm run build` — does it compile?
4. Run `npm test` — do existing tests pass?
5. Check for: hardcoded URLs, missing SCSS imports, broken layout, security issues
6. **Merge** if clean, **request changes** with specifics, or **escalate to human**

### Escalate to Human When
- Changes touch CI/CD or deployment config
- Scope creep beyond the original task
- Conflicting approaches or ambiguous requirements
- Anything destructive or hard to reverse

## GitHub

- **Required gh user:** `ljunggren`
- Before any `git push`, verify the active gh account: `gh auth status 2>&1 | grep 'Active account: true' -B3 | head -1`
- If the active account is not `ljunggren`, run `gh auth switch --user ljunggren` before pushing.
