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

  const lowerText = textToAnalyze.toLowerCase();

  // 1. Primary signals — strongest buyer intent
  for (const sig of config.signals.primary) {
    if (lowerText.includes(sig.term.toLowerCase())) {
      score += sig.weight;
      matchedSignals.push(sig.term);
    }
  }

  // 2. Secondary signals — related equipment/services
  for (const sig of config.signals.secondary) {
    if (lowerText.includes(sig.term.toLowerCase())) {
      score += sig.weight;
      matchedSignals.push(sig.term);
    }
  }

  // 3. Negative / false positive signals
  for (const sig of config.signals.negative) {
    if (lowerText.includes(sig.term.toLowerCase())) {
      score += sig.weight;
      negativeHits.push(sig.term);
    }
  }

  // 4. Baseline profile weights from config
  if (company.website) score += config.scoringWeights.hasWebsite;
  if (company.phone) score += config.scoringWeights.hasPhone;
  if (company.email) score += config.scoringWeights.hasContactEmail;
  if (company.address) score += config.scoringWeights.hasPhysicalAddress;

  // 5. Regulatory permit bonus
  if (company.hasRegulatoryPermit) score += 15;

  // 6. Proximity bonus
  if (distanceMiles !== undefined && distanceMiles <= 25) {
    score += config.scoringWeights.distanceFactor;
  }

  // 7. Determine priority tier
  let priority: 'A' | 'B' | 'C' | 'D';
  if (score >= 90) priority = 'A';
  else if (score >= 50) priority = 'B';
  else if (score >= 20) priority = 'C';
  else priority = 'D';

  if (score < 0) priority = 'D';

  return { score, priority, matchedSignals, negativeHits };
}
