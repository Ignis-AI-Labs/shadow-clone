import { content as mainPromptContent } from '@prompts/mainPrompt';
import { content as agentCoreRules } from '@prompts/agent_core_rules';
import { content as modePlanContent } from '@prompts/mode_plan';
import type { ToolConfig, ParamsRecord } from './types';
import {
  asString,
  asStringArray,
  joinList,
  optionalSection,
} from './assemble';

const SPECIALIST_INFO: Record<string, { title: string; expertise: string; description: string }> = {
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

const ISSUE_GUIDANCE: Record<string, string> = {
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

const REVIEW_FOCUS: Record<string, string> = {
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
- Documentation quality
- Functional programming compliance (pure functions, immutability)
- Function size limits (30 line target, 50 line ceiling)
- File size limits (200 line target, 300 line ceiling)`,
  architecture: `
- Design pattern usage
- Component coupling
- Dependency management
- Scalability concerns
- Separation of concerns
- API design quality
- Composition over inheritance
- Side effect isolation at boundaries
- No mutable shared state across modules`,
  comprehensive: `
- All security vulnerabilities
- Performance bottlenecks
- Code quality issues
- Architecture concerns
- Test coverage gaps
- Documentation completeness
- FP compliance (pure functions, immutability, composition)
- Function/file size limits
- Branching protocol compliance
- Task ID referenced in PR`,
  fp_compliance: `
- Pure function verification (no side effects)
- Immutability adherence (const, spread, no mutation)
- Function size limits (30 line target, 50 line ceiling)
- File size limits (200 line target, 300 line ceiling)
- Composition over inheritance
- Single responsibility per function
- Side effect boundary isolation
- Parameter count (max 3-4, use options object)
- No mutable shared state across modules`,
};

const TEST_GUIDELINES: Record<string, string> = {
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

const DEFAULT_FRAMEWORK: Record<string, string> = {
  unit: 'jest',
  integration: 'jest',
  e2e: 'cypress',
  performance: 'k6',
  security: 'owasp-zap',
};

const shadowClonePlan: ToolConfig = {
  id: 'shadow-clone-plan',
  label: 'Plan a Project',
  description: 'Turn a rough idea into a complete project blueprint — research, technical design, and a step-by-step master plan. No code is written.',
  category: 'planning',
  params: [
    {
      name: 'projectVision',
      label: 'What do you want to build?',
      description: 'Describe your idea in plain English. Include who it is for, what success looks like, and any constraints you already know about.',
      type: 'string',
      required: true,
      placeholder: 'e.g. A personal finance dashboard that connects to my bank and shows monthly spending trends...',
      helperText: 'Aim for at least a couple of sentences. The more context, the better the plan.',
    },
    {
      name: 'wavesDirectory',
      label: 'Where should the plan files go?',
      description: 'Folder name where the AI should write its planning documents. Leave blank for the default.',
      type: 'string',
      required: false,
      placeholder: './.waves/',
      defaultValue: './.waves/',
    },
  ],
  assemblePrompt: (params: ParamsRecord): string => {
    const projectVision = asString(params.projectVision);
    const wavesDirectory = asString(params.wavesDirectory) || './.waves/';
    return `${mainPromptContent}

## Planning Mode Activated
${modePlanContent}

## Project Vision
${projectVision}

## Execution Parameters
- mode: plan
- waves_directory: ${wavesDirectory}
- max_agents_per_wave: 10

## Instructions
Execute Shadow Clone in Planning Mode to create a comprehensive project architecture and implementation plan. NO CODE should be written - only planning documents.
`;
  },
  whenToPick: [
    'You have an idea but no concrete plan yet — and want one before any code is written',
    'You want to hand a master plan to a different AI (or yourself, later) and have implementation start cleanly',
    'You want the AI to research tradeoffs and pick a tech stack rather than guessing',
  ],
  whenNotToPick: [
    'You already have a plan and just want the AI to start building — use "Brief a Specialist" or "Quick Fix" instead',
    'You need a one-line answer — planning mode produces three full documents and will feel like overkill',
  ],
  examples: [
    {
      label: 'Personal finance dashboard',
      description: 'A small, well-scoped consumer app with a clear stack hint.',
      values: {
        projectVision: 'Build a personal finance dashboard that connects to my bank via Plaid, categorizes transactions automatically with an LLM, and shows monthly spending trends. Should be a Next.js web app deployed on Vercel, with Postgres for storage and auth via Clerk. Target audience: just me and my partner. Success = we stop using spreadsheets within 2 months.',
        wavesDirectory: './.waves/',
      },
    },
    {
      label: 'Open-source CLI tool',
      description: 'A larger project with no stack chosen yet — lets the AI recommend.',
      values: {
        projectVision: 'Build a command-line tool that monitors my git repos for stale branches and unmerged PRs and pings me with a daily summary. Should run locally as a background service, no cloud required. Target audience: solo developers who juggle 10+ repos. Success = I never lose track of an old branch again.',
        wavesDirectory: './.waves/',
      },
    },
  ],
  whatHappensNext: {
    summary: 'The AI runs three sequential planning waves and writes three documents to disk. No source code is produced — only a clear blueprint you can hand to implementers.',
    executionModel: 'wave-based',
    waves: [
      {
        label: 'Wave 0 — Project Foundation',
        purpose: 'The AI dissects your vision: goals, users, constraints, success criteria, scope boundaries.',
        deliverables: ['.waves/wave-0/deliverables/PROJECT_FOUNDATION.md'],
      },
      {
        label: 'Wave 1 — Technical Research',
        purpose: 'The AI evaluates frameworks, libraries, and architectural patterns and recommends a stack with reasoning.',
        deliverables: ['.waves/wave-1/deliverables/TECHNICAL_RESEARCH.md'],
      },
      {
        label: 'Wave 2 — Master Plan',
        purpose: 'The AI produces the step-by-step implementation roadmap: phases, deliverables, agent teams, sequencing.',
        deliverables: ['.waves/wave-2/deliverables/MASTER_PLAN.md'],
      },
    ],
    deliverablesDirectory: './.waves/',
    caveat: 'No code is written in planning mode — you should expect three Markdown documents, not a working app. To execute the plan, paste the resulting MASTER_PLAN.md into a fresh AI session along with the "Brief a Specialist" prompt for each phase.',
  },
};

const deploySpecialistAgent: ToolConfig = {
  id: 'specialist-agent',
  label: 'Brief a Specialist',
  description: 'Hand a focused task to one AI expert — React, security, databases, and more. Best for a single well-defined problem.',
  category: 'specialist',
  params: [
    {
      name: 'specialization',
      label: 'Which kind of expert?',
      description: 'Pick the area of expertise that best fits your task.',
      type: 'enum',
      required: true,
      enumOptions: [
        { value: 'react_expert', label: 'React / Next.js expert' },
        { value: 'api_designer', label: 'API designer' },
        { value: 'database_architect', label: 'Database architect' },
        { value: 'test_engineer', label: 'Test engineer' },
        { value: 'performance_analyst', label: 'Performance analyst' },
        { value: 'security_auditor', label: 'Security auditor' },
        { value: 'code_reviewer', label: 'Code reviewer' },
        { value: 'documentation_writer', label: 'Documentation writer' },
      ],
      defaultValue: 'react_expert',
    },
    {
      name: 'task',
      label: 'What should the expert do?',
      description: 'Describe the specific task in plain English. Be as concrete as you can.',
      type: 'string',
      required: true,
      placeholder: 'e.g. Diagnose and fix the infinite re-render loop in our ProductList component...',
    },
    {
      name: 'context',
      label: 'Any extra context? (optional)',
      description: 'File paths, related code, constraints, links — anything that will help the expert work faster.',
      type: 'string',
      required: false,
      placeholder: 'e.g. Affected files: src/components/ProductList.tsx. Uses React 18 + Zustand.',
    },
    {
      name: 'deliverables',
      label: 'What do you want back? (optional, one per line)',
      description: 'List each expected output on its own line. Leave blank for a generic "complete the task" deliverable.',
      type: 'string-array',
      required: false,
      arrayItemLabel: 'deliverable',
      placeholder: 'Root-cause analysis\nPatched file\nRegression test',
    },
  ],
  assemblePrompt: (params: ParamsRecord): string => {
    const specialization = asString(params.specialization) || 'react_expert';
    const info = SPECIALIST_INFO[specialization] || SPECIALIST_INFO.react_expert;
    const task = asString(params.task);
    const context = asString(params.context);
    const deliverables = asStringArray(params.deliverables);

    const contextBlock = optionalSection(context, `## Additional Context\n${context}\n`);
    const deliverablesBlock = deliverables.length > 0
      ? deliverables.map((d) => `- ${d}`).join('\n')
      : '- Complete the assigned task with appropriate outputs';

    return `# Shadow Clone Specialist Agent Deployment

You are a ${info.title} with deep expertise in ${info.expertise}.

## Core Rules
${agentCoreRules}

## Your Specialization
${info.description}

## Specific Task
${task}

${contextBlock}

## Expected Deliverables
${deliverablesBlock}

## Execution Guidelines
1. Apply your specialized knowledge to solve this specific problem
2. Focus on quality and best practices in your domain
3. Provide clear, actionable solutions
4. Document your approach and reasoning
5. Ensure deliverables meet professional standards

Execute the task using your ${specialization} expertise.`;
  },
  whenToPick: [
    'You have ONE specific, well-defined task and want one expert to handle it end-to-end',
    'You want a focused perspective (React, security, databases, etc.) rather than a generalist response',
    'The task is too narrow to deserve a full multi-wave plan but too specific for "Quick Fix"',
  ],
  whenNotToPick: [
    'You are trying to plan a new project — use "Plan a Project" instead',
    'You want multiple experts collaborating (this is a single specialist; teams come from the orchestrate tool, V2)',
  ],
  examples: [
    {
      label: 'Diagnose a React render loop',
      description: 'A focused React debugging task with concrete context.',
      values: {
        specialization: 'react_expert',
        task: 'Diagnose and fix the infinite re-render loop in our ProductList component that triggers when the cart drawer opens',
        context: 'Affected files: src/components/ProductList.tsx, src/hooks/useCart.ts. Uses React 18, Zustand for cart state. The loop started after we added the price-sync useEffect in PR #482.',
        deliverables: ['Root-cause analysis', 'Patched ProductList.tsx with the fix', 'Regression test using React Testing Library', 'Short write-up explaining why the loop occurred'],
      },
    },
    {
      label: 'Design a REST API for a comments service',
      description: 'A greenfield API design task; no existing code referenced.',
      values: {
        specialization: 'api_designer',
        task: 'Design a REST API for a threaded comments service that supports nested replies up to 3 levels deep, soft deletes, and reactions (emoji).',
        context: 'Target stack: Node.js + PostgreSQL. Expected scale: ~10k comments/day. Auth is already handled upstream — the API receives a verified user id in a header.',
        deliverables: ['OpenAPI 3.1 spec', 'Resource and URL design with rationale', 'Pagination and rate-limiting approach', 'Sample request/response payloads for the top 5 endpoints'],
      },
    },
  ],
  whatHappensNext: {
    summary: 'The AI takes on the chosen specialist persona and works the task end-to-end in one shot, producing the deliverables you listed.',
    executionModel: 'single-shot',
    caveat: 'No wave system, no Record Keeper, no .waves/ directory. This is one expert doing one job. Output appears inline in the chat, not as files on disk (unless you ask for files in the deliverables).',
  },
};

const quickFix: ToolConfig = {
  id: 'quick-fix',
  label: 'Quick Fix One Issue',
  description: 'Get an expert debugging playbook for one specific problem — a bug, broken style, slow query, or security flaw. Minimal, surgical changes only.',
  category: 'fix',
  params: [
    {
      name: 'issueType',
      label: 'What kind of issue is it?',
      description: 'Pick the category that best fits the problem.',
      type: 'enum',
      required: true,
      enumOptions: [
        { value: 'bug', label: 'Bug — something is broken' },
        { value: 'style', label: 'Style — visual or layout problem' },
        { value: 'logic', label: 'Logic — wrong behavior, not crashing' },
        { value: 'performance', label: 'Performance — too slow' },
        { value: 'security', label: 'Security — vulnerability or risk' },
      ],
      defaultValue: 'bug',
    },
    {
      name: 'description',
      label: 'Describe the issue',
      description: 'What is happening, when does it happen, and what should happen instead?',
      type: 'string',
      required: true,
      placeholder: 'e.g. Null pointer exception in UserService.getProfile() when the user has no avatar...',
    },
    {
      name: 'filePath',
      label: 'Which file(s) are affected? (optional)',
      description: 'Paths to the files involved. Helps the AI focus its diagnosis.',
      type: 'string',
      required: false,
      placeholder: 'src/services/UserService.ts',
    },
    {
      name: 'urgency',
      label: 'How urgent is it?',
      description: 'Defaults to "high" if you leave it blank.',
      type: 'enum',
      required: false,
      enumOptions: [
        { value: 'low', label: 'Low — nice to fix' },
        { value: 'medium', label: 'Medium — should fix soon' },
        { value: 'high', label: 'High — fix today' },
        { value: 'critical', label: 'Critical — drop everything' },
      ],
      defaultValue: 'high',
    },
  ],
  assemblePrompt: (params: ParamsRecord): string => {
    const issueType = asString(params.issueType) || 'bug';
    const description = asString(params.description);
    const filePath = asString(params.filePath);
    const urgencyLevel = asString(params.urgency) || 'high';
    const guidance = ISSUE_GUIDANCE[issueType] || ISSUE_GUIDANCE.bug;
    const fileLine = optionalSection(filePath, `- Affected File: ${filePath}`);

    return `# Shadow Clone Quick Fix Deployment

Urgent ${issueType} fix required - ${urgencyLevel} priority.

## Core Rules
${agentCoreRules}

## Issue Details
- Type: ${issueType}
- Description: ${description}
${fileLine}
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

${guidance}

Execute the quick fix immediately.`;
  },
  whenToPick: [
    'You have ONE specific problem and want a minimal, surgical fix — not a refactor',
    'You can describe the issue in a sentence or two',
    'You want the AI to preserve existing code style and patterns, not redesign',
  ],
  whenNotToPick: [
    'The bug spans many files or you do not know where it lives — use "Brief a Specialist" with debugging context instead',
    'You want a full review pass — use "Review Specific Files" instead',
    'You actually want a refactor or rewrite — Quick Fix is allergic to those',
  ],
  examples: [
    {
      label: 'Null pointer in login flow',
      description: 'A concrete bug with a file pointer and high urgency.',
      values: {
        issueType: 'bug',
        description: 'Null pointer exception thrown in UserService.getProfile() when the user has no avatar set — crashes the profile page on first login.',
        filePath: 'src/services/UserService.ts',
        urgency: 'high',
      },
    },
    {
      label: 'Slow dashboard query',
      description: 'A performance issue with no file pointer — AI will diagnose first.',
      values: {
        issueType: 'performance',
        description: 'The /dashboard route takes 4-6 seconds to load the first time a user hits it after deploy. Subsequent loads are fast. Suspect a cold-start query but have not profiled.',
        filePath: '',
        urgency: 'medium',
      },
    },
  ],
  whatHappensNext: {
    summary: 'The AI follows an expert debugging playbook tuned to the issue type you picked: diagnose the root cause, propose the minimal change, and write a regression test.',
    executionModel: 'single-shot',
    caveat: 'No wave system. One pass, minimal scope. If the AI determines the fix actually requires a larger refactor, it will say so explicitly rather than silently expanding scope.',
  },
};

const codeReviewTeam: ToolConfig = {
  id: 'code-review-team',
  label: 'Review Specific Files',
  description: 'A focused second-opinion pass over the files you point at — security, performance, quality, architecture, full-sweep, or strict functional-programming compliance.',
  category: 'review',
  params: [
    {
      name: 'reviewType',
      label: 'What should the review focus on?',
      description: 'Pick the lens the review team should use.',
      type: 'enum',
      required: true,
      enumOptions: [
        { value: 'security', label: 'Security — find vulnerabilities' },
        { value: 'performance', label: 'Performance — find slow paths' },
        { value: 'quality', label: 'Quality — readability and best practices' },
        { value: 'architecture', label: 'Architecture — structure and design' },
        { value: 'comprehensive', label: 'Comprehensive — all of the above' },
        { value: 'fp_compliance', label: 'Functional-programming compliance' },
      ],
      defaultValue: 'comprehensive',
    },
    {
      name: 'files',
      label: 'Which files or folders should be reviewed?',
      description: 'One path per line. Folders are fine.',
      type: 'string-array',
      required: true,
      arrayItemLabel: 'file or folder',
      placeholder: 'src/auth/login.ts\nsrc/auth/session.ts\nsrc/middleware/authMiddleware.ts',
    },
    {
      name: 'standards',
      label: 'Any specific standards to check against? (optional)',
      description: 'E.g. OWASP Top 10, internal style guide, accessibility rules.',
      type: 'string',
      required: false,
      placeholder: 'OWASP Top 10, internal auth checklist, must use parameterized queries',
    },
  ],
  assemblePrompt: (params: ParamsRecord): string => {
    const reviewType = asString(params.reviewType) || 'comprehensive';
    const files = asStringArray(params.files);
    const standards = asString(params.standards);
    const reviewFocus = REVIEW_FOCUS[reviewType] || REVIEW_FOCUS.quality;
    const standardsLine = optionalSection(standards, `- Standards: ${standards}`);

    return `# Shadow Clone Code Review Team Deployment

Conducting ${reviewType} review of specified code.

## Core Rules
${agentCoreRules}

## Review Scope
- Review Type: ${reviewType}
- Files/Directories: ${joinList(files)}
${standardsLine}

## Review Focus Areas
${reviewFocus}

## Review Process
1. Survey the listed files and map their responsibilities
2. Apply the focus checklist to every file in scope
3. Flag concrete issues with file and line references
4. Suggest minimal, targeted fixes
5. Summarize overall health and top priorities

## Mandatory Checks (all reviews)
- Functional-programming compliance (pure functions, immutability)
- Function and file size limits
- Branching protocol compliance
- Task-first methodology (task ID referenced in PR)

## Deliverables
- Per-file findings with severity tags
- Top-3 priorities to fix first
- Suggested patches or refactor sketches
- Overall risk and quality summary

Execute the ${reviewType} code review.`;
  },
  whenToPick: [
    'You want a focused second-opinion pass over specific files before merge or release',
    'You can list the exact files or folders worth reviewing — scope matters',
    'You want the review framed by a specific lens (security, performance, FP compliance, etc.) rather than a generic "look at this"',
  ],
  whenNotToPick: [
    'You want the AI to fix the issues it finds — pair this with "Quick Fix" or "Brief a Specialist" after, this tool only produces findings',
    'You have no idea what files to point at — narrow your scope first or run an exploratory pass with "Brief a Specialist"',
  ],
  examples: [
    {
      label: 'Security review of auth code',
      description: 'A targeted security pass over a handful of files with explicit standards.',
      values: {
        reviewType: 'security',
        files: ['src/auth/login.ts', 'src/auth/session.ts', 'src/middleware/authMiddleware.ts'],
        standards: 'OWASP Top 10, internal auth checklist, must use parameterized queries and never log secrets',
      },
    },
    {
      label: 'Functional-programming compliance check',
      description: 'Comprehensive FP audit across a feature directory.',
      values: {
        reviewType: 'fp_compliance',
        files: ['src/features/checkout/'],
        standards: '',
      },
    },
  ],
  whatHappensNext: {
    summary: 'The AI surveys every file you listed, applies the checklist for the lens you chose, and produces per-file findings with severity tags + a prioritized fix list.',
    executionModel: 'single-shot',
    caveat: 'No code is modified. This tool produces a review report, not patches. Take the findings and re-paste the top ones into "Quick Fix" to actually apply changes.',
  },
};

const generateTests: ToolConfig = {
  id: 'generate-tests',
  label: 'Write Tests for My Code',
  description: 'Generate a structured test-writing playbook for one or more files — unit, integration, end-to-end, performance, or security.',
  category: 'tests',
  params: [
    {
      name: 'testType',
      label: 'What kind of tests?',
      description: 'Pick the test layer you need.',
      type: 'enum',
      required: true,
      enumOptions: [
        { value: 'unit', label: 'Unit — individual functions' },
        { value: 'integration', label: 'Integration — components working together' },
        { value: 'e2e', label: 'End-to-end — full user flows' },
        { value: 'performance', label: 'Performance — load and response time' },
        { value: 'security', label: 'Security — attack scenarios' },
      ],
      defaultValue: 'unit',
    },
    {
      name: 'targetFiles',
      label: 'Which files should be tested?',
      description: 'One path per line.',
      type: 'string-array',
      required: true,
      arrayItemLabel: 'file',
      placeholder: 'src/utils/parser.ts\nsrc/utils/formatter.ts',
    },
    {
      name: 'framework',
      label: 'Testing framework? (optional)',
      description: 'Leave blank to use a sensible default for the test type.',
      type: 'string',
      required: false,
      placeholder: 'vitest',
      helperText: 'Defaults: unit/integration → jest, e2e → cypress, performance → k6, security → owasp-zap.',
    },
    {
      name: 'coverage',
      label: 'Target coverage % (optional)',
      description: 'A number between 0 and 100. Defaults to 80 if blank.',
      type: 'string',
      required: false,
      placeholder: '80',
    },
  ],
  assemblePrompt: (params: ParamsRecord): string => {
    const testType = asString(params.testType) || 'unit';
    const targetFiles = asStringArray(params.targetFiles);
    const framework = asString(params.framework) || DEFAULT_FRAMEWORK[testType] || 'jest';
    const coverageRaw = asString(params.coverage);
    const targetCoverage = coverageRaw && !Number.isNaN(Number(coverageRaw)) ? Number(coverageRaw) : 80;
    const guidelines = TEST_GUIDELINES[testType] || TEST_GUIDELINES.unit;

    return `# Shadow Clone Test Generation Deployment

Creating ${testType} tests for specified code.

## Core Rules
${agentCoreRules}

## Test Generation Parameters
- Test Type: ${testType}
- Target Files: ${joinList(targetFiles)}
- Framework: ${framework}
- Target Coverage: ${targetCoverage}%

## Test Creation Guidelines
${guidelines}

## Quality Standards
- Tests must be deterministic and isolated
- Each test asserts one behavior
- Use descriptive test names that read like sentences
- Cover happy paths, edge cases, and failure modes
- Keep setup minimal and shared via fixtures
- Avoid testing implementation details — test behavior

## Deliverables
- Complete ${framework} test files for every target file
- Coverage report showing ≥ ${targetCoverage}% line coverage
- Notes on any untestable paths and why
- Suggested fixtures or test helpers

Generate comprehensive ${testType} tests for the target files.`;
  },
  whenToPick: [
    'You have code that works but no test coverage and want to backfill quickly',
    'You can name the specific files that need tests',
    'You know what test layer you need (unit vs integration vs end-to-end vs perf vs security)',
  ],
  whenNotToPick: [
    'You want the AI to also FIX the code while writing tests — use "Quick Fix" or "Brief a Specialist" instead',
    'You want a full test strategy across an entire codebase — that is a planning task',
  ],
  examples: [
    {
      label: 'Unit tests for utility helpers',
      description: 'Vitest unit tests for pure parser/formatter functions.',
      values: {
        testType: 'unit',
        targetFiles: ['src/utils/parser.ts', 'src/utils/formatter.ts'],
        framework: 'vitest',
        coverage: '85',
      },
    },
    {
      label: 'End-to-end tests for checkout flow',
      description: 'Cypress E2E tests against a real checkout flow.',
      values: {
        testType: 'e2e',
        targetFiles: ['src/features/checkout/'],
        framework: 'cypress',
        coverage: '',
      },
    },
  ],
  whatHappensNext: {
    summary: 'The AI writes test files using the framework you picked (or a sensible default), aiming for the coverage target you set. Output appears in the chat as ready-to-save test files.',
    executionModel: 'single-shot',
    caveat: 'Generated tests still need a human review pass — the AI cannot run them. Save the files, run them yourself, and feed back any failures to "Quick Fix" if real bugs surface.',
  },
};

export const tools: ToolConfig[] = [
  shadowClonePlan,
  deploySpecialistAgent,
  quickFix,
  codeReviewTeam,
  generateTests,
];

export const getToolById = (id: string): ToolConfig | undefined =>
  tools.find((t) => t.id === id);
