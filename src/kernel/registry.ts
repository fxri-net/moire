/**
 * 插件注册表
 * 按依赖关系排序，缺失依赖与循环依赖都在装配前拦截
 */

import { i18n } from '../i18n'
import type { MoirePlugin } from './types'

/** 遍历状态 */
type VisitState = 'done' | 'visiting'

/**
 * 计算装配顺序
 * 依赖优先、同层保持注册顺序，便于业务把握执行先后
 * @param plugins 已注册插件，按注册顺序
 * @returns 排序后的插件
 * @example resolveOrder([{ name: 'b', depends: ['a'] }, { name: 'a' }]) // 先 a 后 b
 */
export function resolveOrder(plugins: readonly MoirePlugin[]): MoirePlugin[] {
  const index = new Map<string, MoirePlugin>()
  for (const plugin of plugins) index.set(plugin.name, plugin)
  const states = new Map<string, VisitState>()
  const ordered: MoirePlugin[] = []
  const visit = (plugin: MoirePlugin): void => {
    const state = states.get(plugin.name)
    if (state === 'done') return
    // 再次进入即说明依赖成环
    if (state === 'visiting') throw new Error(i18n.t('kernel.plugin.cycle', { name: plugin.name }))
    states.set(plugin.name, 'visiting')
    for (const name of plugin.depends ?? []) {
      const dependency = index.get(name)
      if (!dependency) throw new Error(i18n.t('kernel.plugin.missing', { name: plugin.name, depends: name }))
      visit(dependency)
    }
    states.set(plugin.name, 'done')
    ordered.push(plugin)
  }
  for (const plugin of plugins) visit(plugin)
  return ordered
}
