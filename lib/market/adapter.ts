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
        }).catch(err => {
          console.error(`[${provider.name}] search failed:`, err);
          return [] as Partial<Company>[];
        })
      )
    );

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

    const negativeKeywords = config.negativeKeywords || [];
    const filteredPool = candidatePool.filter(c => {
      if (isIrrelevant(c, negativeKeywords)) return false;
      const d = c.distanceMiles ?? (
        c.latitude != null && c.longitude != null && zipCoords
          ? Math.round(haversineDistance(zipCoords.lat, zipCoords.lng, c.latitude, c.longitude) * 10) / 10
          : undefined
      );
      if (d != null && d > radiusFilter) return false;
      return true;
    });

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

        if (result.score < 40 || result.priority === 'D' || result.negativeHits.length >= 2) {
          continue;
        }

        finalizedCompanies.push(base as Company);
        continue;
      }

      // Stage 1: Fast pre-filter before Apollo (saves API credits)
      const precheckText = `${record.companyName || ''} ${record.notes || ''} ${record.address || ''}`;
      const precheck = this.signalExtractor.extract(precheckText, config.signals, config.equipmentKeywords);
      if (precheck.negativeHits.length >= 2) {
        continue;
      }

      const apolloResult = await this.apolloAdapter.enrich(base);

      // Stage 2: Rich signal extraction across all available data
      const analysisText = `
${base.companyName || ''}
${base.notes || ''}
${base.address || ''}
${apolloResult.companyFields?.industry || ''}
${apolloResult.companyFields?.description || ''}
${apolloResult.companyFields?.website || ''}
`;
      const signalResult = this.signalExtractor.extract(
        analysisText,
        config.signals,
        config.equipmentKeywords
      );

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
${apolloResult.companyFields?.industry || ''}
${apolloResult.companyFields?.description || ''}
`;
      const result = calculateLeadScore(mergedCompany, config, scoringText, distance);
      mergedCompany.enrichmentScore = result.score;
      mergedCompany.priority = result.priority;

      // Stage 3: Hard filter garbage after scoring
      if (result.score < 40 || result.priority === 'D' || result.negativeHits.length >= 2) {
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

    const gradeOrder: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    finalizedCompanies.sort((a, b) => {
      const g = (gradeOrder[a.priority || 'D'] ?? 3) - (gradeOrder[b.priority || 'D'] ?? 3);
      if (g !== 0) return g;
      return (a.distanceMiles ?? Infinity) - (b.distanceMiles ?? Infinity);
    });

    return { companies: finalizedCompanies, contacts: allContacts };
  }
}

export class IndexIntelligenceOrchestrator extends IndexIntelligenceEngine {}
