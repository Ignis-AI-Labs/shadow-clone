import { NextRequest, NextResponse } from 'next/server';
import { supabase, LicenseType } from '@/lib/supabase';
import { generateApiKey, hashApiKey } from '@/lib/apiKeys';

// Admin secret - must be set in environment
const ADMIN_SECRET = process.env.ADMIN_SECRET;

function validateAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !ADMIN_SECRET) return false;

  const token = authHeader.replace('Bearer ', '');
  return token === ADMIN_SECRET;
}

/**
 * GET /api/admin/keys - List all keys (admin only)
 */
export async function GET(request: NextRequest) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('shadow_clone_licenses')
    .select('id, license_type, wallet_address, is_active, created_at, expires_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ keys: data });
}

/**
 * POST /api/admin/keys - Create a new API key (admin only)
 *
 * Body: {
 *   licenseType: "ignisElite" | "pioneer" | "builder" | "reserve",
 *   walletAddress?: string,
 *   expiresAt?: string (ISO date)
 * }
 *
 * Returns the raw API key ONCE - we only store the hash
 */
export async function POST(request: NextRequest) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { licenseType, walletAddress, expiresAt } = body;

    // Validate license type
    const validTypes: LicenseType[] = ['ignisElite', 'pioneer', 'builder', 'reserve'];
    if (!validTypes.includes(licenseType)) {
      return NextResponse.json(
        { error: `Invalid license type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate the key
    const rawApiKey = generateApiKey();
    const hashedKey = hashApiKey(rawApiKey);

    // Store in database (hashed)
    const { data, error } = await supabase
      .from('shadow_clone_licenses')
      .insert({
        api_key: hashedKey, // Store HASH, not raw key
        license_type: licenseType,
        wallet_address: walletAddress || null,
        is_active: true,
        expires_at: expiresAt || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create key:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the raw key ONCE - user must save it
    return NextResponse.json({
      message: 'API key created. Save this key - it cannot be retrieved again.',
      apiKey: rawApiKey, // Raw key - only shown once!
      id: data.id,
      licenseType: data.license_type,
      expiresAt: data.expires_at,
    });

  } catch (error) {
    console.error('Key creation error:', error);
    return NextResponse.json({ error: 'Failed to create key' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/keys?id={keyId} - Revoke a key (admin only)
 */
export async function DELETE(request: NextRequest) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const keyId = request.nextUrl.searchParams.get('id');
  if (!keyId) {
    return NextResponse.json({ error: 'Key ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('shadow_clone_licenses')
    .update({ is_active: false })
    .eq('id', keyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Key revoked', id: keyId });
}
