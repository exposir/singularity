<!--
[INPUT]: 无外部依赖
[OUTPUT]: Singularity 项目主 README
[POS]: 项目根目录的入口文档，用于 GitHub/NPM 展示
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# Singularity

> **⚠️ 项目状态：开发暂停**
>
> 本项目在完成核心实现后经过冷静评估，决定暂停开发。详见[项目评估与暂停说明](#项目评估与暂停说明)。

> **"Born Simple, Born Traceable"**
>
> 天生简单，天生可追踪。

**Singularity** 是一个重新思考前端状态管理的库。它旨在同时解决三个长期存在的痛点：**简单性**、**可追踪性**和**细粒度更新**。

## 为什么选择 Singularity？

在现有的生态中，我们往往只能在三个维度中妥协：

| 库              | 简单吗？        | 可追踪吗？       | 细粒度更新？       |
| :-------------- | :-------------- | :--------------- | :----------------- |
| **Zustand**     | ✅ 极简         | ❌ 无内置追踪    | ❌ 需 selector     |
| **Redux**       | ❌ 复杂         | ✅ DevTools 追踪 | ❌ 需手动优化      |
| **Jotai**       | ⚠️ 原子组合     | ❌ 无内置追踪    | ✅ 原生 Signal     |
| **Singularity** | **✅ 极简 API** | **✅ 内置历史**  | **✅ Signal 驱动** |

**Singularity 的核心承诺：**

1.  **比 Zustand 更简单**：一行代码创建状态，无需 `create()`。
2.  **比 Redux 更可追踪**：内置历史记录，默认开启，无需配置 DevTools。
3.  **比 Jotai 更易用**：同样的细粒度更新，但 API 更直观。
4.  **性能无损**：生产环境零开销，开发环境全追踪。

## 快速开始

```typescript
import { atom, useAtom } from "singularity";

// 1. 定义状态 (无需 store)
const count = atom(0);

function Counter() {
  // 2. 使用状态
  const value = useAtom(count);

  return (
    <button onClick={() => count.set((v) => v + 1)}>Clicked: {value}</button>
  );
}

// 3. 调试：查看历史 (开发模式)
console.log(count.history());
//Output: [{ from: 0, to: 1, time: 17047... }]
```

## 文档架构

本项目的深度设计文档位于 `doc/` 目录：

- [**核心问题与愿景**](./doc/problems-vision.md): 详细阐述为什么要造这个轮子。
- [**设计与路线图**](./doc/design-roadmap.md): 技术架构、分层设计与实施计划。
- [**核心 API 规格**](./doc/specs-core.md): `atom`, `computed`, `effect` 等核心 API 的详细规范。
- [**开发指南**](./doc/development-guide.md): 项目开发、构建与测试的具体指引。
- [**生态全景分析**](./doc/landscape.md): 与竞品（Zustand, Jotai, MobX 等）的深度对比。
- [**术语表与 FAQ**](./doc/terminology-qa.md): 核心概念定义与常见问题解答。
- [**评审与分析**](./doc/reviews.md): 第三方视角的项目评审报告。

## 核心哲学

> **「状态不是数据集合，而是可验证的变化史」**

- **可解释性 > 自由度**: 系统必须能解释"为什么变成这样"。
- **因果闭环 > 局部便利**: 每次变更都有完整链条。
- **开箱即用 > 需要配置**: 追踪默认开启。

---

## 项目评估与暂停说明

**评估日期**: 2026-01-09
**完成进度**: Week 1-2 完成（atom, computed, effect, batch, trace），测试覆盖 27 tests passed

### 技术实现：✅ 成功

- ✅ 核心功能实现完整（atom, computed, effect, batch）
- ✅ 代码质量高，符合 Linus Torvalds "Good Taste" 原则
- ✅ 测试覆盖充分，无明显 bug
- ✅ 性能预期可达 Jotai 80-100%

### 商业价值：❌ 不足

#### 1. 差异化严重不足

| 维度         | Singularity               | Jotai                      | 实际差异       |
| :----------- | :------------------------ | :------------------------- | :------------- |
| **简单性**   | `const count = atom(0)`   | `const count = atom(0)`    | ❌ 完全相同    |
| **可追踪性** | 内置 `history()`          | jotai-devtools 插件        | ⚠️ 插件已覆盖  |
| **细粒度**   | Signal-based              | Signal-based               | ❌ 完全相同    |
| **API 风格** | `computed(() => ...)`     | `atom((get) => ...)`       | ⚠️ 风格偏好    |

**核心问题**: 与 Jotai 95% 功能重叠，无法回答"为什么不直接用 Jotai"。

#### 2. 生态差距无法追赶

Jotai 已有 20+ 官方/社区插件：
- jotai-tanstack-query (异步状态)
- jotai-form (表单集成)
- jotai-devtools (开发者工具)
- jotai-location (路由同步)
- jotai-optics (Lens 支持)
- jotai-immer, jotai-valtio, jotai-xstate...

Singularity 从零开始需要 3-5 年。

#### 3. 伪需求：内置历史

- **开发模式**: Redux DevTools / jotai-devtools 已是业界标准
- **生产模式**: `history()` 被 tree-shake 掉，实际无作用
- **真实需求**: 0.1% 用户需要生产环境追踪，应使用 Sentry/LogRocket 专业工具

#### 4. 市场时机已过

- **2020 年**: Jotai 发布，占据 Signal-based 状态管理生态位
- **2026 年**: 市场格局已定（Zustand 简单派、Jotai 细粒度派、Redux 企业派）
- **时间窗口**: 已关闭

### 最终结论

> **技术上可行，商业上无意义。**

**评分**:
- 价值: 2/10 (差异化不足)
- 可行性: 8/10 (技术上能做出来)
- 创新性: 1/10 (95% 重复 Jotai)
- 时机: 0/10 (晚了 6 年)

### 暂停而非放弃的原因

本项目作为**学习项目**具有价值：
- ✅ 深入理解响应式系统原理
- ✅ 掌握 TypeScript 类型体操
- ✅ 学习 Signal-based 架构
- ✅ 实践 Linus "Good Taste" 编码哲学

但作为**生产项目**，推荐直接使用：
- **简单场景**: [Zustand](https://github.com/pmndrs/zustand)
- **细粒度场景**: [Jotai](https://github.com/pmndrs/jotai)
- **企业场景**: [Redux Toolkit](https://redux-toolkit.js.org/)

---

## 状态管理的终局思考

### 本地响应式状态：战争已结束

2026 年的前端状态管理格局已经稳定。对于"管理组件间共享的响应式状态"这个问题，现有方案已足够好：

```typescript
// Jotai - 接近 useState 的体验
const countAtom = atom(0)
const [count, setCount] = useAtom(countAtom)

// Zustand - 5 行代码搞定全局状态
const useStore = create((set) => ({
  count: 0,
  inc: () => set(s => ({ count: s.count + 1 }))
}))
```

**API 简洁性、类型安全、性能优化、开发体验** — 这些维度都已触及天花板。在这个赛道上再造轮子，必然遭遇 Singularity 的困境：技术可行但无差异化。

### 真正的创新空间

状态管理领域并非完全饱和。痛点不在"简单"，在"复杂场景"：

| 方向 | 当前饱和度 | 痛点描述 | 创新空间 |
|:-----|:-----------|:---------|:---------|
| **协作状态** | 30% | 多人实时编辑，冲突解决 | 大 |
| **离线优先** | 20% | PWA/移动端离线工作，上线同步 | 大 |
| **跨端同步** | 20% | 手机、电脑、平板间状态一致 | 大 |
| **状态机集成** | 50% | 复杂业务流程（支付、表单向导） | 中 |
| **AI-Native** | 0% | 让 AI Agent 理解和操作应用状态 | 巨大 |

#### 协作状态（Collaborative State）

```typescript
// 想象这样的 API — 目前不存在
const doc = createCollaborativeAtom({
  schema: z.object({ text: z.string() }),
  provider: new WebsocketProvider('wss://...'),
  conflictResolution: 'crdt'
})
// 多端自动同步，冲突自动解决
```

Yjs/Automerge 提供了 CRDT 原语，但没有状态管理库原生支持协作。Liveblocks 是服务而非开源库。

#### 离线优先状态（Offline-First State）

```typescript
// 想象这样的 API — 目前需要手动拼接
const todos = createOfflineAtom({
  key: 'todos',
  storage: indexedDB,
  sync: { endpoint: '/api/todos', strategy: 'queue-and-retry' }
})
// 离线时写入本地，上线自动同步
```

#### AI-Native 状态

```typescript
// 最前沿方向 — 完全空白
const appState = createObservableAtom({
  value: { user: null, cart: [] },
  explain: true  // 生成人类可读的状态变化描述
})

appState.query("用户购物车里有什么？")  // AI 可查询
appState.execute("清空购物车")           // AI 可操作
```

### 本项目的真正价值

回顾 Singularity 的开发历程，沉淀下来的不是状态管理库本身，而是：

1. **GEB 分形文档协议** — L1/L2/L3 的代码-文档同构系统，比 core 代码更有创新性
2. **代码美学实践** — Linus "Good Taste" 哲学的 TypeScript 实现范本
3. **止损能力** — 在 Week 2 看清本质、果断暂停，这是工程成熟度的标志

> 很多项目死于停不下来。能在正确的时间做出正确的判断，本身就是价值。

### 已完成工作

- ✅ 完整的核心实现 (packages/core)
- ✅ 27 个测试用例全部通过
- ✅ 详细的技术文档 (doc/)
- ✅ GEB 分形文档系统 (CLAUDE.md)
- ✅ 开发日志 (devlog/week1-2.md)

**代码质量**: 生产级，可作为学习参考。

---

## 贡献

本项目已暂停开发，但欢迎作为学习材料使用。

请查阅 [CLAUDE.md](./CLAUDE.md) 了解项目架构与文档系统。

## License

MIT
