import { NextRequest, NextResponse } from 'next/server';
import { IndexIntelligenceEngine } from '@/lib/market/adapter';
import { getVerticalConfigByDomain } from '@/lib/market/registry';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.zip || !body.radius) {
      return NextResponse.json(
        { error: 'Missing core search properties (zip or radius).' },
        { status: 400 }
      );
    }

    const clientHeader = req.headers.get('x-iie-client-context');
    if (!clientHeader) {
      return NextResponse.json(
        { error: 'X-IIE-Client-Context header is required to map configuration contexts.' },
        { status: 401 }
      );
    }

    const verticalConfig = await getVerticalConfigByDomain(clientHeader);
    if (!verticalConfig) {
      return NextResponse.json(
        { error: `Invalid or unregistered client configuration key: '${clientHeader}'` },
        { status: 403 }
      );
    }

    const engine = new IndexIntelligenceEngine();
    const { companies } = await engine.executeMarketDiscovery(body, verticalConfig);

    return NextResponse.json({
      success: true,
      tenant: verticalConfig.id,
      industry: verticalConfig.industryName,
      count: companies.length,
      companies
    });
  } catch (err: any) {
    console.error("Core Engine Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
