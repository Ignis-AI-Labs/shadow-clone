// Shadow Clone Mode Configurations
export { AUDIT_MODE } from './audit';
export { DEBUG_MODE } from './debug';
export { FEATURE_MODE } from './feature';
export { OPTIMIZE_MODE } from './optimize';
export { REFACTOR_MODE } from './refactor';
export { RESEARCH_MODE } from './research';
export { PLAN_MODE } from './plan';

// Import for local use
import { AUDIT_MODE } from './audit';
import { DEBUG_MODE } from './debug';
import { FEATURE_MODE } from './feature';
import { OPTIMIZE_MODE } from './optimize';
import { REFACTOR_MODE } from './refactor';
import { RESEARCH_MODE } from './research';
import { PLAN_MODE } from './plan';

// Mode type definitions
export type ShadowCloneMode = 
  | 'audit'
  | 'debug' 
  | 'feature'
  | 'optimize'
  | 'refactor'
  | 'research'
  | 'plan';

// Mode configuration map
export const SHADOW_CLONE_MODES: Record<ShadowCloneMode, string> = {
  audit: AUDIT_MODE,
  debug: DEBUG_MODE,
  feature: FEATURE_MODE,
  optimize: OPTIMIZE_MODE,
  refactor: REFACTOR_MODE,
  research: RESEARCH_MODE,
  plan: PLAN_MODE,
};

// Helper function to get mode configuration
export function getModeConfiguration(mode: ShadowCloneMode): string | null {
  return SHADOW_CLONE_MODES[mode] || null;
}