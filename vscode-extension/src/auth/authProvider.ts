import * as vscode from 'vscode';
import axios from 'axios';
import { getApiEndpoint } from '../utils/constants';
import { ApiKeyCache } from '../utils/apiKeyCache';

export class AuthProvider {
    private static readonly AUTH_KEY = 'shadowClone.auth';
    private context: vscode.ExtensionContext;
    private _onDidChangeAuth: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeAuth: vscode.Event<void> = this._onDidChangeAuth.event;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    async authenticate(apiKey: string): Promise<{ success: boolean; isActive?: boolean; message?: string }> {
        try {
            // Validate API key with backend
            const response = await axios.post(`${getApiEndpoint()}/shadow-clone-licenses/validate`, {
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
                
                // Also save to API key cache for cross-session persistence
                const cache = ApiKeyCache.getInstance();
                await cache.saveApiKey(apiKey);
                
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
        } catch (error: any) {
            console.error('Authentication failed:', error);
            
            // Check for specific error messages
            if (error.response?.status === 401) {
                return { success: false, message: 'Invalid API key. Please check your credentials.' };
            } else if (error.response?.status === 403) {
                return { success: false, message: 'Access denied. Your license may have expired.' };
            }
            
            return { success: false, message: 'Authentication failed. Please try again.' };
        }
    }

    async checkAuth(): Promise<boolean> {
        const authData = await this.getAuth();
        if (!authData) return false;

        // Check if auth is expired (24 hours)
        const isExpired = Date.now() - authData.timestamp > 24 * 60 * 60 * 1000;
        if (isExpired) {
            await this.logout();
            return false;
        }

        return true;
    }

    async getAuth(): Promise<any> {
        const authStr = await this.context.secrets.get(AuthProvider.AUTH_KEY);
        if (!authStr) return null;
        
        try {
            return JSON.parse(authStr);
        } catch {
            return null;
        }
    }

    async getApiKey(): Promise<string | null> {
        const auth = await this.getAuth();
        return auth?.apiKey || null;
    }

    async getLicenseType(): Promise<string | null> {
        const auth = await this.getAuth();
        return auth?.licenseType || null;
    }

    async logout(): Promise<void> {
        await this.context.secrets.delete(AuthProvider.AUTH_KEY);
        
        // Also clear from cache
        const cache = ApiKeyCache.getInstance();
        await cache.clearApiKey();
        
        this._onDidChangeAuth.fire();
    }
    
    async checkCachedAuth(): Promise<boolean> {
        // Try to authenticate with cached API key
        const cache = ApiKeyCache.getInstance();
        const cachedKey = await cache.getApiKey();
        
        if (cachedKey) {
            vscode.window.setStatusBarMessage('$(sync~spin) Shadow Clone: Validating cached API key...', 3000);
            const result = await this.authenticate(cachedKey);
            
            if (result.success && result.isActive) {
                vscode.window.showInformationMessage('✅ Shadow Clone: Authenticated with cached API key');
                return true;
            } else if (!result.success) {
                vscode.window.showWarningMessage('⚠️ Cached API key is invalid. Please authenticate again.');
                await cache.clearApiKey();
            }
        }
        
        return false;
    }

    async updateCredentials(apiKey: string): Promise<{ success: boolean; isActive?: boolean; message?: string }> {
        // This is essentially the same as authenticate but we're being explicit about updating
        return this.authenticate(apiKey);
    }

    async isLicenseActive(): Promise<boolean> {
        const auth = await this.getAuth();
        return auth?.isActive !== false;
    }

    async makeAuthenticatedRequest(url: string, options: any = {}): Promise<any> {
        const apiKey = await this.getApiKey();
        if (!apiKey) {
            throw new Error('Not authenticated');
        }

        return axios({
            ...options,
            url,
            headers: {
                ...options.headers,
                'X-API-Key': apiKey
            }
        });
    }
}