import { VerticalConfig } from '@/types/config';

const NOW = new Date().toISOString();

export const VERTICAL_REGISTRY: Record<string, VerticalConfig> = {
  slurry_concrete: {
    id: 'slurry_concrete',
    slug: 'slurry_concrete',
    industryName: 'Concrete Slurry Recycling & Disposal',
    searchQueries: [
      'concrete slurry recycling',
      'concrete washout',
      'slurry disposal',
      'ready mix reclaiming',
      'concrete reclaiming'
    ],
    targetNaicsCodes: ['562211', '238110', '562112'],
    equipmentKeywords: [
      'filter press',
      'dewatering box',
      'centrifuge',
      'slurry tanker',
      'vacuum truck',
      'concrete recycling plant',
      'slurry press'
    ],
    negativeKeywords: [
      'landscaping',
      'gardening',
      'lawn',
      'tree service',
      'florist',
      'residential',
      'cleaning',
      'municipal dump',
      'residential landfill',
      'household waste',
      'DIY concrete mix',
      'city recycle station',
      'garbage collection',
      'junk removal',
      'paving'
    ],
    verticalSignals: [
      'slurry',
      'concrete washout',
      'washout',
      'concrete recycling',
      'slurry recycling',
      'concrete reclaiming',
      'ready mix reclaiming'
    ],
    baseScoringWeights: {
      distanceWeight: 10,
      contactEnrichmentWeight: 10,
      assetSignalWeight: 25
    },
    createdAt: NOW
  },

  grease_trap: {
    id: 'grease_trap',
    slug: 'grease_trap',
    industryName: 'Commercial Grease Trap Pumping & Recycling',
    searchQueries: [
      'grease trap pumping service',
      'commercial grease trap',
      'waste oil recycling',
      'restaurant grease disposal',
      'yellow grease collection'
    ],
    targetNaicsCodes: ['562219', '562111', '562998'],
    equipmentKeywords: [
      'grease interceptor',
      'vacuum tanker',
      'hydro-jetting',
      'grease rendering',
      'degreasing unit',
      'yellow grease collection'
    ],
    negativeKeywords: [
      'plumber repair',
      'residential plumbing',
      'home kitchen cleaning',
      'sewer line repair',
      'faucet installation',
      'clogged toilet',
      'residential',
      'cleaning service',
      'handyman'
    ],
    verticalSignals: [
      'grease trap',
      'grease pumping',
      'waste oil',
      'grease disposal',
      'grease recycling',
      'yellow grease',
      'grease interceptor'
    ],
    baseScoringWeights: {
      distanceWeight: 10,
      contactEnrichmentWeight: 10,
      assetSignalWeight: 25
    },
    createdAt: NOW
  },

  asbestos_abatement: {
    id: 'asbestos_abatement',
    slug: 'asbestos_abatement',
    industryName: 'Hazardous Asbestos & Lead Abatement',
    searchQueries: [
      'asbestos abatement contractor',
      'asbestos removal service',
      'lead paint remediation',
      'hazardous materials abatement',
      'environmental remediation contractor'
    ],
    targetNaicsCodes: ['562910', '238910'],
    equipmentKeywords: [
      'negative air machine',
      'HEPA vacuum',
      'containment barrier',
      'decontamination shower',
      'personal air monitor',
      'asbestos encapsulation'
    ],
    negativeKeywords: [
      'home inspection',
      'paint store',
      'hardware store',
      'residential painter',
      'mold inspection DIY',
      'interior design',
      'cleaning service',
      'carpet cleaning',
      'property management'
    ],
    verticalSignals: [
      'asbestos abatement',
      'asbestos removal',
      'asbestos remediation',
      'lead abatement',
      'lead paint removal',
      'hazardous material removal',
      'environmental remediation'
    ],
    baseScoringWeights: {
      distanceWeight: 10,
      contactEnrichmentWeight: 10,
      assetSignalWeight: 25
    },
    createdAt: NOW
  },

  hydro_excavation: {
    id: 'hydro_excavation',
    slug: 'hydro_excavation',
    industryName: 'Hydro-Excavation & Non-Destructive Digging',
    searchQueries: [
      'hydro excavation service',
      'vacuum excavation contractor',
      'utility potholing',
      'daylighting utilities',
      'non-destructive digging'
    ],
    targetNaicsCodes: ['562998', '238910', '562119'],
    equipmentKeywords: [
      'hydrovac truck',
      'slurry tanker',
      'utility daylighting',
      'high-pressure water jet',
      'vacuum excavation rig'
    ],
    negativeKeywords: [
      'landscaping design',
      'backyard trenching',
      'sprinkler installation',
      'hand digging',
      'plumbing repair DIY',
      'pool excavation',
      'residential',
      'gardening'
    ],
    verticalSignals: [
      'hydro excavation',
      'vacuum excavation',
      'hydrovac',
      'utility potholing',
      'daylighting',
      'non-destructive digging',
      'slurry excavation'
    ],
    baseScoringWeights: {
      distanceWeight: 10,
      contactEnrichmentWeight: 10,
      assetSignalWeight: 25
    },
    createdAt: NOW
  },

  commercial_roofing: {
    id: 'commercial_roofing',
    slug: 'commercial_roofing',
    industryName: 'Industrial & Commercial Flat Roofing',
    searchQueries: [
      'commercial roofing contractor',
      'flat roof installation',
      'industrial roofing services',
      'TPO roofing contractor',
      'roof membrane replacement'
    ],
    targetNaicsCodes: ['238160'],
    equipmentKeywords: [
      'TPO membrane',
      'EPDM roofing',
      'single-ply system',
      'thermal roof inspection',
      'built-up roofing',
      'cool roof coating'
    ],
    negativeKeywords: [
      'residential shingle repair',
      'gutter cleaning',
      'handyman services',
      'chimney sweep',
      'DIY shingle replacement',
      'skylight installation home',
      'home inspector',
      'real estate'
    ],
    verticalSignals: [
      'commercial roofing',
      'flat roof',
      'TPO roofing',
      'EPDM roofing',
      'industrial roofing',
      'roof membrane',
      'built-up roofing'
    ],
    baseScoringWeights: {
      distanceWeight: 10,
      contactEnrichmentWeight: 10,
      assetSignalWeight: 25
    },
    createdAt: NOW
  },

  medical_waste: {
    id: 'medical_waste',
    slug: 'medical_waste',
    industryName: 'Biomedical & Infectious Waste Treatment',
    searchQueries: [
      'medical waste disposal service',
      'sharps disposal service',
      'biohazard waste collection',
      'clinical waste management',
      'regulated medical waste'
    ],
    targetNaicsCodes: ['562211', '562112'],
    equipmentKeywords: [
      'autoclave sterilization',
      'biohazard containment boxes',
      'sharps container service',
      'pathological waste incinerator',
      'infectious waste transport'
    ],
    negativeKeywords: [
      'pharmacy retail',
      'dental clinic general',
      'home health aid',
      'veterinarian hospital general',
      'local doctor office',
      'medical supply store',
      'hospital'
    ],
    verticalSignals: [
      'medical waste',
      'biohazard disposal',
      'sharps disposal',
      'clinical waste',
      'regulated medical waste',
      'infectious waste',
      'pathological waste'
    ],
    baseScoringWeights: {
      distanceWeight: 10,
      contactEnrichmentWeight: 10,
      assetSignalWeight: 25
    },
    createdAt: NOW
  },

  scrap_metal: {
    id: 'scrap_metal',
    slug: 'scrap_metal',
    industryName: 'Industrial Scrap Metal Processing',
    searchQueries: [
      'scrap metal recycling facility',
      'ferrous metal recycling',
      'non-ferrous scrap processing',
      'industrial metal recycling',
      'scrap yard processing'
    ],
    targetNaicsCodes: ['423930', '562920'],
    equipmentKeywords: [
      'alligator shear',
      'metal shredder',
      'scrap baler',
      'non-ferrous separator',
      'scrap crane magnet',
      'roll-off scrap containers'
    ],
    negativeKeywords: [
      'used car dealership',
      'auto salvage retail',
      'mechanic shop',
      'pawn shop',
      'residential junk collection',
      'antique store',
      'appliance repair',
      'electronics repair'
    ],
    verticalSignals: [
      'scrap metal',
      'metal recycling',
      'ferrous scrap',
      'non-ferrous scrap',
      'metal processing',
      'scrap yard',
      'metal shredding'
    ],
    baseScoringWeights: {
      distanceWeight: 10,
      contactEnrichmentWeight: 10,
      assetSignalWeight: 25
    },
    createdAt: NOW
  },

  marine_construction: {
    id: 'marine_construction',
    slug: 'marine_construction',
    industryName: 'Heavy Marine & Dock Infrastructure',
    searchQueries: [
      'marine construction contractor',
      'seawall repair construction',
      'industrial dock building',
      'commercial dredging service',
      'bulkhead construction'
    ],
    targetNaicsCodes: ['237990', '238910'],
    equipmentKeywords: [
      'pile driving rig',
      'crane barge',
      'bulkhead construction',
      'dredge boat',
      'sheet piling',
      'marine salvage vessel'
    ],
    negativeKeywords: [
      'boat rental',
      'jet ski rental',
      'residential dock repair',
      'yacht club sales',
      'scuba diving school',
      'marina slips',
      'fishing charter',
      'boat storage'
    ],
    verticalSignals: [
      'marine construction',
      'seawall',
      'bulkhead',
      'dock building',
      'commercial dredging',
      'pile driving',
      'marine infrastructure'
    ],
    baseScoringWeights: {
      distanceWeight: 10,
      contactEnrichmentWeight: 10,
      assetSignalWeight: 25
    },
    createdAt: NOW
  }
};

export async function getVerticalConfigByDomain(contextHeaderValue: string): Promise<VerticalConfig | null> {
  const cleanKey = contextHeaderValue.trim().toLowerCase();
  return VERTICAL_REGISTRY[cleanKey] || null;
}
