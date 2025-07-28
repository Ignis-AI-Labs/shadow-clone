import { config } from '../config/production.js';
import { globalRateLimiter } from './rateLimiter.js';
import { logInfo } from './logger.js';
import os from 'os';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  timestamp: string;
  environment: string;
  checks: {
    memory: HealthCheck;
    cpu: HealthCheck;
    rateLimit: HealthCheck;
    authentication: HealthCheck;
  };
}

interface HealthCheck {
  status: 'pass' | 'warn' | 'fail';
  message: string;
  metric?: number;
}

/**
 * Monitoring and health check utilities
 */
export class HealthMonitor {
  private startTime: number;
  private requestCount: number = 0;
  private errorCount: number = 0;
  private authCheckCallback?: () => Promise<boolean>;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Set authentication check callback
   */
  setAuthCheck(callback: () => Promise<boolean>): void {
    this.authCheckCallback = callback;
  }

  /**
   * Increment request counter
   */
  recordRequest(): void {
    this.requestCount++;
  }

  /**
   * Increment error counter
   */
  recordError(): void {
    this.errorCount++;
  }

  /**
   * Get current health status
   */
  async getHealth(): Promise<HealthStatus> {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const uptime = Date.now() - this.startTime;

    const health: HealthStatus = {
      status: 'healthy',
      version: config.server.version,
      uptime,
      timestamp: new Date().toISOString(),
      environment: config.server.environment,
      checks: {
        memory: this.checkMemory(memoryUsage),
        cpu: this.checkCPU(cpuUsage),
        rateLimit: this.checkRateLimit(),
        authentication: await this.checkAuthentication(),
      },
    };

    // Determine overall status
    const checks = Object.values(health.checks);
    if (checks.some(check => check.status === 'fail')) {
      health.status = 'unhealthy';
    } else if (checks.some(check => check.status === 'warn')) {
      health.status = 'degraded';
    }

    return health;
  }

  /**
   * Get metrics for monitoring
   */
  getMetrics(): Record<string, any> {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const rateLimitStats = globalRateLimiter.getStats();

    return {
      server: {
        version: config.server.version,
        environment: config.server.environment,
        uptime: Date.now() - this.startTime,
        pid: process.pid,
      },
      requests: {
        total: this.requestCount,
        errors: this.errorCount,
        errorRate: this.requestCount > 0 ? this.errorCount / this.requestCount : 0,
      },
      memory: {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        rss: memoryUsage.rss,
        external: memoryUsage.external,
        heapUsedPercent: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
        percent: this.calculateCPUPercent(cpuUsage),
      },
      rateLimit: rateLimitStats,
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        loadAverage: os.loadavg(),
      },
    };
  }

  /**
   * Log metrics periodically
   */
  startMetricsLogging(intervalMs: number = 60000): NodeJS.Timer {
    return setInterval(() => {
      if (config.performance.enableMetrics) {
        const metrics = this.getMetrics();
        logInfo('System metrics', { metrics });
      }
    }, intervalMs);
  }

  private checkMemory(usage: NodeJS.MemoryUsage): HealthCheck {
    const usedPercent = (usage.heapUsed / usage.heapTotal) * 100;
    const maxMemory = config.performance.maxMemoryUsage;

    if (usage.rss > maxMemory) {
      return {
        status: 'fail',
        message: `Memory usage (${Math.round(usage.rss / 1024 / 1024)}MB) exceeds limit (${Math.round(maxMemory / 1024 / 1024)}MB)`,
        metric: usage.rss,
      };
    }

    if (usedPercent > 90) {
      return {
        status: 'warn',
        message: `Heap usage at ${usedPercent.toFixed(1)}%`,
        metric: usedPercent,
      };
    }

    return {
      status: 'pass',
      message: `Memory usage normal (${usedPercent.toFixed(1)}% heap used)`,
      metric: usedPercent,
    };
  }

  private checkCPU(usage: NodeJS.CpuUsage): HealthCheck {
    const percent = this.calculateCPUPercent(usage);

    if (percent > 90) {
      return {
        status: 'fail',
        message: `CPU usage critical at ${percent.toFixed(1)}%`,
        metric: percent,
      };
    }

    if (percent > 70) {
      return {
        status: 'warn',
        message: `CPU usage high at ${percent.toFixed(1)}%`,
        metric: percent,
      };
    }

    return {
      status: 'pass',
      message: `CPU usage normal at ${percent.toFixed(1)}%`,
      metric: percent,
    };
  }

  private checkRateLimit(): HealthCheck {
    const stats = globalRateLimiter.getStats();
    const avgRequestsPerClient = stats.activeClients > 0 
      ? stats.totalRequests / stats.activeClients 
      : 0;

    if (avgRequestsPerClient > config.rateLimit.maxRequests * 0.9) {
      return {
        status: 'warn',
        message: `Rate limiting active for ${stats.activeClients} clients`,
        metric: avgRequestsPerClient,
      };
    }

    return {
      status: 'pass',
      message: `Rate limiting normal (${stats.activeClients} active clients)`,
      metric: stats.activeClients,
    };
  }

  private async checkAuthentication(): Promise<HealthCheck> {
    if (!this.authCheckCallback) {
      return {
        status: 'pass',
        message: 'Authentication service available',
      };
    }

    try {
      const isHealthy = await this.authCheckCallback();
      return {
        status: isHealthy ? 'pass' : 'warn',
        message: isHealthy ? 'Authentication service healthy' : 'Authentication service degraded',
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `Authentication service error: ${error}`,
      };
    }
  }

  private calculateCPUPercent(usage: NodeJS.CpuUsage): number {
    const total = usage.user + usage.system;
    const elapsedMs = Date.now() - this.startTime;
    const elapsedUs = elapsedMs * 1000;
    return (total / elapsedUs) * 100;
  }
}

// Global health monitor instance
export const healthMonitor = new HealthMonitor();