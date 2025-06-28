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
  
  // Check for extraction attempts
  const extractionEvent = await monitor.checkForExtractionAttempts(request, userId, apiKey);
  if (extractionEvent) {
    // Log but don't immediately block - let them accumulate suspicion score
    console.warn('Extraction attempt detected:', extractionEvent);
    
    // Return a subtle warning in headers
    return new Response(
      JSON.stringify({ 
        error: 'Invalid request format',
        warning: 'This request has been flagged for review'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'X-Security-Warning': 'suspicious-activity-detected',
          ...corsHeaders,
        },
      }
    );
  }
  
  // Check rate limits
  const rateLimitCheck = await monitor.checkRateLimits(userId);
  if (!rateLimitCheck.allowed) {
    const retryAfter = rateLimitCheck.limit === 'minute' ? 60 
                    : rateLimitCheck.limit === 'hour' ? 3600 
                    : rateLimitCheck.limit === 'day' ? 86400 
                    : 86400; // blocked
    
    return new Response(
      JSON.stringify({ 
        error: 'Rate limit exceeded',
        limit: rateLimitCheck.limit,
        retryAfter 
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': rateLimitCheck.limit || 'unknown',
          ...corsHeaders,
        },
      }
    );
  }
  
  // Create security context
  const security: SecurityContext = {
    userId,
    apiKey,
    monitor,
  };
  
  // Call the handler with security context
  return handler(request, env, security);
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