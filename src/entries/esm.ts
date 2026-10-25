/**
 * 模块入口
 * 供现代构建以 ESM 引入，挂载与启动交由接入方决定
 * 契约类型一并导出，接入方无需深入产物目录取类型
 */

export { moire } from './app'
export type { Moire } from './app'
export type * from '../adapters/layui'
export type * from '../enums'
export type * from '../fields'
export type * from '../http'
export type * from '../i18n'
export type * from '../kernel'
export type * from '../schema'
export type * from '../tools'
export type * from '../utils'
export type * from '../views'
