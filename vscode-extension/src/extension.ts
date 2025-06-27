import * as vscode from 'vscode';
import { AuthProvider } from './auth/authProvider';
import { ProjectProvider } from './providers/projectProvider';
import { AgentProvider } from './providers/agentProvider';
import { ClaudeSessionProvider } from './providers/claudeSessionProvider';
import { ClaudeSessionManager } from './utils/claudeSessionManager';
import { createProjectCommand } from './commands/createProject';
import { deployAgentsCommand } from './commands/deployAgents';
import { showStatusCommand } from './commands/showStatus';
import { authenticateCommand } from './commands/authenticate';
import { launchClaudeCommand, launchClaudeWithArgumentsCommand } from './commands/claudeLauncher';
import { ShadowCloneMacros } from './utils/shadowCloneCommands';

let authProvider: AuthProvider;
let sessionManager: ClaudeSessionManager;

export async function activate(context: vscode.ExtensionContext) {
    console.log('Shadow Clone extension is now active!');

    // Initialize providers
    authProvider = new AuthProvider(context);
    sessionManager = new ClaudeSessionManager(context);
    
    // Initialize tree data providers
    const projectProvider = new ProjectProvider(authProvider);
    const agentProvider = new AgentProvider(authProvider);
    const claudeSessionProvider = new ClaudeSessionProvider(sessionManager);

    // Register tree views
    vscode.window.registerTreeDataProvider('shadowClone.projectView', projectProvider);
    vscode.window.registerTreeDataProvider('shadowClone.agentView', agentProvider);
    vscode.window.registerTreeDataProvider('shadowClone.claudeSessions', claudeSessionProvider);

    // Register commands
    context.subscriptions.push(
        // Original commands
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
        ),
        
        // Claude integration commands
        vscode.commands.registerCommand('shadowClone.launchClaude', () =>
            launchClaudeCommand(sessionManager)
        ),
        vscode.commands.registerCommand('shadowClone.launchClaudeQuick', (args) =>
            launchClaudeWithArgumentsCommand(sessionManager, args)
        ),
        vscode.commands.registerCommand('shadowClone.showSessions', () => {
            vscode.commands.executeCommand('shadowClone.claudeSessions.focus');
        }),
        vscode.commands.registerCommand('shadowClone.openSessionOutput', (sessionId: string) => {
            const session = sessionManager.getSession(sessionId);
            if (session?.outputPath) {
                vscode.commands.executeCommand('vscode.open', vscode.Uri.file(session.outputPath));
            }
        }),
        vscode.commands.registerCommand('shadowClone.terminateSession', (sessionId: string) => {
            sessionManager.terminateSession(sessionId);
        }),
        vscode.commands.registerCommand('shadowClone.clearCompletedSessions', () => {
            sessionManager.clearCompletedSessions();
        }),
        vscode.commands.registerCommand('shadowClone.copyCommand', (command: string) => {
            vscode.env.clipboard.writeText(command);
            vscode.window.showInformationMessage('Shadow Clone command copied to clipboard!');
        }),
        vscode.commands.registerCommand('shadowClone.buildCustomCommand', async () => {
            // Interactive command builder
            const projectType = await vscode.window.showQuickPick([
                'feature', 'debug', 'refactor', 'optimize', 'audit', 'research'
            ], { placeHolder: 'Select project type' });
            
            if (!projectType) return;
            
            const wavesDir = await vscode.window.showInputBox({
                prompt: 'Waves directory',
                value: './.waves/'
            });
            
            const command = ShadowCloneMacros.buildCommand({
                projectType,
                wavesDirectory: wavesDir
            });
            
            vscode.env.clipboard.writeText(command);
            vscode.window.showInformationMessage('Custom command copied to clipboard!');
        })
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

    // Set up status bar items
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '$(rocket) Shadow Clone';
    statusBarItem.command = 'shadowClone.showStatus';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Authentication status button
    const authButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 101);
    const updateAuthButton = async () => {
        const hasAuth = await authProvider.checkAuth();
        if (hasAuth) {
            const licenseType = await authProvider.getLicenseType();
            authButton.text = '$(check) License Active';
            authButton.tooltip = `Shadow Clone ${licenseType} - Click to view status`;
            authButton.command = 'shadowClone.showStatus';
            authButton.backgroundColor = undefined;
        } else {
            authButton.text = '$(key) Authenticate';
            authButton.tooltip = 'Click to authenticate with Shadow Clone';
            authButton.command = 'shadowClone.authenticate';
            authButton.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        }
        authButton.show();
    };
    
    // Update auth button when auth changes
    authProvider.onDidChangeAuth(() => updateAuthButton());
    updateAuthButton();
    context.subscriptions.push(authButton);

    // Claude launcher button
    const claudeButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    claudeButton.text = '$(terminal) Launch Claude';
    claudeButton.command = 'shadowClone.launchClaude';
    claudeButton.tooltip = 'Launch Claude Code with Shadow Clone commands';
    claudeButton.show();
    context.subscriptions.push(claudeButton);

    // Active sessions indicator
    const sessionsIndicator = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 98);
    const updateSessionsIndicator = () => {
        const activeSessions = sessionManager.getActiveSessions();
        if (activeSessions.length > 0) {
            sessionsIndicator.text = `$(debug-start) ${activeSessions.length} active`;
            sessionsIndicator.command = 'shadowClone.showSessions';
            sessionsIndicator.show();
        } else {
            sessionsIndicator.hide();
        }
    };
    
    sessionManager.onSessionsChanged(updateSessionsIndicator);
    updateSessionsIndicator();
    context.subscriptions.push(sessionsIndicator);

    // Check for Claude extension
    const checkClaudeExtension = () => {
        const claudeExt = vscode.extensions.getExtension('anthropic.claude');
        if (!claudeExt) {
            vscode.window.showInformationMessage(
                'Install the official Claude extension for the best Shadow Clone experience.',
                'Install Claude',
                'Dismiss'
            ).then(choice => {
                if (choice === 'Install Claude') {
                    vscode.commands.executeCommand('workbench.extensions.search', '@id:anthropic.claude');
                }
            });
        }
    };
    
    // Check after a delay to not overwhelm on startup
    setTimeout(checkClaudeExtension, 5000);
}

export function deactivate() {
    console.log('Shadow Clone extension deactivated');
}