import { VerticalConfig } from '@/types/config';
import { DiscoveryProvider } from './providers/base';
import { RegulatoryProvider } from './providers/regulatory';
import { GooglePlacesProvider } from './providers/google';

const regulatory = new RegulatoryProvider();
const google = new GooglePlacesProvider();

export interface VerticalConfigWithProviders extends VerticalConfig {
  providers: DiscoveryProvider[];
}

const NOW = new Date().toISOString();

export const VERTICAL_REGISTRY: Record<string, VerticalConfigWithProviders> = {
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
      'filter press', 'dewatering box', 'centrifuge', 'slurry tanker',
      'vacuum truck', 'concrete recycling plant', 'slurry press'
    ],
    negativeKeywords: [
      'landscaping', 'gardening', 'lawn', 'tree service', 'florist',
      'residential', 'cleaning', 'municipal dump', 'residential landfill',
      'household waste', 'DIY concrete mix', 'city recycle station',
      'garbage collection', 'junk removal', 'paving'
    ],
    verticalSignals: [
      'slurry', 'concrete washout', 'washout', 'concrete recycling',
      'slurry recycling', 'concrete reclaiming', 'ready mix reclaiming',
      'vacuum truck', 'batch plant'
    ],
    baseScoringWeights: { distanceWeight: 10, contactEnrichmentWeight: 10, assetSignalWeight: 25 },
    createdAt: NOW,
    providers: [regulatory, google],
  },

  grease_trap: {
    id: 'grease_trap',
    slug: 'grease_trap',
    industryName: 'Commercial Grease Trap Pumping & Recycling',
    searchQueries: [
      'grease trap pumping service', 'commercial grease trap',
      'waste oil recycling', 'restaurant grease disposal', 'yellow grease collection'
    ],
    targetNaicsCodes: ['562219', '562111', '562998'],
    equipmentKeywords: [
      'grease interceptor', 'vacuum tanker', 'hydro-jetting',
      'grease rendering', 'degreasing unit', 'yellow grease collection'
    ],
    negativeKeywords: [
      'plumber repair', 'residential plumbing', 'home kitchen cleaning',
      'sewer line repair', 'faucet installation', 'clogged toilet',
      'residential', 'cleaning service', 'handyman'
    ],
    verticalSignals: [
      'grease trap', 'grease pumping', 'waste oil', 'grease disposal',
      'grease recycling', 'yellow grease', 'grease interceptor'
    ],
    baseScoringWeights: { distanceWeight: 10, contactEnrichmentWeight: 10, assetSignalWeight: 25 },
    createdAt: NOW,
    providers: [regulatory, google],
  },

  asbestos_abatement: {
    id: 'asbestos_abatement',
    slug: 'asbestos_abatement',
    industryName: 'Hazardous Asbestos & Lead Abatement',
    searchQueries: [
      'asbestos abatement contractor', 'asbestos removal service',
      'lead paint remediation', 'hazardous materials abatement',
      'environmental remediation contractor'
    ],
    targetNaicsCodes: ['562910', '238910'],
    equipmentKeywords: [
      'negative air machine', 'HEPA vacuum', 'containment barrier',
      'decontamination shower', 'personal air monitor', 'asbestos encapsulation'
    ],
    negativeKeywords: [
      'home inspection', 'paint store', 'hardware store', 'residential painter',
      'mold inspection DIY', 'interior design', 'cleaning service',
      'carpet cleaning', 'property management'
    ],
    verticalSignals: [
      'asbestos abatement', 'asbestos removal', 'asbestos remediation',
      'lead abatement', 'lead paint removal', 'hazardous material removal',
      'environmental remediation'
    ],
    baseScoringWeights: { distanceWeight: 10, contactEnrichmentWeight: 10, assetSignalWeight: 25 },
    createdAt: NOW,
    providers: [google],
  },

  hydro_excavation: {
    id: 'hydro_excavation',
    slug: 'hydro_excavation',
    industryName: 'Hydro-Excavation & Non-Destructive Digging',
    searchQueries: [
      'hydro excavation service', 'vacuum excavation contractor',
      'utility potholing', 'daylighting utilities', 'non-destructive digging'
    ],
    targetNaicsCodes: ['562998', '238910', '562119'],
    equipmentKeywords: [
      'hydrovac truck', 'slurry tanker', 'utility daylighting',
      'high-pressure water jet', 'vacuum excavation rig'
    ],
    negativeKeywords: [
      'landscaping design', 'backyard trenching', 'sprinkler installation',
      'hand digging', 'plumbing repair DIY', 'pool excavation',
      'residential', 'gardening'
    ],
    verticalSignals: [
      'hydro excavation', 'vacuum excavation', 'hydrovac',
      'utility potholing', 'daylighting', 'non-destructive digging',
      'slurry excavation'
    ],
    baseScoringWeights: { distanceWeight: 10, contactEnrichmentWeight: 10, assetSignalWeight: 25 },
    createdAt: NOW,
    providers: [google],
  },

  commercial_roofing: {
    id: 'commercial_roofing',
    slug: 'commercial_roofing',
    industryName: 'Industrial & Commercial Flat Roofing',
    searchQueries: [
      'commercial roofing contractor', 'flat roof installation',
      'industrial roofing services', 'TPO roofing contractor',
      'roof membrane replacement'
    ],
    targetNaicsCodes: ['238160'],
    equipmentKeywords: [
      'TPO membrane', 'EPDM roofing', 'single-ply system',
      'thermal roof inspection', 'built-up roofing', 'cool roof coating'
    ],
    negativeKeywords: [
      'residential shingle repair', 'gutter cleaning', 'handyman services',
      'chimney sweep', 'DIY shingle replacement', 'skylight installation home',
      'home inspector', 'real estate'
    ],
    verticalSignals: [
      'commercial roofing', 'flat roof', 'TPO roofing', 'EPDM roofing',
      'industrial roofing', 'roof membrane', 'built-up roofing'
    ],
    baseScoringWeights: { distanceWeight: 10, contactEnrichmentWeight: 10, assetSignalWeight: 25 },
    createdAt: NOW,
    providers: [google],
  },

  medical_waste: {
    id: 'medical_waste',
    slug: 'medical_waste',
    industryName: 'Biomedical & Infectious Waste Treatment',
    searchQueries: [
      'medical waste disposal service', 'sharps disposal service',
      'biohazard waste collection', 'clinical waste management',
      'regulated medical waste'
    ],
    targetNaicsCodes: ['562211', '562112'],
    equipmentKeywords: [
      'autoclave sterilization', 'biohazard containment boxes',
      'sharps container service', 'pathological waste incinerator',
      'infectious waste transport'
    ],
    negativeKeywords: [
      'pharmacy retail', 'dental clinic general', 'home health aid',
      'veterinarian hospital general', 'local doctor office',
      'medical supply store', 'hospital'
    ],
    verticalSignals: [
      'medical waste', 'biohazard disposal', 'sharps disposal',
      'clinical waste', 'regulated medical waste', 'infectious waste',
      'pathological waste'
    ],
    baseScoringWeights: { distanceWeight: 10, contactEnrichmentWeight: 10, assetSignalWeight: 25 },
    createdAt: NOW,
    providers: [google],
  },

  scrap_metal: {
    id: 'scrap_metal',
    slug: 'scrap_metal',
    industryName: 'Industrial Scrap Metal Processing',
    searchQueries: [
      'scrap metal recycling facility', 'ferrous metal recycling',
      'non-ferrous scrap processing', 'industrial metal recycling',
      'scrap yard processing'
    ],
    targetNaicsCodes: ['423930', '562920'],
    equipmentKeywords: [
      'alligator shear', 'metal shredder', 'scrap baler',
      'non-ferrous separator', 'scrap crane magnet', 'roll-off scrap containers'
    ],
    negativeKeywords: [
      'used car dealership', 'auto salvage retail', 'mechanic shop',
      'pawn shop', 'residential junk collection', 'antique store',
      'appliance repair', 'electronics repair'
    ],
    verticalSignals: [
      'scrap metal', 'metal recycling', 'ferrous scrap',
      'non-ferrous scrap', 'metal processing', 'scrap yard',
      'metal shredding'
    ],
    baseScoringWeights: { distanceWeight: 10, contactEnrichmentWeight: 10, assetSignalWeight: 25 },
    createdAt: NOW,
    providers: [google],
  },

  marine_construction: {
    id: 'marine_construction',
    slug: 'marine_construction',
    industryName: 'Heavy Marine & Dock Infrastructure',
    searchQueries: [
      'marine construction contractor', 'seawall repair construction',
      'industrial dock building', 'commercial dredging service',
      'bulkhead construction'
    ],
    targetNaicsCodes: ['237990', '238910'],
    equipmentKeywords: [
      'pile driving rig', 'crane barge', 'bulkhead construction',
      'dredge boat', 'sheet piling', 'marine salvage vessel'
    ],
    negativeKeywords: [
      'boat rental', 'jet ski rental', 'residential dock repair',
      'yacht club sales', 'scuba diving school', 'marina slips',
      'fishing charter', 'boat storage'
    ],
    verticalSignals: [
      'marine construction', 'seawall', 'bulkhead', 'dock building',
      'commercial dredging', 'pile driving', 'marine infrastructure'
    ],
    baseScoringWeights: { distanceWeight: 10, contactEnrichmentWeight: 10, assetSignalWeight: 25 },
    createdAt: NOW,
    providers: [google],
  },

  concrete: {
    id: 'concrete',
    slug: 'concrete',
    industryName: 'Concrete Services',
    searchQueries: [
      'concrete contractor commercial', 'concrete pumping service',
      'ready mix concrete delivery', 'industrial concrete work',
      'concrete foundation contractor'
    ],
    targetNaicsCodes: ['238110', '327320'],
    equipmentKeywords: [
      'concrete pump', 'concrete mixer', 'concrete batch plant',
      'concrete saw', 'power trowel', 'concrete form'
    ],
    negativeKeywords: [
      'residential driveway', 'home repair', 'handyman',
      'concrete bags retail', 'decorative concrete', 'stamped concrete patio'
    ],
    verticalSignals: [
      'concrete contractor', 'concrete pumping', 'ready mix',
      'concrete foundation', 'commercial concrete', 'industrial concrete'
    ],
    baseScoringWeights: { distanceWeight: 10, contactEnrichmentWeight: 10, assetSignalWeight: 25 },
    createdAt: NOW,
    providers: [google],
  },

  stormwater_compliance: {
    id: 'stormwater_compliance',
    slug: 'stormwater_compliance',
    industryName: 'Stormwater Compliance / SWPPP',
    searchQueries: [
      'SWPPP inspection', 'stormwater compliance',
      'construction runoff inspection'
    ],
    targetNaicsCodes: ['541620', '562910'],
    equipmentKeywords: [
      'sampling kit', 'turbidity meter', 'pH meter',
      'erosion control blanket', 'silt fence'
    ],
    negativeKeywords: [
      'rain gutter cleaning', 'residential drainage', 'home waterproofing'
    ],
    verticalSignals: [
      'SWPPP', 'stormwater', 'storm water', 'NPDES',
      'erosion control', 'runoff monitoring'
    ],
    baseScoringWeights: { distanceWeight: 20, contactEnrichmentWeight: 10, assetSignalWeight: 15 },
    createdAt: NOW,
    providers: [google],
  },

  industrial_wastewater: {
    id: 'industrial_wastewater',
    slug: 'industrial_wastewater',
    industryName: 'Industrial Wastewater Treatment',
    searchQueries: [
      'industrial wastewater treatment', 'wastewater filtration services',
      'industrial discharge treatment'
    ],
    targetNaicsCodes: ['221320', '562219'],
    equipmentKeywords: [
      'filter press', 'clarifier', 'chemical treatment system',
      'wastewater pump', 'pH neutralization system'
    ],
    negativeKeywords: [
      'residential septic repair', 'pool cleaning', 'home plumbing'
    ],
    verticalSignals: [
      'industrial wastewater', 'wastewater treatment', 'industrial discharge',
      'process wastewater', 'trade effluent'
    ],
    baseScoringWeights: { distanceWeight: 15, contactEnrichmentWeight: 10, assetSignalWeight: 20 },
    createdAt: NOW,
    providers: [google],
  },

  tank_testing: {
    id: 'tank_testing',
    slug: 'tank_testing',
    industryName: 'Underground Tank Testing',
    searchQueries: [
      'UST testing', 'underground tank compliance', 'tank leak detection'
    ],
    targetNaicsCodes: ['541380', '562910'],
    equipmentKeywords: [
      'leak detector', 'precision test gauge', 'tank tightness tester',
      'soil vapor probe', 'groundwater monitor'
    ],
    negativeKeywords: [
      'propane grill tank refill', 'home fuel tank', 'tank toys'
    ],
    verticalSignals: [
      'UST', 'underground storage tank', 'tank testing',
      'tank compliance', 'leak detection'
    ],
    baseScoringWeights: { distanceWeight: 20, contactEnrichmentWeight: 10, assetSignalWeight: 15 },
    createdAt: NOW,
    providers: [google],
  },

  elevator_inspection: {
    id: 'elevator_inspection',
    slug: 'elevator_inspection',
    industryName: 'Elevator Inspection & Certification',
    searchQueries: [
      'elevator inspection', 'elevator certification', 'lift safety testing'
    ],
    targetNaicsCodes: ['238290', '541350'],
    equipmentKeywords: [
      'load test weights', 'safety gear tester', 'door force gauge',
      'elevator leveling tool', 'car top inspection station'
    ],
    negativeKeywords: [
      'home stair lift', 'wheelchair lift', 'DIY repair'
    ],
    verticalSignals: [
      'elevator inspection', 'elevator certification', 'lift inspection',
      'elevator safety', 'vertical transportation'
    ],
    baseScoringWeights: { distanceWeight: 20, contactEnrichmentWeight: 10, assetSignalWeight: 15 },
    createdAt: NOW,
    providers: [google],
  },

  hvac_balance: {
    id: 'hvac_balance',
    slug: 'hvac_balance',
    industryName: 'HVAC Test & Balance',
    searchQueries: [
      'HVAC test and balance', 'air balance contractor',
      'commercial air balancing'
    ],
    targetNaicsCodes: ['238220'],
    equipmentKeywords: [
      'anemometer', 'manometer', 'flow hood',
      'balancing damper', 'air velocity meter'
    ],
    negativeKeywords: [
      'home AC repair', 'window unit', 'portable AC'
    ],
    verticalSignals: [
      'HVAC test and balance', 'air balance', 'air balancing',
      'commercial HVAC', 'TAB contractor'
    ],
    baseScoringWeights: { distanceWeight: 20, contactEnrichmentWeight: 10, assetSignalWeight: 15 },
    createdAt: NOW,
    providers: [google],
  },

  fire_sprinkler: {
    id: 'fire_sprinkler',
    slug: 'fire_sprinkler',
    industryName: 'Fire Sprinkler Pressure Testing',
    searchQueries: [
      'fire sprinkler testing', 'hydrostatic pressure test sprinkler',
      'commercial fire sprinkler inspection'
    ],
    targetNaicsCodes: ['238220', '561621'],
    equipmentKeywords: [
      'hydrostatic test pump', 'sprinkler head gauge', 'backflow preventer tester',
      'flow test kit', 'fire alarm panel'
    ],
    negativeKeywords: [
      'garden irrigation repair', 'residential lawn sprinkler system', 'plumbing drain unclogging'
    ],
    verticalSignals: [
      'fire sprinkler', 'sprinkler testing', 'hydrostatic test',
      'fire suppression', 'sprinkler inspection'
    ],
    baseScoringWeights: { distanceWeight: 10, contactEnrichmentWeight: 10, assetSignalWeight: 25 },
    createdAt: NOW,
    providers: [google],
  },

  fire_extinguisher: {
    id: 'fire_extinguisher',
    slug: 'fire_extinguisher',
    industryName: 'Fire Extinguisher Inspection & Filling',
    searchQueries: [
      'fire extinguisher recharge', 'commercial fire extinguisher inspection',
      'fire extinguisher hydrotesting'
    ],
    targetNaicsCodes: ['423990', '561621', '811490'],
    equipmentKeywords: [
      'hydrostatic test unit', 'extinguisher fill station', 'dry chemical refill',
      'CO2 fill manifold', 'pressure gauge'
    ],
    negativeKeywords: [
      'buy smoke detector home', 'extinguisher mount bracket amazon', 'fire protection engineering degree'
    ],
    verticalSignals: [
      'fire extinguisher', 'extinguisher inspection', 'extinguisher recharge',
      'extinguisher hydrotest', 'portable extinguisher'
    ],
    baseScoringWeights: { distanceWeight: 15, contactEnrichmentWeight: 10, assetSignalWeight: 20 },
    createdAt: NOW,
    providers: [google],
  },

  kitchen_exhaust: {
    id: 'kitchen_exhaust',
    slug: 'kitchen_exhaust',
    industryName: 'Commercial Kitchen Hood Degreasing',
    searchQueries: [
      'commercial kitchen exhaust cleaning', 'restaurant hood degreasing',
      'exhaust fan cleaning NFPA 96'
    ],
    targetNaicsCodes: ['561790', '926150'],
    equipmentKeywords: [
      'pressure washer', 'hood filter cart', 'exhaust fan cleaning tool',
      'grease removal system', 'duct cleaning kit'
    ],
    negativeKeywords: [
      'residential kitchen hood filter replacement', 'home cleaning service', 'maid service'
    ],
    verticalSignals: [
      'kitchen exhaust', 'hood cleaning', 'restaurant hood',
      'grease hood', 'exhaust degreasing', 'NFPA 96'
    ],
    baseScoringWeights: { distanceWeight: 20, contactEnrichmentWeight: 10, assetSignalWeight: 15 },
    createdAt: NOW,
    providers: [google],
  },

  backflow_testing: {
    id: 'backflow_testing',
    slug: 'backflow_testing',
    industryName: 'Backflow Prevention Testing',
    searchQueries: [
      'backflow certification testing', 'reduced pressure zone RPZ test',
      'commercial backflow assembly inspector'
    ],
    targetNaicsCodes: ['238220', '541380'],
    equipmentKeywords: [
      'backflow test kit', 'pressure gauge', 'differential pressure meter',
      'RPZ tester', 'double check valve tester'
    ],
    negativeKeywords: [
      'residential water filtration pitcher', 'swimming pool backwash valve', 'sewer line replacement'
    ],
    verticalSignals: [
      'backflow testing', 'backflow certification', 'RPZ testing',
      'cross connection', 'backflow prevention'
    ],
    baseScoringWeights: { distanceWeight: 20, contactEnrichmentWeight: 10, assetSignalWeight: 15 },
    createdAt: NOW,
    providers: [google],
  },

  generator_testing: {
    id: 'generator_testing',
    slug: 'generator_testing',
    industryName: 'Emergency Generator Load Bank Testing',
    searchQueries: [
      'generator load bank testing', 'commercial emergency generator service',
      'critical backup generator testing'
    ],
    targetNaicsCodes: ['811310', '238210'],
    equipmentKeywords: [
      'load bank', 'generator analyzer', 'transfer switch tester',
      'fuel polishing system', 'battery load tester'
    ],
    negativeKeywords: [
      'portable generator camping sales', 'rv generator repair', 'home solar backup installation'
    ],
    verticalSignals: [
      'generator testing', 'load bank testing', 'emergency generator',
      'backup generator', 'generator maintenance'
    ],
    baseScoringWeights: { distanceWeight: 10, contactEnrichmentWeight: 10, assetSignalWeight: 25 },
    createdAt: NOW,
    providers: [google],
  }
};

export async function getVerticalConfigByDomain(contextHeaderValue: string): Promise<VerticalConfigWithProviders | null> {
  const cleanKey = contextHeaderValue.trim().toLowerCase();
  return VERTICAL_REGISTRY[cleanKey] || null;
}

export function isIrrelevant(company: Partial<{ companyName?: string; address?: string }>, negativeKeywords: string[]): boolean {
  const text = `${company.companyName || ''} ${company.address || ''}`.toLowerCase();
  return negativeKeywords.some(neg => text.includes(neg));
}
