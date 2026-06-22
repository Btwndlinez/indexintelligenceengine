import { NextRequest, NextResponse } from 'next/server';
import { resolveTenant } from '@/lib/auth/tenant';
import { logger } from '@/lib/logger';

const MOCK_COMPANIES = [
  { id: 'c-001', companyName: 'Acme Corp', city: 'San Francisco', phone: '(415) 555-0101', priority: 'A', enrichmentScore: 92, lastContacted: '2026-06-19T14:30:00Z' },
  { id: 'c-002', companyName: 'BuildRight Inc', city: 'Austin', phone: '(512) 555-0142', priority: 'A', enrichmentScore: 88, lastContacted: '2026-06-18T09:15:00Z' },
  { id: 'c-003', companyName: 'ConstructPro', city: 'Denver', phone: '(303) 555-0198', priority: 'B', enrichmentScore: 74, lastContacted: '2026-06-17T11:45:00Z' },
  { id: 'c-004', companyName: 'DesignWorks', city: 'Portland', phone: '(503) 555-0213', priority: 'B', enrichmentScore: 71, lastContacted: '2026-06-16T16:00:00Z' },
  { id: 'c-005', companyName: 'Elite Structures', city: 'Miami', phone: '(305) 555-0337', priority: 'C', enrichmentScore: 55, lastContacted: '2026-06-15T08:20:00Z' },
  { id: 'c-006', companyName: 'Foundation Co', city: 'Seattle', phone: '(206) 555-0448', priority: 'A', enrichmentScore: 95, lastContacted: '2026-06-20T07:00:00Z' },
  { id: 'c-007', companyName: 'GreenBuild', city: 'Chicago', phone: '(312) 555-0559', priority: 'B', enrichmentScore: 67, lastContacted: '2026-06-14T13:10:00Z' },
];

export async function POST(req: NextRequest) {
  const tenant = await resolveTenant(req);
  if (tenant instanceof NextResponse) return tenant;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    logger.info('Dashboard companies: Supabase not configured, returning mock data', { tenant: tenant.organizationId });
    return NextResponse.json({ success: true, companies: MOCK_COMPANIES });
  }

  try {
    const url = new URL('/rest/v1/rpc/get_dashboard_companies', supabaseUrl);
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

    const companies = await res.json();
    return NextResponse.json({ success: true, companies });
  } catch (err: any) {
    logger.warn('Dashboard companies: Supabase fetch failed, falling back to mock', {
      error: err.message,
      tenant: tenant.organizationId,
    });
    return NextResponse.json({ success: true, companies: MOCK_COMPANIES });
  }
}
