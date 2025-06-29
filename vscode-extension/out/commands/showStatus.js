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
exports.showStatusCommand = showStatusCommand;
const vscode = __importStar(require("vscode"));
const constants_1 = require("../utils/constants");
async function showStatusCommand(authProvider, licenseStatusManager) {
    const hasAuth = await authProvider.checkAuth();
    if (!hasAuth) {
        const choice = await vscode.window.showWarningMessage('Not authenticated with Shadow Clone', 'Authenticate', 'Cancel');
        if (choice === 'Authenticate') {
            vscode.commands.executeCommand('shadowClone.authenticate');
        }
        return;
    }
    try {
        // Fetch user status and license information from Ignis API
        const [licenseResponse] = await Promise.all([
            authProvider.makeAuthenticatedRequest(`${(0, constants_1.getApiEndpoint)()}/shadow_clone_licenses`)
        ]);
        const licenses = licenseResponse.data;
        // Get the authenticated user's data from stored auth
        const authData = await authProvider.getAuth();
        // Find the user's license from the response
        const userLicense = Array.isArray(licenses)
            ? licenses.find((lic) => lic.api_key === authData.apiKey || lic.userId === authData.userId)
            : licenses;
        if (!userLicense) {
            vscode.window.showErrorMessage('Could not find your license information');
            return;
        }
        // Build user object from license data
        const user = {
            id: userLicense.userId || authData.userId,
            licenseType: userLicense.license_type || userLicense.licenseType || authData.licenseType,
            email: userLicense.email,
            activeProjects: 0,
            totalDeployments: 0
        };
        const license = {
            isActive: userLicense.is_active !== false,
            features: {
                maxConcurrentProjects: 5,
                prioritySupport: ['tripleOG', 'creator'].includes(user.licenseType),
                earlyAccess: ['tripleOG', 'creator', 'doubleOG'].includes(user.licenseType)
            },
            expiresAt: null // NFT holders have lifetime access
        };
        // If license is inactive, show warning
        if (!license.isActive) {
            const choice = await vscode.window.showWarningMessage('Your Shadow Clone license is currently inactive. Would you like to update your API key?', 'Update API Key', 'View Status Anyway', 'Contact Support');
            if (choice === 'Update API Key') {
                vscode.commands.executeCommand('shadowClone.updateCredentials');
                return;
            }
            else if (choice === 'Contact Support') {
                vscode.env.openExternal(vscode.Uri.parse('https://ignislabs.ai/support'));
                return;
            }
            // Continue to show status if "View Status Anyway" is selected
        }
        const projects = []; // Projects not available from this endpoint
        // Format license type display
        const licenseDisplay = {
            [constants_1.LICENSE_TYPES.TRIPLE_OG]: '🔥 Triple OG (All Phases)',
            [constants_1.LICENSE_TYPES.DOUBLE_OG]: '🚀 Double OG (Phase 1)',
            [constants_1.LICENSE_TYPES.SINGLE_OG]: '💎 Single OG (Phase 2)',
            [constants_1.LICENSE_TYPES.IGNIS_ELITE]: '✨ Ignis Elite (Phase 3)',
            [constants_1.LICENSE_TYPES.PIONEER]: '🚀 Pioneer License',
            [constants_1.LICENSE_TYPES.BUILDER]: '🏗️ Builder License',
            [constants_1.LICENSE_TYPES.RESERVE]: '💎 Reserve License'
        };
        // Create status panel
        const panel = vscode.window.createWebviewPanel('shadowCloneStatus', 'Shadow Clone Status', vscode.ViewColumn.One, {
            enableScripts: true
        });
        panel.webview.html = getStatusWebviewContent({
            user: {
                ...user,
                licenseDisplay: licenseDisplay[user.licenseType] || user.licenseType
            },
            license,
            projects,
            extensionVersion: vscode.extensions.getExtension('shadow-clone.shadow-clone')?.packageJSON.version || '0.1.0'
        });
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'createProject':
                    vscode.commands.executeCommand('shadowClone.createProject');
                    break;
                case 'updateCredentials':
                    vscode.commands.executeCommand('shadowClone.updateCredentials');
                    panel.dispose();
                    break;
                case 'manageLicense':
                    vscode.env.openExternal(vscode.Uri.parse('https://ignislabs.ai/dashboard'));
                    break;
                case 'viewDocs':
                    vscode.env.openExternal(vscode.Uri.parse('https://docs.shadow-clone.ai'));
                    break;
            }
        }, undefined, []);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to fetch status: ${error.message}`);
    }
}
function getStatusWebviewContent(data) {
    const { user, license, projects, extensionVersion } = data;
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shadow Clone Status</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .status-card {
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .status-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        .status-title {
            font-size: 24px;
            font-weight: 600;
            margin: 0;
        }
        .license-badge {
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 14px;
            margin-left: 16px;
        }
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }
        .stat-item {
            background-color: var(--vscode-input-background);
            padding: 16px;
            border-radius: 4px;
        }
        .stat-label {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .stat-value {
            font-size: 20px;
            font-weight: 600;
        }
        .license-info {
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 3px solid var(--vscode-textLink-foreground);
            padding: 12px;
            margin-bottom: 16px;
        }
        .project-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .project-item {
            padding: 12px;
            border-bottom: 1px solid var(--vscode-panel-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .project-item:last-child {
            border-bottom: none;
        }
        .project-name {
            font-weight: 500;
        }
        .project-status {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 3px;
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
        }
        .action-buttons {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }
        .button {
            padding: 8px 16px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid var(--vscode-panel-border);
            text-align: center;
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
        }
        .feature-tag {
            display: inline-block;
            padding: 2px 6px;
            margin: 2px;
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            border-radius: 3px;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="status-card">
            <div class="status-header">
                <h1 class="status-title">Shadow Clone Status</h1>
                <span class="license-badge">${user.licenseDisplay}</span>
            </div>
            
            ${!license.isActive ? `
            <div style="background-color: var(--vscode-inputValidation-errorBackground); border: 1px solid var(--vscode-inputValidation-errorBorder); padding: 12px; margin-bottom: 20px; border-radius: 4px;">
                <strong style="color: var(--vscode-errorForeground);">⚠️ License Inactive</strong><br>
                Your Shadow Clone license is currently inactive. Please check your subscription status or update your API key.
            </div>
            ` : ''}
            
            <div class="stat-grid">
                <div class="stat-item">
                    <div class="stat-label">Account ID</div>
                    <div class="stat-value">#${user.id}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">License Status</div>
                    <div class="stat-value" style="${!license.isActive ? 'color: var(--vscode-errorForeground);' : ''}">${license.isActive ? 'Active' : 'Inactive'}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Active Projects</div>
                    <div class="stat-value">${user.activeProjects || 0} / ${license.features?.maxConcurrentProjects || 5}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Total Deployments</div>
                    <div class="stat-value">${user.totalDeployments || 0}</div>
                </div>
            </div>
            
            <div class="license-info">
                <strong>License Features:</strong><br>
                ${license.features?.prioritySupport ? '<span class="feature-tag">Priority Support</span>' : ''}
                ${license.features?.earlyAccess ? '<span class="feature-tag">Early Access</span>' : ''}
                ${license.expiresAt ? `<br><small>Expires: ${new Date(license.expiresAt).toLocaleDateString()}</small>` : '<br><small>Lifetime Access (NFT)</small>'}
            </div>
            
            <div class="action-buttons">
                ${license.isActive ? `
                <button class="button" onclick="createProject()">Create Project</button>
                ` : `
                <button class="button" onclick="updateCredentials()">Update API Key</button>
                `}
                <button class="button" onclick="manageLicense()">Manage License</button>
                <button class="button" onclick="viewDocs()">Documentation</button>
            </div>
        </div>
        
        <div class="status-card">
            <h2>Recent Projects</h2>
            ${projects.length > 0 ? `
            <ul class="project-list">
                ${projects.map((p) => `
                <li class="project-item">
                    <span class="project-name">${p.name}</span>
                    <span class="project-status">${p.status}</span>
                </li>
                `).join('')}
            </ul>
            ` : '<p>No projects yet. Create your first project to get started!</p>'}
        </div>
        
        <div class="footer">
            Shadow Clone Extension v${extensionVersion} • 
            ${['tripleOG', 'doubleOG', 'singleOG', 'ignisElite'].includes(user.licenseType) ? 'NFT Verified ✓' : `License #${user.licenseNumber || 'N/A'}`}
        </div>
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        function createProject() {
            vscode.postMessage({ command: 'createProject' });
        }
        
        function updateCredentials() {
            vscode.postMessage({ command: 'updateCredentials' });
        }
        
        function manageLicense() {
            vscode.postMessage({ command: 'manageLicense' });
        }
        
        function viewDocs() {
            vscode.postMessage({ command: 'viewDocs' });
        }
    </script>
</body>
</html>`;
}
//# sourceMappingURL=showStatus.js.map