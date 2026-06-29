import { SignalLayers } from '@/types/config';

export class KeywordSignalExtractor {
  extract(
    companyName: string | undefined,
    notes: string | undefined,
    signals: SignalLayers,
    equipmentKeywords: string[]
  ): { hasSignals: boolean; capabilitySummary: string } {
    const text = `${companyName || ''} ${notes || ''}`.toLowerCase();
    const matched = new Set<string>();

    for (const s of signals.primary) {
      if (text.includes(s.term.toLowerCase())) matched.add(s.term);
    }
    for (const s of signals.secondary) {
      if (text.includes(s.term.toLowerCase())) matched.add(s.term);
    }
    for (const keyword of equipmentKeywords) {
      if (text.includes(keyword.toLowerCase())) matched.add(keyword);
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
