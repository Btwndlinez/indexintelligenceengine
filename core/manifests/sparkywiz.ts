import type { ProductManifest } from './hhr';

const manifest: ProductManifest = {
  id: 'sparkywiz',
  name: 'Sparky Wiz',
  description: 'Electrical Intelligence Platform — an IIE Vertical Application',
  languages: ['en', 'es', 'zh', 'vi'],
  verticals: [
    'generator_testing',
    'elevator_inspection',
    'hvac_balance',
    'fire_sprinkler',
    'fire_extinguisher',
    'backflow_testing',
  ],
  navigation: [
    { label: 'Calculators', href: '/calculators', icon: 'Calculator' },
    { label: 'Electrical Search', href: '/search', icon: 'Search' },
    { label: 'NEC Code', href: '/code', icon: 'BookOpen' },
    { label: 'Projects', href: '/projects', icon: 'HardHat' },
    { label: 'Inspections', href: '/inspections', icon: 'ClipboardCheck' },
  ],
  features: ['calculators', 'electrical_search', 'nec_code', 'projects', 'inspections', 'ocr', 'barcode', 'telemetry'],
  permissions: ['owner', 'admin', 'electrician', 'technician', 'viewer'],
};

export default manifest;
