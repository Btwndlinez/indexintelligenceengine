import { VerticalConfig } from '@/types/config';

const NOW = new Date().toISOString();

export const VERTICAL_REGISTRY: Record<string, VerticalConfig> = {
  slurry_concrete: {
    id: 'slurry_concrete',
    slug: 'slurry_concrete',
    industryName: 'Concrete Slurry Recycling & Disposal',
    searchQueries: [
      'concrete recycling',
      'aggregate recycling',
      'slurry disposal',
      'concrete contractors'
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
      'municipal dump',
      'residential landfill',
      'household waste',
      'DIY concrete mix',
      'city recycle station',
      'garbage collection',
      'junk removal'
    ],
    baseScoringWeights: {
      distanceWeight: 35,
      contactEnrichmentWeight: 35,
      assetSignalWeight: 30
    },
    createdAt: NOW
  },

  grease_trap: {
    id: 'grease_trap',
    slug: 'grease_trap',
    industryName: 'Commercial Grease Trap Pumping & Recycling',
    searchQueries: [
      'grease trap pumping',
      'commercial grease trap service',
      'waste oil recycling',
      'restaurant grease disposal'
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
      'clogged toilet'
    ],
    baseScoringWeights: {
      distanceWeight: 30,
      contactEnrichmentWeight: 40,
      assetSignalWeight: 30
    },
    createdAt: NOW
  },

  asbestos_abatement: {
    id: 'asbestos_abatement',
    slug: 'asbestos_abatement',
    industryName: 'Hazardous Asbestos & Lead Abatement',
    searchQueries: [
      'asbestos abatement',
      'lead paint removal',
      'hazardous materials mitigation',
      'environmental remediation'
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
      'interior design'
    ],
    baseScoringWeights: {
      distanceWeight: 25,
      contactEnrichmentWeight: 45,
      assetSignalWeight: 30
    },
    createdAt: NOW
  },

  hydro_excavation: {
    id: 'hydro_excavation',
    slug: 'hydro_excavation',
    industryName: 'Hydro-Excavation & Non-Destructive Digging',
    searchQueries: [
      'hydro excavation',
      'vacuum excavation',
      'potholing utilities',
      'daylighting utilities'
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
      'pool excavation'
    ],
    baseScoringWeights: {
      distanceWeight: 40,
      contactEnrichmentWeight: 30,
      assetSignalWeight: 30
    },
    createdAt: NOW
  },

  commercial_roofing: {
    id: 'commercial_roofing',
    slug: 'commercial_roofing',
    industryName: 'Industrial & Commercial Flat Roofing',
    searchQueries: [
      'commercial roofing',
      'flat roof contractor',
      'industrial roofing services',
      'roofing membrane installer'
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
      'skylight installation home'
    ],
    baseScoringWeights: {
      distanceWeight: 20,
      contactEnrichmentWeight: 50,
      assetSignalWeight: 30
    },
    createdAt: NOW
  },

  medical_waste: {
    id: 'medical_waste',
    slug: 'medical_waste',
    industryName: 'Biomedical & Infectious Waste Treatment',
    searchQueries: [
      'medical waste disposal',
      'sharps disposal service',
      'biohazard waste collection',
      'clinical waste management'
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
      'local doctor office'
    ],
    baseScoringWeights: {
      distanceWeight: 30,
      contactEnrichmentWeight: 40,
      assetSignalWeight: 30
    },
    createdAt: NOW
  },

  scrap_metal: {
    id: 'scrap_metal',
    slug: 'scrap_metal',
    industryName: 'Industrial Scrap Metal Processing',
    searchQueries: [
      'scrap metal recycling',
      'industrial metal recycling',
      'scrap yard wholesale',
      'non-ferrous metal recycling'
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
      'antique store'
    ],
    baseScoringWeights: {
      distanceWeight: 35,
      contactEnrichmentWeight: 35,
      assetSignalWeight: 30
    },
    createdAt: NOW
  },

  marine_construction: {
    id: 'marine_construction',
    slug: 'marine_construction',
    industryName: 'Heavy Marine & Dock Infrastructure',
    searchQueries: [
      'marine construction',
      'seawall repair contractor',
      'industrial dock builder',
      'commercial dredging'
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
      'marina slips'
    ],
    baseScoringWeights: {
      distanceWeight: 30,
      contactEnrichmentWeight: 40,
      assetSignalWeight: 30
    },
    createdAt: NOW
  }
};

export async function getVerticalConfigByDomain(contextHeaderValue: string): Promise<VerticalConfig | null> {
  const cleanKey = contextHeaderValue.trim().toLowerCase();
  return VERTICAL_REGISTRY[cleanKey] || null;
}
