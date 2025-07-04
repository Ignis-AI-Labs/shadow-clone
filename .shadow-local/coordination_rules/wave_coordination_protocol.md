# Wave Coordination Protocol

## Wave Execution Flow

### Wave 0 - Planning (MANDATORY)
**Purpose:** Define project scope and approach
**Agents:** Team Lead, Planning Strategist, Research Analyst, System Architect
**Outputs:**
- Requirements breakdown
- Wave structure definition
- Agent assignments
- Technical approach

### Wave 1+ - Implementation
**Purpose:** Build the solution incrementally
**Agents:** As assigned by Team Lead
**Outputs:**
- Working code/features
- Test coverage
- Integration points

### Final Wave - Convergence
**Purpose:** Finalize and validate everything
**Agents:** Team Lead, Audit Specialist, Technical Writer, DevOps
**Outputs:**
- Final test report
- Complete documentation
- Deployment readiness
- Updated constitution

## Execution Patterns

### Sequential Execution
- Agents work one after another
- Clear dependencies between tasks
- Used when order matters

### Parallel Execution
- Multiple agents work simultaneously
- No file conflicts between agents
- Used for independent tasks

### Mixed Pattern
- Combine sequential and parallel
- Most common approach
- Optimize for efficiency

## Mode-Specific Protocols

### Planning Mode
- Heavy wave-0 focus
- Multiple planning iterations allowed
- Produces MASTER_PLAN.md
- No implementation in wave-0

### Feature Mode
- Quick wave-0 planning
- Focus on implementation waves
- Incremental feature delivery
- Regular integration testing

### Debug Mode
- Minimal planning
- Direct to problem solving
- Fast iteration cycles
- Focus on fix validation

### Audit Mode
- Systematic review process
- Quality gates at each wave
- Comprehensive reporting
- No code changes without approval

## Pre-Flight Checks

Before ANY wave starts:
1. Constitution loaded and current
2. Previous wave artifacts reviewed
3. Agent assignments confirmed
4. File conflicts checked
5. Quality gates defined

## During Wave Execution

### Agent Responsibilities
- Create todo list immediately
- Update status in real-time
- Report blockers immediately
- Follow handoff protocol exactly

### Team Lead Monitoring
- Track agent progress
- Resolve conflicts quickly
- Ensure quality gates met
- Coordinate cross-dependencies

### Record Keeper Duties
- Document all decisions
- Track context changes
- Update constitution draft
- Maintain audit trail

## Wave Completion

### Success Criteria
- All agents report "Complete"
- Quality gates passed
- No open blockers
- Files properly organized

### Constitution Update
After EVERY wave:
1. Record outcomes
2. Document decisions
3. Update project state
4. Add lessons learned

### Transition Protocol
1. Team Lead calls convergence
2. All agents submit final status
3. Quality validation performed
4. Constitution committed
5. Next wave initialized

## Common Patterns

### Small Project (2-3 waves)
- Wave 0: Planning
- Wave 1: Implementation
- Wave 2: Finalization

### Medium Project (4-5 waves)
- Wave 0: Planning
- Wave 1: Core infrastructure
- Wave 2-3: Feature implementation
- Wave 4: Integration & finalization

### Large Project (6+ waves)
- Wave 0: Planning
- Wave 1-2: Foundation
- Wave 3-5: Incremental features
- Wave 6+: Integration, testing, deployment

## Anti-Patterns (AVOID)

### Skipping Wave 0
- NEVER skip planning
- Even "simple" tasks need structure
- Leads to coordination failures

### Deploying Record Keeper Alone
- ALWAYS embed in teams
- Context preservation fails otherwise
- System explicitly prevents this

### Committing During Waves
- Breaks atomicity
- Complicates rollback
- Wait for wave completion

## Emergency Protocols

### Wave Failure
1. Stop all agent work
2. Document failure state
3. Update constitution with details
4. Plan recovery approach
5. Resume or restart as needed

### Critical Blocker
1. Agent reports blocker
2. Team Lead assesses impact
3. Attempt resolution (15 min)
4. Escalate if unresolved
5. Document resolution

---
*These protocols define execution flow - see system_core_rules.md for infrastructure requirements*