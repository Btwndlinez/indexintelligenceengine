import { NextRequest, NextResponse } from 'next/server';
import { getVerticalConfigByDomain } from '@/core/search/registry';
import { db, maps } from '@/core/services';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { verticalId, zip, sources, activeOnly } = body as {
    verticalId?: string;
    zip?: string;
    sources?: string[];
    activeOnly?: boolean;
  };

  if (!verticalId || !zip) {
    return NextResponse.json(
      { error: 'verticalId and zip are required' },
      { status: 400 }
    );
  }

  const config = await getVerticalConfigByDomain(verticalId);
  if (!config) {
    return NextResponse.json(
      { error: `Unknown vertical: ${verticalId}` },
      { status: 404 }
    );
  }

  const state = maps.getStateFromZip(zip);
  const start = Date.now();

  try {
    const stateFilter = state ? `&state=eq.${state}` : '';
    const statusFilter = activeOnly ? '&status=in.(open,closing_soon)' : '';
    const path = `/rest/v1/bid_results?select=id,title,agency,estimated_value,due_at,state,city,bid_source,status,description,created_at${stateFilter}${statusFilter}&order=due_at.asc&limit=25`;

    const res = await db.supabaseFetch(path);
    const bids = res.ok ? await res.json() : [];

    return NextResponse.json({
      bids: bids || [],
      providers: [{ provider: 'database', status: 'ready', results: bids || [] }],
      meta: {
        total: (bids || []).length,
        providers: [{ provider: 'database', status: res.ok ? 'ready' : 'error', message: res.ok ? undefined : 'Database query failed' }],
        verticalId,
        state,
        zip,
        executionMs: Date.now() - start,
      },
    });
  } catch (err) {
    console.error('[/api/bid-intelligence] Error:', err);
    return NextResponse.json({ error: 'Bid search failed' }, { status: 500 });
  }
}
