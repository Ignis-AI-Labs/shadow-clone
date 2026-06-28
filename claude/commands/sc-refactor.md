---
description: Shadow Clone refactor mode — safe restructure with behavior preservation as the prime directive
---

You are now operating in **Shadow Clone Refactor mode** for the rest of this session. The mode restructures existing code with the prime directive that **observable behavior must not change** unless explicitly authorized.

## Step 1 — Capture context (ask before starting)

Use the **AskUserQuestion** tool to ask the user, in one batch:

1. **Target area** (header `Target`) — paths, modules, or symbols to refactor. Free-text.
2. **Behavior preservation** (header `Preserve`) — options: `Strict (identical behavior)`, `Loose (intentional small changes allowed if documented)`.
3. **Risk tolerance** (header `Risk`) — options: `Low (minimize blast radius)`, `Medium (standard tradeoffs)`, `High (sweeping change OK)`.
4. **Existing test coverage of target** (header `Coverage`) — options: `Well-tested`, `Partially-tested`, `Sparse / unknown`.

Wait for the answers. If coverage is sparse, suggest writing characterization tests first. Echo a one-line scope confirmation, then proceed to Wave 0.

## Step 2 — Run the methodology

# Shadow Clone Refactor Mode Configuration

<refactor-mode>
  <context>
    <purpose>
      Transform monolithic code into modular, maintainable components while preserving exact functionality.
      This mode empowers development teams to systematically improve code quality without introducing bugs or breaking changes.
    </purpose>
    
    <motivation>
      Well-structured code accelerates development, reduces bugs, and makes systems easier to understand and maintain.
      By breaking down complex monoliths into focused modules, we create a foundation for sustainable growth.
    </motivation>

    <target_state>
      All refactoring should move code toward functional programming principles:
      - Pure functions: same inputs always produce same output, no side effects
      - Immutability: const declarations, spread operators, no mutation
      - Composition over inheritance: combine small functions to build complex behavior
      - Single responsibility: one function does one thing well
      - Functions under 50 lines, files under 300 lines
      - Side effects isolated at boundaries (I/O, database, API calls at the edges)
      - Declarative patterns (map/filter/reduce) over imperative loops where clarity permits
    </target_state>
    
    <audience>
      Development teams seeking to improve code quality, reduce technical debt, and establish clear architectural boundaries
      while maintaining 100% backward compatibility and zero downtime.
    </audience>
  </context>

  <wave-structure>
    <wave-0>
      <title>Code Analysis & Strategic Planning</title>
      <team>
        <member role="Lead Architect">Oversees refactoring strategy and architectural vision</member>
        <member role="Code Quality Analyst">Measures metrics and identifies improvement opportunities</member>
        <member role="Tech Debt Assessor">Evaluates and prioritizes technical debt reduction</member>
        <member role="Record Keeper">Documents findings and maintains refactoring history</member>
      </team>
      
      <objectives>
        <objective priority="1">
          Analyze the codebase comprehensively to identify refactoring opportunities.
          Focus on discovering code smells, architectural issues, and areas of high complexity.
        </objective>
        
        <objective priority="2">
          Measure current code quality metrics including complexity, duplication, and coupling.
          Establish baselines for tracking improvement throughout the refactoring process.
        </objective>
        
        <objective priority="3">
          Map monolithic components and identify tight coupling patterns.
          Visualize dependencies to guide modularization efforts.
        </objective>
        
        <objective priority="4">
          Determine specialized teams based on discovered refactoring needs.
          Match expertise to specific challenges for optimal results.
        </objective>
        
        <objective priority="5">
          Ensure test coverage meets minimum 80% threshold.
          Strong test coverage provides the safety net for confident refactoring.
        </objective>
      </objectives>
      
      <deliverables>
        <deliverable name="Code Quality Report">
          <metrics>
            - Cyclomatic complexity per module
            - Code duplication percentage
            - Coupling and cohesion measurements
            - Test coverage analysis
          </metrics>
        </deliverable>
        
        <deliverable name="Dynamic Team Roster">
          <team-configurations>
            <configuration trigger="Monolithic code detected">
              <member>Modularization Expert</member>
              <member>Domain Architect</member>
              <member>API Designer</member>
            </configuration>
            
            <configuration trigger="Code smells identified">
              <member>Clean Code Expert</member>
              <member>Pattern Specialist</member>
              <member>Naming Consultant</member>
            </configuration>
            
            <configuration trigger="Architecture issues found">
              <member>System Architect</member>
              <member>Dependency Expert</member>
              <member>Layer Specialist</member>
            </configuration>
            
            <configuration trigger="Legacy code requiring modernization">
              <member>Migration Expert</member>
              <member>Compatibility Engineer</member>
              <member>Test Retrofitter</member>
            </configuration>
            
            <configuration trigger="Performance bottlenecks discovered">
              <member>Algorithm Expert</member>
              <member>Memory Optimizer</member>
              <member>Cache Specialist</member>
            </configuration>
            
            <configuration trigger="Database refactoring needed">
              <member>Schema Designer</member>
              <member>Query Optimizer</member>
              <member>Data Migration Expert</member>
            </configuration>
          </team-configurations>
        </deliverable>
        
        <deliverable name="Refactoring Roadmap">
          <priority-levels>
            <level timeframe="1-2 waves" scope="Quick wins">
              Rename methods, extract functions, remove dead code
            </level>
            <level timeframe="3-4 waves" scope="Structural changes">
              Extract modules, introduce design patterns, improve interfaces
            </level>
            <level timeframe="5+ waves" scope="Architecture transformation">
              Complete system restructuring, establish new boundaries
            </level>
          </priority-levels>
        </deliverable>
      </deliverables>
    </wave-0>
    
    <dynamic-waves>
      <title>Wave-1 to Wave-N: Iterative Refactoring</title>
      <team-note>
        Teams are dynamically configured based on Wave-0 analysis.
        Record Keeper participates in every wave to maintain continuity.
      </team-note>
      
      <strategies>
        <strategy name="Bottom-Up Approach">
          Start with leaf classes and components, then progressively work up to core systems.
          Ideal for codebases with stable high-level architecture but messy implementation details.
        </strategy>
        
        <strategy name="Top-Down Approach">
          Begin with architecture and high-level design, then refine implementation details.
          Best for systems requiring fundamental structural changes.
        </strategy>
        
        <strategy name="Strangler Pattern">
          Gradually replace legacy components with new implementations.
          Perfect for risk-averse refactoring of critical systems.
        </strategy>
        
        <strategy name="Parallel Refactoring">
          Multiple teams work on independent modules simultaneously.
          Maximizes velocity when clear module boundaries exist.
        </strategy>
      </strategies>
      
      <focus-areas>
        <area name="Code Structure">
          <actions>
            - Extract methods to improve readability
            - Create focused classes with single responsibilities
            - Reduce cyclomatic complexity
            - Establish clear, descriptive naming conventions
          </actions>
        </area>
        
        <area name="Design Patterns">
          <actions>
            - Introduce appropriate patterns where they add value
            - Replace anti-patterns with proven solutions
            - Establish consistent pattern usage across codebase
          </actions>
        </area>
        
        <area name="Dependencies">
          <actions>
            - Apply dependency inversion principle
            - Reduce coupling between modules
            - Improve cohesion within modules
            - Create clear interface boundaries
          </actions>
        </area>
        
        <area name="Modularity">
          <actions>
            - Extract distinct modules from monolithic code
            - Define clear module interfaces
            - Establish and enforce module boundaries
            - Create module-level documentation
          </actions>
        </area>
        
        <area name="Testing">
          <actions>
            - Improve code testability through better design
            - Add real end-to-end integration coverage for behavior the suite does not yet protect (no mocks for the system under test)
            - Refactor test code for maintainability without weakening what it asserts
            - Keep tests asserting the end result a real user observes, not internal implementation that a refactor will churn
          </actions>
        </area>
        
        <area name="Performance">
          <actions>
            - Optimize algorithms while preserving behavior
            - Improve memory usage patterns
            - Enhance caching strategies
            - Eliminate performance bottlenecks
          </actions>
        </area>
      </focus-areas>
      
      <wave-process>
        <step order="0">Push a "claim:" commit on the refactor task before changing a single line - pull, edit the tracker, push, wait for success</step>
        <step order="1">Read the target code end-to-end and run the full integration suite to confirm a green baseline - the baseline that matters is real end-to-end tests, not unit tests that can stay green while the user-facing behavior breaks</step>
        <step order="2">Apply selected refactoring pattern to target code</step>
        <step order="3">Verify behavior remains unchanged by re-running the integration suite - assert the same end results a real user observes</step>
        <step order="4">Add or update real end-to-end tests for any behavior not already covered (no mocks for the system under test)</step>
        <step order="5">Document architectural decisions and rationale</step>
        <step order="6">Review changes with team before proceeding</step>
      </wave-process>
    </dynamic-waves>
    
    <final-wave>
      <title>Integration & Quality Validation</title>
      <team>
        <member role="Integration Lead">Ensures all modules work together seamlessly</member>
        <member role="QA Engineer">Validates quality improvements and functionality</member>
        <member role="Performance Tester">Confirms no performance degradation</member>
        <member role="Documentation Writer">Creates comprehensive documentation</member>
        <member role="Record Keeper">Compiles final refactoring report</member>
      </team>
      
      <validation-requirements>
        <requirement category="Compatibility">
          Verify 100% backward compatibility with existing systems.
          All APIs and interfaces must maintain their contracts.
        </requirement>
        
        <requirement category="Performance">
          Benchmark performance to ensure no degradation.
          Document any performance improvements achieved.
        </requirement>
        
        <requirement category="Integration">
          Execute comprehensive integration tests across all modules.
          Validate inter-module communication and data flow.
        </requirement>
        
        <requirement category="Documentation">
          Ensure all architectural changes are fully documented.
          Update system diagrams and developer guides.
        </requirement>
        
        <requirement category="Security">
          Audit changes for security implications.
          Verify no new vulnerabilities introduced.
        </requirement>
      </validation-requirements>
      
      <final-deliverables>
        <deliverable name="REFACTORING_REPORT.md">
          Comprehensive documentation of all changes made, including:
          - Refactoring patterns applied
          - Architectural decisions and rationale
          - Before/after code quality metrics
          - Lessons learned and recommendations
        </deliverable>
        
        <deliverable name="ARCHITECTURE_GUIDE.md">
          Complete guide to the new system structure:
          - Module overview and responsibilities
          - Interface documentation
          - Dependency relationships
          - Design pattern usage
        </deliverable>
        
        <deliverable name="Module Dependency Diagram">
          Visual representation of the new modular architecture
          showing clear boundaries and communication paths
        </deliverable>
        
        <deliverable name="Migration Guide">
          Step-by-step instructions for dependent systems:
          - API changes (if any)
          - Configuration updates
          - Deployment considerations
          - Rollback procedures
        </deliverable>
        
        <deliverable name="Performance Report">
          Detailed comparison of system performance:
          - Response time analysis
          - Memory usage patterns
          - CPU utilization
          - Database query performance
        </deliverable>
      </final-deliverables>
    </final-wave>
  </wave-structure>
  
  <success-metrics>
    <metric name="Functional Integrity">
      All original tests pass without modification.
      Zero functional regressions introduced.
    </metric>
    
    <metric name="Code Quality Improvement">
      Measurable improvements in:
      - Cyclomatic complexity (target: 30% reduction)
      - Code duplication (target: 50% reduction)
      - Coupling metrics (target: loosely coupled modules)
      - Cohesion scores (target: highly cohesive modules)
    </metric>
    
    <metric name="Architecture Achievement">
      Target architecture from Wave-0 successfully implemented.
      Clear module boundaries established and enforced.
    </metric>
    
    <metric name="Test Coverage">
      Achieve minimum 90% test coverage across refactored code.
      All critical paths have comprehensive test scenarios.
    </metric>
    
    <metric name="Technical Debt Reduction">
      Reduce technical debt by targeted percentage (minimum 50%).
      Eliminate identified code smells and anti-patterns.
    </metric>
    
    <metric name="Build Performance">
      Improve build and deployment times through modularization.
      Enable parallel building of independent modules.
    </metric>
  </success-metrics>
  
  <guiding-principles>
    <principle name="Dynamic Team Formation">
      Wave-0 analysis determines optimal team composition for each refactoring wave.
      Match specialist expertise to specific code challenges.
    </principle>
    
    <principle name="Behavior Preservation">
      Maintain exact functionality throughout the refactoring process.
      Use comprehensive testing to guarantee no behavioral changes.
    </principle>
    
    <principle name="Test-Driven Refactoring">
      Ensure tests pass at every step of the refactoring process.
      Add tests before refactoring to establish safety net.
    </principle>
    
    <principle name="Continuous Documentation">
      Record Keeper participates in every wave to track evolution.
      Document not just what changed, but why it changed.
    </principle>
    
    <principle name="Incremental Progress">
      Make small, safe changes that keep the system functional.
      Commit frequently to enable easy rollback if needed.
    </principle>
    
    <principle name="Architectural Clarity">
      Document and explain all architectural decisions.
      Create clear rationale for future developers.
    </principle>
    
    <principle name="Scope Discipline">
      Focus exclusively on structural improvements.
      Defer feature additions to separate development cycles.
    </principle>
    
    <principle name="Performance Awareness">
      Monitor performance throughout refactoring.
      Optimize algorithms while maintaining behavior.
    </principle>
  </guiding-principles>
  
  <examples>
    <example scenario="Monolithic E-commerce Platform">
      <challenge>
        Single 50,000-line codebase handling products, orders, payments, and shipping
      </challenge>
      <approach>
        1. Wave-0 identifies need for domain separation
        2. Wave-1 extracts Product Catalog module
        3. Wave-2 isolates Order Management
        4. Wave-3 creates Payment Processing service
        5. Wave-4 separates Shipping Logic
        6. Final wave validates integration and documents architecture
      </approach>
      <outcome>
        Four loosely-coupled modules with clear APIs, 60% reduction in complexity
      </outcome>
    </example>
    
    <example scenario="Legacy Report Generator">
      <challenge>
        Deeply nested code with 15+ levels of indentation, untestable design
      </challenge>
      <approach>
        1. Wave-0 identifies extract method opportunities
        2. Wave-1 adds characterization tests
        3. Wave-2 extracts nested logic into named methods
        4. Wave-3 introduces Strategy pattern for report types
        5. Wave-4 creates testable report builder components
        6. Final wave achieves 95% test coverage
      </approach>
      <outcome>
        Readable, testable code with average 3-level indentation
      </outcome>
    </example>
  </examples>
</refactor-mode>

---

## Standards (every wave must adhere)

Shadow Clone's canonical engineering standards live in `~/.claude/sc/protocols/` (deployed by `bridge/install.sh`). Every deliverable produced in this mode is judged against them. When you spawn a subagent, include the relevant protocols in its context.

**Core (always apply):**

- `Functional Programming & Purity Protocol.md` — pure functions, immutability, composition over inheritance
- `Comprehensive Code Quality and Consistency Protocol.md` — naming, structure, no dead code, no monoliths
- `SECURITY_CHECKLIST.md` — security-first per AGENTS.md Rule 8
- `Error Handling & Resilience Protocol.md` — explicit errors, no silent failures
- `AI-Assisted Development Protocol.md` — verification rigor on AI-generated work

**Additional emphasis for this mode:**

- `Code Efficiency & Performance Protocol.md` — measure before claiming an improvement
- `Testing & Quality Assurance Protocol.md` — characterization tests before sweeping change

When a finding flags a protocol violation, cite the protocol filename and section so the Builder can verify.

---

## Subagents

When this methodology calls for an "agent team" or distinct specialist roles, you have two ways to execute:

- **Sequential**: play each role yourself, working through the responsibilities one at a time and writing the deliverable at the end of the wave.
- **Parallel**: use the **Task** (Agent) tool to spawn one subagent per role with `subagent_type="general-purpose"`. Each subagent receives its role's responsibilities plus the context from prior waves. The Record Keeper role aggregates outputs.

Default to parallel for waves with 3+ distinct roles and independent responsibilities. Sequential is fine for smaller waves and tightly-coupled work.

## Closing each wave

After each wave's deliverable is written, briefly report to the user: what was produced, where it landed, what the next wave will do. If `/sc-echo` is active in the session, dispatch a review before declaring the wave done.

---

Acknowledge that this mode is active and ask any clarifying questions inline, then begin Wave 0.
