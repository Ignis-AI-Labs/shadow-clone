import * as vscode from 'vscode';
import { AuthProvider } from './auth/authProvider';
import { ProjectProvider } from './providers/projectProvider';
import { AgentProvider } from './providers/agentProvider';
import { createProjectCommand } from './commands/createProject';
import { deployAgentsCommand } from './commands/deployAgents';
import { showStatusCommand } from './commands/showStatus';
import { authenticateCommand } from './commands/authenticate';

let authProvider: AuthProvider;

export async function activate(context: vscode.ExtensionContext) {
    console.log('Shadow Clone extension is now active!');

    // Initialize authentication provider
    authProvider = new AuthProvider(context);
    
    // Initialize tree data providers
    const projectProvider = new ProjectProvider(authProvider);
    const agentProvider = new AgentProvider(authProvider);

    // Register tree views
    vscode.window.registerTreeDataProvider('shadowClone.projectView', projectProvider);
    vscode.window.registerTreeDataProvider('shadowClone.agentView', agentProvider);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('shadowClone.authenticate', () => 
            authenticateCommand(authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.createProject', () => 
            createProjectCommand(authProvider, projectProvider)
        ),
        vscode.commands.registerCommand('shadowClone.deployAgents', () => 
            deployAgentsCommand(authProvider, agentProvider)
        ),
        vscode.commands.registerCommand('shadowClone.showStatus', () => 
            showStatusCommand(authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.refreshProjects', () => 
            projectProvider.refresh()
        ),
        vscode.commands.registerCommand('shadowClone.refreshAgents', () => 
            agentProvider.refresh()
        )
    );

    // Auto-authenticate if we have stored credentials
    const hasAuth = await authProvider.checkAuth();
    if (!hasAuth) {
        const choice = await vscode.window.showInformationMessage(
            'Welcome to Shadow Clone! Please authenticate to get started.',
            'Authenticate'
        );
        if (choice === 'Authenticate') {
            vscode.commands.executeCommand('shadowClone.authenticate');
        }
    }

    // Set up status bar
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '$(rocket) Shadow Clone';
    statusBarItem.command = 'shadowClone.showStatus';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}

export function deactivate() {
    console.log('Shadow Clone extension deactivated');
}