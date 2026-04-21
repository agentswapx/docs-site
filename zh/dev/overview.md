# 开发文档概览

本节面向想要基于 ATXSwap 构建应用的开发者，涵盖 SDK、智能合约与集成方案。

## 从这里开始

- **要做 Node.js / 后端集成？** → [SDK 开发者指南](/zh/dev/sdk-guide)
- **想直接用现成命令而不是写 TypeScript？** → [安装 ATX 技能](/zh/skill/install-agent)
- **想看源代码？** → [GitHub: agentswapx](https://github.com/agentswapx)

## 仓库结构

- `contracts/` — Solidity 智能合约（ATX ERC20）
- `packages/atxswap-sdk/` — TypeScript SDK（[npm：`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)）
- `frontend/` — 前端应用（Next.js）
- `docs-site/` — 当前文档站（VitePress）
- `skills/` — Agent 技能（Claude / Cursor / Codex / OpenClaw）

## 你能基于它做什么

SDK 提供了在 BSC 上脚本化操作 ATX 所需的全部能力：

| 能力 | 模块 |
|---|---|
| 价格、余额、报价、LP 仓位查询 | `client.query` |
| keystore 加密钱包管理 | `client.wallet` |
| 通过 PancakeSwap V3 进行 ATX ↔ USDT 交换 | `client.swap` |
| BNB / ATX / USDT / 任意 ERC20 转账 | `client.transfer` |
| PancakeSwap V3 流动性增加 / 移除 / 收取手续费 | `client.liquidity` |

完整的上手流程请阅读 [SDK 开发者指南](/zh/dev/sdk-guide)。

## 即将完善

- 智能合约接口参考
- 部署与运维指南
- 托管服务的 API 与 Webhook 参考
