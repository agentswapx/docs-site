# Install the ATX Skill in Claude Code

This page explains how to use **Claude Code** with the ATX skill (`atxswap`) to work with BSC on-chain assets: create wallets, check prices, trade, manage liquidity, and transfer — all in natural language, without hand-writing DApp code. The skill follows the [Agent Skills](https://github.com/anthropics/skills) convention via `SKILL.md`. For **OpenClaw** and other ClawHub-based installs, see [Install ATX Skill on OpenClaw](/skill/install-openclaw). For **OpenCode** (local `SKILL.md` discovery), see [Install the ATX Skill on OpenCode](/skill/install-opencode).

- **SDK on npm**: [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)
- **GitHub**: [agentswapx/skills](https://github.com/agentswapx/skills/tree/main/atxswap)

## Prerequisites

On your machine:

- **Node.js 18+** ([download](https://nodejs.org))
- **npm** (bundled with Node.js)
- **Git** ([download](https://git-scm.com))

Check versions:

```bash
node -v && npm -v && git --version
```

## Pick an install location

Claude Code loads skills from two fixed directories — pick whichever one matches your use case:

| Type | Path | When to use |
|---|---|---|
| ① Personal skill (global) | `~/.claude/skills/atxswap/SKILL.md` | Available in **every project** for the current user |
| ② Project skill (current repo) | `<project-root>/.claude/skills/atxswap/SKILL.md` | Only available in the current project; can be checked into version control with the repo |

::: tip Recommendation
For team projects, commit `.claude/skills/` to version control so the skill becomes part of the project's tooling. For personal use, `~/.claude/skills/` is simpler. The two locations can coexist — Claude Code reads both.
:::

## Get the skill and install dependencies

Once you have decided on a path, clone the skill into it and install its dependencies.

**① Install as a personal skill (global)**

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/agentswapx/skills.git /tmp/atxswap-skills
cp -r /tmp/atxswap-skills/atxswap ~/.claude/skills/atxswap
cd ~/.claude/skills/atxswap && npm install
```

**② Install as a project skill (current repo only)**

Run from your project root:

```bash
mkdir -p .claude/skills
git clone https://github.com/agentswapx/skills.git /tmp/atxswap-skills
cp -r /tmp/atxswap-skills/atxswap .claude/skills/atxswap
cd .claude/skills/atxswap && npm install
```

Either way, `npm install` pulls [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk) from npm; there is no separate build step. The resulting layout is:

```
.claude/skills/atxswap/        # or ~/.claude/skills/atxswap/
├── SKILL.md
├── scripts/
├── package.json
└── node_modules/
```

::: info Tips
- The `git clone` + `cp` pattern keeps only the `atxswap` subfolder. If you would rather track the whole `skills` repo somewhere else on disk, symlink it instead: `ln -s /path/to/skills/atxswap ~/.claude/skills/atxswap`.
- To upgrade, `cd` into the corresponding `atxswap/` folder and run `git pull && npm install` (or just `git pull` in the source repo when using a symlink).
:::

## Use it in Claude Code

1. Start / restart **Claude Code**. It auto-loads every valid skill under `~/.claude/skills/` and the current project's `.claude/skills/`.  
2. Project skills only activate when the Claude Code workspace is that project.  
3. Describe what you need in natural language; Claude Code will follow `SKILL.md` to invoke scripts under `scripts/` with the documented safety rules. You can also trigger it explicitly with `/atxswap`.  

You do not need to type `wallet.js`, `query.js`, and so on in a terminal for normal use — only if you are debugging the skill yourself.

## Try It Out

After setup, you can try prompts like:

### Check price

> "What is the current ATX price?"

### Create a wallet

> "Create a new wallet for me"

Claude will walk you through a password; it can be stored in the OS secure storage for later sessions where appropriate.

### Buy tokens

> "Buy ATX with 10 USDT"

You should see a quote or preview first, then execution on-chain after you confirm.

### Check balance

> "Show my wallet balance"

### Transfer

> "Send 50 ATX to 0xABC...123"

Value-moving actions show a preview first; explicit confirmation is required before execution.

## Phrase quick reference

The first column is example phrasing for **Claude Code** (the prompt), the second column is the underlying command, and the third **Description** column summarizes what that command is for. You usually only need natural language; you do not need to run these commands by hand.

### Wallet management

| Phrase (prompt) | Command | Description |
|---|---|---|
| "Create a new wallet for me" | `wallet.js create [name] --password <pwd>` | Create a new wallet |
| "List all my wallets" | `wallet.js list` | List all wallets and balances |
| "Export the wallet keystore for backup" | `wallet.js export <address> [--out <file>]` | Export the wallet's **encrypted keystore JSON** (the raw private key is never exposed) |

### Queries

| Phrase (prompt) | Command | Description |
|---|---|---|
| "What is the current ATX price?" | `query.js price` | Query ATX/USDT price |
| "Check the balance of 0x…" | `query.js balance <address>` | Check balance (for a given address) |
| "Quote how much ATX 10 USDT would buy" | `query.js quote <buy\|sell> <amount>` | Buy/sell quote preview |
| "Show my LP positions" | `query.js positions <address>` | View LP positions |
| "Preview fees for LP position 123" | `query.js positions <address> <tokenId>` | View one LP position with harvest preview fields |

### Swaps

| Phrase (prompt) | Command | Description |
|---|---|---|
| "Buy ATX with 10 USDT" | `swap.js buy <usdtAmount>` | Buy ATX with USDT |
| "Sell 5 ATX for USDT" | `swap.js sell <atxAmount>` | Sell ATX for USDT |

### Liquidity

| Phrase (prompt) | Command | Description |
|---|---|---|
| "Add 100 ATX and 10 USDT of liquidity" | `liquidity.js add <atx> <usdt>` | Add liquidity |
| "Preview adding 0.1 USDT of liquidity with a 20% price range" | `liquidity.js quote-add usdt 0.1 --range-percent 20` | Preview the ATX/USDT amounts needed for a custom range |
| "Add 0.1 USDT of liquidity with a 20% price range" | `liquidity.js add --base-token usdt --amount 0.1 --range-percent 20` | Auto-balance the other token and add custom-range liquidity |
| "Remove 50% from position 123" | `liquidity.js remove <tokenId> <percent>` | Remove a percentage of liquidity |
| "Collect fees for position 123" | `liquidity.js collect <tokenId>` | Collect accrued LP fees |

Recommended fee-harvest flow:

1. Run `query.js positions <address> <tokenId>`
2. Inspect `collectableAtx` / `collectableUsdt`
3. Execute `liquidity.js collect <tokenId>` only when the preview is worth harvesting

### Transfers

| Phrase (prompt) | Command | Description |
|---|---|---|
| "Send 0.01 BNB to 0x…" | `transfer.js bnb <to> <amount>` | Send BNB |
| "Send 50 ATX to 0x…" | `transfer.js atx <to> <amount>` | Send ATX |
| "Send 100 USDT to 0x…" | `transfer.js usdt <to> <amount>` | Send USDT |

::: info Note
- The **phrases** in the first column are examples only. Similar or paraphrased wording usually works; the agent follows your intent, not the exact words.

- The **commands** in the second column are script entry points inside the skill; **Claude Code** invokes them when needed. You typically do not run these in your terminal yourself.

- The **description** text summarizes the behavior; like the example phrases, it is for your understanding and does not constrain how you must speak.

- Importing an existing private key is **not supported** — neither through natural-language prompts nor as a CLI subcommand. Claude Code will only **create** a fresh wallet for this skill instance. If you need to use an existing private key, manage it with your preferred wallet tooling instead.

- For custom-range liquidity, the recommended flow is: preview with `liquidity.js quote-add`, show `estimatedAmounts`, then execute `liquidity.js add` after confirmation. Do not guess the second token amount from chat.

- For fee harvests, prefer `collectable0/1` or `collectableAtx/collectableUsdt` from `query.js positions`. Do not use raw `tokensOwed0/1` as the only signal because a position can still have harvestable fees while those fields stay at `0`.

:::

## Security

- Private keys and passwords are not shown unnecessarily in chat  
- Before trading, the skill surfaces quotes, balances, or other previews, and waits for your confirmation  
- High‑impact writes expect explicit "confirm" / "execute" language  
- Private keys are stored encrypted in local keystore files; passwords can use the OS keychain (e.g. macOS Keychain / Linux Secret Service)  
- For backups the skill only produces the **encrypted keystore JSON** (e.g. `wallet.js export <address> --out wallet.json`); raw private keys are never produced by the skill or the underlying SDK  
