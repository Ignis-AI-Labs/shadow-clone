# Research Mode

## Purpose
Investigate technologies, solutions, and approaches to inform technical decisions with evidence-based recommendations.

## Wave Structure

### Wave-0: Research Definition & Methodology
**Team**: Research Lead, Domain Expert, Technical Analyst, Cost Analyst, Record Keeper

**Critical Tasks**:
- Define research questions if not provided by user
- Identify evaluation criteria and constraints
- Determine research depth needed
- Select research methodology
- Plan proof-of-concept requirements

**Outputs**:
- Research charter with clear objectives
- Evaluation framework (technical, cost, risk, scalability)
- Success criteria definition
- Research plan with wave allocation:
  - Quick assessment: 1 wave (existing knowledge synthesis)
  - Technology comparison: 2-3 waves (hands-on evaluation)
  - Deep investigation: 4+ waves (POCs and production testing)

### Wave-1 to Wave-N: Systematic Investigation (Dynamic)
**Consistent Team Structure**: Research Engineer, Domain Expert, Implementation Specialist, Record Keeper

**Research Domains** (depth based on Wave-0):
1. **Technology Evaluation**: Framework comparison, performance testing, learning curve assessment
2. **Architecture Patterns**: Scalability analysis, reliability patterns, security implications
3. **Integration Feasibility**: API compatibility, data migration paths, ecosystem maturity
4. **Cost Analysis**: Licensing, infrastructure, maintenance, opportunity costs
5. **Risk Assessment**: Technical debt, vendor lock-in, community support, longevity
6. **Implementation Planning**: Resource requirements, timeline estimation, skill gaps

**Required Evidence per Wave**:
- Hands-on proof of concept
- Performance benchmarks
- Cost calculations
- Risk mitigation strategies
- Implementation complexity analysis

### Final Wave: Synthesis & Decision Framework
**Team**: Research Lead, Senior Architect, Business Analyst, Technical Writer, Record Keeper

**Synthesis Requirements**:
- Consolidate findings from all waves
- Create decision matrix with weighted criteria
- Develop implementation roadmap
- Prepare stakeholder presentation
- Document lessons learned

**Outputs**:
- `RESEARCH_FINDINGS.md` - Comprehensive analysis with evidence
- `DECISION_MATRIX.md` - Scoring framework for options
- `IMPLEMENTATION_ROADMAP.md` - Phased adoption plan
- Proof of concept repository
- Risk register with mitigation plans

## Key Deliverables
- Evidence-based technology recommendations
- Working proof of concepts (runnable code)
- Total cost of ownership analysis
- Migration/implementation playbook
- Executive decision brief (2-page summary)

## Mode-Specific Rules
- **No opinions without evidence** - every recommendation backed by data
- **Build before recommending** - hands-on validation required
- **Consider total cost** - not just initial implementation
- **Document failed paths** - negative results are valuable
- **Maintain objectivity** - present trade-offs honestly
- **Future-proof thinking** - consider 3-5 year implications

## Success Criteria
- All research questions answered with evidence
- At least 3 viable options evaluated
- Clear winner identified OR trade-offs documented
- Implementation path validated through POC
- Stakeholder confidence in recommendations