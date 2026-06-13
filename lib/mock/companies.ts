import { Company } from '@/types/company';

export const MOCK_COMPANIES: Company[] = [
    {
        id: '1',
        name: 'ABC Disposal',
        industry: 'Waste Disposal',
        city: 'Hayward',
        zip: '94544',
        address: '123 Industrial Pkwy, Hayward, CA 94544',
        phone: '(510) 555-0101',
        email: 'contact@abcdisposal.com',
        website: 'https://abcdisposal.com',
        distance: 3.1,
        score: 92,
        tier: 'A',
        verified: true
    },
    {
        id: '2',
        name: 'XYZ Recycling',
        industry: 'Waste Disposal',
        city: 'Union City',
        zip: '94587',
        address: '550 Recycling Way, Union City, CA 94587',
        phone: '(510) 555-0202',
        email: 'info@xyzrecycling.com',
        website: 'https://xyzrecycling.com',
        distance: 7.8,
        score: 85,
        tier: 'A',
        verified: true
    },
    {
        id: '3',
        name: 'Green Earth Waste',
        industry: 'Waste Disposal',
        city: 'Fremont',
        zip: '94536',
        address: '900 Eco St, Fremont, CA 94536',
        phone: '(510) 555-0303',
        email: 'hello@greenearth.com',
        website: 'https://greenearth.com',
        distance: 12.2,
        score: 78,
        tier: 'B',
        verified: false
    },
    {
        id: '4',
        name: 'Reliable Roofing',
        industry: 'Contractors',
        city: 'Hayward',
        zip: '94544',
        address: '400 Main St, Hayward, CA 94544',
        phone: '(510) 555-0404',
        email: 'sales@reliableroofing.com',
        website: 'https://reliableroofing.com',
        distance: 2.5,
        score: 95,
        tier: 'A',
        verified: true
    },
    {
        id: '5',
        name: 'Bay Area HVAC',
        industry: 'Contractors',
        city: 'San Leandro',
        zip: '94577',
        address: '1500 Cool Air Dr, San Leandro, CA 94577',
        phone: '(510) 555-0505',
        email: 'support@bayareahvac.com',
        website: 'https://bayareahvac.com',
        distance: 18.5,
        score: 65,
        tier: 'C',
        verified: true
    },
    {
        id: '6',
        name: 'Industrial Env Solutions',
        industry: 'Industrial Services',
        city: 'Oakland',
        zip: '94601',
        address: '2000 Port Rd, Oakland, CA 94601',
        phone: '(510) 555-0606',
        email: 'admin@indenv.com',
        website: 'https://indenv.com',
        distance: 14.2,
        score: 88,
        tier: 'B',
        verified: true
    }
];

export const getTierLabel = (tier: 'A' | 'B' | 'C') => {
    switch (tier) {
        case 'A': return '0-10 miles';
        case 'B': return '10-15 miles';
        case 'C': return '15-20 miles';
    }
};
