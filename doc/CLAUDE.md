# doc/

> L2 | 父级: [/CLAUDE.md](../CLAUDE.md)

Singularity 项目的核心设计文档库。包含从愿景、架构到 API 规格的完整规范。

## 成员清单

| 文件                   | 职责                                                     |
| :--------------------- | :------------------------------------------------------- |
| `README.md`            | 文档中心入口，汇总导航                                   |
| `problems-vision.md`   | 核心问题与愿景，阐述"为何造这个轮子"                     |
| `design-roadmap.md`    | 设计原则、技术选型与实施路线图                           |
| `specs-core.md`        | 核心 API 规格 (`atom`, `computed`, `effect`, `batch`)    |
| `development-guide.md` | 详细开发指南，包含里程碑与验收标准                       |
| `landscape.md`         | 生态全景分析，竞品深度对比 (Zustand, Jotai, MobX, Redux) |
| `terminology-qa.md`    | 术语表与常见问题解答                                     |
| `reviews.md`           | 第三方评审与分析报告                                     |

## 文档层级

```
L1 (项目宪法)   → /CLAUDE.md
L2 (模块地图)   → doc/CLAUDE.md (本文件)
L3 (文件头部)   → 各 .md 文件内的元信息
```

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
