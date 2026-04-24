# Getting Started

Welcome to ATXSwap. This guide walks you through the core features and how to start using the protocol.

## What is ATXSwap

ATXSwap is a decentralized agent exchange protocol deployed on BNB Smart Chain (BSC), optimized for agent-driven scenarios.

## Key Features

- Swap between ATX and USDT
- PancakeSwap V3 liquidity management
- Wallet and token transfers

## Install the ATX Skill

In runtimes that support [Agent skills](https://github.com/anthropics/skills) — **OpenClaw**, **Claude Code**, and similar — install the `atxswap` skill to quote, swap, manage liquidity, and transfer in natural language. You typically pick either a **managed CLI install** or a **local / project copy** of the skill:

- **OpenClaw** — install with the `clawhub` or `openclaw` CLI from the ClawHub skill library; the install path is usually managed for you (e.g. `~/.openclaw/workspace/skills/atxswap/`). Best when you want a one-step setup with minimal hand-managed folders. See [Install ATX Skill on OpenClaw](/skill/install-openclaw).
- **Claude Code** — place the skill under `~/.claude/skills/atxswap/` (personal, all projects) or `<project>/.claude/skills/atxswap/` (this repo only; commit `.claude/skills/` with the project if the skill is shared project tooling). The entry file is `SKILL.md` under the skill folder; use `/atxswap` when your client supports that shortcut. See [Install the ATX Skill in Claude Code](/skill/install-agent).

## Next Steps

- Check the [Developer Docs](/dev/overview) for integration details
- Visit [GitHub](https://github.com/agentswapx) for the source code
