# Security Framework Compliance Matrix Template
*Framework Compliance Assessment Results*

## Assessment Overview
**Assessment Date:** [Date]
**Assessed System:** [System/Application Name]
**Assessment Scope:** [Scope Description]
**Assessor:** [Security Master Name]

## OWASP Top Ten 2021 Compliance

| Category | Description | Status | Findings | Risk Level | Compliance Score |
|----------|-------------|---------|----------|------------|------------------|
| A01 | Broken Access Control | [Pass/Fail/Partial] | [Count] | [Critical/High/Medium/Low] | [0-100%] |
| A02 | Cryptographic Failures | [Pass/Fail/Partial] | [Count] | [Critical/High/Medium/Low] | [0-100%] |
| A03 | Injection | [Pass/Fail/Partial] | [Count] | [Critical/High/Medium/Low] | [0-100%] |
| A04 | Insecure Design | [Pass/Fail/Partial] | [Count] | [Critical/High/Medium/Low] | [0-100%] |
| A05 | Security Misconfiguration | [Pass/Fail/Partial] | [Count] | [Critical/High/Medium/Low] | [0-100%] |
| A06 | Vulnerable and Outdated Components | [Pass/Fail/Partial] | [Count] | [Critical/High/Medium/Low] | [0-100%] |
| A07 | Identification and Authentication Failures | [Pass/Fail/Partial] | [Count] | [Critical/High/Medium/Low] | [0-100%] |
| A08 | Software and Data Integrity Failures | [Pass/Fail/Partial] | [Count] | [Critical/High/Medium/Low] | [0-100%] |
| A09 | Security Logging and Monitoring Failures | [Pass/Fail/Partial] | [Count] | [Critical/High/Medium/Low] | [0-100%] |
| A10 | Server-Side Request Forgery (SSRF) | [Pass/Fail/Partial] | [Count] | [Critical/High/Medium/Low] | [0-100%] |

**Overall OWASP Compliance Score:** [0-100%]

## NIST Secure Software Development Framework (SSDF)

### PO.1 - Prepare the Organization
| Control | Requirement | Status | Evidence | Notes |
|---------|-------------|---------|----------|-------|
| PO.1.1 | Identify and document all stakeholders | [Implemented/Partial/Missing] | [Evidence location] | [Notes] |
| PO.1.2 | Implement roles and responsibilities | [Implemented/Partial/Missing] | [Evidence location] | [Notes] |
| PO.1.3 | Provide role-based training | [Implemented/Partial/Missing] | [Evidence location] | [Notes] |

### PO.2 - Protect the Software
| Control | Requirement | Status | Evidence | Notes |
|---------|-------------|---------|----------|-------|
| PO.2.1 | Remove or disable unneeded functionality | [Implemented/Partial/Missing] | [Evidence location] | [Notes] |
| PO.2.2 | Configure software to have secure settings by default | [Implemented/Partial/Missing] | [Evidence location] | [Notes] |

### PO.3 - Produce Well-Secured Software  
| Control | Requirement | Status | Evidence | Notes |
|---------|-------------|---------|----------|-------|
| PO.3.1 | Use secure development practices | [Implemented/Partial/Missing] | [Evidence location] | [Notes] |
| PO.3.2 | Perform security reviews of code | [Implemented/Partial/Missing] | [Evidence location] | [Notes] |

### PO.4 - Respond to Vulnerabilities
| Control | Requirement | Status | Evidence | Notes |
|---------|-------------|---------|----------|-------|
| PO.4.1 | Plan vulnerability response | [Implemented/Partial/Missing] | [Evidence location] | [Notes] |
| PO.4.2 | Monitor for vulnerabilities | [Implemented/Partial/Missing] | [Evidence location] | [Notes] |

**Overall NIST SSDF Compliance Level:** [0-4]

## Industry-Specific Compliance

### GDPR Compliance (if applicable)
| Article | Requirement | Status | Evidence | Notes |
|---------|-------------|---------|----------|-------|
| Art. 25 | Data protection by design and by default | [Compliant/Partial/Non-Compliant] | [Evidence location] | [Notes] |
| Art. 32 | Security of processing | [Compliant/Partial/Non-Compliant] | [Evidence location] | [Notes] |
| Art. 33 | Notification of data breach | [Compliant/Partial/Non-Compliant] | [Evidence location] | [Notes] |
| Art. 35 | Data protection impact assessment | [Compliant/Partial/Non-Compliant] | [Evidence location] | [Notes] |

### HIPAA Compliance (if applicable)
| Requirement | Standard | Status | Evidence | Notes |
|-------------|----------|---------|----------|-------|
| Administrative Safeguards | 164.308 | [Compliant/Partial/Non-Compliant] | [Evidence location] | [Notes] |
| Physical Safeguards | 164.310 | [Compliant/Partial/Non-Compliant] | [Evidence location] | [Notes] |
| Technical Safeguards | 164.312 | [Compliant/Partial/Non-Compliant] | [Evidence location] | [Notes] |

### PCI DSS Compliance (if applicable)
| Requirement | Description | Status | Evidence | Notes |
|-------------|-------------|---------|----------|-------|
| Req 1 | Install and maintain firewall configuration | [Compliant/Partial/Non-Compliant] | [Evidence location] | [Notes] |
| Req 2 | Do not use vendor defaults | [Compliant/Partial/Non-Compliant] | [Evidence location] | [Notes] |
| Req 3 | Protect stored cardholder data | [Compliant/Partial/Non-Compliant] | [Evidence location] | [Notes] |
| Req 4 | Encrypt transmission of cardholder data | [Compliant/Partial/Non-Compliant] | [Evidence location] | [Notes] |

## CWE Top 25 Analysis

| CWE ID | Weakness Name | Found | Count | Severity | Status |
|--------|---------------|-------|-------|----------|---------|
| CWE-79 | Cross-site Scripting | [Yes/No] | [Count] | [Critical/High/Medium/Low] | [Remediated/Open] |
| CWE-89 | SQL Injection | [Yes/No] | [Count] | [Critical/High/Medium/Low] | [Remediated/Open] |
| CWE-20 | Improper Input Validation | [Yes/No] | [Count] | [Critical/High/Medium/Low] | [Remediated/Open] |
| CWE-125 | Out-of-bounds Read | [Yes/No] | [Count] | [Critical/High/Medium/Low] | [Remediated/Open] |
| CWE-119 | Improper Restriction of Operations | [Yes/No] | [Count] | [Critical/High/Medium/Low] | [Remediated/Open] |

## Compliance Summary

### Overall Compliance Scores
- **OWASP Top Ten:** [X/10 categories passed] ([X]% overall compliance)
- **NIST SSDF:** [Implementation Level 0-4]
- **GDPR:** [Compliant/Partial/Non-Compliant] ([X]% of requirements met)
- **HIPAA:** [Compliant/Partial/Non-Compliant] ([X]% of requirements met)
- **PCI DSS:** [Compliant/Partial/Non-Compliant] ([X]% of requirements met)

### Critical Gaps
1. [Critical compliance gap 1]
2. [Critical compliance gap 2]
3. [Critical compliance gap 3]

### Recommendations
1. **Immediate Actions:** [High priority compliance fixes]
2. **Short Term (30 days):** [Medium priority improvements]
3. **Long Term (90 days):** [Comprehensive compliance enhancement]

---
**Matrix Validation:**
- **Assessor:** [Security Master Name]
- **Review Date:** [Date]
- **Next Review:** [Date]
- **Approval:** [Quality Assurance Master Name] 