# Planning Mode Configuration

<mode_overview>
  <purpose>
    Transform your innovative ideas into comprehensive, actionable project blueprints.
    Planning Mode creates detailed MASTER_PLAN documents that guide successful project execution
    through systematic discovery, architecture design, and strategic roadmap development.
  </purpose>
  
  <motivation>
    Great projects start with great plans. This mode ensures your vision is thoroughly analyzed,
    technically architected, and strategically mapped before any code is written. By investing
    in proper planning, you reduce risks, optimize resources, and create clear paths to success.
  </motivation>
</mode_overview>

<wave_structure>
  <wave_0>
    <name>Discovery Wave (Foundation)</name>
    <description>
      The critical first wave that establishes project vision, analyzes complexity,
      and determines the optimal planning approach for your specific needs.
    </description>
    
    <team_composition>
      - Vision Architect: Shapes and clarifies the project vision
      - Requirements Analyst: Identifies and documents core requirements
      - Scope Assessor: Evaluates project complexity and technical challenges
      - Planning Strategist: Designs the optimal wave structure
      - Record Keeper: Documents all decisions and maintains project history
    </team_composition>
    
    <deliverables>
      <deliverable name="project_vision.md">
        Clear, inspiring project vision that aligns all stakeholders
      </deliverable>
      <deliverable name="scope_assessment.md">
        Comprehensive complexity analysis with technical considerations
      </deliverable>
      <deliverable name="initial_requirements.md">
        Core functional and non-functional requirements
      </deliverable>
      <deliverable name="planning_strategy.md">
        Recommended wave structure tailored to project needs
      </deliverable>
      <deliverable name="wave_plan.md">
        Detailed execution approach for subsequent waves
      </deliverable>
    </deliverables>
    
    <key_outcome>
      Determines the optimal number of planning waves (typically 1-5) based on
      project complexity, ensuring efficient and thorough planning.
    </key_outcome>
  </wave_0>
  
  <dynamic_planning_waves>
    <description>
      Flexible waves (1 to N) that deploy specialized teams based on Wave-0 assessment.
      Each wave builds upon previous work, creating comprehensive project documentation.
    </description>
    
    <available_teams>
      <team name="Technical Architecture Team">
        Designs system architecture, technology stack, and integration patterns
      </team>
      <team name="Infrastructure Planning Team">
        Plans deployment, scaling, monitoring, and operational requirements
      </team>
      <team name="Security & Compliance Team">
        Ensures security best practices and regulatory compliance
      </team>
      <team name="Resource Planning Team">
        Optimizes team structure, timeline, and budget allocation
      </team>
      <team name="UX/UI Design Team">
        Creates user experience flows and interface design systems
      </team>
      <team name="Integration Strategy Team">
        Plans external system integrations and data flow architecture
      </team>
    </available_teams>
    
    <complexity_guidelines>
      <guideline complexity="simple">
        1-2 planning waves for straightforward projects with clear requirements
      </guideline>
      <guideline complexity="medium">
        2-3 planning waves for projects with multiple components or integrations
      </guideline>
      <guideline complexity="complex">
        3-5 planning waves for enterprise solutions with extensive requirements
      </guideline>
    </complexity_guidelines>
  </dynamic_planning_waves>
  
  <final_wave>
    <name>Master Plan Consolidation</name>
    <description>
      The culminating wave that synthesizes all planning work into a single,
      comprehensive MASTER_PLAN document ready for execution.
    </description>
    
    <team_composition>
      - Master Plan Architect: Synthesizes all planning outputs
      - Technical Consolidator: Ensures technical coherence and completeness
      - Execution Strategist: Creates actionable implementation roadmap
      - Quality Validator: Verifies plan completeness and quality
      - Record Keeper: Finalizes all documentation
    </team_composition>
    
    <primary_output>
      MASTER_PLAN.md - Your complete project blueprint following the
      templates/MASTER_PLAN_TEMPLATE.md structure for consistency
    </primary_output>
  </final_wave>
</wave_structure>

<master_plan_contents>
  <section number="1">Executive Summary & Vision</section>
  <section number="2">Requirements & Scope</section>
  <section number="3">Technical Architecture</section>
  <section number="4">Implementation Roadmap</section>
  <section number="5">Resource Allocation</section>
  <section number="6">Risk Management</section>
  <section number="7">Quality Standards</section>
  <section number="8">Wave Execution Plan</section>
</master_plan_contents>

<operating_principles>
  <principle priority="CRITICAL">
    NO CODE WRITING - Planning mode agents MUST NOT write any implementation code
  </principle>
  <principle priority="CRITICAL">
    Research and document ONLY - Focus on analysis, best practices, and planning
  </principle>
  <principle>
    Focus exclusively on planning - implementation begins only after MASTER_PLAN completion
  </principle>
  <principle>
    Create the MASTER_PLAN document exclusively in the final wave
  </principle>
  <principle>
    Build each wave's work upon insights from previous waves
  </principle>
  <principle>
    Adapt wave count dynamically based on project needs
  </principle>
  <principle>
    Maintain all work within designated wave folders for organization
  </principle>
</operating_principles>

<planning_mode_restrictions>
  <critical_rule>
    Planning mode is for PLANNING ONLY. No agent should write, create, or modify any source code.
  </critical_rule>
  
  <allowed_activities>
    - Research industry best practices and patterns
    - Analyze existing codebases to understand structure
    - Create architectural diagrams and designs
    - Write detailed implementation plans and strategies
    - Document technical approaches and trade-offs
    - Assess project complexity and requirements
    - Design data models and API specifications
    - Plan testing strategies and quality measures
  </allowed_activities>
  
  <prohibited_activities>
    - Writing any source code files
    - Creating implementation files of any kind
    - Modifying existing code
    - Running code or executing tests
    - Creating pull requests with code changes
    - Implementing features or fixes
    - Building prototypes with actual code
  </prohibited_activities>
  
  <enforcement>
    Any agent that attempts to write code during planning mode should be immediately
    reminded that planning mode is for research and documentation only. Implementation
    happens in subsequent feature waves after the MASTER_PLAN is complete.
  </enforcement>
</planning_mode_restrictions>

<wave_dependencies>
  <wave_0_requirements>
    <description>
      These deliverables establish the foundation for all subsequent planning.
      Wave-1 can begin only after these are complete and validated.
    </description>
    
    <required_files>
      - deliverables/project_vision.md
      - deliverables/scope_assessment.md
      - deliverables/initial_requirements.md
      - deliverables/planning_strategy.md
      - deliverables/wave_plan.md
      - WAVE_COMPLETE.md (created by Record Keeper)
    </required_files>
  </wave_0_requirements>
  
  <planning_wave_requirements>
    <description>
      Each planning wave (1 through N-1) builds systematically on previous work,
      ensuring comprehensive coverage and avoiding gaps.
    </description>
    
    <wave_must>
      - Read and incorporate insights from all previous wave outputs
      - Create specialized deliverables in designated wave folder
      - Have Record Keeper create WAVE_COMPLETE.md upon completion
      - Enable subsequent waves through completed deliverables
    </wave_must>
  </planning_wave_requirements>
  
  <final_wave_prerequisites>
    <description>
      The final consolidation wave ensures all planning is complete before
      creating the unified MASTER_PLAN document.
    </description>
    
    <requirements>
      - All previous waves marked complete with WAVE_COMPLETE.md files
      - All planning deliverables present and validated
      - Record Keeper documentation of all major decisions complete
      - No gaps identified in planning coverage
    </requirements>
  </final_wave_prerequisites>
  
  <enforcement>
    The system automatically validates these dependencies, ensuring proper
    wave progression and preventing premature advancement. This maintains
    planning quality and completeness throughout the process.
  </enforcement>
</wave_dependencies>

<success_metrics>
  <metric>Clear, actionable MASTER_PLAN ready for implementation</metric>
  <metric>All stakeholder requirements captured and addressed</metric>
  <metric>Technical architecture validated and documented</metric>
  <metric>Risk mitigation strategies identified and planned</metric>
  <metric>Resource allocation optimized for project success</metric>
</success_metrics>