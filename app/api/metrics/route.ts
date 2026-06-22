import { NextRequest, NextResponse } from 'next/server';
import { getVerticalConfigByDomain } from '@/lib/market/registry';
import { TenantPipelineMetrics } from '@/types/rpc';

export async function POST(req: NextRequest) {
  try {
    const clientHeader = req.headers.get('x-iie-client-context');
    if (!clientHeader) {
      return NextResponse.json(
        { error: 'X-IIE-Client-Context origin context must be specified.' },
        { status: 401 }
      );
    }

    const verticalConfig = await getVerticalConfigByDomain(clientHeader);
    if (!verticalConfig) {
      return NextResponse.json(
        { error: 'Unregistered or inactive vertical context signature.' },
        { status: 403 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        success: true,
        note: 'Supabase credentials not configured. Live database metrics unavailable.',
        tenantId: verticalConfig.id,
        industryName: verticalConfig.industryName,
        metrics: null
      });
    }

    const rpcResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/get_tenant_metrics_by_org`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({ p_org_id: verticalConfig.id })
      }
    );

    if (!rpcResponse.ok) {
      const errorText = await rpcResponse.text();
      return NextResponse.json({
        success: false,
        error: 'Database analytical RPC call failed.',
        details: errorText
      }, { status: 502 });
    }

    const dbMetrics = await rpcResponse.json();
    const row = Array.isArray(dbMetrics) ? dbMetrics[0] : dbMetrics;

    const formattedMetrics: TenantPipelineMetrics = {
      totalLeads: Number(row?.total_leads || 0),
      priorityALeads: Number(row?.priority_a_leads || 0),
      priorityBLeads: Number(row?.priority_b_leads || 0),
      priorityCLeads: Number(row?.priority_c_leads || 0),
      contactEnrichmentPercentage: Number(row?.contact_enrichment_percentage || 0),
      contactedLeads: Number(row?.contacted_leads || 0),
      interestedLeads: Number(row?.interested_leads || 0),
      wonDeals: Number(row?.won_deals || 0),
      pipelineConversionRate: Number(row?.pipeline_conversion_rate || 0)
    };

    return NextResponse.json({
      success: true,
      tenantId: verticalConfig.id,
      industryName: verticalConfig.industryName,
      metrics: formattedMetrics
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
