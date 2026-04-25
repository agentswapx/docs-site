# Install the ATX Skill on OpenCode

[OpenCode](https://opencode.ai) discovers **agent skills** from `SKILL.md` files under fixed paths on disk. It is a different workflow from [ClawHub / OpenClaw](/skill/install-openclaw) (registry install) or [Claude Code](/skill/install-agent) paths: you place the skill folder yourself, then OpenCode’s `skill` tool can load it on demand. The upstream format and discovery rules are documented in [Agent Skills | OpenCode](https://opencode.ai/docs/skills).

- **Skill package name**: `atxswap` (must match the folder name that contains `SKILL.md`)
- **SDK on npm**: [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)
- **Source**: [agentswapx/skills — atxswap](https://github.com/agentswapx/skills/tree/main/atxswap)

## Where OpenCode looks for skills

Per [OpenCode’s skills documentation](https://opencode.ai/docs/skills), create **one folder per skill** and put `SKILL.md` inside. OpenCode searches:

| Scope | Path |
|---|---|
| Project (OpenCode) | `.opencode/skills/<name>/SKILL.md` |
| Global (OpenCode) | `~/.config/opencode/skills/<name>/SKILL.md` |
| Project (Claude-compatible) | `.claude/skills/<name>/SKILL.md` |
| Global (Claude-compatible) | `~/.claude/skills/<name>/SKILL.md` |
| Project (agent-compatible) | `.agents/skills/<name>/SKILL.md` |
| Global (agent-compatible) | `~/.agents/skills/<name>/SKILL.md` |

For project-local paths, OpenCode walks **up from your current working directory** until it reaches the git worktree and loads matching `skills/*/SKILL.md` along the way.

## Install the `atxswap` skill

1. **Choose a location** — for a single repo, a common choice is:

   ```text
   <project-root>/.opencode/skills/atxswap/SKILL.md
   ```

   For all your projects on this machine:

   ```text
   ~/.config/opencode/skills/atxswap/SKILL.md
   ```

2. **Copy or clone** the skill contents so the directory name is exactly `atxswap` (must match the `name` field in `SKILL.md` frontmatter):

   ```bash
   mkdir -p .opencode/skills
   git clone --depth 1 https://github.com/agentswapx/skills.git /tmp/agentswapx-skills
   cp -R /tmp/agentswapx-skills/atxswap .opencode/skills/atxswap
   rm -rf /tmp/agentswapx-skills
   ```

3. **Install Node dependencies** inside the skill folder (required for the scripts):

   ```bash
   cd .opencode/skills/atxswap && npm install
   ```

4. **Restart or reload** OpenCode if needed, then use the skill from the agent (OpenCode exposes skills via the native `skill` tool; see [Recognize tool description](https://opencode.ai/docs/skills#recognize-tool-description) in the OpenCode docs).

## Try it out

Once `atxswap` is on an OpenCode discovery path and you have run `npm install` inside the skill folder, talk to your OpenCode agent in **natural language**. The example prompts match [Install ATX Skill on OpenClaw](/skill/install-openclaw#try-it-out) — same scripts underneath.

### Check price

> "What is the current ATX price?"

### Create a wallet

> "Create a new wallet for me"

The agent will ask you to set a password, then create an encrypted wallet. The password is auto-saved to your system's secure storage (or the file backend in headless environments, depending on how the SDK resolves `SecretStore`).

### Buy tokens

> "Buy ATX with 10 USDT"

The agent will first fetch a quote preview and wait for your confirmation before executing.

### Check balance

> "Show my wallet balance"

### Transfer

> "Send 50 ATX to 0xABC...123"

## Phrase quick reference

This table is the same as the **Phrase quick reference** on [Install ATX Skill on OpenClaw](/skill/install-openclaw#phrase-quick-reference). Column 1 is an example prompt, column 2 is the underlying command, column 3 describes behavior. The agent invokes scripts under `scripts/` from the skill root (e.g. `.opencode/skills/atxswap/`) when needed; you usually **do not** need to type these in a terminal yourself.

### Wallet management

| Phrase (prompt) | Command | Description |
|---|---|---|
| "Create a new wallet for me" | `wallet.js create [name] --password <pwd>` | Create a new wallet |
| "List all my wallets" | `wallet.js list` | List all wallets and balances |
| "Export the keystore for 0x… so I can back it up" | `wallet.js export <address> [--out <file>]` | Export the wallet's **encrypted keystore JSON** (the raw private key is never exposed) |

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

- The **commands** in the second column are script entry points inside the skill; the agent invokes them when needed. You typically do not run these in your terminal yourself.

- The **description** text summarizes the behavior; like the example phrases, it is for your understanding and does not constrain how you must speak.

- Importing an existing private key is **not supported** — neither through natural-language prompts nor as a CLI subcommand. The skill only **creates** a fresh wallet for this skill instance. If you need to use an existing private key, manage it with your preferred wallet tooling instead.

:::

## Security

- The agent will never display your private keys or passwords in chat
- Before any transaction, the agent shows a quote/balance preview and waits for your confirmation
- Large trades require you to explicitly say "confirm" or "execute"
- Private keys are stored encrypted in local keystore files
- Passwords are saved in the configured `SecretStore` (Keychain, Secret Service, or file backend without a desktop session; see the SDK)
- For backups the skill can only emit the **encrypted keystore JSON** (e.g. `wallet.js export <address> --out wallet.json`); raw private keys are never produced by the skill or the underlying SDK

## See also

- [Install ATX Skill on OpenClaw](/skill/install-openclaw) — install from the ClawHub registry with `openclaw` / `clawhub` CLI
- [Install the ATX Skill in Claude Code](/skill/install-agent) — place under `.claude/skills/` for Claude Code
- OpenCode upstream: [Agent Skills](https://opencode.ai/docs/skills)
