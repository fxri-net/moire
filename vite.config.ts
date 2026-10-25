import { resolve } from 'node:path'
import { defineConfig } from 'vite'

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
  build: {
    // 输出目录在入口切换前不接管根目录产物
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
