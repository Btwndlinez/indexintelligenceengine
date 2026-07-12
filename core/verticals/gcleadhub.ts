import { VERTICAL_REGISTRY } from '../search/registry';
import type { VerticalConfigWithProviders } from '../search/registry';

const GCLEADHUB_VERTICAL_IDS = [
  'distressed_property',
  'multifamily',
  'commercial_real_estate',
  'industrial_property',
  'government_facilities',
  'education_facilities',
  'healthcare_facilities',
] as const;

export function getGCLeadHubVerticals(): VerticalConfigWithProviders[] {
  return GCLEADHUB_VERTICAL_IDS
    .map(id => VERTICAL_REGISTRY[id])
    .filter(Boolean) as VerticalConfigWithProviders[];
}

export { GCLEADHUB_VERTICAL_IDS };
