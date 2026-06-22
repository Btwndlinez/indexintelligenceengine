import { Company, SearchFilters } from '@/types/company';

export interface BaseSearchProvider {
  name: string;
  search?(filters: SearchFilters): Promise<Partial<Company>[]>;
  searchWithNegatives?(query: string, negativeKeywords: string[]): Promise<Partial<Company>[]>;
}

export interface BaseEnrichmentProvider {
  name: string;
  enrich(company: Company): Promise<Partial<Company>>;
}

export interface SignalScanner {
  name: string;
  scanForSignals(website: string | undefined, equipmentKeywords: string[]): Promise<{
    hasSignals: boolean;
    extractedNotes: string;
  }>;
}
