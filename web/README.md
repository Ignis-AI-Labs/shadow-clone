# Shadow Clone Web

The free, browser-based interface for Shadow Clone's prompt macros. Pick a tool, fill in plain-English details, and copy the assembled prompt — or send it straight to Claude, ChatGPT, or Gemini.

Same UI ships three ways:

| Path | Audience | How to get it |
|---|---|---|
| **A. Local launcher** | Anyone with Node 18+ | `npx @shadow-clone/web` — opens your browser to a local server |
| **B. Downloaded zip** | Anyone who can unzip a folder | Download `shadow-clone-web.zip` from a GitHub release, unzip, double-click `index.html` |
| **C. Hosted URL** | Browse-first, zero commitment | Visit `shadow-clone.ignislabs.ai` _(deploy pending)_ |

All three serve the exact same prerendered HTML — no server runtime, no API keys, no telemetry.

## Run locally during development

```bash
npm install
npm run dev        # http://localhost:3000 — live-reload Next.js dev server
npm run build      # produces out/ with the static export
npm run start      # serves out/ via the same launcher users will run
npm run type-check # tsc --noEmit
```

## What the launcher does

`bin/shadow-clone.js` is a small Node script that:

1. Finds the static `out/` folder (built by `next build`).
2. Picks the first free port starting at **4747**, bumps if taken.
3. Serves the export via `serve-handler` on `127.0.0.1`.
4. Opens the default browser to that URL.
5. Stops cleanly on `Ctrl+C`.

Flags:

- `--no-open` — skip the auto-browser step (useful over SSH or in scripts).
- `--port=N` — pin the starting port.

## Architecture

- `src/app/` — Next.js routes (App Router, statically exported)
  - `page.tsx` — landing grid of tool cards
  - `tools/[id]/page.tsx` — per-tool form + live prompt preview
- `src/components/` — UI primitives (`ToolCard`, `ToolWorkspace`, `ParamField`, `CopyButton`, `OpenInAIButton`, `AdvancedTemplateEditor`)
- `src/lib/prompts/` — tool catalog and prompt assemblers
  - Imports prompt content from `@prompts/*` → `../mcp-server/src/prompts/content/*`

One source of truth: edits to a prompt module in `mcp-server/` flow into both the MCP server output and this web UI's `assemblePrompt` functions.

## Adding a new tool

1. Add an entry to `src/lib/prompts/tools.ts` with `id`, `label`, `description`, `category`, `params`, and an `assemblePrompt(params) => string` function.
2. The landing page picks it up automatically.
3. `/tools/{id}` renders it via `generateStaticParams`.
4. Run `npm run build` and the new route appears in `out/tools/{id}/index.html`.
