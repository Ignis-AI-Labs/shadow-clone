// Plan mode configuration for Shadow Clone System
export const PLAN_MODE = `<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
-->

# Shadow Clone Plan Mode Configuration

## 🎯 Strategic Planning Framework

Mode: Comprehensive Project Planning Without Implementation

## Purpose
Create detailed project plans, architecture designs, and implementation roadmaps without writing any code. Perfect for:
- Project scoping and estimation
- Architecture design documents
- Technical specifications
- Implementation strategies
- Resource planning
- Risk assessment

## Configuration

**Deployment**: ~12-15 agents (planning specialists)
**Operation**: Deep analysis and planning across all project aspects
**Output**: Comprehensive documentation without code

### Activation
\`\`\`bash
# Standard planning mode
claude "Load shadow-clone-prompt.md and plan"

# With specific focus
claude "Load shadow-clone-prompt.md and plan - Focus on microservices architecture"

# For specific project type
claude "Load shadow-clone-prompt.md and plan with project_type=ecommerce"
\`\`\`

## Planning Domains

### 1. Architecture Planning
- System design and architecture
- Component interaction diagrams
- Technology stack selection
- Scalability considerations
- Security architecture

### 2. Implementation Planning
- Development phases and milestones
- Task breakdown and dependencies
- Time estimates and schedules
- Resource allocation
- Risk mitigation strategies

### 3. Technical Specifications
- API design and contracts
- Database schema planning
- Interface specifications
- Integration requirements
- Performance requirements

### 4. Infrastructure Planning
- Deployment architecture
- DevOps pipeline design
- Monitoring and logging strategy
- Disaster recovery planning
- Cost estimation

### 5. Quality Planning
- Testing strategies
- Code review processes
- Performance benchmarks
- Security requirements
- Compliance requirements

## Agent Teams

### Wave 1: Discovery & Analysis
- **System Analyst**: Requirements gathering and analysis
- **Architecture Specialist**: High-level system design
- **Domain Expert**: Business logic and rules
- **Integration Planner**: External system interfaces

### Wave 2: Design & Specification
- **API Designer**: Interface and contract design
- **Database Architect**: Data model and schema design
- **Security Planner**: Security architecture and controls
- **Infrastructure Designer**: Deployment and scaling strategy

### Wave 3: Planning & Documentation
- **Project Planner**: Timeline and milestone planning
- **Resource Analyst**: Team and resource requirements
- **Risk Assessor**: Risk analysis and mitigation
- **Documentation Lead**: Comprehensive plan compilation

## Deliverables

### Core Planning Documents
1. **PROJECT_OVERVIEW.md**: Executive summary and goals
2. **ARCHITECTURE_DESIGN.md**: System architecture with diagrams
3. **TECHNICAL_SPECIFICATION.md**: Detailed technical requirements
4. **IMPLEMENTATION_PLAN.md**: Phase-by-phase development plan
5. **RESOURCE_PLAN.md**: Team structure and skill requirements

### Supporting Documents
- **API_SPECIFICATION.yaml**: OpenAPI/Swagger specifications
- **DATABASE_DESIGN.sql**: Schema definitions (as documentation)
- **INFRASTRUCTURE_PLAN.md**: Deployment architecture
- **RISK_ASSESSMENT.md**: Identified risks and mitigations
- **COST_ESTIMATION.md**: Budget and resource estimates

## Planning Process

### 1. Requirements Analysis
- Gather and analyze project requirements
- Identify constraints and assumptions
- Define success criteria
- Establish project scope

### 2. Architecture Design
- Design system architecture
- Define component boundaries
- Plan integration points
- Consider scalability needs

### 3. Technical Planning
- Select technology stack
- Design data models
- Plan API interfaces
- Define security measures

### 4. Implementation Strategy
- Break down into phases
- Estimate timelines
- Identify dependencies
- Plan for iterations

### 5. Risk Assessment
- Identify potential risks
- Assess impact and probability
- Plan mitigation strategies
- Define contingency plans

## Example Wave Directory Structure

**Plan Mode Deliverables:**
\`\`\`
$waves_directory/
├── wave-1/
│   ├── requirements_analysis.md
│   ├── system_overview.md
│   ├── constraint_matrix.md
│   └── WAVE_1_DISCOVERY.md
├── wave-2/
│   ├── architecture_design.md
│   ├── api_specification.yaml
│   ├── database_design.sql
│   ├── security_architecture.md
│   └── WAVE_2_DESIGN.md
├── wave-3/
│   ├── implementation_plan.md
│   ├── resource_plan.md
│   ├── risk_assessment.md
│   ├── cost_estimation.md
│   └── WAVE_3_PLANNING.md
└── FINAL_DELIVERABLES/
    ├── PROJECT_MASTER_PLAN.md
    ├── ARCHITECTURE_DOCUMENT.pdf
    ├── TECHNICAL_SPECIFICATIONS.md
    └── EXECUTIVE_SUMMARY.md
\`\`\`

## Quality Standards

### Documentation Requirements
- Clear and concise writing
- Visual diagrams where appropriate
- Consistent formatting
- Version control considerations
- Review and approval sections

### Planning Depth
- Sufficient detail for implementation
- Clear acceptance criteria
- Measurable success metrics
- Realistic time estimates
- Comprehensive risk coverage

## Success Criteria

✅ Comprehensive project documentation
✅ Clear implementation roadmap
✅ Detailed technical specifications
✅ Realistic resource estimates
✅ Identified and mitigated risks
✅ Stakeholder alignment
✅ No code implementation (planning only)

## Important Notes

1. **No Code Generation**: This mode produces plans, not code
2. **Collaborative Review**: Plans should be reviewed with stakeholders
3. **Living Documents**: Plans should be updated as projects evolve
4. **Tool Agnostic**: Plans should not assume specific tools
5. **Future Flexibility**: Allow for iteration and changes

Remember: "Measure twice, cut once. A well-planned project is half completed."`;