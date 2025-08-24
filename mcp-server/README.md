# Shadow Clone MCP Server - Prompt Engineering Macro System

**Unlock new powers for AI through advanced prompt engineering.** This system delivers sophisticated, structured instructions that transform any AI assistant into a specialized team of virtual agents.

## Overview

Shadow Clone is a **prompt engineering macro system** that provides AI assistants with advanced methodologies, templates, and orchestration patterns. Rather than executing code directly, it delivers carefully crafted instructions that guide AI assistants through complex software development workflows.

**Think of it as:** Programming your AI with expert-level capabilities through structured prompt engineering.

**Works with:** Any AI CLI, chat interface, or system that supports the Model Context Protocol (MCP).

## Requirements

- **Node.js**: v18 or higher
- **Shadow Clone License**: Active NFT license from [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
- **Claude Desktop**: Latest version with MCP support

## Installation

### Option 1: NPM (Recommended)
```bash
npm install -g @shadow-clone/mcp-server
```

### Option 2: From Source (Internal Only)
```bash
# Clone from internal repository
cd mcp-server
npm install
npm run build
npm link
```

## Configuration

Add the Shadow Clone MCP server to your Claude Desktop configuration:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "shadow-clone": {
      "command": "shadow-clone-mcp",
      "env": {
        "SHADOW_CLONE_API_ENDPOINT": "https://api.ignislabs.ai"
      }
    }
  }
}
```

## Authentication

When you first use Shadow Clone tools in Claude, you'll need to authenticate:

1. Use the `authenticate` tool
2. Provide your API key from [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
3. Authentication persists as long as you own the NFT (real-time verification)

## Available Tools

### Core Tools

#### 1. **authenticate**
Authenticate with your Shadow Clone API key.
- **Required**: `apiKey` - Your Shadow Clone API key from dashboard
- **Returns**: Authentication status and license type
- **Note**: Must be called before using any other tools

#### 2. **check_for_updates**
Check if a newer version of the MCP server is available.
- **No parameters required**
- **Returns**: Current version, latest version, and update instructions

### Orchestration Tools

#### 3. **shadow_clone_orchestrate**
Main orchestration system - returns comprehensive instructions for AI to execute Shadow Clone methodology.
- **Required**: 
  - `mode` - Execution mode: `plan`, `feature`, `debug`, `optimize`, `refactor`, `audit`, `research`
  - `projectDescription` - Detailed description of what you want to accomplish
- **Optional**:
  - `projectPlan` - Path to existing project plan file
  - `wavesDirectory` - Output directory (default: `./.waves/`)
  - `maxAgentsPerWave` - Maximum agents per wave (default: 10, max: 20)
- **Returns**: Complete orchestration instructions including team composition, wave planning, and execution guidelines

#### 4. **shadow_clone_plan**
Planning-only mode - returns instructions for creating comprehensive project plans without code.
- **Required**: `projectVision` - Your project idea, goals, and high-level requirements
- **Optional**: `wavesDirectory` - Output directory for planning documents
- **Returns**: Planning methodology and templates for architecture, specifications, and roadmaps

### Team Deployment Tools

#### 5. **deploy_agent_team**
Deploy a specialized team for specific tasks.
- **Required**:
  - `teamType` - Type of team: `frontend`, `backend`, `database`, `testing`, `documentation`, `devops`, `mobile`, `security`
  - `task` - Specific task description for the team
- **Optional**:
  - `outputDirectory` - Where to place deliverables
  - `teamSize` - Number of agents (1-5)
- **Returns**: Team composition, roles, workflow, and coordination instructions

#### 6. **deploy_specialist_agent**
Deploy a single expert agent for focused tasks.
- **Required**:
  - `specialization` - Agent expertise: `react_expert`, `api_designer`, `database_architect`, `test_engineer`, `performance_analyst`, `security_auditor`, `code_reviewer`, `documentation_writer`
  - `task` - Specific task for the agent
- **Optional**:
  - `context` - Additional context (file paths, requirements)
  - `deliverables` - Array of expected outputs
- **Returns**: Specialist behavior patterns, expertise guidelines, and task approach

### Specialized Tools

#### 7. **quick_fix**
Rapid problem-solving methodology for small, urgent fixes.
- **Required**:
  - `issueType` - Type of issue: `bug`, `style`, `logic`, `performance`, `security`
  - `description` - Issue description
- **Optional**:
  - `filePath` - Affected file(s)
  - `urgency` - Priority level: `low`, `medium`, `high`, `critical`
- **Returns**: Structured approach for rapid issue resolution

#### 8. **code_review_team**
Deploy a review team for existing code.
- **Required**:
  - `reviewType` - Focus area: `security`, `performance`, `quality`, `architecture`, `comprehensive`
  - `files` - Array of files or directories to review
- **Optional**: `standards` - Specific standards to check against
- **Returns**: Review methodology, checklists, and team simulation patterns

#### 9. **generate_tests**
Deploy testing specialists to create tests.
- **Required**:
  - `testType` - Type of tests: `unit`, `integration`, `e2e`, `performance`, `security`
  - `targetFiles` - Array of files to test
- **Optional**:
  - `framework` - Testing framework to use
  - `coverage` - Target coverage percentage (0-100)
- **Returns**: Test generation patterns and methodology

#### 10. **execute_single_wave**
Run a single wave of a specific type without full orchestration.
- **Required**:
  - `waveType` - Type of wave: `research`, `planning`, `implementation`, `testing`, `documentation`, `review`
  - `scope` - What to focus on
- **Optional**:
  - `inputs` - Array of input files or data
  - `maxAgents` - Number of agents to deploy (1-10)
- **Returns**: Focused workflow for specific project phase

#### 11. **create_documentation**
Deploy documentation specialists.
- **Required**:
  - `docType` - Documentation type: `api`, `user_guide`, `developer`, `architecture`, `inline`
  - `scope` - What to document
- **Optional**:
  - `format` - Output format: `markdown`, `html`, `openapi`, `jsdoc`
  - `audience` - Target audience: `developers`, `users`, `architects`, `general`
- **Returns**: Documentation patterns and creation methodology

#### 12. **architecture_consultant**
Deploy architecture experts for design decisions.
- **Required**:
  - `consultationType` - Type: `design_review`, `pattern_recommendation`, `scalability_analysis`, `migration_planning`
  - `context` - Current system description
- **Optional**:
  - `constraints` - Any limitations or requirements
  - `goals` - Array of specific goals to achieve
- **Returns**: Architecture principles and expert analysis methodology

### Template Access

#### 13. **get_agent_template**
Access internal agent behavior templates and role definitions.
- **Required**: `templateType` - Template to retrieve:
  - `core_rules` - Core agent behavior rules and principles
  - `agent_template` - Individual agent creation template
  - `team_templates` - Team coordination and role templates
- **Returns**: Requested template content for understanding agent behaviors

## What This Does vs What It Doesn't Do

### ✅ What Shadow Clone DOES:
- **Delivers advanced prompt engineering macros** - Sophisticated instructions that guide AI behavior
- **Provides expert methodologies** - Templates and patterns for complex software development
- **Enables AI orchestration** - Simulates teams of specialized virtual agents through structured prompting
- **Works universally** - Compatible with any AI system that supports MCP
- **Unlocks advanced capabilities** - Transforms basic AI assistants into specialized experts
- **Checks for updates** - Only tool that executes code (npm commands for version checking)

### ❌ What Shadow Clone DOESN'T Do:
- **Execute code directly** - No compilation, building, or running of your applications
- **Install dependencies** - No npm installs, package management, or system changes
- **Access external services** - No API calls to your systems or databases
- **Modify your files** - The AI assistant does the actual file operations based on our instructions
- **Replace AI assistants** - Enhances them with advanced prompt engineering techniques

## How It Works

Shadow Clone operates as a **prompt engineering delivery system**:

1. **Tool Call**: You request a Shadow Clone tool in your AI conversation
2. **Macro Delivery**: The tool returns sophisticated prompt engineering instructions and methodologies
3. **AI Transformation**: The AI assistant adopts the provided expert behaviors and approaches
4. **Enhanced Execution**: The AI completes your task using advanced techniques it wouldn't normally have
5. **Output Creation**: All deliverables are created by the AI in the `.waves/` directory

This design makes Shadow Clone **AI-agnostic** - any AI assistant with MCP support can instantly gain access to expert-level prompt engineering macros.

## Usage Examples

### Basic Project Build
```
1. Authenticate: Use authenticate tool with your API key
2. Build Feature: Use shadow_clone_orchestrate with:
   - mode: "feature"
   - projectDescription: "Build a React dashboard with user authentication and data visualization"
3. AI follows the returned instructions to create your project in .waves/
```

### Planning Mode
```
1. Authenticate first
2. Create Plan: Use shadow_clone_plan with:
   - projectVision: "SaaS platform for team collaboration with real-time features"
3. AI creates comprehensive architecture docs and implementation roadmap
```

### Deploy Specific Team
```
1. Frontend Team: Use deploy_agent_team with:
   - teamType: "frontend"
   - task: "Create responsive landing page with animations"
   - teamSize: 3
2. AI simulates a frontend team and builds the components
```

### Quick Bug Fix
```
1. Use quick_fix with:
   - issueType: "bug"
   - description: "API endpoint returning 500 error on user login"
   - urgency: "high"
2. AI follows rapid debugging methodology to resolve issue
```

### Code Review
```
1. Use code_review_team with:
   - reviewType: "security"
   - files: ["src/api/auth.js", "src/api/users.js"]
2. AI performs comprehensive security audit with recommendations
```

### Generate Tests
```
1. Use generate_tests with:
   - testType: "unit"
   - targetFiles: ["src/components/Dashboard.jsx"]
   - framework: "jest"
   - coverage: 80
2. AI creates comprehensive test suite
```

## Security

- API keys are stored securely in your home directory
- **Real-time NFT verification** - Access is active only while you own the NFT
- Authentication persists until NFT ownership changes
- Automatic access revocation if NFT is transferred or sold
- All prompt engineering is embedded and protected
- Prompts are never exposed in plain text
- Minimal logging for privacy

## Troubleshooting

### "Not authenticated" Error
Run the authenticate tool with your API key.

### "NFT license not found in wallet" Error
1. Ensure you still own your Shadow Clone NFT
2. Check the NFT is in the wallet associated with your API key
3. If you transferred the NFT, you'll need to re-authenticate

### "Invalid API key" Error
1. Check your API key at [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
2. Ensure your license is active
3. Re-authenticate with the correct key

### MCP Server Not Found
1. Ensure the server is installed globally: `npm list -g @shadow-clone/mcp-server`
2. Check your PATH includes npm global bin directory
3. Restart Claude Desktop after configuration changes

### Connection Issues
1. Check your internet connection
2. Verify API endpoint is accessible
3. Check logs at `~/.shadow-clone/logs/`

## Environment Variables

- `SHADOW_CLONE_API_ENDPOINT` - API server URL (default: https://api.ignislabs.ai)
- `LOG_LEVEL` - Logging level: error, warn, info, debug (default: info)
- `NODE_ENV` - Set to "production" to disable console logging

## License

This MCP server requires active ownership of a Shadow Clone NFT. Access is verified in real-time:
- **Ignis Elite NFT** holders (777 total) - Full access
- Access is immediately revoked if NFT is transferred or sold
- NFT ownership is verified before each operation

Future releases will include Pioneer, Builder, and Reserve access tiers.

## Documentation

- **[Complete Tool Documentation](./docs/TOOL_DOCUMENTATION.md)** - Detailed guide for all tools
- **[Macro Prompting Guide](../docs/MACRO_PROMPTING_GUIDE.md)** - Use Shadow Clone with any AI CLI
- **[VSCode Extension](../vscode-extension/README.md)** - Enhanced prompt engineering toolkit

## Support

- **Documentation**: [docs.shadowclone.ai](https://docs.shadowclone.ai)
- **Support**: Contact through [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)
- **Dashboard**: [dashboard.ignislabs.ai](https://dashboard.ignislabs.ai)

---

© 2024 Ignis AI Labs LLC. All rights reserved.