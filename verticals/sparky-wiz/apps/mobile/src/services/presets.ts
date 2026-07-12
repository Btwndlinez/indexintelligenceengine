// Preset configurations for electricians
// Common job site setups that load with one tap

export interface Preset {
  id: string;
  name: string;
  phase: 1 | 3;
  voltage: number;
  material: string;
  wireSize: string;
}

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'residential-120v',
    name: '120V Residential',
    phase: 1,
    voltage: 120,
    material: 'Copper',
    wireSize: '#12',
  },
  {
    id: 'commercial-208v',
    name: '208V Commercial',
    phase: 3,
    voltage: 208,
    material: 'Copper',
    wireSize: '#10',
  },
  {
    id: 'warehouse-480v',
    name: '480V Warehouse',
    phase: 3,
    voltage: 480,
    material: 'Copper',
    wireSize: '#10',
  },
  {
    id: 'ev-charger-240v',
    name: 'EV Charger 240V',
    phase: 1,
    voltage: 240,
    material: 'Copper',
    wireSize: '#6',
  },
  {
    id: 'panel-277v',
    name: '277V Panel',
    phase: 3,
    voltage: 277,
    material: 'Copper',
    wireSize: '#12',
  },
];

export function findPreset(id: string): Preset | undefined {
  return DEFAULT_PRESETS.find((p) => p.id === id);
}
