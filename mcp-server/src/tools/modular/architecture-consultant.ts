import { z } from 'zod';
import * as prompts from '../../prompts/content/index.js';
import { architectureConsultantSchema } from '../../schemas/tool-schemas.js';
import { getConsultationConfig } from './config/consultation-config.js';
import type { ToolDefinition } from './types.js';

export const architectureConsultantDefinition: ToolDefinition = {
  name: 'architecture_consultant',
  description: 'Returns PROMPT ENGINEERING MACROS for architecture consultation - delivers instructions that teach AI expert design analysis (NO code execution)',
  inputSchema: {
    type: 'object',
    properties: {
      consultationType: {
        type: 'string',
        description: 'Type of consultation',
        enum: ['design_review', 'pattern_recommendation', 'scalability_analysis', 'migration_planning'],
      },
      context: {
        type: 'string',
        description: 'Current system description',
      },
      constraints: {
        type: 'string',
        description: 'Any limitations or requirements',
      },
      goals: {
        type: 'array',
        description: 'Specific goals to achieve',
        items: {
          type: 'string',
        },
      },
    },
    required: ['consultationType', 'context'],
  },
};

export async function architectureConsultant(
  args: z.infer<typeof architectureConsultantSchema>
): Promise<string> {
  const { consultationType, context, constraints, goals } = args;
  const consultationGoals = goals ? goals.join('\n- ') : 'Provide comprehensive architectural guidance';
  const coreRules = prompts.agentCoreRules.content;
  const consultConfig = getConsultationConfig(consultationType);

  return `
# Shadow Clone Architecture Consultation

Providing expert ${consultationType} consultation.

## Core Rules
${coreRules}

## Consultation Type
${consultConfig.description}

## Current System Context
${context}

${constraints ? `## Constraints & Requirements\n${constraints}\n` : ''}

## Consultation Goals
- ${consultationGoals}

## Expert Panel
${consultConfig.experts.map((expert: string, i: number) => `- Expert ${i + 1}: ${expert}`).join('\n')}

## Analysis Framework
${consultConfig.framework}

## Deliverables
1. Executive summary of findings
2. Detailed analysis with rationale
3. Specific recommendations
4. Implementation roadmap
5. Risk assessment and mitigation
6. Alternative approaches (if applicable)

## Consultation Process
1. Analyze current state thoroughly
2. Identify strengths and weaknesses
3. Apply best practices and patterns
4. Consider constraints and goals
5. Provide actionable recommendations
6. Include implementation guidance

Execute the ${consultationType} consultation.
`;
}
