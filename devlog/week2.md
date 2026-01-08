<!--
[INPUT]: 无外部依赖
[OUTPUT]: Week 2 开发记录
[POS]: devlog/ 的开发日志，记录 computed 和 effect 实现
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# Week 2: computed + effect

**日期**: 2026-01-08

## 完成事项

- [x] 实现 `computed.ts` - 派生状态
  - [x] 惰性计算 + 缓存机制
  - [x] 循环依赖检测
  - [x] computed 内禁止写入
- [x] 实现 `effect.ts` - 副作用
  - [x] 依赖变化时自动重执行
  - [x] cleanup 函数支持
  - [x] dispose 方法
- [x] 编写测试用例 (25 tests passed)
- [x] 更新文档

## 文件变更

```
packages/core/
├── src/
│   ├── computed.ts  [NEW]
│   ├── effect.ts    [NEW]
│   └── index.ts     [MODIFIED]
└── __tests__/
    ├── computed.test.ts (8 tests) [NEW]
    └── effect.test.ts (7 tests)   [NEW]
```

## 技术决策

1. **循环依赖检测** - 使用 `computingStack` 追踪计算链，发现循环立即抛错
2. **effect 使用 queueMicrotask 调度** - 避免同步无限循环，保证依赖变化后异步重执行
3. **computed 内禁止写入** - 通过 `assertWritable()` 在追踪上下文中检测写入操作

## 遇到的问题

### effect 测试卡住

**问题**: effect 在依赖变化时同步触发 run，而 run 内部又重新订阅，造成无限循环

**解决**: 使用 `queueMicrotask` 将重执行推迟到微任务队列，打破同步循环

```typescript
const scheduleRun = () => {
  if (scheduled || isDisposed) return;
  scheduled = true;
  queueMicrotask(run);
};
```

测试也需要相应修改，使用 `await flush()` 等待微任务完成

## 测试结果

```
 ✓ __tests__/atom.test.ts (7 tests)
 ✓ __tests__/batch.test.ts (3 tests)
 ✓ __tests__/computed.test.ts (8 tests)
 ✓ __tests__/effect.test.ts (7 tests)

 Test Files  4 passed (4)
      Tests  25 passed (25)
```

## 构建产物

- `dist/index.js` - 4.48 KB
- `dist/index.d.ts` - 1.61 KB

---

🎯 **里程碑 2 达成**
