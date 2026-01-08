# packages/

> L2 | 父级: [/CLAUDE.md](../CLAUDE.md)

Singularity monorepo 的包目录，采用 pnpm workspace 管理。

## 成员清单

| 目录     | 包名               | 职责                                        |
| :------- | :----------------- | :------------------------------------------ |
| `core/`  | @singularity/core  | 核心状态管理：atom, computed, effect, batch |
| `react/` | @singularity/react | React 适配器：useAtom, useAtomValue         |

## 架构关系

```
@singularity/react
    └── peerDep: @singularity/core
```

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
