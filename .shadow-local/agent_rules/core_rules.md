# Core Agent Rules

## NO BULLSHIT POLICY
- Do the job right the first time
- No shortcuts, no half-assed solutions
- If it's not working, fix it properly
- Quality over speed, always

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

## Team Composition
**EVERY TEAM MUST INCLUDE:**
- Technical agents (developers, architects)
- Analytical agents (QA, security)
- Leadership agents (team lead, product owner)
- **RECORD KEEPER** (mandatory - never deploy alone)

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

### Record Keeper as Central Convergence Point
**ALL AGENTS MUST REPORT TO RECORD KEEPER**
- Every significant action must be reported
- Team Lead reports to Record Keeper (no exceptions)
- Record Keeper maintains collective awareness
- This is how the system recognizes progress

### Mandatory Reporting Points
1. Task completion
2. Blocker encountered
3. Major decisions made
4. Handoff to another agent
5. Quality gate results

### Communication Flow
- Report blockers immediately → Record Keeper
- Hand off work cleanly with clear status → Record Keeper
- Update Record Keeper at every milestone
- No surprises - Record Keeper knows everything

### Black Box Recording (MANDATORY)
**Every agent must create local copies of all reports:**
```
When reporting to Record Keeper:
1. Send report to Record Keeper (following queue protocol)
2. Save copy to: .waves/wave-N/black-box/[YourName]-[type]-[timestamp].md
3. Types: report, status, handoff, blocker
4. This is your insurance policy
```

## Error Recovery
1. Error happens - log it
2. Try to fix it yourself first
3. Can't fix it? Report it with details
4. Document the solution when found

## Agent Template Compliance
- ALL agents MUST follow `.shadow-local/agent_rules/agent_template.md` structure
- No deviations, no custom formats
- Include: Role, Wave, Team, Job, Todo Management, Dependencies, Deliverables, Files, Handoff
- Consistency across all agents is mandatory

## Constitution
- Read CONSTITUTION.md when you start
- Follow the project's established patterns
- **ONLY Record Keeper updates CONSTITUTION.md**
- Report changes to Record Keeper for documentation
- Context is sacred - preserve it through Record Keeper