import { Company } from '@/types/company';

export class GeminiScraperAdapter {
  name = 'gemini_native_scraper';

  async scanForSignals(
    websiteUrl: string | undefined,
    equipmentKeywords: string[]
  ): Promise<{ hasSignals: boolean; capabilitySummary: string }> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || !websiteUrl) {
      return { hasSignals: false, capabilitySummary: '' };
    }

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

      const promptText = `
        Analyze this company website: ${websiteUrl}
        We need to identify whether this facility manages industrial operations related to these targets: ${equipmentKeywords.join(', ')}.
        Provide an objective, detailed summarization of their capabilities, specialized equipment listed, or logistics parameters.
      `;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          tools: [{ google_search: {} }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                hasCapability: { type: "BOOLEAN" },
                foundEquipmentSignals: { type: "ARRAY", items: { type: "STRING" } },
                summaryNotes: { type: "STRING" }
              },
              required: ["hasCapability", "foundEquipmentSignals", "summaryNotes"]
            }
          }
        })
      });

      if (!response.ok) {
        return { hasSignals: false, capabilitySummary: '' };
      }

      const result = await response.json();
      const rawPayload = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawPayload) {
        return { hasSignals: false, capabilitySummary: '' };
      }

      const parsed = JSON.parse(rawPayload);
      return {
        hasSignals: parsed.hasCapability || parsed.foundEquipmentSignals.length > 0,
        capabilitySummary: parsed.summaryNotes || parsed.foundEquipmentSignals?.join(', ') || ''
      };
    } catch (err) {
      console.error('Gemini Scraper grounding pipeline broke:', err);
      return { hasSignals: false, capabilitySummary: '' };
    }
  }
}
