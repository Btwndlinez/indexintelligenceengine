import { VERTICAL_REGISTRY } from '../search/registry';
import type { VerticalConfigWithProviders } from '../search/registry';

const VERTICAL_PRODUCT_MAP: Record<string, string[]> = {
  hhr: [
    'slurry_concrete', 'grease_trap', 'asbestos_abatement', 'hydro_excavation',
    'commercial_roofing', 'medical_waste', 'scrap_metal', 'marine_construction',
    'concrete', 'stormwater_compliance', 'industrial_wastewater', 'tank_testing',
    'elevator_inspection', 'hvac_balance', 'fire_sprinkler', 'fire_extinguisher',
    'kitchen_exhaust', 'backflow_testing', 'generator_testing',
  ],
  sparkywiz: [
    'generator_testing', 'elevator_inspection', 'hvac_balance',
    'fire_sprinkler', 'fire_extinguisher', 'backflow_testing',
  ],
  gcleadhub: [
    'distressed_property', 'multifamily', 'commercial_real_estate',
    'industrial_property', 'government_facilities', 'education_facilities',
    'healthcare_facilities',
  ],
  madefrom: [
    'industrial_wastewater', 'scrap_metal', 'medical_waste',
  ],
};

export function getVerticalsForProduct(productId: string): VerticalConfigWithProviders[] {
  const ids = VERTICAL_PRODUCT_MAP[productId];
  if (!ids) return [];
  return ids
    .map(id => VERTICAL_REGISTRY[id])
    .filter(Boolean) as VerticalConfigWithProviders[];
}

export function getVerticalById(id: string): VerticalConfigWithProviders | undefined {
  return VERTICAL_REGISTRY[id] as VerticalConfigWithProviders | undefined;
}

export { VERTICAL_PRODUCT_MAP };
