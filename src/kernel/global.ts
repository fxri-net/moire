/**
 * 全局挂载
 * 业务侧通过 window.moire 访问框架实例，避免再散落多个全局变量
 */

import type { Kernel } from './types'

/** 全局属性名 */
export const GLOBAL_KEY = 'moire'

/**
 * 把内核挂到全局
 * @param kernel 内核实例
 * @returns 同一个实例，便于链式调用
 * @example mountGlobal(createKernel()).start()
 */
export function mountGlobal<T extends Kernel>(kernel: T): T {
  if (typeof window !== 'undefined') Reflect.set(window, GLOBAL_KEY, kernel)
  return kernel
}
