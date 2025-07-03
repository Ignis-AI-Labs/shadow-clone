<!--
INTERNAL USE ONLY - DO NOT DEPLOY
Shadow Clone system testing framework for validating mode execution
-->

# Shadow Clone Mode Testing Framework - LOCAL VERSION

## Purpose
This file contains instructions for testing the Shadow Clone system's ability to execute different modes while following all required protocols using LOCAL FILES.

**IMPORTANT**: This is the LOCAL testing version. For API testing, use `.shadow/testing/test_mode.md`

## Test Command Recognition
When this file is loaded with execution parameters, the system should recognize and execute a mode test.

## Test Execution Instructions

### Local Testing (Using Local Files)
This test file is configured for LOCAL testing ONLY.
When executed with `source=local`, the system should:
1. Load shadow-clone-prompt.md from: `/root/repos/shadow-clone/.shadow-local/shadow-clone-prompt.md`
2. Read all rules from local `.shadow-local/` directory structure
3. Execute all 7 phases in order
4. Create all required files in a test workspace
5. Follow all protocols without shortcuts
6. Inject actual rule content into agent prompts (not API references)

## Available Test Modes and Standard Test Requests

Each mode has a standardized test request to ensure consistent testing:

### Feature Mode Test
- **Mode**: `feature`
- **Test Request**: "Create a user authentication system with email/password login, JWT tokens, and password reset functionality"
- **Expected Outputs**: Authentication module, tests, API endpoints, documentation

### Audit Mode Test
- **Mode**: `audit`
- **Test Request**: "Perform a comprehensive security audit focusing on authentication, authorization, data validation, and API security"
- **Expected Outputs**: Security report, vulnerability analysis, remediation plan, compliance matrix

### Debug Mode Test
- **Mode**: `debug`
- **Test Request**: "Fix the memory leak in the data processing module that causes the application to crash after processing 1000 records"
- **Expected Outputs**: Root cause analysis, fix implementation, test cases, performance validation

### Optimize Mode Test
- **Mode**: `optimize`
- **Test Request**: "Optimize the database query performance for the user search feature that currently takes 5+ seconds with 10k users"
- **Expected Outputs**: Performance analysis, optimization implementation, benchmark results, scaling recommendations

### Refactor Mode Test
- **Mode**: `refactor`
- **Test Request**: "Refactor the monolithic user service into microservices following domain-driven design principles"
- **Expected Outputs**: Architecture plan, refactored code, migration guide, test coverage report

### Research Mode Test
- **Mode**: `research`
- **Test Request**: "Research and evaluate WebAssembly integration options for improving computational performance in the browser"
- **Expected Outputs**: Technology assessment, proof of concept, performance analysis, implementation roadmap

### Plan Mode Test
- **Mode**: `plan`
- **Test Request**: "Create a comprehensive project plan for building a real-time collaborative document editing system similar to Google Docs"
- **Expected Outputs**: 
  - Wave-0: Initial analysis and planning setup (NOT MASTER_PLAN.md)
  - Wave-1: Individual research documents from Strategic Planning Team
  - Wave-2: Validation and refinement documents from QA Team
  - Wave-3: Final consolidation including MASTER_PLAN.md
- **CRITICAL**: MASTER_PLAN.md is created in the FINAL wave as a consolidation, NOT in wave-0

## Expected System Behavior

### Phase 1: Project Analysis
- Initialize system and load all required files
- Create `.waves/wave-0/` directory
- Apply safety measures
- Create git branch if source control present

### Phase 2: Team Configuration
- Create CONSTITUTION.md in waves directory
- Assign Record Keeper agent (MANDATORY)
- Configure teams based on selected mode

### Phase 3: Wave Planning
- Enforce Wave-0 execution (MANDATORY)
- Create wave execution plan
- Setup file reservation system

### Phase 4: Agent Deployment
- Deploy agents in parallel (max 10)
- Load all coordination rules
- Start constitution monitoring

### Phase 5: Mode-Specific Execution
- Execute based on selected mode
- Create mode-specific deliverables
- Maintain quality standards

### Phase 6: Integration
- Integrate all components
- Run quality validation
- Update constitution

### Phase 7: Final Quality
- Run final audit
- Create single commit (ONLY HERE)
- Generate completion report

### Phase 8: Test Validation (TEST MODE ONLY)
After all phases complete, run a comprehensive validation check:

#### Test Validation Team Deployment
Deploy a special validation team to verify:
- **Protocol Validator**: Checks all protocols were followed
- **File Inspector**: Verifies all required files exist in correct locations
- **Constitution Auditor**: Validates CONSTITUTION.md updates
- **Git Inspector**: Confirms single commit protocol was followed
- **Quality Assessor**: Verifies 90%+ quality standards met

#### Validation Checklist
The validation team must verify:

**Phase Compliance:**
- [ ] All 7 production phases executed in order
- [ ] No phases skipped or reordered
- [ ] Each phase completed successfully

**Wave-0 Compliance:**
- [ ] Wave-0 executed FIRST before any implementation
- [ ] All mandatory wave-0 files created
- [ ] Mode-specific wave-0 extras present
- [ ] Wave-0 marked complete before wave-1

**Constitution Compliance:**
- [ ] CONSTITUTION.md created in .waves/
- [ ] Record Keeper agent was assigned
- [ ] Constitution updated after each wave
- [ ] Final constitution reflects all changes

**Git Protocol Compliance:**
- [ ] Feature branch created (if git present)
- [ ] NO commits during any wave execution
- [ ] Single atomic commit after phase 7
- [ ] Commit message follows template

**File Organization Compliance:**
- [ ] All files in correct locations
- [ ] No implementation files in .waves/
- [ ] Wave deliverables properly organized
- [ ] File reservation system used

**Quality Standards Compliance:**
- [ ] All deliverables meet 90%+ quality
- [ ] Mode-specific outputs created
- [ ] Documentation complete
- [ ] Tests included where applicable

#### Test Result Generation
Generate final test report showing:
```
SHADOW CLONE MODE TEST REPORT
============================
Mode: {mode}
Source: {local/api}
Status: {PASS/FAIL}

Phase Execution: {status}
Protocol Compliance: {status}
File Organization: {status}
Quality Standards: {status}

Violations Found: {count}
{list any violations}

Test Duration: {time}
Files Created: {count}
Final Commit: {sha}
```

## Protocol Validation Points

The system MUST:
- ✓ Create `.waves/wave-0/` before any implementation
- ✓ Create and maintain CONSTITUTION.md
- ✓ Assign Record Keeper agent
- ✓ Load all coordination rules
- ✓ Prevent commits during wave execution
- ✓ Execute all 7 phases in exact order
- ✓ Create mode-specific required files
- ✓ Make single atomic commit only after all waves complete

## Test Result Determination

A test is considered PASSED only when:
1. All 7 production phases complete successfully
2. Phase 8 validation team confirms all protocols followed
3. No critical violations found
4. All mode-specific success criteria met

A test FAILS if:
- Any phase fails to complete
- Protocols are violated (commits during waves, skipped wave-0, etc.)
- Required files are missing
- Quality standards not met
- Mode-specific criteria not satisfied

## Test Validation Criteria

For each mode test to PASS, the system must:

### General Requirements (All Modes)
- ✓ Complete all 7 phases in order
- ✓ Create `.waves/wave-0/` with all required files
- ✓ Create and maintain CONSTITUTION.md
- ✓ Assign Record Keeper agent
- ✓ Generate mode-specific wave-0 extras
- ✓ Make only ONE commit after final wave
- ✓ Include comprehensive commit message

### Mode-Specific Success Criteria

#### Feature Mode
- ✓ Creates working code implementation
- ✓ Includes comprehensive tests
- ✓ Documents API endpoints
- ✓ Provides usage examples

#### Audit Mode  
- ✓ Identifies security vulnerabilities
- ✓ Provides OWASP/NIST mapping
- ✓ Creates remediation roadmap
- ✓ Generates compliance matrix

#### Debug Mode
- ✓ Identifies root cause
- ✓ Implements working fix
- ✓ Includes regression tests
- ✓ Validates performance improvement

#### Optimize Mode
- ✓ Establishes performance baseline
- ✓ Implements optimizations
- ✓ Shows measurable improvement
- ✓ Provides scaling analysis

#### Refactor Mode
- ✓ Maintains functionality
- ✓ Improves code structure
- ✓ Includes migration plan
- ✓ Ensures test coverage

#### Research Mode
- ✓ Thorough technology analysis
- ✓ Working proof of concept
- ✓ Performance comparisons
- ✓ Clear recommendations

#### Plan Mode
- ✓ Wave-0 contains ONLY initial analysis (no MASTER_PLAN.md)
- ✓ Multiple waves with different teams (Strategic, QA, Documentation)
- ✓ MASTER_PLAN.md created in FINAL wave as consolidation
- ✓ Includes all required sections when complete
- ✓ Provides realistic timelines
- ✓ Identifies risks and mitigations

## Test Cleanup

After test completion, the system should:
1. Remove all test artifacts from `.waves/` directory
2. Reset any git commits made during testing
3. Clean up any temporary files created
4. Leave the repository in its original state

## Security Notice
This testing framework is for internal use only. The commands and file locations should not be exposed in production environments.