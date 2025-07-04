import { Env } from '../index';
import { verifyMessage } from 'ethers';
import { corsHeaders } from '../utils/cors';

// Admin wallet address (lowercase)
const ADMIN_WALLET = '0x4faa0fac32F844ACAF59b5B5a72C0D38de8bd0CD'.toLowerCase();

interface WalletAuthRequest {
  message: string;
  signature: string;
  wallet: string;
}

/**
 * Verify wallet signature
 */
function verifyWalletSignature(message: string, signature: string, expectedAddress: string): boolean {
  try {
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

/**
 * Generate admin session token
 */
async function generateAdminToken(wallet: string, env: Env): Promise<string> {
  const token = `admin-${wallet}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  const sessionData = {
    wallet,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    isAdmin: true
  };
  
  // Store session
  await env.USERS.put(`admin:session:${token}`, JSON.stringify(sessionData), {
    expirationTtl: 3600 // 1 hour
  });
  
  return token;
}

/**
 * Authenticate wallet and generate admin token
 */
export async function handleWalletAuth(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = await request.json() as WalletAuthRequest;
    const { message, signature, wallet } = body;
    
    // Verify wallet is admin
    if (wallet.toLowerCase() !== ADMIN_WALLET) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized wallet' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    // Verify signature
    if (!verifyWalletSignature(message, signature, wallet)) {
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    // Check message format and timestamp
    const messageMatch = message.match(/Shadow Clone Admin Access\nTimestamp: (\d+)\nWallet: (.+)/);
    if (!messageMatch) {
      return new Response(
        JSON.stringify({ error: 'Invalid message format' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    const timestamp = parseInt(messageMatch[1]);
    const messageWallet = messageMatch[2];
    
    // Verify timestamp is recent (within 5 minutes)
    if (Date.now() - timestamp > 300000) {
      return new Response(
        JSON.stringify({ error: 'Message expired' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    // Verify wallet matches
    if (messageWallet.toLowerCase() !== wallet.toLowerCase()) {
      return new Response(
        JSON.stringify({ error: 'Wallet mismatch' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    // Generate admin token
    const token = await generateAdminToken(wallet, env);
    
    return new Response(
      JSON.stringify({
        success: true,
        token,
        expiresIn: 3600 // 1 hour
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Wallet auth error:', error);
    return new Response(
      JSON.stringify({
        error: 'Authentication failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

/**
 * Verify admin token middleware
 */
export async function verifyAdminToken(token: string, env: Env): Promise<boolean> {
  if (!token) return false;
  
  const sessionData = await env.USERS.get(`admin:session:${token}`);
  if (!sessionData) return false;
  
  try {
    const session = JSON.parse(sessionData);
    
    // Check if expired
    if (new Date(session.expiresAt) < new Date()) {
      await env.USERS.delete(`admin:session:${token}`);
      return false;
    }
    
    // Verify is admin
    return session.isAdmin === true && session.wallet.toLowerCase() === ADMIN_WALLET;
  } catch {
    return false;
  }
}

/**
 * Enhanced admin authentication check that supports both API key and wallet token
 */
export async function isAdminAuthenticated(request: Request, env: Env): Promise<boolean> {
  // Check for wallet token first
  const walletToken = request.headers.get('X-Admin-Token');
  if (walletToken) {
    return await verifyAdminToken(walletToken, env);
  }
  
  // Fall back to API key check
  const apiKey = request.headers.get('X-API-Key');
  if (!apiKey) return false;
  
  const adminKeys = env.ADMIN_KEYS || env.API_KEYS;
  const userId = await adminKeys.get(apiKey);
  
  if (!userId) return false;
  
  const userData = await env.USERS.get(userId);
  if (!userData) return false;
  
  const user = JSON.parse(userData);
  return user.role === 'admin' || user.isAdmin === true;
}