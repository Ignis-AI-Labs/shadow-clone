import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'shadow-clone-api',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    environment: process.env.DEV_MODE === 'true' ? 'development' : 'production',
  });
}
