import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';
import { getApiEndpoint } from '../utils/constants';

export interface LicenseStatus {
    isActive: boolean;
    licenseType: string;
    lastChecked: Date;
    expiresAt?: Date;
    userId?: string;
    email?: string;
}

export class LicenseStatusManager {
    private static readonly REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
    private static readonly STATUS_KEY = 'shadowClone.licenseStatus';
    
    private refreshTimer?: NodeJS.Timeout;
    private _onStatusChanged: vscode.EventEmitter<LicenseStatus | null> = new vscode.EventEmitter<LicenseStatus | null>();
    public readonly onStatusChanged: vscode.Event<LicenseStatus | null> = this._onStatusChanged.event;
    
    private currentStatus: LicenseStatus | null = null;
    private isChecking = false;
    private startupCheckComplete = false;
    private startupCheckPromise: Promise<void> | null = null;
    
    constructor(
        private context: vscode.ExtensionContext,
        private authProvider: AuthProvider
    ) {
        // Load cached status
        this.loadCachedStatus();
        
        // Check status immediately on startup
        this.startupCheckPromise = this.checkLicenseStatusOnStartup();
        
        // Start refresh timer
        this.startRefreshTimer();
        
        // Check status when auth changes
        this.authProvider.onDidChangeAuth(() => {
            this.checkLicenseStatus();
        });
        
        // Register disposal
        context.subscriptions.push({
            dispose: () => this.dispose()
        });
    }
    
    private async checkLicenseStatusOnStartup(): Promise<void> {
        // Check if authenticated
        const hasAuth = await this.authProvider.checkAuth();
        if (hasAuth) {
            console.log('Shadow Clone: Checking license status on startup...');
            
            // Show progress
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Window,
                title: 'Shadow Clone: Verifying license status...'
            }, async (progress) => {
                progress.report({ increment: 50 });
                
                // Force a fresh check on startup
                const status = await this.checkLicenseStatus(true);
                
                progress.report({ increment: 100 });
                
                // Show result
                if (status) {
                    console.log(`Shadow Clone: Startup license check complete - Active: ${status.isActive}, Type: ${status.licenseType}`);
                    
                    if (status.isActive) {
                        vscode.window.setStatusBarMessage(
                            `$(check) Shadow Clone: License verified - ${status.licenseType}`, 
                            5000
                        );
                    } else {
                        vscode.window.showWarningMessage(
                            'Shadow Clone: Your license is currently inactive. Please check your subscription status.'
                        );
                    }
                } else {
                    console.log('Shadow Clone: Startup license check failed - could not retrieve status');
                    vscode.window.setStatusBarMessage(
                        '$(warning) Shadow Clone: Could not verify license status', 
                        5000
                    );
                }
            });
        }
        
        this.startupCheckComplete = true;
    }
    
    async waitForStartupCheck(): Promise<void> {
        if (this.startupCheckPromise) {
            await this.startupCheckPromise;
        }
    }
    
    isStartupCheckComplete(): boolean {
        return this.startupCheckComplete;
    }
    
    private loadCachedStatus(): void {
        const cached = this.context.globalState.get<string>(LicenseStatusManager.STATUS_KEY);
        if (cached) {
            try {
                const status = JSON.parse(cached);
                status.lastChecked = new Date(status.lastChecked);
                if (status.expiresAt) {
                    status.expiresAt = new Date(status.expiresAt);
                }
                this.currentStatus = status;
            } catch (error) {
                console.error('Failed to load cached license status:', error);
            }
        }
    }
    
    private saveStatus(status: LicenseStatus | null): void {
        this.currentStatus = status;
        if (status) {
            this.context.globalState.update(LicenseStatusManager.STATUS_KEY, JSON.stringify(status));
        } else {
            this.context.globalState.update(LicenseStatusManager.STATUS_KEY, undefined);
        }
        this._onStatusChanged.fire(status);
    }
    
    private startRefreshTimer(): void {
        // Clear any existing timer
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        // Check immediately if needed
        if (this.shouldRefresh()) {
            this.checkLicenseStatus();
        }
        
        // Set up periodic refresh
        this.refreshTimer = setInterval(() => {
            this.checkLicenseStatus();
        }, LicenseStatusManager.REFRESH_INTERVAL);
    }
    
    private shouldRefresh(): boolean {
        if (!this.currentStatus) return true;
        
        const timeSinceLastCheck = Date.now() - this.currentStatus.lastChecked.getTime();
        return timeSinceLastCheck >= LicenseStatusManager.REFRESH_INTERVAL;
    }
    
    async checkLicenseStatus(force: boolean = false): Promise<LicenseStatus | null> {
        // Don't check if not authenticated
        const hasAuth = await this.authProvider.checkAuth();
        if (!hasAuth) {
            this.saveStatus(null);
            return null;
        }
        
        // Don't check if already checking
        if (this.isChecking && !force) {
            return this.currentStatus;
        }
        
        // Don't check if recently checked (unless forced)
        if (!force && this.currentStatus && !this.shouldRefresh()) {
            return this.currentStatus;
        }
        
        this.isChecking = true;
        
        try {
            // Get auth data
            const authData = await this.authProvider.getAuth();
            if (!authData) {
                this.saveStatus(null);
                return null;
            }
            
            // Use validation endpoint directly since /shadow_clone_licenses doesn't exist
            const response = await this.authProvider.makeAuthenticatedRequest(
                `${getApiEndpoint()}/shadow-clone-licenses/validate`,
                {
                    method: 'POST',
                    data: { apiKey: authData.apiKey }
                }
            );
            
            if (!response.data.valid) {
                console.error('License validation failed');
                // Keep existing status if validation fails
                if (this.currentStatus) {
                    this.currentStatus.lastChecked = new Date();
                    this.saveStatus(this.currentStatus);
                }
                return this.currentStatus;
            }
            
            // Update status from validation response
            const status: LicenseStatus = {
                isActive: response.data.isActive !== false,
                licenseType: response.data.licenseType || authData.licenseType,
                lastChecked: new Date(),
                userId: response.data.userId || authData.userId,
                email: response.data.email || authData.email
            };
            
            // Add expiration if available
            if (response.data.expiresAt) {
                status.expiresAt = new Date(response.data.expiresAt);
            }
            
            this.saveStatus(status);
            
            // Show notification if status changed
            if (this.currentStatus && this.currentStatus.isActive !== status.isActive) {
                if (status.isActive) {
                    vscode.window.showInformationMessage('Shadow Clone license is now active!');
                } else {
                    vscode.window.showWarningMessage('Shadow Clone license has become inactive.');
                }
            }
            
            return status;
            
        } catch (error: any) {
            console.error('Failed to check license status:', error);
            
            // If it's a 404, try alternative endpoints
            if (error.response?.status === 404) {
                return this.checkLicenseStatusAlternative();
            }
            
            // Keep existing status on error
            if (this.currentStatus) {
                this.currentStatus.lastChecked = new Date();
                this.saveStatus(this.currentStatus);
            }
            
            return this.currentStatus;
            
        } finally {
            this.isChecking = false;
        }
    }
    
    private async checkLicenseStatusAlternative(): Promise<LicenseStatus | null> {
        try {
            // Try validation endpoint as fallback
            const authData = await this.authProvider.getAuth();
            if (!authData) return null;
            
            const response = await this.authProvider.makeAuthenticatedRequest(
                `${getApiEndpoint()}/shadow-clone-licenses/validate`,
                {
                    method: 'POST',
                    data: { apiKey: authData.apiKey }
                }
            );
            
            if (response.data.valid) {
                const status: LicenseStatus = {
                    isActive: true,
                    licenseType: response.data.licenseType || authData.licenseType,
                    lastChecked: new Date(),
                    userId: response.data.userId || authData.userId
                };
                
                this.saveStatus(status);
                return status;
            }
            
        } catch (error) {
            console.error('Alternative license check failed:', error);
        }
        
        return this.currentStatus;
    }
    
    getStatus(): LicenseStatus | null {
        return this.currentStatus;
    }
    
    async refreshStatus(): Promise<LicenseStatus | null> {
        return this.checkLicenseStatus(true);
    }
    
    dispose(): void {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        this._onStatusChanged.dispose();
    }
}