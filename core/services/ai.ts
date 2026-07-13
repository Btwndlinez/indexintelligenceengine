const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

export interface AIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' | 'text' };
}

export interface AIChatResponse {
  choices: { message: { content: string }; finish_reason: string }[];
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

export async function chat(messages: AIChatMessage[], options: AIChatOptions = {}): Promise<AIChatResponse> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY not configured');
  }

  const body: Record<string, any> = {
    model: options.model || process.env.NEXT_PUBLIC_COPILOT_MODEL || 'meta/llama-3.1-8b-instruct',
    messages,
    temperature: options.temperature ?? 0.2,
    max_tokens: options.max_tokens ?? 2048,
  };

  if (options.response_format) {
    body.response_format = options.response_format;
  }

  const res = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`NVIDIA API error ${res.status}: ${errText}`);
  }

  return res.json();
}

export async function chatText(messages: AIChatMessage[], options: AIChatOptions = {}): Promise<string> {
  const response = await chat(messages, options);
  return response.choices?.[0]?.message?.content || '';
}

export async function chatJSON<T = Record<string, unknown>>(messages: AIChatMessage[], options: AIChatOptions = {}): Promise<T> {
  const content = await chatText(messages, { ...options, response_format: { type: 'json_object' } });
  try {
    return JSON.parse(content) as T;
  } catch {
    throw new Error(`AI returned invalid JSON: ${content}`);
  }
}
