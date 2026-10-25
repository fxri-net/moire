/**
 * 入口单测
 * 校验全局挂载、内置插件装配与能力暴露
 */

import '../entries/index'
import type { Moire } from '../entries/index'

/**
 * 取已挂载的框架实例
 * @returns 框架实例
 */
function entry(): Moire {
  const app = window.moire
  if (app === undefined) throw new Error('入口未挂载')
  return app
}

describe('浏览器入口', () => {
  it('挂载单一全局对象，版本与内核一致', () => {
    const app = entry()
    expect(app.version).toBe(app.context.version)
    expect(app.version.length).toBeGreaterThan(0)
  })

  it('暴露枚举、工具函数、国际化、请求与界面适配', () => {
    const app = entry()
    expect(app.enum.FieldKind).toBeDefined()
    expect(typeof app.utils.isString).toBe('function')
    expect(typeof app.i18n.t).toBe('function')
    expect(typeof app.http.request).toBe('function')
    expect(typeof app.ui.notice).toBe('function')
  })

  it('内置字段、视图与工具插件已装配', () => {
    const app = entry()
    expect(app.fields.renderers.size).toBeGreaterThan(0)
    expect(typeof app.views.list.assemble).toBe('function')
    expect(typeof app.views.form.assemble).toBe('function')
    expect(typeof app.tools.run).toBe('function')
  })

  it('运行时注册的插件立即装配', () => {
    const app = entry()
    let ready = false
    const next = app.use({
      name: 'demo',
      setup: () => {
        ready = true
      },
    })
    expect(ready).toBe(true)
    expect(next).toBe(app)
  })

  it('重复启动返回同一实例', () => {
    const app = entry()
    expect(app.start()).toBe(app)
  })
})
