# Shadow Clone AI Context

## Project Overview

Shadow Clone is an exclusive AI agent orchestration platform that enables users to deploy teams of specialized AI agents to complete complex software projects. Think of it as having an AI development team that works together to build complete applications, with different agents handling different aspects like architecture, coding, testing, and documentation.

## Key Concepts

### 1. **Agent Orchestration**
- Users describe their project in natural language
- Shadow Clone automatically creates teams of specialized AI agents
- Agents work in "waves" - coordinated phases where different specialists collaborate
- Each agent has a specific role (e.g., Architect, Frontend Dev, Backend Dev, QA, etc.)
- Agents can see each other's work and build upon it

### 2. **Exclusive NFT-Based Licensing Model (2,000 Total Licenses)**
- **777 Ignis Elite NFT Holders**: Complimentary lifetime access
- **500 Pioneer NFTs**: $79/month subscription (free NFT mint, first come first serve)
- **500 Builder NFTs**: $99/month subscription (free NFT mint for verified partners)  
- **223 Reserve NFTs**: $149/month subscription (free NFT mint, limited availability)
- All access controlled via NFT ownership for security
- Partner verification required for Builder tier

### 3. **SaaS Subscription Model**
- Fixed monthly subscriptions (no usage-based pricing)
- NFT holders get free NFT but pay monthly subscription (except Ignis Elite)
- All tiers have full access to Shadow Clone features
- No compute markups - flat subscription pricing

### 4. **Technical Architecture**
- **Frontend**: Next.js 14, TypeScript, TailwindCSS, RainbowKit (Web3)
- **Backend**: Node.js/Express with Prisma ORM
- **Infrastructure**: Cloudflare Workers + R2 (control plane), DigitalOcean (compute)
- **AI Providers**: Claude Code, Claude API, OpenAI API
- **MCP Integration**: Model Context Protocol for file system, git, database access

## Project Structure

```
shadow-clone/
├── .shadow/                    # Shadow Clone mode configurations
│   └── mode_configs/          # Agent role definitions and prompts
├── frontend/                   # Next.js web application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── types/            # TypeScript definitions
│   │   └── hooks/            # Custom React hooks
├── backend/                    # Express API server
│   ├── src/
│   │   ├── api/              # API route handlers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   └── prisma/           # Database schema
├── integration/               # External service integrations
│   └── api/                  # Cloudflare Worker, webhooks
├── docs/                      # Documentation
└── .waves/                    # Agent deliverables directory
    ├── wave-1/               # First wave outputs
    ├── wave-2/               # Second wave outputs
    ├── wave-3/               # Third wave outputs
    └── [final-deliverables]  # Consolidated master documents
```

## Key Files to Understand

1. **`shadow-clone-prompt.md`** - Core orchestration logic (now served via API)
2. **`shadow-clone-licensing-plan.md`** - Complete business model and pricing
3. **`.shadow/mode_configs/`** - Agent role definitions (now served via API)
4. **`backend/prisma/schema.prisma`** - Database structure
5. **`frontend/src/types/index.ts`** - TypeScript interfaces
6. **`vscode-extension/`** - VS Code extension for Shadow Clone
7. **`cloudflare-worker/`** - API serving prompts and handling auth
8. **`DEVELOPMENT_SETUP.md`** - Complete dev environment setup

## Current Implementation Status (Updated 2025-06-27)

### ✅ Completed
- Agent orchestration system with 10-agent deployment limit
- Frontend UI with project creation wizard
- Backend licensing system with 2,000 license limit
- NFT verification for Ignis Elite holders
- Prepaid credit system with auto-termination
- Security hardening (auth, rate limiting, input validation)
- MCP integration design for enhanced agent capabilities
- **VS Code Extension** with authentication and Claude integration
- **Cloudflare Worker API** deployed to https://shadow-clone-api.elijah-02b.workers.dev
- **Prompt Protection System** - Prompts served via API, not local files
- **PromptService** - Fetches and caches prompts with authentication

### 🚧 In Progress
- VS Code extension packaging (works in debug mode, issues with VSIX)
- Stripe payment integration
- Instance management with DigitalOcean
- Real-time execution monitoring
- License marketplace

### 📋 Not Started
- Production deployment
- Blockchain integration for WORK tokens
- Advanced MCP server implementations

### 🔧 Current Development Focus
**VS Code Extension Issues:**
- Extension works perfectly in debug mode (F5 in VS Code)
- Packaged VSIX has activation issues
- Commands are registered but not properly activating
- User moving to VS Code for direct development
- All prompt protection and API integration is complete and working

## Important Business Rules

1. **10 Agent Deployment Limit**: Waves with >10 agents split into sub-waves
2. **Zero Unpaid Compute**: Instances terminate immediately at $0 balance
3. **License Transfers**: $99 fee, 30-day cooldown
4. **NFT Verification**: Periodic re-verification for tier benefits
5. **Wave Folder Organization**: All deliverables organized in `$waves_directory/wave-X/` folders
6. **Agent Isolation**: Each wave works in its own folder to prevent conflicts
7. **Configurable Paths**: Users can set custom `waves_directory` (default: `./.waves/`)

## Security Considerations

- **ENABLE_TEST_CREDITS**: Must be `true` for testing (blocks real credit purchases)
- **Admin endpoints**: Protected by `requireAdmin` middleware
- **API keys**: Hashed with bcrypt before storage
- **Rate limiting**: Strict limits on auth and credit endpoints
- **Auto-termination**: Prevents unpaid compute usage

## Common Tasks

### Testing the System
```bash
cd backend
cp .env.testing .env
npm install
npm run dev
```

### Custom Waves Directory
To use a custom location for deliverables:
```
"Load shadow-clone-prompt.md and execute with waves_directory=/my/project/.waves/"
```

### Adding a New Agent Role
1. Create mode config in `.shadow/mode_configs/`
2. Update deployment limits if needed
3. Test with orchestrator

### Modifying License Tiers
1. Update `backend/prisma/schema.prisma`
2. Modify pricing in `backend/src/services/pricing.service.ts`
3. Update frontend tier displays

## AI Assistant Guidelines

When working on Shadow Clone:
1. **Preserve exclusivity**: Maintain the 2,000 license limit
2. **Security first**: No unpaid compute, proper auth on all endpoints
3. **Agent coordination**: Ensure agents work in proper waves
4. **Wave Folders**: Organize deliverables in `.waves/wave-X/` directories
5. **NFT holders**: Always give Ignis Elite best pricing/benefits
6. **Parallel Deployment**: Deploy all agents in a wave simultaneously (max 10)

## Contact & Support

- **GitHub Issues**: Report bugs and feature requests
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Security**: Review `SECURITY_AUDIT_SUMMARY.md` before changes
- **Testing**: Use `TESTING_GUIDE.md` for QA procedures

Remember: Shadow Clone is about exclusivity, quality, and empowering users to build complex software with AI teams. Every decision should support these core values.

## Development Environment

### API Credentials
- **Cloudflare API Token**: Stored in `/cloudflare-worker/.env`
- **Test API Key**: `test-key-123` (for development)
- **API Endpoint**: https://shadow-clone-api.elijah-02b.workers.dev

### Quick Commands
```bash
# Deploy Cloudflare Worker
cd cloudflare-worker && ./deploy.sh

# Run VS Code Extension in Debug Mode
cd vscode-extension
code .
# Press F5 to launch

# Test API Prompts
curl -X GET https://shadow-clone-api.elijah-02b.workers.dev/api/prompts/shadow-clone \
  -H "X-API-Key: test-key-123"
```