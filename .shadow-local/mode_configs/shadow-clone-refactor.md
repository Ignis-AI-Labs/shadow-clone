# Refactor Mode

## Purpose
Break down monolithic code into modular, maintainable components while preserving exact functionality.

## Wave Structure

### Wave-0: Code Analysis & Team Assembly
**Team**: Lead Architect, Code Quality Analyst, Tech Debt Assessor, Record Keeper

**Critical Tasks**:
- Analyze codebase to identify refactoring opportunities
- Measure technical debt and code smells
- Map monolithic components and tight coupling
- **Determine specialized teams based on refactoring needs**
- Ensure test coverage baseline (>80% required)

**Outputs**:
- Code quality metrics (complexity, duplication, coupling)
- **Dynamic team roster** for refactoring waves:
  - Monolith breakdown: Modularization Expert, Domain Architect, API Designer
  - Code smell cleanup: Clean Code Expert, Pattern Specialist, Naming Consultant
  - Architecture issues: System Architect, Dependency Expert, Layer Specialist
  - Legacy modernization: Migration Expert, Compatibility Engineer, Test Retrofitter
  - Performance refactoring: Algorithm Expert, Memory Optimizer, Cache Specialist
  - Database refactoring: Schema Designer, Query Optimizer, Data Migration Expert
- Dependency visualization and target architecture
- Refactoring roadmap with priorities:
  - Quick wins: 1-2 waves (rename, extract methods, remove dead code)
  - Structural changes: 3-4 waves (extract modules, introduce patterns)
  - Architecture transformation: 5+ waves (complete restructuring)

### Wave-1 to Wave-N: Dynamic Refactoring
**Team Structure**: Determined by Wave-0 analysis (always includes Record Keeper)

**Refactoring Strategies**:
1. **Bottom-Up**: Start with leaf classes → work up to core
2. **Top-Down**: Architecture first → implementation details
3. **Strangler Pattern**: Gradually replace legacy with new structure
4. **Parallel Refactoring**: Multiple teams on independent modules

**Focus Areas** (based on Wave-0 findings):
- **Code Structure**: Extract methods/classes, reduce complexity, improve naming
- **Design Patterns**: Introduce appropriate patterns, remove anti-patterns
- **Dependencies**: Invert dependencies, reduce coupling, improve cohesion
- **Modularity**: Extract modules, define interfaces, establish boundaries
- **Testing**: Improve testability, add missing tests, refactor test code
- **Performance**: Algorithm improvements without changing behavior

**Required Process per Wave**:
- Run full test suite (must stay green)
- Apply refactoring pattern
- Verify behavior unchanged
- Update/add tests for better coverage
- Document architectural decisions

### Final Wave: Integration & Quality Validation
**Team**: Integration Lead, QA Engineer, Performance Tester, Documentation Writer, Record Keeper

**Validation Requirements**:
- 100% backward compatibility verification
- Performance benchmarking (must not degrade)
- Integration testing across all modules
- Documentation completeness check
- Security audit of changes

**Outputs**:
- `REFACTORING_REPORT.md` - Changes made and rationale
- `ARCHITECTURE_GUIDE.md` - New structure documentation
- Module dependency diagram
- Migration guide for dependent systems
- Performance comparison report

## Key Deliverables
- Modularized codebase with clear boundaries
- Comprehensive test suite (>90% coverage)
- Architecture documentation with diagrams
- Technical debt reduction metrics (target: 50%+ reduction)
- Zero-downtime migration plan

## Mode-Specific Rules
- **Wave-0 determines refactoring teams** - specialists matched to code issues
- **Behavior preservation is sacred** - not one functional change allowed
- **Test-driven refactoring** - tests must pass at every step
- **Record Keeper in every wave** - tracks structural evolution
- **Incremental changes** - never break the build
- **Document architectural decisions** - explain the "why" behind changes
- **No feature creep** - reject any "while we're at it" additions
- **Performance monitoring** - ensure no degradation

## Success Criteria
- All original tests pass without modification
- Code quality metrics improved (complexity, coupling, cohesion)
- Target architecture achieved per Wave-0 plan
- Zero functional changes - only structural improvements
- Technical debt reduced by targeted percentage
- Build and deployment times improved