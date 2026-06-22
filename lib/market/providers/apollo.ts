import { Company, Contact } from '@/types/company';

export interface ApolloEnrichResult {
  companyFields: Partial<Company>;
  contacts: Partial<Contact>[];
}

export class ApolloAdapter {
  name = 'apollo';

  async enrich(company: Partial<Company>): Promise<ApolloEnrichResult> {
    const empty: ApolloEnrichResult = { companyFields: {}, contacts: [] };
    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey || !company.website) {
      return empty;
    }

    try {
      const cleanDomain = company.website
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .split('/')[0];

      const response = await fetch('https://api.apollo.io/v1/organizations/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Api-Key': apiKey
        },
        body: JSON.stringify({ domain: cleanDomain })
      });

      if (!response.ok) {
        return empty;
      }

      const data = await response.json();
      const org = data.organization || {};

      const now = new Date().toISOString();

      const companyFields: Partial<Company> = {
        email: org.primary_contact_email || undefined,
        phone: company.phone || org.phone || undefined,
        source: `${company.source}+${this.name}`
      };

      const contacts: Partial<Contact>[] = [];
      if (org.primary_contact_name) {
        const nameParts = org.primary_contact_name.split(' ');
        contacts.push({
          firstName: nameParts[0] || undefined,
          lastName: nameParts.slice(1).join(' ') || undefined,
          title: org.primary_contact_title || undefined,
          email: org.primary_contact_email || undefined,
          phone: org.phone || undefined,
          linkedinUrl: org.linkedin_url || undefined,
          isPrimary: true,
          createdAt: now
        });
      }

      return { companyFields, contacts };
    } catch (err) {
      console.error(`Apollo Enrichment execution failure:`, err);
      return empty;
    }
  }
}
