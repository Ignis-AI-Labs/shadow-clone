<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Shadow Clone Optimize Mode Configuration

## ⚡ Security-First Optimization Framework

Transform audit findings into fortress strength while maintaining security posture.

## Optimization Phases

### Phase 1: Critical Security (Wave 1)
- Authentication/authorization vulnerabilities
- Input validation and injection flaws
- Cryptographic implementation errors
- Access control bypass vulnerabilities
- Data exposure and privacy violations

### Phase 2: Performance Security (Wave 2)
- Database query security optimization
- Session management performance
- Encryption/decryption optimization
- API rate limiting and security
- Caching with security controls

### Phase 3: Quality Security (Wave 3)
- Code quality with security focus
- Security testing integration
- CI/CD security automation
- Documentation enhancement
- Monitoring optimization

## Security Masters

**Critical Security Master**: High-severity remediation, authentication fixes, cryptography
**Performance Security Master**: Secure optimization, database security, API performance
**Quality Security Master**: Code quality enhancement, testing integration, automation
**Infrastructure Security Master**: Configuration hardening, deployment automation, cloud security

## Agent Template
```
SECURE OPTIMIZATION AGENT: [Domain Master]
FOCUS: [Critical/Performance/Quality/Infrastructure]
WAVE: [Number]
FRAMEWORKS: [OWASP/NIST/Industry]

WORKSPACE: /root/repos/shadow-clone
WAVES DIRECTORY: $waves_directory

CONTEXT:
- Audit Findings: [Previous reports]
- Priority: [Critical/High/Medium]
- Scope: [Security/Performance/Quality]
- Compliance: [Requirements]

REQUIREMENTS:
1. Vulnerability Remediation
2. Security Enhancement
3. Performance Without Compromise
4. Compliance Achievement
5. Quality Integration
6. Testing Coverage
7. Documentation Updates

DELIVERABLES:
- Optimized Code: /root/repos/shadow-clone/src/
- Security Report: $waves_directory/wave-X/security_improvements.md
- Remediation Log: $waves_directory/wave-X/vulnerability_fixes.md
- Compliance Status: $waves_directory/wave-X/compliance_status.md
```

## Technology-Specific Optimizations

### Frontend
- CSP optimization
- XSS prevention enhancement
- CSRF protection improvement
- Secure state management
- Routing security

### Backend
- Middleware security optimization
- Session management enhancement
- Authentication performance
- Authorization optimization
- Error handling security

### Infrastructure
- Container security optimization
- Cloud configuration hardening
- Network security enhancement
- Monitoring optimization
- Backup security

## Validation

### Pre-Optimization
- Security control inventory
- Risk assessment
- Test suite creation

### Post-Optimization
- Comprehensive testing
- Control validation
- Performance assessment
- Compliance verification

## Example Wave Directory Structure

**IMPORTANT**: All agents MUST follow file_organization_rules.md for proper file placement.

**Optimize Mode Deliverables:**
```
$waves_directory/
├── wave-0/                    # MANDATORY pre-execution planning
│   ├── audit_findings.md      # Summary of audit findings
│   ├── optimization_scope.md  # Optimization priorities
│   ├── security_baseline.md   # Current security posture
│   ├── performance_metrics.md # Baseline measurements
│   ├── team_formation.md      # Agent assignments
│   ├── wave_plan.md          # Execution strategy
│   └── setup_complete.md      # Pre-execution checkpoint
├── wave-1/
│   ├── critical_security_fixes/
│   ├── vulnerability_patches/
│   ├── security_enhancements.md
│   └── WAVE_1_CRITICAL.md
├── wave-2/
│   ├── performance_optimizations/
│   ├── database_improvements/
│   ├── api_enhancements.md
│   └── WAVE_2_PERFORMANCE.md
├── wave-3/
│   ├── quality_improvements/
│   ├── test_coverage_updates/
│   ├── documentation_updates.md
│   └── WAVE_3_QUALITY.md
└── OPTIMIZATION_REPORT.md
```