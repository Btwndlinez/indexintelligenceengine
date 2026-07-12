import { VERTICAL_REGISTRY } from '../search/registry';
import type { VerticalConfigWithProviders } from '../search/registry';

const HHR_VERTICAL_IDS = [
  'slurry_concrete',
  'grease_trap',
  'asbestos_abatement',
  'hydro_excavation',
  'commercial_roofing',
  'medical_waste',
  'scrap_metal',
  'marine_construction',
  'concrete',
  'stormwater_compliance',
  'industrial_wastewater',
  'tank_testing',
  'elevator_inspection',
  'hvac_balance',
  'fire_sprinkler',
  'fire_extinguisher',
  'kitchen_exhaust',
  'backflow_testing',
  'generator_testing',
] as const;

export function getHHRVerticals(): VerticalConfigWithProviders[] {
  return HHR_VERTICAL_IDS
    .map(id => VERTICAL_REGISTRY[id])
    .filter(Boolean) as VerticalConfigWithProviders[];
}

export { HHR_VERTICAL_IDS };
