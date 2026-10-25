/**
 * 内核
 * 插件注册、按依赖装配、错误隔离与逆序卸载
 */

import { i18n } from '../i18n'
import { createNotifier } from './notifier'
import { resolveOrder } from './registry'
import type { Kernel, KernelOptions, MoireContext, MoirePlugin, Notice } from './types'

/**
 * 创建内核
 * @param options 内核选项
 * @returns 内核实例
 * @example createKernel({ version: '1.0.0' }).use(plugin).start()
 */
export function createKernel(options: KernelOptions = {}): Kernel {
  const version = options.version ?? '0.0.0'
  const notifier = createNotifier(options.notify)
  const plugins = new Map<string, MoirePlugin>()
  const disposers = new Map<string, () => void>()
  const context: MoireContext = {
    version,
    notify: (notice) => {
      notifier.notify(notice)
    },
    subscribe: (listener) => notifier.subscribe(listener),
    get: (name) => plugins.get(name),
  }
  let started = false

  const notifyFailed = (name: string, error: unknown): void => {
    const notice: Notice = {
      message: i18n.t('kernel.plugin.failed', { name, message: errorText(error) }),
    }
    notifier.notify(notice)
  }

  /**
   * 装配单个插件
   * 失败只通知，便于其余插件继续装配
   * @param plugin 待装配插件
   */
  const mount = (plugin: MoirePlugin): void => {
    try {
      plugin.setup(context)
      disposers.set(plugin.name, () => {
        plugin.dispose?.()
      })
    } catch (error) {
      // 单个插件失败不影响其余插件装配
      notifyFailed(plugin.name, error)
    }
  }

  /**
   * 校验依赖已装配
   * 启动后新增插件无法重排既有顺序，缺依赖时立即报错而不是静默失效
   * @param plugin 待装配插件
   */
  const assertReady = (plugin: MoirePlugin): void => {
    for (const name of plugin.depends ?? []) {
      if (disposers.has(name)) continue
      throw new Error(i18n.t('kernel.plugin.missing', { name: plugin.name, depends: name }))
    }
  }

  const kernel: Kernel = {
    version,
    context,
    use: (plugin) => {
      if (plugins.has(plugin.name)) throw new Error(i18n.t('kernel.plugin.exists', { name: plugin.name }))
      plugins.set(plugin.name, plugin)
      // 启动后注册即装配，业务可在运行期追加插件
      if (started) {
        assertReady(plugin)
        mount(plugin)
      }
      return kernel
    },
    start: () => {
      if (started) return kernel
      started = true
      for (const plugin of resolveOrder([...plugins.values()])) mount(plugin)
      return kernel
    },
    dispose: () => {
      for (const [name, cleanup] of [...disposers].reverse()) {
        try {
          cleanup()
        } catch (error) {
          notifyFailed(name, error)
        }
      }
      disposers.clear()
      started = false
    },
  }
  return kernel
}

/**
 * 取错误描述
 * @param error 异常对象
 * @returns 可展示的文本
 */
function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
