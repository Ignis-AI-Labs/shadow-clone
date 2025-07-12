<!--
INTERNAL USE ONLY - DO NOT DEPLOY
Shadow Clone system testing framework initialization
-->

# Shadow Clone Test Mode Execution Guide

<test_framework>
  <context>
    <purpose>
      The Shadow Clone Test Mode enables comprehensive validation of system functionality across all execution modes.
      This framework ensures the system operates correctly in production-like conditions while providing
      automated validation after execution completes.
    </purpose>
    
    <audience>
      - Shadow Clone system developers
      - Quality assurance engineers
      - System administrators validating deployments
    </audience>
    
    <importance>
      Test mode verification ensures that all Shadow Clone modes execute according to protocol,
      maintaining system integrity and reliability across different use cases.
    </importance>
  </context>

  <test_execution_protocol>
    <overview>
      Test mode executes the complete Shadow Clone workflow exactly as production would,
      then deploys a Validator Agent to assess protocol compliance.
    </overview>
    
    <execution_phases>
      <production_phases>
        <!-- Phases 1-7 execute normally without any test-specific behavior -->
        <phase number="1" name="System Initialization">
          Standard initialization of Shadow Clone environment and parameters
        </phase>
        <phase number="2" name="Team Configuration">
          Dynamic assembly of specialized agents based on mode and request
        </phase>
        <phase number="3" name="Wave Planning">
          Strategic planning of execution waves for optimal efficiency
        </phase>
        <phase number="4" name="Agent Deployment">
          Three-phase deployment per wave:
          - Pre-Wave: ONLY Record Keeper Collective
          - Main Wave: Implementation agents (max 10 per batch)
          - Post-Wave: ONLY Record Keeper Collective
        </phase>
        <phase number="5" name="Mode-Specific Execution">
          Core execution logic specific to the selected mode
        </phase>
        <phase number="6" name="Integration & Quality Assurance">
          Cross-agent validation and quality checks
        </phase>
        <phase number="7" name="Final Quality & Git Commit">
          Final validation and committing results to git
        </phase>
      </production_phases>
      
      <test_phase>
        <phase number="8" name="Test Validation" condition="test=true flag AND Phase 7 complete">
          <validator_agent>
            <name>Shadow Clone Protocol Validator</name>
            <purpose>Assess test execution compliance and generate validation report</purpose>
            <access>Read-only access to completed execution artifacts</access>
            <loads_files>
              <file>testing/MODE_EXECUTION_FLOWCHART.md</file>
              <file>testing/VALIDATOR_AGENT_TEMPLATE.md</file>
            </loads_files>
            <output>TEST_VALIDATION_REPORT.md</output>
          </validator_agent>
        </phase>
      </test_phase>
    </execution_phases>
  </test_execution_protocol>

  <test_scenarios>
    <scenario mode="plan">
      <command>
        Load .shadow-local/shadow-clone-prompt.md and execute with mode=plan test=true request="Create a comprehensive project plan for building a real-time collaborative document editing system similar to Google Docs"
      </command>
      <expected_outcomes>
        <outcome>Detailed project architecture with technology stack recommendations</outcome>
        <outcome>Phase-based implementation timeline with milestones</outcome>
        <outcome>Risk assessment and mitigation strategies</outcome>
        <outcome>Resource allocation and team structure</outcome>
        <outcome>Complete execution following all 7 standard phases</outcome>
      </expected_outcomes>
    </scenario>
    
    <scenario mode="feature">
      <command>
        Load .shadow-local/shadow-clone-prompt.md and execute with mode=feature test=true request="Create a user authentication system with email/password login, JWT tokens, and password reset functionality"
      </command>
      <expected_outcomes>
        <outcome>Complete authentication module implementation</outcome>
        <outcome>JWT token generation and validation logic</outcome>
        <outcome>Password reset flow with email integration</outcome>
        <outcome>Security best practices implementation</outcome>
        <outcome>Unit tests for all authentication components</outcome>
      </expected_outcomes>
    </scenario>
    
    <scenario mode="audit">
      <command>
        Load .shadow-local/shadow-clone-prompt.md and execute with mode=audit test=true request="Perform a comprehensive security audit of our web application"
      </command>
      <expected_outcomes>
        <outcome>Vulnerability assessment report categorized by severity</outcome>
        <outcome>OWASP Top 10 compliance evaluation</outcome>
        <outcome>Code security analysis with specific line references</outcome>
        <outcome>Remediation recommendations with priority ranking</outcome>
        <outcome>Security best practices checklist</outcome>
      </expected_outcomes>
    </scenario>
    
    <scenario mode="debug">
      <command>
        Load .shadow-local/shadow-clone-prompt.md and execute with mode=debug test=true request="Fix the memory leak in the data processing module that causes crashes after 1000 records"
      </command>
      <expected_outcomes>
        <outcome>Root cause analysis of memory leak</outcome>
        <outcome>Implemented fix with code changes</outcome>
        <outcome>Performance metrics showing leak resolution</outcome>
        <outcome>Regression tests to prevent reoccurrence</outcome>
        <outcome>Documentation of debugging process</outcome>
      </expected_outcomes>
    </scenario>
    
    <scenario mode="optimize">
      <command>
        Load .shadow-local/shadow-clone-prompt.md and execute with mode=optimize test=true request="Optimize database query performance for user search (currently 5+ seconds)"
      </command>
      <expected_outcomes>
        <outcome>Query performance analysis with bottleneck identification</outcome>
        <outcome>Optimized queries with execution time improvements</outcome>
        <outcome>Index recommendations and implementation</outcome>
        <outcome>Before/after performance benchmarks</outcome>
        <outcome>Scalability assessment for future growth</outcome>
      </expected_outcomes>
    </scenario>
    
    <scenario mode="refactor">
      <command>
        Load .shadow-local/shadow-clone-prompt.md and execute with mode=refactor test=true request="Refactor the monolithic user service into microservices following DDD principles"
      </command>
      <expected_outcomes>
        <outcome>Domain model with bounded contexts</outcome>
        <outcome>Microservices architecture design</outcome>
        <outcome>Service contracts and API definitions</outcome>
        <outcome>Refactored code following DDD patterns</outcome>
        <outcome>Migration strategy and deployment plan</outcome>
      </expected_outcomes>
    </scenario>
    
    <scenario mode="research">
      <command>
        Load .shadow-local/shadow-clone-prompt.md and execute with mode=research test=true request="Research WebAssembly integration for browser computation performance"
      </command>
      <expected_outcomes>
        <outcome>Technology assessment with pros/cons analysis</outcome>
        <outcome>Performance benchmarks comparing approaches</outcome>
        <outcome>Implementation recommendations</outcome>
        <outcome>Proof of concept code examples</outcome>
        <outcome>Integration roadmap with existing system</outcome>
      </expected_outcomes>
    </scenario>
  </test_scenarios>

  <test_procedures>
    <pre_test_checklist>
      <requirement>Clean git repository state (no uncommitted changes)</requirement>
      <requirement>No existing .waves directory from previous executions</requirement>
      <requirement>Valid .shadow-local directory structure</requirement>
      <requirement>Current branch is not main/master (test branch required)</requirement>
      <requirement>All system dependencies installed and configured</requirement>
    </pre_test_checklist>
    
    <execution_steps>
      <step number="1">
        <action>Select appropriate test scenario from available options</action>
        <verification>Confirm test parameters match intended mode and request</verification>
      </step>
      <step number="2">
        <action>Execute the test command with all required parameters</action>
        <verification>Monitor console output for successful initialization</verification>
      </step>
      <step number="3">
        <action>Allow system to complete all 7 production phases</action>
        <verification>Observe three-phase pattern: Pre-Wave (RKs only), Main Wave (implementation), Post-Wave (RKs only)</verification>
      </step>
      <step number="4">
        <action>Wait for Phase 8 Validator Agent deployment</action>
        <verification>Confirm TEST_VALIDATION_REPORT.md generation</verification>
      </step>
      <step number="5">
        <action>Review validation report for compliance assessment</action>
        <verification>Check PASS/FAIL status and compliance metrics</verification>
      </step>
    </execution_steps>
    
    <post_test_procedures>
      <archival>
        <step>Create timestamped test results directory</step>
        <command>mkdir -p .test-results/test-[mode]-$(date +%Y%m%d-%H%M%S)</command>
        <step>Move execution artifacts to archive</step>
        <command>mv .waves/ TEST_VALIDATION_REPORT.md .test-results/test-[mode]-$(date +%Y%m%d-%H%M%S)/</command>
      </archival>
      
      <cleanup>
        <step>Remove test commit from repository</step>
        <command>git reset --hard HEAD~1</command>
        <step>Return to main branch</step>
        <command>git checkout main</command>
        <step>Verify clean repository state</step>
        <command>git status</command>
      </cleanup>
    </post_test_procedures>
  </test_procedures>

  <validation_criteria>
    <critical_requirements>
      <requirement category="execution_flow">
        All 7 production phases execute in correct sequence
      </requirement>
      <requirement category="agent_deployment">
        Agents deploy according to wave planning specifications
      </requirement>
      <requirement category="mode_compliance">
        Mode-specific logic executes according to protocol
      </requirement>
      <requirement category="quality_assurance">
        Integration and quality checks complete successfully
      </requirement>
      <requirement category="git_operations">
        Final commit includes all generated artifacts
      </requirement>
    </critical_requirements>
    
    <validation_metrics>
      <metric name="Phase Completion" threshold="100%">
        All phases must complete without interruption
      </metric>
      <metric name="Agent Success Rate" threshold="95%">
        Agents must successfully complete assigned tasks
      </metric>
      <metric name="Protocol Compliance" threshold="100%">
        System must follow Shadow Clone protocol exactly
      </metric>
      <metric name="Output Quality" threshold="Pass">
        Generated artifacts meet mode-specific requirements
      </metric>
    </validation_metrics>
  </validation_criteria>

  <important_guidelines>
    <guideline priority="high">
      The system executes in production mode during testing - agents have no awareness of test status
    </guideline>
    <guideline priority="high">
      Validation occurs only after complete execution to ensure authentic behavior
    </guideline>
    <guideline priority="medium">
      Test mode provides comprehensive validation without impacting production code paths
    </guideline>
    <guideline priority="medium">
      Each test scenario validates a specific mode's complete functionality
    </guideline>
  </important_guidelines>
</test_framework>

---

*"Creation follows rules regardless if we like them or not. When it comes to making some of the things we truly enjoy, we need to understand the laws behind what makes their functions possible."*

The Shadow Clone Test Framework respects these laws by allowing natural system execution followed by comprehensive validation, ensuring both functionality and protocol compliance.