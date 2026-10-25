/**
 * 内核单测
 * 注册、依赖排序、错误边界、通知分发与逆序卸载
 */

import { i18n } from '../i18n'
import { createKernel } from '../kernel/kernel'
import type { MoirePlugin, Notice } from '../kernel/types'

/**
 * 构造记录调用顺序的插件
 * @param name 插件名
 * @param log 调用记录
 * @param depends 依赖的插件名
 * @returns 插件实例
 */
function plugin(name: string, log: string[], depends?: string[]): MoirePlugin {
  const echo: MoirePlugin = {
    name,
    setup: () => {
      log.push(`setup:${name}`)
    },
    dispose: () => {
      log.push(`dispose:${name}`)
    },
  }
  return depends ? { ...echo, depends } : echo
}

describe('内核装配', () => {
  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('依赖优先装配，与注册顺序无关', () => {
    const log: string[] = []
    createKernel()
      .use(plugin('b', log, ['a']))
      .use(plugin('a', log))
      .start()
    expect(log).toEqual(['setup:a', 'setup:b'])
  })

  it('同层保持注册顺序', () => {
    const log: string[] = []
    createKernel().use(plugin('a', log)).use(plugin('b', log)).start()
    expect(log).toEqual(['setup:a', 'setup:b'])
  })

  it('重复注册即抛错', () => {
    const log: string[] = []
    const kernel = createKernel().use(plugin('a', log))
    expect(() => kernel.use(plugin('a', log))).toThrow('插件 a 已注册，不可重复注册')
  })

  it('依赖缺失时在装配前拦截', () => {
    const log: string[] = []
    expect(() =>
      createKernel()
        .use(plugin('a', log, ['ghost']))
        .start(),
    ).toThrow('插件 a 依赖的 ghost 未注册')
  })

  it('依赖成环时抛错', () => {
    const log: string[] = []
    const kernel = createKernel()
      .use(plugin('a', log, ['b']))
      .use(plugin('b', log, ['a']))
    expect(() => kernel.start()).toThrow('存在循环依赖')
  })

  it('重复启动不会重复装配', () => {
    const log: string[] = []
    createKernel().use(plugin('a', log)).start().start()
    expect(log).toEqual(['setup:a'])
  })

  it('单插件装配失败只通知，不中断其余插件', () => {
    const notices: Notice[] = []
    const log: string[] = []
    const broken: MoirePlugin = {
      name: 'broken',
      setup: () => {
        throw new Error('boom')
      },
    }
    createKernel({ notify: (notice) => notices.push(notice) })
      .use(broken)
      .use(plugin('ok', log))
      .start()
    expect(log).toEqual(['setup:ok'])
    expect(notices[0]?.message).toBe('插件 broken 装配失败：boom')
  })

  it('卸载按装配逆序执行', () => {
    const log: string[] = []
    const kernel = createKernel()
      .use(plugin('a', log))
      .use(plugin('b', log, ['a']))
    kernel.start()
    log.length = 0
    kernel.dispose()
    expect(log).toEqual(['dispose:b', 'dispose:a'])
  })

  it('启动后注册的插件立即装配', () => {
    const log: string[] = []
    const kernel = createKernel().use(plugin('a', log)).start()
    kernel.use(plugin('b', log, ['a']))
    expect(log).toEqual(['setup:a', 'setup:b'])
  })

  it('启动后注册缺依赖即报错', () => {
    const log: string[] = []
    const kernel = createKernel().start()
    expect(() => kernel.use(plugin('a', log, ['ghost']))).toThrow('插件 a 依赖的 ghost 未注册')
  })
})

describe('内核上下文', () => {
  it('可按名取回已注册插件', () => {
    const log: string[] = []
    const target = plugin('a', log)
    expect(createKernel().use(target).context.get('a')).toBe(target)
    expect(createKernel().context.get('none')).toBeUndefined()
  })

  it('通知分发给全部订阅者，退订后不再收到', () => {
    const kernel = createKernel()
    const first: string[] = []
    const second: string[] = []
    const off = kernel.context.subscribe((notice) => first.push(notice.message))
    kernel.context.subscribe((notice) => second.push(notice.message))
    kernel.context.notify({ message: 'hi' })
    off()
    kernel.context.notify({ message: 'bye' })
    expect(first).toEqual(['hi'])
    expect(second).toEqual(['hi', 'bye'])
  })
})
