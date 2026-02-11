# Shadow Clone MCP Server Changelog

## [0.3.0] - 2025-02-11

### Changed - Open Source Pivot
- **Free and open-source**: Shadow Clone is now completely free with no authentication required
- Removed all authentication, API key, and NFT license verification code
- Removed `authenticate` and `api_key_status` tools
- Removed webpack obfuscation from build pipeline
- Removed `axios` dependency (was only used for auth API calls)
- Switched to MIT License
- All 14 tools are immediately available without any setup beyond installation

### Removed
- `authService.ts` - API key validation and NFT verification
- `apiKeyManager.ts` - API key caching and persistence
- `creatorMode.ts` - Creator mode authentication bypass
- `apiKeyStatus.ts` - API key status reporting tool
- `shadowCloneTools.ts` - Legacy API-fetching tool (dead code)
- Webpack obfuscation build step and dependencies

## [0.2.3] - 2024-12-19

### Added
- Workspace initializer improvements
- Embedded user guide content

### Changed
- Workspace initializer now creates USER-GUIDE.md for humans

## [0.2.2] - 2024-12-19

### Fixed
- Fixed `check_for_updates` tool to read version from package.json instead of hardcoded value

## [0.2.1] - 2024-12-19

### Changed
- Workspace initializer redesigned to actually create files instead of returning instructions
- Smart handling of existing files (append vs overwrite)

## [0.2.0] - 2024-12-19

### Added
- Workspace initialization tool (`initialize_workspace`)
- Multiple orchestration modes (plan, feature, debug, optimize, refactor, audit, research)
- Comprehensive monitoring and rate limiting
- Input validation and sanitization

### Technical
- Production-ready security: rate limiting, path traversal protection, execution timeouts
- Sensitive data masking in logs
- Health checks and metrics

## [0.1.0] - 2024-12-01

### Initial Release
- Full Shadow Clone orchestration system via MCP
- AI-agnostic tool descriptions
- Multiple orchestration modes
- Modular tools for specialized tasks
- Automatic update checking
