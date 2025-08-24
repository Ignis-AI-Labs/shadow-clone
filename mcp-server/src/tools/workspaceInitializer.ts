import { AuthService } from '../auth/authService.js';
import { ApiKeyManager } from '../auth/apiKeyManager.js';

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
      description: `Initializes a workspace with Shadow Clone AI instructions - Creates AI instruction files (CLAUDE.md, .ai/instructions.md, .github/copilot-instructions.md) to inform AI assistants about Shadow Clone commands. This tool creates reference documentation in your project so AI assistants know how to use Shadow Clone prompt engineering macros. IMPORTANT: This returns instructions for setting up the workspace, it does NOT execute file operations directly.`,
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: {
            type: 'string',
            description: 'Path to the project directory to initialize (default: current directory)'
          },
          overwrite: {
            type: 'boolean',
            description: 'Whether to overwrite existing files (default: false)'
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

\`\`\`bash
# Use the authenticate tool first
authenticate("<your-api-key>")
\`\`\`

Get your API key from: https://dashboard.ignislabs.ai`;
    }

    const projectPath = args.projectPath || '.';
    const overwrite = args.overwrite || false;
    const includeTypes = args.includeTypes || ['claude', 'github', 'vscode', 'general'];

    // Get the current API key to save as backup
    const currentApiKey = await this.apiKeyManager.getApiKey();
    const hasLocalEnv = await this.checkForLocalEnv();

    // Return instructions for the AI to follow
    return `# Shadow Clone Workspace Initialization Instructions

Follow these steps to initialize the workspace with Shadow Clone AI instructions:

## 1. Check Project Directory

First, verify you're in the correct project directory:
\`\`\`bash
pwd
ls -la
\`\`\`

## 2. Create or Update .env File (API Key Backup)
${currentApiKey && !hasLocalEnv ? `
Your API key is currently set. Create a \`.env\` file as a backup:

\`\`\`bash
echo "SHADOW_CLONE_API_KEY=${currentApiKey}" > .env
\`\`\`

Then ensure it's in .gitignore:
\`\`\`bash
echo ".env" >> .gitignore
\`\`\`
` : hasLocalEnv ? `
A .env file already exists. Check if it contains your API key:
\`\`\`bash
grep "SHADOW_CLONE_API_KEY" .env || echo "SHADOW_CLONE_API_KEY=${currentApiKey || 'your-api-key-here'}" >> .env
\`\`\`
` : `
No API key found. Create a .env file for future use:
\`\`\`bash
echo "SHADOW_CLONE_API_KEY=your-api-key-here" > .env
echo ".env" >> .gitignore
\`\`\`
`}

## 3. Create CLAUDE.md (if requested)
${includeTypes.includes('claude') ? `
Create or update \`CLAUDE.md\` in the project root:

\`\`\`markdown
# Claude Instructions for This Project

## Shadow Clone Commands Available

This system has Shadow Clone installed - a prompt engineering macro system that provides professional methodologies for development tasks.

### How to Use Shadow Clone

When you need to solve problems, fix bugs, or implement features, use these commands to get expert methodologies:

\`\`\`bash
# Quick fixes
sfix <type> "description"       # Get fix methodology
Types: bug, performance, security, logic, style

# Expert help
shadow specialist <type> "task"  # Get expert patterns
Types: react, api, database, test, perf, security

# Code review
sreview <type> [files]           # Get review checklist
Types: security, performance, quality, architecture

# Test generation
stest <type> [files]             # Get test patterns
Types: unit, integration, e2e, performance

# Single phase work
swave <type> "scope"             # Get phase methodology
Types: research, planning, implementation, testing

# Documentation
shadow doc <type> "scope"        # Get doc templates
Types: api, user_guide, developer, architecture
\`\`\`

### Important Notes

- Shadow Clone provides instructions, not execution
- You implement the methodologies provided
- Commands work offline (no API needed)
- Use MCP tools to get methodologies, then implement them

## Project-Specific Context

[Add your project-specific instructions here]
\`\`\`
` : ''}

## 4. Create .ai Directory Structure (if requested)
${includeTypes.includes('general') ? `
Create the \`.ai\` directory and add instructions:

\`\`\`bash
mkdir -p .ai
\`\`\`

Then create \`.ai/instructions.md\`:

\`\`\`markdown
# AI Assistant Instructions

## Shadow Clone Integration

This project uses Shadow Clone prompt engineering macros. When working on tasks:

1. Use Shadow Clone MCP tools to get methodologies
2. The tools return instructions for you to follow
3. Implement the patterns provided
4. Shadow Clone enhances your capabilities with professional patterns

## Available Commands via MCP

- \`quick_fix\` - Get bug fix patterns
- \`deploy_specialist_agent\` - Get expert help
- \`code_review_team\` - Get review methodology
- \`generate_tests\` - Get test patterns
- \`create_documentation\` - Get doc templates

## Remember

Shadow Clone is a prompt engineering system. It provides instructions that you implement, not background execution.
\`\`\`
` : ''}

## 5. Create GitHub Copilot Instructions (if requested)
${includeTypes.includes('github') ? `
Create GitHub Copilot configuration:

\`\`\`bash
mkdir -p .github
\`\`\`

Then create \`.github/copilot-instructions.md\`:

\`\`\`markdown
# GitHub Copilot Instructions

## Shadow Clone Commands Available

This workspace has Shadow Clone MCP server installed. Use these tools for professional methodologies:

### MCP Tools
- \`quick_fix [type] "description"\` - Get bug fix patterns
- \`deploy_specialist_agent [type] "task"\` - Get expert help
- \`code_review_team [type]\` - Get review methodology
- \`generate_tests [type]\` - Get test patterns

### Usage Pattern
1. Call the MCP tool to get methodology
2. Read the instructions provided
3. Implement the pattern in your code
4. Follow the professional approach

## Key Point
Shadow Clone provides prompt engineering macros - instructions for you to follow, not background execution.
\`\`\`
` : ''}

## 6. Create VS Code AI Instructions (if requested)
${includeTypes.includes('vscode') ? `
If VS Code is detected, create:

\`\`\`bash
mkdir -p .vscode
\`\`\`

Then create \`.vscode/ai-instructions.md\`:

\`\`\`markdown
# VS Code AI Assistant Instructions

## Shadow Clone MCP Integration

Use Shadow Clone MCP tools to get professional methodologies:

1. **Fix Issues**: \`quick_fix\` tool
2. **Get Expert Help**: \`deploy_specialist_agent\` tool
3. **Review Code**: \`code_review_team\` tool
4. **Generate Tests**: \`generate_tests\` tool

These tools return instructions for you to implement, not execute code.
\`\`\`
` : ''}

## 7. Create General AI Context File

Create \`AI-CONTEXT.md\` in the project root:

\`\`\`markdown
# AI Context for This Project

## Shadow Clone Integration

This project has Shadow Clone MCP server configured. The server provides prompt engineering macros - professional methodologies delivered as instructions.

### What Shadow Clone Does
- Delivers expert patterns and methodologies
- Provides step-by-step instructions
- Enhances AI capabilities with professional approaches

### What It Doesn't Do
- Does NOT execute code in background
- Does NOT manage processes
- You implement the instructions provided

### Usage
Use MCP tools to get methodologies, then implement them in your code.
\`\`\`

## 8. Update .gitignore

Add to \`.gitignore\`:
\`\`\`
# Shadow Clone
.shadow-clone/
.waves/
\`\`\`

## Summary

Workspace initialization complete! The project now has:
${includeTypes.includes('claude') ? '✅ CLAUDE.md - Claude-specific instructions' : ''}
${includeTypes.includes('general') ? '✅ .ai/instructions.md - General AI instructions' : ''}
${includeTypes.includes('github') ? '✅ .github/copilot-instructions.md - GitHub Copilot config' : ''}
${includeTypes.includes('vscode') ? '✅ .vscode/ai-instructions.md - VS Code AI config' : ''}
✅ AI-CONTEXT.md - Universal AI context

AI assistants working in this project will now understand:
- Shadow Clone is available via MCP
- Tools provide prompt engineering methodologies
- They should implement the instructions provided
- No background execution occurs

Next steps:
1. Customize the project-specific sections
2. Commit these files to your repository
3. All AI assistants will now know about Shadow Clone capabilities`;
  }

  private async checkForLocalEnv(): Promise<boolean> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const envPath = path.join(process.cwd(), '.env');
      await fs.access(envPath);
      return true;
    } catch {
      return false;
    }
  }
}