## 零、状态管理库全景图

| 派系                | 库              | 作者/组织                | Stars  | 核心思想                    | 超大型项目适配 |
| :------------------ | :-------------- | :----------------------- | :----- | :-------------------------- | :------------- |
| **Flux 架构派**     | Redux           | Dan Abramov / Redux Team | ⭐ 60k | 单一数据源 + 纯函数 Reducer | 久经考验       |
|                     | Redux Toolkit   | Redux Team               | ⭐ 10k | Redux 官方简化版            | 推荐           |
|                     | Zustand         | Pmndrs (Dai Shi)         | ⭐ 40k | 极简 Flux，无 Provider      | 配合分层架构   |
| **原子化派**        | Jotai           | Pmndrs (Dai Shi)         | ⭐ 17k | 自底向上的原子组合          | 需规范约束     |
|                     | Recoil ⚠️       | Meta (Facebook)          | ⭐ 19k | 已停止维护                  | 不推荐         |
|                     | Nano Stores     | Evil Martians            | ⭐ 5k  | 框架无关，< 1KB             | 功能有限       |
| **Proxy 响应式派**  | MobX            | Michel Weststrate        | ⭐ 27k | 透明函数式响应编程          | 隐式依赖难追踪 |
|                     | MobX-State-Tree | Michel Weststrate        | ⭐ 7k  | 结构化类型 + 快照           | 专为复杂场景   |
|                     | Valtio          | Pmndrs (Dai Shi)         | ⭐ 9k  | 像 Vue 一样可变             | 中小型更适合   |
| **Signal 细粒度派** | Preact Signals  | Preact Team              | ⭐ 4k  | 绕过 VDOM Diff              | 生态不成熟     |
|                     | Legend-State    | Legend App               | ⭐ 3k  | 强调性能优势                | 社区较小       |
|                     | Solid.js        | Ryan Carniato            | ⭐ 30k | 编译时 + 无 VDOM            | 框架级方案     |
| **状态机派**        | XState          | Stately (D. Khourshid)   | ⭐ 26k | W3C SCXML 标准实现 [^1]     | 关键业务首选   |
|                     | Robot           | Matthew Phillips         | ⭐ 2k  | 极简 FSM，< 1KB             | 功能太简       |
| **服务端状态派**    | TanStack Query  | Tanner Linsley           | ⭐ 40k | 服务端状态 = 缓存           | 必备组件       |
|                     | SWR             | Vercel                   | ⭐ 30k | Stale-While-Revalidate      | 功能较少       |
|                     | RTK Query       | Redux Team               | -      | Redux 生态方案              | Redux 项目首选 |
| **RxJS 流式派**     | RxJS            | ReactiveX / Ben Lesh     | ⭐ 30k | 一切皆流                    | 复杂异步必备   |
|                     | Elf             | ngneat                   | ⭐ 2k  | 基于 RxJS 的 Store          | 社区较小       |
|                     | Akita           | Datorama                 | ⭐ 4k  | 实体管理                    | Angular 大型   |
| **CRDT 协作派**     | Yjs             | Kevin Jahns              | ⭐ 15k | 无冲突复制数据类型          | 协作场景唯一   |
|                     | Automerge       | Ink & Switch             | ⭐ 3k  | JSON 友好 CRDT              | 性能略逊       |
|                     | Liveblocks      | Liveblocks Inc.          | -      | CRDT + BaaS                 | 开箱即用       |
| **GraphQL 派**      | Apollo Client   | Apollo GraphQL           | ⭐ 19k | 归一化缓存                  | GraphQL 标配   |
|                     | Relay           | Meta (Facebook)          | ⭐ 18k | 编译期优化                  | Facebook 级别  |
|                     | URQL            | urql-graphql             | ⭐ 9k  | 轻量级 GraphQL              | 中型项目       |
| **其他特色**        | Effector        | Dmitry Boldyrev          | ⭐ 5k  | 多向数据流                  | 类型完美       |
|                     | Hookstate       | Andrey Konstantinov      | ⭐ 2k  | Proxy + Hook 极简           | 中小型         |
|                     | Overmind        | Cerebral                 | ⭐ 1k  | Flux + FSM + Proxy 融合     | 社区不活跃     |
| **领域专用**        | React Hook Form | Bill Luo                 | ⭐ 40k | 表单状态                    | 表单必备       |
|                     | TanStack Router | Tanner Linsley           | ⭐ 7k  | URL 即状态                  | 类型安全路由   |
|                     | TanStack Table  | Tanner Linsley           | ⭐ 24k | 表格状态                    | 复杂表格必备   |
|                     | RxDB / Dexie    | D. Meyer / D. Fahlander  | -      | 本地数据库                  | 离线优先场景   |

> **说明**:
> Stars 数据为 2026 年 1 月粗略量级；超大型项目适配基于社区实践经验评估。库名称链接已省略以提升表格可读性，详见后续各章节的详细介绍。

### 快速选择指南

| 场景               | 推荐方案              | 理由                   |
| :----------------- | :-------------------- | :--------------------- |
| **简单项目**       | Zustand               | 极简 API，< 1KB        |
| **大型企业应用**   | Zustand + React Query | 客户端/服务端分离      |
| **复杂交互逻辑**   | XState                | 状态机可视化、数学证明 |
| **极致性能**       | Legend-State / Jotai  | Signal 细粒度更新      |
| **多人协作**       | Yjs + Liveblocks      | CRDT 冲突自动解决      |
| **GraphQL 项目**   | Apollo / URQL         | 归一化缓存             |
| **Redux 遗留项目** | Redux Toolkit         | 官方现代化方案         |

### 规模适配评估维度

| 维度         | 关注点                       | 小型项目偏好   | 超大型项目偏好                |
| :----------- | :--------------------------- | :------------- | :---------------------------- |
| **心智模型** | 需要掌握的核心概念数量       | 概念少、上手快 | 概念可分层、可渐进引入        |
| **可观测性** | 调试/时间旅行/状态可视化     | 简洁日志即可   | DevTools 完整、审计能力强     |
| **一致性**   | 本地/服务端/协作状态能否统一 | 允许多库组合   | 单一模型或低摩擦整合          |
| **迁移成本** | 从现有方案迁移的门槛         | 直接替换 Hook  | 可增量接入、支持分层/分域迁移 |
| **性能模型** | 渲染/订阅开销是否可预测      | 默认够快       | 细粒度订阅、可控更新边界      |
| **组织协作** | 多团队协作、边界划分、规范化 | 轻规范         | 约定清晰、工具链配套          |

[^1]:
    **什么是状态机？**
    状态机 (FSM) 是指"系统只能处于有限个状态之一，通过事件触发状态转换"的模型。例如交通灯只能是红/黄/绿三个状态，按固定规则切换。**为什么前端少见？**
    前端从 jQuery 脚本发展而来，习惯用 `isLoading/isError`
    等布尔值组合表示状态，但这会产生"不可能状态"的 Bug（如
    `isLoading=true && isError=true`
    同时为真）。状态机强制你显式定义所有合法状态和转换规则，从根本上消除这类问题。**SCXML**
    是 W3C 制定的状态机描述标准，源于 1987 年 David
    Harel 的 Statecharts 论文，XState 严格遵循此规范实现。

---

## 一、前端状态管理库大全：实现原理与核心思想

> 导读：按范式分类梳理实现原理，建立全局认知与对比框架。

> 本章节收录了前端生态中**所有主流及小众**的状态管理方案，按技术范式分类，深入解析每个库的底层实现和设计哲学。

---

### 1.1 Flux 架构派系

#### Redux (2015)

| 维度         | 内容                                                                                                       |
| :----------- | :--------------------------------------------------------------------------------------------------------- |
| **GitHub**   | [reduxjs/redux](https://github.com/reduxjs/redux) ⭐ 60k+                                                  |
| **核心思想** | 单一数据源 + 纯函数 Reducer + 不可变更新                                                                   |
| **实现原理** | 基于发布-订阅模式。Store 持有全局状态树，通过 `dispatch(action)` 触发 Reducer 计算新状态，再通知所有订阅者 |
| **数据流**   | `View → dispatch(Action) → Reducer(state, action) → newState → View`                                       |
| **优点**     | 可预测性强、时间旅行调试、中间件生态丰富                                                                   |
| **缺点**     | 样板代码多、学习曲线陡、小项目过度设计                                                                     |

```javascript
// Redux 核心原理简化实现
function createStore(reducer) {
  let state;
  let listeners = [];

  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action); // 纯函数计算新状态
    listeners.forEach((l) => l()); // 通知订阅者
  };
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  dispatch({ type: '@@INIT' });
  return { getState, dispatch, subscribe };
}
```

---

#### Redux Toolkit (RTK)

| 维度         | 内容                                                                                     |
| :----------- | :--------------------------------------------------------------------------------------- |
| **GitHub**   | [reduxjs/redux-toolkit](https://github.com/reduxjs/redux-toolkit) ⭐ 10k+                |
| **核心思想** | Redux 官方"电池全包"版，内置 Immer + Thunk + DevTools                                    |
| **实现原理** | 在 Redux 基础上，`createSlice` 自动生成 action creators 和 reducer，Immer 允许"可变"写法 |
| **优点**     | 大幅减少样板代码、TypeScript 友好                                                        |
| **缺点**     | 仍继承 Redux 的复杂心智模型                                                              |

```javascript
// RTK 的 createSlice 底层用 Immer 包装
const slice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    // 看起来是可变操作，实际 Immer 转为不可变
    increment: (state) => {
      state.value += 1;
    },
  },
});
```

---

#### Zustand (Pmndrs, 2019)

| 维度         | 内容                                                                                  |
| :----------- | :------------------------------------------------------------------------------------ |
| **GitHub**   | [pmndrs/zustand](https://github.com/pmndrs/zustand) ⭐ 40k+                           |
| **核心思想** | 极简 Flux，去掉 Redux 的所有仪式感                                                    |
| **实现原理** | 基于闭包的发布-订阅。用 `useSyncExternalStore` 与 React 同步，Selector 实现细粒度订阅 |
| **优点**     | API 极简 (< 1KB)、无 Provider、支持中间件                                             |
| **缺点**     | 没有内置的 action 类型约束                                                            |

```javascript
// Zustand 核心实现 (简化)
const createStore = (createState) => {
  let state;
  const listeners = new Set();

  const setState = (partial) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      state = Object.assign({}, state, nextState);
      listeners.forEach((l) => l(state));
    }
  };

  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  state = createState(setState, getState);
  return { setState, getState, subscribe };
};
```

---

### 1.2 原子化状态派系 (Atomic State)

#### Jotai (Pmndrs, 2020)

| 维度         | 内容                                                                                               |
| :----------- | :------------------------------------------------------------------------------------------------- |
| **GitHub**   | [pmndrs/jotai](https://github.com/pmndrs/jotai) ⭐ 17k+                                            |
| **核心思想** | 原子化 + 自底向上。状态是独立的"原子"，可组合派生                                                  |
| **实现原理** | 每个 atom 是一个配置对象，Store 维护 atom → value 的 WeakMap。读取时建立依赖图，写入时触发依赖更新 |
| **优点**     | 细粒度更新、无 Provider 可选、React Suspense 原生支持                                              |
| **缺点**     | 调试时难以查看完整状态树                                                                           |

```javascript
// Jotai atom 本质是一个配置对象
const countAtom = atom(0); // { init: 0, read: ..., write: ... }

// 派生 atom
const doubleAtom = atom((get) => get(countAtom) * 2);

// Store 内部结构
// Map<Atom, { value, dependents: Set<Atom>, listeners: Set<Function> }>
```

---

#### Recoil (2020) ⚠️ 已停止维护

| 维度         | 内容                                                                                  |
| :----------- | :------------------------------------------------------------------------------------ |
| **GitHub**   | [facebookexperimental/Recoil](https://github.com/facebookexperimental/Recoil) ⭐ 19k+ |
| **核心思想** | 原子化 + 图依赖。与 Jotai 类似但更重                                                  |
| **实现原理** | 基于有向图的依赖追踪，Selector 节点缓存计算结果                                       |
| **状态**     | **⚠️ 2024 年已宣布停止维护，建议迁移至 Jotai**                                        |

---

#### Nano Stores (Evil Martians)

| 维度         | 内容                                                                     |
| :----------- | :----------------------------------------------------------------------- |
| **GitHub**   | [nanostores/nanostores](https://github.com/nanostores/nanostores) ⭐ 5k+ |
| **核心思想** | 框架无关的极简原子化                                                     |
| **实现原理** | 纯 JS 实现的发布-订阅，每个 store 是独立的可订阅对象                     |
| **优点**     | < 1KB、无依赖、React/Vue/Svelte 通用                                     |
| **缺点**     | 功能极简，复杂场景需组合多个库                                           |

```javascript
// Nano Stores 极简实现
import { atom, computed } from 'nanostores';

const count = atom(0);
const double = computed(count, (n) => n * 2);

count.subscribe((value) => console.log(value));
count.set(count.get() + 1);
```

---

### 1.3 Proxy 响应式派系

#### MobX (2015)

| 维度         | 内容                                                                                          |
| :----------- | :-------------------------------------------------------------------------------------------- |
| **GitHub**   | [mobxjs/mobx](https://github.com/mobxjs/mobx) ⭐ 27k+                                         |
| **核心思想** | 透明函数式响应编程 (TFRP)。用 OOP 写法，自动追踪依赖                                          |
| **实现原理** | 使用 `Proxy`（或 ES5 的 `Object.defineProperty`）拦截属性访问。读取时收集依赖，写入时触发更新 |
| **优点**     | 写法自然（直接赋值）、自动细粒度更新                                                          |
| **缺点**     | 隐式魔法多、调试困难、装饰器语法争议                                                          |

```javascript
// MobX 响应式原理
const handler = {
  get(target, prop, receiver) {
    trackDependency(target, prop); // 收集依赖
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    Reflect.set(target, prop, value, receiver);
    triggerReactions(target, prop); // 触发更新
    return true;
  },
};
const observable = new Proxy(rawObject, handler);
```

---

#### MobX-State-Tree (MST)

| 维度         | 内容                                                                         |
| :----------- | :--------------------------------------------------------------------------- |
| **GitHub**   | [mobxjs/mobx-state-tree](https://github.com/mobxjs/mobx-state-tree) ⭐ 6.9k+ |
| **核心思想** | MobX + 结构化类型系统 + 快照 + 时间旅行                                      |
| **实现原理** | 在 MobX 基础上增加 Schema 校验、自动序列化、补丁历史                         |
| **优点**     | 复杂嵌套数据的终极方案、类型运行时校验                                       |
| **缺点**     | 学习曲线极高、打包体积大                                                     |

---

#### Valtio (Pmndrs, 2021)

| 维度         | 内容                                                              |
| :----------- | :---------------------------------------------------------------- |
| **GitHub**   | [pmndrs/valtio](https://github.com/pmndrs/valtio) ⭐ 8.5k+        |
| **核心思想** | 用 Proxy 让 React 状态像 Vue 一样可变                             |
| **实现原理** | `proxy()` 返回 Proxy 对象，`useSnapshot()` 在渲染时创建不可变快照 |
| **优点**     | 写法极简、无 action 概念                                          |
| **缺点**     | Proxy 的隐式行为可能导致困惑                                      |

```javascript
import { proxy, useSnapshot } from 'valtio';

const state = proxy({ count: 0 });

// 直接修改
state.count++;

// 组件中使用
function Counter() {
  const snap = useSnapshot(state); // 自动追踪
  return <div>{snap.count}</div>;
}
```

---

### 1.4 Signal 细粒度响应式派系

#### Preact Signals

| 维度         | 内容                                                             |
| :----------- | :--------------------------------------------------------------- |
| **GitHub**   | [preactjs/signals](https://github.com/preactjs/signals) ⭐ 3.5k+ |
| **核心思想** | 绕过 VDOM Diff，直接更新 DOM 节点                                |
| **实现原理** | Signal 是一个带值的盒子，读取时自动订阅，写入时直接更新订阅者    |
| **优点**     | 极致性能、比 `useMemo` 更细粒度                                  |
| **缺点**     | 破坏 React 单向数据流哲学                                        |

```javascript
// Signal 核心概念
const count = signal(0);
const double = computed(() => count.value * 2);

// 读取自动建立依赖
effect(() => console.log(count.value));

// 写入触发更新
count.value++; // effect 自动执行
```

---

#### Legend-State

| 维度         | 内容                                                                         |
| :----------- | :--------------------------------------------------------------------------- |
| **GitHub**   | [LegendApp/legend-state](https://github.com/LegendApp/legend-state) ⭐ 2.5k+ |
| **核心思想** | 强调性能与细粒度响应式（性能宣称需以基准测试验证）                           |
| **实现原理** | Proxy 拦截 + 细粒度 Signal + 自动持久化                                      |
| **优点**     | 极致性能、内置 LocalStorage/AsyncStorage 同步                                |
| **缺点**     | 相对小众，生态有限                                                           |

---

#### Solid.js Signals (框架级参考)

| 维度         | 内容                                                         |
| :----------- | :----------------------------------------------------------- |
| **GitHub**   | [solidjs/solid](https://github.com/solidjs/solid) ⭐ 30k+    |
| **核心思想** | 编译时 + 细粒度响应式，无 VDOM                               |
| **实现原理** | 编译器将 JSX 转换为真实 DOM 操作，Signal 直接绑定到 DOM 节点 |
| **意义**     | 框架级响应式参考，对 React 生态有启发                        |

---

### 1.5 有限状态机派系 (FSM / Statecharts)

#### XState (Stately, 2017)

| 维度         | 内容                                                            |
| :----------- | :-------------------------------------------------------------- |
| **GitHub**   | [statelyai/xstate](https://github.com/statelyai/xstate) ⭐ 26k+ |
| **核心思想** | W3C SCXML 标准实现，状态图 (Statecharts) 可视化                 |
| **实现原理** | 用配置对象描述状态机，Interpreter 解析事件并执行转换            |
| **适用场景** | 复杂交互流程、支付、连接管理、游戏逻辑                          |
| **优点**     | 数学可证明、可视化即代码、Actor 模型                            |
| **缺点**     | 学习曲线高、简单场景过度设计                                    |

```javascript
// XState 状态机定义
const machine = createMachine({
  id: 'auth',
  initial: 'idle',
  context: { retries: 0 },
  states: {
    idle: {
      on: { LOGIN: 'loading' },
    },
    loading: {
      invoke: {
        src: 'loginService',
        onDone: 'success',
        onError: 'failure',
      },
    },
    success: { type: 'final' },
    failure: {
      on: {
        RETRY: {
          target: 'loading',
          actions: assign({ retries: (ctx) => ctx.retries + 1 }),
        },
      },
    },
  },
});
```

---

#### Robot (小型 FSM)

| 维度         | 内容                                                         |
| :----------- | :----------------------------------------------------------- |
| **GitHub**   | [matthewp/robot](https://github.com/matthewp/robot) ⭐ 1.8k+ |
| **核心思想** | 极简有限状态机                                               |
| **优点**     | < 1KB、函数式 API、无配置对象                                |
| **适用场景** | 简单的状态切换逻辑                                           |

---

### 1.6 服务端状态管理派系 (Server State)

#### TanStack Query (React Query)

| 维度         | 内容                                                                        |
| :----------- | :-------------------------------------------------------------------------- |
| **GitHub**   | [TanStack/query](https://github.com/TanStack/query) ⭐ 40k+                 |
| **核心思想** | 服务端状态是"缓存"而非"应用状态"                                            |
| **实现原理** | Query Cache 存储请求结果，用 staleTime/cacheTime 控制缓存策略，自动后台刷新 |
| **优点**     | 彻底解决 loading/error/data 三态、乐观更新、自动重试                        |
| **缺点**     | 只管服务端状态，客户端状态仍需其他库                                        |

```javascript
// React Query 核心概念
const { data, isLoading, error } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000, // 5 分钟内不重新获取
});

// 乐观更新
useMutation({
  mutationFn: updateUser,
  onMutate: async (newData) => {
    await queryClient.cancelQueries(['users', userId]);
    const previous = queryClient.getQueryData(['users', userId]);
    queryClient.setQueryData(['users', userId], newData); // 乐观更新
    return { previous };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(['users', userId], context.previous); // 回滚
  },
});
```

---

#### SWR (Vercel)

| 维度                 | 内容                                                |
| :------------------- | :-------------------------------------------------- |
| **GitHub**           | [vercel/swr](https://github.com/vercel/swr) ⭐ 30k+ |
| **核心思想**         | Stale-While-Revalidate 缓存策略                     |
| **实现原理**         | 先返回缓存数据，同时后台重新验证                    |
| **对比 React Query** | API 更简洁，但功能较少（无 Mutation、无 DevTools）  |

---

#### RTK Query (Redux Toolkit)

| 维度         | 内容                           |
| :----------- | :----------------------------- |
| **核心思想** | Redux 生态的服务端状态方案     |
| **实现原理** | 在 Redux Store 内管理 API 缓存 |
| **优点**     | 与 Redux 无缝集成              |
| **缺点**     | 绑定 Redux 生态                |

---

### 1.7 RxJS / Observable 派系

#### RxJS

| 维度         | 内容                                                        |
| :----------- | :---------------------------------------------------------- |
| **GitHub**   | [ReactiveX/rxjs](https://github.com/ReactiveX/rxjs) ⭐ 30k+ |
| **核心思想** | 一切皆流 (Everything is a Stream)                           |
| **实现原理** | Observable 表示随时间推送的值序列，Operators 对流进行变换   |
| **优点**     | 处理复杂异步逻辑的终极工具                                  |
| **缺点**     | 学习曲线极陡、React 集成需要胶水层                          |

```javascript
// RxJS 核心概念
const clicks$ = fromEvent(button, 'click');
const positions$ = clicks$.pipe(
  throttleTime(1000),
  map((e) => ({ x: e.clientX, y: e.clientY })),
  distinctUntilChanged(),
);
positions$.subscribe((pos) => console.log(pos));
```

---

#### Elf (RxJS 状态管理)

| 维度         | 内容                                                 |
| :----------- | :--------------------------------------------------- |
| **GitHub**   | [ngneat/elf](https://github.com/ngneat/elf) ⭐ 1.5k+ |
| **核心思想** | 基于 RxJS 的模块化状态管理                           |
| **优点**     | 为 RxJS 用户提供开箱即用的 Store 模式                |

---

#### Akita

| 维度         | 内容                                                         |
| :----------- | :----------------------------------------------------------- |
| **GitHub**   | [datorama/akita](https://github.com/datorama/akita) ⭐ 3.7k+ |
| **核心思想** | 基于 RxJS 的实体管理                                         |
| **适用场景** | Angular 项目或 RxJS 重度用户                                 |

---

### 1.8 CRDT / 协作状态派系

#### Yjs

| 维度         | 内容                                               |
| :----------- | :------------------------------------------------- |
| **GitHub**   | [yjs/yjs](https://github.com/yjs/yjs) ⭐ 15k+      |
| **核心思想** | CRDT (无冲突复制数据类型) 实现多人实时协作         |
| **实现原理** | 每个操作携带唯一 ID 和因果依赖，合并时自动解决冲突 |
| **优点**     | 离线优先、P2P 支持、与主流编辑器集成               |
| **缺点**     | 只解决协作问题，不是通用状态管理                   |

```javascript
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const doc = new Y.Doc();
const ymap = doc.getMap('shared-state');

// 本地修改自动同步到所有客户端
ymap.set('count', 42);

// 监听远程变更
ymap.observe((event) => {
  console.log('Changed:', event.changes);
});
```

---

#### Automerge

| 维度         | 内容                                                                 |
| :----------- | :------------------------------------------------------------------- |
| **GitHub**   | [automerge/automerge](https://github.com/automerge/automerge) ⭐ 3k+ |
| **核心思想** | JSON 友好的 CRDT                                                     |
| **对比 Yjs** | API 更简洁，但性能略逊于 Yjs                                         |

---

#### Liveblocks

| 维度         | 内容                                    |
| :----------- | :-------------------------------------- |
| **官网**     | [liveblocks.io](https://liveblocks.io/) |
| **核心思想** | CRDT + 后端即服务 (BaaS)                |
| **优点**     | 开箱即用的协作基础设施                  |

---

### 1.9 GraphQL 客户端派系

#### Apollo Client

| 维度         | 内容                                                                                  |
| :----------- | :------------------------------------------------------------------------------------ |
| **GitHub**   | [apollographql/apollo-client](https://github.com/apollographql/apollo-client) ⭐ 19k+ |
| **核心思想** | GraphQL + 归一化缓存                                                                  |
| **实现原理** | 将 GraphQL 响应拍平到 ID 索引的缓存中，自动更新引用                                   |
| **优点**     | 自动缓存、乐观 UI、Fragment Colocation                                                |
| **缺点**     | 打包体积大、配置复杂                                                                  |

---

#### Relay (Meta)

| 维度         | 内容                                                        |
| :----------- | :---------------------------------------------------------- |
| **GitHub**   | [facebook/relay](https://github.com/facebook/relay) ⭐ 18k+ |
| **核心思想** | 编译期优化的 GraphQL 客户端                                 |
| **优点**     | 极致性能、与 React 深度集成                                 |
| **缺点**     | 学习曲线极高、需要完整的编译工具链                          |

---

#### URQL

| 维度            | 内容                                                               |
| :-------------- | :----------------------------------------------------------------- |
| **GitHub**      | [urql-graphql/urql](https://github.com/urql-graphql/urql) ⭐ 8.5k+ |
| **核心思想**    | 轻量级 GraphQL 客户端                                              |
| **对比 Apollo** | 更小、更模块化、可插拔的缓存                                       |

---

### 1.10 其他特色方案

#### Effector (俄罗斯)

| 维度         | 内容                                                               |
| :----------- | :----------------------------------------------------------------- |
| **GitHub**   | [effector/effector](https://github.com/effector/effector) ⭐ 4.5k+ |
| **核心思想** | 多向数据流 + 强类型推断                                            |
| **实现原理** | Store/Event/Effect 三位一体，数据流显式声明                        |
| **优点**     | 类型完美、性能极高                                                 |
| **缺点**     | 国内少见、API 繁琐                                                 |

```javascript
import { createStore, createEvent, createEffect } from 'effector';

const increment = createEvent();
const $counter = createStore(0).on(increment, (n) => n + 1);

const fetchUser = createEffect(async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});
```

---

#### Hookstate

| 维度         | 内容                                                               |
| :----------- | :----------------------------------------------------------------- |
| **GitHub**   | [avkonst/hookstate](https://github.com/avkonst/hookstate) ⭐ 1.6k+ |
| **核心思想** | 基于 Proxy 的极简 React Hook                                       |
| **优点**     | 零样板代码、深度嵌套对象性能优异                                   |

---

#### Overmind

| 维度         | 内容                                                               |
| :----------- | :----------------------------------------------------------------- |
| **GitHub**   | [cerebral/overmind](https://github.com/cerebral/overmind) ⭐ 1.3k+ |
| **核心思想** | 融合 Flux + Statechart + Proxy 的野心之作                          |
| **特色**     | 内置 DevTools、可视化状态流                                        |

---

### 1.11 领域专用状态管理

| 领域           | 代表库                        | 说明                         |
| :------------- | :---------------------------- | :--------------------------- |
| **表单状态**   | React Hook Form, Formik       | 表单验证、字段状态、提交处理 |
| **路由状态**   | TanStack Router, React Router | URL 即状态，浏览器历史管理   |
| **表格状态**   | TanStack Table                | 分页、排序、筛选、行选择     |
| **本地数据库** | RxDB, PouchDB, Dexie          | 离线优先、IndexedDB 封装     |
| **动画状态**   | Framer Motion, React Spring   | 基于物理的动画状态机         |

---

### 1.12 历史遗留方案 (不推荐新项目使用)

| 库                 | 状态               | 替代方案      |
| :----------------- | :----------------- | :------------ |
| **Recoil**         | ⚠️ 停止维护 (2024) | Jotai         |
| **Redux (Legacy)** | ⚠️ 过时            | Redux Toolkit |
| **Flux (Library)** | 🪦 已废弃          | 任意现代方案  |
| **Alt.js**         | 🪦 已废弃          | Zustand       |
| **Reflux**         | 🪦 已废弃          | Zustand       |

---

## 参考资源

### 现有库深度研究

- [Zustand](https://github.com/pmndrs/zustand) - 极简 Flux
- [Jotai](https://github.com/pmndrs/jotai) - 原子化状态
- [XState](https://github.com/statelyai/xstate) - 状态机
- [Yjs](https://github.com/yjs/yjs) - CRDT 协作
- [Legend-State](https://github.com/LegendApp/legend-state) - Signal 性能

### 学术论文

- [Statecharts: A Visual Formalism for Complex Systems (1987)](https://www.wisdom.weizmann.ac.il/~harel/papers/Statecharts.History.pdf)
- [CRDTs: Consistency without Consensus](https://crdt.tech/)

### 相关讨论

- [The Evolution of State Management](https://leerob.io/blog/react-state-management)
- [Signals: Fine-grained Reactivity](https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf)

---

_文档更新于 2026-01-08_
