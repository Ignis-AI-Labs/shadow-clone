"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketManager = void 0;
const events_1 = require("events");
const constants_1 = require("./constants");
const WebSocket = require("ws");
class WebSocketManager extends events_1.EventEmitter {
    constructor(authProvider) {
        super();
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectTimeout = null;
        this.authProvider = authProvider;
    }
    async connect(projectId) {
        const apiKey = await this.authProvider.getApiKey();
        if (!apiKey) {
            throw new Error('Not authenticated');
        }
        return new Promise((resolve, reject) => {
            try {
                // Create WebSocket with auth
                this.ws = new WebSocket(`${constants_1.SHADOW_CLONE_WS}/deploy/${projectId}`, {
                    headers: {
                        'X-API-Key': apiKey
                    }
                });
                this.ws.on('open', () => {
                    console.log('WebSocket connected');
                    this.reconnectAttempts = 0;
                    resolve();
                });
                this.ws.on('message', (data) => {
                    try {
                        const parsed = JSON.parse(data.toString());
                        this.emit(parsed.type, parsed.payload);
                    }
                    catch (error) {
                        console.error('Failed to parse WebSocket message:', error);
                    }
                });
                this.ws.on('error', (error) => {
                    console.error('WebSocket error:', error);
                    this.emit('error', error);
                });
                this.ws.on('close', (code, reason) => {
                    console.log('WebSocket closed:', code, reason);
                    this.emit('close', { code, reason });
                    // Attempt reconnection if not manual close
                    if (code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.attemptReconnect(projectId);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    attemptReconnect(projectId) {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
        this.reconnectTimeout = setTimeout(() => {
            this.connect(projectId).catch(error => {
                console.error('Reconnection failed:', error);
                this.emit('reconnect-failed', error);
            });
        }, delay);
    }
    send(type, payload) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, payload }));
        }
        else {
            throw new Error('WebSocket is not connected');
        }
    }
    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        if (this.ws) {
            this.ws.close(1000, 'Client disconnect');
            this.ws = null;
        }
    }
    isConnected() {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
}
exports.WebSocketManager = WebSocketManager;
//# sourceMappingURL=websocket.js.map