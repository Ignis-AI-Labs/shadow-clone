import { AuthService } from '../auth/authService.js';
import * as prompts from '../prompts/content/index.js';

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
        description: 'Execute Shadow Clone orchestration with specified parameters',
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
        description: 'Create a comprehensive project plan without writing code',
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
            },
          },
          required: ['projectVision'],
        },
      },
      {
        name: 'get_agent_template',
        description: 'Get agent behavior templates for specific roles',
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
        return this.getAgentTemplate(args.templateType);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async executeOrchestration(args: any): Promise<string> {
    const { mode, projectDescription, projectPlan, wavesDirectory, maxAgentsPerWave } = args;
    
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
    const { projectVision, wavesDirectory } = args;
    
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

  private getAgentTemplate(templateType: string): string {
    const templateMap: Record<string, any> = {
      'core_rules': prompts.agent_core_rules,
      'agent_template': prompts.agent_agent_template,
      'team_templates': prompts.template_team_agent_templates,
    };
    
    const template = templateMap[templateType];
    if (!template || !template.content) {
      throw new Error(`Unknown template: ${templateType}`);
    }
    
    return `# Shadow Clone Agent Template: ${templateType}\n\n${template.content}`;
  }
}