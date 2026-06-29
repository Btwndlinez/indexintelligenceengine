import { NextRequest, NextResponse } from 'next/server';
import { getCachedFeed, setCachedFeed } from '@/lib/intelligence/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const vertical = req.headers.get('x-iie-client-context') || 'slurry_concrete';
    const state = body.state || 'CA';
    const city = body.city || 'Hayward';

    const cachedBids = await getCachedFeed(vertical, state, 'bids');
    const cachedNews = await getCachedFeed(vertical, state, 'news');
    const cachedCompliance = await getCachedFeed(vertical, state, 'compliance');

    if (cachedBids && cachedNews && cachedCompliance) {
      return NextResponse.json({
        success: true,
        source: 'cache',
        bids: cachedBids,
        news: cachedNews,
        compliance: cachedCompliance,
      });
    }

    const feed = getDefaultFeed(vertical, state, city);

    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    if (DEEPSEEK_API_KEY) {
      const systemPrompt = `You are the master regulatory and procurement intelligence engine of the Index Intelligence Engine.
Your task is to generate 3 highly realistic, actionable, and localized items for a local contractor's daily newsfeed.
Generate data specific to the user's Vertical: "${vertical}", State: "${state}", and City/County Area: "${city}".

You must return a valid JSON object matching this schema:
{
  "bids": [...],
  "news": [...],
  "compliance": [...]
}`;

      const userPrompt = `Generate the daily dashboard items for vertical "${vertical}" in ${city}, ${state}. Ensure the municipal bids, news, and regulatory codes are highly realistic for this industry.`;

      fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2
        }),
        signal: AbortSignal.timeout(5000)
      })
        .then(res => res.json())
        .then(async raw => {
          const aiFeed = JSON.parse(raw.choices[0].message.content);
          if (!aiFeed || !aiFeed.bids) return;
          await Promise.all([
            setCachedFeed(vertical, state, 'bids', aiFeed.bids),
            setCachedFeed(vertical, state, 'news', aiFeed.news),
            setCachedFeed(vertical, state, 'compliance', aiFeed.compliance),
          ]);
          console.log('[Intelligence] DeepSeek enrichment cached');
        })
        .catch(err => console.warn('[Intelligence] DeepSeek enrichment failed:', err));
    }

    return NextResponse.json({ success: true, source: 'default', ...feed });
  } catch (error: any) {
    console.error('[Daily Intelligence Route] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function getDefaultFeed(vertical: string, state: string, city: string) {
  return {
    bids: [
      {
        id: "bid-1092",
        title: `Municipal Drainage & Concrete Slurry Waste Removal`,
        agency: `${city} Department of Public Works`,
        valueEstimate: "$45,000 - $75,000",
        deadline: "2026-07-15",
        description: `Contract to collect, filter, and legally recycle concrete slurry and drilling runoff resulting from the Downtown Street Rehabilitation Program.`,
        difficulty: "Medium",
        actionUrl: "#"
      },
      {
        id: "bid-1093",
        title: `Commercial Kitchen Grease Trap Extraction Services`,
        agency: `${state} Correctional Facility Procurement`,
        valueEstimate: "$120,000 Recurring",
        deadline: "2026-07-28",
        description: `Quarterly pumping, cleaning, and waste treatment tracking of 18 dual-chamber commercial grease interceptors across state properties.`,
        difficulty: "Complex",
        actionUrl: "#"
      }
    ],
    news: [
      {
        id: "news-31",
        title: "Industrial Slurry Processing Costs Projected to Spike 12% in Q3",
        source: "Southeastern Environmental Journal",
        publishedAt: "8 hours ago",
        summary: "Regional landfill consolidations and stricter state water filtrate limits are forcing third-party disposal operators to raise gate fees starting next month.",
        impact: "High",
        actionableTakeaway: "Directly adjust out-of-county quote pricing on prospective bids to preserve service operating margins."
      },
      {
        id: "news-32",
        title: "Ready-Mix Concrete Volume Up 8% Year-Over-Year",
        source: "Concrete Producers Association",
        publishedAt: "1 day ago",
        summary: "Residential foundation poured volumes have climbed back, creating localized service backlogs and highly consistent washwater and slurry volume generation.",
        impact: "Medium",
        actionableTakeaway: "Focus outbound campaigns on local ready-mix fleets who need faster washwater recycling solutions."
      }
    ],
    compliance: [
      {
        id: "comp-401",
        title: "Rule 1148 - Strict Filtration Requirements for Slurry Wastewater",
        authority: "Regional Quality Control Board",
        effectiveDate: "2026-08-01",
        penaltyRisk: "$25,000 Per-day Non-Compliance Fines",
        summary: "Mandates that water separated from slurry concrete cannot be discharged directly into industrial sewer lines without pre-filtration treatment down to <100 NTU turbidity.",
        requiredAction: "Verify secondary filtration steps on mobile trucks and adjust on-site chemical pH treatment setups before inspectors perform audits next week."
      }
    ]
  };
}
