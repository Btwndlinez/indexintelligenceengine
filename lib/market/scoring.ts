import { Company, Contact } from '@/types/company';
import { VerticalConfig } from '@/types/config';

export function calculateScore(
  company: Partial<Company>,
  config: VerticalConfig,
  contacts?: Partial<Contact>[]
): number {
  const { distanceWeight, contactEnrichmentWeight, assetSignalWeight } = config.baseScoringWeights;

  let score = 0;

  const dist = company.distanceMiles ?? 0;
  const normalizedDist = Math.min(Math.max(dist, 0), 25);
  const distanceScore = distanceWeight * (1 - normalizedDist / 25);
  score += Math.round(distanceScore);

  let presenceScore = 0;
  if (company.website) presenceScore += 6;
  if (company.phone) presenceScore += 4;
  if (company.address && company.address.length > 10) presenceScore += 3;
  if (company.email) presenceScore += 2;
  score += presenceScore;

  let contactPoints = 0;
  if (company.phone) contactPoints += 3;
  if (company.email) contactPoints += 3;

  const primaryContact = contacts?.find(c => c.isPrimary) || contacts?.[0];
  if (primaryContact) {
    if (primaryContact.firstName || primaryContact.lastName) contactPoints += 5;
    else if (primaryContact.email) contactPoints += 3;
    if (primaryContact.title) contactPoints += 3;
    if (primaryContact.linkedinUrl) contactPoints += 2;
    if (primaryContact.email) contactPoints += 2;
    if (primaryContact.phone) contactPoints += 2;
  }

  const maxContactPoints = 20;
  const contactFraction = Math.min(contactPoints, maxContactPoints) / maxContactPoints;
  score += Math.round(contactFraction * contactEnrichmentWeight);

  if (company.capabilitySummary) {
    const len = company.capabilitySummary.length;
    const signalFraction = Math.min(len / 100, 1);
    score += Math.round(signalFraction * assetSignalWeight);
  }

  return Math.min(Math.max(score, 0), 100);
}
