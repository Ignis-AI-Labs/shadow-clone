# Wave Execution Protocol

## Wave Overview

Waves organize work into manageable phases with clear boundaries:
- **Wave-0**: Planning and analysis (mandatory for complex projects)
- **Wave-1+**: Implementation phases
- **Final Wave**: Integration, testing, and delivery

## Wave-0: Planning Phase

### Mandatory Outputs
1. **project_analysis.md** - What are we building and why?
2. **requirements.md** - Functional and non-functional requirements
3. **architecture_plan.md** - High-level technical approach
4. **team_formation.md** - Agent roles and assignments
5. **wave_plan.md** - Execution strategy for subsequent waves
6. **setup_complete.md** - Checkpoint confirming readiness

### Rules for Wave-0
- NO implementation code
- Focus on understanding and planning
- All documents must be complete before Wave-1
- Skip only for trivial tasks (<1 day effort)

## Wave Execution Flow

### 1. Pre-Flight Checks
```bash
✓ Previous wave complete
✓ All dependencies available  
✓ Team assignments confirmed
✓ File reservations clear
✓ Quality gates defined
```

### 2. Wave Kickoff
- Lead agent initiates wave
- Team members confirm readiness
- File reservations begin
- Constitution checkpoint created

### 3. Execution Monitoring
- Track task completion
- Monitor quality metrics
- Check for conflicts
- Validate protocol compliance

### 4. Wave Completion
- All tasks marked complete
- Quality gates passed
- Documentation updated
- File reservations released
- Constitution updated

## Coordination Patterns

### Parallel Work
- Agents work independently on non-overlapping files
- Use file reservation to prevent conflicts
- Synchronize at defined checkpoints

### Sequential Dependencies
- Identify blocking dependencies upfront
- Complete prerequisites first
- Hand off work with clear documentation

### Integration Points
- Database → Backend Services → APIs → Frontend
- Test at each integration boundary
- Document interface contracts

## Mode-Specific Execution

### Planning Mode
- Always starts with Wave-0
- Can iterate on planning documents
- No implementation until approved

### Execution Mode
- Requires completed Wave-0
- Follows the wave plan strictly
- Updates constitution after each wave

### Resume Mode
1. Load previous constitution
2. Identify last completed wave
3. Restore file reservations
4. Continue from checkpoint

### Repair Mode
1. Analyze what's broken
2. Create focused repair plan
3. Execute minimal changes
4. Verify fix doesn't break other components

## Quality Checkpoints

### Per-Wave Quality Gates
- **Entry**: Prerequisites met, resources available
- **Progress**: On track, no blockers
- **Exit**: Deliverables complete, quality standards met

### Continuous Quality Metrics
- Test coverage and pass rate
- Code review completion
- Documentation updates
- Security scan results
- Performance benchmarks

## Common Patterns

### Small Feature (1-2 days)
- Optional Wave-0 (brief planning)
- Single Wave-1 for implementation
- Simplified quality gates

### Medium Project (1-2 weeks)  
- Full Wave-0 planning
- 2-3 implementation waves
- Standard quality gates

### Large Initiative (>2 weeks)
- Comprehensive Wave-0
- Multiple waves with dependencies
- Strict quality enforcement
- Regular synchronization points

## Anti-Patterns to Avoid

1. **Skipping Wave-0** for complex projects
2. **Committing during waves** (breaks atomicity)
3. **Ignoring file reservations** (causes conflicts)
4. **Proceeding without quality gates** (accumulates debt)
5. **Not updating constitution** (loses context)