# Singularity

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

## 贡献

请查阅 [CLAUDE.md](./CLAUDE.md) 和 [.antigravity/rules.md](./.antigravity/rules.md) 了解我们的工程规范与协作协议。

## License

MIT
