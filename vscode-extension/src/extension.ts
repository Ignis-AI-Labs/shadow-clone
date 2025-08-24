import * as vscode from 'vscode';
import { AuthProvider } from './auth/authProvider';
import { ClaudeSessionProvider } from './providers/claudeSessionProvider';
import { MacroProvider } from './providers/macroProvider';
import { ClaudeSessionManager } from './utils/claudeSessionManager';
import { showStatusCommand } from './commands/showStatus';
import { authenticateCommand } from './commands/authenticate';
import { launchClaudeCommand, launchClaudeWithArgumentsCommand } from './commands/claudeLauncher';
import { ShadowCloneMacros } from './utils/shadowCloneCommands';
import { injectShadowCloneCommand, injectBuildCommand, injectDebugCommand, injectFeatureCommand } from './commands/injectCommand';
import { showHelpCommand, showQuickReferenceCommand } from './commands/showHelp';
import { buildParametersCommand, injectParametersCommand, injectParameterSnippet } from './commands/parameterBuilder';
import { registerModularCommands } from './commands/modularCommands';
import { SecurityTelemetryService } from './services/securityTelemetry';
import { CommandInterceptor } from './utils/commandInterceptor';
import { setTelemetryInstance } from './services/telemetryHandler';
import { TerminalMonitor } from './utils/terminalMonitor';
import { getApiEndpoint } from './utils/constants';
import { LicenseStatusManager } from './services/licenseStatusManager';
import { withAuth, withAuthSync } from './utils/authGuard';
import { DependencyChecker } from './services/dependencyChecker';
import { checkDependencies } from './commands/checkDependencies';

let authProvider: AuthProvider;
let sessionManager: ClaudeSessionManager;
let telemetryService: SecurityTelemetryService;
let commandInterceptor: CommandInterceptor;
let terminalMonitor: TerminalMonitor;
let licenseStatusManager: LicenseStatusManager;
let isActivated = false;

export async function activate(context: vscode.ExtensionContext) {
    console.log('Shadow Clone extension is now active!');
    
    // Prevent double activation
    if (isActivated) {
        console.warn('Shadow Clone extension already activated, skipping...');
        return;
    }
    isActivated = true;
    
    try {
    // Check dependencies first
    const dependencyChecker = DependencyChecker.getInstance();
    const depStatus = await dependencyChecker.checkAllDependencies();
    
    // If critical dependencies are missing, show notification
    if (!depStatus.nodeInstalled || !depStatus.claudeInstalled) {
        const choice = await vscode.window.showWarningMessage(
            'Shadow Clone requires Node.js and Claude Code CLI to function properly.',
            'Setup Now',
            'Later'
        );
        
        if (choice === 'Setup Now') {
            await checkDependencies(context);
        }
    }

    // Initialize API key cache
    const { ApiKeyCache } = await import('./utils/apiKeyCache');
    ApiKeyCache.initialize(context);
    
    // Initialize providers
    authProvider = new AuthProvider(context);
    sessionManager = new ClaudeSessionManager(context);
    
    // Check for cached API key first
    let hasAuthOnStartup = await authProvider.checkAuth();
    if (!hasAuthOnStartup) {
        // Try cached authentication
        hasAuthOnStartup = await authProvider.checkCachedAuth();
    } else {
        vscode.window.setStatusBarMessage('$(sync~spin) Shadow Clone: Verifying license...', 3000);
    }
    
    licenseStatusManager = new LicenseStatusManager(context, authProvider);
    
    // Initialize security telemetry
    telemetryService = new SecurityTelemetryService(context, authProvider);
    commandInterceptor = new CommandInterceptor(telemetryService);
    
    // Set global telemetry instance
    setTelemetryInstance(telemetryService);
    
    // Initialize terminal monitor
    terminalMonitor = new TerminalMonitor(sessionManager);
    
    // Setup monitoring
    commandInterceptor.setupFileSystemMonitoring();
    commandInterceptor.monitorClipboardForPrompts();
    
    // Show telemetry notice (one time)
    const telemetryShown = context.globalState.get('telemetryNoticeShown');
    if (!telemetryShown) {
        vscode.window.showInformationMessage(
            'Shadow Clone collects anonymous usage data to improve security and prevent misuse.',
            'Learn More',
            'OK'
        ).then(selection => {
            if (selection === 'Learn More') {
                vscode.env.openExternal(vscode.Uri.parse('https://shadow-clone.ai/privacy'));
            }
            context.globalState.update('telemetryNoticeShown', true);
        });
    }
    
    // Initialize tree data providers
    const claudeSessionProvider = new ClaudeSessionProvider(sessionManager);
    const macroProvider = new MacroProvider();

    // Register tree views
    vscode.window.registerTreeDataProvider('shadowClone.claudeSessions', claudeSessionProvider);
    vscode.window.registerTreeDataProvider('shadowClone.macros', macroProvider);

    // Register commands
    context.subscriptions.push(
        // Original commands
        vscode.commands.registerCommand('shadowClone.authenticate', () => 
            authenticateCommand(authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.updateCredentials', () => 
            authenticateCommand(authProvider, true)
        ),
        vscode.commands.registerCommand('shadowClone.refreshLicense', async () => {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Window,
                title: 'Refreshing license status...'
            }, async () => {
                await licenseStatusManager.refreshStatus();
            });
            vscode.window.showInformationMessage('License status refreshed');
        }),
        vscode.commands.registerCommand('shadowClone.showStatus', () => 
            showStatusCommand(authProvider, licenseStatusManager)
        ),
        
        // Dependency management command
        vscode.commands.registerCommand('shadowClone.checkDependencies', () =>
            checkDependencies(context)
        ),
        
        // Claude integration commands
        vscode.commands.registerCommand('shadowClone.launchClaude', 
            withAuthSync(() => launchClaudeCommand(sessionManager, authProvider), authProvider, {
                requireActiveSubscription: true
            })
        ),
        vscode.commands.registerCommand('shadowClone.launchClaudeQuick', 
            withAuthSync((args) => launchClaudeWithArgumentsCommand(sessionManager, authProvider, args), authProvider, {
                requireActiveSubscription: true
            })
        ),
        vscode.commands.registerCommand('shadowClone.showSessions', 
            withAuthSync(() => {
                vscode.commands.executeCommand('shadowClone.claudeSessions.focus');
            }, authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.openSessionOutput', 
            withAuthSync((sessionId: string) => {
                const session = sessionManager.getSession(sessionId);
                if (session?.outputPath) {
                    vscode.commands.executeCommand('vscode.open', vscode.Uri.file(session.outputPath));
                }
            }, authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.terminateSession', 
            withAuthSync((sessionId: string) => {
                sessionManager.terminateSession(sessionId);
            }, authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.clearCompletedSessions', 
            withAuthSync(() => {
                sessionManager.clearCompletedSessions();
            }, authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.copyCommand', 
            withAuthSync((command: string) => {
                vscode.env.clipboard.writeText(command);
                vscode.window.showInformationMessage('Shadow Clone command copied to clipboard!');
            }, authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.buildCustomCommand', 
            withAuth(async () => {
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
            }, authProvider, { requireActiveSubscription: true })
        ),
        
        // Chat injection commands
        vscode.commands.registerCommand('shadowClone.injectCommand', () =>
            injectShadowCloneCommand(authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.injectBuild', () =>
            injectBuildCommand(authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.injectDebug', () =>
            injectDebugCommand(authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.injectFeature', () =>
            injectFeatureCommand(authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.executeMacro', (commandType: string) =>
            injectShadowCloneCommand(authProvider, commandType)
        ),
        
        // Help commands
        vscode.commands.registerCommand('shadowClone.showHelp', showHelpCommand),
        vscode.commands.registerCommand('shadowClone.showQuickReference', showQuickReferenceCommand),
        
        // Parameter commands
        vscode.commands.registerCommand('shadowClone.buildParameters', 
            withAuthSync(() => injectParametersCommand(), authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.paramSnippet.minimal', () => 
            injectParameterSnippet('MINIMAL')
        ),
        vscode.commands.registerCommand('shadowClone.paramSnippet.standard', () => 
            injectParameterSnippet('STANDARD')
        ),
        vscode.commands.registerCommand('shadowClone.paramSnippet.fullstack', () => 
            injectParameterSnippet('FULL_STACK')
        ),
        
        // Session management commands
        vscode.commands.registerCommand('shadowClone.registerTerminal', 
            withAuthSync(() => {
                terminalMonitor.registerCurrentTerminal();
            }, authProvider)
        ),
        vscode.commands.registerCommand('shadowClone.showSessionPicker', 
            withAuthSync(() => {
                const sessions = sessionManager.getActiveSessions();
                if (sessions.length === 0) {
                    vscode.window.showInformationMessage('No active Claude sessions. Start one with "Launch Claude"');
                } else {
                    // Show session picker
                    const items = sessions.map(s => ({
                        label: `$(terminal) ${s.mode} - ${s.terminal?.name || 'Unknown'}`,
                        description: `Started ${new Date(s.startTime).toLocaleTimeString()}`,
                        session: s
                    }));
                    
                    vscode.window.showQuickPick(items, {
                        placeHolder: 'Select a session to view details'
                    }).then(selected => {
                        if (selected) {
                            selected.session.terminal?.show();
                        }
                    });
                }
            }, authProvider)
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
    // Don't show by default - will be updated based on auth
    context.subscriptions.push(statusBarItem);
    console.log('Main status bar item created');

    // Authentication status button
    const authButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 101);
    const updateAuthButton = async () => {
        const hasAuth = await authProvider.checkAuth();
        if (hasAuth) {
            const status = licenseStatusManager.getStatus();
            
            if (status) {
                if (status.isActive) {
                    authButton.text = '$(check) License Active';
                    authButton.tooltip = `Shadow Clone ${status.licenseType} - Last checked: ${status.lastChecked.toLocaleTimeString()}`;
                    authButton.backgroundColor = undefined;
                } else {
                    authButton.text = '$(warning) License Inactive';
                    authButton.tooltip = `Shadow Clone ${status.licenseType} - License is inactive`;
                    authButton.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
                }
            } else {
                // Status not yet loaded
                authButton.text = '$(sync~spin) Checking License...';
                authButton.tooltip = 'Verifying license status...';
                authButton.backgroundColor = undefined;
                
                // Trigger status check
                licenseStatusManager.checkLicenseStatus();
            }
            
            authButton.command = 'shadowClone.showStatus';
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
    
    // Update auth button when license status changes
    licenseStatusManager.onStatusChanged(() => updateAuthButton());
    
    updateAuthButton();
    context.subscriptions.push(authButton);

    // Claude launcher button
    const claudeButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    claudeButton.text = '$(terminal) Launch Claude';
    claudeButton.command = 'shadowClone.launchClaude';
    claudeButton.tooltip = 'Launch Claude Code with Shadow Clone commands';
    // Don't show by default - will be updated based on auth
    context.subscriptions.push(claudeButton);

    // Active sessions indicator
    const sessionsIndicator = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 98);
    const updateSessionsIndicator = async () => {
        const hasAuth = await authProvider.checkAuth();
        const isActive = hasAuth ? await authProvider.isLicenseActive() : false;
        const activeSessions = sessionManager.getActiveSessions();
        
        if (hasAuth && isActive && activeSessions.length > 0) {
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
    // Don't show by default - will be updated based on auth
    context.subscriptions.push(injectButton);
    
    // Help button
    const helpButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 93);
    helpButton.text = '$(question)';
    helpButton.command = 'shadowClone.showQuickReference';
    helpButton.tooltip = 'Shadow Clone Help';
    helpButton.show();
    context.subscriptions.push(helpButton);

    // Quick command buttons (hidden by default, shown when authenticated)
    const buildButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 96);
    buildButton.text = '$(rocket)';
    buildButton.command = 'shadowClone.injectBuild';
    buildButton.tooltip = 'Inject build command';
    
    const debugButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 95);
    debugButton.text = '$(bug)';
    debugButton.command = 'shadowClone.injectDebug';
    debugButton.tooltip = 'Inject debug command';
    
    const featureButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 92);
    featureButton.text = '$(sparkle)';
    featureButton.command = 'shadowClone.injectFeature';
    featureButton.tooltip = 'Inject feature command';
    
    // Show/hide ALL buttons based on auth status
    const updateAllStatusBarItems = async () => {
        const hasAuth = await authProvider.checkAuth();
        const isActive = hasAuth ? await authProvider.isLicenseActive() : false;
        
        if (hasAuth && isActive) {
            // Show all features for authenticated users with active licenses
            statusBarItem.show();
            claudeButton.show();
            injectButton.show();
            buildButton.show();
            debugButton.show();
            featureButton.show();
        } else if (hasAuth && !isActive) {
            // Show limited features for users with inactive licenses
            statusBarItem.show();
            // Hide action buttons
            claudeButton.hide();
            injectButton.hide();
            buildButton.hide();
            debugButton.hide();
            featureButton.hide();
        } else {
            // Hide everything except auth and help for unauthenticated users
            statusBarItem.hide();
            claudeButton.hide();
            injectButton.hide();
            buildButton.hide();
            debugButton.hide();
            featureButton.hide();
            sessionsIndicator.hide();
        }
    };
    
    // Update status bar items when auth changes
    authProvider.onDidChangeAuth(() => updateAllStatusBarItems());
    licenseStatusManager.onStatusChanged(() => updateAllStatusBarItems());
    
    // Register modular commands (quick tools)
    registerModularCommands(context, authProvider);
    
    // Initial update
    await updateAllStatusBarItems();
    
    context.subscriptions.push(buildButton);
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
    
    // Reset activation flag
    isActivated = false;
    
    // Dispose of telemetry service
    if (telemetryService) {
        telemetryService.dispose();
    }
    
    // Dispose of command interceptor
    if (commandInterceptor) {
        commandInterceptor.dispose();
    }
}