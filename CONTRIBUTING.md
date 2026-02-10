# Contributing to Shadow Clone

This guide covers branch conventions, commit standards, and PR workflow for all contributors -- human developers and AI agents alike.

---

## Branch Model

```
upstream/main          Production-ready code. Deploy target.
 └── upstream/dev      Integration branch. All PRs target here.
      └── your-fork/dev   Your working copy. Commit here, PR into upstream/dev.
```

- **`main`** (upstream) -- Production. Merges from `dev` only (release PRs).
- **`dev`** (upstream) -- Integration branch. All contributor PRs target this branch.
- **`dev`** (your fork) -- Your working branch. Fork the repo, commit to your fork's `dev`, then open a PR into the upstream `dev`.

## Branch Naming

Format: `{author}/{type}-{description}`

| Type | Use for |
|------|---------|
| `feat` | New features or capabilities |
| `fix` | Bug fixes |
| `refactor` | Code restructuring (no behavior change) |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `chore` | Build, CI, dependency updates |

Examples:
- `mihir/feat-browser-auth`
- `eli/fix-rate-limiter-bypass`
- `claude/docs-update-readme`

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

body (optional)

footer (optional)
```

Types match branch types above. Scope is optional but encouraged (`auth`, `tools`, `prompts`, `build`).

Examples:
```
feat(auth): add browser-based OAuth flow
fix(tools): validate Zod schemas before tool dispatch
chore: update webpack config for prod builds
docs: add migration guide for branch rename
```

## Pull Request Workflow

### Feature -> dev (standard)

Every developer and agent works on their own fork's `dev` branch, then PRs into the upstream `dev`.

1. Fork the repo on GitHub
2. Clone your fork: `git clone <your-fork-url> && cd shadow-clone`
3. Add upstream remote: `git remote add upstream <upstream-url>`
4. Sync your `dev` with upstream: `git pull upstream dev`
5. Do all work on your fork's `dev` branch -- commit using conventional commits
6. Push to your fork: `git push origin dev`
7. Open a PR from your fork's `dev` targeting upstream `dev`
8. Fill out the PR template (`.github/PULL_REQUEST_TEMPLATE.md`)
9. After approval, squash-merge into upstream `dev`

### dev -> main (release only)

1. Open PR from `dev` to `main`
2. Title: `release: v{version} - {summary}`
3. Verify all CI checks pass
4. Requires 1 approval
5. Merge commit (not squash) to preserve history

### Code Review Requirements

- All PRs require at least 1 approval
- Stale reviews are dismissed on new pushes (on `main`)
- PRs touching `src/auth/` or `src/config/production.ts` require extra scrutiny -- tag the security reviewer
- Check the build passes: `cd mcp-server && npm run build`
- Check types pass: `cd mcp-server && npm run lint`

## AI Agent Contributions

AI agents (Claude, Copilot, etc.) follow the same rules:

- Fork the repo and work on their fork's `dev` branch, same as human contributors
- Write conventional commit messages
- Fill out the PR template completely
- Reference task IDs from `TASKS.md` in the PR body

## Dependencies Between PRs

Some PRs must merge in order. Check `TASKS.md` for the dependency graph. If your PR depends on another, note it in the PR template under **Dependencies**.

---

## Migration Guide

If you have stale local branches from before the reorganization (Feb 2026), run:

```bash
# Fetch new remote state
git fetch --prune

# Switch to new dev branch
git checkout -b dev origin/dev

# Delete old local branches
git branch -D main-dev main-prod master dev-testing 2>/dev/null

# Create local main tracking branch
git branch main origin/main

# Set remote HEAD
git remote set-head origin main
```

Your feature branches (e.g., `mihir/feat-*`) are unaffected -- they already follow the naming convention.

---

## Quick Reference

| Action | Command |
|--------|---------|
| Sync with upstream | `git pull upstream dev` |
| Push your work | `git push origin dev` |
| Build | `cd mcp-server && npm run build` |
| Type check | `cd mcp-server && npm run lint` |
| Run tests | `cd mcp-server && npm test` |
| Production build | `cd mcp-server && npm run build:prod` |
