# Contributing to Shadow Clone

This guide covers branch conventions, commit standards, and PR workflow for all contributors -- human developers and AI agents alike.

---

## Branch Model

```
main                        Production-ready code. Deploy target.
 └── dev                    Integration branch. All PRs target here.
      ├── mihir/dev         Mihir's working branch
      ├── eli/dev           Eli's working branch
      └── claude/dev        Claude agent's working branch
```

- **`main`** -- Production. Merges from `dev` only (release PRs).
- **`dev`** -- Integration branch. All contributor PRs target this branch. Nobody commits directly to `dev`.
- **`{author}/dev`** -- Your personal working branch. Commit here, then PR into `dev`.

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

Every developer and agent works on their own branch, then PRs into `dev`.

1. Create your branch from `dev`: `git checkout -b {author}/dev dev`
2. Do all work on your branch -- commit using conventional commits
3. Push your branch: `git push -u origin {author}/dev`
4. Open a PR from your branch targeting `dev`
5. Fill out the PR template (`.github/PULL_REQUEST_TEMPLATE.md`)
6. After approval, squash-merge into `dev`

To stay up to date with `dev`:
```bash
git checkout {author}/dev
git pull origin dev
```

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

- Use `agent/dev` or `claude/dev` as their working branch, same as human contributors
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
| Create your branch | `git checkout -b {author}/dev dev` |
| Sync with dev | `git pull origin dev` |
| Push your work | `git push origin {author}/dev` |
| Build | `cd mcp-server && npm run build` |
| Type check | `cd mcp-server && npm run lint` |
| Run tests | `cd mcp-server && npm test` |
| Production build | `cd mcp-server && npm run build:prod` |
