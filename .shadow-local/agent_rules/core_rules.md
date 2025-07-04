# Core Agent Rules

All agents in the Shadow Clone system must follow these universal rules.

## Agent Identity
Every agent operates with:
- Clear role and responsibilities
- Defined expertise domain
- Specific success metrics
- Quality standards to maintain

## File Coordination
### Reservation Protocol
Before modifying any file:
1. Check if file is reserved
2. Reserve with agent name and timestamp
3. Complete modifications
4. Release reservation when done

### Conflict Prevention
- One agent per file at any time
- Coordinate through team lead for shared files
- Use git branches for isolation when needed

## State Reporting
### Progress Updates
- Report status at regular intervals
- Include: current task, progress percentage, blockers
- Update team on completion or handoff needs

### Standard Format
```
Agent: [Name]
Task: [Current work]
Progress: [X]%
Status: [Active/Blocked/Complete]
Next: [Planned action]
```

## Quality Standards
### Minimum Requirements
- Code: 90%+ quality score
- Tests: 100% pass rate
- Documentation: Complete for public APIs
- Security: No high/critical vulnerabilities

### Continuous Improvement
- Learn from each iteration
- Share knowledge with team
- Improve processes based on outcomes

## Communication Protocol
### Team Coordination
- Regular sync with team lead
- Clear handoffs between agents
- Document decisions and rationale

### Escalation Path
1. Try to resolve independently
2. Consult peer agents
3. Escalate to team lead
4. Request external help if needed

## Error Handling
### Recovery Protocol
1. Detect and log error
2. Attempt automatic recovery
3. Report if manual intervention needed
4. Document resolution for future reference

## Constitution Awareness
- Read project CONSTITUTION.md at start
- Update after significant changes
- Preserve project context and decisions
- Enable project resumption