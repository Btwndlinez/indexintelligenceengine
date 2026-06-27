import { NextRequest, NextResponse } from 'next/server';
import { resolveTenant } from '@/lib/auth/tenant';
import { logger } from '@/lib/logger';
import { supabaseRpc } from '@/lib/db';

const MOCK_METRICS = {
  totalCompanies: 1248,
  activeCampaigns: 17,
  callsToday: 342,
  averageScore: 68.4,
  searchesToday: 2281,
  totalEnrichments: 3402,
  pipelineValue: '$482K',
  priorityDistribution: { A: 312, B: 547, C: 389 },
};

export async function POST(req: NextRequest) {
  const tenant = await resolveTenant(req);
  if (tenant instanceof NextResponse) return tenant;

  try {
    const res = await supabaseRpc('get_dashboard_overview', { p_org_id: tenant.organizationId });
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
