#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 验收步骤的唯一真源：本地与 GitHub Actions / GitLab CI 共用这一份清单
 * CI 只调用本脚本，不再另抄步骤枚举，避免两处清单漂移
 */
const root = dirname(dirname(fileURLToPath(import.meta.url)))
const isWindows = process.platform === 'win32'

/** 命令行开关 */
const flags = new Set(process.argv.slice(2))
/** 跳过文档站构建，供没有文档站构建条件的平台使用 */
const skipDocs = flags.has('--skip-docs')

/**
 * 读取文本文件并去掉首尾空白
 * @param {string} file 绝对路径
 * @returns {string} 文件内容
 */
function readTrimmed(file) {
  return readFileSync(file, 'utf8').trim()
}

/**
 * 对照工具链版本，只告警不拦截
 * 本地与 CI 的 node / pnpm 版本不同是「本地绿、远端红」的常见来源，先让人看见
 */
function reportToolchain() {
  const { packageManager } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  const expectedNode = readTrimmed(join(root, '.node-version'))
  const expectedPnpm = String(packageManager).replace(/^pnpm@/, '')
  const actualNode = process.version.replace(/^v/, '')
  const actualPnpm = (spawnSync('pnpm', ['--version'], { encoding: 'utf8', shell: isWindows }).stdout ?? '').trim()

  console.log(`工具链：node ${actualNode}（仓库期望 ${expectedNode}）/ pnpm ${actualPnpm}（仓库期望 ${expectedPnpm}）`)
  if (actualNode !== expectedNode) console.warn(`⚠️ node 版本与 .node-version 不一致：当前 ${actualNode}，期望 ${expectedNode}`)
  if (actualPnpm !== expectedPnpm) console.warn(`⚠️ pnpm 版本与 packageManager 不一致：当前 ${actualPnpm}，期望 ${expectedPnpm}`)
}

/**
 * 验收步骤
 * 顺序即执行顺序；单元测试钉 TZ=UTC，避免本地时区让时间相关断言漂移
 */
const steps = [
  { label: '安装依赖', args: ['install', '--frozen-lockfile'], fatal: true },
  { label: '类型检查', args: ['typecheck'] },
  { label: '代码规范', args: ['lint'] },
  { label: '格式校验', args: ['format:check'] },
  { label: '单元测试', args: ['test'], env: { TZ: 'UTC' } },
  { label: '构建产物', args: ['build'] },
  { label: '示例类型', args: ['check:examples'] },
  // 文档站构建同时做站内死链检查，文档改错会让验收直接变红
  { label: '文档站构建', args: ['docs:build'], skip: skipDocs },
]

reportToolchain()

/** 未通过的步骤名 */
const failures = []

for (const { label, args, env, skip, fatal } of steps) {
  if (skip) continue
  console.log(`\n▶ ${label}`)
  // pnpm 在 Windows 上是 .cmd，需经 shell 调用
  const result = spawnSync('pnpm', args, { cwd: root, stdio: 'inherit', shell: isWindows, env: { ...process.env, ...env } })
  if (result.status === 0) continue
  failures.push(label)
  // 依赖装不上时后续步骤只会是噪音，直接中止；其余步骤跑完再一次暴露全部问题
  if (fatal) break
}

if (failures.length > 0) {
  console.error(`\n✖ 验收未通过：${failures.join('、')}`)
  process.exit(1)
}

console.log('\n✔ 全部验收通过')
