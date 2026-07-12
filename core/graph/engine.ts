export interface GraphNode {
  id: string;
  label: string;
  type: 'company' | 'contact' | 'vertical' | 'location';
  metadata?: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export class GraphEngine {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: GraphEdge[] = [];

  addNode(node: GraphNode): void {
    if (!this.nodes.has(node.id)) {
      this.nodes.set(node.id, node);
    }
  }

  addEdge(edge: GraphEdge): void {
    this.edges.push(edge);
  }

  connect(sourceId: string, targetId: string, label: string, weight = 1): void {
    this.edges.push({ source: sourceId, target: targetId, label, weight });
  }

  getGraph(): GraphData {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
    };
  }

  getNeighbors(nodeId: string): { node: GraphNode; edges: GraphEdge[] } {
    const node = this.nodes.get(nodeId);
    if (!node) return { node: null as unknown as GraphNode, edges: [] };

    const connectedEdges = this.edges.filter(
      e => e.source === nodeId || e.target === nodeId
    );
    return { node, edges: connectedEdges };
  }

  clear(): void {
    this.nodes.clear();
    this.edges = [];
  }

  buildFromCompanies(
    companies: Array<{
      id?: string;
      companyName?: string;
      city?: string;
      state?: string;
      verticalId?: string;
      contacts?: Array<{ id?: string; name?: string }>;
    }>,
    verticalLabel?: string
  ): GraphData {
    this.clear();

    for (const c of companies) {
      if (!c.id || !c.companyName) continue;

      this.addNode({
        id: c.id,
        label: c.companyName,
        type: 'company',
        metadata: { city: c.city, state: c.state, verticalId: c.verticalId },
      });

      if (c.city) {
        const locId = `loc:${c.city}`;
        this.addNode({ id: locId, label: c.city, type: 'location' });
        this.connect(c.id, locId, 'located_in', 1);
      }

      if (c.contacts) {
        for (const contact of c.contacts) {
          if (!contact.id || !contact.name) continue;
          this.addNode({
            id: contact.id,
            label: contact.name,
            type: 'contact',
          });
          this.connect(c.id, contact.id, 'has_contact', 2);
        }
      }
    }

    if (verticalLabel) {
      const vId = `vertical:${verticalLabel}`;
      this.addNode({ id: vId, label: verticalLabel, type: 'vertical' });
      for (const c of companies) {
        if (c.id) this.connect(c.id, vId, 'belongs_to', 1);
      }
    }

    return this.getGraph();
  }
}
