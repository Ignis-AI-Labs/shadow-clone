# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shadow Clone is an AI orchestration system that delivers prompt engineering macros to enhance AI capabilities. It consists of two main components:

1. **MCP Server** (`mcp-server/`) - Model Context Protocol server for native Claude integration. Delivers structured prompts that teach AIs how to simulate specialized agent behaviors.

2. **VS Code Extension** (`vscode-extension/`) - GUI interface for deploying AI agents and managing Claude sessions.

Key concept: This is a **prompt delivery system**, not an execution engine. The MCP server returns instructional prompts that the receiving AI then follows.

## Build Commands

### MCP Server
```bash
cd mcp-server
npm install
npm run build              # TypeScript compilation
npm run build:prod         # Full production build (clean + build + obfuscate)
npm run dev                # Development mode with watch
npm run lint               # Type checking (tsc --noEmit)
```

### VS Code Extension
```bash
cd vscode-extension
npm install
npm run compile            # TypeScript compilation
npm run build:dev          # Webpack development build
npm run build:prod         # Webpack production build (obfuscated)
npm run package            # Create .vsix file
npm run lint               # ESLint
```

## Architecture

### MCP Server Structure
- `src/index.ts` - Server entry point, MCP protocol handlers, authentication flow
- `src/tools/combinedTools.ts` - Routes tool calls to appropriate handler classes
- `src/tools/embeddedPromptTools.ts` - Core orchestration tools (shadow_clone_orchestrate, shadow_clone_plan)
- `src/tools/modularTools.ts` - Granular tools (quick_fix, code_review_team, generate_tests, etc.)
- `src/auth/authService.ts` - API key validation and NFT license verification
- `src/prompts/` - Embedded prompt content (compiled into TypeScript)

### VS Code Extension Structure
- `src/extension.ts` - Extension activation, command registration, provider setup
- `src/commands/` - Command implementations (authenticate, launchClaude, modularCommands, etc.)
- `src/providers/` - Tree view providers (macroProvider, claudeSessionProvider)
- `src/services/` - Business logic (licenseStatusManager, securityTelemetry, dependencyChecker)
- `src/auth/authProvider.ts` - VS Code-side authentication with API key caching

### Tool Categories
The MCP server exposes tools that return prompt engineering macros:
- **Orchestration**: `shadow_clone_orchestrate`, `shadow_clone_plan` - Full multi-wave project execution
- **Teams**: `deploy_agent_team`, `deploy_specialist_agent` - Deploy focused expert teams
- **Rapid**: `quick_fix`, `code_review_team`, `generate_tests` - Quick targeted operations
- **Utility**: `initialize_workspace`, `api_key_status`, `check_for_updates`

### Authentication Flow
Both components use the same API endpoint (api.ignislabs.ai):
1. User provides API key
2. Key validated against backend
3. NFT license ownership verified
4. 24-hour session cached locally

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

MCP Server has no automated tests currently (`npm test` exits with error).

VS Code Extension:
```bash
npm run pretest   # Compile + lint
npm run test      # Run test suite
```

## Important Conventions

- Prompts emphasize parallel agent deployment (max 10 per batch)
- Single Record Keeper per wave for coordination
- Positive framing in all instructions ("do X" not "don't do Y")
- Production builds use webpack obfuscation for IP protection
