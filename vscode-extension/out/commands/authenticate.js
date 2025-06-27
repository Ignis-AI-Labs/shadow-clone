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
exports.authenticateCommand = authenticateCommand;
const vscode = __importStar(require("vscode"));
async function authenticateCommand(authProvider) {
    const apiKey = await vscode.window.showInputBox({
        prompt: 'Enter your Shadow Clone API key',
        password: true,
        placeHolder: 'sk-...',
        validateInput: (value) => {
            if (!value || value.length < 10) {
                return 'Please enter a valid API key';
            }
            return null;
        }
    });
    if (!apiKey) {
        return;
    }
    const authenticated = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Authenticating with Shadow Clone...',
        cancellable: false
    }, async () => {
        return await authProvider.authenticate(apiKey);
    });
    if (authenticated) {
        const licenseType = await authProvider.getLicenseType();
        const licenseDisplay = {
            'ignis_elite': '🔥 Ignis Elite (NFT)',
            'pioneer': '🚀 Pioneer',
            'builder': '🏗️ Builder',
            'reserve': '💎 Reserve'
        };
        const displayText = licenseType ? (licenseDisplay[licenseType] || licenseType) : 'Unknown';
        vscode.window.showInformationMessage(`Successfully authenticated! ${displayText} License Active`, 'View Status').then(action => {
            if (action === 'View Status') {
                vscode.commands.executeCommand('shadowClone.showStatus');
            }
        });
    }
    else {
        const retry = await vscode.window.showErrorMessage('Authentication failed. Please check your API key.', 'Try Again', 'Cancel');
        if (retry === 'Try Again') {
            vscode.commands.executeCommand('shadowClone.authenticate');
        }
    }
}
//# sourceMappingURL=authenticate.js.map