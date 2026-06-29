import * as fs from 'fs/promises';
import * as path from 'path';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { logger } from '../utils/logger.js';

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

interface InitializeWorkspaceArgs {
  projectPath?: string;
  overwrite?: boolean;
  includeTypes?: string[];
}

export class WorkspaceInitializer {

  getToolDefinition(): ToolDefinition {
    return {
      name: 'initialize_workspace',
      description: `Initialize a workspace with Shadow Clone AI instructions - ACTUALLY creates files (unlike other tools). Sets up CLAUDE.md, .ai/instructions.md, .github/copilot-instructions.md with complete command reference. Handles existing files by appending.`,
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: {
            type: 'string',
            description: 'Path to the project directory to initialize (default: current directory)'
          },
          overwrite: {
            type: 'boolean',
            description: 'Whether to overwrite existing files (default: false, appends to existing)'
          },
          includeTypes: {
            type: 'array',
            items: { type: 'string' },
            description: 'Which instruction files to create (default: all). Options: claude, github, vscode, general',
            default: ['claude', 'github', 'vscode', 'general']
          }
        },
        required: []
      }
    };
  }

  async initializeWorkspace(args: InitializeWorkspaceArgs): Promise<string> {
    const rawProjectPath = args.projectPath || process.cwd();
    const overwrite = args.overwrite || false;
    const includeTypes = args.includeTypes || ['claude', 'github', 'vscode', 'general'];

    // Caller-side defense (AUDIT-001): resolve the project path and
    // refuse to operate outside the MCP server's working directory.
    // zodValidation also enforces this at the input boundary; this
    // second layer guards against bypass via direct handler invocation
    // or schema-registry misses. Error message is intentionally
    // generic — do not echo the server cwd or the rejected path back
    // to the MCP client (CWE-209).
    const cwd = process.cwd();
    const projectPath = path.resolve(cwd, rawProjectPath);
    const rel = path.relative(cwd, projectPath);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'projectPath resolves outside the allowed root'
      );
    }

    let results: string[] = [];

    try {
      // 1. Ensure .gitignore has Shadow Clone patterns
      const gitignorePath = path.join(projectPath, '.gitignore');

      try {
        const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
        if (!gitignoreContent.includes('.shadow-clone/') || !gitignoreContent.includes('.waves/')) {
          await fs.appendFile(gitignorePath, '\n# Shadow Clone\n.shadow-clone/\n.waves/\n');
          results.push('Updated .gitignore');
        }
      } catch {
        await fs.writeFile(gitignorePath, '# Shadow Clone\n.shadow-clone/\n.waves/\n');
        results.push('Created .gitignore');
      }

      // 2. Create CLAUDE.md
      if (includeTypes.includes('claude')) {
        const claudePath = path.join(projectPath, 'CLAUDE.md');
        const claudeContent = this.getClaudeContent();

        try {
          await fs.access(claudePath);
          if (!overwrite) {
            const existingContent = await fs.readFile(claudePath, 'utf-8');
            if (!existingContent.includes('Shadow Clone')) {
              await fs.appendFile(claudePath, '\n\n' + claudeContent);
              results.push('Appended Shadow Clone instructions to existing CLAUDE.md');
            } else {
              results.push('CLAUDE.md already has Shadow Clone instructions');
            }
          } else {
            await fs.writeFile(claudePath, claudeContent);
            results.push('Overwrote CLAUDE.md with Shadow Clone instructions');
          }
        } catch {
          await fs.writeFile(claudePath, claudeContent);
          results.push('Created CLAUDE.md');
        }
      }

      // 3. Create .ai/instructions.md
      if (includeTypes.includes('general')) {
        const aiDir = path.join(projectPath, '.ai');
        await fs.mkdir(aiDir, { recursive: true });

        const aiPath = path.join(aiDir, 'instructions.md');
        const aiContent = this.getAIInstructionsContent();

        await fs.writeFile(aiPath, aiContent);
        results.push('Created .ai/instructions.md');
      }

      // 4. Create .github/copilot-instructions.md
      if (includeTypes.includes('github')) {
        const githubDir = path.join(projectPath, '.github');
        await fs.mkdir(githubDir, { recursive: true });

        const copilotPath = path.join(githubDir, 'copilot-instructions.md');
        const copilotContent = this.getCopilotContent();

        await fs.writeFile(copilotPath, copilotContent);
        results.push('Created .github/copilot-instructions.md');
      }

      // 5. Create .vscode/ai-instructions.md
      if (includeTypes.includes('vscode')) {
        const vscodeDir = path.join(projectPath, '.vscode');
        await fs.mkdir(vscodeDir, { recursive: true });

        const vscodePath = path.join(vscodeDir, 'ai-instructions.md');
        const vscodeContent = this.getVSCodeContent();

        await fs.writeFile(vscodePath, vscodeContent);
        results.push('Created .vscode/ai-instructions.md');
      }

    } catch (error: unknown) {
      // Do NOT echo raw fs error text back to the MCP client — it
      // contains resolved absolute paths (CWE-209). Detail goes to
      // server logs via winston; the client gets a generic
      // remediation hint.
      logger.error('initialize_workspace failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      return `# Error During Initialization

Initialization failed; check that the project path is writable and that the MCP server has sufficient permissions.`;
    }

    return `# Shadow Clone Workspace Initialization Complete!

## Files Created/Updated:
${results.map(r => `- ${r}`).join('\n')}

## What's Been Set Up:

### MCP Tools (in AI assistants):
- \`initialize_workspace\` - This tool
- \`shadow_clone_orchestrate\` - Full orchestration
- \`shadow_clone_plan\` - Project planning
- \`quick_fix\` - Bug fixing methodology
- \`deploy_specialist_agent\` - Expert help
- \`code_review_team\` - Review methodology
- \`generate_tests\` - Test patterns
- \`create_documentation\` - Doc templates
- \`architecture_consultant\` - Architecture guidance
- \`check_for_updates\` - Version checking
- \`show_commands\` - Quick reference

## Next Steps:

1. **Customize** the project-specific sections in CLAUDE.md
2. **Commit** these files to your repository
3. **Restart** your AI assistant to load the new instructions

All AI assistants in this workspace will now understand Shadow Clone commands and know they deliver prompt engineering methodologies, not execute code.`;
  }

  private getClaudeContent(): string {
    return `# Claude Instructions for This Project

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
  }

  private getAIInstructionsContent(): string {
    return `# AI Assistant Instructions

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
  }

  private getCopilotContent(): string {
    return `# GitHub Copilot Instructions

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
  }

  private getVSCodeContent(): string {
    return `# VS Code AI Assistant Instructions

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
  }
}
