# 在 Claude Code 中安装 ATX 技能

本页说明如何在本机用 **Claude Code** 配合 ATX 技能（`atxswap`）操作 BSC 链上资产：创建钱包、查询价格、交易代币、管理流动性、转账等——用自然语言即可，无需自己写业务代码。技能使用同一套 [Agent Skills](https://github.com/anthropics/skills) 规范下的 `SKILL.md`；通过 **OpenClaw** 等其它方式安装时，可参见 [在 OpenClaw 中安装 ATX 技能](/zh/skill/install-openclaw)。

- **SDK (npm)**: [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)
- **GitHub**: [agentswapx/skills](https://github.com/agentswapx/skills/tree/main/atxswap)

## 前置要求

本机已安装：

- **Node.js 18+**（[下载](https://nodejs.org)）
- **npm**（随 Node.js 安装）
- **Git**（[下载](https://git-scm.com)）

检查版本：

```bash
node -v && npm -v && git --version
```

## 拉取技能并安装依赖

在你要给 Claude Code 使用的工作区中执行（可将仓库放在任意目录，只要后续用 Claude Code 打开**包含** `atxswap` 的那一层为工作区或子路径即可）：

```bash
git clone https://github.com/agentswapx/skills.git
```

```bash
cd skills/atxswap && npm install
```

`npm install` 会拉取 ATX 所需 SDK，无需单独编译。若你已有自己的项目目录，也可以把 `skills` 作为子目录放进该项目再执行 `cd …/atxswap && npm install`。

### 自定义 RPC（可选）

默认会按内置的 BSC 公共 RPC 回退。若你有专用节点，可设置环境变量（支持逗号分隔、从左到右优先）：

```bash
export BSC_RPC_URL="https://your-rpc.example.com,https://bsc-rpc.publicnode.com"
```

## 在 Claude Code 里使用

1. 用 **Claude Code** 打开包含本技能的工作区，例如你克隆的 `skills` 仓库根目录，或已包含 `atxswap` 文件夹的上层项目根目录。  
2. 技能根目录为 `atxswap/`，主入口是其中的 **`SKILL.md`**。请保证该目录在你当前工作区内，且已完成上述 `npm install`。  
3. 在对话中直接用自然语言描述要执行的操作；Claude Code 会按 `SKILL.md` 中约定的能力与安全规则调用 `scripts/` 下脚本。  

不必在终端里手敲 `wallet.js`、`query.js` 等，除非你自行调试；日常由对话驱动即可。

## 试一试

安装完成后，可在 Claude Code 中尝试例如：

### 查看价格

> "帮我查一下 ATX 当前价格"

### 创建钱包

> "帮我创建一个新钱包"

Claude 会引导你设置密码；密码可保存在系统安全存储，后续在授权范围内可复用。

### 买入代币

> "用 10 USDT 买入 ATX"

会先出报价/预览，你确认后再执行链上交易。

### 查看余额

> "查看我的钱包余额"

### 转账

> "把 50 ATX 转给 0xABC...123"

涉及动账的操作，一般会先展示预览，待你明确确认后再执行。

## 口令速查

下表第一列为你可以对 **Claude Code** 说的例句（口令），第二列对应技能在底层会调用的命令，第三列**说明**各命令的用途。在 Claude Code 中一般用自然语言即可，不必手动执行命令。

### 钱包管理

| 口令 | 命令 | 说明 |
|---|---|---|
| 「帮我创建一个新钱包」 | `wallet.js create [name] --password <pwd>` | 创建新钱包 |
| 「列出我所有的钱包」 | `wallet.js list` | 列出所有钱包及余额 |

### 查询

| 口令 | 命令 | 说明 |
|---|---|---|
| 「查一下 ATX 现在多少钱」 | `query.js price` | 查询 ATX/USDT 价格 |
| 「这个地址 0x… 的余额多少」 | `query.js balance <address>` | 查询（指定地址）余额 |
| 「用 10 USDT 买入能换多少 ATX」 | `query.js quote <buy\|sell> <amount>` | 买卖报价预览 |
| 「我有哪些流动性仓位」 | `query.js positions <address>` | 查看 LP 仓位 |

### 交换

| 口令 | 命令 | 说明 |
|---|---|---|
| 「用 10 USDT 买 ATX」 | `swap.js buy <usdtAmount>` | 用 USDT 买入 ATX |
| 「卖 5 ATX 换 USDT」 | `swap.js sell <atxAmount>` | 卖出 ATX 换 USDT |

### 流动性

| 口令 | 命令 | 说明 |
|---|---|---|
| 「加 100 ATX 和 10 USDT 的流动性」 | `liquidity.js add <atx> <usdt>` | 添加流动性 |
| 「把 123 号仓位撤掉 50%」 | `liquidity.js remove <tokenId> <percent>` | 按百分比移除流动性 |
| 「收取 123 号仓位的费」 | `liquidity.js collect <tokenId>` | 收取 LP 累计手续费 |

### 转账

| 口令 | 命令 | 说明 |
|---|---|---|
| 「转 0.01 BNB 给 0x…」 | `transfer.js bnb <to> <amount>` | 发送 BNB |
| 「转 50 ATX 给 0x…」 | `transfer.js atx <to> <amount>` | 发送 ATX |
| 「转 100 USDT 给 0x…」 | `transfer.js usdt <to> <amount>` | 发送 USDT |

::: info 备注
- 上表**口令**仅为示例，用相近说法、换种说法通常也可以，以你的意图为主，不必照抄原句。

- 上表**命令**是技能包内的脚本文本，由 **Claude Code** 在需要时调起；你一般不必自己在终端里执行。

- 上表**说明**概括该行为或底层命令的大致作用，与口令一样可做理解用，不限制你必须怎么说。

- 不支持在对话中通过口令导入私钥；如确需导入，请自行在技能目录下以终端命令等方式操作（例如 `wallet.js import`），并注意安全。

:::

## 安全说明

- 对话中不会主动展示你的完整私钥或密码  
- 交易前会展示报价、余额等预览，你确认后再执行  
- 大额或敏感写操作会要求你明确「确认」或「执行」类指令  
- 私钥以加密形式存于本机 keystore；密码可交给系统安全存储（如 macOS Keychain / Linux Secret Service）  
