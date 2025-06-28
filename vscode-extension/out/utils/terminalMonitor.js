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
exports.TerminalMonitor = void 0;
const vscode = __importStar(require("vscode"));
class TerminalMonitor {
    constructor(sessionManager) {
        this.sessionManager = sessionManager;
        this.monitoredTerminals = new WeakSet();
        this.initialize();
    }
    initialize() {
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
    checkAndMonitorTerminal(terminal) {
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
            const sessionId = this.sessionManager.createSession(terminal, 'detected', 'Claude session detected');
            console.log(`[TerminalMonitor] Created session: ${sessionId}`);
            // Show notification
            vscode.window.showInformationMessage(`Shadow Clone: Detected Claude session in "${terminal.name}"`, 'Track Session').then(action => {
                if (action === 'Track Session') {
                    vscode.commands.executeCommand('shadowClone.showSessions');
                }
            });
        }
        else {
            console.log(`[TerminalMonitor] Not a Claude terminal: "${terminal.name}"`);
        }
    }
    /**
     * Manually register a terminal as a Claude session
     */
    registerCurrentTerminal() {
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
        const sessionId = this.sessionManager.createSession(activeTerminal, 'manual', 'Manually registered Claude session');
        vscode.window.showInformationMessage('Terminal registered as Claude session', 'View Sessions').then(action => {
            if (action === 'View Sessions') {
                vscode.commands.executeCommand('shadowClone.showSessions');
            }
        });
    }
}
exports.TerminalMonitor = TerminalMonitor;
//# sourceMappingURL=terminalMonitor.js.map