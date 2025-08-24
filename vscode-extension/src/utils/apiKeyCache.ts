import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * API Key Cache for VS Code Extension
 * Manages API key storage across VS Code settings, workspace, and global config
 */
export class ApiKeyCache {
    private static instance: ApiKeyCache;
    private context: vscode.ExtensionContext;
    private globalConfigDir = path.join(os.homedir(), '.shadow-clone');
    private globalConfigFile = path.join(this.globalConfigDir, 'config.json');
    
    private constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.ensureConfigDirectory();
    }
    
    static initialize(context: vscode.ExtensionContext): void {
        ApiKeyCache.instance = new ApiKeyCache(context);
    }
    
    static getInstance(): ApiKeyCache {
        if (!ApiKeyCache.instance) {
            throw new Error('ApiKeyCache not initialized. Call initialize() first.');
        }
        return ApiKeyCache.instance;
    }
    
    /**
     * Get API key from all available sources
     */
    async getApiKey(): Promise<string | undefined> {
        // 1. Check VS Code secret storage (most secure)
        const secretKey = await this.context.secrets.get('shadowClone.apiKey');
        if (secretKey) {
            return secretKey;
        }
        
        // 2. Check workspace settings
        const workspaceKey = vscode.workspace.getConfiguration('shadowClone').get<string>('apiKey');
        if (workspaceKey) {
            // Migrate to secret storage
            await this.saveApiKey(workspaceKey);
            // Clear from settings for security
            await vscode.workspace.getConfiguration('shadowClone').update('apiKey', undefined, true);
            return workspaceKey;
        }
        
        // 3. Check environment variable
        if (process.env.SHADOW_CLONE_API_KEY) {
            return process.env.SHADOW_CLONE_API_KEY;
        }
        
        // 4. Check workspace .env file
        const workspaceEnvKey = await this.getFromWorkspaceEnv();
        if (workspaceEnvKey) {
            return workspaceEnvKey;
        }
        
        // 5. Check global config (shared with MCP server)
        const globalKey = await this.getFromGlobalConfig();
        if (globalKey) {
            return globalKey;
        }
        
        // 6. Check global state (legacy)
        const globalStateKey = this.context.globalState.get<string>('apiKey');
        if (globalStateKey) {
            // Migrate to secret storage
            await this.saveApiKey(globalStateKey);
            await this.context.globalState.update('apiKey', undefined);
            return globalStateKey;
        }
        
        return undefined;
    }
    
    /**
     * Save API key to multiple locations
     */
    async saveApiKey(apiKey: string): Promise<void> {
        // Save to VS Code secret storage (most secure)
        await this.context.secrets.store('shadowClone.apiKey', apiKey);
        
        // Set in environment for current session
        process.env.SHADOW_CLONE_API_KEY = apiKey;
        
        // Save to workspace .env if in a workspace
        if (vscode.workspace.workspaceFolders?.length) {
            await this.saveToWorkspaceEnv(apiKey);
        }
        
        // Save to global config (shared with MCP)
        await this.saveToGlobalConfig(apiKey);
        
        // Show confirmation
        vscode.window.showInformationMessage('✅ API key saved and cached successfully');
    }
    
    /**
     * Clear API key from all locations
     */
    async clearApiKey(): Promise<void> {
        await this.context.secrets.delete('shadowClone.apiKey');
        delete process.env.SHADOW_CLONE_API_KEY;
        await this.removeFromWorkspaceEnv();
        await this.clearGlobalConfig();
        
        vscode.window.showInformationMessage('🗑️ API key cleared from all caches');
    }
    
    /**
     * Get from workspace .env file
     */
    private async getFromWorkspaceEnv(): Promise<string | undefined> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return undefined;
        
        const envPath = path.join(workspaceFolder.uri.fsPath, '.env');
        
        try {
            if (fs.existsSync(envPath)) {
                const content = fs.readFileSync(envPath, 'utf8');
                const match = content.match(/^SHADOW_CLONE_API_KEY=(.+)$/m);
                
                if (match && match[1]) {
                    return match[1].replace(/^["']|["']$/g, '');
                }
            }
        } catch (error) {
            console.error('Error reading .env file:', error);
        }
        
        return undefined;
    }
    
    /**
     * Save to workspace .env file
     */
    private async saveToWorkspaceEnv(apiKey: string): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return;
        
        const envPath = path.join(workspaceFolder.uri.fsPath, '.env');
        const gitignorePath = path.join(workspaceFolder.uri.fsPath, '.gitignore');
        
        try {
            let content = '';
            
            if (fs.existsSync(envPath)) {
                content = fs.readFileSync(envPath, 'utf8');
                content = content.replace(/^SHADOW_CLONE_API_KEY=.*$/m, '');
                content = content.trim();
                if (content) content += '\n';
            }
            
            content += `\n# Shadow Clone API Key (auto-generated by VS Code)\nSHADOW_CLONE_API_KEY="${apiKey}"\n`;
            
            fs.writeFileSync(envPath, content);
            
            // Ensure .env is in .gitignore
            this.ensureEnvInGitignore(gitignorePath);
            
        } catch (error) {
            console.error('Error saving to .env file:', error);
        }
    }
    
    /**
     * Remove from workspace .env file
     */
    private async removeFromWorkspaceEnv(): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return;
        
        const envPath = path.join(workspaceFolder.uri.fsPath, '.env');
        
        try {
            if (fs.existsSync(envPath)) {
                let content = fs.readFileSync(envPath, 'utf8');
                content = content.replace(/^# Shadow Clone API Key.*\n?/m, '');
                content = content.replace(/^SHADOW_CLONE_API_KEY=.*\n?/m, '');
                fs.writeFileSync(envPath, content);
            }
        } catch (error) {
            console.error('Error removing from .env file:', error);
        }
    }
    
    /**
     * Get from global config (shared with MCP)
     */
    private async getFromGlobalConfig(): Promise<string | undefined> {
        try {
            if (fs.existsSync(this.globalConfigFile)) {
                const content = fs.readFileSync(this.globalConfigFile, 'utf8');
                const config = JSON.parse(content);
                
                if (config.apiKey) {
                    return this.decrypt(config.apiKey);
                }
            }
        } catch (error) {
            console.error('Error reading global config:', error);
        }
        
        return undefined;
    }
    
    /**
     * Save to global config (shared with MCP)
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
                    config = {};
                }
            }
            
            config.apiKey = this.encrypt(apiKey);
            config.lastUpdated = new Date().toISOString();
            config.updatedBy = 'vscode-extension';
            
            fs.writeFileSync(this.globalConfigFile, JSON.stringify(config, null, 2));
            
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
                
                fs.writeFileSync(this.globalConfigFile, JSON.stringify(config, null, 2));
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
            
            if (process.platform !== 'win32') {
                fs.chmodSync(this.globalConfigDir, 0o700);
            }
        }
    }
    
    /**
     * Ensure .env is in .gitignore
     */
    private ensureEnvInGitignore(gitignorePath: string): void {
        try {
            if (!fs.existsSync(path.dirname(gitignorePath) + '/.git')) {
                return;
            }
            
            let gitignoreContent = '';
            
            if (fs.existsSync(gitignorePath)) {
                gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
            }
            
            if (!gitignoreContent.includes('.env')) {
                if (gitignoreContent && !gitignoreContent.endsWith('\n')) {
                    gitignoreContent += '\n';
                }
                
                gitignoreContent += '\n# Shadow Clone - Protect API keys\n.env\n.env.local\n';
                
                fs.writeFileSync(gitignorePath, gitignoreContent);
            }
        } catch (error) {
            // Silent fail
        }
    }
    
    /**
     * Simple encryption (matching MCP server)
     */
    private encrypt(text: string): string {
        const key = 'shadow-clone-2024';
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(
                text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        
        return Buffer.from(result, 'binary').toString('base64');
    }
    
    /**
     * Simple decryption (matching MCP server)
     */
    private decrypt(encoded: string): string {
        try {
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
            return encoded;
        }
    }
    
    /**
     * Show cache status in output channel
     */
    async showCacheStatus(outputChannel: vscode.OutputChannel): Promise<void> {
        outputChannel.appendLine('=== API Key Cache Status ===');
        
        const apiKey = await this.getApiKey();
        outputChannel.appendLine(`API Key Found: ${apiKey ? '✅ Yes' : '❌ No'}`);
        
        outputChannel.appendLine('\nStorage Locations Checked:');
        outputChannel.appendLine('1. VS Code Secret Storage');
        outputChannel.appendLine('2. Workspace Settings');
        outputChannel.appendLine('3. Environment Variable (SHADOW_CLONE_API_KEY)');
        outputChannel.appendLine('4. Workspace .env file');
        outputChannel.appendLine('5. Global Config (~/.shadow-clone/config.json)');
        outputChannel.appendLine('6. VS Code Global State (legacy)');
        
        outputChannel.appendLine('\n=========================');
    }
}