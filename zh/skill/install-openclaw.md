# 在 ClawHub / OpenClaw 中安装 ATX 技能

ATX 技能（`atxswap`）已经发布到 ClawHub 注册表，独立的 `clawhub` CLI 和 OpenClaw CLI 共享同一个注册表，任选其一即可安装。装好后，你的智能体就能自动执行链上操作：查询价格、交易代币、管理钱包、提供流动性、转账。

- **ClawHub**: [atxswap @ clawhub.ai](https://clawhub.ai/skills/atxswap)
- **SDK (npm)**: [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)
- **GitHub**: [agentswapx/skills](https://github.com/agentswapx/skills/tree/main/atxswap)

## 安装方式

### 方式一：ClawHub CLI

```bash
npm install -g clawhub
clawhub install atxswap --force
```

::: tip
`--force` 是必需的：ClawHub 的 VirusTotal 扫描器会把任何涉及钱包/keystore 的 SDK 默认标为 "suspicious"。加密工具天生会触发这一规则，不是真正的告警。
:::

### 方式二：OpenClaw CLI

```bash
openclaw skills install atxswap
```

OpenClaw 与 ClawHub 共享注册表，安装目录是 `~/.openclaw/workspace/skills/atxswap/`。

### 方式三：手动安装

```bash
git clone https://github.com/agentswapx/skills.git
cd skills/atxswap && npm install
```

不论用哪种方式安装，进入 skill 目录跑 `npm install` 都会从 npm 拉 [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)，大约 15 秒完成，不再需要 git clone 或本地构建。

## ClawHub 发布信息

| 字段 | 值 |
|---|---|
| 技能 slug | `atxswap` |
| 最新版本 | `0.0.2` |
| 作者 | `@agentswapx` |
| 协议 | `MIT-0` |
| SDK 依赖 | [`atxswap-sdk@^0.0.1`](https://www.npmjs.com/package/atxswap-sdk) |
| 运行要求 | Node.js 18+、npm，可选环境变量 `BSC_RPC_URL`（支持逗号分隔多地址；未设置时使用内置的 8 个 BSC RPC 端点 — Infura + 7 个 BNB Chain 公共节点 — 自动回退） |
| 支持系统 | Linux、macOS |

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

## 命令速查

以下是智能体使用的底层命令，你不需要手动执行。

### 钱包管理

| 命令 | 说明 |
|---|---|
| `wallet.js create [name] --password <pwd>` | 创建新钱包 |
| `wallet.js list` | 列出所有钱包及余额 |
| `wallet.js import <key> [name] --password <pwd>` | 导入已有私钥 |

### 查询

| 命令 | 说明 |
|---|---|
| `query.js price` | 查询 ATX/USDT 价格 |
| `query.js balance <address>` | 查询余额 |
| `query.js quote <buy\|sell> <amount>` | 交换报价预览 |
| `query.js positions <address>` | 查看 LP 仓位 |

### 交换

| 命令 | 说明 |
|---|---|
| `swap.js buy <usdtAmount>` | 用 USDT 买入 ATX |
| `swap.js sell <atxAmount>` | 卖出 ATX 换 USDT |

### 流动性

| 命令 | 说明 |
|---|---|
| `liquidity.js add <atx> <usdt>` | 添加流动性 |
| `liquidity.js remove <tokenId> <percent>` | 移除流动性 |
| `liquidity.js collect <tokenId>` | 收取手续费 |

### 转账

| 命令 | 说明 |
|---|---|
| `transfer.js bnb <to> <amount>` | 发送 BNB |
| `transfer.js atx <to> <amount>` | 发送 ATX |
| `transfer.js usdt <to> <amount>` | 发送 USDT |

## 安全说明

- 智能体永远不会在对话中显示你的私钥或密码
- 所有交易前，智能体会先展示报价/余额预览，等你确认后才执行
- 大额交易需要你明确说"确认"或"执行"
- 私钥以加密形式存储在本地 keystore 文件中
- 密码保存在系统安全存储中（macOS Keychain / Linux Secret Service）
