// Import all execution phases
import { PHASE1_ANALYSIS } from './phase1-analysis';
import { PHASE2_TEAM_CONFIG } from './phase2-team-config';
import { PHASE3_WAVE_PLANNING } from './phase3-wave-planning';
import { PHASE4_DEPLOYMENT } from './phase4-deployment';
import { PHASE5_EXECUTION } from './phase5-execution';
import { PHASE6_INTEGRATION } from './phase6-integration';
import { PHASE7_QUALITY } from './phase7-quality';
import { WAVE_EXECUTION_PROTOCOL } from './wave-execution-protocol';

// Export individually
export { PHASE1_ANALYSIS } from './phase1-analysis';
export { PHASE2_TEAM_CONFIG } from './phase2-team-config';
export { PHASE3_WAVE_PLANNING } from './phase3-wave-planning';
export { PHASE4_DEPLOYMENT } from './phase4-deployment';
export { PHASE5_EXECUTION } from './phase5-execution';
export { PHASE6_INTEGRATION } from './phase6-integration';
export { PHASE7_QUALITY } from './phase7-quality';
export { WAVE_EXECUTION_PROTOCOL } from './wave-execution-protocol';

// Re-export all phases as a single object for convenience
export const EXECUTION_PHASES = {
  phase1Analysis: PHASE1_ANALYSIS,
  phase2TeamConfig: PHASE2_TEAM_CONFIG,
  phase3WavePlanning: PHASE3_WAVE_PLANNING,
  phase4Deployment: PHASE4_DEPLOYMENT,
  phase5Execution: PHASE5_EXECUTION,
  phase6Integration: PHASE6_INTEGRATION,
  phase7Quality: PHASE7_QUALITY,
  waveExecutionProtocol: WAVE_EXECUTION_PROTOCOL,
};