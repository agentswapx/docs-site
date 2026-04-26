# 在 Claude Code 中安装 ATX 技能

本页说明如何在本机用 **Claude Code** 配合 ATX 技能（`atxswap`）操作 BSC 链上资产：创建钱包、查询价格、交易代币、管理流动性、转账等——用自然语言即可，无需自己写业务代码。技能使用同一套 [Agent Skills](https://github.com/anthropics/skills) 规范下的 `SKILL.md`；通过 **OpenClaw** 等其它方式安装时，可参见 [在 OpenClaw 中安装 ATX 技能](/zh/skill/install-openclaw)。使用 **OpenCode** 时，将技能按官方路径放置即可，见 [在 OpenCode 中安装 ATX 技能](/zh/skill/install-opencode)。

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

## 选择安装位置

Claude Code 会从两个固定目录加载技能，按需要选其一即可：

| 类型 | 路径 | 适用场景 |
|---|---|---|
| ① 个人技能（全局） | `~/.claude/skills/atxswap/SKILL.md` | 当前用户在**任何项目**中都可以调用 |
| ② 项目技能（当前项目） | `<项目根>/.claude/skills/atxswap/SKILL.md` | 只在当前项目可用，可随项目仓库一同提交版本控制 |

::: tip 建议
项目协作场景把 `.claude/skills/` 一起提交到版本控制，技能就成了项目工具的一部分；个人场景放在 `~/.claude/skills/` 更省事。两者可以并存，Claude Code 都会识别。
:::

## 拉取技能并安装依赖

挑好上面的路径后，把 ATX 技能克隆进去并安装依赖。

**① 安装为个人技能（全局可用）**

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/agentswapx/skills.git /tmp/atxswap-skills
cp -r /tmp/atxswap-skills/atxswap ~/.claude/skills/atxswap
cd ~/.claude/skills/atxswap && npm install
```

**② 安装为项目技能（仅当前项目）**

在你的项目根目录下执行：

```bash
mkdir -p .claude/skills
git clone https://github.com/agentswapx/skills.git /tmp/atxswap-skills
cp -r /tmp/atxswap-skills/atxswap .claude/skills/atxswap
cd .claude/skills/atxswap && npm install
```

无论选哪种，`npm install` 都会从 npm 拉取 [`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)，无需单独编译。装好后目录结构应该是：

```
.claude/skills/atxswap/        # 或 ~/.claude/skills/atxswap/
├── SKILL.md
├── scripts/
├── package.json
└── node_modules/
```

::: info 提示
- 上面用 `git clone` + `cp` 是为了只拷贝你需要的 `atxswap` 子目录。如果你愿意整库放在本机其他位置，也可以用软链：`ln -s /path/to/skills/atxswap ~/.claude/skills/atxswap`。
- 升级时进入对应的 `atxswap/` 目录执行 `git pull && npm install`（软链方式只需在源仓库 `git pull`）。
:::

## 在 Claude Code 里使用

1. 启动 / 重启 **Claude Code**，它会自动从 `~/.claude/skills/` 与当前项目 `.claude/skills/` 下加载所有合法的技能。  
2. 项目技能仅当 Claude Code **当前打开的工作区**就是该项目时才会生效。  
3. 在对话中直接用自然语言描述要执行的操作；Claude Code 会按 `SKILL.md` 里约定的能力和安全规则去调用 `scripts/` 下的脚本。需要显式触发时，也可以输入 `/atxswap` 指令。  

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
| 「把钱包的 keystore 导出来备份」 | `wallet.js export <address> [--out <file>]` | 导出钱包对应的**加密 keystore JSON**（不会暴露原始私钥） |

### 查询

| 口令 | 命令 | 说明 |
|---|---|---|
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

- 本技能**不支持导入已有私钥**——既不能通过对话口令导入，命令行也未提供该入口。Claude Code 只会**新建**一个属于该技能实例的钱包；如需使用现有私钥，请使用你常用的钱包工具自行管理。

- 自定义区间流动性推荐流程是：先用 `liquidity.js quote-add` 预估，向用户展示 `estimatedAmounts`，确认后再执行 `liquidity.js add`。不要直接根据对话内容猜另一边代币数量。

- 收手续费时，应优先看 `query.js positions` 返回的 `collectable0/1` 或 `collectableAtx/collectableUsdt`。不要只看原始 `tokensOwed0/1`，因为这些字段仍为 `0` 时，仓位也可能已经可以收割。

:::

## 安全说明

- 对话中不会主动展示你的完整私钥或密码  
- 交易前会展示报价、余额等预览，你确认后再执行  
- 大额或敏感写操作会要求你明确「确认」或「执行」类指令  
- 私钥以加密形式存于本机 keystore；密码可交给系统安全存储（如 macOS Keychain / Linux Secret Service）  
- 备份钱包时，技能只能产出**加密后的 keystore JSON**（例如 `wallet.js export <address> --out wallet.json`），技能与底层 SDK 都不会输出原始私钥  
