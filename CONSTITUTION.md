# Shadow Clone Project Constitution

## Project Overview
**Project Name**: Shadow Clone - Multi-Agent Orchestration System
**Current Branch**: dev-testing
**Last Updated**: 2025-07-05
**Status**: Production Ready - v0.3.7

## Project State

### Current Focus
- Production deployment of streamlined Shadow Clone system v0.3.4
- API endpoints consolidated and deployed to Cloudflare
- VSCode extension updated with new endpoint structure
- Both local (.shadow-local) and API (.shadow) modes fully operational

### Recent Changes (2025-07-05)
- **API Consolidation**:
  - Removed redundant cloudflare-worker directory
  - All API functionality handled by main dashboard at api.ignislabs.ai
  - Admin portal deployed to admin.ignislabs.ai with integrated security monitoring
  - Eliminated dual API confusion - single source of truth

- **Security System Converted to Monitoring-Only Mode**:
  - Removed automatic enforcement of security measures
  - Implemented visual warnings and admin notifications
  - Created admin dashboard for reviewing security events
  - Added configurable security modes (monitor vs enforce)
  - Philosophy: Human judgment required for security decisions
  - Full documentation in `/docs/SECURITY_MONITORING.md`

- **Streamlined System Architecture**: Reduced from 69 to 31 files
  - Consolidated agent rules from 8 individual files to 3 core files
  - Simplified coordination rules from 8 files to 2 essential protocols
  - Reduced templates from 13 to 6 focused templates
  - Maintained all functionality with improved clarity

- **API Endpoint Updates**: 
  - Main prompt: `/api/prompts/shadow-clone-prompt`
  - Consolidated endpoints by category: `/api/prompts/{category}/{filename}`
  - Deployed to Cloudflare for production use

- **VSCode Extension v0.3.7**:
  - Updated all API endpoints to match new structure
  - Built and packaged for deployment
  - Maintained full macro command functionality
  - Updated security telemetry to be less intrusive

- **Record Keeper Global Rule**: Made Record Keeper a mandatory component for all teams
  - Updated core_system_rules.md to include team composition requirements
  - Modified shadow-clone-prompt.md to enforce Record Keeper inclusion
  - Added verification at multiple phases to prevent isolated deployment
  - Context preservation is now a sacred system principle

### System Architecture
- **Execution Modes**: Research, Planning, Feature, Debug, Optimize, Refactor, Audit
- **Wave System**: Sequential wave-based execution with mandatory wave-0
- **File Structure**: 
  - `.shadow/` - Production API-based configuration (31 files)
  - `.shadow-local/` - Local testing version (31 files)
  - `.waves/` - Wave execution artifacts
  - `vscode-extension/` - VSCode extension source
  - Source code in project directories
- **Agent Types**: Technical, Analytical, Leadership roles
- **Coordination**: Constitution-based context preservation

### Key Component Locations
- **VSCode Extension**: `/vscode-extension/` - All VSCode extension development work
- **Macro Injections**: `/vscode-extension/src/providers/macroProvider.ts` - Defines all macro commands and their UI
- **API Endpoints**: `/vscode-extension/src/utils/constants.ts` - Contains API base URLs (api.ignislabs.ai)
- **Prompt Service**: `/vscode-extension/src/services/promptService.ts` - Constructs API endpoint paths
- **Command Injection**: `/vscode-extension/src/commands/injectCommand.ts` - Builds curl commands with API URLs
- **Endpoint Manifest**: `/CLOUDFLARE_UPLOAD_MANIFEST.md` - Documents all 31 API endpoints
- **Extension Entry**: `/vscode-extension/src/extension.ts` - Registers commands and activates extension

## Technical Decisions

### Security Monitoring Philosophy (2025-07-05)
**Decision**: Convert security system from enforcement to monitoring-only
**Rationale**: AI systems lack genuine discernment for judicial security decisions
**Implementation**:
- Security monitor logs warnings without blocking
- Middleware adds warning headers but allows requests
- Admin dashboard shows security events for review
- Human administrators make all enforcement decisions
**Benefits**:
- Avoids false positives disrupting legitimate users
- Builds trust while maintaining visibility
- Allows contextual judgment for each case
- Enables continuous improvement based on real data

### Record Keeper Integration (2025-07-04)
**Decision**: Record Keeper must be included in every team, not deployed separately
**Rationale**: Previous tests showed Record Keeper being launched alone caused coordination issues
**Implementation**: 
- Added to core_system_rules.md as global requirement
- Verification in shadow-clone-prompt.md phases 2 and 4
- "Context is sacred" principle established

### Local Testing Mode
**Decision**: Maintain separate `.shadow-local/` directory for testing
**Rationale**: Allows testing without affecting production API-based system
**Status**: Active, used for all current testing

### Streamlined File Structure (2025-07-05)
**Decision**: Consolidated entire system from 69 to 31 files
**Rationale**: Reduce complexity while maintaining full functionality
**Structure**:
- **Agent Rules** (3 files): core_rules, specialized_agent_rules, agent_template
- **Coordination** (2 files): system_core_rules, wave_coordination_protocol
- **Templates** (6 files): Essential templates only
- **Modes** (7 files): One per execution mode
- **Testing** (3 files): Focused test framework

## Quality Standards
- All code must meet 90%+ quality score
- Test coverage must achieve 100% pass rate
- No critical security vulnerabilities
- Documentation must be comprehensive
- Single atomic commit per wave execution

## Testing Status

### Plan Mode Test
- **Status**: Ready for execution
- **Test Case**: Real-time collaborative document editing system
- **Expected Outcome**: Multi-wave planning with MASTER_PLAN in final wave
- **Key Validation**: Record Keeper deployed with teams, not separately

### Previous Test Results
- Identified Record Keeper isolation issue
- Confirmed need for global team composition rules
- Validated local file loading mechanism

## Recent Updates

### 2025-07-08 - UI Reorganization v0.3.7
- **UI Changes**:
  - Moved PROMPTS section to the top of the VSCode sidebar
  - Removed non-functional PROJECTS and ACTIVE AGENTS sections
  - Simplified UI to focus on working features

### 2025-07-05 - Production Release v0.3.6 & Security Update
- **Security System Overhaul**: 
  - Converted to monitoring-only mode
  - No automatic blocking or enforcement
  - Admin review required for all actions
  - Comprehensive logging and alerting
- **System Streamlining**: Reduced from 69 to 31 files without functionality loss
- **API Deployment**: All endpoints updated and deployed to Cloudflare
- **VSCode Extension**: Updated to v0.3.3 with new endpoint structure
- **Improved Clarity**: Consolidated rules and templates for better understanding

### 2025-07-04 - Record Keeper Integration
- Fixed Record Keeper being deployed separately from teams
- Added mandatory team composition rule in core_system_rules.md
- Enhanced shadow-clone-prompt.md with verification checks
- Established "Context is sacred" principle

## Production Status
- **Version**: v0.3.7
- **API**: Deployed to Cloudflare with streamlined endpoints
- **VSCode Extension**: Built and packaged (shadow-clone-0.3.7.vsix)
- **Documentation**: Updated to reflect new structure
- **Testing**: Both local and API modes validated

## System Capabilities
- **7 Execution Modes**: Research, Plan, Feature, Debug, Optimize, Refactor, Audit
- **Dynamic Wave System**: Adaptive wave-based execution
- **Parallel Agent Deployment**: Teams work concurrently within waves
- **Context Preservation**: Record Keeper ensures continuity
- **Quality Gates**: Automated validation at wave boundaries
- **Security Monitoring**: Non-intrusive activity monitoring with admin review

## Active Protocols
- Wave-0 mandatory for all executions
- No commits during wave execution
- Constitution updates after each wave
- File reservation system active
- Quality gates enforced at wave boundaries
- Security monitoring in effect (non-blocking)
- Admin review for security decisions

## Dependencies
- Local file system access required
- Git repository for version control
- Sufficient disk space for wave artifacts
- No external API dependencies in local mode

## Risk Mitigation
- Record Keeper ensures context preservation
- Wave isolation prevents interference
- Git branching protects main codebase
- Test mode allows safe validation
- Security monitoring without disruption
- Human review for security actions
- Transparent security practices

---
*This constitution serves as the living memory of the Shadow Clone project*