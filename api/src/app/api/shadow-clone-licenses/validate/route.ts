import { NextRequest, NextResponse } from 'next/server';
import { supabase, ValidationResponse } from '@/lib/supabase';

// CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  });
}

export async function POST(request: NextRequest): Promise<NextResponse<ValidationResponse>> {
  try {
    // Get API key from body or header
    const body = await request.json().catch(() => ({}));
    const headerKey = request.headers.get('X-API-Key');
    const apiKey = body.apiKey || headerKey;

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, message: 'API key required' },
        { status: 401 }
      );
    }

    // -----------------------------------------
    // DEV MODE: For testing without Supabase
    // -----------------------------------------
    if (process.env.DEV_MODE === 'true') {
      // Accept any key starting with 'sc-dev-' for testing
      if (apiKey.startsWith('sc-dev-')) {
        return NextResponse.json({
          valid: true,
          isActive: true,
          userId: 'dev-user-123',
          licenseType: 'ignisElite',
          walletAddress: '0xDEV000000000000000000000000000000000000',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }

      // Also accept the test key for CI/CD
      if (apiKey === 'sc-test-key-for-development') {
        return NextResponse.json({
          valid: true,
          isActive: true,
          userId: 'test-user',
          licenseType: 'pioneer',
          walletAddress: '0xTEST00000000000000000000000000000000000',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }

    // -----------------------------------------
    // PRODUCTION: Query Supabase
    // -----------------------------------------
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase not configured');
      return NextResponse.json(
        { valid: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { data: license, error } = await supabase
      .from('shadow_clone_licenses')
      .select('*')
      .eq('api_key', apiKey)
      .single();

    if (error || !license) {
      console.log('License lookup failed:', error?.message || 'Not found');
      return NextResponse.json(
        { valid: false, message: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Check expiration
    const isExpired = license.expires_at && new Date(license.expires_at) < new Date();
    const isActive = license.is_active && !isExpired;

    // TODO: Add NFT ownership verification here
    // This would call the blockchain to verify the wallet still owns the NFT
    // For now, we trust the database is_active flag

    return NextResponse.json({
      valid: true,
      isActive,
      userId: license.user_id,
      licenseType: license.license_type,
      walletAddress: license.wallet_address,
      expiresAt: license.expires_at,
      ...(!isActive && { message: 'License inactive or expired' }),
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
