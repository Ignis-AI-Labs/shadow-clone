# Feature Mode

## Purpose
Build new capabilities with security-first approach and comprehensive testing.

## Wave Structure

### Wave-0: Feature Analysis & Team Composition
**Team**: Feature Architect, Technical Analyst, Security Analyst, Record Keeper

**Critical Tasks**:
- Analyze requested feature(s) in detail
- Determine required technical domains
- Assess security implications
- Define optimal team composition for subsequent waves
- Estimate complexity and wave count

**Outputs**:
- Feature breakdown and dependencies
- **Dynamic team roster** for implementation waves:
  - Backend-heavy: Database Architect, API Developer, Backend Engineer
  - Frontend-heavy: UI/UX Designer, Frontend Developer, Accessibility Expert
  - Full-stack: Mix of backend/frontend specialists
  - Data-intensive: Data Engineer, ETL Specialist, Analytics Expert
  - Integration-focused: Systems Integrator, API Designer, Middleware Expert
  - ML/AI features: ML Engineer, Data Scientist, Model Validator
- Security threat model
- Wave allocation:
  - Simple features: 2 waves (implement + validate)
  - Standard features: 3-4 waves (design, implement, integrate, validate)
  - Complex features: 5+ waves (architecture, multiple implementations, optimization)

### Wave-1 to Wave-N: Dynamic Implementation
**Team Structure**: Determined by Wave-0 analysis (always includes Record Keeper)

**Common Patterns**:
1. **API-First Development**: Backend team → API team → Frontend team
2. **UI-First Prototyping**: Design team → Frontend team → Backend team
3. **Parallel Development**: Backend + Frontend teams working simultaneously
4. **Iterative Enhancement**: Core team → Specialized teams → Polish team

**Required Outputs per Wave**:
- Working code for assigned components
- Unit tests with >80% coverage
- Integration points documented
- Performance metrics
- Security considerations addressed

### Final Wave: Validation & Release Preparation
**Team**: QA Lead, Security Auditor, Performance Engineer, DevOps Engineer, Technical Writer, Record Keeper

**Comprehensive Validation**:
- End-to-end feature testing
- Security penetration testing
- Performance under load
- Accessibility compliance
- Cross-browser/platform testing

**Outputs**:
- Complete test report
- Security clearance certificate
- Performance benchmarks
- Deployment package
- User documentation
- Release notes

## Key Deliverables
- Working feature code in `/src`
- Comprehensive test coverage
- Security assessment report
- User documentation
- Deployment artifacts

## Mode-Specific Rules
- **Wave-0 determines all subsequent teams** - no predetermined agent lists
- **Adapt team size to feature complexity** - simple features need fewer agents
- **Record Keeper in every wave** - non-negotiable for context preservation
- Security threat modeling before implementation
- Test-driven development approach
- Feature flags for gradual rollout
- Cross-functional expertise matched to feature needs

## Success Criteria
- Feature fully functional per specifications
- All tests passing (>80% coverage minimum)
- Security review passed with no critical issues
- Performance meets or exceeds targets
- Documentation complete (user and technical)
- Successfully deployed to staging environment