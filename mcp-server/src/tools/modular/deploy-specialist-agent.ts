import { z } from 'zod';
import * as prompts from '../../prompts/content/index.js';
import { deploySpecialistAgentSchema } from '../../schemas/tool-schemas.js';
import { getSpecialistInfo } from './config/specialist-info.js';
import type { ToolDefinition } from './types.js';

export const deploySpecialistAgentDefinition: ToolDefinition = {
  name: 'deploy_specialist_agent',
  description: 'Returns PROMPT ENGINEERING MACROS for specialist simulation - delivers instructions that teach AI expert-level patterns and approaches (NO code execution)',
  inputSchema: {
    type: 'object',
    properties: {
      specialization: {
        type: 'string',
        description: 'Agent expertise area',
        enum: [
          'react_expert',
          'api_designer',
          'database_architect',
          'test_engineer',
          'performance_analyst',
          'security_auditor',
          'code_reviewer',
          'documentation_writer',
        ],
      },
      task: {
        type: 'string',
        description: 'Specific task for the agent',
      },
      context: {
        type: 'string',
        description: 'Additional context (file paths, requirements)',
      },
      deliverables: {
        type: 'array',
        description: 'Expected outputs',
        items: {
          type: 'string',
        },
      },
    },
    required: ['specialization', 'task'],
  },
};

export async function deploySpecialistAgent(
  args: z.infer<typeof deploySpecialistAgentSchema>
): Promise<string> {
  const { specialization, task, context, deliverables } = args;

  const specialistInfo = getSpecialistInfo(specialization);
  const coreRules = prompts.agentCoreRules.content;

  return `
# Shadow Clone Specialist Agent Deployment

You are a ${specialistInfo.title} with deep expertise in ${specialistInfo.expertise}.

## Core Rules
${coreRules}

## Your Specialization
${specialistInfo.description}

## Specific Task
${task}

${context ? `## Additional Context\n${context}\n` : ''}

## Expected Deliverables
${deliverables ? deliverables.map((d: string) => `- ${d}`).join('\n') : '- Complete the assigned task with appropriate outputs'}

## Execution Guidelines
1. Apply your specialized knowledge to solve this specific problem
2. Focus on quality and best practices in your domain
3. Provide clear, actionable solutions
4. Document your approach and reasoning
5. Ensure deliverables meet professional standards

Execute the task using your ${specialization} expertise.
`;
}
