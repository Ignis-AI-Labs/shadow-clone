# Planning Mode

## Purpose
Transform your idea into a comprehensive MASTER_PLAN for project execution.
Creates detailed project blueprint with technical architecture and implementation roadmap.

## Wave Structure

### Wave-0: Discovery (Fixed)
**Team**: Vision Architect, Requirements Analyst, Scope Assessor, Planning Strategist, Record Keeper

**Outputs**:
- `project_vision.md` - Clear project vision
- `scope_assessment.md` - Complexity analysis
- `initial_requirements.md` - Core requirements
- `planning_strategy.md` - Recommended wave structure
- `wave_plan.md` - Execution approach

**Key Decision**: Determines number of planning waves needed (1-5 typically)

### Dynamic Planning Waves (1 to N)
Based on Wave-0 assessment, deploy specialized teams:
- Technical Architecture Team
- Infrastructure Planning Team
- Security & Compliance Team
- Resource Planning Team
- UX/UI Design Team
- Integration Strategy Team

**Wave Count Guidelines**:
- Simple projects: 1-2 planning waves
- Medium complexity: 2-3 planning waves
- Complex enterprise: 3-5 planning waves

### Final Wave: Master Plan Consolidation (Fixed)
**Team**: Master Plan Architect, Technical Consolidator, Execution Strategist, Quality Validator, Record Keeper

**Single Output**: `MASTER_PLAN.md` - Complete project blueprint
**Template**: Uses `templates/MASTER_PLAN_TEMPLATE.md` for consistent structure

## MASTER_PLAN Contents
1. Executive Summary & Vision
2. Requirements & Scope
3. Technical Architecture
4. Implementation Roadmap
5. Resource Allocation
6. Risk Management
7. Quality Standards
8. Wave Execution Plan

## Key Rules
- MASTER_PLAN created ONLY in final wave
- No implementation during planning
- Each wave builds on previous work
- Wave count adapts to project needs
- All work stays in wave folders

## Wave Dependencies (ENFORCED)

### Wave-0 Required Outputs
These MUST exist before Wave-1 can start:
- `deliverables/project_vision.md`
- `deliverables/scope_assessment.md`
- `deliverables/initial_requirements.md`
- `deliverables/planning_strategy.md`
- `deliverables/wave_plan.md`
- `WAVE_COMPLETE.md` (created by Record Keeper)

### Planning Wave Dependencies
Each planning wave (1 to N-1) must:
- Read and build upon previous wave outputs
- Create deliverables in their wave folder
- Have Record Keeper finalize with WAVE_COMPLETE.md
- NO wave can proceed if previous wave incomplete

### Final Wave Requirements
Cannot start unless:
- ALL previous waves marked complete
- All planning deliverables exist
- Record Keeper has documented all decisions

**System enforces these dependencies - no exceptions**