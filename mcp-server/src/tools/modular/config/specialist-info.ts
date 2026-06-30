import type { SpecialistInfo } from '../types.js';

const SPECIALISTS: Record<string, SpecialistInfo> = {
  react_expert: {
    title: 'React/Next.js Specialist',
    expertise: 'React, Next.js, hooks, performance optimization, component architecture',
    description: 'Expert in modern React development, including hooks, context, performance optimization, and Next.js framework features.',
  },
  api_designer: {
    title: 'API Design Specialist',
    expertise: 'REST, GraphQL, API architecture, versioning, documentation',
    description: 'Expert in designing scalable, maintainable APIs with proper authentication, error handling, and documentation.',
  },
  database_architect: {
    title: 'Database Architecture Specialist',
    expertise: 'Schema design, query optimization, indexing, scalability',
    description: 'Expert in database design, performance tuning, and scalability strategies for both SQL and NoSQL databases.',
  },
  test_engineer: {
    title: 'Test Engineering Specialist',
    expertise: 'Test strategy, automation, coverage, TDD/BDD',
    description: 'Expert in creating comprehensive test suites, test automation, and ensuring high code quality through testing.',
  },
  performance_analyst: {
    title: 'Performance Analysis Specialist',
    expertise: 'Profiling, optimization, caching, load testing',
    description: 'Expert in identifying and resolving performance bottlenecks, optimizing algorithms, and improving system efficiency.',
  },
  security_auditor: {
    title: 'Security Audit Specialist',
    expertise: 'Vulnerability assessment, penetration testing, security best practices',
    description: 'Expert in identifying security vulnerabilities, implementing fixes, and ensuring compliance with security standards.',
  },
  code_reviewer: {
    title: 'Code Review Specialist',
    expertise: 'Code quality, best practices, refactoring, maintainability',
    description: 'Expert in code review, identifying improvements, and ensuring code follows best practices and standards.',
  },
  documentation_writer: {
    title: 'Technical Documentation Specialist',
    expertise: 'API docs, user guides, architecture documentation, tutorials',
    description: 'Expert in creating clear, comprehensive technical documentation for various audiences.',
  },
};

export const getSpecialistInfo = (specialization: string): SpecialistInfo => {
  const value = SPECIALISTS[specialization];
  if (!value) throw new Error(`Unknown specialization: ${specialization}`);
  return value;
};
