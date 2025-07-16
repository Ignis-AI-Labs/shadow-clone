# Shadow Clone Project Constitution

## Project Overview
**Project Name**: Shadow Clone - Multi-Agent Orchestration System
**Current Branch**: dev-testing
**Last Updated**: 2025-07-13
**Status**: Production Ready - v0.4.0

## Project State

### Current Focus
- Optimized Shadow Clone system with reduced complexity and improved efficiency
- Simplified to single Record Keeper per wave (from previous 2-3 agents)
- Simplified Planning mode to focused 3-wave structure
- Enforced parallel agent deployment for real-time collaboration
- Applied Claude Prompt Engineering best practices throughout

### Recent Changes (2025-07-16)
- **Further Optimization**:
  - Simplified to exactly 1 Record Keeper per wave (from 2-3 agents)
  - No scaling formula needed - always exactly 1 RK
  - Maintained 3 essential RK tracking files per wave
  - Enforced strict file organization for master plan location

### Previous Changes (2025-07-13)
- **Major System Optimization**:
  - Reduced Record Keeper minimum from 3 to 2 agents
  - Scaling formula updated to `max(2, ceil(total_agents / 5))`
  - Consolidated RK tracking files from 8 to just 3 essential files
  - Enforced parallel deployment for all agent teams

- **Planning Mode Overhaul**:
  - Simplified to 3 waves: Foundation, Research, Master Plan
  - One deliverable per wave (down from dozens of files)
  - Explicit "no code in planning" enforcement
  - Minimal folder structure (deliverables/ and drafts/ only)

- **Prompt Engineering Applied**:
  - Positive framing throughout (tell what TO DO)
  - Clear sequential instructions with context
  - Explicit examples of correct vs incorrect patterns
  - Structured with XML tags for clarity

- **Test Mode Enforcement**:
  - Added strict rules against skipping waves
  - Enforce complete execution before validation
  - No shortcuts or simulations allowed
  - Phase 8 validation only after Phase 7 completion

### Previous Changes (2025-07-05)
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

- **Record Keeper Optimization**: Reduced from 3 to 1 single agent
  - Single Record Keeper handles all coordination
  - No scaling needed - always exactly 1 RK
  - Simplified decision-making with single authority
  - Parallel deployment ensures real-time collaboration

### System Architecture
- **Execution Modes**: Research, Planning, Feature, Debug, Optimize, Refactor, Audit
- **Wave System**: Sequential wave-based execution with mandatory wave-0
- **Planning Mode Structure**: 3 waves (Foundation → Research → Master Plan)
- **File Structure**: 
  - `.shadow/` - Production API-based configuration (31 files)
  - `.shadow-local/` - Local testing version with test mode
  - `.waves/` - Wave execution artifacts (minimal structure)
  - Source code in project directories
- **Agent Deployment**: Parallel execution in batches up to 10
- **Record Keeper**: 1 agent per wave (no collective needed)
- **Coordination**: Streamlined file tracking (3 files vs 8)

### Key Component Locations
- **VSCode Extension**: `/vscode-extension/` - All VSCode extension development work
- **Macro Injections**: `/vscode-extension/src/providers/macroProvider.ts` - Defines all macro commands and their UI
- **API Endpoints**: `/vscode-extension/src/utils/constants.ts` - Contains API base URLs (api.ignislabs.ai)
- **Prompt Service**: `/vscode-extension/src/services/promptService.ts` - Constructs API endpoint paths
- **Command Injection**: `/vscode-extension/src/commands/injectCommand.ts` - Builds curl commands with API URLs
- **Endpoint Manifest**: `/CLOUDFLARE_UPLOAD_MANIFEST.md` - Documents all 31 API endpoints
- **Extension Entry**: `/vscode-extension/src/extension.ts` - Registers commands and activates extension

## Technical Decisions

### Efficiency Optimization (2025-07-16)
**Decision**: Further reduce system complexity while maintaining effectiveness
**Implementation**:
- Record Keepers: 3 → 2 → 1 (single RK per wave)
- RK tracking files: 8 → 3 files
- Planning waves: Dynamic → Fixed 3 waves
- Deliverables: Multiple per wave → One per wave
**Rationale**: Reduced context usage, faster execution, clearer structure, unified decision-making

### Parallel Deployment Requirement (2025-07-13)
**Decision**: All agents in a group must deploy simultaneously
**Rationale**: Sequential deployment prevents real-time collaboration
**Implementation**:
- Record Keeper Collective deploys as one unit
- Implementation teams deploy in batches (max 10)
- Use single Task() message for parallel execution
**Benefits**: Enables coordination, shared context, team dynamics

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

### Record Keeper Integration (Updated 2025-07-16)
**Decision**: Simplify to single Record Keeper model
**Previous**: 3 RKs minimum → 2 RKs minimum
**Current**: 1 RK per wave - no collective needed
**Implementation**: 
- Single RK handles all coordination
- 3 essential files maintained
- Parallel deployment mandatory
- No scaling formula - always exactly 1

### Local Testing Mode
**Decision**: Maintain separate `.shadow-local/` directory for testing
**Rationale**: Allows testing without affecting production API-based system
**Status**: Active, used for all current testing

### Streamlined File Structure (Updated 2025-07-13)
**Decision**: Further optimize file creation and tracking
**Changes from v0.3.x**:
- **RK Operations**: 8 files → 3 files per wave
- **Planning Deliverables**: Many files → 1 per wave
- **Folder Structure**: Complex hierarchy → Simple deliverables/drafts
**Benefits**:
- Less context usage per wave
- Clearer file organization
- Faster execution
- Easier to track progress

## Quality Standards
- All code must meet 90%+ quality score
- Test coverage must achieve 100% pass rate
- No critical security vulnerabilities
- Documentation must be comprehensive
- Single atomic commit per wave execution

## Testing Status

### Plan Mode Test (Updated)
- **Status**: Optimized and ready
- **Structure**: 3 waves only (Foundation, Research, Master Plan)
- **Expected Outcome**: One deliverable per wave, no code generation
- **Key Validations**: 
  - 1 RK deploys with team
  - No code written during planning
  - Minimal file creation
  - All waves execute completely

### Previous Test Results
- Identified Record Keeper isolation issue
- Confirmed need for global team composition rules
- Validated local file loading mechanism

## Recent Updates

### 2025-07-16 - Further Optimization v0.4.1
- **Single Record Keeper Model**:
  - Simplified from 2 RKs to exactly 1 RK per wave
  - No scaling needed - always exactly 1
  - Clearer decision-making authority
  - Maintained 3 essential tracking files

### 2025-07-13 - Major Optimization v0.4.0
- **Efficiency Improvements**:
  - Record Keeper Collective reduced to 2 agents minimum
  - RK tracking consolidated from 8 to 3 files
  - Planning mode simplified to 3 waves
  - One deliverable per wave approach
- **Best Practices Applied**:
  - Claude Prompt Engineering principles throughout
  - Positive framing and clear instructions
  - Explicit parallel deployment requirements
  - Test mode enforcement against shortcuts
- **System Benefits**:
  - ~40% reduction in context usage
  - Clearer execution flow
  - Faster wave completion
  - Better agent collaboration

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
- **Version**: v0.4.1
- **API**: Optimized structure ready for deployment
- **Local Mode**: Enhanced with test validation framework
- **Documentation**: Fully updated with optimization guide
- **Testing**: Comprehensive validation with anti-skip enforcement

## System Capabilities
- **7 Execution Modes**: Research, Plan, Feature, Debug, Optimize, Refactor, Audit
- **Optimized Planning**: 3-wave structure with single deliverables
- **Parallel Agent Deployment**: Mandatory simultaneous deployment
- **Single Record Keeper**: 1 RK per wave for clear coordination
- **Streamlined Tracking**: 3 essential files vs previous 8
- **Quality Gates**: Automated validation at wave boundaries
- **Test Validation**: Phase 8 ensures complete execution

## Active Protocols
- Wave-0 mandatory for all executions
- Parallel deployment required for all agent groups
- No commits during wave execution
- Constitution updates after each wave
- Minimal file creation enforced
- No code generation in planning mode
- Complete all waves before validation
- Quality gates at wave boundaries

## Dependencies
- Local file system access required
- Git repository for version control
- Sufficient disk space for wave artifacts
- No external API dependencies in local mode

## Risk Mitigation
- Single RK maintains context and coordination
- Parallel deployment enables collaboration
- Wave isolation prevents interference
- Git branching protects main codebase
- Test validation catches execution issues
- Positive instructions reduce confusion
- Clear examples prevent mistakes

---
*This constitution serves as the living memory of the Shadow Clone project*