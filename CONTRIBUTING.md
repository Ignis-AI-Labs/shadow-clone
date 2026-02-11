# Contributing to Shadow Clone

Shadow Clone is a free, open-source AI orchestration system. We welcome contributions from everyone -- human developers and AI agents alike.

This guide covers branch conventions, commit standards, PR workflow, and how to contribute new prompts.

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
- `mihir/feat-zod-validation`
- `eli/fix-rate-limiter-bypass`
- `claude/docs-update-readme`

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

body (optional)

footer (optional)
```

Types match branch types above. Scope is optional but encouraged (`tools`, `prompts`, `build`, `utils`).

Examples:
```
feat(tools): add new specialist agent type
fix(validation): handle empty string inputs
chore: update dependencies
docs: add prompt contribution guide
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
- Check the build passes: `cd mcp-server && npm run build`
- Check types pass: `cd mcp-server && npm run lint`

## AI Agent Contributions

AI agents (Claude, Copilot, etc.) follow the same rules:

- Use `agent/dev` or `claude/dev` as their working branch, same as human contributors
- Write conventional commit messages
- Fill out the PR template completely
- Reference task IDs from `TASKS.md` in the PR body

## Contributing New Prompts

Shadow Clone's value comes from high-quality prompt engineering macros. Here's how to contribute new or improved prompts:

### Prompt Location
All prompts live in `mcp-server/src/prompts/content/` as TypeScript files.

### Prompt Quality Standards
- Use positive framing ("do X" not "don't do Y")
- Include clear role definitions for agent personas
- Provide specific, actionable methodology steps
- Include output format specifications
- Define quality standards and constraints

### Adding a New Prompt
1. Create a new `.ts` file in `mcp-server/src/prompts/content/`
2. Export the content following the existing pattern
3. Register the prompt in `mcp-server/src/prompts/content/index.ts`
4. Wire it up in the appropriate tool handler
5. Test with `npm run build && npm run lint`

### Improving Existing Prompts
- Open an issue describing what you'd improve and why
- Submit a PR with the changes
- Include before/after examples if possible

## Dependencies Between PRs

Some PRs must merge in order. Check `TASKS.md` for the dependency graph. If your PR depends on another, note it in the PR template under **Dependencies**.

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
