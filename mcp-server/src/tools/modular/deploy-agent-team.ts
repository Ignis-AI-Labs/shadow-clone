import { z } from 'zod';
import * as prompts from '../../prompts/content/index.js';
import { deployAgentTeamSchema } from '../../schemas/tool-schemas.js';
import { getTeamTemplates } from './config/team-templates.js';
import type { ToolDefinition } from './types.js';

export const deployAgentTeamDefinition: ToolDefinition = {
  name: 'deploy_agent_team',
  description: 'Returns PROMPT ENGINEERING MACROS for team simulation - delivers instructions that teach AI how to act as specialized development teams (NO code execution)',
  inputSchema: {
    type: 'object',
    properties: {
      teamType: {
        type: 'string',
        description: 'The type of team to deploy',
        enum: ['frontend', 'backend', 'database', 'testing', 'documentation', 'devops', 'mobile', 'security'],
      },
      task: {
        type: 'string',
        description: 'Specific task description for the team',
      },
      outputDirectory: {
        type: 'string',
        description: 'Where to place deliverables',
      },
      teamSize: {
        type: 'number',
        description: 'Number of agents (1-5)',
        minimum: 1,
        maximum: 5,
      },
    },
    required: ['teamType', 'task'],
  },
};

export async function deployAgentTeam(
  args: z.infer<typeof deployAgentTeamSchema>
): Promise<string> {
  const { teamType, task, outputDirectory, teamSize } = args;
  const directory = outputDirectory || './output/';
  const size = teamSize || 3;

  const teamTemplates = getTeamTemplates(teamType);
  const coreRules = prompts.agentCoreRules.content;

  return `
# Shadow Clone Modular Team Deployment

You are deploying a ${teamType} specialist team for a focused task.

## Team Composition
${teamTemplates.slice(0, size).map((agent, i) => `- Agent ${i + 1}: ${agent.role} - ${agent.expertise}`).join('\n')}

## Core Rules
${coreRules}

## Task Assignment
${task}

## Execution Parameters
- Output Directory: ${directory}
- Team Size: ${size} agents
- Mode: Focused execution (single task)
- Coordination: Collaborative team effort

## Instructions
1. Each agent should focus on their area of expertise
2. Collaborate to complete the assigned task
3. Place all deliverables in ${directory}
4. Follow Shadow Clone quality standards
5. Complete task efficiently without over-engineering

## Deliverables
Based on the task, produce appropriate outputs such as:
- Code files
- Documentation
- Test files
- Configuration files
- Analysis reports

Execute the task with the ${teamType} team working collaboratively.
`;
}
