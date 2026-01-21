import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// In production, these come from environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// License types matching NFT collections
export type LicenseType =
  | 'ignisElite'    // 777 NFTs - Premium tier
  | 'pioneer'       // 500 NFTs - $79/month
  | 'builder'       // 500 NFTs - $99/month
  | 'reserve';      // 223 NFTs - $149/month

export interface License {
  id: string;
  api_key: string;
  user_id: string | null;
  wallet_address: string | null;
  license_type: LicenseType;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ValidationResponse {
  valid: boolean;
  isActive?: boolean;
  userId?: string;
  licenseType?: LicenseType;
  walletAddress?: string;
  expiresAt?: string;
  message?: string;
}
