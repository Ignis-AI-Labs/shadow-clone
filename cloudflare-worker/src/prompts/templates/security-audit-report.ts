export const SECURITY_AUDIT_REPORT_TEMPLATE = `<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Security Audit Report

**Project**: [Project Name]  
**Date**: [Audit Date]  
**Audit Type**: [Comprehensive/Focused/Compliance]  
**Lead Auditor**: Shadow Clone System v2.0

---

## Executive Summary

### Security Score
\`\`\`
Overall: [Score]/100
├── Critical Issues: [Count]
├── High Risk: [Count]
├── Medium Risk: [Count]
└── Low Risk: [Count]
\`\`\`

### Business Impact
**Immediate Risks**: [Brief description of critical business risks]  
**Compliance Status**: [PASS/FAIL] - [Standards checked]  
**Action Required**: [Yes/No] - [Timeline if yes]

### Top 3 Priorities
1. **[Critical Finding]** - [Business impact in one line]
2. **[Critical Finding]** - [Business impact in one line]
3. **[Critical Finding]** - [Business impact in one line]

---

## Findings by Severity

### 🔴 Critical (Immediate Action Required)

#### CRIT-001: [Vulnerability Name]
**Domain**: [Auth/Data/App/Infra/API]  
**OWASP**: [A01-A10 Category]  
**Location**: \`path/to/file.js:142\`

**Issue**: [One paragraph explaining the vulnerability]

**Evidence**:
\`\`\`javascript
// Vulnerable code snippet
[actual code showing the issue]
\`\`\`

**Fix**:
\`\`\`javascript
// Secure implementation
[corrected code]
\`\`\`

**Impact**: [Specific business impact]  
**Effort**: [Hours/Days to fix]  
**Owner**: [Team responsible]

---

#### CRIT-002: [Next Critical Issue]
[Same format...]

### 🟠 High Risk (Fix within 30 days)

#### HIGH-001: [Vulnerability Name]
[Condensed format - Issue, Evidence, Fix, Impact]

### 🟡 Medium Risk (Fix within 90 days)

#### MED-001: [Vulnerability Name]
[Even more condensed - Issue and Fix]

### 🟢 Low Risk (Next maintenance cycle)

#### LOW-001: [Vulnerability Name]
[Brief one-liner with fix suggestion]

---

## Domain Analysis

### Authentication & Authorization
**Status**: [🔴 Critical / 🟠 Needs Work / 🟢 Secure]

| Component | Status | Issues | Priority |
|-----------|--------|--------|----------|
| MFA | ❌ Not Implemented | CRIT-001 | Immediate |
| Session Management | ⚠️ Weak | HIGH-002 | High |
| RBAC | ✅ Properly Configured | None | - |
| OAuth/OIDC | ⚠️ Misconfigured | MED-003 | Medium |

**Key Recommendations**:
- Implement MFA for all users
- Strengthen session timeout policies
- Review OAuth redirect URIs

### Data Protection
**Status**: [🟠 Needs Work]

| Data Type | Encryption | Classification | Compliance |
|-----------|------------|----------------|------------|
| PII | ✅ AES-256 | ✅ Tagged | ✅ GDPR |
| Passwords | ❌ MD5 | ⚠️ Mixed | ❌ Failed |
| API Keys | ❌ Plaintext | ❌ None | ❌ Failed |

**Critical Issues**: HIGH-003, HIGH-004

### Infrastructure & Configuration
**Status**: [🟡 Acceptable]

\`\`\`
Cloud Security:
├── S3 Buckets: 2 public (CRIT-002)
├── IAM Roles: Over-privileged (HIGH-005)
├── Network: Properly segmented ✅
└── Secrets: Using AWS Secrets Manager ✅
\`\`\`

### Application Security (OWASP Coverage)

| OWASP Category | Status | Findings | Reference |
|----------------|--------|----------|-----------|
| A01: Broken Access Control | ❌ | 3 | CRIT-001, HIGH-001, MED-002 |
| A02: Cryptographic Failures | ❌ | 2 | HIGH-003, HIGH-004 |
| A03: Injection | ✅ | 0 | - |
| A04: Insecure Design | ⚠️ | 1 | MED-005 |
| A05: Security Misconfiguration | ❌ | 4 | CRIT-002, HIGH-005, MED-006, LOW-001 |
| A06: Vulnerable Components | ⚠️ | 8 | See Dependencies |
| A07: Authentication Failures | ❌ | 2 | CRIT-001, HIGH-002 |
| A08: Software Integrity | ✅ | 0 | - |
| A09: Logging Failures | ⚠️ | 1 | MED-007 |
| A10: SSRF | ✅ | 0 | - |

### Dependencies & Supply Chain

**Vulnerable Packages**: 8 total (2 critical, 3 high, 3 medium)

| Package | Current | Secure | Severity | CVE |
|---------|---------|--------|----------|-----|
| lodash | 4.17.19 | 4.17.21 | Critical | CVE-2021-23337 |
| axios | 0.21.0 | 1.6.0 | Critical | CVE-2023-45857 |
| express | 4.16.0 | 4.19.2 | High | Multiple |

**Action**: Run \`npm audit fix\` for automatic updates

### API Security

**Endpoints Tested**: 47  
**Vulnerabilities Found**: 5

| Endpoint | Method | Issue | Severity |
|----------|--------|-------|----------|
| /api/users/* | GET | No rate limiting | HIGH-006 |
| /api/admin/* | * | Missing auth | CRIT-003 |
| /api/export | POST | XXE possible | MED-008 |

---

## Compliance Summary

### Regulatory Compliance
| Standard | Status | Gaps | Report Section |
|----------|--------|------|----------------|
| GDPR | ⚠️ PARTIAL | 3 | See MED-009, MED-010, LOW-002 |
| HIPAA | ❌ FAIL | 7 | Requires separate HIPAA audit |
| PCI DSS | N/A | - | No payment processing |
| SOX | ✅ PASS | 0 | Audit trails implemented |

### Security Frameworks
| Framework | Score | Target | Gap |
|-----------|-------|--------|-----|
| NIST SSDF | 2/5 | 4/5 | -2 |
| CIS Controls | 67% | 80% | -13% |
| ISO 27001 | Basic | Certified | Major |

---

## Remediation Roadmap

### Week 1: Critical Fixes
\`\`\`
Day 1-2: CRIT-001 - Implement MFA
├── Enable for admin users first
├── Roll out to all users
└── Document recovery process

Day 3-4: CRIT-002 - Secure S3 buckets
├── Make buckets private
├── Implement bucket policies
└── Enable access logging

Day 5-7: CRIT-003 - Fix admin API auth
├── Implement proper authentication
├── Add authorization checks
└── Update API documentation
\`\`\`

### Week 2-4: High Priority
- [ ] HIGH-001 through HIGH-006
- [ ] Dependency updates
- [ ] Security headers implementation

### Month 2-3: Medium Priority
- [ ] Logging improvements
- [ ] GDPR compliance gaps
- [ ] Architecture improvements

### Ongoing: Process Improvements
- [ ] Security training for developers
- [ ] Automated security testing in CI/CD
- [ ] Regular dependency updates
- [ ] Quarterly security reviews

---

## Validation & Quality

### Assessment Quality Metrics
- **False Positive Rate**: 3.2% (Industry avg: 15%)
- **Coverage**: 98% of codebase analyzed
- **Validation Method**: Multi-tool correlation + manual verification
- **Peer Review**: Completed by 2 security experts

### Tools Used
- **SAST**: SonarQube, Semgrep, ESLint
- **DAST**: OWASP ZAP
- **Dependencies**: npm audit, Snyk
- **Cloud**: AWS Security Hub

---

## Appendix: Technical Details

### A. Testing Methodology
- Automated scanning: 70% of findings
- Manual review: 30% of findings
- Business logic testing: All critical flows

### B. Scope Details
- **Included**: Web app, APIs, AWS infrastructure
- **Excluded**: Mobile apps, third-party integrations
- **Limitations**: No production data access

### C. Fix Verification
Each fix should be verified using:
1. Unit tests for the security control
2. Integration tests for the flow
3. Security scan to confirm resolution

---

**Next Assessment**: [Date - typically 3-6 months]  
**Report Distribution**: [CTO, Security Team, Dev Leads]  
**Classification**: CONFIDENTIAL - Internal Use Only`;