# Changelog

## 2.1.0 — 2026-11-19

客户端中文化收窄到「工作步骤展示区」，对话正文与输入框不再参与改写。

### 变更

- 新增 `[data-step-process]` 锚点判定：词表与正则替换只在工作步骤展示区内生效；
- `aria-label` / `title` / `placeholder` 补译同样限定到步骤展示区与工具目录面板；
- 对话正文、输入框（contenteditable）与其余界面文本不参与改写。

## 2.0.0 — 2026-11-15

面向 **DeepSeek Harness 0.2.2-rc.1** 官方客户端的兼容版本（包名 `dsh-zh-think-expand`）。

### 兼容性

- 对齐 0.2.2 的插件契约：
  - peerDependencies 由 `cordis` 改为 `@deepseek-ai/cordis`（4.1.0），`@deepseek-ai/dsh-system-prompt` 指向 `^0.2.2-rc.1`；
  - `exports` 增加 `./cordis.patch.yml`，`dsh.client` 显式声明 `platform: 'web'` 与空 `inject`；
  - 桌面版 profile 名由 `web-desktop` 更正为 **`desktop`**。
- host 端：`systemPrompt.section({ name, order, text })` 签名与 0.2.2 一致；section 名改为 `dsh-zh-think-expand`，`order: -90`，并断言 `order` 为有限数值。
- client 端：沿用 0.2.2 仍存在的 DOM 锚点（`data-chat-call-id`、`toolCatalog*`、`data-chat-flow-key`）；bundle 仍以 `window.__ModuleLoader__.load({ id, factory })` 注册，id 与包名一致。
- 新增：`aria-label` / `title` / `placeholder` 属性补译（0.2.2 客户端大量使用 aria-label 承载按钮语义）。

### 功能

- 思考与回复强制中文（system-prompt 注入）。
- 界面残留英文中文化：扩充词表（`Show thinking`、`Hide thinking`、`Reasoning`、`Thought`、`Show more`、`Copy`、`Retry`、系统操作类按钮等），官方 zh 词典已覆盖的中文节点不动。
- 不注册任何渲染器，可与 `dsh-auto-collapse` / `dsh-turn-fold` 共存。

### 工程

- 测试拆分为 `test/host-smoke.mjs`（host 行为）与 `test/client-smoke.mjs`（bundle 语法、注册 id、词表与 DOM 锚点静态校验）。
- 构建脚本、类型契约、README 全面更新到 0.2.2。

## 1.0.1 — 2026-11-xx（上游 EAC 分支）

- 移除接管 `assistant-step` 的渲染器、ThinkBlock 与自绘 assistant 节点，修复与折叠类插件的冲突。
- 上游见 [jing-hy/dsh-think-zh-expand-eac](https://github.com/jing-hy/dsh-think-zh-expand-eac)。

## 0.4.x（上游）

- 见 [baosfeng/my-dsh-plugins](https://github.com/baosfeng/my-dsh-plugins) 的 `dsh-think-zh-expand`。
