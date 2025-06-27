// Import all templates
import { AGENT_TEMPLATES } from './agent-templates';
import { SECURITY_AUDIT_REPORT_TEMPLATE } from './security-audit-report';
import { TEAM_TEMPLATES } from './team-templates';
import { WAVE_EXECUTION_PLAN_TEMPLATE } from './wave-execution-plan';

// Export individually
export { AGENT_TEMPLATES } from './agent-templates';
export { SECURITY_AUDIT_REPORT_TEMPLATE } from './security-audit-report';
export { TEAM_TEMPLATES } from './team-templates';
export { WAVE_EXECUTION_PLAN_TEMPLATE } from './wave-execution-plan';

// Re-export all templates as a single object for convenience
export const TEMPLATES = {
  agentTemplates: AGENT_TEMPLATES,
  securityAuditReport: SECURITY_AUDIT_REPORT_TEMPLATE,
  teamTemplates: TEAM_TEMPLATES,
  waveExecutionPlan: WAVE_EXECUTION_PLAN_TEMPLATE,
  // Add other template exports here as they are created
};