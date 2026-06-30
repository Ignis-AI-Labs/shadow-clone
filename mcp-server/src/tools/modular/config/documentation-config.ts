import type { DocumentationConfig } from '../types.js';

const DOC_CONFIGS: Record<string, DocumentationConfig> = {
  api: {
    specialists: [
      'API Documentation Expert - Creates clear endpoint documentation',
      'Schema Designer - Documents data models',
      'Example Creator - Provides usage examples',
      'Error Documentation Specialist - Documents error handling',
    ],
    guidelines: `
- Document all endpoints with method, path, parameters
- Include request/response examples
- Document error codes and meanings
- Provide authentication details
- Include rate limiting information`,
    structure: `
1. Overview and Authentication
2. Endpoints by category
3. Data models and schemas
4. Error handling
5. Examples and tutorials
6. Changelog and versioning`,
  },
  user_guide: {
    specialists: [
      'User Experience Writer - Creates intuitive guides',
      'Tutorial Creator - Builds step-by-step instructions',
      'FAQ Compiler - Anticipates user questions',
      'Visual Guide Creator - Adds helpful diagrams',
    ],
    guidelines: `
- Write for non-technical users
- Use clear, simple language
- Include screenshots and examples
- Organize by user tasks
- Provide troubleshooting section`,
    structure: `
1. Getting Started
2. Core Features
3. Step-by-Step Tutorials
4. Tips and Best Practices
5. Troubleshooting
6. FAQ`,
  },
  developer: {
    specialists: [
      'Developer Documentation Expert - Technical writing',
      'Architecture Documenter - System design docs',
      'Setup Guide Writer - Installation and configuration',
      'Contribution Guide Author - Open source guidelines',
    ],
    guidelines: `
- Target experienced developers
- Include architecture decisions
- Document setup and configuration
- Explain design patterns used
- Include contribution guidelines`,
    structure: `
1. Architecture Overview
2. Setup and Installation
3. Development Workflow
4. API Reference
5. Testing Guide
6. Contribution Guidelines`,
  },
  architecture: {
    specialists: [
      'System Architect - High-level design documentation',
      'Diagram Creator - Visual architecture representations',
      'Decision Documenter - ADRs and rationale',
      'Integration Documenter - System interactions',
    ],
    guidelines: `
- Document key architectural decisions
- Include system diagrams
- Explain component interactions
- Document scalability considerations
- Include security architecture`,
    structure: `
1. System Overview
2. Component Architecture
3. Data Flow Diagrams
4. Integration Points
5. Scalability Design
6. Security Architecture`,
  },
  inline: {
    specialists: [
      'Code Commenter - Adds meaningful inline docs',
      'JSDoc Expert - Proper function documentation',
      'Type Documentation Specialist - Type definitions',
      'Example Embedder - Inline usage examples',
    ],
    guidelines: `
- Document complex logic
- Add JSDoc/TSDoc to all public APIs
- Include parameter descriptions
- Add usage examples in comments
- Document edge cases and gotchas`,
    structure: `
1. File headers with purpose
2. Class/module documentation
3. Method/function documentation
4. Complex logic explanation
5. TODO and FIXME comments
6. Type documentation`,
  },
};

export const getDocumentationConfig = (docType: string): DocumentationConfig => {
  const value = DOC_CONFIGS[docType];
  if (!value) throw new Error(`Unknown docType: ${docType}`);
  return value;
};
