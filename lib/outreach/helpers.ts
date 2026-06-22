import { logger } from '@/lib/logger';

const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

const inMemoryLogs: any[] = [];

export async function logOutreach(params: {
  organizationId: string;
  companyId: string;
  contactId?: string;
  interactionType: 'CALL' | 'EMAIL' | 'LINKEDIN' | 'NOTE';
  outcome: string;
  notes?: string;
}): Promise<any> {
  const entry = {
    id: `outreach-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...params,
    createdAt: new Date().toISOString()
  };

  if (!SUPABASE_URL() || !SERVICE_KEY()) {
    inMemoryLogs.unshift(entry);
    return entry;
  }

  try {
    const res = await fetch(`${SUPABASE_URL()}/rest/v1/rpc/log_outreach_interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY()!,
        'Authorization': `Bearer ${SERVICE_KEY()!}`,
      },
      body: JSON.stringify({
        p_org_id: params.organizationId,
        p_company_id: params.companyId,
        p_contact_id: params.contactId || null,
        p_interaction_type: params.interactionType,
        p_outcome: params.outcome,
        p_notes: params.notes || null
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    logger.error('Outreach log DB failed', { route: 'outreach/helpers', error: String(err) });
  }

  inMemoryLogs.unshift(entry);
  return entry;
}

export async function getCompanyOutreach(companyId: string): Promise<any[]> {
  if (!SUPABASE_URL() || !SERVICE_KEY()) {
    return inMemoryLogs.filter(l => l.companyId === companyId);
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL()}/rest/v1/outreach_logs?company_id=eq.${companyId}&order=created_at.desc`,
      {
        headers: {
          'apikey': SERVICE_KEY()!,
          'Authorization': `Bearer ${SERVICE_KEY()!}`,
        }
      }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    logger.error('Outreach get DB failed', { route: 'outreach/helpers', error: String(err) });
  }

  return inMemoryLogs.filter(l => l.companyId === companyId);
}
