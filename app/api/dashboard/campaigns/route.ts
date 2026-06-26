import { NextRequest, NextResponse } from 'next/server';
import { resolveTenant } from '@/lib/auth/tenant';
import { logger } from '@/lib/logger';
import { supabaseRpc } from '@/lib/db';

const MOCK_CAMPAIGNS = [
  { id: 'cmp-001', name: 'Q2 Cold Outreach — Construction', status: 'active', targetCount: 500, contactsMade: 342, conversionRate: 8.2, createdAt: '2026-04-01T00:00:00Z' },
  { id: 'cmp-002', name: 'Follow-up Wave — Roofing', status: 'active', targetCount: 200, contactsMade: 156, conversionRate: 12.5, createdAt: '2026-05-15T00:00:00Z' },
  { id: 'cmp-003', name: 'Summer Prospecting — Remodeling', status: 'draft', targetCount: 350, contactsMade: 0, conversionRate: 0, createdAt: '2026-06-10T00:00:00Z' },
  { id: 'cmp-004', name: 'Q1 General Contractors', status: 'completed', targetCount: 400, contactsMade: 398, conversionRate: 10.1, createdAt: '2026-01-10T00:00:00Z' },
];

export async function POST(req: NextRequest) {
  const tenant = await resolveTenant(req);
  if (tenant instanceof NextResponse) return tenant;

  try {
    const res = await supabaseRpc('get_dashboard_campaigns', { p_org_id: tenant.organizationId });
    if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
    const campaigns = await res.json();
    return NextResponse.json({ success: true, campaigns });
  } catch (err: any) {
    logger.warn('Dashboard campaigns: Supabase fetch failed, falling back to mock', {
      error: err.message,
      tenant: tenant.organizationId,
    });
    return NextResponse.json({ success: true, campaigns: MOCK_CAMPAIGNS });
  }
}
