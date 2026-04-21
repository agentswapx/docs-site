# Install ATX Skill for Your AI

Once the ATX skill is installed, you can use natural language to have Claude, Cursor, Codex, or any compatible AI tool operate BSC on-chain assets for you: check prices, trade tokens, manage wallets, provide liquidity, and transfer tokens — no coding required.

- **GitHub**: [agentswapx/skills](https://github.com/agentswapx/skills)
- **Supported AI tools**: Claude Desktop, Cursor IDE, Codex CLI, and any tool compatible with the Agent Skills specification

## Prerequisites

You need the following software installed on your computer:

- **Node.js 18+** ([download](https://nodejs.org))
- **npm** (comes with Node.js)
- **Git** ([download](https://git-scm.com))

Verify your installation:

```bash
node -v && npm -v && git --version
```

## 30-Second Install

Just two commands:

```bash
git clone https://github.com/agentswapx/skills.git
```

```bash
cd skills/atxswap && npm install
```

Done. `npm install` automatically pulls the ATX SDK — no manual compilation needed.

### Set a Custom RPC Node (Optional)

The default public RPC node works out of the box. If you have a dedicated node:

```bash
export BSC_RPC_URL="https://your-rpc-node.com"
```

## Tell Your AI Tool

After installing the skill, you need to point your AI tool to it.

### Claude Desktop

Add the skill directory path in Claude Desktop settings:

```text
skills/atxswap/SKILL.md
```

Claude will automatically read SKILL.md and learn all ATX operation commands.

### Cursor IDE

In Cursor, add the skill directory to your project's `.cursor/skills/` folder, or specify the path in settings:

```text
skills/atxswap/SKILL.md
```

### Codex CLI

Codex automatically scans for SKILL.md files in your project. Just make sure the skills directory is inside your workspace.

## Try It Out

Once installed, just talk to your AI in natural language:

### Check Price

> "What is the current ATX price?"

The AI will run `query.js price` and return the live ATX/USDT price.

### Create a Wallet

> "Create a new wallet for me"

The AI will ask you to set a password, then create an encrypted wallet. The password is auto-saved to your system's secure storage — no need to enter it again.

### Buy Tokens

> "Buy ATX with 10 USDT"

The AI will first fetch a quote showing how much ATX you'll receive, then wait for your confirmation before executing.

### Check Balance

> "Show my wallet balance"

### Transfer

> "Send 50 ATX to 0xABC...123"

For any action involving asset changes, the AI will always show a preview first and wait for you to say "confirm" before executing.

## Command Reference

These are the underlying commands the AI uses. You do not need to run them manually — they are listed here for reference only.

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

- The AI will never display your private keys or passwords in chat
- Before any transaction, the AI shows a quote/balance preview and waits for your confirmation
- Large trades require you to explicitly say "confirm" or "execute"
- Private keys are stored encrypted in local keystore files
- Passwords are saved in your system's secure storage (macOS Keychain / Linux Secret Service)
