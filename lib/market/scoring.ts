import { Company, Contact } from '@/types/company';
import { VerticalConfig } from '@/types/config';

function countSignalMatches(text: string, signals: string[]): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  return signals.filter(s => lower.includes(s));
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
  const summary = company.capabilitySummary || '';
  const signals = config.verticalSignals;

  const nameMatches = countSignalMatches(name, signals);
  const summaryMatches = countSignalMatches(summary, signals);

  const nameSignalCount = nameMatches.length;
  const summarySignalCount = summaryMatches.length;

  const signalCount = nameSignalCount + summarySignalCount;

  const verticalMatch = Math.min(
    (nameSignalCount > 0 ? 15 : 0) +
    Math.min(signalCount * 8, 30),
    45
  );

  const summaryLen = summary.length;
  const equipmentMatches = config.equipmentKeywords.filter(kw =>
    summary.toLowerCase().includes(kw.toLowerCase())
  ).length;

  const serviceCapability = Math.min(
    (summaryLen > 200 ? 10 : summaryLen > 80 ? 6 : summaryLen > 20 ? 3 : 0) +
    Math.min(equipmentMatches * 5, 10) +
    (summarySignalCount > 0 ? 5 : 0),
    25
  );

  const dist = company.distanceMiles ?? 0;
  const distance = Math.max(0, 10 - Math.round(dist / 3));

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
