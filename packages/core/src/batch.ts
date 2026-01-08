/**
 * [INPUT]: 无外部依赖
 * [OUTPUT]: 对外提供 batch, isBatching, schedulePendingUpdate
 * [POS]: @singularity/core 的批处理模块，被 atom.ts 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

let batchDepth = 0;
// 使用 Set 收集待执行的更新通知
// Set 保证插入顺序（ES2015+），确保更新按照 schedulePendingUpdate 调用顺序执行
const pendingUpdates = new Set<() => void>();

export function batch(fn: () => void): void {
  batchDepth++;
  try {
    fn();
  } finally {
    batchDepth--;
    if (batchDepth === 0) {
      // 将 Set 转为数组并执行，顺序由 Set 插入顺序保证
      const updates = [...pendingUpdates];
      pendingUpdates.clear();
      updates.forEach((update) => update());
    }
  }
}

export function isBatching(): boolean {
  return batchDepth > 0;
}

export function schedulePendingUpdate(fn: () => void): void {
  pendingUpdates.add(fn);
}
