import { Router } from './router';
import { handleAuthValidate } from './handlers/auth';
import { handleGetProfile, handleGetLicenseStatus } from './handlers/user';
import { handleGetProjects, handleCreateProject } from './handlers/projects';
import { handleGetDeployments, handleCreateDeployment } from './handlers/deployments';
import { 
  handleGetShadowClonePrompt, 
  handleGetModeConfig, 
  handleGetAllModes,
  handleGetAgentRule,
  handleGetCoordinationRule,
  handleGetTemplate,
  handleGetExecutionPhase
} from './handlers/prompts-v2';
import { corsHeaders } from './utils/cors';

export interface Env {
  USERS: KVNamespace;
  PROJECTS: KVNamespace;
  API_KEYS: KVNamespace;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
}

const router = new Router<Env>();

// CORS preflight
router.options('*', () => {
  return new Response(null, { headers: corsHeaders });
});

// Auth routes
router.post('/auth/validate', handleAuthValidate);

// User routes
router.get('/user/profile', handleGetProfile);
router.get('/user/license-status', handleGetLicenseStatus);

// Project routes
router.get('/projects', handleGetProjects);
router.post('/projects', handleCreateProject);

// Deployment routes
router.get('/projects/:id/deployments', handleGetDeployments);
router.post('/projects/:id/deploy', handleCreateDeployment);

// Shadow Clone prompts and configurations (authenticated)
router.get('/api/prompts/shadow-clone', handleGetShadowClonePrompt);

// Mode configurations
router.get('/api/prompts/modes', handleGetAllModes);
router.get('/api/prompts/modes/:mode', handleGetModeConfig);

// Agent rules
router.get('/api/prompts/agent-rules/:role', handleGetAgentRule);

// Coordination rules
router.get('/api/prompts/coordination-rules', handleGetCoordinationRule);
router.get('/api/prompts/coordination-rules/:rule', handleGetCoordinationRule);

// Templates
router.get('/api/prompts/templates/:template', handleGetTemplate);

// Execution phases
router.get('/api/prompts/execution-phases/:phase', handleGetExecutionPhase);

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
});

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await router.handle(request, env);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
  },
};