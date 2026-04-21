# 给你的 AI 安装 ATX 技能

安装 ATX 技能后，你可以用自然语言让 Claude、Cursor、Codex 等 AI 工具直接操作 BSC 链上资产：查价格、交易代币、管理钱包、提供流动性、转账——不需要你写任何代码。

- **GitHub**: [agentswapx/skills](https://github.com/agentswapx/skills)
- **支持的 AI 工具**: Claude Desktop、Cursor IDE、Codex CLI，以及任何兼容 Agent Skills 规范的工具

## 前置要求

你的电脑上需要安装以下软件：

- **Node.js 18+**（[下载](https://nodejs.org)）
- **npm**（随 Node.js 自动安装）
- **Git**（[下载](https://git-scm.com)）

检查是否已安装：

```bash
node -v && npm -v && git --version
```

## 30 秒安装

只需两条命令：

```bash
git clone https://github.com/agentswapx/skills.git
```

```bash
cd skills/atxswap && npm install
```

安装完成。`npm install` 会自动拉取 ATX SDK，无需手动编译。

### 设置网络节点（可选）

默认使用公共 RPC 节点，无需额外配置。如果你有专用节点，可以设置：

```bash
export BSC_RPC_URL="https://your-rpc-node.com"
```

## 告诉你的 AI 工具

安装好技能后，你需要告诉 AI 工具去哪里找到它。

### Claude Desktop

在 Claude Desktop 的设置中添加技能目录路径：

```text
skills/atxswap/SKILL.md
```

Claude 会自动读取 SKILL.md 并学会所有 ATX 操作命令。

### Cursor IDE

在 Cursor 中，将技能目录添加到项目的 `.cursor/skills/` 目录，或在设置中指定路径：

```text
skills/atxswap/SKILL.md
```

### Codex CLI

Codex 会自动扫描项目中的 SKILL.md 文件。确保 skills 目录在你的工作区内即可。

## 试一试

安装完成后，直接用自然语言对 AI 说：

### 查看价格

> "帮我查一下 ATX 当前价格"

AI 会执行 `query.js price` 并返回 ATX/USDT 实时价格。

### 创建钱包

> "帮我创建一个新钱包"

AI 会要求你设置密码，然后创建一个加密钱包。密码自动保存到系统安全存储，后续操作无需再次输入。

### 买入代币

> "用 10 USDT 买入 ATX"

AI 会先查询报价，展示你将收到多少 ATX，等你确认后再执行交易。

### 查看余额

> "查看我的钱包余额"

### 转账

> "把 50 ATX 转给 0xABC...123"

所有涉及资产变动的操作，AI 都会先展示预览，等你说"确认"后才执行。

## 命令速查

以下是 AI 会使用的底层命令，你不需要手动执行它们——了解即可。

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

- AI 永远不会在对话中显示你的私钥或密码
- 所有交易前，AI 会先展示报价/余额预览，等你确认后才执行
- 大额交易需要你明确说"确认"或"执行"
- 私钥以加密形式存储在本地 keystore 文件中
- 密码保存在系统安全存储中（macOS Keychain / Linux Secret Service）
