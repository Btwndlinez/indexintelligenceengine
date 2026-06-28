import { DiscoveryProvider, DiscoveryParams, getStateFromZip } from './base';
import { Company } from '@/types/company';
import { haversineDistance } from '@/lib/geo';

export class RegulatoryProvider implements DiscoveryProvider {
  name = 'regulatory_permit';

  async search(params: DiscoveryParams): Promise<Partial<Company>[]> {
    const state = getStateFromZip(params.zip);
    const now = new Date().toISOString();
    const vertical = params.vertical;
    const { lat: zipLat, lng: zipLng } = params;

    function calcDist(lat?: number, lng?: number): number | undefined {
      if (zipLat != null && zipLng != null && lat != null && lng != null) {
        return Math.round(haversineDistance(zipLat, zipLng, lat, lng) * 10) / 10;
      }
      return undefined;
    }

    return [];
  }
}
