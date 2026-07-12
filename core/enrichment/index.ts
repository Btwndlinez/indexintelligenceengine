import { ApolloAdapter } from '../providers/apollo';
import { Company } from '@/types/company';

export class EnrichmentEngine {
  private apollo = new ApolloAdapter();

  async enrich(company: Partial<Company>): Promise<Partial<Company>> {
    const result = await this.apollo.enrich(company);
    return {
      ...company,
      ...result.companyFields,
    };
  }
}
