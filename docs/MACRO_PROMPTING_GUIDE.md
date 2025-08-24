# Shadow Clone Macro Prompting Guide

## Transform Any AI CLI into a Power Tool

Shadow Clone can be used as a universal macro prompting system for any AI assistant, not just Claude. This guide shows how to inject Shadow Clone's advanced prompt engineering into any AI CLI or chat interface.

## Overview

Instead of API calls, Shadow Clone becomes a prompt injection tool that:
- Provides structured methodologies to AI assistants
- Enhances AI responses with expert patterns
- Works with any AI that accepts text input
- Requires no special integration

## Core Macro Commands

### /shadow-clone-orchestrate
Injects full orchestration methodology into your AI conversation.

**Usage:**
```
/shadow-clone-orchestrate --mode feature --project "Build a task management API"
```

**Injected Prompt Structure:**
```
I need you to act as a Shadow Clone orchestration system. You will coordinate multiple specialized AI agents to complete this task. 

Mode: [feature/debug/optimize/refactor/audit/research]
Project: [description]

Follow this wave-based execution:
1. Research Wave: Analyze requirements
2. Planning Wave: Design architecture  
3. Implementation Wave: Build features
4. Testing Wave: Ensure quality
5. Documentation Wave: Create guides
6. Review Wave: Final checks

[Full methodology injected...]
```

### /shadow-team
Deploys a specialized team simulation.

**Usage:**
```
/shadow-team --type frontend --task "Create responsive dashboard"
```

**Team Types:**
- frontend: UI/UX specialists
- backend: Server experts
- database: Data architects
- testing: QA engineers
- security: Security experts
- devops: Infrastructure team

### /shadow-expert
Summons a single expert persona.

**Usage:**
```
/shadow-expert --role "react_expert" --task "Optimize component rendering"
```

**Expert Roles:**
- react_expert: React.js master
- api_designer: API architect
- database_architect: Data modeling expert
- test_engineer: Testing specialist
- security_auditor: Security expert
- performance_analyst: Optimization specialist

### /shadow-fix
Rapid problem-solving mode.

**Usage:**
```
/shadow-fix --issue "API returning 500 errors" --type bug --urgency high
```

### /shadow-review
Code review methodology.

**Usage:**
```
/shadow-review --type security --files "src/api/auth.js"
```

## Prompt Templates

### Master Orchestration Template
```markdown
# Shadow Clone Orchestration Protocol

You are coordinating a team of specialized AI agents. Each agent is a master in their domain with no weak links.

## Execution Framework

### Wave 1: Research & Analysis
- Requirement Analysis Agent: Deep dive into project needs
- Technology Scout: Identify best tools and patterns
- Risk Assessor: Spot potential challenges

### Wave 2: Architecture & Planning  
- System Architect: Design overall structure
- Database Designer: Model data relationships
- API Architect: Define service interfaces

### Wave 3: Implementation
- [Specialized developers based on tech stack]
- Each agent owns their module completely
- Parallel execution where possible

### Wave 4: Quality Assurance
- Test Engineer: Comprehensive test coverage
- Security Auditor: Vulnerability scanning
- Performance Analyst: Optimization opportunities

### Wave 5: Documentation
- Technical Writer: Developer guides
- API Documenter: Endpoint references
- User Guide Author: End-user documentation

### Wave 6: Final Review
- Code Reviewer: Standards compliance
- Integration Tester: System coherence
- Deployment Specialist: Production readiness

## Agent Coordination Rules
1. Agents work in parallel within waves
2. Clear handoffs between waves
3. No agent proceeds without prerequisites
4. Quality gates between waves
5. Continuous integration of work

## Output Structure
All deliverables go to .waves/ directory:
.waves/
├── architecture/
├── src/
├── tests/
├── docs/
└── reviews/
```

### Expert Agent Template
```markdown
# Shadow Clone Expert: [Specialization]

You are a world-class [specialization] with deep expertise in:
- [Core competency 1]
- [Core competency 2]
- [Core competency 3]

## Your Approach
1. Analyze the problem thoroughly
2. Consider multiple solutions
3. Choose optimal approach
4. Implement with best practices
5. Validate solution quality

## Quality Standards
- Code must be production-ready
- Follow industry best practices
- Include error handling
- Add appropriate comments
- Consider edge cases

## Deliverables
- Working implementation
- Technical explanation
- Usage examples
- Performance considerations
```

## Integration Examples

### With Claude CLI
```bash
# Inject orchestration prompt
claude "$(cat <<EOF
/shadow-clone-orchestrate --mode feature --project "Build REST API for blog platform with authentication, posts, comments, and user roles"
EOF
)"
```

### With GPT CLI
```bash
# Using OpenAI's CLI
openai api chat.completions.create -m gpt-4 -M "$(shadow-clone-prompt orchestrate --mode optimize)"
```

### With Any AI Chat
Simply paste the macro command at the start of your conversation:
```
/shadow-clone-orchestrate --mode debug --project "Fix memory leak in React application"

[Your specific question or task...]
```

## Advanced Patterns

### Sequential Orchestration
```bash
# Plan first
/shadow-clone-orchestrate --mode plan --project "E-commerce platform"

# Then implement features
/shadow-clone-orchestrate --mode feature --project "User authentication system" --plan "./waves/ecommerce-plan.md"

# Add specific components
/shadow-team --type frontend --task "Shopping cart UI"

# Review everything
/shadow-review --type comprehensive --files "./waves/src"
```

### Parallel Team Deployment
```bash
# Deploy multiple teams simultaneously
/shadow-team --type frontend --task "Build UI" &
/shadow-team --type backend --task "Create APIs" &
/shadow-team --type database --task "Design schema" &
```

### Expert Consultation Chain
```bash
# Architecture first
/shadow-expert --role architect --task "Design microservices structure"

# Then implementation experts
/shadow-expert --role api_designer --task "Design service interfaces"
/shadow-expert --role database_architect --task "Design data models"
```

## Custom Macro Creation

### Basic Structure
```javascript
const macroTemplate = {
  name: "/shadow-[function]",
  description: "Purpose of this macro",
  parameters: {
    required: ["param1", "param2"],
    optional: ["param3", "param4"]
  },
  prompt: `
    [Your custom prompt template]
    Parameters: {param1}, {param2}
    Optional: {param3}, {param4}
  `
};
```

### Example: Custom Debug Macro
```javascript
const shadowDebugMacro = {
  name: "/shadow-debug-api",
  description: "Debug API issues systematically",
  parameters: {
    required: ["endpoint", "error"],
    optional: ["logs", "headers"]
  },
  prompt: `
    Act as a Shadow Clone API Debugging Specialist.
    
    Endpoint: {endpoint}
    Error: {error}
    
    Follow this systematic approach:
    1. Analyze error patterns
    2. Check common causes
    3. Verify request/response cycle
    4. Test edge cases
    5. Propose solutions
    
    Include:
    - Root cause analysis
    - Step-by-step fix
    - Prevention strategies
  `
};
```

## VSCode Extension Transformation

The Shadow Clone VSCode extension will be transformed to:

### 1. Macro Command Palette
- Quick access to all Shadow Clone macros
- Parameter input UI
- Prompt preview before injection

### 2. Prompt Library
- Saved prompt templates
- Custom macro creation
- Team sharing capabilities

### 3. AI CLI Integration
- Direct injection into:
  - Claude Desktop
  - GitHub Copilot Chat
  - Continue.dev
  - Cursor
  - Any AI-powered editor

### 4. Features
- Keyboard shortcuts for common macros
- Context-aware prompt suggestions
- Parameter autocomplete
- Output formatting helpers

## Benefits

### For Developers
- Consistent high-quality AI responses
- Reduced prompt engineering effort
- Reusable methodologies
- Team standardization

### For Teams
- Shared prompt libraries
- Consistent approaches
- Knowledge preservation
- Onboarding acceleration

### For Projects
- Faster development
- Higher code quality
- Better documentation
- Systematic debugging

## Best Practices

### 1. Start Simple
Begin with basic macros and expand as needed.

### 2. Customize for Your Stack
Modify templates for your specific technologies.

### 3. Build a Library
Save successful prompts for reuse.

### 4. Share with Team
Create team-specific macro sets.

### 5. Iterate and Improve
Refine prompts based on results.

## Troubleshooting

### Macro Not Working
1. Check parameter format
2. Verify AI understands the prompt
3. Simplify complex instructions
4. Break into smaller steps

### Inconsistent Results
1. Add more specific constraints
2. Include examples in prompt
3. Define clear success criteria
4. Use step-by-step instructions

### AI Ignoring Instructions
1. Place macro at conversation start
2. Use clear formatting
3. Avoid conflicting instructions
4. Reinforce key requirements

## Future Enhancements

### Planned Features
1. Browser extension for web-based AI chats
2. API for programmatic prompt injection  
3. Prompt marketplace for sharing
4. Analytics for prompt effectiveness
5. Multi-language support

### Community Contributions
- Submit your macros to the library
- Share optimization techniques
- Report compatibility issues
- Suggest new macro types

## Getting Started

1. Choose your AI platform
2. Select appropriate macro
3. Customize parameters
4. Inject into conversation
5. Guide AI through execution

Shadow Clone transforms any AI into a sophisticated development team, bringing enterprise-level methodologies to every developer.