
export interface Point {
  getDimension(index: number): number;
  getDimensionCount(): number;
}

export class KDNode<T extends Point> {
  constructor(
    public point: T,
    public left: KDNode<T> | null = null,
    public right: KDNode<T> | null = null,
    public dimensions: number = 0,
  ) { }
}

export default class KDTree<T extends Point> {

  public dimensions: number;
  public root: KDNode<T> | null = null;

  constructor(points: T[]) {
    this.dimensions = points[0].getDimensionCount();
    this.root = this.buildTree(points, 0);
  }

  private buildTree(points: T[], depth: number): KDNode<T> | null {
    if (points.length === 0) {
      return null;
    }

    const axis = depth % this.dimensions;
    points.sort((a, b) => a.getDimension(axis) - b.getDimension(axis));

    const medianIndex = Math.floor(points.length / 2);
    const medianPoint = points[medianIndex];

    const leftPoints = points.slice(0, medianIndex);
    const rightPoints = points.slice(medianIndex + 1);

    const leftChild = this.buildTree(leftPoints, depth + 1);
    const rightChild = this.buildTree(rightPoints, depth + 1);

    return new KDNode(medianPoint, leftChild, rightChild, this.dimensions);
  }

  public getNearestNeighbor(target: T): T | null {
    return this.searchNearest(this.root, target, 0);
  }

  // Manhattan distance since we don't really care about the precise distance
  private getCloserNode(target: T, a: T, b: T): T {
    let distanceA: number = 0;
    let distanceB: number = 0;
    for (let i = 0; i < target.getDimensionCount(); i++) {
      distanceA += Math.abs(target.getDimension(i) - a.getDimension(i));
      distanceB += Math.abs(target.getDimension(i) - b.getDimension(i));
    }

    if (distanceA < distanceB) {
      return a;
    } else {
      return b;
    }
  }

  private searchNearest(node: KDNode<T> | null, target: T, depth: number): T | null {
    if (node === null) {
      return null;
    }

    let bestNode: T | null = node.point;
    let current: T | null = null;

    const axis = depth % this.dimensions;
    const currentDimension = node.point.getDimension(axis);

    if (currentDimension < target.getDimension(axis)) {
      current = this.searchNearest(node.left, target, depth + 1);
      if (current !== null) {
        bestNode = this.getCloserNode(target, bestNode, current);
      }
    }

    if (currentDimension > target.getDimension(axis)) {
      current = this.searchNearest(node.right, target, depth + 1);
      if (current !== null) {
        bestNode = this.getCloserNode(target, bestNode, current);
      }
    }

    return bestNode;
  }
}
