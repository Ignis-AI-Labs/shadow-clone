import * as fs from 'fs/promises';
import * as fsSync from 'fs';
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
      // All filesystem operations below use O_NOFOLLOW (via the
      // *NoFollow helpers) and lstat-then-mkdir (non-recursive) for
      // subdirectories. This closes AUDIT-002 / AUDIT-005 / CWE-59 +
      // CWE-367: an attacker who plants a symlink at
      // <projectPath>/CLAUDE.md → /etc/cron.d/legit no longer hits
      // the symlink target — the open() syscall fails with ELOOP.

      // 1. Ensure .gitignore has Shadow Clone patterns
      const gitignorePath = path.join(projectPath, '.gitignore');
      const existingGitignore = await this.readNoFollow(gitignorePath);
      if (existingGitignore === null) {
        await this.writeNoFollow(gitignorePath, '# Shadow Clone\n.shadow-clone/\n.waves/\n');
        results.push('Created .gitignore');
      } else if (
        !existingGitignore.includes('.shadow-clone/') ||
        !existingGitignore.includes('.waves/')
      ) {
        await this.appendNoFollow(gitignorePath, '\n# Shadow Clone\n.shadow-clone/\n.waves/\n');
        results.push('Updated .gitignore');
      }

      // 2. Create CLAUDE.md
      if (includeTypes.includes('claude')) {
        const claudePath = path.join(projectPath, 'CLAUDE.md');
        const claudeContent = this.getClaudeContent();
        const existingClaude = await this.readNoFollow(claudePath);

        if (existingClaude === null) {
          await this.writeNoFollow(claudePath, claudeContent);
          results.push('Created CLAUDE.md');
        } else if (overwrite) {
          await this.writeNoFollow(claudePath, claudeContent);
          results.push('Overwrote CLAUDE.md with Shadow Clone instructions');
        } else if (!existingClaude.includes('Shadow Clone')) {
          await this.appendNoFollow(claudePath, '\n\n' + claudeContent);
          results.push('Appended Shadow Clone instructions to existing CLAUDE.md');
        } else {
          results.push('CLAUDE.md already has Shadow Clone instructions');
        }
      }

      // 3. Create .ai/instructions.md
      if (includeTypes.includes('general')) {
        const aiDir = path.join(projectPath, '.ai');
        await this.ensureRealDir(aiDir);
        const aiPath = path.join(aiDir, 'instructions.md');
        await this.writeNoFollow(aiPath, this.getAIInstructionsContent());
        results.push('Created .ai/instructions.md');
      }

      // 4. Create .github/copilot-instructions.md
      if (includeTypes.includes('github')) {
        const githubDir = path.join(projectPath, '.github');
        await this.ensureRealDir(githubDir);
        const copilotPath = path.join(githubDir, 'copilot-instructions.md');
        await this.writeNoFollow(copilotPath, this.getCopilotContent());
        results.push('Created .github/copilot-instructions.md');
      }

      // 5. Create .vscode/ai-instructions.md
      if (includeTypes.includes('vscode')) {
        const vscodeDir = path.join(projectPath, '.vscode');
        await this.ensureRealDir(vscodeDir);
        const vscodePath = path.join(vscodeDir, 'ai-instructions.md');
        await this.writeNoFollow(vscodePath, this.getVSCodeContent());
        results.push('Created .vscode/ai-instructions.md');
      }

    } catch (error: unknown) {
      // Re-throw McpError(InvalidParams, ...) — those already carry a
      // path-free, safe-to-disclose message (e.g. "destination
      // directory exists as a symlink") so the MCP client can
      // distinguish a planted-symlink refusal from a permission error.
      // Only raw fs errors fall through to the generic CWE-209-safe
      // message; their detail goes to server logs via winston.
      if (error instanceof McpError) {
        throw error;
      }
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

  // -------------------------------------------------------------------------
  // Symlink-safe filesystem helpers (AUDIT-002 / AUDIT-005, CWE-59 + CWE-367).
  // Every write goes through O_NOFOLLOW; every directory creation lstat-checks
  // the existing path first and refuses if it is a symlink. The kernel's
  // ELOOP on a symlinked target file is what makes these safe — Node's
  // path-based fs.writeFile/appendFile/readFile transparently follow links.
  // -------------------------------------------------------------------------

  /**
   * Ensure `dir` exists as a real (non-symlink) directory. If it already
   * exists and is a symlink (or a non-directory), throws. The parent dir
   * (the caller's `projectPath`) has already been path-confined; this
   * helper does NOT mkdir recursively, so a hostile symlink at an
   * intermediate ancestor cannot redirect the create.
   */
  private async ensureRealDir(dir: string): Promise<void> {
    try {
      const st = await fs.lstat(dir);
      if (st.isSymbolicLink()) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'destination directory exists as a symlink; refusing to follow'
        );
      }
      if (!st.isDirectory()) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'destination directory path exists but is not a directory'
        );
      }
      return;
    } catch (err) {
      // Pass McpError straight through — without this guard, the
      // string-vs-numeric `code` shape difference would silently
      // route a symlink-rejection McpError into the mkdir fallback.
      // Mirrors the R2-F8 pattern in the outer initializeWorkspace catch.
      if (err instanceof McpError) throw err;
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
    }
    // Non-recursive: the parent must already exist (it's the validated
    // projectPath). Refuse to mkdir a chain of dirs through unknown
    // intermediates.
    await fs.mkdir(dir);
  }

  /**
   * Create/truncate `filePath` with O_NOFOLLOW. If the path is a
   * symlink, the open() syscall fails with ELOOP — defeats AUDIT-002.
   */
  private async writeNoFollow(filePath: string, content: string): Promise<void> {
    const flags =
      fsSync.constants.O_WRONLY |
      fsSync.constants.O_CREAT |
      fsSync.constants.O_TRUNC |
      fsSync.constants.O_NOFOLLOW;
    const handle = await fs.open(filePath, flags, 0o644);
    try {
      await handle.writeFile(content);
    } finally {
      await handle.close();
    }
  }

  /**
   * Append to `filePath` with O_NOFOLLOW. Creates the file if missing
   * (O_CREAT); refuses if the path is a symlink (ELOOP).
   */
  private async appendNoFollow(filePath: string, content: string): Promise<void> {
    const flags =
      fsSync.constants.O_WRONLY |
      fsSync.constants.O_CREAT |
      fsSync.constants.O_APPEND |
      fsSync.constants.O_NOFOLLOW;
    const handle = await fs.open(filePath, flags, 0o644);
    try {
      await handle.writeFile(content);
    } finally {
      await handle.close();
    }
  }

  /**
   * Read `filePath` without following symlinks. Returns the content on
   * success, `null` if the file does not exist (ENOENT). Other errors
   * (including ELOOP on a symlinked path) propagate.
   */
  private async readNoFollow(filePath: string): Promise<string | null> {
    const flags = fsSync.constants.O_RDONLY | fsSync.constants.O_NOFOLLOW;
    let handle: import('fs/promises').FileHandle;
    try {
      handle = await fs.open(filePath, flags);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw err;
    }
    try {
      return await handle.readFile('utf-8');
    } finally {
      await handle.close();
    }
  }
}
