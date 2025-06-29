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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const authProvider_1 = require("./auth/authProvider");
const projectProvider_1 = require("./providers/projectProvider");
const agentProvider_1 = require("./providers/agentProvider");
const claudeSessionProvider_1 = require("./providers/claudeSessionProvider");
const macroProvider_1 = require("./providers/macroProvider");
const claudeSessionManager_1 = require("./utils/claudeSessionManager");
const createProject_1 = require("./commands/createProject");
const deployAgents_1 = require("./commands/deployAgents");
const showStatus_1 = require("./commands/showStatus");
const authenticate_1 = require("./commands/authenticate");
const claudeLauncher_1 = require("./commands/claudeLauncher");
const shadowCloneCommands_1 = require("./utils/shadowCloneCommands");
const injectCommand_1 = require("./commands/injectCommand");
const showHelp_1 = require("./commands/showHelp");
const parameterBuilder_1 = require("./commands/parameterBuilder");
const securityTelemetry_1 = require("./services/securityTelemetry");
const commandInterceptor_1 = require("./utils/commandInterceptor");
const telemetryHandler_1 = require("./services/telemetryHandler");
const terminalMonitor_1 = require("./utils/terminalMonitor");
const licenseStatusManager_1 = require("./services/licenseStatusManager");
let authProvider;
let sessionManager;
let telemetryService;
let commandInterceptor;
let terminalMonitor;
let licenseStatusManager;
let isActivated = false;
async function activate(context) {
    console.log('Shadow Clone extension is now active!');
    // Prevent double activation
    if (isActivated) {
        console.warn('Shadow Clone extension already activated, skipping...');
        return;
    }
    isActivated = true;
    try {
        // Initialize providers
        authProvider = new authProvider_1.AuthProvider(context);
        sessionManager = new claudeSessionManager_1.ClaudeSessionManager(context);
        // Show startup message
        const hasAuthOnStartup = await authProvider.checkAuth();
        if (hasAuthOnStartup) {
            vscode.window.setStatusBarMessage('$(sync~spin) Shadow Clone: Verifying license...', 3000);
        }
        licenseStatusManager = new licenseStatusManager_1.LicenseStatusManager(context, authProvider);
        // Initialize security telemetry
        telemetryService = new securityTelemetry_1.SecurityTelemetryService(context, authProvider);
        commandInterceptor = new commandInterceptor_1.CommandInterceptor(telemetryService);
        // Set global telemetry instance
        (0, telemetryHandler_1.setTelemetryInstance)(telemetryService);
        // Initialize terminal monitor
        terminalMonitor = new terminalMonitor_1.TerminalMonitor(sessionManager);
        // Setup monitoring
        commandInterceptor.setupFileSystemMonitoring();
        commandInterceptor.monitorClipboardForPrompts();
        // Show telemetry notice (one time)
        const telemetryShown = context.globalState.get('telemetryNoticeShown');
        if (!telemetryShown) {
            vscode.window.showInformationMessage('Shadow Clone collects anonymous usage data to improve security and prevent misuse.', 'Learn More', 'OK').then(selection => {
                if (selection === 'Learn More') {
                    vscode.env.openExternal(vscode.Uri.parse('https://shadow-clone.ai/privacy'));
                }
                context.globalState.update('telemetryNoticeShown', true);
            });
        }
        // Initialize tree data providers
        const projectProvider = new projectProvider_1.ProjectProvider(authProvider);
        const agentProvider = new agentProvider_1.AgentProvider(authProvider);
        const claudeSessionProvider = new claudeSessionProvider_1.ClaudeSessionProvider(sessionManager);
        const macroProvider = new macroProvider_1.MacroProvider();
        // Register tree views
        vscode.window.registerTreeDataProvider('shadowClone.projectView', projectProvider);
        vscode.window.registerTreeDataProvider('shadowClone.agentView', agentProvider);
        vscode.window.registerTreeDataProvider('shadowClone.claudeSessions', claudeSessionProvider);
        vscode.window.registerTreeDataProvider('shadowClone.macros', macroProvider);
        // Register commands
        context.subscriptions.push(
        // Original commands
        vscode.commands.registerCommand('shadowClone.authenticate', () => (0, authenticate_1.authenticateCommand)(authProvider)), vscode.commands.registerCommand('shadowClone.updateCredentials', () => (0, authenticate_1.authenticateCommand)(authProvider, true)), vscode.commands.registerCommand('shadowClone.refreshLicense', async () => {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Window,
                title: 'Refreshing license status...'
            }, async () => {
                await licenseStatusManager.refreshStatus();
            });
            vscode.window.showInformationMessage('License status refreshed');
        }), vscode.commands.registerCommand('shadowClone.createProject', () => (0, createProject_1.createProjectCommand)(authProvider, projectProvider)), vscode.commands.registerCommand('shadowClone.deployAgents', () => (0, deployAgents_1.deployAgentsCommand)(authProvider, agentProvider)), vscode.commands.registerCommand('shadowClone.showStatus', () => (0, showStatus_1.showStatusCommand)(authProvider, licenseStatusManager)), vscode.commands.registerCommand('shadowClone.refreshProjects', () => projectProvider.refresh()), vscode.commands.registerCommand('shadowClone.refreshAgents', () => agentProvider.refresh()), 
        // Claude integration commands
        vscode.commands.registerCommand('shadowClone.launchClaude', () => (0, claudeLauncher_1.launchClaudeCommand)(sessionManager, authProvider)), vscode.commands.registerCommand('shadowClone.launchClaudeQuick', (args) => (0, claudeLauncher_1.launchClaudeWithArgumentsCommand)(sessionManager, authProvider, args)), vscode.commands.registerCommand('shadowClone.showSessions', () => {
            vscode.commands.executeCommand('shadowClone.claudeSessions.focus');
        }), vscode.commands.registerCommand('shadowClone.openSessionOutput', (sessionId) => {
            const session = sessionManager.getSession(sessionId);
            if (session?.outputPath) {
                vscode.commands.executeCommand('vscode.open', vscode.Uri.file(session.outputPath));
            }
        }), vscode.commands.registerCommand('shadowClone.terminateSession', (sessionId) => {
            sessionManager.terminateSession(sessionId);
        }), vscode.commands.registerCommand('shadowClone.clearCompletedSessions', () => {
            sessionManager.clearCompletedSessions();
        }), vscode.commands.registerCommand('shadowClone.copyCommand', (command) => {
            vscode.env.clipboard.writeText(command);
            vscode.window.showInformationMessage('Shadow Clone command copied to clipboard!');
        }), vscode.commands.registerCommand('shadowClone.buildCustomCommand', async () => {
            // Interactive command builder
            const projectType = await vscode.window.showQuickPick([
                'feature', 'debug', 'refactor', 'optimize', 'audit', 'research'
            ], { placeHolder: 'Select project type' });
            if (!projectType)
                return;
            const wavesDir = await vscode.window.showInputBox({
                prompt: 'Waves directory',
                value: './.waves/'
            });
            const command = shadowCloneCommands_1.ShadowCloneMacros.buildCommand({
                projectType,
                wavesDirectory: wavesDir
            });
            vscode.env.clipboard.writeText(command);
            vscode.window.showInformationMessage('Custom command copied to clipboard!');
        }), 
        // Chat injection commands
        vscode.commands.registerCommand('shadowClone.injectCommand', () => (0, injectCommand_1.injectShadowCloneCommand)(authProvider)), vscode.commands.registerCommand('shadowClone.injectDeploy', () => (0, injectCommand_1.injectDeployCommand)(authProvider)), vscode.commands.registerCommand('shadowClone.injectDebug', () => (0, injectCommand_1.injectDebugCommand)(authProvider)), vscode.commands.registerCommand('shadowClone.injectFeature', () => (0, injectCommand_1.injectFeatureCommand)(authProvider)), vscode.commands.registerCommand('shadowClone.injectCustom', () => (0, injectCommand_1.injectCustomCommand)(authProvider)), vscode.commands.registerCommand('shadowClone.executeMacro', (commandType) => (0, injectCommand_1.injectShadowCloneCommand)(authProvider, commandType)), 
        // Help commands
        vscode.commands.registerCommand('shadowClone.showHelp', showHelp_1.showHelpCommand), vscode.commands.registerCommand('shadowClone.showQuickReference', showHelp_1.showQuickReferenceCommand), 
        // Parameter commands
        vscode.commands.registerCommand('shadowClone.buildParameters', parameterBuilder_1.injectParametersCommand), vscode.commands.registerCommand('shadowClone.paramSnippet.minimal', () => (0, parameterBuilder_1.injectParameterSnippet)('MINIMAL')), vscode.commands.registerCommand('shadowClone.paramSnippet.standard', () => (0, parameterBuilder_1.injectParameterSnippet)('STANDARD')), vscode.commands.registerCommand('shadowClone.paramSnippet.fullstack', () => (0, parameterBuilder_1.injectParameterSnippet)('FULL_STACK')), 
        // Session management commands
        vscode.commands.registerCommand('shadowClone.registerTerminal', () => {
            terminalMonitor.registerCurrentTerminal();
        }), vscode.commands.registerCommand('shadowClone.showSessionPicker', () => {
            const sessions = sessionManager.getActiveSessions();
            if (sessions.length === 0) {
                vscode.window.showInformationMessage('No active Claude sessions. Start one with "Launch Claude"');
            }
            else {
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
        }));
        // Auto-authenticate if we have stored credentials
        console.log('Checking authentication status...');
        const hasAuth = await authProvider.checkAuth();
        console.log('Has auth:', hasAuth);
        if (!hasAuth) {
            console.log('No auth found, showing welcome message');
            const choice = await vscode.window.showInformationMessage('Welcome to Shadow Clone! Please authenticate to get started.', 'Authenticate');
            if (choice === 'Authenticate') {
                vscode.commands.executeCommand('shadowClone.authenticate');
            }
        }
        else {
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
                const status = licenseStatusManager.getStatus();
                if (status) {
                    if (status.isActive) {
                        authButton.text = '$(check) License Active';
                        authButton.tooltip = `Shadow Clone ${status.licenseType} - Last checked: ${status.lastChecked.toLocaleTimeString()}`;
                        authButton.backgroundColor = undefined;
                    }
                    else {
                        authButton.text = '$(warning) License Inactive';
                        authButton.tooltip = `Shadow Clone ${status.licenseType} - License is inactive`;
                        authButton.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
                    }
                }
                else {
                    // Status not yet loaded
                    authButton.text = '$(sync~spin) Checking License...';
                    authButton.tooltip = 'Verifying license status...';
                    authButton.backgroundColor = undefined;
                    // Trigger status check
                    licenseStatusManager.checkLicenseStatus();
                }
                authButton.command = 'shadowClone.showStatus';
            }
            else {
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
            }
            else {
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
            }
            else {
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
    }
    catch (error) {
        console.error('Shadow Clone activation error:', error);
        vscode.window.showErrorMessage(`Shadow Clone failed to activate: ${error}`);
    }
}
function deactivate() {
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
//# sourceMappingURL=extension.js.map