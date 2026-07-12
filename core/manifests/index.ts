import hhrManifest from './hhr';
import sparkywizManifest from './sparkywiz';
import gcleadhubManifest from './gcleadhub';
import madefromManifest from './madefrom';

export const MANIFESTS: Record<string, typeof hhrManifest> = {
  hhr: hhrManifest,
  sparkywiz: sparkywizManifest,
  gcleadhub: gcleadhubManifest,
  madefrom: madefromManifest,
};

export function getManifest(productId: string) {
  return MANIFESTS[productId] || null;
}

export type { ProductManifest } from './hhr';
