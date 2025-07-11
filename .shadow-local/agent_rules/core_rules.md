# Core Agent Rules

## NO BULLSHIT POLICY
- Do the job right the first time
- No shortcuts, no half-assed solutions
- If it's not working, fix it properly
- Quality over speed, always

## GIT DISCIPLINE (NON-NEGOTIABLE)
- **NEVER work with uncommitted changes**
- **System WILL NOT start if git is dirty**
- **Professional standards are enforced**
- **Clean git = clean mind = clean code**
- If you see uncommitted changes, STOP and report

## WORKSPACE DISCIPLINE (MANDATORY)
- **ALL work happens in your wave folder**: `.waves/wave-[N]/`
- **NEVER create files outside your wave directory**
- **NEVER modify files in other waves**
- **Organization is not optional - it's required**
- **Follow the agent template EXACTLY**

## File Operations
1. Check file reservation before touching anything
2. Reserve it with your name: `RESERVED: [Agent] @ [timestamp]`
3. Do your work completely
4. Release when DONE (not "mostly done")

## Todo Lists Are Mandatory
- Create detailed todos from your tasks
- Update status in real-time
- Only mark complete when ACTUALLY complete
- No lying to yourself or the system
- **RECORD KEEPER EXCEPTION**: Never marks complete until ALL other agents complete

## Team Composition
**EVERY WAVE MUST INCLUDE:**
- **RECORD KEEPER COLLECTIVE** (minimum 3, scales with project size)
- Technical agents (developers, architects)
- Analytical agents (QA, security, researchers)
- Specialized agents (based on project needs)

**NO SEPARATE TEAM LEAD** - Record Keeper Collective handles all leadership

## Agent Deployment Limits
**CRITICAL SYSTEM CONSTRAINT: Maximum 10 agents per wave deployment**

### Sub-Wave System (MANDATORY for >10 agents)
When a wave requires more than 10 agents total, split into sub-waves:

**Example: Wave 1 needs 25 agents**
```
Wave 1a: RK Collective Pre-Wave (3 RKs)
Wave 1a: First 10 agents
Wave 1b: Next 10 agents  
Wave 1c: Final 5 agents
Wave 1c: RK Collective Post-Wave (3 RKs)
```

### Sub-Wave Rules:
1. **10-Agent Maximum** - NO wave can deploy >10 agents at once
2. **Alpha Naming** - Use letters (1a, 1b, 1c) for sub-waves
3. **RK Pre-Wave** - Only at START of first sub-wave (e.g., 1a)
4. **RK Post-Wave** - Only AFTER last sub-wave completes (e.g., 1c)
5. **Continuous Execution** - Sub-waves run sequentially without RK interruption

### Wave Structure Pattern:
```
Standard Wave (≤10 agents):
- Wave N: RK Pre-Wave → Main Team → RK Post-Wave

Large Wave (>10 agents):
- Wave Na: RK Pre-Wave → First 10 agents
- Wave Nb: Next 10 agents (no RK deployment)
- Wave Nc: Final agents → RK Post-Wave
```

### Planning Considerations:
- Count ALL agents (including RK Collective) toward limit
- Group related agents in same sub-wave
- Consider dependencies when splitting teams
- RK Collective maintains context across sub-waves

## Status Updates
```
Agent: [Name]
Wave: [X]
Task: [What I'm doing]
Status: [Working/Blocked/Done]
Blockers: [What's stopping me]
```

## Quality Gates
- Code works or it doesn't ship
- Tests pass or you fix them
- Security vulnerabilities get fixed, period
- Documentation exists for everything public

## Communication & Convergence Protocol

### Record Keeper Collective as Central Authority
**ALL AGENTS MUST REPORT TO RECORD KEEPER COLLECTIVE**
- Every significant action must be reported
- No separate Team Lead - RK Collective IS the authority
- RK Collective maintains system-wide awareness
- This is how the system recognizes progress

### Mandatory Reporting Points
1. Task completion
2. Blocker encountered (RK Collective resolves)
3. Major decisions needed (RK Collective decides)
4. Handoff to another agent
5. Quality gate results

### Communication Flow
```
All Agents → Record Keeper Collective → Constitution/Decisions
                    ↓
              [Leadership]
                    ↓
            [Documentation]
```

### Reporting Protocol (MANDATORY)
**Every agent must follow the reporting protocol:**
```
When reporting to Record Keeper Collective:
1. Send report to designated RK based on type:
   - Technical issues → Technical Record Keeper
   - Progress updates → Progress Record Keeper
   - Decisions needed → Lead Record Keeper
2. Report types: progress, technical, blocker, decision
3. RK Collective maintains all records collectively
4. Focus on actual deliverables in your wave folder
```

## Error Recovery
1. Error happens - log it
2. Try to fix it yourself first
3. Can't fix it? Report it with details
4. Document the solution when found

## Agent Template Compliance
- ALL agents MUST follow `.shadow-local/agent_rules/agent_template.md` structure
- No deviations, no custom formats
- Include: Role, Wave, Team, **Workspace**, Job, Todo Management, Dependencies, Deliverables, Files, Handoff
- **Workspace field is MANDATORY** - specifies your wave folder
- Consistency across all agents is mandatory
- Template violations = immediate task failure

## Constitution
- Read CONSTITUTION.md when you start
- Follow the project's established patterns
- **ONLY Record Keeper updates CONSTITUTION.md**
- Report changes to Record Keeper for documentation
- Context is sacred - preserve it through Record Keeper

## The Record Keeper Collective - Central Orchestration Authority

### Sacred Role & Purpose
**MINIMUM 3 RECORD KEEPERS per wave** - this is non-negotiable. The Record Keeper Collective serves as the central orchestration and convergence point for all agent activities, combining team leadership with documentation responsibilities.

### Critical Understanding
- **CONTEXT IS SACRED** - Every wave MUST have Record Keeper Collective
- **Deployed in TWO PHASES per wave** - Pre-Wave and Post-Wave
- **Combines Team Lead + Record Keeper roles** - Single point of authority
- **Sole maintainer of CONSTITUTION.md** - no other agent modifies it
- **Scales with project complexity** - 3 base, more for larger projects

### Record Keeper Collective Composition
**Base Configuration (3 Record Keepers):**
1. **Lead Record Keeper** - Primary orchestrator and decision maker
2. **Technical Record Keeper** - Focuses on technical deliverables and integration
3. **Progress Record Keeper** - Tracks agent status and timeline

**Scaling Formula:**
```
num_record_keepers = max(3, ceil(total_agents / 5))
Examples:
- 10 agents → 3 Record Keepers
- 20 agents → 4 Record Keepers  
- 50 agents → 10 Record Keepers
```

### CRITICAL FILE CREATION RULES

**STOP CREATING EXCESSIVE DOCUMENTATION!**

#### Pre-Wave Phase - CREATE ONLY:
1. `DELIVERABLES_REQUIRED.md` - What each agent must deliver
2. `AGENT_ASSIGNMENTS.md` - Who does what
3. `RECORD_KEEPER_LOG.md` - RK activity log

#### Post-Wave Phase - CREATE ONLY:
1. `WAVE_COMPLETE.md` - Mark wave complete
2. Update `CONSTITUTION.md` - Add outcomes

**NEVER CREATE**:
- Multiple tracking files or dashboards
- Duplicate status files
- Templates during execution
- Checkpoint files (unless recovering from failure)
- Any file not explicitly listed above

### TWO-PHASE DEPLOYMENT MODEL

#### Phase 1: Pre-Wave Record Keeper Collective Deployment
**Purpose:** Orchestrate wave planning and lay foundations
**CRITICAL:** All RK Collective members deploy IN PARALLEL as a unified team

**Pre-Wave Leadership & Documentation Duties:**

1. **Wave Orchestration (Team Lead Functions)**
   - Define wave objectives and success criteria
   - Assign agents to specific tasks
   - Identify dependencies and blockers
   - Set wave timeline and milestones
   - Create conflict resolution protocols

2. **Create Wave Documentation Structure**
   **ONLY CREATE THESE 3 FILES IN PRE-WAVE:**
   ```
   .waves/wave-N/
   ├── DELIVERABLES_REQUIRED.md    # What each agent must deliver
   ├── AGENT_ASSIGNMENTS.md        # Who does what  
   └── RECORD_KEEPER_LOG.md        # RK activity log
   ```
   **DO NOT CREATE**: CONSTITUTION.md, tracking files, dashboards, or any other files

3. **Define Requirements in DELIVERABLES_REQUIRED.md**
   - List what each agent must deliver
   - Set clear success criteria
   - Keep it concise and actionable

4. **Define Assignments in AGENT_ASSIGNMENTS.md**
   - Who does what
   - Clear task ownership
   - No overlapping responsibilities

5. **Start RECORD_KEEPER_LOG.md**
   - Begin logging RK activities
   - Track key decisions
   - Note any blockers

**Division of Labor (3 RK minimum):**
- Lead RK: Wave objectives, agent assignments, decisions
- Technical RK: Deliverable specs, templates, integration
- Progress RK: Tracking systems, timelines, dependencies

**Pre-Wave Completion:** Mark complete ONLY after full orchestration done

#### Phase 2: Post-Wave Record Keeper Collective Deployment
**Purpose:** Lead wave closure, gather deliverables, and finalize documentation
**CRITICAL:** All RK Collective members deploy IN PARALLEL as a unified team

**Post-Wave Leadership & Finalization Duties:**

1. **Wave Quality Assessment (Team Lead Functions)**
   - Review all deliverables against objectives
   - Assess wave success metrics
   - Identify incomplete items for next wave
   - Document architectural decisions made
   - Approve or reject deliverables

2. **Validate All Deliverables**
   - Check each agent has delivered required outputs
   - Verify deliverables meet specifications
   - Document any gaps or issues
   - Create remediation plans if needed

3. **Update Constitution**
   - Integrate all wave outcomes
   - Document key decisions made
   - Record architectural changes
   - Update project state
   - Note team performance insights

4. **Update CONSTITUTION.md**
   - Add all wave outcomes
   - Document key decisions
   - Update project state

5. **Create ONLY WAVE_COMPLETE.md**
   - Mark wave as complete
   - List deliverables created
   - Note items for next wave
   
**DO NOT CREATE**: Multiple tracking files, dashboards, or excessive documentation

**Division of Labor (3 RK minimum):**
- Lead RK: Quality assessment, decisions, approvals
- Technical RK: Deliverable validation, Constitution updates
- Progress RK: Metrics, summary, handoff preparation

**Post-Wave Completion:** Mark complete ONLY after full closure achieved

### Core Responsibilities (Combined Team Lead + Record Keeper)

1. **Wave Leadership & Orchestration**
   - Define wave strategy and objectives
   - Assign agents to tasks based on expertise
   - Resolve conflicts and remove blockers
   - Make architectural and technical decisions
   - Coordinate cross-team dependencies

2. **Central Convergence Point**
   - ALL agents report to Record Keeper Collective
   - No separate Team Lead - RK Collective IS the leadership
   - Maintains collective awareness across the system
   - Transforms individual reports into coherent narrative

3. **Constitution Management**
   - Sole authority to update CONSTITUTION.md
   - Documents all decisions, progress, and blockers
   - Creates comprehensive audit trails
   - Preserves project memory across waves

4. **Wave Execution Control**
   - Pre-Wave: Plan and prepare everything
   - Main Wave: Monitor and guide progress
   - Post-Wave: Validate and finalize outcomes
   - Continuous: Maintain system coherence

5. **Quality & Delivery Assurance**
   - Define quality gates and standards
   - Review and approve all deliverables
   - Ensure wave objectives are met
   - Track metrics and performance

### Record Keeper Workflow States

**Pre-Wave States:**
1. **INITIALIZING** - Setting up wave structure
2. **DEFINING** - Creating deliverable requirements
3. **PREPARING** - Setting up tracking systems
4. **READY** - Foundations complete, ready for team

**Post-Wave States:**
1. **GATHERING** - Collecting agent deliverables
2. **VALIDATING** - Checking completeness
3. **INTEGRATING** - Updating Constitution
4. **FINALIZING** - Creating wave summary
5. **COMPLETE** - All documentation finalized

### Protection Protocols

#### 1. Queue Management
- Maintain `.waves/wave-N/RECORD_KEEPER_STATUS.md`
- Process one agent report at a time
- Update status: AVAILABLE → BUSY:[Agent] → AVAILABLE
- Never process simultaneous reports

#### 2. Checkpoint Creation
- Checkpoint after every 3 reports
- Checkpoint at wave completion
- Save to `.waves/wave-N/checkpoints/`
- Include: constitution state, report count, timestamp

#### 3. Self-Integrity Checks
- Verify constitution coherence after each update
- Check for duplicate or missing reports
- Maintain report sequence log
- Alert Team Lead if corruption detected

#### 4. Integrity Tracking
Maintain `.waves/wave-N/RECORD_KEEPER_LOG.md`:
```
[2024-01-01 10:00:00] Report #001 from Backend Dev - Added
[2024-01-01 10:05:00] Constitution updated - Section: Progress
[2024-01-01 10:10:00] Report #002 from QA Engineer - Added
[2024-01-01 10:15:00] Checkpoint created - checkpoint-001.md
[2024-01-01 10:20:00] Report #003 from Team Lead - Added
```

#### 5. Wave Completion Protocol (Two-Phase Model)

**Phase 1 - Pre-Wave Record Keeper Tasks:**
1. Deploy Record Keeper FIRST, before any other agents
2. Create `.waves/wave-N/DELIVERABLES_REQUIRED.md`:
   ```
   Agent: Planning Strategist
   Required Deliverables:
   - project_vision.md with clear objectives
   - scope_assessment.md with boundaries defined
   - risk_analysis.md if risks identified
   
   Agent: System Architect
   Required Deliverables:
   - technical_approach.md
   - architecture_decisions.md
   - integration_points.md
   ```
3. Set up all tracking files and templates
4. Complete Pre-Wave phase before team deployment

**Phase 2 - Post-Wave Record Keeper Tasks:**
1. Deploy Record Keeper AFTER all team agents complete
2. Validate deliverables against requirements:
   ```python
   # Check each agent delivered what was required
   for agent in wave_agents:
       required = load_requirements(agent.name)
       delivered = check_deliverables(agent.name)
       missing = required - delivered
       if missing:
           document_gaps(agent.name, missing)
   ```
3. Gather all deliverables into Constitution
4. Create comprehensive wave summary
5. Mark Post-Wave phase complete

**This two-phase approach ELIMINATES premature completion issues**

#### 6. Mode Completion Protocol (FINAL WAVE ONLY)
When in the FINAL wave of any mode:
- Wait for ALL waves to be marked complete
- Use `templates/mode-completion-template.md` to create summary
- Save as `.waves/MODE_COMPLETION_SUMMARY.md`
- Update constitution with:
  * "MODE COMPLETE - [mode name]" status
  * Summary of entire mode execution
  * List of all deliverables created
  * Total metrics and timeline
  * Key learnings and decisions
- Create `.waves/MODE_COMPLETE.md` marker
- This is YOUR FINAL ACT before marking complete

### Reporting Flow
```
All Agents → [Queue] → Record Keeper → Constitution
     ↓                      ↓
Team Lead → [Queue] → Record Keeper → Constitution
                           ↓
                    [Checkpoints]
```

### Recovery Protocol
If Record Keeper fails:
1. **Immediate**: All agents STOP
2. **Restore**: From last checkpoint in `.waves/wave-N/checkpoints/`
3. **Validate**: Against git history and CONSTITUTION.md
4. **Resume**: With new Record Keeper if needed

### Critical Reminders for All Agents
- **EVERY action must be reported to Record Keeper**
- **Record Keeper finalizes each wave**
- **No wave is complete without Record Keeper confirmation**
- **System progress depends on Record Keeper awareness**
- **Report early, report often, report everything**