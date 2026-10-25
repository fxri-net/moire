#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative, resolve } from 'node:path'

/** 仓库根目录 */
const root = resolve(import.meta.dirname, '..')
/** 产物目录 */
const outDir = resolve(root, 'dist')
/** 分发分支名，只承载产物与元文件 */
const distBranch = 'dist'
/** 分发分支附带的元文件，与产物一并交付 */
const metaFiles = ['LICENSE', 'NOTICE', 'README.md']
/** 产物清单文件名，清单记录自身以外的全部产物 */
const manifestName = 'manifest.json'
/**
 * 分发分支的换行策略，禁用换行转换
 * 检出端若受 core.autocrlf 影响会把 LF 转成 CRLF，产物字节随之改变，清单校验和对不上
 */
const attributes = '* -text\n'

/** 包信息 */
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
/** 本次发布的标签 */
const tag = `v${pkg.version}`

/**
 * 执行 git 命令，失败即中止
 * @param {string[]} args git 参数
 * @returns {string} 标准输出
 */
function git(args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' })
  if (result.status !== 0) throw new Error(`git ${args.join(' ')} 执行失败\n${result.stderr ?? ''}`)
  return (result.stdout ?? '').trim()
}

/**
 * 执行 git 命令并取标准输出，失败时返回空串，用于存在性探测
 * @param {string[]} args git 参数
 * @returns {string} 标准输出或空串
 */
function probe(args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' })
  return result.status === 0 ? (result.stdout ?? '').trim() : ''
}

/**
 * 计算文件校验和
 * @param {string} file 文件路径
 * @returns {string} 十六进制 sha256
 */
function checksum(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex')
}

/**
 * 递归列出文件
 * @param {string} dir 当前目录
 * @param {string} [base] 路径基准目录，递归时保持不变
 * @returns {string[]} 相对基准目录的文件名，分隔符为正斜杠
 */
function listFiles(dir, base = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    return entry.isDirectory() ? listFiles(full, base) : [relative(base, full).split('\\').join('/')]
  })
}

/**
 * 校验产物与清单一致，避免把缺失或篡改的产物推上分发分支
 * @returns {{ files: { path: string, bytes: number, sha256: string }[], builtAt: string }} 产物清单
 */
function verifyManifest() {
  const manifestPath = join(outDir, manifestName)
  if (!existsSync(manifestPath)) throw new Error('缺少产物清单，请先构建')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (manifest.version !== pkg.version) throw new Error(`产物清单版本 ${manifest.version} 与包版本 ${pkg.version} 不一致`)
  const listed = new Set(manifest.files.map((item) => item.path))
  for (const item of manifest.files) {
    const file = join(outDir, item.path)
    if (!existsSync(file)) throw new Error(`产物清单登记的文件不存在：${item.path}`)
    if (statSync(file).size !== item.bytes) throw new Error(`产物大小与清单不一致：${item.path}`)
    if (checksum(file) !== item.sha256) throw new Error(`产物校验和与清单不一致：${item.path}`)
  }
  for (const name of listFiles(outDir)) {
    if (name !== manifestName && !listed.has(name)) throw new Error(`产物目录存在清单外的文件：${name}`)
  }
  return manifest
}

/**
 * 在分发分支上写入本次产物并提交、打标签
 * @param {{ files: { path: string }[] }} manifest 产物清单
 * @returns {string} 分发提交标识
 */
function publish(manifest) {
  if (probe(['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`])) throw new Error(`标签 ${tag} 已存在，版本号未更新`)
  const staging = mkdtempSync(join(tmpdir(), 'moire-release-'))
  let created = false
  try {
    // 已有分发分支则在其基础上追加，否则新建孤儿分支，保证分支内不含源码历史
    if (probe(['rev-parse', '--verify', '--quiet', `refs/heads/${distBranch}`])) {
      git(['worktree', 'add', staging, distBranch])
    } else {
      git(['worktree', 'add', '--orphan', '-b', distBranch, staging])
    }
    created = true
    // 清空上一版产物，避免已删除的文件残留
    for (const name of readdirSync(staging)) {
      if (name !== '.git') rmSync(join(staging, name), { recursive: true, force: true })
    }
    cpSync(outDir, staging, { recursive: true })
    for (const name of metaFiles) {
      const file = join(root, name)
      if (!existsSync(file)) throw new Error(`缺少分发元文件：${name}`)
      cpSync(file, join(staging, name))
    }
    writeFileSync(join(staging, '.gitattributes'), attributes, 'utf8')
    git(['-C', staging, 'add', '--all', '--force'])
    git(['-C', staging, 'commit', '--message', `新增：发布 ${tag} 产物`])
    // 标签打在分发提交上，接入方按标签拉取即为当版产物
    git(['-C', staging, 'tag', '--annotate', tag, '--message', `${pkg.name} ${pkg.version}`])
    console.log(`✔ 分发分支已更新，共 ${manifest.files.length} 个产物文件`)
    return git(['-C', staging, 'rev-parse', 'HEAD'])
  } finally {
    // 失败时也要回收临时工作树，避免残留注册信息
    if (created) probe(['worktree', 'remove', '--force', staging])
    rmSync(staging, { recursive: true, force: true })
  }
}

if (probe(['status', '--porcelain'])) throw new Error('工作区存在未提交改动，请先提交再发布')
const branch = probe(['rev-parse', '--abbrev-ref', 'HEAD'])
if (branch !== 'main') throw new Error(`请在 main 分支发布，当前为 ${branch}`)

if (!process.argv.includes('--skip-build')) {
  const result = spawnSync('pnpm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: true })
  if (result.status !== 0) throw new Error('构建失败')
}

const manifest = verifyManifest()
console.log(`✔ 产物清单校验通过，版本 ${pkg.version}，构建于 ${manifest.builtAt}`)
const commit = publish(manifest)
console.log(`✔ 标签 ${tag} 指向分发提交 ${commit.slice(0, 8)}`)
console.log('\n推送命令（确认后执行）：')
console.log(`  git push origin main ${distBranch} ${tag}`)
