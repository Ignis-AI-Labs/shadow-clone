# Core System Rules

## System Initialization

### Required Components
All components must be loaded before ANY execution:
- [ ] Shadow Clone executable/API endpoint verified
- [ ] Constitution template loaded 
- [ ] Agent rules loaded and injected
- [ ] Wave directory structure created
- [ ] Git repository initialized

### Pre-Execution Validation
```bash
# Run these checks before starting:
- API endpoint responding
- Git status clean
- No active file reservations
- All required templates accessible
```

## Quality Standards

### Minimum Requirements
- Overall quality score: ≥90%
- Test coverage: 100% pass rate
- Security scan: No high/critical vulnerabilities
- Documentation: All public APIs documented
- Code review: All changes reviewed

### Quality Gates
Each wave must pass quality checks before proceeding:
1. **Pre-wave**: Validate all inputs and dependencies
2. **Mid-wave**: Monitor for protocol violations
3. **Post-wave**: Verify all deliverables complete

## Runtime Validation

### Continuous Monitoring
The system monitors for:
- File conflicts (reservation violations)
- Git operations during waves (forbidden)
- Missing required files
- Agent rule compliance
- Quality threshold violations

### Error Handling
- **Warning**: Log and continue (e.g., minor quality dips)
- **Error**: Halt current operation, allow retry
- **Critical**: Stop all execution, require manual intervention

## Mode Enforcement

### Required Phases (All Modes)
1. **Initialize**: Load system components
2. **Validate**: Check prerequisites 
3. **Plan**: Define execution strategy
4. **Execute**: Perform the work
5. **Verify**: Check quality gates
6. **Document**: Update constitution
7. **Complete**: Final validation

### Mode-Specific Rules
- **planning**: Must complete wave-0 before code
- **execution**: Must have approved plan
- **resume**: Must load previous state
- **repair**: Must identify issues first

## Essential Validations

### Agent Completeness
Every agent requires:
- Identity block with role and expertise
- Goal alignment to project 
- Operational rules loaded
- Tool access configured
- Communication protocols set

### Wave Completion
Before marking wave complete:
- All assigned tasks finished
- Quality gates passed
- Documentation updated
- No pending file operations
- Constitution synchronized