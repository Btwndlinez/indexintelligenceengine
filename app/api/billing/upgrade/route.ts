import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resolveTenant } from '@/lib/auth/tenant';
import { validate } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { requireRole } from '@/lib/auth/permissions';

const upgradeSchema = z.object({
  planTier: z.enum(['starter', 'pro', 'enterprise']),
});

const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

declare global {
  var __iie_subscription:
    | { planTier: string; status: string; currentPeriodEnd: string }
    | undefined;
}

export async function POST(req: NextRequest) {
  try {
    const tenant = await resolveTenant(req);
    if (tenant instanceof NextResponse) return tenant;

    const roleCheck = requireRole(tenant, 'ADMIN');
    if (roleCheck !== true) return roleCheck;

    const body = await req.json();
    const parsed = validate(upgradeSchema, body);
    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { planTier } = parsed.data!;

    if (SUPABASE_URL() && SERVICE_KEY()) {
      try {
        await fetch(`${SUPABASE_URL()}/rest/v1/subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SERVICE_KEY()!,
            Authorization: `Bearer ${SERVICE_KEY()!}`,
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            organization_id: tenant.organizationId,
            plan_tier: planTier,
            status: 'active',
            current_period_end: new Date(
              Date.now() + 30 * 86400000,
            ).toISOString(),
          }),
        });
      } catch {
        // fall through to in-memory
      }
    }

    globalThis.__iie_subscription = {
      planTier,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
    };

    return NextResponse.json({
      success: true,
      subscription: {
        planTier: globalThis.__iie_subscription.planTier,
        status: globalThis.__iie_subscription.status,
      },
    });
  } catch (err: any) {
    logger.error('Billing upgrade route error', {
      route: 'billing/upgrade',
      error: String(err),
    });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
