import { z } from 'zod';
import * as prompts from '../../prompts/content/index.js';
import { codeReviewTeamSchema } from '../../schemas/tool-schemas.js';
import { getReviewFocus } from './config/review-focus.js';
import type { ToolDefinition } from './types.js';

export const codeReviewTeamDefinition: ToolDefinition = {
  name: 'code_review_team',
  description: 'Returns PROMPT ENGINEERING MACROS for code review - delivers instructions that teach AI how to perform professional code reviews (NO code execution)',
  inputSchema: {
    type: 'object',
    properties: {
      reviewType: {
        type: 'string',
        description: 'Focus area',
        enum: ['security', 'performance', 'quality', 'architecture', 'comprehensive', 'fp_compliance'],
      },
      files: {
        type: 'array',
        description: 'Files or directories to review',
        items: {
          type: 'string',
        },
      },
      standards: {
        type: 'string',
        description: 'Specific standards to check against',
      },
    },
    required: ['reviewType', 'files'],
  },
};

export async function codeReviewTeam(
  args: z.infer<typeof codeReviewTeamSchema>
): Promise<string> {
  const { reviewType, files, standards } = args;
  const reviewFocus = getReviewFocus(reviewType);
  const coreRules = prompts.agentCoreRules.content;

  return `
# Shadow Clone Code Review Team Deployment

Conducting ${reviewType} review of specified code.

## Core Rules
${coreRules}

## Review Scope
- Review Type: ${reviewType}
- Files/Directories: ${files.join(', ')}
${standards ? `- Standards: ${standards}` : ''}

## Review Focus Areas
${reviewFocus}

## Review Process
1. Analyze code systematically
2. Identify issues based on review type
3. Provide specific, actionable feedback
4. Suggest improvements with examples
5. Prioritize findings by severity

## Mandatory Checks (all reviews)
Regardless of review type, every review must include:
1. **FP compliance**: Are functions pure? Is state immutable? Are side effects isolated?
2. **Size limits**: Functions under 50 lines? Files under 300 lines?
3. **Branching protocol**: Work on {name}/dev, PRs target dev, conventional commits?
4. **Task-first**: Does the PR reference a task ID from TASKS-*.md?

## Deliverables
Create a comprehensive review report including:
- Executive summary of findings
- Detailed issue list with severity levels
- Code examples of problems found
- Recommended fixes with code samples
- Overall code quality assessment
- Action items prioritized by impact
- Mandatory check results (FP, size, branching, task ID)

Execute the ${reviewType} code review.
`;
}
