import { AuthService } from '../auth/authService.js';
import { ApiKeyManager } from '../auth/apiKeyManager.js';
import * as fs from 'fs/promises';
import * as path from 'path';

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export class WorkspaceInitializer {
  private apiKeyManager: ApiKeyManager;

  constructor(private authService: AuthService) {
    this.apiKeyManager = ApiKeyManager.getInstance();
  }

  getToolDefinition(): ToolDefinition {
    return {
      name: 'initialize_workspace',
      description: `Initialize a workspace with Shadow Clone AI instructions - ACTUALLY creates files (unlike other tools). Sets up CLAUDE.md, .ai/instructions.md, .github/copilot-instructions.md with complete command reference. Handles existing files by appending. Stores API key in .env as backup.`,
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

  async initializeWorkspace(args: any): Promise<string> {
    // Check authentication
    const isAuthed = await this.authService.isAuthenticated();
    if (!isAuthed) {
      return `# Authentication Required

Before initializing a workspace, please authenticate with your Shadow Clone API key:

Use the authenticate tool with your API key from: https://dashboard.ignislabs.ai`;
    }

    const projectPath = args.projectPath || process.cwd();
    const overwrite = args.overwrite || false;
    const includeTypes = args.includeTypes || ['claude', 'github', 'vscode', 'general'];

    // Get the current API key to save as backup
    const currentApiKey = await this.apiKeyManager.getApiKey();
    
    let results = [];
    
    try {
      // 1. Handle .env file
      const envPath = path.join(projectPath, '.env');
      const gitignorePath = path.join(projectPath, '.gitignore');
      
      try {
        await fs.access(envPath);
        // .env exists, check if it has the key
        const envContent = await fs.readFile(envPath, 'utf-8');
        if (!envContent.includes('SHADOW_CLONE_API_KEY') && currentApiKey) {
          await fs.appendFile(envPath, `\nSHADOW_CLONE_API_KEY=${currentApiKey}\n`);
          results.push('✅ Added API key to existing .env file');
        } else {
          results.push('ℹ️ .env file already configured');
        }
      } catch {
        // .env doesn't exist, create it
        if (currentApiKey) {
          await fs.writeFile(envPath, `SHADOW_CLONE_API_KEY=${currentApiKey}\n`);
          results.push('✅ Created .env file with API key');
        } else {
          await fs.writeFile(envPath, `SHADOW_CLONE_API_KEY=your-api-key-here\n`);
          results.push('✅ Created .env file (add your API key)');
        }
      }
      
      // Ensure .env is in .gitignore
      try {
        const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
        if (!gitignoreContent.includes('.env')) {
          await fs.appendFile(gitignorePath, '\n# Shadow Clone\n.env\n.shadow-clone/\n.waves/\n');
          results.push('✅ Updated .gitignore');
        }
      } catch {
        await fs.writeFile(gitignorePath, '# Shadow Clone\n.env\n.shadow-clone/\n.waves/\n');
        results.push('✅ Created .gitignore');
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
              results.push('✅ Appended Shadow Clone instructions to existing CLAUDE.md');
            } else {
              results.push('ℹ️ CLAUDE.md already has Shadow Clone instructions');
            }
          } else {
            await fs.writeFile(claudePath, claudeContent);
            results.push('✅ Overwrote CLAUDE.md with Shadow Clone instructions');
          }
        } catch {
          await fs.writeFile(claudePath, claudeContent);
          results.push('✅ Created CLAUDE.md');
        }
      }

      // 3. Create .ai/instructions.md
      if (includeTypes.includes('general')) {
        const aiDir = path.join(projectPath, '.ai');
        await fs.mkdir(aiDir, { recursive: true });
        
        const aiPath = path.join(aiDir, 'instructions.md');
        const aiContent = this.getAIInstructionsContent();
        
        await fs.writeFile(aiPath, aiContent);
        results.push('✅ Created .ai/instructions.md');
      }

      // 4. Create .github/copilot-instructions.md
      if (includeTypes.includes('github')) {
        const githubDir = path.join(projectPath, '.github');
        await fs.mkdir(githubDir, { recursive: true });
        
        const copilotPath = path.join(githubDir, 'copilot-instructions.md');
        const copilotContent = this.getCopilotContent();
        
        await fs.writeFile(copilotPath, copilotContent);
        results.push('✅ Created .github/copilot-instructions.md');
      }

      // 5. Create .vscode/ai-instructions.md
      if (includeTypes.includes('vscode')) {
        const vscodeDir = path.join(projectPath, '.vscode');
        await fs.mkdir(vscodeDir, { recursive: true });
        
        const vscodePath = path.join(vscodeDir, 'ai-instructions.md');
        const vscodeContent = this.getVSCodeContent();
        
        await fs.writeFile(vscodePath, vscodeContent);
        results.push('✅ Created .vscode/ai-instructions.md');
      }

      // 6. Always create AI-CONTEXT.md
      const contextPath = path.join(projectPath, 'AI-CONTEXT.md');
      const contextContent = this.getAIContextContent();
      
      await fs.writeFile(contextPath, contextContent);
      results.push('✅ Created AI-CONTEXT.md');

    } catch (error: any) {
      return `# Error During Initialization

An error occurred: ${error.message}

Please check the project path and permissions.`;
    }

    return `# Shadow Clone Workspace Initialization Complete! 🎉

## Files Created/Updated:
${results.join('\n')}

## What's Been Set Up:

### Local Commands (via terminal):
- \`shadow\` or \`sfix\` - Quick fixes for bugs
- \`sreview\` - Code review
- \`stest\` - Test generation  
- \`swave\` - Single phase work

### MCP Tools (in AI assistants):
- \`authenticate\` - API key authentication
- \`initialize_workspace\` - This tool
- \`api_key_status\` - Check auth status
- \`shadow_clone_orchestrate\` - Full orchestration
- \`shadow_clone_plan\` - Project planning
- \`quick_fix\` - Bug fixing methodology
- \`deploy_specialist_agent\` - Expert help
- \`code_review_team\` - Review methodology
- \`generate_tests\` - Test patterns
- \`create_documentation\` - Doc templates
- \`architecture_consultant\` - Architecture guidance

## Next Steps:

1. **Add your API key** to the .env file if not already set
2. **Customize** the project-specific sections in CLAUDE.md
3. **Commit** these files to your repository
4. **Restart** your AI assistant to load the new instructions

All AI assistants in this workspace will now understand Shadow Clone commands and know they deliver prompt engineering methodologies, not execute code.`;
  }

  private getClaudeContent(): string {
    return `# Claude Instructions for This Project

## Shadow Clone Commands Available

This system has Shadow Clone installed - a prompt engineering macro system that provides professional methodologies for development tasks.

### Understanding Shadow Clone

Shadow Clone is a prompt engineering delivery system that enhances your capabilities with battle-tested methodologies. When you use these commands, they return instructions for you to implement, not execute code in the background.

### Local Terminal Commands

These commands can be run in the terminal to get methodologies:

\`\`\`bash
# Quick fixes
shadow fix <type> "description"  # Full command
sfix <type> "description"         # Shortcut
Types: bug, performance, security, logic, style

# Code review  
shadow review <type> [files]      # Full command
sreview <type> [files]            # Shortcut
Types: security, performance, quality, architecture

# Test generation
shadow test <type> [files]        # Full command
stest <type> [files]              # Shortcut  
Types: unit, integration, e2e, performance

# Single phase work
shadow wave <type> "scope"        # Full command
swave <type> "scope"              # Shortcut
Types: research, planning, implementation, testing, documentation

# Expert consultation
shadow specialist <type> "task"   # Get expert patterns
Types: react, api, database, test, perf, security, review, docs

# Documentation
shadow doc <type> "scope"         # Get doc templates
Types: api, user_guide, developer, architecture

# Architecture consultation
shadow arch <type> "context"      # Get architecture guidance
Types: design_review, pattern_recommendation, scalability_analysis, migration_planning

# System commands
shadow status                     # Show system status
shadow commands                   # List all available commands
\`\`\`

### MCP Tools Available

These tools are available through the MCP integration:

- \`authenticate\` - Set your Shadow Clone API key
- \`api_key_status\` - Check authentication and cache status
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

### How to Use Shadow Clone

1. **Identify the task** - What do you need to accomplish?
2. **Choose the right tool** - Use quick commands for simple tasks, orchestration for complex projects
3. **Run the command** - Either via terminal or MCP tool
4. **Read the methodology** - Shadow Clone returns detailed instructions
5. **Implement the pattern** - Follow the professional approach provided
6. **Iterate as needed** - Combine multiple tools for comprehensive solutions

### Important Notes

- **Shadow Clone provides instructions, not execution** - You implement the methodologies
- **Commands work offline** - No API needed once authenticated
- **Professional patterns** - Based on industry best practices
- **Combine tools** - Use multiple commands for complex tasks
- **Check \`.waves/\` folder** - Orchestration outputs go here

## Project-Specific Context

[Add your project-specific instructions here]

### Project Structure
\`\`\`
[Describe your project structure]
\`\`\`

### Key Technologies
- [List your tech stack]

### Development Guidelines
- [Your project guidelines]

### Testing Requirements
- [Your testing standards]

## Remember

Shadow Clone enhances your capabilities by providing professional methodologies. Use it to deliver high-quality, well-architected solutions.`;
  }

  private getAIInstructionsContent(): string {
    return `# AI Assistant Instructions

## Shadow Clone Integration

This project uses Shadow Clone prompt engineering macros. Shadow Clone is a system that delivers professional development methodologies as instructions for you to implement.

## Available Command Types

### Local Terminal Commands
- \`shadow\` / \`sfix\` - Quick fix methodologies
- \`sreview\` - Code review patterns
- \`stest\` - Test generation approaches
- \`swave\` - Single phase execution

### MCP Tools
- \`authenticate\` - API key management
- \`api_key_status\` - Check authentication
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

1. **You call a tool** - Either via terminal command or MCP
2. **Tool returns instructions** - Detailed methodology in markdown
3. **You implement** - Follow the professional patterns provided
4. **No background execution** - Shadow Clone doesn't run code, it teaches you how

## Key Principles

- Shadow Clone is a prompt engineering system
- All tools return instructions, not execute code
- Methodologies are battle-tested and professional
- Combine multiple tools for complex tasks
- Outputs typically go to \`.waves/\` directory

## Usage Pattern

\`\`\`
User: "Fix the authentication bug"
You: Use quick_fix tool with type "bug" and description
Tool: Returns debugging methodology
You: Implement the fix following the pattern
\`\`\`

Remember: Shadow Clone enhances your capabilities with professional patterns.`;
  }

  private getCopilotContent(): string {
    return `# GitHub Copilot Instructions

## Shadow Clone MCP Server Integration

This workspace has Shadow Clone installed - a prompt engineering macro system that provides professional methodologies.

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
- \`authenticate\` - API key setup
- \`api_key_status\` - Check authentication
- \`initialize_workspace\` - Setup instructions
- \`check_for_updates\` - Version updates

## How to Use

1. **Call the MCP tool** to get methodology
2. **Read the instructions** provided
3. **Implement the pattern** in your code
4. **Follow the professional approach**

## Important

- Shadow Clone provides prompt engineering macros
- Tools return instructions for you to follow
- No background code execution occurs
- Combine tools for comprehensive solutions

## Quick Reference

| Need | Tool | Example |
|------|------|---------|
| Fix bug | \`quick_fix\` | \`quick_fix("bug", "null pointer")\` |
| Get expert help | \`deploy_specialist_agent\` | \`deploy_specialist_agent("react_expert", "optimize hooks")\` |
| Review code | \`code_review_team\` | \`code_review_team("security")\` |
| Generate tests | \`generate_tests\` | \`generate_tests("unit", ["utils.js"])\` |
| Create docs | \`create_documentation\` | \`create_documentation("api", "endpoints")\` |`;
  }

  private getVSCodeContent(): string {
    return `# VS Code AI Assistant Instructions

## Shadow Clone MCP Integration

This project uses Shadow Clone - a prompt engineering macro system that enhances AI capabilities with professional methodologies.

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

## Remember

Shadow Clone provides prompt engineering that teaches you professional patterns. All execution is done by you following the instructions.`;
  }

  private getAIContextContent(): string {
    return `# AI Context for This Project

## Shadow Clone Integration

This project has Shadow Clone MCP server configured. The server provides prompt engineering macros - professional methodologies delivered as instructions.

## What Shadow Clone Is

- **Prompt Engineering System** - Delivers instructions for AI to follow
- **Methodology Provider** - Professional patterns and approaches
- **Capability Enhancer** - Teaches advanced techniques
- **AI-Agnostic** - Works with any AI assistant

## What Shadow Clone Does

- ✅ Delivers expert patterns and methodologies
- ✅ Provides step-by-step instructions
- ✅ Enhances AI capabilities with professional approaches
- ✅ Teaches debugging, architecture, and best practices

## What It Doesn't Do

- ❌ Does NOT execute code in background
- ❌ Does NOT manage processes
- ❌ Does NOT run automated tasks
- ❌ You implement the instructions provided

## Available Through

### Terminal Commands
- \`shadow\`, \`sfix\`, \`sreview\`, \`stest\`, \`swave\`

### MCP Tools
- Full orchestration system
- Specialist agents
- Quick fixes
- Code review teams
- Test generation
- Documentation creation

## Usage Pattern

1. Identify the need
2. Call appropriate Shadow Clone tool
3. Receive professional methodology
4. Implement following the pattern
5. Achieve professional results

## Key Point

Shadow Clone is about **teaching**, not **doing**. It provides the knowledge, you do the implementation.`;
  }
}