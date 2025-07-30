import { MinHeap } from "./minheap";
import type { GraphNode } from "./types/graphs";

export function dijkastrasSearch(graph: Map<number, GraphNode>, start: GraphNode, ends: GraphNode[]): number[][] {
  const distances = new Map<number, number>();
  const pointers = new Map<number, number>();
  const visited = new Set<number>();
  const minHeap = new MinHeap<[GraphNode, number]>((a, b) => a[1] - b[1]);
  const targetSet = new Set<number>(ends.map(e => e.id));
  const foundSet = new Set<number>();

  distances.set(start.id, 0);
  minHeap.push([start, 0]);

  while (minHeap.size() !== 0 && foundSet.size !== targetSet.size) {
    const [current, distance] = minHeap.pop()!;

    if (visited.has(current.id)) {
      continue;
    }

    visited.add(current.id);

    if (targetSet.has(current.id)) {
      foundSet.add(current.id);
    }

    for (let i = 0; i < current.edges.length; i++) {
      const edge = current.edges[i];
      if (visited.has(current.edges[i].to)) {
        continue;
      }

      const newDistance = distance + edge.weight;
      const currentBestDistance = distances.get(edge.to) ?? Infinity;

      if (newDistance < currentBestDistance) {
        distances.set(edge.to, newDistance);
        pointers.set(edge.to, current.id);
        const neighbour = graph.get(edge.to)!;
        minHeap.push([neighbour, newDistance]);
      }
    }
  }

  // Build results as number[][]
  const results: number[][] = [];
  
  for (const target of ends) {
    if (foundSet.has(target.id)) {
      const path: number[] = [];
      let currentId: number | undefined = target.id;
      while (currentId !== undefined) {
        path.unshift(currentId);
        currentId = pointers.get(currentId);
      }
      results.push(path);
    } else {
      results.push([]); // Empty array for unreachable targets
    }
  }

  return results;
}
