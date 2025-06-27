import * as vscode from 'vscode';
import { AuthProvider } from './auth/authProvider';
import { ProjectProvider } from './providers/projectProvider';
import { AgentProvider } from './providers/agentProvider';
import { ClaudeSessionProvider } from './providers/claudeSessionProvider';
import { MacroProvider } from './providers/macroProvider';
import { ClaudeSessionManager } from './utils/claudeSessionManager';
import { createProjectCommand } from './commands/createProject';
import { deployAgentsCommand } from './commands/deployAgents';
import { showStatusCommand } from './commands/showStatus';
import { authenticateCommand } from './commands/authenticate';
import { launchClaudeCommand, launchClaudeWithArgumentsCommand } from './commands/claudeLauncher';
import { ShadowCloneMacros } from './utils/shadowCloneCommands';
import { injectShadowCloneCommand, injectDeployCommand, injectDebugCommand, injectFeatureCommand, injectCustomCommand } from './commands/injectCommand';
import { showHelpCommand, showQuickReferenceCommand } from './commands/showHelp';
import { buildParametersCommand, injectParametersCommand, injectParameterSnippet } from './commands/parameterBuilder';

let authProvider: AuthProvider;
let sessionManager: ClaudeSessionManager;

export async function activate(context: vscode.ExtensionContext) {
    console.log('Shadow Clone extension is now active!');
    
    try {

    // Initialize providers
    authProvider = new AuthProvider(context);
    sessionManager = new ClaudeSessionManager(context);
    
    // Initialize tree data providers
    const projectProvider = new ProjectProvider(authProvider);
    const agentProvider = new AgentProvider(authProvider);
    const claudeSessionProvider = new ClaudeSessionProvider(sessionManager);
    const macroProvider = new MacroProvider();

    // Register tree views
    vscode.window.registerTreeDataProvider('shadowClone.projectView', projectProvider);
    vscode.window.registerTreeDataProvider('shadowClone.agentView', agentProvider);
    vscode.window.registerTreeDataProvider('shadowClone.claudeSessions', claudeSessionProvider);
    vscode.window.registerTreeDataProvider('shadowClone.macros', macroProvider);

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
            launchClaudeCommand(sessionManager, authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.launchClaudeQuick', (args) =>
            launchClaudeWithArgumentsCommand(sessionManager, authProvider, args)
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
        }),
        
        // Chat injection commands
        vscode.commands.registerCommand('shadowClone.injectCommand', () =>
            injectShadowCloneCommand(authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.injectDeploy', () =>
            injectDeployCommand(authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.injectDebug', () =>
            injectDebugCommand(authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.injectFeature', () =>
            injectFeatureCommand(authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.injectCustom', () =>
            injectCustomCommand(authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.executeMacro', (commandType: string) =>
            injectShadowCloneCommand(authProvider, commandType)
        ),
        
        // Help commands
        vscode.commands.registerCommand('shadowClone.showHelp', showHelpCommand),
        vscode.commands.registerCommand('shadowClone.showQuickReference', showQuickReferenceCommand),
        
        // Parameter commands
        vscode.commands.registerCommand('shadowClone.buildParameters', injectParametersCommand),
        vscode.commands.registerCommand('shadowClone.paramSnippet.minimal', () => 
            injectParameterSnippet('MINIMAL')
        ),
        vscode.commands.registerCommand('shadowClone.paramSnippet.standard', () => 
            injectParameterSnippet('STANDARD')
        ),
        vscode.commands.registerCommand('shadowClone.paramSnippet.fullstack', () => 
            injectParameterSnippet('FULL_STACK')
        )
    );

    // Auto-authenticate if we have stored credentials
    console.log('Checking authentication status...');
    const hasAuth = await authProvider.checkAuth();
    console.log('Has auth:', hasAuth);
    
    if (!hasAuth) {
        console.log('No auth found, showing welcome message');
        const choice = await vscode.window.showInformationMessage(
            'Welcome to Shadow Clone! Please authenticate to get started.',
            'Authenticate'
        );
        if (choice === 'Authenticate') {
            vscode.commands.executeCommand('shadowClone.authenticate');
        }
    } else {
        console.log('User is already authenticated');
    }

    // Set up status bar items
    console.log('Creating status bar items...');
    
    // Main status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '$(rocket) Shadow Clone';
    statusBarItem.command = 'shadowClone.showStatus';
    statusBarItem.tooltip = 'Shadow Clone - Click to view status';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    console.log('Main status bar item created');

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

    // Quick inject buttons
    const injectButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 97);
    injectButton.text = '$(code) SC Inject';
    injectButton.command = 'shadowClone.injectCommand';
    injectButton.tooltip = 'Inject Shadow Clone command at cursor';
    injectButton.show();
    context.subscriptions.push(injectButton);
    
    // Help button
    const helpButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 93);
    helpButton.text = '$(question)';
    helpButton.command = 'shadowClone.showQuickReference';
    helpButton.tooltip = 'Shadow Clone Help';
    helpButton.show();
    context.subscriptions.push(helpButton);

    // Quick command buttons (hidden by default, shown when authenticated)
    const deployButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 96);
    deployButton.text = '$(rocket)';
    deployButton.command = 'shadowClone.injectDeploy';
    deployButton.tooltip = 'Inject deploy command';
    
    const debugButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 95);
    debugButton.text = '$(bug)';
    debugButton.command = 'shadowClone.injectDebug';
    debugButton.tooltip = 'Inject debug command';
    
    const featureButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 92);
    featureButton.text = '$(sparkle)';
    featureButton.command = 'shadowClone.injectFeature';
    featureButton.tooltip = 'Inject feature command';
    
    // Show/hide quick buttons based on auth status
    const updateQuickButtons = async () => {
        const hasAuth = await authProvider.checkAuth();
        if (hasAuth) {
            deployButton.show();
            debugButton.show();
            featureButton.show();
        } else {
            deployButton.hide();
            debugButton.hide();
            featureButton.hide();
        }
    };
    
    authProvider.onDidChangeAuth(() => updateQuickButtons());
    updateQuickButtons();
    
    context.subscriptions.push(deployButton);
    context.subscriptions.push(debugButton);
    context.subscriptions.push(featureButton);

    // Note: Claude Code should be installed via command line
    // Users can install it with: npm install -g @anthropic/claude-code
    console.log('Shadow Clone requires Claude Code CLI to be installed');
    
    } catch (error) {
        console.error('Shadow Clone activation error:', error);
        vscode.window.showErrorMessage(`Shadow Clone failed to activate: ${error}`);
    }
}

export function deactivate() {
    console.log('Shadow Clone extension deactivated');
}