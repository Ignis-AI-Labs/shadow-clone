# Shadow Clone MCP Server - Complete Tool Documentation

## Table of Contents
1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Authentication](#authentication)
4. [Tool Categories](#tool-categories)
5. [Detailed Tool Documentation](#detailed-tool-documentation)
6. [Advanced Usage Patterns](#advanced-usage-patterns)
7. [Best Practices](#best-practices)

## Overview

The Shadow Clone MCP Server provides AI assistants with sophisticated orchestration instructions through the Model Context Protocol. Rather than executing code directly, each tool returns comprehensive methodologies, templates, and patterns that guide AI assistants in completing complex software engineering tasks.

## Core Concepts

### Instruction-Based Architecture
- Tools return **instructions**, not execute actions
- AI assistants interpret and execute these instructions
- All outputs are created in `.waves/` directory
- Internal prompts in `.shadow/` are never exposed

### Wave-Based Execution
Shadow Clone uses a wave system where tasks are completed in synchronized phases:
1. **Research Wave**: Understanding requirements and context
2. **Planning Wave**: Architecture and design decisions
3. **Implementation Wave**: Code creation
4. **Testing Wave**: Quality assurance
5. **Documentation Wave**: User and developer docs
6. **Review Wave**: Final quality checks

### Agent Roles
Each agent has specialized expertise:
- **Architects**: System design and patterns
- **Developers**: Implementation specialists
- **Testers**: Quality assurance experts
- **Reviewers**: Code quality and standards
- **Documenters**: Technical writing specialists

## Authentication

### authenticate
Establishes connection with Shadow Clone API and verifies NFT ownership.

**Parameters:**
- `apiKey` (required): Your Shadow Clone API key from dashboard.ignislabs.ai

**Returns:**
- Success status
- License type (Elite, Pioneer, Builder, Reserve)
- Wallet address associated with NFT

**Real-time Verification:**
- NFT ownership is checked before each tool execution
- Access is immediately revoked if NFT is transferred
- 1-minute cache to reduce API calls
- Graceful fallback during network issues

**Example:**
```javascript
{
  "tool": "authenticate",
  "arguments": {
    "apiKey": "sk-shadow-xxxxxxxxxxxxx"
  }
}
```

## Tool Categories

### 1. Core Tools
- `authenticate` - API key authentication
- `check_for_updates` - Version checking

### 2. Orchestration Tools
- `shadow_clone_orchestrate` - Full system orchestration
- `shadow_clone_plan` - Planning-only mode

### 3. Team Tools
- `deploy_agent_team` - Multi-agent teams
- `deploy_specialist_agent` - Single expert agents

### 4. Specialized Tools
- `quick_fix` - Rapid problem solving
- `code_review_team` - Code analysis
- `generate_tests` - Test creation
- `create_documentation` - Documentation generation
- `architecture_consultant` - Design guidance

### 5. Utility Tools
- `execute_single_wave` - Single phase execution
- `get_agent_template` - Access templates

## Detailed Tool Documentation

### shadow_clone_orchestrate

The main orchestration system that coordinates entire project execution.

**Parameters:**
- `mode` (required): Execution mode
  - `plan`: Create project plans only
  - `feature`: Build new features
  - `debug`: Fix bugs and issues
  - `optimize`: Performance improvements
  - `refactor`: Code restructuring
  - `audit`: Security and quality audit
  - `research`: Technical research
- `projectDescription` (required): Detailed description of the task
- `projectPlan` (optional): Path to existing plan file
- `wavesDirectory` (optional): Output directory (default: `./.waves/`)
- `maxAgentsPerWave` (optional): Agent limit per wave (1-20, default: 10)

**Returns:**
Complete orchestration instructions including:
- Team composition for each wave
- Agent role assignments
- Wave execution order
- Coordination protocols
- Quality gates
- Deliverable specifications

**Mode-Specific Behaviors:**

#### Feature Mode
- Focuses on building new functionality
- Emphasizes clean architecture
- Includes comprehensive testing
- Full documentation

#### Debug Mode
- Systematic issue identification
- Root cause analysis
- Fix implementation
- Regression prevention

#### Optimize Mode
- Performance profiling
- Bottleneck identification
- Optimization strategies
- Benchmark validation

#### Refactor Mode
- Code quality analysis
- Pattern identification
- Incremental improvements
- Backward compatibility

### deploy_agent_team

Deploys a specialized team for focused tasks.

**Parameters:**
- `teamType` (required): Team specialization
  - `frontend`: UI/UX implementation
  - `backend`: Server and API development
  - `database`: Data modeling and optimization
  - `testing`: QA and test automation
  - `documentation`: Technical writing
  - `devops`: Infrastructure and deployment
  - `mobile`: Mobile app development
  - `security`: Security implementation
- `task` (required): Specific task description
- `outputDirectory` (optional): Deliverable location
- `teamSize` (optional): Number of agents (1-5)

**Team Compositions:**

#### Frontend Team
- Lead UI Architect
- React/Vue/Angular Specialist
- CSS/Animation Expert
- Accessibility Specialist
- Performance Optimizer

#### Backend Team
- System Architect
- API Designer
- Database Expert
- Security Specialist
- Performance Engineer

### deploy_specialist_agent

Deploys a single expert for specialized tasks.

**Specializations:**
- `react_expert`: React.js specialist
- `api_designer`: RESTful/GraphQL API design
- `database_architect`: Data modeling expert
- `test_engineer`: Testing methodology expert
- `performance_analyst`: Performance optimization
- `security_auditor`: Security analysis
- `code_reviewer`: Code quality expert
- `documentation_writer`: Technical writing

**Parameters:**
- `specialization` (required): Agent expertise area
- `task` (required): Specific task
- `context` (optional): Additional context
- `deliverables` (optional): Expected outputs array

### quick_fix

Rapid problem-solving methodology for urgent issues.

**Issue Types:**
- `bug`: Code defects
- `style`: Formatting issues
- `logic`: Business logic errors
- `performance`: Speed issues
- `security`: Vulnerabilities

**Urgency Levels:**
- `critical`: Production down
- `high`: Major feature broken
- `medium`: Important but not blocking
- `low`: Minor issues

### code_review_team

Comprehensive code analysis by specialized review team.

**Review Types:**
- `security`: Vulnerability assessment
- `performance`: Efficiency analysis
- `quality`: Code standards
- `architecture`: Design patterns
- `comprehensive`: All aspects

**Review Process:**
1. Static analysis
2. Pattern detection
3. Security scanning
4. Performance profiling
5. Documentation review
6. Test coverage analysis

### generate_tests

Test creation with various strategies.

**Test Types:**
- `unit`: Component-level tests
- `integration`: System integration
- `e2e`: End-to-end scenarios
- `performance`: Load testing
- `security`: Security testing

**Coverage Strategies:**
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

### create_documentation

Documentation generation for different audiences.

**Documentation Types:**
- `api`: API references
- `user_guide`: End-user documentation
- `developer`: Developer guides
- `architecture`: System design docs
- `inline`: Code comments

**Formats:**
- `markdown`: GitHub-compatible
- `html`: Web documentation
- `openapi`: API specifications
- `jsdoc`: JavaScript documentation

### architecture_consultant

Expert architectural guidance.

**Consultation Types:**
- `design_review`: Architecture assessment
- `pattern_recommendation`: Best practices
- `scalability_analysis`: Growth planning
- `migration_planning`: System transitions

## Advanced Usage Patterns

### Chaining Tools
```javascript
// 1. Plan the project
shadow_clone_plan({ projectVision: "E-commerce platform" })

// 2. Build core features
shadow_clone_orchestrate({ 
  mode: "feature", 
  projectDescription: "User authentication system",
  projectPlan: "./waves/project-plan.md"
})

// 3. Add specific components
deploy_agent_team({
  teamType: "frontend",
  task: "Build checkout flow UI"
})

// 4. Ensure quality
code_review_team({
  reviewType: "comprehensive",
  files: ["./waves/src"]
})
```

### Iterative Development
```javascript
// Initial implementation
execute_single_wave({
  waveType: "implementation",
  scope: "Core API endpoints"
})

// Test creation
generate_tests({
  testType: "unit",
  targetFiles: ["./waves/src/api"]
})

// Performance optimization
deploy_specialist_agent({
  specialization: "performance_analyst",
  task: "Optimize database queries"
})
```

### Crisis Management
```javascript
// Production issue
quick_fix({
  issueType: "bug",
  description: "Payment processing failing",
  urgency: "critical"
})

// Security incident
deploy_specialist_agent({
  specialization: "security_auditor",
  task: "Investigate potential data breach"
})
```

## Best Practices

### 1. Start with Planning
Always begin with `shadow_clone_plan` for complex projects to establish clear architecture.

### 2. Use Appropriate Modes
- `feature` for new functionality
- `debug` for fixing issues
- `optimize` for performance
- `refactor` for code quality

### 3. Leverage Specialists
Deploy specialist agents for focused expertise rather than full teams for specific tasks.

### 4. Iterative Approach
Use `execute_single_wave` for incremental development and testing.

### 5. Regular Reviews
Incorporate `code_review_team` at key milestones to maintain quality.

### 6. Documentation First
Use `create_documentation` early to establish clear specifications.

### 7. Security by Design
Include security reviews throughout development, not just at the end.

## Error Handling

### Common Errors
1. **Not Authenticated**: Run authenticate tool first
2. **NFT Not Found**: Ensure NFT is in connected wallet
3. **Invalid Mode**: Check supported modes for orchestration
4. **Missing Parameters**: Verify required parameters

### Troubleshooting
1. Check authentication status
2. Verify parameter formatting
3. Ensure output directory exists
4. Review error messages for specific guidance

## Performance Considerations

### Caching
- NFT verification cached for 1 minute
- Template content cached in memory
- Reduced API calls for better performance

### Resource Usage
- Large projects may generate substantial instructions
- Consider breaking into smaller tasks
- Use wave limiting for resource control

## Security Notes

- API keys stored securely in home directory
- Real-time NFT verification ensures access control
- No sensitive data in logs
- Instructions sanitized for safety