import { VERTICAL_REGISTRY } from '../search/registry';
import type { VerticalConfigWithProviders } from '../search/registry';

const SPARKYWIZ_VERTICAL_IDS = [
  'generator_testing',
  'elevator_inspection',
  'hvac_balance',
  'fire_sprinkler',
  'fire_extinguisher',
  'backflow_testing',
] as const;

export function getSparkyWizVerticals(): VerticalConfigWithProviders[] {
  return SPARKYWIZ_VERTICAL_IDS
    .map(id => VERTICAL_REGISTRY[id])
    .filter(Boolean) as VerticalConfigWithProviders[];
}

export { SPARKYWIZ_VERTICAL_IDS };
