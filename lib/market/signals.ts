import { SignalLayers } from '@/types/config';
import { positiveMatch, negativeMatch } from './signalMatch';

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
    const matched = new Set<string>();
    const negatives = new Set<string>();

    for (const s of signals.primary) {
      if (positiveMatch(s.term, text)) matched.add(s.term);
    }

    for (const s of signals.secondary) {
      if (positiveMatch(s.term, text)) matched.add(s.term);
    }

    for (const keyword of equipmentKeywords) {
      if (positiveMatch(keyword, text)) matched.add(keyword);
    }

    for (const s of signals.negative) {
      if (negativeMatch(s.term, text)) negatives.add(s.term);
    }

    return {
      hasSignals: matched.size > 0,
      capabilitySummary: Array.from(matched).join(', '),
      matchedSignals: Array.from(matched),
      negativeHits: Array.from(negatives),
    };
  }
}
