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
exports.createProjectCommand = createProjectCommand;
const vscode = __importStar(require("vscode"));
const constants_1 = require("../utils/constants");
async function createProjectCommand(authProvider, projectProvider) {
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
    if (!projectName)
        return;
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
    if (!projectDescription)
        return;
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
    if (!techStack)
        return;
    let customTech = '';
    if (techStack.value === 'custom') {
        customTech = await vscode.window.showInputBox({
            prompt: 'Describe your custom technology stack',
            placeHolder: 'Python FastAPI backend with React frontend...'
        }) || '';
        if (!customTech)
            return;
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
    if (!folder)
        return;
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
            const response = await authProvider.makeAuthenticatedRequest(`${constants_1.SHADOW_CLONE_API}/projects`, {
                method: 'POST',
                data: projectData
            });
            progress.report({ increment: 50, message: 'Setting up workspace...' });
            // Create .waves directory
            const wavesUri = vscode.Uri.joinPath(folder.uri, projectData.wavesDirectory);
            await vscode.workspace.fs.createDirectory(wavesUri);
            progress.report({ increment: 20, message: 'Project created!' });
            // Refresh project view
            projectProvider.refresh();
            // Show success message
            const action = await vscode.window.showInformationMessage(`Project "${projectName}" created successfully!`, 'Deploy Agents');
            if (action === 'Deploy Agents') {
                vscode.commands.executeCommand('shadowClone.deployAgents', response.data.projectId);
            }
        });
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to create project: ${error.message}`);
    }
}
//# sourceMappingURL=createProject.js.map