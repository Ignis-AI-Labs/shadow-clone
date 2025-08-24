import { AuthService } from '../auth/authService.js';
import * as prompts from '../prompts/content/index.js';

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export class ModularTools {
  constructor(private authService: AuthService) {}

  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'deploy_agent_team',
        description: 'Returns PROMPT ENGINEERING MACROS for team simulation - delivers instructions that teach AI how to act as specialized development teams (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {
            teamType: {
              type: 'string',
              description: 'The type of team to deploy',
              enum: ['frontend', 'backend', 'database', 'testing', 'documentation', 'devops', 'mobile', 'security'],
            },
            task: {
              type: 'string',
              description: 'Specific task description for the team',
            },
            outputDirectory: {
              type: 'string',
              description: 'Where to place deliverables',
            },
            teamSize: {
              type: 'number',
              description: 'Number of agents (1-5)',
              minimum: 1,
              maximum: 5,
            },
          },
          required: ['teamType', 'task'],
        },
      },
      {
        name: 'deploy_specialist_agent',
        description: 'Returns PROMPT ENGINEERING MACROS for specialist simulation - delivers instructions that teach AI expert-level patterns and approaches (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {
            specialization: {
              type: 'string',
              description: 'Agent expertise area',
              enum: [
                'react_expert',
                'api_designer',
                'database_architect',
                'test_engineer',
                'performance_analyst',
                'security_auditor',
                'code_reviewer',
                'documentation_writer',
              ],
            },
            task: {
              type: 'string',
              description: 'Specific task for the agent',
            },
            context: {
              type: 'string',
              description: 'Additional context (file paths, requirements)',
            },
            deliverables: {
              type: 'array',
              description: 'Expected outputs',
              items: {
                type: 'string',
              },
            },
          },
          required: ['specialization', 'task'],
        },
      },
      {
        name: 'quick_fix',
        description: 'Returns PROMPT ENGINEERING MACROS for problem-solving - delivers instructions that teach AI professional debugging methodologies (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {
            issueType: {
              type: 'string',
              description: 'Type of issue',
              enum: ['bug', 'style', 'logic', 'performance', 'security'],
            },
            description: {
              type: 'string',
              description: 'Issue description',
            },
            filePath: {
              type: 'string',
              description: 'Affected file(s)',
            },
            urgency: {
              type: 'string',
              description: 'Priority level',
              enum: ['low', 'medium', 'high', 'critical'],
            },
          },
          required: ['issueType', 'description'],
        },
      },
      {
        name: 'code_review_team',
        description: 'Returns PROMPT ENGINEERING MACROS for code review - delivers instructions that teach AI how to perform professional code reviews (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {
            reviewType: {
              type: 'string',
              description: 'Focus area',
              enum: ['security', 'performance', 'quality', 'architecture', 'comprehensive'],
            },
            files: {
              type: 'array',
              description: 'Files or directories to review',
              items: {
                type: 'string',
              },
            },
            standards: {
              type: 'string',
              description: 'Specific standards to check against',
            },
          },
          required: ['reviewType', 'files'],
        },
      },
      {
        name: 'generate_tests',
        description: 'Returns PROMPT ENGINEERING MACROS for test generation - delivers instructions that teach AI professional testing methodologies (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {
            testType: {
              type: 'string',
              description: 'Type of tests to generate',
              enum: ['unit', 'integration', 'e2e', 'performance', 'security'],
            },
            targetFiles: {
              type: 'array',
              description: 'Files to test',
              items: {
                type: 'string',
              },
            },
            framework: {
              type: 'string',
              description: 'Testing framework to use',
            },
            coverage: {
              type: 'number',
              description: 'Target coverage percentage',
              minimum: 0,
              maximum: 100,
            },
          },
          required: ['testType', 'targetFiles'],
        },
      },
      {
        name: 'execute_single_wave',
        description: 'Returns PROMPT ENGINEERING MACROS for wave execution - delivers instructions that teach AI focused workflows for project phases (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {
            waveType: {
              type: 'string',
              description: 'Type of wave to execute',
              enum: ['research', 'planning', 'implementation', 'testing', 'documentation', 'review'],
            },
            scope: {
              type: 'string',
              description: 'What to focus on',
            },
            inputs: {
              type: 'array',
              description: 'Any required input files or data',
              items: {
                type: 'string',
              },
            },
            maxAgents: {
              type: 'number',
              description: 'Number of agents to deploy',
              minimum: 1,
              maximum: 10,
            },
          },
          required: ['waveType', 'scope'],
        },
      },
      {
        name: 'create_documentation',
        description: 'Returns PROMPT ENGINEERING MACROS for documentation - delivers instructions that teach AI professional documentation methodologies (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {
            docType: {
              type: 'string',
              description: 'Documentation type',
              enum: ['api', 'user_guide', 'developer', 'architecture', 'inline'],
            },
            scope: {
              type: 'string',
              description: 'What to document',
            },
            format: {
              type: 'string',
              description: 'Output format',
              enum: ['markdown', 'html', 'openapi', 'jsdoc'],
            },
            audience: {
              type: 'string',
              description: 'Target audience',
              enum: ['developers', 'users', 'architects', 'general'],
            },
          },
          required: ['docType', 'scope'],
        },
      },
      {
        name: 'architecture_consultant',
        description: 'Returns PROMPT ENGINEERING MACROS for architecture consultation - delivers instructions that teach AI expert design analysis (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {
            consultationType: {
              type: 'string',
              description: 'Type of consultation',
              enum: ['design_review', 'pattern_recommendation', 'scalability_analysis', 'migration_planning'],
            },
            context: {
              type: 'string',
              description: 'Current system description',
            },
            constraints: {
              type: 'string',
              description: 'Any limitations or requirements',
            },
            goals: {
              type: 'array',
              description: 'Specific goals to achieve',
              items: {
                type: 'string',
              },
            },
          },
          required: ['consultationType', 'context'],
        },
      },
      {
        name: 'show_commands',
        description: 'Returns a QUICK REFERENCE of all Shadow Clone commands - provides a cheat sheet of available tools and their usage (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Filter by category (optional)',
              enum: ['orchestration', 'teams', 'rapid', 'documentation', 'all'],
            },
          },
          required: [],
        },
      },
    ];
  }

  async executeTool(name: string, args: any): Promise<string> {
    switch (name) {
      case 'deploy_agent_team':
        return this.deployAgentTeam(args);
      
      case 'deploy_specialist_agent':
        return this.deploySpecialistAgent(args);
      
      case 'quick_fix':
        return this.quickFix(args);
      
      case 'code_review_team':
        return this.codeReviewTeam(args);
      
      case 'generate_tests':
        return this.generateTests(args);
      
      case 'execute_single_wave':
        return this.executeSingleWave(args);
      
      case 'create_documentation':
        return this.createDocumentation(args);
      
      case 'architecture_consultant':
        return this.architectureConsultant(args);
      
      case 'show_commands':
        return this.showCommands(args);
      
      default:
        throw new Error(`Unknown modular tool: ${name}`);
    }
  }

  private async deployAgentTeam(args: any): Promise<string> {
    const { teamType, task, outputDirectory, teamSize } = args;
    const directory = outputDirectory || './output/';
    const size = teamSize || 3;

    // Get team-specific templates
    const teamTemplates = this.getTeamTemplates(teamType);
    const coreRules = prompts.agent_core_rules.content;

    const prompt = `
# Shadow Clone Modular Team Deployment

You are deploying a ${teamType} specialist team for a focused task.

## Team Composition
${teamTemplates.slice(0, size).map((agent, i) => `- Agent ${i + 1}: ${agent.role} - ${agent.expertise}`).join('\n')}

## Core Rules
${coreRules}

## Task Assignment
${task}

## Execution Parameters
- Output Directory: ${directory}
- Team Size: ${size} agents
- Mode: Focused execution (single task)
- Coordination: Collaborative team effort

## Instructions
1. Each agent should focus on their area of expertise
2. Collaborate to complete the assigned task
3. Place all deliverables in ${directory}
4. Follow Shadow Clone quality standards
5. Complete task efficiently without over-engineering

## Deliverables
Based on the task, produce appropriate outputs such as:
- Code files
- Documentation
- Test files
- Configuration files
- Analysis reports

Execute the task with the ${teamType} team working collaboratively.
`;

    return prompt;
  }

  private async deploySpecialistAgent(args: any): Promise<string> {
    const { specialization, task, context, deliverables } = args;
    
    const specialistInfo = this.getSpecialistInfo(specialization);
    const coreRules = prompts.agent_core_rules.content;

    const prompt = `
# Shadow Clone Specialist Agent Deployment

You are a ${specialistInfo.title} with deep expertise in ${specialistInfo.expertise}.

## Core Rules
${coreRules}

## Your Specialization
${specialistInfo.description}

## Specific Task
${task}

${context ? `## Additional Context\n${context}\n` : ''}

## Expected Deliverables
${deliverables ? deliverables.map((d: string) => `- ${d}`).join('\n') : '- Complete the assigned task with appropriate outputs'}

## Execution Guidelines
1. Apply your specialized knowledge to solve this specific problem
2. Focus on quality and best practices in your domain
3. Provide clear, actionable solutions
4. Document your approach and reasoning
5. Ensure deliverables meet professional standards

Execute the task using your ${specialization} expertise.
`;

    return prompt;
  }

  private async quickFix(args: any): Promise<string> {
    const { issueType, description, filePath, urgency } = args;
    
    const urgencyLevel = urgency || 'high';
    const coreRules = prompts.agent_core_rules.content;

    const prompt = `
# Shadow Clone Quick Fix Deployment

Urgent ${issueType} fix required - ${urgencyLevel} priority.

## Core Rules
${coreRules}

## Issue Details
- Type: ${issueType}
- Description: ${description}
${filePath ? `- Affected File: ${filePath}` : ''}
- Urgency: ${urgencyLevel}

## Quick Fix Protocol
1. Rapidly diagnose the root cause
2. Implement minimal, targeted fix
3. Ensure fix doesn't break existing functionality
4. Add appropriate error handling
5. Include brief inline documentation
6. Create a test to prevent regression (if time permits)

## Execution Requirements
- Focus on speed and accuracy
- Make the minimal change needed to fix the issue
- Preserve existing code style and patterns
- Document what was changed and why
- If the fix is complex, note any technical debt created

${this.getIssueSpecificGuidance(issueType)}

Execute the quick fix immediately.
`;

    return prompt;
  }

  private async codeReviewTeam(args: any): Promise<string> {
    const { reviewType, files, standards } = args;
    
    const reviewFocus = this.getReviewFocus(reviewType);
    const coreRules = prompts.agent_core_rules.content;

    const prompt = `
# Shadow Clone Code Review Team Deployment

Conducting ${reviewType} review of specified code.

## Core Rules
${coreRules}

## Review Scope
- Review Type: ${reviewType}
- Files/Directories: ${files.join(', ')}
${standards ? `- Standards: ${standards}` : ''}

## Review Focus Areas
${reviewFocus}

## Review Process
1. Analyze code systematically
2. Identify issues based on review type
3. Provide specific, actionable feedback
4. Suggest improvements with examples
5. Prioritize findings by severity

## Deliverables
Create a comprehensive review report including:
- Executive summary of findings
- Detailed issue list with severity levels
- Code examples of problems found
- Recommended fixes with code samples
- Overall code quality assessment
- Action items prioritized by impact

Execute the ${reviewType} code review.
`;

    return prompt;
  }

  private async generateTests(args: any): Promise<string> {
    const { testType, targetFiles, framework, coverage } = args;
    
    const testingFramework = framework || this.getDefaultFramework(testType);
    const targetCoverage = coverage || 80;
    const coreRules = prompts.agent_core_rules.content;

    const prompt = `
# Shadow Clone Test Generation Deployment

Creating ${testType} tests for specified code.

## Core Rules
${coreRules}

## Test Generation Parameters
- Test Type: ${testType}
- Target Files: ${targetFiles.join(', ')}
- Framework: ${testingFramework}
- Target Coverage: ${targetCoverage}%

## Test Creation Guidelines
${this.getTestingGuidelines(testType)}

## Quality Standards
1. Tests must be comprehensive and meaningful
2. Cover edge cases and error scenarios
3. Use clear, descriptive test names
4. Include setup and teardown where needed
5. Mock external dependencies appropriately
6. Ensure tests are maintainable and readable

## Deliverables
- Test files using ${testingFramework}
- Coverage report showing ${targetCoverage}% or higher
- Documentation of test scenarios
- Any necessary test utilities or helpers
- Setup instructions if needed

Generate comprehensive ${testType} tests for the target files.
`;

    return prompt;
  }

  // Helper methods
  private getTeamTemplates(teamType: string): any[] {
    const templates: Record<string, any[]> = {
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

    return templates[teamType] || templates.frontend;
  }

  private getSpecialistInfo(specialization: string): any {
    const specialists: Record<string, any> = {
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

    return specialists[specialization] || specialists.react_expert;
  }

  private getIssueSpecificGuidance(issueType: string): string {
    const guidance: Record<string, string> = {
      bug: `
## Bug Fix Specific Guidelines
- Identify the exact cause of the bug
- Check for similar issues in related code
- Ensure the fix handles all edge cases
- Verify no new bugs are introduced`,
      
      style: `
## Style Fix Specific Guidelines
- Follow existing CSS/styling conventions
- Ensure cross-browser compatibility
- Test responsive behavior
- Optimize for performance`,
      
      logic: `
## Logic Fix Specific Guidelines
- Trace through the logic flow
- Identify where logic breaks down
- Ensure business rules are preserved
- Add appropriate validation`,
      
      performance: `
## Performance Fix Specific Guidelines
- Profile to identify bottlenecks
- Implement minimal optimization
- Measure improvement
- Document any trade-offs`,
      
      security: `
## Security Fix Specific Guidelines
- Identify the vulnerability clearly
- Implement secure coding practices
- Validate all inputs
- Consider security implications`,
    };

    return guidance[issueType] || guidance.bug;
  }

  private getReviewFocus(reviewType: string): string {
    const focuses: Record<string, string> = {
      security: `
- Authentication and authorization flaws
- Input validation and sanitization
- SQL injection and XSS vulnerabilities
- Sensitive data exposure
- Security misconfigurations
- Cryptographic issues`,
      
      performance: `
- Algorithm efficiency
- Database query optimization
- Caching opportunities
- Memory leaks
- Unnecessary computations
- Network request optimization`,
      
      quality: `
- Code readability and maintainability
- Adherence to style guides
- Proper error handling
- Code duplication
- Test coverage
- Documentation quality`,
      
      architecture: `
- Design pattern usage
- Component coupling
- Dependency management
- Scalability concerns
- Separation of concerns
- API design quality`,
      
      comprehensive: `
- All security vulnerabilities
- Performance bottlenecks
- Code quality issues
- Architecture concerns
- Test coverage gaps
- Documentation completeness`,
    };

    return focuses[reviewType] || focuses.quality;
  }

  private getTestingGuidelines(testType: string): string {
    const guidelines: Record<string, string> = {
      unit: `
- Test individual functions/methods in isolation
- Mock all external dependencies
- Cover happy paths and edge cases
- Test error conditions
- Ensure fast execution`,
      
      integration: `
- Test component interactions
- Use real or test databases
- Test API endpoints
- Verify data flow between components
- Test error propagation`,
      
      e2e: `
- Test complete user workflows
- Simulate real user interactions
- Test across different browsers/devices
- Verify business requirements
- Include visual regression tests`,
      
      performance: `
- Create load testing scenarios
- Measure response times
- Test concurrent users
- Monitor resource usage
- Identify breaking points`,
      
      security: `
- Test authentication flows
- Attempt common attacks (XSS, injection)
- Verify authorization rules
- Test data validation
- Check for security headers`,
    };

    return guidelines[testType] || guidelines.unit;
  }

  private getDefaultFramework(testType: string): string {
    const frameworks: Record<string, string> = {
      unit: 'jest',
      integration: 'jest',
      e2e: 'cypress',
      performance: 'k6',
      security: 'owasp-zap',
    };

    return frameworks[testType] || 'jest';
  }

  private async executeSingleWave(args: any): Promise<string> {
    const { waveType, scope, inputs, maxAgents } = args;
    
    const agentCount = maxAgents || 4;
    const inputContext = inputs ? `\n\n## Input Context\n${inputs.join('\n')}` : '';
    const coreRules = prompts.agent_core_rules.content;
    const waveConfig = this.getWaveConfiguration(waveType);

    const prompt = `
# Shadow Clone Single Wave Execution

Executing a focused ${waveType} wave with ${agentCount} specialized agents.

## Core Rules
${coreRules}

## Wave Configuration
${waveConfig.description}

## Wave Objective
${scope}
${inputContext}

## Agent Team Composition
${waveConfig.agents.slice(0, agentCount).map((agent: string, i: number) => `- Agent ${i + 1}: ${agent}`).join('\n')}

## Execution Protocol
1. Work collaboratively on the defined scope
2. Focus on ${waveType} deliverables only
3. Complete all work within this single wave
4. No prerequisites or follow-up waves needed
5. Produce concrete, actionable outputs

## Expected Deliverables
${waveConfig.deliverables.join('\n')}

## Quality Standards
- Follow Shadow Clone quality principles
- Ensure completeness within wave scope
- Produce professional-grade outputs
- Document decisions and rationale

Execute the ${waveType} wave for the specified scope.
`;

    return prompt;
  }

  private async createDocumentation(args: any): Promise<string> {
    const { docType, scope, format, audience } = args;
    
    const outputFormat = format || 'markdown';
    const targetAudience = audience || 'developers';
    const coreRules = prompts.agent_core_rules.content;
    const docConfig = this.getDocumentationConfig(docType);

    const prompt = `
# Shadow Clone Documentation Generation

Creating ${docType} documentation for specified scope.

## Core Rules
${coreRules}

## Documentation Parameters
- Type: ${docType}
- Scope: ${scope}
- Format: ${outputFormat}
- Audience: ${targetAudience}

## Documentation Specialist Team
${docConfig.specialists.map((spec: string, i: number) => `- Specialist ${i + 1}: ${spec}`).join('\n')}

## Documentation Guidelines
${docConfig.guidelines}

## Content Requirements
1. Comprehensive coverage of the scope
2. Clear and concise writing
3. Appropriate depth for ${targetAudience}
4. Proper formatting for ${outputFormat}
5. Examples and code samples where relevant

## Structure
${docConfig.structure}

## Quality Standards
- Accuracy and technical correctness
- Clarity and readability
- Completeness without redundancy
- Proper organization and flow
- Consistent style and terminology

Generate ${docType} documentation in ${outputFormat} format.
`;

    return prompt;
  }

  private async architectureConsultant(args: any): Promise<string> {
    const { consultationType, context, constraints, goals } = args;
    
    const consultationGoals = goals ? goals.join('\n- ') : 'Provide comprehensive architectural guidance';
    const coreRules = prompts.agent_core_rules.content;
    const consultConfig = this.getConsultationConfig(consultationType);

    const prompt = `
# Shadow Clone Architecture Consultation

Providing expert ${consultationType} consultation.

## Core Rules
${coreRules}

## Consultation Type
${consultConfig.description}

## Current System Context
${context}

${constraints ? `## Constraints & Requirements\n${constraints}\n` : ''}

## Consultation Goals
- ${consultationGoals}

## Expert Panel
${consultConfig.experts.map((expert: string, i: number) => `- Expert ${i + 1}: ${expert}`).join('\n')}

## Analysis Framework
${consultConfig.framework}

## Deliverables
1. Executive summary of findings
2. Detailed analysis with rationale
3. Specific recommendations
4. Implementation roadmap
5. Risk assessment and mitigation
6. Alternative approaches (if applicable)

## Consultation Process
1. Analyze current state thoroughly
2. Identify strengths and weaknesses
3. Apply best practices and patterns
4. Consider constraints and goals
5. Provide actionable recommendations
6. Include implementation guidance

Execute the ${consultationType} consultation.
`;

    return prompt;
  }

  // Additional helper methods for new tools
  private getWaveConfiguration(waveType: string): any {
    const configs: Record<string, any> = {
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

    return configs[waveType] || configs.research;
  }

  private getDocumentationConfig(docType: string): any {
    const configs: Record<string, any> = {
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

    return configs[docType] || configs.developer;
  }

  private getConsultationConfig(consultationType: string): any {
    const configs: Record<string, any> = {
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

    return configs[consultationType] || configs.design_review;
  }

  private async showCommands(args: any): Promise<string> {
    const category = args?.category || 'all';
    
    const commandReference = `<!--
IMPORTANT: THIS IS A PROMPT ENGINEERING MACRO
================================================
This is a REFERENCE GUIDE for Shadow Clone commands.
These commands deliver instructions for YOU to follow.
Shadow Clone does NOT execute code - YOU do.
================================================
-->

# Shadow Clone Command Reference

## Remember: These are PROMPT MACROS, not executable commands
Each tool delivers professional methodologies for YOU (the AI) to implement.

${category === 'all' || category === 'orchestration' ? `
## Orchestration Commands

### shadow_clone_orchestrate
- Modes: plan, feature, debug, optimize, refactor, audit, research
- Example: Use mode="feature" with projectDescription="Add OAuth login"
- Returns: Complete methodology for orchestrating virtual agent teams

### shadow_clone_plan  
- Create comprehensive project plans
- Example: projectVision="Build scalable SaaS platform"
- Returns: Planning templates and methodologies
` : ''}

${category === 'all' || category === 'teams' ? `
## Team Deployment Commands

### deploy_agent_team
- Teams: frontend, backend, database, testing, documentation, devops, mobile, security
- Example: teamType="backend" task="Create REST API"
- Returns: Team simulation patterns and workflows

### deploy_specialist_agent
- Specialists: react_expert, api_designer, database_architect, test_engineer, etc.
- Example: specialization="security_auditor" task="Audit auth flow"
- Returns: Expert-level methodologies for specific tasks
` : ''}

${category === 'all' || category === 'rapid' ? `
## Quick Modular Tools (No Full Orchestration!)

### quick_fix ⚡ - Instant Fix Methodology
- FAST: Single bug/issue resolution without teams
- Types: bug, style, logic, performance, security
- Example: issueType="bug" description="Null pointer in user service"
- Returns: Direct fix approach, no orchestration

### deploy_specialist_agent 🎯 - Single Expert
- FOCUSED: One specialist, one task, no coordination
- Experts: react_expert, api_designer, security_auditor, etc.
- Example: specialization="react_expert" task="Fix render loop"
- Returns: Expert methodology for specific problem

### code_review_team 🔍 - Quick Review
- TARGETED: Review specific files without full audit
- Types: security, performance, quality, architecture
- Example: reviewType="security" files=["login.js"]
- Returns: Focused review checklist

### generate_tests ✅ - Test Creation Only
- SPECIFIC: Add tests to existing code
- Types: unit, integration, e2e, performance, security
- Example: testType="unit" targetFiles=["utils.js"]
- Returns: Test writing patterns

### execute_single_wave 🌊 - One Phase Only  
- SINGLE: Just research OR planning OR implementation
- No multi-wave coordination needed
- Example: waveType="research" scope="OAuth best practices"
- Returns: Focused methodology for one phase
` : ''}

${category === 'all' || category === 'documentation' ? `
## Documentation & Architecture Commands

### create_documentation
- Types: api, user_guide, developer, architecture, inline
- Example: docType="api" scope="REST endpoints"
- Returns: Documentation creation patterns

### architecture_consultant
- Types: design_review, pattern_recommendation, scalability_analysis, migration_planning
- Example: consultationType="design_review" context="Monolithic app"
- Returns: Architecture analysis methodologies
` : ''}

## Quick Tips
1. Always authenticate first with your API key
2. These tools teach YOU professional methodologies
3. YOU implement the actual code following these patterns
4. Each tool is a "power-up" for your capabilities
5. Combine tools for comprehensive solutions

## Getting Started
1. authenticate - Set up your Shadow Clone license
2. show_commands - Display this reference (you're here!)
3. shadow_clone_plan - Start planning your project
4. Execute the methodologies provided

Remember: Shadow Clone makes YOU more capable by providing battle-tested methodologies!`;

    return commandReference;
  }
}