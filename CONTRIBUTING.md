# Contributing to Shadow Clone

This guide covers branch conventions, commit standards, and PR workflow for all contributors -- human developers and AI agents alike.

---

## Branch Model

```
main          Production-ready code. Deploy target.
 └── dev      Active development. Integration branch. Nobody works directly on dev.
      └── {author}/{type}-{description}   Feature branches (one per dev/agent).
```

- **`main`** -- Production. Merges from `dev` only (release PRs).
- **`dev`** -- Development integration. All feature PRs target this branch. **Do not commit directly to `dev`** -- always work on a feature branch and PR into `dev`.
- **Feature branches** -- Each developer or agent forks the repo and works on their own feature branch off `dev`. When ready, open a PR from your fork targeting `dev` for review and merge.

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

Every developer and agent works on their own fork. No one pushes directly to `dev`.

1. Fork the repo on GitHub
2. Clone your fork and branch from `dev`: `git checkout -b {author}/{type}-{description} dev`
3. Do all work on your feature branch -- commit using conventional commits
4. Push to your fork and open a PR targeting `dev` on the upstream repo
5. Fill out the PR template (`.github/PULL_REQUEST_TEMPLATE.md`)
6. Request 1 reviewer
7. After approval, squash-merge into `dev`

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

- Use `agent/` or `claude/` as the author prefix (e.g., `claude/feat-session-management`)
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
| Start feature | `git checkout -b {author}/{type}-{desc} dev` |
| Build | `cd mcp-server && npm run build` |
| Type check | `cd mcp-server && npm run lint` |
| Run tests | `cd mcp-server && npm test` |
| Production build | `cd mcp-server && npm run build:prod` |
