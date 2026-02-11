# Shadow Clone - Developer Onboarding & Project Scope

**Document Version:** 3.0
**Date:** February 2026
**Author:** Project Lead
**Status:** Open-source pivot - MCP-only architecture

---

## Executive Summary

Shadow Clone is a **free, open-source prompt engineering orchestration system** that delivers structured macros to AI agents, enabling them to simulate specialized expert teams. This is NOT a prompt injection system - it's an **orchestration framework** that helps users organize, deploy, and manage complex AI workflows through well-structured prompt delivery.

**Key Distinction:** We teach AI how to behave like experts. We don't inject commands - we deliver methodology.

> **New here?** Start with [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch conventions and PR workflow, and [`TASKS.md`](TASKS.md) for the prioritized task list with dependencies.

---

## Table of Contents

1. [Project Vision](#project-vision)
2. [Current State](#current-state)
3. [Architecture Overview](#architecture-overview)
4. [What Needs to Be Done](#what-needs-to-be-done)
5. [Future Roadmap](#future-roadmap)
6. [Getting Started](#getting-started)

---

## Project Vision

### Core Purpose

Shadow Clone maximizes the potential of AI agents capable of **parallel agent deployment** (like Claude). The system:

1. **Delivers prompt macros** - Structured instructions that teach AI specialized behaviors
2. **Orchestrates multi-agent workflows** - Coordinates waves of parallel agents
3. **Enables scalable AI work** - Users can tackle complex projects through coordinated agent teams
4. **Empowers users to create their own macros** - Users can build, save, and share custom orchestration patterns

### What We Are NOT

- **Not prompt injection** - We don't manipulate AI through hidden commands
- **Not a code execution engine** - MCP tools return instructional text only

### What We ARE

- **An orchestration framework** - Organizing complex AI workflows
- **A methodology delivery system** - Teaching AI professional practices
- **A free, open-source tool** - Available to everyone
- **A platform for user-created macros** - Users can build their own orchestration patterns

---

## Current State

### Components Overview

```
shadow-clone/
├── mcp-server/        # THE core system - MCP server for Claude integration
├── docs/              # Documentation
└── .shadow/           # Prompt source reference
```

### What's Working

| Component | Status | Notes |
|-----------|--------|-------|
| MCP Server | Production | v0.2.3 on npm as `@shadow-clone/mcp-server` |
| Prompt Delivery | Production | 13 tools delivering orchestration macros |
| Rate Limiting | Functional | In-memory rate limiting for abuse prevention |
| Input Validation | Functional | Basic validation and sanitization |

### MCP Server Tools (13 Total)

**Orchestration:**
- `shadow_clone_orchestrate` - Full multi-wave project execution
- `shadow_clone_plan` - Project planning methodology

**Teams:**
- `deploy_agent_team` - Deploy specialized teams (frontend, backend, database, etc.)
- `deploy_specialist_agent` - Deploy individual experts (react_expert, api_designer, etc.)

**Rapid Operations:**
- `quick_fix` - Targeted problem-solving
- `code_review_team` - Professional code reviews
- `generate_tests` - Test generation methodology
- `execute_single_wave` - Focused wave execution

**Documentation:**
- `create_documentation` - Professional documentation
- `architecture_consultant` - Design analysis

**Utility:**
- `check_for_updates` - Version checking
- `initialize_workspace` - Create AI instruction files
- `show_commands` - Quick reference

---

## Architecture Overview

### Deployment Model

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER'S LOCAL MACHINE                        │
│  ┌─────────────┐      ┌─────────────────────────────────────┐  │
│  │   Claude    │ MCP  │     Shadow Clone MCP Server         │  │
│  │   Desktop   │◄────►│  (installed via npm, runs locally)  │  │
│  └─────────────┘      └─────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Key Points:**
1. **MCP Server = Local** - Users install via `npm install -g @shadow-clone/mcp-server`, runs on their machine
2. **Prompts = Embedded** - All prompts compiled into the npm package
3. **No hosted MCP** - We don't run MCP servers for users; they run their own
4. **No authentication** - Free and open-source, no API keys needed

### MCP Server Structure

```
mcp-server/src/
├── index.ts                 # Entry point, MCP protocol handlers
├── auth/
│   └── encryption.ts        # General-purpose AES-256-GCM utility
├── tools/
│   ├── combinedTools.ts     # Tool routing
│   ├── embeddedPromptTools.ts # Core orchestration
│   ├── modularTools.ts      # Granular tools
│   ├── updateChecker.ts     # Version checking
│   └── workspaceInitializer.ts # Workspace setup
├── prompts/content/         # Prompt files (compiled TypeScript)
├── config/production.ts     # Rate limits, settings
└── utils/
    ├── validation.ts        # Input sanitization
    ├── rateLimiter.ts       # Request throttling
    ├── monitoring.ts        # Health monitoring
    └── logger.ts            # Logging with data masking
```

### Data Flow

```
Claude ──MCP──> Shadow Clone Server
                      │
                      ├── Tool Request (e.g., deploy_agent_team)
                      │
                      └── Returns: Prompt Macro (instructional text)
                                   ↓
                            Claude follows instructions
                            to simulate expert behavior
```

---

## What Needs to Be Done

### Priority 1: Input Validation (from PR #9)

#### 1.1 Zod Schema Validation
- Comprehensive schema validation for all tool inputs
- Enhanced sanitization beyond null bytes
- Clear error messages for invalid inputs

### Priority 2: Testing Infrastructure

#### 2.1 Unit Tests
**Current:** Minimal test coverage
**Required:**
- Tool handler tests (input validation, response format)
- Utility tests (rate limiter, validation, logger)

#### 2.2 Integration Tests
**Required:**
- Full MCP protocol flow tests
- End-to-end tool execution

### Priority 3: CI Pipeline

- Build + lint on PRs
- Test execution
- Code coverage reporting

### Priority 4: Documentation & Community

- Improve prompt quality and coverage
- Community contribution guidelines for new prompts
- Examples and tutorials

---

## Future Roadmap

### Phase 1: Quality & Stability (Current Focus)
- [ ] Zod schema validation for all tool inputs
- [ ] Comprehensive test coverage
- [ ] CI pipeline with automated checks
- [ ] Improved error messaging

### Phase 2: Community & Contributions
- [ ] Contribution guide for new prompts
- [ ] Prompt quality standards documentation
- [ ] Example workflows and tutorials

### Phase 3: User-Created Macros
- [ ] Allow users to save custom prompt macros
- [ ] Local macro storage
- [ ] Macro templates based on existing patterns
- [ ] Sharing and collaboration features

### Phase 4: Advanced Orchestration
- [ ] Cross-session workflow memory
- [ ] Agent output validation
- [ ] Workflow templates
- [ ] Integration with external tools

---

## Getting Started

### Development Environment Setup

```bash
# Clone repository and switch to dev branch
git clone https://github.com/ElijahMoses/shadow-clone.git
cd shadow-clone
git checkout dev

# MCP Server setup
cd mcp-server
npm install
npm run dev          # Development mode with watch

# Build commands
npm run build        # TypeScript compilation
npm run lint         # Type checking
```

> See [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch naming, commit conventions, and the full PR workflow.

### Key Files to Understand

| File | Purpose |
|------|---------|
| `mcp-server/src/index.ts` | Server entry, MCP protocol handling |
| `mcp-server/src/tools/combinedTools.ts` | Tool routing |
| `mcp-server/src/tools/modularTools.ts` | Main tool implementations |
| `mcp-server/src/prompts/content/` | All prompt macros (compiled TypeScript) |

### Testing Your Changes

```bash
cd mcp-server
npm run build     # Must succeed
npm run lint      # Must pass
npm test          # Run tests
```

---

## Glossary

| Term | Definition |
|------|------------|
| **Prompt Macro** | Structured instructions that teach AI specialized behaviors |
| **Orchestration** | Coordinating multiple AI agents for complex tasks |
| **Wave** | A phase of parallel agent deployment |
| **MCP** | Model Context Protocol - Claude's native tool interface |
| **Record Keeper** | Single agent per wave responsible for coordination |

---

*This project is open-source. See [LICENSE](LICENSE) for terms. Contributions welcome!*
