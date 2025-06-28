import { Env } from '../index';
import { corsHeaders } from '../utils/cors';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

interface LicenseRequest {
  email: string;
  walletAddress?: string;
  licenseType: 'pioneer' | 'builder' | 'reserve' | 'ignis_elite';
  nftTokenId?: string;
  referralCode?: string;
}

interface License {
  id: string;
  apiKey: string;
  hashedApiKey: string;
  email: string;
  walletAddress?: string;
  licenseType: string;
  nftTokenId?: string;
  status: 'active' | 'suspended' | 'revoked';
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
  referralCode?: string;
  claimedAt?: string;
}

interface ApiKeyResponse {
  success: true;
  apiKey: string;
  licenseId: string;
  licenseType: string;
  message: string;
}

/**
 * Generate a new license and API key
 */
export async function handleGenerateLicense(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = await request.json() as LicenseRequest;
    const { email, walletAddress, licenseType, nftTokenId, referralCode } = body;

    // Validate required fields
    if (!email || !licenseType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, licenseType' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Check if email already has a license
    const existingLicense = await env.USERS.get(`license:email:${email}`);
    if (existingLicense) {
      return new Response(
        JSON.stringify({ 
          error: 'Email already has a license', 
          hint: 'Use the retrieve endpoint to get your existing API key' 
        }),
        {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // For Ignis Elite, verify NFT ownership (would integrate with blockchain)
    if (licenseType === 'ignis_elite') {
      if (!walletAddress || !nftTokenId) {
        return new Response(
          JSON.stringify({ error: 'Ignis Elite requires walletAddress and nftTokenId' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
      // TODO: Verify NFT ownership on-chain
      // For now, we'll accept any valid format
      if (!nftTokenId.match(/^\d+$/)) {
        return new Response(
          JSON.stringify({ error: 'Invalid NFT token ID' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
    }

    // Check license availability
    const licenseCount = await getLicenseCount(env, licenseType);
    const limits = {
      'ignis_elite': 777,
      'pioneer': 500,
      'builder': 500,
      'reserve': 223,
    };

    if (licenseCount >= limits[licenseType]) {
      return new Response(
        JSON.stringify({ 
          error: 'No licenses available', 
          message: `All ${limits[licenseType]} ${licenseType} licenses have been claimed` 
        }),
        {
          status: 410,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Generate API key
    const apiKey = generateApiKey(licenseType);
    const hashedApiKey = await bcrypt.hash(apiKey, 10);
    const licenseId = `lic_${nanoid(16)}`;
    const userId = `usr_${nanoid(16)}`;

    // Create license record
    const license: License = {
      id: licenseId,
      apiKey: '***', // Don't store plain API key
      hashedApiKey,
      email,
      walletAddress,
      licenseType,
      nftTokenId,
      status: 'active',
      createdAt: new Date().toISOString(),
      usageCount: 0,
      referralCode,
      claimedAt: new Date().toISOString(),
    };

    // Create user record
    const user = {
      id: userId,
      email,
      name: email.split('@')[0],
      licenseType,
      licenseId,
      walletAddress,
      createdAt: new Date().toISOString(),
    };

    // Store records
    await env.USERS.put(`license:${licenseId}`, JSON.stringify(license));
    await env.USERS.put(`license:email:${email}`, licenseId);
    await env.USERS.put(`user:${userId}`, JSON.stringify(user));
    await env.API_KEYS.put(apiKey, userId);
    
    // Store hashed API key for validation
    await env.API_KEYS.put(`hash:${apiKey.slice(0, 8)}`, JSON.stringify({
      hashedApiKey,
      userId,
      licenseId,
    }));

    // Update license count
    await incrementLicenseCount(env, licenseType);

    // Send welcome email (would integrate with email service)
    // await sendWelcomeEmail(email, apiKey, licenseType);

    const response: ApiKeyResponse = {
      success: true,
      apiKey,
      licenseId,
      licenseType,
      message: `Your ${licenseType} license has been activated! Save your API key securely.`,
    };

    return new Response(
      JSON.stringify(response),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('License generation error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate license',
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
 * Retrieve existing license by email
 */
export async function handleRetrieveLicense(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const { email } = await request.json() as { email: string };

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Get license ID by email
    const licenseId = await env.USERS.get(`license:email:${email}`);
    if (!licenseId) {
      return new Response(
        JSON.stringify({ error: 'No license found for this email' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Get license details
    const licenseData = await env.USERS.get(`license:${licenseId}`);
    if (!licenseData) {
      return new Response(
        JSON.stringify({ error: 'License data not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const license = JSON.parse(licenseData) as License;

    // Don't return the API key directly - send via email
    return new Response(
      JSON.stringify({
        success: true,
        message: 'API key has been sent to your email',
        licenseId: license.id,
        licenseType: license.licenseType,
        status: license.status,
        createdAt: license.createdAt,
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
    console.error('License retrieval error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to retrieve license',
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
 * Verify NFT ownership for Ignis Elite
 */
export async function handleVerifyNFT(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const { walletAddress, nftTokenId } = await request.json() as {
      walletAddress: string;
      nftTokenId: string;
    };

    if (!walletAddress || !nftTokenId) {
      return new Response(
        JSON.stringify({ error: 'walletAddress and nftTokenId required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // TODO: Integrate with blockchain to verify NFT ownership
    // For now, we'll do basic validation
    const isValid = walletAddress.match(/^0x[a-fA-F0-9]{40}$/) && 
                   nftTokenId.match(/^\d+$/) &&
                   parseInt(nftTokenId) >= 1 && 
                   parseInt(nftTokenId) <= 777;

    return new Response(
      JSON.stringify({
        success: true,
        verified: isValid,
        walletAddress,
        nftTokenId,
        message: isValid ? 'NFT ownership verified' : 'Invalid NFT or not an Ignis Elite holder',
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
    console.error('NFT verification error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to verify NFT',
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
 * Get license statistics
 */
export async function handleGetLicenseStats(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const stats = {
      ignis_elite: {
        total: 777,
        claimed: await getLicenseCount(env, 'ignis_elite'),
        available: 777 - await getLicenseCount(env, 'ignis_elite'),
        price: 'Free (NFT holders only)',
      },
      pioneer: {
        total: 500,
        claimed: await getLicenseCount(env, 'pioneer'),
        available: 500 - await getLicenseCount(env, 'pioneer'),
        price: '$79/month',
      },
      builder: {
        total: 500,
        claimed: await getLicenseCount(env, 'builder'),
        available: 500 - await getLicenseCount(env, 'builder'),
        price: '$99/month',
      },
      reserve: {
        total: 223,
        claimed: await getLicenseCount(env, 'reserve'),
        available: 223 - await getLicenseCount(env, 'reserve'),
        price: '$149/month',
      },
    };

    const totalLicenses = 2000;
    const totalClaimed = Object.values(stats).reduce((sum, tier) => sum + tier.claimed, 0);

    return new Response(
      JSON.stringify({
        success: true,
        stats,
        summary: {
          totalLicenses,
          totalClaimed,
          totalAvailable: totalLicenses - totalClaimed,
          percentageClaimed: ((totalClaimed / totalLicenses) * 100).toFixed(1) + '%',
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60', // Cache for 1 minute
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('License stats error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to get license stats',
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
 * Helper: Generate API key
 */
function generateApiKey(licenseType: string): string {
  const prefix = {
    'ignis_elite': 'sk_elite',
    'pioneer': 'sk_pioneer',
    'builder': 'sk_builder',
    'reserve': 'sk_reserve',
  }[licenseType] || 'sk';

  return `${prefix}_${nanoid(32)}`;
}

/**
 * Helper: Get license count for a tier
 */
async function getLicenseCount(env: Env, licenseType: string): Promise<number> {
  const count = await env.USERS.get(`license:count:${licenseType}`);
  return count ? parseInt(count) : 0;
}

/**
 * Helper: Increment license count
 */
async function incrementLicenseCount(env: Env, licenseType: string): Promise<void> {
  const current = await getLicenseCount(env, licenseType);
  await env.USERS.put(`license:count:${licenseType}`, (current + 1).toString());
}