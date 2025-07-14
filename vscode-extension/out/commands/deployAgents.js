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
exports.deployAgentsCommand = deployAgentsCommand;
const vscode = __importStar(require("vscode"));
const constants_1 = require("../utils/constants");
const websocket_1 = require("../utils/websocket");
async function deployAgentsCommand(authProvider, agentProvider, projectId) {
    // Check authentication
    const hasAuth = await authProvider.checkAuth();
    if (!hasAuth) {
        vscode.window.showErrorMessage('Please authenticate first');
        vscode.commands.executeCommand('shadowClone.authenticate');
        return;
    }
    // Get project ID if not provided
    if (!projectId) {
        try {
            // Note: This endpoint doesn't exist in the new API structure
            // TODO: Remove or replace with actual endpoint
            const response = await authProvider.makeAuthenticatedRequest(`${constants_1.SHADOW_CLONE_API}/projects`);
            const projects = response.data;
            if (projects.length === 0) {
                vscode.window.showErrorMessage('No projects found. Create a project first.');
                vscode.commands.executeCommand('shadowClone.createProject');
                return;
            }
            const projectItems = projects.map((p) => ({
                label: p.name,
                description: p.status,
                detail: p.description,
                id: p.id
            }));
            const selected = await vscode.window.showQuickPick(projectItems, {
                placeHolder: 'Select a project to deploy agents'
            });
            if (!selected)
                return;
            projectId = selected.id;
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to fetch projects: ${error.message}`);
            return;
        }
    }
    // Show deployment options
    const deploymentOptions = [
        { label: 'Quick Deploy', description: 'Deploy default agent team', value: 'quick' },
        { label: 'Custom Deploy', description: 'Select specific agents', value: 'custom' },
        { label: 'Wave Deploy', description: 'Deploy in multiple waves', value: 'wave' }
    ];
    const deploymentType = await vscode.window.showQuickPick(deploymentOptions, {
        placeHolder: 'Select deployment type'
    });
    if (!deploymentType)
        return;
    let agentConfig = {};
    if (deploymentType.value === 'custom') {
        // Let user select specific agents
        const availableAgents = [
            { label: 'Architect', id: 'architect', description: 'System design and architecture' },
            { label: 'Frontend Developer', id: 'frontend', description: 'UI/UX implementation' },
            { label: 'Backend Developer', id: 'backend', description: 'Server and API development' },
            { label: 'Database Engineer', id: 'database', description: 'Data modeling and optimization' },
            { label: 'DevOps Engineer', id: 'devops', description: 'Infrastructure and deployment' },
            { label: 'QA Engineer', id: 'qa', description: 'Testing and quality assurance' },
            { label: 'Security Engineer', id: 'security', description: 'Security analysis and hardening' },
            { label: 'Documentation Writer', id: 'docs', description: 'Technical documentation' },
            { label: 'Project Manager', id: 'pm', description: 'Task coordination' },
            { label: 'Code Reviewer', id: 'reviewer', description: 'Code quality and standards' }
        ];
        const selectedAgents = await vscode.window.showQuickPick(availableAgents, {
            placeHolder: 'Select agents to deploy (max 10)',
            canPickMany: true
        });
        if (!selectedAgents || selectedAgents.length === 0)
            return;
        if (selectedAgents.length > constants_1.DEPLOYMENT_LIMITS.MAX_AGENTS_PER_WAVE) {
            vscode.window.showWarningMessage(`Maximum ${constants_1.DEPLOYMENT_LIMITS.MAX_AGENTS_PER_WAVE} agents per wave. Excess agents will be deployed in next wave.`);
        }
        agentConfig.agents = selectedAgents.map(a => a.id);
        agentConfig.deploymentType = 'custom';
    }
    else if (deploymentType.value === 'wave') {
        const waveCount = await vscode.window.showInputBox({
            prompt: 'Number of waves to deploy',
            value: '3',
            validateInput: (value) => {
                const num = parseInt(value);
                if (isNaN(num) || num < 1 || num > constants_1.DEPLOYMENT_LIMITS.MAX_WAVES_PER_PROJECT) {
                    return `Please enter a number between 1 and ${constants_1.DEPLOYMENT_LIMITS.MAX_WAVES_PER_PROJECT}`;
                }
                return null;
            }
        });
        if (!waveCount)
            return;
        agentConfig.waveCount = parseInt(waveCount);
        agentConfig.deploymentType = 'wave';
    }
    else {
        agentConfig.deploymentType = 'quick';
    }
    // Start deployment
    try {
        const outputChannel = vscode.window.createOutputChannel('Shadow Clone Deployment');
        outputChannel.show();
        outputChannel.appendLine('🚀 Starting Shadow Clone agent deployment...\n');
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Deploying Shadow Clone agents...',
            cancellable: true
        }, async (progress, token) => {
            // Initialize WebSocket for real-time updates
            const wsManager = new websocket_1.WebSocketManager(authProvider);
            token.onCancellationRequested(() => {
                wsManager.disconnect();
                outputChannel.appendLine('\n❌ Deployment cancelled by user');
            });
            // Connect to deployment stream
            await wsManager.connect(projectId);
            wsManager.on('agent-status', (data) => {
                outputChannel.appendLine(`[${data.agent}] ${data.status}: ${data.message}`);
                progress.report({ message: `${data.agent}: ${data.status}` });
            });
            wsManager.on('wave-complete', (data) => {
                outputChannel.appendLine(`\n✅ Wave ${data.waveNumber} completed!`);
                agentProvider.refresh();
            });
            // Send deployment request
            progress.report({ increment: 10, message: 'Initializing deployment...' });
            // Note: This endpoint doesn't exist in the new API structure
            // TODO: Remove or replace with actual endpoint
            const response = await authProvider.makeAuthenticatedRequest(`${constants_1.SHADOW_CLONE_API}/projects/${projectId}/deploy`, {
                method: 'POST',
                data: agentConfig
            });
            outputChannel.appendLine(`Deployment ID: ${response.data.deploymentId}`);
            outputChannel.appendLine(`Estimated time: ${response.data.estimatedTime}`);
            outputChannel.appendLine('\n--- Agent Activity ---\n');
            // Wait for completion
            return new Promise((resolve, reject) => {
                wsManager.on('deployment-complete', (data) => {
                    outputChannel.appendLine('\n🎉 Deployment completed successfully!');
                    outputChannel.appendLine(`Total time: ${data.totalTime}`);
                    outputChannel.appendLine(`Agents deployed: ${data.agentCount}`);
                    wsManager.disconnect();
                    resolve(data);
                });
                wsManager.on('deployment-error', (error) => {
                    outputChannel.appendLine(`\n❌ Deployment error: ${error.message}`);
                    wsManager.disconnect();
                    reject(new Error(error.message));
                });
            });
        });
        // Show completion message
        const action = await vscode.window.showInformationMessage('Agent deployment completed! Check the output for details.', 'Open Project Folder', 'View Deliverables');
        if (action === 'Open Project Folder') {
            const uri = vscode.Uri.file(`${vscode.workspace.rootPath}/.waves`);
            vscode.commands.executeCommand('revealInExplorer', uri);
        }
        else if (action === 'View Deliverables') {
            vscode.commands.executeCommand('shadowClone.showDeliverables', projectId);
        }
    }
    catch (error) {
        vscode.window.showErrorMessage(`Deployment failed: ${error.message}`);
    }
}
//# sourceMappingURL=deployAgents.js.map