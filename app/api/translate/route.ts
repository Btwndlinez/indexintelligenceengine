import { NextRequest, NextResponse } from 'next/server';
import { getCachedTranslation, setCachedTranslation } from '@/lib/translation/cache';

export async function POST(req: NextRequest) {
  try {
    const { text, target = 'es' } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    const cached = await getCachedTranslation(text, target);
    if (cached !== null) {
      return NextResponse.json({ success: true, translatedText: cached, source: 'cache' });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Translation service not configured' }, { status: 501 });
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, target }),
      },
    );

    const data = await response.json();
    const translated = data.data.translations[0].translatedText;

    await setCachedTranslation(text, target, translated);

    return NextResponse.json({ success: true, translatedText: translated, source: 'google' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
