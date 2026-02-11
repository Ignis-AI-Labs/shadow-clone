# Architectural Recommendation: IP Protection Before Public Launch

**Audience**: Founder / Technical Lead
**Priority**: CRITICAL — must resolve before making the repository public
**Date**: 2025-02-11
**Authors**: Audit Team

---

## Executive Summary

Making the `shadow-clone` repository public in its current architecture **exposes the entire product (prompt content) to anyone who clones the repo**, rendering all authentication, encryption, and NFT licensing meaningless. This document presents **four architectural options** — from full remote migration to lighter-weight alternatives that preserve the standard local MCP server pattern — and recommends a path forward.

---

## 1. The Problem

### 1.1 Your IP Is the Prompts

Shadow Clone's entire product value is in the prompt content — the structured instructions that transform vague user requests into professional-grade AI workflows. These prompts live as string literals in 14 TypeScript files:

```
mcp-server/src/prompts/content/
├── mainPrompt.ts                            (~800 lines)
├── mode_feature.ts
├── mode_audit.ts
├── mode_debug.ts
├── mode_optimize.ts
├── mode_plan.ts
├── mode_refactor.ts
├── mode_research.ts
├── agent_core_rules.ts
├── agent_agent_template.ts
├── agent_README.ts
├── template_master_plan_template.ts
├── template_mode_completion_template.ts
├── template_security_audit_report_template.ts
└── template_team_agent_templates.ts
```

Every one of these files contains `export const content = \`...\`` with the full prompt text in plaintext.

### 1.2 Current Architecture Exposes Everything

```
CURRENT: Local MCP Server (distributed to user machines)

  User clones repo
       ↓
  Gets ALL source code including prompts/content/*.ts
       ↓
  Can read, copy, modify, redistribute prompts freely
       ↓
  Authentication is irrelevant — IP is already in their hands
```

### 1.3 Auth Bypass Is Trivial (Three Independent Routes)

Even if someone wanted to run the server rather than just reading the source files:

| Bypass Method | Effort | Details |
|--------------|--------|---------|
| **Read source directly** | Zero | `cat mcp-server/src/prompts/content/mainPrompt.ts` |
| **Creator config file** | Zero | `.shadow-local/creator-config.json` ships IN the repo with `bypassAuth: true` |
| **Environment variable** | 5 seconds | `export SHADOW_CLONE_CREATOR_MODE=true` |
| **Remove auth code** | 5 minutes | Delete the `isAuthenticated()` check in `index.ts` |
| **Deobfuscate production build** | 30 minutes | Webpack obfuscation is reversible with standard tools |

### 1.4 Obfuscation Is Not Protection

The `build:prod` script runs webpack-obfuscator, but:
- Obfuscation is a **speed bump**, not a barrier — tools like `de4js`, `webcrack`, and AST-based deobfuscators reverse it
- The npm package (`@shadow-clone/mcp-server`) distributes the obfuscated bundle, but if the repo is public, the pre-obfuscation source is right there
- JavaScript obfuscation provides approximately zero security against a motivated attacker

---

## 2. Solution Options

We present three viable options (A, D, C) and one non-viable option (B) for reference. Each preserves IP while differing in architecture, effort, and tradeoffs. Options are ordered from most change to least change.

---

## Option A: Fully Remote MCP Server

**Summary**: Replace the local stdio MCP server with a remote server that users connect to over HTTPS. The standard MCP server pattern changes from local to remote.

**Effort**: Medium (~2-4 weeks)
**IP Protection**: Complete — prompts never leave your server

### A.1 Architecture Change

```
PROPOSED: Remote MCP Server (prompts stay on your infrastructure)

  ┌──────────────────────────────────────────────────────────┐
  │                     USER'S MACHINE                        │
  │                                                           │
  │  ┌─────────────────┐                                     │
  │  │  Claude Desktop  │──── SSE / Streamable HTTP ──────────┼───┐
  │  │  (AI Assistant)  │                                     │   │
  │  └─────────────────┘                                     │   │
  │                                                           │   │
  │  No local MCP server needed.                              │   │
  │  No source code on user's machine.                        │   │
  └──────────────────────────────────────────────────────────┘   │
                                                                  │
                                                                  ▼
                              ┌──────────────────────────────────────┐
                              │       YOUR INFRASTRUCTURE             │
                              │                                       │
                              │  ┌─────────────────────────────────┐  │
                              │  │   Remote MCP Server              │  │
                              │  │   mcp.ignislabs.ai               │  │
                              │  │                                   │  │
                              │  │   ┌─────────────────────────┐    │  │
                              │  │   │  prompts/content/*.ts    │    │  │
                              │  │   │  (NEVER leaves server)   │    │  │
                              │  │   └─────────────────────────┘    │  │
                              │  │                                   │  │
                              │  │   Auth → Validate → Assemble →   │  │
                              │  │   Return prompt via SSE           │  │
                              │  └──────────────┬──────────────────┘  │
                              │                 │                      │
                              │                 ▼                      │
                              │  ┌─────────────────────────────────┐  │
                              │  │   Supabase (existing)            │  │
                              │  │   shadow_clone_licenses          │  │
                              │  └─────────────────────────────────┘  │
                              └──────────────────────────────────────┘
```

### A.2 What Changes

| Component | Current | Proposed |
|-----------|---------|----------|
| MCP Transport | `stdio` (local process) | `SSE` or `Streamable HTTP` (remote) |
| Prompt storage | Compiled into distributed npm package | Private server, never distributed |
| User installation | `npm install` + Claude Desktop config pointing to local binary | Claude Desktop config pointing to remote URL only |
| Auth enforcement | Client-side (bypassable) | Server-side (enforceable) |
| Creator mode | File-based bypass (ships in repo) | Removed from public repo entirely |
| Encryption module | Encrypts API key on user disk | Not needed — key sent per-request in header |
| API key caching | `~/.shadow-clone/mcp-auth.json`, `config.json` | Not needed — stateless server-side auth |
| Rate limiting | In-memory, single bucket | Server-side, per-API-key, enforceable |

### A.3 User Setup Experience

The entire user setup becomes a single config block. No npm install, no Node.js required, no source code:

```jsonc
// User adds this to Claude Desktop config
// (~/.claude/claude_desktop_config.json or equivalent)
{
  "mcpServers": {
    "shadow-clone": {
      "url": "https://mcp.ignislabs.ai/shadow-clone",
      "headers": {
        "X-API-Key": "sc-user-api-key-here"
      }
    }
  }
}
```

That's the entire setup. The public repo README would document this and nothing more (in terms of installation).

### A.4 Key Insight

This option departs from the standard MCP pattern. Most MCP servers (filesystem, GitHub, Slack, etc.) run locally via stdio. Shadow Clone would be one of the few commercial MCP servers using remote transport. This is architecturally clean but may feel unfamiliar to MCP ecosystem users.

---

## Option D: Hybrid — Local MCP Server + Remote Prompt Fetching (RECOMMENDED)

**Summary**: Keep the standard local stdio MCP server pattern, but **remove all prompt content from the source code**. Instead, the local server fetches prompts from `api.ignislabs.ai` at runtime, only when the user has a valid API key.

**Effort**: Low-Medium (~1-2 weeks)
**IP Protection**: Strong — prompts never exist in source code or npm package

### D.1 Architecture

```
HYBRID: Local MCP Server (code is public) + Remote Prompt API (content is private)

  ┌──────────────────────────────────────────────────────────┐
  │                     USER'S MACHINE                        │
  │                                                           │
  │  ┌─────────────────┐    stdio     ┌───────────────────┐  │
  │  │  Claude Desktop  │◄──────────►│  MCP Server (Node) │  │
  │  │  (AI Assistant)  │  MCP proto  │  shadow-clone-mcp  │  │
  │  └─────────────────┘             │                     │  │
  │                                   │  Tool logic: ✓      │  │
  │                                   │  Validation: ✓      │  │
  │                                   │  Auth: ✓            │  │
  │                                   │  Prompts: ✗ EMPTY   │  │
  │                                   └────────┬──────────┘  │
  │                                            │              │
  └────────────────────────────────────────────│──────────────┘
                                               │ HTTPS (per tool call)
                                               ▼
                              ┌──────────────────────────────┐
                              │   api.ignislabs.ai            │
                              │                               │
                              │  /shadow-clone-licenses/      │
                              │     validate        (existing)│
                              │                               │
                              │  /shadow-clone-prompts/       │
                              │     {category}/{name}   (NEW) │
                              │     ├── mainPrompt            │
                              │     ├── mode_feature          │
                              │     ├── mode_audit            │
                              │     ├── agent_core_rules      │
                              │     └── ...                   │
                              │                               │
                              │  Supabase (existing)          │
                              └──────────────────────────────┘
```

### D.2 How It Works

The MCP server stays local and uses stdio — **exactly like it does today** — but with one change: `prompts/content/*.ts` files no longer contain the actual prompt text. Instead, they contain fetch calls.

**Current** (prompt compiled into source):
```typescript
// mcp-server/src/prompts/content/mainPrompt.ts
export const content = `
  800 lines of valuable prompt IP here...
`;
```

**Proposed** (prompt fetched at runtime):
```typescript
// mcp-server/src/prompts/content/mainPrompt.ts
export async function getContent(apiKey: string): Promise<string> {
  const response = await fetch('https://api.ignislabs.ai/shadow-clone-prompts/main', {
    headers: { 'X-API-Key': apiKey }
  });
  if (!response.ok) throw new Error('Unauthorized or prompt not found');
  return response.json().then(r => r.content);
}
```

The tool execution flow becomes:

```
→ User asks Claude to orchestrate
    → Claude calls shadow_clone_orchestrate({mode: 'feature', ...})
        → Local MCP server receives request (stdio, same as today)
            → Auth check (same as today)
            → Fetch prompt: GET api.ignislabs.ai/shadow-clone-prompts/mode_feature
              with X-API-Key header
            → API validates key, returns prompt content
            → Local server assembles final prompt (same logic as today)
        → Returns assembled prompt to Claude
    → Claude follows the instructions
```

### D.3 What Changes vs Current

| Component | Current | Hybrid |
|-----------|---------|--------|
| MCP Transport | `stdio` (local) | `stdio` (local) — **unchanged** |
| Server code | Public source has everything | Public source has tool logic, no prompts |
| `prompts/content/*.ts` | Hardcoded string literals | `async fetch()` calls to prompt API |
| User installation | `npm install` + config | `npm install` + config — **unchanged** |
| User experience | Identical tool names, same behavior | **Identical** — user sees no difference |
| Network calls | Auth only (on first use) | Auth + prompt fetch per tool call |
| Offline usage | Works after first auth | Requires internet for each tool call |

### D.4 New API Endpoint Required

Add one new endpoint to the existing API server (`api/`):

```
GET /shadow-clone-prompts/{category}/{name}
Headers: X-API-Key: sc-...

Auth: Validate API key (reuse existing validate logic)
Response: { content: "the prompt text..." }

Categories:
  - main/prompt          → mainPrompt.ts content
  - modes/feature        → mode_feature.ts content
  - modes/audit          → mode_audit.ts content
  - modes/debug          → mode_debug.ts content
  - modes/optimize       → mode_optimize.ts content
  - modes/plan           → mode_plan.ts content
  - modes/refactor       → mode_refactor.ts content
  - modes/research       → mode_research.ts content
  - agents/core_rules    → agent_core_rules.ts content
  - agents/template      → agent_agent_template.ts content
  - agents/readme        → agent_README.ts content
  - templates/master_plan           → template_master_plan_template.ts content
  - templates/mode_completion       → template_mode_completion_template.ts content
  - templates/security_audit_report → template_security_audit_report_template.ts content
  - templates/team_agents           → template_team_agent_templates.ts content
```

The prompt content would be stored server-side (Supabase, environment variables, or a private file store on Vercel). The API key validation that already exists is reused.

### D.5 Why This Is the Best Middle Ground

1. **Preserves standard MCP pattern** — Local stdio server, exactly how every other MCP server works. No ecosystem friction.
2. **Public repo is safe** — Source code contains tool logic, validation, auth flow — but zero prompt content. Anyone can clone it, but without an API key, the tools return nothing.
3. **Minimal code changes** — The `embeddedPromptTools.ts` and `modularTools.ts` just need their `prompts.content` references changed from sync string reads to async API fetches.
4. **Existing infra reuse** — The API server on Vercel already handles auth. One new route handler to serve prompts.
5. **User sees no change** — Same tools, same behavior, same config. They don't know or care that prompts now come from the API.
6. **npm package is safe to publish** — The obfuscated npm bundle contains the fetch logic but not the prompts. Even deobfuscated, there's nothing to steal.

### D.6 Caching Consideration

To avoid hitting the API on every single tool call, the local server can cache fetched prompts in memory:

```
First call to shadow_clone_orchestrate (mode: feature):
  → Fetch mode_feature prompt from API (network call)
  → Cache in memory for session lifetime

Second call to shadow_clone_orchestrate (mode: feature):
  → Serve from memory cache (no network call)

Server restart:
  → Cache is empty, fetches again on first use
```

This gives near-zero latency after the first call while ensuring prompts are never persisted to disk on the user's machine.

### D.7 What the Public Repo Contains (Hybrid Model)

```
shadow-clone/                      (PUBLIC REPO)
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── mcp-server/
│   ├── src/
│   │   ├── index.ts               ← Server entry (unchanged)
│   │   ├── auth/
│   │   │   ├── authService.ts     ← Auth logic (unchanged)
│   │   │   └── ...
│   │   ├── tools/
│   │   │   ├── embeddedPromptTools.ts  ← Tool logic (prompts fetched, not embedded)
│   │   │   ├── modularTools.ts         ← Tool logic (prompts fetched, not embedded)
│   │   │   └── ...
│   │   ├── prompts/
│   │   │   └── content/
│   │   │       ├── index.ts        ← Exports fetch functions instead of strings
│   │   │       ├── mainPrompt.ts   ← getContent(apiKey) — NO prompt text
│   │   │       ├── mode_feature.ts ← getContent(apiKey) — NO prompt text
│   │   │       └── ...             ← All files are fetch stubs
│   │   └── utils/
│   └── package.json
├── api/                            ← Validation API + NEW prompt serving endpoint
└── docs/
```

**Key difference from current**: `prompts/content/*.ts` files exist but contain only fetch functions, not the actual prompt strings.

---

## Option C: Private Source, Public npm Package Only

**Summary**: Don't make the source repo public at all. Keep it private. Only distribute the product as an obfuscated npm package (`@shadow-clone/mcp-server`). The public-facing repo contains only documentation and the API server.

**Effort**: Low (~1 week)
**IP Protection**: Moderate — obfuscation is a speed bump, not a wall

### C.1 Architecture

```
PRIVATE SOURCE: User never sees the code

  npm registry                           GitHub (public)
  ─────────────                          ──────────────
  @shadow-clone/mcp-server               shadow-clone/
  (obfuscated dist-only)                 ├── README.md
                                         ├── docs/
  User runs:                             ├── api/
  npm install -g @shadow-clone/mcp-server└── (no mcp-server/src/)
```

### C.2 How It Works

The `package.json` already has this configured:

```json
{
  "files": ["dist/**/*", "README.md", "LICENSE", "CHANGELOG.md"],
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

The `files` field means `npm publish` only includes `dist/` — not `src/`. Combined with `build:prod` (webpack obfuscation), the published package contains only the obfuscated bundle.

### C.3 User Setup

```bash
# Install globally
npm install -g @shadow-clone/mcp-server
```

```jsonc
// Claude Desktop config
{
  "mcpServers": {
    "shadow-clone": {
      "command": "shadow-clone-mcp",
      "args": []
    }
  }
}
```

This is the **standard local MCP server pattern** — identical to how other MCP servers are installed and configured.

### C.4 What's Public vs Private

| Content | Where | Visibility |
|---------|-------|-----------|
| Source code (`src/`) | Private GitHub repo | Team only |
| Obfuscated bundle (`dist-obfuscated/`) | npm registry | Public (but obfuscated) |
| Documentation, examples | Public GitHub repo | Everyone |
| API server (`api/`) | Public GitHub repo | Everyone |
| Prompt content | Embedded in obfuscated bundle | Obscured, not truly protected |

### C.5 Limitations

This option has a **fundamental weakness**: JavaScript obfuscation is reversible.

| Attack | Effort | Result |
|--------|--------|--------|
| `npm pack @shadow-clone/mcp-server` | 10 seconds | Gets the obfuscated bundle |
| Run through `webcrack` or `de4js` | 5-30 minutes | Recovers readable code |
| Extract string literals | 5 minutes after deobfuscation | All prompt content exposed |

Obfuscation deters casual copying but does not prevent determined extraction. Treat this as a **short-term measure**, not a permanent solution.

### C.6 When This Option Makes Sense

- As an **interim step** while building towards Option A or D
- If the primary audience is non-technical users who won't attempt deobfuscation
- If the founder wants to launch quickly and iterate on IP protection later
- Combined with legal protections (ToS, DMCA takedowns) as a deterrent layer

---

## Option B: Go Public As-Is (NOT RECOMMENDED)

For completeness: making the repo public with the current architecture and source code exposes all ~3,050 lines of prompt IP immediately. Auth bypass ships in the repo. The product becomes free on day 1. **This is not a viable option for a commercial product.**

---

## 3. What the Public Repo Would Contain (By Option)

### Summary by Option

| What | Option A (Remote) | Option D (Hybrid) | Option C (npm only) |
|------|-------------------|-------------------|---------------------|
| **Public repo has MCP source** | No | Yes (without prompt strings) | No |
| **Public repo has prompts** | No | No (fetch stubs only) | No |
| **npm package has prompts** | N/A (no npm) | No (fetched at runtime) | Yes (obfuscated) |
| **Prompts stored where** | Your server only | Your API server only | Embedded in obfuscated JS |
| **Reversible by attacker** | No | No (would need API key) | Yes (deobfuscation) |

### Common: Things to REMOVE from any public repo

Regardless of which option is chosen, these must be removed before going public:

```
REMOVE FROM PUBLIC REPO:
├── .shadow-local/                      ← Contains creator-config.json (auth bypass!)
├── mcp-server/src/auth/creatorMode.ts  ← Auth bypass mechanism
```

### Option A specific: Move to private

```
MOVE TO PRIVATE INFRASTRUCTURE:
├── mcp-server/                  ← Entire MCP server codebase
│   ├── src/
│   │   ├── index.ts             ← Rewritten for SSE transport
│   │   ├── prompts/content/     ← The IP (stays private forever)
│   │   ├── tools/               ← Tool logic
│   │   └── utils/
│   └── package.json
```

### Option D specific: Replace prompt files

```
KEEP IN PUBLIC REPO (but modified):
├── mcp-server/src/prompts/content/
│   ├── mainPrompt.ts     ← Replace: export string → export async fetch()
│   ├── mode_feature.ts   ← Replace: export string → export async fetch()
│   └── ...               ← All become API fetch stubs, zero IP content

MOVE TO API SERVER (private storage):
├── Prompt content stored in Supabase, env vars, or private file store
│   └── Served via new /shadow-clone-prompts/ endpoint
```

### Option C specific: Split repos

```
PUBLIC REPO (github.com/.../shadow-clone):
├── README.md, docs/, api/, .github/
└── No mcp-server/src/ at all

PRIVATE REPO (github.com/.../shadow-clone-mcp):
├── mcp-server/            ← Full source, never public
└── Published to npm as @shadow-clone/mcp-server (obfuscated dist only)
```

---

## 4. Migration Considerations

### 4.1 Option A: Transport Change (stdio → SSE)

The MCP SDK (`@modelcontextprotocol/sdk`) supports both transports. The current server uses:

```typescript
// Current: stdio transport (index.ts)
const transport = new StdioServerTransport();
await server.connect(transport);
```

The remote version would use SSE or the newer Streamable HTTP transport. Tool definitions, handlers, and prompt assembly logic remain identical — only the transport layer changes.

With a remote server, the entire local auth stack becomes unnecessary:

| Current Module | Remote Equivalent |
|---------------|-------------------|
| `authService.ts` (encrypt, cache, persist) | Simple API key header check per request |
| `apiKeyManager.ts` (multi-location key search) | Not needed — key comes in request header |
| `encryption.ts` (AES-256-GCM, scrypt, v1 migration) | Not needed — no local key storage |
| `creatorMode.ts` (file-based bypass) | Internal admin flag on server (if needed at all) |
| `mcp-auth.json`, `config.json` | Not needed — stateless |

Two tools need rethinking in a fully remote model:

| Tool | Current Behavior | Remote Consideration |
|------|-----------------|---------------------|
| `check_for_updates` | Runs `npm view` shell command locally | Not applicable — no local install to update. Remove or replace with a version API endpoint. |
| `initialize_workspace` | Creates files in user's project directory | Cannot create files remotely. Must remain client-side OR become instructions for the user/AI to follow. |

### 4.2 Option D: Prompt Fetch Refactor (Recommended Path)

The core change is small. Currently `embeddedPromptTools.ts` and `modularTools.ts` reference prompts like:

```typescript
// Current: synchronous, prompt is a compiled-in string
import * as prompts from '../prompts/content/index.js';

// Inside executeOrchestration():
const mainPrompt = prompts.content;              // ← string literal, in source
const modeConfig = prompts.mode_feature.content;  // ← string literal, in source
```

After migration:

```typescript
// Proposed: async, prompt is fetched from API
import * as prompts from '../prompts/content/index.js';

// Inside executeOrchestration():
const apiKey = this.authService.getApiKey();
const mainPrompt = await prompts.getContent('main/prompt', apiKey);
const modeConfig = await prompts.getContent('modes/feature', apiKey);
```

**What changes**:
- `prompts/content/*.ts` — rewrite from `export const content = "..."` to `export async function getContent()`
- `embeddedPromptTools.ts` — make `executeTool()` and sub-methods async where they reference prompts
- `modularTools.ts` — same async conversion
- `api/` — add one new route: `GET /shadow-clone-prompts/{category}/{name}`

**What stays exactly the same**:
- `index.ts` — stdio transport, request pipeline, auth gating, timeout handling
- `combinedTools.ts` — tool routing
- `validation.ts` — input sanitization
- `authService.ts` — auth flow (still needed for local API key validation)
- `apiKeyManager.ts` — key storage (still needed locally)
- `encryption.ts` — key encryption (still needed locally)
- `rateLimiter.ts`, `monitoring.ts`, `logger.ts` — all unchanged
- `workspaceInitializer.ts` — still runs locally, no change needed
- `check_for_updates` — still runs locally, no change needed

**Estimated scope**: ~5-8 files modified, ~200 lines of code changed. Zero architectural disruption.

### 4.3 Option C: Repo Split

Minimal code changes required:

1. Create private repo, move `mcp-server/` source there
2. Remove `mcp-server/src/` from public repo
3. Ensure `npm publish` only ships `dist-obfuscated/` (already configured via `"files"` in package.json)
4. Add install docs to public repo README

No code changes to the MCP server itself.

---

## 5. Tradeoff Analysis

### 5.1 Comparison Matrix

| Dimension | A (Remote) | D (Hybrid) | C (npm only) | B (As-is) |
|-----------|------------|------------|--------------|-----------|
| **IP Protection** | Complete | Complete | Weak (obfuscation) | None |
| **MCP Pattern** | Non-standard (SSE) | Standard (stdio) | Standard (stdio) | Standard (stdio) |
| **User Experience** | Config URL only | npm install + config | npm install + config | npm install + config |
| **Offline Usage** | No | No (needs API for prompts) | Yes | Yes |
| **Latency** | Every call over network | First call per prompt type | Zero (local) | Zero (local) |
| **Source Code Public** | No server code public | Server code public (safe) | No server code public | Everything public |
| **Hosting Cost** | High (serve all requests) | Low (serve prompts only) | Zero | Zero |
| **Instant Updates** | Yes | Yes (prompt content) | No (npm publish cycle) | No |
| **Code Effort** | Medium (transport rewrite) | Low (async fetch refactor) | Minimal (repo split) | Zero |
| **Long-term Viability** | Excellent | Excellent | Poor (deobfuscation risk) | Unviable |

### 5.2 Risk If You Do Nothing (Option B)

If the repo goes public with the current architecture:

1. **Day 1**: Anyone clones the repo and has all prompt content
2. **Day 1**: Prompt content gets posted on forums, Discord, etc.
3. **Day 2**: Someone publishes a "free shadow clone" fork with auth stripped
4. **Day 3**: Your NFT licensing model is worthless — the product is free
5. **Ongoing**: You cannot un-leak the prompts. The damage is permanent.

---

## 6. Implementation Phases (Option D — Recommended Path)

### Phase 1: Clean the Repo (Immediate, before ANY public visibility)

1. Remove `.shadow-local/creator-config.json` from the repo and git history
2. Remove `creatorMode.ts` (or gut it to a no-op)
3. Add to `.gitignore`: `.shadow-local/`, `creator-config.json`
4. Audit git history for any committed secrets or prompt content in non-standard locations

### Phase 2: Build Prompt API Endpoint (~3-5 days)

1. Add `GET /shadow-clone-prompts/{category}/{name}` route to `api/`
2. Store prompt content in Supabase (new table) or as environment variables on Vercel
3. Reuse existing API key validation for auth on this endpoint
4. Add caching headers (optional: `Cache-Control: private, max-age=300`)
5. Test: valid key returns prompt, invalid/missing key returns 401

### Phase 3: Refactor MCP Server to Fetch Prompts (~3-5 days)

1. Rewrite `prompts/content/*.ts` — replace string exports with async fetch functions
2. Add a `PromptClient` utility class to handle fetching, caching, error handling
3. Update `embeddedPromptTools.ts` — make tool execution async where it reads prompts
4. Update `modularTools.ts` — same async conversion
5. In-memory cache: fetched prompts live for the process lifetime (no disk persistence)
6. Graceful fallback: if prompt fetch fails, return clear error ("Unable to load prompt content. Check your API key and network connection.")

### Phase 4: Test, Publish, Go Public (~2-3 days)

1. Test full flow: install from npm → authenticate → call tools → verify prompts load
2. Verify: `cat src/prompts/content/mainPrompt.ts` shows only fetch logic, zero IP
3. `npm publish` — package contains fetch stubs, not prompt strings
4. Make the repo public
5. Update README with setup instructions

### Phase 5: Enhance (Post-launch)

1. Usage analytics: track which prompts are fetched, by whom, how often
2. Per-tier gating: check `licenseType` before serving premium prompts
3. Prompt versioning: serve different prompt versions to different users (A/B testing)
4. Rate limiting on prompt endpoint: prevent bulk prompt scraping even with a valid key

---

## 7. Architecture Diagrams for Docs

### For Option D (Hybrid — Recommended)

```
┌───────────────────────────────────────────────────────────┐
│                      YOUR MACHINE                          │
│                                                            │
│  ┌─────────────────┐   stdio    ┌──────────────────────┐  │
│  │  Claude Desktop  │◄────────►│  Shadow Clone MCP     │  │
│  │                  │  (local)  │  (local server)       │  │
│  │  You type:       │          │                        │  │
│  │  "Build X"       │          │  1. Validates API key  │  │
│  └─────────────────┘          │  2. Fetches expert     │──┼──┐
│                                │     prompts from API   │  │  │
│                                │  3. Assembles response │  │  │
│                                │  4. Returns to Claude  │  │  │
│                                └──────────────────────┘  │  │
│                                                            │  │
└────────────────────────────────────────────────────────────┘  │
                                                                 │
                                              HTTPS (prompt fetch)
                                                                 │
                                                                 ▼
                                          ┌──────────────────────────┐
                                          │  api.ignislabs.ai         │
                                          │                           │
                                          │  Validates your license   │
                                          │  Serves prompt content    │
                                          └──────────────────────────┘
                                                                 │
                                                                 ▼
                                          Claude receives structured
                                          methodology and executes
                                          the work on YOUR machine
```

### For Option A (Fully Remote)

```
┌───────────────────────────────────────────────────────────┐
│                      YOUR MACHINE                          │
│                                                            │
│  ┌─────────────────┐                                      │
│  │  Claude Desktop  │─── HTTPS ───────────────────────────┼───┐
│  │                  │                                      │   │
│  │  You type:       │  No local server needed.             │   │
│  │  "Build X"       │  Just a config URL.                  │   │
│  └─────────────────┘                                      │   │
│                                                            │   │
└────────────────────────────────────────────────────────────┘   │
                                                                  │
                                                                  ▼
                                          ┌──────────────────────────┐
                                          │  Shadow Clone MCP Server  │
                                          │  mcp.ignislabs.ai         │
                                          │                           │
                                          │  1. Validates your API key │
                                          │  2. Checks NFT license    │
                                          │  3. Assembles expert       │
                                          │     instructions           │
                                          │  4. Returns prompt to      │
                                          │     Claude                 │
                                          └──────────────────────────┘
```

---

## 8. Decision Required

The founder needs to decide:

| Option | Risk | Effort | IP Protection | MCP Pattern |
|--------|------|--------|---------------|-------------|
| **A. Fully remote MCP server** | Low | Medium (~2-4 weeks) | Complete | Non-standard (SSE) |
| **D. Hybrid: local server + remote prompts** | Low | Low-Medium (~1-2 weeks) | Complete | Standard (stdio) |
| **C. Private source, npm-only distribution** | Medium | Low (~1 week) | Weak (obfuscation) | Standard (stdio) |
| **B. Go public as-is** | **CRITICAL** | Zero | **None** | Standard (stdio) |

### Our Recommendation: Option D (Hybrid)

**Option D is the strongest choice** because it:

1. **Protects IP completely** — prompts are fetched from the API, never in source code or npm bundle
2. **Preserves the standard MCP pattern** — local stdio server, familiar to the ecosystem
3. **Requires the least code changes** — ~5-8 files, ~200 lines, no architectural rewrite
4. **Allows the source code to be public** — builds community trust, enables contributions to non-IP code (tools, validation, auth flow)
5. **Reuses existing infrastructure** — the Vercel API server already handles auth; just add one endpoint
6. **Enables instant prompt updates** — change prompts server-side, all users get the new version immediately

**Fallback**: If speed to market is critical and you need to launch before the prompt API is built, use **Option C (npm-only)** as a temporary measure. But plan to migrate to Option D within weeks, not months — obfuscation will be broken.

**Optional future upgrade**: Once on Option D, migrating to **Option A (fully remote)** becomes easy since the prompts are already server-side. This can be done later if you want to eliminate the npm install step entirely.

---

## Appendix: Files Containing Product IP (Must Not Be Public)

| File | Lines of IP Content | Description |
|------|-------------------|-------------|
| `mainPrompt.ts` | ~800 | Core orchestration framework |
| `mode_feature.ts` | ~200 | Feature development methodology |
| `mode_audit.ts` | ~200 | Security audit methodology |
| `mode_debug.ts` | ~200 | Debugging methodology |
| `mode_optimize.ts` | ~150 | Performance optimization methodology |
| `mode_plan.ts` | ~200 | Project planning methodology |
| `mode_refactor.ts` | ~150 | Code refactoring methodology |
| `mode_research.ts` | ~150 | Research methodology |
| `agent_core_rules.ts` | ~300 | Agent behavior rules |
| `agent_agent_template.ts` | ~100 | Agent template format |
| `agent_README.ts` | ~50 | Agent documentation |
| `template_master_plan_template.ts` | ~100 | Planning output template |
| `template_mode_completion_template.ts` | ~50 | Completion report template |
| `template_security_audit_report_template.ts` | ~100 | Security report template |
| `template_team_agent_templates.ts` | ~300 | Team composition templates |
| **Total** | **~3,050 lines** | **The entire commercial product** |
