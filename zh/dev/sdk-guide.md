# ATX SDK 开发者指南

面向第一次接触 ATX 的开发者，这一页按"先跑通，再扩展"的顺序组织，帮助你用最短路径完成第一次查询、第一次钱包加载和第一笔真实链上操作。

- **GitHub**: [agentswapx/atxswap-sdk](https://github.com/agentswapx/atxswap-sdk)
- **适用场景**: Node.js 脚本、后端任务、自动化 agent、策略工具
- **覆盖能力**: 查询价格和余额、管理 keystore 钱包、交换 ATX、转账、管理 PancakeSwap V3 流动性

::: tip
如果你只是想直接运行现成脚本，而不是写 TypeScript 代码，可以参考 [安装 ATX 技能](/zh/skill/install-agent) 指南。
:::

## 5 分钟快速开始

先不要急着看全部 API，先把一个最小可运行的只读示例跑通。

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

你只需要关心三件事：

1. 先创建 `AtxClient`
2. 统一调用一次 `await client.ready()`
3. 先跑只读查询，确认 RPC 和环境是通的

如果这段代码能成功输出价格，说明你的运行环境已经准备好，可以继续做余额查询和写链操作。

## 开始前准备

在继续之前，先确认这些前置条件：

| 项目 | 说明 |
|---|---|
| 运行时 | Node.js 18+ |
| 网络 | BSC 主网，chainId `56` |
| Gas | 所有写操作都需要 BNB 支付 gas |
| RPC | 未配置时 SDK 会回落到内置的 6 个 BSC 公共 RPC 端点。生产环境建议显式设置 `BSC_RPC_URL`，可填单个地址，也可用逗号分隔多个地址（例如 `"https://primary,https://backup"`），技能层会解析为 `rpcUrls` 传给 SDK |
| 默认手续费档位 | `2500`，即 `0.25%` |
| 默认滑点 | `100` bps，即 `1%` |

几个新手最容易忽略的点：

- 只读查询不需要钱包，但交换、转账、流动性都需要已加载的钱包
- `client.ready()` 不只是"可选初始化"，它会完成 SecretStore 准备，建议所有脚本统一调用
- 金额处理统一用 `bigint`，不要直接传字符串给交换或转账方法

金额单位可以这样理解：

| 工具 | 适合场景 |
|---|---|
| `parseEther("100")` | 18 位精度资产，例如 ATX、BNB |
| `parseUnits("10", 18)` | 想显式写出精度，或处理任意 ERC20 |

## 先把只读查询跑通

真正开始写链之前，推荐你先把这三个查询都跑一遍：价格、余额、报价。

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

运行前提：

- 余额查询需要一个真实地址
- `getQuote("buy", amount)` 里的 `amount` 表示你准备支付的 USDT 数量
- `getQuote("sell", amount)` 里的 `amount` 表示你准备卖出的 ATX 数量

返回结果里最值得先看的是：

- `price.usdtPerAtx`: 当前 1 ATX 值多少 USDT
- `balance`: 当前地址的 BNB、ATX、USDT 余额
- `quote.amountOut`: 预期能拿到多少目标资产
- `quote.priceImpact`: 这次交易对价格的影响

### 收割前先预览手续费

如果你要判断某个 LP NFT 是否值得收割，不要只看 `positions()` 返回的
`tokensOwed0/1`。应该优先使用 SDK 提供的手续费预览能力：

```typescript
import { AtxClient } from "atxswap-sdk";

async function main() {
  const client = new AtxClient();
  await client.ready();

  const positions = await client.query.getPositions("0xYourAddress", {
    includeCollectableFees: true,
  });

  for (const position of positions) {
    console.log("tokenId", position.tokenId.toString());
    console.log("collectable0", (position.collectable0 ?? 0n).toString());
    console.log("collectable1", (position.collectable1 ?? 0n).toString());
  }

  const preview = await client.query.previewCollectFees("0xYourAddress", 6770485n);
  console.log("preview", preview.amount0.toString(), preview.amount1.toString());
}

main().catch(console.error);
```

可以这样理解：

1. `tokensOwed0/1` 是 `positions()` 的原始字段
2. `collectable0/1` 是模拟 `collect()` 后得到的更可靠预览值
3. 如果你已经知道 `tokenId`，直接用 `previewCollectFees()` 最方便

## 钱包管理：先创建，再自动解锁

SDK 使用 keystore 加密钱包，不推荐把私钥直接写进配置或代码。

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

这段代码体现了两个关键行为：

- `create()` 默认会把密码保存到安全存储
- 后续 `load(address)` 可以在不显式传密码的情况下自动解锁

默认文件位置也建议你知道：

| 文件 | 默认路径 |
|---|---|
| keystore | `./keystore` 或你自定义的 `keystorePath` |
| `master.key` | `~/.config/atxswap/master.key` |
| `secrets.json` | `~/.config/atxswap/secrets.json` |

## 第一笔交换：先报价，再下单

最适合新手的第一笔写操作是一个完整的买入流程：加载钱包、查余额、查报价、再执行交换。

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

运行前提：

- 钱包地址必须已经存在于 keystore 中
- 钱包里需要足够的 USDT 和 BNB
- `100` 表示 `1%` 滑点，也就是 `100` bps

这个流程里，SDK 会自动帮你做这些事：

1. 调用 Quoter 获取预期输出量
2. 根据滑点算出 `amountOutMinimum`
3. 检查 allowance，必要时自动发起 approve
4. 调用 PancakeSwap V3 Router 完成交换

如果你要卖出 ATX，把 `client.query.getQuote("buy", ...)` 和 `client.swap.buy(...)` 换成 `sell` 即可。

## 转账示例

转账通常是你第二个会用到的写链场景，尤其适合做资金分发、归集或测试环境准备。

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

如果你要发 BNB，用 `sendBnb()`；如果要发任意 ERC20，用 `sendToken()`。

## 流动性示例

在 ATX/USDT 池里加流动性时，最简单的起点是使用全范围仓位。

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

这段代码适合新手的原因是：

- `fullRange: true` 不需要你先理解 tick 区间
- `slippageBps` 和交换时的滑点含义一致
- 返回值先只看 `txHash` 就够了，确认交易成功后再继续研究仓位细节

### 自定义区间预估

如果要做自定义区间，建议先预估代币配比，不要直接猜另一边数量：

```typescript
import { AtxClient, parseEther, formatUnits } from "atxswap-sdk";

async function main() {
  const client = new AtxClient();
  await client.ready();

  const quote = await client.liquidity.quoteAddLiquidity({
    baseToken: "usdt",
    amount: parseEther("0.1"),
    range: { rangePercent: 20 },
  });

  console.log("tickLower", quote.range.tickLower);
  console.log("tickUpper", quote.range.tickUpper);
  console.log("ATX needed", formatUnits(quote.desiredAmounts.atx, 18));
  console.log("USDT needed", formatUnits(quote.desiredAmounts.usdt, 18));
}

main().catch(console.error);
```

自定义区间流动性推荐顺序：

1. 先执行 `quoteAddLiquidity()`
2. 向用户或操作员展示 `desiredAmounts`
3. 确认钱包里 BNB、ATX、USDT 都足够
4. 再用预估出的数量执行 `addLiquidity()`

## 常见问题与排错

下面这些问题最常见，基本覆盖了大多数第一次接入失败的情况：

| 问题 | 常见原因 | 建议处理 |
|---|---|---|
| `client.ready()` 后仍报初始化问题 | 脚本执行顺序混乱，或环境依赖不可用 | 确保每个入口只初始化一次 client，并优先使用 Node 18+ |
| 报价失败或 Quoter 回退 | RPC 不稳定、网络不对、Quoter 模拟失败 | 先确认在 BSC 主网，再切换到稳定 RPC |
| 交换发不出去 | 地址里没有足够的 BNB 或目标资产 | 先跑 `getBalance()` 看 BNB、ATX、USDT 是否充足 |
| LP 手续费看起来是 0 | 只看了 `positions()` 里的 `tokensOwed0/1` | 收割前改用 `getPositions(..., { includeCollectableFees: true })` 或 `previewCollectFees()` |
| 钱包无法加载 | 地址不在 keystore，或密码未保存 | 先 `list()`、再显式传密码或重新保存密码 |
| 数量不对 | `parseEther` / `parseUnits` 用错 | 18 位资产可直接用 `parseEther`，其他情况显式写 `parseUnits(value, decimals)` |

安全上要始终记住：

- 不要把私钥硬编码进仓库
- 不要把密码打印到日志
- 先做只读查询，再做真实写操作

## 进阶参考

如果你已经跑通了第一个例子，后面最值得继续看的接口通常是这些：

| 模块 | 你最先会用到的方法 |
|---|---|
| `wallet` | `create()`, `list()`, `load()`, `hasSavedPassword()`, `exportKeystore()`（返回加密的 keystore JSON；SDK 故意不提供导入或导出原始私钥的方法） |
| `query` | `getPrice()`, `getBalance()`, `getQuote()`, `getPositions()`, `previewCollectFees()` |
| `swap` | `buy()`, `sell()`, `preview()` |
| `liquidity` | `quoteAddLiquidity()`, `addLiquidity()`, `removeLiquidity()`, `collectFees()` |
| `transfer` | `sendAtx()`, `sendUsdt()`, `sendBnb()`, `sendToken()` |

还可以继续参考这些资料：

- [SDK GitHub 仓库](https://github.com/agentswapx/atxswap-sdk)
- [安装 ATX 技能](/zh/skill/install-agent)，适合想直接运行脚本命令的场景

如果你是第一次集成，推荐按这个顺序继续：

1. 跑通 `getPrice()`
2. 跑通 `getBalance()`
3. 创建或加载钱包
4. 先做一次 `getQuote()`，再做第一笔 `buy()` 或 `sell()`
5. 最后再尝试转账和流动性管理
