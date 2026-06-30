import { z } from 'zod';
import {
  deployAgentTeamSchema,
  deploySpecialistAgentSchema,
  quickFixSchema,
  codeReviewTeamSchema,
  generateTestsSchema,
  executeSingleWaveSchema,
  createDocumentationSchema,
  architectureConsultantSchema,
  showCommandsSchema,
} from '../schemas/tool-schemas.js';
import { deployAgentTeam, deployAgentTeamDefinition } from './modular/deploy-agent-team.js';
import { deploySpecialistAgent, deploySpecialistAgentDefinition } from './modular/deploy-specialist-agent.js';
import { quickFix, quickFixDefinition } from './modular/quick-fix.js';
import { codeReviewTeam, codeReviewTeamDefinition } from './modular/code-review-team.js';
import { generateTests, generateTestsDefinition } from './modular/generate-tests.js';
import { executeSingleWave, executeSingleWaveDefinition } from './modular/execute-single-wave.js';
import { createDocumentation, createDocumentationDefinition } from './modular/create-documentation.js';
import { architectureConsultant, architectureConsultantDefinition } from './modular/architecture-consultant.js';
import { showCommands, showCommandsDefinition } from './modular/show-commands.js';
import type { ToolDefinition } from './modular/types.js';

export class ModularTools {
  getToolDefinitions(): ToolDefinition[] {
    return [
      deployAgentTeamDefinition,
      deploySpecialistAgentDefinition,
      quickFixDefinition,
      codeReviewTeamDefinition,
      generateTestsDefinition,
      executeSingleWaveDefinition,
      createDocumentationDefinition,
      architectureConsultantDefinition,
      showCommandsDefinition,
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
      case 'deploy_agent_team':
        return deployAgentTeam(args as z.infer<typeof deployAgentTeamSchema>);
      case 'deploy_specialist_agent':
        return deploySpecialistAgent(args as z.infer<typeof deploySpecialistAgentSchema>);
      case 'quick_fix':
        return quickFix(args as z.infer<typeof quickFixSchema>);
      case 'code_review_team':
        return codeReviewTeam(args as z.infer<typeof codeReviewTeamSchema>);
      case 'generate_tests':
        return generateTests(args as z.infer<typeof generateTestsSchema>);
      case 'execute_single_wave':
        return executeSingleWave(args as z.infer<typeof executeSingleWaveSchema>);
      case 'create_documentation':
        return createDocumentation(args as z.infer<typeof createDocumentationSchema>);
      case 'architecture_consultant':
        return architectureConsultant(args as z.infer<typeof architectureConsultantSchema>);
      case 'show_commands':
        return showCommands(args as z.infer<typeof showCommandsSchema>);
      default:
        throw new Error(`Unknown modular tool: ${name}`);
    }
  }
}
