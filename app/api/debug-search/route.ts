import { NextRequest, NextResponse } from 'next/server';
import { GooglePlacesProvider } from '@/lib/market/providers/google';
import { VERTICAL_REGISTRY, isIrrelevant } from '@/lib/market/registry';
import { KeywordSignalExtractor } from '@/lib/market/signals';
import { calculateLeadScore } from '@/lib/market/scoring';
import { ApolloAdapter } from '@/lib/market/providers/apollo';

const google = new GooglePlacesProvider();
const extractor = new KeywordSignalExtractor();
const apollo = new ApolloAdapter();

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
      zip, vertical: verticalId,
      lat: undefined, lng: undefined,
      radius: 50,
      searchQueries: config.searchQueries,
    });

    const negativeKeywords = config.negativeKeywords || [];
    const afterIrrelevant = googleResults.filter(c => !isIrrelevant(c, negativeKeywords));

    const stages = {
      raw: googleResults.length,
      afterIrrelevant: afterIrrelevant.length,
      preFilterNeg: 0,
      apolloSkipped: 0,
      apolloEnriched: 0,
      afterScoring: 0,
      details: [] as any[],
    };

    for (const record of afterIrrelevant) {
      const precheckText = `${record.companyName || ''} ${record.notes || ''} ${record.address || ''}`;
      const precheck = extractor.extract(precheckText, config.signals, config.equipmentKeywords);

      if (precheck.negativeHits.length >= 2) {
        stages.preFilterNeg++;
        stages.details.push({ name: record.companyName, stage: 'pre-filter-neg', neg: precheck.negativeHits });
        continue;
      }

      const base: any = { ...record };
      const apolloResult = await apollo.enrich(base);
      const hasApollo = Object.keys(apolloResult.companyFields).length > 0;

      const analysisText = `
${base.companyName || ''}
${base.notes || ''}
${base.address || ''}
${apolloResult.companyFields?.notes || ''}
${apolloResult.companyFields?.website || ''}
`;

      const signalResult = extractor.extract(analysisText, config.signals, config.equipmentKeywords);

      const mergedCompany = {
        ...base,
        ...apolloResult.companyFields,
        capabilitySummary: signalResult.capabilitySummary,
      };

      const scoringText = `
${mergedCompany.companyName || ''}
${mergedCompany.notes || ''}
${mergedCompany.capabilitySummary || ''}
${mergedCompany.address || ''}
${apolloResult.companyFields?.notes || ''}
`;

      const scoreResult = calculateLeadScore(mergedCompany, config, scoringText, undefined);

      if (hasApollo) stages.apolloEnriched++;
      else stages.apolloSkipped++;

      if (scoreResult.score < 30 || scoreResult.priority === 'D' || scoreResult.negativeHits.length >= 2) {
        stages.details.push({
          name: record.companyName,
          stage: 'scoring-filter',
          score: scoreResult.score,
          priority: scoreResult.priority,
          matched: scoreResult.matchedSignals,
          neg: scoreResult.negativeHits,
          hasApollo,
          notes: mergedCompany.notes?.substring(0, 100),
        });
        continue;
      }

      stages.afterScoring++;
      stages.details.push({
        name: record.companyName,
        stage: 'PASS',
        score: scoreResult.score,
        priority: scoreResult.priority,
        matched: scoreResult.matchedSignals,
        hasApollo,
      });
    }

    return NextResponse.json({ vertical: verticalId, ...stages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack });
  }
}
