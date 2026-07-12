import { VERTICAL_REGISTRY } from '../search/registry';
import type { VerticalConfigWithProviders } from '../search/registry';

const MADEFROM_VERTICAL_IDS = [
  'industrial_wastewater',
  'scrap_metal',
  'medical_waste',
] as const;

export function getMadeFromVerticals(): VerticalConfigWithProviders[] {
  return MADEFROM_VERTICAL_IDS
    .map(id => VERTICAL_REGISTRY[id])
    .filter(Boolean) as VerticalConfigWithProviders[];
}

export { MADEFROM_VERTICAL_IDS };
