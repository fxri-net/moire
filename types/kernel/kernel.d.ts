/**
 * 内核
 * 插件注册、按依赖装配、错误隔离与逆序卸载
 */
import type { Kernel, KernelOptions } from './types';
/**
 * 创建内核
 * @param options 内核选项
 * @returns 内核实例
 * @example createKernel({ version: '1.0.0' }).use(plugin).start()
 */
export declare function createKernel(options?: KernelOptions): Kernel;
