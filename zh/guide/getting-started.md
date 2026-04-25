# 快速开始

欢迎使用 ATXSwap。本指南将带你快速了解协议的核心功能与使用方式。

## 什么是 ATXSwap

ATXSwap 是部署在 BNB Smart Chain（BSC）上的智能体去中心化交易协议，针对 Agent 场景做了优化。

## 主要功能

- ATX 与 USDT 之间的兑换
- PancakeSwap V3 流动性管理
- 钱包与代币转账

## 安装 ATX 技能

在 **OpenClaw**、**Claude Code** 等支持 [Agent 技能](https://github.com/anthropics/skills) 的环境里，可安装 `atxswap` 技能，用自然语言完成查价、兑换、流动性与转账。常见先选「运行时一键安装」或「本机/项目里放技能包」其中一种即可：

- **OpenClaw** — **优先**在对话里用自然语言请智能体从 ClawHub 安装 `atxswap` 技能；也可使用 `clawhub` 或 `openclaw` CLI 安装，目录通常由 CLI 管理（如 `~/.openclaw/workspace/skills/atxswap/`）。详见 [在 OpenClaw 中安装 ATX 技能](/zh/skill/install-openclaw)。
- **Claude Code** — 将技能放在 `~/.claude/skills/atxswap/`（个人、跨项目）或放项目的 `.claude/skills/atxswap/`（仅当前仓库；建议将 `.claude/skills/` 纳入版本控制，作为项目工具）。入口为 `SKILL.md`，客户端支持时可用 `/atxswap` 调起。详见 [在 Claude Code 中安装 ATX 技能](/zh/skill/install-agent)。

## 下一步

- 查看 [开发文档](/zh/dev/overview) 了解集成方式
- 访问 [GitHub](https://github.com/agentswapx) 获取源码
