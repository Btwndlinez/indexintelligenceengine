import { Company, Contact } from '@/types/company';
import { VerticalConfig } from '@/types/config';

export function calculateScore(
  company: Partial<Company>,
  config: VerticalConfig,
  contacts?: Partial<Contact>[]
): number {
  let score = 30;

  const dist = company.distanceMiles || 0;
  if (dist > 0 && dist < 10) {
    score += config.baseScoringWeights.distanceWeight;
  } else if (dist >= 10 && dist < 15) {
    score += config.baseScoringWeights.distanceWeight * 0.6;
  } else if (dist >= 15 && dist <= 20) {
    score += config.baseScoringWeights.distanceWeight * 0.3;
  }

  let contactPoints = 0;
  if (company.phone) contactPoints += 0.2;
  if (company.email) contactPoints += 0.2;

  const primary = contacts?.find(c => c.isPrimary) || contacts?.[0];
  if (primary?.firstName || primary?.lastName) contactPoints += 0.2;
  if (primary?.title) contactPoints += 0.1;
  if (primary?.linkedinUrl) contactPoints += 0.1;
  if (primary?.email) contactPoints += 0.1;
  if (primary?.phone) contactPoints += 0.1;

  score += Math.round(contactPoints * config.baseScoringWeights.contactEnrichmentWeight);

  if (company.capabilitySummary && company.capabilitySummary.length > 50) {
    score += config.baseScoringWeights.assetSignalWeight;
  }

  return Math.min(score, 100);
}
