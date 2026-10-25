/**
 * 插件注册表
 * 按依赖关系排序，缺失依赖与循环依赖都在装配前拦截
 */
import type { MoirePlugin } from './types';
/**
 * 计算装配顺序
 * 依赖优先、同层保持注册顺序，便于业务把握执行先后
 * @param plugins 已注册插件，按注册顺序
 * @returns 排序后的插件
 * @example resolveOrder([{ name: 'b', depends: ['a'] }, { name: 'a' }]) // 先 a 后 b
 */
export declare function resolveOrder(plugins: readonly MoirePlugin[]): MoirePlugin[];
