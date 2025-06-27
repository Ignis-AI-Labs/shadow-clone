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
exports.ProjectProvider = void 0;
const vscode = __importStar(require("vscode"));
const constants_1 = require("../utils/constants");
class ProjectProvider {
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
            return [new ProjectItem('Not authenticated', '', vscode.TreeItemCollapsibleState.None, 'auth')];
        }
        if (!element) {
            // Root level - show projects
            try {
                const response = await this.authProvider.makeAuthenticatedRequest(`${constants_1.SHADOW_CLONE_API}/projects`);
                const projects = response.data;
                if (projects.length === 0) {
                    return [new ProjectItem('No projects yet', '', vscode.TreeItemCollapsibleState.None, 'empty')];
                }
                return projects.map((project) => new ProjectItem(project.name, project.id, vscode.TreeItemCollapsibleState.Collapsed, 'project', project));
            }
            catch (error) {
                return [new ProjectItem('Error loading projects', '', vscode.TreeItemCollapsibleState.None, 'error')];
            }
        }
        else if (element.type === 'project') {
            // Project details
            const items = [];
            items.push(new ProjectItem(`Status: ${element.data.status}`, '', vscode.TreeItemCollapsibleState.None, 'info'));
            items.push(new ProjectItem(`Created: ${new Date(element.data.createdAt).toLocaleDateString()}`, '', vscode.TreeItemCollapsibleState.None, 'info'));
            if (element.data.lastDeployment) {
                items.push(new ProjectItem(`Last deployment: ${new Date(element.data.lastDeployment).toLocaleDateString()}`, '', vscode.TreeItemCollapsibleState.None, 'info'));
            }
            items.push(new ProjectItem('Deployments', element.id, vscode.TreeItemCollapsibleState.Collapsed, 'deployments', element.data));
            return items;
        }
        else if (element.type === 'deployments') {
            // Show deployment history
            try {
                const response = await this.authProvider.makeAuthenticatedRequest(`${constants_1.SHADOW_CLONE_API}/projects/${element.id}/deployments`);
                const deployments = response.data;
                if (deployments.length === 0) {
                    return [new ProjectItem('No deployments yet', '', vscode.TreeItemCollapsibleState.None, 'empty')];
                }
                return deployments.map((deployment) => new ProjectItem(`Wave ${deployment.waveNumber} - ${deployment.agentCount} agents`, deployment.id, vscode.TreeItemCollapsibleState.None, 'deployment', deployment));
            }
            catch (error) {
                return [new ProjectItem('Error loading deployments', '', vscode.TreeItemCollapsibleState.None, 'error')];
            }
        }
        return [];
    }
}
exports.ProjectProvider = ProjectProvider;
class ProjectItem extends vscode.TreeItem {
    constructor(label, id, collapsibleState, type, data) {
        super(label, collapsibleState);
        this.label = label;
        this.id = id;
        this.collapsibleState = collapsibleState;
        this.type = type;
        this.data = data;
        this.tooltip = this.label;
        // Set context value for menu actions
        this.contextValue = type;
        // Set icons based on type
        switch (type) {
            case 'project':
                this.iconPath = new vscode.ThemeIcon('project');
                this.description = data?.status || '';
                break;
            case 'deployment':
                this.iconPath = new vscode.ThemeIcon('rocket');
                this.description = new Date(data?.createdAt).toLocaleDateString();
                break;
            case 'deployments':
                this.iconPath = new vscode.ThemeIcon('history');
                break;
            case 'info':
                this.iconPath = new vscode.ThemeIcon('info');
                break;
            case 'auth':
                this.iconPath = new vscode.ThemeIcon('key');
                this.command = {
                    command: 'shadowClone.authenticate',
                    title: 'Authenticate'
                };
                break;
            case 'empty':
                this.iconPath = new vscode.ThemeIcon('folder-opened');
                break;
            case 'error':
                this.iconPath = new vscode.ThemeIcon('error');
                break;
        }
    }
}
//# sourceMappingURL=projectProvider.js.map