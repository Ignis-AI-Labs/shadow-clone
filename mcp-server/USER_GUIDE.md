# Shadow Clone MCP Server User Guide

## Overview

The Shadow Clone MCP Server enables you to deploy teams of specialized AI agents directly from Claude conversations. This guide explains how to use each tool effectively.

## Prerequisites

- Valid Shadow Clone NFT license from [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
- Claude Desktop with MCP support
- Installed Shadow Clone MCP server

## Getting Started

### Step 1: Authentication

Before using any Shadow Clone tools, you must authenticate with your API key.

```
Tool: authenticate
Parameters:
  - apiKey: Your Shadow Clone API key from the dashboard

Example:
authenticate(apiKey: "sc--your-api-key-here")
```

Once authenticated, all Shadow Clone tools become available for 24 hours.

## Available Tools

### 1. shadow_clone_orchestrate

**Purpose**: Execute full Shadow Clone deployments with complete wave-based orchestration.

**When to use**:
- Building new features from scratch
- Debugging complex issues across multiple files
- Refactoring entire codebases
- Optimizing system-wide performance
- Conducting security audits
- Researching implementation approaches

**Parameters**:
- `mode` (required): Execution mode
  - `feature` - Build new functionality
  - `debug` - Fix bugs systematically
  - `refactor` - Improve code quality
  - `optimize` - Enhance performance
  - `audit` - Security assessment
  - `research` - Analyze without changes
- `projectDescription` (required): Detailed description of what you want to accomplish
- `projectPlan` (optional): Path to existing project plan file
- `wavesDirectory` (optional): Output directory (default: `./.waves/`)
- `maxAgentsPerWave` (optional): Agent limit per wave (default: 10)

**Example Usage**:

```
shadow_clone_orchestrate(
  mode: "feature",
  projectDescription: "Build a real-time chat application with WebSocket support, user authentication, and message history. Use React for frontend and Node.js/Express for backend.",
  wavesDirectory: "./.waves/",
  maxAgentsPerWave: 10
)
```

**What happens**:
1. Shadow Clone analyzes your project description
2. Deploys Record Keeper to coordinate execution
3. Creates waves of specialized agents (Frontend team, Backend team, etc.)
4. Each wave builds on previous work
5. Produces working code, tests, and documentation
6. Single atomic commit at completion

### 2. shadow_clone_plan

**Purpose**: Create comprehensive project plans without writing any code.

**When to use**:
- Starting a new project and need architecture design
- Evaluating technical approaches before implementation
- Creating detailed roadmaps for complex features
- Documenting system redesigns before execution

**Parameters**:
- `projectVision` (required): Your project idea, goals, and high-level requirements
- `wavesDirectory` (optional): Output directory for planning documents (default: `./.waves/`)

**Example Usage**:

```
shadow_clone_plan(
  projectVision: "Create a machine learning pipeline for sentiment analysis of customer reviews. Should handle data ingestion from multiple sources, preprocessing, model training with multiple algorithms, and real-time inference API.",
  wavesDirectory: "./.waves/"
)
```

**What happens**:
1. Wave 0: Foundation team analyzes requirements and constraints
2. Wave 1: Research team investigates best practices and technologies
3. Wave 2: Planning team creates comprehensive MASTER_PLAN.md
4. No code is written - only documentation
5. Produces actionable blueprint for implementation

**Deliverables**:
- `PROJECT_FOUNDATION.md` - Requirements and initial assessment
- `TECHNICAL_RESEARCH.md` - Technology evaluation and best practices
- `MASTER_PLAN.md` - Complete implementation blueprint

### 3. get_agent_template

**Purpose**: Access agent behavior templates to understand how Shadow Clone agents work.

**When to use**:
- Learning about Shadow Clone agent capabilities
- Understanding agent specializations
- Reviewing team coordination patterns

**Parameters**:
- `templateType` (required): Type of template to retrieve
  - `core_rules` - Fundamental agent behavior rules
  - `agent_template` - Individual agent role templates
  - `team_templates` - Team composition and coordination

**Example Usage**:

```
get_agent_template(templateType: "core_rules")
```

**Returns**: Complete template documentation for the requested type.

## Execution Modes Explained

### Feature Mode
- **Purpose**: Build new functionality from scratch
- **Teams**: Frontend, Backend, Database, API, Testing specialists
- **Output**: Working code, tests, documentation

### Debug Mode
- **Purpose**: Fix bugs with root cause analysis
- **Teams**: Debuggers, Testers, Code Analysts
- **Output**: Fixed code, regression tests, root cause report

### Refactor Mode
- **Purpose**: Improve code quality without changing functionality
- **Teams**: Refactoring specialists, Test maintainers
- **Output**: Cleaned code, migration guide, updated tests

### Optimize Mode
- **Purpose**: Enhance performance and efficiency
- **Teams**: Performance analysts, Optimization engineers
- **Output**: Optimized code, benchmarks, performance report

### Audit Mode
- **Purpose**: Security and compliance assessment
- **Teams**: Security auditors, Compliance checkers
- **Output**: Security report, vulnerability fixes, compliance matrix

### Research Mode
- **Purpose**: Analyze codebases without making changes
- **Teams**: Code researchers, Documentation analysts
- **Output**: Research findings, recommendations, insights

## Best Practices

### 1. Provide Clear Descriptions
The more detailed your project description, the better the results:
- Specify technologies you want to use
- Include any constraints or requirements
- Mention integration points
- Define success criteria

### 2. Use Planning Mode First
For complex projects:
1. Start with `shadow_clone_plan` to create blueprint
2. Review the MASTER_PLAN.md
3. Use `shadow_clone_orchestrate` with mode="feature" to implement

### 3. Choose the Right Mode
- **New features**: Use `feature` mode
- **Fixing bugs**: Use `debug` mode
- **Code cleanup**: Use `refactor` mode
- **Speed issues**: Use `optimize` mode
- **Security concerns**: Use `audit` mode
- **Understanding code**: Use `research` mode

### 4. Wave Directory Management
- Each execution creates a new `.waves/` directory
- Previous waves are archived automatically
- Review wave outputs in sequential order
- Check WAVE_COMPLETE.md for summaries

## Understanding Wave Execution

Shadow Clone works in waves, with each wave building on previous work:

1. **Wave 0**: Planning and setup (mandatory)
2. **Wave 1+**: Implementation waves based on complexity
3. **Record Keeper**: Coordinates all waves and maintains context

Each wave includes:
- Pre-wave planning by Record Keeper
- Parallel agent deployment (up to 10 per wave)
- Post-wave consolidation and documentation

## Troubleshooting

### "Authentication Required" on tools
- Run the `authenticate` tool with your API key
- Check if your license is active at dashboard.ignislabs.ai

### No output appearing
- Check the `wavesDirectory` parameter path
- Ensure you have write permissions
- Look for `.waves/` in your current directory

### Agents not completing tasks
- Provide more specific project descriptions
- Check if the mode matches your intent
- Review any error messages in wave directories

## Examples by Use Case

### Building a REST API
```
shadow_clone_orchestrate(
  mode: "feature",
  projectDescription: "Create a RESTful API for a todo application with CRUD operations, user authentication using JWT, PostgreSQL database, input validation, and comprehensive error handling."
)
```

### Fixing Performance Issues
```
shadow_clone_orchestrate(
  mode: "optimize",
  projectDescription: "Our React application is slow to render large lists. Optimize the product catalog page that displays 1000+ items. Focus on virtualization, memoization, and reducing unnecessary re-renders."
)
```

### Security Audit
```
shadow_clone_orchestrate(
  mode: "audit",
  projectDescription: "Perform security audit on our Express.js API. Check for SQL injection, XSS vulnerabilities, authentication bypasses, and ensure OWASP top 10 compliance."
)
```

### Planning a Microservice
```
shadow_clone_plan(
  projectVision: "Design a microservices architecture for our e-commerce platform. Need services for user management, product catalog, cart/checkout, payment processing, and order fulfillment. Include API gateway, service discovery, and monitoring strategy."
)
```

---

## Need Help?

- **Documentation**: [docs.shadowclone.ai](https://docs.shadowclone.ai)
- **Support**: Contact through [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
- **License Management**: [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)