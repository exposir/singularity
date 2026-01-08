/**
 * [INPUT]: 依赖 vitest, ../src/atom
 * [OUTPUT]: atom 模块的单元测试
 * [POS]: @singularity/core 的测试文件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { describe, it, expect } from 'vitest';
import { atom } from '../src/atom';

describe('atom', () => {
  it('should get and set value', () => {
    const count = atom(0);
    expect(count.get()).toBe(0);
    count.set(1);
    expect(count.get()).toBe(1);
  });

  it('should support functional update', () => {
    const count = atom(0);
    count.set((prev) => prev + 1);
    expect(count.get()).toBe(1);
  });

  it('should notify subscribers', () => {
    const count = atom(0);
    let called = 0;
    count.subscribe(() => called++);
    count.set(1);
    expect(called).toBe(1);
  });

  it('should record history in dev mode', () => {
    const count = atom(0);
    count.set(1);
    count.set(2);
    expect(count.history()).toHaveLength(2);
  });

  it('should restore without adding history', () => {
    const count = atom(0);
    count.set(1);
    count.set(2);
    const before = count.history().length;
    count.restore(0);
    expect(count.get()).toBe(0);
    expect(count.history()).toHaveLength(before);
  });

  it('should not notify if value unchanged (Object.is)', () => {
    const count = atom(0);
    let called = 0;
    count.subscribe(() => called++);
    count.set(0); // 相同值
    expect(called).toBe(0);
  });

  it('should have unique id', () => {
    const a = atom(1);
    const b = atom(2);
    expect(a.id).not.toBe(b.id);
    expect(a.id).toMatch(/^atom:\d+$/);
  });
});
