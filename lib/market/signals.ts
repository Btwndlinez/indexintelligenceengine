import { SignalLayers } from '@/types/config';

export class KeywordSignalExtractor {
  extract(
    text: string,
    signals: SignalLayers,
    equipmentKeywords: string[]
  ): {
    hasSignals: boolean;
    capabilitySummary: string;
    matchedSignals: string[];
    negativeHits: string[];
  } {
    const normalized = (text || '').toLowerCase();

    const matched = new Set<string>();
    const negatives = new Set<string>();

    for (const s of signals.primary) {
      if (normalized.includes(s.term.toLowerCase())) matched.add(s.term);
    }

    for (const s of signals.secondary) {
      if (normalized.includes(s.term.toLowerCase())) matched.add(s.term);
    }

    for (const keyword of equipmentKeywords) {
      if (normalized.includes(keyword.toLowerCase())) matched.add(keyword);
    }

    for (const s of signals.negative) {
      if (normalized.includes(s.term.toLowerCase())) negatives.add(s.term);
    }

    return {
      hasSignals: matched.size > 0,
      capabilitySummary: Array.from(matched).join(', '),
      matchedSignals: Array.from(matched),
      negativeHits: Array.from(negatives),
    };
  }
}
