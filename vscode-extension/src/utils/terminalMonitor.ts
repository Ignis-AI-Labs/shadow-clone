import * as vscode from 'vscode';
import { ClaudeSessionManager } from './claudeSessionManager';

export class TerminalMonitor {
    private monitoredTerminals = new WeakSet<vscode.Terminal>();
    
    constructor(
        private sessionManager: ClaudeSessionManager
    ) {
        this.initialize();
    }

    private initialize() {
        console.log('[TerminalMonitor] Initializing...');
        
        // Monitor existing terminals
        console.log(`[TerminalMonitor] Checking ${vscode.window.terminals.length} existing terminals`);
        vscode.window.terminals.forEach(terminal => {
            console.log(`[TerminalMonitor] Checking existing terminal: "${terminal.name}"`);
            this.checkAndMonitorTerminal(terminal);
        });

        // Monitor new terminals
        vscode.window.onDidOpenTerminal(terminal => {
            console.log(`[TerminalMonitor] New terminal opened: "${terminal.name}"`);
            this.checkAndMonitorTerminal(terminal);
        });

        // Also check when terminal becomes active
        vscode.window.onDidChangeActiveTerminal(terminal => {
            if (terminal) {
                console.log(`[TerminalMonitor] Terminal became active: "${terminal.name}"`);
                this.checkAndMonitorTerminal(terminal);
            }
        });
        
        // Also monitor terminal name changes (in case name is set after creation)
        vscode.window.onDidChangeTerminalState(terminal => {
            console.log(`[TerminalMonitor] Terminal state changed: "${terminal.name}"`);
            this.checkAndMonitorTerminal(terminal);
        });
    }

    private checkAndMonitorTerminal(terminal: vscode.Terminal) {
        // Skip if already monitored
        if (this.monitoredTerminals.has(terminal)) {
            console.log(`[TerminalMonitor] Terminal already monitored: "${terminal.name}"`);
            return;
        }

        // Check if this terminal already has a session
        const existingSession = this.sessionManager.getSessionByTerminal(terminal);
        if (existingSession) {
            console.log(`[TerminalMonitor] Terminal already has session: "${terminal.name}"`);
            this.monitoredTerminals.add(terminal);
            return;
        }

        // Check if this is a Claude terminal
        const name = terminal.name.toLowerCase();
        console.log(`[TerminalMonitor] Checking terminal "${terminal.name}" (lowercase: "${name}")`);
        
        // More comprehensive detection patterns
        const claudePatterns = [
            'claude',
            'shadow clone',
            'claude code',
            'claude-code',
            'shadow-clone'
        ];
        
        const isClaudeTerminal = claudePatterns.some(pattern => name.includes(pattern));
        
        if (isClaudeTerminal) {
            console.log(`[TerminalMonitor] Detected Claude terminal: "${terminal.name}"`);
            this.monitoredTerminals.add(terminal);
            
            // Create a session for this terminal
            const sessionId = this.sessionManager.createSession(
                terminal,
                'detected',
                'Claude session detected'
            );
            console.log(`[TerminalMonitor] Created session: ${sessionId}`);

            // Show notification
            vscode.window.showInformationMessage(
                `Shadow Clone: Detected Claude session in "${terminal.name}"`,
                'Track Session'
            ).then(action => {
                if (action === 'Track Session') {
                    vscode.commands.executeCommand('shadowClone.showSessions');
                }
            });
        } else {
            console.log(`[TerminalMonitor] Not a Claude terminal: "${terminal.name}"`);
        }
    }

    /**
     * Manually register a terminal as a Claude session
     */
    public registerCurrentTerminal() {
        const activeTerminal = vscode.window.activeTerminal;
        if (!activeTerminal) {
            vscode.window.showErrorMessage('No active terminal to register');
            return;
        }

        if (this.monitoredTerminals.has(activeTerminal)) {
            vscode.window.showInformationMessage('This terminal is already being tracked');
            return;
        }

        this.monitoredTerminals.add(activeTerminal);
        
        const sessionId = this.sessionManager.createSession(
            activeTerminal,
            'manual',
            'Manually registered Claude session'
        );

        vscode.window.showInformationMessage(
            'Terminal registered as Claude session',
            'View Sessions'
        ).then(action => {
            if (action === 'View Sessions') {
                vscode.commands.executeCommand('shadowClone.showSessions');
            }
        });
    }
}