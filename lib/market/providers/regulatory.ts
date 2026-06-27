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

    if (state === 'CA' && vertical === 'slurry_concrete') {
      return [
        {
          id: 'reg-ca-crete-crush',
          companyName: 'Crete Crush',
          address: '1230 Commerce Way',
          city: 'Sacramento',
          state: 'CA',
          zipCode: '95815',
          latitude: 38.595,
          longitude: -121.430,
          website: 'https://cretecrush.com',
          phone: '916-555-0199',
          notes: 'CalRecycle SWIS Permit. Approved for concrete slurry recycling, concrete reclaiming, concrete washout, and slurry disposal. Industrial Stormwater BMP. Ready mix reclaiming facility.',
          source: this.name,
          hasRegulatoryPermit: true,
          distanceMiles: calcDist(38.595, -121.430),
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'reg-ca-bay-slurry',
          companyName: 'Bay Area Slurry Solutions',
          address: '451 Industrial Pkwy',
          city: 'Hayward',
          state: 'CA',
          zipCode: '94544',
          latitude: 37.625,
          longitude: -122.086,
          website: 'https://baslurry.com',
          phone: '510-555-0142',
          notes: 'Licensed Transporter (HWCL) + EPA Waste Carrier. Slurry recycling, concrete washout services, vacuum truck operations.',
          source: this.name,
          hasRegulatoryPermit: true,
          distanceMiles: calcDist(37.625, -122.086),
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'reg-ca-pac-bay',
          companyName: 'Pacific Bay Ready Mix & Slurry Processing',
          address: '1400 Industrial Parkway',
          city: 'Hayward',
          state: 'CA',
          zipCode: '94544',
          latitude: 37.630,
          longitude: -122.090,
          phone: '510-555-0188',
          notes: 'NPDES-CAG200001-SF. Permitted Flow: 15000 GPD. CA Regional Water Quality Control Board. Concrete washout, slurry recycling, ready mix batch plant.',
          source: this.name,
          hasRegulatoryPermit: true,
          distanceMiles: calcDist(37.630, -122.090),
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'reg-ca-norcal-slurry',
          companyName: 'NorCal Slurry Management & Disposal LLC',
          address: '3100 Almaden Expressway',
          city: 'San Jose',
          state: 'CA',
          zipCode: '95125',
          latitude: 37.244,
          longitude: -121.876,
          phone: '408-555-0166',
          notes: 'WDR-100035612. Industrial Disposal Site. DTSC Permitted. Capacity: 50000 GPD. Slurry recycling, concrete reclaiming, washout disposal.',
          source: this.name,
          hasRegulatoryPermit: true,
          distanceMiles: calcDist(37.244, -121.876),
          createdAt: now,
          updatedAt: now,
        },
      ];
    }

    if (state === 'TX' && vertical === 'slurry_concrete') {
      return [
        {
          id: 'reg-tx-lone-star',
          companyName: 'Lone Star Slurry Dewatering Inc',
          address: '1105 Industrial Blvd',
          city: 'Houston',
          state: 'TX',
          zipCode: '77002',
          latitude: 29.760,
          longitude: -95.369,
          website: 'https://lonestarslurry.com',
          phone: '713-555-0177',
          notes: 'TXG114920. TCEQ NPDES Concrete Permit. Permitted Flow: 18000 GPD. Slurry dewatering, concrete washout, reclaiming services.',
          source: this.name,
          hasRegulatoryPermit: true,
          distanceMiles: calcDist(29.760, -95.369),
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'reg-tx-gaza',
          companyName: 'Gaza Slurry Hauling & Environmental',
          address: '4300 East Loop 820 S',
          city: 'Fort Worth',
          state: 'TX',
          zipCode: '76119',
          latitude: 32.715,
          longitude: -97.286,
          phone: '817-555-0155',
          notes: 'TX-LIQ-99381. TCEQ Liquid Waste Hauler Permit. Slurry hauling, concrete washout pumping, vacuum truck services.',
          source: this.name,
          hasRegulatoryPermit: true,
          distanceMiles: calcDist(32.715, -97.286),
          createdAt: now,
          updatedAt: now,
        },
      ];
    }

    return [];
  }
}
