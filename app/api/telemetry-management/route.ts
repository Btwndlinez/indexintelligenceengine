import { NextRequest, NextResponse } from 'next/server';
import { getVerticalConfigByDomain } from '@/lib/market/registry';
import { SystemObservabilityStats } from '@/types/rpc_telemetry';

const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

function checkCreds(): boolean {
  return !!(SUPABASE_URL() && SERVICE_KEY());
}

async function callRPC(functionName: string, payload: Record<string, any>): Promise<any> {
  const res = await fetch(`${SUPABASE_URL()}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY()!,
      'Authorization': `Bearer ${SERVICE_KEY()!}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RPC ${functionName} failed: ${text}`);
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, verticalConfig, auditPayload } = body;

    const clientHeader = req.headers.get('x-iie-client-context');
    if (!clientHeader) {
      return NextResponse.json(
        { error: 'X-IIE-Client-Context validation identity token missing.' },
        { status: 401 }
      );
    }

    const tenantConfig = await getVerticalConfigByDomain(clientHeader);
    if (!tenantConfig) {
      return NextResponse.json(
        { error: 'Unregistered or inactive client configuration context.' },
        { status: 403 }
      );
    }

    if (!checkCreds()) {
      return NextResponse.json({
        success: true,
        note: 'Supabase credentials not configured. Telemetry and CRUD management unavailable.',
        actions: { stats: null, verticalId: null, auditResult: null }
      });
    }

    if (action === 'get-telemetry') {
      const data = await callRPC('get_system_observability_dashboard_by_org', {
        p_org_id: tenantConfig.id
      });

      const row = Array.isArray(data) ? data[0] : data;
      const stats: SystemObservabilityStats = {
        totalApiCalls: Number(row?.total_api_calls || 0),
        accumulatedCost: Number(Number(row?.accumulated_cost || 0).toFixed(6)),
        averageLatencyMs: Number(Number(row?.average_latency_ms || 0).toFixed(2)),
        averageGeminiLatencyMs: Number(Number(row?.average_gemini_latency_ms || 0).toFixed(2)),
        googleCalls: Number(row?.google_calls || 0),
        apolloCalls: Number(row?.apollo_calls || 0),
        geminiCalls: Number(row?.gemini_calls || 0),
        adapterCalls: Number(row?.adapter_calls || 0),
        failureRatePercentage: Number(Number(row?.failure_rate_percentage || 0).toFixed(2)),
        latencyByProvider: row?.latency_by_provider || {}
      };

      return NextResponse.json({ success: true, stats });
    }

    if (action === 'upsert-vertical') {
      if (!verticalConfig || !verticalConfig.slug || !verticalConfig.industryName) {
        return NextResponse.json({ error: 'Incomplete parameters to create vertical profile configuration.' }, { status: 400 });
      }

      const data = await callRPC('upsert_vertical_configuration_by_org', {
        p_org_id: tenantConfig.id,
        p_slug: verticalConfig.slug,
        p_industry_name: verticalConfig.industryName,
        p_target_naics_codes: verticalConfig.targetNaicsCodes || [],
        p_equipment_keywords: verticalConfig.equipmentKeywords || [],
        p_negative_keywords: verticalConfig.negativeKeywords || [],
        p_search_queries: verticalConfig.searchQueries || [],
        p_base_scoring_weights: verticalConfig.baseScoringWeights || {
          distanceWeight: 30,
          contactEnrichmentWeight: 40,
          assetSignalWeight: 30
        }
      });

      return NextResponse.json({
        success: true,
        verticalId: data,
        message: `Vertical '${verticalConfig.industryName}' saved successfully.`
      });
    }

    if (action === 'log-audit') {
      if (!auditPayload || !auditPayload.providerName || !auditPayload.actionPerformed) {
        return NextResponse.json({ error: 'Audit metric is missing core latency payload arrays.' }, { status: 400 });
      }

      const insertRes = await fetch(`${SUPABASE_URL()}/rest/v1/provider_audits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_KEY()!,
          'Authorization': `Bearer ${SERVICE_KEY()!}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          organization_id: tenantConfig.id,
          vertical_id: tenantConfig.id,
          provider_name: auditPayload.providerName,
          action_performed: auditPayload.actionPerformed,
          latency_ms: Number(auditPayload.latencyMs || 0),
          tokens_consumed: Number(auditPayload.tokensConsumed || 0),
          estimated_cost: Number(auditPayload.estimatedCost || 0.0),
          is_success: auditPayload.isSuccess !== false,
          error_message: auditPayload.errorMessage || null
        })
      });

      if (!insertRes.ok) {
        const errText = await insertRes.text();
        return NextResponse.json({ error: 'Error committing telemetry audit trace.', details: errText }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Telemetry audit locked successfully.' });
    }

    return NextResponse.json(
      { error: `Requested route action '${action}' is not registered.` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
