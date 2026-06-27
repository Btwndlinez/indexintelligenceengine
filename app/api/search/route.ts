import { NextRequest, NextResponse } from 'next/server';
import { IndexIntelligenceEngine } from '@/lib/market/adapter';
import { getVerticalConfigByDomain } from '@/lib/market/registry';
import { withTimeout } from '@/lib/timeouts';
import { writeAudit } from '@/lib/telemetry/index';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.zip || !body.radius) {
      return NextResponse.json(
        { error: 'Missing core search properties (zip or radius).' },
        { status: 400 }
      );
    }

    const clientHeader = req.headers.get('x-iie-client-context') || body.vertical || 'slurry_concrete';
    const verticalConfig = await getVerticalConfigByDomain(clientHeader);

    if (!verticalConfig) {
      return NextResponse.json(
        { error: `Invalid or unregistered client configuration key: '${clientHeader}'` },
        { status: 403 }
      );
    }

    const engine = new IndexIntelligenceEngine();
    const { companies, contacts } = await withTimeout(
      engine.executeMarketDiscovery(body, verticalConfig),
      60000,
      () => ({ companies: [], contacts: [] } as any)
    );

    writeAudit({
      provider: 'search',
      action: 'market_discovery',
      orgId: verticalConfig.id,
      metadata: { zip: body.zip, radius: body.radius, vertical: clientHeader, companyCount: companies?.length || 0 },
    });

    return NextResponse.json({
      success: true,
      tenant: verticalConfig.id,
      industry: verticalConfig.industryName,
      count: companies.length,
      companies,
      contacts,
    });
  } catch (err: any) {
    console.error("Core Engine Error:", err);
    return NextResponse.json({
      success: true,
      count: 0,
      companies: [],
      contacts: [],
    });
  }
}
