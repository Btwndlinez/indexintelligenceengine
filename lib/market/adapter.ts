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
        finalizedCompanies.push(base as Company);
        continue;
      }

      const apolloResult = await this.apolloAdapter.enrich(base);
      const signalResult = this.signalExtractor.extract(
        base.companyName,
        base.notes,
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
      const text = `${mergedCompany.companyName || ''} ${mergedCompany.notes || ''} ${mergedCompany.capabilitySummary || ''} ${mergedCompany.address || ''}`;
      const result = calculateLeadScore(mergedCompany, config, text, distance);
      mergedCompany.enrichmentScore = result.score;
      mergedCompany.priority = result.priority;

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
