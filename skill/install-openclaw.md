# Install ATX Skill on ClawHub / OpenClaw

The ATX skill (`atxswap`) is published to the ClawHub registry and works with both the standalone `clawhub` CLI and the OpenClaw CLI — they share the same registry. Once installed, your agent can autonomously perform on-chain operations: query prices, trade tokens, manage wallets, provide liquidity, and transfer assets.

- **ClawHub**: [atxswap on clawhub.ai](https://clawhub.ai/skills/atxswap)
- **SDK on npm**: [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)
- **GitHub**: [agentswapx/skills](https://github.com/agentswapx/skills/tree/main/atxswap)

## Installation

### Option 1: ClawHub CLI

```bash
npm install -g clawhub
clawhub install atxswap --force
```

::: tip
The `--force` flag is required because ClawHub's VirusTotal scanner flags any wallet/keystore SDK as "suspicious" by default. This is expected for crypto tooling and does not indicate a real warning.
:::

### Option 2: OpenClaw CLI

```bash
openclaw skills install atxswap
```

OpenClaw shares the same ClawHub registry. The skill will be installed under `~/.openclaw/workspace/skills/atxswap/`.

### Option 3: Manual Install

```bash
git clone https://github.com/agentswapx/skills.git
cd skills/atxswap && npm install
```

After install (any option), `npm install` inside the skill directory pulls [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk) from npm in around 15 seconds — no git clone or local build required.

## ClawHub Listing

| Field | Value |
|---|---|
| Skill slug | `atxswap` |
| Latest version | `0.0.2` |
| Author | `@agentswapx` |
| License | `MIT-0` |
| SDK dependency | [`atxswap-sdk@^0.0.1`](https://www.npmjs.com/package/atxswap-sdk) |
| Requirements | Node.js 18+, npm, `BSC_RPC_URL` env (optional; supports comma-separated values; defaults to a built-in fallback list of 8 BSC RPC endpoints — Infura + 7 BNB Chain public nodes) |
| Supported OS | Linux, macOS |

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

## Command Reference

These are the underlying commands the agent uses. You do not need to run them manually.

### Wallet Management

| Command | Description |
|---|---|
| `wallet.js create [name] --password <pwd>` | Create a new wallet |
| `wallet.js list` | List all wallets with balances |
| `wallet.js import <key> [name] --password <pwd>` | Import an existing private key |

### Queries

| Command | Description |
|---|---|
| `query.js price` | Query ATX/USDT price |
| `query.js balance <address>` | Check balance |
| `query.js quote <buy\|sell> <amount>` | Swap quote preview |
| `query.js positions <address>` | View LP positions |

### Swaps

| Command | Description |
|---|---|
| `swap.js buy <usdtAmount>` | Buy ATX with USDT |
| `swap.js sell <atxAmount>` | Sell ATX for USDT |

### Liquidity

| Command | Description |
|---|---|
| `liquidity.js add <atx> <usdt>` | Add liquidity |
| `liquidity.js remove <tokenId> <percent>` | Remove liquidity |
| `liquidity.js collect <tokenId>` | Collect fees |

### Transfers

| Command | Description |
|---|---|
| `transfer.js bnb <to> <amount>` | Send BNB |
| `transfer.js atx <to> <amount>` | Send ATX |
| `transfer.js usdt <to> <amount>` | Send USDT |

## Security

- The agent will never display your private keys or passwords in chat
- Before any transaction, the agent shows a quote/balance preview and waits for your confirmation
- Large trades require you to explicitly say "confirm" or "execute"
- Private keys are stored encrypted in local keystore files
- Passwords are saved in your system's secure storage (macOS Keychain / Linux Secret Service)
