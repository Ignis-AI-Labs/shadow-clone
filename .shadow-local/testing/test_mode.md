<!--
INTERNAL USE ONLY - DO NOT DEPLOY
Shadow Clone system testing framework initialization
-->

# Shadow Clone Mode Testing Framework - LOCAL VERSION

## Purpose
This file initializes dry-run tests of the Shadow Clone system to verify protocol compliance and system functionality. The actual validation is performed by a Validator Agent after test execution completes.

**IMPORTANT**: This is the LOCAL testing version. The system should execute exactly as it would in production, with validation occurring only after completion.

## Test Initialization

When this file is loaded with execution parameters, the system should:
1. Recognize this as a test execution request
2. Execute the requested mode normally (WITHOUT loading any validation files)
3. Deploy a Validator Agent after completion to assess compliance

**IMPORTANT**: During execution, the system should NOT access:
- `testing/MODE_EXECUTION_FLOWCHART.md`
- `testing/VALIDATOR_AGENT_TEMPLATE.md`
- Any other testing/validation files

These files are for post-execution validation ONLY.

## Test Invocation

To run any test, use this command structure:
```
Load .shadow-local/shadow-clone-prompt.md and execute with [parameters below]
```

## Available Test Scenarios

### Planning Mode Test
```
Load .shadow-local/shadow-clone-prompt.md and execute with mode=plan test=true request="Create a comprehensive project plan for building a real-time collaborative document editing system similar to Google Docs"
```

### Feature Mode Test
```
Load .shadow-local/shadow-clone-prompt.md and execute with mode=feature test=true request="Create a user authentication system with email/password login, JWT tokens, and password reset functionality"
```

### Audit Mode Test
```
Load .shadow-local/shadow-clone-prompt.md and execute with mode=audit test=true request="Perform a comprehensive security audit of our web application"
```

### Debug Mode Test
```
Load .shadow-local/shadow-clone-prompt.md and execute with mode=debug test=true request="Fix the memory leak in the data processing module that causes crashes after 1000 records"
```

### Optimize Mode Test
```
Load .shadow-local/shadow-clone-prompt.md and execute with mode=optimize test=true request="Optimize database query performance for user search (currently 5+ seconds)"
```

### Refactor Mode Test
```
Load .shadow-local/shadow-clone-prompt.md and execute with mode=refactor test=true request="Refactor the monolithic user service into microservices following DDD principles"
```

### Research Mode Test
```
Load .shadow-local/shadow-clone-prompt.md and execute with mode=research test=true request="Research WebAssembly integration for browser computation performance"
```

## Test Execution Protocol

### Phases 1-7: Normal Production Execution
The system executes ALL 7 standard phases exactly as it would in production:
- Phase 1: System Initialization
- Phase 2: Team Configuration
- Phase 3: Wave Planning
- Phase 4: Agent Deployment
- Phase 5: Mode-Specific Execution
- Phase 6: Integration & Quality Assurance
- Phase 7: Final Quality & Git Commit

### Phase 8: Test Validation (TEST MODE ONLY)
**ONLY AFTER Phase 7 completes (including final git commit)**, the system enters Phase 8:

```yaml
phase_8_validator:
  trigger: "test=true flag AND Phase 7 complete"
  name: "Shadow Clone Protocol Validator"
  purpose: "Assess test execution compliance"
  access: "Read-only access to completed execution"
  loads_files: # These files are ONLY loaded in Phase 8
    - "testing/MODE_EXECUTION_FLOWCHART.md" 
    - "testing/VALIDATOR_AGENT_TEMPLATE.md"
  output: "TEST_VALIDATION_REPORT.md"
```

### Phase 8 Validation Process
The Validator Agent will:
- Load the execution flowchart and requirements
- Analyze the execution history
- Check all critical points
- Generate a comprehensive report
- Determine PASS/FAIL status

## Test Environment Requirements

### Pre-Test State
- Clean git repository
- No existing .waves directory
- Valid .shadow-local structure
- Not on main/master branch

### Post-Test Cleanup
After validation completes:
```bash
# Archive test results
mv .waves/ .test-results/test-[mode]-[timestamp]/

# Reset repository
git reset --hard HEAD~1  # Remove test commit
git checkout main  # Return to main branch
```

## Important Notes

1. **No Shortcuts**: The test must execute exactly as production would
2. **No Special Behavior**: Agents should not know they're in a test
3. **Complete Execution**: All phases must complete normally
4. **Validation Separation**: Assessment happens only after completion
5. **Flexible System**: The system adapts to requirements dynamically

## Test Initialization

Any of the test scenarios above can be executed by passing the complete parameter set to the Shadow Clone system. The `test=true` flag indicates that a Validator Agent should be deployed after completion to validate protocol compliance.

---

*"Creation follows rules regardless if we like them or not. When it comes to making some of the things we truly enjoy, we need to understand the laws behind what makes their functions possible."*

This test framework respects those laws by allowing the system to execute naturally, then validating that execution followed the proper protocols.