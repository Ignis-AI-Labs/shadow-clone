import { Router } from './router';
import { handleAuthValidate } from './handlers/auth';
import { handleGetProfile, handleGetLicenseStatus } from './handlers/user';
import { handleGetProjects, handleCreateProject } from './handlers/projects';
import { handleGetDeployments, handleCreateDeployment } from './handlers/deployments';
import { 
  handleGetShadowClonePromptSecure, 
  handleGetModeConfigSecure, 
  handleGetAllModesSecure,
  handleGetAgentRuleSecure,
  handleGetCoordinationRuleSecure,
  handleGetTemplateSecure,
  handleGetExecutionPhaseSecure
} from './handlers/prompts-secure';
import {
  handleGetSecurityAnalytics,
  handleUnblockUser,
  handleClearUserEvents,
  handleGenerateReport,
  handleConfigureNotifications
} from './handlers/admin';
import {
  handleTelemetryEvents,
  handleHighRiskAlert,
  handleGetTelemetryAnalytics
} from './handlers/telemetry';
import {
  handleGeneratePaidLicense,
  handleCheckNFTClaim,
  handleGetLicenseAvailability
} from './handlers/license-api';
import {
  handleClaimIgnisLicense,
  handleCheckIgnisOwnership
} from './handlers/license-ignis';
import { corsHeaders } from './utils/cors';

export interface Env {
  USERS: KVNamespace;
  PROJECTS: KVNamespace;
  API_KEYS: KVNamespace;
  ADMIN_KEYS: KVNamespace;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
  ETHEREUM_RPC_URL?: string;
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

// Shadow Clone prompts and configurations (authenticated with security)
router.get('/api/prompts/shadow-clone', handleGetShadowClonePromptSecure);

// Mode configurations
router.get('/api/prompts/modes', handleGetAllModesSecure);
router.get('/api/prompts/modes/:mode', handleGetModeConfigSecure);

// Agent rules
router.get('/api/prompts/agent-rules/:role', handleGetAgentRuleSecure);

// Coordination rules
router.get('/api/prompts/coordination-rules', handleGetCoordinationRuleSecure);
router.get('/api/prompts/coordination-rules/:rule', handleGetCoordinationRuleSecure);

// Templates
router.get('/api/prompts/templates/:template', handleGetTemplateSecure);

// Execution phases
router.get('/api/prompts/execution-phases/:phase', handleGetExecutionPhaseSecure);

// Admin routes
router.get('/admin/security/analytics', handleGetSecurityAnalytics);
router.post('/admin/security/unblock', handleUnblockUser);
router.post('/admin/security/clear-events', handleClearUserEvents);
router.post('/admin/security/generate-report', handleGenerateReport);
router.post('/admin/security/configure-notifications', handleConfigureNotifications);
router.get('/admin/telemetry/analytics', handleGetTelemetryAnalytics);

// Telemetry routes
router.post('/api/telemetry/events', handleTelemetryEvents);
router.post('/api/security/high-risk-alert', handleHighRiskAlert);

// License API routes (for Ignis Labs dashboard integration)
router.post('/api/license/claim/ignis', handleClaimIgnisLicense);
router.get('/api/license/check/ignis', handleCheckIgnisOwnership);
router.post('/api/license/generate', handleGeneratePaidLicense);
router.get('/api/license/check-nft', handleCheckNFTClaim);
router.get('/api/license/availability', handleGetLicenseAvailability);

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
  
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // Import dynamically to avoid circular dependencies
    const { handleScheduledReport } = await import('./handlers/admin');
    await handleScheduledReport(event, env);
  },
};