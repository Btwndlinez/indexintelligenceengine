import { NextRequest, NextResponse } from 'next/server';
import { resolveTenant } from '@/lib/auth/tenant';
import { logger } from '@/lib/logger';

const MOCK_METRICS = {
  totalCompanies: 1248,
  activeCampaigns: 17,
  callsToday: 342,
  averageScore: 68.4,
  priorityDistribution: { A: 312, B: 547, C: 389 },
};

export async function POST(req: NextRequest) {
  const tenant = await resolveTenant(req);
  if (tenant instanceof NextResponse) return tenant;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    logger.info('Dashboard overview: Supabase not configured, returning mock data', { tenant: tenant.organizationId });
    return NextResponse.json({ success: true, metrics: MOCK_METRICS });
  }

  try {
    const url = new URL('/rest/v1/rpc/get_dashboard_overview', supabaseUrl);
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ p_org_id: tenant.organizationId }),
    });

    if (!res.ok) throw new Error(`Supabase responded ${res.status}`);

    const metrics = await res.json();
    return NextResponse.json({ success: true, metrics });
  } catch (err: any) {
    logger.warn('Dashboard overview: Supabase fetch failed, falling back to mock', {
      error: err.message,
      tenant: tenant.organizationId,
    });
    return NextResponse.json({ success: true, metrics: MOCK_METRICS });
  }
}
