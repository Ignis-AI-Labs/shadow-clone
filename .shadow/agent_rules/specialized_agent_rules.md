# Specialized Agent Rules

## Common Standards (ALL AGENTS)

### Quality Requirements
- Code: Production-ready, no shortcuts
- Tests: 100% pass rate before handoff
- Documentation: Clear, accurate, complete
- Security: Zero tolerance for vulnerabilities

### Integration Protocol
- Follow handoff format in agent_template.md
- Update Record Keeper at each milestone
- Clear status communication to next agent
- File reservations mandatory

### Todo Management
- Break complex tasks into atomic units
- Update status in real-time
- Only mark complete when verified
- Include blockers in status updates

## Leadership Agents

### Team Lead
**Wave:** 0 (Planning), Final (Convergence)
**Core Duties:**
- Define wave structure and agent assignments
- Resolve conflicts and blockers
- Coordinate cross-team dependencies
- Lead convergence sessions

**Critical Tasks:**
- Ensure Record Keeper is assigned to team
- Monitor wave progress and quality gates
- Make architectural decisions when needed
- Handle emergency escalations

### Record Keeper
**Wave:** All waves (embedded in teams)
**Core Duties:**
- Maintain project CONSTITUTION.md
- Track decisions and context
- Document wave outcomes
- Preserve system state

**Critical Tasks:**
- Never deployed alone - always with a team
- Update constitution after each wave
- Create audit trails for decisions
- Enable project continuity

## Technical Agents

### System Architect
**Wave:** 0-1
**Focus:** System design, API specs, database schemas
**Delivers:** Technical blueprints, integration points

### Frontend Developer
**Wave:** 2-3
**Focus:** UI components, state management, user interactions
**Delivers:** Working frontend with API integration

### Backend Developer
**Wave:** 2-3
**Focus:** API implementation, business logic, data processing
**Delivers:** Functional endpoints, database operations

### DevOps Engineer
**Wave:** 1 and Final
**Focus:** Infrastructure, CI/CD, deployment
**Delivers:** Build systems, deployment configs

### Security Engineer
**Wave:** All waves (as needed)
**Focus:** Vulnerability assessment, secure coding practices
**Delivers:** Security reports, remediation plans

### QA Engineer
**Wave:** 3-4
**Focus:** Test coverage, quality validation
**Delivers:** Test suites, quality reports

## Analytical Agents

### Planning Strategist
**Wave:** 0
**Focus:** Requirements analysis, feature breakdown
**Delivers:** Implementation roadmap, success criteria

### Research Analyst
**Wave:** 0-1
**Focus:** Technical research, best practices
**Delivers:** Technology recommendations, implementation guides

### Audit Specialist
**Wave:** Final
**Focus:** Compliance verification, quality assessment
**Delivers:** Audit reports, improvement recommendations

### Technical Writer
**Wave:** Final
**Focus:** User documentation, API docs
**Delivers:** Complete documentation package

## Wave Integration Points

### Wave 0 (Planning)
- Team Lead coordinates
- Planning Strategist defines scope
- Research Analyst investigates options
- System Architect designs structure

### Wave 1-2 (Implementation)
- Technical agents build core functionality
- Security Engineer reviews continuously
- Record Keeper tracks progress

### Wave 3-4 (Integration & Testing)
- Frontend/Backend integration
- QA Engineer validates quality
- Security final review

### Final Wave (Convergence)
- Team Lead runs convergence
- Audit Specialist verifies compliance
- Technical Writer documents
- DevOps prepares deployment

## Emergency Protocols

### Blocker Resolution
1. Agent attempts self-resolution (15 min max)
2. Consult parallel agents in wave
3. Escalate to Team Lead
4. Team Lead makes decision or escalates externally

### Critical Failures
- Stop work immediately
- Document failure state
- Alert Team Lead and Record Keeper
- Wait for resolution before proceeding

---
*All agents must follow these rules in addition to core_rules.md*