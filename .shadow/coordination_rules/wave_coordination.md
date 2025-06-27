<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Wave Coordination Rules

## 🔒 CRITICAL: File Reservation System

**BEFORE ANY FILE MODIFICATION**:
1. Check `.waves/file_reservations.md` for current locks
2. Only modify files YOU have reserved
3. Request reservation through team lead for new files
4. Release reservations when work is complete

**This prevents ALL file conflicts and ensures clean parallel execution.**

## Constitutional Authority Structure

### Central Coordination Authority (Project Constitution)
The `.waves/constitution.md` file serves as the central coordination authority that maintains overall project state and facilitates information exchange between sovereign agents.

### Agent Convergence Infrastructure
```
workspace_dir/.waves/
├── constitution.md              # Project constitution - central coordination authority
├── wave_status.md              # Constitutional state of all waves
├── agent_registry.md           # Registry of all sovereign agents and their domains
├── convergence_schedule.md     # Scheduled data convergence points
├── diplomatic_log.md           # Cross-team coordination and dependency resolution
├── file_registry.md            # Master registry of all project files
├── file_reservations.md        # Current file locks and reservations
├── wave_N/
│   ├── team_reports/           # Sovereign state reports from each team
│   │   ├── team_lead_report.md # Team lead (governor) consolidated report
│   │   ├── agent_1_state.md    # Individual agent state and findings
│   │   ├── agent_2_state.md    # Individual agent state and findings
│   │   └── convergence_log.md  # Team convergence session results
│   ├── dependencies.md         # Cross-team dependency tracking
│   └── integration_queue.md    # Ready deliverables awaiting integration
```

## Wave Execution Flow

### Pre-Wave Setup
- Verify prerequisite deliverables from previous waves
- Prepare workspace areas for current wave teams
- Initialize coordination mechanisms
- Load appropriate agent rules for all team members

### Wave Launch
- Launch all teams within the wave simultaneously
- Begin progress monitoring through constitutional authority
- Activate inter-team coordination protocols
- Initialize file reservation system for conflict prevention

### Wave Monitoring
- Track individual team progress through state reporting
- Monitor workspace changes and file reservations
- Facilitate cross-team communication through diplomatic channels
- Handle blockers and dependencies through constitutional authority

### Wave Completion
- Verify all wave deliverables against quality gates
- Conduct wave-level quality checks and integration testing
- Prepare handoff materials for next wave
- Archive wave artifacts and update constitutional records

### Inter-Wave Transition
- Review wave outcomes against objectives
- Adjust next wave plans based on results and learnings
- Brief next wave teams on handoff materials and dependencies
- Update project timeline and resource allocation if required

## Convergence Session Protocol

### Session Structure
1. **Pre-Convergence**: Agents update individual state files with current progress
2. **Data Exchange**: Team lead consolidates agent findings into team report
3. **Constitutional Update**: Team reports submitted to central coordination authority
4. **Dependency Resolution**: Constitutional authority identifies and resolves cross-team dependencies
5. **Next Assignment**: Updated priorities and assignments distributed back to sovereign agents

### Sovereign Agent Reporting Structure
- Each agent reports to team lead (regional governor)
- Team leads report to wave coordinator (federal authority)
- Wave coordinator reports to project constitution (central authority)
- All findings flow through structured hierarchy for proper integration

## Quality Gates

### Wave-Level Validation
- Wave objective achievement verification
- Team deliverable completeness assessment
- Inter-team coordination effectiveness evaluation
- Sprint timeline adherence monitoring

### Cross-Wave Integration Testing
- Dependency chain validation across waves
- Output compatibility verification between teams
- Performance impact assessment
- User experience continuity checks

### Constitutional Quality Standards
- Complete requirements satisfaction verification
- Documentation completeness assessment
- Integration readiness validation
- Deployment preparation standards

## Integration Process

### Wave-by-Wave Integration
- Integrate outputs within each completed wave
- Verify compatibility with previous wave outputs
- Resolve conflicts early and incrementally
- Maintain constitutional coordination throughout

### Cross-Wave Validation
- Test integration points between waves
- Verify dependency satisfaction across wave boundaries
- Check for regression issues in previous wave work
- Ensure architectural consistency

### Final Assembly
- Combine all wave outputs into cohesive deliverable
- Perform comprehensive system integration testing
- Ensure workspace reflects final integrated state
- Prepare final constitutional project report

## Document Update Coordination Protocol

### 🔄 Sequential Update Principle  
**FUNDAMENTAL RULE**: Multiple agents must NEVER update the same document simultaneously. Like humans in conversation, agents must take turns to maintain clarity and prevent conflicts.

**Why This Matters**: 
- Prevents merge conflicts
- Ensures document integrity
- Maintains clear communication
- Enables true parallel work (each agent works on different files)

### Update Coordination Rules

1. **Request-Grant-Update-Release Cycle**:
   ```
   Agent A: "REQUESTING UPDATE ACCESS: [filename]"
   Agent B: "ACCESS GRANTED - Standing by"
   Agent C: "ACCESS GRANTED - Standing by"
   Agent A: "UPDATING [filename] - Section [X]"
   [Agent A performs updates]
   Agent A: "UPDATE COMPLETE - [filename] released"
   ```

2. **Private Working Documents**:
   - Each team maintains `.waves/[team]_working_notes.md`
   - All findings drafted in private documents first
   - Shared documents updated only during convergence

3. **Convergence Session Updates**:
   - Teams present findings verbally (in sequence)
   - Designated "Document Master" consolidates updates
   - One update stream at a time
   - Clear completion signals before next update

4. **Section Ownership Protocol**:
   - Shared documents divided into clear sections
   - Each team owns specific sections
   - No cross-section editing without coordination
   - Executive sections updated by Wave Lead only

5. **Conflict Prevention**:
   - File reservation system prevents simultaneous access
   - Update queue managed by Constitutional Authority
   - Clear ownership boundaries established
   - Version tracking through sequential updates

### Communication Clarity Rules

1. **One Voice at a Time**:
   - Only one agent "speaks" (updates) at any moment
   - Other agents remain in "listening" mode
   - Clear turn-taking protocol enforced

2. **Update Announcements**:
   - Before: "PREPARING TO UPDATE [document] - [section]"
   - During: "CURRENTLY UPDATING [document] - [estimated time]"
   - After: "UPDATE COMPLETE - [summary of changes]"

3. **Acknowledgment Protocol**:
   - All agents must acknowledge update requests
   - Silence interpreted as system issue
   - Explicit confirmation required

This coordination ensures clean, conflict-free document updates and maintains the high quality standards of the Shadow Clone System. 