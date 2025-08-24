import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import { config } from '../config/production.js';

/**
 * API Key Manager - Handles caching and persistence of API keys
 * 
 * Storage hierarchy (in order of preference):
 * 1. Environment variable (SHADOW_CLONE_API_KEY)
 * 2. Local .env file in project root
 * 3. Global config file (~/.shadow-clone/config.json)
 * 4. In-memory cache (session only)
 */
export class ApiKeyManager {
    private static instance: ApiKeyManager;
    private memoryCache: string | null = null;
    private lastValidationTime: number = 0;
    private validationInterval = 5 * 60 * 1000; // 5 minutes
    
    // File paths
    private globalConfigDir = path.join(os.homedir(), '.shadow-clone');
    private globalConfigFile = path.join(this.globalConfigDir, 'config.json');
    private localEnvFile = path.join(process.cwd(), '.env');
    private gitignorePath = path.join(process.cwd(), '.gitignore');
    
    private constructor() {
        this.ensureConfigDirectory();
        this.ensureEnvInGitignore();
    }
    
    static getInstance(): ApiKeyManager {
        if (!ApiKeyManager.instance) {
            ApiKeyManager.instance = new ApiKeyManager();
        }
        return ApiKeyManager.instance;
    }
    
    /**
     * Get API key from all available sources
     */
    async getApiKey(): Promise<string | null> {
        // 1. Check environment variable first (highest priority)
        if (process.env.SHADOW_CLONE_API_KEY) {
            return process.env.SHADOW_CLONE_API_KEY;
        }
        
        // 2. Check local .env file
        const localKey = await this.getFromLocalEnv();
        if (localKey) {
            return localKey;
        }
        
        // 3. Check global config
        const globalKey = await this.getFromGlobalConfig();
        if (globalKey) {
            return globalKey;
        }
        
        // 4. Check memory cache (last resort)
        return this.memoryCache;
    }
    
    /**
     * Save API key to multiple locations for redundancy
     */
    async saveApiKey(apiKey: string): Promise<void> {
        // Always save to memory first
        this.memoryCache = apiKey;
        
        // Set in current process environment
        process.env.SHADOW_CLONE_API_KEY = apiKey;
        
        // Save to local .env file
        await this.saveToLocalEnv(apiKey);
        
        // Save to global config
        await this.saveToGlobalConfig(apiKey);
        
        // Reset validation timer
        this.lastValidationTime = Date.now();
    }
    
    /**
     * Check if API key needs revalidation
     */
    needsValidation(): boolean {
        return Date.now() - this.lastValidationTime > this.validationInterval;
    }
    
    /**
     * Mark validation as completed
     */
    markValidated(): void {
        this.lastValidationTime = Date.now();
    }
    
    /**
     * Clear API key from all storage locations
     */
    async clearApiKey(): Promise<void> {
        this.memoryCache = null;
        delete process.env.SHADOW_CLONE_API_KEY;
        
        // Clear from local .env
        await this.removeFromLocalEnv();
        
        // Clear from global config
        await this.clearGlobalConfig();
    }
    
    /**
     * Get from local .env file
     */
    private async getFromLocalEnv(): Promise<string | null> {
        try {
            if (!fs.existsSync(this.localEnvFile)) {
                return null;
            }
            
            const content = fs.readFileSync(this.localEnvFile, 'utf8');
            const match = content.match(/^SHADOW_CLONE_API_KEY=(.+)$/m);
            
            if (match && match[1]) {
                // Remove quotes if present
                return match[1].replace(/^["']|["']$/g, '');
            }
        } catch (error) {
            console.error('Error reading .env file:', error);
        }
        
        return null;
    }
    
    /**
     * Save to local .env file
     */
    private async saveToLocalEnv(apiKey: string): Promise<void> {
        try {
            let content = '';
            
            if (fs.existsSync(this.localEnvFile)) {
                content = fs.readFileSync(this.localEnvFile, 'utf8');
                
                // Remove existing SHADOW_CLONE_API_KEY if present
                content = content.replace(/^SHADOW_CLONE_API_KEY=.*$/m, '');
                
                // Trim empty lines
                content = content.trim();
                
                if (content) {
                    content += '\n';
                }
            }
            
            // Add new API key
            content += `\n# Shadow Clone API Key (auto-generated)\nSHADOW_CLONE_API_KEY="${apiKey}"\n`;
            
            fs.writeFileSync(this.localEnvFile, content);
            
            // Ensure .env is in .gitignore
            this.ensureEnvInGitignore();
            
        } catch (error) {
            console.error('Error saving to .env file:', error);
        }
    }
    
    /**
     * Remove from local .env file
     */
    private async removeFromLocalEnv(): Promise<void> {
        try {
            if (!fs.existsSync(this.localEnvFile)) {
                return;
            }
            
            let content = fs.readFileSync(this.localEnvFile, 'utf8');
            
            // Remove SHADOW_CLONE_API_KEY line and its comment
            content = content.replace(/^# Shadow Clone API Key.*\n?/m, '');
            content = content.replace(/^SHADOW_CLONE_API_KEY=.*\n?/m, '');
            
            fs.writeFileSync(this.localEnvFile, content);
            
        } catch (error) {
            console.error('Error removing from .env file:', error);
        }
    }
    
    /**
     * Get from global config file
     */
    private async getFromGlobalConfig(): Promise<string | null> {
        try {
            if (!fs.existsSync(this.globalConfigFile)) {
                return null;
            }
            
            const content = fs.readFileSync(this.globalConfigFile, 'utf8');
            const config = JSON.parse(content);
            
            if (config.apiKey) {
                // Decrypt if encrypted (simple obfuscation for now)
                return this.decrypt(config.apiKey);
            }
        } catch (error) {
            console.error('Error reading global config:', error);
        }
        
        return null;
    }
    
    /**
     * Save to global config file
     */
    private async saveToGlobalConfig(apiKey: string): Promise<void> {
        try {
            this.ensureConfigDirectory();
            
            let config: any = {};
            
            if (fs.existsSync(this.globalConfigFile)) {
                try {
                    const content = fs.readFileSync(this.globalConfigFile, 'utf8');
                    config = JSON.parse(content);
                } catch {
                    // Invalid JSON, start fresh
                    config = {};
                }
            }
            
            // Encrypt API key (simple obfuscation)
            config.apiKey = this.encrypt(apiKey);
            config.lastUpdated = new Date().toISOString();
            config.version = '1.0.0';
            
            fs.writeFileSync(
                this.globalConfigFile,
                JSON.stringify(config, null, 2)
            );
            
            // Set restrictive permissions (Unix-like systems)
            if (process.platform !== 'win32') {
                fs.chmodSync(this.globalConfigFile, 0o600);
            }
            
        } catch (error) {
            console.error('Error saving to global config:', error);
        }
    }
    
    /**
     * Clear global config
     */
    private async clearGlobalConfig(): Promise<void> {
        try {
            if (fs.existsSync(this.globalConfigFile)) {
                const content = fs.readFileSync(this.globalConfigFile, 'utf8');
                const config = JSON.parse(content);
                
                delete config.apiKey;
                config.lastCleared = new Date().toISOString();
                
                fs.writeFileSync(
                    this.globalConfigFile,
                    JSON.stringify(config, null, 2)
                );
            }
        } catch (error) {
            console.error('Error clearing global config:', error);
        }
    }
    
    /**
     * Ensure config directory exists
     */
    private ensureConfigDirectory(): void {
        if (!fs.existsSync(this.globalConfigDir)) {
            fs.mkdirSync(this.globalConfigDir, { recursive: true });
            
            // Set restrictive permissions (Unix-like systems)
            if (process.platform !== 'win32') {
                fs.chmodSync(this.globalConfigDir, 0o700);
            }
        }
    }
    
    /**
     * Ensure .env is in .gitignore
     */
    private ensureEnvInGitignore(): void {
        try {
            // Only do this if we're in a git repository
            if (!fs.existsSync(path.join(process.cwd(), '.git'))) {
                return;
            }
            
            let gitignoreContent = '';
            
            if (fs.existsSync(this.gitignorePath)) {
                gitignoreContent = fs.readFileSync(this.gitignorePath, 'utf8');
            }
            
            // Check if .env is already in gitignore
            if (!gitignoreContent.includes('.env')) {
                // Add .env to gitignore
                if (gitignoreContent && !gitignoreContent.endsWith('\n')) {
                    gitignoreContent += '\n';
                }
                
                gitignoreContent += '\n# Shadow Clone - Protect API keys\n.env\n.env.local\n';
                
                fs.writeFileSync(this.gitignorePath, gitignoreContent);
                
                console.log('Added .env to .gitignore to protect API keys');
            }
        } catch (error) {
            // Silent fail - not critical
        }
    }
    
    /**
     * Simple encryption (obfuscation) for storage
     */
    private encrypt(text: string): string {
        // Simple XOR-based obfuscation (not cryptographically secure, just hiding from casual viewing)
        const key = 'shadow-clone-2024';
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        
        // Base64 encode for storage
        return Buffer.from(result, 'binary').toString('base64');
    }
    
    /**
     * Simple decryption (deobfuscation)
     */
    private decrypt(encoded: string): string {
        try {
            // Base64 decode
            const encrypted = Buffer.from(encoded, 'base64').toString('binary');
            
            const key = 'shadow-clone-2024';
            let result = '';
            
            for (let i = 0; i < encrypted.length; i++) {
                result += String.fromCharCode(
                    encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
                );
            }
            
            return result;
        } catch {
            return encoded; // Return as-is if decryption fails
        }
    }
    
    /**
     * Get user-friendly storage location info
     */
    async getStorageInfo(): Promise<{ locations: string[], current: string | null }> {
        const locations = [
            `Environment: SHADOW_CLONE_API_KEY`,
            `Local: ${this.localEnvFile}`,
            `Global: ${this.globalConfigFile}`,
            `Memory: ${this.memoryCache ? 'Cached' : 'Not cached'}`
        ];
        
        let current = null;
        if (process.env.SHADOW_CLONE_API_KEY) {
            current = 'Environment variable';
        } else if (fs.existsSync(this.localEnvFile)) {
            const localKey = await this.getFromLocalEnv();
            if (localKey) current = 'Local .env file';
        } else if (fs.existsSync(this.globalConfigFile)) {
            const globalKey = await this.getFromGlobalConfig();
            if (globalKey) current = 'Global config';
        } else if (this.memoryCache) {
            current = 'Memory cache';
        }
        
        return { locations, current };
    }
}