// 私有包发布守卫：部分 pnpm/npm 版本不会因 private 字段拦截发布，这里显式失败
console.error('⚠️ 私有包，禁止发布：@fxri/moire')
process.exit(1)
