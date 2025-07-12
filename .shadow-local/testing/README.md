# Shadow Clone Testing Framework

<overview>
  <purpose>
    This directory contains the testing framework and validation system for the Shadow Clone AI orchestration platform. The testing system ensures protocol compliance and identifies areas for continuous improvement.
  </purpose>
  
  <philosophy>
    Testing executes the full Shadow Clone system exactly as production would, then validates compliance post-execution. This approach ensures authentic behavior while providing comprehensive validation.
  </philosophy>
</overview>

## File Structure

<files>
  <file name="test_mode.md">
    <purpose>Main test execution guide</purpose>
    <content>
      - Test framework overview
      - Test scenarios for all 7 modes
      - Execution procedures
      - Validation criteria
    </content>
  </file>
  
  <file name="MODE_EXECUTION_FLOWCHART.md">
    <purpose>Comprehensive execution flow and validation reference</purpose>
    <content>
      - Universal execution flow
      - Mode-specific validation checklists
      - Quality standards
      - Critical requirements
    </content>
  </file>
  
  <file name="VALIDATOR_AGENT_TEMPLATE.md">
    <purpose>Template for validation agents</purpose>
    <content>
      - Validator architecture
      - Wave-specific validation checklists
      - Report template with examples
      - Evidence standards
    </content>
  </file>
  
</files>

## Critical Protocol Requirements

<requirements>
  <requirement priority="HIGHEST">
    Three-Phase Deployment Pattern MUST be followed:
    1. Pre-Wave: Deploy ONLY Record Keeper Collective
    2. Main Wave: Deploy implementation agents (RKs already active)
    3. Post-Wave: Deploy ONLY Record Keeper Collective again
  </requirement>
  
  <requirement priority="HIGH">
    Workspace Discipline:
    - All work in .waves/wave-N/ directories
    - NEVER create nested .waves directories
    - Maintain wave isolation
  </requirement>
  
  <requirement priority="HIGH">
    Record Keeper Collective:
    - Minimum 3 Record Keepers per wave
    - Scale according to formula: max(3, ceil(total_agents/5))
    - Deploy simultaneously, not sequentially
  </requirement>
</requirements>

## Test Execution Flow

<execution_flow>
  1. **Setup**: Verify clean git state, create test branch
  2. **Execute**: Run Shadow Clone with test=true flag
  3. **Monitor**: Observe three-phase pattern compliance
  4. **Validate**: Automatic validation after Phase 7
  5. **Report**: Review TEST_VALIDATION_REPORT.md
  6. **Archive**: Store results in .test-results/
  7. **Cleanup**: Reset repository to clean state
</execution_flow>

## Common Violations to Watch For

<violations>
  <violation severity="CRITICAL">
    **Mixed Deployment**: Implementation agents deployed in Pre/Post waves
    **Impact**: Core protocol violation
    **Fix**: Strictly separate deployment phases
  </violation>
  
  <violation severity="HIGH">
    **Nested Waves**: Creating .waves inside existing wave directories
    **Impact**: Workspace chaos and confusion
    **Fix**: All waves at same level under .waves/
  </violation>
  
  <violation severity="HIGH">
    **Missing RK Documentation**: RK presence unclear in assignments
    **Impact**: Cannot verify protocol compliance
    **Fix**: Explicit RK listing in AGENT_ASSIGNMENTS.md
  </violation>
</violations>

## Validation Success Criteria

<success_criteria>
  ✓ All 7 production phases complete successfully
  ✓ Three-phase deployment pattern followed in every wave
  ✓ Workspace discipline maintained (no nested directories)
  ✓ Record Keeper Collective properly documented and deployed
  ✓ Mode-specific deliverables created and validated
  ✓ Single atomic git commit at completion
  ✓ Quality gates passed (tests, security, documentation)
</success_criteria>

## Quick Reference Commands

```bash
# Run a test
Load .shadow-local/shadow-clone-prompt.md and execute with mode=[mode] test=true request="[your request]"

# Check test results
cat TEST_VALIDATION_REPORT.md

# Archive results
mkdir -p .test-results/test-[mode]-$(date +%Y%m%d-%H%M%S)
mv .waves/ TEST_VALIDATION_REPORT.md .test-results/test-[mode]-$(date +%Y%m%d-%H%M%S)/

# Clean up after test
git reset --hard HEAD~1
git checkout main
```

## Key Improvements from Test Results

Based on recent test executions, the following improvements have been made:

1. **Clarified Three-Phase Deployment**: Created explicit documentation that Pre/Post waves are ONLY for Record Keepers
2. **Enhanced Validation Checklists**: Updated all checklists to explicitly check deployment patterns
3. **Added Workspace Integrity Rules**: Prevent nested .waves directories
4. **Improved RK Documentation Requirements**: Explicit presence in all phases

---

*Remember: The test system executes production code - agents have no awareness they are being tested. This ensures authentic behavior and real protocol validation.*