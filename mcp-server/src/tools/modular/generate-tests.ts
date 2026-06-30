import { z } from 'zod';
import * as prompts from '../../prompts/content/index.js';
import { generateTestsSchema } from '../../schemas/tool-schemas.js';
import { getTestingGuidelines, getDefaultFramework } from './config/testing-guidelines.js';
import type { ToolDefinition } from './types.js';

export const generateTestsDefinition: ToolDefinition = {
  name: 'generate_tests',
  description: 'Returns PROMPT ENGINEERING MACROS for test generation - delivers instructions that teach AI professional testing methodologies (NO code execution)',
  inputSchema: {
    type: 'object',
    properties: {
      testType: {
        type: 'string',
        description: 'Type of tests to generate',
        enum: ['unit', 'integration', 'e2e', 'performance', 'security'],
      },
      targetFiles: {
        type: 'array',
        description: 'Files to test',
        items: {
          type: 'string',
        },
      },
      framework: {
        type: 'string',
        description: 'Testing framework to use',
      },
      coverage: {
        type: 'number',
        description: 'Target coverage percentage',
        minimum: 0,
        maximum: 100,
      },
    },
    required: ['testType', 'targetFiles'],
  },
};

export async function generateTests(
  args: z.infer<typeof generateTestsSchema>
): Promise<string> {
  const { testType, targetFiles, framework, coverage } = args;
  const testingFramework = framework || getDefaultFramework(testType);
  const targetCoverage = coverage || 80;
  const coreRules = prompts.agentCoreRules.content;

  return `
# Shadow Clone Test Generation Deployment

Creating ${testType} tests for specified code.

## Core Rules
${coreRules}

## Test Generation Parameters
- Test Type: ${testType}
- Target Files: ${targetFiles.join(', ')}
- Framework: ${testingFramework}
- Target Coverage: ${targetCoverage}%

## Test Creation Guidelines
${getTestingGuidelines(testType)}

## Quality Standards
1. Tests must be comprehensive and meaningful
2. Cover edge cases and error scenarios
3. Use clear, descriptive test names
4. Include setup and teardown where needed
5. Mock external dependencies appropriately
6. Ensure tests are maintainable and readable

## Deliverables
- Test files using ${testingFramework}
- Coverage report showing ${targetCoverage}% or higher
- Documentation of test scenarios
- Any necessary test utilities or helpers
- Setup instructions if needed

Generate comprehensive ${testType} tests for the target files.
`;
}
