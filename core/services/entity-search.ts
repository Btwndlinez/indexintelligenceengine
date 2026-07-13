import { supabaseFetch } from '@/core/db';
import { getVerticalConfigByDomain } from '@/core/search/registry';
import type { VerticalConfig } from '@/types/config';

export type EntityType = 'company' | 'contact' | 'property' | 'permit' | 'bid';

export interface EntitySearchRequest {
  type: EntityType;
  query?: string;
  zip?: string;
  city?: string;
  state?: string;
  radius?: number;
  vertical?: string;
  limit?: number;
  offset?: number;
}

export interface EntitySearchResult {
  id: string;
  type: EntityType;
  label: string;
  subtitle?: string;
  metadata: Record<string, unknown>;
  score?: number;
}

export async function search(req: EntitySearchRequest): Promise<{ results: EntitySearchResult[]; total: number }> {
  const { type, query, zip, city, state, vertical, limit = 25, offset = 0 } = req;

  if (type === 'bid') {
    return searchBids({ query, zip, city, state, vertical, limit, offset });
  }
  if (type === 'property') {
    return searchProperties({ query, zip, city, state, limit, offset });
  }
  return searchCompanies({ query, zip, city, state, vertical, limit, offset });
}

async function searchBids(params: {
  query?: string; zip?: string; city?: string; state?: string;
  vertical?: string; limit: number; offset: number;
}): Promise<{ results: EntitySearchResult[]; total: number }> {
  const filters = [];
  if (params.state) filters.push(`state=eq.${params.state}`);
  if (params.city) filters.push(`city=eq.${encodeURIComponent(params.city)}`);
  if (params.vertical) filters.push(`vertical=eq.${params.vertical}`);

  const filterStr = filters.length ? `&${filters.join('&')}` : '';
  const res = await supabaseFetch(
    `/rest/v1/bid_results?select=id,title,agency,estimated_value,due_at,state,city${filterStr}&order=due_at.asc&limit=${params.limit}&offset=${params.offset}`
  );
  if (!res.ok) return { results: [], total: 0 };
  const data = await res.json();
  return {
    results: (data || []).map((r: any) => ({
      id: r.id,
      type: 'bid' as EntityType,
      label: r.title || 'Untitled Bid',
      subtitle: `${r.agency} — ${r.city}, ${r.state}`,
      metadata: { estimatedValue: r.estimated_value, dueAt: r.due_at, state: r.state, city: r.city },
    })),
    total: data?.length || 0,
  };
}

async function searchProperties(params: {
  query?: string; zip?: string; city?: string; state?: string;
  limit: number; offset: number;
}): Promise<{ results: EntitySearchResult[]; total: number }> {
  const filters = [];
  if (params.state) filters.push(`state=eq.${params.state}`);
  if (params.city) filters.push(`city=eq.${encodeURIComponent(params.city)}`);

  const filterStr = filters.length ? `&${filters.join('&')}` : '';
  const res = await supabaseFetch(
    `/rest/v1/properties?select=id,address,city,state,parcel_id,property_type${filterStr}&limit=${params.limit}&offset=${params.offset}`
  );
  if (!res.ok) return { results: [], total: 0 };
  const data = await res.json();
  return {
    results: (data || []).map((r: any) => ({
      id: r.id,
      type: 'property' as EntityType,
      label: r.address || 'Unknown Property',
      subtitle: `${r.city}, ${r.state}`,
      metadata: { parcelId: r.parcel_id, propertyType: r.property_type, city: r.city, state: r.state },
    })),
    total: data?.length || 0,
  };
}

async function searchCompanies(params: {
  query?: string; zip?: string; city?: string; state?: string;
  vertical?: string; limit: number; offset: number;
}): Promise<{ results: EntitySearchResult[]; total: number }> {
  const filters = [];
  if (params.state) filters.push(`state=eq.${params.state}`);
  if (params.city) filters.push(`city=eq.${encodeURIComponent(params.city)}`);
  if (params.vertical) filters.push(`vertical_id=eq.${params.vertical}`);

  const filterStr = filters.length ? `&${filters.join('&')}` : '';
  const res = await supabaseFetch(
    `/rest/v1/deep_profiles?select=id,company_name,city,state,industry${filterStr}&limit=${params.limit}&offset=${params.offset}`
  );
  if (!res.ok) return { results: [], total: 0 };
  const data = await res.json();
  return {
    results: (data || []).map((r: any) => ({
      id: r.id,
      type: 'company' as EntityType,
      label: r.company_name || 'Unknown Company',
      subtitle: `${r.city}, ${r.state} — ${r.industry || ''}`,
      metadata: { city: r.city, state: r.state, industry: r.industry },
    })),
    total: data?.length || 0,
  };
}

export async function searchAll(params: {
  query?: string; zip?: string; vertical?: string; limit?: number;
}): Promise<Record<EntityType, EntitySearchResult[]>> {
  const [companies, bids, properties] = await Promise.all([
    searchCompanies({ ...params, limit: params.limit ?? 5, offset: 0 }),
    searchBids({ ...params, limit: params.limit ?? 5, offset: 0 }),
    searchProperties({ ...params, limit: params.limit ?? 5, offset: 0 }),
  ]);
  return {
    company: companies.results,
    contact: [],
    property: properties.results,
    permit: [],
    bid: bids.results,
  };
}
