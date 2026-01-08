# core/

> L2 | 父级: [packages/CLAUDE.md](../CLAUDE.md)

@singularity/core - 核心状态管理库，提供原子级响应式状态。

## 成员清单

| 文件              | 职责                                                               |
| :---------------- | :----------------------------------------------------------------- |
| `src/atom.ts`     | 原子状态：get/set/setRaw/subscribe/history/undo/redo/canUndo/canRedo |
| `src/computed.ts` | 派生状态：惰性计算 + 缓存 + 循环依赖检测 + 订阅去重               |
| `src/effect.ts`   | 副作用：依赖变化时自动重执行 + cleanup + dispose                   |
| `src/batch.ts`    | 批处理：收集多次更新，统一通知（保证执行顺序）                     |
| `src/trace.ts`    | 依赖追踪：Tracker 管理订阅生命周期 + 去重机制                      |
| `src/index.ts`    | 入口文件：统一导出公共 API                                         |

## 测试覆盖

| 文件                         | 用例数 | 状态 |
| :--------------------------- | :----- | :--- |
| `__tests__/atom.test.ts`     | 8      | ✅   |
| `__tests__/batch.test.ts`    | 3      | ✅   |
| `__tests__/computed.test.ts` | 9      | ✅   |
| `__tests__/effect.test.ts`   | 7      | ✅   |

**总计：27 tests passed**

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
