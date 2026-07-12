import { ReportingEngine, MarketReport } from '../reporting';
export type { MarketReport };
import { Listing } from '@/core/entities/listing';
import { Company } from '@/types/company';

export function generateMarketReport(name: string, companies: Company[]): MarketReport {
  const engine = new ReportingEngine();

  // Map Company to Listing
  const listings: Listing[] = companies.map(c => ({
    ...c,
    name: c.companyName || (c as any).name || 'Unknown'
  } as Listing));

  return engine.generate(name, listings);
}
