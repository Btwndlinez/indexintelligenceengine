import type { ProductManifest } from './hhr';

const manifest: ProductManifest = {
  id: 'madefrom',
  name: 'Made From',
  languages: ['en', 'es'],
  verticals: [
    'industrial_wastewater',
    'scrap_metal',
    'medical_waste',
  ],
  navigation: [
    { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Materials', href: '/materials', icon: 'Package' },
    { label: 'Supply Chain', href: '/supply-chain', icon: 'Truck' },
  ],
  features: ['search', 'material_tracking', 'supply_chain', 'export'],
  permissions: ['owner', 'admin', 'analyst', 'viewer'],
};

export default manifest;
