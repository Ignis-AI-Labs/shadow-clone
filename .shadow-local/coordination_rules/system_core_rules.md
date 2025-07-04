# System Core Rules

## System Requirements

### Pre-Execution Validation
- Valid git repository with clean working tree
- CONSTITUTION.md exists and is readable
- .shadow-local/ directory structure intact
- Sufficient disk space for artifacts

### Team Composition (MANDATORY)
**Every deployment MUST include:**
- Technical agents (developers, architects)
- Analytical agents (QA, security)
- Leadership agents (team lead, product owner)
- **RECORD KEEPER** - NEVER deployed alone, always embedded in team

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

### Git Rules
- NO commits during wave execution
- Clean working tree between waves
- Single atomic commit per wave
- Branch format: `shadow-clone/[mode]/[description]`

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

### Status Format
```
Agent: [Name]
Wave: [N]
Status: [Working/Blocked/Complete]
Files: [Reserved files]
Blockers: [Issues preventing progress]
```

### Handoff Protocol
- Complete all assigned work
- Update status to "Complete"
- Release all file reservations
- Document what was done
- Clear next steps for receiver

## Constitution Management

### Update Triggers
- After each wave completion
- When major decisions made
- Before mode transitions
- On significant discoveries

### Update Requirements
- Preserve all historical context
- Add new learnings/decisions
- Update current state section
- Never delete prior information

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