# 术语与常见问题

> Singularity 相关术语解释与常见问题解答。

---

## 一、术语表

| 术语         | 解释                       |
| :----------- | :------------------------- |
| **Atom**     | 最小的可追踪状态单元       |
| **Computed** | 派生状态，自动追踪依赖     |
| **Effect**   | 副作用，依赖变化时自动执行 |
| **Batch**    | 批量更新，合并多次变更     |
| **History**  | 状态变化历史记录           |
| **Signal**   | 细粒度响应式原语           |

---

## 二、不纳入范围的功能

### 1. atomAsync（异步状态）

**概念**：用于管理服务端数据的获取、缓存、更新状态。包括：

- 请求状态（loading/success/error）
- 数据缓存与过期
- 请求去重与取消
- 乐观更新与回滚

**为什么不做**：推荐使用 **React Query (TanStack Query)**

| 对比       | 自己做 atomAsync | React Query                   |
| :--------- | :--------------- | :---------------------------- |
| 开发成本   | 4-8 周           | 0（已存在）                   |
| 功能完整度 | 基础             | 极致完整                      |
| 社区信任   | 0                | 40k+ stars                    |
| 缓存策略   | 需自己实现       | stale-while-revalidate 已内置 |
| SSR/RSC    | 需自己实现       | 完整支持                      |
| DevTools   | 无               | 官方 DevTools                 |

```typescript
// ❌ 不做这个
const user = atomAsync(fetchUser, { key: 'user:1' });

// ✅ 推荐这样用
import { useQuery } from '@tanstack/react-query';
const { data: user } = useQuery({ queryKey: ['user'], queryFn: fetchUser });
```

---

### 2. machine（状态机）

**概念**：用于管理有明确状态流转的业务逻辑。包括：

- 状态定义（idle/loading/success/error）
- 事件触发的状态转换
- entry/exit 副作用
- Guard 条件判断

**为什么不做**：推荐使用 **XState**

| 对比       | 自己做 machine | XState               |
| :--------- | :------------- | :------------------- |
| 开发成本   | 4-6 周         | 0（已存在）          |
| 功能完整度 | 简单 FSM       | Statecharts 完整规范 |
| 可视化     | 无             | 官方可视化工具       |
| 并行状态   | 不支持         | 支持                 |
| 层级状态   | 不支持         | 支持                 |
| TypeScript | 需自己设计     | 类型推断极好         |

```typescript
// ❌ 不做这个
const auth = machine({
  initial: 'idle',
  states: { idle: { on: { LOGIN: 'loading' } } },
});

// ✅ 推荐这样用
import { createMachine, useMachine } from '@xstate/react';
const authMachine = createMachine({
  /* ... */
});
const [state, send] = useMachine(authMachine);
```

---

### 3. atomSync / CRDT（实时协作）

**概念**：用于多用户实时协作场景。包括：

- 冲突自动合并（CRDT 算法）
- 离线编辑支持
- 连接状态管理
- 实时同步

**为什么不做**：推荐使用 **Yjs**

| 对比      | 自己做 atomSync | Yjs                      |
| :-------- | :-------------- | :----------------------- |
| 开发成本  | 3-6 个月        | 0（已存在）              |
| CRDT 实现 | 极复杂          | 业界标准                 |
| 包体积    | 未知            | ~30KB（可接受）          |
| 生态集成  | 无              | ProseMirror/Monaco/Quill |
| 生产验证  | 无              | Notion 等在用            |
| 协议支持  | 需自己实现      | WebSocket/WebRTC         |

```typescript
// ❌ 不做这个
const doc = atomSync({ title: '', content: '' }, { id: 'doc:1' });

// ✅ 推荐这样用
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const ydoc = new Y.Doc();
const provider = new WebsocketProvider('wss://...', 'room', ydoc);
```

---

## 三、推荐组合

```typescript
// 客户端状态 → Singularity
import { atom, useAtom } from '@singularity/core';
const theme = atom('dark');
const sidebar = atom(true);

// 服务端状态 → React Query
import { useQuery, useMutation } from '@tanstack/react-query';
const { data: user } = useQuery({ queryKey: ['user'] });

// 复杂状态机 → XState
import { useMachine } from '@xstate/react';
const [state, send] = useMachine(authMachine);

// 实时协作 → Yjs
import * as Y from 'yjs';
const ydoc = new Y.Doc();
```

**原则**：每个库做自己最擅长的事，Singularity 专注「客户端状态 + 追踪」。

---

## 四、常见问题

### Q1: 我为什么要用 Singularity？

**A**: 如果你需要**同时满足以下三个条件**：

| 需求                         | Zustand        | Jotai       | Singularity |
| :--------------------------- | :------------- | :---------- | :---------- |
| ① 简单 API（一行创建状态）   | ✅             | ❌ 原子组合 | ✅          |
| ② 内置追踪（调试时回溯变化） | ❌ 需插件      | ❌ 需插件   | ✅          |
| ③ 细粒度更新（避免无效渲染） | ❌ 需 selector | ✅          | ✅          |

**选择指南**：

- **只需要简单** → 用 Zustand
- **只需要细粒度** → 用 Jotai
- **需要三合一** → 用 **Singularity**

**典型场景**：

- 团队调试困难，经常问「这个状态是谁改的」
- 项目性能敏感，但不想写大量 selector
- 新手多，希望 API 尽可能简单

**不适合的场景**：

- 服务端状态 → 用 React Query
- 复杂状态机 → 用 XState
- 实时协作 → 用 Yjs

### Q2: 为什么不直接给 Zustand/Jotai 加插件？

**A**:

- **追踪**可以用插件解决（已有 devtools 中间件）
- **但 Zustand 的细粒度限制是架构问题**（单 store + selector 设计）
- **Jotai 的 API 复杂是设计哲学**（原子组合是核心理念）

Singularity 从底层同时实现：Zustand 的简单 API +
Jotai 的细粒度 + 内置追踪。这是插件无法解决的组合。

### Q3: 和 Redux 有什么区别？

**A**:
Redux 功能强大但复杂（Action/Reducer），Singularity 保持简单（一行代码创建状态），同时提供追踪能力。

### Q4: 生产环境追踪会影响性能吗？

**A**: 不会。生产模式下追踪功能完全禁用：

```typescript
if (process.env.NODE_ENV !== 'production') {
  // 只在开发模式记录
}
```

### Q5: 服务端状态怎么管理？

**A**: 使用 React Query。Singularity 专注于客户端状态，与 React Query 完美配合。

### Q6: 需要复杂状态机怎么办？

**A**: 使用 XState。Singularity 不做状态机，专注核心能力。

### Q7: 什么时候用 useState / useRef / Singularity？

**A**: 根据状态的作用范围和特性选择。

| 状态类型         | 选择          | 原因                   |
| :--------------- | :------------ | :--------------------- |
| 组件内临时状态   | `useState`    | 不需要跨组件共享       |
| 不触发重渲染的值 | `useRef`      | 如 DOM 引用、定时器 ID |
| 跨组件共享状态   | `Singularity` | 如主题、用户、购物车   |

**详细场景**：

| 场景                 | 推荐            | 示例                                      |
| :------------------- | :-------------- | :---------------------------------------- |
| 表单输入（受控）     | useState        | `const [value, setValue] = useState('')`  |
| 模态框开关（单组件） | useState        | `const [open, setOpen] = useState(false)` |
| DOM 引用             | useRef          | `const inputRef = useRef(null)`           |
| 定时器 ID            | useRef          | `const timerId = useRef()`                |
| 全局主题             | **Singularity** | `const theme = atom('dark')`              |
| 用户登录状态         | **Singularity** | `const user = atom(null)`                 |
| 购物车               | **Singularity** | `const cart = atom([])`                   |
| 需要追踪调试         | **Singularity** | 任何需要 `history()` 的状态               |

**简单判断**：

- 只有一个组件用？→ `useState`
- 不需要触发渲染？→ `useRef`
- 多个组件共享 / 需要追踪？→ `Singularity`

### Q8: history() 会导致内存泄漏吗？

**A**: ✅ **不会**。

| 环境         | 行为                                        |
| :----------- | :------------------------------------------ |
| **生产环境** | history 功能完全禁用，不占用任何内存        |
| **开发环境** | 记录历史，但限制 100 条，超出自动丢弃旧记录 |

```typescript
// 只在开发模式记录
if (process.env.NODE_ENV !== 'production') {
  history.push({ from, to, time });
  if (history.length > 100) history.shift();
}
```

### Q9: 心智模型优秀吗？

**A**: ✅ **简单直观，但有权衡**。

| 库              | 心智模型       | 读取语法      | 学习曲线 |
| :-------------- | :------------- | :------------ | :------- |
| **Singularity** | Signal         | `.get()` 显式 | 低       |
| Zustand         | 单 Store       | selector      | 低       |
| MobX            | Proxy          | 隐式读取      | 最低     |
| Jotai           | 原子组合       | `.get()` 显式 | 中       |
| Redux           | Action/Reducer | dispatch      | 高       |

**权衡**：`.get()`
语法略显繁琐，但换来**可预测的依赖追踪**和**明确的数据流向**。

### Q10: 性能很优秀吗？

**A**: ✅ **良好，但不是极致**。目标是 Jotai 的 80%。

| 指标       | Singularity | Zustand     | Jotai     | 说明                     |
| :--------- | :---------- | :---------- | :-------- | :----------------------- |
| 读写速度   | ≈Jotai 80%  | 最快        | 基准      | Zustand 最简单所以最快   |
| 细粒度更新 | ✅ Signal   | ❓ selector | ✅ Signal | Zustand 需 useShallow    |
| 生产包体积 | ~3KB        | 2.8KB       | 3.5KB     | 都很小                   |
| 内存占用   | 相近        | 基准        | 相近      | history 开发模式额外占用 |

**定位**：不追求极致性能，而是**在三合一组合（简单+追踪+细粒度）下的最佳平衡**。

### Q11: 细粒度更新为什么不是最快？有什么好处？

**A**: 细粒度需要额外开销，但带来更大的收益。

**为什么不是最快**：

| 对比     | Zustand   | Singularity/Jotai   |
| :------- | :-------- | :------------------ |
| 更新机制 | 整体 diff | Signal 订阅         |
| 额外开销 | 无        | 订阅管理 + 依赖追踪 |
| 单次写入 | **最快**  | 稍慢（有订阅开销）  |

> Zustand 不追踪依赖，直接通知所有订阅者，由 React 的 selector 过滤。Singularity 追踪每个依赖，精确通知，有额外的 Tracker 管理开销。

**细粒度的好处**（写入稍慢，但渲染更快）：

| 场景                 | Zustand                | Singularity      |
| :------------------- | :--------------------- | :--------------- |
| 只改 A，但订阅了 A+B | 两个组件都触发渲染检查 | **只有 A 触发**  |
| 大列表中改一项       | 需要 useShallow 优化   | **自动精确更新** |
| 复杂表单             | 需要拆分 selector      | **自动隔离**     |

**权衡总结**：

| 指标         | Zustand            | Singularity  |
| :----------- | :----------------- | :----------- |
| 单次写入速度 | ✅ 最快            | ⚠️ 稍慢      |
| 渲染次数     | ⚠️ 可能多          | ✅ 最少      |
| 开发体验     | ⚠️ 需手写 selector | ✅ 自动优化  |
| **综合性能** | 需优化             | **开箱即用** |

**结论**：细粒度牺牲了一点写入性能，换来了**更少的无效渲染**和**更好的开发体验**。

> **一句话总结**：细粒度 = 用一点写入开销，换来更少渲染 + 更爽开发

### Q12: 用 Singularity 可以减少 useMemo/useCallback 吗？

**A**: ✅ **是的，可以大幅减少**。

| 问题                       | 传统 React       | Singularity          |
| :------------------------- | :--------------- | :------------------- |
| 父组件更新导致子组件重渲染 | useMemo 包裹计算 | 细粒度更新，不重渲染 |
| 函数引用变化导致重渲染     | useCallback 包裹 | 状态变化只影响订阅者 |
| 派生数据重复计算           | useMemo 缓存     | `computed` 自动缓存  |

**对比示例**：

```typescript
// ❌ 传统 React（需要大量优化）
const expensive = useMemo(() => items.filter(...), [items]);
const handler = useCallback(() => setCount(c => c + 1), []);

// ✅ Singularity（自动优化）
const items = atom([...]);
const filtered = computed(() => items.get().filter(...)); // 自动缓存
// handler 直接用 items.set()，无需 useCallback
```

**原因**：

- `computed` 替代了 `useMemo`（自动缓存 + 依赖追踪）
- 细粒度更新减少了因引用变化导致的重渲染
- 状态在组件外部，函数不需要 `useCallback` 稳定引用

### Q13: 能支持超大型前端项目吗？

**A**: ⚠️ **能用，但不是最佳选择**。

| 规模   | 状态数量     | 推荐方案                |
| :----- | :----------- | :---------------------- |
| 小型   | <50 atom     | ✅ Singularity          |
| 中型   | 50-200 atom  | ✅ Singularity          |
| 大型   | 200-500 atom | ⚠️ Singularity + 模块化 |
| 超大型 | >500 atom    | ❓ 可能需要其他方案     |

**超大型项目的挑战**：

| 挑战     | Singularity 现状 | 建议                 |
| :------- | :--------------- | :------------------- |
| 状态组织 | 无内置模块化     | 按业务域手动拆分文件 |
| DevTools | 仅 history()     | v1.0 计划 UI 面板    |
| SSR/RSC  | 基础支持         | 复杂场景需自行验证   |
| 微前端   | 未验证           | 需自行评估隔离性     |

**大型项目建议**：

```typescript
// 按业务域拆分
// store/user.ts
export const userAtom = atom({ name: '', ... });

// store/cart.ts
export const cartAtom = atom({ items: [] });

// store/index.ts（统一导出）
export * from './user';
export * from './cart';
```

**结论**：

- **中小型项目**：✅ 推荐使用
- **大型项目**：⚠️ 可用，需规范管理
- **超大型项目**：❓ 建议评估后决定（可能需要 Redux 等更成熟方案）

### Q14: restore() 的语义是什么？会新增历史吗？

**A**: restore 会回到 `history[index].from`，不会新增历史记录，但会通知
订阅者重新渲染。`index` 越界时无操作。由于 restore 是写入行为，
`computed` 计算阶段禁止调用。

---

## 三、最佳实践

### ✅ 推荐

```typescript
// 简单状态
const count = atom(0);

// 派生状态
const double = computed(() => count.get() * 2);

// 组件使用
function App() {
  const value = useAtom(count);
  return <div>{value}</div>;
}
```

### ❌ 避免

```typescript
// 不要在 computed 中修改状态
const bad = computed(() => {
  count.set(1); // ❌ 错误
  return count.get();
});

// 不要存储大对象（如 DOM 节点）
const node = atom(document.body); // ❌ 不推荐
```

---

_术语与 QA v2.0 - 2026-01-08_
