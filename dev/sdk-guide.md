# ATX SDK Developer Guide

This page is designed for developers who are touching ATX for the first time. It follows a "get it working first, expand later" path so you can finish your first query, first wallet load, and first real on-chain action without digging through the whole SDK surface area.

- **GitHub**: [agentswapx/atxswap-sdk](https://github.com/agentswapx/atxswap-sdk)
- **Best for**: Node.js scripts, backend jobs, automation agents, strategy tooling
- **What you can do**: Query price and balances, manage keystore wallets, swap ATX, transfer tokens, and manage PancakeSwap V3 liquidity

::: tip
If you only want ready-made scripts instead of writing TypeScript, check the [Install ATX Skill](/skill/install-agent) guide.
:::

## Quick Start

Do not start with the full API list. Start by running one minimal read-only example end to end.

```bash
npm install atxswap-sdk
```

```typescript
import { AtxClient } from "atxswap-sdk";

async function main() {
  const client = new AtxClient({
    rpcUrl: process.env.BSC_RPC_URL,
  });

  await client.ready();

  const price = await client.query.getPrice();
  console.log("1 ATX =", price.usdtPerAtx, "USDT");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

You only need to remember three things at this stage:

1. Create `AtxClient`
2. Always call `await client.ready()` once
3. Start with read-only queries so you can verify RPC and runtime first

If this example prints a price successfully, your environment is ready for balance checks and write actions.

## Before You Start

Confirm these prerequisites before you move on:

| Item | Notes |
|---|---|
| Runtime | Node.js 18+ |
| Network | BSC mainnet, chainId `56` |
| Gas | All write actions need BNB for gas |
| RPC | When unset, the SDK falls back to a built-in list of 8 BSC public RPC endpoints. For production, prefer setting `BSC_RPC_URL` to your own primary endpoint, optionally as a comma-separated list (e.g. `"https://primary,https://backup"`) which is parsed as `rpcUrls` |
| Default fee tier | `2500`, which is `0.25%` |
| Default slippage | `300` bps, which is `3%` |

Three beginner mistakes happen again and again:

- Read-only queries do not need a wallet, but swaps, transfers, and liquidity actions do
- `client.ready()` is not just optional setup, it prepares SecretStore and should be part of every script template
- Amounts are `bigint` values, so do not pass raw strings into swap or transfer methods

Use amount helpers like this:

| Helper | Best for |
|---|---|
| `parseEther("100")` | 18-decimal assets such as ATX and BNB |
| `parseUnits("10", 18)` | Explicit decimals or arbitrary ERC20 assets |

## Read Queries First

Before you touch a write path, run these three calls first: price, balance, and quote.

```typescript
import { AtxClient, parseUnits } from "atxswap-sdk";

async function main() {
  const client = new AtxClient({
    rpcUrl: process.env.BSC_RPC_URL,
  });

  await client.ready();

  const price = await client.query.getPrice();
  console.log("price", price.usdtPerAtx, price.atxPerUsdt);

  const balance = await client.query.getBalance("0xYourAddress");
  console.log("balance", balance);

  const buyAmount = parseUnits("10", 18);
  const quote = await client.query.getQuote("buy", buyAmount);
  console.log("quote", quote);
}

main().catch(console.error);
```

Runtime assumptions:

- Balance queries need a real wallet address
- In `getQuote("buy", amount)`, `amount` is the USDT amount you plan to spend
- In `getQuote("sell", amount)`, `amount` is the ATX amount you plan to sell

The most important fields to inspect are:

- `price.usdtPerAtx`: how much 1 ATX is worth in USDT
- `balance`: current BNB, ATX, and USDT balances for the address
- `quote.amountOut`: expected output amount
- `quote.priceImpact`: estimated market impact of the trade

## Wallets: Create Once, Auto-Unlock Later

The SDK uses keystore-encrypted wallets. Do not hardcode raw private keys into your project.

```typescript
import { AtxClient } from "atxswap-sdk";

async function main() {
  const client = new AtxClient();
  await client.ready();

  const created = await client.wallet.create("your-password", "dev-wallet");
  console.log("created", created.address);

  const wallet = await client.wallet.load(created.address);
  console.log("loaded", wallet.address);
}

main().catch(console.error);
```

This is the behavior to understand:

- `create()` saves the password to secure storage by default
- `load(address)` can auto-unlock later without passing the password again

These default file locations are also worth knowing:

| File | Default path |
|---|---|
| keystore | `./keystore` or your custom `keystorePath` |
| `master.key` | `~/.config/atxswap/master.key` |
| `secrets.json` | `~/.config/atxswap/secrets.json` |

## First Swap: Quote First, Execute Second

The best first write action for most beginners is a full buy flow: load wallet, inspect balance, fetch a quote, then execute the swap.

```typescript
import { AtxClient, parseUnits } from "atxswap-sdk";

async function main() {
  const client = new AtxClient({
    rpcUrl: process.env.BSC_RPC_URL,
  });

  await client.ready();

  const wallet = await client.wallet.load("0xYourAddress");
  const usdtAmount = parseUnits("10", 18);

  const balance = await client.query.getBalance(wallet.address);
  console.log("balance", balance);

  const quote = await client.query.getQuote("buy", usdtAmount);
  console.log("quote", quote);

  const result = await client.swap.buy(wallet, usdtAmount, 100);
  console.log("tx", result.txHash);
}

main().catch(console.error);
```

Requirements before this runs:

- The wallet address must already exist in your keystore
- The wallet needs enough USDT and BNB
- `100` means `1%` slippage, or `100` bps

What the SDK does for you in this flow:

1. Calls the Quoter for an expected output amount
2. Computes `amountOutMinimum` from slippage
3. Checks allowance and approves if needed
4. Calls the PancakeSwap V3 Router to execute the swap

To sell instead of buy, switch both `getQuote("buy", ...)` and `swap.buy(...)` to `sell`.

## Transfer Example

Transfers are usually the next write workflow people need, especially for funding, distribution, or test preparation.

```typescript
import { AtxClient, parseEther } from "atxswap-sdk";

async function main() {
  const client = new AtxClient();
  await client.ready();

  const wallet = await client.wallet.load("0xYourAddress");

  const result = await client.transfer.sendAtx(
    wallet,
    "0xRecipient",
    parseEther("100"),
  );

  console.log("tx", result.txHash);
}

main().catch(console.error);
```

Use `sendBnb()` for BNB transfers, and `sendToken()` for arbitrary ERC20 transfers.

## Liquidity Example

For ATX/USDT liquidity, the easiest starting point is a full-range position.

```typescript
import { AtxClient, parseEther, parseUnits } from "atxswap-sdk";

async function main() {
  const client = new AtxClient();
  await client.ready();

  const wallet = await client.wallet.load("0xYourAddress");

  const result = await client.liquidity.addLiquidity(
    wallet,
    parseEther("1000"),
    parseUnits("50", 18),
    { fullRange: true, slippageBps: 100 },
  );

  console.log("tx", result.txHash);
}

main().catch(console.error);
```

Why this is a good beginner example:

- `fullRange: true` means you do not need to understand ticks yet
- `slippageBps` works the same way as swap slippage
- For the first run, `txHash` is the only result field you need to care about

## Troubleshooting

These issues cover most first-time integration failures:

| Problem | Common cause | What to do |
|---|---|---|
| Errors after `client.ready()` | Unclear script flow or missing runtime dependencies | Initialize the client once per entry script and run on Node 18+ |
| Quote fails or Quoter reverts | Unstable RPC, wrong network, simulation failure | Confirm BSC mainnet first, then switch to a stable RPC |
| Swap transaction fails | Not enough BNB or insufficient asset balance | Run `getBalance()` first and confirm BNB, ATX, and USDT |
| Wallet cannot be loaded | Address not in keystore or password not saved | Check your wallet list, then pass the password explicitly or save it again |
| Wrong amount behavior | Mixed up `parseEther` and `parseUnits` | Use `parseEther` for 18-decimal assets, otherwise use `parseUnits(value, decimals)` |

Security rules to keep in mind:

- Never hardcode private keys into the repo
- Never print wallet passwords into logs
- Do read-only checks before real write operations

## Reference

Once your first example is working, these are usually the next APIs worth learning:

| Module | Methods you will likely use first |
|---|---|
| `wallet` | `create()`, `list()`, `load()`, `hasSavedPassword()` |
| `query` | `getPrice()`, `getBalance()`, `getQuote()`, `getPositions()` |
| `swap` | `buy()`, `sell()`, `preview()` |
| `liquidity` | `addLiquidity()`, `removeLiquidity()`, `collectFees()` |
| `transfer` | `sendAtx()`, `sendUsdt()`, `sendBnb()`, `sendToken()` |

You can keep going with these resources:

- [SDK GitHub repository](https://github.com/agentswapx/atxswap-sdk)
- [Install ATX Skill](/skill/install-agent) for script-first workflows

If this is your first integration, the recommended order is:

1. Run `getPrice()`
2. Run `getBalance()`
3. Create or load a wallet
4. Run `getQuote()`, then make your first `buy()` or `sell()`
5. Move on to transfers and liquidity after that
