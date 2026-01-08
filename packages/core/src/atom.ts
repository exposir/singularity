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
  let historyIndex = -1; // 当前历史位置（-1 表示初始状态）

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
        // 如果不在历史末尾，丢弃后续历史（分支被覆盖）
        if (historyIndex < history.length - 1) {
          history.splice(historyIndex + 1);
        }
        history.push({ from: value, to: newValue, time: Date.now() });
        if (history.length > 100) {
          history.shift(); // 限制长度
        } else {
          historyIndex++;
        }
      }

      value = newValue;

      if (isBatching()) {
        schedulePendingUpdate(notify);
      } else {
        notify();
      }
    },

    /**
     * 直接设置值，不进行函数式更新判断
     * 用于解决 T 本身是函数类型时的歧义问题
     *
     * @example
     * const onClick = atom<() => void>(() => console.log('A'));
     * onClick.setRaw(() => console.log('B')); // 正确设置新函数
     */
    setRaw(newValue: T) {
      assertWritable();

      if (Object.is(value, newValue)) return;

      // 开发模式：记录历史
      if (process.env.NODE_ENV !== 'production') {
        // 如果不在历史末尾，丢弃后续历史（分支被覆盖）
        if (historyIndex < history.length - 1) {
          history.splice(historyIndex + 1);
        }
        history.push({ from: value, to: newValue, time: Date.now() });
        if (history.length > 100) {
          history.shift(); // 限制长度
        } else {
          historyIndex++;
        }
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

    /**
     * 获取完整历史记录（仅开发模式）
     */
    history() {
      return [...history];
    },

    /**
     * 撤销到上一个状态
     */
    undo() {
      assertWritable();
      if (historyIndex < 0) return; // 没有可撤销的历史

      const entry = history[historyIndex];
      value = entry.from;
      historyIndex--;

      if (isBatching()) {
        schedulePendingUpdate(notify);
      } else {
        notify();
      }
    },

    /**
     * 重做到下一个状态
     */
    redo() {
      assertWritable();
      if (historyIndex >= history.length - 1) return; // 没有可重做的历史

      const entry = history[historyIndex + 1];
      value = entry.to;
      historyIndex++;

      if (isBatching()) {
        schedulePendingUpdate(notify);
      } else {
        notify();
      }
    },

    /**
     * 是否可以撤销
     */
    canUndo() {
      return historyIndex >= 0;
    },

    /**
     * 是否可以重做
     */
    canRedo() {
      return historyIndex < history.length - 1;
    },
  };
}

// ============================================================================
// 类型导出
// ============================================================================

export type Atom<T> = ReturnType<typeof atom<T>>;
