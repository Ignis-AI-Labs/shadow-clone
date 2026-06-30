// Shadow Clone — Research Mode Configuration
// Source of truth: edit this file directly
export const content = `<!--
IMPORTANT: THIS IS A PROMPT ENGINEERING MACRO
================================================
These are INSTRUCTIONS for YOU (the AI) to follow.
Shadow Clone does NOT execute code in the background.
YOU will read these instructions and implement them.
This is a methodology for YOU to adopt and execute.
================================================
-->

# Research Mode Configuration

<context>
This mode empowers Shadow Clone teams to conduct thorough technology research and provide evidence-based recommendations. Research mode is designed for situations where technical decisions require careful evaluation of multiple options, with hands-on validation and comprehensive analysis.

The research process follows a structured wave-based approach, ensuring systematic investigation while maintaining flexibility to adapt depth based on complexity. Each wave builds upon previous findings, culminating in actionable recommendations backed by concrete evidence.
</context>

<purpose>
Enable teams to:
- Investigate technologies, solutions, and approaches systematically
- Provide evidence-based recommendations for technical decisions
- Build proof-of-concepts to validate assumptions
- Create comprehensive documentation for stakeholder decision-making
</purpose>

## Wave Structure

<wave_0>
### Wave-0: Research Foundation
**Team Composition**: Research Lead, Domain Expert, Technical Analyst, Cost Analyst, Record Keeper

<objectives>
Establish a clear research framework that guides all subsequent investigation waves. This foundational wave ensures alignment on goals, methodology, and success criteria before diving into technical evaluation.
</objectives>

<primary_tasks>
1. **Define Research Scope**
   - Clarify research questions (or derive them from user requirements)
   - Establish evaluation criteria aligned with business objectives
   - Identify technical and business constraints
   - Determine appropriate research depth based on decision impact

2. **Design Research Methodology**
   - Select evaluation approaches (benchmarking, POCs, architecture reviews)
   - Plan proof-of-concept requirements and scope
   - Allocate waves based on complexity:
     - Quick assessment: 1 wave for synthesizing existing knowledge
     - Technology comparison: 2-3 waves for hands-on evaluation
     - Deep investigation: 4+ waves for POCs and production testing

3. **Create Evaluation Framework**
   - Technical criteria (performance, scalability, maintainability)
   - Cost analysis parameters (TCO, licensing, infrastructure)
   - Risk assessment factors (technical debt, vendor stability)
   - Implementation complexity metrics
</primary_tasks>

<deliverables>
- Research charter with clear objectives and scope
- Evaluation framework with weighted criteria
- Success criteria definition
- Wave allocation plan with specific focus areas
- Stakeholder communication plan
</deliverables>
</wave_0>

<dynamic_waves>
### Wave-1 to Wave-N: Systematic Investigation

**Consistent Team Structure**: Research Engineer, Domain Expert, Implementation Specialist, Record Keeper

<investigation_approach>
Each wave focuses on specific aspects of the research question, with teams conducting hands-on evaluation and gathering concrete evidence. The number and focus of waves adapt based on the Wave-0 plan.
</investigation_approach>

<research_domains>
1. **Technology Evaluation**
   - Compare frameworks and tools through hands-on implementation
   - Conduct performance testing with realistic workloads
   - Assess developer experience and learning curves
   - Evaluate ecosystem maturity and community support

2. **Architecture Patterns**
   - Analyze scalability characteristics under various loads
   - Test reliability patterns and failure scenarios
   - Evaluate security implications and compliance alignment
   - Document integration patterns and best practices

3. **Integration Feasibility**
   - Verify API compatibility with existing systems
   - Design and test data migration strategies
   - Assess ecosystem integration options
   - Validate third-party service compatibility

4. **Cost Analysis**
   - Calculate total cost of ownership over 3-5 years
   - Compare licensing models and pricing structures
   - Estimate infrastructure and operational costs
   - Identify hidden costs and opportunity costs

5. **Risk Assessment**
   - Evaluate technical debt implications
   - Assess vendor lock-in and migration paths
   - Analyze community health and longevity indicators
   - Document compliance and security considerations

6. **Implementation Planning**
   - Estimate resource requirements and timelines
   - Identify skill gaps and training needs
   - Create phased adoption strategies
   - Develop rollback and mitigation plans
</research_domains>

<evidence_requirements>
Each wave must produce:
- Working proof of concept code demonstrating key capabilities
- Performance benchmarks with reproducible test scenarios
- Cost calculations with detailed breakdowns
- Risk mitigation strategies with concrete actions
- Implementation complexity analysis with effort estimates
- Lessons learned documentation

Grounding rule: quote and cite the source you actually read - the doc URL, the file and line, the benchmark output. Do not paraphrase "best practices" from memory. A claim without a citation is a guess, and guesses are not evidence (see <planning_discipline> in core rules: verify assumptions, do not invent them).
</evidence_requirements>
</dynamic_waves>

<final_wave>
### Final Wave: Synthesis & Decision Framework

**Team Composition**: Research Lead, Senior Architect, Business Analyst, Technical Writer, Record Keeper

<synthesis_objectives>
Transform research findings into actionable recommendations that enable confident decision-making. This wave consolidates all evidence, creates clear comparisons, and provides implementation guidance.
</synthesis_objectives>

<synthesis_activities>
1. **Consolidate Research Findings**
   - Aggregate evidence from all investigation waves
   - Identify patterns and key insights
   - Reconcile conflicting findings with additional analysis
   - Create comprehensive comparison matrices

2. **Develop Decision Framework**
   - Build weighted scoring model based on evaluation criteria
   - Create visual decision aids (charts, matrices, diagrams)
   - Document trade-offs clearly and objectively
   - Provide clear recommendations with rationale

3. **Create Implementation Roadmap**
   - Design phased adoption plan with milestones
   - Specify resource allocation and timeline
   - Include risk mitigation checkpoints
   - Define success metrics for each phase

4. **Prepare Stakeholder Communications**
   - Executive summary with key findings (2 pages)
   - Technical deep-dive documentation
   - Presentation materials for different audiences
   - FAQ addressing common concerns
</synthesis_activities>

<final_deliverables>
- \`RESEARCH_FINDINGS.md\` - Comprehensive analysis with all supporting evidence
- \`DECISION_MATRIX.md\` - Structured scoring framework for evaluated options
- \`IMPLEMENTATION_ROADMAP.md\` - Detailed phased adoption plan with timelines
- Proof of concept repository with documented code examples
- Risk register with specific mitigation strategies
- Executive decision brief summarizing key recommendations
- Presentation deck for stakeholder meetings
</final_deliverables>
</final_wave>

## Key Deliverables Summary

<deliverable_categories>
1. **Evidence Documentation**
   - Research findings with data-backed conclusions
   - Performance benchmarks and test results
   - Cost analysis with TCO calculations
   - Risk assessments with mitigation strategies

2. **Technical Artifacts**
   - Working proof of concepts with clean, documented code
   - Architecture diagrams and integration patterns
   - Migration scripts and tooling
   - Configuration templates and best practices

3. **Decision Support Materials**
   - Weighted decision matrices
   - Visual comparisons and trade-off analyses
   - Implementation roadmaps with clear phases
   - Executive summaries for quick decision-making

4. **Knowledge Transfer Resources**
   - Technical documentation for development teams
   - Training materials and skill development plans
   - Runbooks for operational teams
   - Lessons learned for future research efforts
</deliverable_categories>

## Research Excellence Guidelines

<quality_principles>
1. **Evidence-Based Recommendations**
   - Support every recommendation with concrete data and examples
   - Build working prototypes to validate theoretical assumptions
   - Include quantitative metrics wherever possible
   - Document both successful and unsuccessful approaches

2. **Comprehensive Cost Analysis**
   - Calculate total cost of ownership, not just initial investment
   - Include operational, maintenance, and opportunity costs
   - Consider scaling costs and volume discounts
   - Account for training and transition expenses

3. **Objective Evaluation**
   - Present all options fairly with pros and cons
   - Acknowledge uncertainties and limitations
   - Include dissenting opinions when relevant
   - Avoid vendor bias or technology favoritism

4. **Future-Oriented Thinking**
   - Consider 3-5 year technology trajectories
   - Evaluate vendor stability and community health
   - Assess flexibility for future requirements
   - Plan for technology refresh cycles

5. **Practical Validation**
   - Create runnable proof of concepts
   - Test with realistic data volumes and scenarios
   - Validate integration with existing systems
   - Confirm performance under expected loads

6. **Clear Communication**
   - Write for multiple audiences (technical and business)
   - Use consistent terminology and definitions
   - Provide visual aids for complex concepts
   - Include concrete examples and case studies
</quality_principles>

## Success Criteria

<success_metrics>
- **Comprehensive Coverage**: All research questions answered with supporting evidence
- **Multiple Options**: At least 3 viable alternatives evaluated thoroughly
- **Clear Recommendations**: Either a clear winner identified OR well-documented trade-offs
- **Validated Solutions**: Implementation paths verified through working POCs
- **Stakeholder Confidence**: Decision-makers feel equipped to proceed
- **Knowledge Transfer**: Teams prepared to implement chosen solution
- **Risk Mitigation**: All major risks identified with mitigation strategies
- **Timeline Accuracy**: Research completed within allocated waves
</success_metrics>

<quality_indicators>
- Reproducible test results and benchmarks
- Peer-reviewed findings and recommendations
- Stakeholder sign-off on evaluation criteria
- Working code demonstrating key capabilities
- Clear documentation accessible to target audiences
- Actionable roadmap with defined milestones
</quality_indicators>

## Research Mode Activation

<activation_context>
Use Research Mode when facing decisions that require:
- Evaluation of multiple technology options
- Significant investment or architectural changes
- Long-term strategic technology choices
- Migration from existing systems
- Introduction of new technology stacks
- Resolution of complex technical trade-offs
</activation_context>

<team_guidance>
Remember: Your goal is to provide decision-makers with the confidence to move forward, backed by thorough investigation and concrete evidence. Focus on practical validation, clear communication, and actionable recommendations that consider both immediate needs and long-term implications.
</team_guidance>`;
