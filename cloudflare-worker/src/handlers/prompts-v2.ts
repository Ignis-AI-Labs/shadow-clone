import { Env } from '../index';
import { authenticateRequest } from '../utils/auth';
import { corsHeaders } from '../utils/cors';
import { SHADOW_CLONE_PROMPT } from '../prompts/shadow-clone-prompt';

// Import all mode configurations
import { SHADOW_CLONE_MODES } from '../prompts/modes';

// Import all agent rules
import { AGENT_RULES as IMPORTED_AGENT_RULES } from '../prompts/agent-rules';

// Import all coordination rules
import { COORDINATION_RULES as IMPORTED_COORDINATION_RULES } from '../prompts/coordination-rules';

// Import all templates
import { TEMPLATES as IMPORTED_TEMPLATES } from '../prompts/templates';

// Import all execution phases
import { EXECUTION_PHASES as IMPORTED_EXECUTION_PHASES } from '../prompts/execution-phases';

// Import documentation
import { SYSTEM_ORGANIZATION, INITIALIZATION_SEQUENCE } from '../prompts/documentation';

// Mode configurations map
const MODE_CONFIGS = SHADOW_CLONE_MODES;

// Agent rules map - now populated with actual content
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
  planning_agent_rules: IMPORTED_AGENT_RULES.planning,
};

// Coordination rules map - now populated with actual content
const COORDINATION_RULES: Record<string, string> = {
  wave_coordination: IMPORTED_COORDINATION_RULES.waveCoordination,
  integration_rules: IMPORTED_COORDINATION_RULES.integration,
  quality_gates: IMPORTED_COORDINATION_RULES.qualityGates,
  mode_operations: IMPORTED_COORDINATION_RULES.modeOperations,
  workspace_structure: IMPORTED_COORDINATION_RULES.workspaceStructure,
  file_organization_rules: IMPORTED_COORDINATION_RULES.fileOrganization,
  initialization_checklist: IMPORTED_COORDINATION_RULES.initializationChecklist,
  system_validation_rules: IMPORTED_COORDINATION_RULES.systemValidation,
};

// Templates map - now populated with actual content
const TEMPLATES: Record<string, string> = {
  agent_templates: IMPORTED_TEMPLATES.agentTemplates,
  team_templates: IMPORTED_TEMPLATES.teamTemplates,
  'wave-execution-plan-template': IMPORTED_TEMPLATES.waveExecutionPlan,
  'security-audit-report-template': IMPORTED_TEMPLATES.securityAuditReport,
  'master-project-plan-template': IMPORTED_TEMPLATES.masterProjectPlan,
  'planning-consolidation-template': IMPORTED_TEMPLATES.planningConsolidation,
};

// Execution phases map - now populated with actual content
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

// Documentation map
const DOCUMENTATION: Record<string, string> = {
  system_organization: SYSTEM_ORGANIZATION,
  initialization_sequence: INITIALIZATION_SEQUENCE,
};

/**
 * Handle requests for the main Shadow Clone prompt
 */
export async function handleGetShadowClonePrompt(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    const { user } = authResult;

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
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching shadow clone prompt:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch prompt',
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
}

/**
 * Handle requests for mode configurations
 */
export async function handleGetModeConfig(
  request: Request,
  env: Env,
  params: { mode: string }
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    const { user } = authResult;

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
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching mode config:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch mode config',
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
}

/**
 * Handle requests for agent rules
 */
export async function handleGetAgentRule(
  request: Request,
  env: Env,
  params: { role: string }
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const role = params.role.toLowerCase();
    const rule = AGENT_RULES[role];

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
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch agent rule',
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
}

/**
 * Handle requests for coordination rules
 */
export async function handleGetCoordinationRule(
  request: Request,
  env: Env,
  params: { rule?: string }
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // If no specific rule requested, return list
    if (!params.rule) {
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
            ...corsHeaders,
          },
        }
      );
    }

    const ruleName = params.rule.toLowerCase();
    const rule = COORDINATION_RULES[ruleName];

    if (!rule) {
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
        name: ruleName,
        content: rule,
        version: '2.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch coordination rule',
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
}

/**
 * Handle requests for templates
 */
export async function handleGetTemplate(
  request: Request,
  env: Env,
  params: { template: string }
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const templateName = params.template.toLowerCase();
    const template = TEMPLATES[templateName];

    if (!template) {
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
        name: templateName,
        content: template,
        version: '2.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch template',
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
}

/**
 * Handle requests for execution phases
 */
export async function handleGetExecutionPhase(
  request: Request,
  env: Env,
  params: { phase: string }
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const phaseName = params.phase.toLowerCase();
    const phase = EXECUTION_PHASES[phaseName];

    if (!phase) {
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
        name: phaseName,
        content: phase,
        version: '2.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch execution phase',
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
}

/**
 * Handle requests for all available modes
 */
export async function handleGetAllModes(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    const { user } = authResult;

    // Return list of available modes
    const modes = Object.keys(MODE_CONFIGS);

    return new Response(
      JSON.stringify({
        success: true,
        modes: modes,
        version: '2.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching modes:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch modes',
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
}

/**
 * Handle requests for documentation
 */
export async function handleGetDocumentation(
  request: Request,
  env: Env,
  params: { doc: string }
): Promise<Response> {
  try {
    // Verify authentication
    const authResult = await authenticateRequest(request, env);
    if ('error' in authResult) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const doc = params.doc.toLowerCase().replace(/-/g, '_');
    const content = DOCUMENTATION[doc];

    if (\!content) {
      return new Response(
        JSON.stringify({
          error: 'Documentation not found',
          availableDocuments: Object.keys(DOCUMENTATION),
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
        document: doc,
        content: content,
        version: '2.0.0',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch documentation',
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
}
