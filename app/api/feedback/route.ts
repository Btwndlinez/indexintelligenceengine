import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyId, companyName, vertical, accurate, score, signals } = body;

    if (!companyId || !vertical || accurate === undefined) {
      return NextResponse.json({ error: 'Missing required fields: companyId, vertical, accurate' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      await fetch(`${supabaseUrl}/rest/v1/search_feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          company_id: companyId,
          company_name: companyName || null,
          vertical,
          accurate,
          score: score ?? null,
          signals: signals || null,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vertical = searchParams.get('vertical');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ total: 0, accurate: 0, inaccurate: 0, rate: 0 });
    }

    let url = `${supabaseUrl}/rest/v1/search_feedback?select=accurate,score`;
    if (vertical) {
      url += `&vertical=eq.${encodeURIComponent(vertical)}`;
    }

    const res = await fetch(url, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ total: 0, accurate: 0, inaccurate: 0, rate: 0 });
    }

    const rows = await res.json();
    const total = rows.length;
    const accurate = rows.filter((r: any) => r.accurate === true).length;
    const inaccurate = total - accurate;
    const rate = total > 0 ? Math.round((accurate / total) * 100) : 0;

    return NextResponse.json({ total, accurate, inaccurate, rate });
  } catch (err) {
    return NextResponse.json({ total: 0, accurate: 0, inaccurate: 0, rate: 0 });
  }
}
