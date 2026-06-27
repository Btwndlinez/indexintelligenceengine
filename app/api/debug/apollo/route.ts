import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.APOLLO_API_KEY;
  const domains = ['bayareaconcreterecycling.com', 'tri-ced.org', 'norcalrock.com'];

  const results = [];
  for (const domain of domains) {
    try {
      const res = await fetch('https://api.apollo.io/v1/organizations/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'Api-Key': apiKey! },
        body: JSON.stringify({ domain }),
      });
      const status = res.status;
      const text = await res.text();
      results.push({ domain, status, body: text.slice(0, 300) });
    } catch (err: any) {
      results.push({ domain, error: err.message });
    }
  }

  return NextResponse.json({ results });
}
