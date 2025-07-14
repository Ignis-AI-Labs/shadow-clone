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
exports.AgentProvider = void 0;
const vscode = __importStar(require("vscode"));
const constants_1 = require("../utils/constants");
class AgentProvider {
    constructor(authProvider) {
        this.authProvider = authProvider;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        // Refresh when auth changes
        authProvider.onDidChangeAuth(() => this.refresh());
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!await this.authProvider.checkAuth()) {
            return [];
        }
        if (!element) {
            // Root level - show active agents
            try {
                // Note: This endpoint doesn't exist in the new API structure
                // TODO: Remove or replace with actual endpoint
                const response = await this.authProvider.makeAuthenticatedRequest(`${constants_1.SHADOW_CLONE_API}/agents/active`);
                const agents = response.data;
                if (agents.length === 0) {
                    return [new AgentItem('No active agents', '', vscode.TreeItemCollapsibleState.None, 'empty')];
                }
                return agents.map((agent) => new AgentItem(agent.name, agent.id, vscode.TreeItemCollapsibleState.Collapsed, 'agent', agent));
            }
            catch (error) {
                return [new AgentItem('Error loading agents', '', vscode.TreeItemCollapsibleState.None, 'error')];
            }
        }
        else if (element.type === 'agent') {
            // Agent details
            const items = [];
            items.push(new AgentItem(`Role: ${element.data.role}`, '', vscode.TreeItemCollapsibleState.None, 'info'));
            items.push(new AgentItem(`Status: ${element.data.status}`, '', vscode.TreeItemCollapsibleState.None, 'status', element.data));
            items.push(new AgentItem(`Project: ${element.data.projectName}`, element.data.projectId, vscode.TreeItemCollapsibleState.None, 'project-link', element.data));
            if (element.data.currentTask) {
                items.push(new AgentItem(`Current task: ${element.data.currentTask}`, '', vscode.TreeItemCollapsibleState.None, 'task'));
            }
            items.push(new AgentItem(`Progress: ${element.data.progress}%`, '', vscode.TreeItemCollapsibleState.None, 'progress'));
            return items;
        }
        return [];
    }
}
exports.AgentProvider = AgentProvider;
class AgentItem extends vscode.TreeItem {
    constructor(label, id, collapsibleState, type, data) {
        super(label, collapsibleState);
        this.label = label;
        this.id = id;
        this.collapsibleState = collapsibleState;
        this.type = type;
        this.data = data;
        this.tooltip = this.label;
        this.contextValue = type;
        // Set icons and styling based on type
        switch (type) {
            case 'agent':
                this.iconPath = new vscode.ThemeIcon('account');
                this.description = data?.status || '';
                break;
            case 'status':
                this.iconPath = this.getStatusIcon(data?.status);
                break;
            case 'task':
                this.iconPath = new vscode.ThemeIcon('tasklist');
                break;
            case 'progress':
                this.iconPath = new vscode.ThemeIcon('dashboard');
                break;
            case 'project-link':
                this.iconPath = new vscode.ThemeIcon('link');
                this.command = {
                    command: 'shadowClone.openProject',
                    title: 'Open Project',
                    arguments: [id]
                };
                break;
            case 'info':
                this.iconPath = new vscode.ThemeIcon('info');
                break;
            case 'empty':
                this.iconPath = new vscode.ThemeIcon('circle-outline');
                break;
            case 'error':
                this.iconPath = new vscode.ThemeIcon('error');
                break;
        }
    }
    getStatusIcon(status) {
        switch (status) {
            case 'active':
                return new vscode.ThemeIcon('debug-start', new vscode.ThemeColor('debugIcon.startForeground'));
            case 'idle':
                return new vscode.ThemeIcon('debug-pause', new vscode.ThemeColor('debugIcon.pauseForeground'));
            case 'completed':
                return new vscode.ThemeIcon('pass', new vscode.ThemeColor('testing.iconPassed'));
            case 'error':
                return new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
            default:
                return new vscode.ThemeIcon('circle-outline');
        }
    }
}
//# sourceMappingURL=agentProvider.js.map