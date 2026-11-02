#!/usr/bin/env node
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
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
/** 跳过文档链接检查 */
const skipLinks = flags.has('--skip-links')
/** 跳过变更集检查 */
const skipChangeset = flags.has('--skip-changeset')
/** 一致性检查错误 */
const errors = []

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

/**
 * git 只读调用：成功返回输出（可能为空串），失败返回 null
 * @param {string[]} args git 参数
 * @returns {string | null} 输出或 null
 */
function git(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return null
  }
}

/**
 * 变更基准：显式 ref > GitHub 事件载荷 > GitLab MR diff 基准 > 目标分支 merge-base > 变更前提交 > 本地 HEAD~1
 * @returns {string | null} 基准提交
 */
function resolveBaseline() {
  const explicit = process.env.CHANGESET_BASE_REF
  if (explicit) return git(['merge-base', explicit, 'HEAD']) ?? git(['rev-parse', explicit])
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (eventPath && existsSync(eventPath)) {
    try {
      const event = JSON.parse(readFileSync(eventPath, 'utf8'))
      const before = event?.before
      const sha = event?.pull_request?.base?.sha || (before && !/^0+$/.test(before) ? before : '')
      if (sha && git(['cat-file', '-e', `${sha}^{commit}`]) !== null) return sha
    } catch {
      // 事件载荷不可读时继续走其余基准
    }
  }
  const mrBase = process.env.CI_MERGE_REQUEST_DIFF_BASE_SHA
  if (mrBase && git(['cat-file', '-e', `${mrBase}^{commit}`]) !== null) return mrBase
  const baseRef = process.env.GITHUB_BASE_REF || process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME
  if (baseRef) {
    for (const ref of [`origin/${baseRef}`, baseRef]) {
      const merged = git(['merge-base', ref, 'HEAD'])
      if (merged) return merged
    }
  }
  const before = process.env.CI_COMMIT_BEFORE_SHA
  if (before && !/^0+$/.test(before) && git(['cat-file', '-e', `${before}^{commit}`]) !== null) return before
  return git(['rev-parse', 'HEAD~1'])
}

/**
 * 递归收集 docs 下的 Markdown
 * @param {string} dir 目录
 * @returns {string[]} Markdown 文件
 */
function collectMarkdown(dir) {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...collectMarkdown(full))
    else if (entry.name.endsWith('.md')) files.push(full)
  }
  return files
}

/** 文档相对链接可达性：跳过外链、锚点与站点根路径；无扩展名时补 .md / index.md 再判 */
function checkDocLinks() {
  const docsRoot = join(root, 'docs')
  if (!existsSync(docsRoot)) return
  for (const file of collectMarkdown(docsRoot)) {
    const content = readFileSync(file, 'utf8')
    for (const matched of content.matchAll(/\]\(([^)]+)\)/g)) {
      const raw = (matched[1] ?? '').trim()
      if (!raw || raw.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('/')) continue
      const target = raw.split('#')[0]
      if (!target) continue
      const base = resolve(dirname(file), target)
      const candidates = [base, `${base}.md`, join(base, 'index.md')]
      if (!candidates.some((path) => existsSync(path))) {
        errors.push(`${relative(root, file).split(sep).join('/')}: 链接目标不存在：${raw}`)
      }
    }
  }
}

/** 变更集一致性：触及 src/ 或手写 docs 的改动须新增变更集；docs/changelog.md 为生成物，不触发 */
function checkChangeset() {
  const baseline = resolveBaseline()
  if (!baseline) {
    console.log('变更集校验：跳过（无 git 基准）')
    return
  }
  const changed = (git(['diff', '--name-only', baseline]) ?? '')
    .split('\n')
    .filter(Boolean)
    .map((file) => file.split(sep).join('/'))
  const triggers = changed.some((file) => (file.startsWith('src/') || file.startsWith('docs/')) && file !== 'docs/changelog.md')
  if (!triggers) return
  const baselineFiles = new Set(
    (git(['ls-tree', '--name-only', baseline, '.changeset/']) ?? '')
      .split('\n')
      .filter(Boolean)
      .map((file) => file.split('/').pop()),
  )
  const current = existsSync(join(root, '.changeset'))
    ? readdirSync(join(root, '.changeset')).filter((name) => name.endsWith('.md') && name !== 'README.md')
    : []
  if (!current.some((name) => !baselineFiles.has(name))) {
    errors.push('.changeset: 本次改动触及 src/ 或 docs/，须新增变更集')
  }
}

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

if (failures.length === 0) {
  if (!skipLinks) checkDocLinks()
  if (!skipChangeset) checkChangeset()
}

if (failures.length > 0 || errors.length > 0) {
  if (failures.length > 0) {
    console.error(`\n✖ 验收未通过：${failures.join('、')}`)
  }
  if (errors.length > 0) {
    console.error(`\n✖ 一致性校验未通过：${errors.length} 项`)
    for (const error of errors) console.error(`  - ${error}`)
  }
  process.exit(1)
}

console.log('\n✔ 全部验收通过')
