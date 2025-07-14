import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';
import { SHADOW_CLONE_API } from '../utils/constants';

export class ProjectProvider implements vscode.TreeDataProvider<ProjectItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ProjectItem | undefined | null | void> = new vscode.EventEmitter<ProjectItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ProjectItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private authProvider: AuthProvider) {
        // Refresh when auth changes
        authProvider.onDidChangeAuth(() => this.refresh());
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ProjectItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ProjectItem): Promise<ProjectItem[]> {
        if (!await this.authProvider.checkAuth()) {
            return [new ProjectItem('Not authenticated', '', vscode.TreeItemCollapsibleState.None, 'auth')];
        }

        if (!element) {
            // Root level - show projects
            try {
                // Note: This endpoint doesn't exist in the new API structure
                // TODO: Remove or replace with actual endpoint
                const response = await this.authProvider.makeAuthenticatedRequest(`${SHADOW_CLONE_API}/projects`);
                const projects = response.data;

                if (projects.length === 0) {
                    return [new ProjectItem('No projects yet', '', vscode.TreeItemCollapsibleState.None, 'empty')];
                }

                return projects.map((project: any) => new ProjectItem(
                    project.name,
                    project.id,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    'project',
                    project
                ));
            } catch (error) {
                return [new ProjectItem('Error loading projects', '', vscode.TreeItemCollapsibleState.None, 'error')];
            }
        } else if (element.type === 'project') {
            // Project details
            const items: ProjectItem[] = [];
            
            items.push(new ProjectItem(
                `Status: ${element.data.status}`,
                '',
                vscode.TreeItemCollapsibleState.None,
                'info'
            ));
            
            items.push(new ProjectItem(
                `Created: ${new Date(element.data.createdAt).toLocaleDateString()}`,
                '',
                vscode.TreeItemCollapsibleState.None,
                'info'
            ));
            
            if (element.data.lastDeployment) {
                items.push(new ProjectItem(
                    `Last deployment: ${new Date(element.data.lastDeployment).toLocaleDateString()}`,
                    '',
                    vscode.TreeItemCollapsibleState.None,
                    'info'
                ));
            }
            
            items.push(new ProjectItem(
                'Deployments',
                element.id,
                vscode.TreeItemCollapsibleState.Collapsed,
                'deployments',
                element.data
            ));
            
            return items;
        } else if (element.type === 'deployments') {
            // Show deployment history
            try {
                // Note: This endpoint doesn't exist in the new API structure
                // TODO: Remove or replace with actual endpoint
                const response = await this.authProvider.makeAuthenticatedRequest(
                    `${SHADOW_CLONE_API}/projects/${element.id}/deployments`
                );
                const deployments = response.data;
                
                if (deployments.length === 0) {
                    return [new ProjectItem('No deployments yet', '', vscode.TreeItemCollapsibleState.None, 'empty')];
                }
                
                return deployments.map((deployment: any) => new ProjectItem(
                    `Wave ${deployment.waveNumber} - ${deployment.agentCount} agents`,
                    deployment.id,
                    vscode.TreeItemCollapsibleState.None,
                    'deployment',
                    deployment
                ));
            } catch (error) {
                return [new ProjectItem('Error loading deployments', '', vscode.TreeItemCollapsibleState.None, 'error')];
            }
        }
        
        return [];
    }
}

class ProjectItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly id: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly type: 'project' | 'deployment' | 'info' | 'auth' | 'empty' | 'error' | 'deployments',
        public readonly data?: any
    ) {
        super(label, collapsibleState);
        
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