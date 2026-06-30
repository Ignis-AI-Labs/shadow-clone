import type { ConsultationConfig } from '../types.js';

const CONSULT_CONFIGS: Record<string, ConsultationConfig> = {
  design_review: {
    description: 'Comprehensive review of system design and architecture',
    experts: [
      'Senior System Architect - Overall design evaluation',
      'Domain Expert - Business logic validation',
      'Integration Architect - System boundaries review',
      'Performance Architect - Scalability assessment',
    ],
    framework: `
- Evaluate current architecture against best practices
- Identify design smells and anti-patterns
- Assess scalability and maintainability
- Review technology choices
- Validate business alignment`,
  },
  pattern_recommendation: {
    description: 'Recommend design patterns and architectural approaches',
    experts: [
      'Design Pattern Expert - Pattern selection and application',
      'Framework Specialist - Technology-specific patterns',
      'Refactoring Expert - Migration strategies',
      'Best Practices Advisor - Industry standards',
    ],
    framework: `
- Analyze problem domain
- Identify applicable patterns
- Consider technology constraints
- Provide implementation examples
- Include migration approach`,
  },
  scalability_analysis: {
    description: 'Assess and improve system scalability',
    experts: [
      'Scalability Architect - Horizontal/vertical scaling',
      'Performance Engineer - Bottleneck identification',
      'Database Scaling Expert - Data layer optimization',
      'Caching Strategist - Cache architecture design',
    ],
    framework: `
- Analyze current bottlenecks
- Project future growth scenarios
- Design scaling strategies
- Recommend caching layers
- Plan for data partitioning`,
  },
  migration_planning: {
    description: 'Plan system migrations and modernization',
    experts: [
      'Migration Architect - Overall migration strategy',
      'Risk Assessment Expert - Impact analysis',
      'Data Migration Specialist - Data transformation planning',
      'Rollback Strategist - Contingency planning',
    ],
    framework: `
- Assess current state
- Define target architecture
- Create phased migration plan
- Identify risks and mitigation
- Design rollback procedures`,
  },
};

export const getConsultationConfig = (consultationType: string): ConsultationConfig =>
  CONSULT_CONFIGS[consultationType] ?? CONSULT_CONFIGS.design_review;
