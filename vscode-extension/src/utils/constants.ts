// API configuration - these will be obfuscated in production build
export const SHADOW_CLONE_API = getApiEndpoint();
export const SHADOW_CLONE_WS = getWebSocketEndpoint();

// License types
export const LICENSE_TYPES = {
    IGNIS_ELITE: 'ignis_elite',
    PIONEER: 'pioneer',
    BUILDER: 'builder',
    RESERVE: 'reserve'
} as const;

// Agent deployment limits
export const DEPLOYMENT_LIMITS = {
    MAX_AGENTS_PER_WAVE: 10,
    MAX_CONCURRENT_PROJECTS: 5,
    MAX_WAVES_PER_PROJECT: 10
} as const;

// File patterns
export const WAVE_DIRECTORY_PATTERN = /^\.waves$/;
export const AGENT_OUTPUT_PATTERN = /^wave-\d+$/;

// Commands
export const COMMANDS = {
    CREATE_PROJECT: 'shadowClone.createProject',
    DEPLOY_AGENTS: 'shadowClone.deployAgents',
    SHOW_STATUS: 'shadowClone.showStatus',
    AUTHENTICATE: 'shadowClone.authenticate',
    REFRESH_PROJECTS: 'shadowClone.refreshProjects',
    REFRESH_AGENTS: 'shadowClone.refreshAgents'
} as const;

// Get API endpoint from settings or environment
function getApiEndpoint(): string {
    const config = vscode.workspace.getConfiguration('shadowClone');
    return config.get<string>('apiEndpoint') || process.env.SHADOW_CLONE_API || 'https://api.shadowclone.ai';
}

// Get WebSocket endpoint
function getWebSocketEndpoint(): string {
    const apiEndpoint = getApiEndpoint();
    return apiEndpoint.replace(/^https?:/, 'wss:').replace(/\/api$/, '/ws');
}

// Import vscode after functions to avoid circular dependency
import * as vscode from 'vscode';