import { Env } from '../index';
import { SecurityMonitor } from '../utils/security-monitor';
import { corsHeaders } from '../utils/cors';

export interface SecurityContext {
  userId: string;
  apiKey: string;
  monitor: SecurityMonitor;
}

/**
 * Security middleware that checks for extraction attempts and rate limits
 */
export async function withSecurity(
  request: Request,
  env: Env,
  handler: (request: Request, env: Env, security: SecurityContext) => Promise<Response>
): Promise<Response> {
  const apiKey = request.headers.get('X-API-Key');
  
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Missing API key' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }

  // Look up user
  const userId = await env.API_KEYS.get(apiKey);
  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'Invalid API key' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }

  const monitor = new SecurityMonitor(env);
  
  // Check for extraction attempts (warning only)
  const extractionEvent = await monitor.checkForExtractionAttempts(request, userId, apiKey);
  if (extractionEvent) {
    // Log for admin review but don't block
    console.warn('SECURITY WARNING - Extraction attempt detected:', extractionEvent);
    
    // Add warning headers but allow request to proceed
    request.headers.set('X-Security-Warning', 'extraction-attempt-logged');
    request.headers.set('X-Security-Event-Id', extractionEvent.timestamp);
    
    // Continue processing with warning flag
  }
  
  // Check rate limits (warning only)
  const rateLimitCheck = await monitor.checkRateLimits(userId);
  if (rateLimitCheck.warning) {
    // Log for admin review but don't block
    console.warn(`SECURITY WARNING - Rate limit exceeded for user ${userId}:`, rateLimitCheck.limit);
    
    // Add warning headers but allow request
    request.headers.set('X-Security-Warning', 'rate-limit-exceeded');
    request.headers.set('X-RateLimit-Status', rateLimitCheck.limit || 'unknown');
    
    // Continue processing with warning flag
  }
  
  // Create security context
  const security: SecurityContext = {
    userId,
    apiKey,
    monitor,
  };
  
  // Call the handler with security context
  const response = await handler(request, env, security);
  
  // Add security headers to response if warnings were triggered
  if (request.headers.get('X-Security-Warning')) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Security-Warning', request.headers.get('X-Security-Warning') || '');
    newHeaders.set('X-Security-Mode', 'monitoring-only');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }
  
  return response;
}

/**
 * Track recent paths for enumeration detection
 */
const recentPathsCache = new Map<string, string[]>();

export async function trackPath(userId: string, path: string): Promise<string[]> {
  const userPaths = recentPathsCache.get(userId) || [];
  userPaths.push(path);
  
  // Keep only last 20 paths
  if (userPaths.length > 20) {
    userPaths.shift();
  }
  
  recentPathsCache.set(userId, userPaths);
  return userPaths;
}