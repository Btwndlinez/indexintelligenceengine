import { Company } from '@/types/company';
import { VerticalConfig } from '@/types/config';

export interface ScoreResult {
  score: number;
  priority: 'A' | 'B' | 'C' | 'D';
  matchedSignals: string[];
  negativeHits: string[];
}

export function calculateLeadScore(
  company: Partial<Company>,
  config: VerticalConfig,
  textToAnalyze: string,
  distanceMiles?: number
): ScoreResult {
  let score = 0;
  const matchedSignals: string[] = [];
  const negativeHits: string[] = [];

  const checkSignal = (term: string) => {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'i');
    return regex.test(textToAnalyze);
  };

  // 1. Primary signals — strongest buyer intent
  for (const sig of config.signals.primary) {
    if (checkSignal(sig.term)) {
      score += sig.weight;
      matchedSignals.push(sig.term);
    }
  }

  // 2. Secondary signals — related equipment/services
  for (const sig of config.signals.secondary) {
    if (checkSignal(sig.term)) {
      score += sig.weight;
      matchedSignals.push(sig.term);
    }
  }

  // 3. Negative / false positive signals
  for (const sig of config.signals.negative) {
    if (checkSignal(sig.term)) {
      score += sig.weight;
      negativeHits.push(sig.term);
    }
  }

  // 4. Baseline profile weights — only awarded if relevant signals found
  const hasMatch = matchedSignals.length > 0;

  if (hasMatch) {
    if (company.phone) score += config.scoringWeights.hasPhone;
    if (company.website) score += config.scoringWeights.hasWebsite;
    if (company.email) score += config.scoringWeights.hasContactEmail;
    if (company.address) score += config.scoringWeights.hasPhysicalAddress;

    if (company.hasRegulatoryPermit) score += 15;

    // Graduated distance scoring
    if (distanceMiles !== undefined) {
      if (distanceMiles <= 10) score += config.scoringWeights.distanceFactor * 1.5;
      else if (distanceMiles <= 25) score += config.scoringWeights.distanceFactor;
      else if (distanceMiles <= 50) score += config.scoringWeights.distanceFactor * 0.5;
    }
  }

  // 5. Determine priority tier
  let priority: 'A' | 'B' | 'C' | 'D';
  if (score >= 90) priority = 'A';
  else if (score >= 70) priority = 'B';
  else if (score >= 30) priority = 'C';
  else priority = 'D';

  if (score < 0) priority = 'D';

  return { score, priority, matchedSignals, negativeHits };
}
