# .devin Directory

This directory contains agentic documentation for AI-assisted development on the Boozang TheLab repository.

## IMPORTANT: Read This First

**AI agents must read all files in this directory at the start of every session.** This ensures consistent behavior and prevents repeating past mistakes.

## Contents

| File | Purpose |
|------|---------|
| **journal.md** | Session log tracking updates, learnings, and outcomes |
| **guidelines.md** | Repository-specific best practices and workflow |
| **commands.md** | Defined commands: `start session`, `end session`, `journal` |
| **hooks.md** | Automation behaviors for PRs, CI/CD, and session lifecycle |
| **multi-agent-workflow.md** | **EXPERIMENTAL** — Devin + Claude Code collaboration workflow and task list |

## Quick Start for AI Agents

1. **Read all `.devin/` files** before starting any work
2. **Run `start session`** to initialize with proper context
3. **Follow `guidelines.md`** for repository-specific practices
4. **Use `journal`** command to document learnings as you work
5. **Run `end session`** when finishing to document outcomes

## Purpose

This documentation serves to:

1. **Prevent repeated mistakes** - Document issues and solutions so they don't need to be rediscovered
2. **Share knowledge** - Help collaborators learn from past interactions
3. **Maintain context** - Provide AI assistants with relevant project-specific knowledge
4. **Track progress** - Keep a record of what has been done and why
5. **Automate documentation** - PRs automatically update the journal

## Multi-Agent Workflow (Experimental)

This repo is currently running an experiment with two AI agents:
- **Devin** handles autonomous development (branches, code, PRs)
- **Claude Code** reviews and merges Devin's PRs

See `multi-agent-workflow.md` for the full plan, task list, and review protocol.

## For Human Collaborators

Review the journal to understand what AI agents have done on this repository. The learnings section contains valuable institutional knowledge discovered during development sessions.
