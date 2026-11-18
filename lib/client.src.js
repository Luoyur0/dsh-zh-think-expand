/**
 * dsh-zh-think-expand — client half (browser).
 *
 * 功能 2：界面残留英文中文化（唯一保留的客户端功能）。
 *
 * 本包不接管任何渲染器，因此不需要 react、dsh-md-render(MarkdownView)
 * 与 dsh-shared 共享图标；__ModuleLoader__ factory 也不 require 任何外部模块。
 *
 * BUILD NOTE: 本文件是源码模板（骨架）。scripts/build.mjs 先 tsc 编译
 * src/client/index.ts → lib/.client-build/index.js（CommonJS 单文件），
 * 再把编译产物注入到下方 /*__CLIENT_BUNDLE__* / 占位符处并写出
 * lib/client.js（DSH 实际提供的产物，单一 __ModuleLoader__ bundle，无相对
 * 路径 require）。产物必须提交（CI 只跑 node --check + 测试，不跑构建）。
 *
 * 0.2.2 兼容：DSH 客户端仍通过 window.__ModuleLoader__.load({ id, factory })
 * 注册 bundle（见 @deepseek-ai/dsh-client-modules/lib/client.js），id 必须与
 * package.json 的包名一致，factory 返回值即插件模块（inject / apply）。
 */
window.__ModuleLoader__.load({
  id: 'dsh-zh-think-expand',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    // ── Client bundle（编译自 src/client/index.ts）──────────────────
    /*__CLIENT_BUNDLE__*/

    return module.exports
  },
})
