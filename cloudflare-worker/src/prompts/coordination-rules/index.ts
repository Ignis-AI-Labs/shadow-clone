// Import all coordination rules
import { INTEGRATION_RULES } from './integration';
import { MODE_OPERATIONS } from './mode-operations';
import { QUALITY_GATES } from './quality-gates';
import { WAVE_COORDINATION_RULES } from './wave-coordination';
import { WORKSPACE_STRUCTURE } from './workspace-structure';

// Export individually
export { INTEGRATION_RULES } from './integration';
export { MODE_OPERATIONS } from './mode-operations';
export { QUALITY_GATES } from './quality-gates';
export { WAVE_COORDINATION_RULES } from './wave-coordination';
export { WORKSPACE_STRUCTURE } from './workspace-structure';

// Re-export all rules as a single object for convenience
export const COORDINATION_RULES = {
  integration: INTEGRATION_RULES,
  modeOperations: MODE_OPERATIONS,
  qualityGates: QUALITY_GATES,
  waveCoordination: WAVE_COORDINATION_RULES,
  workspaceStructure: WORKSPACE_STRUCTURE,
};