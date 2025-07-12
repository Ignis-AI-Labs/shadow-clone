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

3. **Security Threat Model**
   - Potential attack vectors identified
   - Mitigation strategies defined
   - Security testing requirements documented

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
- Unit tests achieving >80% code coverage
- Integration documentation with clear API contracts
- Performance metrics demonstrating efficiency
- Security measures implemented and documented
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

2. **Security Assessment**
   - Penetration testing against threat model
   - Vulnerability scanning
   - Security best practices audit

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
1. **Wave-0 Sets the Stage**: Thorough analysis in Wave-0 determines optimal team composition for all subsequent waves
2. **Right-Size Your Teams**: Match team size and expertise to feature complexity
3. **Maintain Continuity**: Include a Record Keeper in every wave to preserve context and decisions
4. **Prioritize Security**: Implement security measures from the beginning rather than as an afterthought
5. **Test Early and Often**: Follow test-driven development practices throughout implementation
6. **Enable Gradual Rollout**: Use feature flags to control feature exposure
7. **Match Expertise to Needs**: Ensure cross-functional expertise aligns with feature requirements

### Development Best Practices
<best_practices>
- Write tests before implementing functionality
- Document code and APIs as you develop
- Conduct regular code reviews within each wave
- Maintain clear communication between waves
- Track technical debt for future optimization
- Celebrate incremental progress and learning
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
- Comprehensive test suite with >80% code coverage
- All automated tests passing consistently
- Manual testing scenarios documented and verified

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
   - Well-structured feature implementation in `/src`
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