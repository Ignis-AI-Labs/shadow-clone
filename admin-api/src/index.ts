import { verifyMessage } from 'ethers';

export interface Env {
  SECURITY_DATA: KVNamespace;
  ADMIN_SESSIONS: KVNamespace;
  CORS_ORIGIN?: string;
}

// Admin wallet address (lowercase)
const ADMIN_WALLET = '0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD'.toLowerCase();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
  'Access-Control-Max-Age': '86400',
};

// Helper to create JSON response
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Verify wallet signature
function verifyWalletSignature(message: string, signature: string, expectedAddress: string): boolean {
  try {
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

// Generate admin session token
async function generateAdminToken(wallet: string, env: Env): Promise<string> {
  const token = `admin-${wallet}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  const sessionData = {
    wallet,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    isAdmin: true
  };
  
  // Store session
  await env.ADMIN_SESSIONS.put(`session:${token}`, JSON.stringify(sessionData), {
    expirationTtl: 3600 // 1 hour
  });
  
  return token;
}

// Verify admin token
async function verifyAdminToken(token: string, env: Env): Promise<boolean> {
  if (!token) return false;
  
  const sessionData = await env.ADMIN_SESSIONS.get(`session:${token}`);
  if (!sessionData) return false;
  
  try {
    const session = JSON.parse(sessionData);
    
    // Check if expired
    if (new Date(session.expiresAt) < new Date()) {
      await env.ADMIN_SESSIONS.delete(`session:${token}`);
      return false;
    }
    
    // Verify is admin
    return session.isAdmin === true && session.wallet.toLowerCase() === ADMIN_WALLET;
  } catch {
    return false;
  }
}

// Auth middleware
async function requireAuth(request: Request, env: Env): Promise<boolean> {
  const token = request.headers.get('X-Admin-Token');
  if (!token) return false;
  return await verifyAdminToken(token, env);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Public endpoints
      if (path === '/auth/wallet' && request.method === 'POST') {
        const body = await request.json() as any;
        const { message, signature, wallet } = body;
        
        // Verify wallet is admin
        if (wallet.toLowerCase() !== ADMIN_WALLET) {
          return jsonResponse({ error: 'Unauthorized wallet' }, 401);
        }
        
        // Verify signature
        if (!verifyWalletSignature(message, signature, wallet)) {
          return jsonResponse({ error: 'Invalid signature' }, 401);
        }
        
        // Check message format and timestamp
        const messageMatch = message.match(/Shadow Clone Admin Access\nTimestamp: (\d+)\nWallet: (.+)/);
        if (!messageMatch) {
          return jsonResponse({ error: 'Invalid message format' }, 400);
        }
        
        const timestamp = parseInt(messageMatch[1]);
        const messageWallet = messageMatch[2];
        
        // Verify timestamp is recent (within 5 minutes)
        if (Date.now() - timestamp > 300000) {
          return jsonResponse({ error: 'Message expired' }, 401);
        }
        
        // Verify wallet matches
        if (messageWallet.toLowerCase() !== wallet.toLowerCase()) {
          return jsonResponse({ error: 'Wallet mismatch' }, 400);
        }
        
        // Generate admin token
        const token = await generateAdminToken(wallet, env);
        
        return jsonResponse({
          success: true,
          token,
          expiresIn: 3600 // 1 hour
        });
      }

      // Protected endpoints - require auth
      if (!await requireAuth(request, env)) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      // Security analytics endpoint
      if (path === '/security/analytics' && request.method === 'GET') {
        // Get all security events from storage
        const { keys } = await env.SECURITY_DATA.list({ prefix: 'event:' });
        const events = [];
        
        for (const key of keys.slice(0, 100)) { // Limit to 100 most recent
          const eventData = await env.SECURITY_DATA.get(key.name);
          if (eventData) {
            events.push(JSON.parse(eventData));
          }
        }
        
        // Sort by timestamp
        events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        // Get user profiles
        const { keys: userKeys } = await env.SECURITY_DATA.list({ prefix: 'user:' });
        const suspiciousUsers = [];
        const blockedUsers = [];
        const topOffenders = [];
        
        for (const key of userKeys) {
          const userData = await env.SECURITY_DATA.get(key.name);
          if (userData) {
            const user = JSON.parse(userData);
            if (user.suspicionScore > 50) {
              suspiciousUsers.push(user.userId);
            }
            if (user.isBlocked) {
              blockedUsers.push(user.userId);
            }
            if (user.extractionAttempts > 0) {
              topOffenders.push({
                userId: user.userId,
                attempts: user.extractionAttempts
              });
            }
          }
        }
        
        // Sort top offenders
        topOffenders.sort((a, b) => b.attempts - a.attempts);
        
        // Calculate stats
        const stats = {
          totalUsers: userKeys.length,
          suspiciousUsers: suspiciousUsers.length,
          blockedUsers: blockedUsers.length,
          extractionAttempts: topOffenders.reduce((sum, u) => sum + u.attempts, 0),
          last24HourEvents: events.filter(e => {
            const eventTime = new Date(e.timestamp);
            const dayAgo = new Date(Date.now() - 86400000);
            return eventTime > dayAgo;
          }).length
        };
        
        return jsonResponse({
          success: true,
          analytics: {
            stats,
            recentEvents: events.slice(0, 50),
            topOffenders: topOffenders.slice(0, 10),
            suspiciousUsers,
            blockedUsers
          },
          timestamp: new Date().toISOString()
        });
      }

      // Record security event endpoint
      if (path === '/security/event' && request.method === 'POST') {
        const event = await request.json() as any;
        const eventId = `event:${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        // Store event
        await env.SECURITY_DATA.put(eventId, JSON.stringify({
          ...event,
          timestamp: event.timestamp || new Date().toISOString()
        }), {
          expirationTtl: 2592000 // 30 days
        });
        
        // Update user profile
        const userId = event.userId;
        const userKey = `user:${userId}`;
        const existingData = await env.SECURITY_DATA.get(userKey);
        
        let userProfile = existingData ? JSON.parse(existingData) : {
          userId,
          suspicionScore: 0,
          extractionAttempts: 0,
          isBlocked: false
        };
        
        // Update based on event type
        if (event.eventType === 'extraction_attempt') {
          userProfile.extractionAttempts++;
          userProfile.suspicionScore += 15;
        } else if (event.eventType === 'rate_limit') {
          userProfile.suspicionScore += 5;
        } else if (event.eventType === 'enumeration') {
          userProfile.suspicionScore += 10;
        }
        
        await env.SECURITY_DATA.put(userKey, JSON.stringify(userProfile));
        
        return jsonResponse({ success: true, eventId });
      }

      // Unblock user endpoint
      if (path === '/security/unblock' && request.method === 'POST') {
        const { userId } = await request.json() as any;
        const userKey = `user:${userId}`;
        
        const userData = await env.SECURITY_DATA.get(userKey);
        if (userData) {
          const userProfile = JSON.parse(userData);
          userProfile.isBlocked = false;
          userProfile.suspicionScore = Math.max(0, userProfile.suspicionScore - 20);
          await env.SECURITY_DATA.put(userKey, JSON.stringify(userProfile));
        }
        
        return jsonResponse({ success: true });
      }

      // Clear user events endpoint
      if (path === '/security/clear-events' && request.method === 'POST') {
        const { userId } = await request.json() as any;
        
        // Reset user profile
        const userKey = `user:${userId}`;
        await env.SECURITY_DATA.put(userKey, JSON.stringify({
          userId,
          suspicionScore: 0,
          extractionAttempts: 0,
          isBlocked: false
        }));
        
        // Delete user events
        const { keys } = await env.SECURITY_DATA.list({ prefix: 'event:' });
        for (const key of keys) {
          const eventData = await env.SECURITY_DATA.get(key.name);
          if (eventData) {
            const event = JSON.parse(eventData);
            if (event.userId === userId) {
              await env.SECURITY_DATA.delete(key.name);
            }
          }
        }
        
        return jsonResponse({ success: true });
      }

      return jsonResponse({ error: 'Not found' }, 404);
    } catch (error) {
      console.error('API error:', error);
      return jsonResponse({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
    }
  }
};