# System Core Rules

## System Requirements

### Pre-Execution Validation
- Valid git repository with clean working tree
- CONSTITUTION.md exists and is readable
- .shadow-local/ directory structure intact
- Sufficient disk space for artifacts

### Mandatory System Initialization (FIRST STEP)
**Before ANY execution, the system MUST:**
1. Load system_core_rules.md and wave_coordination_protocol.md
2. Verify all required files exist:
   - `.shadow-local/agent_rules/core_rules.md`
   - `.shadow-local/agent_rules/specialized_agent_rules.md`
   - `.shadow-local/coordination_rules/system_core_rules.md`
   - `.shadow-local/coordination_rules/wave_coordination_protocol.md`
3. Create wave-0 directory structure
4. Initialize tracking systems (RECORD_KEEPER_STATUS.md, etc.)
5. Validate git branch strategy

**FAILURE TO INITIALIZE = SYSTEM FAILURE**

### Team Composition (MANDATORY)
**Every deployment MUST include:**
- Technical agents (developers, architects)
- Analytical agents (QA, security)
- Leadership agents (team lead, product owner)
- **RECORD KEEPER** - Central convergence point for ALL agents

**CRITICAL: Record Keeper Protocol**
- Acts as the system's collective awareness
- ALL agents report to Record Keeper (including Team Lead)
- Never deployed alone - always embedded in team
- Enables progress recognition through centralized reporting

### Workspace Structure
```
project/
├── .shadow-local/          # Local system files
│   ├── agent_rules/        # Agent definitions
│   ├── coordination_rules/ # System rules (this file)
│   └── shadow-clone-prompt.md
├── .waves/                 # Wave execution artifacts
│   ├── wave-0/            # Planning wave
│   ├── wave-1/            # Implementation waves
│   └── wave-N/            # Final convergence
│       ├── AGENT_ROSTER.md # List of all agents in wave
│       └── COMPLETION_STATUS.md # Tracks who has completed
├── .waves-archive/         # Archived waves from previous sprints
│   ├── [mode]-[date]/     # Archived by mode and timestamp
│   └── README.md          # Archive index and history
├── src/                   # Source code
└── CONSTITUTION.md        # Project memory
```

## File Operations

### Reservation System
```
RESERVED: [AgentName] @ [ISO-8601 timestamp]
```
- Check before modifying ANY file
- One agent per file at any time
- Release immediately when done
- No partial reservations

### Git Rules & Development Workflow

#### Branch Strategy
- **ALWAYS work on a development branch**, never directly on main/production
- Dev branch format: `dev-[mode]-[description]` (e.g., `dev-feature-auth-system`)
- Main/production branch is sacred - requires manual review and merge

#### Commit Rules
- NO commits during wave execution
- Clean working tree between waves
- Single atomic commit per wave
- Descriptive commit messages explaining what was accomplished

#### Merge Protocol
1. All development happens on dev branches
2. After completing all waves and testing:
   - Notify user that dev work is complete
   - Provide summary of changes
   - Request user to review and test
3. Only merge to main/production after:
   - User has manually tested
   - User explicitly approves merge
   - All quality gates pass
4. User performs the actual merge (educational opportunity)

#### Professional Git Workflow
This workflow implements industry standards:
- Separation of development and production code
- Comprehensive testing before deployment
- Clear review and approval processes
- Traceable version control history

### File Placement
- Source code: Project directories
- Wave artifacts: `.waves/wave-N/`
- System files: `.shadow-local/`
- Reports: `.waves/wave-N/reports/`

## Quality Gates

### Code Standards
- Production-ready code only
- No commented-out code blocks
- Proper error handling throughout
- Security vulnerabilities = immediate stop

### Testing Requirements
- 100% test pass rate before handoff
- Integration tests for all APIs
- Security scan must pass
- Performance within requirements

### Documentation
- All public APIs documented
- Architecture decisions recorded
- Complex logic explained inline
- README updated if needed

## Agent Communication

### Status Format (Report to Record Keeper)
```
Agent: [Name]
Wave: [N]
Status: [Working/Blocked/Complete]
Files: [Reserved files]
Blockers: [Issues preventing progress]
Report To: Record Keeper (MANDATORY)
```

### Convergence Through Record Keeper
**The Record Keeper is the system's recognition mechanism:**
1. All progress flows through Record Keeper
2. Record Keeper synthesizes collective state
3. Constitution reflects unified progress
4. No agent works in isolation
5. Team awareness emerges through Record Keeper

### Record Keeper Protection Protocol

#### Communication Queue System
**CRITICAL: Agents must communicate with Record Keeper sequentially**
```
Before reporting:
1. Check: .waves/wave-N/RECORD_KEEPER_STATUS.md
2. If status = "BUSY", wait 5 minutes and retry
3. If status = "AVAILABLE", update to "BUSY: [YourAgentName]"
4. Submit your report
5. Update status back to "AVAILABLE"
```

#### Checkpoint System
Record Keeper must create checkpoints:
- Every 10 reports received
- At end of each wave
- Before any major constitution update
- Format: `.waves/wave-N/checkpoints/constitution-[timestamp].md`

#### Integrity Verification
Signs of Record Keeper context loss:
- Contradictory entries in constitution
- Missing wave summaries
- Duplicate agent reports
- Chronological inconsistencies

If detected:
1. STOP all agent work immediately
2. Team Lead initiates recovery protocol
3. Restore from last valid checkpoint
4. Re-collect reports since checkpoint

### Handoff Protocol
- Complete all assigned work
- **Report completion to Record Keeper**
- Update status to "Complete"
- Release all file reservations
- Document what was done
- Clear next steps for receiver
- **Confirm Record Keeper has logged handoff**

### Wave Completion Order (MANDATORY)
**Record Keeper is ALWAYS the last agent to complete:**
1. All technical agents complete their work
2. All agents report final status to Record Keeper
3. Record Keeper collects and synthesizes all reports
4. Record Keeper updates constitution with wave summary
5. Record Keeper creates final checkpoint
6. ONLY THEN does Record Keeper mark self as complete

**VIOLATION = SYSTEM FAILURE**: If Record Keeper completes before other agents, the wave is invalid

### Mode Completion Protocol (CRITICAL)
**When ALL waves in a mode are complete:**
1. Record Keeper creates MODE COMPLETION SUMMARY
2. Updates constitution with:
   - Final status: "MODE COMPLETE - [mode name]"
   - Summary of all wave outcomes
   - Key deliverables produced
   - Total time and resources used
   - Lessons learned
3. Creates `.waves/MODE_COMPLETE.md` marker file
4. ONLY after these steps can mode be considered finished

**NO MODE IS COMPLETE WITHOUT RECORD KEEPER'S FINAL SUMMARY**

## Mode Transitions & Wave Archiving

### Sprint Lifecycle Management
When transitioning between modes or starting new sprints:

1. **Pre-Transition Checklist**
   - Ensure all waves are complete
   - Run final quality validation
   - Update CONSTITUTION.md with sprint summary
   - Merge any pending changes to dev branch

2. **Wave Archiving Protocol**
   ```bash
   # Archive format: .waves-archive/[mode]-[YYYY-MM-DD-HHMM]/
   # Example: .waves-archive/feature-2025-07-08-1430/
   ```
   - Move entire .waves/ directory to archive
   - Create archive README with:
     - Sprint objectives and outcomes
     - Mode used and configuration
     - Key decisions and learnings
     - Links to relevant commits
   - Update CONSTITUTION.md with archive reference

3. **Clean Slate Preparation**
   - Create fresh .waves/ directory
   - Reset wave counter to 0
   - Clear any temporary artifacts
   - Verify clean git working tree

### Mode Transition Guidelines
- **Research → Plan**: Archive research findings, prepare planning workspace
- **Plan → Feature**: Archive plans, create feature branch from dev
- **Feature → Debug**: Archive feature waves, maintain same branch
- **Debug → Optimize**: Archive debug logs, prepare performance baseline
- **Optimize → Refactor**: Archive metrics, plan refactoring scope
- **Any → Audit**: Full archive with security focus, separate audit branch

## Constitution Management

### Update Triggers
- After each wave completion
- When major decisions made
- Before mode transitions
- On significant discoveries
- After sprint archival

### Update Requirements
- **ONLY Record Keeper modifies CONSTITUTION.md**
- Preserve all historical context
- Add new learnings/decisions
- Update current state section
- Never delete prior information
- Reference archived waves when relevant

### Why Single Maintainer
- Ensures consistency of voice and format
- Prevents conflicting updates
- Allows other agents to focus on their specializations
- Creates trusted single source of truth
- Record Keeper synthesizes all perspectives into coherent narrative

## Record Keeper Recovery System

### Black Box Recording
**Every agent must maintain local report copies:**
```
.waves/wave-N/black-box/
├── [AgentName]-report-[timestamp].md
├── [AgentName]-status-[timestamp].md
└── [AgentName]-handoff-[timestamp].md
```

### Recovery Protocol
If Record Keeper fails or loses context:

1. **Immediate Actions**
   - All agents STOP work
   - Team Lead takes control
   - Freeze current wave state

2. **Reconstruction Process**
   - Collect all black box recordings
   - Identify last valid checkpoint
   - Reconstruct timeline from agent reports
   - Validate against git history

3. **Resume Operations**
   - New Record Keeper appointed if needed
   - Load from checkpoint + black box data
   - Verify all agents accounted for
   - Resume with integrity verification mode ON

### Prevention Measures
- Record Keeper works on dedicated files only
- No complex operations during report processing
- Simple append-only constitution updates
- Clear separation between reading and writing phases

## Error Recovery

### System Failures
1. Stop all agent work immediately
2. Record system state in constitution
3. Document failure details
4. Create recovery plan
5. Resume from last stable state

### Validation Errors
- Fix immediately if possible
- Document if cannot fix
- Escalate to Team Lead
- Block wave completion until resolved

---
*These rules define the core system infrastructure - see wave_coordination_protocol.md for execution flow*