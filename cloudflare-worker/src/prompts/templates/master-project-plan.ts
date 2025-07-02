/*
 * Copyright (c) 2024 Ignis AI Labs LLC.
 * All Rights Reserved.
 * 
 * This file is proprietary and confidential.
 * Unauthorized copying or distribution is prohibited.
 */

export const MASTER_PROJECT_PLAN_TEMPLATE = `<!--
COPYRIGHT NOTICE: This file is proprietary to Ignis AI Labs LLC.
Unauthorized access, use, or distribution is strictly prohibited.
See LICENSE-PROPRIETARY.md for full terms.
-->

# MASTER_PLAN Template

**Project Name**: [Project Name]  
**Version**: 1.0  
**Date**: [Date]  
**Status**: FINAL  
**Classification**: PROJECT BLUEPRINT  

---

## Quick Reference Guide

### Key Information
- **Project Duration**: [Start Date] - [End Date]
- **Total Budget**: \$[Amount]
- **Team Size**: [Number] professionals
- **Primary Objective**: [One-line objective]
- **Success Metric**: [Primary KPI]

### Document Navigation
1. [Executive Summary](#executive-summary) - High-level overview
2. [Project Charter](#project-charter) - Formal authorization
3. [Detailed Requirements](#detailed-requirements) - What we're building
4. [Technical Approach](#technical-approach) - How we're building it
5. [Execution Plan](#execution-plan) - Step-by-step roadmap
6. [Resource Management](#resource-management) - People and budget
7. [Risk Management](#risk-management) - What could go wrong
8. [Quality Management](#quality-management) - Ensuring excellence
9. [Communication Management](#communication-management) - Keeping everyone informed
10. [Appendices](#appendices) - Supporting documentation

---

## Executive Summary

### Project Vision
_[2-3 sentences describing the transformative impact of this project]_

### Strategic Alignment
_[How this project supports organizational goals and strategy]_

### Approach Overview
_[High-level description of the technical and business approach]_

### Expected Outcomes
- **Primary Outcome**: [Main deliverable or achievement]
- **Secondary Benefits**: [Additional value created]
- **Long-term Impact**: [Future state enabled]

### Investment Summary
- **Total Investment**: \$[Amount]
- **Expected ROI**: [Percentage or description]
- **Payback Period**: [Timeframe]

---

## Project Charter

### Project Authorization
**Sponsor**: [Name and Title]  
**Project Manager**: [Name]  
**Charter Date**: [Date]  
**Authorization**: [Formal statement authorizing the project]

### Project Boundaries
**In Scope**:
- [Scope item 1]
- [Scope item 2]
- [Scope item 3]

**Out of Scope**:
- [Exclusion 1]
- [Exclusion 2]
- [Exclusion 3]

### Success Criteria
1. **Business Success**: [Measurable business outcome]
2. **Technical Success**: [Technical achievement metric]
3. **Timeline Success**: [Delivery commitment]
4. **Budget Success**: [Financial target]

---

## Detailed Requirements

### Business Requirements
_[Consolidated from all stakeholder inputs and analysis]_

#### BR-1: [Business Requirement Name]
- **Description**: [Detailed description]
- **Justification**: [Why this is needed]
- **Success Metric**: [How we measure achievement]
- **Priority**: [Critical/High/Medium/Low]

### Functional Requirements

#### Core Functionality
| ID | Requirement | User Story | Acceptance Criteria | Priority |
|----|-------------|------------|-------------------|----------|
| FR-001 | [Function] | As a [user], I want [feature] so that [benefit] | Given [context], When [action], Then [result] | [Priority] |

### Non-Functional Requirements

#### Performance Requirements
| Metric | Target | Measurement Method | Rationale |
|--------|--------|-------------------|-----------|
| Response Time | <[X]ms | [Method] | [Why this target] |
| Throughput | [X] TPS | [Method] | [Why this target] |
| Availability | [X]% | [Method] | [Why this target] |

#### Security Requirements
- **Authentication**: [Requirements]
- **Authorization**: [Requirements]
- **Data Protection**: [Requirements]
- **Compliance**: [Standards to meet]

---

## Technical Approach

### Solution Architecture

#### High-Level Architecture
\`\`\`
[ASCII or description of architecture diagram]
\`\`\`

#### Key Components
1. **[Component Name]**
   - Purpose: [What it does]
   - Technology: [Tech stack]
   - Interfaces: [How it connects]

### Technology Stack

| Layer | Technology | Version | Justification |
|-------|------------|---------|---------------|
| Frontend | [Tech] | [Ver] | [Why chosen] |
| Backend | [Tech] | [Ver] | [Why chosen] |
| Database | [Tech] | [Ver] | [Why chosen] |
| Infrastructure | [Tech] | [Ver] | [Why chosen] |

### Integration Strategy
- **Internal Systems**: [How we integrate]
- **External Services**: [Third-party integrations]
- **Data Flow**: [How data moves through the system]

---

## Execution Plan

### Phase 1: Foundation (Week 1-4)
**Objective**: Establish project infrastructure and team

#### Week 1-2: Project Initiation
- [ ] Team onboarding
- [ ] Environment setup
- [ ] Tool configuration
- [ ] Kick-off meeting

#### Week 3-4: Foundation Building
- [ ] Architecture finalization
- [ ] Development environment
- [ ] CI/CD pipeline
- [ ] Initial prototypes

**Deliverables**: 
- Project infrastructure ready
- Team fully operational
- Foundation documentation

### Phase 2: Core Development (Week 5-12)
**Objective**: Build core functionality

#### Sprint 1 (Week 5-6): [Sprint Goal]
- User Stories: [List]
- Technical Tasks: [List]
- Deliverable: [What's complete]

#### Sprint 2 (Week 7-8): [Sprint Goal]
_[Continue for all sprints]_

### Phase 3: Integration & Testing (Week 13-16)
**Objective**: Ensure quality and integration

### Phase 4: Deployment & Transition (Week 17-20)
**Objective**: Go live and stabilize

### Detailed Timeline

\`\`\`
Week 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20
==================================================================
Phase 1 [====]
Phase 2         [================]
Phase 3                             [========]
Phase 4                                         [========]
\`\`\`

---

## Resource Management

### Team Structure

#### Core Team
| Role | Name | Allocation | Start Date | End Date |
|------|------|------------|------------|----------|
| Project Manager | [Name] | 100% | [Date] | [Date] |
| Tech Lead | [Name] | 100% | [Date] | [Date] |
| [Role] | [Name] | [%] | [Date] | [Date] |

#### Extended Team
_[Part-time or consulting resources]_

### Budget Breakdown

| Category | Budget | % of Total | Notes |
|----------|--------|------------|--------|
| Personnel | \$[Amount] | [%] | [Details] |
| Infrastructure | \$[Amount] | [%] | [Details] |
| Software/Licenses | \$[Amount] | [%] | [Details] |
| Contingency | \$[Amount] | [%] | [Details] |
| **Total** | **\$[Amount]** | **100%** | |

### Resource Calendar
_[When specific resources are needed]_

---

## Risk Management

### Top 5 Risks

#### Risk 1: [Risk Name]
- **Probability**: [High/Medium/Low]
- **Impact**: [High/Medium/Low]
- **Mitigation**: [Strategy]
- **Contingency**: [If it happens]
- **Owner**: [Name]
- **Review Date**: [Date]

### Risk Response Matrix

| Risk Category | Response Strategy | Trigger | Action |
|---------------|------------------|---------|---------|
| Technical | [Strategy] | [When to act] | [What to do] |
| Resource | [Strategy] | [When to act] | [What to do] |
| Schedule | [Strategy] | [When to act] | [What to do] |

---

## Quality Management

### Quality Standards
- **Code Quality**: [Standards and tools]
- **Testing Coverage**: [Target percentage]
- **Documentation**: [Standards]
- **Performance**: [Benchmarks]

### Testing Strategy

| Test Type | Coverage Target | Tools | Responsibility |
|-----------|----------------|--------|----------------|
| Unit | [%] | [Tools] | Developers |
| Integration | [%] | [Tools] | QA Team |
| Performance | [Scenarios] | [Tools] | Performance Team |
| Security | [Scope] | [Tools] | Security Team |
| UAT | [Scope] | [Process] | Business Users |

### Quality Gates
1. **Development Complete**: [Criteria]
2. **Testing Complete**: [Criteria]
3. **Ready for Production**: [Criteria]
4. **Post-Deployment**: [Criteria]

---

## Communication Management

### Stakeholder Communication Matrix

| Stakeholder Group | Communication Need | Method | Frequency | Owner |
|-------------------|-------------------|---------|-----------|--------|
| Executive Sponsors | Progress & Risks | Report | Weekly | PM |
| Business Users | Feature Updates | Demo | Bi-weekly | Product Owner |
| Technical Team | Daily Coordination | Standup | Daily | Scrum Master |

### Communication Channels
- **Project Portal**: [URL]
- **Slack Channel**: #[channel-name]
- **Email Distribution**: [list-name]@[domain]
- **Meeting Calendar**: [Calendar link]

### Reporting Schedule
- **Daily**: Standup notes
- **Weekly**: Status report
- **Bi-weekly**: Stakeholder demo
- **Monthly**: Executive dashboard

---

## Change Management

### Change Control Process
1. **Change Request**: Via [system/form]
2. **Impact Analysis**: By [role]
3. **Approval**: By [committee/role]
4. **Implementation**: Following [process]
5. **Verification**: By [role]

### Change Authority Matrix

| Change Type | Approval Required | Max Duration |
|-------------|------------------|--------------|
| Schedule (<1 week) | Project Manager | 2 days |
| Schedule (>1 week) | Steering Committee | 5 days |
| Budget (<10%) | Sponsor | 3 days |
| Budget (>10%) | Executive Committee | 7 days |
| Scope (Minor) | Product Owner | 2 days |
| Scope (Major) | Steering Committee | 5 days |

---

## Appendices

### A. Work Breakdown Structure (WBS)
_[Detailed hierarchical breakdown of all project work]_

### B. RACI Matrix
_[Who is Responsible, Accountable, Consulted, Informed for key activities]_

### C. Assumptions and Dependencies
_[Detailed list with impact analysis]_

### D. Glossary and Acronyms
_[All project-specific terms defined]_

### E. Reference Documents
_[List of all source documents with versions]_

---

## Document Control

| Version | Date | Author | Changes | Approved By |
|---------|------|---------|---------|-------------|
| 1.0 | [Date] | [Name] | Initial Release | [Name] |

## Final Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Sponsor | [Name] | _________ | _____ |
| Business Owner | [Name] | _________ | _____ |
| Technical Lead | [Name] | _________ | _____ |
| Finance Lead | [Name] | _________ | _____ |

---

**END OF MASTER_PLAN**

---

*This MASTER_PLAN represents the complete blueprint for your project. It transforms your initial vision into an actionable, comprehensive execution strategy. This document serves as the authoritative guide for all project activities.*

**Next Step**: Use this MASTER_PLAN with Shadow Clone's execution mode to build your project!`;
