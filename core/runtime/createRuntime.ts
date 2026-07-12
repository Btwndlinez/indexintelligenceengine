import { resolveTenant } from '../tenant';
import type { TenantContext } from '../tenant';
import { getManifest } from '../manifests';
import type { ProductManifest } from '../manifests';
import { getVerticalsForProduct } from '../verticals';
import type { VerticalConfigWithProviders } from '../search/registry';

export interface RuntimeContext {
  tenant: TenantContext;
  manifest: ProductManifest;
  verticals: VerticalConfigWithProviders[];
}

export function createRuntime(tenantSlug?: string): RuntimeContext {
  const slug = tenantSlug || resolveTenantFromEnvironment();
  const tenant = resolveTenant(slug);
  if (!tenant) {
    throw new Error(`Unknown tenant: ${slug}`);
  }

  const manifest = getManifest(slug);
  if (!manifest) {
    throw new Error(`No manifest for tenant: ${slug}`);
  }

  const verticals = getVerticalsForProduct(slug);

  return { tenant, manifest, verticals };
}

function resolveTenantFromEnvironment(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('__tenant');
    if (fromParam) return fromParam;

    const hostname = window.location.hostname;
    if (hostname.includes('hardhatrequired') || hostname.includes('hhr')) return 'hhr';
    if (hostname.includes('sparkywiz') || hostname.includes('sparky')) return 'sparkywiz';
    if (hostname.includes('gcleadhub') || hostname.includes('gc')) return 'gcleadhub';
    if (hostname.includes('madefrom')) return 'madefrom';
    return 'hhr';
  }

  return 'hhr';
}
