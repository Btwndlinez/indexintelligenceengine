import { Company } from '@/types/company';
import { VerticalConfig } from '@/types/config';

export function calculateCompositeScore(
  company: Partial<Company>,
  config: VerticalConfig,
  distanceMiles?: number
): number {
  let total = 0;

  const nameText = (company.companyName || '').toLowerCase();
  const contentText = `${company.notes || ''} ${company.capabilitySummary || ''}`.toLowerCase();

  const { signals } = config;

  // Primary signals — strongest buyer intent
  for (const s of signals.primary) {
    if (nameText.includes(s.term.toLowerCase()) || contentText.includes(s.term.toLowerCase())) {
      total += s.weight;
    }
  }

  // Secondary signals — related equipment/services
  for (const s of signals.secondary) {
    if (nameText.includes(s.term.toLowerCase()) || contentText.includes(s.term.toLowerCase())) {
      total += s.weight;
    }
  }

  // Negative signals — false positives (weights should be negative)
  for (const s of signals.negative) {
    if (nameText.includes(s.term.toLowerCase()) || contentText.includes(s.term.toLowerCase())) {
      total += s.weight;
    }
  }

  // Regulatory permit
  if (company.hasRegulatoryPermit) total += 15;

  // Contact completeness
  if (company.phone) total += 20;
  if (company.website) total += 15;

  // Proximity (up to 10)
  if (distanceMiles !== undefined) {
    if (distanceMiles <= 10) total += 10;
    else if (distanceMiles <= 25) total += 8;
    else if (distanceMiles <= 50) total += 5;
    else if (distanceMiles <= 100) total += 3;
    else total += 1;
  }

  // Established business bonus
  if (company.phone && company.website && company.address) total += 5;

  return Math.max(total, 0);
}

export function getTier(score: number): 'A' | 'B' | 'C' {
  if (score >= 55) return 'A';
  if (score >= 25) return 'B';
  return 'C';
}
