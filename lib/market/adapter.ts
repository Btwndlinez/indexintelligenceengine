import { Company, Contact, SearchFilters } from '@/types/company';
import { VerticalConfig } from '@/types/config';
import { VerticalConfigWithProviders, isIrrelevant } from './registry';
import { ApolloAdapter } from './providers/apollo';
import { KeywordSignalExtractor } from './signals';
import { calculateLeadScore } from './scoring';
import { geocodeZip, haversineDistance } from '@/lib/geo';

export class IndexIntelligenceEngine {
  private apolloAdapter = new ApolloAdapter();
  private signalExtractor = new KeywordSignalExtractor();

  async executeMarketDiscovery(
    filters: SearchFilters,
    config: VerticalConfig,
    organizationId?: string
  ): Promise<{ companies: Company[]; contacts: Contact[] }> {
    try {
    const configWithProviders = config as VerticalConfigWithProviders;
    const providers = configWithProviders.providers || [];

    const radiusFilter = filters.radius || 50;
    const zipCoords = await geocodeZip(filters.zip);
    const now = new Date().toISOString();

    const providerResults = await Promise.all(
      providers.map(provider =>
        provider.search({
          zip: filters.zip,
          vertical: config.id,
          lat: zipCoords?.lat,
          lng: zipCoords?.lng,
          radius: filters.radius,
          searchQueries: config.searchQueries,
        }).catch(err => {
          console.error(`[${provider.name}] search failed:`, err);
          return [] as Partial<Company>[];
        })
      )
    );

    for (let pi = 0; pi < providerResults.length; pi++) {
      console.log(`[DEBUG] Provider ${providers[pi].name} returned ${providerResults[pi].length} raw results`);
    }

    const candidatePool: Partial<Company>[] = [];
    const seenNames = new Set<string>();

    for (const results of providerResults) {
      for (const company of results) {
        const normalizedName = company.companyName?.toLowerCase().trim();
        if (normalizedName && !seenNames.has(normalizedName)) {
          seenNames.add(normalizedName);
          candidatePool.push(company);
        }
      }
    }

    console.log(`[DEBUG] ${candidatePool.length} unique candidates after dedup`);

    const negativeKeywords = config.negativeKeywords || [];
    const filteredPool = candidatePool.filter(c => {
      if (isIrrelevant(c, negativeKeywords)) {
        console.log(`[DEBUG] filtered by isIrrelevant: ${c.companyName}`);
        return false;
      }
      const d = c.distanceMiles ?? (
        c.latitude != null && c.longitude != null && zipCoords
          ? Math.round(haversineDistance(zipCoords.lat, zipCoords.lng, c.latitude, c.longitude) * 10) / 10
          : undefined
      );
      if (d != null && d > radiusFilter) {
        console.log(`[DEBUG] filtered by distance ${d} > ${radiusFilter}: ${c.companyName}`);
        return false;
      }
      return true;
    });

    console.log(`[DEBUG] ${filteredPool.length} candidates after isIrrelevant/distance filter`);

    const finalizedCompanies: Company[] = [];
    const allContacts: Contact[] = [];

    for (let i = 0; i < filteredPool.length; i++) {
      const record = filteredPool[i];
      const isPermit = record.source === 'regulatory_permit';

      const base: Partial<Company> = {
        ...record,
        organizationId,
        verticalId: config.id,
        enrichmentScore: 0,
        priority: 'C' as const,
        status: 'NOT_CONTACTED' as const,
        createdAt: now,
        updatedAt: now,
      };

      if (isPermit) {
        const distance =
          record.latitude != null && record.longitude != null && zipCoords
            ? Math.round(haversineDistance(zipCoords.lat, zipCoords.lng, record.latitude, record.longitude) * 10) / 10
            : undefined;

        const text = `${record.companyName || ''} ${record.notes || ''} ${record.capabilitySummary || ''} ${record.address || ''}`;
        const result = calculateLeadScore(record, config, text, distance);
        base.enrichmentScore = result.score;
        base.priority = result.priority;
        base.distanceMiles = distance;

        if (result.score < 30 || result.priority === 'D' || result.negativeHits.length >= 2) {
          continue;
        }

        finalizedCompanies.push(base as Company);
        continue;
      }

      // Stage 1: Fast pre-filter before Apollo (saves API credits)
      const precheckText = `${record.companyName || ''} ${record.notes || ''} ${record.address || ''}`;
      const precheck = this.signalExtractor.extract(precheckText, config.signals, config.equipmentKeywords);
      if (precheck.negativeHits.length >= 2) {
        console.log(`[DEBUG] pre-filter negative skip: ${record.companyName} (${precheck.negativeHits.join(',')})`);
        continue;
      }

      const apolloResult = await this.apolloAdapter.enrich(base);
      console.log(`[DEBUG] apollo enriched ${record.companyName}: hasNotes=${!!apolloResult.companyFields?.notes} hasWebsite=${!!apolloResult.companyFields?.website} contacts=${apolloResult.contacts.length}`);

      // Stage 2: Rich signal extraction across all available data
      const analysisText = `
${base.companyName || ''}
${base.notes || ''}
${base.address || ''}
${apolloResult.companyFields?.notes || ''}
${apolloResult.companyFields?.website || ''}
`;
      console.log(`[DEBUG] analysisText for ${record.companyName}: "${analysisText.replace(/\n/g, ' | ').trim()}"`);
      const signalResult = this.signalExtractor.extract(
        analysisText,
        config.signals,
        config.equipmentKeywords
      );
      console.log(`[DEBUG] signalResult for ${record.companyName}: hasSignals=${signalResult.hasSignals} matched=${signalResult.matchedSignals.join(',')} neg=${signalResult.negativeHits.join(',')}`);

      const mergedCompany: Partial<Company> = {
        ...base,
        ...apolloResult.companyFields,
        capabilitySummary: signalResult.capabilitySummary,
      };

      const companyContacts: Partial<Contact>[] = apolloResult.contacts.map(c => ({
        ...c,
        companyId: mergedCompany.id!
      }));

      const distance = mergedCompany.distanceMiles;
      const scoringText = `
${mergedCompany.companyName || ''}
${mergedCompany.notes || ''}
${mergedCompany.capabilitySummary || ''}
${mergedCompany.address || ''}
${apolloResult.companyFields?.notes || ''}
`;
      const result = calculateLeadScore(mergedCompany, config, scoringText, distance);
      mergedCompany.enrichmentScore = result.score;
      mergedCompany.priority = result.priority;

      // Stage 3: Hard filter garbage after scoring
      if (result.score < 30 || result.priority === 'D' || result.negativeHits.length >= 2) {
        console.log(`[FILTERED] ${mergedCompany.companyName} — score=${result.score} priority=${result.priority} negatives=${result.negativeHits.join(',')}`);
        continue;
      }

      console.log(`[SCORE] ${mergedCompany.companyName} — score=${result.score} priority=${result.priority} matched=${result.matchedSignals.join(',')}`);

      const contactId = `contact-${mergedCompany.id}`;
      finalizedCompanies.push(mergedCompany as Company);
      allContacts.push(...companyContacts.map((c, i) => ({
        ...c,
        id: `${contactId}-${i}`
      })) as Contact[]);
    }

    console.log(`[DEBUG] FINAL: ${finalizedCompanies.length} companies, ${allContacts.length} contacts`);
    for (let fi = 0; fi < Math.min(finalizedCompanies.length, 5); fi++) {
      const fc = finalizedCompanies[fi];
      console.log(`[DEBUG] result #${fi}: ${fc.companyName} score=${fc.enrichmentScore} priority=${fc.priority} notes="${fc.notes?.substring(0, 80)}"`);
    }

    const gradeOrder: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    finalizedCompanies.sort((a, b) => {
      const g = (gradeOrder[a.priority || 'D'] ?? 3) - (gradeOrder[b.priority || 'D'] ?? 3);
      if (g !== 0) return g;
      return (a.distanceMiles ?? Infinity) - (b.distanceMiles ?? Infinity);
    });

    return { companies: finalizedCompanies, contacts: allContacts };
    } catch (e) {
      console.error('[CRITICAL] executeMarketDiscovery threw:', e);
      return { companies: [], contacts: [] };
    }
  }
}

export class IndexIntelligenceOrchestrator extends IndexIntelligenceEngine {}
