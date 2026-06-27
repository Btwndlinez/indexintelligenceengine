import { Company } from '@/types/company';
import { VerticalConfig } from '@/types/config';

export function calculateCompositeScore(
  company: Partial<Company>,
  config: VerticalConfig,
  distanceMiles?: number
): number {
  let total = 0;

  const regulatoryScore = company.hasRegulatoryPermit ? 40 : 0;
  total += regulatoryScore;

  const targetText = `${company.companyName || ''} ${company.notes || ''} ${company.capabilitySummary || ''}`.toLowerCase();
  const signalMatches = config.verticalSignals.filter(sig =>
    targetText.includes(sig.toLowerCase())
  ).length;

  let verticalScore = 0;
  if (signalMatches >= 3) verticalScore = 30;
  else if (signalMatches === 2) verticalScore = 20;
  else if (signalMatches === 1) verticalScore = 10;
  total += verticalScore;

  const googleScore = company.website ? 15 : 5;
  total += googleScore;

  let contactScore = 0;
  if (company.phone) contactScore += 4;
  if (company.email) contactScore += 4;
  if (company.address) contactScore += 2;
  total += contactScore;

  let distanceScore = 0;
  if (distanceMiles !== undefined) {
    if (distanceMiles <= 10) distanceScore = 5;
    else if (distanceMiles <= 25) distanceScore = 3;
    else if (distanceMiles <= 50) distanceScore = 1;
  }
  total += distanceScore;

  return Math.min(total, 100);
}

export function getTier(score: number): 'A' | 'B' | 'C' {
  if (score >= 85) return 'A';
  if (score >= 55) return 'B';
  return 'C';
}
