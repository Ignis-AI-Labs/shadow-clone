import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';
import { SHADOW_CLONE_API } from '../utils/constants';

export class AgentProvider implements vscode.TreeDataProvider<AgentItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<AgentItem | undefined | null | void> = new vscode.EventEmitter<AgentItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<AgentItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private authProvider: AuthProvider) {
        // Refresh when auth changes
        authProvider.onDidChangeAuth(() => this.refresh());
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: AgentItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: AgentItem): Promise<AgentItem[]> {
        if (!await this.authProvider.checkAuth()) {
            return [];
        }

        if (!element) {
            // Root level - show active agents
            try {
                const response = await this.authProvider.makeAuthenticatedRequest(`${SHADOW_CLONE_API}/agents/active`);
                const agents = response.data;

                if (agents.length === 0) {
                    return [new AgentItem('No active agents', '', vscode.TreeItemCollapsibleState.None, 'empty')];
                }

                return agents.map((agent: any) => new AgentItem(
                    agent.name,
                    agent.id,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    'agent',
                    agent
                ));
            } catch (error) {
                return [new AgentItem('Error loading agents', '', vscode.TreeItemCollapsibleState.None, 'error')];
            }
        } else if (element.type === 'agent') {
            // Agent details
            const items: AgentItem[] = [];
            
            items.push(new AgentItem(
                `Role: ${element.data.role}`,
                '',
                vscode.TreeItemCollapsibleState.None,
                'info'
            ));
            
            items.push(new AgentItem(
                `Status: ${element.data.status}`,
                '',
                vscode.TreeItemCollapsibleState.None,
                'status',
                element.data
            ));
            
            items.push(new AgentItem(
                `Project: ${element.data.projectName}`,
                element.data.projectId,
                vscode.TreeItemCollapsibleState.None,
                'project-link',
                element.data
            ));
            
            if (element.data.currentTask) {
                items.push(new AgentItem(
                    `Current task: ${element.data.currentTask}`,
                    '',
                    vscode.TreeItemCollapsibleState.None,
                    'task'
                ));
            }
            
            items.push(new AgentItem(
                `Progress: ${element.data.progress}%`,
                '',
                vscode.TreeItemCollapsibleState.None,
                'progress'
            ));
            
            return items;
        }
        
        return [];
    }
}

class AgentItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly id: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly type: 'agent' | 'info' | 'status' | 'task' | 'progress' | 'empty' | 'error' | 'project-link',
        public readonly data?: any
    ) {
        super(label, collapsibleState);
        
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

    private getStatusIcon(status: string): vscode.ThemeIcon {
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