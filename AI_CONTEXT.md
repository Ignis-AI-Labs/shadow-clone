# Shadow Clone AI Context

## Project Overview

Shadow Clone is an exclusive AI agent orchestration platform that enables users to deploy teams of specialized AI agents to complete complex software projects. Think of it as having an AI development team that works together to build complete applications, with different agents handling different aspects like architecture, coding, testing, and documentation.

**Company**: Ignis AI Labs LLC (Puerto Rico)

## Key Concepts

### 1. **Agent Orchestration**
- Users describe their project in natural language
- Shadow Clone automatically creates teams of specialized AI agents
- Agents work in "waves" - coordinated phases where different specialists collaborate
- Each agent has a specific role (e.g., Architect, Frontend Dev, Backend Dev, QA, etc.)
- Agents can see each other's work and build upon it
- Maximum 10 agents per wave (system splits larger teams into sub-waves)

### 2. **Exclusive NFT-Based Licensing Model (2,000 Total Licenses)**
- **777 Ignis Elite NFT Holders**: Complimentary lifetime access (Phase 1, 2, and 3)
- **500 Pioneer NFTs**: Subscription pricing TBD (free NFT mint, first come first serve)
- **500 Builder NFTs**: Subscription pricing TBD (free NFT mint for verified partners)  
- **223 Reserve NFTs**: Subscription pricing TBD (free NFT mint, limited availability)
- All access controlled via NFT ownership for security
- Partner verification required for Builder tier

### 3. **SaaS Subscription Model**
- Fixed monthly subscriptions (pricing TBD for non-Ignis tiers)
- NFT holders get free NFT but pay monthly subscription (except Ignis Elite)
- All tiers have full access to Shadow Clone features
- No compute markups - flat subscription pricing
- Prepaid credit system for compute resources

### 4. **Technical Architecture**
- **Frontend**: Next.js 14, TypeScript, TailwindCSS, RainbowKit (Web3)
- **Backend**: Node.js/Express with Prisma ORM
- **Infrastructure**: Cloudflare Workers + R2 (control plane), DigitalOcean (compute)
- **AI Providers**: Claude Code, Claude API, OpenAI API
- **MCP Integration**: Model Context Protocol for file system, git, database access
- **VS Code Extension**: Direct integration with Claude Code

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
├── cloudflare-worker/         # Prompt API & NFT verification
│   ├── src/
│   │   ├── prompts/          # Protected prompts
│   │   ├── utils/            # NFT verification logic
│   │   └── index.ts          # Worker entry point
├── vscode-extension/          # VS Code integration
│   ├── src/
│   │   ├── commands/         # Extension commands
│   │   ├── providers/        # View providers
│   │   └── services/         # API integration
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
3. **`.shadow/SYSTEM_ORGANIZATION.md`** - Comprehensive system organization guide
4. **`.shadow/coordination_rules/file_organization_rules.md`** - MANDATORY file placement rules
5. **`.shadow/mode_configs/`** - Agent role definitions (now served via API)
6. **`backend/prisma/schema.prisma`** - Database structure
7. **`frontend/src/types/index.ts`** - TypeScript interfaces
8. **`vscode-extension/`** - VS Code extension for Shadow Clone
9. **`cloudflare-worker/`** - API serving prompts and handling auth
10. **`DEVELOPMENT_SETUP.md`** - Complete dev environment setup

## Current Implementation Status (Updated 2025-06-29)

### ✅ Completed
- Agent orchestration system with 10-agent deployment limit
- Frontend UI with project creation wizard
- Backend licensing system with 2,000 license limit
- NFT verification for Ignis Elite holders (Phase 1, 2, and 3)
- Prepaid credit system with auto-termination
- Security hardening (auth, rate limiting, input validation)
- MCP integration design for enhanced agent capabilities
- **VS Code Extension v0.2.0** with authentication, Claude integration, and automatic license verification
- **Cloudflare Worker API** deployed to https://shadow-clone-api.elijah-02b.workers.dev
- **Prompt Protection System** - Prompts served via API, not local files
- **PromptService** - Fetches and caches prompts with authentication
- **Blockchain NFT Verification** - Direct on-chain verification for Ignis Elite
- **License Claiming System** - API endpoints for NFT holders to claim licenses
- **Automatic License Refresh** - 30-minute automatic status checks
- **Startup License Verification** - Validates license on VS Code startup
- **Complete Test Credential Removal** - Enhanced security with no hardcoded credentials

### 🚧 In Progress
- Dashboard integration for license claiming
- Stripe payment integration
- Instance management with DigitalOcean
- Real-time execution monitoring
- License marketplace

### 📋 Not Started
- Production deployment
- Blockchain integration for WORK tokens
- Advanced MCP server implementations

### 🔧 Current Development Focus
**VS Code Extension Enhancements:**
- ✅ Implemented automatic 30-minute license status refresh
- ✅ Added startup license verification with progress indicator
- ✅ Migrated to Ignis Dashboard API (api.ignislabs.ai)
- ✅ Removed all test credentials for enhanced security
- ✅ Created LicenseStatusManager service for centralized license handling
- 🚧 Addressing VSIX packaging issues (extension works in debug mode)

## Ignis Elite NFT License System

### NFT Contracts Verified
```javascript
IGNIS_CONTRACTS = {
  PHASE_1: {
    address: '0x42347db440ef412bbe19c0841895a4b98256885b',
    tokenId: 1,
    name: 'Ignis Elite Phase 1'
  },
  PHASE_2: {
    address: '0x17a2b200cec625b431c3ae7334d2d8ddb41712ce',
    tokenId: 0,
    name: 'Ignis Elite Phase 2'
  },
  PHASE_3: {
    address: '0xab505a667039d08d8e33cef95c81897a8b5fed1a',
    tokenId: 0,
    name: 'Ignis Elite Phase 3'
  }
}
```

### License Claiming API
- **Check Ownership**: `GET /api/license/check/ignis?wallet={address}`
- **Claim License**: `POST /api/license/claim/ignis`
- **Get Availability**: `GET /api/license/availability`

### Storage Structure (Cloudflare KV)
- `license:{licenseId}` → Full license object
- `license:wallet:{walletAddress}` → License claim record
- `license:email:{email}` → License ID mapping
- `license:nft:{contract}:{tokenId}` → NFT claim record
- `license:count:{licenseType}` → Usage counter

## Important Business Rules

1. **10 Agent Deployment Limit**: Waves with >10 agents split into sub-waves
2. **Zero Unpaid Compute**: Instances terminate immediately at $0 balance
3. **License Transfers**: $99 fee, 30-day cooldown
4. **NFT Verification**: Real-time blockchain verification at claim time
5. **One License Per Wallet**: Prevents duplicate claims
6. **One License Per Email**: Ensures unique user accounts
7. **Wave-0 Mandatory**: ALL projects must complete pre-execution planning in wave-0
8. **Wave Folder Organization**: All deliverables organized in `$waves_directory/wave-X/` folders
9. **File Organization Rules**: Strict enforcement of file placement (see file_organization_rules.md)
10. **Agent Isolation**: Each wave works in its own folder to prevent conflicts
11. **Configurable Paths**: Users can set custom `waves_directory` (default: `./.waves/`)

## Security Considerations

- **ENABLE_TEST_CREDITS**: Must be `true` for testing (blocks real credit purchases)
- **Admin endpoints**: Protected by `requireAdmin` middleware
- **API keys**: Hashed with bcrypt before storage
- **Rate limiting**: Strict limits on auth and credit endpoints
- **Auto-termination**: Prevents unpaid compute usage
- **Prompt Protection**: All prompts served via authenticated API
- **NFT Verification**: Direct blockchain calls prevent spoofing
- **CORS Configuration**: Allows dashboard integration

## Common Tasks

### Testing the System
```bash
cd backend
cp .env.testing .env
npm install
npm run dev
```

### Deploy Cloudflare Worker
```bash
cd cloudflare-worker
./deploy.sh
```

### Run VS Code Extension in Debug Mode
```bash
cd vscode-extension
code .
# Press F5 to launch
```

### Test NFT License Claiming
```bash
# Check NFT ownership
curl -X GET "https://shadow-clone-api.elijah-02b.workers.dev/api/license/check/ignis?wallet=0xYourWalletAddress"

# Claim license
curl -X POST https://shadow-clone-api.elijah-02b.workers.dev/api/license/claim/ignis \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0xYourWalletAddress",
    "email": "holder@example.com"
  }'
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

- **Support Email**: support@shadow-clone.ai
- **License Inquiries**: license@shadow-clone.ai
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Security**: Review `SECURITY_AUDIT_SUMMARY.md` before changes
- **Testing**: Use `TESTING_GUIDE.md` for QA procedures

Remember: Shadow Clone is about exclusivity, quality, and empowering users to build complex software with AI teams. Every decision should support these core values.

## Development Environment

### API Credentials
- **API Endpoint**: https://api.ignislabs.ai (production)
- **Authentication**: All API keys managed through Ignis Dashboard
- **Old Worker**: https://shadow-clone-api.elijah-02b.workers.dev (deprecated, to be removed)
- **License Endpoints**: 
  - Validation: POST /shadow-clone-licenses/validate
  - Status: GET /shadow_clone_licenses
- **No Test Credentials**: All hardcoded test keys have been removed

### Quick Commands
```bash
# Run VS Code Extension in Debug Mode
cd vscode-extension
code .
# Press F5 to launch

# Package VS Code Extension
cd vscode-extension
npm run package
# Creates shadow-clone-0.2.0.vsix

# Test API (requires valid API key from Ignis dashboard)
curl -X POST https://api.ignislabs.ai/shadow-clone-licenses/validate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"apiKey": "YOUR_API_KEY"}'

# Build Frontend
cd frontend
npm run build

# Run Backend
cd backend
npm run dev
```

## Recent Updates (2025-06-29)

1. **License System**: Updated to Ignis AI Labs LLC (Puerto Rico)
2. **VS Code Extension**: Version 0.2.0 with automatic license verification
3. **API Migration**: Complete migration from Cloudflare Worker to Ignis Dashboard API
4. **Security Enhancement**: Removed all test credentials (test-key-123, test-user-123)
5. **License Status Management**: Automatic 30-minute refresh and startup verification
6. **Repository Links**: Removed from public-facing packages for security
7. **Documentation**: Reorganized all MD files into structured /docs directory

## VS Code Extension Version History

- **v0.2.0** (2025-06-29) - Startup license check + 30-min auto-refresh, LicenseStatusManager service
- **v0.1.9** - Fixed license status sync issues
- **v0.1.8** - Updated API endpoints for Ignis Dashboard
- **v0.1.7** - Ignis Dashboard API integration
- **v0.1.6** - Security updates, removed test credentials
- **v0.1.5** - License type updates (tripleOG, doubleOG, singleOG, ignisElite)
- **v0.1.4** - Updated to Ignis AI Labs LLC
- **v0.1.3** - Initial public release

## Next Steps

1. **VS Code Extension**: Resolve VSIX packaging issues (works in debug mode)
2. **Dashboard NFT Integration**: Implement the license claiming UI in the main dashboard
3. **Payment Processing**: Complete Stripe integration for non-Ignis tiers
4. **Instance Management**: Finalize DigitalOcean deployment automation
5. **Production Launch**: Deploy to production environment
6. **Marketing Site**: Launch public-facing website with NFT minting