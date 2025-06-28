import { Env } from '../index';
import { withSecurity, SecurityContext, trackPath } from '../middleware/security';
import { corsHeaders } from '../utils/cors';
import { SHADOW_CLONE_PROMPT } from '../prompts/shadow-clone-prompt';

// Import all configurations (same as prompts.ts)
import { SHADOW_CLONE_MODES } from '../prompts/modes';
import { AGENT_RULES as IMPORTED_AGENT_RULES } from '../prompts/agent-rules';
import { COORDINATION_RULES as IMPORTED_COORDINATION_RULES } from '../prompts/coordination-rules';
import { TEMPLATES as IMPORTED_TEMPLATES } from '../prompts/templates';
import { EXECUTION_PHASES as IMPORTED_EXECUTION_PHASES } from '../prompts/execution-phases';

// Map configurations
const MODE_CONFIGS = SHADOW_CLONE_MODES;

const AGENT_RULES: Record<string, string> = {
  core_agent_rules: IMPORTED_AGENT_RULES.core,
  development_agent_rules: IMPORTED_AGENT_RULES.development,
  qa_agent_rules: IMPORTED_AGENT_RULES.qa,
  devops_agent_rules: IMPORTED_AGENT_RULES.devops,
  security_agent_rules: IMPORTED_AGENT_RULES.security,
  documentation_agent_rules: IMPORTED_AGENT_RULES.documentation,
  team_lead_rules: IMPORTED_AGENT_RULES.teamLead,
  audit_agent_rules: IMPORTED_AGENT_RULES.audit,
  research_agent_rules: IMPORTED_AGENT_RULES.research,
};

const COORDINATION_RULES: Record<string, string> = {
  wave_coordination: IMPORTED_COORDINATION_RULES.waveCoordination,
  integration_rules: IMPORTED_COORDINATION_RULES.integration,
  quality_gates: IMPORTED_COORDINATION_RULES.qualityGates,
  mode_operations: IMPORTED_COORDINATION_RULES.modeOperations,
  workspace_structure: IMPORTED_COORDINATION_RULES.workspaceStructure,
};

const TEMPLATES: Record<string, string> = {
  agent_templates: IMPORTED_TEMPLATES.agentTemplates,
  team_templates: IMPORTED_TEMPLATES.teamTemplates,
  'wave-execution-plan-template': IMPORTED_TEMPLATES.waveExecutionPlan,
  'security-audit-report-template': IMPORTED_TEMPLATES.securityAuditReport,
};

const EXECUTION_PHASES: Record<string, string> = {
  phase1_analysis: IMPORTED_EXECUTION_PHASES.phase1Analysis,
  phase2_team_config: IMPORTED_EXECUTION_PHASES.phase2TeamConfig,
  phase3_wave_planning: IMPORTED_EXECUTION_PHASES.phase3WavePlanning,
  phase4_deployment: IMPORTED_EXECUTION_PHASES.phase4Deployment,
  phase5_execution: IMPORTED_EXECUTION_PHASES.phase5Execution,
  phase6_integration: IMPORTED_EXECUTION_PHASES.phase6Integration,
  phase7_quality: IMPORTED_EXECUTION_PHASES.phase7Quality,
  wave_execution_protocol: IMPORTED_EXECUTION_PHASES.waveExecutionProtocol,
};

/**
 * Secure handler for Shadow Clone prompt
 */
export async function handleGetShadowClonePromptSecure(
  request: Request,
  env: Env
): Promise<Response> {
  return withSecurity(request, env, async (req, env, security: SecurityContext) => {
    const url = new URL(req.url);
    
    // Track path for enumeration detection
    const recentPaths = await trackPath(security.userId, url.pathname);
    const isEnumerating = await security.monitor.checkForEnumeration(
      security.userId, 
      url.pathname, 
      recentPaths
    );
    
    if (isEnumerating) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests',
          message: 'Please slow down your requests'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '300',
            ...corsHeaders,
          },
        }
      );
    }

    // Return the prompt content
    return new Response(
      JSON.stringify({
        success: true,
        content: SHADOW_CLONE_PROMPT,
        version: '2.0.0',
        lastUpdated: '2024-12-27'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=300', // 5 min cache
          ...corsHeaders,
        },
      }
    );
  });
}

/**
 * Secure handler for mode configurations
 */
export async function handleGetModeConfigSecure(
  request: Request,
  env: Env,
  params: { mode: string }
): Promise<Response> {
  return withSecurity(request, env, async (req, env, security: SecurityContext) => {
    const url = new URL(req.url);
    
    // Track path for enumeration detection
    const recentPaths = await trackPath(security.userId, url.pathname);
    const isEnumerating = await security.monitor.checkForEnumeration(
      security.userId, 
      url.pathname, 
      recentPaths
    );
    
    if (isEnumerating) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests',
          message: 'Please slow down your requests'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '300',
            ...corsHeaders,
          },
        }
      );
    }

    // Get the requested mode config
    const mode = params.mode.toLowerCase();
    const config = MODE_CONFIGS[mode];

    if (!config) {
      return new Response(
        JSON.stringify({
          error: 'Mode not found',
          availableModes: Object.keys(MODE_CONFIGS),
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        name: mode,
        description: `${mode.charAt(0).toUpperCase() + mode.slice(1)} mode configuration`,
        content: config,
        version: '2.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=300',
          ...corsHeaders,
        },
      }
    );
  });
}

/**
 * Secure handler for getting all modes
 */
export async function handleGetAllModesSecure(
  request: Request,
  env: Env
): Promise<Response> {
  return withSecurity(request, env, async (req, env, security: SecurityContext) => {
    return new Response(
      JSON.stringify({
        success: true,
        modes: Object.keys(MODE_CONFIGS),
        version: '2.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=3600', // 1 hour cache
          ...corsHeaders,
        },
      }
    );
  });
}

/**
 * Secure handler for agent rules
 */
export async function handleGetAgentRuleSecure(
  request: Request,
  env: Env,
  params: { role: string }
): Promise<Response> {
  return withSecurity(request, env, async (req, env, security: SecurityContext) => {
    const url = new URL(req.url);
    
    // Track path for enumeration detection
    const recentPaths = await trackPath(security.userId, url.pathname);
    const isEnumerating = await security.monitor.checkForEnumeration(
      security.userId, 
      url.pathname, 
      recentPaths
    );
    
    if (isEnumerating) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests',
          message: 'Please slow down your requests'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '300',
            ...corsHeaders,
          },
        }
      );
    }

    const role = params.role.toLowerCase();
    const rule = AGENT_RULES[role] || AGENT_RULES[`${role}_agent_rules`];

    if (!rule) {
      return new Response(
        JSON.stringify({
          error: 'Agent rule not found',
          availableRules: Object.keys(AGENT_RULES),
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        role: role,
        content: rule,
        version: '2.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=300',
          ...corsHeaders,
        },
      }
    );
  });
}

/**
 * Secure handler for coordination rules
 */
export async function handleGetCoordinationRuleSecure(
  request: Request,
  env: Env,
  params?: { rule: string }
): Promise<Response> {
  return withSecurity(request, env, async (req, env, security: SecurityContext) => {
    // If no specific rule requested, return all
    if (!params?.rule) {
      return new Response(
        JSON.stringify({
          success: true,
          rules: Object.keys(COORDINATION_RULES),
          version: '2.0.0',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'private, max-age=3600',
            ...corsHeaders,
          },
        }
      );
    }

    const rule = params.rule.toLowerCase();
    const content = COORDINATION_RULES[rule];

    if (!content) {
      return new Response(
        JSON.stringify({
          error: 'Coordination rule not found',
          availableRules: Object.keys(COORDINATION_RULES),
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        rule: rule,
        content: content,
        version: '2.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=300',
          ...corsHeaders,
        },
      }
    );
  });
}

/**
 * Secure handler for templates
 */
export async function handleGetTemplateSecure(
  request: Request,
  env: Env,
  params: { template: string }
): Promise<Response> {
  return withSecurity(request, env, async (req, env, security: SecurityContext) => {
    const template = params.template.toLowerCase();
    const content = TEMPLATES[template];

    if (!content) {
      return new Response(
        JSON.stringify({
          error: 'Template not found',
          availableTemplates: Object.keys(TEMPLATES),
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        template: template,
        content: content,
        version: '2.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=300',
          ...corsHeaders,
        },
      }
    );
  });
}

/**
 * Secure handler for execution phases
 */
export async function handleGetExecutionPhaseSecure(
  request: Request,
  env: Env,
  params: { phase: string }
): Promise<Response> {
  return withSecurity(request, env, async (req, env, security: SecurityContext) => {
    const phase = params.phase.toLowerCase();
    const content = EXECUTION_PHASES[phase];

    if (!content) {
      return new Response(
        JSON.stringify({
          error: 'Execution phase not found',
          availablePhases: Object.keys(EXECUTION_PHASES),
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        phase: phase,
        content: content,
        version: '2.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=300',
          ...corsHeaders,
        },
      }
    );
  });
}