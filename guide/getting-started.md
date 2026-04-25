# Getting Started

Welcome to ATXSwap. This guide walks you through the core features and how to start using the protocol.

## What is ATXSwap

ATXSwap is a decentralized agent exchange protocol deployed on BNB Smart Chain (BSC), optimized for agent-driven scenarios.

## Key Features

- Swap between ATX and USDT
- PancakeSwap V3 liquidity management
- Wallet and token transfers

## Install the ATX Skill

In runtimes that support [Agent skills](https://github.com/anthropics/skills) — **OpenClaw**, **OpenCode**, **Claude Code**, and similar — install the `atxswap` skill to quote, swap, manage liquidity, and transfer in natural language. You typically pick either a **managed CLI install** or a **local / project copy** of the skill:

- **OpenClaw** — **prefer** asking your agent in natural language to install the `atxswap` skill from ClawHub; you can also use the `clawhub` or `openclaw` CLI, with the path usually managed for you (e.g. `~/.openclaw/workspace/skills/atxswap/`). See [Install ATX Skill on OpenClaw](/skill/install-openclaw).
- **OpenCode** — place the skill under `.opencode/skills/atxswap/` (project) or `~/.config/opencode/skills/atxswap/` (global), then run `npm install` in that folder. Discovery rules follow [OpenCode Agent Skills](https://opencode.ai/docs/skills). See [Install the ATX Skill on OpenCode](/skill/install-opencode).
- **Claude Code** — place the skill under `~/.claude/skills/atxswap/` (personal, all projects) or `<project>/.claude/skills/atxswap/` (this repo only; commit `.claude/skills/` with the project if the skill is shared project tooling). The entry file is `SKILL.md` under the skill folder; use `/atxswap` when your client supports that shortcut. See [Install the ATX Skill in Claude Code](/skill/install-agent).

## Next Steps

- Check the [Developer Docs](/dev/overview) for integration details
- Visit [GitHub](https://github.com/agentswapx) for the source code
