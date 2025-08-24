# Shadow Clone MCP Server Changelog

## [0.4.1] - 2024-12-19

### Added
- 🚀 **Workspace Initialization Tool**: `initialize_workspace` - Creates AI instruction files in projects
  - Automatically generates CLAUDE.md, .ai/instructions.md, .github/copilot-instructions.md
  - Embeds Shadow Clone documentation directly in workspaces
  - Ensures all AI assistants understand Shadow Clone commands
  - Returns instructions for AI to follow (no direct file operations)
- 📊 **API Key Status Tool**: `api_key_status` - Check authentication and cache status
  - Shows current authentication state
  - Displays all cache storage locations and their status
  - Indicates if Creator Mode is active
  - Provides helpful setup instructions

### Changed
- 📝 Both new tools follow the prompt engineering macro pattern
- 🎯 Clear documentation that tools return instructions, not execute operations

## [0.4.0] - 2024-12-19

### Added
- 🚀 **Creator Mode**: Privileged local mode for Shadow Clone creator
  - Automatic detection via `.shadow-local/creator-config.json`
  - Complete authentication bypass for creator
  - UNLIMITED license type with all features enabled
  - Works offline without API calls
- 🔑 **API Key Caching System**: Multi-tier storage for convenience
  - Environment variables (highest priority)
  - Local .env files (auto-gitignored)
  - Global config (~/.shadow-clone/config.json)
  - Memory cache for session persistence
  - Automatic revalidation every 5 minutes
- 📊 **New Tool**: `api_key_status` - Check cache status and storage locations
- ⚡ **Global Command Access**: Shadow Clone commands available system-wide
  - `shadow` - Main command
  - `sfix` - Quick fix shortcut
  - `stest` - Test generator shortcut
  - `sreview` - Code review shortcut

### Changed
- 📝 All tool descriptions now explicitly state "NO code execution"
- 🎯 Prompts include clear disclaimers about being prompt engineering macros
- 🔄 Authentication checks multiple cache locations before requiring login
- 🎮 Server automatically detects creator mode on startup

### Security
- 🔐 API keys are obfuscated when stored
- 📁 .env files automatically added to .gitignore
- 🛡️ Restrictive file permissions on Unix systems

## [0.3.1] - 2024-12-19

### Fixed
- TypeScript compilation errors in apiKeyManager

## [0.3.0] - 2024-12-19

### Changed
- Clarified that Shadow Clone is a prompt engineering macro system
- Updated all tool descriptions to emphasize instruction delivery

## [0.2.0] - 2025-07-30

### Changed
- 🔐 **Real-time NFT verification** - Authentication now checks NFT ownership in real-time
- 🚫 Removed 24-hour expiration - Access remains active as long as you own the NFT
- ⚡ Immediate access revocation when NFT is transferred or sold
- 🔄 Added verification caching to reduce API calls (1 minute cache)
- 📝 Updated error messages to be more specific about NFT ownership

### Security
- NFT ownership is verified before each tool execution
- Graceful fallback to cached verification during network issues
- Wallet address tracking for license verification

### Technical
- Added `verifyNFTOwnership()` method for real-time checks
- Implemented verification result caching
- Added `clearVerificationCache()` for forcing fresh checks
- Added `getWalletAddress()` to track associated wallet

## [0.1.0] - 2025-07-30

### Initial Release

#### Features
- 🚀 Full Shadow Clone orchestration system via MCP
- 🤖 AI-agnostic tool descriptions (works with any AI assistant)
- 🔐 API key authentication with Ignis AI Labs
- 📋 Multiple orchestration modes (plan, feature, debug, optimize, refactor, audit, research)
- 🛠️ Modular tools for specialized tasks
- 🔄 Automatic update checking
- 🏭 Production-ready with comprehensive security and monitoring

#### Security
- Input validation and sanitization
- Rate limiting to prevent abuse
- Sensitive data masking in logs
- Path traversal protection
- Execution timeouts

#### Monitoring
- Health checks and metrics
- Performance logging
- Error tracking
- Resource usage monitoring

#### Tools Included
- `authenticate` - API key authentication
- `shadow_clone_orchestrate` - Main orchestration system
- `shadow_clone_plan` - Project planning mode
- `get_agent_template` - Agent behavior templates
- `deploy_agent_team` - Team deployment
- `deploy_specialist_agent` - Specialist deployment
- `quick_fix` - Rapid problem solving
- `code_review_team` - Code review methodology
- `generate_tests` - Test generation
- `execute_single_wave` - Single wave execution
- `create_documentation` - Documentation creation
- `architecture_consultant` - Architecture consultation
- `check_for_updates` - Version checking

#### Documentation
- Comprehensive README
- Installation guide for local development
- Production deployment guide
- User guide with examples
- Update instructions

#### Notes
- All tools return instructions for AI assistants to follow
- Outputs are directed to `.waves/` directory
- Internal prompts in `.shadow/` are never exposed
- Compatible with Claude Desktop and other MCP clients