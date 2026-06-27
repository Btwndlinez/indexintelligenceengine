import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    has_apollo: !!process.env.APOLLO_API_KEY,
    apollo_prefix: process.env.APOLLO_API_KEY ? process.env.APOLLO_API_KEY.substring(0, 8) + '...' : null,
    has_google: !!process.env.GOOGLE_PLACES_API_KEY,
    has_deepseek: !!process.env.DEEPSEEK_API_KEY,
  });
}
