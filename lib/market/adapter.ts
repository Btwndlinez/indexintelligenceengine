import { Company, Contact, SearchFilters } from '@/types/company';
import { VerticalConfig } from '@/types/config';
import { GooglePlacesAdapter } from './providers/google';
import { ApolloAdapter } from './providers/apollo';
import { GeminiScraperAdapter } from './providers/geminiScraper';
import { RegulatoryPermitScraper } from './providers/regulatoryPermit';
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
  private permitScraper = new RegulatoryPermitScraper();

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

    const permitResults = await this.permitScraper.discoverLicensedOperators(filters.zip);
    for (const permit of permitResults) {
      rawDiscoveryList.push(this.permitScraper.normalizePermitToCompany(permit));
    }

    const uniqueMap = new Map<string, Partial<Company>>();
    for (const item of rawDiscoveryList) {
      const key = item.id || item.companyName || '';
      if (key) uniqueMap.set(item.companyName || item.id || '', item);
    }
    let deduplicatedRecords = Array.from(uniqueMap.values());

    deduplicatedRecords = deduplicatedRecords.filter(r => !isIrrelevant(r, config));

    const now = new Date().toISOString();
    const finalizedCompanies: Company[] = [];
    const allContacts: Contact[] = [];

    const MAX_SCRAPED = 10;

    for (let i = 0; i < deduplicatedRecords.length; i++) {
      const record = deduplicatedRecords[i];
      const isPermit = record.source?.startsWith('regulatory_permit');

      const base: Partial<Company> = {
        ...record,
        organizationId,
        verticalId: config.id,
        enrichmentScore: isPermit ? (record.enrichmentScore ?? 85) : 0,
        priority: isPermit ? (record.priority as any || 'A') : 'C' as const,
        status: 'NOT_CONTACTED' as const,
        createdAt: now,
        updatedAt: now
      };

      if (isPermit) {
        const s = base.enrichmentScore ?? 0;
        base.priority = s >= 80 ? 'A' : s >= 55 ? 'B' : 'C';
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
