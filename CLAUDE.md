# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shadow Clone is a **free, open-source** AI orchestration system that delivers prompt engineering macros to enhance AI capabilities.

**MCP Server** (`mcp-server/`) - Model Context Protocol server for native Claude integration. Delivers structured prompts that teach AIs how to simulate specialized agent behaviors.

Key concept: This is a **prompt delivery system**, not an execution engine. The MCP server returns instructional prompts that the receiving AI then follows.

## Build Commands

```bash
cd mcp-server
npm install
npm run build              # TypeScript compilation
npm run dev                # Development mode with watch
npm run lint               # Type checking (tsc --noEmit)
```

## Architecture

### MCP Server Structure
- `src/index.ts` - Server entry point, MCP protocol handlers
- `src/tools/combinedTools.ts` - Routes tool calls to appropriate handler classes
- `src/tools/embeddedPromptTools.ts` - Core orchestration tools (shadow_clone_orchestrate, shadow_clone_plan)
- `src/tools/modularTools.ts` - Granular tools (quick_fix, code_review_team, generate_tests, etc.)
- `src/prompts/` - Embedded prompt content (compiled into TypeScript)

### Tool Categories (13 tools)
The MCP server exposes tools that return prompt engineering macros:
- **Orchestration**: `shadow_clone_orchestrate`, `shadow_clone_plan` - Full multi-wave project execution
- **Teams**: `deploy_agent_team`, `deploy_specialist_agent` - Deploy focused expert teams
- **Rapid**: `quick_fix`, `code_review_team`, `generate_tests`, `execute_single_wave` - Quick targeted operations
- **Documentation**: `create_documentation`, `architecture_consultant` - Professional docs and design
- **Utility**: `initialize_workspace`, `check_for_updates`, `show_commands`

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

## Testing

```bash
cd mcp-server
npm test                   # Run test suite
npm run test:coverage      # Run with coverage report
```

For now, verify changes with:
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

## Code Standards

### Functional Programming
- Write pure functions: same inputs produce same output, no side effects
- Prefer immutability: `const`, spread operators, no mutation
- Composition over inheritance: combine small functions for complex behavior
- Single responsibility: one function does one thing well

### Size Limits
- **Functions**: 30 lines target, 50 lines hard ceiling
- **Files**: 200 lines target, 300 lines hard ceiling
- **Parameters**: Max 3-4 per function (use an options object beyond that)

### Task-First
- Create or claim a task in `TASKS-plugin.md`, `TASKS-backend.md`, `TASKS-frontend.md`, or `TASKS-shared.md` before writing code
- Every commit and PR references a task ID (e.g., "Implements P-P1-04")

## Task Tracking

- **`TASKS.md`** -- Hub linking to domain-specific task files
- **`TASKS-plugin.md`** -- Slash commands / bridge / protocols tasks (P-* prefix) — **primary surface**
- **`TASKS-backend.md`** -- MCP server tasks (B-* prefix) — secondary surface
- **`TASKS-frontend.md`** -- Web UI tasks (F-* prefix)
- **`TASKS-shared.md`** -- Docs, infra, CI/CD tasks (S-* prefix)
- **`CONTRIBUTING.md`** -- Branch naming, commit conventions, PR workflow
- **`.github/PULL_REQUEST_TEMPLATE.md`** -- PR template with checklists

Task IDs use format `{Component}-P{Priority}-{Number}` (e.g., `P-P1-04`). Reference these in commits and PRs.

## Important Conventions

- Prompts emphasize parallel agent deployment (max 10 per batch)
- Single Record Keeper per wave for coordination
- Positive framing in all instructions ("do X" not "don't do Y")
