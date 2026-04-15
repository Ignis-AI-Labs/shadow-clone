import { z } from 'zod';
import * as schemas from './toolSchemas.js';

export const toolSchemaRegistry: Record<string, z.ZodSchema> = {
  // ModularTools
  'deploy_agent_team': schemas.deployAgentTeamSchema,
  'deploy_specialist_agent': schemas.deploySpecialistAgentSchema,
  'quick_fix': schemas.quickFixSchema,
  'code_review_team': schemas.codeReviewTeamSchema,
  'generate_tests': schemas.generateTestsSchema,
  'execute_single_wave': schemas.executeSingleWaveSchema,
  'create_documentation': schemas.createDocumentationSchema,
  'architecture_consultant': schemas.architectureConsultantSchema,
  'show_commands': schemas.showCommandsSchema,

  // Utility tools
  'initialize_workspace': schemas.initializeWorkspaceSchema,
  'check_for_updates': schemas.checkForUpdatesSchema,

  // EmbeddedPromptTools
  'shadow_clone_orchestrate': schemas.shadowCloneOrchestrateSchema,
  'shadow_clone_plan': schemas.shadowClonePlanSchema,
  'get_agent_template': schemas.getAgentTemplateSchema,
};

export * from './toolSchemas.js';
