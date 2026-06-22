export interface ScoringWeights {
  distanceWeight: number;
  contactEnrichmentWeight: number;
  assetSignalWeight: number;
}

export interface VerticalConfig {
  id: string;
  organizationId?: string;
  slug: string;
  industryName: string;
  targetNaicsCodes: string[];
  equipmentKeywords: string[];
  negativeKeywords: string[];
  searchQueries: string[];
  baseScoringWeights: ScoringWeights;
  createdAt: string;
}
