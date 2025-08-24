# Shadow Clone MCP Server - Command Reference Guide

## Quick Start Commands

### 1. Authentication (Required First)
```
Tool: authenticate
Parameters:
  - apiKey: Your Shadow Clone API key from dashboard.ignislabs.ai
  
Example: authenticate with apiKey "your-api-key-here"
```

### 2. Check for Updates
```
Tool: check_for_updates
Parameters: None

Example: check_for_updates
```

## Main Orchestration Commands

### 3. Full Project Orchestration
```
Tool: shadow_clone_orchestrate
Parameters:
  - mode: "plan" | "feature" | "debug" | "optimize" | "refactor" | "audit" | "research"
  - projectDescription: Detailed description of what you want to accomplish
  - projectPlan: (optional) Path to existing project plan file
  - wavesDirectory: (optional) Output directory (default: ./.waves/)
  - maxAgentsPerWave: (optional) Max agents per wave (default: 10, max: 20)

Examples:
  - Plan Mode: shadow_clone_orchestrate mode="plan" projectDescription="Build a React dashboard with real-time data"
  - Feature Mode: shadow_clone_orchestrate mode="feature" projectDescription="Add user authentication to existing app"
  - Debug Mode: shadow_clone_orchestrate mode="debug" projectDescription="Fix memory leak in data processing pipeline"
  - Optimize Mode: shadow_clone_orchestrate mode="optimize" projectDescription="Improve API response times by 50%"
```

### 4. Project Planning Only
```
Tool: shadow_clone_plan
Parameters:
  - projectVision: Your project idea, goals, and high-level requirements
  - wavesDirectory: (optional) Output directory (default: ./.waves/)

Example: shadow_clone_plan projectVision="Create a scalable e-commerce platform with microservices"
```

## Team Deployment Commands

### 5. Deploy Specialized Team
```
Tool: deploy_agent_team
Parameters:
  - teamType: "frontend" | "backend" | "database" | "testing" | "documentation" | "devops" | "mobile" | "security"
  - task: Specific task description for the team
  - outputDirectory: (optional) Where to place deliverables
  - teamSize: (optional) Number of agents (1-5)

Examples:
  - Frontend Team: deploy_agent_team teamType="frontend" task="Build responsive landing page with animations"
  - Backend Team: deploy_agent_team teamType="backend" task="Create RESTful API with JWT authentication"
  - Testing Team: deploy_agent_team teamType="testing" task="Write comprehensive test suite for payment module"
```

### 6. Deploy Single Specialist
```
Tool: deploy_specialist_agent
Parameters:
  - specialization: "react_expert" | "api_designer" | "database_architect" | "test_engineer" | 
                    "performance_analyst" | "security_auditor" | "code_reviewer" | "documentation_writer"
  - task: Specific task for the agent
  - context: (optional) Additional context (file paths, requirements)
  - deliverables: (optional) Array of expected outputs

Examples:
  - React Expert: deploy_specialist_agent specialization="react_expert" task="Optimize component rendering performance"
  - API Designer: deploy_specialist_agent specialization="api_designer" task="Design GraphQL schema for social media app"
  - Security Auditor: deploy_specialist_agent specialization="security_auditor" task="Audit authentication flow for vulnerabilities"
```

## Rapid Development Commands

### 7. Quick Fix
```
Tool: quick_fix
Parameters:
  - issueType: "bug" | "style" | "logic" | "performance" | "security"
  - description: Issue description
  - filePath: (optional) Affected file(s)
  - urgency: (optional) "low" | "medium" | "high" | "critical"

Examples:
  - Bug Fix: quick_fix issueType="bug" description="Null pointer exception in user service" filePath="src/services/userService.js"
  - Performance: quick_fix issueType="performance" description="Database queries taking >5 seconds" urgency="high"
```

### 8. Code Review Team
```
Tool: code_review_team
Parameters:
  - reviewType: "security" | "performance" | "quality" | "architecture" | "comprehensive"
  - files: Array of files or directories to review
  - standards: (optional) Specific standards to check against

Examples:
  - Security Review: code_review_team reviewType="security" files=["src/auth/", "src/api/"]
  - Comprehensive: code_review_team reviewType="comprehensive" files=["src/"] standards="OWASP guidelines"
```

### 9. Generate Tests
```
Tool: generate_tests
Parameters:
  - testType: "unit" | "integration" | "e2e" | "performance" | "security"
  - targetFiles: Array of files to test
  - framework: (optional) Testing framework to use
  - coverage: (optional) Target coverage percentage (0-100)

Examples:
  - Unit Tests: generate_tests testType="unit" targetFiles=["src/utils/validation.js"] framework="jest" coverage=90
  - E2E Tests: generate_tests testType="e2e" targetFiles=["src/features/checkout/"] framework="cypress"
```

## Wave Management Commands

### 10. Execute Single Wave
```
Tool: execute_single_wave
Parameters:
  - waveType: "research" | "planning" | "implementation" | "testing" | "documentation" | "review"
  - scope: What to focus on
  - inputs: (optional) Array of required input files or data
  - maxAgents: (optional) Number of agents to deploy (1-10)

Examples:
  - Research Wave: execute_single_wave waveType="research" scope="Best practices for microservices authentication"
  - Implementation: execute_single_wave waveType="implementation" scope="User dashboard features" maxAgents=5
```

## Documentation Commands

### 11. Create Documentation
```
Tool: create_documentation
Parameters:
  - docType: "api" | "user_guide" | "developer" | "architecture" | "inline"
  - scope: What to document
  - format: (optional) "markdown" | "html" | "openapi" | "jsdoc"
  - audience: (optional) "developers" | "users" | "architects" | "general"

Examples:
  - API Docs: create_documentation docType="api" scope="REST endpoints" format="openapi"
  - User Guide: create_documentation docType="user_guide" scope="Admin panel features" audience="users"
```

## Architecture Commands

### 12. Architecture Consultation
```
Tool: architecture_consultant
Parameters:
  - consultationType: "design_review" | "pattern_recommendation" | "scalability_analysis" | "migration_planning"
  - context: Current system description
  - constraints: (optional) Any limitations or requirements
  - goals: (optional) Array of specific goals to achieve

Examples:
  - Design Review: architecture_consultant consultationType="design_review" context="Monolithic Node.js app with 100K users"
  - Migration Plan: architecture_consultant consultationType="migration_planning" context="Legacy PHP to modern microservices"
```

## Template Commands

### 13. Get Agent Template
```
Tool: get_agent_template
Parameters:
  - templateType: "core_rules" | "agent_template" | "team_templates"

Examples:
  - Core Rules: get_agent_template templateType="core_rules"
  - Agent Template: get_agent_template templateType="agent_template"
  - Team Templates: get_agent_template templateType="team_templates"
```

## Smaller Modular Functions (No Full Orchestration)

These are lightweight tools for quick, focused tasks without deploying full agent teams:

### Quick Single-Purpose Tools

#### quick_fix - Rapid Problem Resolution
- **Best for**: Single bugs, small issues, quick patches
- **No orchestration needed**: Just the fix methodology
- **Example**: `quick_fix issueType="bug" description="Fix null check in login"`

#### deploy_specialist_agent - Single Expert
- **Best for**: Focused tasks needing specific expertise
- **No team coordination**: One specialist, one task
- **Example**: `deploy_specialist_agent specialization="react_expert" task="Optimize render performance"`

#### get_agent_template - Learn the Patterns
- **Best for**: Understanding methodologies without execution
- **Just templates**: View the patterns and approaches
- **Example**: `get_agent_template templateType="agent_template"`

#### show_commands - Quick Reference
- **Best for**: Refreshing memory on available tools
- **Instant help**: No execution, just documentation
- **Example**: `show_commands category="rapid"`

### Focused Review & Analysis Tools

#### code_review_team - Targeted Review
- **Best for**: Quick code quality checks
- **Focused scope**: Review specific files/areas
- **Example**: `code_review_team reviewType="security" files=["login.js"]`

#### architecture_consultant - Design Advice
- **Best for**: Architecture decisions and reviews
- **Advisory only**: Get recommendations without implementation
- **Example**: `architecture_consultant consultationType="pattern_recommendation" context="REST vs GraphQL"`

### Documentation & Test Tools

#### create_documentation - Doc Generation
- **Best for**: Creating docs for existing code
- **Single output**: Just the documentation
- **Example**: `create_documentation docType="api" scope="user endpoints"`

#### generate_tests - Test Creation
- **Best for**: Adding tests to existing code
- **Targeted testing**: Specific files, specific types
- **Example**: `generate_tests testType="unit" targetFiles=["utils.js"]`

### Single Wave Execution

#### execute_single_wave - One Phase Only
- **Best for**: Just research, or just planning, or just implementation
- **No multi-wave orchestration**: One focused phase
- **Example**: `execute_single_wave waveType="research" scope="Best auth practices"`

## When to Use What

### Use Smaller Tools When:
- ✅ You have a specific, focused task
- ✅ You know exactly what needs to be done
- ✅ You want quick methodology for one thing
- ✅ You're doing incremental improvements
- ✅ You need analysis/review without changes

### Use Full Orchestration When:
- 📋 Building new features from scratch
- 📋 Major refactoring projects
- 📋 Complex debugging requiring multiple approaches
- 📋 Full project planning and implementation
- 📋 Need coordinated multi-agent teams

## Common Workflows

### Starting a New Project
1. `authenticate` with your API key
2. `shadow_clone_plan` to create comprehensive project plan
3. `shadow_clone_orchestrate mode="feature"` to build the features
4. `deploy_agent_team teamType="testing"` to create tests
5. `create_documentation` to generate docs

### Fixing Bugs
1. `quick_fix issueType="bug"` for rapid resolution
2. `deploy_specialist_agent specialization="test_engineer"` to add test coverage
3. `code_review_team reviewType="quality"` to ensure fix quality

### Optimizing Performance
1. `shadow_clone_orchestrate mode="optimize"` for comprehensive optimization
2. `deploy_specialist_agent specialization="performance_analyst"` for specific bottlenecks
3. `generate_tests testType="performance"` to validate improvements

### Security Audit
1. `shadow_clone_orchestrate mode="audit"` for full security review
2. `code_review_team reviewType="security"` for focused security check
3. `deploy_agent_team teamType="security"` for remediation

## Pro Tips

1. **Always authenticate first** - All tools except `authenticate` and `check_for_updates` require authentication
2. **Use plan mode first** - For complex projects, always start with `shadow_clone_plan`
3. **Leverage specialists** - For focused tasks, single specialists are more efficient than full teams
4. **Wave isolation** - Each wave works in its own directory (.waves/wave-N/)
5. **Combine tools** - Use multiple tools in sequence for comprehensive solutions

## Output Structure

All Shadow Clone operations create outputs in the `.waves/` directory:

```
.waves/
├── wave-0/           # Planning wave
│   ├── deliverables/
│   ├── rk-operations/
│   └── WAVE_STATUS.md
├── wave-1/           # Implementation wave
│   ├── src/
│   ├── deliverables/
│   └── WAVE_STATUS.md
└── wave-2/           # Testing/Documentation wave
    ├── tests/
    ├── deliverables/
    └── WAVE_STATUS.md
```

## Remember

- These tools return **prompt engineering macros** - instructions for the AI to follow
- The AI executes the instructions, not the MCP server
- This is a macro system that "unlocks new powers" for any AI
- Think of it as teaching the AI professional methodologies