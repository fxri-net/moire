/**
 * 全局挂载
 * 业务侧通过 window.moire 访问内核，避免再散落多个全局变量
 */

import type { Kernel } from './types'

/** 全局属性名 */
export const GLOBAL_KEY = 'moire'

/**
 * 把内核挂到全局
 * @param kernel 内核实例
 * @returns 同一个内核，便于链式调用
 * @example mountGlobal(createKernel()).start()
 */
export function mountGlobal(kernel: Kernel): Kernel {
  if (typeof window !== 'undefined') window[GLOBAL_KEY] = kernel
  return kernel
}

declare global {
  /** 全局对象扩展 */
  interface Window {
    /** 内核实例，由入口挂载 */
    moire?: Kernel
  }
}
