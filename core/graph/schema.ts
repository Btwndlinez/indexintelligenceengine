export type NodeType =
  | 'company'
  | 'contact'
  | 'property'
  | 'permit'
  | 'bid'
  | 'equipment'
  | 'supplier'
  | 'owner'
  | 'utility'
  | 'jurisdiction'
  | 'location'
  | 'vertical'
  | 'ontology';

export type EdgeType =
  | 'owns'
  | 'uses'
  | 'submitted'
  | 'won'
  | 'supplied_by'
  | 'managed_by'
  | 'connected_to'
  | 'served_by'
  | 'located_in'
  | 'has_contact'
  | 'belongs_to'
  | 'classified_as'
  | 'evidence_for';

export interface NodeDefinition {
  type: NodeType;
  label: string;
  description: string;
  properties: string[];
}

export const NODE_DEFINITIONS: Record<NodeType, NodeDefinition> = {
  company: {
    type: 'company',
    label: 'Company',
    description: 'A business entity in the construction or service industry',
    properties: ['name', 'industry', 'website', 'phone', 'email', 'revenue', 'employees'],
  },
  contact: {
    type: 'contact',
    label: 'Contact',
    description: 'An individual associated with a company or property',
    properties: ['name', 'title', 'phone', 'email', 'linkedin', 'role'],
  },
  property: {
    type: 'property',
    label: 'Property',
    description: 'A physical property or building',
    properties: ['address', 'city', 'state', 'parcelId', 'propertyType', 'yearBuilt', 'sqft'],
  },
  permit: {
    type: 'permit',
    label: 'Permit',
    description: 'A construction or regulatory permit',
    properties: ['number', 'type', 'status', 'issuedDate', 'expiryDate', 'value', 'contractor'],
  },
  bid: {
    type: 'bid',
    label: 'Bid',
    description: 'A bid or RFP opportunity',
    properties: ['title', 'agency', 'value', 'dueDate', 'status', 'state', 'city'],
  },
  equipment: {
    type: 'equipment',
    label: 'Equipment',
    description: 'Construction or industrial equipment',
    properties: ['name', 'category', 'make', 'model', 'year', 'ownerId'],
  },
  supplier: {
    type: 'supplier',
    label: 'Supplier',
    description: 'A supplier or vendor to the construction industry',
    properties: ['name', 'type', 'serviceArea', 'certifications'],
  },
  owner: {
    type: 'owner',
    label: 'Owner',
    description: 'A property owner or manager',
    properties: ['name', 'type', 'portfolio', 'contactInfo'],
  },
  utility: {
    type: 'utility',
    label: 'Utility',
    description: 'A utility provider (power, water, gas, telecom)',
    properties: ['name', 'type', 'serviceTerritory', 'contactInfo'],
  },
  jurisdiction: {
    type: 'jurisdiction',
    label: 'Jurisdiction',
    description: 'A governing or regulatory jurisdiction',
    properties: ['name', 'type', 'region', 'codes', 'permitsRequired'],
  },
  location: {
    type: 'location',
    label: 'Location',
    description: 'A geographic location (city, region, area)',
    properties: ['city', 'state', 'zip', 'lat', 'lng'],
  },
  vertical: {
    type: 'vertical',
    label: 'Vertical',
    description: 'A product vertical classification',
    properties: ['id', 'name', 'industryName'],
  },
  ontology: {
    type: 'ontology',
    label: 'Ontology Node',
    description: 'A classification node in the ontology hierarchy',
    properties: ['id', 'name', 'path', 'aliases', 'naicsCodes'],
  },
};

export const EDGE_DEFINITIONS: Record<EdgeType, { label: string; description: string }> = {
  owns: { label: 'Owns', description: 'Entity owns another entity (company→property, owner→property)' },
  uses: { label: 'Uses', description: 'Entity uses equipment or services' },
  submitted: { label: 'Submitted', description: 'Entity submitted a permit or bid' },
  won: { label: 'Won', description: 'Entity won a bid or contract' },
  supplied_by: { label: 'Supplied By', description: 'Entity is supplied by another entity' },
  managed_by: { label: 'Managed By', description: 'Entity is managed by another entity' },
  connected_to: { label: 'Connected To', description: 'Entity has a utility connection' },
  served_by: { label: 'Served By', description: 'Entity is served by a jurisdiction' },
  located_in: { label: 'Located In', description: 'Entity is located in a geographic area' },
  has_contact: { label: 'Has Contact', description: 'Entity has an associated contact person' },
  belongs_to: { label: 'Belongs To', description: 'Entity belongs to a classification or group' },
  classified_as: { label: 'Classified As', description: 'Entity is classified under an ontology node' },
  evidence_for: { label: 'Evidence For', description: 'Evidence supporting a relationship or property' },
};
