# Constitution Update Protocol

## Purpose
This protocol ensures consistent, accurate, and timely updates to the project CONSTITUTION.md, preventing context loss and enabling seamless project continuation.

## Constitution Lifecycle

### 1. Initialization (Wave-0)
```
Location: {waves_directory}/CONSTITUTION.md
Created by: Record Keeper Agent
Timing: Before ANY implementation work begins
```

**Initial Constitution MUST Include:**
- Project identity and goals
- Technical stack decisions
- Architecture overview
- Success criteria
- Known constraints
- Initial timeline

### 2. Wave Updates
Each wave completion triggers a mandatory constitution update:

#### Pre-Wave Requirements
- Record Keeper reads current CONSTITUTION.md
- Team Lead briefs team on relevant context
- All agents aware of prior decisions

#### During Wave
- Record Keeper monitors all agent activities
- Key decisions logged in real-time
- Dependencies tracked as introduced
- Problems and solutions documented

#### Wave Completion
- Record Keeper consolidates all updates
- Team Lead reviews for accuracy
- Constitution updated with wave summary
- Next wave can proceed only after update

### 3. Update Template

```markdown
## Wave-{N} Update ({date})

### Wave Objectives
- **Planned**: What we set out to achieve
- **Completed**: What was actually delivered
- **Deferred**: What moved to future waves

### Technical Decisions
| Decision | Rationale | Alternatives Considered | Impact |
|----------|-----------|------------------------|---------|
| [Decision 1] | [Why we chose this] | [What else we looked at] | [How it affects the project] |

### Architecture Changes
- **Added**: New components/services
- **Modified**: Changed existing systems
- **Removed**: Deprecated elements

### Dependencies
- **New Libraries**: [name@version - purpose]
- **External Services**: [service - integration type]
- **API Changes**: [endpoint modifications]

### Lessons Learned
- **What Worked Well**: Approaches to repeat
- **Challenges Faced**: Problems encountered
- **Solutions Applied**: How we resolved issues
- **Future Recommendations**: Improvements for next waves

### State for Next Wave
- **Current Status**: Overall project state
- **Open Items**: Unresolved issues
- **Technical Debt**: Items to address
- **Next Steps**: Clear direction forward
```

## Quality Standards

### Accuracy Requirements
- **Factual Only**: No speculation or assumptions
- **Verifiable**: All claims backed by code/documentation
- **Complete**: No significant decisions omitted
- **Clear**: Understandable by future teams

### Review Process
1. Record Keeper drafts update
2. Team Lead reviews for completeness
3. Technical accuracy verified against code
4. Constitutional authority approves
5. Update committed to repository

## Emergency Protocols

### Context Loss Detection
**Warning Signs:**
- Conflicting agent reports
- Missing decision rationale
- Unclear project direction
- Repeated work/mistakes

**Recovery Steps:**
1. STOP all work immediately
2. Reconstruct from:
   - Agent deliverables
   - Git history
   - State reports
   - Code comments
3. Update constitution with findings
4. Resume only after context restored

### Conflict Resolution
When agents report conflicting information:
1. Record Keeper investigates both claims
2. Evidence gathered from actual implementation
3. Team Lead makes determination
4. Constitution updated with resolution
5. Clear guidance provided to all agents

## Integration with Other Systems

### File Organization
- Constitution updates respect file_organization_rules.md
- Always located at `{waves_directory}/CONSTITUTION.md`
- Backup copies maintained after each update

### Wave Coordination
- Wave cannot complete without constitution update
- Next wave cannot start until constitution current
- Quality gates check for constitution compliance

### Agent Coordination
- All agents read constitution at wave start
- State reports include constitution-relevant updates
- Record Keeper has special access privileges

## Validation Rules

### Mandatory Checks
- [ ] Constitution exists at correct location
- [ ] Last update matches last wave completion
- [ ] All major decisions documented
- [ ] Technical stack accurately reflected
- [ ] Dependencies completely listed
- [ ] Next steps clearly defined

### Automated Validation
System performs automatic checks:
- File exists and readable
- Follows required structure
- Contains mandatory sections
- Timestamp is current
- No placeholder content

## Resume Mode Requirements

### Enabling Seamless Continuation
The constitution must support perfect project resumption:

**Required Information:**
- Exact project state
- All configuration details
- Environment setup needs
- External service requirements
- Incomplete work items
- Known issues/blockers

**Resume Checklist:**
```markdown
## Resume Mode Checklist
- [ ] Current git branch: [branch-name]
- [ ] Last commit: [hash]
- [ ] Environment variables needed: [list]
- [ ] Services to start: [list]
- [ ] Incomplete tasks: [list]
- [ ] Next immediate steps: [list]
```

## Enforcement

### Violations
- Missing constitution updates = Wave failure
- Incomplete updates = Blocking issue
- Inaccurate information = Critical bug

### Accountability
- Record Keeper: Primary responsibility
- Team Lead: Review and approval
- Constitutional Authority: Final validation
- All Agents: Contribution requirement

## Future Evolution

### Blockchain Integration (Planned)
- Immutable constitution history
- Cryptographic verification
- Cross-project learning
- Consensus-based updates

### AI Learning Integration
- Pattern recognition from constitutions
- Best practice extraction
- Automated suggestion system
- Context prediction models

---

**Remember**: The CONSTITUTION is not just documentation - it's the project's memory and guide. Every update strengthens the project's ability to succeed. Context, once lost, is destructive to progress. This protocol ensures we never lose our way.