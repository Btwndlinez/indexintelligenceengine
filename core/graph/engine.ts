import type { NodeType, EdgeType } from './schema';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  metadata?: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: EdgeType;
  weight: number;
  metadata?: { confidence?: number; evidence?: string[] };
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphQuery {
  types?: NodeType[];
  edgeTypes?: EdgeType[];
  maxDepth?: number;
  limit?: number;
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

  connect(sourceId: string, targetId: string, type: EdgeType, weight = 1, metadata?: GraphEdge['metadata']): void {
    if (!this.nodes.has(sourceId)) return;
    if (!this.nodes.has(targetId)) return;
    this.edges.push({ source: sourceId, target: targetId, type, weight, metadata });
  }

  getGraph(query?: GraphQuery): GraphData {
    let nodes = Array.from(this.nodes.values());
    let edges = this.edges;

    if (query?.types) {
      nodes = nodes.filter(n => query.types!.includes(n.type));
    }
    if (query?.edgeTypes) {
      edges = edges.filter(e => query.edgeTypes!.includes(e.type));
    }
    if (query?.limit && nodes.length > query.limit) {
      nodes = nodes.slice(0, query.limit);
    }

    return { nodes, edges };
  }

  getNeighbors(nodeId: string, depth = 1): { node: GraphNode; neighbors: Map<string, { node: GraphNode; edges: GraphEdge[] }> } {
    const node = this.nodes.get(nodeId);
    if (!node) return { node: null as unknown as GraphNode, neighbors: new Map() };

    const neighbors = new Map<string, { node: GraphNode; edges: GraphEdge[] }>();

    const visited = new Set<string>();
    const queue: Array<{ id: string; level: number }> = [{ id: nodeId, level: 0 }];
    visited.add(nodeId);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.level >= depth) continue;

      const connectedEdges = this.edges.filter(
        e => e.source === current.id || e.target === current.id
      );

      for (const edge of connectedEdges) {
        const neighborId = edge.source === current.id ? edge.target : edge.source;
        if (visited.has(neighborId)) continue;
        visited.add(neighborId);

        const neighborNode = this.nodes.get(neighborId);
        if (!neighborNode) continue;

        const existing = neighbors.get(neighborId);
        if (existing) {
          existing.edges.push(edge);
        } else {
          neighbors.set(neighborId, { node: neighborNode, edges: [edge] });
        }

        queue.push({ id: neighborId, level: current.level + 1 });
      }
    }

    return { node, neighbors };
  }

  getPath(fromId: string, toId: string): GraphNode[] | null {
    const visited = new Set<string>();
    const parent = new Map<string, string>();

    const queue: string[] = [fromId];
    visited.add(fromId);

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === toId) {
        return this.reconstructPath(parent, fromId, toId);
      }

      const connected = this.edges.filter(e => e.source === current || e.target === current);
      for (const edge of connected) {
        const neighbor = edge.source === current ? edge.target : edge.source;
        if (!visited.has(neighbor) && this.nodes.has(neighbor)) {
          visited.add(neighbor);
          parent.set(neighbor, current);
          queue.push(neighbor);
        }
      }
    }

    return null;
  }

  findNodesByType(type: NodeType): GraphNode[] {
    return Array.from(this.nodes.values()).filter(n => n.type === type);
  }

  query(request: GraphQuery): GraphData {
    const filtered = this.getGraph(request);

    if (request.maxDepth && request.maxDepth > 0) {
      const edgeIds = new Set(filtered.edges.map(e => `${e.source}-${e.target}`));
      for (let i = 0; i < request.maxDepth; i++) {
        for (const edge of this.edges) {
          if (filtered.nodes.some(n => n.id === edge.source) &&
              !filtered.nodes.some(n => n.id === edge.target) &&
              this.nodes.has(edge.target)) {
            filtered.nodes.push(this.nodes.get(edge.target)!);
            if (!edgeIds.has(`${edge.source}-${edge.target}`)) {
              filtered.edges.push(edge);
              edgeIds.add(`${edge.source}-${edge.target}`);
            }
          }
        }
      }
    }

    return filtered;
  }

  clear(): void {
    this.nodes.clear();
    this.edges = [];
  }

  size(): { nodes: number; edges: number } {
    return { nodes: this.nodes.size, edges: this.edges.length };
  }

  private reconstructPath(parent: Map<string, string>, from: string, to: string): GraphNode[] {
    const path: GraphNode[] = [];
    let current: string | undefined = to;
    while (current && current !== from) {
      const node = this.nodes.get(current);
      if (node) path.unshift(node);
      current = parent.get(current);
    }
    const fromNode = this.nodes.get(from);
    if (fromNode) path.unshift(fromNode);
    return path;
  }
}
