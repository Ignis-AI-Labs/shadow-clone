import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';
import { getApiEndpoint, LICENSE_TYPES } from '../utils/constants';

export async function showStatusCommand(authProvider: AuthProvider) {
    const hasAuth = await authProvider.checkAuth();
    
    if (!hasAuth) {
        const choice = await vscode.window.showWarningMessage(
            'Not authenticated with Shadow Clone',
            'Authenticate',
            'Cancel'
        );
        
        if (choice === 'Authenticate') {
            vscode.commands.executeCommand('shadowClone.authenticate');
        }
        return;
    }

    try {
        // Fetch user status and license information
        const [userResponse, licenseResponse, projectsResponse] = await Promise.all([
            authProvider.makeAuthenticatedRequest(`${getApiEndpoint()}/user/profile`),
            authProvider.makeAuthenticatedRequest(`${getApiEndpoint()}/user/license-status`),
            authProvider.makeAuthenticatedRequest(`${getApiEndpoint()}/projects?limit=5`)
        ]);

        const user = userResponse.data;
        const license = licenseResponse.data;
        const projects = projectsResponse.data;

        // Format license type display
        const licenseDisplay = {
            [LICENSE_TYPES.IGNIS_ELITE]: '🔥 Ignis Elite (NFT Holder)',
            [LICENSE_TYPES.PIONEER]: '🚀 Pioneer License',
            [LICENSE_TYPES.BUILDER]: '🏗️ Builder License',
            [LICENSE_TYPES.RESERVE]: '💎 Reserve License'
        };

        // Create status panel
        const panel = vscode.window.createWebviewPanel(
            'shadowCloneStatus',
            'Shadow Clone Status',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = getStatusWebviewContent({
            user: {
                ...user,
                licenseDisplay: licenseDisplay[user.licenseType as keyof typeof licenseDisplay] || user.licenseType
            },
            license,
            projects,
            extensionVersion: vscode.extensions.getExtension('shadow-clone.shadow-clone')?.packageJSON.version || '0.1.0'
        });

    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to fetch status: ${error.message}`);
    }
}

function getStatusWebviewContent(data: any): string {
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
            
            <div class="stat-grid">
                <div class="stat-item">
                    <div class="stat-label">Account ID</div>
                    <div class="stat-value">#${user.id}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">License Status</div>
                    <div class="stat-value">${license.isActive ? 'Active' : 'Inactive'}</div>
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
                <button class="button" onclick="createProject()">Create Project</button>
                <button class="button" onclick="manageLicense()">Manage License</button>
                <button class="button" onclick="viewDocs()">Documentation</button>
            </div>
        </div>
        
        <div class="status-card">
            <h2>Recent Projects</h2>
            ${projects.length > 0 ? `
            <ul class="project-list">
                ${projects.map((p: any) => `
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
            ${user.licenseType === LICENSE_TYPES.IGNIS_ELITE ? 'NFT Verified ✓' : `License #${user.licenseNumber || 'N/A'}`}
        </div>
    </div>
    
    <script>
        const vscode = acquireVsCodeApi();
        
        function createProject() {
            vscode.postMessage({ command: 'createProject' });
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