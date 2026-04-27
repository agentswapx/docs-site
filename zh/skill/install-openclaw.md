# 在 OpenClaw 中安装 ATX 技能

ATX 技能（`atxswap`）已经发布到 ClawHub 技能库。**最推荐**用自然语言直接让 OpenClaw 帮你安装；也可以选用 **OpenClaw CLI** 或 **ClawHub CLI** 自行安装。安装成功后，你的智能体就能自动执行链上操作：创建钱包、查询价格、交易代币、管理钱包、提供流动性、转账。

- **SDK (npm)**: [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)
- **GitHub**: [agentswapx/skills](https://github.com/agentswapx/skills/tree/main/atxswap)
- **ClawHub**: [atxswap @ clawhub.ai](https://clawhub.ai/skills/atxswap)

若使用 **[OpenCode](https://opencode.ai)**（从本机路径加载 `SKILL.md`，说明见 [Agent Skills](https://opencode.ai/docs/skills)），请见 [在 OpenCode 中安装 ATX 技能](/zh/skill/install-opencode)。

## 安装方式

### 推荐：自然语言（优先）

在与 OpenClaw 的对话里，直接用中文说明要安装 **ATX 技能**（技能包名 **`atxswap`**，发布在 ClawHub）。例如：

> 「安装`atxswap`」  
> 「我想用 ATXSwap 做链上交易，请安装 atxswap 技能」  
> 「安装 ClawHub 上的 atxswap / ATX 交易技能」

智能体会按你的环境执行或引导安装（通常等价于使用与 ClawHub 相同的技能源）。若对话中无法完成安装，再改用下方命令行方式。

### 方式一：OpenClaw CLI

```bash
openclaw skills install atxswap
```

OpenClaw 与 ClawHub 共享注册表，安装目录是 `~/.openclaw/workspace/skills/atxswap/`。

### 方式二：ClawHub CLI

```bash
npm install -g clawhub
clawhub install atxswap --force
```

::: tip
`--force` 是必需的：ClawHub 的 VirusTotal 扫描器会把任何涉及钱包/keystore 的 SDK 默认标为 "suspicious"。加密工具天生会触发这一规则，不是真正的告警。
:::

### 方式三：手动安装

```bash
git clone https://github.com/agentswapx/skills.git
cd skills/atxswap && npm install
```

不论用哪种方式安装，进入 skill 目录跑 `npm install` 都会从 npm 拉 [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)。

查看已发布技能的元数据：

```bash
clawhub inspect atxswap
# 或
openclaw skills info atxswap
```

## 试一试

安装完成后，直接用自然语言对你的 OpenClaw 智能体说：

### 查看价格

> "帮我查一下 ATX 当前价格"

### 创建钱包

> "帮我创建一个新钱包"

智能体会要求你设置密码，然后创建加密钱包。密码自动保存到系统安全存储。

### 买入代币

> "用 10 USDT 买入 ATX"

智能体会先查询报价，展示预览，等你确认后再执行。

### 查看余额

> "查看我的钱包余额"

### 转账

> "把 50 ATX 转给 0xABC...123"

## 口令速查

下表第一列为你可以对智能体说的例句（口令），第二列为智能体在底层会调用的命令，第三列**说明**各命令的用途。你一般只需用自然语言提需求，不必手动执行命令。

### 钱包管理

| 口令 | 命令 | 说明 |
|---|---|---|
| 「帮我创建一个新钱包」 | `wallet.js create [name] --password <pwd>` | 创建新钱包 |
| 「列出我所有的钱包」 | `wallet.js list` | 列出所有钱包及余额 |
| 「把钱包的 keystore 导出来备份」 | `wallet.js export <address> [--out <file>]` | 导出钱包对应的**加密 keystore JSON**（不会暴露原始私钥） |

### 查询

| 口令 | 命令 | 说明 |
|---|---|---|
| 「删除钱包 0x...」 | `wallet.js delete <address> --backup-confirmed yes --force-phrase "force delete wallet"` | 只有在确认已备份 keystore 且用户发送精确短语后才允许删除 |
| 「查一下 ATX 现在多少钱」 | `query.js price` | 查询 ATX/USDT 价格 |
| 「这个地址 0x… 的余额多少」 | `query.js balance <address>` | 查询（指定地址）余额 |
| 「用 10 USDT 买入能换多少 ATX」 | `query.js quote <buy\|sell> <amount>` | 买卖报价预览 |
| 「我有哪些流动性仓位」 | `query.js positions <address>` | 查看 LP 仓位 |
| 「先看一下 123 号仓位能收多少手续费」 | `query.js positions <address> <tokenId>` | 查看单个 LP 仓位及收割预览字段 |

### 交换

| 口令 | 命令 | 说明 |
|---|---|---|
| 「用 10 USDT 买 ATX」 | `swap.js buy <usdtAmount>` | 用 USDT 买入 ATX |
| 「卖 5 ATX 换 USDT」 | `swap.js sell <atxAmount>` | 卖出 ATX 换 USDT |

### 流动性

| 口令 | 命令 | 说明 |
|---|---|---|
| 「加 100 ATX 和 10 USDT 的流动性」 | `liquidity.js add <atx> <usdt>` | 添加流动性 |
| 「先预估一下 0.1 USDT、20% 区间的流动性配比」 | `liquidity.js quote-add usdt 0.1 --range-percent 20` | 预估自定义区间所需的 ATX/USDT 数量 |
| 「按 0.1 USDT、20% 区间添加流动性」 | `liquidity.js add --base-token usdt --amount 0.1 --range-percent 20` | 自动补齐另一边代币并添加自定义区间流动性 |
| 「把 123 号仓位撤掉 50%」 | `liquidity.js remove <tokenId> <percent>` | 按百分比移除流动性 |
| 「收取 123 号仓位的费」 | `liquidity.js collect <tokenId>` | 收取 LP 累计手续费 |

推荐的手续费收割流程：

1. 先执行 `query.js positions <address> <tokenId>`
2. 查看 `collectableAtx` / `collectableUsdt`
3. 确认值得收割后，再执行 `liquidity.js collect <tokenId>`

推荐的删除钱包流程：

1. 先执行 `wallet.js export <address> --out <file>`，并告诉用户 keystore 保存位置
2. 要求用户明确确认备份完成
3. 再要求用户明确发送 `force delete wallet`
4. 仅在这两步都完成后，才执行 `wallet.js delete <address> --backup-confirmed yes --force-phrase "force delete wallet"`

### 转账

| 口令 | 命令 | 说明 |
|---|---|---|
| 「转 0.01 BNB 给 0x…」 | `transfer.js bnb <to> <amount>` | 发送 BNB |
| 「转 50 ATX 给 0x…」 | `transfer.js atx <to> <amount>` | 发送 ATX |
| 「转 100 USDT 给 0x…」 | `transfer.js usdt <to> <amount>` | 发送 USDT |

::: info 备注
- 上表**口令**仅为示例，用相近说法、换种说法通常也可以，以你的意图为主，不必照抄原句。

- 上表**命令**是技能包内的脚本文本，由智能体在需要时调起；你一般不必自己在终端里执行。

- 上表**说明**概括该行为或底层命令的大致作用，与口令一样可做理解用，不限制你必须怎么说。

- 本技能**不支持导入已有私钥**——既不能通过对话口令导入，命令行也未提供该入口。智能体只会**新建**一个属于该技能实例的钱包；如需使用现有私钥，请使用你常用的钱包工具自行管理。

- 自定义区间流动性推荐流程是：先用 `liquidity.js quote-add` 预估，向用户展示 `estimatedAmounts`，确认后再执行 `liquidity.js add`。不要直接根据对话内容猜另一边代币数量。

- 收手续费时，应优先看 `query.js positions` 返回的 `collectable0/1` 或 `collectableAtx/collectableUsdt`。不要只看原始 `tokensOwed0/1`，因为这些字段仍为 `0` 时，仓位也可能已经可以收割。

- 删除钱包是双重确认操作：用户既要确认加密 keystore 已经备份完成，也必须明确发送 `force delete wallet`，两者缺一不可。

:::

## 安全说明

- 智能体永远不会在对话中显示你的私钥或密码
- 所有交易前，智能体会先展示报价/余额预览，等你确认后才执行
- 大额交易需要你明确说"确认"或"执行"
- 私钥以加密形式存储在本地 keystore 文件中
- 密码保存在系统安全存储中（macOS Keychain / Linux Secret Service）
- 备份钱包时，技能只能产出**加密后的 keystore JSON**（例如 `wallet.js export <address> --out wallet.json`），技能与底层 SDK 都不会输出原始私钥
