import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

/** 包信息，版本号在构建期注入源码 */
const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, 'package.json'), 'utf8')) as { version: string }

/**
 * 构建配置
 * 产物为单个 IIFE，外部依赖 layui 与 jQuery 以全局变量形式复用
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  define: {
    __MOIRE_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/entries/index.ts'),
      name: 'moire',
      formats: ['iife'],
      fileName: () => 'moire.min.js',
    },
    rollupOptions: {
      external: ['jquery', 'layui'],
      output: {
        globals: {
          jquery: 'jQuery',
          layui: 'layui',
        },
      },
    },
    minify: 'terser',
  },
})
