import { Company, Contact } from '@/types/company';
import { VerticalConfig } from '@/types/config';

function countSignalMatches(text: string, signals: string[]): number {
  if (!text) return 0;
  const lower = text.toLowerCase();
  return signals.filter(s => lower.includes(s)).length;
}

function getScoreTier(score: number): 'A' | 'B' | 'C' {
  if (score >= 80) return 'A';
  if (score >= 55) return 'B';
  return 'C';
}

export function calculateScore(
  company: Partial<Company>,
  config: VerticalConfig,
  contacts?: Partial<Contact>[]
): { score: number; tier: 'A' | 'B' | 'C' } {
  const name = company.companyName || '';
  const signals = config.verticalSignals;
  const nameSignalCount = countSignalMatches(name, signals);

  const verticalMatch = Math.min(
    nameSignalCount * 15 + (nameSignalCount > 0 ? 5 : 0) + (nameSignalCount >= 2 ? 3 : 0),
    45
  );

  const summary = company.capabilitySummary || '';
  const summarySignalCount = countSignalMatches(summary, signals);
  const summaryLen = summary.length;

  const serviceCapability = Math.min(
    (summarySignalCount > 0 ? 10 : 0) +
    Math.min(summaryLen / 40, 5) +
    (nameSignalCount >= 2 ? 10 : nameSignalCount >= 1 ? 8 : 0),
    25
  );

  const dist = company.distanceMiles ?? 0;
  const distance = Math.max(0, 10 - Math.round(dist / 5));

  let contact = 0;
  if (company.website) contact += 3;
  if (company.phone) contact += 3;
  if (company.email) contact += 2;
  if (company.address && company.address.length > 10) contact += 2;
  contact = Math.min(contact, 10);

  let enrichment = 0;
  const primaryContact = contacts?.find(c => c.isPrimary) || contacts?.[0];
  if (primaryContact) {
    if (primaryContact.firstName || primaryContact.lastName) enrichment += 5;
    if (primaryContact.title) enrichment += 2;
    if (primaryContact.email) enrichment += 2;
    if (primaryContact.phone) enrichment += 1;
  }

  const score = Math.min(verticalMatch + serviceCapability + distance + contact + enrichment, 100);
  const tier = getScoreTier(score);

  return { score, tier };
}
