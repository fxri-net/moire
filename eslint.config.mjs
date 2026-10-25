import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** 旧代码目录在第 5 批入口切换前不参与检查 */
const legacy = ['base/**', 'view/**', 'build/**', 'moire.js', '*.min.js']

export default tseslint.config(
  {
    ignores: [...legacy, 'node_modules/**', 'coverage/**', 'dist/**', '.tasks/**'],
  },
  js.configs.recommended,
  {
    // 类型感知规则只作用于 TS 源码，脚本保持无类型检查
    files: ['**/*.ts'],
    extends: [...tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // 枚举分支必须穷尽，禁止遗漏与穿透
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'no-fallthrough': 'error',
      'no-implicit-globals': 'error',
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
)
