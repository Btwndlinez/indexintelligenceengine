import { logger } from '@/lib/logger';

export interface ProviderMetrics {
  totalCalls: number;
  successCount: number;
  failureCount: number;
  avgLatencyMs: number;
  totalCost: number;
}

/**
 * Aggregate metrics from provider_audits via the telemetry RPC.
 * Uses the service-role companion to bypass auth.
 */
export async function getProviderMetrics(organizationId: string): Promise<Record<string, ProviderMetrics>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return {};
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_system_observability_dashboard_by_org`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      },
      body: JSON.stringify({ p_org_id: organizationId })
    });

    if (!res.ok) return {};

    const data = await res.json();
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return {};

    const byProvider = row.latency_by_provider || {};
    const result: Record<string, ProviderMetrics> = {};

    for (const [provider, info] of Object.entries(byProvider)) {
      const i = info as any;
      result[provider] = {
        totalCalls: 0,
        successCount: 0,
        failureCount: 0,
        avgLatencyMs: i.avg_latency || 0,
        totalCost: i.total_cost || 0
      };
    }

    return result;
  } catch (err) {
    logger.error('Failed to fetch provider metrics', {
      route: 'telemetry/metrics',
      error: String(err)
    });
    return {};
  }
}
