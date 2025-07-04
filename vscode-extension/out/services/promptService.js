"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptService = void 0;
const constants_1 = require("../utils/constants");
class PromptService {
    constructor(authProvider) {
        this.authProvider = authProvider;
        this.cache = new Map();
        this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
    }
    async getMainPrompt() {
        const cacheKey = 'main-prompt';
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await this.authProvider.makeAuthenticatedRequest(`${(0, constants_1.getApiEndpoint)()}/api/prompts/shadow-clone-prompt`);
            const prompt = response.data;
            this.setCache(cacheKey, prompt);
            return prompt;
        }
        catch (error) {
            throw new Error(`Failed to fetch Shadow Clone prompt: ${error}`);
        }
    }
    async getModes() {
        const cacheKey = 'modes-list';
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await this.authProvider.makeAuthenticatedRequest(`${(0, constants_1.getApiEndpoint)()}/api/prompts/modes`);
            const modes = response.data.modes;
            this.setCache(cacheKey, modes);
            return modes;
        }
        catch (error) {
            throw new Error(`Failed to fetch modes: ${error}`);
        }
    }
    async getMode(modeName) {
        const cacheKey = `mode-${modeName}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await this.authProvider.makeAuthenticatedRequest(`${(0, constants_1.getApiEndpoint)()}/api/prompts/modes/${modeName}`);
            const mode = response.data;
            this.setCache(cacheKey, mode);
            return mode;
        }
        catch (error) {
            throw new Error(`Failed to fetch mode ${modeName}: ${error}`);
        }
    }
    async buildCommand(options) {
        // Build the command to fetch prompts from API
        const apiEndpoint = (0, constants_1.getApiEndpoint)();
        const apiKey = await this.authProvider.getApiKey();
        if (!apiKey) {
            throw new Error('No API key found. Please authenticate first.');
        }
        // Build a command that tells Claude to fetch the prompt from the API
        const parts = [];
        parts.push('Fetch the Shadow Clone orchestration prompt from the API:');
        parts.push(`curl -X GET ${apiEndpoint}/api/prompts/shadow-clone-prompt -H "X-API-Key: ${apiKey}"`);
        parts.push('');
        parts.push('Then execute it with the following parameters:');
        // Add execution parameters
        const params = [];
        if (options.projectPlan) {
            params.push(`project_plan=${options.projectPlan}`);
        }
        if (options.wavesDirectory) {
            params.push(`waves_directory=${options.wavesDirectory}`);
        }
        if (options.mode && options.mode !== 'custom') {
            params.push(`mode=${options.mode}`);
            parts.push(`Also fetch the ${options.mode} mode configuration from:`);
            parts.push(`curl -X GET ${apiEndpoint}/api/prompts/modes/${options.mode} -H "X-API-Key: ${apiKey}"`);
        }
        if (options.additionalParams) {
            for (const [key, value] of Object.entries(options.additionalParams)) {
                params.push(`${key}=${value}`);
            }
        }
        parts.push('');
        parts.push('Parameters: ' + (params.length > 0 ? params.join(' ') : '(none)'));
        return parts.join('\n');
    }
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached)
            return null;
        if (Date.now() - cached.timestamp > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    clearCache() {
        this.cache.clear();
    }
}
exports.PromptService = PromptService;
//# sourceMappingURL=promptService.js.map