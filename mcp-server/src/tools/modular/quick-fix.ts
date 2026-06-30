import { z } from 'zod';
import * as prompts from '../../prompts/content/index.js';
import { quickFixSchema } from '../../schemas/tool-schemas.js';
import { getIssueGuidance } from './config/issue-guidance.js';
import type { ToolDefinition } from './types.js';

export const quickFixDefinition: ToolDefinition = {
  name: 'quick_fix',
  description: 'Returns PROMPT ENGINEERING MACROS for problem-solving - delivers instructions that teach AI professional debugging methodologies (NO code execution)',
  inputSchema: {
    type: 'object',
    properties: {
      issueType: {
        type: 'string',
        description: 'Type of issue',
        enum: ['bug', 'style', 'logic', 'performance', 'security'],
      },
      description: {
        type: 'string',
        description: 'Issue description',
      },
      filePath: {
        type: 'string',
        description: 'Affected file(s)',
      },
      urgency: {
        type: 'string',
        description: 'Priority level',
        enum: ['low', 'medium', 'high', 'critical'],
      },
    },
    required: ['issueType', 'description'],
  },
};

export async function quickFix(
  args: z.infer<typeof quickFixSchema>
): Promise<string> {
  const { issueType, description, filePath, urgency } = args;
  const urgencyLevel = urgency || 'high';
  const coreRules = prompts.agentCoreRules.content;

  return `
# Shadow Clone Quick Fix Deployment

Urgent ${issueType} fix required - ${urgencyLevel} priority.

## Core Rules
${coreRules}

## Issue Details
- Type: ${issueType}
- Description: ${description}
${filePath ? `- Affected File: ${filePath}` : ''}
- Urgency: ${urgencyLevel}

## Quick Fix Protocol
1. Rapidly diagnose the root cause
2. Implement minimal, targeted fix
3. Ensure fix doesn't break existing functionality
4. Add appropriate error handling
5. Include brief inline documentation
6. Create a test to prevent regression (if time permits)

## Execution Requirements
- Focus on speed and accuracy
- Make the minimal change needed to fix the issue
- Preserve existing code style and patterns
- Document what was changed and why
- If the fix is complex, note any technical debt created

${getIssueGuidance(issueType)}

Execute the quick fix immediately.
`;
}
