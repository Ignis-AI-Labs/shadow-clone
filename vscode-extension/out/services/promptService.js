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
            const response = await this.authProvider.makeAuthenticatedRequest(`${(0, constants_1.getApiEndpoint)()}/api/prompts/shadow-clone`);
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
        // Fetch the main prompt
        const mainPrompt = await this.getMainPrompt();
        // Build the command components
        const parts = [];
        // Start with the main prompt content
        parts.push('```shadow-clone');
        parts.push(mainPrompt.content);
        // Add mode configuration if specified
        if (options.mode && options.mode !== 'custom') {
            try {
                const modeConfig = await this.getMode(options.mode);
                parts.push('\n---MODE CONFIGURATION---');
                parts.push(modeConfig.content);
            }
            catch (error) {
                console.warn(`Could not load mode ${options.mode}:`, error);
            }
        }
        parts.push('```');
        // Add execution parameters
        const params = ['execute'];
        if (options.projectPlan) {
            params.push(`project_plan=${options.projectPlan}`);
        }
        if (options.wavesDirectory) {
            params.push(`waves_directory=${options.wavesDirectory}`);
        }
        if (options.mode) {
            params.push(`mode=${options.mode}`);
        }
        if (options.additionalParams) {
            for (const [key, value] of Object.entries(options.additionalParams)) {
                params.push(`${key}=${value}`);
            }
        }
        // Combine prompt and parameters
        return parts.join('\n') + '\n\nExecute Shadow Clone with: ' + params.join(' ');
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