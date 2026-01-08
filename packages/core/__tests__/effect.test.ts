/**
 * [INPUT]: 依赖 vitest, ../src/atom, ../src/effect
 * [OUTPUT]: effect 模块的单元测试
 * [POS]: @singularity/core 的测试文件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { describe, it, expect, vi } from 'vitest';
import { atom } from '../src/atom';
import { effect } from '../src/effect';

// 等待微任务完成
const flush = () => new Promise((r) => setTimeout(r, 0));

describe('effect', () => {
  it('should run immediately', () => {
    const fn = vi.fn();
    effect(fn);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('should re-run when dependencies change', async () => {
    const count = atom(0);
    const fn = vi.fn();

    effect(() => {
      fn(count.get());
    });

    expect(fn).toHaveBeenCalledWith(0);

    count.set(1);
    await flush();
    expect(fn).toHaveBeenCalledWith(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should call cleanup before re-run', async () => {
    const count = atom(0);
    const cleanup = vi.fn();
    const run = vi.fn();

    effect(() => {
      run(count.get());
      return cleanup;
    });

    expect(run).toHaveBeenCalledTimes(1);
    expect(cleanup).not.toHaveBeenCalled();

    count.set(1);
    await flush();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledTimes(2);
  });

  it('should stop running after dispose', async () => {
    const count = atom(0);
    const fn = vi.fn();

    const e = effect(() => {
      fn(count.get());
    });

    expect(fn).toHaveBeenCalledTimes(1);

    e.dispose();
    count.set(1);
    count.set(2);
    await flush();

    expect(fn).toHaveBeenCalledTimes(1); // 不再触发
  });

  it('should call cleanup on dispose', () => {
    const cleanup = vi.fn();

    const e = effect(() => {
      return cleanup;
    });

    expect(cleanup).not.toHaveBeenCalled();
    e.dispose();
    expect(cleanup).toHaveBeenCalledOnce();
  });

  it('should track multiple dependencies', async () => {
    const a = atom(1);
    const b = atom(2);
    const fn = vi.fn();

    effect(() => {
      fn(a.get() + b.get());
    });

    expect(fn).toHaveBeenCalledWith(3);

    a.set(10);
    await flush();
    expect(fn).toHaveBeenCalledWith(12);

    b.set(20);
    await flush();
    expect(fn).toHaveBeenCalledWith(30);
  });

  it('should have unique id', () => {
    const e1 = effect(() => {});
    const e2 = effect(() => {});
    e1.dispose();
    e2.dispose();
    expect(e1.id).not.toBe(e2.id);
    expect(e1.id).toMatch(/^effect:\d+$/);
  });
});
