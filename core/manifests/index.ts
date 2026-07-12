import hhrManifest from './hhr';
import sparkywizManifest from './sparkywiz';
import gcleadhubManifest from './gcleadhub';
import madefromManifest from './madefrom';
import iieManifest from './iie';

export const MANIFESTS: Record<string, typeof hhrManifest> = {
  hhr: hhrManifest,
  sparkywiz: sparkywizManifest,
  gcleadhub: gcleadhubManifest,
  madefrom: madefromManifest,
  iie: iieManifest,
};

export function getManifest(productId: string) {
  return MANIFESTS[productId] || null;
}

export type { ProductManifest } from './hhr';
