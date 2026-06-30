import { z } from 'zod';
import * as prompts from '../../prompts/content/index.js';
import { createDocumentationSchema } from '../../schemas/tool-schemas.js';
import { getDocumentationConfig } from './config/documentation-config.js';
import type { ToolDefinition } from './types.js';

export const createDocumentationDefinition: ToolDefinition = {
  name: 'create_documentation',
  description: 'Returns PROMPT ENGINEERING MACROS for documentation - delivers instructions that teach AI professional documentation methodologies (NO code execution)',
  inputSchema: {
    type: 'object',
    properties: {
      docType: {
        type: 'string',
        description: 'Documentation type',
        enum: ['api', 'user_guide', 'developer', 'architecture', 'inline'],
      },
      scope: {
        type: 'string',
        description: 'What to document',
      },
      format: {
        type: 'string',
        description: 'Output format',
        enum: ['markdown', 'html', 'openapi', 'jsdoc'],
      },
      audience: {
        type: 'string',
        description: 'Target audience',
        enum: ['developers', 'users', 'architects', 'general'],
      },
    },
    required: ['docType', 'scope'],
  },
};

export async function createDocumentation(
  args: z.infer<typeof createDocumentationSchema>
): Promise<string> {
  const { docType, scope, format, audience } = args;
  const outputFormat = format || 'markdown';
  const targetAudience = audience || 'developers';
  const coreRules = prompts.agentCoreRules.content;
  const docConfig = getDocumentationConfig(docType);

  return `
# Shadow Clone Documentation Generation

Creating ${docType} documentation for specified scope.

## Core Rules
${coreRules}

## Documentation Parameters
- Type: ${docType}
- Scope: ${scope}
- Format: ${outputFormat}
- Audience: ${targetAudience}

## Documentation Specialist Team
${docConfig.specialists.map((spec: string, i: number) => `- Specialist ${i + 1}: ${spec}`).join('\n')}

## Documentation Guidelines
${docConfig.guidelines}

## Content Requirements
1. Comprehensive coverage of the scope
2. Clear and concise writing
3. Appropriate depth for ${targetAudience}
4. Proper formatting for ${outputFormat}
5. Examples and code samples where relevant

## Structure
${docConfig.structure}

## Quality Standards
- Accuracy and technical correctness
- Clarity and readability
- Completeness without redundancy
- Proper organization and flow
- Consistent style and terminology

Generate ${docType} documentation in ${outputFormat} format.
`;
}
