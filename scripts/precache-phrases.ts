const PHRASES = [
  'Active Bids',
  'Compliance Alerts',
  'Daily Intelligence',
  'Market Intelligence',
  'Industry Index',
  'Win More Contracts',
  'Contractor Intelligence',
  'OSHA Violation Risk',
  'Hard Hats Required',
  'Search Radius',
  'Run Discovery',
  'Source',
  'Score',
  'Grade',
  'Phone',
  'Email',
  'Website',
  'Distance',
  'Pipeline',
  'Campaigns',
  'Reports',
  'Settings',
];

const TARGETS = ['es', 'zh', 'vi', 'tl', 'ko'];

async function translate(text: string, target: string): Promise<string> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_TRANSLATE_API_KEY not set');

  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, target }),
    },
  );
  const data = await res.json();
  return data.data.translations[0].translatedText;
}

async function main() {
  for (const phrase of PHRASES) {
    for (const target of TARGETS) {
      const hash = crypto
        .createHash('sha256')
        .update(phrase.trim().toLowerCase())
        .digest('hex');
      const key = `translation:${target}:${hash}`;

      const existing = await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`,
        {
          headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
        },
      ).then(r => r.json());

      if (existing.result !== null) {
        console.log(`[SKIP] ${key} — already cached`);
        continue;
      }

      const translated = await translate(phrase, target);
      await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/set/${key}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translated),
      });

      console.log(`[CACHED] ${key} → ${translated}`);
    }
  }
  console.log('Done — all phrases pre-cached');
}

import crypto from 'crypto';
main().catch(console.error);
