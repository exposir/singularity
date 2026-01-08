# react/

> L2 | 父级: [packages/CLAUDE.md](../CLAUDE.md)

@singularity/react - React 适配器，基于 useSyncExternalStore。

## 成员清单

| 文件                  | 职责                     |
| :-------------------- | :----------------------- |
| `src/useAtom.ts`      | 读写 Hook，支持 selector |
| `src/useAtomValue.ts` | 只读 Hook，用于 computed |
| `src/index.ts`        | 入口文件                 |

## 依赖关系

- **peerDependencies**: react >=18.0.0, @singularity/core >=0.1.0
- **devDependencies**: @singularity/core (workspace:\*)

## 待实现（Week 4-5）

- [ ] 实现 useAtom.ts
- [ ] 实现 useAtomValue.ts
- [ ] 编写 hooks.test.tsx

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
