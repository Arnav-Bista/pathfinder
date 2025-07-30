// Took this from Claude, actually surprised that TS/JS does not provide a heap implementation.
export class MinHeap<T> {
  private heap: T[] = [];

  constructor(private compare: (a: T, b: T) => number = (a, b) => (a as any) - (b as any)) { }

  push(value: T): void {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return min;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  size(): number {
    return this.heap.length;
  }

  private heapifyUp(index: number): void {
    const parentIndex = Math.floor((index - 1) / 2);
    if (parentIndex >= 0 && this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      this.heapifyUp(parentIndex);
    }
  }

  private heapifyDown(index: number): void {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let smallest = index;

    if (leftChild < this.heap.length && this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
      smallest = leftChild;
    }

    if (rightChild < this.heap.length && this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
      smallest = rightChild;
    }

    if (smallest !== index) {
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      this.heapifyDown(smallest);
    }
  }
}
