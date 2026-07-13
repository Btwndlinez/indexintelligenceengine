export type EvidenceSource =
  | 'google_places'
  | 'google_maps'
  | 'google_search'
  | 'tomtom'
  | 'overpass'
  | 'apollo'
  | 'deepseek'
  | 'website_scrape'
  | 'linkedin'
  | 'permit_database'
  | 'bid_database'
  | 'regulatory_database'
  | 'county_records'
  | 'assessor_records'
  | 'business_filing'
  | 'user_submitted'
  | 'ai_inference'
  | 'feedback_vote'
  | 'citation';

export interface Evidence {
  id: string;
  source: EvidenceSource;
  property: string;
  value: unknown;
  confidence: number;
  timestamp: string;
  recordedAt: string;
  sourceUrl?: string;
  sourceLabel?: string;
  metadata?: Record<string, unknown>;
}

export interface Fact {
  property: string;
  value: unknown;
  confidence: number;
  evidence: Evidence[];
  lastUpdated: string;
}

export interface EvidenceConfig {
  sourceWeights: Partial<Record<EvidenceSource, number>>;
  decayDays: number;
  minEvidenceForAutoAccept: number;
}

const DEFAULT_SOURCE_WEIGHTS: Record<EvidenceSource, number> = {
  permit_database: 0.95,
  regulatory_database: 0.93,
  county_records: 0.92,
  assessor_records: 0.90,
  business_filing: 0.88,
  google_places: 0.61,
  google_maps: 0.65,
  overpass: 0.60,
  tomtom: 0.55,
  apollo: 0.50,
  linkedin: 0.74,
  website_scrape: 0.84,
  google_search: 0.70,
  deepseek: 0.45,
  ai_inference: 0.35,
  user_submitted: 0.40,
  feedback_vote: 0.50,
  citation: 0.80,
};

export function computeConfidence(evidence: Evidence[], config?: Partial<EvidenceConfig>): number {
  if (evidence.length === 0) return 0;

  const weights = { ...DEFAULT_SOURCE_WEIGHTS, ...config?.sourceWeights };
  let weightedSum = 0;
  let totalWeight = 0;

  for (const e of evidence) {
    const sourceWeight = weights[e.source] ?? 0.5;
    const ageDays = (Date.now() - new Date(e.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    const decay = config?.decayDays ? Math.max(0, 1 - ageDays / config.decayDays) : 1;
    const adjusted = e.confidence * sourceWeight * decay;

    weightedSum += adjusted * sourceWeight;
    totalWeight += sourceWeight;
  }

  if (totalWeight === 0) return 0;

  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

export function computeFact(property: string, evidence: Evidence[], config?: Partial<EvidenceConfig>): Fact {
  const grouped = new Map<string, Evidence[]>();
  for (const e of evidence) {
    const key = String(e.value);
    const existing = grouped.get(key) || [];
    existing.push(e);
    grouped.set(key, existing);
  }

  let bestValue: unknown = null;
  let bestConfidence = 0;

  for (const [value, evs] of grouped) {
    const conf = computeConfidence(evs, config);
    if (conf > bestConfidence) {
      bestConfidence = conf;
      bestValue = evs[0].value;
    }
  }

  return {
    property,
    value: bestValue,
    confidence: bestConfidence,
    evidence,
    lastUpdated: new Date().toISOString(),
  };
}

export function createEvidence(params: {
  source: EvidenceSource;
  property: string;
  value: unknown;
  confidence?: number;
  sourceUrl?: string;
  sourceLabel?: string;
  metadata?: Record<string, unknown>;
}): Evidence {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    source: params.source,
    property: params.property,
    value: params.value,
    confidence: params.confidence ?? 0.5,
    timestamp: new Date().toISOString(),
    recordedAt: new Date().toISOString(),
    sourceUrl: params.sourceUrl,
    sourceLabel: params.sourceLabel,
    metadata: params.metadata,
  };
}

export function mergeEvidence(existing: Fact | null, newEvidence: Evidence[], config?: Partial<EvidenceConfig>): Fact {
  const allEvidence = [...(existing?.evidence ?? []), ...newEvidence];
  return computeFact(existing?.property ?? newEvidence[0]?.property ?? 'unknown', allEvidence, config);
}

export async function resolveFactsFromSources<T>(
  property: string,
  fetchers: Array<() => Promise<{ value: T; source: EvidenceSource; confidence: number } | null>>
): Promise<Fact> {
  const results = await Promise.allSettled(fetchers.map(f => f()));
  const evidence: Evidence[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      const { value, source, confidence } = result.value;
      evidence.push(createEvidence({ source, property, value, confidence }));
    }
  }

  return computeFact(property, evidence);
}

export function evidenceSummary(fact: Fact): string {
  const sources = [...new Set(fact.evidence.map(e => e.source))];
  const total = fact.evidence.length;
  return `Fact: ${String(fact.value)} (confidence: ${(fact.confidence * 100).toFixed(0)}%, ${total} evidence items from ${sources.length} sources)`;
}

export type { Evidence };
