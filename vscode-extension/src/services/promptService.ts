import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';
import { getApiEndpoint } from '../utils/constants';

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
                `${getApiEndpoint()}/api/prompts/shadow-clone`
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
                `${getApiEndpoint()}/api/prompts/modes`
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
                `${getApiEndpoint()}/api/prompts/modes/${modeName}`
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
        // Fetch the main prompt
        const mainPrompt = await this.getMainPrompt();
        
        // Build the command components
        const parts: string[] = [];
        
        // Start with the main prompt content
        parts.push('```shadow-clone');
        parts.push(mainPrompt.content);
        
        // Add mode configuration if specified
        if (options.mode && options.mode !== 'custom') {
            try {
                const modeConfig = await this.getMode(options.mode);
                parts.push('\n---MODE CONFIGURATION---');
                parts.push(modeConfig.content);
            } catch (error) {
                console.warn(`Could not load mode ${options.mode}:`, error);
            }
        }
        
        parts.push('```');
        
        // Add execution parameters
        const params: string[] = ['execute'];
        
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