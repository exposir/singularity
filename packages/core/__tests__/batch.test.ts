/**
 * [INPUT]: 依赖 vitest, ../src/atom, ../src/batch
 * [OUTPUT]: batch 模块的单元测试
 * [POS]: @singularity/core 的测试文件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { describe, it, expect } from 'vitest';
import { atom } from '../src/atom';
import { batch } from '../src/batch';

describe('batch', () => {
  it('should batch multiple updates', () => {
    const a = atom(0);
    const b = atom(0);
    let calls = 0;

    a.subscribe(() => calls++);
    b.subscribe(() => calls++);

    batch(() => {
      a.set(1);
      b.set(2);
    });

    // batch 结束后才通知，共 2 次（每个 atom 各 1 次）
    expect(calls).toBe(2);
    expect(a.get()).toBe(1);
    expect(b.get()).toBe(2);
  });

  it('should dedupe same listener in pending updates', () => {
    const count = atom(0);
    let calls = 0;

    count.subscribe(() => calls++);

    batch(() => {
      count.set(1);
      count.set(2);
      count.set(3);
    });

    // 同一个 atom 多次 set，listener 只触发一次
    expect(calls).toBe(1);
    expect(count.get()).toBe(3);
  });

  it('should support nested batch', () => {
    const count = atom(0);
    let calls = 0;

    count.subscribe(() => calls++);

    batch(() => {
      count.set(1);
      batch(() => {
        count.set(2);
      });
      count.set(3);
    });

    // 嵌套 batch 只在最外层结束时触发
    expect(calls).toBe(1);
    expect(count.get()).toBe(3);
  });
});
