import { Company, Contact, SearchFilters } from '@/types/company';
import { VerticalConfig } from '@/types/config';
import { VerticalConfigWithProviders, VERTICAL_REGISTRY, isIrrelevant } from './registry';
import { ApolloAdapter } from './providers/apollo';
import { GeminiScraperAdapter } from './providers/geminiScraper';
import { calculateCompositeScore, getTier } from './scoring';
import { geocodeZip, haversineDistance } from '@/lib/geo';

export class IndexIntelligenceEngine {
  private apolloAdapter = new ApolloAdapter();
  private scraperAdapter = new GeminiScraperAdapter();

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
    const MAX_SCRAPED = 10;

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

        const score = calculateCompositeScore(record, config, distance);
        base.enrichmentScore = score;
        base.priority = getTier(score);
        base.distanceMiles = distance;
        finalizedCompanies.push(base as Company);
        continue;
      }

      const [apolloResult, scraperResult] = await Promise.all([
        this.apolloAdapter.enrich(base),
        i < MAX_SCRAPED
          ? this.scraperAdapter.scanForSignals(base.website, config.equipmentKeywords)
          : Promise.resolve({ hasSignals: false, capabilitySummary: '' })
      ]);

      const mergedCompany: Partial<Company> = {
        ...base,
        ...apolloResult.companyFields,
        capabilitySummary: scraperResult.capabilitySummary,
      };

      const companyContacts: Partial<Contact>[] = apolloResult.contacts.map(c => ({
        ...c,
        companyId: mergedCompany.id!
      }));

      const distance = mergedCompany.distanceMiles;
      const score = calculateCompositeScore(mergedCompany, config, distance);
      mergedCompany.enrichmentScore = score;
      mergedCompany.priority = getTier(score);

      const contactId = `contact-${mergedCompany.id}`;
      finalizedCompanies.push(mergedCompany as Company);
      allContacts.push(...companyContacts.map((c, i) => ({
        ...c,
        id: `${contactId}-${i}`
      })) as Contact[]);
    }

    finalizedCompanies.sort((a, b) => (b.enrichmentScore || 0) - (a.enrichmentScore || 0));

    return { companies: finalizedCompanies, contacts: allContacts };
  }
}

export class IndexIntelligenceOrchestrator extends IndexIntelligenceEngine {}
