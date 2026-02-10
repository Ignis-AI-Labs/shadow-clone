# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shadow Clone is an AI orchestration system that delivers prompt engineering macros to enhance AI capabilities.

**MCP Server** (`mcp-server/`) - Model Context Protocol server for native Claude integration. Delivers structured prompts that teach AIs how to simulate specialized agent behaviors.

Key concept: This is a **prompt delivery system**, not an execution engine. The MCP server returns instructional prompts that the receiving AI then follows.

## Build Commands

```bash
cd mcp-server
npm install
npm run build              # TypeScript compilation
npm run build:prod         # Full production build (clean + build + obfuscate)
npm run dev                # Development mode with watch
npm run lint               # Type checking (tsc --noEmit)
```

## Architecture

### MCP Server Structure
- `src/index.ts` - Server entry point, MCP protocol handlers, authentication flow
- `src/tools/combinedTools.ts` - Routes tool calls to appropriate handler classes
- `src/tools/embeddedPromptTools.ts` - Core orchestration tools (shadow_clone_orchestrate, shadow_clone_plan)
- `src/tools/modularTools.ts` - Granular tools (quick_fix, code_review_team, generate_tests, etc.)
- `src/auth/authService.ts` - API key validation and NFT license verification
- `src/prompts/` - Embedded prompt content (compiled into TypeScript)

### Tool Categories
The MCP server exposes tools that return prompt engineering macros:
- **Orchestration**: `shadow_clone_orchestrate`, `shadow_clone_plan` - Full multi-wave project execution
- **Teams**: `deploy_agent_team`, `deploy_specialist_agent` - Deploy focused expert teams
- **Rapid**: `quick_fix`, `code_review_team`, `generate_tests` - Quick targeted operations
- **Utility**: `initialize_workspace`, `api_key_status`, `check_for_updates`

### Authentication Flow
1. User provides API key
2. Key validated against api.ignislabs.ai
3. NFT license ownership verified
4. Session cached locally (persists until NFT ownership changes)

## Key Patterns

### Prompt Engineering Macros
Tools return instructional text that the AI follows. The returned content includes:
- Expert role definitions
- Methodology and workflow instructions
- Output format specifications
- Quality standards and constraints

### Waves System
Projects execute in sequential waves:
- Wave-0: Setup and planning
- Wave-N: Implementation phases
- Output stored in `.waves/` directory (configurable)

### Deliverables
- All agent work products go to `.waves/` (never `.shadow/`)
- `.shadow/` and `.shadow-local/` contain system configuration only

## API Endpoint
Production API: `https://api.ignislabs.ai`
- Authentication: `/api/auth/verify`
- Prompts: `/api/prompts/{category}/{filename}`

## Testing

```bash
cd mcp-server
npm test                   # Run test suite
npm run test:coverage      # Run with coverage report
```

Test infrastructure is being set up (see `I-P4-01` in TASKS.md). For now, verify changes with:
- `npm run build` -- TypeScript compilation succeeds
- `npm run lint` -- No type errors

## Branch Model

```
main           ← Production (default branch)
dev            ← Integration (all PRs target here)
{author}/dev   ← Your working branch (commit here, PR into dev)
```

- Each contributor works on their own `{author}/dev` branch and PRs into `dev`
- `dev` merges into `main` for releases only
- See `CONTRIBUTING.md` for full conventions

## Task Tracking

- **`TASKS.md`** -- All tasks with IDs, priorities, dependencies, and PR links
- **`CONTRIBUTING.md`** -- Branch naming, commit conventions, PR workflow
- **`.github/PULL_REQUEST_TEMPLATE.md`** -- PR template with checklists

Task IDs use format `{Component}-P{Priority}-{Number}` (e.g., `B-P1-04`). Reference these in commits and PRs.

## Important Conventions

- Prompts emphasize parallel agent deployment (max 10 per batch)
- Single Record Keeper per wave for coordination
- Positive framing in all instructions ("do X" not "don't do Y")
- Production builds use webpack obfuscation for IP protection
