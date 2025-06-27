// Import all agent rules
import { AUDIT_AGENT_RULES } from './audit';
import { CORE_AGENT_RULES } from './core';
import { DEVELOPMENT_AGENT_RULES } from './development';
import { DEVOPS_AGENT_RULES } from './devops';
import { DOCUMENTATION_AGENT_RULES } from './documentation';
import { QA_AGENT_RULES } from './qa';
import { RESEARCH_AGENT_RULES } from './research';
import { SECURITY_AGENT_RULES } from './security';
import { TEAM_LEAD_RULES } from './team-lead';

// Export individually
export { AUDIT_AGENT_RULES } from './audit';
export { CORE_AGENT_RULES } from './core';
export { DEVELOPMENT_AGENT_RULES } from './development';
export { DEVOPS_AGENT_RULES } from './devops';
export { DOCUMENTATION_AGENT_RULES } from './documentation';
export { QA_AGENT_RULES } from './qa';
export { RESEARCH_AGENT_RULES } from './research';
export { SECURITY_AGENT_RULES } from './security';
export { TEAM_LEAD_RULES } from './team-lead';

// Re-export all rules as a single object for convenience
export const AGENT_RULES = {
  audit: AUDIT_AGENT_RULES,
  core: CORE_AGENT_RULES,
  development: DEVELOPMENT_AGENT_RULES,
  devops: DEVOPS_AGENT_RULES,
  documentation: DOCUMENTATION_AGENT_RULES,
  qa: QA_AGENT_RULES,
  research: RESEARCH_AGENT_RULES,
  security: SECURITY_AGENT_RULES,
  teamLead: TEAM_LEAD_RULES,
};