# Shadow Clone - Developer Onboarding & Project Scope

**Document Version:** 1.1
**Date:** January 19, 2026
**Author:** Project Lead
**Status:** Repository cleaned - MCP-only architecture

---

## Executive Summary

Shadow Clone is a **prompt engineering orchestration system** that delivers structured macros to AI agents, enabling them to simulate specialized expert teams. This is NOT a prompt injection system - it's an **orchestration framework** that helps users organize, deploy, and manage complex AI workflows through well-structured prompt delivery.

**Key Distinction:** We teach AI how to behave like experts. We don't inject commands - we deliver methodology.

---

## Table of Contents

1. [Project Vision](#project-vision)
2. [Current State](#current-state)
3. [Architecture Overview](#architecture-overview)
4. [What Needs to Be Done](#what-needs-to-be-done)
5. [Security Requirements](#security-requirements)
6. [Future Roadmap](#future-roadmap)
7. [Getting Started](#getting-started)

---

## Project Vision

### Core Purpose

Shadow Clone maximizes the potential of AI agents capable of **parallel agent deployment** (like Claude). The system:

1. **Delivers prompt macros** - Structured instructions that teach AI specialized behaviors
2. **Orchestrates multi-agent workflows** - Coordinates waves of parallel agents
3. **Protects intellectual property** - Prompts are proprietary and must remain secure
4. **Enables scalable AI work** - Users can tackle complex projects through coordinated agent teams
5. **Empowers users to create their own macros** - Users can build, save, and share custom orchestration patterns

### What We Are NOT

- **Not prompt injection** - We don't manipulate AI through hidden commands
- **Not a code execution engine** - MCP tools return instructional text only
- **Not an open-source prompt library** - Our prompts are proprietary IP

### What We ARE

- **An orchestration framework** - Organizing complex AI workflows
- **A methodology delivery system** - Teaching AI professional practices
- **A licensed product** - Access controlled via NFT ownership
- **A prompt protection system** - IP embedded in compiled code, never exposed
- **A platform for user-created macros** - Users can build their own orchestration patterns

### User-Created Macros Vision

A key future feature is allowing users to create, save, and share their own macro commands:

```
Example User Macro:
├── Name: "my-code-review"
├── Description: "My team's code review workflow"
├── Pattern: Based on code_review_team template
├── Customizations:
│   ├── Focus areas: security, performance
│   ├── Output format: JIRA-compatible
│   └── Team-specific standards
└── Sharing: Private to my organization
```

This transforms Shadow Clone from a tool into a **platform** - users don't just consume our macros, they build their own. This creates:
- Stickiness (users invest in building their workflows)
- Network effects (shared macros bring more users)
- Monetization opportunity (marketplace for premium macros)

---

## Current State

### Components Overview

```
shadow-clone/
├── mcp-server/        # THE core system - MCP server for Claude integration
├── docs/              # Documentation
├── .shadow/           # Production prompts reference
└── .shadow-local/     # Creator mode config
```

### What's Working

| Component | Status | Notes |
|-----------|--------|-------|
| MCP Server | Production | v0.2.3 on npm as `@shadow-clone/mcp-server` |
| NFT Authentication | Production | Real-time ownership verification |
| Prompt Delivery | Production | 15+ tools delivering orchestration macros |
| Rate Limiting | Functional | In-memory (needs distributed solution) |
| Obfuscation | Production | Webpack obfuscator for IP protection |

### MCP Server Tools (15 Total)

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
- `authenticate` - API key authentication
- `api_key_status` - Cache diagnostics
- `check_for_updates` - Version checking
- `initialize_workspace` - Create AI instruction files
- `show_commands` - Quick reference

### Authentication Flow (Current)

```
User → API Key → Backend Validation → NFT Ownership Check → Access Granted
                         ↓
              https://api.ignislabs.ai/shadow-clone-licenses/validate
```

- **NFT Collections:** Ignis Elite (777), Pioneer (500), Builder (500), Reserve (223)
- **Total Capacity:** 2,000 licenses
- **Cache:** 1-minute NFT ownership cache, multi-location API key storage
- **Revocation:** Immediate on NFT transfer

---

## Architecture Overview

### Deployment Model (IMPORTANT)

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER'S LOCAL MACHINE                        │
│  ┌─────────────┐      ┌─────────────────────────────────────┐  │
│  │   Claude    │ MCP  │     Shadow Clone MCP Server         │  │
│  │   Desktop   │◄────►│  (installed via npm, runs locally)  │  │
│  └─────────────┘      └──────────────┬──────────────────────┘  │
│                                      │                          │
└──────────────────────────────────────┼──────────────────────────┘
                                       │ HTTPS (auth only)
                                       ▼
                        ┌─────────────────────────────┐
                        │   api.ignislabs.ai          │
                        │   (License Validation API)  │
                        │   - Vercel/Supabase hosted  │
                        │   - Validates API keys      │
                        │   - Checks NFT ownership    │
                        └─────────────────────────────┘
```

**Key Points:**
1. **MCP Server = Local** - Users install via `npm install -g @shadow-clone/mcp-server`, runs on their machine
2. **Backend API = Remote** - Only handles license/NFT validation at `api.ignislabs.ai`
3. **Prompts = Embedded** - All prompts compiled into the npm package, never fetched from API
4. **No hosted MCP** - We don't run MCP servers for users; they run their own

**Current Backend Stack:**
- **Hosting:** Vercel (serverless functions)
- **Database:** Supabase (PostgreSQL)
- **Language:** TypeScript (Next.js API routes)
- **Auth:** API key + NFT ownership verification

**What the Backend Does:**
- `POST /shadow-clone-licenses/validate` - Validates API key, checks NFT ownership
- Returns: `{ valid: true, isActive: true, licenseType: "ignisElite", ... }`

**What the Backend Does NOT Do:**
- Does NOT serve prompts (embedded in MCP server)
- Does NOT run MCP protocol (local only)
- Does NOT store user data beyond license info

### MCP Server Structure

```
mcp-server/src/
├── index.ts                 # Entry point, MCP protocol handlers
├── auth/
│   ├── authService.ts       # NFT license verification
│   ├── apiKeyManager.ts     # Multi-location key caching
│   └── creatorMode.ts       # Local dev bypass
├── tools/
│   ├── combinedTools.ts     # Tool routing
│   ├── embeddedPromptTools.ts # Core orchestration
│   └── modularTools.ts      # Granular tools (1327 lines)
├── prompts/content/         # 17 prompt files (compiled TypeScript)
├── config/production.ts     # Rate limits, security settings
└── utils/
    ├── validation.ts        # Input sanitization
    ├── rateLimiter.ts       # Request throttling
    └── logger.ts            # Sensitive data masking
```

### Prompt Protection Strategy

```
Prompts are:
1. Written as TypeScript files (not .md or .txt)
2. Compiled into the dist bundle
3. Obfuscated in production builds
4. Never stored on user machines as readable files
5. Delivered only after NFT authentication
```

### Data Flow

```
Claude ──MCP──> Shadow Clone Server
                      │
                      ├── Authenticate (API Key + NFT Check)
                      │
                      ├── Tool Request (e.g., deploy_agent_team)
                      │
                      └── Returns: Prompt Macro (instructional text)
                                   ↓
                            Claude follows instructions
                            to simulate expert behavior
```

---

## What's Already Done

The following cleanup has been completed (commit `bf27517`):

- [x] Removed `admin-api/` - Cloudflare Workers (will rebuild self-hosted later)
- [x] Removed `admin-portal/` - Next.js on CF Pages (will rebuild self-hosted later)
- [x] Removed `archive/` - Historical documentation
- [x] Removed VS Code extension references from all docs
- [x] Consolidated to MCP-only architecture
- [x] Updated README, CLAUDE.md, and all documentation

---

## What Needs to Be Done

### Priority 1: Security Hardening (CRITICAL) - YOUR MAIN FOCUS

#### 1.1 API Key Encryption
**Current:** XOR obfuscation (not cryptographically secure)
**Location:** `mcp-server/src/auth/apiKeyManager.ts:327-363`
**Required:** AES-256-GCM encryption via Node.js crypto module

```typescript
// Current (WEAK)
function xorCipher(text: string, key: string): string { ... }

// Needed (STRONG)
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
// Proper AES-256-GCM implementation
```

#### 1.2 Session Management
**Current:** No session invalidation mechanism
**Required:**
- Manual logout/session revocation API
- Session invalidation on security events
- Audit logging for all auth events

#### 1.3 Distributed Rate Limiting
**Current:** In-memory only (won't scale)
**Location:** `mcp-server/src/utils/rateLimiter.ts`
**Required:** Redis-backed rate limiting for production scale

#### 1.4 Input Validation Enhancement
**Current:** Basic validation
**Required:**
- Comprehensive allowlist validation
- Schema validation for all tool inputs
- Enhanced sanitization beyond null bytes

### Priority 2: MCP Integration Hardening

#### 2.1 Lock Down to MCP-Only Access
**Current:** Users can `npx @shadow-clone/mcp-server`
**Goal:** Ensure prompts are ONLY accessible through authenticated MCP protocol
- Review if standalone execution exposes any prompts
- Ensure all tool responses require valid NFT auth

#### 2.2 MCP Integration Documentation
**Required:**
- Step-by-step MCP setup for Claude Desktop
- Configuration examples for all supported clients
- Troubleshooting guide

### Priority 3: Prompt Injection Differentiation

#### 3.1 Rebrand as "Orchestration System"
**Required Updates:**
- All documentation must use "orchestration" language
- Remove any terminology that could imply injection
- Add explicit disclaimers about methodology delivery

#### 3.2 Transparency Features
**Required:**
- Tools should clearly indicate they return "methodology macros"
- Add metadata to responses showing prompt type
- Include user-visible confirmation of what's being delivered

#### 3.3 Compliance Documentation
**Required:**
- Create security whitepaper explaining our approach
- Document how prompts teach methodology (not inject commands)
- Prepare materials for AI safety review

### Priority 4: Testing Infrastructure

#### 4.1 Unit Tests
**Current:** None (`npm test` fails)
**Required:**
- Auth service tests (NFT validation, key caching)
- Tool handler tests (input validation, response format)
- Utility tests (rate limiter, validation, logger)

#### 4.2 Integration Tests
**Required:**
- Full MCP protocol flow tests
- API endpoint tests for admin API
- End-to-end authentication flow

#### 4.3 Security Tests
**Required:**
- Input fuzzing for all tools
- Rate limit bypass attempts
- Auth flow edge cases

---

## Security Requirements

### CSO Review Checklist

The following must be validated by our CSO before production deployment:

#### Authentication & Authorization
- [ ] API key encryption uses AES-256-GCM (not XOR)
- [ ] NFT ownership verification is cryptographically sound
- [ ] Session tokens are properly signed and validated
- [ ] Rate limiting prevents brute force attacks
- [ ] Failed auth attempts are logged and monitored

#### Data Protection
- [ ] Prompts never exposed as plain text files
- [ ] API keys never logged or transmitted in clear text
- [ ] Sensitive data masked in all log outputs
- [ ] File permissions enforced (0o600 for auth files)

#### Network Security
- [ ] All API communication over HTTPS
- [ ] CORS headers properly configured
- [ ] No exposed debug endpoints in production
- [ ] Admin endpoints require wallet signature

#### Code Security
- [ ] Production builds use webpack obfuscation
- [ ] No hard-coded secrets in source code
- [ ] Dependencies audited for vulnerabilities
- [ ] Input validation on all user-provided data

### Threat Model

| Threat | Mitigation | Status |
|--------|------------|--------|
| Prompt extraction | Compiled TypeScript + obfuscation | Implemented |
| API key theft | Encryption at rest | Needs upgrade |
| Unauthorized access | NFT ownership verification | Implemented |
| Rate limit bypass | Distributed rate limiting | Needs implementation |
| Session hijacking | Signed tokens + expiration | Partial |
| Admin impersonation | Wallet signature verification | Implemented |

---

## Future Roadmap

### Phase 1: Security & Stability (Current Focus)
- [ ] Implement AES-256-GCM key encryption
- [ ] Add session management/revocation
- [ ] Distributed rate limiting with Redis
- [ ] Comprehensive test coverage
- [ ] CSO security review and sign-off

### Phase 2: MCP-Native Experience
- [x] Complete VS Code extension deprecation (DONE)
- [ ] MCP-only installation and access
- [ ] Enhanced workspace initialization
- [ ] Improved error messaging and diagnostics

### Phase 3: User-Created Macros (HIGH PRIORITY FEATURE)

This is a key differentiator - letting users create and save their own orchestration macros.

**Core Features:**
- [ ] Allow users to save custom prompt macros
- [ ] Personal macro library storage (cloud-synced)
- [ ] Local macro storage option (for offline/private use)
- [ ] Macro templates based on our existing patterns

**Collaboration Features:**
- [ ] Team/organization macro sharing
- [ ] Version control for macros
- [ ] Fork/remix existing macros

**Future Monetization:**
- [ ] Macro marketplace (users can sell/share macros)
- [ ] Premium macro templates
- [ ] Enterprise macro management

**Technical Considerations:**
- Macros must be validated to prevent actual prompt injection
- User macros should follow our "methodology delivery" pattern
- Consider sandboxing user macros from system prompts
- Storage: Local file vs. cloud API (user preference)

### Phase 4: Scale & Enterprise
- [ ] Enterprise licensing tiers
- [ ] SSO/SAML integration
- [ ] Usage analytics dashboard
- [ ] SLA and support infrastructure
- [ ] Multi-tenant architecture

### Phase 5: Advanced Orchestration
- [ ] Cross-session workflow memory
- [ ] Agent output validation
- [ ] Workflow templates marketplace
- [ ] Integration with external tools
- [ ] Advanced parallel agent coordination

---

## Getting Started

### Development Environment Setup

```bash
# Clone repository
git clone <repo-url>
cd shadow-clone

# MCP Server setup
cd mcp-server
npm install
npm run dev          # Development mode with watch

# Build commands
npm run build        # TypeScript compilation
npm run build:prod   # Production (with obfuscation)
npm run lint         # Type checking
```

### Key Files to Understand

| File | Purpose |
|------|---------|
| `mcp-server/src/index.ts` | Server entry, MCP protocol handling |
| `mcp-server/src/auth/authService.ts` | NFT license verification |
| `mcp-server/src/auth/apiKeyManager.ts` | API key caching and encryption |
| `mcp-server/src/tools/modularTools.ts` | Main tool implementations |
| `mcp-server/src/prompts/content/` | All prompt macros (compiled TypeScript) |

### Authentication Testing

```bash
# Creator mode (local dev bypass)
# Requires .shadow-local/config/creator-mode-enabled.json

# Production authentication
# Use API key from dashboard.ignislabs.ai
```

### API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `https://api.ignislabs.ai/shadow-clone-licenses/validate` | License validation |
| `https://api.ignislabs.ai/shadow-clone-licenses/revoke` | Session revocation |

---

## Contact & Resources

- **Dashboard:** dashboard.ignislabs.ai
- **API Docs:** (to be created)
- **Security Issues:** Report to CSO immediately
- **License:** Proprietary - Ignis AI Labs LLC

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Prompt Macro** | Structured instructions that teach AI specialized behaviors |
| **Orchestration** | Coordinating multiple AI agents for complex tasks |
| **Wave** | A phase of parallel agent deployment |
| **MCP** | Model Context Protocol - Claude's native tool interface |
| **NFT License** | Blockchain-based access control via token ownership |
| **Record Keeper** | Single agent per wave responsible for coordination |

## Appendix B: Security Contact

For security vulnerabilities or concerns, contact the CSO immediately. Do not discuss security issues in public channels.

---

*This document is proprietary and confidential. Do not share outside the development team.*
