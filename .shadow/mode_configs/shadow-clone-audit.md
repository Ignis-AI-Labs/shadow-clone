<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Shadow Clone Audit Mode Configuration

## 🛡️ Comprehensive Security Audit Framework

Self-contained mode requiring NO project plan. Covers all essential security frameworks with optional customization.

## Configuration

**Deployment**: ~21-24 agents (split into multiple 10-agent batches)
**Operation**: Comprehensive security assessment across all frameworks

### Optional Customization
```bash
# Default comprehensive audit
claude "Load shadow-clone-prompt.md and execute with project_type=audit"

# Focus on specific areas
claude "Load shadow-clone-prompt.md and execute with project_type=audit - Focus on OWASP Top Ten and API security only"

# Industry-specific
claude "Load shadow-clone-prompt.md and execute with project_type=audit - Healthcare application requiring HIPAA compliance"
```

## Security Frameworks

### Core Assessments
- **OWASP**: Top Ten, ASVS, MASVS, API Security
- **NIST SSDF**: Secure Software Development Framework
- **CWE**: Common Weakness Enumeration patterns
- **Compliance**: GDPR, HIPAA, PCI DSS, SOX
- **Tools**: SAST/DAST, dependency scanning, IaC security

### Security Domains
1. **Authentication & Authorization**: IAM, MFA, RBAC, OAuth/OIDC
2. **Data Security**: Encryption, PII/PHI handling, retention
3. **Infrastructure**: Cloud, containers, CI/CD, network
4. **Application**: Input validation, XSS/CSRF, business logic
5. **Supply Chain**: Dependencies, licenses, build security
6. **Compliance**: Regulatory requirements, audit trails
7. **Quality & Performance**: Code complexity, bottlenecks, technical debt

## Agent Template
```
SECURITY AUDIT AGENT: [Specialization]
DOMAIN: [Authentication/Data/Infrastructure/Application/Supply Chain/Compliance/Quality]
WAVE: [Number]
FRAMEWORKS: [OWASP/NIST/CWE/Industry]

WORKSPACE: /root/repos/shadow-clone
WAVES DIRECTORY: $waves_directory

REQUIREMENTS:
1. Framework Integration
2. Complete File Analysis
3. Multi-Tool Validation
4. False Positive Prevention
5. Cross-Tool Correlation
6. Business Context Analysis
7. Expert Consensus
8. Practical Validation

TOOLS:
- SAST: [SonarQube/Semgrep/CodeQL]
- DAST: [OWASP ZAP/Burp Suite]
- Dependencies: [Snyk/OWASP Dependency-Check]
- Config: [Checkov/Terrascan]
```

## Deliverables

**3 Master Documents** (all teams contribute):

1. **SECURITY_AUDIT_REPORT.md**
   - Executive Summary
   - Critical Findings
   - Domain Analysis
   - Remediation Roadmap

2. **VULNERABILITY_REGISTER.md**
   - ID, Severity, Domain
   - Description, Evidence
   - Remediation, Status

3. **COMPLIANCE_MATRIX.md**
   - Framework coverage
   - Requirement status
   - Gap analysis

## Document Coordination

**Sequential Updates Only**:
1. Teams work in `wave-X/[team]_findings.md`
2. Convergence sessions consolidate
3. Document Master updates shared reports
4. Section ownership by domain

## Quality Assurance

**5-Layer Validation**:
1. Tool correlation
2. Code context analysis
3. Business logic validation
4. Dynamic testing
5. Expert consensus

**Metrics**:
- False positive rate <10%
- Expert consensus >95%
- Client challenge <5%

**Templates**: Use `.shadow/templates/` for all reports

## Example Wave Directory Structure

**Audit Mode Deliverables:**
```
$waves_directory/
├── wave-1/
│   ├── authentication_findings.md
│   ├── data_security_findings.md
│   ├── infrastructure_assessment.md
│   └── WAVE_1_CONVERGENCE.md
├── wave-2/
│   ├── api_security_findings.md
│   ├── application_vulnerabilities.md
│   ├── supply_chain_analysis.md
│   └── WAVE_2_CONVERGENCE.md
├── wave-3/
│   ├── compliance_assessment.md
│   ├── false_positive_validation.md
│   └── WAVE_3_CONVERGENCE.md
└── FINAL_DELIVERABLES/
    ├── SECURITY_AUDIT_REPORT.md
    ├── VULNERABILITY_REGISTER.xlsx
    ├── RISK_ASSESSMENT_MATRIX.md
    ├── REMEDIATION_ROADMAP.md
    └── EXECUTIVE_SUMMARY.pdf
```