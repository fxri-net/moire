import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** 界面库全局变量，只允许在适配层出现 */
const uiGlobals = ['$', 'jQuery', 'layui', 'layx', 'Sortable', 'tinymce']

/** 界面库模块，只允许在适配层引入 */
const uiModules = ['jquery', 'layui', 'layx', 'sortablejs', 'tinymce']

/** 界面库模块的子路径，只允许在适配层引入 */
const uiSubModules = uiModules.map((name) => `${name}/**`)

export default tseslint.config(
  {
    // 文档站构建产物与缓存不参与检查
    ignores: ['node_modules/**', 'coverage/**', 'dist/**', 'docs/.vitepress/**', '.tasks/**'],
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
      // 下划线开头的参数与变量视为有意闲置
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    // 依赖边界：界面库收敛到适配层，其他源码只能引用其类型
    files: ['src/**/*.ts'],
    ignores: ['src/adapters/layui/**'],
    rules: {
      'no-restricted-globals': ['error', ...uiGlobals.map((name) => ({ name, message: '界面库统一经 adapters/layui 访问' }))],
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: uiModules.map((name) => ({ name, message: '界面库统一经 adapters/layui 访问' })),
          patterns: [
            {
              group: ['**/adapters/**'],
              message: '界面库统一经 adapters/layui 访问，其他模块只可引用其类型',
              allowTypeImports: true,
            },
            { group: uiSubModules, message: '界面库统一经 adapters/layui 访问' },
          ],
        },
      ],
    },
  },
  {
    // 入口是装配点，可引入适配层实例，但仍不得直接触碰界面库
    files: ['src/entries/**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: uiModules.map((name) => ({ name, message: '界面库统一经 adapters/layui 访问' })),
          patterns: [{ group: uiSubModules, message: '界面库统一经 adapters/layui 访问' }],
        },
      ],
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // 示例页是浏览器脚本，按浏览器环境提供全局变量
    files: ['examples/**/*.js'],
    languageOptions: {
      globals: globals.browser,
    },
  },
)
