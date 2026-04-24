# Install the ATX Skill in Claude Code

This page explains how to use **Claude Code** with the ATX skill (`atxswap`) to work with BSC on-chain assets: create wallets, check prices, trade, manage liquidity, and transfer — all in natural language, without hand-writing DApp code. The skill follows the [Agent Skills](https://github.com/anthropics/skills) convention via `SKILL.md`. For **OpenClaw** and other ClawHub-based installs, see [Install ATX Skill on OpenClaw](/skill/install-openclaw).

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

## Get the skill and install dependencies

Run the following in a location you will open with Claude Code (the workspace must **contain** the `atxswap` folder; you can nest the `skills` repo under a larger project if you prefer):

```bash
git clone https://github.com/agentswapx/skills.git
```

```bash
cd skills/atxswap && npm install
```

`npm install` pulls the ATX SDK — no separate build step. If you already have a project tree, you can place `skills` under it and run `cd …/atxswap && npm install` from there.

### Custom RPC (optional)

By default the skill uses a built-in fallback of BSC public RPC endpoints. For a private or preferred node, set (comma‑separated, left‑to‑right priority):

```bash
export BSC_RPC_URL="https://your-rpc.example.com,https://bsc-rpc.publicnode.com"
```

## Use it in Claude Code

1. Open the workspace in **Claude Code** that contains this skill — for example the `skills` repo root after cloning, or a parent project root that includes the `atxswap` directory.  
2. The skill root is `atxswap/`; the entry you care about is **`SKILL.md`**. Keep that path inside the workspace and ensure `npm install` has been run in `atxswap/`.  
3. Describe what you need in natural language. Claude Code follows `SKILL.md` to invoke scripts under `scripts/` with the documented safety rules.  

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

### Queries

| Phrase (prompt) | Command | Description |
|---|---|---|
| "What is the current ATX price?" | `query.js price` | Query ATX/USDT price |
| "Check the balance of 0x…" | `query.js balance <address>` | Check balance (for a given address) |
| "Quote how much ATX 10 USDT would buy" | `query.js quote <buy\|sell> <amount>` | Buy/sell quote preview |
| "Show my LP positions" | `query.js positions <address>` | View LP positions |

### Swaps

| Phrase (prompt) | Command | Description |
|---|---|---|
| "Buy ATX with 10 USDT" | `swap.js buy <usdtAmount>` | Buy ATX with USDT |
| "Sell 5 ATX for USDT" | `swap.js sell <atxAmount>` | Sell ATX for USDT |

### Liquidity

| Phrase (prompt) | Command | Description |
|---|---|---|
| "Add 100 ATX and 10 USDT of liquidity" | `liquidity.js add <atx> <usdt>` | Add liquidity |
| "Remove 50% from position 123" | `liquidity.js remove <tokenId> <percent>` | Remove a percentage of liquidity |
| "Collect fees for position 123" | `liquidity.js collect <tokenId>` | Collect accrued LP fees |

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

:::

## Security

- Private keys and passwords are not shown unnecessarily in chat  
- Before trading, the skill surfaces quotes, balances, or other previews, and waits for your confirmation  
- High‑impact writes expect explicit "confirm" / "execute" language  
- Private keys are stored encrypted in local keystore files; passwords can use the OS keychain (e.g. macOS Keychain / Linux Secret Service)  
