import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';

export interface ClaudeSession {
    id: string;
    terminal: vscode.Terminal;
    command: string;
    mode: string;
    startTime: Date;
    status: 'active' | 'completed' | 'error';
    workspace?: string;
    outputPath?: string;
}

export class ClaudeSessionManager {
    private sessions: Map<string, ClaudeSession> = new Map();
    private _onSessionsChanged: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onSessionsChanged: vscode.Event<void> = this._onSessionsChanged.event;

    constructor(private context: vscode.ExtensionContext) {
        // Listen for terminal close events
        vscode.window.onDidCloseTerminal((terminal) => {
            this.handleTerminalClosed(terminal);
        });

        // Restore sessions from storage
        this.restoreSessions();
    }

    createSession(terminal: vscode.Terminal, mode: string, command: string): string {
        // Check if this terminal already has a session
        for (const [id, session] of this.sessions) {
            if (session.terminal === terminal && session.status === 'active') {
                console.log(`[SessionManager] Terminal already has active session: ${id}`);
                return id; // Return existing session ID
            }
        }
        
        const sessionId = uuidv4();
        const session: ClaudeSession = {
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

    private monitorSession(session: ClaudeSession) {
        // Watch for .waves directory creation
        if (session.workspace) {
            const wavesPath = vscode.Uri.file(`${session.workspace}/.waves`);
            const watcher = vscode.workspace.createFileSystemWatcher(
                new vscode.RelativePattern(wavesPath, '**/*')
            );

            watcher.onDidCreate((uri) => {
                this.handleWaveOutput(session, uri);
            });

            watcher.onDidChange((uri) => {
                this.handleWaveOutput(session, uri);
            });

            // Store watcher for cleanup
            (session as any).watcher = watcher;
        }
    }

    private handleWaveOutput(session: ClaudeSession, uri: vscode.Uri) {
        // Update session with output path
        if (!session.outputPath) {
            session.outputPath = uri.fsPath;
            this.saveSessions();
            this._onSessionsChanged.fire();
        }

        // Show notification for important files
        if (uri.fsPath.includes('final-deliverables')) {
            vscode.window.showInformationMessage(
                `Shadow Clone completed deliverables for ${session.mode} session!`,
                'Open Output'
            ).then(action => {
                if (action === 'Open Output') {
                    vscode.commands.executeCommand('vscode.open', uri);
                }
            });
        }
    }

    private handleTerminalClosed(terminal: vscode.Terminal) {
        for (const [id, session] of this.sessions) {
            if (session.terminal === terminal) {
                session.status = 'completed';
                this.saveSessions();
                this._onSessionsChanged.fire();
                
                // Clean up watcher
                if ((session as any).watcher) {
                    (session as any).watcher.dispose();
                }
                break;
            }
        }
    }

    getSession(id: string): ClaudeSession | undefined {
        return this.sessions.get(id);
    }
    
    getSessionByTerminal(terminal: vscode.Terminal): ClaudeSession | undefined {
        for (const session of this.sessions.values()) {
            if (session.terminal === terminal) {
                return session;
            }
        }
        return undefined;
    }

    getAllSessions(): ClaudeSession[] {
        return Array.from(this.sessions.values());
    }

    getActiveSessions(): ClaudeSession[] {
        return this.getAllSessions().filter(s => s.status === 'active');
    }

    terminateSession(id: string) {
        const session = this.sessions.get(id);
        if (session) {
            session.terminal.dispose();
            session.status = 'completed';
            this.saveSessions();
            this._onSessionsChanged.fire();
        }
    }

    updateSessionCommand(id: string, newCommand: string) {
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

    private saveSessions() {
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

    private restoreSessions() {
        const sessionsData = this.context.globalState.get<any[]>('shadowClone.sessions', []);
        
        // Only restore completed sessions for history
        sessionsData.forEach(data => {
            if (data.status === 'completed') {
                const session: ClaudeSession = {
                    ...data,
                    terminal: null as any, // Terminal is gone
                    startTime: new Date(data.startTime)
                };
                this.sessions.set(data.id, session);
            }
        });
    }

    // Get command history for quick re-run
    getCommandHistory(): Array<{command: string, mode: string, timestamp: Date}> {
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