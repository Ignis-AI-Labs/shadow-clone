# Debug Mode

## Purpose
Rapidly identify and fix bugs while maintaining security and system stability.

## Wave Structure

### Wave-0: Issue Analysis & Triage
**Team**: Debug Lead, Security Analyst, System Architect, Record Keeper

**Critical Tasks**:
- Reproduce issue in isolated environment
- Determine severity and blast radius
- Assess security implications
- Plan debug approach based on issue type

**Outputs**:
- Issue classification (Critical/High/Medium/Low)
- Reproduction steps documented
- Impact analysis (users affected, systems involved)
- Debug strategy with wave count:
  - Critical/Security: 3+ waves (deep analysis, fix, extensive validation)
  - Performance/Integration: 2-3 waves (diagnose, fix, verify)
  - UI/Minor: 1-2 waves (quick fix, basic validation)

### Wave-1 to Wave-N: Targeted Debugging (Dynamic)
**Consistent Team Structure**: Debug Engineer, Domain Expert, Test Engineer, Record Keeper

**Debug Approaches by Issue Type**:
1. **Security Issues**: Vulnerability analysis, exploit prevention, penetration testing
2. **Performance Bugs**: Profiling, bottleneck analysis, optimization validation
3. **Integration Failures**: API testing, data flow tracing, contract validation
4. **Logic Errors**: State analysis, edge case testing, algorithm verification
5. **UI/UX Issues**: Cross-browser testing, accessibility checks, responsive design

**Required Outputs per Wave**:
- Root cause analysis with evidence
- Proposed fix with implementation
- Regression test suite
- Performance impact measurement
- Security assessment of changes

### Final Wave: Validation & Hardening
**Team**: QA Lead, Security Auditor, Performance Engineer, Record Keeper

**Validation Steps**:
- Full regression suite execution
- Security scan of changes
- Performance benchmarking
- Edge case verification
- Rollback procedure testing

**Outputs**:
- `DEBUG_REPORT.md` - Complete issue lifecycle
- `FIX_VALIDATION.md` - Test results and metrics
- Updated test suites
- Deployment package with rollback plan

## Key Deliverables
- Root cause analysis with timeline
- Production-ready fix with tests
- Prevention recommendations
- Knowledge base update
- Post-mortem (for critical issues)

## Mode-Specific Rules
- **Never fix symptoms** - always find root cause
- **Test the fix in isolation** before integration
- **Document everything** - future debugging depends on it
- **Preserve system state** for analysis before making changes
- **Consider side effects** - one fix shouldn't create new bugs
- **No temporary workarounds** in production code

## Success Criteria
- Issue no longer reproducible
- All related test cases pass
- No performance degradation
- Security posture maintained or improved
- Clear documentation for future reference