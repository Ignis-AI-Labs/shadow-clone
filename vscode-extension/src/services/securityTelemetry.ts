import * as vscode from 'vscode';
import { AuthProvider } from '../auth/authProvider';
import { getApiEndpoint } from '../utils/constants';

interface TelemetryEvent {
  eventType: 'command_executed' | 'prompt_fetched' | 'suspicious_activity' | 'error' | 'heartbeat';
  timestamp: string;
  details: any;
  sessionId: string;
  extensionVersion: string;
}

interface SecurityCheck {
  checkType: 'terminal_content' | 'clipboard' | 'file_access' | 'command_pattern';
  isSuspicious: boolean;
  details: string;
}

export class SecurityTelemetryService {
  private sessionId: string;
  private telemetryQueue: TelemetryEvent[] = [];
  private heartbeatInterval: NodeJS.Timeout | undefined;
  private isEnabled: boolean = true;
  private suspicionScore: number = 0;
  private readonly MAX_QUEUE_SIZE = 50;
  private readonly BATCH_INTERVAL = 30000; // 30 seconds
  private readonly HEARTBEAT_INTERVAL = 300000; // 5 minutes

  constructor(
    private context: vscode.ExtensionContext,
    private authProvider: AuthProvider
  ) {
    this.sessionId = this.generateSessionId();
    this.initialize();
  }

  private initialize(): void {
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
  public logEvent(eventType: TelemetryEvent['eventType'], details: any): void {
    if (!this.isEnabled) return;

    const event: TelemetryEvent = {
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
  private checkForSuspiciousActivity(event: TelemetryEvent): SecurityCheck {
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
   * Handle suspicious activity
   */
  private async handleSuspiciousActivity(check: SecurityCheck): Promise<void> {
    this.suspicionScore += 10;

    // Log suspicious activity
    this.logEvent('suspicious_activity', {
      check,
      suspicionScore: this.suspicionScore,
    });

    // Show warning if score is high
    if (this.suspicionScore >= 50) {
      vscode.window.showWarningMessage(
        'Unusual activity detected. This session is being monitored for security.',
        'Acknowledge'
      );
    }

    // Upload telemetry immediately
    await this.uploadTelemetry();

    // Extreme measures for very high scores
    if (this.suspicionScore >= 100) {
      await this.handleHighRiskActivity();
    }
  }

  /**
   * Handle high-risk activity
   */
  private async handleHighRiskActivity(): Promise<void> {
    // Notify the backend
    try {
      const apiKey = await this.authProvider.getApiKey();
      if (!apiKey) return;

      await fetch(`${getApiEndpoint()}/api/security/high-risk-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          suspicionScore: this.suspicionScore,
          events: this.telemetryQueue.slice(-20), // Last 20 events
        }),
      });
    } catch (error) {
      console.error('Failed to send high-risk alert:', error);
    }

    // Consider disabling certain features
    vscode.window.showErrorMessage(
      'Security violation detected. Some features may be restricted.',
      'Contact Support'
    ).then(selection => {
      if (selection === 'Contact Support') {
        vscode.env.openExternal(vscode.Uri.parse('https://shadow-clone.ai/support'));
      }
    });
  }

  /**
   * Monitor clipboard for extraction attempts
   */
  private monitorClipboard(): void {
    // Check clipboard periodically
    setInterval(async () => {
      try {
        const clipboardText = await vscode.env.clipboard.readText();
        
        // Check if clipboard contains prompt-like content
        if (this.looksLikePromptContent(clipboardText)) {
          this.logEvent('suspicious_activity', {
            type: 'clipboard_extraction',
            contentLength: clipboardText.length,
            preview: clipboardText.substring(0, 100),
          });
        }
      } catch (error) {
        // Ignore clipboard access errors
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Check if text looks like prompt content
   */
  private looksLikePromptContent(text: string): boolean {
    if (text.length < 500) return false;

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
  private setupEventMonitoring(): void {
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
  private startHeartbeat(): void {
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
  private startBatchUpload(): void {
    setInterval(() => {
      if (this.telemetryQueue.length > 0) {
        this.uploadTelemetry();
      }
    }, this.BATCH_INTERVAL);
  }

  /**
   * Upload telemetry to backend
   */
  private async uploadTelemetry(): Promise<void> {
    if (this.telemetryQueue.length === 0) return;

    const events = [...this.telemetryQueue];
    this.telemetryQueue = [];

    try {
      const apiKey = await this.authProvider.getApiKey();
      if (!apiKey) return;

      const response = await fetch(`${getApiEndpoint()}/api/telemetry/events`, {
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
    } catch (error) {
      console.error('Failed to upload telemetry:', error);
      // Re-queue events
      this.telemetryQueue.unshift(...events);
    }
  }

  /**
   * Monitor command execution
   */
  public monitorCommand(command: string, parameters?: any): void {
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
  private sanitizeParameters(params: any): any {
    if (!params) return {};
    
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
  private generateSessionId(): string {
    return `ext-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current session stats
   */
  public getSessionStats(): any {
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
  public disable(): void {
    this.isEnabled = false;
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval as NodeJS.Timeout);
    }
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval as NodeJS.Timeout);
    }
    
    // Upload any remaining telemetry
    this.uploadTelemetry();
  }
}