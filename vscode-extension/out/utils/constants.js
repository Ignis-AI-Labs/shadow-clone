"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHADOW_CLONE_WS = exports.SHADOW_CLONE_API = exports.DEFAULT_WS_ENDPOINT = exports.DEFAULT_API_ENDPOINT = exports.COMMANDS = exports.AGENT_OUTPUT_PATTERN = exports.WAVE_DIRECTORY_PATTERN = exports.DEPLOYMENT_LIMITS = exports.TEST_ADDRESSES = exports.LICENSE_TYPES = void 0;
exports.getApiEndpoint = getApiEndpoint;
exports.getWebSocketEndpoint = getWebSocketEndpoint;
const vscode = __importStar(require("vscode"));
// License types
exports.LICENSE_TYPES = {
    TRIPLE_OG: 'tripleOG',
    DOUBLE_OG: 'doubleOG',
    SINGLE_OG: 'singleOG',
    IGNIS_ELITE: 'ignisElite',
    PIONEER: 'pioneer',
    BUILDER: 'builder',
    RESERVE: 'reserve'
};
// Test addresses that are treated as tripleOG holders
exports.TEST_ADDRESSES = [
    "0xc7892218FfE73AaFA2Dc1Bd118d26c2C324c1291",
    "0x4faa0fac32f844acaf59b5b5a72c0d38de8bd0cd",
    "0x98164369278d01270158BaDc39A5b96f71758C13"
];
// Agent deployment limits
exports.DEPLOYMENT_LIMITS = {
    MAX_AGENTS_PER_WAVE: 10,
    MAX_CONCURRENT_PROJECTS: 5,
    MAX_WAVES_PER_PROJECT: 10
};
// File patterns
exports.WAVE_DIRECTORY_PATTERN = /^\.waves$/;
exports.AGENT_OUTPUT_PATTERN = /^wave-\d+$/;
// Commands
exports.COMMANDS = {
    CREATE_PROJECT: 'shadowClone.createProject',
    DEPLOY_AGENTS: 'shadowClone.deployAgents',
    SHOW_STATUS: 'shadowClone.showStatus',
    AUTHENTICATE: 'shadowClone.authenticate',
    REFRESH_PROJECTS: 'shadowClone.refreshProjects',
    REFRESH_AGENTS: 'shadowClone.refreshAgents'
};
// Default API endpoints
exports.DEFAULT_API_ENDPOINT = 'https://api.ignislabs.ai';
exports.DEFAULT_WS_ENDPOINT = 'wss://api.ignislabs.ai/ws';
// Get API endpoint from settings or environment
function getApiEndpoint() {
    try {
        const config = vscode.workspace.getConfiguration('shadowClone');
        return config.get('apiEndpoint') || process.env.SHADOW_CLONE_API || exports.DEFAULT_API_ENDPOINT;
    }
    catch {
        // Fallback if vscode is not available yet
        return process.env.SHADOW_CLONE_API || exports.DEFAULT_API_ENDPOINT;
    }
}
// Get WebSocket endpoint
function getWebSocketEndpoint() {
    const apiEndpoint = getApiEndpoint();
    return apiEndpoint.replace(/^https?:/, 'wss:').replace(/\/api$/, '/ws');
}
// For backward compatibility - these should be called as functions
exports.SHADOW_CLONE_API = exports.DEFAULT_API_ENDPOINT;
exports.SHADOW_CLONE_WS = exports.DEFAULT_WS_ENDPOINT;
//# sourceMappingURL=constants.js.map