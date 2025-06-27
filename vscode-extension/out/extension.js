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
const claudeSessionManager_1 = require("./utils/claudeSessionManager");
const createProject_1 = require("./commands/createProject");
const deployAgents_1 = require("./commands/deployAgents");
const showStatus_1 = require("./commands/showStatus");
const authenticate_1 = require("./commands/authenticate");
const claudeLauncher_1 = require("./commands/claudeLauncher");
const shadowCloneCommands_1 = require("./utils/shadowCloneCommands");
let authProvider;
let sessionManager;
async function activate(context) {
    console.log('Shadow Clone extension is now active!');
    // Initialize providers
    authProvider = new authProvider_1.AuthProvider(context);
    sessionManager = new claudeSessionManager_1.ClaudeSessionManager(context);
    // Initialize tree data providers
    const projectProvider = new projectProvider_1.ProjectProvider(authProvider);
    const agentProvider = new agentProvider_1.AgentProvider(authProvider);
    const claudeSessionProvider = new claudeSessionProvider_1.ClaudeSessionProvider(sessionManager);
    // Register tree views
    vscode.window.registerTreeDataProvider('shadowClone.projectView', projectProvider);
    vscode.window.registerTreeDataProvider('shadowClone.agentView', agentProvider);
    vscode.window.registerTreeDataProvider('shadowClone.claudeSessions', claudeSessionProvider);
    // Register commands
    context.subscriptions.push(
    // Original commands
    vscode.commands.registerCommand('shadowClone.authenticate', () => (0, authenticate_1.authenticateCommand)(authProvider)), vscode.commands.registerCommand('shadowClone.createProject', () => (0, createProject_1.createProjectCommand)(authProvider, projectProvider)), vscode.commands.registerCommand('shadowClone.deployAgents', () => (0, deployAgents_1.deployAgentsCommand)(authProvider, agentProvider)), vscode.commands.registerCommand('shadowClone.showStatus', () => (0, showStatus_1.showStatusCommand)(authProvider)), vscode.commands.registerCommand('shadowClone.refreshProjects', () => projectProvider.refresh()), vscode.commands.registerCommand('shadowClone.refreshAgents', () => agentProvider.refresh()), 
    // Claude integration commands
    vscode.commands.registerCommand('shadowClone.launchClaude', () => (0, claudeLauncher_1.launchClaudeCommand)(sessionManager)), vscode.commands.registerCommand('shadowClone.launchClaudeQuick', (args) => (0, claudeLauncher_1.launchClaudeWithArgumentsCommand)(sessionManager, args)), vscode.commands.registerCommand('shadowClone.showSessions', () => {
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
    }));
    // Auto-authenticate if we have stored credentials
    const hasAuth = await authProvider.checkAuth();
    if (!hasAuth) {
        const choice = await vscode.window.showInformationMessage('Welcome to Shadow Clone! Please authenticate to get started.', 'Authenticate');
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
    // Check for Claude extension
    const checkClaudeExtension = () => {
        const claudeExt = vscode.extensions.getExtension('anthropic.claude');
        if (!claudeExt) {
            vscode.window.showInformationMessage('Install the official Claude extension for the best Shadow Clone experience.', 'Install Claude', 'Dismiss').then(choice => {
                if (choice === 'Install Claude') {
                    vscode.commands.executeCommand('workbench.extensions.search', '@id:anthropic.claude');
                }
            });
        }
    };
    // Check after a delay to not overwhelm on startup
    setTimeout(checkClaudeExtension, 5000);
}
function deactivate() {
    console.log('Shadow Clone extension deactivated');
}
//# sourceMappingURL=extension.js.map