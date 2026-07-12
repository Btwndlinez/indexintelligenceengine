import { TenantType } from './graph/schema';

export interface BrandConfig {
  name: string;
  logo: string;
  accent: string;
  favicon: string;
}

export interface TenantContext {
  tenantId: TenantType;
  primaryDomain: string;
  allowedLanguages: string[];
  branding: BrandConfig;
}

const TENANT_REGISTRY: Record<string, TenantContext> = {
  hhr: {
    tenantId: 'HHR',
    primaryDomain: 'hardhatrequired.com',
    allowedLanguages: ['en', 'es', 'zh', 'vi'],
    branding: {
      name: 'Hard Hat Required',
      logo: 'helmet',
      accent: '#E8A317',
      favicon: 'helmet',
    },
  },
  sparkywiz: {
    tenantId: 'WIRING_CODE',
    primaryDomain: 'sparkywiz.com',
    allowedLanguages: ['en', 'es', 'zh', 'vi'],
    branding: {
      name: 'Sparky Wiz',
      logo: 'lightning',
      accent: '#FF6B35',
      favicon: 'lightning',
    },
  },
  gcleadhub: {
    tenantId: 'PROPERTY_DISTRESS',
    primaryDomain: 'gcleadhub.com',
    allowedLanguages: ['en', 'es', 'zh', 'vi'],
    branding: {
      name: 'GC Lead Hub',
      logo: 'building',
      accent: '#2E86AB',
      favicon: 'building',
    },
  },
  madefrom: {
    tenantId: 'ELECTRONICS',
    primaryDomain: 'madefrom.us',
    allowedLanguages: ['en', 'es'],
    branding: {
      name: 'Made From',
      logo: 'chip',
      accent: '#6B5B95',
      favicon: 'chip',
    },
  },
};

export function resolveTenant(slug: string): TenantContext | undefined {
  return TENANT_REGISTRY[slug];
}

export function resolveClientTenant(): TenantContext {
  if (typeof window === 'undefined') return TENANT_REGISTRY.hhr;

  const params = new URLSearchParams(window.location.search);
  const fromParam = params.get('__tenant');
  if (fromParam && TENANT_REGISTRY[fromParam]) return TENANT_REGISTRY[fromParam];

  const hostname = window.location.hostname;

  if (hostname.includes('hardhatrequired') || hostname.includes('hhr')) return TENANT_REGISTRY.hhr;
  if (hostname.includes('sparkywiz') || hostname.includes('sparky')) return TENANT_REGISTRY.sparkywiz;
  if (hostname.includes('gcleadhub') || hostname.includes('gc')) return TENANT_REGISTRY.gcleadhub;
  if (hostname.includes('madefrom')) return TENANT_REGISTRY.madefrom;

  return TENANT_REGISTRY.hhr;
}

export { TENANT_REGISTRY };
