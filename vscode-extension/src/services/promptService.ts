import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';
import { getApiEndpoint, getPromptApiEndpoint } from '../utils/constants';

export interface ShadowClonePrompt {
    content: string;
    version: string;
    lastUpdated: string;
}

export interface ShadowCloneMode {
    name: string;
    description: string;
    content: string;
}

export class PromptService {
    private cache: Map<string, { data: any; timestamp: number }> = new Map();
    private cacheTimeout = 30 * 60 * 1000; // 30 minutes

    constructor(private authProvider: AuthProvider) {}

    async getMainPrompt(): Promise<ShadowClonePrompt> {
        const cacheKey = 'main-prompt';
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.authProvider.makeAuthenticatedRequest(
                `${getPromptApiEndpoint()}/api/prompts/shadow-clone`
            );
            
            const prompt = response.data as ShadowClonePrompt;
            this.setCache(cacheKey, prompt);
            return prompt;
        } catch (error) {
            throw new Error(`Failed to fetch Shadow Clone prompt: ${error}`);
        }
    }

    async getModes(): Promise<string[]> {
        const cacheKey = 'modes-list';
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.authProvider.makeAuthenticatedRequest(
                `${getPromptApiEndpoint()}/api/prompts/modes`
            );
            
            const modes = response.data.modes as string[];
            this.setCache(cacheKey, modes);
            return modes;
        } catch (error) {
            throw new Error(`Failed to fetch modes: ${error}`);
        }
    }

    async getMode(modeName: string): Promise<ShadowCloneMode> {
        const cacheKey = `mode-${modeName}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.authProvider.makeAuthenticatedRequest(
                `${getPromptApiEndpoint()}/api/prompts/modes/${modeName}`
            );
            
            const mode = response.data as ShadowCloneMode;
            this.setCache(cacheKey, mode);
            return mode;
        } catch (error) {
            throw new Error(`Failed to fetch mode ${modeName}: ${error}`);
        }
    }

    async buildCommand(options: {
        mode?: string;
        projectPlan?: string;
        wavesDirectory?: string;
        additionalParams?: Record<string, string>;
    }): Promise<string> {
        // Build the command to fetch prompts from API
        const promptApiEndpoint = getPromptApiEndpoint();
        const apiKey = await this.authProvider.getApiKey();
        
        if (!apiKey) {
            throw new Error('No API key found. Please authenticate first.');
        }
        
        // Build a command that tells Claude to fetch the prompt from the API
        const parts: string[] = [];
        
        parts.push('Fetch the Shadow Clone orchestration prompt from the API:');
        parts.push(`curl -X GET ${promptApiEndpoint}/api/prompts/shadow-clone -H "X-API-Key: ${apiKey}"`);
        parts.push('');
        parts.push('Then execute it with the following parameters:');
        
        // Add execution parameters
        const params: string[] = [];
        
        if (options.projectPlan) {
            params.push(`project_plan=${options.projectPlan}`);
        }
        
        if (options.wavesDirectory) {
            params.push(`waves_directory=${options.wavesDirectory}`);
        }
        
        if (options.mode && options.mode !== 'custom') {
            params.push(`mode=${options.mode}`);
            parts.push(`Also fetch the ${options.mode} mode configuration from:`);
            parts.push(`curl -X GET ${promptApiEndpoint}/api/prompts/modes/${options.mode} -H "X-API-Key: ${apiKey}"`);
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

    private getFromCache(key: string): any {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    private setCache(key: string, data: any): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache(): void {
        this.cache.clear();
    }
}