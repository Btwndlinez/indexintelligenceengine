import { NextRequest, NextResponse } from 'next/server';
import { GooglePlacesProvider } from '@/lib/market/providers/google';
import { VERTICAL_REGISTRY } from '@/lib/market/registry';
import { KeywordSignalExtractor } from '@/lib/market/signals';
import { calculateLeadScore } from '@/lib/market/scoring';

const google = new GooglePlacesProvider();
const extractor = new KeywordSignalExtractor();

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

    const scored: any[] = [];
    for (const r of googleResults) {
      const text = `${r.companyName || ''} ${r.notes || ''} ${r.address || ''}`;
      const sig = extractor.extract(text, config.signals, config.equipmentKeywords);
      const score = calculateLeadScore(r, config, text, undefined);
      scored.push({
        name: r.companyName,
        notes: r.notes,
        matchedSignals: score.matchedSignals,
        negativeHits: score.negativeHits,
        score: score.score,
        priority: score.priority,
        pass: score.priority !== 'D' && score.score >= 30,
      });
    }

    const passed = scored.filter(s => s.pass);
    const filtered = scored.filter(s => !s.pass);

    return NextResponse.json({
      vertical: verticalId,
      queries: config.searchQueries,
      googleCount: googleResults.length,
      passedCount: passed.length,
      passed: passed.slice(0, 10),
      filteredSample: filtered.slice(0, 10),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack });
  }
}
