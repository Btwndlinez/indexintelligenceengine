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

  // Name relevance (up to 35) — strongest signal: company name contains vertical keywords
  const nameMatches = config.verticalSignals.filter(sig =>
    nameText.includes(sig.toLowerCase())
  ).length;
  if (nameMatches >= 3) total += 35;
  else if (nameMatches === 2) total += 30;
  else if (nameMatches === 1) total += 28;

  // Content signal matching (up to 20)
  const contentMatches = config.verticalSignals.filter(sig =>
    contentText.includes(sig.toLowerCase())
  ).length;
  if (contentMatches >= 4) total += 20;
  else if (contentMatches >= 2) total += 14;
  else if (contentMatches === 1) total += 7;

  // Regulatory permit (15)
  if (company.hasRegulatoryPermit) total += 15;

  // Digital presence (10)
  total += company.website ? 10 : 2;

  // Contact completeness (up to 12)
  if (company.phone) total += 5;
  if (company.email) total += 5;
  if (company.address) total += 2;

  // Proximity (up to 10)
  if (distanceMiles !== undefined) {
    if (distanceMiles <= 10) total += 10;
    else if (distanceMiles <= 25) total += 8;
    else if (distanceMiles <= 50) total += 5;
    else if (distanceMiles <= 100) total += 3;
    else total += 1;
  }

  // Established business bonus (up to 8)
  if (company.phone && company.website) total += 5;
  if (company.phone && company.website && company.address) total += 3;

  return Math.min(total, 100);
}

export function getTier(score: number): 'A' | 'B' | 'C' {
  if (score >= 55) return 'A';
  if (score >= 25) return 'B';
  return 'C';
}
