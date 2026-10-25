#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

/** 仓库根目录 */
const root = resolve(import.meta.dirname, '..')
/** 产物目录 */
const outDir = resolve(root, 'dist')
/** 清单文件名，自身不入清单 */
const manifestName = 'manifest.json'

/** 包信息 */
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))

/**
 * 递归列出文件
 * @param {string} dir 起始目录
 * @returns {string[]} 文件绝对路径
 */
function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    return entry.isDirectory() ? listFiles(full) : [full]
  })
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
 * 取构建所用源码提交
 * 分发分支的标签指向产物提交，没有这项就无法从产物反查源码；源码包解压等无 git 场景记空串，不阻断构建
 * @returns {string} 提交标识，取不到时为空串
 */
function sourceCommit() {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' })
  if (result.status === 0) return (result.stdout ?? '').trim()
  console.warn('⚠️ 未取到源码提交，manifest.commit 留空')
  return ''
}

const files = listFiles(outDir)
  .map((file) => relative(outDir, file).split('\\').join('/'))
  .filter((name) => name !== manifestName)
  .sort()
  .map((name) => {
    const file = join(outDir, name)
    return { path: name, bytes: statSync(file).size, sha256: checksum(file) }
  })

const manifest = {
  name: pkg.name,
  version: pkg.version,
  commit: sourceCommit(),
  builtAt: new Date().toISOString(),
  files,
}

writeFileSync(resolve(outDir, manifestName), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

console.log(`✔ 产物清单已生成，共 ${files.length} 个文件`)
