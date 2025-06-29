import * as vscode from 'vscode';

// License types
export const LICENSE_TYPES = {
    TRIPLE_OG: 'tripleOG',
    DOUBLE_OG: 'doubleOG',
    SINGLE_OG: 'singleOG',
    IGNIS_ELITE: 'ignisElite',
    PIONEER: 'pioneer',
    BUILDER: 'builder',
    RESERVE: 'reserve'
} as const;

// Test addresses that are treated as tripleOG holders
export const TEST_ADDRESSES = [
    "0xc7892218FfE73AaFA2Dc1Bd118d26c2C324c1291",
    "0x4faa0fac32f844acaf59b5b5a72c0d38de8bd0cd",
    "0x98164369278d01270158BaDc39A5b96f71758C13"
];

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
export const DEFAULT_API_ENDPOINT = 'https://api.ignislabs.ai';
export const DEFAULT_WS_ENDPOINT = 'wss://api.ignislabs.ai/ws';

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