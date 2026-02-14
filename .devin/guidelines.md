# Agentic Development Guidelines - Boozang TheLab

This document outlines best practices for AI-assisted development on this repository.

## Repository Overview

Boozang TheLab is an interactive educational web application for teaching test automation concepts. It contains 17+ distinct testing scenarios demonstrating automation challenges like timing issues, conditional logic, dynamic DOM changes, form handling, and table manipulation.

## Development Workflow

### Starting a New Task

1. **Fix branch tracking if needed:** The default branch is `main` (not `master`). If `git pull` fails with "no such ref", run:
   ```bash
   git branch -m master main && git fetch origin && git branch -u origin/main main && git remote set-head origin -a
   ```
2. Review the journal for recent context and learnings
3. Create a feature branch from `main`: `git checkout -b devin/{timestamp}-{description}`
4. Understand the existing code patterns before making changes
5. Run `npm run build` to verify the codebase compiles

### Making Changes

**Component Structure:**
All feature components follow this pattern:
```javascript
function FeatureComponent() {
  // 1. State declarations using React hooks
  // 2. Event handlers and logic
  // 3. useEffect hooks for side effects
  // 4. JSX return with two-column layout
  return (
    <div className="row">
      <div className="col-12 col-md-6">
        <FeatureIntro />
        {/* Interactive demo */}
        <ResultMessages {...messageData} />
      </div>
      <div className="col-12 col-md-6">
        <FeatureTestInfo />
        <FeatureWhatToTest />
        <FeatureVideos />
      </div>
    </div>
  );
}
```

**Styling:**
- Use SCSS variables from `src/variables.scss`
- Follow existing responsive breakpoints
- Use theme colors for consistency

**API Integration:**
- Use `fetchFunctions` from `src/components/fetchFunctions/fetchFunctions.js`
- API endpoints: `/cats`, `/todos`, `/users` on port 9000

### Before Committing

1. Run `npm run build` to check for errors
2. Review changes with `git diff`
3. Commit with clear, descriptive messages
4. Push to remote before creating PR

### CI/CD

- GitHub Actions runs Boozang tests automatically
- Test reports are deployed to GitHub Pages
- Wait for CI checks to pass before merging

## Triggering Devin Sessions

Devin's native GitHub webhook integration is unreliable. Use the API instead:

```bash
# Trigger from a GitHub issue
./scripts/trigger-devin.sh <issue-number>
```

This creates a Devin session via the API and comments the session link on the issue. Requires `DEVIN_API_KEY` in `.env`.

### Auto-merge Polling

```bash
# Poll for Devin PRs and auto-merge when CI passes
./scripts/poll-devin-pr.sh [interval] [auto-merge]
```

### Rebasing After Main Changes

If your branch was created before workflow or config changes on `main`, CI may fail with stale workflow files. Rebase on `main` and force-push to pick up the latest changes.

## Common Pitfalls to Avoid

1. **Don't modify generated files directly** - Use package managers
2. **Don't hardcode localhost URLs** - Use the existing URL patterns that get replaced during deployment
3. **Don't skip the build check** - Always run `npm run build` before committing
4. **Don't force push to main** - Use merge commits instead of rebasing (force-push to feature branches is OK for rebasing)

## File Organization

```
src/
  components/
    layout/      - Header, Navbar, Footer
    lists/       - List management demos
    forms/       - Form handling demos
    tables/      - Table filtering demo
    timing/      - SpeedGame, WaitGame
    conditional/ - YellowOrBlue, CatOrDog
    games/       - KittenCollect, CanvasGame
    domChanges/  - ScrambleItems
    visualBugs/  - Visual bug demo
    strings/     - String manipulation
    text/        - Educational content
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server (port 3000) |
| `npm run server` | Start JSON server (port 9000) |
| `npm run build` | Production build |
| `npm test` | Run test suite |

## Questions or Issues?

- Check the journal for similar past issues
- Review the README.md for project documentation
- Add new learnings to the journal for future reference
