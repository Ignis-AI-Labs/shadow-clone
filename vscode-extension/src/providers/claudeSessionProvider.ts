import * as vscode from 'vscode';
import { ClaudeSessionManager, ClaudeSession } from '../utils/claudeSessionManager';

export class ClaudeSessionProvider implements vscode.TreeDataProvider<SessionItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<SessionItem | undefined | null | void> = new vscode.EventEmitter<SessionItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<SessionItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private sessionManager: ClaudeSessionManager) {
        // Refresh when sessions change
        sessionManager.onSessionsChanged(() => this.refresh());
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: SessionItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: SessionItem): Promise<SessionItem[]> {
        if (!element) {
            // Root level - show active and recent sessions
            const items: SessionItem[] = [];
            
            // Active sessions
            const activeSessions = this.sessionManager.getActiveSessions();
            if (activeSessions.length > 0) {
                items.push(new SessionItem('Active Sessions', '', vscode.TreeItemCollapsibleState.Expanded, 'header'));
                items.push(...activeSessions.map(s => this.createSessionItem(s)));
            }
            
            // Recent completed sessions
            const completedSessions = this.sessionManager.getAllSessions()
                .filter(s => s.status === 'completed')
                .slice(0, 5);
            
            if (completedSessions.length > 0) {
                items.push(new SessionItem('Recent Sessions', '', vscode.TreeItemCollapsibleState.Collapsed, 'header'));
                items.push(...completedSessions.map(s => this.createSessionItem(s)));
            }
            
            if (items.length === 0) {
                items.push(new SessionItem('No Claude sessions yet', '', vscode.TreeItemCollapsibleState.None, 'empty'));
            }
            
            return items;
        }
        
        return [];
    }

    private createSessionItem(session: ClaudeSession): SessionItem {
        const timeSince = this.getTimeSince(session.startTime);
        const item = new SessionItem(
            session.mode,
            session.id,
            vscode.TreeItemCollapsibleState.None,
            'session',
            session
        );
        
        item.description = `${timeSince} • ${session.status}`;
        item.tooltip = new vscode.MarkdownString(`**Command:** \`${session.command}\`\n\n**Started:** ${session.startTime.toLocaleString()}`);
        
        return item;
    }

    private getTimeSince(date: Date): string {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }
}

class SessionItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly id: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly type: 'session' | 'header' | 'empty',
        public readonly session?: ClaudeSession
    ) {
        super(label, collapsibleState);
        
        this.contextValue = type;
        
        // Set icons and commands based on type
        switch (type) {
            case 'session':
                this.iconPath = this.getSessionIcon(session!);
                if (session?.outputPath) {
                    this.command = {
                        command: 'shadowClone.openSessionOutput',
                        title: 'Open Output',
                        arguments: [session.id]
                    };
                }
                break;
            case 'header':
                this.iconPath = new vscode.ThemeIcon('folder');
                break;
            case 'empty':
                this.iconPath = new vscode.ThemeIcon('info');
                this.command = {
                    command: 'shadowClone.launchClaude',
                    title: 'Launch Claude'
                };
                break;
        }
    }

    private getSessionIcon(session: ClaudeSession): vscode.ThemeIcon {
        if (session.status === 'active') {
            return new vscode.ThemeIcon('debug-start', new vscode.ThemeColor('debugIcon.startForeground'));
        } else if (session.status === 'error') {
            return new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
        } else {
            return new vscode.ThemeIcon('pass', new vscode.ThemeColor('testing.iconPassed'));
        }
    }
}