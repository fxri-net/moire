import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

/** 包信息，版本号在构建期注入源码 */
const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, 'package.json'), 'utf8')) as { version: string }

/** 源码别名 */
const alias = { '@': resolve(import.meta.dirname, 'src') }

/** 构建期注入的常量 */
const define = { __MOIRE_VERSION__: JSON.stringify(pkg.version) }

/**
 * 构建配置
 * 按 mode 分两次产出：iife 供浏览器直引，esm 供现代构建接入
 * 两次共用同一输出目录，esm 那次不清空，与 iife 产物共存
 * @param context 构建上下文，按 mode 选择产物形态
 * @returns 构建配置
 */
export default defineConfig(({ mode }) => {
  /** 是否产出 ESM 产物 */
  const isEsm = mode === 'esm'
  return {
    resolve: { alias },
    define,
    build: {
      outDir: 'dist',
      emptyOutDir: !isEsm,
      lib: {
        entry: resolve(import.meta.dirname, isEsm ? 'src/entries/esm.ts' : 'src/entries/index.ts'),
        name: 'moire',
        formats: [isEsm ? 'es' : 'iife'],
        fileName: () => (isEsm ? 'moire.esm.js' : 'moire.min.js'),
      },
      rollupOptions: isEsm
        ? { external: ['jquery', 'layui'] }
        : {
            external: ['jquery', 'layui'],
            output: { globals: { jquery: 'jQuery', layui: 'layui' } },
          },
      minify: 'terser',
    },
  }
})
