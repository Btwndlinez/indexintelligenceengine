export interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  productIds?: string[];
}

const FLAGS: FeatureFlag[] = [
  { key: 'ai_copilot', label: 'AI Copilot', description: 'AI-powered assistant across the platform', enabled: true },
  { key: 'campaigns', label: 'Campaign Management', description: 'Outreach campaign creation and management', enabled: true },
  { key: 'equipment_marketplace', label: 'Equipment Marketplace', description: 'Equipment rental and booking marketplace', enabled: false },
  { key: 'bid_intelligence', label: 'Bid Intelligence', description: 'Bid discovery and tracking', enabled: true },
  { key: 'graph_intelligence', label: 'Graph Intelligence', description: 'Entity relationship graph and traversal', enabled: false, productIds: ['gcleadhub'] },
  { key: 'unified_search', label: 'Unified Search', description: 'Cross-entity universal search', enabled: true },
  { key: 'property_intelligence', label: 'Property Intelligence', description: 'Property profiles with permits, ownership, tax data', enabled: false },
  { key: 'foreman_ai', label: 'Foreman AI', description: 'AI foreman for worker marketplace', enabled: true },
  { key: 'evidence_engine', label: 'Evidence Engine', description: 'Evidence-based fact computation', enabled: false },
  { key: 'ontology_nav', label: 'Ontology Navigation', description: 'Browse by ontology hierarchy', enabled: false },
];

export function getFlags(productId?: string): FeatureFlag[] {
  if (!productId) return FLAGS;
  return FLAGS.filter(f => !f.productIds || f.productIds.includes(productId));
}

export function isEnabled(key: string, productId?: string): boolean {
  const flag = FLAGS.find(f => f.key === key);
  if (!flag) return false;
  if (!flag.enabled) return false;
  if (productId && flag.productIds && !flag.productIds.includes(productId)) return false;
  return true;
}
