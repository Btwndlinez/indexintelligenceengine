import { DiscoveryProvider, DiscoveryParams, getStateFromZip } from './base';
import { Company } from '@/types/company';

export class RegulatoryProvider implements DiscoveryProvider {
  name = 'regulatory_permit';

  async search(params: DiscoveryParams): Promise<Partial<Company>[]> {
    const state = getStateFromZip(params.zip);
    const now = new Date().toISOString();
    const vertical = params.vertical;

    if (state === 'CA' && vertical === 'slurry_concrete') {
      return [
        {
          id: 'reg-ca-crete-crush',
          companyName: 'Crete Crush',
          address: '1230 Commerce Way',
          city: 'Sacramento',
          state: 'CA',
          zipCode: '95815',
          website: 'https://cretecrush.com',
          phone: '916-555-0199',
          notes: 'Regulatory Match: CalRecycle SWIS Permit + Industrial Stormwater BMP. Approved for concrete reclaiming and slurry disposal.',
          source: this.name,
          hasRegulatoryPermit: true,
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
          website: 'https://baslurry.com',
          phone: '510-555-0142',
          notes: 'Regulatory Match: Licensed Transporter (HWCL) + EPA Waste Carrier.',
          source: this.name,
          hasRegulatoryPermit: true,
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
          phone: '510-555-0188',
          notes: 'Regulatory Match: NPDES-CAG200001-SF. Permitted Flow: 15000 GPD. CA Regional Water Quality Control Board.',
          source: this.name,
          hasRegulatoryPermit: true,
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
          phone: '408-555-0166',
          notes: 'Regulatory Match: WDR-100035612. Industrial Disposal Site. DTSC Permitted. Capacity: 50000 GPD.',
          source: this.name,
          hasRegulatoryPermit: true,
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
          website: 'https://lonestarslurry.com',
          phone: '713-555-0177',
          notes: 'Regulatory Match: TXG114920. TCEQ NPDES Concrete Permit. Permitted Flow: 18000 GPD.',
          source: this.name,
          hasRegulatoryPermit: true,
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
          phone: '817-555-0155',
          notes: 'Regulatory Match: TX-LIQ-99381. TCEQ Liquid Waste Hauler Permit.',
          source: this.name,
          hasRegulatoryPermit: true,
          createdAt: now,
          updatedAt: now,
        },
      ];
    }

    return [];
  }
}
