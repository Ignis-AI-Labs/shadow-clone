import { EventEmitter } from 'events';
import { AuthProvider } from '../auth/authProvider';
import { SHADOW_CLONE_WS } from './constants';
import WebSocket = require('ws');

export class WebSocketManager extends EventEmitter {
    private ws: WebSocket | null = null;
    private authProvider: AuthProvider;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout: NodeJS.Timeout | null = null;

    constructor(authProvider: AuthProvider) {
        super();
        this.authProvider = authProvider;
    }

    async connect(projectId: string): Promise<void> {
        const apiKey = await this.authProvider.getApiKey();
        if (!apiKey) {
            throw new Error('Not authenticated');
        }

        return new Promise((resolve, reject) => {
            try {
                // Create WebSocket with auth
                this.ws = new WebSocket(`${SHADOW_CLONE_WS}/deploy/${projectId}`, {
                    headers: {
                        'X-API-Key': apiKey
                    }
                });

                this.ws.on('open', () => {
                    console.log('WebSocket connected');
                    this.reconnectAttempts = 0;
                    resolve();
                });

                this.ws.on('message', (data: WebSocket.Data) => {
                    try {
                        const parsed = JSON.parse(data.toString());
                        this.emit(parsed.type, parsed.payload);
                    } catch (error) {
                        console.error('Failed to parse WebSocket message:', error);
                    }
                });

                this.ws.on('error', (error: Error) => {
                    console.error('WebSocket error:', error);
                    this.emit('error', error);
                });

                this.ws.on('close', (code: number, reason: string) => {
                    console.log('WebSocket closed:', code, reason);
                    this.emit('close', { code, reason });
                    
                    // Attempt reconnection if not manual close
                    if (code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                        this.attemptReconnect(projectId);
                    }
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    private attemptReconnect(projectId: string) {
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

    send(type: string, payload: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, payload }));
        } else {
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

    isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
}