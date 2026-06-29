# Contributing to Shadow Clone

Shadow Clone is a free, open-source AI orchestration system. We welcome contributions from everyone -- human developers and AI agents alike.

This guide covers branch conventions, commit standards, PR workflow, and how to contribute new prompts.

---

## Branch Model

```
main                        Production-ready code. Deploy target.
 └── dev                    Integration branch. All PRs target here.
      └── {author}/dev      Your personal working branch
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
- `eli/feat-zod-validation`
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

## Code Standards

### Functional Programming Principles
- **Pure functions**: Same inputs always produce same output, no side effects
- **Immutability**: Use `const`, spread operators, avoid mutation
- **Composition over inheritance**: Combine small functions for complex behavior
- **Single responsibility**: One function does one thing well
- **Declarative over imperative**: `map`/`filter`/`reduce` over manual loops where clarity permits

### Size Limits
- **Functions**: 30 lines target, 50 lines hard ceiling
- **Files**: 200 lines target, 300 lines hard ceiling
- **Parameters**: Max 3-4 per function (use an options object beyond that)

### Task-First Requirement
- A task must exist in `TASKS-plugin.md`, `TASKS-backend.md`, `TASKS-frontend.md`, or `TASKS-shared.md` before work begins
- Every PR references a task ID (e.g., "Implements P-P1-04")
- Claim tasks by adding your name to the Assignee column

## AI Agent Contributions

AI agents (Claude, Copilot, etc.) follow the same rules:

- Use `{agent}/dev` (e.g. `claude/dev`) as their working branch, same as human contributors
- Write conventional commit messages
- Fill out the PR template completely
- Reference task IDs from `TASKS-plugin.md`, `TASKS-backend.md`, `TASKS-frontend.md`, or `TASKS-shared.md` in the PR body

## Contributing slash commands (primary surface)

The Shadow Clone command surface lives at `claude/commands/sc*.md`. Each
command is a single markdown file with frontmatter, an `AskUserQuestion`
preamble batch, three waves of work, and a Standards block referencing
`protocols/`. `bridge/install.sh` deploys every `sc*.md` automatically — add
a new file, re-run the installer, and it's live.

### Adding a new slash command

1. Open a task in `TASKS-plugin.md` (prefix `P-*`).
2. Create `claude/commands/sc-<your-mode>.md`. Use any existing command as a
   structural template (e.g. `claude/commands/sc-feature.md`).
3. Each command should:
   - Start with a `---` frontmatter block including a one-line `description:`
   - Open with an `AskUserQuestion` preamble batch (3–5 context questions)
   - Run in **three waves** (research → plan → deliver), each producing one
     deliverable under `.waves/wave-N/deliverables/`
   - Cite the applicable protocols from `protocols/` in a Standards block
   - End with a Closing block summarizing the final artifact
4. Re-run `bash bridge/install.sh && bash scripts/sc-doctor.sh` to verify the
   command deploys and is healthy.
5. Add an entry to `claude/commands/sc-help.md` so users can discover it.

### Improving existing slash commands

- Open an issue or task describing what you'd improve and why
- Submit a PR with the changes; `/sc-echo` will paired-review the diff
- The reviewer judges against `AGENTS.md` and the cited protocols

## Contributing protocols

The 14 canonical protocols in `protocols/` are the engineering standards
every mode adheres to.

1. Open a task in `TASKS-shared.md` (prefix `S-*`).
2. New protocols go in `protocols/<Name> Protocol.md`. They deploy
   automatically to `~/.claude/sc/protocols/` on the next `install.sh` run.
3. Update `claude/commands/sc-help.md` to list the new protocol under the
   appropriate tier (core / operational / additional).
4. If the new protocol is a core standard, add it to every relevant mode's
   Standards block.

## Contributing prompts to the MCP server (secondary surface)

The MCP server at `mcp-server/` is still maintained as a secondary delivery
channel. Prompts live in `mcp-server/src/prompts/content/` as TypeScript
files.

### Adding a new MCP prompt
1. Open a task in `TASKS-backend.md` (prefix `B-*`).
2. Create a new `.ts` file in `mcp-server/src/prompts/content/`.
3. Export the content following the existing pattern.
4. Register the prompt in `mcp-server/src/prompts/content/index.ts`.
5. Wire it up in the appropriate tool handler.
6. Test with `npm run build && npm run lint`.

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
