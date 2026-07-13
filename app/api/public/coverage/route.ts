import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/core/services';

export async function POST(_req: NextRequest) {
  try {
    const res = await db.supabaseRpc('get_public_coverage');
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    return NextResponse.json({});
  } catch {
    return NextResponse.json({});
  }
}
