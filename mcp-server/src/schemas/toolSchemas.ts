import { z } from 'zod';

// Shared refinements
const safeString = (min = 1, max = 5000) => z.string().min(min).max(max);
const safePath = z.string().max(260).optional();

// ============================================================================
// ModularTools schemas (9 tools needing validation)
// ============================================================================

export const deployAgentTeamSchema = z.object({
  teamType: z.enum(['frontend', 'backend', 'database', 'testing', 'documentation', 'devops', 'mobile', 'security']),
  task: safeString(1, 5000),
  outputDirectory: safePath,
  teamSize: z.coerce.number().int().min(1).max(5).optional()
});

export const deploySpecialistAgentSchema = z.object({
  specialization: z.enum([
    'react_expert',
    'api_designer',
    'database_architect',
    'test_engineer',
    'performance_analyst',
    'security_auditor',
    'code_reviewer',
    'documentation_writer'
  ]),
  task: safeString(1, 5000),
  context: safeString(0, 10000).optional(),
  deliverables: z.array(z.string().max(500)).max(20).optional()
});

export const quickFixSchema = z.object({
  issueType: z.enum(['bug', 'style', 'logic', 'performance', 'security']),
  description: safeString(1, 5000),
  filePath: safePath,
  urgency: z.enum(['low', 'medium', 'high', 'critical']).optional()
});

export const codeReviewTeamSchema = z.object({
  reviewType: z.enum(['security', 'performance', 'quality', 'architecture', 'comprehensive']),
  files: z.array(z.string().max(260)).min(1).max(100),
  standards: safeString(0, 2000).optional()
});

export const generateTestsSchema = z.object({
  testType: z.enum(['unit', 'integration', 'e2e', 'performance', 'security']),
  targetFiles: z.array(z.string().max(260)).min(1).max(100),
  framework: z.string().max(50).optional(),
  coverage: z.coerce.number().min(0).max(100).optional()
});

export const executeSingleWaveSchema = z.object({
  waveType: z.enum(['research', 'planning', 'implementation', 'testing', 'documentation', 'review']),
  scope: safeString(1, 5000),
  inputs: z.array(z.string().max(500)).max(50).optional(),
  maxAgents: z.coerce.number().int().min(1).max(10).optional()
});

export const createDocumentationSchema = z.object({
  docType: z.enum(['api', 'user_guide', 'developer', 'architecture', 'inline']),
  scope: safeString(1, 5000),
  format: z.enum(['markdown', 'html', 'openapi', 'jsdoc']).optional(),
  audience: z.enum(['developers', 'users', 'architects', 'general']).optional()
});

export const architectureConsultantSchema = z.object({
  consultationType: z.enum(['design_review', 'pattern_recommendation', 'scalability_analysis', 'migration_planning']),
  context: safeString(1, 5000),
  constraints: safeString(0, 2000).optional(),
  goals: z.array(z.string().max(500)).max(20).optional()
});

export const showCommandsSchema = z.object({
  category: z.enum(['orchestration', 'teams', 'rapid', 'documentation', 'all']).optional()
});

// ============================================================================
// Utility tool schemas
// ============================================================================

export const apiKeyStatusSchema = z.object({
  showKey: z.coerce.boolean().optional().default(false)
});

export const initializeWorkspaceSchema = z.object({
  projectPath: safePath,
  overwrite: z.coerce.boolean().optional().default(false),
  includeTypes: z.array(z.enum(['claude', 'github', 'vscode', 'general'])).optional()
});

// ============================================================================
// EmbeddedPromptTools schemas (already validated, but adding for consistency)
// ============================================================================

export const shadowCloneOrchestrateSchema = z.object({
  mode: z.enum(['plan', 'feature', 'debug', 'optimize', 'refactor', 'audit', 'research']),
  projectDescription: safeString(10, 5000),
  projectPlan: safePath,
  wavesDirectory: safePath,
  maxAgentsPerWave: z.coerce.number().int().min(1).max(20).optional()
});

export const shadowClonePlanSchema = z.object({
  projectVision: safeString(20, 10000),
  wavesDirectory: safePath
});

export const getAgentTemplateSchema = z.object({
  templateType: z.enum(['core_rules', 'agent_template', 'team_templates'])
});

// ============================================================================
// No-params schemas (empty objects)
// ============================================================================

export const authenticateSchema = z.object({});
export const checkForUpdatesSchema = z.object({});
export const logoutSchema = z.object({});
