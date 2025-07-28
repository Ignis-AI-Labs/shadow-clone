import { config } from '../config/production.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { logWarning } from './logger.js';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Simple in-memory rate limiter for MCP server
 * In production, consider using Redis for distributed rate limiting
 */
export class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timer;

  constructor(
    private windowMs: number = config.rateLimit.windowMs,
    private maxRequests: number = config.rateLimit.maxRequests
  ) {
    // Cleanup old entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if a client has exceeded rate limit
   */
  check(clientId: string): void {
    const now = Date.now();
    const entry = this.requests.get(clientId);

    if (!entry || now > entry.resetTime) {
      // New window
      this.requests.set(clientId, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return;
    }

    // Increment count
    entry.count++;

    if (entry.count > this.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      
      logWarning('Rate limit exceeded', {
        clientId,
        requests: entry.count,
        limit: this.maxRequests,
        retryAfter,
      });

      throw new McpError(
        ErrorCode.InvalidRequest,
        config.rateLimit.message,
        {
          retryAfter,
          limit: this.maxRequests,
          windowMs: this.windowMs,
        }
      );
    }
  }

  /**
   * Reset rate limit for a specific client
   */
  reset(clientId: string): void {
    this.requests.delete(clientId);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [clientId, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(clientId);
      }
    }
  }

  /**
   * Destroy the rate limiter and clean up resources
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.requests.clear();
  }

  /**
   * Get current stats for monitoring
   */
  getStats(): {
    activeClients: number;
    totalRequests: number;
    topClients: Array<{ clientId: string; count: number }>;
  } {
    const stats = {
      activeClients: this.requests.size,
      totalRequests: 0,
      topClients: [] as Array<{ clientId: string; count: number }>,
    };

    const clients: Array<{ clientId: string; count: number }> = [];
    
    for (const [clientId, entry] of this.requests.entries()) {
      stats.totalRequests += entry.count;
      clients.push({ clientId, count: entry.count });
    }

    // Get top 10 clients by request count
    stats.topClients = clients
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  }
}

// Global rate limiter instance
export const globalRateLimiter = new RateLimiter();

/**
 * Express-style middleware for rate limiting
 */
export function rateLimitMiddleware(
  getClientId: (request: any) => string = () => 'global'
) {
  return (request: any) => {
    const clientId = getClientId(request);
    globalRateLimiter.check(clientId);
  };
}