import { SecurityTelemetryService } from './securityTelemetry';

// Global instance that can be accessed by commands
let telemetryInstance: SecurityTelemetryService | undefined;

export function setTelemetryInstance(instance: SecurityTelemetryService): void {
    telemetryInstance = instance;
}

export function getTelemetryInstance(): SecurityTelemetryService | undefined {
    return telemetryInstance;
}

export function logCommandExecution(command: string, parameters?: any): void {
    if (telemetryInstance) {
        telemetryInstance.logEvent('command_executed', {
            command,
            parameters,
            source: 'vscode_command',
        });
    }
}