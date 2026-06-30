// Static instruction templates emitted by `initialize_workspace`.
// Extracted from workspace-initializer.ts (AUDIT-026): the initializer
// was 462 lines and is now 299 — under the 300-line hard ceiling but
// still over the 200-line house target. Further reduction is tracked
// as part of the AUDIT-026 deferred remainder in ISSUE_TRACKER.md.
// These templates are pure constants — no `this`, no environment, no IO
// — so they live as exported `const` strings and the initializer just
// picks the right one for each include type.

export const CLAUDE_INSTRUCTIONS = `# Claude Instructions for This Project

## Shadow Clone Commands Available

This system has Shadow Clone installed - a free, open-source prompt engineering macro system that provides professional methodologies for development tasks.

### Understanding Shadow Clone

Shadow Clone is a prompt engineering delivery system that enhances your capabilities with battle-tested methodologies. When you use these commands, they return instructions for you to implement, not execute code in the background.

### MCP Tools Available

These tools are available through the MCP integration:

- \`initialize_workspace\` - Set up AI instructions (this created these files!)
- \`check_for_updates\` - Check for MCP server updates
- \`shadow_clone_orchestrate\` - Full project orchestration with waves of agents
- \`shadow_clone_plan\` - Create comprehensive project plans
- \`get_agent_template\` - Get agent behavior templates
- \`deploy_agent_team\` - Deploy specialized development teams
- \`deploy_specialist_agent\` - Deploy individual expert agents
- \`quick_fix\` - Get rapid problem-solving methodology
- \`code_review_team\` - Get team-based review methodology
- \`generate_tests\` - Get test generation patterns
- \`execute_single_wave\` - Run a single focused wave
- \`create_documentation\` - Get documentation templates
- \`architecture_consultant\` - Get architecture consultation
- \`show_commands\` - Quick reference of all commands

### How to Use Shadow Clone

1. **Identify the task** - What do you need to accomplish?
2. **Choose the right tool** - Use quick commands for simple tasks, orchestration for complex projects
3. **Run the command** - Via MCP tool
4. **Read the methodology** - Shadow Clone returns detailed instructions
5. **Implement the pattern** - Follow the professional approach provided
6. **Iterate as needed** - Combine multiple tools for comprehensive solutions

### Important Notes

- **Shadow Clone provides instructions, not execution** - You implement the methodologies
- **No authentication needed** - Shadow Clone is free and open-source
- **Professional patterns** - Based on industry best practices
- **Combine tools** - Use multiple commands for complex tasks
- **Check \`.waves/\` folder** - Orchestration outputs go here

## Project-Specific Context

[Add your project-specific instructions here]
`;

export const AI_INSTRUCTIONS = `# AI Assistant Instructions

## Shadow Clone Integration

This project uses Shadow Clone prompt engineering macros. Shadow Clone is a free, open-source system that delivers professional development methodologies as instructions for you to implement.

## Available MCP Tools
- \`initialize_workspace\` - Setup AI instructions
- \`shadow_clone_orchestrate\` - Full orchestration
- \`shadow_clone_plan\` - Project planning
- \`quick_fix\` - Problem-solving patterns
- \`deploy_specialist_agent\` - Expert methodologies
- \`code_review_team\` - Review processes
- \`generate_tests\` - Test patterns
- \`create_documentation\` - Doc templates
- \`architecture_consultant\` - Architecture guidance

## How Shadow Clone Works

1. **You call a tool** - Via MCP
2. **Tool returns instructions** - Detailed methodology in markdown
3. **You implement** - Follow the professional patterns provided
4. **No background execution** - Shadow Clone doesn't run code, it teaches you how

## Key Principles

- Shadow Clone is a prompt engineering system
- All tools return instructions, not execute code
- Methodologies are battle-tested and professional
- Combine multiple tools for complex tasks
- Outputs typically go to \`.waves/\` directory
`;

export const COPILOT_INSTRUCTIONS = `# GitHub Copilot Instructions

## Shadow Clone MCP Server Integration

This workspace has Shadow Clone installed - a free, open-source prompt engineering macro system that provides professional methodologies.

## Available Tools

### Quick Access Commands
- \`quick_fix [type] "description"\` - Bug fixes, performance, security
- \`deploy_specialist_agent [type] "task"\` - Expert patterns
- \`code_review_team [type]\` - Review methodology
- \`generate_tests [type]\` - Test patterns
- \`create_documentation [type] "scope"\` - Documentation templates

### Orchestration Tools
- \`shadow_clone_orchestrate\` - Full project orchestration
- \`shadow_clone_plan\` - Project planning
- \`execute_single_wave\` - Single phase execution

### Support Tools
- \`initialize_workspace\` - Setup instructions
- \`check_for_updates\` - Version updates
- \`show_commands\` - Quick reference

## How to Use

1. **Call the MCP tool** to get methodology
2. **Read the instructions** provided
3. **Implement the pattern** in your code
4. **Follow the professional approach**

## Important

- Shadow Clone provides prompt engineering macros
- Tools return instructions for you to follow
- No background code execution occurs
- No authentication needed - fully open-source
`;

export const VSCODE_INSTRUCTIONS = `# VS Code AI Assistant Instructions

## Shadow Clone MCP Integration

This project uses Shadow Clone - a free, open-source prompt engineering macro system that enhances AI capabilities with professional methodologies.

## Quick Command Reference

### Problem Solving
- \`quick_fix\` - Get bug fix methodology
  - Types: bug, performance, security, logic, style

### Expert Help
- \`deploy_specialist_agent\` - Get expert patterns
  - Types: react_expert, api_designer, database_architect, test_engineer

### Code Quality
- \`code_review_team\` - Get review methodology
  - Types: security, performance, quality, architecture

### Testing
- \`generate_tests\` - Get test patterns
  - Types: unit, integration, e2e, performance

### Documentation
- \`create_documentation\` - Get doc templates
  - Types: api, user_guide, developer, architecture

## How It Works

1. **Tools return instructions** - Not code execution
2. **You implement the patterns** - Following the methodology
3. **Professional approaches** - Industry best practices
4. **Combine for complex tasks** - Use multiple tools together
`;
