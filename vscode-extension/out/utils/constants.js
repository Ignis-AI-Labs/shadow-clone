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
exports.COMMANDS = exports.AGENT_OUTPUT_PATTERN = exports.WAVE_DIRECTORY_PATTERN = exports.DEPLOYMENT_LIMITS = exports.LICENSE_TYPES = exports.SHADOW_CLONE_WS = exports.SHADOW_CLONE_API = void 0;
// API configuration - these will be obfuscated in production build
exports.SHADOW_CLONE_API = getApiEndpoint();
exports.SHADOW_CLONE_WS = getWebSocketEndpoint();
// License types
exports.LICENSE_TYPES = {
    IGNIS_ELITE: 'ignis_elite',
    PIONEER: 'pioneer',
    BUILDER: 'builder',
    RESERVE: 'reserve'
};
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
// Get API endpoint from settings or environment
function getApiEndpoint() {
    const config = vscode.workspace.getConfiguration('shadowClone');
    return config.get('apiEndpoint') || process.env.SHADOW_CLONE_API || 'https://api.shadowclone.ai';
}
// Get WebSocket endpoint
function getWebSocketEndpoint() {
    const apiEndpoint = getApiEndpoint();
    return apiEndpoint.replace(/^https?:/, 'wss:').replace(/\/api$/, '/ws');
}
// Import vscode after functions to avoid circular dependency
const vscode = __importStar(require("vscode"));
//# sourceMappingURL=constants.js.map