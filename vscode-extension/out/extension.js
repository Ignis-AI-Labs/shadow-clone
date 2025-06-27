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
const createProject_1 = require("./commands/createProject");
const deployAgents_1 = require("./commands/deployAgents");
const showStatus_1 = require("./commands/showStatus");
const authenticate_1 = require("./commands/authenticate");
let authProvider;
async function activate(context) {
    console.log('Shadow Clone extension is now active!');
    // Initialize authentication provider
    authProvider = new authProvider_1.AuthProvider(context);
    // Initialize tree data providers
    const projectProvider = new projectProvider_1.ProjectProvider(authProvider);
    const agentProvider = new agentProvider_1.AgentProvider(authProvider);
    // Register tree views
    vscode.window.registerTreeDataProvider('shadowClone.projectView', projectProvider);
    vscode.window.registerTreeDataProvider('shadowClone.agentView', agentProvider);
    // Register commands
    context.subscriptions.push(vscode.commands.registerCommand('shadowClone.authenticate', () => (0, authenticate_1.authenticateCommand)(authProvider)), vscode.commands.registerCommand('shadowClone.createProject', () => (0, createProject_1.createProjectCommand)(authProvider, projectProvider)), vscode.commands.registerCommand('shadowClone.deployAgents', () => (0, deployAgents_1.deployAgentsCommand)(authProvider, agentProvider)), vscode.commands.registerCommand('shadowClone.showStatus', () => (0, showStatus_1.showStatusCommand)(authProvider)), vscode.commands.registerCommand('shadowClone.refreshProjects', () => projectProvider.refresh()), vscode.commands.registerCommand('shadowClone.refreshAgents', () => agentProvider.refresh()));
    // Auto-authenticate if we have stored credentials
    const hasAuth = await authProvider.checkAuth();
    if (!hasAuth) {
        const choice = await vscode.window.showInformationMessage('Welcome to Shadow Clone! Please authenticate to get started.', 'Authenticate');
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
function deactivate() {
    console.log('Shadow Clone extension deactivated');
}
//# sourceMappingURL=extension.js.map