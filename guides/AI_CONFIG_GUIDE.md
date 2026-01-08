/\*\*

- - [INPUT]: AI Tool Official Docs / Best Practices
- - [OUTPUT]: Standardized AI Config Locations
- - [POS]: Guide / Reference
- - [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
    \*/

# AI Configuration Best Practices Guide

哥，为了防止傻逼 AI 瞎建文件污染项目根目录，这里是各大主流 AI 工具的标准配置文件位置指南。
请强制要求它们遵守此约定。

| AI Tool / Agent          | Standard File Path                | Purpose                  | Note                                         |
| :----------------------- | :-------------------------------- | :----------------------- | :------------------------------------------- |
| **Universal**            | `AGENTS.md`                       | 通用 AI 入职手册         | 根目录，行业新兴标准                         |
| **GitHub Copilot**       | `.github/copilot-instructions.md` | Copilot Chat 指令        | 根目录必须有 `.github` 文件夹                |
| **Cursor**               | `.cursor/rules/`                  | Cursor Project Rules     | 新版推荐；旧版兼容 `.cursorrules` (根目录)   |
| **Windsurf**             | `.windsurf/rules/`                | Windsurf Cascade Context | 新版推荐；旧版兼容 `.windsurfrules` (根目录) |
| **Roo Code (Cline)**     | `.roo/rules/`                     | Roo/Cline System Rules   | 推荐；旧版兼容 `.clinerules`                 |
| **VSCode General**       | `.vscode/settings.json`           | 编辑器通用配置           | 不要放根目录                                 |
| **Anthropic (Claude)**   | `CLAUDE.md`                       | 本项目自研分形协议       | 根目录 (L1), 子目录 (L2)                     |
| **OpenAI (Codex)**       | `CODEX.md`                        | Codex 特定指令           | 根目录 (本项目约定)                          |
| **Google Gemini CLI**    | `GEMINI.md`                       | Gemini Agent 上下文规则  | 支持层级覆盖：`~/.gemini/` -> Project        |
| **Google Gemini Config** | `.gemini/settings.json`           | 核心配置 (Theme/MCP)     | 项目级配置放在 `.gemini/` 下                 |
| **Antigravity**          | `.antigravity/rules.md`           | Antigravity 核心规则     | 必须在 `.antigravity/` 目录下                |

## ✅ Do's (正确姿势)

- **集中管理**：尽量将工具特定的配置扔进 `.github/`, `.vscode/`, `.antigravity/`, `.gemini/` 等隐藏目录。

* **通用标准**：优先维护 `AGENTS.md` 和 `README.md`，因为所有 AI 都会看这两个。
* **明确指令**：在 prompt 中明确告诉 AI "Don't create new config files in root without permission" (未经允许禁止在根目录创建新配置文件)。

## ❌ Don'ts (禁止行为)

- 禁止在根目录随意创建 `instructions.md`, `bot.md`, `ai.txt` 等非标准文件。
- 禁止 AI 自作主张创建 `.agent/` 目录，除非它明确遵循某种框架标准。

## 实用主义建议

如果你发现某个 AI 总是找不到配置，不要迁就它去根目录建文件。
**在 System Prompt 或 `AGENTS.md` 第一行写死文件路径**：

> "Read .github/copilot-instructions.md for all coding rules."
