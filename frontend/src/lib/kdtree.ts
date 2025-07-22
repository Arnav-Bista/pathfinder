
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
  ) {}
}

export default class KDTree<T extends Point> {
  constructor(T[]) {
    
  }
}
