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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseStatusManager = void 0;
const vscode = __importStar(require("vscode"));
const constants_1 = require("../utils/constants");
class LicenseStatusManager {
    constructor(context, authProvider) {
        this.context = context;
        this.authProvider = authProvider;
        this._onStatusChanged = new vscode.EventEmitter();
        this.onStatusChanged = this._onStatusChanged.event;
        this.currentStatus = null;
        this.isChecking = false;
        this.startupCheckComplete = false;
        this.startupCheckPromise = null;
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
    async checkLicenseStatusOnStartup() {
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
                        vscode.window.setStatusBarMessage(`$(check) Shadow Clone: License verified - ${status.licenseType}`, 5000);
                    }
                    else {
                        vscode.window.showWarningMessage('Shadow Clone: Your license is currently inactive. Please check your subscription status.');
                    }
                }
                else {
                    console.log('Shadow Clone: Startup license check failed - could not retrieve status');
                    vscode.window.setStatusBarMessage('$(warning) Shadow Clone: Could not verify license status', 5000);
                }
            });
        }
        this.startupCheckComplete = true;
    }
    async waitForStartupCheck() {
        if (this.startupCheckPromise) {
            await this.startupCheckPromise;
        }
    }
    isStartupCheckComplete() {
        return this.startupCheckComplete;
    }
    loadCachedStatus() {
        const cached = this.context.globalState.get(LicenseStatusManager.STATUS_KEY);
        if (cached) {
            try {
                const status = JSON.parse(cached);
                status.lastChecked = new Date(status.lastChecked);
                if (status.expiresAt) {
                    status.expiresAt = new Date(status.expiresAt);
                }
                this.currentStatus = status;
            }
            catch (error) {
                console.error('Failed to load cached license status:', error);
            }
        }
    }
    saveStatus(status) {
        this.currentStatus = status;
        if (status) {
            this.context.globalState.update(LicenseStatusManager.STATUS_KEY, JSON.stringify(status));
        }
        else {
            this.context.globalState.update(LicenseStatusManager.STATUS_KEY, undefined);
        }
        this._onStatusChanged.fire(status);
    }
    startRefreshTimer() {
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
    shouldRefresh() {
        if (!this.currentStatus)
            return true;
        const timeSinceLastCheck = Date.now() - this.currentStatus.lastChecked.getTime();
        return timeSinceLastCheck >= LicenseStatusManager.REFRESH_INTERVAL;
    }
    async checkLicenseStatus(force = false) {
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
            // Check license status
            const response = await this.authProvider.makeAuthenticatedRequest(`${(0, constants_1.getApiEndpoint)()}/shadow_clone_licenses`);
            const licenses = response.data;
            const userLicense = Array.isArray(licenses)
                ? licenses.find((lic) => lic.api_key === authData.apiKey ||
                    lic.userId === authData.userId ||
                    lic.email === authData.email)
                : licenses;
            if (!userLicense) {
                console.error('Could not find user license in response');
                // Keep existing status if we can't find the license
                if (this.currentStatus) {
                    this.currentStatus.lastChecked = new Date();
                    this.saveStatus(this.currentStatus);
                }
                return this.currentStatus;
            }
            // Update status
            const status = {
                isActive: userLicense.is_active !== false,
                licenseType: userLicense.license_type || userLicense.licenseType || authData.licenseType,
                lastChecked: new Date(),
                userId: userLicense.userId || authData.userId,
                email: userLicense.email
            };
            // Add expiration if available
            if (userLicense.expires_at || userLicense.expiresAt) {
                status.expiresAt = new Date(userLicense.expires_at || userLicense.expiresAt);
            }
            this.saveStatus(status);
            // Show notification if status changed
            if (this.currentStatus && this.currentStatus.isActive !== status.isActive) {
                if (status.isActive) {
                    vscode.window.showInformationMessage('Shadow Clone license is now active!');
                }
                else {
                    vscode.window.showWarningMessage('Shadow Clone license has become inactive.');
                }
            }
            return status;
        }
        catch (error) {
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
        }
        finally {
            this.isChecking = false;
        }
    }
    async checkLicenseStatusAlternative() {
        try {
            // Try validation endpoint as fallback
            const authData = await this.authProvider.getAuth();
            if (!authData)
                return null;
            const response = await this.authProvider.makeAuthenticatedRequest(`${(0, constants_1.getApiEndpoint)()}/shadow-clone-licenses/validate`, {
                method: 'POST',
                data: { apiKey: authData.apiKey }
            });
            if (response.data.valid) {
                const status = {
                    isActive: true,
                    licenseType: response.data.licenseType || authData.licenseType,
                    lastChecked: new Date(),
                    userId: response.data.userId || authData.userId
                };
                this.saveStatus(status);
                return status;
            }
        }
        catch (error) {
            console.error('Alternative license check failed:', error);
        }
        return this.currentStatus;
    }
    getStatus() {
        return this.currentStatus;
    }
    async refreshStatus() {
        return this.checkLicenseStatus(true);
    }
    dispose() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        this._onStatusChanged.dispose();
    }
}
exports.LicenseStatusManager = LicenseStatusManager;
LicenseStatusManager.REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
LicenseStatusManager.STATUS_KEY = 'shadowClone.licenseStatus';
//# sourceMappingURL=licenseStatusManager.js.map