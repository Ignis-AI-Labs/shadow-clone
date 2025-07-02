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

// New coordination rules
export { FILE_ORGANIZATION_RULES } from './file-organization';
export { INITIALIZATION_CHECKLIST } from './initialization-checklist';
export { SYSTEM_VALIDATION_RULES } from './system-validation';

// Re-export all rules as a single object for convenience
export const COORDINATION_RULES = {
  integration: INTEGRATION_RULES,
  modeOperations: MODE_OPERATIONS,
  qualityGates: QUALITY_GATES,
  waveCoordination: WAVE_COORDINATION_RULES,
  workspaceStructure: WORKSPACE_STRUCTURE,
  fileOrganization: FILE_ORGANIZATION_RULES,
  initializationChecklist: INITIALIZATION_CHECKLIST,
  systemValidation: SYSTEM_VALIDATION_RULES,
};
