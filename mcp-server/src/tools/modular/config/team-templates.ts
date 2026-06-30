import type { TeamAgent } from '../types.js';

const TEAM_TEMPLATES: Record<string, TeamAgent[]> = {
  frontend: [
    { role: 'UI Component Expert', expertise: 'React/Vue/Angular components, state management' },
    { role: 'CSS Specialist', expertise: 'Responsive design, animations, styling systems' },
    { role: 'UX Developer', expertise: 'Accessibility, performance, user interactions' },
    { role: 'Frontend Architect', expertise: 'Architecture patterns, build tools, optimization' },
    { role: 'State Management Expert', expertise: 'Redux, MobX, Context API, data flow' },
  ],
  backend: [
    { role: 'API Designer', expertise: 'REST/GraphQL design, endpoint architecture' },
    { role: 'Database Expert', expertise: 'Query optimization, schema design, ORMs' },
    { role: 'Security Specialist', expertise: 'Authentication, authorization, security best practices' },
    { role: 'Performance Engineer', expertise: 'Caching, optimization, scalability' },
    { role: 'Integration Specialist', expertise: 'Third-party APIs, microservices, messaging' },
  ],
  database: [
    { role: 'Schema Architect', expertise: 'Database design, normalization, relationships' },
    { role: 'Query Optimizer', expertise: 'Performance tuning, indexing, query plans' },
    { role: 'Migration Specialist', expertise: 'Data migrations, versioning, rollbacks' },
    { role: 'Data Security Expert', expertise: 'Encryption, access control, compliance' },
    { role: 'Replication Expert', expertise: 'Clustering, sharding, backup strategies' },
  ],
  testing: [
    { role: 'Unit Test Expert', expertise: 'Unit testing, mocking, test coverage' },
    { role: 'Integration Specialist', expertise: 'API testing, service integration tests' },
    { role: 'E2E Test Engineer', expertise: 'End-to-end testing, user flows, automation' },
    { role: 'Performance Tester', expertise: 'Load testing, stress testing, benchmarking' },
    { role: 'Test Architect', expertise: 'Test strategy, framework design, CI/CD integration' },
  ],
  documentation: [
    { role: 'API Documenter', expertise: 'OpenAPI, technical specifications, examples' },
    { role: 'User Guide Writer', expertise: 'User documentation, tutorials, how-to guides' },
    { role: 'Code Documenter', expertise: 'Inline documentation, JSDoc, architecture docs' },
    { role: 'Technical Writer', expertise: 'Technical articles, best practices, style guides' },
    { role: 'Diagram Specialist', expertise: 'Architecture diagrams, flowcharts, visual docs' },
  ],
  devops: [
    { role: 'CI/CD Engineer', expertise: 'Pipeline design, automation, deployment' },
    { role: 'Infrastructure Expert', expertise: 'Cloud services, containerization, orchestration' },
    { role: 'Monitoring Specialist', expertise: 'Logging, metrics, alerting, observability' },
    { role: 'Security Engineer', expertise: 'Security scanning, compliance, hardening' },
    { role: 'Release Manager', expertise: 'Release processes, versioning, rollback strategies' },
  ],
  mobile: [
    { role: 'iOS Developer', expertise: 'Swift, UIKit, SwiftUI, iOS patterns' },
    { role: 'Android Developer', expertise: 'Kotlin, Jetpack, Android architecture' },
    { role: 'React Native Expert', expertise: 'Cross-platform development, native modules' },
    { role: 'Mobile UI/UX Expert', expertise: 'Mobile design patterns, gestures, animations' },
    { role: 'Mobile Performance Expert', expertise: 'Optimization, battery usage, offline sync' },
  ],
  security: [
    { role: 'Vulnerability Analyst', expertise: 'Security scanning, penetration testing, CVEs' },
    { role: 'Authentication Expert', expertise: 'OAuth, JWT, SSO, MFA implementation' },
    { role: 'Encryption Specialist', expertise: 'Data encryption, key management, crypto' },
    { role: 'Compliance Officer', expertise: 'GDPR, HIPAA, PCI-DSS, security standards' },
    { role: 'Incident Responder', expertise: 'Security incidents, forensics, remediation' },
  ],
};

export const getTeamTemplates = (teamType: string): TeamAgent[] => {
  const value = TEAM_TEMPLATES[teamType];
  if (!value) throw new Error(`Unknown teamType: ${teamType}`);
  return value;
};
