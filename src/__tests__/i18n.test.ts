/**
 * 国际化单测
 * 语言归一、回退链、具名插值与实例隔离
 */

import { createI18n } from '../i18n'

describe('createI18n', () => {
  it('按语言取内置词条', () => {
    expect(createI18n({ locale: 'en-us' }).t('http.failed')).toBe('System error')
    expect(createI18n({ locale: 'zh-cn' }).t('http.failed')).toBe('系统异常')
  })

  it('语言标识归一为内置语言', () => {
    expect(createI18n({ locale: 'zh_CN' }).locale).toBe('zh-cn')
    expect(createI18n({ locale: 'en-GB' }).locale).toBe('en-us')
    expect(createI18n({ locale: 'ja-jp' }).locale).toBe('ja-jp')
  })

  it('未命中时回退到第一语言，仍缺失则返回键名', () => {
    const i18n = createI18n({ locale: 'en-us' })
    expect(i18n.t('kernel.plugin.exists', { name: 'a' })).toBe('Plugin a is already registered')
    expect(i18n.t('not.exists')).toBe('not.exists')
  })

  it('按名插值，未提供的名字原样保留', () => {
    const i18n = createI18n({ locale: 'zh-cn' })
    expect(i18n.t('kernel.plugin.missing', { name: 'a', depends: 'b' })).toBe('插件 a 依赖的 b 未注册')
    expect(i18n.t('kernel.plugin.missing', { name: 'a' })).toBe('插件 a 依赖的 {depends} 未注册')
  })

  it('组合分隔符随语言变化', () => {
    expect(createI18n({ locale: 'zh-cn' }).join(['1', '秒'])).toBe('1秒')
    expect(createI18n({ locale: 'en-us' }).join(['1', 's'])).toBe('1 s')
  })

  it('可切换语言与追加自定义词条', () => {
    const i18n = createI18n({ locale: 'zh-cn' })
    i18n.setLocale('en-US')
    expect(i18n.locale).toBe('en-us')
    i18n.extend('en-us', { 'custom.key': 'custom {value}' })
    expect(i18n.t('custom.key', { value: 1 })).toBe('custom 1')
  })

  it('实例之间词条互不污染', () => {
    const first = createI18n({ locale: 'zh-cn' })
    const second = createI18n({ locale: 'zh-cn' })
    first.extend('zh-cn', { 'custom.key': '仅首个实例' })
    expect(first.t('custom.key')).toBe('仅首个实例')
    expect(second.t('custom.key')).toBe('custom.key')
  })

  it('构造时可通过 extra 预置词条', () => {
    expect(createI18n({ locale: 'zh-cn', extra: { 'zh-cn': { 'custom.key': '预置' } } }).t('custom.key')).toBe('预置')
  })
})
