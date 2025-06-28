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
exports.ClaudeSessionManager = void 0;
const vscode = __importStar(require("vscode"));
const uuid_1 = require("uuid");
class ClaudeSessionManager {
    constructor(context) {
        this.context = context;
        this.sessions = new Map();
        this._onSessionsChanged = new vscode.EventEmitter();
        this.onSessionsChanged = this._onSessionsChanged.event;
        // Listen for terminal close events
        vscode.window.onDidCloseTerminal((terminal) => {
            this.handleTerminalClosed(terminal);
        });
        // Restore sessions from storage
        this.restoreSessions();
    }
    createSession(terminal, mode, command) {
        // Check if this terminal already has a session
        for (const [id, session] of this.sessions) {
            if (session.terminal === terminal && session.status === 'active') {
                console.log(`[SessionManager] Terminal already has active session: ${id}`);
                return id; // Return existing session ID
            }
        }
        const sessionId = (0, uuid_1.v4)();
        const session = {
            id: sessionId,
            terminal,
            command,
            mode,
            startTime: new Date(),
            status: 'active',
            workspace: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
        };
        this.sessions.set(sessionId, session);
        this.saveSessions();
        this._onSessionsChanged.fire();
        // Set up output monitoring
        this.monitorSession(session);
        return sessionId;
    }
    monitorSession(session) {
        // Watch for .waves directory creation
        if (session.workspace) {
            const wavesPath = vscode.Uri.file(`${session.workspace}/.waves`);
            const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(wavesPath, '**/*'));
            watcher.onDidCreate((uri) => {
                this.handleWaveOutput(session, uri);
            });
            watcher.onDidChange((uri) => {
                this.handleWaveOutput(session, uri);
            });
            // Store watcher for cleanup
            session.watcher = watcher;
        }
    }
    handleWaveOutput(session, uri) {
        // Update session with output path
        if (!session.outputPath) {
            session.outputPath = uri.fsPath;
            this.saveSessions();
            this._onSessionsChanged.fire();
        }
        // Show notification for important files
        if (uri.fsPath.includes('final-deliverables')) {
            vscode.window.showInformationMessage(`Shadow Clone completed deliverables for ${session.mode} session!`, 'Open Output').then(action => {
                if (action === 'Open Output') {
                    vscode.commands.executeCommand('vscode.open', uri);
                }
            });
        }
    }
    handleTerminalClosed(terminal) {
        for (const [id, session] of this.sessions) {
            if (session.terminal === terminal) {
                session.status = 'completed';
                this.saveSessions();
                this._onSessionsChanged.fire();
                // Clean up watcher
                if (session.watcher) {
                    session.watcher.dispose();
                }
                break;
            }
        }
    }
    getSession(id) {
        return this.sessions.get(id);
    }
    getSessionByTerminal(terminal) {
        for (const session of this.sessions.values()) {
            if (session.terminal === terminal) {
                return session;
            }
        }
        return undefined;
    }
    getAllSessions() {
        return Array.from(this.sessions.values());
    }
    getActiveSessions() {
        return this.getAllSessions().filter(s => s.status === 'active');
    }
    terminateSession(id) {
        const session = this.sessions.get(id);
        if (session) {
            session.terminal.dispose();
            session.status = 'completed';
            this.saveSessions();
            this._onSessionsChanged.fire();
        }
    }
    updateSessionCommand(id, newCommand) {
        const session = this.sessions.get(id);
        if (session) {
            session.command = newCommand;
            this.saveSessions();
            this._onSessionsChanged.fire();
        }
    }
    clearCompletedSessions() {
        const completed = this.getAllSessions().filter(s => s.status === 'completed');
        completed.forEach(s => this.sessions.delete(s.id));
        this.saveSessions();
        this._onSessionsChanged.fire();
    }
    saveSessions() {
        const sessionsData = this.getAllSessions().map(s => ({
            id: s.id,
            command: s.command,
            mode: s.mode,
            startTime: s.startTime,
            status: s.status,
            workspace: s.workspace,
            outputPath: s.outputPath
        }));
        this.context.globalState.update('shadowClone.sessions', sessionsData);
    }
    restoreSessions() {
        const sessionsData = this.context.globalState.get('shadowClone.sessions', []);
        // Only restore completed sessions for history
        sessionsData.forEach(data => {
            if (data.status === 'completed') {
                const session = {
                    ...data,
                    terminal: null, // Terminal is gone
                    startTime: new Date(data.startTime)
                };
                this.sessions.set(data.id, session);
            }
        });
    }
    // Get command history for quick re-run
    getCommandHistory() {
        return this.getAllSessions()
            .map(s => ({
            command: s.command,
            mode: s.mode,
            timestamp: s.startTime
        }))
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10); // Last 10 commands
    }
}
exports.ClaudeSessionManager = ClaudeSessionManager;
//# sourceMappingURL=claudeSessionManager.js.map