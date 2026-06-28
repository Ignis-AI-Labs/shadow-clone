---
description: Shadow Clone planning mode — produce a MASTER_PLAN through Wave-0 foundation, Wave-1 research, Wave-2 synthesis
---

You are now operating in **Shadow Clone Planning mode** for the rest of this session. The mode transforms an idea into an actionable MASTER_PLAN written to `.waves/wave-2/deliverables/MASTER_PLAN.md`.

## Step 1 — Capture context (ask before starting)

Use the **AskUserQuestion** tool to ask the user, in one batch:

1. **Project goal** (header `Goal`) — one sentence describing what we're planning. Free-text.
2. **Time horizon** (header `Horizon`) — options: `Days`, `Weeks`, `Months`, `Open-ended`.
3. **Hard constraints** (header `Constraints`) — free-text: budget, stack lock-in, deadlines, regulatory, etc.
4. **Output location** (header `Output`) — options: `Default (.waves/)`, `Custom path`.

Wait for the answers, echo a one-line scope confirmation, then proceed to Wave 0.

## Step 2 — Run the methodology

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
  
  <critical_protocol>
    <master_plan_location>
      CRITICAL: The MASTER_PLAN.md MUST be created in .waves/wave-2/deliverables/MASTER_PLAN.md
      This is the ONLY valid location for the master plan. Creating it elsewhere violates protocol.
    </master_plan_location>
    
    <file_organization>
      Planning mode uses EXACTLY 3 waves with ONE deliverable per wave:
      - Wave 0: PROJECT_FOUNDATION.md in .waves/wave-0/deliverables/
      - Wave 1: TECHNICAL_RESEARCH.md in .waves/wave-1/deliverables/
      - Wave 2: MASTER_PLAN.md in .waves/wave-2/deliverables/
    </file_organization>
  </critical_protocol>
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
      - Record Keeper: Maintains project context and decisions
    </team_composition>
    
    <deliverables>
      <deliverable path=".waves/wave-0/deliverables/PROJECT_FOUNDATION.md">
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
      4. Confirm the scope fits the single Wave-1 research wave; if it does not, flag the overflow to the user rather than silently adding waves (Planning mode is fixed at 3 waves).
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
      - Record Keeper: Synthesizes research findings
    </team_composition>
    
    <deliverables>
      <deliverable path=".waves/wave-1/deliverables/TECHNICAL_RESEARCH.md">
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
      - Record Keeper: Finalizes all documentation
    </team_composition>
    
    <deliverables>
      <deliverable path=".waves/wave-2/deliverables/MASTER_PLAN.md">
        CRITICAL: This is the ONLY valid location for MASTER_PLAN.md
        Complete project blueprint including:
        1. Executive Summary
        2. Project Vision & Goals
        3. Requirements & Scope
        4. Technical Architecture
        5. Implementation Roadmap
        6. Quality Standards
        7. Risk Mitigation
        8. Success Metrics
        
        NOTE: Any MASTER_PLAN.md created elsewhere is invalid and violates protocol
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

  <principle>
    Plan the simplest thing that solves the problem in front of you.
    Do not design for hypotheticals - no speculative microservices, extra tables, extension points, or scale tiers the requirements do not call for. The right abstraction shows up at the third real need, not the first imagined one. A plan a small team can actually execute beats an elaborate one they cannot.
  </principle>

  <principle>
    Ground every recommendation in something you read.
    Cite the doc, the source file, or the benchmark behind each technical choice. Do not paraphrase best practices from memory - verify them.
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
        deliverables/     # Contains ONLY PROJECT_FOUNDATION.md when complete
        drafts/           # Work-in-progress content (cleared after wave completion)
        rk-operations/    # Contains ONLY: AGENT_ASSIGNMENTS.md, RECORD_KEEPER_LOG.md, WAVE_COMPLETE.md
      
      .waves/wave-1/
        deliverables/     # Contains ONLY TECHNICAL_RESEARCH.md when complete
        drafts/           # Work-in-progress content (cleared after wave completion)
        rk-operations/    # Contains ONLY: AGENT_ASSIGNMENTS.md, RECORD_KEEPER_LOG.md, WAVE_COMPLETE.md
      
      .waves/wave-2/
        deliverables/     # Contains ONLY MASTER_PLAN.md when complete - THIS IS THE FINAL DELIVERABLE
        drafts/           # Work-in-progress content (cleared after wave completion)
        rk-operations/    # Contains ONLY: AGENT_ASSIGNMENTS.md, RECORD_KEEPER_LOG.md, WAVE_COMPLETE.md
    </structure>
  </workspace_organization>
</planning_guidelines>

<file_creation_discipline>
  <principle>
    Create only essential files that advance the planning process.
    Consolidate related information into comprehensive documents.
    MAINTAIN STRICT FILE ORGANIZATION AT ALL TIMES.
  </principle>
  
  <instructions>
    1. Produce exactly one deliverable per wave in the EXACT location specified:
       - Wave 0: .waves/wave-0/deliverables/PROJECT_FOUNDATION.md
       - Wave 1: .waves/wave-1/deliverables/TECHNICAL_RESEARCH.md
       - Wave 2: .waves/wave-2/deliverables/MASTER_PLAN.md
    2. Use drafts/ for work-in-progress content only
    3. Let Record Keeper manage rk-operations/ (maximum 3 files)
    4. NEVER create files outside the designated wave structure
    5. NEVER create duplicate deliverables in other locations
    6. Focus on quality over quantity of documentation
  </instructions>
  
  <examples>
    <good>Create PROJECT_FOUNDATION.md in .waves/wave-0/deliverables/</good>
    <good>Create TECHNICAL_RESEARCH.md in .waves/wave-1/deliverables/</good>
    <good>Create MASTER_PLAN.md in .waves/wave-2/deliverables/</good>
    <bad>Creating MASTER_PLAN.md in project root</bad>
    <bad>Creating planning documents outside .waves/ structure</bad>
    <bad>Creating multiple versions of deliverables</bad>
  </examples>
</file_creation_discipline>

<wave_progression>
  <instruction>
    Execute waves sequentially, completing each fully before proceeding.
    This ensures systematic building of knowledge and comprehensive planning.
  </instruction>
  
  <flow>
    Wave 0: Establish foundation with PROJECT_FOUNDATION.md
      Location: .waves/wave-0/deliverables/PROJECT_FOUNDATION.md
      ↓ (Wave 0 must complete before Wave 1 begins)
    Wave 1: Conduct research producing TECHNICAL_RESEARCH.md  
      Location: .waves/wave-1/deliverables/TECHNICAL_RESEARCH.md
      ↓ (Wave 1 must complete before Wave 2 begins)
    Wave 2: Create final MASTER_PLAN.md synthesizing all work
      Location: .waves/wave-2/deliverables/MASTER_PLAN.md
      ↓
    Planning Complete: Ready for implementation mode
  </flow>
  
  <validation>
    Each wave completion requires:
    - Deliverable present in EXACT location specified above
    - Record Keeper confirms wave complete
    - All team members have finished their work
    - No files created outside designated directories
  </validation>
</wave_progression>

<task_list_requirement>
  <rule>Planning mode must produce structured task lists as a primary deliverable</rule>
  <rule>MASTER_PLAN.md must include a task breakdown using the standard format</rule>
  <format>
    | ID | Task | Status | Assignee | Depends on | PR |
    |----|------|--------|----------|------------|-----|
    Use component prefixes: B (Backend), F (Frontend), S (Shared)
    Use priority levels: P0 (Foundation), P1 (Quality), P2 (Features), P3 (Community)
  </format>
  <rule>Task lists are saved to TASKS-backend.md, TASKS-frontend.md, or TASKS-shared.md as appropriate</rule>
</task_list_requirement>

<success_criteria>
  <criterion>Clear, actionable MASTER_PLAN ready for implementation teams</criterion>
  <criterion>All requirements captured and addressed in planning</criterion>
  <criterion>Technical approach validated through research</criterion>
  <criterion>Implementation phases clearly defined with milestones</criterion>
  <criterion>Risks identified with mitigation strategies documented</criterion>
  <criterion>Success metrics defined for project validation</criterion>
  <criterion>Structured task list produced with IDs, priorities, and dependencies</criterion>
</success_criteria>

<implementation_note>
  Planning mode focuses exclusively on creating blueprints.
  Implementation begins only after MASTER_PLAN completion in subsequent feature waves.
  This separation ensures thorough planning before any code is written.
  
  REMEMBER: The MASTER_PLAN.md location is .waves/wave-2/deliverables/MASTER_PLAN.md
  This is non-negotiable and must be followed precisely.
</implementation_note>

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
