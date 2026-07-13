export interface ProductManifest {
  id: string;
  name: string;
  description?: string;
  languages: string[];
  verticals: string[];
  navigation: { label: string; href: string; icon?: string }[];
  features: string[];
  permissions: string[];
}

const manifest: ProductManifest = {
  id: 'hhr',
  name: 'Intelligence Index Engine',
  languages: ['en', 'es', 'zh', 'vi'],
  verticals: [
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
  ],
  navigation: [
    { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Search', href: '/search', icon: 'Search' },
    { label: 'Reports', href: '/reports', icon: 'FileText' },
    { label: 'Campaigns', href: '/campaigns', icon: 'Megaphone' },
  ],
  features: ['search', 'enrichment', 'export', 'campaigns', 'reports', 'telemetry'],
  permissions: ['owner', 'admin', 'sales', 'viewer'],
};

export default manifest;
