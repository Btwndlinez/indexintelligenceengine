import { Company, Contact, SearchFilters } from '@/types/company';
import { VerticalConfig } from '@/types/config';
import { GooglePlacesAdapter } from './providers/google';
import { ApolloAdapter } from './providers/apollo';
import { GeminiScraperAdapter } from './providers/geminiScraper';
import { calculateScore } from './scoring';
import { geocodeZip } from '@/lib/geo';

function isIrrelevant(company: Partial<Company>, config: VerticalConfig): boolean {
  const haystack = `${company.companyName || ''} ${company.address || ''}`.toLowerCase();
  return config.negativeKeywords.some(kw => haystack.includes(kw.toLowerCase()));
}

export class IndexIntelligenceEngine {
  private placesAdapter = new GooglePlacesAdapter();
  private apolloAdapter = new ApolloAdapter();
  private scraperAdapter = new GeminiScraperAdapter();

  async executeMarketDiscovery(
    filters: SearchFilters,
    config: VerticalConfig,
    organizationId?: string
  ): Promise<{ companies: Company[]; contacts: Contact[] }> {
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      throw new Error("IIE Error: GOOGLE_PLACES_API_KEY is not configured.");
    }

    const zipCoords = await geocodeZip(filters.zip);

    const rawDiscoveryList: Partial<Company>[] = [];
    for (const searchQuery of config.searchQueries) {
      const textQuery = `${searchQuery} ${filters.zip}`;
      try {
        const results = await this.placesAdapter.searchWithNegatives(
          textQuery, config.negativeKeywords,
          zipCoords?.lat, zipCoords?.lng
        );
        rawDiscoveryList.push(...results);
      } catch (err) {
        console.error(`Query variant '${textQuery}' execution failed:`, err);
      }
    }

    const uniqueMap = new Map<string, Partial<Company>>();
    for (const item of rawDiscoveryList) {
      if (item.id) uniqueMap.set(item.id, item);
    }
    let deduplicatedRecords = Array.from(uniqueMap.values());

    deduplicatedRecords = deduplicatedRecords.filter(r => !isIrrelevant(r, config));

    const now = new Date().toISOString();
    const finalizedCompanies: Company[] = [];
    const allContacts: Contact[] = [];

    for (const record of deduplicatedRecords) {
      const base: Partial<Company> = {
        ...record,
        organizationId,
        verticalId: config.id,
        enrichmentScore: 0,
        priority: 'C' as const,
        status: 'NOT_CONTACTED' as const,
        createdAt: now,
        updatedAt: now
      };

      const [apolloResult, scraperResult] = await Promise.all([
        this.apolloAdapter.enrich(base),
        this.scraperAdapter.scanForSignals(base.website, config.equipmentKeywords)
      ]);

      const mergedCompany: Partial<Company> = {
        ...base,
        ...apolloResult.companyFields,
        capabilitySummary: scraperResult.capabilitySummary
      };

      const companyContacts: Partial<Contact>[] = apolloResult.contacts.map((c) => ({
        ...c,
        companyId: mergedCompany.id!
      }));

      const { score, tier } = calculateScore(mergedCompany, config, companyContacts);
      mergedCompany.enrichmentScore = score;
      mergedCompany.priority = tier;

      const contactId = `contact-${mergedCompany.id}`;
      finalizedCompanies.push(mergedCompany as Company);
      allContacts.push(...companyContacts.map((c, i) => ({
        ...c,
        id: `${contactId}-${i}`
      })) as Contact[]);
    }

    return { companies: finalizedCompanies, contacts: allContacts };
  }
}

export class IndexIntelligenceOrchestrator extends IndexIntelligenceEngine {}
