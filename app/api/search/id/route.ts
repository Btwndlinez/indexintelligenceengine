import { NextRequest, NextResponse } from 'next/server';
import { resolveTenant } from '@/lib/auth/tenant';
import { validate, uuidSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

interface SavedSearchRecord {
  id: string;
  organization_id: string;
  vertical_slug: string;
  filters: Record<string, unknown>;
  result_count: number;
  created_at: string;
}

const inMemoryFallback: SavedSearchRecord[] = [];

export async function POST(req: NextRequest) {
  try {
    const tenant = await resolveTenant(req);
    if (tenant instanceof NextResponse) return tenant;

    const body = await req.json();
    const parsed = validate(z.object({ id: uuidSchema }), body);
    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { id } = parsed.data!;

    if (!SUPABASE_URL() || !SERVICE_KEY()) {
      const entry = inMemoryFallback.find(s => s.id === id);
      if (!entry) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        search: {
          id: entry.id,
          organizationId: entry.organization_id,
          verticalSlug: entry.vertical_slug,
          filters: entry.filters,
          resultCount: entry.result_count,
          createdAt: entry.created_at
        }
      });
    }

    const res = await fetch(`${SUPABASE_URL()}/rest/v1/saved_searches?id=eq.${id}`, {
      headers: {
        'apikey': SERVICE_KEY()!,
        'Authorization': `Bearer ${SERVICE_KEY()!}`
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const data: SavedSearchRecord[] = await res.json();
    const row = data[0];
    if (!row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      search: {
        id: row.id,
        organizationId: row.organization_id,
        verticalSlug: row.vertical_slug,
        filters: row.filters,
        resultCount: row.result_count,
        createdAt: row.created_at
      }
    });
  } catch (err) {
    logger.error('Search id route error', { route: 'search/id', error: String(err) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
