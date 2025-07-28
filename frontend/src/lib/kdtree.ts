
export interface Point {
  getDimension(index: number): number;
  getDimensionCount(): number;
}

// https://acme.byu.edu/00000181-a75a-d0ac-abe9-ef7ed9230001/nearest-neighbors-pdf

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

  // Euclidean Distance
  private calculateDistance(a: Point, b: Point): number {
    let distance = 0;
    for (let i = 0; i < a.getDimensionCount(); i++) {
      distance += Math.pow(a.getDimension(i) - b.getDimension(i), 2);
    }
    return Math.sqrt(distance);
  }

  public getNearestNeighbor(target: T): T | null {
    if (this.root === null) {
      return null;
    }
    const bestNode = this.searchNearestNeighbour(this.root, target, null, 0);
    return bestNode ? bestNode.point : null;
  }

  private searchNearestNeighbour(
    node: KDNode<T> | null,
    target: T,
    best: KDNode<T> | null,
    depth: number
  ): KDNode<T> | null {
    if (node === null) {
      return best;
    }

    const dimension = depth % target.getDimensionCount();
    const distance = this.calculateDistance(target, node.point);

    if (best === null || distance < this.calculateDistance(target, best.point)) {
      best = node;
    }

    let nearSide: KDNode<T> | null;
    let farSide: KDNode<T> | null;

    if (target.getDimension(dimension) < node.point.getDimension(dimension)) {
      nearSide = node.left;
      farSide = node.right;
    } else {
      nearSide = node.right;
      farSide = node.left;
    }

    best = this.searchNearestNeighbour(nearSide, target, best, depth + 1);

    const bestDistance = this.calculateDistance(target, best!.point);
    const distanceToSplittingPlane = Math.abs(
      target.getDimension(dimension) - node.point.getDimension(dimension)
    );

    if (distanceToSplittingPlane < bestDistance) {
      best = this.searchNearestNeighbour(farSide, target, best, depth + 1);
    }

    return best;
  }

}
