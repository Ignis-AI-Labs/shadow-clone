import type { WaveConfiguration } from '../types.js';

const WAVE_CONFIGS: Record<string, WaveConfiguration> = {
  research: {
    description: 'Deep analysis and investigation without making changes',
    agents: [
      'Code Analyst - Understands existing codebase structure',
      'Pattern Researcher - Identifies design patterns and best practices',
      'Documentation Analyst - Reviews existing documentation',
      'Dependency Expert - Analyzes external dependencies',
    ],
    deliverables: [
      '- Research findings document',
      '- Recommendations report',
      '- Technical analysis summary',
      '- Identified improvement opportunities',
    ],
  },
  planning: {
    description: 'Create detailed plans and architectures',
    agents: [
      'Architecture Planner - Designs system architecture',
      'Implementation Strategist - Creates execution roadmap',
      'Risk Analyst - Identifies potential challenges',
      'Resource Planner - Estimates time and resources',
    ],
    deliverables: [
      '- Detailed implementation plan',
      '- Architecture diagrams',
      '- Risk mitigation strategies',
      '- Phase breakdown with milestones',
    ],
  },
  implementation: {
    description: 'Build specific features or components',
    agents: [
      'Feature Developer - Implements core functionality',
      'Integration Specialist - Connects components',
      'Code Quality Expert - Ensures best practices',
      'Testing Engineer - Creates accompanying tests',
    ],
    deliverables: [
      '- Working code implementation',
      '- Unit tests',
      '- Integration points',
      '- Basic documentation',
    ],
  },
  testing: {
    description: 'Create comprehensive test suites',
    agents: [
      'Test Architect - Designs test strategy',
      'Unit Test Developer - Creates unit tests',
      'Integration Tester - Builds integration tests',
      'Test Coverage Analyst - Ensures completeness',
    ],
    deliverables: [
      '- Complete test suite',
      '- Test coverage report',
      '- Test documentation',
      '- CI/CD integration scripts',
    ],
  },
  documentation: {
    description: 'Generate comprehensive documentation',
    agents: [
      'Technical Writer - Creates user documentation',
      'API Documenter - Documents interfaces',
      'Code Commenter - Adds inline documentation',
      'Example Creator - Builds usage examples',
    ],
    deliverables: [
      '- User documentation',
      '- API reference',
      '- Code comments',
      '- Usage examples',
    ],
  },
  review: {
    description: 'Comprehensive code and architecture review',
    agents: [
      'Code Reviewer - Analyzes code quality',
      'Security Auditor - Checks for vulnerabilities',
      'Performance Analyst - Identifies bottlenecks',
      'Architecture Reviewer - Validates design decisions',
    ],
    deliverables: [
      '- Code review report',
      '- Security findings',
      '- Performance analysis',
      '- Improvement recommendations',
    ],
  },
};

export const getWaveConfiguration = (waveType: string): WaveConfiguration =>
  WAVE_CONFIGS[waveType] ?? WAVE_CONFIGS.research;
