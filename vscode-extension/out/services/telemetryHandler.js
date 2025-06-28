"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTelemetryInstance = setTelemetryInstance;
exports.getTelemetryInstance = getTelemetryInstance;
exports.logCommandExecution = logCommandExecution;
// Global instance that can be accessed by commands
let telemetryInstance;
function setTelemetryInstance(instance) {
    telemetryInstance = instance;
}
function getTelemetryInstance() {
    return telemetryInstance;
}
function logCommandExecution(command, parameters) {
    if (telemetryInstance) {
        telemetryInstance.logEvent('command_executed', {
            command,
            parameters,
            source: 'vscode_command',
        });
    }
}
//# sourceMappingURL=telemetryHandler.js.map