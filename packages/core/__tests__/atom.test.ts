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

  it('should support undo/redo', () => {
    const count = atom(0);
    expect(count.canUndo()).toBe(false);
    expect(count.canRedo()).toBe(false);

    count.set(1);
    expect(count.canUndo()).toBe(true);
    expect(count.canRedo()).toBe(false);

    count.set(2);
    expect(count.get()).toBe(2);
    expect(count.canUndo()).toBe(true);

    count.undo();
    expect(count.get()).toBe(1);
    expect(count.canUndo()).toBe(true);
    expect(count.canRedo()).toBe(true);

    count.undo();
    expect(count.get()).toBe(0);
    expect(count.canUndo()).toBe(false);
    expect(count.canRedo()).toBe(true);

    count.redo();
    expect(count.get()).toBe(1);
    expect(count.canRedo()).toBe(true);

    count.redo();
    expect(count.get()).toBe(2);
    expect(count.canRedo()).toBe(false);
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

  it('should handle function type state with setRaw', () => {
    const onClick = atom<() => string>(() => 'A');
    expect(onClick.get()()).toBe('A');

    // set 会将函数当作更新器
    onClick.set(() => () => 'B');
    expect(onClick.get()()).toBe('B');

    // setRaw 直接设置函数值
    const newFn = () => 'C';
    onClick.setRaw(newFn);
    expect(onClick.get()).toBe(newFn);
    expect(onClick.get()()).toBe('C');
  });
});
