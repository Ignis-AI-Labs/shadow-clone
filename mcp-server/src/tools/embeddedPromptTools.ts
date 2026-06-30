import { z } from 'zod';
import * as prompts from '../prompts/content/index.js';
import {
  shadowCloneOrchestrateSchema,
  shadowClonePlanSchema,
  getAgentTemplateSchema,
} from '../schemas/toolSchemas.js';

// Note: this file used to call utils/validation `validate*` helpers
// inline. They're gone — zod validation runs centrally in
// combinedTools.executeTool via validateToolInput, and the schema
// types flow in through `z.infer<...>` on each handler. Local
// re-validation would be redundant and would mask Rule 6
// "no silent failures" by re-running the same checks against
// already-narrowed data.

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// The content modules in prompts/content/*.ts all expose a `content`
// string; widening to a structural type avoids `any` while still
// matching every module without changing their public shape.
interface PromptModule {
  content: string;
}

export class EmbeddedPromptTools {
  getToolDefinitions(): ToolDefinition[] {
    return [
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

  async executeTool(name: string, args: unknown): Promise<string> {
    // Contract: this method is intended to be called ONLY by
    // combinedTools.executeTool, which runs validateToolInput()
    // (zod schema + path-confinement) on `args` before forwarding.
    // The casts below narrow to the per-handler inferred shape on
    // that load-bearing invariant — direct external callers that
    // skip the combined dispatcher would defeat input validation
    // and must not be added.
    switch (name) {
      case 'shadow_clone_orchestrate':
        return this.executeOrchestration(args as z.infer<typeof shadowCloneOrchestrateSchema>);

      case 'shadow_clone_plan':
        return this.executePlanning(args as z.infer<typeof shadowClonePlanSchema>);

      case 'get_agent_template': {
        const a = args as z.infer<typeof getAgentTemplateSchema> | undefined;
        return this.getAgentTemplate(a?.templateType);
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async executeOrchestration(args: z.infer<typeof shadowCloneOrchestrateSchema>): Promise<string> {
    // args is already schema-validated (enum, length, path-confinement)
    // by validateToolInput in combinedTools.executeTool.
    const { mode, projectDescription, projectPlan } = args;
    const wavesDirectory = args.wavesDirectory || './.waves/';
    const maxAgentsPerWave = args.maxAgentsPerWave || 10;

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

  private async executePlanning(args: z.infer<typeof shadowClonePlanSchema>): Promise<string> {
    // args is already schema-validated by validateToolInput.
    const projectVision = args.projectVision;
    const wavesDirectory = args.wavesDirectory || './.waves/';

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
    const modeMap: Record<string, PromptModule> = {
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

  private getAgentTemplate(templateType: z.infer<typeof getAgentTemplateSchema>['templateType'] | undefined): string {
    // `templateType` is already enum-validated by validateToolInput
    // when set; we only need to enforce required-ness here.
    if (!templateType) {
      throw new Error('templateType is required');
    }
    const templateMap: Record<string, PromptModule> = {
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
