import { Env } from '../index';
import { corsHeaders } from '../utils/cors';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

interface ClaimLicenseRequest {
  walletAddress: string;
  nftTokenId: string;
  nftCollection: 'ignis_elite' | 'phase_1' | 'phase_2' | 'phase_3';
  email: string;
  signature?: string; // For wallet signature verification
}

interface GenerateLicenseRequest {
  email: string;
  licenseType: 'pioneer' | 'builder' | 'reserve';
  paymentId?: string; // Stripe payment ID or similar
  referralCode?: string;
}

/**
 * API endpoint for Ignis NFT holders (Ignis Elite, Phase 1, 2, 3) to claim their license
 * This will be called from your Ignis Labs dashboard
 */
export async function handleClaimIgnisNFTLicense(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = await request.json() as ClaimLicenseRequest;
    const { walletAddress, nftTokenId, nftCollection, email, signature } = body;

    // Validate required fields
    if (!walletAddress || !nftTokenId || !nftCollection || !email) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing required fields',
          required: ['walletAddress', 'nftTokenId', 'nftCollection', 'email'] 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Validate wallet address format
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid wallet address format' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Validate NFT collection and token ID
    const tokenId = parseInt(nftTokenId);
    if (isNaN(tokenId) || tokenId < 1 || tokenId > 777) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid NFT token ID. Must be between 1-777' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // TODO: Verify signature if provided (proves wallet ownership)
    // if (signature) {
    //   const isValidSignature = await verifyWalletSignature(walletAddress, signature);
    //   if (!isValidSignature) {
    //     return new Response(
    //       JSON.stringify({ success: false, error: 'Invalid signature' }),
    //       { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    //     );
    //   }
    // }

    // Check if this NFT has already claimed a license
    const existingClaim = await env.USERS.get(`license:nft:${nftTokenId}`);
    if (existingClaim) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'This NFT has already claimed a license',
          claimedBy: JSON.parse(existingClaim).email 
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

    // Check if email already has a license
    const existingEmailLicense = await env.USERS.get(`license:email:${email}`);
    if (existingEmailLicense) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'This email already has a license' 
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

    // Generate API key and create license
    const apiKey = `sk_elite_${nanoid(32)}`;
    const hashedApiKey = await bcrypt.hash(apiKey, 10);
    const licenseId = `lic_${nanoid(16)}`;
    const userId = `usr_${nanoid(16)}`;

    // Create license record
    const license = {
      id: licenseId,
      email,
      walletAddress,
      licenseType: 'ignis_elite',
      nftTokenId: tokenId,
      status: 'active',
      createdAt: new Date().toISOString(),
      claimedAt: new Date().toISOString(),
      hashedApiKey,
    };

    // Create user record
    const user = {
      id: userId,
      email,
      walletAddress,
      licenseType: 'ignis_elite',
      licenseId,
      nftTokenId: tokenId,
      createdAt: new Date().toISOString(),
    };

    // Store all records
    await env.USERS.put(`license:${licenseId}`, JSON.stringify(license));
    await env.USERS.put(`license:nft:${tokenId}`, JSON.stringify({ licenseId, email, walletAddress }));
    await env.USERS.put(`license:email:${email}`, licenseId);
    await env.USERS.put(`user:${userId}`, JSON.stringify(user));
    await env.API_KEYS.put(apiKey, userId);

    // Update license count
    const currentCount = await env.USERS.get('license:count:ignis_elite');
    await env.USERS.put('license:count:ignis_elite', (parseInt(currentCount || '0') + 1).toString());

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          apiKey,
          licenseId,
          email,
          walletAddress,
          nftTokenId: tokenId,
          licenseType: 'ignis_elite',
          message: 'Congratulations! Your Ingis Elite license has been activated.',
        }
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Ignis NFT claim error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to claim license',
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
 * API endpoint for paid license tiers (Pioneer, Builder, Reserve)
 * This will be called after payment confirmation
 */
export async function handleGeneratePaidLicense(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = await request.json() as GenerateLicenseRequest;
    const { email, licenseType, paymentId, referralCode } = body;

    // Validate required fields
    if (!email || !licenseType) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing required fields',
          required: ['email', 'licenseType'] 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Validate license type
    if (!['pioneer', 'builder', 'reserve'].includes(licenseType)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid license type. Must be pioneer, builder, or reserve' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // TODO: Verify payment with Stripe or payment processor
    // if (paymentId) {
    //   const paymentValid = await verifyPayment(paymentId, licenseType);
    //   if (!paymentValid) {
    //     return new Response(
    //       JSON.stringify({ success: false, error: 'Invalid or incomplete payment' }),
    //       { status: 402, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    //     );
    //   }
    // }

    // Check license availability
    const limits = {
      'pioneer': 500,
      'builder': 500,
      'reserve': 223,
    };

    const currentCount = await env.USERS.get(`license:count:${licenseType}`);
    const count = parseInt(currentCount || '0');
    
    if (count >= limits[licenseType]) {
      return new Response(
        JSON.stringify({ 
          success: false,
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

    // Check if email already has a license
    const existingLicense = await env.USERS.get(`license:email:${email}`);
    if (existingLicense) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'This email already has a license' 
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

    // Generate API key and create license
    const apiKey = `sk_${licenseType}_${nanoid(32)}`;
    const hashedApiKey = await bcrypt.hash(apiKey, 10);
    const licenseId = `lic_${nanoid(16)}`;
    const userId = `usr_${nanoid(16)}`;

    // Create license record
    const license = {
      id: licenseId,
      email,
      licenseType,
      status: 'active',
      createdAt: new Date().toISOString(),
      paymentId,
      referralCode,
      hashedApiKey,
      monthlyPrice: licenseType === 'pioneer' ? 79 : licenseType === 'builder' ? 99 : 149,
    };

    // Create user record
    const user = {
      id: userId,
      email,
      licenseType,
      licenseId,
      createdAt: new Date().toISOString(),
      referralCode,
    };

    // Store all records
    await env.USERS.put(`license:${licenseId}`, JSON.stringify(license));
    await env.USERS.put(`license:email:${email}`, licenseId);
    await env.USERS.put(`user:${userId}`, JSON.stringify(user));
    await env.API_KEYS.put(apiKey, userId);

    // Update license count
    await env.USERS.put(`license:count:${licenseType}`, (count + 1).toString());

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          apiKey,
          licenseId,
          email,
          licenseType,
          monthlyPrice: license.monthlyPrice,
          message: `Your ${licenseType} license has been activated!`,
        }
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Paid license generation error:', error);
    return new Response(
      JSON.stringify({
        success: false,
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
 * Check if an NFT has already claimed a license
 */
export async function handleCheckNFTClaim(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const nftTokenId = url.searchParams.get('tokenId');

    if (!nftTokenId) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'NFT token ID required' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const claim = await env.USERS.get(`license:nft:${nftTokenId}`);
    
    return new Response(
      JSON.stringify({
        success: true,
        claimed: !!claim,
        data: claim ? JSON.parse(claim) : null,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=30', // Cache for 30 seconds
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('NFT claim check error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to check NFT claim',
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
 * Get current license availability stats
 */
export async function handleGetLicenseAvailability(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const getCount = async (type: string) => {
      const count = await env.USERS.get(`license:count:${type}`);
      return parseInt(count || '0');
    };

    const availability = {
      ignis_elite: {
        total: 777,
        claimed: await getCount('ignis_elite'),
        available: 777 - await getCount('ignis_elite'),
        price: 0,
        monthly: 0,
        benefits: ['Lifetime access', 'All features', 'Priority support', 'Early access'],
      },
      pioneer: {
        total: 500,
        claimed: await getCount('pioneer'),
        available: 500 - await getCount('pioneer'),
        price: 79,
        monthly: 79,
        benefits: ['Full access', 'Community support', 'Regular updates'],
      },
      builder: {
        total: 500,
        claimed: await getCount('builder'),
        available: 500 - await getCount('builder'),
        price: 99,
        monthly: 99,
        benefits: ['Full access', 'Priority support', 'Partner benefits'],
      },
      reserve: {
        total: 223,
        claimed: await getCount('reserve'),
        available: 223 - await getCount('reserve'),
        price: 149,
        monthly: 149,
        benefits: ['Full access', 'Premium support', 'Advanced features', 'Custom integrations'],
      },
    };

    const totalClaimed = Object.values(availability).reduce((sum, tier) => sum + tier.claimed, 0);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          tiers: availability,
          summary: {
            totalLicenses: 2000,
            totalClaimed,
            totalAvailable: 2000 - totalClaimed,
            percentageClaimed: ((totalClaimed / 2000) * 100).toFixed(1),
          },
          timestamp: new Date().toISOString(),
        }
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
    console.error('License availability error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to get license availability',
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