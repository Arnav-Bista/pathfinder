import type { Point } from "../kdtree";

export interface GraphNode extends Point {
  id: number;
  lat: number;
  lng: number;
  edges: Edge[];
}

export interface Edge {
  to: number;
  weight: number;
  // wayId: number;
  // highway: string;
}

export interface Graph {
  noes: Map<number, GraphNode>;
}
