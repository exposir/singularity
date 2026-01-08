/**
 * [INPUT]: 依赖 ./trace 的 Tracker, startTracking, stopTracking
 * [OUTPUT]: 对外提供 effect 工厂函数、Effect 类型
 * [POS]: @singularity/core 的副作用模块，依赖变化时自动重新执行
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { Tracker, startTracking, stopTracking } from './trace';

// ============================================================================
// Effect ID 生成器
// ============================================================================

let effectId = 0;

// ============================================================================
// effect 工厂函数
// ============================================================================

export function effect(fn: () => void | (() => void)) {
  const id = `effect:${++effectId}`;
  let cleanup: (() => void) | void;
  let isDisposed = false;
  let scheduled = false;

  const run = () => {
    if (isDisposed) return;
    scheduled = false;

    // 清理用户的 cleanup 函数
    if (cleanup) {
      cleanup();
      cleanup = undefined;
    }

    // 清理旧的依赖订阅
    tracker.cleanup();

    startTracking(tracker, 'effect');
    try {
      cleanup = fn();
    } finally {
      stopTracking();
    }
  };

  const scheduleRun = () => {
    if (scheduled || isDisposed) return;
    scheduled = true;
    // 使用微任务调度，避免同步无限循环
    queueMicrotask(run);
  };

  // 创建 Tracker，依赖变化时调度 run
  const tracker = new Tracker(scheduleRun);

  // 立即执行一次（同步）
  run();

  return {
    id,
    dispose() {
      isDisposed = true;
      scheduled = false;
      tracker.cleanup(); // 清理所有订阅
      if (cleanup) cleanup();
    },
  };
}

// ============================================================================
// 类型导出
// ============================================================================

export type Effect = ReturnType<typeof effect>;
