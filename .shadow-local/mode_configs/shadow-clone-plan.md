<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# Shadow Clone Planning Mode Configuration

## 🎯 Strategic Planning - When You Have No Plan Yet

**Perfect for**: "I have this idea for a project but I don't know where to start..."

Transform your vision into a comprehensive MASTER_PLAN that serves as the complete blueprint for project execution.

## Planning Mode Overview

Planning Mode is designed for projects that **don't have a project plan yet**. It uses a dynamic, multi-wave approach to transform your initial ideas into a comprehensive MASTER_PLAN:

1. **Wave-0**: Discovery & Analysis - Understanding your vision and project scope
2. **Dynamic Waves**: Project-specific planning teams based on discovered needs
3. **Final Wave**: Master Plan Consolidation - Creating the unified MASTER_PLAN

**Key Principle**: The MASTER_PLAN is ONLY created in the FINAL wave as a consolidation of all planning work. Each wave builds knowledge that feeds into the final comprehensive plan.

**Primary Output**: The MASTER_PLAN - your complete blueprint for project success

## Pre-Planning Requirements

### Starting Points (When You Have No Plan)
**User Input**:
- Your project idea or vision
- Basic requirements or goals
- Any constraints you're aware of
- Success criteria you envision

**Wave-0 Discovery** (What We'll Create):
- Initial project understanding
- Requirements extraction from your description
- Project complexity assessment
- Planning approach recommendation
- Wave structure design
- Team composition planning

### Critical Wave-0 Decision: Planning Structure

Wave-0 must produce `planning_strategy.md` that defines:
1. **Number of planning waves needed** (excluding Wave-0 and final consolidation)
2. **Team composition for each wave**
3. **Focus areas for each planning wave**
4. **Expected deliverables per wave**
5. **Dependencies between waves**

This ensures the planning process is **tailored to each specific project** rather than following a rigid template.

## Dynamic Planning Team Structure

Planning Mode uses a **dynamic team composition** based on the project type and complexity discovered in Wave-0. The system adapts team structure to match project needs.

### Wave-0: Discovery Team (Fixed)
**Purpose**: Understand the project and determine planning needs

**Core Agents**:
- **Vision Architect**: Transforms ideas into clear vision
- **Requirements Analyst**: Extracts initial requirements
- **Scope Assessor**: Determines project complexity and type
- **Planning Strategist**: Recommends wave structure and teams

### Dynamic Middle Waves (Project-Specific)
Based on Wave-0 findings, deploy appropriate teams:

**For Web Applications**:
- Technical Architecture Team
- UX/UI Planning Team
- Infrastructure Planning Team

**For Data/AI Projects**:
- Data Architecture Team
- ML/AI Strategy Team
- Data Pipeline Planning Team

**For Enterprise Systems**:
- Integration Planning Team
- Security & Compliance Team
- Migration Strategy Team

**For Mobile Applications**:
- Platform Strategy Team
- Mobile Architecture Team
- Distribution Planning Team

### Final Wave: Master Plan Consolidation Team (Fixed)
**Purpose**: Create the unified MASTER_PLAN from all previous work

**Team Lead: Master Plan Architect**
- Synthesizes all planning documents
- Ensures coherent narrative
- Creates unified vision
- Owns MASTER_PLAN creation

**Agent 1: Technical Consolidator**
- Merges all technical plans
- Resolves technical conflicts
- Creates unified architecture

**Agent 2: Execution Strategist**
- Consolidates timelines and resources
- Creates implementation roadmap
- Defines wave execution plan

**Agent 3: Quality Validator**
- Ensures plan completeness
- Validates feasibility
- Confirms all requirements addressed

## Dynamic Planning Process

### Wave-0: Discovery & Assessment (Always First)
**Outputs**:
- `project_vision.md` - Clear vision from user input
- `scope_assessment.md` - Project type, size, complexity
- `initial_requirements.md` - Core requirements identified
- `planning_strategy.md` - Recommended waves and teams
- `wave_plan.md` - Detailed execution plan

### Dynamic Middle Waves (1 to N based on project)
**Examples by Project Complexity**:

**Simple Project (1 middle wave)**:
- Wave-1: Core Planning Team creates all planning artifacts

**Medium Project (2-3 middle waves)**:
- Wave-1: Technical Planning Team
- Wave-2: Resource & Risk Planning Team
- Wave-3: Integration Planning Team

**Complex Project (3-5 middle waves)**:
- Wave-1: Business Strategy Team
- Wave-2: Technical Architecture Team
- Wave-3: Infrastructure & Security Team
- Wave-4: Resource & Timeline Team
- Wave-5: Risk & Compliance Team

### Final Wave: Master Plan Creation (Always Last)
**Single Purpose**: Consolidate ALL previous work into MASTER_PLAN

**Process**:
1. Read all artifacts from previous waves
2. Identify and resolve conflicts
3. Create unified narrative
4. Generate comprehensive MASTER_PLAN
5. Produce supporting documents

**Critical Rule**: NO planning content is created here - only consolidation

## Consolidation Requirements

### Data Synthesis Rules
1. **No Contradictions**: Resolve all conflicts between source documents
2. **Complete Coverage**: Address all identified requirements
3. **Traceability**: Link all decisions back to source requirements
4. **Coherent Narrative**: Ensure smooth flow between all sections
5. **Actionable Output**: Every section must drive specific actions

### Quality Checkpoints
- All requirements addressed in plan
- Technical approach validated
- Resources properly allocated
- Timeline realistic and achievable
- Risks identified and mitigated
- Stakeholders concerns addressed

## Planning Deliverables

### Wave-Specific Outputs

**Wave-0 Deliverables**:
- Project understanding and scope
- Initial requirements and constraints
- Recommended planning approach
- Wave execution strategy

**Middle Wave Deliverables** (vary by project):
- Technical architecture plans
- Resource allocation strategies
- Risk assessments and mitigations
- Timeline and milestone planning
- Integration strategies
- Compliance requirements
- Team structure recommendations

**Final Wave Deliverable**:

### 🎯 THE MASTER_PLAN
Created ONLY in the final wave - a single, comprehensive document that consolidates ALL planning work into an actionable blueprint.

**MASTER_PLAN.md** includes:
1. **Executive Vision**
   - Your project transformed into a clear, compelling vision
   - Strategic objectives and success metrics
   - Expected business impact and ROI

2. **Comprehensive Project Blueprint**
   - Complete project scope and boundaries
   - Work breakdown structure (WBS)
   - Detailed requirements (functional & non-functional)
   - User stories and acceptance criteria
   - Success criteria and KPIs

3. **Technical Architecture**
   - System design and architecture diagrams
   - Technology stack recommendations with justifications
   - Integration strategies
   - Security architecture
   - Performance and scalability plans
   - Development best practices

4. **Execution Roadmap**
   - Phase-by-phase implementation plan
   - Sprint breakdown with deliverables
   - Timeline with milestones
   - Critical path identification
   - Dependency management

5. **Resource Management**
   - Team structure and roles
   - Skill requirements
   - Budget allocation
   - Resource timeline
   - Vendor/tool requirements

6. **Risk Management**
   - Comprehensive risk assessment
   - Mitigation strategies
   - Contingency plans
   - Decision trees for key risks

7. **Quality & Governance**
   - Quality standards and metrics
   - Testing strategy
   - Code review process
   - Documentation standards
   - Compliance requirements

8. **Communication Framework**
   - Stakeholder engagement plan
   - Reporting cadence
   - Escalation paths
   - Change management process

9. **Wave Execution Plan**
   - Complete wave structure for implementation
   - Team assignments for each execution wave
   - Agent-specific tasks and deliverables
   - Wave dependencies and sequencing
   - Success criteria for each wave

10. **Agent Task Assignments**
    - Detailed tasks for each agent role
    - Specific deliverables per agent
    - Skill requirements mapping
    - Coordination protocols

### Supporting Documents
- **Technical_Specifications.md**: Deep technical details
- **Implementation_Guide.md**: Step-by-step execution instructions
- **Quick_Start_Guide.md**: For teams to get started immediately
- **Wave_Execution_Details.md**: Detailed wave and agent assignments

## Planning Best Practices

### Consolidation Excellence
- Cross-reference all source documents
- Validate assumptions with evidence
- Ensure consistency across all deliverables
- Create clear linkages between sections
- Maintain professional tone throughout

### Clarity & Actionability
- Use clear, concise language
- Avoid ambiguity in requirements
- Define specific, measurable outcomes
- Create actionable next steps
- Include decision criteria

### Completeness Verification
- Address all identified requirements
- Cover all project phases
- Include all stakeholder perspectives
- Document all assumptions
- Provide comprehensive appendices

## Example Wave Directory Structures

**IMPORTANT**: Structure adapts based on project needs discovered in Wave-0

### Example 1: Simple Web App Project
```
$waves_directory/
├── wave-0/                      # Discovery
│   ├── project_vision.md
│   ├── scope_assessment.md      # Identified as: Simple, 2-wave plan
│   ├── initial_requirements.md
│   ├── planning_strategy.md
│   └── wave_plan.md
├── wave-1/                      # All Planning Work
│   ├── technical_plan.md
│   ├── resource_plan.md
│   ├── timeline.md
│   └── risk_assessment.md
└── wave-2/                      # MASTER_PLAN Creation (Final)
    ├── MASTER_PLAN.md          # 🎯 Complete consolidated plan
    ├── Implementation_Guide.md
    └── PLANNING_COMPLETE.md

```

### Example 2: Complex Enterprise System
```
$waves_directory/
├── wave-0/                      # Discovery
│   ├── project_vision.md
│   ├── scope_assessment.md      # Identified as: Complex, 5-wave plan
│   ├── initial_requirements.md
│   ├── planning_strategy.md
│   └── wave_plan.md
├── wave-1/                      # Business Strategy
│   ├── business_objectives.md
│   ├── stakeholder_analysis.md
│   └── success_metrics.md
├── wave-2/                      # Technical Architecture
│   ├── system_architecture.md
│   ├── integration_strategy.md
│   └── technology_stack.md
├── wave-3/                      # Infrastructure & Security
│   ├── infrastructure_plan.md
│   ├── security_framework.md
│   └── compliance_requirements.md
├── wave-4/                      # Resources & Timeline
│   ├── team_structure.md
│   ├── timeline_roadmap.md
│   └── budget_allocation.md
└── wave-5/                      # MASTER_PLAN Creation (Final)
    ├── MASTER_PLAN.md          # 🎯 Complete consolidated plan
    ├── Technical_Specifications.md
    ├── Implementation_Guide.md
    ├── Risk_Register.md
    └── PLANNING_COMPLETE.md
```

**Key Points**:
- Wave-0 always determines the planning approach
- Middle waves vary based on project needs
- Final wave ALWAYS creates MASTER_PLAN through consolidation
- No implementation code in any planning wave

## Success Metrics

### Planning Quality
- All source documents properly analyzed
- No conflicting information in final plan
- Complete requirement coverage
- Clear, actionable deliverables
- Stakeholder approval achieved

### Consolidation Effectiveness
- Coherent narrative across all documents
- Logical flow from requirements to implementation
- All decisions traced to requirements
- No information gaps or ambiguities
- Professional presentation quality

### Execution Readiness
- Plan immediately actionable
- Clear first steps identified
- Resources properly allocated
- Timeline realistic and agreed
- Success criteria well-defined

## Integration with Shadow Clone System

### Planning Mode Workflow

1. **Input**: Your project idea, vision, or basic requirements

2. **Wave-0: Discovery** (Always)
   - Understand project scope and complexity
   - Determine optimal planning approach
   - Design custom wave structure

3. **Dynamic Planning Waves** (1 to N waves)
   - Deploy project-specific teams
   - Create focused planning artifacts
   - Build comprehensive knowledge base

4. **Final Wave: Consolidation** (Always)
   - Master Plan Consolidation Team deploys
   - Reads ALL previous planning artifacts
   - Creates unified MASTER_PLAN
   - No new planning work - pure synthesis

5. **Output**: Complete MASTER_PLAN ready for execution

### After Planning Mode - Using Your MASTER_PLAN

Once your MASTER_PLAN is complete, you can:

1. **Execute with Shadow Clone**:
   ```
   "Load shadow-clone-prompt.md and execute with project_plan=.waves/wave-3/MASTER_PLAN.md"
   ```

2. **Share with Stakeholders**:
   - Executive summary for leadership buy-in
   - Technical specs for development teams
   - Resource plan for managers
   - Timeline for project tracking

3. **Use as Living Document**:
   - Update as project evolves
   - Track against actual progress
   - Adjust based on learnings

### The Power of the MASTER_PLAN

Your MASTER_PLAN transforms a vague idea into:
- Clear project vision and objectives
- Detailed technical architecture
- Step-by-step implementation roadmap
- Complete resource and budget allocation
- Comprehensive risk mitigation strategies
- Professional documentation ready for any audience

**Remember**: The MASTER_PLAN is your project's North Star - everything flows from this blueprint!

## Critical Planning Mode Rules

1. **MASTER_PLAN is NEVER created before the final wave**
2. **Wave-0 determines the entire planning structure dynamically**
3. **Middle waves create focused planning artifacts, NOT the master plan**
4. **Final wave ONLY consolidates - no new planning work**
5. **The number of waves adapts to project complexity**
6. **Every project gets a custom-tailored planning approach**

This ensures that the MASTER_PLAN is a true synthesis of all planning work, not a premature document that gets updated throughout the process.