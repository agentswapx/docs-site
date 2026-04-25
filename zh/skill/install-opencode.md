# 在 OpenCode 中安装 ATX 技能

[OpenCode](https://opencode.ai) 会从磁盘上固定路径里的 `SKILL.md` 发现**智能体技能**。这与 [ClawHub / OpenClaw](/zh/skill/install-openclaw)（从注册表安装）或 [Claude Code](/zh/skill/install-agent) 的安装方式不同：需要你自己把技能目录放到指定位置，再由 OpenCode 在需要时通过 `skill` 工具加载。目录结构、发现规则与 frontmatter 约定以 OpenCode 官方文档 [Agent Skills | OpenCode](https://opencode.ai/docs/skills) 为准。

- **技能包名**：`atxswap`（须与存放 `SKILL.md` 的**文件夹名**一致）
- **SDK (npm)**：[`atxswap-sdk`](https://www.npmjs.com/package/atxswap-sdk)
- **源码**：[agentswapx/skills — atxswap](https://github.com/agentswapx/skills/tree/main/atxswap)

## OpenCode 会搜索哪些路径

按 [OpenCode 技能文档](https://opencode.ai/docs/skills)，每个技能一个目录，目录内放 `SKILL.md`。OpenCode 会在以下位置查找：

| 范围 | 路径 |
|---|---|
| 项目（OpenCode） | `.opencode/skills/<name>/SKILL.md` |
| 全局（OpenCode） | `~/.config/opencode/skills/<name>/SKILL.md` |
| 项目（兼容 Claude） | `.claude/skills/<name>/SKILL.md` |
| 全局（兼容 Claude） | `~/.claude/skills/<name>/SKILL.md` |
| 项目（兼容 agent） | `.agents/skills/<name>/SKILL.md` |
| 全局（兼容 agent） | `~/.agents/skills/<name>/SKILL.md` |

对项目内路径，OpenCode 会从**当前工作目录向上**遍历到 git 工作区根目录，并加载路径上匹配的 `skills/*/SKILL.md`。

## 安装 `atxswap` 技能

1. **选定目录** — 若只给当前仓库用，常用：

   ```text
   <项目根>/.opencode/skills/atxswap/SKILL.md
   ```

   若本机所有项目共用：

   ```text
   ~/.config/opencode/skills/atxswap/SKILL.md
   ```

2. **复制或克隆**技能内容，保证目录名**正好**为 `atxswap`（与 `SKILL.md` 里 frontmatter 的 `name: atxswap` 一致）：

   ```bash
   mkdir -p .opencode/skills
   git clone --depth 1 https://github.com/agentswapx/skills.git /tmp/agentswapx-skills
   cp -R /tmp/agentswapx-skills/atxswap .opencode/skills/atxswap
   rm -rf /tmp/agentswapx-skills
   ```

3. **安装 Node 依赖**（技能内脚本需要）：

   ```bash
   cd .opencode/skills/atxswap && npm install
   ```

4. 如有需要，**重启或重载** OpenCode。智能体通过 OpenCode 自带的 `skill` 工具按需加载技能；说明见官方文档中的 [Recognize tool description](https://opencode.ai/docs/skills#recognize-tool-description)。

## 试一试

当 `atxswap` 已放在 OpenCode 能发现的路径下、且已在技能目录完成 `npm install` 后，在 OpenCode 里用**自然语言**对智能体提需求即可；示例话术与 [在 OpenClaw 中安装 ATX 技能](/zh/skill/install-openclaw#试一试) 相同，底层脚本一致。

### 查看价格

> "帮我查一下 ATX 当前价格"

### 创建钱包

> "帮我创建一个新钱包"

智能体会要求你设置密码，然后创建加密钱包。密码自动保存到系统安全存储（或 headless 环境下的本机 file backend，取决于运行环境）。

### 买入代币

> "用 10 USDT 买入 ATX"

智能体会先查询报价，展示预览，等你确认后再执行。

### 查看余额

> "查看我的钱包余额"

### 转账

> "把 50 ATX 转给 0xABC...123"

## 口令速查

下表与 [在 OpenClaw 中安装 ATX 技能](/zh/skill/install-openclaw#口令速查) 的表格一致。第一列是可以对智能体说的例句（口令），第二列为底层命令，第三列是说明。智能体在需要时会从技能根目录（例如 `.opencode/skills/atxswap/`）调起 `scripts/` 下脚本，你**一般不需要**自己进终端手敲这些命令。

### 钱包管理

| 口令 | 命令 | 说明 |
|---|---|---|
| 「帮我创建一个新钱包」 | `wallet.js create [name] --password <pwd>` | 创建新钱包 |
| 「列出我所有的钱包」 | `wallet.js list` | 列出所有钱包及余额 |
| 「把 钱包 的 keystore 导出来备份」 | `wallet.js export <address> [--out <file>]` | 导出钱包对应的**加密 keystore JSON**（不会暴露原始私钥） |

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

- 上表**命令**是技能包内的脚本文本，由智能体在需要时调起；你一般不必自己在终端里执行。

- 上表**说明**概括该行为或底层命令的大致作用，与口令一样可做理解用，不限制你必须怎么说。

- 本技能**不支持导入已有私钥**——既不能通过对话口令导入，命令行也未提供该入口。智能体只会**新建**一个属于该技能实例的钱包；如需使用现有私钥，请使用你常用的钱包工具自行管理。

:::

## 安全说明

- 智能体永远不会在对话中显示你的私钥或密码
- 所有交易前，智能体会先展示报价/余额预览，等你确认后才执行
- 大额交易需要你明确说"确认"或"执行"
- 私钥以加密形式存储在本地 keystore 文件中
- 密码保存在系统安全存储中（无桌面会话时可能为本机 file backend，见 SDK 说明）
- 备份钱包时，技能只能产出**加密后的 keystore JSON**（例如 `wallet.js export <address> --out wallet.json`），技能与底层 SDK 都不会输出原始私钥

## 另见

- [在 OpenClaw 中安装 ATX 技能](/zh/skill/install-openclaw) — 通过 `openclaw` / `clawhub` 从 ClawHub 安装
- [在 Claude Code 中安装 ATX 技能](/zh/skill/install-agent) — 将技能放在 `.claude/skills/` 供 Claude Code 使用
- OpenCode 官方：[Agent Skills](https://opencode.ai/docs/skills)
