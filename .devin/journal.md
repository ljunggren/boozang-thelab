# Devin Session Journal - Boozang TheLab

This journal tracks all updates, learnings, and best practices discovered during AI-assisted development sessions on this repository. It serves as agentic documentation to prevent repeating mistakes and help collaborators learn from past interactions.

## Session Log

### 2026-01-28 - Initial Setup

**Session ID:** [7d9ff4aa48774980af8f4b549fb1db4c](https://app.devin.ai/sessions/7d9ff4aa48774980af8f4b549fb1db4c)

**Objective:** Create `.devin` directory with agentic documentation structure for tracking updates and learnings.

**Actions Taken:**
- Created `.devin` directory in repository root
- Established journal structure for tracking session updates
- Created `guidelines.md` for repository-specific best practices
- Created `commands.md` defining `start session`, `end session`, and `journal` commands
- Created `hooks.md` for PR automation and session lifecycle behaviors
- Updated `README.md` with quick start guide for AI agents

**Outcome:** Successfully set up comprehensive agentic documentation infrastructure with defined commands and automation hooks.

**PR:** [#3 - Add .devin directory with agentic documentation](https://github.com/ljunggren/boozang-thelab/pull/3)

---

## Learnings & Best Practices

### Repository-Specific Knowledge

**Build & Lint:**
- Run `npm run build` to verify changes compile correctly
- The build process catches TypeScript/JavaScript errors

**Local Development:**
1. Start JSON server: `npm run server` (runs on port 9000)
2. Start React dev server: `npm start` (runs on port 3000)
3. App available at http://localhost:3000

**Deployment:**
- `install.sh` replaces `localhost:9000` with `api.boozang.com` for production
- CI/CD runs Boozang tests and deploys reports to GitHub Pages

### General Best Practices

**Before Making Changes:**
- Always create a new branch from master
- Use branch naming convention: `devin/{timestamp}-{description}`
- Review existing code patterns before implementing new features

**Code Quality:**
- Follow existing React component patterns in the codebase
- Use SCSS variables from `src/variables.scss` for styling
- Keep educational content in `src/components/text/` directory

**Testing:**
- Boozang tests run automatically in CI
- Test reports are generated and deployed to GitHub Pages

---

## How to Use This Journal

1. **Before starting work:** Review recent entries for relevant context
2. **During work:** Note any issues encountered and solutions found
3. **After completing work:** Add a session entry summarizing what was done and learned
4. **When encountering errors:** Check if similar issues were documented before

## Contributing to This Journal

When adding entries, include:
- Date and session ID (if available)
- Clear objective description
- Actions taken with outcomes
- Any learnings or gotchas discovered
- Links to relevant PRs or commits
