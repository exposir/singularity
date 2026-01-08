/**
 * [INPUT]: 依赖 vitest, ../src/atom, ../src/computed
 * [OUTPUT]: computed 模块的单元测试
 * [POS]: @singularity/core 的测试文件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { describe, it, expect } from 'vitest';
import { atom } from '../src/atom';
import { computed } from '../src/computed';
import { batch } from '../src/batch';

describe('computed', () => {
  it('should compute derived value', () => {
    const a = atom(1);
    const b = atom(2);
    const sum = computed(() => a.get() + b.get());
    expect(sum.get()).toBe(3);
  });

  it('should update when dependencies change', () => {
    const a = atom(1);
    const double = computed(() => a.get() * 2);
    expect(double.get()).toBe(2);
    a.set(5);
    expect(double.get()).toBe(10);
  });

  it('should cache computed value', () => {
    const a = atom(1);
    let computeCount = 0;
    const double = computed(() => {
      computeCount++;
      return a.get() * 2;
    });

    double.get();
    double.get();
    double.get();
    expect(computeCount).toBe(1); // 只计算一次

    a.set(2);
    double.get();
    expect(computeCount).toBe(2); // 依赖变化后重新计算
  });

  it('should throw on circular dependency', () => {
    let a: ReturnType<typeof computed<number>>;
    let b: ReturnType<typeof computed<number>>;
    a = computed(() => b.get() + 1);
    b = computed(() => a.get() + 1);
    expect(() => a.get()).toThrow(/Circular dependency/);
  });

  it('should throw on writes inside computed', () => {
    const count = atom(0);
    const bad = computed(() => {
      count.set(1);
      return count.get();
    });
    expect(() => bad.get()).toThrow(/Writes are not allowed/);
  });

  it('should notify subscribers when dirty', () => {
    const a = atom(1);
    const double = computed(() => a.get() * 2);
    let called = 0;
    double.subscribe(() => called++);

    // 先调用一次 get 建立依赖
    double.get();

    a.set(2);
    expect(called).toBe(1);
  });

  it('should work with nested computed', () => {
    const a = atom(1);
    const double = computed(() => a.get() * 2);
    const quadruple = computed(() => double.get() * 2);

    expect(quadruple.get()).toBe(4);
    a.set(2);
    expect(quadruple.get()).toBe(8);
  });

  it('should work with batch', () => {
    const a = atom(1);
    const b = atom(2);
    let computeCount = 0;
    const sum = computed(() => {
      computeCount++;
      return a.get() + b.get();
    });

    sum.get(); // 初始计算
    computeCount = 0;

    batch(() => {
      a.set(10);
      b.set(20);
    });

    sum.get();
    expect(sum.get()).toBe(30);
    expect(computeCount).toBe(1); // batch 后只重算一次
  });

  it('should not create duplicate subscriptions', () => {
    const count = atom(0);
    let invalidateCount = 0;

    const double = computed(() => {
      // 多次读取同一个 atom
      const a = count.get();
      const b = count.get();
      const c = count.get();
      return a + b + c;
    });

    // 手动模拟 tracker 的 invalidate 计数
    double.subscribe(() => invalidateCount++);

    // 建立依赖
    double.get();

    // atom 变化时，应该只触发一次 invalidate
    count.set(1);
    expect(invalidateCount).toBe(1);
  });
});
