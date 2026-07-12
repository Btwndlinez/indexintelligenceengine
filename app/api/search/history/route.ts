import { NextRequest, NextResponse } from 'next/server';
import { resolveTenant } from '@/core/auth/tenant';
import { validate } from '@/core/api/validation';
import { logger } from '@/core/logger';
import { getSearchHistory } from '@/core/search/persistence';

export async function POST(req: NextRequest) {
  try {
    const tenant = await resolveTenant(req);
    if (tenant instanceof NextResponse) return tenant;

    const searches = await getSearchHistory(tenant.organizationId);

    return NextResponse.json({ success: true, searches });
  } catch (err) {
    logger.error('Search history route error', { route: 'search/history', error: String(err) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
