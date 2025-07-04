# Security Assessment Report

## Executive Summary

**Project**: [Name]  
**Date**: [Date]  
**Risk Level**: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low  

### Top 3 Security Issues
1. **[Critical Issue]** - [One line description]
2. **[High Issue]** - [One line description]  
3. **[Medium Issue]** - [One line description]

### Quick Stats
- Total vulnerabilities: [X]
- Critical/High: [X]
- False positives: [X]
- Remediation effort: [X days]

## Vulnerability Summary

| Severity | Type | Location | Status | Fix |
|----------|------|----------|--------|-----|
| 🔴 Critical | [SQL Injection] | [file:line] | Open | [1-line fix] |
| 🟠 High | [XSS] | [file:line] | Open | [1-line fix] |
| 🟡 Medium | [Weak Crypto] | [file:line] | Open | [1-line fix] |

## Detailed Findings

### Critical Vulnerabilities

#### 1. [Vulnerability Name]
- **Location**: `path/to/file.js:42`
- **Impact**: [What can an attacker do?]
- **Fix**: 
```javascript
// Bad
[vulnerable code]

// Good  
[fixed code]
```
- **Effort**: 30 minutes

### High Vulnerabilities
[Similar format...]

### Medium/Low Vulnerabilities
[Table format is sufficient]

## Risk Assessment

### Business Impact
- **Data Breach Risk**: High/Medium/Low
- **Service Disruption**: High/Medium/Low  
- **Reputation Damage**: High/Medium/Low
- **Compliance Violation**: Yes/No ([which regulation])

### Attack Likelihood
- **External Attack**: High/Medium/Low
- **Internal Threat**: High/Medium/Low
- **Skill Required**: Low/Medium/High

## Compliance Status

| Framework | Status | Gaps |
|-----------|--------|------|
| OWASP Top 10 | ⚠️ Partial | A03, A07 |
| GDPR | ✅ Compliant | None |
| PCI DSS | ❌ Non-compliant | Encryption requirements |

## Remediation Plan

### Immediate (Do Today)
1. [ ] Fix SQL injection in login.js
2. [ ] Update dependencies with known CVEs
3. [ ] Enable security headers

### Short-term (This Week)
1. [ ] Implement input validation
2. [ ] Add rate limiting
3. [ ] Enable logging and monitoring

### Long-term (This Month)
1. [ ] Security training for team
2. [ ] Implement security testing in CI/CD
3. [ ] Regular security audits

## Fix Commands
```bash
# Update vulnerable dependencies
npm audit fix

# Add security headers (Express.js)
npm install helmet
# Then add to app.js: app.use(helmet())

# Enable rate limiting
npm install express-rate-limit
```

## Validation Checklist
- [ ] All critical issues have fixes
- [ ] Fixes tested in development
- [ ] No new vulnerabilities introduced
- [ ] Documentation updated
- [ ] Team notified of changes

## Tools Used
- SAST: [Tool name]
- DAST: [Tool name]  
- Dependency: npm audit
- Manual: Code review

## Next Steps
1. Fix critical issues immediately
2. Schedule fixes for high issues  
3. Plan security training
4. Set up continuous monitoring