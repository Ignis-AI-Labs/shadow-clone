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
            - Add comprehensive test coverage
            - Refactor test code for maintainability
            - Establish testing best practices
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
        <step order="1">Run complete test suite to ensure green baseline</step>
        <step order="2">Apply selected refactoring pattern to target code</step>
        <step order="3">Verify behavior remains unchanged through testing</step>
        <step order="4">Update or add tests to improve coverage</step>
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