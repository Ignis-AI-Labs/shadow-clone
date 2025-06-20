# Risk Assessment Matrix Template
*Comprehensive risk analysis of identified security vulnerabilities*

## Risk Assessment Overview
**Assessment Date:** [Date]
**Project/System:** [System Name]
**Risk Analyst:** [Security Master Name]
**Business Context:** [Industry/Compliance Requirements]

## Executive Risk Summary
- **Critical Risk Vulnerabilities:** [Count]
- **High Risk Vulnerabilities:** [Count]
- **Medium Risk Vulnerabilities:** [Count]
- **Low Risk Vulnerabilities:** [Count]
- **Overall Risk Score:** [Score] / 100
- **Risk Rating:** [Critical/High/Medium/Low]

## Risk Assessment Methodology
**Risk Calculation:** Risk = Impact × Likelihood × Business Context
**Scoring Scale:** 1-5 (1=Very Low, 2=Low, 3=Medium, 4=High, 5=Critical)

### Impact Assessment Criteria
| Level | Score | Description |
|-------|-------|-------------|
| Critical | 5 | Complete system compromise, data breach, regulatory violation |
| High | 4 | Significant system compromise, sensitive data exposure |
| Medium | 3 | Partial system compromise, limited data exposure |
| Low | 2 | Minor system impact, minimal data exposure |
| Very Low | 1 | Negligible impact, theoretical risk only |

### Likelihood Assessment Criteria
| Level | Score | Description |
|-------|-------|-------------|
| Critical | 5 | Exploitation guaranteed, automated attacks possible |
| High | 4 | Easy to exploit, skilled attacker, known exploits |
| Medium | 3 | Moderate skill required, some conditions needed |
| Low | 2 | Advanced skill required, specific conditions |
| Very Low | 1 | Expert skill required, highly specific conditions |

### Business Context Multipliers
| Context | Multiplier | Description |
|---------|------------|-------------|
| Internet-Facing | 1.5x | Publicly accessible systems |
| Internal Network | 1.0x | Internal network systems |
| Isolated Systems | 0.5x | Air-gapped or highly isolated |
| Compliance Critical | 1.3x | HIPAA, PCI DSS, SOX systems |

## Detailed Risk Assessment Matrix

### Critical Risk Vulnerabilities (Risk Score: 20-25)

| ID | Vulnerability | CWE | OWASP | Impact | Likelihood | Context | Risk Score | Business Impact |
|----|---------------|-----|-------|---------|------------|---------|------------|-----------------|
| VULN-001 | [SQL Injection in Auth] | CWE-89 | A03 | 5 | 4 | 1.5x | 30 | Complete database compromise |
| VULN-002 | [Admin Auth Bypass] | CWE-862 | A01 | 5 | 5 | 1.3x | 32.5 | Full administrative access |

### High Risk Vulnerabilities (Risk Score: 15-19)

| ID | Vulnerability | CWE | OWASP | Impact | Likelihood | Context | Risk Score | Business Impact |
|----|---------------|-----|-------|---------|------------|---------|------------|-----------------|
| VULN-003 | [XSS in User Profile] | CWE-79 | A03 | 4 | 4 | 1.5x | 24 | User session hijacking |
| VULN-004 | [Crypto Key Exposure] | CWE-798 | A02 | 5 | 3 | 1.0x | 15 | Encryption compromise |

### Medium Risk Vulnerabilities (Risk Score: 10-14)

| ID | Vulnerability | CWE | OWASP | Impact | Likelihood | Context | Risk Score | Business Impact |
|----|---------------|-----|-------|---------|------------|---------|------------|-----------------|
| VULN-005 | [CSRF in Settings] | CWE-352 | A01 | 3 | 3 | 1.0x | 9 | Unauthorized actions |
| VULN-006 | [Info Disclosure] | CWE-200 | A09 | 2 | 4 | 1.5x | 12 | Information leakage |

### Low Risk Vulnerabilities (Risk Score: 5-9)

| ID | Vulnerability | CWE | OWASP | Impact | Likelihood | Context | Risk Score | Business Impact |
|----|---------------|-----|-------|---------|------------|---------|------------|-----------------|
| VULN-007 | [Weak Session Timeout] | CWE-613 | A07 | 2 | 2 | 1.0x | 4 | Extended session exposure |

## Risk Analysis by Category

### OWASP Top Ten Risk Distribution
| OWASP Category | Critical | High | Medium | Low | Total Risk Score |
|----------------|----------|------|--------|-----|------------------|
| A01: Broken Access Control | [Count] | [Count] | [Count] | [Count] | [Score] |
| A02: Cryptographic Failures | [Count] | [Count] | [Count] | [Count] | [Score] |
| A03: Injection | [Count] | [Count] | [Count] | [Count] | [Score] |
| A04: Insecure Design | [Count] | [Count] | [Count] | [Count] | [Score] |
| A05: Security Misconfiguration | [Count] | [Count] | [Count] | [Count] | [Score] |
| A06: Vulnerable Components | [Count] | [Count] | [Count] | [Count] | [Score] |
| A07: Authentication Failures | [Count] | [Count] | [Count] | [Count] | [Score] |
| A08: Data Integrity Failures | [Count] | [Count] | [Count] | [Count] | [Score] |
| A09: Logging/Monitoring Failures | [Count] | [Count] | [Count] | [Count] | [Score] |
| A10: Server-Side Request Forgery | [Count] | [Count] | [Count] | [Count] | [Score] |

### Business Function Risk Assessment
| Business Function | Vulnerabilities | Risk Score | Critical Impact |
|-------------------|-----------------|------------|-----------------|
| Authentication System | [Count] | [Score] | [Impact description] |
| Payment Processing | [Count] | [Score] | [Impact description] |
| User Data Management | [Count] | [Score] | [Impact description] |
| Administrative Functions | [Count] | [Score] | [Impact description] |
| Public API Endpoints | [Count] | [Score] | [Impact description] |

## Threat Actor Analysis

### External Threat Actors
**Opportunistic Attackers:**
- **Motivation:** Financial gain, easy targets
- **Skill Level:** Low to Medium
- **Relevant Vulnerabilities:** [List IDs]
- **Risk Multiplier:** 1.2x

**Targeted Attackers:**
- **Motivation:** Specific business targeting
- **Skill Level:** High
- **Relevant Vulnerabilities:** [List IDs]
- **Risk Multiplier:** 1.5x

**Nation State Actors:**
- **Motivation:** Espionage, disruption
- **Skill Level:** Expert
- **Relevant Vulnerabilities:** [List IDs]
- **Risk Multiplier:** 1.8x

### Internal Threat Actors
**Malicious Insiders:**
- **Access Level:** [Employee/Admin/Contractor]
- **Relevant Vulnerabilities:** [List IDs]
- **Risk Multiplier:** 1.3x

**Compromised Accounts:**
- **Account Types:** [User/Admin/Service]
- **Relevant Vulnerabilities:** [List IDs]
- **Risk Multiplier:** 1.4x

## Compliance Risk Assessment

### Regulatory Compliance Risks
**GDPR Compliance Risk:**
- **Affected Vulnerabilities:** [List IDs]
- **Potential Fines:** [Amount/Percentage]
- **Risk Score:** [Score]

**HIPAA Compliance Risk:**
- **Affected Vulnerabilities:** [List IDs]
- **Potential Fines:** [Amount]
- **Risk Score:** [Score]

**PCI DSS Compliance Risk:**
- **Affected Vulnerabilities:** [List IDs]
- **Potential Fines:** [Amount]
- **Risk Score:** [Score]

### Industry Standards Risk
**SOC 2 Compliance Risk:**
- **Affected Controls:** [List controls]
- **Impact:** [Description]

**ISO 27001 Compliance Risk:**
- **Affected Controls:** [List controls]
- **Impact:** [Description]

## Risk Prioritization Matrix

### Priority 1: Immediate Action Required (Risk Score ≥20)
| Vulnerability ID | Risk Score | Business Impact | Required Action | Timeline |
|------------------|------------|-----------------|-----------------|----------|
| VULN-001 | 30 | Database compromise | Emergency patch | 24 hours |
| VULN-002 | 32.5 | Admin access compromise | Disable feature | Immediate |

### Priority 2: Urgent Action (Risk Score 15-19)
| Vulnerability ID | Risk Score | Business Impact | Required Action | Timeline |
|------------------|------------|-----------------|-----------------|----------|
| VULN-003 | 24 | Session hijacking | Deploy fix | 7 days |
| VULN-004 | 15 | Encryption compromise | Rotate keys | 14 days |

### Priority 3: Planned Remediation (Risk Score 10-14)
| Vulnerability ID | Risk Score | Business Impact | Required Action | Timeline |
|------------------|------------|-----------------|-----------------|----------|
| VULN-005 | 9 | Unauthorized actions | Implement CSRF protection | 30 days |
| VULN-006 | 12 | Information leakage | Improve error handling | 30 days |

### Priority 4: Routine Maintenance (Risk Score <10)
| Vulnerability ID | Risk Score | Business Impact | Required Action | Timeline |
|------------------|------------|-----------------|-----------------|----------|
| VULN-007 | 4 | Session exposure | Reduce timeout | Next release |

## Risk Mitigation Strategies

### Technical Controls
1. **Input Validation Enhancement**
   - **Addresses:** [List vulnerability IDs]
   - **Risk Reduction:** [Percentage]
   - **Implementation Effort:** [High/Medium/Low]

2. **Authentication Strengthening**
   - **Addresses:** [List vulnerability IDs]
   - **Risk Reduction:** [Percentage]
   - **Implementation Effort:** [High/Medium/Low]

3. **Encryption Improvements**
   - **Addresses:** [List vulnerability IDs]
   - **Risk Reduction:** [Percentage]
   - **Implementation Effort:** [High/Medium/Low]

### Administrative Controls
1. **Security Awareness Training**
   - **Risk Reduction:** [Percentage]
   - **Frequency:** [Monthly/Quarterly]

2. **Access Control Reviews**
   - **Risk Reduction:** [Percentage]
   - **Frequency:** [Monthly/Quarterly]

### Physical Controls
1. **Network Segmentation**
   - **Risk Reduction:** [Percentage]
   - **Implementation Timeline:** [Timeframe]

## Risk Acceptance Criteria

### Acceptable Risk Levels
- **Maximum Risk Score:** [Score]
- **Critical Vulnerabilities:** 0 acceptable
- **High Risk Vulnerabilities:** [Count] maximum
- **Overall Risk Rating:** Medium or below

### Risk Acceptance Process
1. Business owner review and approval required for:
   - Any vulnerability with risk score >15
   - Any compliance-related vulnerability
   - Any vulnerability affecting customer data

2. Documentation requirements:
   - Business justification
   - Compensating controls
   - Review timeline
   - Approval signatures

## Continuous Risk Monitoring

### Risk Metrics Tracking
- **Monthly Risk Score Trend:** [Trend description]
- **Vulnerability Discovery Rate:** [Rate]
- **Remediation Velocity:** [Rate]
- **Risk Reduction Effectiveness:** [Percentage]

### Risk Review Schedule
- **Weekly:** Critical risk vulnerability status
- **Monthly:** Overall risk posture review
- **Quarterly:** Risk assessment methodology review
- **Annually:** Comprehensive risk strategy review

---

**Risk Assessment Validation:**
- **Risk Analyst:** [Security Master Name]
- **Assessment Date:** [Date]
- **Business Review:** [Business Owner Name]
- **Technical Review:** [Technical Lead Name]
- **Final Approval:** [CISO/Security Director Name] 