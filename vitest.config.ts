import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

/** 包信息，版本号在测试期注入源码 */
const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, 'package.json'), 'utf8')) as { version: string }

/**
 * 测试配置
 * 覆盖率门槛随各批次落地逐步抬升，第 2 批起启用 --coverage
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
  test: {
    environment: 'jsdom',
    globals: true,
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      // 单测集中在 src/__tests__，不计入覆盖率分母
      exclude: ['src/**/index.ts', 'src/**/__tests__/**'],
    },
  },
})
