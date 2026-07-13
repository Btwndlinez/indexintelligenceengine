import { supabaseFetch, supabaseRpc } from '@/core/db';

export interface Subscription {
  id: string;
  organizationId: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  periodStart: string;
  periodEnd: string;
  seats: number;
  features: string[];
}

export interface UsageRecord {
  metric: string;
  used: number;
  limit: number;
  period: string;
}

export async function getSubscription(organizationId: string): Promise<Subscription | null> {
  try {
    const res = await supabaseFetch(`/rest/v1/subscriptions?organization_id=eq.${organizationId}&limit=1`);
    if (res.ok) {
      const data = await res.json();
      if (data?.[0]) return mapSubscription(data[0]);
    }
  } catch { /* fallback */ }
  return null;
}

export async function getUsage(organizationId: string): Promise<UsageRecord[]> {
  try {
    const res = await supabaseRpc('get_org_usage', { p_org_id: organizationId });
    if (res.ok) return await res.json();
  } catch { /* fallback */ }
  return [];
}

export async function upgrade(organizationId: string, plan: string): Promise<boolean> {
  try {
    const res = await supabaseFetch(`/rest/v1/subscriptions?organization_id=eq.${organizationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, status: 'active', updated_at: new Date().toISOString() }),
    });
    return res.ok;
  } catch { return false; }
}

function mapSubscription(row: any): Subscription {
  return {
    id: row.id,
    organizationId: row.organization_id,
    plan: row.plan || 'free',
    status: row.status || 'active',
    periodStart: row.period_start,
    periodEnd: row.period_end,
    seats: row.seats || 1,
    features: row.features || [],
  };
}
