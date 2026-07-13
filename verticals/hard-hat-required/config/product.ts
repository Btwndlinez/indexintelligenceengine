export interface ProductConfig {
  id: string;
  appName: string;
  defaultLanguage: string;
  enabledFeatures: string[];
}

const config: ProductConfig = {
  id: 'hhr',
  appName: 'Hard Hat Required',
  defaultLanguage: 'en',
  enabledFeatures: [
    'search',
    'bids',
    'equipment',
    'permits',
    'copilot',
    'compliance',
    'logistics',
  ],
};

export default config;
