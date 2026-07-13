import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/core/services';

export async function POST(req: NextRequest) {
  try {
    const { model, messages, temperature, max_tokens, response_format } = await req.json();
    const data = await ai.chat(messages, { model, temperature, max_tokens, response_format });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[AI Chat] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
