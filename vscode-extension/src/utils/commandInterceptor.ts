import * as vscode from 'vscode';
import { SecurityTelemetryService } from '../services/securityTelemetry';

export class CommandInterceptor {
  private interceptedTerminals = new WeakSet<vscode.Terminal>();

  constructor(private telemetryService: SecurityTelemetryService) {
    this.setupInterception();
  }

  /**
   * Setup command interception
   */
  private setupInterception(): void {
    // Monitor all new terminals
    vscode.window.onDidOpenTerminal(terminal => {
      this.interceptTerminal(terminal);
    });

    // Intercept existing terminals
    vscode.window.terminals.forEach(terminal => {
      this.interceptTerminal(terminal);
    });
  }

  /**
   * Intercept a terminal's sendText method
   */
  private interceptTerminal(terminal: vscode.Terminal): void {
    if (this.interceptedTerminals.has(terminal)) {
      return;
    }

    this.interceptedTerminals.add(terminal);

    // Override sendText for this terminal
    const originalSendText = terminal.sendText.bind(terminal);
    terminal.sendText = (text: string, addNewLine?: boolean) => {
      // Log the command
      this.telemetryService.monitorCommand(text);

      // Check for suspicious patterns
      this.checkCommand(text, terminal);

      // Call original method
      return originalSendText(text, addNewLine);
    };
  }

  /**
   * Check command for suspicious patterns
   */
  private checkCommand(command: string, terminal: vscode.Terminal): void {
    const suspiciousPatterns = [
      // Attempts to save prompts to files
      {
        pattern: /curl.*shadow-clone.*>\s*\S+\.(txt|md|json)/i,
        message: 'Attempt to save API response to file detected',
        severity: 'high',
      },
      // Attempts to pipe to other commands
      {
        pattern: /curl.*shadow-clone.*\|/i,
        message: 'Attempt to pipe API response detected',
        severity: 'medium',
      },
      // Attempts to use wget
      {
        pattern: /wget.*shadow-clone/i,
        message: 'Attempt to download with wget detected',
        severity: 'high',
      },
      // Attempts to echo/cat prompt content
      {
        pattern: /echo.*shadow.*clone.*prompt/i,
        message: 'Attempt to echo prompt content detected',
        severity: 'medium',
      },
      // Attempts to grep for specific content
      {
        pattern: /grep.*".*prompt.*".*shadow-clone/i,
        message: 'Attempt to grep prompt content detected',
        severity: 'medium',
      },
      // Attempts to use jq to extract
      {
        pattern: /jq.*content.*shadow-clone/i,
        message: 'Attempt to extract with jq detected',
        severity: 'high',
      },
      // Environment variable export
      {
        pattern: /export.*SHADOW_CLONE.*=/i,
        message: 'Attempt to export to environment variable detected',
        severity: 'high',
      },
    ];

    for (const { pattern, message, severity } of suspiciousPatterns) {
      if (pattern.test(command)) {
        // Log suspicious activity
        this.telemetryService.logEvent('suspicious_activity', {
          type: 'terminal_command',
          pattern: pattern.source,
          message,
          severity,
          terminalName: terminal.name,
          commandPreview: command.substring(0, 100),
        });

        // Show warning for high severity
        if (severity === 'high') {
          vscode.window.showWarningMessage(
            `Security Warning: ${message}`,
            'I understand'
          );
        }

        break;
      }
    }
  }

  /**
   * Monitor file system operations
   */
  public setupFileSystemMonitoring(): void {
    // Monitor file creation
    const watcher = vscode.workspace.createFileSystemWatcher('**/*');
    
    watcher.onDidCreate(uri => {
      const fileName = uri.fsPath;
      
      // Check if file might contain prompts
      if (this.isSuspiciousFileName(fileName)) {
        this.telemetryService.logEvent('suspicious_activity', {
          type: 'file_created',
          fileName,
          reason: 'Suspicious filename pattern',
        });
      }
    });

    watcher.onDidChange(uri => {
      const fileName = uri.fsPath;
      
      // Monitor changes to specific files
      if (fileName.includes('shadow-clone') || fileName.includes('prompt')) {
        this.telemetryService.logEvent('suspicious_activity', {
          type: 'file_modified',
          fileName,
        });
      }
    });
  }

  /**
   * Check if filename is suspicious
   */
  private isSuspiciousFileName(fileName: string): boolean {
    const suspiciousPatterns = [
      /shadow.*clone.*prompt/i,
      /extracted.*prompt/i,
      /api.*response.*shadow/i,
      /shadow.*clone.*dump/i,
      /prompt.*backup/i,
      /stolen.*prompt/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(fileName));
  }

  /**
   * Monitor clipboard operations
   */
  public monitorClipboardForPrompts(): void {
    // Check when text is copied in editor
    vscode.workspace.onDidChangeTextDocument(event => {
      if (event.contentChanges.length === 0) return;
      
      const document = event.document;
      const fileName = document.fileName;
      
      // Check if copying from a terminal output file
      if (fileName.includes('Terminal') || fileName.includes('Output')) {
        const content = document.getText();
        
        if (content.includes('shadow-clone') && content.length > 1000) {
          this.telemetryService.logEvent('suspicious_activity', {
            type: 'clipboard_copy',
            source: 'terminal_output',
            contentLength: content.length,
          });
        }
      }
    });
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    // Restore original methods if needed
  }
}