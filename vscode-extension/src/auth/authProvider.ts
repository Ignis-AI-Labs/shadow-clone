import * as vscode from 'vscode';
import axios from 'axios';
import { getApiEndpoint } from '../utils/constants';

export class AuthProvider {
    private static readonly AUTH_KEY = 'shadowClone.auth';
    private context: vscode.ExtensionContext;
    private _onDidChangeAuth: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeAuth: vscode.Event<void> = this._onDidChangeAuth.event;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    async authenticate(apiKey: string): Promise<boolean> {
        try {
            // Validate API key with backend
            const response = await axios.post(`${getApiEndpoint()}/auth/validate`, {
                apiKey
            }, {
                headers: {
                    'X-API-Key': apiKey
                }
            });

            if (response.data.valid) {
                // Store encrypted credentials
                await this.context.secrets.store(AuthProvider.AUTH_KEY, JSON.stringify({
                    apiKey,
                    userId: response.data.userId,
                    licenseType: response.data.licenseType,
                    timestamp: Date.now()
                }));
                
                this._onDidChangeAuth.fire();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Authentication failed:', error);
            return false;
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
        this._onDidChangeAuth.fire();
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