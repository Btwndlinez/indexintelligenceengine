import { GraphEngine } from '@/core/graph';
import type { NodeType } from '@/core/graph/schema';
import { entitySearch } from '@/core/services';
import type { EntityType } from '@/core/services/entity-search';
import { getVerticalsForProduct } from '@/core/verticals';
import { getNode, searchOntology } from '@/core/ontology';

export interface UnifiedSearchRequest {
  query: string;
  productId?: string;
  types?: NodeType[];
  zip?: string;
  city?: string;
  state?: string;
  vertical?: string;
  limit?: number;
  includeGraph?: boolean;
}

export interface UnifiedSearchResult {
  type: EntityType | 'ontology';
  label: string;
  subtitle?: string;
  score: number;
  metadata: Record<string, unknown>;
  graph?: {
    neighbors: number;
    edges: Array<{ type: string; target: string }>;
  };
}

export class UnifiedSearchEngine {
  private graph: GraphEngine;

  constructor(graph?: GraphEngine) {
    this.graph = graph ?? new GraphEngine();
  }

  async search(request: UnifiedSearchRequest): Promise<{
    results: UnifiedSearchResult[];
    total: number;
    ontologyHits?: Array<{ id: string; name: string; path: string }>;
  }> {
    const { query, productId, types, zip, state, vertical, limit = 25 } = request;

    const ontologyHits = searchOntology(query);
    const resolvedVertical = vertical ?? this.resolveVerticalFromOntology(ontologyHits, productId);

    const results: UnifiedSearchResult[] = [];

    const searchTypes = this.resolveEntityTypes(types, productId);

    for (const entityType of searchTypes) {
      try {
        const { results: hits } = await entitySearch.search({
          type: entityType as EntityType,
          query,
          zip,
          state,
          vertical: resolvedVertical,
          limit: Math.ceil(limit / searchTypes.length),
        });

        for (const hit of hits) {
          let graphInfo: UnifiedSearchResult['graph'];
          if (request.includeGraph) {
            const neighbors = this.graph.getNeighbors(hit.id, 1);
            graphInfo = {
              neighbors: neighbors.neighbors.size,
              edges: Array.from(neighbors.neighbors.values()).flatMap(n =>
                n.edges.map(e => ({ type: e.type, target: n.node.label }))
              ),
            };
          }

          results.push({
            type: hit.type,
            label: hit.label,
            subtitle: hit.subtitle,
            score: hit.score ?? 0.5,
            metadata: hit.metadata,
            graph: graphInfo,
          });
        }
      } catch { /* skip type if search fails */ }
    }

    const productVerticals = productId ? getVerticalsForProduct(productId) : [];
    if (productVerticals.length > 0) {
      const verticalIds = new Set(productVerticals.map(v => v.id));
      const filtered = results.filter(r => {
        if (!r.metadata.vertical) return true;
        return verticalIds.has(r.metadata.vertical as string);
      });
      return {
        results: filtered.slice(0, limit),
        total: filtered.length,
        ontologyHits: ontologyHits.map(n => ({
          id: n.id,
          name: n.name,
          path: [n, ...getAncestorsFromRoot(n.id)].map(x => x.name).join(' → '),
        })),
      };
    }

    return {
      results: results.slice(0, limit),
      total: results.length,
      ontologyHits: ontologyHits.map(n => ({
        id: n.id,
        name: n.name,
        path: [n, ...getAncestorsFromRoot(n.id)].map(x => x.name).join(' → '),
      })),
    };
  }

  private resolveEntityTypes(types?: NodeType[], productId?: string): NodeType[] {
    if (types && types.length > 0) return types;
    const defaultTypes: NodeType[] = ['company', 'bid', 'property'];
    if (!productId) return defaultTypes;

    const verticals = getVerticalsForProduct(productId);
    const entityMap: Record<string, NodeType[]> = {
      hhr: ['company', 'bid', 'equipment'],
      sparkywiz: ['company', 'permit'],
      gcleadhub: ['company', 'property', 'bid', 'permit'],
      madefrom: ['company'],
    };
    return entityMap[productId] ?? defaultTypes;
  }

  private resolveVerticalFromOntology(ontologyHits: ReturnType<typeof searchOntology>, productId?: string): string | undefined {
    if (ontologyHits.length === 0) return undefined;
    const leaf = ontologyHits[0];
    const verticalId = leaf.id.replace(/^industry:/, '').replace(/:/g, '_');
    return verticalId;
  }
}

function getAncestorsFromRoot(id: string) {
  const result: Array<{ name: string; id: string }> = [];
  const parts = id.split(':');
  for (let i = 1; i < parts.length - 1; i++) {
    const partialId = parts.slice(0, i + 1).join(':');
    const node = getNode(partialId);
    if (node) result.unshift({ name: node.name, id: node.id });
  }
  return result;
}
