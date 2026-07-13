export interface OntologyNode {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  children: OntologyNode[];
  aliases: string[];
  naicsCodes?: string[];
  metadata?: Record<string, unknown>;
}

const ONTOLOGY: OntologyNode[] = [
  {
    id: 'industry',
    name: 'Industry',
    description: 'Top-level industry classifications',
    parentId: null,
    children: [],
    aliases: ['sector'],
    children: [
      {
        id: 'industry:construction',
        name: 'Construction',
        description: 'Building and infrastructure construction trades',
        parentId: 'industry',
        aliases: ['construction industry', 'building trades'],
        naicsCodes: ['23'],
        children: [
          {
            id: 'industry:construction:concrete',
            name: 'Concrete',
            description: 'Concrete work including placement, finishing, and recycling',
            parentId: 'industry:construction',
            aliases: ['concrete contractor', 'cement work'],
            naicsCodes: ['238110'],
            children: [
              {
                id: 'industry:construction:concrete:slurry',
                name: 'Concrete Slurry',
                description: 'Concrete slurry recycling, washout, and disposal services',
                parentId: 'industry:construction:concrete',
                aliases: ['slurry', 'concrete slurry', 'concrete washout', 'slurry recycling'],
                naicsCodes: ['562211', '238110'],
                children: [
                  {
                    id: 'industry:construction:concrete:slurry:disposal',
                    name: 'Slurry Disposal Facility',
                    description: 'Facilities that accept and process concrete slurry waste',
                    parentId: 'industry:construction:concrete:slurry',
                    aliases: ['slurry disposal', 'concrete recycling plant', 'washout facility'],
                    naicsCodes: ['562211'],
                    children: [],
                    metadata: { requiresPermit: true, wasteType: 'industrial' },
                  },
                ],
              },
            ],
          },
          {
            id: 'industry:construction:demolition',
            name: 'Demolition',
            description: 'Building and structure demolition, site clearing',
            parentId: 'industry:construction',
            aliases: ['demolition contractor', 'building demolition', 'wrecking'],
            naicsCodes: ['238910'],
            children: [
              {
                id: 'industry:construction:demolition:hydro_excavation',
                name: 'Hydro Excavation',
                description: 'Non-destructive digging using pressurized water and vacuum',
                parentId: 'industry:construction:demolition',
                aliases: ['hydro vac', 'potholing', 'daylighting', 'vacuum excavation'],
                naicsCodes: ['238910'],
                children: [],
              },
              {
                id: 'industry:construction:demolition:asbestos_abatement',
                name: 'Asbestos & Lead Abatement',
                description: 'Hazardous material removal and remediation',
                parentId: 'industry:construction:demolition',
                aliases: ['asbestos removal', 'lead remediation', 'hazmat abatement'],
                naicsCodes: ['562910'],
                children: [],
              },
            ],
          },
          {
            id: 'industry:construction:roofing',
            name: 'Commercial Roofing',
            description: 'Commercial and industrial roofing systems',
            parentId: 'industry:construction',
            aliases: ['roofing contractor', 'commercial roof', 'industrial roofing'],
            naicsCodes: ['238160'],
            children: [],
          },
          {
            id: 'industry:construction:marine',
            name: 'Marine Construction',
            description: 'Waterfront and marine infrastructure construction',
            parentId: 'industry:construction',
            aliases: ['marine contractor', 'waterfront construction', 'dock building'],
            naicsCodes: ['237990'],
            children: [],
          },
        ],
      },
      {
        id: 'industry:environmental',
        name: 'Environmental Services',
        description: 'Environmental remediation, waste management, and compliance',
        parentId: 'industry',
        aliases: ['environmental industry', 'environmental services'],
        naicsCodes: ['562'],
        children: [
          {
            id: 'industry:environmental:wastewater',
            name: 'Industrial Wastewater',
            description: 'Industrial wastewater treatment and management',
            parentId: 'industry:environmental',
            aliases: ['wastewater treatment', 'industrial water', 'effluent treatment'],
            naicsCodes: ['221320'],
            children: [
              {
                id: 'industry:environmental:wastewater:grease_trap',
                name: 'Grease Trap Services',
                description: 'Commercial grease trap pumping, cleaning, and recycling',
                parentId: 'industry:environmental:wastewater',
                aliases: ['grease trap', 'grease interceptor', 'FOG', 'grease pumping'],
                naicsCodes: ['562219', '562998'],
                children: [],
              },
              {
                id: 'industry:environmental:wastewater:stormwater',
                name: 'Stormwater Compliance',
                description: 'Stormwater management, compliance, and BMP maintenance',
                parentId: 'industry:environmental:wastewater',
                aliases: ['stormwater', 'SWPPP', 'BMP maintenance', 'stormwater compliance'],
                naicsCodes: ['562998'],
                children: [],
              },
            ],
          },
          {
            id: 'industry:environmental:medical_waste',
            name: 'Medical Waste Disposal',
            description: 'Medical and biohazard waste collection and disposal',
            parentId: 'industry:environmental',
            aliases: ['medical waste', 'biohazard disposal', 'sharps disposal'],
            naicsCodes: ['562112', '562211'],
            children: [],
          },
          {
            id: 'industry:environmental:scrap_metal',
            name: 'Scrap Metal Recycling',
            description: 'Scrap metal collection, processing, and recycling',
            parentId: 'industry:environmental',
            aliases: ['scrap metal', 'metal recycling', 'ferrous scrap', 'non-ferrous scrap'],
            naicsCodes: ['423930', '562920'],
            children: [],
          },
        ],
      },
      {
        id: 'industry:mep',
        name: 'MEP — Mechanical, Electrical, Plumbing',
        description: 'Mechanical, electrical, and plumbing trades',
        parentId: 'industry',
        aliases: ['MEP', 'mechanical electrical plumbing'],
        naicsCodes: ['2382'],
        children: [
          {
            id: 'industry:mep:electrical',
            name: 'Electrical Contracting',
            description: 'Electrical installation, maintenance, and repair',
            parentId: 'industry:mep',
            aliases: ['electrical contractor', 'electrician', 'electrical services'],
            naicsCodes: ['238210'],
            children: [
              {
                id: 'industry:mep:electrical:generator',
                name: 'Generator Testing & Maintenance',
                description: 'Backup generator testing, maintenance, and repair',
                parentId: 'industry:mep:electrical',
                aliases: ['generator testing', 'generator maintenance', 'emergency generator'],
                naicsCodes: ['238210', '811310'],
                children: [],
              },
            ],
          },
          {
            id: 'industry:mep:hvac',
            name: 'HVAC Contracting',
            description: 'Heating, ventilation, and air conditioning services',
            parentId: 'industry:mep',
            aliases: ['HVAC contractor', 'heating and cooling', 'mechanical contractor'],
            naicsCodes: ['238220'],
            children: [
              {
                id: 'industry:mep:hvac:balance',
                name: 'HVAC Balancing',
                description: 'HVAC system testing, adjusting, and balancing',
                parentId: 'industry:mep:hvac',
                aliases: ['HVAC balance', 'air balancing', 'TAB', 'test and balance'],
                naicsCodes: ['238220'],
                children: [],
              },
              {
                id: 'industry:mep:hvac:kitchen_exhaust',
                name: 'Kitchen Exhaust Cleaning',
                description: 'Commercial kitchen exhaust hood and duct cleaning',
                parentId: 'industry:mep:hvac',
                aliases: ['kitchen exhaust', 'hood cleaning', 'exhaust duct cleaning'],
                naicsCodes: ['238220', '561790'],
                children: [],
              },
            ],
          },
          {
            id: 'industry:mep:plumbing',
            name: 'Plumbing Contracting',
            description: 'Commercial and industrial plumbing services',
            parentId: 'industry:mep',
            aliases: ['plumbing contractor', 'commercial plumber', 'industrial plumbing'],
            naicsCodes: ['238220'],
            children: [
              {
                id: 'industry:mep:plumbing:backflow',
                name: 'Backflow Testing',
                description: 'Backflow prevention device testing and certification',
                parentId: 'industry:mep:plumbing',
                aliases: ['backflow testing', 'backflow prevention', 'cross connection'],
                naicsCodes: ['238220', '541380'],
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 'industry:fire_safety',
        name: 'Fire Safety & Protection',
        description: 'Fire suppression, detection, and safety systems',
        parentId: 'industry',
        aliases: ['fire protection', 'fire safety', 'fire suppression'],
        naicsCodes: ['238990'],
        children: [
          {
            id: 'industry:fire_safety:sprinkler',
            name: 'Fire Sprinkler Systems',
            description: 'Fire sprinkler installation, inspection, and maintenance',
            parentId: 'industry:fire_safety',
            aliases: ['fire sprinkler', 'sprinkler system', 'fire suppression sprinkler'],
            naicsCodes: ['238990'],
            children: [],
          },
          {
            id: 'industry:fire_safety:extinguisher',
            name: 'Fire Extinguisher Services',
            description: 'Fire extinguisher inspection, recharge, and maintenance',
            parentId: 'industry:fire_safety',
            aliases: ['fire extinguisher', 'extinguisher service', 'extinguisher recharge'],
            naicsCodes: ['561990'],
            children: [],
          },
        ],
      },
      {
        id: 'industry:vertical_transport',
        name: 'Vertical Transportation',
        description: 'Elevator, escalator, and lift maintenance',
        parentId: 'industry',
        aliases: ['elevator', 'escalator', 'vertical transport'],
        naicsCodes: ['238290'],
        children: [
          {
            id: 'industry:vertical_transport:elevator',
            name: 'Elevator Inspection & Maintenance',
            description: 'Elevator inspection, testing, and maintenance services',
            parentId: 'industry:vertical_transport',
            aliases: ['elevator inspection', 'elevator maintenance', 'lift service'],
            naicsCodes: ['238290', '811310'],
            children: [],
          },
        ],
      },
      {
        id: 'industry:real_estate',
        name: 'Real Estate',
        description: 'Real estate ownership, development, and investment',
        parentId: 'industry',
        aliases: ['real estate', 'property'],
        naicsCodes: ['531', '236'],
        children: [
          {
            id: 'industry:real_estate:commercial',
            name: 'Commercial Real Estate',
            description: 'Commercial property ownership and development',
            parentId: 'industry:real_estate',
            aliases: ['CRE', 'commercial property', 'office', 'retail'],
            naicsCodes: ['531120'],
            children: [],
          },
          {
            id: 'industry:real_estate:multifamily',
            name: 'Multifamily Housing',
            description: 'Apartment and multifamily residential property',
            parentId: 'industry:real_estate',
            aliases: ['apartment', 'multifamily', 'apartment complex'],
            naicsCodes: ['531110'],
            children: [],
          },
          {
            id: 'industry:real_estate:industrial',
            name: 'Industrial Property',
            description: 'Industrial and warehouse property',
            parentId: 'industry:real_estate',
            aliases: ['industrial property', 'warehouse', 'manufacturing facility'],
            naicsCodes: ['531130'],
            children: [],
          },
        ],
      },
    ],
    metadata: { isRoot: true },
  },
];

function findNode(nodes: OntologyNode[], id: string): OntologyNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNode(node.children, id);
    if (found) return found;
  }
  return undefined;
}

function flatten(nodes: OntologyNode[]): OntologyNode[] {
  const result: OntologyNode[] = [];
  function walk(list: OntologyNode[]) {
    for (const n of list) {
      result.push(n);
      walk(n.children);
    }
  }
  walk(nodes);
  return result;
}

export function getOntology(): OntologyNode[] {
  return ONTOLOGY;
}

export function getNode(id: string): OntologyNode | undefined {
  return findNode(ONTOLOGY, id);
}

export function getChildren(id: string): OntologyNode[] {
  const node = getNode(id);
  return node?.children ?? [];
}

export function getAncestors(id: string): OntologyNode[] {
  const result: OntologyNode[] = [];
  let current = getNode(id);
  while (current?.parentId) {
    const parent = getNode(current.parentId);
    if (parent) {
      result.unshift(parent);
      current = parent;
    } else break;
  }
  return result;
}

export function getDescendants(id: string): OntologyNode[] {
  const node = getNode(id);
  if (!node) return [];
  return flatten(node.children);
}

export function getLeafNodes(): OntologyNode[] {
  return flatten(ONTOLOGY).filter(n => n.children.length === 0);
}

export function searchOntology(query: string): OntologyNode[] {
  const lower = query.toLowerCase();
  return flatten(ONTOLOGY).filter(
    n =>
      n.name.toLowerCase().includes(lower) ||
      n.aliases.some(a => a.toLowerCase().includes(lower)) ||
      n.id.toLowerCase().includes(lower)
  );
}

export function resolveVerticalToOntologyId(verticalId: string): string | undefined {
  const flat = flatten(ONTOLOGY);
  const match = flat.find(
    n => n.id === verticalId || n.aliases.some(a => a.replace(/\s+/g, '_') === verticalId)
  );
  return match?.id;
}

export type { OntologyNode };
