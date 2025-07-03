# Shadow Clone CONSTITUTION
> The Immutable Source of Truth for Shadow Clone Development

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
- **Infrastructure**: Cloudflare Workers + R2 (control plane)
- **AI Providers**: Claude Code, Claude API, OpenAI API
- **MCP Integration**: Model Context Protocol for file system, git, database access
- **VS Code Extension**: Direct integration with Claude Code

## Project Structure

```
shadow-clone/
├── .shadow/                    # Shadow Clone core system files
│   ├── shadow-clone-prompt.md # Main orchestrator prompt
│   ├── agent_rules/           # Agent behavioral protocols
│   ├── coordination_rules/    # System coordination and validation
│   ├── mode_configs/          # Mode-specific configurations
│   ├── execution_phases/      # Step-by-step execution flow
│   ├── templates/             # Project and report templates
│   ├── SYSTEM_ORGANIZATION.md # System organization guide
│   ├── INITIALIZATION_SEQUENCE.md # Startup sequence
│   └── INITIALIZATION_SEQUENCE.md # Startup sequence
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

### Core System Files (in .shadow/)
1. **`shadow-clone-prompt.md`** - Main orchestrator (moved to .shadow/)
2. **`SYSTEM_ORGANIZATION.md`** - Comprehensive system guide
3. **`INITIALIZATION_SEQUENCE.md`** - Mandatory startup sequence
4. **`coordination_rules/file_organization_rules.md`** - Wave-0 and file placement
5. **`coordination_rules/initialization_checklist.md`** - System startup checklist
6. **`coordination_rules/system_validation_rules.md`** - Continuous validation
7. **`coordination_rules/git_commit_protocol.md`** - Git strategy and commit rules
8. **`coordination_rules/constitution_protocol.md`** - Context preservation rules

### Business & Legal
9. **`shadow-clone-licensing-plan.md`** - Complete business model
10. **`LICENSE-PROPRIETARY.md`** - Legal terms ($250k violation penalty)
11. **`IGNIS_API_INTEGRATION.md`** - Complete API documentation

### Implementation
12. **`backend/prisma/schema.prisma`** - Database structure
13. **`cloudflare-worker/`** - API implementation
14. **`vscode-extension/`** - VS Code integration
15. **`IGNIS_API_PROMPT_INTEGRATION.md`** - Ignis API integration guide
16. **`SHADOW_CLONE_API_INTEGRATION_GUIDE.md`** - VS Code extension API guide
17. **`.shadow/SYSTEM_ORGANIZATION.md`** - Complete system architecture
18. **`docs/licensing/LICENSE-PROPRIETARY.md`** - Legal license agreement
19. **`.shadow/coordination_rules/`** - System coordination protocols

## Current Implementation Status (Updated 2025-06-29)

### ✅ Completed
- Agent orchestration system with 10-agent deployment limit
- Frontend UI with project creation wizard
- Backend licensing system with 2,000 license limit
- NFT verification for Ignis Elite holders (Phase 1, 2, and 3)
- Monthly subscription model (pricing TBD for non-Ignis tiers)
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
- **Dashboard Integration** - License claiming UI completed and integrated

### 🚧 In Progress
- Stripe payment integration
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
- ✅ VS Code Extension v0.3.2 with full Ignis API integration

## Ignis Elite NFT License System

### NFT Contracts Verified (ERC-1155)
```javascript
IGNIS_CONTRACTS = {
  PHASE_1: {
    address: '0x42347db440ef412bbe19c0841895a4b98256885b',
    tokenId: 1,
    name: 'Ignis Elite Phase 1',
    type: 'ERC-1155'
  },
  PHASE_2: {
    address: '0x17a2b200cec625b431c3ae7334d2d8ddb41712ce',
    tokenId: 0,
    name: 'Ignis Elite Phase 2',
    type: 'ERC-1155'
  },
  PHASE_3: {
    address: '0xab505a667039d08d8e33cef95c81897a8b5fed1a',
    tokenId: 0,
    name: 'Ignis Elite Phase 3',
    type: 'ERC-1155'
  }
}
```

### Direct Blockchain Verification
- Real-time ownership verification against Ethereum mainnet
- No token ID required from user - system finds owned tokens
- Multi-phase support - checks all three contracts automatically
- Prevents spoofing through direct contract calls

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
2. **Monthly Subscription Model**: Fixed pricing, Ignis Elite NFTs are perpetual licenses
3. **License Transfers**: $99 fee, 30-day cooldown
4. **NFT Verification**: Real-time blockchain verification at claim time
5. **One License Per Wallet**: Prevents duplicate claims
6. **One License Per Email**: Ensures unique user accounts
7. **Wave-0 Mandatory**: ALL projects must complete pre-execution planning in wave-0
8. **Wave Folder Organization**: All deliverables organized in `$waves_directory/wave-X/` folders
9. **File Organization Rules**: Strict enforcement of file placement (see file_organization_rules.md)
10. **Agent Isolation**: Each wave works in its own folder to prevent conflicts
11. **Configurable Paths**: Users can set custom `waves_directory` (default: `./.waves/`)
12. **Source Protection**: All prompts obfuscated in production builds
13. **License Violation Penalty**: $250,000 per violation (see LICENSE-PROPRIETARY.md)

### Agent Coordination System
14. **File Reservation System**: Prevents conflicts between agents working simultaneously
15. **Wave Coordination Protocol**: Enforces proper wave execution sequence
16. **Integration Rules**: Defines how agent deliverables are merged
17. **Quality Gates**: Mandatory checks between waves
18. **Workspace Structure**: Strict enforcement of directory organization

### Git Commit Protocol
19. **NO Commits During Waves**: Agents are forbidden from committing during execution
20. **Single Final Commit**: One atomic commit after all waves complete successfully
21. **Git Strategy Options**: auto, safe_branch, branch, main, none
22. **Commit Message Protocol**: Comprehensive summary of all waves and changes
23. **Quality Required**: Commit only happens after all quality gates pass

## System Architecture & Organization

### Rule Injection Hierarchy
The Shadow Clone system uses a layered rule system for agent behavior:

1. **Core Rules** (Mandatory for ALL agents)
   - Loaded from: `.shadow/agent_rules/core_agent_rules.md`
   - Includes: File organization, quality standards, coordination protocols
   
2. **Role-Specific Rules**
   - Loaded from: `.shadow/agent_rules/{role}_agent_rules.md`
   - Applies role-specific behaviors and responsibilities
   
3. **Mode Configuration**
   - Loaded from: `.shadow/mode_configs/shadow-clone-{mode}.md`
   - Defines mode objectives, wave structure, deliverables
   
4. **Coordination Rules**
   - Loaded from: `.shadow/coordination_rules/`
   - Enforces system-wide coordination and validation

### Wave-0 Enforcement System
**CRITICAL**: All projects MUST complete wave-0 planning before ANY implementation

Required Wave-0 deliverables in `.waves/wave-0/`:
- `project_analysis.md` - Project understanding
- `requirements.md` - Extracted requirements  
- `architecture_plan.md` - High-level design
- `team_formation.md` - Agent role assignments
- `wave_plan.md` - Execution strategy
- `risk_assessment.md` - Risk analysis
- `setup_complete.md` - Completion checkpoint

Mode-specific additions:
- **Feature Mode**: feature_analysis.md, impact_assessment.md, security_review.md
- **Debug Mode**: issue_analysis.md, root_cause_analysis.md, debug_strategy.md
- **Audit Mode**: audit_scope.md, vulnerability_analysis.md, security_frameworks.md
- **Plan Mode**: MASTER_PLAN.md (comprehensive project blueprint)

### Quality Enforcement Mechanisms
1. Pre-execution validation of wave-0 completion
2. File placement validation per file_organization_rules.md
3. Agent compliance monitoring via file reservation system
4. Post-wave quality gates before progression

## Security Considerations

- **API Authentication**: All endpoints require valid Shadow Clone license
- **Admin endpoints**: Protected by `requireAdmin` middleware
- **API keys**: Hashed with bcrypt before storage
- **Rate limiting**: Strict limits on auth and credit endpoints
- **Auto-termination**: Prevents unpaid compute usage
- **Prompt Protection**: All prompts served via authenticated API
- **NFT Verification**: Direct blockchain calls prevent spoofing
- **CORS Configuration**: Allows dashboard integration

### License Enforcement & Legal
- **License Agreement**: Proprietary software under Ignis AI Labs LLC license
- **Violations**: $250,000 liquidated damages per violation
- **Jurisdiction**: Puerto Rico (Ignis AI Labs LLC)
- **Enforcement**: Immediate termination, legal action, no refunds
- **Monitoring**: Usage auditing and compliance monitoring enabled
- **Contact**: legal@shadowclone.ai, abuse@shadowclone.ai

### Extension Protection Mechanisms
- **Obfuscation**: Heavy code obfuscation in production builds
- **String Encryption**: All strings encrypted with rotation
- **Control Flow**: Flattened control flow with dead code injection
- **Debug Protection**: Anti-debugging measures enabled
- **Self-Defending**: Code integrity verification
- **Build Commands**:
  - Development: `npm run compile`
  - Production: `npm run build:prod`
  - Verify: `npm run verify:obfuscation`

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

## Ignis API Integration

### API Endpoints
- **Base URL**: https://api.ignislabs.ai
- **Authentication**: X-API-Key header required
- **Content-Type**: application/json

### Key Endpoints
- **License Validation**: POST /shadow-clone-licenses/validate
- **License Status**: GET /shadow_clone_licenses
- **Telemetry**: POST /telemetry/events (for usage tracking)

### Integration Flow
1. User enters API key in VS Code
2. Extension validates key with Ignis API
3. Successful validation stores encrypted key
4. 30-minute auto-refresh of license status
5. All Shadow Clone operations require valid license

## System Architecture Details

### Rule Injection Hierarchy
1. **Core Rules** → All agents get core_agent_rules.md
2. **Role Rules** → Specific to agent role (dev, qa, etc.)
3. **Mode Rules** → Based on project mode (feature, debug, etc.)
4. **Coordination Rules** → Wave execution and file organization

### Wave-0 Enforcement
- Creates `.waves/wave-0/` automatically
- Blocks implementation until planning complete
- Required files: project_analysis.md, requirements.md, etc.
- Validated before wave-1 can begin

### File Reservation System
- Prevents file conflicts between agents
- Tracked in `.waves/file_reservations.md`
- Only reserved agent can modify file
- Automatic release on completion

### Quality Gate System
- Pre-wave validation checks
- Post-wave deliverable verification
- Continuous compliance monitoring
- Automatic rollback on failures

## Constitution Principles

### Context is Sacred
Every decision, implementation detail, and lesson learned must be preserved in this CONSTITUTION. Context loss is the enemy of progress.

### Project Constitutions Mirror This One
When Shadow Clone creates projects for users, it creates a CONSTITUTION.md in their `.waves/` directory that follows the same structure and principles as this file.

### Constitution Updates Are Mandatory
1. **Update CONSTITUTION.md**: After every work session
2. **Preserve exclusivity**: Maintain the 2,000 license limit
3. **Security first**: No unpaid compute, proper auth on all endpoints
4. **Agent coordination**: Ensure agents work in proper waves
5. **Wave Folders**: Organize deliverables in `.waves/wave-X/` directories
6. **NFT holders**: Always give Ignis Elite best pricing/benefits
7. **Parallel Deployment**: Deploy all agents in a wave simultaneously (max 10)
8. **Legal Compliance**: Respect proprietary license terms
9. **Record Keeper Role**: Every project must have a Record Keeper agent maintaining the constitution

## Shadow Clone API Integration

### Prompts API Endpoints (api.ignislabs.ai)
All endpoints require authentication header: `X-API-Key: sc-{64-character-license-key}`

#### Main Endpoints
- `GET /api/prompts/shadow-clone` - Main orchestration prompt
- `GET /api/prompts/modes` - List available modes (audit, debug, feature, optimize, refactor, research, plan)
- `GET /api/prompts/modes/:mode` - Get specific mode configuration
- `GET /api/prompts/agent-rules/:role` - Get agent behavioral rules
- `GET /api/prompts/coordination-rules` - List coordination rules
- `GET /api/prompts/coordination-rules/:rule` - Get specific coordination rule
- `GET /api/prompts/templates/:template` - Get system templates
- `GET /api/prompts/execution-phases/:phase` - Get execution phase details

#### Available Resources
- **Agent Roles**: core_agent_rules, development_agent_rules, qa_agent_rules, devops_agent_rules, security_agent_rules, documentation_agent_rules, team_lead_rules, audit_agent_rules, research_agent_rules, planning_agent_rules
- **Coordination Rules**: wave_coordination, integration_rules, quality_gates, mode_operations, workspace_structure, file_organization_rules, initialization_checklist, system_validation_rules
- **Templates**: agent_templates, team_templates, wave-execution-plan-template, security-audit-report-template, master-project-plan-template, planning-consolidation-template, vulnerability-report-template, risk-assessment-matrix-template, compliance-matrix-template, remediation-roadmap-template, quality-assurance-report-template, false-positive-analysis-template, automated-scan-results-template
- **Execution Phases**: phase1_analysis through phase7_quality, wave_execution_protocol

#### Error Responses
- 401: Missing or invalid API key
- 404: Resource not found (includes available options)
- 500: Server error

## System Templates

The following templates are available via the API for agent use:

### Planning Templates
- `master-project-plan-template` - Overall project planning for MASTER_PLAN creation
- `wave-execution-plan-template` - Wave-specific planning
- `planning-consolidation-template` - Multi-wave consolidation

### Security Templates  
- `security-audit-report-template` - Security audit reports
- `vulnerability-report-template` - Vulnerability documentation
- `risk-assessment-matrix-template` - Risk analysis
- `compliance-matrix-template` - Compliance tracking
- `remediation-roadmap-template` - Fix planning

### Quality Templates
- `quality-assurance-report-template` - QA reports
- `false-positive-analysis-template` - False positive tracking
- `automated-scan-results-template` - Scan result formatting

## Contact & Support

- **Support Email**: support@shadow-clone.ai
- **License Inquiries**: license@shadow-clone.ai
- **Legal Contact**: legal@shadowclone.ai, abuse@shadowclone.ai
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Security**: Review `SECURITY_AUDIT_SUMMARY.md` before changes
- **Testing**: Use `TESTING_GUIDE.md` for QA procedures

Remember: Shadow Clone is about exclusivity, quality, and empowering users to build complex software with AI teams. Every decision should support these core values.

## User Project Constitution System

### Automatic Constitution Creation
When Shadow Clone starts a new project, it automatically creates:
```
{waves_directory}/
├── CONSTITUTION.md          # Project's immutable source of truth
├── wave-0/
│   └── constitution_init.md # Initial context capture
└── ...
```

### Constitution Structure for User Projects
The project CONSTITUTION.md includes:
1. **Project Identity**: Name, purpose, goals
2. **Technical Stack**: Languages, frameworks, dependencies
3. **Architectural Decisions**: Design choices and rationale
4. **Progress History**: What each wave accomplished
5. **Context Updates**: Continuous learning and adjustments
6. **Future Roadmap**: Next steps and considerations

### Record Keeper Agent
Every Shadow Clone project includes a Record Keeper agent who:
- Maintains the project's CONSTITUTION.md
- Collects updates from all agents in the wave
- Ensures context is never lost between waves
- Enables seamless resume functionality
- Validates constitution integrity

### Resume Mode Integration
The constitution in `.waves/CONSTITUTION.md` enables:
- Perfect project state restoration
- Context-aware agent initialization
- Continuation from exact stopping point
- No repeated work or lost decisions

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

## Recent Updates

### 2025-07-03
1. **CONSTITUTION System**: Replaced AI_CONTEXT.md with comprehensive context preservation
2. **Record Keeper Agent**: New mandatory role for maintaining project constitutions
3. **Git Commit Protocol**: Implemented single-commit-after-final-wave strategy
4. **Git Strategy Documentation**: Fully documented all git strategy options
5. **Validation Enhancement**: Added git commit enforcement to system validation

### 2025-06-29
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

### Automatic License Management (v0.1.9+)
- **30-Minute Auto-Refresh**: License status checked every 30 minutes
- **Smart Caching**: Reduces API calls while maintaining accuracy
- **Status Notifications**: Alerts on license status changes
- **Manual Refresh**: "Shadow Clone: Refresh License Status" command
- **Fallback Mechanism**: Alternative endpoints for reliability
- **LicenseStatusManager**: Centralized service for all license operations
- **Startup Verification**: Validates license on VS Code startup with progress indicator

## Next Steps

1. **VS Code Extension**: Continue enhancing features and integrations
2. **Payment System**: Complete Stripe integration for non-Ignis tiers
3. **Agent Deployment**: Finalize compute infrastructure automation
4. **Production Launch**: Deploy to production environment
5. **Marketing Site**: Launch public-facing website with NFT minting