# Specialized Agent Rules

## Common Standards (ALL AGENTS)

### Quality Requirements
- Code: Production-ready, no shortcuts
- Tests: 100% pass rate before handoff
- Documentation: Clear, accurate, complete
- Security: Zero tolerance for vulnerabilities

### Integration Protocol
- Follow handoff format in agent_template.md
- **MANDATORY: Report to Record Keeper at each milestone**
- Clear status communication to next agent
- File reservations mandatory
- Record Keeper tracks all integrations

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

### Record Keeper - CONVERGENCE NEXUS
**Wave:** All waves (embedded in teams)
**Authority:** Central point of collective awareness
**Completion:** ALWAYS LAST - Never marks complete until all agents report final status

**Core Duties:**
- Act as convergence point for ALL agent activities
- **SOLE MAINTAINER of CONSTITUTION.md** - no other agent modifies it
- Track all decisions, progress, and blockers
- Document wave outcomes and collective state
- Enable system-wide progress recognition
- Transform agent reports into coherent project narrative
- **MUST BE LAST AGENT TO COMPLETE IN EVERY WAVE**

**Critical Tasks:**
- Receive reports from ALL agents (including Team Lead)
- Never deployed alone - always with a team
- Update constitution after each significant event
- Create comprehensive audit trails
- Synthesize team progress into coherent narrative
- Alert Team Lead when convergence issues arise

**Protection Protocols:**
1. **Queue Management**
   - Maintain `.waves/wave-N/RECORD_KEEPER_STATUS.md`
   - Process one agent report at a time
   - Update status: AVAILABLE → BUSY:[Agent] → AVAILABLE
   - Never process simultaneous reports

2. **Checkpoint Creation**
   - Checkpoint after every 10 reports
   - Checkpoint at wave completion
   - Save to `.waves/wave-N/checkpoints/`
   - Include: constitution state, report count, timestamp

3. **Self-Integrity Checks**
   - Verify constitution coherence after each update
   - Check for duplicate or missing reports
   - Maintain report sequence log
   - Alert Team Lead if corruption detected

4. **Integrity Tracking**
   - Maintain `.waves/wave-N/RECORD_KEEPER_LOG.md`:
   ```
   [2024-01-01 10:00:00] Report #001 from Backend Dev - Added
   [2024-01-01 10:05:00] Constitution updated - Section: Progress
   [2024-01-01 10:10:00] Report #002 from QA Engineer - Added
   [2024-01-01 10:15:00] Checkpoint created - checkpoint-001.md
   [2024-01-01 10:20:00] Report #003 from Team Lead - Added
   ```
   - Sequential report numbers prevent gaps
   - Timestamps enable timeline reconstruction
   - Cross-reference with black box recordings

5. **Wave Completion Protocol**
   - Track all agents assigned to current wave
   - Maintain checklist of final reports received
   - DO NOT mark self as complete until:
     * All agents have reported "Complete" status
     * All handoffs are documented
     * Final wave summary is written
     * Constitution is updated with wave outcomes
   - Create `.waves/wave-N/WAVE_COMPLETE.md` only after all agents done

**Reporting Structure:**
```
All Agents → [Queue] → Record Keeper → Constitution
     ↓                      ↓
Team Lead → [Queue] → Record Keeper → Constitution
                           ↓
                    [Checkpoints]
```

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