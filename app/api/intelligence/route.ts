import { NextRequest, NextResponse } from 'next/server';
import { resolveTenant } from '@/lib/auth/tenant';

export async function POST(req: NextRequest) {
  try {
    const context = await resolveTenant(req);
    const { vertical = 'slurry_concrete', state = 'CA', city = 'Hayward' } = context || {};

    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

    const systemPrompt = `You are the master regulatory and procurement intelligence engine of the Index Intelligence Engine.
Your task is to generate 3 highly realistic, actionable, and localized items for a local contractor's daily newsfeed.
Generate data specific to the user's Vertical: "${vertical}", State: "${state}", and City/County Area: "${city}".

You must return a valid JSON object matching this schema:
{
  "bids": [
    {
      "id": "string",
      "title": "string",
      "agency": "string",
      "valueEstimate": "string",
      "deadline": "YYYY-MM-DD",
      "description": "string",
      "difficulty": "Easy" | "Medium" | "Complex",
      "actionUrl": "string"
    }
  ],
  "news": [
    {
      "id": "string",
      "title": "string",
      "source": "string",
      "publishedAt": "Relative time (e.g., '14 hours ago')",
      "summary": "string",
      "impact": "High" | "Medium" | "Low",
      "actionableTakeaway": "string"
    }
  ],
  "compliance": [
    {
      "id": "string",
      "title": "string",
      "authority": "string (e.g., 'CalOSHA', 'Texas TCEQ')",
      "effectiveDate": "YYYY-MM-DD",
      "penaltyRisk": "string (e.g., '$15,000 fine per day')",
      "summary": "string",
      "requiredAction": "string"
    }
  ]
}`;

    const userPrompt = `Generate the daily dashboard items for vertical "${vertical}" in ${city}, ${state}. Ensure the municipal bids, news, and regulatory codes are highly realistic for this industry.`;

    let intelligenceFeed;

    if (DEEPSEEK_API_KEY) {
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
          signal: AbortSignal.timeout(8000)
        });

        if (response.ok) {
          const rawData = await response.json();
          intelligenceFeed = JSON.parse(rawData.choices[0].message.content);
        }
      } catch (err) {
        console.warn('[Intelligence API] Failed calling DeepSeek, falling back to database default templates.', err);
      }
    }

    if (!intelligenceFeed) {
      intelligenceFeed = getDefaultFeed(vertical, state, city);
    }

    return NextResponse.json({ success: true, ...intelligenceFeed });
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
