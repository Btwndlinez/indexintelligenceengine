import { NextRequest, NextResponse } from 'next/server';
import { resolveTenant } from '@/lib/auth/tenant';
import { logger } from '@/lib/logger';
import { supabaseRpc } from '@/lib/db';

const MOCK_REPORTS = [
  { id: 'rpt-001', name: 'Construction Sector — May 2026', industry: 'Construction', totalCompanies: 412, generatedAt: '2026-06-01T00:00:00Z', coverage: { phone: 94, website: 78, email: 62 } },
  { id: 'rpt-002', name: 'Roofing Contractors — Q2', industry: 'Roofing', totalCompanies: 187, generatedAt: '2026-05-20T00:00:00Z', coverage: { phone: 91, website: 72, email: 58 } },
  { id: 'rpt-003', name: 'Remodeling Trends — Mid Year', industry: 'Remodeling', totalCompanies: 295, generatedAt: '2026-06-15T00:00:00Z', coverage: { phone: 88, website: 81, email: 65 } },
];

export async function POST(req: NextRequest) {
  const tenant = await resolveTenant(req);
  if (tenant instanceof NextResponse) return tenant;

  try {
    const res = await supabaseRpc('get_dashboard_reports', { p_org_id: tenant.organizationId });
    if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
    const reports = await res.json();
    return NextResponse.json({ success: true, reports });
  } catch (err: any) {
    logger.warn('Dashboard reports: Supabase fetch failed, falling back to mock', {
      error: err.message,
      tenant: tenant.organizationId,
    });
    return NextResponse.json({ success: true, reports: MOCK_REPORTS });
  }
}
