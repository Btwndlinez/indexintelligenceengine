import { NextRequest, NextResponse } from 'next/server';
import { GooglePlacesProvider } from '@/lib/market/providers/google';
import { RegulatoryProvider } from '@/lib/market/providers/regulatory';
import { VERTICAL_REGISTRY } from '@/lib/market/registry';

const google = new GooglePlacesProvider();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const verticalId = body.vertical || 'grease_trap';
    const zip = body.zip || '77001';
    const config = VERTICAL_REGISTRY[verticalId];

    if (!config) {
      return NextResponse.json({ error: `Unknown vertical: ${verticalId}` });
    }

    const googleResults = await google.search({
      zip,
      vertical: verticalId,
      lat: undefined,
      lng: undefined,
      radius: 50,
      searchQueries: config.searchQueries,
    });

    return NextResponse.json({
      vertical: verticalId,
      queries: config.searchQueries,
      googleCount: googleResults.length,
      googleNames: googleResults.map(r => ({
        name: r.companyName,
        notes: r.notes,
        address: r.address,
        website: r.website,
        phone: r.phone,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack });
  }
}
