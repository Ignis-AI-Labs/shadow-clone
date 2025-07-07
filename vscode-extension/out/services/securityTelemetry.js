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
exports.SecurityTelemetryService = void 0;
const vscode = __importStar(require("vscode"));
const constants_1 = require("../utils/constants");
class SecurityTelemetryService {
    constructor(context, authProvider) {
        this.context = context;
        this.authProvider = authProvider;
        this.telemetryQueue = [];
        this.isEnabled = true;
        this.suspicionScore = 0;
        this.MAX_QUEUE_SIZE = 50;
        this.BATCH_INTERVAL = 30000; // 30 seconds
        this.HEARTBEAT_INTERVAL = 300000; // 5 minutes
        this.sessionId = this.generateSessionId();
        this.initialize();
    }
    initialize() {
        // Start heartbeat
        this.startHeartbeat();
        // Start batch upload timer
        this.startBatchUpload();
        // Monitor workspace events
        this.setupEventMonitoring();
        // Monitor clipboard for extraction attempts
        this.monitorClipboard();
    }
    /**
     * Log a telemetry event
     */
    logEvent(eventType, details) {
        if (!this.isEnabled)
            return;
        const event = {
            eventType,
            timestamp: new Date().toISOString(),
            details,
            sessionId: this.sessionId,
            extensionVersion: this.context.extension.packageJSON.version,
        };
        this.telemetryQueue.push(event);
        // Check for suspicious patterns
        const securityCheck = this.checkForSuspiciousActivity(event);
        if (securityCheck.isSuspicious) {
            this.handleSuspiciousActivity(securityCheck);
        }
        // Upload immediately if queue is full
        if (this.telemetryQueue.length >= this.MAX_QUEUE_SIZE) {
            this.uploadTelemetry();
        }
    }
    /**
     * Check for suspicious activity patterns
     */
    checkForSuspiciousActivity(event) {
        const suspiciousPatterns = [
            /show.*prompt/i,
            /display.*instructions/i,
            /extract.*content/i,
            /copy.*shadow.*clone/i,
            /save.*prompt/i,
            /export.*instructions/i,
            /print.*full.*prompt/i,
            /get.*system.*prompt/i,
        ];
        // Check event details for suspicious patterns
        const eventString = JSON.stringify(event.details).toLowerCase();
        for (const pattern of suspiciousPatterns) {
            if (pattern.test(eventString)) {
                return {
                    checkType: 'command_pattern',
                    isSuspicious: true,
                    details: `Suspicious pattern detected: ${pattern.source}`,
                };
            }
        }
        // Check for rapid command execution (potential automation)
        if (event.eventType === 'command_executed') {
            const recentCommands = this.telemetryQueue
                .filter(e => e.eventType === 'command_executed')
                .slice(-10);
            if (recentCommands.length >= 10) {
                const timeSpan = new Date(event.timestamp).getTime() -
                    new Date(recentCommands[0].timestamp).getTime();
                if (timeSpan < 5000) { // 10 commands in 5 seconds
                    return {
                        checkType: 'command_pattern',
                        isSuspicious: true,
                        details: 'Rapid command execution detected',
                    };
                }
            }
        }
        return {
            checkType: 'command_pattern',
            isSuspicious: false,
            details: '',
        };
    }
    /**
     * Handle suspicious activity (monitoring only)
     */
    async handleSuspiciousActivity(check) {
        this.suspicionScore += 10;
        // Log suspicious activity for admin review
        this.logEvent('suspicious_activity', {
            check,
            suspicionScore: this.suspicionScore,
            mode: 'monitoring-only',
        });
        // Show informational message (not warning) if score is high
        if (this.suspicionScore >= 50 && this.suspicionScore < 60) {
            // Only show once when crossing threshold
            vscode.window.showInformationMessage('Security Notice: Your activity patterns are being logged for quality assurance.', 'OK');
        }
        // Upload telemetry for admin review
        await this.uploadTelemetry();
        // Log high scores but don't take action
        if (this.suspicionScore >= 100) {
            console.log(`[Security Monitor] High suspicion score (${this.suspicionScore}) for session ${this.sessionId}`);
            // Just notify admins, don't restrict functionality
            await this.notifyAdminsOfHighScore();
        }
    }
    /**
     * Notify admins of high score (no enforcement)
     */
    async notifyAdminsOfHighScore() {
        // Notify the backend for admin review
        try {
            const apiKey = await this.authProvider.getApiKey();
            if (!apiKey)
                return;
            await fetch(`${(0, constants_1.getApiEndpoint)()}/api/security/monitoring-alert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                    'X-Security-Mode': 'monitoring-only',
                },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    suspicionScore: this.suspicionScore,
                    events: this.telemetryQueue.slice(-20), // Last 20 events
                    severity: 'high',
                    actionTaken: 'none-monitoring-only',
                }),
            });
        }
        catch (error) {
            console.error('Failed to send monitoring alert:', error);
        }
        // Don't show error or restrict features
        // Admins will review and decide on any action
    }
    /**
     * Monitor clipboard for extraction attempts
     */
    monitorClipboard() {
        // Check clipboard periodically
        setInterval(async () => {
            try {
                const clipboardText = await vscode.env.clipboard.readText();
                // Check if clipboard contains prompt-like content
                if (this.looksLikePromptContent(clipboardText)) {
                    // Just log for monitoring, don't take action
                    this.logEvent('suspicious_activity', {
                        type: 'clipboard_monitoring',
                        contentLength: clipboardText.length,
                        preview: clipboardText.substring(0, 50), // Shorter preview for privacy
                        mode: 'monitoring-only',
                        actionTaken: 'logged-for-review',
                    });
                }
            }
            catch (error) {
                // Ignore clipboard access errors
            }
        }, 30000); // Check every 30 seconds
    }
    /**
     * Check if text looks like prompt content
     */
    looksLikePromptContent(text) {
        if (text.length < 500)
            return false;
        const promptIndicators = [
            /shadow\s*clone\s*orchestration/i,
            /deployment\s*strategy/i,
            /agent\s*deployment/i,
            /wave\s*execution/i,
            /\$\{.*waves_directory.*\}/,
            /load.*shadow.*clone.*prompt/i,
        ];
        return promptIndicators.some(pattern => pattern.test(text));
    }
    /**
     * Setup event monitoring
     */
    setupEventMonitoring() {
        // Monitor terminal creation
        vscode.window.onDidOpenTerminal(terminal => {
            this.logEvent('command_executed', {
                action: 'terminal_opened',
                name: terminal.name,
            });
        });
        // Monitor active editor changes
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                const fileName = editor.document.fileName;
                // Check for suspicious file access
                if (fileName.includes('shadow-clone') || fileName.includes('prompt')) {
                    this.logEvent('suspicious_activity', {
                        type: 'file_access',
                        fileName,
                    });
                }
            }
        });
        // Monitor command execution
        vscode.commands.registerCommand('*', (...args) => {
            // This is a wildcard to monitor all commands
            // In practice, we'll monitor specific commands
        });
    }
    /**
     * Start heartbeat
     */
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            this.logEvent('heartbeat', {
                suspicionScore: this.suspicionScore,
                queueSize: this.telemetryQueue.length,
                uptime: process.uptime(),
            });
        }, this.HEARTBEAT_INTERVAL);
    }
    /**
     * Start batch upload timer
     */
    startBatchUpload() {
        setInterval(() => {
            if (this.telemetryQueue.length > 0) {
                this.uploadTelemetry();
            }
        }, this.BATCH_INTERVAL);
    }
    /**
     * Upload telemetry to backend
     */
    async uploadTelemetry() {
        if (this.telemetryQueue.length === 0)
            return;
        const events = [...this.telemetryQueue];
        this.telemetryQueue = [];
        try {
            const apiKey = await this.authProvider.getApiKey();
            if (!apiKey)
                return;
            const response = await fetch(`${(0, constants_1.getApiEndpoint)()}/api/telemetry/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    events,
                    metadata: {
                        extensionVersion: this.context.extension.packageJSON.version,
                        vsCodeVersion: vscode.version,
                        platform: process.platform,
                        suspicionScore: this.suspicionScore,
                    },
                }),
            });
            if (!response.ok) {
                // Re-queue events if upload failed
                this.telemetryQueue.unshift(...events);
            }
        }
        catch (error) {
            console.error('Failed to upload telemetry:', error);
            // Re-queue events
            this.telemetryQueue.unshift(...events);
        }
    }
    /**
     * Monitor command execution
     */
    monitorCommand(command, parameters) {
        this.logEvent('command_executed', {
            command,
            parameters: this.sanitizeParameters(parameters),
            timestamp: Date.now(),
        });
        // Check for extraction in command
        const extractionKeywords = [
            'curl.*shadow-clone.*>.*\\.txt',
            'wget.*shadow-clone',
            'save.*prompt',
            'export.*SHADOW_CLONE',
        ];
        for (const keyword of extractionKeywords) {
            if (new RegExp(keyword, 'i').test(command)) {
                this.logEvent('suspicious_activity', {
                    type: 'command_extraction',
                    command: command.substring(0, 100),
                });
                break;
            }
        }
    }
    /**
     * Sanitize parameters to avoid sending sensitive data
     */
    sanitizeParameters(params) {
        if (!params)
            return {};
        const sanitized = { ...params };
        // Remove API keys and sensitive data
        const sensitiveKeys = ['apiKey', 'password', 'token', 'secret'];
        for (const key of sensitiveKeys) {
            if (sanitized[key]) {
                sanitized[key] = '[REDACTED]';
            }
        }
        return sanitized;
    }
    /**
     * Generate session ID
     */
    generateSessionId() {
        return `ext-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Get current session stats
     */
    getSessionStats() {
        return {
            sessionId: this.sessionId,
            suspicionScore: this.suspicionScore,
            eventsLogged: this.telemetryQueue.length,
            isEnabled: this.isEnabled,
        };
    }
    /**
     * Disable telemetry (for privacy-conscious users)
     */
    disable() {
        this.isEnabled = false;
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
    }
    /**
     * Dispose of resources
     */
    dispose() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        // Upload any remaining telemetry
        this.uploadTelemetry();
    }
}
exports.SecurityTelemetryService = SecurityTelemetryService;
//# sourceMappingURL=securityTelemetry.js.map