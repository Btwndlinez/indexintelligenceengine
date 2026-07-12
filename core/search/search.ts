import { Company, SearchFilters } from '@/types/company';
import { DiscoveryEngine } from '../discovery';
import { SearchRequest } from '@/core/entities/listing';

export async function searchCompanies(filters: SearchFilters): Promise<Company[]> {
  const engine = new DiscoveryEngine();

  const searchRequest: SearchRequest = {
    zip: filters.zip,
    radius: filters.radius,
    industry: ''
  };

  const results = await engine.find(searchRequest);

  return results.map(r => ({
    ...r,
    companyName: r.name || 'Unknown'
  } as Company));
}
