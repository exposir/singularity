/**
 * [INPUT]: 依赖 ./trace 的 trackDependency, assertWritable；依赖 ./batch 的 isBatching, schedulePendingUpdate
 * [OUTPUT]: 对外提供 atom 工厂函数、Atom 类型
 * [POS]: @singularity/core 的原子状态模块，是整个状态系统的基石
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { trackDependency, assertWritable } from './trace';
import { isBatching, schedulePendingUpdate } from './batch';

// ============================================================================
// 类型定义
// ============================================================================

type Listener = () => void;

interface HistoryEntry<T> {
  from: T;
  to: T;
  time: number;
}

// ============================================================================
// Atom ID 生成器
// ============================================================================

let atomId = 0;

// ============================================================================
// atom 工厂函数
// ============================================================================

export function atom<T>(initial: T) {
  const id = `atom:${++atomId}`;
  let value = initial;
  const listeners = new Set<Listener>();
  const history: HistoryEntry<T>[] = [];

  const notify = () => {
    listeners.forEach((fn) => fn());
  };

  return {
    id,

    get() {
      trackDependency(this);
      return value;
    },

    set(next: T | ((prev: T) => T)) {
      assertWritable();
      const newValue =
        typeof next === 'function' ? (next as (prev: T) => T)(value) : next;

      if (Object.is(value, newValue)) return;

      // 开发模式：记录历史
      if (process.env.NODE_ENV !== 'production') {
        history.push({ from: value, to: newValue, time: Date.now() });
        if (history.length > 100) history.shift(); // 限制长度
      }

      value = newValue;

      if (isBatching()) {
        schedulePendingUpdate(notify);
      } else {
        notify();
      }
    },

    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    history() {
      return [...history];
    },

    restore(index: number) {
      assertWritable();
      const entry = history[index];
      if (!entry) return;

      value = entry.from; // restore 不应新增历史记录
      if (isBatching()) {
        schedulePendingUpdate(notify);
      } else {
        notify();
      }
    },
  };
}

// ============================================================================
// 类型导出
// ============================================================================

export type Atom<T> = ReturnType<typeof atom<T>>;
