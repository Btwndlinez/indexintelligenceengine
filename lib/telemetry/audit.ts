import { logger } from '@/lib/logger';

export type ProviderName = 'google_places' | 'apollo' | 'gemini_grounding' | 'system_adapter';

export interface AuditEntry {
  organizationId: string;
  verticalId: string;
  providerName: ProviderName;
  actionPerformed: string;
  latencyMs: number;
  tokensConsumed?: number;
  estimatedCost?: number;
  isSuccess: boolean;
  errorMessage?: string;
}

const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Write a provider audit entry to the database via REST API.
 * Errors are logged but never thrown (fire-and-forget).
 */
export async function writeAudit(entry: AuditEntry): Promise<void> {
  if (!SUPABASE_URL() || !SERVICE_KEY()) {
    logger.debug('Audit skipped: Supabase credentials not configured', {
      route: 'telemetry/audit',
      data: { provider: entry.providerName, action: entry.actionPerformed }
    });
    return;
  }

  try {
    await fetch(`${SUPABASE_URL()}/rest/v1/provider_audits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY()!,
        'Authorization': `Bearer ${SERVICE_KEY()!}`,
      },
      body: JSON.stringify({
        organization_id: entry.organizationId,
        vertical_id: entry.verticalId,
        provider_name: entry.providerName,
        action_performed: entry.actionPerformed,
        latency_ms: entry.latencyMs,
        tokens_consumed: entry.tokensConsumed || 0,
        estimated_cost: entry.estimatedCost || 0,
        is_success: entry.isSuccess,
        error_message: entry.errorMessage || null
      })
    });
  } catch (err) {
    logger.error('Failed to write provider audit', {
      route: 'telemetry/audit',
      error: String(err)
    });
  }
}

/**
 * Wraps an async operation with automatic audit logging.
 * Records duration and success/failure.
 */
export async function audit<T>(
  providerName: ProviderName,
  actionPerformed: string,
  ctx: { organizationId: string; verticalId: string },
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  let isSuccess = true;
  let errorMessage: string | undefined;

  try {
    return await fn();
  } catch (err) {
    isSuccess = false;
    errorMessage = String(err);
    throw err;
  } finally {
    const latencyMs = Date.now() - start;
    writeAudit({
      organizationId: ctx.organizationId,
      verticalId: ctx.verticalId,
      providerName,
      actionPerformed,
      latencyMs,
      isSuccess,
      errorMessage
    });
  }
}
