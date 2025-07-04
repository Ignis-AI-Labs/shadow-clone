# Shadow Clone Project Constitution

## Project Overview
**Project Name**: Shadow Clone - Multi-Agent Orchestration System
**Current Branch**: dev-testing
**Last Updated**: 2025-07-04
**Status**: Active Development

## Project State

### Current Focus
- Testing and validation of the Shadow Clone system
- Ensuring proper Record Keeper integration across all teams
- Validating wave-based execution protocols
- Testing local file system mode

### Recent Changes
- **Record Keeper Global Rule**: Made Record Keeper a mandatory component for all teams
  - Updated core_system_rules.md to include team composition requirements
  - Modified shadow-clone-prompt.md to enforce Record Keeper inclusion
  - Added verification at multiple phases to prevent isolated deployment
  - Context preservation is now a sacred system principle

### System Architecture
- **Execution Modes**: Planning, Feature, Audit, Debug, Optimize, Refactor, Research
- **Wave System**: Sequential wave-based execution with mandatory wave-0
- **File Structure**: 
  - `.shadow/` - System configuration
  - `.shadow-local/` - Local testing version
  - `.waves/` - Wave execution artifacts
  - Source code in project directories
- **Agent Types**: Technical, Analytical, Leadership roles
- **Coordination**: Constitution-based context preservation

## Technical Decisions

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

### Simplified File Structure
**Decision**: Consolidated agent rules from 8 to 4 files
**Rationale**: Reduce complexity while maintaining role clarity
**Categories**: core_rules, technical_rules, analytical_rules, leadership_rules

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

## Next Steps
1. Execute clean plan mode test with updated Record Keeper rules
2. Validate all 8 phases complete successfully
3. Verify Record Keeper maintains context throughout
4. Check final test report for protocol compliance
5. Document any remaining issues for resolution

## Active Protocols
- Wave-0 mandatory for all executions
- No commits during wave execution
- Constitution updates after each wave
- File reservation system active
- Quality gates enforced at wave boundaries

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

---
*This constitution serves as the living memory of the Shadow Clone project*