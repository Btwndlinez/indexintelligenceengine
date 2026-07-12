import { NextResponse } from 'next/server';
import { VERTICAL_REGISTRY } from '@/core/search/registry';

export async function GET() {
  const verticals = Object.values(VERTICAL_REGISTRY).map(v => ({
    id: v.id,
    slug: v.slug,
    name: v.industryName,
  }));
  return NextResponse.json({ verticals });
}
