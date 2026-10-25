#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

/**
 * 验收步骤
 * 顺序即执行顺序，本地与 CI 共用这一条命令，不另抄步骤清单
 */
const steps = [
  ['类型检查', 'typecheck'],
  ['代码规范', 'lint'],
  ['格式校验', 'format:check'],
  ['单元测试', 'test'],
  ['构建产物', 'build'],
]

for (const [title, script] of steps) {
  console.log(`\n▶ ${title}`)
  const result = spawnSync('pnpm', ['run', script], { stdio: 'inherit', shell: true })
  if (result.status !== 0) {
    console.error(`\n✖ ${title}未通过`)
    process.exit(result.status ?? 1)
  }
}

console.log('\n✔ 全部验收通过')
