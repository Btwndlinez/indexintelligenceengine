import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const url = 'https://www.slurrywastesolutions.com';
  const results: any[] = [];

  // Step 1: fetch page
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IndexIntelligenceEngine/1.0)' }
    });
    const html = await res.text();
    results.push({ step: 'fetch', status: res.status, length: html.length });

    // extract text
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[^;]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    results.push({ step: 'extract', length: text.length, preview: text.slice(0, 200) });

    // Step 2: send to DeepSeek
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
    const dsStatus = dsRes.status;
    const dsBody = await dsRes.text();
    results.push({ step: 'deepseek', status: dsStatus, body: dsBody.slice(0, 500) });
  } catch (err: any) {
    results.push({ step: 'error', message: err.message, stack: err.stack?.slice(0, 200) });
  }

  return NextResponse.json({ results, apiKey_prefix: apiKey ? apiKey.slice(0, 8) : 'none' });
}
