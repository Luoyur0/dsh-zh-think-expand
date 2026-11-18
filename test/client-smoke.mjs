/**
 * dsh-zh-think-expand — client 半静态校验（无需 DOM / 浏览器）。
 *
 * 客户端 bundle 只能在 DSH 的浏览器上下文里运行，这里做三件事：
 *   1. node --check 校验 lib/client.js 语法；
 *   2. 断言 bundle 以 __ModuleLoader__.load 注册且 id 与包名一致（0.2.2 加载契约）；
 *   3. 断言中文化词表与 DOM 锚点仍在产物里，防止构建丢失。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const clientPath = join(root, 'lib/client.js')
const source = readFileSync(clientPath, 'utf8')

test('lib/client.js 语法有效', () => {
  execFileSync(process.execPath, ['--check', clientPath], { stdio: 'pipe' })
})

test('以 __ModuleLoader__.load 注册，id 与包名一致', () => {
  assert.ok(source.includes('window.__ModuleLoader__.load('), '使用官方 client bundle 注册入口')
  assert.ok(source.includes("id: 'dsh-zh-think-expand'"), '注册 id 为 dsh-zh-think-expand')
})

test('导出 inject 与 apply', () => {
  assert.ok(source.includes('_exports.inject'), '导出 inject')
  assert.ok(source.includes('_exports.apply'), '导出 apply')
})

test('保留 DOM 中文化锚点（0.2.2 仍存在）', () => {
  assert.ok(source.includes('data-chat-call-id'), '工具调用行锚点')
  assert.ok(source.includes('toolCatalog'), '工具目录类名锚点')
  assert.ok(source.includes('MutationObserver'), '跟随 React 重渲染')
})

test('保留核心中文词条', () => {
  for (const [en, zh] of [['Thinking', '思考'], ['Tool Call', '工具调用'], ['Duration', '用时'], ['Load earlier history', '加载更早历史']]) {
    assert.ok(source.includes(en), `词表包含 ${en}`)
    assert.ok(source.includes(zh), `词表包含译名 ${zh}`)
  }
})
