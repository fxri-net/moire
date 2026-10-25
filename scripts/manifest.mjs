#!/usr/bin/env node
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
  builtAt: new Date().toISOString(),
  files,
}

writeFileSync(resolve(outDir, manifestName), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

console.log(`✔ 产物清单已生成，共 ${files.length} 个文件`)
