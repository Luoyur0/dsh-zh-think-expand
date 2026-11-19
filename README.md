# dsh-zh-think-expand

[![topic: dsh](https://img.shields.io/badge/插件生态-topic%20dsh-4d6bfe)](https://github.com/topics/dsh)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![DSH](https://img.shields.io/badge/DeepSeek%20Harness-0.2.2--rc.1-4d6bfe)](https://github.com/deepseek-ai/deepseek-harness)

**DSH 思考增强插件（0.2.2 官方客户端兼容版）**：让 agent 的思考（reasoning）与最终回复强制使用中文，并把界面残留的英文（`Show thinking`、工具卡片标题、空态文案等）补译成中文。不接管任何对话渲染器，可与折叠类插件共存。

## 版本与兼容性

| 项目 | 取值 |
|---|---|
| 本插件版本 | `2.0.0` |
| 目标客户端 | **DeepSeek Harness 0.2.2-rc.1**（desktop / web） |
| 桌面版 profile 名 | `desktop`（`~/.dsh/profiles/desktop`） |
| Node | ≥ 22 |
| host 依赖 | `systemPrompt` 服务（`@deepseek-ai/dsh-system-prompt@>=0.2.2-rc.1 <0.3.0`） |
| client 依赖 | `window.__ModuleLoader__`（`@deepseek-ai/dsh-client-modules`） |

支持 DSH Web / Desktop。DSH 启动时允许 0.2.2-rc.1 起的所有宿主版本

0.2.2-rc.1 兼容性已逐项核对（对照 `resources/app.asar` 内实现）：

| 契约 | 0.2.2-rc.1 现状 | 本插件做法 |
|---|---|---|
| `systemPrompt.section({ name, order, text })` | 签名不变；`order` 必须为有限数值；同层重名抛错 | `order: -90`，section 名用本包专名 `dsh-zh-think-expand` |
| client bundle 注册 | `window.__ModuleLoader__.load({ id, factory })` | id 与包名一致，factory 内不 require 任何外部模块 |
| client 插件导出 | `exports.inject` + `exports.apply(ctx)`，`ctx.effect` 可注册可清理副作用 | 只注册一个 DOM 观察器，卸载时自动断开 |
| bundle patch | `dsh.bundle.patch` 指向的 `cordis.patch.yml` 由 loader 合并进 profile | 只做一条 `insert` |
| DOM 锚点 | `data-chat-call-id`、`toolCatalog*` 类名、`data-chat-flow-key` 仍然存在 | 沿用这些锚点，不依赖内部 React 组件名 |
| 官方 zh 词典 | 已覆盖大部分 UI 词条 | 只补译仍以英文渲染的叶子文本，中文节点一律不动 |

## 引用与来源声明

- 起源：**[baosfeng/my-dsh-plugins](https://github.com/baosfeng/my-dsh-plugins)** 中的 [`plugins/dsh-think-zh-expand`](https://github.com/baosfeng/my-dsh-plugins/tree/main/plugins/dsh-think-zh-expand)（作者 [@baosfeng](https://github.com/baosfeng)，MIT）。
- 中间分支：**[jing-hy/dsh-think-zh-expand-eac](https://github.com/jing-hy/dsh-think-zh-expand-eac)**（EAC 定制版，移除了全部接管对话渲染器的显示功能）。
- 本仓库：在 EAC 版基础上适配 **DSH 0.2.2-rc.1**，重写包元数据、依赖契约、构建与测试，并补译 0.2.2 客户端新增的残留英文。原许可证（MIT，Copyright © 2026 bsfeng）原样保留。

## 功能

### 1. 思考强制中文（host 端）✅

通过 `systemPrompt.section` 注入一条固定系统提示（`order: -90`，persona 之前最先读到），内容为**结构化语言规则**（最高优先级，不可被上下文覆盖）：

> 思考过程（reasoning）必须用简体中文书写；最终回复默认简体中文（跟随用户语言）。
> 英文错误消息/日志/堆栈不改变语言；大量英文上下文不“带偏”输出。
> 代码、命令、文件路径、标识符与技术术语保持原文，不翻译。

### 2. 界面残留英文中文化（client 端）✅

0.2.2 的官方 zh 词典已翻译大部分界面，但仍有硬编码英文（如 `Show thinking`、`Load earlier history`、工具卡片标题/摘要、空态文案）。本插件在 **DOM 层做精准文本替换**：

- 只匹配「完全等于」词表的叶子文本节点，排除 `pre` / `code` / 输入区，避免误伤代码块与消息正文；
- 同一套词表补译元素的 `aria-label` / `title` / `placeholder`（0.2.2 新增）；
- `MutationObserver` 跟随 React 重渲染持续生效，插件卸载时断开；
- **不改变 DOM 结构**，只改写文本与属性值，因此不与折叠插件冲突。

## 安装

### 方式 A：安装本地 tgz（推荐，桌面版）

```powershell
# 1. 构建（或直接用仓库里已提交的 lib/）
pnpm install
pnpm build
pnpm pack      # 生成 dsh-zh-think-expand-2.0.0.tgz

# 2. 装进 desktop profile（DSH Desktop 的 profile 名是 desktop）
dsh plugin --profile desktop add file:<绝对路径>/dsh-zh-think-expand-2.0.0.tgz

# 3. 确认 bundle 行已合并
dsh --profile desktop --dump-config | Select-String think-zh-expand
```

也可以把 tgz 复制到 `~/.dsh/plugin-packages/`，在插件管理器里安装；或手动写入 `~/.dsh/profiles/desktop/package.json` 的 `dependencies` 与 `dsh.profile.bundles`，再 `pnpm install`。

### 方式 B：从源码 link（开发调试）

```powershell
git clone https://github.com/Luoyur0/dsh-zh-think-expand.git
dsh plugin --profile desktop add link:<仓库路径>
```

### 方式 C：从 GitHub 安装

```powershell
dsh plugin --profile desktop add github:Luoyur0/dsh-zh-think-expand
```

安装后**重启 DSH Desktop**（host 插件在启动时加载，client bundle 在页面加载时注入）；刷新页面即可看到中文化效果。

## 与折叠插件共存

本插件不注册任何渲染器，因此可以与折叠类插件同时启用：

```powershell
dsh plugin --profile desktop add dsh-auto-collapse   # 或 dsh-turn-fold
dsh plugin --profile desktop add file:<路径>/dsh-zh-think-expand-2.0.0.tgz
```

**不要同时启用** `dsh-auto-collapse` 与 `dsh-turn-fold`——两者都通过 DOM/渲染器操作对话区，机制互相致盲。

## 开发

```powershell
pnpm install
pnpm typecheck   # tsc 类型检查（server + client 两份配置）
pnpm build       # 重新生成 lib/index.js 与 lib/client.js
pnpm test        # host 冒烟测试 + client bundle 静态校验
```

> `lib/client.js` 是构建产物，**必须提交**——DSH 直接提供该文件，不在安装时构建。
> 修改 `src/client/index.ts` 后务必重新构建并提交产物。

### 构建流程

1. `tsc -p tsconfig.json` → `lib/index.js`（server 端，ESM）
2. `tsc -p tsconfig.client.json` → `lib/.client-build/index.js`（client 端 CommonJS 单文件）
3. `node scripts/build.mjs` 把 client 编译产物注入 `lib/client.src.js` 模板的 `/*__CLIENT_BUNDLE__*/` 占位符 → `lib/client.js`

## 目录结构

| 路径 | 职责 |
|---|---|
| `src/index.ts` | host 端：system-prompt section 注册 |
| `src/types.d.ts` | DSH 0.2.2 运行时类型最小契约 |
| `src/client/index.ts` | client 端：界面中文化（词表 + DOM 精准替换 + 属性补译） |
| `lib/index.js` | host 端构建产物（提交） |
| `lib/client.js` | client 端构建产物（提交，DSH 实际提供） |
| `lib/client.src.js` | client bundle 模板（含 `__CLIENT_BUNDLE__` 占位符） |
| `scripts/build.mjs` | 构建脚本：编译 + 注入模板 |
| `cordis.patch.yml` | bundle patch：把插件行挂载进 profile |
| `test/` | host 冒烟测试 + client bundle 静态校验 |

## 许可证

MIT（派生自 [baosfeng](https://github.com/baosfeng) 的 dsh-think-zh-expand 插件，原版权声明保留）。
