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
exports.withAuth = withAuth;
exports.withAuthSync = withAuthSync;
const vscode = __importStar(require("vscode"));
/**
 * Creates an authentication guard wrapper for commands
 * Commands wrapped with this will require authentication before executing
 */
function withAuth(commandFn, authProvider, options) {
    return (async (...args) => {
        // Check if user is authenticated
        const hasAuth = await authProvider.checkAuth();
        if (!hasAuth) {
            // Show authentication prompt
            const message = options?.customMessage ||
                'Shadow Clone requires authentication to use this feature.';
            if (options?.showAuthPrompt !== false) {
                const choice = await vscode.window.showWarningMessage(message, 'Authenticate', 'Cancel');
                if (choice === 'Authenticate') {
                    await vscode.commands.executeCommand('shadowClone.authenticate');
                }
            }
            else {
                vscode.window.showWarningMessage(message);
            }
            return undefined;
        }
        // Check if subscription is active (if required)
        if (options?.requireActiveSubscription) {
            const isActive = await authProvider.isLicenseActive();
            if (!isActive) {
                const choice = await vscode.window.showWarningMessage('Your Shadow Clone license is inactive. Please update your subscription.', 'Update API Key', 'Contact Support');
                if (choice === 'Update API Key') {
                    await vscode.commands.executeCommand('shadowClone.updateCredentials');
                }
                else if (choice === 'Contact Support') {
                    await vscode.env.openExternal(vscode.Uri.parse('https://ignislabs.ai/support'));
                }
                return undefined;
            }
        }
        // Execute the original command
        return commandFn(...args);
    });
}
/**
 * Creates an async authentication guard for non-async commands
 */
function withAuthSync(commandFn, authProvider, options) {
    return async (...args) => {
        const wrappedAsync = withAuth(async (...innerArgs) => commandFn(...innerArgs), authProvider, options);
        return wrappedAsync(...args);
    };
}
//# sourceMappingURL=authGuard.js.map