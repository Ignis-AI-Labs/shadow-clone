# Shadow Clone Mode Execution Flowchart & Validation Framework

<document>
  <context>
    This document serves as a comprehensive reference for understanding and validating Shadow Clone mode execution flows.
    It provides step-by-step guidance for each mode, ensuring consistent implementation and successful project outcomes.
    Target audience: Developers implementing Shadow Clone modes, QA teams validating executions, and project managers overseeing deployments.
  </context>

  <purpose>
    To establish clear execution patterns that:
    - Ensure consistent mode execution across all Shadow Clone deployments
    - Provide validation checkpoints for quality assurance
    - Enable rapid troubleshooting and debugging
    - Support efficient team coordination through well-defined phases
  </purpose>

  <key_concepts>
    <concept name="Record Keeper Collective">
      The Record Keeper Collective serves as the distributed leadership model for Shadow Clone.
      Multiple Record Keepers work together to orchestrate wave execution without a single point of failure.
      This collective approach ensures comprehensive documentation and validation throughout the process.
    </concept>
    
    <concept name="Wave System">
      Shadow Clone organizes work into waves, each containing three phases:
      1. Pre-Wave: Record Keeper Collective sets up requirements and foundations
      2. Main Wave: Team agents execute the primary work
      3. Post-Wave: Record Keeper Collective validates and finalizes outputs
    </concept>
    
    <concept name="10-Agent Deployment Limit">
      To maintain system stability and coordination, deployments are limited to 10 agents at a time.
      Larger teams are automatically divided into sub-waves (e.g., Wave 1a, 1b, 1c).
    </concept>
  </key_concepts>
</document>

## 🎯 Record Keeper Collective Model

<record_keeper_configuration>
  <scaling_formula>
    The number of Record Keepers scales with project size to ensure adequate oversight:
    
    ```python
    num_record_keepers = max(3, ceil(total_agents / 5))
    ```
    
    <examples>
      <example agents="10" record_keepers="3">Small project: 10 agents → 3 Record Keepers</example>
      <example agents="20" record_keepers="4">Medium project: 20 agents → 4 Record Keepers</example>
      <example agents="50" record_keepers="10">Large project: 50 agents → 10 Record Keepers</example>
    </examples>
  </scaling_formula>
  
  <responsibilities>
    - Set up wave requirements and tracking systems
    - Orchestrate team coordination without hierarchical leadership
    - Validate deliverables and ensure quality standards
    - Create comprehensive documentation and summaries
  </responsibilities>
</record_keeper_configuration>

## 📊 Wave Execution Patterns

<wave_patterns>
  <pattern name="Standard Wave" agent_count="≤10">
    <description>
      For teams with 10 or fewer agents, execution follows a simple three-phase pattern.
    </description>
    <phases>
      <phase number="1" name="Pre-Wave">
        Record Keeper Collective deploys first to establish foundations
      </phase>
      <phase number="2" name="Main Wave">
        All team agents execute simultaneously (single deployment)
      </phase>
      <phase number="3" name="Post-Wave">
        Record Keeper Collective returns to validate and finalize
      </phase>
    </phases>
  </pattern>
  
  <pattern name="Large Wave" agent_count=">10">
    <description>
      For teams exceeding 10 agents, the system creates sub-waves to maintain the deployment limit.
    </description>
    <example total_agents="25">
      <sub_wave id="1a">Pre-Wave: RK Collective + First 10 agents</sub_wave>
      <sub_wave id="1b">10 additional agents (no RK deployment)</sub_wave>
      <sub_wave id="1c">Final 5 agents + Post-Wave: RK Collective</sub_wave>
    </example>
  </pattern>
</wave_patterns>

## 🔄 Universal Execution Flow

<universal_flow>
  <stage name="System Initialization">
    <description>Prepare the environment and verify all prerequisites</description>
    <actions>
      <action>Load system rules and configurations</action>
      <action>Verify git branch (ensure not on main/master)</action>
      <action>Create wave-0 directory structure</action>
    </actions>
    <validations>
      <validation>✓ All components verified and loaded</validation>
      <validation>✓ .shadow-local directory exists with required structure</validation>
      <validation>✓ Working on appropriate development branch</validation>
      <validation>✓ .waves/wave-0/ directory created successfully</validation>
    </validations>
  </stage>
  
  <stage name="Team Configuration">
    <description>Assemble the team based on project requirements</description>
    <actions>
      <action>Load agent templates and capabilities</action>
      <action>Calculate required Record Keepers using scaling formula</action>
      <action>Assign agents to appropriate waves</action>
    </actions>
    <validations>
      <validation>✓ Minimum 3 Record Keepers assigned per wave</validation>
      <validation>✓ Record Keeper count scales appropriately with team size</validation>
      <validation>✓ All agents have clear role assignments</validation>
      <validation>✓ Team size respects 10-agent deployment limit</validation>
    </validations>
  </stage>
  
  <stage name="Wave-0 Execution">
    <description>Initial planning and analysis phase</description>
    <sub_stages>
      <sub_stage name="Pre-Wave">
        <actions>
          <action>Deploy 3+ Record Keepers</action>
          <action>Create DELIVERABLES_REQUIRED.md</action>
          <action>Define AGENT_ASSIGNMENTS.md</action>
          <action>Initialize all tracking systems</action>
        </actions>
        <validations>
          <validation>✓ Record Keeper Collective deploys first</validation>
          <validation>✓ All foundational documents created</validation>
          <validation>✓ Tracking systems operational</validation>
        </validations>
      </sub_stage>
      
      <sub_stage name="Main Wave">
        <actions>
          <action>Perform scope analysis</action>
          <action>Select appropriate team composition</action>
          <action>Create detailed execution plan</action>
        </actions>
        <validations>
          <validation>✓ Planning only - no implementation code</validation>
          <validation>✓ Dynamic team roster created</validation>
          <validation>✓ Wave count determined based on scope</validation>
          <validation>✓ Maximum 10 agents per deployment batch</validation>
        </validations>
      </sub_stage>
      
      <sub_stage name="Post-Wave">
        <actions>
          <action>Validate all outputs meet requirements</action>
          <action>Update constitution with decisions</action>
          <action>Create comprehensive wave summary</action>
        </actions>
        <validations>
          <validation>✓ Same Record Keeper Collective returns</validation>
          <validation>✓ Constitution reflects all decisions</validation>
          <validation>✓ WAVE_COMPLETE.md exists with summary</validation>
        </validations>
      </sub_stage>
    </sub_stages>
  </stage>
  
  <stage name="Implementation Waves">
    <description>Execute the planned work across waves 1-N</description>
    <actions>
      <action>Follow three-phase pattern for each wave</action>
      <action>Deploy agents in batches of 10 maximum</action>
      <action>Maintain workspace discipline (.waves/wave-N/)</action>
      <action>Record Keeper Collective leads and closes each wave</action>
    </actions>
    <validations>
      <validation>✓ All work contained in appropriate wave directories</validation>
      <validation>✓ Three-phase pattern executed consistently</validation>
      <validation>✓ 10-agent deployment limit respected</validation>
      <validation>✓ Record Keeper Collective provides leadership</validation>
    </validations>
  </stage>
  
  <stage name="Final Wave & Completion">
    <description>Finalize all deliverables and prepare for deployment</description>
    <actions>
      <action>Record Keeper Pre-Wave plans closure activities</action>
      <action>Execute final deliverables and validations</action>
      <action>Record Keeper Post-Wave creates MODE_COMPLETION_SUMMARY.md</action>
    </actions>
    <validations>
      <validation>✓ All mode-specific deliverables created</validation>
      <validation>✓ Comprehensive summary documents completion</validation>
      <validation>✓ All quality standards met</validation>
    </validations>
  </stage>
  
  <stage name="Git Commit">
    <description>Commit all changes as a single atomic operation</description>
    <actions>
      <action>Stage all changes from execution</action>
      <action>Create descriptive commit message</action>
      <action>Commit to development branch</action>
    </actions>
    <validations>
      <validation>✓ Single atomic commit created</validation>
      <validation>✓ Commit message describes changes accurately</validation>
      <validation>✓ All files committed (no uncommitted changes)</validation>
      <validation>✓ Working on development branch (not main)</validation>
    </validations>
  </stage>
</universal_flow>

## 📋 Mode-Specific Validation Checklists

<mode_validations>
  <mode name="PLANNING">
    <description>
      Planning mode focuses on comprehensive project analysis and roadmap creation.
      Success requires thorough documentation without any implementation code.
    </description>
    
    <wave_validations wave="0">
      <phase name="Pre-Wave">
        <validation>Minimum 3 Record Keepers deployed first</validation>
        <validation>DELIVERABLES_REQUIRED.md created with clear requirements</validation>
        <validation>AGENT_ASSIGNMENTS.md defines all team roles</validation>
        <validation>Tracking systems initialized for progress monitoring</validation>
      </phase>
      
      <phase name="Main">
        <validation>project_vision.md captures project goals and success criteria</validation>
        <validation>scope_assessment.md analyzes technical requirements</validation>
        <validation>initial_requirements.md lists functional/non-functional needs</validation>
        <validation>planning_strategy.md outlines implementation approach</validation>
        <validation>wave_plan.md details execution timeline and resources</validation>
        <validation>All agents deployed in batches respecting 10-agent limit</validation>
      </phase>
      
      <phase name="Post-Wave">
        <validation>All deliverables validated against requirements</validation>
        <validation>Constitution updated with planning decisions</validation>
        <validation>Comprehensive wave summary created</validation>
        <validation>WAVE_COMPLETE.md marks successful completion</validation>
      </phase>
    </wave_validations>
    
    <wave_validations wave="Dynamic (1-N)">
      <validation>Each wave follows the three-phase pattern</validation>
      <validation>Record Keeper Collective leads each wave</validation>
      <validation>Teams match Wave-0 recommendations</validation>
      <validation>Each wave builds upon previous outputs</validation>
      <validation>Focus remains on planning (no implementation)</validation>
    </wave_validations>
    
    <wave_validations wave="Final">
      <validation>MASTER_PLAN.md created using template structure</validation>
      <validation>All 8 required sections populated with details</validation>
      <validation>Plan provides clear implementation roadmap</validation>
      <validation>MODE_COMPLETION_SUMMARY.md captures all outcomes</validation>
    </wave_validations>
  </mode>
  
  <mode name="FEATURE">
    <description>
      Feature mode implements new functionality with comprehensive testing and documentation.
      Success requires working code with high quality standards.
    </description>
    
    <wave_validations wave="0">
      <validation>Record Keeper Pre-Wave establishes implementation requirements</validation>
      <validation>Feature breakdown creates manageable work units</validation>
      <validation>Dynamic team roster assembled (no single Team Lead)</validation>
      <validation>Security threat model identifies potential risks</validation>
      <validation>Wave allocation matches feature complexity</validation>
      <validation>Record Keeper Post-Wave validates analysis completeness</validation>
    </wave_validations>
    
    <wave_validations wave="Dynamic (1-N)">
      <validation>Each wave maintains Pre → Main → Post phase structure</validation>
      <validation>Record Keeper Collective orchestrates coordination</validation>
      <validation>Code placed in appropriate project directories (/src, etc.)</validation>
      <validation>Unit test coverage exceeds 80% threshold</validation>
      <validation>Integration points documented clearly</validation>
      <validation>Performance metrics recorded for optimization</validation>
      <validation>Security considerations addressed proactively</validation>
      <validation>Maximum 10 agents per deployment batch maintained</validation>
    </wave_validations>
    
    <wave_validations wave="Final">
      <validation>Record Keeper Pre-Wave plans comprehensive validation</validation>
      <validation>End-to-end testing confirms feature functionality</validation>
      <validation>Security clearance obtained through review</validation>
      <validation>Documentation complete for users and developers</validation>
      <validation>Deployment package prepared with all dependencies</validation>
      <validation>MODE_COMPLETION_SUMMARY.md documents feature delivery</validation>
    </wave_validations>
  </mode>
  
  <mode name="AUDIT">
    <description>
      Audit mode performs comprehensive security and compliance analysis.
      Success requires thorough examination with actionable findings.
    </description>
    
    <wave_validations wave="0">
      <validation>Audit Assessment Matrix created for systematic review</validation>
      <validation>Domain Priority Map ranks areas 1-7 by importance</validation>
      <validation>Compliance Requirements identified for all frameworks</validation>
      <validation>Tool configuration completed for automated scanning</validation>
      <validation>Wave count determined by selected audit domains</validation>
    </wave_validations>
    
    <wave_validations wave="Dynamic (1-N)">
      <validation>Priority domains addressed first for maximum impact</validation>
      <validation>Framework compliance verified systematically</validation>
      <validation>Tool scans completed with results documented</validation>
      <validation>5-Layer validation applied to all findings</validation>
      <validation>False positive rate maintained below 10%</validation>
    </wave_validations>
    
    <wave_validations wave="Final">
      <validation>SECURITY_AUDIT_REPORT.md created using template</validation>
      <validation>All template sections populated comprehensively</validation>
      <validation>VULNERABILITY_REGISTER.md lists all findings</validation>
      <validation>COMPLIANCE_MATRIX.md shows framework adherence</validation>
      <validation>All major compliance issues addressed (none skipped)</validation>
    </wave_validations>
  </mode>
  
  <mode name="DEBUG">
    <description>
      Debug mode identifies and resolves issues with minimal side effects.
      Success requires root cause identification and comprehensive testing.
    </description>
    
    <wave_validations wave="0">
      <validation>Issue reproduced in controlled isolation</validation>
      <validation>Severity classification completed accurately</validation>
      <validation>Impact analysis identifies affected systems</validation>
      <validation>Debug strategy created with clear approach</validation>
      <validation>Team composition matches issue expertise needs</validation>
    </wave_validations>
    
    <wave_validations wave="Dynamic (1-N)">
      <validation>Root cause identified (beyond surface symptoms)</validation>
      <validation>Fix implemented with comprehensive tests</validation>
      <validation>Regression tests added to prevent recurrence</validation>
      <validation>Performance impact measured and acceptable</validation>
      <validation>Security assessment confirms no new vulnerabilities</validation>
    </wave_validations>
    
    <wave_validations wave="Final">
      <validation>DEBUG_REPORT.md documents complete investigation</validation>
      <validation>FIX_VALIDATION.md confirms resolution effectiveness</validation>
      <validation>All tests passing with no failures</validation>
      <validation>No unintended side effects introduced</validation>
      <validation>Rollback plan documented for safety</validation>
    </wave_validations>
  </mode>
  
  <mode name="OPTIMIZE">
    <description>
      Optimize mode improves performance while maintaining functionality.
      Success requires measurable improvements with data-driven decisions.
    </description>
    
    <wave_validations wave="0">
      <validation>Baseline metrics established with current performance</validation>
      <validation>Bottlenecks identified using profiling data</validation>
      <validation>Dynamic team roster targets specific bottlenecks</validation>
      <validation>ROI-based prioritization ranks improvements</validation>
      <validation>Measurable targets set for each optimization</validation>
    </wave_validations>
    
    <wave_validations wave="Dynamic (1-N)">
      <validation>Before/after metrics captured for each change</validation>
      <validation>Cost impact documented (resources, complexity)</validation>
      <validation>All functionality preserved (no breaking changes)</validation>
      <validation>Rollback procedures prepared and tested</validation>
      <validation>Incremental validation confirms improvements</validation>
    </wave_validations>
    
    <wave_validations wave="Final">
      <validation>OPTIMIZATION_REPORT.md shows all improvements</validation>
      <validation>MONITORING_SETUP.md enables ongoing tracking</validation>
      <validation>Performance targets achieved or exceeded</validation>
      <validation>Cost reduction OR performance gain demonstrated</validation>
      <validation>Load tests prove improvements under stress</validation>
    </wave_validations>
  </mode>
  
  <mode name="REFACTOR">
    <description>
      Refactor mode improves code quality without changing functionality.
      Success requires cleaner code with maintained behavior.
    </description>
    
    <wave_validations wave="0">
      <validation>Code quality metrics gathered as baseline</validation>
      <validation>Dynamic team assembled based on identified issues</validation>
      <validation>Test coverage exceeds 80% before starting</validation>
      <validation>Target architecture defined clearly</validation>
      <validation>Refactoring roadmap created with milestones</validation>
    </wave_validations>
    
    <wave_validations wave="Dynamic (1-N)">
      <validation>All tests remain green throughout refactoring</validation>
      <validation>Zero functional changes introduced</validation>
      <validation>Architectural decisions documented thoroughly</validation>
      <validation>Code metrics show continuous improvement</validation>
      <validation>Performance maintained or improved</validation>
    </wave_validations>
    
    <wave_validations wave="Final">
      <validation>REFACTORING_REPORT.md documents all changes</validation>
      <validation>ARCHITECTURE_GUIDE.md explains new structure</validation>
      <validation>All original tests pass without modification</validation>
      <validation>Technical debt measurably reduced</validation>
      <validation>Zero functional changes confirmed</validation>
    </wave_validations>
  </mode>
  
  <mode name="RESEARCH">
    <description>
      Research mode explores solutions with evidence-based recommendations.
      Success requires thorough evaluation with actionable findings.
    </description>
    
    <wave_validations wave="0">
      <validation>Research questions defined precisely</validation>
      <validation>Evaluation criteria established objectively</validation>
      <validation>Dynamic team assembled by topic expertise</validation>
      <validation>Methodology selected appropriately</validation>
      <validation>Success criteria clearly measurable</validation>
    </wave_validations>
    
    <wave_validations wave="Dynamic (1-N)">
      <validation>Evidence-based findings with data support</validation>
      <validation>POCs created and tested thoroughly</validation>
      <validation>Cost calculations include all factors</validation>
      <validation>Risk mitigation strategies planned</validation>
      <validation>Multiple options evaluated objectively</validation>
    </wave_validations>
    
    <wave_validations wave="Final">
      <validation>RESEARCH_FINDINGS.md presents all discoveries</validation>
      <validation>DECISION_MATRIX.md enables informed choices</validation>
      <validation>IMPLEMENTATION_ROADMAP.md guides next steps</validation>
      <validation>At least 3 options evaluated comprehensively</validation>
      <validation>All POCs available in repository</validation>
    </wave_validations>
  </mode>
</mode_validations>

## 🎯 Critical Quality Standards

<quality_standards>
  <standard name="Workspace Discipline">
    <description>
      All work must be contained within appropriate wave directories to maintain organization and traceability.
    </description>
    <requirements>
      <requirement>Create all new files within .waves/wave-N/ directories</requirement>
      <requirement>Respect wave boundaries - never modify other waves</requirement>
      <requirement>Keep project root clean of temporary files</requirement>
      <requirement>Use file reservations to prevent conflicts</requirement>
    </requirements>
    <failure_conditions>
      <condition>Files created outside .waves/ directory structure</condition>
      <condition>Files modified in waves other than current</condition>
      <condition>Work performed directly in project root</condition>
      <condition>Missing file reservations causing conflicts</condition>
    </failure_conditions>
  </standard>
  
  <standard name="Record Keeper Protocol">
    <description>
      Record Keepers ensure comprehensive documentation and validation throughout execution.
    </description>
    <requirements>
      <requirement>Include Record Keepers in every team deployment</requirement>
      <requirement>Record Keepers complete work after all other agents</requirement>
      <requirement>Create checkpoint files at each phase</requirement>
      <requirement>Update CONSTITUTION.md with all decisions</requirement>
      <requirement>Generate MODE_COMPLETION_SUMMARY.md at end</requirement>
    </requirements>
    <failure_conditions>
      <condition>Team deployed without Record Keeper presence</condition>
      <condition>Record Keeper completes before other agents</condition>
      <condition>Missing checkpoint documentation files</condition>
      <condition>CONSTITUTION.md not updated with decisions</condition>
      <condition>No MODE_COMPLETION_SUMMARY.md at completion</condition>
    </failure_conditions>
  </standard>
  
  <standard name="Git Workflow">
    <description>
      Maintain clean git history with atomic commits on appropriate branches.
    </description>
    <requirements>
      <requirement>Work exclusively on development branches</requirement>
      <requirement>Create single atomic commit per execution</requirement>
      <requirement>Write descriptive commit messages</requirement>
      <requirement>Ensure clean working directory before starting</requirement>
    </requirements>
    <failure_conditions>
      <condition>Working directly on main or master branch</condition>
      <condition>Creating commits during wave execution</condition>
      <condition>Multiple commits per wave instead of atomic</condition>
      <condition>Starting without creating development branch</condition>
    </failure_conditions>
  </standard>
  
  <standard name="Quality Metrics">
    <description>
      Maintain high quality standards for all deliverables.
    </description>
    <requirements>
      <requirement>Ensure all tests pass before completion</requirement>
      <requirement>Address security vulnerabilities proactively</requirement>
      <requirement>Provide comprehensive documentation</requirement>
      <requirement>Achieve 80%+ code coverage where applicable</requirement>
    </requirements>
    <failure_conditions>
      <condition>Tests failing at completion</condition>
      <condition>Known security vulnerabilities unaddressed</condition>
      <condition>Missing or inadequate documentation</condition>
      <condition>Code coverage below 80% threshold</condition>
    </failure_conditions>
  </standard>
</quality_standards>

## 🧪 Validation Framework

<validation_framework>
  <pre_execution_checks>
    <description>Verify environment readiness before starting execution</description>
    <commands>
      <command purpose="Verify clean git status">
        ```bash
        git status  # Must show clean working directory
        ```
      </command>
      <command purpose="Confirm development branch">
        ```bash
        git branch  # Must not be on main or master
        ```
      </command>
      <command purpose="Check Shadow Clone structure">
        ```bash
        ls -la .shadow-local/
        # Must contain: agent_rules/, mode_configs/, templates/, shadow-clone-prompt.md
        ```
      </command>
      <command purpose="Ensure no existing waves">
        ```bash
        ls .waves/ 2>/dev/null  # Should not exist before starting
        ```
      </command>
    </commands>
  </pre_execution_checks>
  
  <execution_monitoring>
    <description>Track progress during active execution</description>
    <commands>
      <command purpose="Monitor wave creation in real-time">
        ```bash
        watch -n 1 'ls -la .waves/'
        ```
      </command>
      <command purpose="Check Record Keeper status">
        ```bash
        cat .waves/wave-*/RECORD_KEEPER_STATUS.md
        ```
      </command>
      <command purpose="Verify workspace discipline">
        ```bash
        find . -name "*.md" -newer .waves/wave-0/WAVE_STATUS.md | grep -v ".waves/"
        # Should return nothing (all new files in .waves/)
        ```
      </command>
    </commands>
  </execution_monitoring>
  
  <post_execution_validation>
    <description>Confirm successful completion and quality standards</description>
    <commands>
      <command purpose="List all deliverables">
        ```bash
        find .waves/ -name "*.md" | sort
        ```
      </command>
      <command purpose="Verify Record Keeper completion">
        ```bash
        tail .waves/wave-*/RECORD_KEEPER_LOG.md
        ```
      </command>
      <command purpose="Check git commit status">
        ```bash
        git status  # Should show single commit ready
        ```
      </command>
      <command purpose="Validate mode-specific outputs">
        ```bash
        # Examples for different modes:
        ls .waves/wave-*/MASTER_PLAN.md  # Planning mode
        ls .waves/wave-*/SECURITY_AUDIT_REPORT.md  # Audit mode
        # Add checks for other mode deliverables
        ```
      </command>
    </commands>
  </post_execution_validation>
</validation_framework>

## 💻 Automated Validation Script

<automated_validation>
  <description>
    Python script structure for automated mode execution validation.
    Use this as a template for building comprehensive test suites.
  </description>
  
  ```python
  def validate_mode_execution(mode_name):
      """
      Validate complete mode execution against defined standards.
      
      Args:
          mode_name: The Shadow Clone mode being validated
          
      Returns:
          bool: True if all validations pass, False otherwise
      """
      
      # Phase 1: System Initialization Checks
      assert verify_system_initialized(), "System initialization failed"
      assert verify_git_branch() != "main", "Must not be on main branch"
      assert os.path.exists(".waves/wave-0/"), "Wave-0 directory not created"
      
      # Phase 2: Team Configuration Validation
      teams = get_deployed_teams()
      for team in teams:
          assert has_record_keeper(team), f"Team {team.name} missing Record Keeper"
          assert len(team.agents) <= 10, f"Team {team.name} exceeds 10-agent limit"
      
      # Phase 3: Wave-0 Output Validation
      assert validate_wave_0_outputs(mode_name), "Wave-0 outputs incomplete"
      assert verify_no_implementation_in_wave_0(), "Wave-0 contains implementation code"
      
      # Phase 4: Dynamic Wave Execution
      total_waves = get_total_waves()
      for wave_num in range(1, total_waves):
          assert validate_wave_outputs(wave_num, mode_name), f"Wave {wave_num} outputs invalid"
          assert verify_workspace_discipline(wave_num), f"Wave {wave_num} workspace violations"
          assert verify_three_phase_pattern(wave_num), f"Wave {wave_num} phase pattern incorrect"
      
      # Phase 5: Final Deliverable Validation
      assert verify_mode_deliverables(mode_name), "Mode deliverables incomplete"
      assert verify_record_keeper_last(), "Record Keeper did not complete last"
      assert os.path.exists("MODE_COMPLETION_SUMMARY.md"), "Missing completion summary"
      
      # Phase 6: Git Workflow Validation
      assert verify_single_commit(), "Multiple commits detected"
      assert verify_dev_branch(), "Not on development branch"
      assert verify_clean_working_directory(), "Uncommitted changes remain"
      
      return True
  
  
  # Helper function examples
  def verify_three_phase_pattern(wave_num):
      """Verify wave follows Pre-Wave, Main, Post-Wave pattern"""
      wave_dir = f".waves/wave-{wave_num}"
      return all([
          os.path.exists(f"{wave_dir}/PRE_WAVE_COMPLETE.md"),
          os.path.exists(f"{wave_dir}/MAIN_WAVE_COMPLETE.md"),
          os.path.exists(f"{wave_dir}/POST_WAVE_COMPLETE.md")
      ])
  
  
  def has_record_keeper(team):
      """Check if team includes Record Keeper role"""
      return any(agent.role == "Record Keeper" for agent in team.agents)
  ```
</automated_validation>

## 📚 Quick Reference Guide

<quick_reference>
  <execution_checklist>
    Before starting any Shadow Clone execution:
    
    ☐ Verify clean git status (no uncommitted changes)
    ☐ Create and switch to development branch
    ☐ Confirm .shadow-local structure is complete
    ☐ Review mode-specific requirements
    ☐ Understand expected deliverables
    
    During execution:
    
    ☐ Monitor wave creation and progress
    ☐ Verify workspace discipline maintained
    ☐ Check Record Keeper status regularly
    ☐ Ensure three-phase pattern followed
    ☐ Validate outputs meet requirements
    
    After completion:
    
    ☐ Verify all deliverables created
    ☐ Confirm MODE_COMPLETION_SUMMARY.md exists
    ☐ Check single atomic commit ready
    ☐ Validate all tests passing
    ☐ Review security and quality metrics
  </execution_checklist>
  
  <common_patterns>
    <pattern name="Three-Phase Wave">
      Every wave follows: Pre-Wave → Main Wave → Post-Wave
      Record Keepers bookend the execution
    </pattern>
    
    <pattern name="10-Agent Batching">
      Large teams split into sub-waves (a, b, c...)
      Maintains system stability and coordination
    </pattern>
    
    <pattern name="Workspace Isolation">
      All work in .waves/wave-N/ directories
      Never modify files outside current wave
    </pattern>
    
    <pattern name="Collective Leadership">
      Record Keeper Collective replaces single Team Lead
      Distributed decision-making and validation
    </pattern>
  </common_patterns>
</quick_reference>

---

*This flowchart and validation framework ensures consistent, high-quality execution across all Shadow Clone modes. Use it as your primary reference for implementing and validating Shadow Clone deployments.*