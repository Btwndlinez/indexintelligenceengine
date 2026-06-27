import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const urls = [
    'https://www.slurrywastesolutions.com',
    'https://httpbin.org/get',
    'https://example.com',
    'http://www.slurrywastesolutions.com',
  ];
  const results: any[] = [];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IndexIntelligenceEngine/1.0)' }
      });
      const html = await res.text();
      results.push({ url, step: 'fetch', status: res.status, length: html.length });
    } catch (err: any) {
      results.push({ url, step: 'fetch_error', message: err.message, cause: err.cause?.message || 'none' });
    }
  }

  // If we got content from slurry, try DeepSeek
  const slurryResult = results.find(r => r.url === 'https://www.slurrywastesolutions.com' && r.step === 'fetch');
  if (slurryResult) {
    try {
      const res = await fetch('https://www.slurrywastesolutions.com', {
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IndexIntelligenceEngine/1.0)' }
      });
      const html = await res.text();
      const text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[^;]+;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const body = {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a business intelligence analyst. Respond in JSON only.' },
          { role: 'user', content: `Website content:\n${text.slice(0, 3000)}\n\nDoes this company offer slurry recycling or concrete washout? Return JSON: { "relevant": boolean, "confidence": 0-100, "summaryNotes": string }` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      };

      const dsRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify(body),
      });
      const dsBody = await dsRes.text();
      results.push({ step: 'deepseek', status: dsRes.status, body: dsBody.slice(0, 500) });
    } catch (err: any) {
      results.push({ step: 'deepseek_error', message: err.message });
    }
  }

  return NextResponse.json({ results, apiKey_prefix: apiKey ? apiKey.slice(0, 8) : 'none' });
}
