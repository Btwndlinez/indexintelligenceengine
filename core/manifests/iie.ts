import type { ProductManifest } from './hhr';

const manifest: ProductManifest = {
  id: 'iie',
  name: 'Index Intelligence Engine',
  languages: ['en'],
  verticals: [],
  navigation: [
    { label: 'Platform', href: '/platform', icon: 'Layers' },
    { label: 'Verticals', href: '/verticals', icon: 'Grid' },
    { label: 'Architecture', href: '/architecture', icon: 'Code' },
  ],
  features: [],
  permissions: ['owner', 'admin', 'viewer'],
};

export default manifest;
