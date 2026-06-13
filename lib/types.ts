export interface Facility {
    id: string;
    name: string;
    facilityType: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    acceptsConcreteSlurry: boolean;
    acceptsAsphaltSlurry: boolean;
    acceptsMixedSlurry: boolean;
    nightReceiving: boolean;
    earlyMorningReceiving: boolean;
    distanceMiles: number;
    pricePerLoad?: number;
    verified: boolean;
    notes?: string;
}

export const MOCK_FACILITIES: Facility[] = [
    {
        id: '1',
        name: 'Bakersfield Disposal Depot',
        facilityType: 'Concrete Slurry',
        city: 'Bakersfield',
        address: '123 Granite Way, Bakersfield, CA 93301',
        phone: '(661) 555-0101',
        email: 'info@bakersfielddisposal.com',
        website: 'https://bakersfielddisposal.com',
        acceptsConcreteSlurry: true,
        acceptsAsphaltSlurry: false,
        acceptsMixedSlurry: false,
        nightReceiving: true,
        earlyMorningReceiving: true,
        distanceMiles: 8.5,
        pricePerLoad: 120,
        verified: true,
        notes: 'Primary concrete disposal for Central Valley.'
    },
    {
        id: '2',
        name: 'Fresno Eco-Recycle',
        facilityType: 'Mixed Construction Waste',
        city: 'Fresno',
        address: '550 Industrial Dr, Fresno, CA 93706',
        phone: '(559) 555-0202',
        email: 'contact@fresnoeco.org',
        acceptsConcreteSlurry: true,
        acceptsAsphaltSlurry: true,
        acceptsMixedSlurry: true,
        nightReceiving: false,
        earlyMorningReceiving: true,
        distanceMiles: 12.2,
        pricePerLoad: 150,
        verified: true
    },
    {
        id: '3',
        name: 'Manteca Materials Management',
        facilityType: 'Asphalt Slurry',
        city: 'Manteca',
        address: '22 Highway 99, Manteca, CA 95336',
        phone: '(209) 555-0303',
        email: 'ops@mantecamaterials.com',
        acceptsConcreteSlurry: false,
        acceptsAsphaltSlurry: true,
        acceptsMixedSlurry: false,
        nightReceiving: true,
        earlyMorningReceiving: false,
        distanceMiles: 5.8,
        pricePerLoad: 95,
        verified: false,
        notes: 'Recently discovered, verification in progress.'
    },
    {
        id: '4',
        name: 'Stockton Slurry Solutions',
        facilityType: 'Concrete Slurry',
        city: 'Stockton',
        address: '900 Port Rd, Stockton, CA 95203',
        phone: '(209) 555-0404',
        email: 'support@stocktonslurry.com',
        acceptsConcreteSlurry: true,
        acceptsAsphaltSlurry: false,
        acceptsMixedSlurry: false,
        nightReceiving: false,
        earlyMorningReceiving: true,
        distanceMiles: 15.0,
        pricePerLoad: 110,
        verified: true
    },
    {
        id: '5',
        name: 'Modesto Reclamation Center',
        facilityType: 'Mixed construction waste slurry',
        city: 'Modesto',
        address: '400 Scenic Dr, Modesto, CA 95350',
        phone: '(209) 555-0505',
        email: 'hello@modestoreclaim.com',
        acceptsConcreteSlurry: true,
        acceptsAsphaltSlurry: true,
        acceptsMixedSlurry: true,
        nightReceiving: true,
        earlyMorningReceiving: true,
        distanceMiles: 3.2,
        pricePerLoad: 140,
        verified: true
    },
    {
        id: '6',
        name: 'Sacramento Environmental Services',
        facilityType: 'Industrial Waste',
        city: 'Sacramento',
        address: '1500 Capitol Ave, Sacramento, CA 95814',
        phone: '(916) 555-0606',
        email: 'admin@sacenv.gov',
        acceptsConcreteSlurry: true,
        acceptsAsphaltSlurry: true,
        acceptsMixedSlurry: false,
        nightReceiving: false,
        earlyMorningReceiving: false,
        distanceMiles: 22.4,
        pricePerLoad: 180,
        verified: true
    },
    {
        id: '7',
        name: 'Valley Waste Solutions',
        facilityType: 'Construction material recycling',
        city: 'Fresno',
        address: '777 Sunset Blvd, Fresno, CA 93722',
        phone: '(559) 555-0707',
        email: 'info@valleywaste.com',
        acceptsConcreteSlurry: true,
        acceptsAsphaltSlurry: true,
        acceptsMixedSlurry: true,
        nightReceiving: true,
        earlyMorningReceiving: true,
        distanceMiles: 9.1,
        pricePerLoad: 130,
        verified: false
    },
    {
        id: '8',
        name: 'Delta Disposal Services',
        facilityType: 'Concrete Slurry',
        city: 'Stockton',
        address: '1100 Navy Dr, Stockton, CA 95206',
        phone: '(209) 555-0808',
        email: 'billing@deltadisposal.com',
        acceptsConcreteSlurry: true,
        acceptsAsphaltSlurry: false,
        acceptsMixedSlurry: false,
        nightReceiving: false,
        earlyMorningReceiving: true,
        distanceMiles: 11.8,
        pricePerLoad: 105,
        verified: true
    },
    {
        id: '9',
        name: 'Stanislaus Slurry Experts',
        facilityType: 'Asphalt Slurry',
        city: 'Modesto',
        address: '2000 Crows Landing Rd, Modesto, CA 95358',
        phone: '(209) 555-0909',
        email: 'experts@stanislurry.com',
        acceptsConcreteSlurry: false,
        acceptsAsphaltSlurry: true,
        acceptsMixedSlurry: false,
        nightReceiving: true,
        earlyMorningReceiving: false,
        distanceMiles: 6.7,
        pricePerLoad: 115,
        verified: true
    },
    {
        id: '10',
        name: 'Capital City Concrete Recycle',
        facilityType: 'Concrete Slurry',
        city: 'Sacramento',
        address: '3200 Power Inn Rd, Sacramento, CA 95826',
        phone: '(916) 555-1010',
        email: 'recycling@capcityconcrete.com',
        acceptsConcreteSlurry: true,
        acceptsAsphaltSlurry: false,
        acceptsMixedSlurry: false,
        nightReceiving: true,
        earlyMorningReceiving: true,
        distanceMiles: 18.2,
        pricePerLoad: 125,
        verified: false
    }
];
