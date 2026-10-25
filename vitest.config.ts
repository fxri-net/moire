import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

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
