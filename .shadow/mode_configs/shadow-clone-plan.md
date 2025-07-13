# Planning Mode Configuration

<mode_overview>
  <context>
    <purpose>
      Transform ideas into actionable project blueprints through systematic planning.
      This mode produces a comprehensive MASTER_PLAN document that guides successful implementation.
    </purpose>
    
    <why_important>
      Well-planned projects succeed. This mode ensures thorough analysis, technical design,
      and strategic roadmapping before implementation begins. Your planning investment
      reduces risks and creates clear paths to success.
    </why_important>
    
    <audience>
      Planning agents who research, analyze, and document project approaches.
      These agents create blueprints for future implementation teams.
    </audience>
  </context>
</mode_overview>

<wave_structure>
  <wave_0>
    <name>Foundation & Assessment</name>
    <purpose>
      Understand project requirements, identify technical constraints,
      and create initial scope documentation to guide all planning work.
    </purpose>
    
    <team_composition>
      - Vision Architect: Clarifies and documents project vision
      - Requirements Analyst: Gathers and structures core requirements  
      - Technical Assessor: Evaluates complexity and technical needs
      - Record Keeper Collective: Maintains project context and decisions
    </team_composition>
    
    <deliverables>
      <deliverable path="deliverables/PROJECT_FOUNDATION.md">
        Single comprehensive document containing:
        - Project vision and goals
        - Core requirements (functional and non-functional)
        - Technical constraints and considerations
        - Initial complexity assessment
        - Recommended planning approach
      </deliverable>
    </deliverables>
    
    <instructions>
      1. Create a clear project vision statement
      2. Document all stakeholder requirements
      3. Assess technical complexity and constraints
      4. Determine optimal number of research waves needed (1-2)
      5. Consolidate all findings into PROJECT_FOUNDATION.md
    </instructions>
  </wave_0>
  
  <wave_1>
    <name>Research & Analysis</name>
    <purpose>
      Gather implementation approaches, analyze best practices,
      and document technical decisions to inform the master plan.
    </purpose>
    
    <team_composition>
      - Architecture Researcher: Investigates design patterns and systems
      - Best Practices Analyst: Researches industry standards and approaches
      - Technology Evaluator: Assesses tools and frameworks
      - Record Keeper Collective: Synthesizes research findings
    </team_composition>
    
    <deliverables>
      <deliverable path="deliverables/TECHNICAL_RESEARCH.md">
        Consolidated research document containing:
        - Recommended architecture patterns
        - Technology stack evaluation
        - Best practices for implementation
        - Integration approaches
        - Security and performance considerations
      </deliverable>
    </deliverables>
    
    <instructions>
      1. Research relevant architecture patterns for the project type
      2. Evaluate technology options against project requirements
      3. Document best practices for each technical component
      4. Analyze integration points and data flow patterns
      5. Consolidate all research into TECHNICAL_RESEARCH.md
    </instructions>
  </wave_1>
  
  <wave_2>
    <name>Master Plan Creation</name>
    <purpose>
      Synthesize all findings into an actionable MASTER_PLAN,
      define implementation phases, and create the final planning deliverable.
    </purpose>
    
    <team_composition>
      - Master Plan Architect: Creates comprehensive project blueprint
      - Implementation Strategist: Designs execution phases
      - Quality Planner: Defines success metrics and validation
      - Record Keeper Collective: Finalizes all documentation
    </team_composition>
    
    <deliverables>
      <deliverable path="deliverables/MASTER_PLAN.md">
        Complete project blueprint including:
        1. Executive Summary
        2. Project Vision & Goals
        3. Requirements & Scope
        4. Technical Architecture
        5. Implementation Roadmap
        6. Quality Standards
        7. Risk Mitigation
        8. Success Metrics
      </deliverable>
    </deliverables>
    
    <instructions>
      1. Read and synthesize PROJECT_FOUNDATION.md
      2. Incorporate insights from TECHNICAL_RESEARCH.md
      3. Create detailed implementation phases with clear milestones
      4. Define quality standards and success criteria
      5. Produce comprehensive MASTER_PLAN.md following the template
    </instructions>
  </wave_2>
</wave_structure>

<planning_guidelines>
  <principle>
    Focus on research and documentation to create actionable plans.
    Planning agents analyze, design, and document approaches for implementation teams.
  </principle>
  
  <principle>
    Create essential documents that provide real value.
    Each deliverable should directly contribute to project success.
  </principle>
  
  <principle>
    Build systematically on previous work.
    Each wave reads and incorporates insights from earlier waves.
  </principle>
  
  <activities_to_perform>
    - Research industry best practices and proven patterns
    - Analyze project requirements and technical constraints
    - Design system architectures and data models
    - Create detailed implementation strategies
    - Document technical approaches with rationale
    - Plan quality assurance and testing strategies
    - Design API specifications and integration patterns
    - Assess risks and create mitigation plans
  </activities_to_perform>
  
  <workspace_organization>
    <instruction>Maintain clean workspace structure for clarity</instruction>
    <structure>
      .waves/wave-0/
        deliverables/     # Final polished documents only
        drafts/           # Work-in-progress content
        rk-operations/    # Record Keeper coordination
      
      .waves/wave-1/
        deliverables/     # Final polished documents only
        drafts/           # Work-in-progress content
        rk-operations/    # Record Keeper coordination
      
      .waves/wave-2/
        deliverables/     # Final polished documents only
        drafts/           # Work-in-progress content
        rk-operations/    # Record Keeper coordination
    </structure>
  </workspace_organization>
</planning_guidelines>

<file_creation_discipline>
  <principle>
    Create only essential files that advance the planning process.
    Consolidate related information into comprehensive documents.
  </principle>
  
  <instructions>
    1. Produce exactly one deliverable per wave in deliverables/
    2. Use drafts/ for work-in-progress content only
    3. Let Record Keeper Collective manage rk-operations/
    4. Avoid creating redundant tracking files
    5. Focus on quality over quantity of documentation
  </instructions>
  
  <examples>
    <good>Consolidate all foundation work into PROJECT_FOUNDATION.md</good>
    <good>Combine all research findings into TECHNICAL_RESEARCH.md</good>
    <good>Create single comprehensive MASTER_PLAN.md</good>
    <bad>Creating separate files for each small finding</bad>
    <bad>Duplicating information across multiple documents</bad>
  </examples>
</file_creation_discipline>

<wave_progression>
  <instruction>
    Execute waves sequentially, completing each fully before proceeding.
    This ensures systematic building of knowledge and comprehensive planning.
  </instruction>
  
  <flow>
    Wave 0: Establish foundation with PROJECT_FOUNDATION.md
      ↓ (Wave 0 must complete before Wave 1 begins)
    Wave 1: Conduct research producing TECHNICAL_RESEARCH.md  
      ↓ (Wave 1 must complete before Wave 2 begins)
    Wave 2: Create final MASTER_PLAN.md synthesizing all work
      ↓
    Planning Complete: Ready for implementation mode
  </flow>
  
  <validation>
    Each wave completion requires:
    - Deliverable present in deliverables/ directory
    - Record Keeper Collective confirms wave complete
    - All team members have finished their work
  </validation>
</wave_progression>

<success_criteria>
  <criterion>Clear, actionable MASTER_PLAN ready for implementation teams</criterion>
  <criterion>All requirements captured and addressed in planning</criterion>
  <criterion>Technical approach validated through research</criterion>
  <criterion>Implementation phases clearly defined with milestones</criterion>
  <criterion>Risks identified with mitigation strategies documented</criterion>
  <criterion>Success metrics defined for project validation</criterion>
</success_criteria>

<implementation_note>
  Planning mode focuses exclusively on creating blueprints.
  Implementation begins only after MASTER_PLAN completion in subsequent feature waves.
  This separation ensures thorough planning before any code is written.
</implementation_note>