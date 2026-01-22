import { z } from 'zod';
import * as schemas from './toolSchemas.js';

export const toolSchemaRegistry: Record<string, z.ZodSchema> = {
  // ModularTools (9 tools)
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
  'api_key_status': schemas.apiKeyStatusSchema,
  'initialize_workspace': schemas.initializeWorkspaceSchema,

  // EmbeddedPromptTools (already have validation, adding for unified approach)
  'shadow_clone_orchestrate': schemas.shadowCloneOrchestrateSchema,
  'shadow_clone_plan': schemas.shadowClonePlanSchema,
  'get_agent_template': schemas.getAgentTemplateSchema,

  // No params - empty schemas
  'authenticate': schemas.authenticateSchema,
  'check_for_updates': schemas.checkForUpdatesSchema,
  'logout': schemas.logoutSchema
};

export * from './toolSchemas.js';
