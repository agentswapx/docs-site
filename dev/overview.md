# Developer Overview

This section is aimed at developers who want to build on top of ATXSwap. It covers the SDK, smart contracts, and integration patterns.

## Where to Start

- **Building a Node.js / backend integration?** → [SDK Developer Guide](/dev/sdk-guide)
- **Want ready-made commands instead of TypeScript?** → [Install ATX Skill](/skill/install-agent)
- **Looking for the source code?** → [GitHub: agentswapx](https://github.com/agentswapx)

## Repository Layout

- `contracts/` — Solidity smart contracts (ATX ERC20)
- `packages/atxswap-sdk/` — TypeScript SDK ([npm: `atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk))
- `frontend/` — Frontend application (Next.js)
- `docs-site/` — This documentation site (VitePress)
- `skills/` — Agent Skills (Claude / Cursor / Codex / OpenClaw)

## What You Can Build

The SDK exposes everything you need to script ATX on BSC:

| Capability | Module |
|---|---|
| Price, balance, quote, LP positions | `client.query` |
| Keystore-encrypted wallet management | `client.wallet` |
| ATX ↔ USDT swaps via PancakeSwap V3 | `client.swap` |
| BNB / ATX / USDT / arbitrary ERC20 transfers | `client.transfer` |
| Add / remove / collect PancakeSwap V3 liquidity | `client.liquidity` |

Read the full walkthrough in the [SDK Developer Guide](/dev/sdk-guide).

## Coming Soon

- Smart contract interface reference
- Deployment & operations guide
- API & webhook reference for hosted services
