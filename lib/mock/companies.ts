import { Company } from '@/types/company';

export const MOCK_COMPANIES: Company[] = [
    {
        id: '1',
        companyName: 'ABC Disposal',
        industry: 'Waste Disposal',
        city: 'Hayward',
        zip: '94544',
        address: '123 Industrial Pkwy, Hayward, CA 94544',
        state: 'CA',
        phone: '(510) 555-0101',
        email: 'contact@abcdisposal.com',
        website: 'https://abcdisposal.com',
        distanceMiles: 3.1,
        enrichmentScore: 92,
        priority: 'A',
        status: 'not_contacted'
    },
    {
        id: '2',
        companyName: 'XYZ Recycling',
        industry: 'Waste Disposal',
        city: 'Union City',
        zip: '94587',
        address: '550 Recycling Way, Union City, CA 94587',
        state: 'CA',
        phone: '(510) 555-0202',
        email: 'info@xyzrecycling.com',
        website: 'https://xyzrecycling.com',
        distanceMiles: 7.8,
        enrichmentScore: 85,
        priority: 'A',
        status: 'not_contacted'
    },
    {
        id: '3',
        companyName: 'Green Earth Waste',
        industry: 'Waste Disposal',
        city: 'Fremont',
        zip: '94536',
        address: '900 Eco St, Fremont, CA 94536',
        state: 'CA',
        phone: '(510) 555-0303',
        email: 'hello@greenearth.com',
        website: 'https://greenearth.com',
        distanceMiles: 12.2,
        enrichmentScore: 78,
        priority: 'B',
        status: 'not_contacted'
    },
    {
        id: '4',
        companyName: 'Reliable Roofing',
        industry: 'Contractors',
        city: 'Hayward',
        zip: '94544',
        address: '400 Main St, Hayward, CA 94544',
        state: 'CA',
        phone: '(510) 555-0404',
        email: 'sales@reliableroofing.com',
        website: 'https://reliableroofing.com',
        distanceMiles: 2.5,
        enrichmentScore: 95,
        priority: 'A',
        status: 'not_contacted'
    },
    {
        id: '5',
        companyName: 'Bay Area HVAC',
        industry: 'Contractors',
        city: 'San Leandro',
        zip: '94577',
        address: '1500 Cool Air Dr, San Leandro, CA 94577',
        state: 'CA',
        phone: '(510) 555-0505',
        email: 'support@bayareahvac.com',
        website: 'https://bayareahvac.com',
        distanceMiles: 18.5,
        enrichmentScore: 65,
        priority: 'C',
        status: 'not_contacted'
    },
    {
        id: '6',
        companyName: 'Industrial Env Solutions',
        industry: 'Industrial Services',
        city: 'Oakland',
        zip: '94601',
        address: '2000 Port Rd, Oakland, CA 94601',
        state: 'CA',
        phone: '(510) 555-0606',
        email: 'admin@indenv.com',
        website: 'https://indenv.com',
        distanceMiles: 14.2,
        enrichmentScore: 88,
        priority: 'B',
        status: 'not_contacted'
    }
];

export const getPriorityLabel = (priority: 'A' | 'B' | 'C') => {
    switch (priority) {
        case 'A': return '0-10 miles';
        case 'B': return '10-15 miles';
        case 'C': return '15-20 miles';
    }
};
