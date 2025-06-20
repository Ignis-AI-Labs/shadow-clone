# Automated Security Scan Results Template
*Comprehensive automated security tool results with validation analysis*

## Scan Overview
**Scan Date:** [Date]
**Project/System:** [System Name]
**Scan Duration:** [Start Time] - [End Time]
**Scan Coordinator:** [Security Master Name]
**Scan Type:** [SAST/DAST/Dependency/Infrastructure/Combined]

## Executive Summary
- **Total Findings:** [Count]
- **Validated Vulnerabilities:** [Count]
- **False Positives:** [Count]
- **Tools Used:** [Count]
- **Coverage Percentage:** [Percentage]
- **Scan Success Rate:** [Percentage]

## Tool Configuration Summary

### Static Application Security Testing (SAST)
| Tool | Version | Configuration | Files Scanned | Rules Active | Scan Time |
|------|---------|---------------|---------------|--------------|-----------|
| SonarQube | [Version] | [Profile] | [Count] | [Count] | [Duration] |
| Semgrep | [Version] | [Ruleset] | [Count] | [Count] | [Duration] |
| CodeQL | [Version] | [Query Pack] | [Count] | [Count] | [Duration] |
| Bandit | [Version] | [Config] | [Count] | [Count] | [Duration] |

### Dynamic Application Security Testing (DAST)
| Tool | Version | Configuration | Endpoints Tested | Test Cases | Scan Time |
|------|---------|---------------|------------------|------------|-----------|
| OWASP ZAP | [Version] | [Profile] | [Count] | [Count] | [Duration] |
| Burp Suite | [Version] | [Config] | [Count] | [Count] | [Duration] |

### Dependency Security Scanning
| Tool | Version | Configuration | Dependencies | Advisories | Scan Time |
|------|---------|---------------|--------------|------------|-----------|
| npm audit | [Version] | [Config] | [Count] | [Count] | [Duration] |
| Snyk | [Version] | [Policy] | [Count] | [Count] | [Duration] |
| OWASP Dependency-Check | [Version] | [Config] | [Count] | [Count] | [Duration] |

### Infrastructure Security Scanning
| Tool | Version | Configuration | Resources | Policies | Scan Time |
|------|---------|---------------|-----------|----------|-----------|
| Checkov | [Version] | [Framework] | [Count] | [Count] | [Duration] |
| Terrascan | [Version] | [Policies] | [Count] | [Count] | [Duration] |

## Detailed Scan Results

### SAST Findings Summary
**SonarQube Results:**
- **Security Hotspots:** [Count]
- **Vulnerabilities:** [Count]
- **Code Quality Issues:** [Count]
- **Coverage:** [Percentage]

| Severity | Count | Validated | False Positive | Accuracy Rate |
|----------|-------|-----------|---------------|---------------|
| Blocker | [Count] | [Count] | [Count] | [Percentage] |
| Critical | [Count] | [Count] | [Count] | [Percentage] |
| Major | [Count] | [Count] | [Count] | [Percentage] |
| Minor | [Count] | [Count] | [Count] | [Percentage] |

**Semgrep Results:**
- **Security Rules Triggered:** [Count]
- **Performance Rules:** [Count]
- **Correctness Rules:** [Count]
- **Custom Rules:** [Count]

| Category | Count | Validated | False Positive | Notes |
|----------|-------|-----------|---------------|-------|
| security | [Count] | [Count] | [Count] | [Notes] |
| performance | [Count] | [Count] | [Count] | [Notes] |
| correctness | [Count] | [Count] | [Count] | [Notes] |

**CodeQL Results:**
- **Security Queries:** [Count triggered]
- **Maintainability Queries:** [Count triggered]
- **Reliability Queries:** [Count triggered]

| Query Suite | Alerts | Validated | False Positive | CWE Coverage |
|-------------|--------|-----------|---------------|--------------|
| Security Extended | [Count] | [Count] | [Count] | [List CWEs] |
| Security and Quality | [Count] | [Count] | [Count] | [List CWEs] |

### DAST Findings Summary
**OWASP ZAP Results:**
- **Passive Scan Alerts:** [Count]
- **Active Scan Alerts:** [Count]
- **Spider Coverage:** [Count URLs]
- **Authentication Status:** [Success/Failure]

| Risk Level | Count | Validated | False Positive | OWASP Category |
|------------|-------|-----------|---------------|----------------|
| High | [Count] | [Count] | [Count] | [A01-A10] |
| Medium | [Count] | [Count] | [Count] | [A01-A10] |
| Low | [Count] | [Count] | [Count] | [A01-A10] |
| Informational | [Count] | [Count] | [Count] | [A01-A10] |

**Burp Suite Results:**
- **Scanner Issues:** [Count]
- **Extension Findings:** [Count]
- **Manual Testing Results:** [Count]

### Dependency Scan Results
**npm audit Results:**
- **Critical Vulnerabilities:** [Count]
- **High Vulnerabilities:** [Count]
- **Moderate Vulnerabilities:** [Count]
- **Low Vulnerabilities:** [Count]
- **Packages Audited:** [Count]

| Package | Version | Vulnerability | CVSS | Fix Available | Status |
|---------|---------|---------------|------|---------------|--------|
| [Package] | [Version] | [CVE-ID] | [Score] | [Yes/No] | [Validated/FP] |

**Snyk Results:**
- **High Severity:** [Count]
- **Medium Severity:** [Count]
- **Low Severity:** [Count]
- **License Issues:** [Count]

### Infrastructure Scan Results
**Checkov Results:**
- **Failed Checks:** [Count]
- **Passed Checks:** [Count]
- **Skipped Checks:** [Count]
- **Resource Coverage:** [Percentage]

| Framework | Failed | Passed | Severity Distribution |
|-----------|--------|--------|--------------------|
| Terraform | [Count] | [Count] | Critical: [X], High: [X], Medium: [X] |
| Kubernetes | [Count] | [Count] | Critical: [X], High: [X], Medium: [X] |
| Docker | [Count] | [Count] | Critical: [X], High: [X], Medium: [X] |

## Cross-Tool Correlation Analysis

### Multi-Tool Findings Correlation
| Vulnerability Pattern | Tools Detected | Consistency Score | Validation Status |
|----------------------|----------------|-------------------|-------------------|
| SQL Injection | SAST: SonarQube, Semgrep + DAST: ZAP | High (3/3) | ✅ Validated |
| XSS Vulnerabilities | SAST: CodeQL + DAST: ZAP, Burp | High (3/3) | ✅ Validated |
| Dependency Issues | npm audit, Snyk, OWASP DC | High (3/3) | ✅ Validated |
| Auth Bypass | DAST: ZAP | Low (1/3) | 🔄 Under Review |

### Tool Accuracy Analysis
| Tool | Total Findings | Validated | False Positives | Accuracy Rate | Reliability Score |
|------|----------------|-----------|-----------------|---------------|-------------------|
| SonarQube | [Count] | [Count] | [Count] | [Percentage] | [High/Medium/Low] |
| Semgrep | [Count] | [Count] | [Count] | [Percentage] | [High/Medium/Low] |
| CodeQL | [Count] | [Count] | [Count] | [Percentage] | [High/Medium/Low] |
| OWASP ZAP | [Count] | [Count] | [Count] | [Percentage] | [High/Medium/Low] |
| Snyk | [Count] | [Count] | [Count] | [Percentage] | [High/Medium/Low] |

## Validation Analysis

### Multi-Layer Validation Results
**Layer 1: Tool Correlation**
- **High Confidence Findings:** [Count] (detected by 2+ tools)
- **Medium Confidence Findings:** [Count] (detected by 1 tool, framework protected)
- **Low Confidence Findings:** [Count] (single tool detection)

**Layer 2: Code Context Analysis**
- **Context-Validated Findings:** [Count]
- **Framework-Protected Code:** [Count] (flagged but protected)
- **Business Logic Analysis:** [Count] (requires manual review)

**Layer 3: Dynamic Verification**
- **Exploitable Findings:** [Count]
- **Protected Findings:** [Count]
- **Inconclusive Findings:** [Count]

### False Positive Analysis
**Common False Positive Patterns:**
1. **Framework Auto-Escaping (XSS):** [Count] findings
   - **Tools:** [List tools that flagged this]
   - **Resolution:** Verified React/Angular/Vue auto-escaping active

2. **ORM Parameterization (SQL Injection):** [Count] findings
   - **Tools:** [List tools that flagged this]
   - **Resolution:** Verified Sequelize/Prisma/TypeORM parameterization

3. **Development Environment Configs:** [Count] findings
   - **Tools:** [List tools that flagged this]
   - **Resolution:** Verified dev-only configuration

## Quality Metrics

### Scan Coverage Metrics
- **Code Coverage:** [Percentage]
- **Endpoint Coverage:** [Percentage]
- **Dependency Coverage:** [Percentage]
- **Infrastructure Coverage:** [Percentage]

### Validation Quality Metrics
- **False Positive Rate:** [Percentage] (Target: <10%)
- **Validation Time (Critical):** [Hours] (Target: <24h)
- **Validation Time (High):** [Hours] (Target: <72h)
- **Cross-Tool Correlation Rate:** [Percentage] (Target: >80%)

### Tool Performance Metrics
- **Scan Execution Success Rate:** [Percentage]
- **Tool Integration Success:** [Percentage]
- **Result Processing Time:** [Duration]
- **Alert Quality Score:** [Score] (1-10)

## Recommendations

### Tool Configuration Improvements
1. **SonarQube Configuration:**
   - Adjust quality gate thresholds
   - Add custom security rules for framework
   - Configure exclusion patterns for test files

2. **DAST Tool Optimization:**
   - Improve authentication configuration
   - Add custom scan policies
   - Enhance endpoint discovery

3. **Dependency Scanning Enhancement:**
   - Configure vulnerability age thresholds
   - Set up license compliance checks
   - Implement automated fix suggestions

### Process Improvements
1. **Automated Validation Pipeline:**
   - Implement cross-tool correlation automation
   - Add framework-aware false positive detection
   - Create validation workflow automation

2. **Continuous Monitoring:**
   - Set up daily dependency scanning
   - Implement real-time DAST monitoring
   - Add security regression testing

### Integration Enhancements
1. **CI/CD Pipeline Integration:**
   - Add security gates to deployment pipeline
   - Implement security test automation
   - Create security feedback loops

2. **Security Tool Orchestration:**
   - Implement tool result aggregation
   - Add vulnerability deduplication
   - Create unified security dashboard

## Appendix

### Tool Output Files
- **SonarQube Report:** [File path]
- **Semgrep Results:** [File path]
- **OWASP ZAP Report:** [File path]
- **Dependency Scan Results:** [File path]
- **Infrastructure Scan Results:** [File path]

### Detailed Findings
- **Individual vulnerability reports:** [Directory path]
- **Tool-specific reports:** [Directory path]
- **Validation documentation:** [Directory path]

---

**Scan Validation:**
- **Scan Coordinator:** [Security Master Name]
- **Validation Date:** [Date]
- **Quality Review:** [QA Master Name]
- **Technical Approval:** [Technical Lead Name]
- **Report Generated:** [Date and Time] 