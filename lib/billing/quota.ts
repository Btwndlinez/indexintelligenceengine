import { logger } from '@/lib/logger';

const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

export interface QuotaResult {
  allowed: boolean;
  current: number;
  limit: number;
}

export async function checkQuota(organizationId: string, eventType: string): Promise<QuotaResult> {
  if (!SUPABASE_URL() || !SERVICE_KEY()) {
    return { allowed: true, current: 0, limit: 999999 };
  }

  try {
    const [usageRes, limitsRes] = await Promise.all([
      fetch(`${SUPABASE_URL()}/rest/v1/rpc/get_tenant_metrics_by_org`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_KEY()!,
          'Authorization': `Bearer ${SERVICE_KEY()!}`,
        },
        body: JSON.stringify({ p_org_id: organizationId })
      }),
      fetch(`${SUPABASE_URL()}/rest/v1/billing_limits`, {
        headers: {
          'apikey': SERVICE_KEY()!,
          'Authorization': `Bearer ${SERVICE_KEY()!}`,
        }
      })
    ]);

    if (!usageRes.ok || !limitsRes.ok) {
      return { allowed: true, current: 0, limit: 999999 };
    }

    const usage = await usageRes.json();
    const limits = await limitsRes.json();

    const plan = usage[0]?.plan_tier || 'starter';
    const tierLimits = limits.find((l: any) => l.plan_tier === plan);
    if (!tierLimits) return { allowed: true, current: 0, limit: 999999 };

    const eventCount = usage[0]?.[`${eventType}_count`] || 0;
    const maxField = eventType === 'search' ? 'max_searches'
      : eventType === 'enrichment' ? 'max_enrichments'
      : eventType === 'export' ? 'max_exports'
      : eventType === 'campaign' ? 'max_campaigns'
      : null;

    if (!maxField) return { allowed: true, current: 0, limit: 999999 };

    const limit = tierLimits[maxField] || 999999;

    return {
      allowed: eventCount < limit,
      current: eventCount,
      limit
    };
  } catch (err) {
    logger.error('Quota check failed', { route: 'billing/quota', error: String(err) });
    return { allowed: true, current: 0, limit: 999999 };
  }
}

export async function incrementUsage(organizationId: string, eventType: string, units = 1): Promise<void> {
  if (!SUPABASE_URL() || !SERVICE_KEY()) return;

  try {
    await fetch(`${SUPABASE_URL()}/rest/v1/usage_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY()!,
        'Authorization': `Bearer ${SERVICE_KEY()!}`,
      },
      body: JSON.stringify({
        organization_id: organizationId,
        event_type: eventType,
        units
      })
    });
  } catch (err) {
    logger.error('Usage increment failed', { route: 'billing/quota', error: String(err) });
  }
}
