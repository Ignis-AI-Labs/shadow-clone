import * as vscode from 'vscode';

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

// Default API endpoints
export const DEFAULT_API_ENDPOINT = 'https://api.shadowclone.ai';
export const DEFAULT_WS_ENDPOINT = 'wss://api.shadowclone.ai/ws';

// Get API endpoint from settings or environment
export function getApiEndpoint(): string {
    try {
        const config = vscode.workspace.getConfiguration('shadowClone');
        return config.get<string>('apiEndpoint') || process.env.SHADOW_CLONE_API || DEFAULT_API_ENDPOINT;
    } catch {
        // Fallback if vscode is not available yet
        return process.env.SHADOW_CLONE_API || DEFAULT_API_ENDPOINT;
    }
}

// Get WebSocket endpoint
export function getWebSocketEndpoint(): string {
    const apiEndpoint = getApiEndpoint();
    return apiEndpoint.replace(/^https?:/, 'wss:').replace(/\/api$/, '/ws');
}

// For backward compatibility - these should be called as functions
export const SHADOW_CLONE_API = DEFAULT_API_ENDPOINT;
export const SHADOW_CLONE_WS = DEFAULT_WS_ENDPOINT;