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

---

## 代码审查与修复 (2026-01-09)

### 发现的问题

完成里程碑 2 后进行深度代码审查，发现以下问题：

#### 1. 重复订阅内存泄漏 (trace.ts) - 严重

**问题**: 同一 computed/effect 多次读取同一 atom 时产生 N 个重复订阅

```typescript
const count = atom(0);
const bad = computed(() => {
  const a = count.get(); // 订阅 #1
  const b = count.get(); // 订阅 #2（重复！）
  return a + b;
});
```

**影响**: 内存浪费 + 重复通知

**修复**: Tracker 添加 `trackedNodes` Set 进行去重

```typescript
export class Tracker {
  private trackedNodes = new Set<any>(); // 去重集合

  track(node: any, unsubscribe: Unsubscribe): void {
    if (this.trackedNodes.has(node)) return; // 防止重复订阅
    this.trackedNodes.add(node);
    this.subscriptions.push(unsubscribe);
  }

  cleanup(): void {
    this.subscriptions.forEach((unsub) => unsub());
    this.subscriptions = [];
    this.trackedNodes.clear();
  }
}
```

#### 2. 函数类型状态的类型安全 (atom.ts) - 严重

**问题**: 当 T 是函数类型时，无法区分"要设置的函数"和"更新器函数"

```typescript
const onClick = atom<() => void>(() => console.log('A'));
onClick.set(() => console.log('B')); // 💥 B 被当成更新器调用
```

**修复**: 新增 `setRaw(value: T)` 方法，直接设置值不做函数判断

#### 3. 历史管理 API 改进 (atom.ts)

**问题**: `restore(index)` 语义混乱

**修复**: 新增更直观的 API
- `undo()` - 撤销到上一个状态
- `redo()` - 重做到下一个状态
- `canUndo()` - 是否可撤销
- `canRedo()` - 是否可重做

### 文档改进

1. **batch.ts** - 添加 Set 执行顺序保证的注释
2. **computed.ts** - 添加惰性订阅的注意事项

### 新增测试

- `should handle function type state with setRaw` - 验证 setRaw 处理函数类型
- `should not create duplicate subscriptions` - 验证去重机制

### 更新后测试结果

```
 ✓ __tests__/atom.test.ts (8 tests)     ← 7→8
 ✓ __tests__/batch.test.ts (3 tests)
 ✓ __tests__/computed.test.ts (9 tests) ← 8→9
 ✓ __tests__/effect.test.ts (7 tests)

 Test Files  4 passed (4)
      Tests  27 passed (27)             ← 25→27
```

### 修复的文件

```
packages/core/src/
├── trace.ts      [FIXED] 添加去重机制
├── atom.ts       [IMPROVED] +setRaw, +undo/redo API
├── computed.ts   [DOC] 添加惰性说明
└── batch.ts      [DOC] 添加顺序保证说明
```

---

## 项目暂停决策 (2026-01-09)

完成代码审查和修复后，对项目进行了冷静的价值评估。

### 核心发现

**技术层面**: ✅ 成功
- 代码质量达到生产级别
- 测试覆盖充分（27 tests passed）
- 性能预期可达 Jotai 80-100%

**商业层面**: ❌ 失败
- 与 Jotai 95% 功能重叠
- "内置历史"是伪需求（DevTools 更专业）
- 生态差距需要 3-5 年追赶
- 市场时机已过（2020 年 Jotai 已占据生态位）

### 关键问题

无法回答："为什么不直接用 Jotai？"

| 维度       | Singularity             | Jotai                  | 差异   |
| :--------- | :---------------------- | :--------------------- | :----- |
| API        | `atom(0)`               | `atom(0)`              | 相同   |
| 派生状态   | `computed(() => ...)`   | `atom((get) => ...)`   | 风格差 |
| 追踪       | 内置 `history()`        | jotai-devtools         | 已覆盖 |
| 生态       | 0 插件                  | 20+ 插件               | 无法追 |

### 决策

**暂停开发**，理由：
1. 差异化不足（价值 2/10）
2. 时间窗口已关闭（晚了 6 年）
3. 生态无法在短期内追赶

**保留价值**：
- 作为学习项目，代码质量高
- 可作为响应式系统的参考实现
- 文档完整，适合作为教学材料

**推荐方案**：
- 简单场景 → Zustand
- 细粒度场景 → Jotai
- 企业场景 → Redux Toolkit

详见 [README.md](../README.md#项目评估与暂停说明)
