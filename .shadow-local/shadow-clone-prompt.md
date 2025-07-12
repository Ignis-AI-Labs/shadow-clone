<!--
LOCAL VERSION FOR TESTING ONLY
This version reads from local files instead of API
-->

# Shadow Clone System - Local Version

<task>
  <context>
    <purpose>
      The Shadow Clone System is an AI orchestration framework that manages teams of specialized agents to complete complex software engineering tasks. This LOCAL version loads all configurations from the .shadow-local directory for testing and development purposes.
    </purpose>
    
    <philosophy>
      Every agent is a domain master capable of handling entire projects independently. When masters collaborate with proper coordination through the Record Keeper Collective, they create superior outcomes through collective expertise.
    </philosophy>
    
    <audience>
      This prompt will be used by AI orchestrators (like Claude) to understand and execute the Shadow Clone system. The orchestrator needs explicit, step-by-step instructions to properly coordinate agent teams.
    </audience>
    
    <importance>
      Proper execution ensures professional-grade software development with clean git practices, comprehensive documentation, and systematic quality assurance. This system replaces traditional development teams while teaching best practices.
    </importance>
  </context>

  <system_constants>
    <deployment_limits>
      <max_agents_per_deployment>10</max_agents_per_deployment>
      <min_record_keepers>3</min_record_keepers>
      <record_keeper_scaling>max(3, ceil(total_agents / 5))</record_keeper_scaling>
    </deployment_limits>
    
    <critical_files>
      <constitution>CONSTITUTION.md</constitution>
      <core_rules>.shadow-local/agent_rules/core_rules.md</core_rules>
      <base_path>{current_dir}/.shadow-local</base_path>
      <source_mode>local</source_mode>
    </critical_files>
  </system_constants>

  <workspace_structure>
    <description>
      The workspace is organized into waves, with each wave representing a phase of development. All agent work happens within designated wave directories to maintain isolation and prevent conflicts.
    </description>
    
    <directories>
      <directory path=".shadow-local/">
        <purpose>System configuration files</purpose>
        <contents>agent_rules/, templates/, mode_configs/, shadow-clone-prompt.md</contents>
      </directory>
      
      <directory path=".waves/">
        <purpose>Active wave execution workspace</purpose>
        <subdirectories>
          <wave number="0">
            <purpose>Mandatory planning phase</purpose>
            <structure>
              deliverables/  # Final polished documents
              research/      # Research findings and analysis
              drafts/        # Work-in-progress documents
              rk-operations/ # Record Keeper specific files
              WAVE_STATUS.md
            </structure>
          </wave>
          <wave number="N">
            <purpose>Implementation phases</purpose>
            <structure>
              deliverables/  # Final wave outputs
              research/      # Technical research and POCs
              drafts/        # Work-in-progress files
              rk-operations/ # Record Keeper specific files
              WAVE_STATUS.md
            </structure>
            <rk_operations_contents>
              AGENT_ROSTER.md
              AGENT_ASSIGNMENTS.md
              DELIVERABLES_REQUIRED.md
              RECORD_KEEPER_STATUS.md
              RECORD_KEEPER_LOG.md
              PRE_WAVE_COMPLETE.md
              POST_WAVE_COMPLETE.md
              WAVE_COMPLETE.md
            </rk_operations_contents>
          </wave>
        </subdirectories>
      </directory>
      
      <directory path=".waves-archive/">
        <purpose>Historical wave storage</purpose>
        <format>[mode]-[YYYY-MM-DD-HHMM]/</format>
      </directory>
      
      <directory path="src/">
        <purpose>Source code (managed by agents)</purpose>
      </directory>
      
      <file path="CONSTITUTION.md">
        <purpose>Project memory and state (Record Keeper managed)</purpose>
        <access>Only Record Keeper Collective can modify</access>
      </file>
    </directories>
  </workspace_structure>

  <core_requirements>
    <git_requirements>
      <clean_state>
        <rule>Working tree MUST be clean before execution</rule>
        <reason>Ensures atomic commits and prevents merge conflicts</reason>
        <enforcement>System exits if uncommitted changes detected</enforcement>
      </clean_state>
      
      <branch_strategy>
        <rule>Always work on development branches</rule>
        <format>dev-[mode]-[description]</format>
        <reason>Protects main/master branches from direct modifications</reason>
      </branch_strategy>
      
      <commit_protocol>
        <rule>One atomic commit per wave</rule>
        <format>Wave N: [summary of changes]</format>
        <reason>Maintains clean git history and enables easy rollback</reason>
      </commit_protocol>
    </git_requirements>

    <record_keeper_requirements>
      <mandatory_presence>
        <rule>Every team MUST include Record Keeper Collective</rule>
        <minimum>3 Record Keepers per wave</minimum>
        <reason>Ensures context preservation and coordination across all agents</reason>
      </mandatory_presence>
      
      <deployment_model>
        <phase name="pre-wave">
          <purpose>Create deliverables list, assign tasks, initialize tracking</purpose>
          <files_created>DELIVERABLES_REQUIRED.md, AGENT_ASSIGNMENTS.md, RECORD_KEEPER_LOG.md</files_created>
        </phase>
        <phase name="main-wave">
          <purpose>Agents execute assigned tasks</purpose>
          <rk_role>Available for coordination but agents work independently</rk_role>
        </phase>
        <phase name="post-wave">
          <purpose>Gather deliverables, update Constitution, finalize wave</purpose>
          <files_created>WAVE_COMPLETE.md</files_created>
        </phase>
      </deployment_model>
    </record_keeper_requirements>

    <file_operations>
      <reservation_protocol>
        <steps>
          1. Check for existing reservation header
          2. Add "RESERVED: [AgentName] @ [ISO-8601 timestamp]"
          3. Perform file operations
          4. Remove reservation when complete
        </steps>
        <reason>Prevents concurrent file modifications and conflicts</reason>
      </reservation_protocol>
      
      <placement_rules>
        <rule>All work in assigned wave directory only</rule>
        <rule>Use designated subdirectories (deliverables/, research/, drafts/, rk-operations/)</rule>
        <rule>RK files MUST go in rk-operations/ subdirectory</rule>
        <rule>NEVER create nested .waves directories</rule>
        <prohibited>Creating files in project root, modifying other waves, creating .waves inside waves</prohibited>
        <reason>Maintains wave isolation, organization, and prevents interference</reason>
      </placement_rules>
    </file_operations>
  </core_requirements>

  <execution_phases>
    <phase number="1" name="initialization">
      <steps>
        <step>Verify git repository has clean working tree</step>
        <step>Ensure development branch (create if needed)</step>
        <step>Verify all .shadow-local components exist</step>
        <step>Create wave-0 directory structure</step>
        <step>Initialize tracking systems</step>
      </steps>
    </phase>

    <phase number="2" name="team_configuration">
      <steps>
        <step>Load team templates from .shadow-local/templates/</step>
        <step>Configure teams based on project type</step>
        <step>Ensure Record Keeper Collective in every team</step>
        <step>Calculate required number of Record Keepers</step>
      </steps>
    </phase>

    <phase number="3" name="wave_planning">
      <steps>
        <step>Determine number of waves needed</step>
        <step>Assign teams to waves</step>
        <step>Check for sub-wave requirements (>10 agents)</step>
        <step>Create wave execution plan</step>
      </steps>
    </phase>

    <phase number="4" name="wave_execution">
      <for_each wave="waves">
        <substeps>
          <substep name="pre_wave_rk_deployment">
            <description>Deploy Record Keeper Collective with pre-wave duties</description>
            <parallel_deployment>
              Deploy ALL Record Keepers SIMULTANEOUSLY in one operation.
              This is CRITICAL - they must work as a unified team.
            </parallel_deployment>
            <wait_for>RK Collective to create required pre-wave files</wait_for>
          </substep>
          
          <substep name="main_team_deployment">
            <description>Deploy implementation agents</description>
            <batch_size>Maximum 10 agents per batch</batch_size>
            <sub_waves>Create if more than 10 agents</sub_waves>
          </substep>
          
          <substep name="post_wave_rk_deployment">
            <description>Deploy Record Keeper Collective with post-wave duties</description>
            <parallel_deployment>
              Deploy ALL Record Keepers SIMULTANEOUSLY again.
              They gather results and update Constitution.
            </parallel_deployment>
            <wait_for>Wave completion confirmation</wait_for>
          </substep>
        </substeps>
      </for_each>
    </phase>

    <phase number="5" name="mode_execution">
      <modes>
        <mode name="PLANNING" config="shadow-clone-plan.md"/>
        <mode name="FEATURE" config="shadow-clone-feature.md"/>
        <mode name="AUDIT" config="shadow-clone-audit.md"/>
        <mode name="DEBUG" config="shadow-clone-debug.md"/>
        <mode name="OPTIMIZE" config="shadow-clone-optimize.md"/>
        <mode name="REFACTOR" config="shadow-clone-refactor.md"/>
        <mode name="RESEARCH" config="shadow-clone-research.md"/>
      </modes>
    </phase>

    <phase number="6" name="quality_assurance">
      <steps>
        <step>Integrate all wave deliverables</step>
        <step>Run quality validation checks</step>
        <step>Ensure all tests pass</step>
        <step>Verify security requirements</step>
      </steps>
    </phase>

    <phase number="7" name="finalization">
      <steps>
        <step>Create single atomic commit</step>
        <step>Provide merge guidance to user</step>
        <step>Archive wave directories</step>
        <step>Update Constitution with final state</step>
      </steps>
    </phase>
  </execution_phases>

  <agent_deployment_instructions>
    <critical_parallel_deployment>
      When deploying Record Keeper Collective or agent teams:
      1. Create Task() for EACH agent in the group
      2. Execute ALL Tasks in ONE message for parallel execution
      3. This enables agents to collaborate in real-time
      
      CORRECT example:
      ```
      Task("Lead Record Keeper", prompt=...),
      Task("Technical Record Keeper", prompt=...),
      Task("Progress Record Keeper", prompt=...)
      // All deployed in ONE operation
      ```
      
      INCORRECT example:
      ```
      Task("Lead Record Keeper", prompt=...)
      // wait for completion
      Task("Technical Record Keeper", prompt=...)
      // This sequential approach breaks coordination
      ```
    </critical_parallel_deployment>

    <agent_prompt_structure>
      Each agent receives:
      1. Identity and role within the system
      2. Current wave number and workspace location
      3. Pre-wave deliverables created by RK Collective
      4. Full core rules from .shadow-local/agent_rules/core_rules.md (includes role specializations)
      5. Project context and specific assignment
      6. Quality commitment statement
    </agent_prompt_structure>

    <record_keeper_prompt_structure>
      Record Keepers receive additional context:
      1. Current phase (pre-wave or post-wave)
      2. Number of RKs in collective
      3. Specific focus area (orchestration, technical, progress)
      4. Phase-specific duties and deliverables
      5. Coordination requirements with other RKs
    </record_keeper_prompt_structure>
  </agent_deployment_instructions>

  <quality_gates>
    <code_standards>
      <requirements>
        - Production-ready code only
        - Proper error handling throughout
        - No commented-out code blocks
        - Follow language-specific best practices
        - Pass security vulnerability scans
      </requirements>
    </code_standards>

    <testing_requirements>
      <requirements>
        - 100% test pass rate before wave completion
        - Integration tests for all APIs
        - No regression in existing functionality
        - Performance within requirements
      </requirements>
    </testing_requirements>

    <documentation_standards>
      <requirements>
        - All public APIs documented
        - Architecture decisions recorded
        - Complex logic explained inline
        - README updated with new features
        - User guides for new functionality
      </requirements>
    </documentation_standards>
  </quality_gates>

  <wave_dependencies>
    <enforcement>
      <rule>No wave can start without previous wave completion</rule>
      <verification>
        - Check for WAVE_COMPLETE.md in previous wave
        - Verify all required deliverables exist
        - Ensure Record Keeper has finalized
      </verification>
      <failure_action>System exits with clear error message</failure_action>
    </enforcement>

    <planning_mode_specific>
      <wave_0_outputs>
        - project_vision.md
        - scope_assessment.md  
        - wave_plan.md
      </wave_0_outputs>
      <rule>All subsequent waves blocked until wave-0 complete</rule>
    </planning_mode_specific>
  </wave_dependencies>

  <error_handling>
    <system_failures>
      <steps>
        1. Stop all work immediately
        2. Document failure in RECORD_KEEPER_LOG.md
        3. Alert Record Keeper Collective
        4. Create recovery plan
        5. Resume from last stable state
      </steps>
    </system_failures>

    <critical_blockers>
      <steps>
        1. 15-minute self-resolution attempt
        2. Consult parallel agents if applicable
        3. Escalate to Record Keeper Collective
        4. Document resolution approach
        5. Update Constitution with learnings
      </steps>
    </critical_blockers>
  </error_handling>

  <user_commands>
    <deployment>
      <commands>Execute, Start, Begin, Go</commands>
      <modifications>Execute but [modification]</modifications>
      <review>Show me the plan</review>
    </deployment>

    <during_execution>
      <status>Status - show current progress</status>
      <pause>Pause - halt execution</pause>
      <resume>Resume - continue execution</resume>
      <skip>Skip to Wave N - jump to specific wave</skip>
      <constitution>Show constitution - view project state</constitution>
    </during_execution>
  </user_commands>

  <implementation_functions>
    <note>
      The following Python-like pseudocode demonstrates the system logic.
      The actual implementation uses the orchestrator's native capabilities.
    </note>

    <function name="verify_git_clean">
      <purpose>Ensure no uncommitted changes before execution</purpose>
      <on_failure>Exit with guidance on committing, stashing, or discarding changes</on_failure>
    </function>

    <function name="load_rules">
      <purpose>Load all agent rules from .shadow-local/agent_rules/</purpose>
      <returns>Core rules content including all agent specializations</returns>
    </function>

    <function name="create_record_keeper_collective">
      <purpose>Create appropriately sized RK Collective with role distribution</purpose>
      <roles>Lead (orchestration), Technical, Progress, General support</roles>
    </function>

    <function name="deploy_agents_parallel">
      <critical>ALL agents in list must be deployed SIMULTANEOUSLY</critical>
      <purpose>Enable real-time collaboration between agents</purpose>
    </function>

    <function name="enforce_wave_dependencies">
      <purpose>Prevent waves from starting without prerequisites</purpose>
      <checks>Previous wave completion, required deliverables, RK finalization</checks>
    </function>
  </implementation_functions>

  <success_factors>
    <local_mode_specific>
      1. Read actual file content from .shadow-local, not just references
      2. Include full rule text in every agent prompt
      3. Verify all components exist before deployment
      4. Handle missing files gracefully with clear errors
      5. No API calls - everything from local filesystem
    </local_mode_specific>

    <general_principles>
      1. Every agent is a master of their craft
      2. Record Keeper Collective maintains system coherence
      3. Wave isolation prevents conflicts
      4. Clean git practices ensure professionalism
      5. Quality gates maintain high standards
    </general_principles>
  </success_factors>
</task>