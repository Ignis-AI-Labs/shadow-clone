import { randomUUID } from 'crypto';
import axios from 'axios';
import { config } from '../config/production.js';
import { logDebug } from './logger.js';

// Axiom ingest constants (not user-configurable)
const AXIOM_ENDPOINT = 'https://api.axiom.co';
const AXIOM_DATASET = 'shadow-clone';
const AXIOM_TOKEN = 'xaat-8c334ac3-e15b-43ec-a9e6-554d6baf3149';
const FLUSH_INTERVAL_MS = 30000;
const MAX_BUFFER_SIZE = 50;
const REQUEST_TIMEOUT_MS = 5000;
const MAX_RETRIES = 2;

type TelemetryEventType =
  | 'server.start'
  | 'server.stop'
  | 'tool.invoke'
  | 'tool.error'
  | 'system.metrics'
  | 'server.error';

interface TelemetryEvent {
  type: TelemetryEventType;
  timestamp: string;
  sessionId: string;
  serverVersion: string;
  nodeVersion: string;
  data: Record<string, unknown>;
}

class TelemetryClient {
  private buffer: TelemetryEvent[] = [];
  private sessionId: string;
  private flushTimer: NodeJS.Timeout | null = null;
  private enabled: boolean;
  private startTime: number;
  private lastCpuUsage: NodeJS.CpuUsage;

  constructor() {
    this.sessionId = randomUUID();
    this.startTime = Date.now();
    this.lastCpuUsage = process.cpuUsage();

    // Auto-disable if token is empty
    this.enabled = config.telemetry.enabled
      && AXIOM_TOKEN.length > 0;

    if (this.enabled) {
      this.flushTimer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);
    }
  }

  trackServerStart(): void {
    this.enqueue({
      type: 'server.start',
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      serverVersion: config.server.version,
      nodeVersion: process.version,
      data: {
        platform: process.platform,
        arch: process.arch,
      },
    });
  }

  trackServerStop(uptimeMs: number): void {
    this.enqueue({
      type: 'server.stop',
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      serverVersion: config.server.version,
      nodeVersion: process.version,
      data: {
        uptimeMs,
        graceful: true,
      },
    });
    this.flush();
  }

  trackToolInvocation(toolName: string, durationMs: number, success: boolean): void {
    this.enqueue({
      type: 'tool.invoke',
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      serverVersion: config.server.version,
      nodeVersion: process.version,
      data: {
        toolName,
        durationMs,
        success,
      },
    });
  }

  trackError(errorType: string, context: string, toolName?: string): void {
    const type: TelemetryEventType = context === 'tool_execution' ? 'tool.error' : 'server.error';
    this.enqueue({
      type,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      serverVersion: config.server.version,
      nodeVersion: process.version,
      data: {
        errorType,
        context,
        ...(toolName && { toolName }),
      },
    });
  }

  trackSystemMetrics(): void {
    const mem = process.memoryUsage();
    const currentCpuUsage = process.cpuUsage();

    // Calculate CPU % as delta from last measurement
    const userDelta = currentCpuUsage.user - this.lastCpuUsage.user;
    const systemDelta = currentCpuUsage.system - this.lastCpuUsage.system;
    const elapsedMs = Date.now() - this.startTime;
    const elapsedUs = elapsedMs * 1000;
    const cpuPercent = elapsedUs > 0 ? ((userDelta + systemDelta) / elapsedUs) * 100 : 0;

    this.lastCpuUsage = currentCpuUsage;

    this.enqueue({
      type: 'system.metrics',
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      serverVersion: config.server.version,
      nodeVersion: process.version,
      data: {
        heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024 * 100) / 100,
        heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024 * 100) / 100,
        rssMB: Math.round(mem.rss / 1024 / 1024 * 100) / 100,
        cpuPercent: Math.round(cpuPercent * 100) / 100,
        uptimeMs: elapsedMs,
      },
    });
  }

  flush(): void {
    if (this.buffer.length === 0) return;

    // Swap buffer
    const batch = this.buffer;
    this.buffer = [];

    this.sendBatch(batch);
  }

  async shutdown(): Promise<void> {
    this.flush();
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.enabled = false;
  }

  private enqueue(event: TelemetryEvent): void {
    if (!this.enabled) return;

    this.buffer.push(event);

    if (this.buffer.length >= MAX_BUFFER_SIZE) {
      this.flush();
    }
  }

  private async sendBatch(events: TelemetryEvent[], retries: number = 0): Promise<void> {
    try {
      await axios.post(
        `${AXIOM_ENDPOINT}/v1/datasets/${AXIOM_DATASET}/ingest`,
        events,
        {
          headers: {
            'Authorization': `Bearer ${AXIOM_TOKEN}`,
            'Content-Type': 'application/json',
          },
          timeout: REQUEST_TIMEOUT_MS,
        }
      );
    } catch (error) {
      if (retries < MAX_RETRIES && axios.isAxiosError(error) && !error.response) {
        // Retry on network errors only (not 4xx/5xx)
        return this.sendBatch(events, retries + 1);
      }
      logDebug('Telemetry flush failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        eventsDropped: events.length,
      });
    }
  }
}

export const telemetry = new TelemetryClient();
