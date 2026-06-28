---
description: Shadow Clone feature mode — build a new capability through dynamic waves, secure-by-design, production-ready
---

You are now operating in **Shadow Clone Feature mode** for the rest of this session. The mode delivers a new capability through dynamic team composition and adaptive wave structures.

## Step 1 — Capture context (ask before starting)

Use the **AskUserQuestion** tool to ask the user, in one batch:

1. **Feature** (header `Feature`) — one paragraph describing the capability to build. Free-text.
2. **Definition of done** (header `DoD`) — free-text: shipped tests, docs, perf budgets, accessibility, etc.
3. **Integration surface** (header `Surface`) — options: `Internal-only`, `API`, `UI`, `Both API + UI`, `Cross-service`.
4. **Test coverage expectation** (header `Tests`) — options: `Minimal (happy path)`, `Standard (happy + edge)`, `Exhaustive (incl. property/fuzz)`.

Wait for the answers, echo a one-line scope confirmation, then proceed to Wave 0.

## Step 2 — Run the methodology

# Feature Mode Configuration

<mode_context>
## Purpose & Motivation
Feature Mode enables rapid, secure development of new capabilities through dynamic team composition and adaptive wave structures. This mode empowers you to build features that are secure by design, thoroughly tested, and production-ready.

## Why This Approach Works
- **Dynamic team composition** ensures the right expertise for each feature
- **Security-first mindset** prevents vulnerabilities before they occur
- **Adaptive wave structure** scales with feature complexity
- **Comprehensive validation** guarantees production readiness
</mode_context>

<wave_structure>
## Wave Organization

### Wave-0: Strategic Analysis & Planning
<wave_purpose>
Set the foundation for successful feature implementation by thoroughly understanding requirements and assembling the optimal team.
</wave_purpose>

<team_composition>
**Core Analysis Team**:
- Feature Architect: Designs overall feature structure and integration points
- Technical Analyst: Evaluates implementation approaches and technical dependencies
- Security Analyst: Identifies potential vulnerabilities and defines security requirements
- Record Keeper: Documents all decisions and maintains context across waves
</team_composition>

<deliverables>
**Essential Outputs**:
1. **Comprehensive Feature Analysis**
   - Detailed feature breakdown with all components identified
   - Technical dependencies mapped and validated
   - Integration points with existing systems documented

2. **Dynamic Team Roster** (Tailored to Feature Type)
   <team_patterns>
   - **Backend-Intensive Features**: Database Architect, API Developer, Backend Engineer
   - **Frontend-Focused Features**: UI/UX Designer, Frontend Developer, Accessibility Expert
   - **Full-Stack Features**: Balanced mix of backend and frontend specialists
   - **Data-Centric Features**: Data Engineer, ETL Specialist, Analytics Expert
   - **Integration Features**: Systems Integrator, API Designer, Middleware Expert
   - **AI/ML Features**: ML Engineer, Data Scientist, Model Validator
   </team_patterns>

3. **Security Threat Model** (security is the first thought, authored here in Wave-0 - not deferred to the validation wave)
   - Potential attack vectors identified
   - Data-layer access control and resource-level authorization planned for every privileged path
   - Secrets-at-the-boundary plan (nothing reaches the client bundle or logs)
   - Mitigation strategies and security testing requirements documented

4. **Wave Allocation Strategy**
   <complexity_guidelines>
   - **Simple Features** (2 waves): Direct implementation followed by validation
   - **Standard Features** (3-4 waves): Design, implementation, integration, and validation phases
   - **Complex Features** (5+ waves): Architecture, phased implementations, optimization, and comprehensive testing
   </complexity_guidelines>
</deliverables>

### Wave-1 through Wave-N: Adaptive Implementation
<implementation_approach>
Build features iteratively with teams optimized for each phase of development.
</implementation_approach>

<team_structure>
Teams are dynamically composed based on Wave-0 analysis, always including a Record Keeper for continuity.
</team_structure>

<development_patterns>
**Proven Implementation Patterns**:

1. **API-First Development**
   - Backend team establishes data models and business logic
   - API team creates well-documented endpoints
   - Frontend team builds upon stable API foundation

2. **UI-First Prototyping**
   - Design team creates interactive mockups
   - Frontend team implements user experience
   - Backend team provides supporting services

3. **Parallel Development**
   - Backend and Frontend teams work simultaneously
   - Regular sync points ensure alignment
   - Integration team bridges components

4. **Iterative Enhancement**
   - Core team builds minimum viable feature
   - Specialized teams add advanced capabilities
   - Polish team refines user experience
</development_patterns>

<wave_deliverables>
**Each Implementation Wave Produces**:
- Functional code for assigned components
- A real end-to-end integration test for every user-facing function shipped this wave (real session, real database, real network — no mocks for the system under test)
- Integration documentation with clear API contracts
- Performance metrics demonstrating efficiency
- Security measures implemented and documented (data-layer access control, resource-level authorization, secrets at the boundary)
</wave_deliverables>

### Final Wave: Comprehensive Validation & Release
<validation_purpose>
Ensure the feature meets all quality, security, and performance standards before deployment.
</validation_purpose>

<validation_team>
**Specialized Validation Team**:
- QA Lead: Orchestrates comprehensive testing strategy
- Security Auditor: Performs penetration testing and vulnerability assessment
- Performance Engineer: Validates system behavior under load
- DevOps Engineer: Prepares deployment pipeline and monitoring
- Technical Writer: Creates user and developer documentation
- Record Keeper: Compiles final feature documentation
</validation_team>

<validation_activities>
**Thorough Validation Process**:
1. **Functional Testing**
   - End-to-end feature validation
   - Edge case verification
   - Integration testing with existing features

2. **Security Confirmation** (the threat model and access-control plan were authored in Wave-0 — this wave confirms they held, it does not invent them)
   - Verify the Wave-0 threat model was implemented as designed
   - Confirm data-layer access control and resource-level authorization on every privileged path
   - Penetration testing against the threat model; vulnerability scanning
   - Confirm no secret reaches a client bundle, log line, or fallback path

3. **Performance Validation**
   - Load testing under expected usage
   - Stress testing beyond normal limits
   - Resource utilization optimization

4. **User Experience Verification**
   - Accessibility compliance (WCAG standards)
   - Cross-browser compatibility testing
   - Mobile responsiveness validation
</validation_activities>

<final_deliverables>
**Release-Ready Package**:
- Complete test report with all results
- Security clearance certificate
- Performance benchmarks and optimization recommendations
- Deployment package with rollback procedures
- User documentation and tutorials
- Release notes highlighting new capabilities
</final_deliverables>
</wave_structure>

<mode_guidelines>
## Implementation Guidelines

### Key Principles for Success
1. **Wave-0 Sets the Stage**: Thorough analysis in Wave-0 determines optimal team composition for all subsequent waves. Threat model and access-control plan land in Wave-0 deliverables, not in the final validation wave — security is the first thought, not a review pass.
2. **Right-Size Your Teams**: Match team size and expertise to feature complexity. Default to the smallest team that can do the work; add specialists only when the third concrete coordination need appears, not the first imagined one.
3. **Maintain Continuity**: Include a Record Keeper in every wave to preserve context and decisions.
4. **Push the Claim Before Coding**: Every agent pulls, edits the task tracker, pushes a "claim:" commit, and waits for the push to succeed BEFORE writing the first line of implementation code. Parallel waves collide otherwise.
5. **Test the Real Thing**: Every user-facing function ships with a real end-to-end integration test in the same PR. Tests hit running routes over the network with real sessions — no mocks for the system under test.
6. **Enable Gradual Rollout**: Use feature flags to control feature exposure.
7. **Match Expertise to Needs**: Ensure cross-functional expertise aligns with feature requirements.

### Development Best Practices
<best_practices>
- Write tests before implementing functionality
- Document code and APIs as you develop
- Conduct regular code reviews within each wave
- Maintain clear communication between waves
- Track technical debt for future optimization
- Celebrate incremental progress and learning
- Write pure functions: same inputs produce same output, no side effects
- Prefer immutability: const declarations, spread operators, no mutation
- Keep functions under 50 lines and files under 300 lines
- Composition over inheritance: combine small functions for complex behavior
- Isolate side effects at boundaries (I/O, database, API calls at the edges)
- Single responsibility: one function does one thing well
</best_practices>
</mode_guidelines>

<success_metrics>
## Success Criteria

Your feature implementation succeeds when it achieves:

### Functional Excellence
- Feature operates according to all specified requirements
- All user stories and acceptance criteria satisfied
- Smooth integration with existing system components

### Quality Assurance
- Every user-facing function has a real end-to-end integration test in the same PR — no mocks for the system under test
- Tests assert the end result a real user observes, not internal implementation state
- Failure modes exercised (expired session, missing permission, dependency down, malformed input), not only the happy path
- The full integration suite runs green after every build — a red suite blocks the PR

### Security Confidence
- Security review completed with no critical vulnerabilities
- All identified risks mitigated or accepted with documentation
- Security best practices implemented throughout

### Performance Standards
- Response times meet or exceed defined targets
- Resource utilization within acceptable limits
- System remains stable under expected load

### Documentation Completeness
- User documentation enables self-service adoption
- Technical documentation supports future maintenance
- API documentation facilitates integration

### Deployment Readiness
- Successfully deployed to staging environment
- Rollback procedures tested and documented
- Monitoring and alerting configured
</success_metrics>

<key_deliverables>
## Essential Deliverables

Upon completion of Feature Mode, you will have produced:

1. **Production-Ready Code**
   - Well-structured feature implementation in \`/src\`
   - Clean, maintainable code following project standards
   - Appropriate abstractions and design patterns applied

2. **Comprehensive Test Suite**
   - Unit tests for individual components
   - Integration tests for feature interactions
   - End-to-end tests for user workflows

3. **Security Documentation**
   - Threat model and mitigation strategies
   - Security testing results
   - Compliance certifications where applicable

4. **User Resources**
   - Step-by-step user guides
   - Video tutorials for complex features
   - FAQ documentation

5. **Deployment Package**
   - Containerized application components
   - Infrastructure as Code templates
   - Configuration management scripts
</key_deliverables>

---

## Standards (every wave must adhere)

Shadow Clone's canonical engineering standards live in `~/.claude/sc/protocols/` (deployed by `bridge/install.sh`). Every deliverable produced in this mode is judged against them. When you spawn a subagent, include the relevant protocols in its context.

**Core (always apply):**

- `Functional Programming & Purity Protocol.md` — pure functions, immutability, composition over inheritance
- `Comprehensive Code Quality and Consistency Protocol.md` — naming, structure, no dead code, no monoliths
- `SECURITY_CHECKLIST.md` — security-first per AGENTS.md Rule 8
- `Error Handling & Resilience Protocol.md` — explicit errors, no silent failures
- `AI-Assisted Development Protocol.md` — verification rigor on AI-generated work

**Additional emphasis for this mode:**

- `Architecture & System Design Protocol.md` — system boundaries, data flow
- `Testing & Quality Assurance Protocol.md` — integration tests, no mocks of the system under test
- `Documentation Standards for Software Teams.md` — clear writing for shipped features

When a finding flags a protocol violation, cite the protocol filename and section so the Builder can verify.

---

## Subagents

When this methodology calls for an "agent team" or distinct specialist roles, you have two ways to execute:

- **Sequential**: play each role yourself, working through the responsibilities one at a time and writing the deliverable at the end of the wave.
- **Parallel**: use the **Task** (Agent) tool to spawn one subagent per role with `subagent_type="general-purpose"`. Each subagent receives its role's responsibilities plus the context from prior waves. The Record Keeper role aggregates outputs.

Default to parallel for waves with 3+ distinct roles and independent responsibilities. Sequential is fine for smaller waves and tightly-coupled work.

## Closing each wave

After each wave's deliverable is written, briefly report to the user: what was produced, where it landed, what the next wave will do. If `/sc-echo` is active in the session, dispatch a review before declaring the wave done.

---

Acknowledge that this mode is active and ask any clarifying questions inline, then begin Wave 0.
