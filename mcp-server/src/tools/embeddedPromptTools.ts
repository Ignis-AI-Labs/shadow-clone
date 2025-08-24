import { AuthService } from '../auth/authService.js';
import { ApiKeyManager } from '../auth/apiKeyManager.js';
import * as prompts from '../prompts/content/index.js';
import { validateString, validateEnum, validateNumber, validatePath } from '../utils/validation.js';

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export class EmbeddedPromptTools {
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
        name: 'shadow_clone_orchestrate',
        description: 'Returns PROMPT ENGINEERING MACROS for AI orchestration - delivers instructions that teach AI how to simulate expert teams (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {
            mode: {
              type: 'string',
              description: 'Execution mode',
              enum: ['plan', 'feature', 'debug', 'optimize', 'refactor', 'audit', 'research'],
            },
            projectDescription: {
              type: 'string',
              description: 'Description of what you want to accomplish',
            },
            projectPlan: {
              type: 'string',
              description: 'Path to project plan file (optional)',
            },
            wavesDirectory: {
              type: 'string',
              description: 'Directory for wave outputs (default: ./.waves/)',
              default: './.waves/',
            },
            maxAgentsPerWave: {
              type: 'number',
              description: 'Maximum agents per wave (default: 10)',
            },
          },
          required: ['mode', 'projectDescription'],
        },
      },
      {
        name: 'shadow_clone_plan',
        description: 'Returns PROMPT ENGINEERING MACROS for project planning - delivers instructions that teach AI professional planning methodologies (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {
            projectVision: {
              type: 'string',
              description: 'Your project idea, goals, and high-level requirements',
            },
            wavesDirectory: {
              type: 'string',
              description: 'Directory for planning outputs (default: ./.waves/)',
              default: './.waves/',
            },
          },
          required: ['projectVision'],
        },
      },
      {
        name: 'api_key_status',
        description: 'Check API key cache status and storage locations - shows where your key is stored (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'get_agent_template',
        description: 'Returns PROMPT ENGINEERING TEMPLATES for agent behaviors - delivers instructions that teach AI how to adopt specialized expert roles (NO code execution)',
        inputSchema: {
          type: 'object',
          properties: {
            templateType: {
              type: 'string',
              description: 'Type of agent template',
              enum: ['core_rules', 'agent_template', 'team_templates'],
            },
          },
          required: ['templateType'],
        },
      },
    ];
  }

  async executeTool(name: string, args: any): Promise<string> {
    switch (name) {
      case 'shadow_clone_orchestrate':
        return this.executeOrchestration(args);
      
      case 'shadow_clone_plan':
        return this.executePlanning(args);
      
      case 'get_agent_template':
        return this.getAgentTemplate(args?.templateType);
      
      case 'api_key_status':
        return this.getApiKeyStatus();
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async executeOrchestration(args: any): Promise<string> {
    // Validate inputs
    const mode = validateEnum(args.mode, 'mode', 
      ['plan', 'feature', 'debug', 'optimize', 'refactor', 'audit', 'research'] as const,
      { required: true }
    )!;
    
    const projectDescription = validateString(args.projectDescription, 'projectDescription', {
      required: true,
      minLength: 10,
      maxLength: 5000
    })!;
    
    const projectPlan = validatePath(args.projectPlan, 'projectPlan');
    const wavesDirectory = validatePath(args.wavesDirectory, 'wavesDirectory') || './.waves/';
    const maxAgentsPerWave = validateNumber(args.maxAgentsPerWave, 'maxAgentsPerWave', {
      min: 1,
      max: 20,
      integer: true
    }) || 10;
    
    // Get the main orchestration prompt
    const mainPrompt = prompts.content;
    
    // Get the mode-specific configuration
    const modeConfig = this.getModeConfig(mode);
    
    // Build the complete execution prompt
    const executionPrompt = `
${mainPrompt}

## Mode Configuration
${modeConfig}

## Execution Parameters
- mode: ${mode}
- project_plan: ${projectPlan || 'inline'}
- waves_directory: ${wavesDirectory || './.waves/'}
- max_agents_per_wave: ${maxAgentsPerWave || 10}

## Project Description
${projectDescription}

## Instructions
Execute the Shadow Clone orchestration system with the above parameters and project description. Deploy agent teams according to the ${mode} mode configuration.
`;

    return executionPrompt;
  }

  private async executePlanning(args: any): Promise<string> {
    // Validate inputs
    const projectVision = validateString(args.projectVision, 'projectVision', {
      required: true,
      minLength: 20,
      maxLength: 10000
    })!;
    
    const wavesDirectory = validatePath(args.wavesDirectory, 'wavesDirectory') || './.waves/';
    
    // Get planning mode config
    const planConfig = this.getModeConfig('plan');
    
    // Get the main orchestration prompt
    const mainPrompt = prompts.content;
    
    return `
${mainPrompt}

## Planning Mode Activated
${planConfig}

## Project Vision
${projectVision}

## Execution Parameters
- mode: plan
- waves_directory: ${wavesDirectory || './.waves/'}
- max_agents_per_wave: 10

## Instructions
Execute Shadow Clone in Planning Mode to create a comprehensive project architecture and implementation plan. NO CODE should be written - only planning documents.
`;
  }

  private getModeConfig(mode: string): string {
    const modeMap: Record<string, any> = {
      'plan': prompts.mode_plan,
      'feature': prompts.mode_feature,
      'debug': prompts.mode_debug,
      'optimize': prompts.mode_optimize,
      'refactor': prompts.mode_refactor,
      'audit': prompts.mode_audit,
      'research': prompts.mode_research,
    };
    
    const modeModule = modeMap[mode];
    if (!modeModule || !modeModule.content) {
      throw new Error(`Unknown mode: ${mode}`);
    }
    
    return modeModule.content;
  }

  private getAgentTemplate(templateType: string | undefined): string {
    // Validate template type
    const validatedType = validateEnum(templateType, 'templateType',
      ['core_rules', 'agent_template', 'team_templates'] as const,
      { required: true }
    )!;
    const templateMap: Record<string, any> = {
      'core_rules': prompts.agent_core_rules,
      'agent_template': prompts.agent_agent_template,
      'team_templates': prompts.template_team_agent_templates,
    };
    
    const template = templateMap[validatedType];
    if (!template || !template.content) {
      throw new Error(`Unknown template: ${validatedType}`);
    }
    
    return `# Shadow Clone Agent Template: ${validatedType}\n\n${template.content}`;
  }
  
  private async getApiKeyStatus(): Promise<string> {
    const apiKeyManager = ApiKeyManager.getInstance();
    const storageInfo = await apiKeyManager.getStorageInfo();
    const apiKey = await apiKeyManager.getApiKey();
    const isAuthenticated = await this.authService.isAuthenticated();
    const licenseType = await this.authService.getLicenseType();
    
    return `# Shadow Clone API Key Status

## Current Status
- **Authenticated**: ${isAuthenticated ? '✅ Yes' : '❌ No'}
- **License Type**: ${licenseType || 'Not authenticated'}
- **API Key Found**: ${apiKey ? '✅ Yes (cached)' : '❌ No'}

## Storage Locations Checked
${storageInfo.locations.map(loc => `- ${loc}`).join('\n')}

## Currently Using
${storageInfo.current ? `✅ ${storageInfo.current}` : '❌ No API key found'}

## How API Keys Are Cached

Shadow Clone automatically caches your API key in multiple locations for convenience:

1. **Environment Variable** (SHADOW_CLONE_API_KEY) - Highest priority
2. **Local .env file** - Project-specific, git-ignored
3. **Global config** (~/.shadow-clone/config.json) - User-wide
4. **Memory cache** - Session only

When you authenticate, your key is saved to all locations automatically.

## Validation Schedule
- Keys are revalidated every 5 minutes when used
- NFT ownership is checked in real-time
- Invalid keys are automatically cleared

## Need a New API Key?
Visit https://dashboard.ignislabs.ai to get or regenerate your API key.

${!apiKey ? `
## Quick Fix
To authenticate, use:
\`\`\`
authenticate apiKey="your-api-key-here"
\`\`\`
` : ''}`;
  }
}