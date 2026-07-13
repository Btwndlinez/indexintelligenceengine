import { supabaseFetch } from '@/core/db';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  verticals: string[];
  createdAt: string;
  updatedAt: string;
}

export async function getCurrent(userId: string): Promise<Organization | null> {
  try {
    const res = await supabaseFetch(`/rest/v1/organizations?users=cs.{${userId}}&limit=1`);
    if (res.ok) {
      const data = await res.json();
      if (data?.[0]) return mapOrg(data[0]);
    }
  } catch { /* fallback */ }
  return null;
}

export async function getById(id: string): Promise<Organization | null> {
  try {
    const res = await supabaseFetch(`/rest/v1/organizations?id=eq.${id}&limit=1`);
    if (res.ok) {
      const data = await res.json();
      if (data?.[0]) return mapOrg(data[0]);
    }
  } catch { /* fallback */ }
  return null;
}

export async function create(params: { name: string; slug: string; userId: string }): Promise<Organization | null> {
  try {
    const res = await supabaseFetch('/rest/v1/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({ name: params.name, slug: params.slug, users: [params.userId] }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.[0]) return mapOrg(data[0]);
    }
  } catch { /* fallback */ }
  return null;
}

export async function update(id: string, params: Partial<Organization>): Promise<boolean> {
  try {
    const res = await supabaseFetch(`/rest/v1/organizations?id=eq.${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.ok;
  } catch { return false; }
}

function mapOrg(row: any): Organization {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    plan: row.plan || 'free',
    verticals: row.verticals || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
