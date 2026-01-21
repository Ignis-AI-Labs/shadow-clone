import { NextRequest, NextResponse } from 'next/server';
import { supabase, ValidationResponse } from '@/lib/supabase';
import { hashApiKey, isValidKeyFormat } from '@/lib/apiKeys';

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

    // Validate key format
    if (!isValidKeyFormat(apiKey)) {
      return NextResponse.json(
        { valid: false, message: 'Invalid API key format' },
        { status: 401 }
      );
    }

    // -----------------------------------------
    // Check Supabase configuration
    // -----------------------------------------
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase not configured');
      return NextResponse.json(
        { valid: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // Hash the key and look up in database
    // We store hashes, not raw keys
    // -----------------------------------------
    const hashedKey = hashApiKey(apiKey);

    const { data: license, error } = await supabase
      .from('shadow_clone_licenses')
      .select('*')
      .eq('api_key', hashedKey)
      .single();

    if (error || !license) {
      // Don't reveal whether key exists or not
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
