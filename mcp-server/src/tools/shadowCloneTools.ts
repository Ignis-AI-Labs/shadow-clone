import { AuthService } from '../auth/authService.js';
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

export class ShadowCloneTools {
  constructor(private authService: AuthService) {}

  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'authenticate',
        description: 'Authenticate with your Shadow Clone API key',
        inputSchema: {
          type: 'object',
          properties: {
            apiKey: {
              type: 'string',
              description: 'Your Shadow Clone API key from dashboard.ignislabs.ai',
            },
          },
          required: ['apiKey'],
        },
      },
      {
        name: 'fetch_shadow_clone_prompt',
        description: 'Fetch the main Shadow Clone orchestration prompt',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'fetch_mode_prompt',
        description: 'Fetch a specific mode prompt (plan, feature, debug, etc.)',
        inputSchema: {
          type: 'object',
          properties: {
            mode: {
              type: 'string',
              description: 'The mode to fetch (plan, feature, debug, optimize, refactor, audit, research)',
              enum: ['plan', 'feature', 'debug', 'optimize', 'refactor', 'audit', 'research'],
            },
          },
          required: ['mode'],
        },
      },
      {
        name: 'list_available_modes',
        description: 'List all available Shadow Clone execution modes',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'build_shadow_clone_command',
        description: 'Build a complete Shadow Clone command with parameters',
        inputSchema: {
          type: 'object',
          properties: {
            mode: {
              type: 'string',
              description: 'Execution mode',
              enum: ['plan', 'feature', 'debug', 'optimize', 'refactor', 'audit', 'research'],
            },
            projectPlan: {
              type: 'string',
              description: 'Path to project plan file (optional)',
            },
            wavesDirectory: {
              type: 'string',
              description: 'Directory for wave outputs (default: ./.waves/)',
            },
            maxAgents: {
              type: 'number',
              description: 'Maximum agents per wave (default: 10)',
            },
          },
          required: ['mode'],
        },
      },
      {
        name: 'get_template',
        description: 'Get a Shadow Clone template file',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Template category',
              enum: ['agent_rules', 'coordination_rules', 'templates'],
            },
            filename: {
              type: 'string',
              description: 'Template filename',
            },
          },
          required: ['category', 'filename'],
        },
      },
    ];
  }

  async executeTool(name: string, args: any): Promise<string> {
    switch (name) {
      case 'fetch_shadow_clone_prompt':
        return this.fetchMainPrompt();
      
      case 'fetch_mode_prompt':
        return this.fetchModePrompt(args.mode);
      
      case 'list_available_modes':
        return this.listModes();
      
      case 'build_shadow_clone_command':
        return this.buildCommand(args);
      
      case 'get_template':
        return this.getTemplate(args.category, args.filename);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async fetchMainPrompt(): Promise<string> {
    try {
      const response = await this.authService.makeAuthenticatedRequest(
        `${this.authService.getApiEndpoint()}/api/prompts/shadow-clone`
      );
      
      const content = typeof response.data === 'string' ? response.data : response.data.content;
      return `# Shadow Clone Orchestration Prompt\n\n${content}`;
    } catch (error) {
      logger.error('Failed to fetch main prompt:', error);
      throw new Error('Failed to fetch Shadow Clone prompt. Please check your authentication.');
    }
  }

  private async fetchModePrompt(mode: string): Promise<string> {
    try {
      const response = await this.authService.makeAuthenticatedRequest(
        `${this.authService.getApiEndpoint()}/api/prompts/modes/${mode}`
      );
      
      const content = typeof response.data === 'string' ? response.data : response.data.content;
      return `# Shadow Clone ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode\n\n${content}`;
    } catch (error) {
      logger.error(`Failed to fetch ${mode} mode prompt:`, error);
      throw new Error(`Failed to fetch ${mode} mode prompt. Please check if the mode exists.`);
    }
  }

  private async listModes(): Promise<string> {
    try {
      const response = await this.authService.makeAuthenticatedRequest(
        `${this.authService.getApiEndpoint()}/api/prompts/modes`
      );
      
      const modes = Array.isArray(response.data) ? response.data : response.data.modes || [];
      
      return `# Available Shadow Clone Modes\n\n${modes.map((mode: string) => {
        const descriptions: Record<string, string> = {
          'plan': 'Create comprehensive project plan without coding',
          'feature': 'Build new features with AI agent teams',
          'debug': 'Fix issues with systematic debugging',
          'optimize': 'Performance improvements and optimization',
          'refactor': 'Improve code quality and structure',
          'audit': 'Security and quality assessment',
          'research': 'Analyze codebase without changes'
        };
        return `- **${mode}**: ${descriptions[mode] || 'Custom Shadow Clone mode'}`;
      }).join('\n')}`;
    } catch (error) {
      logger.error('Failed to list modes:', error);
      throw new Error('Failed to list available modes.');
    }
  }

  private async buildCommand(args: any): Promise<string> {
    const { mode, projectPlan, wavesDirectory, maxAgents } = args;
    
    const params: string[] = [];
    
    params.push(`mode=${mode}`);
    
    if (projectPlan) {
      params.push(`project_plan=${projectPlan}`);
    }
    
    params.push(`waves_directory=${wavesDirectory || './.waves/'}`);
    
    if (maxAgents) {
      params.push(`max_agents_per_wave=${maxAgents}`);
    }
    
    const apiEndpoint = this.authService.getApiEndpoint();
    
    return `# Shadow Clone Command

## 1. First, fetch the Shadow Clone orchestration system:
\`\`\`bash
curl -X GET ${apiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: YOUR_API_KEY"
\`\`\`

## 2. Then fetch the ${mode} mode configuration:
\`\`\`bash
curl -X GET ${apiEndpoint}/api/prompts/modes/${mode} -H "X-API-Key: YOUR_API_KEY"
\`\`\`

## 3. Execute with parameters:
\`\`\`
${params.join(' ')}
\`\`\`

## Complete Command Structure:
Load the Shadow Clone prompt and ${mode} mode, then execute with the above parameters to deploy AI agent teams for your ${mode} task.

Note: Replace YOUR_API_KEY with your actual Shadow Clone API key.`;
  }

  private async getTemplate(category: string, filename: string): Promise<string> {
    try {
      const response = await this.authService.makeAuthenticatedRequest(
        `${this.authService.getApiEndpoint()}/api/prompts/${category}/${filename}`
      );
      
      const content = typeof response.data === 'string' ? response.data : response.data.content;
      return `# Shadow Clone Template: ${category}/${filename}\n\n${content}`;
    } catch (error) {
      logger.error(`Failed to fetch template ${category}/${filename}:`, error);
      throw new Error(`Failed to fetch template. Please check the category and filename.`);
    }
  }
}