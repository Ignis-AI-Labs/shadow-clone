import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';
import { ProjectProvider } from '../providers/projectProvider';
import { SHADOW_CLONE_API } from '../utils/constants';

export async function createProjectCommand(authProvider: AuthProvider, projectProvider: ProjectProvider) {
    // Check authentication
    const hasAuth = await authProvider.checkAuth();
    if (!hasAuth) {
        vscode.window.showErrorMessage('Please authenticate first');
        vscode.commands.executeCommand('shadowClone.authenticate');
        return;
    }

    // Multi-step input
    const projectName = await vscode.window.showInputBox({
        prompt: 'Project name',
        placeHolder: 'My Awesome App',
        validateInput: (value) => {
            if (!value || value.length < 3) {
                return 'Project name must be at least 3 characters';
            }
            return null;
        }
    });

    if (!projectName) return;

    const projectDescription = await vscode.window.showInputBox({
        prompt: 'Describe what you want to build',
        placeHolder: 'A task management app with real-time collaboration...',
        validateInput: (value) => {
            if (!value || value.length < 20) {
                return 'Please provide a detailed description (at least 20 characters)';
            }
            return null;
        }
    });

    if (!projectDescription) return;

    const techStackItems = [
        { label: 'React + Node.js', value: 'react-node' },
        { label: 'Vue + Express', value: 'vue-express' },
        { label: 'Angular + NestJS', value: 'angular-nest' },
        { label: 'Next.js + Prisma', value: 'nextjs-prisma' },
        { label: 'SvelteKit', value: 'sveltekit' },
        { label: 'Custom', value: 'custom' }
    ];

    const techStack = await vscode.window.showQuickPick(techStackItems, {
        placeHolder: 'Select technology stack'
    });

    if (!techStack) return;

    let customTech = '';
    if (techStack.value === 'custom') {
        customTech = await vscode.window.showInputBox({
            prompt: 'Describe your custom technology stack',
            placeHolder: 'Python FastAPI backend with React frontend...'
        }) || '';
        
        if (!customTech) return;
    }

    // Get workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('Please open a workspace folder first');
        return;
    }

    const folder = await vscode.window.showWorkspaceFolderPick({
        placeHolder: 'Select workspace folder for the project'
    });

    if (!folder) return;

    // Create project
    const projectData = {
        name: projectName,
        description: projectDescription,
        techStack: techStack.value === 'custom' ? customTech : techStack.value,
        workspacePath: folder.uri.fsPath,
        wavesDirectory: vscode.workspace.getConfiguration('shadowClone').get('wavesDirectory', '.waves')
    };

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Creating Shadow Clone project...',
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 30, message: 'Initializing project...' });
            
            // Note: This endpoint doesn't exist in the new API structure
            // TODO: Remove or replace with actual endpoint
            const response = await authProvider.makeAuthenticatedRequest(
                `${SHADOW_CLONE_API}/projects`,
                {
                    method: 'POST',
                    data: projectData
                }
            );

            progress.report({ increment: 50, message: 'Setting up workspace...' });
            
            // Create .waves directory
            const wavesUri = vscode.Uri.joinPath(folder.uri, projectData.wavesDirectory);
            await vscode.workspace.fs.createDirectory(wavesUri);

            progress.report({ increment: 20, message: 'Project created!' });
            
            // Refresh project view
            projectProvider.refresh();
            
            // Show success message
            const action = await vscode.window.showInformationMessage(
                `Project "${projectName}" created successfully!`,
                'Deploy Agents'
            );
            
            if (action === 'Deploy Agents') {
                vscode.commands.executeCommand('shadowClone.deployAgents', response.data.projectId);
            }
        });
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to create project: ${error.message}`);
    }
}