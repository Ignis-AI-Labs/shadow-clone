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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = void 0;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../utils/constants");
class AuthProvider {
    constructor(context) {
        this._onDidChangeAuth = new vscode.EventEmitter();
        this.onDidChangeAuth = this._onDidChangeAuth.event;
        this.context = context;
    }
    async authenticate(apiKey) {
        try {
            // Validate API key with backend
            const response = await axios_1.default.post(`${(0, constants_1.getApiEndpoint)()}/shadow-clone-licenses/validate`, {
                apiKey
            }, {
                headers: {
                    'X-API-Key': apiKey
                }
            });
            if (response.data.valid) {
                // Check if license is active
                const isActive = response.data.isActive !== false;
                // Store encrypted credentials regardless of active status
                await this.context.secrets.store(AuthProvider.AUTH_KEY, JSON.stringify({
                    apiKey,
                    userId: response.data.userId,
                    licenseType: response.data.licenseType,
                    isActive,
                    timestamp: Date.now()
                }));
                this._onDidChangeAuth.fire();
                if (!isActive) {
                    return {
                        success: true,
                        isActive: false,
                        message: 'Your license is currently inactive. Please check your subscription status.'
                    };
                }
                return { success: true, isActive: true };
            }
            return { success: false, message: 'Invalid API key' };
        }
        catch (error) {
            console.error('Authentication failed:', error);
            // Check for specific error messages
            if (error.response?.status === 401) {
                return { success: false, message: 'Invalid API key. Please check your credentials.' };
            }
            else if (error.response?.status === 403) {
                return { success: false, message: 'Access denied. Your license may have expired.' };
            }
            return { success: false, message: 'Authentication failed. Please try again.' };
        }
    }
    async checkAuth() {
        const authData = await this.getAuth();
        if (!authData)
            return false;
        // Check if auth is expired (24 hours)
        const isExpired = Date.now() - authData.timestamp > 24 * 60 * 60 * 1000;
        if (isExpired) {
            await this.logout();
            return false;
        }
        return true;
    }
    async getAuth() {
        const authStr = await this.context.secrets.get(AuthProvider.AUTH_KEY);
        if (!authStr)
            return null;
        try {
            return JSON.parse(authStr);
        }
        catch {
            return null;
        }
    }
    async getApiKey() {
        const auth = await this.getAuth();
        return auth?.apiKey || null;
    }
    async getLicenseType() {
        const auth = await this.getAuth();
        return auth?.licenseType || null;
    }
    async logout() {
        await this.context.secrets.delete(AuthProvider.AUTH_KEY);
        this._onDidChangeAuth.fire();
    }
    async updateCredentials(apiKey) {
        // This is essentially the same as authenticate but we're being explicit about updating
        return this.authenticate(apiKey);
    }
    async isLicenseActive() {
        const auth = await this.getAuth();
        return auth?.isActive !== false;
    }
    async makeAuthenticatedRequest(url, options = {}) {
        const apiKey = await this.getApiKey();
        if (!apiKey) {
            throw new Error('Not authenticated');
        }
        return (0, axios_1.default)({
            ...options,
            url,
            headers: {
                ...options.headers,
                'X-API-Key': apiKey
            }
        });
    }
}
exports.AuthProvider = AuthProvider;
AuthProvider.AUTH_KEY = 'shadowClone.auth';
//# sourceMappingURL=authProvider.js.map