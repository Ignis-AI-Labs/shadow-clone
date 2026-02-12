// Shadow Clone — Prompt content exports
// Source of truth: edit this file directly

export * from './mainPrompt';

// Mode configs
export * as mode_audit from './mode_audit';
export * as mode_debug from './mode_debug';
export * as mode_feature from './mode_feature';
export * as mode_optimize from './mode_optimize';
export * as mode_plan from './mode_plan';
export * as mode_refactor from './mode_refactor';
export * as mode_research from './mode_research';

// Agent rules
export * as agent_agent_template from './agent_agent_template';
export * as agent_core_rules from './agent_core_rules';
export * as agent_README from './agent_README';

// Templates
export * as template_master_plan_template from './template_master_plan_template';
export * as template_mode_completion_template from './template_mode_completion_template';
export * as template_security_audit_report_template from './template_security_audit_report_template';
export * as template_team_agent_templates from './template_team_agent_templates';
