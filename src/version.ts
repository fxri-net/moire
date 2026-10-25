/**
 * 框架版本
 * 构建阶段由 define 注入，与 package.json 保持一致
 */

declare const __MOIRE_VERSION__: string

/** 版本号 */
export const version = __MOIRE_VERSION__
