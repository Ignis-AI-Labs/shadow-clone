<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Shadow Clone Feature Mode Configuration

## 🔨 Security-First Feature Development Framework

Build new capabilities that strengthen rather than weaken security posture.

## Pre-Development Planning

### Threat Modeling (STRIDE)
- **Spoofing**: Authentication requirements
- **Tampering**: Data integrity protection
- **Repudiation**: Audit logging needs
- **Information Disclosure**: Access control
- **Denial of Service**: Resource protection
- **Elevation of Privilege**: Authorization

### Security Requirements
**Functional**: Authentication, validation, encryption, logging, error handling
**Non-Functional**: Performance security, scalability, compliance

## Development Phases

### Phase 1: Secure Design
- Integration points security analysis
- API security requirements
- Database security considerations
- Access control mechanisms
- Input validation strategies

### Phase 2: Secure Implementation
- Language-specific security guidelines
- Framework security best practices
- Security testing integration
- Code review checklists

### Phase 3: Secure Deployment
- Configuration verification
- Environment security settings
- Monitoring setup
- Incident response integration

## Security Masters

**Frontend Security Master**: Client-side security, XSS/CSRF prevention, authentication flows
**Backend Security Master**: API security, authorization, database protection, business logic
**Integration Security Master**: Third-party services, cross-service auth, monitoring
**Database Security Master**: Schema design, query security, encryption, audit trails

## Agent Template
```
SECURE FEATURE AGENT: [Domain Master]
FOCUS: [Frontend/Backend/Integration/Database]
WAVE: [Number]
FRAMEWORKS: [OWASP/NIST/Industry]

WORKSPACE: /root/repos/shadow-clone
WAVES DIRECTORY: $waves_directory

CONTEXT:
- Feature: [New capability]
- Security Level: [Low/Medium/High/Critical]
- Integration Points: [Systems]
- Data Sensitivity: [Classification]

REQUIREMENTS:
1. Threat Model Validation
2. Secure Design Patterns
3. Input Validation
4. Output Encoding
5. Access Control
6. Audit Logging
7. Error Handling

DELIVERABLES:
- Implementation: /root/repos/shadow-clone/src/
- Design Docs: $waves_directory/wave-X/security_design.md
- Threat Model: $waves_directory/wave-X/threat_model.md
- Test Suite: /root/repos/shadow-clone/tests/security/
```

## Technology Guidelines

### Frontend
- Component access control
- State management security
- Routing guards
- Token management
- CORS configuration

### Backend
- Middleware security
- Session management
- Query parameterization
- File upload security
- Error handling

### Database
- Parameterized queries
- Access control
- Connection security
- Audit logging
- Encryption

## Security Testing

### Automated
- Pre-commit scanning
- CI/CD security gates
- Security unit tests
- SAST integration

### Manual
- Code security review
- Architecture assessment
- Configuration verification
- Integration testing

## Compliance Integration

**GDPR**: Data minimization, consent, privacy by design
**HIPAA**: PHI handling, access control, audit logging
**PCI DSS**: Cardholder protection, payment security

## Monitoring

### Security Events
- Authentication events
- Authorization failures
- Validation failures
- Error conditions
- Performance metrics

### Alerts
- Security thresholds
- Anomaly detection
- Incident response
- Escalation procedures