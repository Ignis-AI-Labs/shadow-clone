export const QUALITY_GATES = `<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Quality Gates

## Overview
Quality gates are mandatory checkpoints that ensure every aspect of the Shadow Clone System maintains master craftsman standards. No weak links allowed - every gate must be passed.

## Core Quality Standards

### Universal Minimums (Non-Negotiable)
- **Overall Quality Score**: ≥90%
- **Code Coverage**: ≥80% (≥90% for critical paths)
- **Test Pass Rate**: 100% for unit tests, ≥95% for integration tests
- **Security Vulnerabilities**: 0 critical, 0 high
- **Documentation Coverage**: 100% for public APIs
- **Performance Regression**: 0% (no slowdowns allowed)

## Gate Categories

### 1. Code Quality Gates

#### Static Analysis
- **Complexity**: Cyclomatic complexity <10 per method
- **Duplication**: <3% duplicate code
- **Code Smells**: 0 blockers, <5 critical
- **Technical Debt**: <5 days per KLOC
- **Maintainability**: Grade A or B

#### Code Review
- **Peer Review**: 100% of code peer-reviewed
- **Review Coverage**: All changes reviewed before merge
- **Review Actions**: All comments addressed
- **Approval Required**: Minimum 1 senior developer
- **Security Review**: Required for auth/crypto/data handling

### 2. Testing Gates

#### Test Coverage Requirements
\`\`\`
Unit Tests:
- Minimum: 80% overall
- Critical Paths: 90%
- New Code: 85%
- Bug Fixes: 100% (test for specific bug)

Integration Tests:
- API Endpoints: 100%
- Database Operations: 100%
- External Services: Mocked or tested
- Error Scenarios: Comprehensive

E2E Tests:
- Critical User Journeys: 100%
- Cross-browser: All supported browsers
- Mobile: Responsive testing required
\`\`\`

#### Test Quality Metrics
- **Test Reliability**: No flaky tests allowed
- **Test Speed**: Unit tests <5 minutes total
- **Test Independence**: Tests run in any order
- **Test Documentation**: Clear test descriptions
- **Test Maintenance**: Regular test refactoring

### 3. Security Gates

#### Vulnerability Scanning
- **SAST**: Static security testing on all code
- **DAST**: Dynamic testing on running application
- **Dependencies**: All dependencies scanned
- **Container Scanning**: All images scanned
- **Infrastructure**: IaC security validated

#### Security Standards
\`\`\`
Authentication:
- Multi-factor when available
- Session management secure
- Password policies enforced
- Token expiration implemented

Authorization:
- Role-based access control
- Principle of least privilege
- Resource-level permissions
- Audit trail complete

Data Protection:
- Encryption at rest
- Encryption in transit
- PII handling compliant
- Secure key management
\`\`\`

### 4. Performance Gates

#### Response Time Limits
- **Page Load**: <3 seconds (first contentful paint)
- **API Response**: <200ms average, <1s P99
- **Database Queries**: <100ms average
- **Background Jobs**: Defined SLA per job type

#### Resource Utilization
- **CPU Usage**: <70% average, <90% peak
- **Memory Usage**: No memory leaks, stable consumption
- **Network**: Optimized payload sizes
- **Storage**: Efficient data management

#### Scalability Requirements
- **Concurrent Users**: Handle expected load +50%
- **Data Volume**: Perform well with 2x expected data
- **Geographic Distribution**: CDN for global users
- **Graceful Degradation**: Features degrade safely

### 5. Documentation Gates

#### Code Documentation
- **Public APIs**: 100% documented
- **Complex Functions**: Comprehensive comments
- **Architecture Decisions**: ADRs for major choices
- **Configuration**: All options documented
- **Examples**: Working examples for APIs

#### User Documentation
- **Installation Guide**: Step-by-step instructions
- **User Manual**: Complete feature documentation
- **API Reference**: Auto-generated + examples
- **Troubleshooting**: Common issues covered
- **FAQ**: Frequently asked questions

### 6. Operational Gates

#### Deployment Readiness
- **Build Success**: 100% reproducible builds
- **Environment Parity**: Dev/Staging/Prod aligned
- **Configuration Management**: Externalized configs
- **Rollback Tested**: <5 minute rollback
- **Monitoring Ready**: All key metrics tracked

#### Observability Requirements
\`\`\`
Logging:
- Structured logging implemented
- Log levels appropriate
- No sensitive data logged
- Log retention configured
- Centralized log management

Monitoring:
- Health checks implemented
- Key metrics identified
- Dashboards created
- Alerts configured
- SLIs/SLOs defined

Tracing:
- Distributed tracing enabled
- Critical paths traced
- Performance bottlenecks visible
- Error tracking integrated
\`\`\`

## Gate Enforcement

### Automated Enforcement
\`\`\`python
def enforce_quality_gate(component, gate_type):
    gate_config = load_gate_configuration(gate_type)
    results = run_gate_checks(component, gate_config)
    
    if results.failed_checks:
        block_progression()
        generate_remediation_report(results.failed_checks)
        notify_team(results)
        return False
    
    certify_gate_passage(component, gate_type)
    return True
\`\`\`

### Manual Gates
Some gates require human validation:
- Architecture review
- Security threat modeling
- UX/UI review
- Business logic validation
- Compliance verification

## Quality Gate Workflow

### 1. Pre-Gate Preparation
- Run local quality checks
- Fix identified issues
- Prepare documentation
- Gather metrics

### 2. Gate Execution
- Trigger automated checks
- Perform manual reviews
- Collect all results
- Generate report

### 3. Gate Results
**Pass**: 
- Proceed to next phase
- Document compliance
- Update metrics

**Fail**:
- Stop progression
- Generate issue report
- Create remediation plan
- Schedule re-evaluation

### 4. Remediation
- Address all failures
- Re-run failed checks
- Document fixes
- Request re-review

## Continuous Quality Monitoring

### Real-Time Tracking
- Dashboard with all quality metrics
- Trend analysis for early warning
- Automated alerts for degradation
- Team performance metrics

### Quality Debt Management
- Track quality debt items
- Prioritize remediation
- Allocate fix time each sprint
- Prevent debt accumulation

## Gate Customization

### Project-Specific Gates
While maintaining minimums, projects can add:
- Industry-specific compliance
- Additional security requirements
- Stricter performance needs
- Enhanced documentation standards

### Progressive Gate Tightening
- Start with baseline requirements
- Increase standards over time
- Learn from production issues
- Evolve gates based on needs

## Quality Gate Reporting

### Gate Status Report
\`\`\`markdown
## Quality Gate Status
**Component**: [name]
**Gate Type**: [type]
**Date**: [timestamp]

### Results Summary
- Overall Status: [PASS/FAIL]
- Score: [X/100]
- Critical Issues: [count]
- Warnings: [count]

### Detailed Results
[Specific metric results]

### Action Items
[Required remediation if failed]
\`\`\`

## No Weak Links Protocol

### Weak Link Detection
Any component failing quality gates is a weak link:
- Immediate escalation
- Team mobilization
- Priority remediation
- Re-validation required

### System Protection
- Weak components isolated
- Integration blocked
- Rollback if needed
- Quality first, always

## Remember
Quality gates are not obstacles - they are the guardians of excellence. Every gate passed is a testament to master craftsmanship. Every gate failed is an opportunity to achieve excellence. No weak links, no exceptions.`;