import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';
import { AgentProvider } from '../providers/agentProvider';
import { SHADOW_CLONE_API, DEPLOYMENT_LIMITS } from '../utils/constants';
import { WebSocketManager } from '../utils/websocket';

export async function deployAgentsCommand(authProvider: AuthProvider, agentProvider: AgentProvider, projectId?: string) {
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
            const response = await authProvider.makeAuthenticatedRequest(`${SHADOW_CLONE_API}/projects`);
            const projects = response.data;
            
            if (projects.length === 0) {
                vscode.window.showErrorMessage('No projects found. Create a project first.');
                vscode.commands.executeCommand('shadowClone.createProject');
                return;
            }

            const projectItems = projects.map((p: any) => ({
                label: p.name,
                description: p.status,
                detail: p.description,
                id: p.id
            }));

            const selected = await vscode.window.showQuickPick(projectItems, {
                placeHolder: 'Select a project to deploy agents'
            });

            if (!selected) return;
            projectId = (selected as any).id;
        } catch (error: any) {
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

    if (!deploymentType) return;

    let agentConfig: any = {};

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

        if (!selectedAgents || selectedAgents.length === 0) return;

        if (selectedAgents.length > DEPLOYMENT_LIMITS.MAX_AGENTS_PER_WAVE) {
            vscode.window.showWarningMessage(`Maximum ${DEPLOYMENT_LIMITS.MAX_AGENTS_PER_WAVE} agents per wave. Excess agents will be deployed in next wave.`);
        }

        agentConfig.agents = selectedAgents.map(a => a.id);
        agentConfig.deploymentType = 'custom';
    } else if (deploymentType.value === 'wave') {
        const waveCount = await vscode.window.showInputBox({
            prompt: 'Number of waves to deploy',
            value: '3',
            validateInput: (value) => {
                const num = parseInt(value);
                if (isNaN(num) || num < 1 || num > DEPLOYMENT_LIMITS.MAX_WAVES_PER_PROJECT) {
                    return `Please enter a number between 1 and ${DEPLOYMENT_LIMITS.MAX_WAVES_PER_PROJECT}`;
                }
                return null;
            }
        });

        if (!waveCount) return;

        agentConfig.waveCount = parseInt(waveCount);
        agentConfig.deploymentType = 'wave';
    } else {
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
            const wsManager = new WebSocketManager(authProvider);
            
            token.onCancellationRequested(() => {
                wsManager.disconnect();
                outputChannel.appendLine('\n❌ Deployment cancelled by user');
            });

            // Connect to deployment stream
            await wsManager.connect(projectId!);
            
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
            
            const response = await authProvider.makeAuthenticatedRequest(
                `${SHADOW_CLONE_API}/projects/${projectId}/deploy`,
                {
                    method: 'POST',
                    data: agentConfig
                }
            );

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
        const action = await vscode.window.showInformationMessage(
            'Agent deployment completed! Check the output for details.',
            'Open Project Folder',
            'View Deliverables'
        );

        if (action === 'Open Project Folder') {
            const uri = vscode.Uri.file(`${vscode.workspace.rootPath}/.waves`);
            vscode.commands.executeCommand('revealInExplorer', uri);
        } else if (action === 'View Deliverables') {
            vscode.commands.executeCommand('shadowClone.showDeliverables', projectId);
        }

    } catch (error: any) {
        vscode.window.showErrorMessage(`Deployment failed: ${error.message}`);
    }
}