# Install ATX Skill on OpenClaw

The ATX skill (`atxswap`) is published to the ClawHub skill library. **We recommend** asking your OpenClaw agent in **natural language** to install it first; you can also install with the **OpenClaw CLI** or **ClawHub CLI** yourself. After installation, your agent can autonomously perform on-chain operations: create wallets, query prices, trade tokens, manage wallets, provide liquidity, and transfer assets.

- **SDK on npm**: [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)
- **GitHub**: [agentswapx/skills](https://github.com/agentswapx/skills/tree/main/atxswap)
- **ClawHub**: [atxswap on clawhub.ai](https://clawhub.ai/skills/atxswap)

For **[OpenCode](https://opencode.ai)** (load skills from local `SKILL.md` paths — see [Agent Skills](https://opencode.ai/docs/skills)), use [Install the ATX Skill on OpenCode](/skill/install-opencode).

## Installation

### Recommended: Natural language (preferred)

In your OpenClaw chat, ask in plain English to install the **ATX skill** (package name **`atxswap`**, published on ClawHub). For example:

> "Install `atxswap`."  
> "I want to trade ATX on-chain with ATXSwap—install the atxswap skill."  
> "Add the atxswap / ATX trading skill from the ClawHub registry."

The agent will run or guide the install for your environment (typically the same skill source as ClawHub). If that does not work in chat, use one of the CLI options below.

### Option 1: OpenClaw CLI

```bash
openclaw skills install atxswap
```

OpenClaw shares the same ClawHub registry. The skill will be installed under `~/.openclaw/workspace/skills/atxswap/`.

### Option 2: ClawHub CLI

```bash
npm install -g clawhub
clawhub install atxswap --force
```

::: tip
The `--force` flag is required because ClawHub's VirusTotal scanner flags any wallet/keystore SDK as "suspicious" by default. This is expected for crypto tooling and does not indicate a real warning.
:::

### Option 3: Manual install

```bash
git clone https://github.com/agentswapx/skills.git
cd skills/atxswap && npm install
```

After install (any option), `npm install` inside the skill directory pulls [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk) from npm.

Inspect the published skill metadata:

```bash
clawhub inspect atxswap
# or
openclaw skills info atxswap
```

## Try It Out

Once installed, just talk to your OpenClaw agent in natural language:

### Check Price

> "What is the current ATX price?"

### Create a Wallet

> "Create a new wallet for me"

The agent will ask you to set a password, then create an encrypted wallet. The password is auto-saved to your system's secure storage.

### Buy Tokens

> "Buy ATX with 10 USDT"

The agent will first fetch a quote preview and wait for your confirmation before executing.

### Check Balance

> "Show my wallet balance"

### Transfer

> "Send 50 ATX to 0xABC...123"

## Phrase quick reference

The first column is example phrasing you can say to your agent (the prompt), the second column is the underlying command, and the third **Description** column summarizes what that command is for. You usually only need natural language; you do not need to run these commands by hand.

### Wallet Management

| Phrase (prompt) | Command | Description |
|---|---|---|
| "Create a new wallet for me" | `wallet.js create [name] --password <pwd>` | Create a new wallet |
| "List all my wallets" | `wallet.js list` | List all wallets and balances |
| "Export the wallet keystore for backup" | `wallet.js export <address> [--out <file>]` | Export the wallet's **encrypted keystore JSON** (the raw private key is never exposed) |

### Queries

| Phrase (prompt) | Command | Description |
|---|---|---|
| "Delete wallet 0x..." | `wallet.js delete <address> --backup-confirmed yes --force-phrase "force delete wallet"` | Delete a wallet only after backup confirmation and the exact force phrase |
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

Recommended wallet-deletion flow:

1. Run `wallet.js export <address> --out <file>` and tell the user where the keystore was saved
2. Ask the user to confirm the backup is complete
3. Require the user to explicitly send `force delete wallet`
4. Only then run `wallet.js delete <address> --backup-confirmed yes --force-phrase "force delete wallet"`

### Transfers

| Phrase (prompt) | Command | Description |
|---|---|---|
| "Send 0.01 BNB to 0x…" | `transfer.js bnb <to> <amount>` | Send BNB |
| "Send 50 ATX to 0x…" | `transfer.js atx <to> <amount>` | Send ATX |
| "Send 100 USDT to 0x…" | `transfer.js usdt <to> <amount>` | Send USDT |

::: info Note
- The **phrases** in the first column are examples only. Similar or paraphrased wording usually works; the agent follows your intent, not the exact words.

- The **commands** in the second column are script entry points inside the skill; the agent invokes them when needed. You typically do not run these in your terminal yourself.

- The **description** text summarizes the behavior; like the example phrases, it is for your understanding and does not constrain how you must speak.

- Importing an existing private key is **not supported** — neither through natural-language prompts nor as a CLI subcommand. The skill only **creates** a fresh wallet for this skill instance. If you need to use an existing private key, manage it with your preferred wallet tooling instead.

- For custom-range liquidity, the recommended flow is: preview with `liquidity.js quote-add`, show `estimatedAmounts`, then execute `liquidity.js add` after confirmation. Do not guess the second token amount from chat.

- For fee harvests, prefer `collectable0/1` or `collectableAtx/collectableUsdt` from `query.js positions`. Do not use raw `tokensOwed0/1` as the only signal because a position can still have harvestable fees while those fields stay at `0`.

- Wallet deletion is a two-step safety action: the user must confirm the keystore backup, and must also explicitly send `force delete wallet` before the delete command is allowed.

:::

## Security

- The agent will never display your private keys or passwords in chat
- Before any transaction, the agent shows a quote/balance preview and waits for your confirmation
- Large trades require you to explicitly say "confirm" or "execute"
- Private keys are stored encrypted in local keystore files
- Passwords are saved in your system's secure storage (macOS Keychain / Linux Secret Service)
- For backups the skill can only emit the **encrypted keystore JSON** (e.g. `wallet.js export <address> --out wallet.json`); raw private keys are never produced by the skill or the underlying SDK
