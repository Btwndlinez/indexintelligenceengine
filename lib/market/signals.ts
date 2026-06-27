export class KeywordSignalExtractor {
  extract(
    companyName: string | undefined,
    notes: string | undefined,
    verticalSignals: string[],
    equipmentKeywords: string[]
  ): { hasSignals: boolean; capabilitySummary: string } {
    const text = `${companyName || ''} ${notes || ''}`.toLowerCase();
    const matched = new Set<string>();

    for (const signal of [...verticalSignals, ...equipmentKeywords]) {
      if (text.includes(signal.toLowerCase())) {
        matched.add(signal);
      }
    }

    if (matched.size === 0) {
      return { hasSignals: false, capabilitySummary: '' };
    }

    return {
      hasSignals: true,
      capabilitySummary: Array.from(matched).join(', '),
    };
  }
}
