/**
 * [INPUT]: 依赖 ./trace 的 Tracker, startTracking, stopTracking, trackDependency
 * [OUTPUT]: 对外提供 computed 工厂函数、Computed 类型
 * [POS]: @singularity/core 的派生状态模块，依赖 atom 变化自动重算
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { Tracker, startTracking, stopTracking, trackDependency } from './trace';

// ============================================================================
// Computed ID 生成器 + 循环依赖检测栈
// ============================================================================

let computedId = 0;
const computingStack: string[] = [];

function enterComputed(id: string): void {
  if (computingStack.includes(id)) {
    const chain = [...computingStack, id].join(' -> ');
    throw new Error(`Circular dependency detected: ${chain}`);
  }
  computingStack.push(id);
}

function exitComputed(): void {
  computingStack.pop();
}

// ============================================================================
// computed 工厂函数
// ============================================================================

export function computed<T>(read: () => T) {
  const id = `computed:${++computedId}`;
  let cachedValue: T;
  let dirty = true;
  const listeners = new Set<() => void>();

  const markDirty = () => {
    if (!dirty) {
      dirty = true;
      listeners.forEach((fn) => fn());
    }
  };

  // 创建 Tracker，依赖变化时触发 markDirty
  const tracker = new Tracker(markDirty);

  return {
    id,

    get() {
      trackDependency(this);

      if (dirty) {
        // 清理旧的依赖订阅，避免内存泄漏
        tracker.cleanup();

        enterComputed(id);
        startTracking(tracker, 'computed');
        try {
          cachedValue = read();
        } finally {
          stopTracking();
          exitComputed();
        }
        dirty = false;
      }

      return cachedValue;
    },

    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// ============================================================================
// 类型导出
// ============================================================================

export type Computed<T> = ReturnType<typeof computed<T>>;
