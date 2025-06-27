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
exports.ClaudeSessionProvider = void 0;
const vscode = __importStar(require("vscode"));
class ClaudeSessionProvider {
    constructor(sessionManager) {
        this.sessionManager = sessionManager;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        // Refresh when sessions change
        sessionManager.onSessionsChanged(() => this.refresh());
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren(element) {
        if (!element) {
            // Root level - show active and recent sessions
            const items = [];
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
    createSessionItem(session) {
        const timeSince = this.getTimeSince(session.startTime);
        const item = new SessionItem(session.mode, session.id, vscode.TreeItemCollapsibleState.None, 'session', session);
        item.description = `${timeSince} • ${session.status}`;
        item.tooltip = new vscode.MarkdownString(`**Command:** \`${session.command}\`\n\n**Started:** ${session.startTime.toLocaleString()}`);
        return item;
    }
    getTimeSince(date) {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60)
            return 'just now';
        if (seconds < 3600)
            return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400)
            return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }
}
exports.ClaudeSessionProvider = ClaudeSessionProvider;
class SessionItem extends vscode.TreeItem {
    constructor(label, id, collapsibleState, type, session) {
        super(label, collapsibleState);
        this.label = label;
        this.id = id;
        this.collapsibleState = collapsibleState;
        this.type = type;
        this.session = session;
        this.contextValue = type;
        // Set icons and commands based on type
        switch (type) {
            case 'session':
                this.iconPath = this.getSessionIcon(session);
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
    getSessionIcon(session) {
        if (session.status === 'active') {
            return new vscode.ThemeIcon('debug-start', new vscode.ThemeColor('debugIcon.startForeground'));
        }
        else if (session.status === 'error') {
            return new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
        }
        else {
            return new vscode.ThemeIcon('pass', new vscode.ThemeColor('testing.iconPassed'));
        }
    }
}
//# sourceMappingURL=claudeSessionProvider.js.map