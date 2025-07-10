# Audit Mode

## Purpose
Comprehensive security and compliance assessment across all system components.
Identifies vulnerabilities, compliance gaps, and provides actionable remediation plans.

## Wave Structure

### Wave-0: Scope Discovery & Planning
**Team**: Audit Lead, Compliance Officer, Security Architect, Record Keeper

**Critical Tasks**:
- Analyze application type and architecture
- Determine which Core Assessments apply:
  - **OWASP**: Top Ten, ASVS, MASVS, API Security
  - **NIST SSDF**: Secure Software Development Framework
  - **CWE**: Common Weakness Enumeration patterns
  - **Compliance**: GDPR, HIPAA, PCI DSS, SOX (as applicable)
  - **Tools**: SAST/DAST, dependency scanning, IaC security
- Prioritize from 7 Security Domains based on app type:
  1. **Authentication & Authorization**: IAM, MFA, RBAC, OAuth/OIDC
  2. **Data Security**: Encryption, PII/PHI handling, retention
  3. **Infrastructure**: Cloud, containers, CI/CD, network
  4. **Application**: Input validation, XSS/CSRF, business logic
  5. **Supply Chain**: Dependencies, licenses, build security
  6. **Compliance**: Regulatory requirements, audit trails
  7. **Quality & Performance**: Code complexity, bottlenecks, technical debt
- Create comprehensive plan even without user input

**Outputs**:
- **Audit Assessment Matrix** - which frameworks apply and why
- **Domain Priority Map** - ranked 1-7 domains by risk/relevance
- **Compliance Requirements** - specific regulations that apply
- Wave allocation based on selected domains:
  - 2-3 priority domains: 2-3 waves
  - 4-5 domains: 4-5 waves  
  - 6-7 domains: 6+ waves (comprehensive audit)
- Tool configuration for applicable scanners

### Wave-1 to Wave-N: Domain Assessments (Dynamic)
**Consistent Team Structure**: Security Auditor, Domain Expert, Tool Specialist, Record Keeper

**Execution Based on Wave-0 Priority Map**:
- Focus on highest priority domains first
- Apply relevant frameworks per domain
- Use appropriate tools for each assessment
- Ensure comprehensive coverage without redundancy

**Example Domain Focus by App Type**:
- **Web Applications**: Authentication, Application, Data Security priority
- **APIs/Microservices**: API Security, Authentication, Supply Chain focus
- **Infrastructure/DevOps**: Infrastructure, Supply Chain, Compliance emphasis
- **Healthcare/Finance**: Compliance, Data Security, Authentication critical
- **E-commerce**: Data Security, Application, Authentication priority

**Outputs per wave**:
- Domain-specific vulnerability findings
- Framework compliance status (OWASP, NIST, etc.)
- Risk assessments with business impact
- Tool scan results with validated findings
- Remediation recommendations by severity

### Final Wave: Consolidation & Reporting
**Team**: Audit Lead, Senior Security Analyst, Compliance Officer, Technical Writer, Record Keeper

**Primary Output**: `SECURITY_AUDIT_REPORT.md` - Comprehensive security assessment
**Template**: Uses `templates/SECURITY_AUDIT_REPORT_TEMPLATE.md` for complete coverage

**Additional Outputs**:
- VULNERABILITY_REGISTER.md - Detailed vulnerability inventory
- COMPLIANCE_MATRIX.md - Framework compliance tracking

## Key Deliverables
- Comprehensive security assessment
- Prioritized vulnerability list with severity ratings
- Compliance gap analysis
- Remediation roadmap with timelines
- Executive presentation

## Mode-Specific Rules
- **Wave-0 determines audit focus** - not all domains apply to all apps
- **Framework selection based on context** - use relevant standards only
- **Proactive scope definition** - create comprehensive plan even without user input
- **5-Layer validation**: Tool correlation, code context, business logic, dynamic testing, expert consensus
- Cross-reference findings between security domains
- Evidence required with reproducible steps
- NO skipping major compliance issues
- False positive rate must be <10%

## Success Criteria
- All core assessment areas covered
- Vulnerabilities documented with severity (Critical/High/Medium/Low)
- Compliance gaps identified and tracked
- Remediation plan approved
- Stakeholder sign-off received