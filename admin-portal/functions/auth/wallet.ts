import { verifyMessage } from 'ethers';

interface Env {
  ADMIN_SESSIONS: KVNamespace;
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

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as any;
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
};