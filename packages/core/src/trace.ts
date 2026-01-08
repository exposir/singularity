/**
 * [INPUT]: 无外部依赖
 * [OUTPUT]: 对外提供 Tracker, startTracking, stopTracking, trackDependency, assertWritable
 * [POS]: @singularity/core 的依赖追踪模块，被 atom.ts, computed.ts, effect.ts 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

type Unsubscribe = () => void;
type OnInvalidate = () => void;
type TrackingKind = 'computed' | 'effect';

// ============================================================================
// 当前正在追踪的 Tracker
// ============================================================================

let currentTracker: Tracker | null = null;
let currentKind: TrackingKind | null = null;

// ============================================================================
// Tracker 类：管理依赖订阅的生命周期
// ============================================================================

/**
 * Tracker 管理依赖订阅的生命周期
 * 每次重新计算前清理旧订阅，避免内存泄漏
 * 使用 Set 去重，防止同一依赖被多次订阅
 */
export class Tracker {
  private subscriptions: Unsubscribe[] = [];
  private trackedNodes = new Set<any>(); // 已追踪的节点，用于去重
  private onInvalidate: OnInvalidate;

  constructor(onInvalidate: OnInvalidate) {
    this.onInvalidate = onInvalidate;
  }

  // 记录一个新的订阅（带去重）
  track(node: any, unsubscribe: Unsubscribe): void {
    if (this.trackedNodes.has(node)) return; // 防止重复订阅
    this.trackedNodes.add(node);
    this.subscriptions.push(unsubscribe);
  }

  // 触发失效回调
  invalidate(): void {
    this.onInvalidate();
  }

  // 清理所有旧订阅
  cleanup(): void {
    this.subscriptions.forEach((unsub) => unsub());
    this.subscriptions = [];
    this.trackedNodes.clear(); // 清空去重集合
  }
}

// ============================================================================
// 追踪上下文控制
// ============================================================================

export function startTracking(tracker: Tracker, kind: TrackingKind): void {
  currentTracker = tracker;
  currentKind = kind;
}

export function stopTracking(): void {
  currentTracker = null;
  currentKind = null;
}

export function assertWritable(): void {
  if (currentKind === 'computed') {
    throw new Error('Writes are not allowed inside computed().');
  }
}

export function trackDependency(node: { subscribe: (fn: () => void) => () => void }): void {
  if (currentTracker) {
    const tracker = currentTracker;
    // 订阅依赖变化，变化时触发失效回调
    const unsubscribe = node.subscribe(() => {
      tracker.invalidate();
    });
    tracker.track(node, unsubscribe); // 传入 node 用于去重
  }
}
