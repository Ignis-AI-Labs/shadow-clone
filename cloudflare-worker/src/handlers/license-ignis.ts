import { Env } from '../index';
import { corsHeaders } from '../utils/cors';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { NFTVerifier, getPhaseDisplayName, getLicenseTypeFromPhase } from '../utils/nft-verification';

interface ClaimIgnisLicenseRequest {
  walletAddress: string;
  email: string;
  rpcUrl?: string; // Optional custom RPC URL
}

/**
 * API endpoint for Ignis Elite NFT holders to claim their license
 * Automatically detects which phase NFTs they own
 */
export async function handleClaimIgnisLicense(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = await request.json() as ClaimIgnisLicenseRequest;
    const { walletAddress, email, rpcUrl } = body;

    // Validate required fields
    if (!walletAddress || !email) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing required fields',
          required: ['walletAddress', 'email'] 
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

    // Check if wallet already claimed
    const existingWalletClaim = await env.USERS.get(`license:wallet:${walletAddress.toLowerCase()}`);
    if (existingWalletClaim) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'This wallet has already claimed a license',
          existingLicense: JSON.parse(existingWalletClaim)
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

    // Verify NFT ownership on-chain
    const verifier = new NFTVerifier(rpcUrl || env.ETHEREUM_RPC_URL || undefined);
    const ownerships = await verifier.verifyIgnisEliteOwnership(walletAddress);

    if (ownerships.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No Ignis Elite NFTs found in this wallet',
          message: 'Please ensure you own an Ignis Elite Phase 1, 2, or 3 NFT'
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Use the first NFT found (user owns at least one)
    const primaryOwnership = ownerships[0];
    const licenseType = getLicenseTypeFromPhase(primaryOwnership.phase);
    
    // Generate API key and create license
    const apiKey = `sk_${licenseType}_${nanoid(32)}`;
    const hashedApiKey = await bcrypt.hash(apiKey, 10);
    const licenseId = `lic_${nanoid(16)}`;
    const userId = `usr_${nanoid(16)}`;

    // Create license record
    const license = {
      id: licenseId,
      email,
      walletAddress: walletAddress.toLowerCase(),
      licenseType,
      nftPhase: primaryOwnership.phase,
      nftContract: primaryOwnership.contract,
      nftTokenId: primaryOwnership.tokenId,
      nftBalance: primaryOwnership.balance,
      allOwnerships: ownerships, // Store all NFTs they own
      status: 'active',
      createdAt: new Date().toISOString(),
      claimedAt: new Date().toISOString(),
      hashedApiKey,
    };

    // Create user record
    const user = {
      id: userId,
      email,
      walletAddress: walletAddress.toLowerCase(),
      licenseType,
      licenseId,
      nftOwnerships: ownerships,
      createdAt: new Date().toISOString(),
    };

    // Store all records
    await env.USERS.put(`license:${licenseId}`, JSON.stringify(license));
    await env.USERS.put(`license:wallet:${walletAddress.toLowerCase()}`, JSON.stringify({ licenseId, email }));
    await env.USERS.put(`license:email:${email}`, licenseId);
    await env.USERS.put(`user:${userId}`, JSON.stringify(user));
    await env.API_KEYS.put(apiKey, userId);

    // Store NFT-specific claims to prevent duplicate claims per contract
    for (const ownership of ownerships) {
      await env.USERS.put(
        `license:nft:${ownership.contract}:${ownership.tokenId}`, 
        JSON.stringify({ licenseId, email, walletAddress, balance: ownership.balance })
      );
    }

    // Update license count
    const currentCount = await env.USERS.get(`license:count:${licenseType}`);
    await env.USERS.put(`license:count:${licenseType}`, (parseInt(currentCount || '0') + 1).toString());

    // Build response message
    const ownedPhases = ownerships.map(o => getPhaseDisplayName(o.phase)).join(', ');
    const totalNFTs = ownerships.reduce((sum, o) => sum + o.balance, 0);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          apiKey,
          licenseId,
          email,
          walletAddress,
          licenseType,
          phase: primaryOwnership.phase,
          nftContract: primaryOwnership.contract,
          tokenId: primaryOwnership.tokenId,
          balance: primaryOwnership.balance,
          message: `Congratulations! Your ${getPhaseDisplayName(primaryOwnership.phase)} license has been activated.`,
          details: {
            ownedCollections: ownedPhases,
            totalNFTsOwned: totalNFTs,
            allOwnerships: ownerships
          }
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
    console.error('Ignis license claim error:', error);
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
 * Check Ignis NFT ownership status
 */
export async function handleCheckIgnisOwnership(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('wallet');
    const rpcUrl = url.searchParams.get('rpcUrl');

    if (!walletAddress) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Wallet address required' 
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

    // Check if wallet already claimed
    const existingClaim = await env.USERS.get(`license:wallet:${walletAddress.toLowerCase()}`);
    
    // Verify current NFT ownership
    const verifier = new NFTVerifier(rpcUrl || env.ETHEREUM_RPC_URL || undefined);
    const ownerships = await verifier.verifyIgnisEliteOwnership(walletAddress);
    
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          walletAddress,
          hasClaimedLicense: !!existingClaim,
          existingClaim: existingClaim ? JSON.parse(existingClaim) : null,
          currentOwnerships: ownerships,
          eligibleForClaim: ownerships.length > 0 && !existingClaim
        }
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
    console.error('Ignis ownership check error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to check ownership',
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