# SECURITY AUDIT REPORT

## Executive Summary

**Application**: [Name]  
**Audit Date**: [Date]  
**Audit Type**: Comprehensive / Targeted / Compliance  
**Overall Risk Rating**: 🔴 CRITICAL / 🟠 HIGH / 🟡 MEDIUM / 🟢 LOW

### Key Findings Summary
- **Total Vulnerabilities**: [X]
- **Critical**: [X] | **High**: [X] | **Medium**: [X] | **Low**: [X]
- **Compliance Status**: [X]% Compliant
- **Recommended Actions**: Immediate remediation required / Scheduled fixes needed / Minor improvements

### Top Critical Issues
1. **[Issue Name]** - [One-line impact description]
2. **[Issue Name]** - [One-line impact description]
3. **[Issue Name]** - [One-line impact description]

## Audit Scope & Methodology

### Frameworks Applied
- [ ] OWASP Top Ten 2021
- [ ] OWASP ASVS Level [1/2/3]
- [ ] OWASP MASVS Level [1/2]
- [ ] NIST SSDF
- [ ] CWE Top 25
- [ ] PCI DSS v4.0
- [ ] GDPR
- [ ] HIPAA
- [ ] SOX

### Security Domains Assessed
| Domain | Status | Findings |
|--------|---------|----------|
| Authentication & Authorization | 🔴🟠🟡🟢 | [X issues] |
| Data Security | 🔴🟠🟡🟢 | [X issues] |
| Infrastructure | 🔴🟠🟡🟢 | [X issues] |
| Application Security | 🔴🟠🟡🟢 | [X issues] |
| Supply Chain | 🔴🟠🟡🟢 | [X issues] |
| Compliance | 🔴🟠🟡🟢 | [X issues] |
| Quality & Performance | 🔴🟠🟡🟢 | [X issues] |

### Testing Methodology
- **Static Analysis (SAST)**: [Tools used]
- **Dynamic Analysis (DAST)**: [Tools used]
- **Dependency Scanning**: [Tools used]
- **Infrastructure Scanning**: [Tools used]
- **Manual Code Review**: [Hours spent]
- **Penetration Testing**: [Scope]

## Detailed Vulnerability Findings

### CRITICAL Vulnerabilities

#### CVE-[XXXX] / CWE-[XXX]: [Vulnerability Name]
**Severity**: CRITICAL (CVSS 9.0-10.0)  
**Domain**: [Security Domain]  
**Location**: `path/to/file.ext:line`  

**Description**:
[Detailed description of the vulnerability]

**Impact**:
- [Business impact]
- [Technical impact]
- [Compliance impact]

**Proof of Concept**:
```[language]
// Vulnerable code
[code sample]

// Attack vector
[exploit example]
```

**Remediation**:
```[language]
// Secure implementation
[fixed code]
```

**References**:
- [OWASP/CWE/CVE link]
- [Best practice guide]

---

### HIGH Vulnerabilities
[Repeat format for each high vulnerability]

### MEDIUM Vulnerabilities
[Table format for medium vulnerabilities]

| ID | Vulnerability | Location | CWE | Fix Effort |
|----|---------------|-----------|-----|------------|
| M1 | [Name] | [File:line] | CWE-XXX | [Hours] |

### LOW Vulnerabilities
[Summary table only]

## Compliance Assessment

### OWASP Top Ten Coverage
| Category | Status | Findings | Remediation |
|----------|--------|-----------|-------------|
| A01:2021 – Broken Access Control | ❌⚠️✅ | [Details] | [Actions] |
| A02:2021 – Cryptographic Failures | ❌⚠️✅ | [Details] | [Actions] |
| A03:2021 – Injection | ❌⚠️✅ | [Details] | [Actions] |
| A04:2021 – Insecure Design | ❌⚠️✅ | [Details] | [Actions] |
| A05:2021 – Security Misconfiguration | ❌⚠️✅ | [Details] | [Actions] |
| A06:2021 – Vulnerable Components | ❌⚠️✅ | [Details] | [Actions] |
| A07:2021 – Auth Failures | ❌⚠️✅ | [Details] | [Actions] |
| A08:2021 – Software & Data Integrity | ❌⚠️✅ | [Details] | [Actions] |
| A09:2021 – Logging Failures | ❌⚠️✅ | [Details] | [Actions] |
| A10:2021 – SSRF | ❌⚠️✅ | [Details] | [Actions] |

### Regulatory Compliance
| Regulation | Applicable | Status | Gaps |
|------------|------------|---------|------|
| GDPR | Yes/No | [X]% | [List] |
| HIPAA | Yes/No | [X]% | [List] |
| PCI DSS | Yes/No | [X]% | [List] |
| SOX | Yes/No | [X]% | [List] |

## Risk Analysis

### Risk Matrix
```
         Impact →
    │ Low  │ Med  │ High │ Crit │
────┼──────┼──────┼──────┼──────┤
Crit│      │      │  R3  │ R1,R2│ ↑
High│      │  R5  │  R4  │      │ L
Med │  R8  │ R6,R7│      │      │ i
Low │R9,R10│      │      │      │ k
    └──────┴──────┴──────┴──────┘ e
                                  l
                                  i
```

### Business Impact Assessment
| Risk | Likelihood | Impact | Business Consequence |
|------|------------|---------|---------------------|
| Data Breach | High/Med/Low | $[X]M | [Description] |
| Service Disruption | High/Med/Low | $[X]K/hour | [Description] |
| Compliance Violation | High/Med/Low | $[X]M fine | [Description] |

## Remediation Roadmap

### Immediate Actions (24-48 hours)
| Priority | Issue | Fix | Effort | Owner |
|----------|--------|-----|---------|--------|
| 1 | [Critical issue] | [Action] | [Hours] | [Team] |

### Short-term (1 week)
| Priority | Issue | Fix | Effort | Owner |
|----------|--------|-----|---------|--------|
| 4 | [High issue] | [Action] | [Days] | [Team] |

### Medium-term (1 month)
| Priority | Issue | Fix | Effort | Owner |
|----------|--------|-----|---------|--------|
| 7 | [Medium issue] | [Action] | [Days] | [Team] |

### Long-term (3 months)
- Implement security training program
- Establish security champions
- Integrate security into CI/CD
- Regular security assessments

## Security Posture Improvements

### Current vs Target State
| Metric | Current | Target | Gap |
|---------|---------|---------|-----|
| Vulnerability Density | [X/KLOC] | [Y/KLOC] | [%] |
| Mean Time to Patch | [X days] | [Y days] | [%] |
| Security Test Coverage | [X]% | [Y]% | [%] |
| Compliance Score | [X]% | [Y]% | [%] |

### Recommended Security Controls
1. **Technical Controls**
   - [Control description and benefit]
   
2. **Process Controls**
   - [Control description and benefit]
   
3. **Administrative Controls**
   - [Control description and benefit]

## Technical Appendices

### A. Tool Output Summary
```
[Tool]: [Version]
Total Issues: [X]
Critical: [X], High: [X], Medium: [X], Low: [X]
False Positives: [X]
```

### B. Vulnerable Dependencies
| Package | Current | Secure | CVEs | Severity |
|---------|---------|---------|------|----------|
| [name] | [version] | [version] | [list] | [level] |

### C. Configuration Issues
| Service | Issue | Risk | Fix |
|---------|--------|------|-----|
| [name] | [config] | [risk] | [action] |

### D. Code Quality Metrics
- Cyclomatic Complexity: [Average]
- Code Duplication: [%]
- Technical Debt: [Hours]
- Security Debt: [Hours]

## Validation & Sign-off

### Audit Team
- **Lead Auditor**: [Name] - [Date]
- **Security Architect**: [Name] - [Date]
- **Compliance Officer**: [Name] - [Date]

### Validation Checklist
- [ ] All automated scans completed
- [ ] Manual review performed
- [ ] False positives eliminated
- [ ] Business impact assessed
- [ ] Remediation plan realistic
- [ ] Report peer-reviewed

### Next Audit
- **Scheduled Date**: [Date]
- **Type**: Follow-up / Full
- **Focus Areas**: [List]

---
*This security audit report is confidential and proprietary. Distribution is limited to authorized personnel only.*

*Report Generated: [Timestamp]*
*Report Version: [Version]*
*Classification: CONFIDENTIAL*