/**
 * 国际化
 * 键化文案、具名插值与片段组合
 */

import type { Messages } from './messages'
import { locales, messages } from './messages'

export type { Locale, Messages } from './messages'

/** 插值参数 */
export type Interpolation = Record<string, string | number>

/** 国际化选项 */
export interface I18nOptions {
  /** 初始语言，缺省取文档或浏览器语言 */
  locale?: string
  /** 追加词条，按语言合并进内置词条 */
  extra?: Record<string, Messages>
}

/** 国际化实例 */
export interface I18n {
  /** 当前语言 */
  readonly locale: string
  /** 取词条并按名插值，未命中时回退到第一语言再回退到键名 */
  t(key: string, params?: Interpolation): string
  /** 组合片段，分隔符随语言变化 */
  join(parts: readonly string[]): string
  /** 切换语言 */
  setLocale(locale: string): void
  /** 追加词条 */
  extend(locale: string, extra: Messages): void
}

/**
 * 创建国际化实例
 * 每个实例持有独立词条副本，避免业务追加词条时相互污染
 * @param options 国际化选项
 * @returns 国际化实例
 * @example createI18n({ locale: 'en-us' }).t('http.failed') // 'System error'
 */
export function createI18n(options: I18nOptions = {}): I18n {
  const dictionary: Record<string, Messages> = {}
  for (const locale of locales) dictionary[locale] = { ...messages[locale] }
  for (const [locale, extra] of Object.entries(options.extra ?? {})) {
    dictionary[locale] = { ...dictionary[locale], ...extra }
  }
  let current = normalizeLocale(options.locale ?? detectLocale())
  const translate = (key: string, params?: Interpolation): string => {
    const text = dictionary[current]?.[key] ?? dictionary[locales[0]]?.[key] ?? key
    return interpolate(text, params)
  }
  return {
    get locale() {
      return current
    },
    t: translate,
    join: (parts) => parts.join(translate('separator.join')),
    setLocale: (locale) => {
      current = normalizeLocale(locale)
    },
    extend: (locale, extra) => {
      dictionary[locale] = { ...dictionary[locale], ...extra }
    },
  }
}

/**
 * 探测运行环境语言
 * @returns 文档声明语言，缺省取浏览器语言
 */
function detectLocale(): string {
  const declared = typeof document === 'undefined' ? '' : document.documentElement.lang
  if (declared !== '') return declared
  return typeof navigator === 'undefined' ? '' : navigator.language
}

/**
 * 按名插值
 * @param text 词条原文
 * @param params 插值参数
 * @returns 插值结果，未提供的名字原样保留
 */
function interpolate(text: string, params?: Interpolation): string {
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (whole: string, name: string) => {
    const value = params[name]
    return value === undefined ? whole : String(value)
  })
}

/**
 * 归一语言标识
 * 中文与英文收敛到内置语言，其余原样保留以便业务自定义
 * @param locale 语言标识
 * @returns 归一结果
 */
function normalizeLocale(locale: string): string {
  const next = locale.trim().toLowerCase().replace(/_/g, '-')
  if (next.startsWith('zh')) return 'zh-cn'
  if (next.startsWith('en')) return 'en-us'
  return next === '' ? locales[0] : next
}

/** 默认实例 */
export const i18n = createI18n()
