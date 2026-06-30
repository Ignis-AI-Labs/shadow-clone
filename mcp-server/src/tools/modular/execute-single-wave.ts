import { z } from 'zod';
import * as prompts from '../../prompts/content/index.js';
import { executeSingleWaveSchema } from '../../schemas/tool-schemas.js';
import { getWaveConfiguration } from './config/wave-configuration.js';
import type { ToolDefinition } from './types.js';

export const executeSingleWaveDefinition: ToolDefinition = {
  name: 'execute_single_wave',
  description: 'Returns PROMPT ENGINEERING MACROS for wave execution - delivers instructions that teach AI focused workflows for project phases (NO code execution)',
  inputSchema: {
    type: 'object',
    properties: {
      waveType: {
        type: 'string',
        description: 'Type of wave to execute',
        enum: ['research', 'planning', 'implementation', 'testing', 'documentation', 'review'],
      },
      scope: {
        type: 'string',
        description: 'What to focus on',
      },
      inputs: {
        type: 'array',
        description: 'Any required input files or data',
        items: {
          type: 'string',
        },
      },
      maxAgents: {
        type: 'number',
        description: 'Number of agents to deploy',
        minimum: 1,
        maximum: 10,
      },
    },
    required: ['waveType', 'scope'],
  },
};

export async function executeSingleWave(
  args: z.infer<typeof executeSingleWaveSchema>
): Promise<string> {
  const { waveType, scope, inputs, maxAgents } = args;
  const agentCount = maxAgents || 4;
  const inputContext = inputs ? `\n\n## Input Context\n${inputs.join('\n')}` : '';
  const coreRules = prompts.agentCoreRules.content;
  const waveConfig = getWaveConfiguration(waveType);

  return `
# Shadow Clone Single Wave Execution

Executing a focused ${waveType} wave with ${agentCount} specialized agents.

## Core Rules
${coreRules}

## Wave Configuration
${waveConfig.description}

## Wave Objective
${scope}
${inputContext}

## Agent Team Composition
${waveConfig.agents.slice(0, agentCount).map((agent: string, i: number) => `- Agent ${i + 1}: ${agent}`).join('\n')}

## Execution Protocol
1. Work collaboratively on the defined scope
2. Focus on ${waveType} deliverables only
3. Complete all work within this single wave
4. No prerequisites or follow-up waves needed
5. Produce concrete, actionable outputs

## Expected Deliverables
${waveConfig.deliverables.join('\n')}

## Quality Standards
- Follow Shadow Clone quality principles
- Ensure completeness within wave scope
- Produce professional-grade outputs
- Document decisions and rationale

Execute the ${waveType} wave for the specified scope.
`;
}
