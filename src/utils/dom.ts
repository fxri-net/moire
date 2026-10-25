/**
 * 元素工具
 * 行内样式读写与层叠层级探测
 */

import { isArray, isObject } from './type'

/** 样式表 */
export type Styles = Record<string, string>

/**
 * 读取或设置行内样式
 * 样式名同时兼容小驼峰与短横线写法
 * @param elem 目标元素，数组取首个
 * @param name 样式名或样式表
 * @param value 样式值，缺省时读取计算样式
 * @returns 读取时返回计算值，设置时无返回
 * @example css(elem, 'fontSize', '14px')
 */
export function css(elem: unknown, name: string | Styles, value?: string): string | undefined {
  const target = pick(elem)
  if (!target) return undefined
  if (isObject(name)) {
    for (const [key, item] of Object.entries(name)) target.style.setProperty(hyphenate(key), item)
    return undefined
  }
  if (value === undefined) return window.getComputedStyle(target).getPropertyValue(hyphenate(name))
  target.style.setProperty(hyphenate(name), value)
  return undefined
}

/**
 * 探测最大层叠层级
 * 同时兼顾宿主页面，跨域父窗口不可访问时自动跳过
 * @returns 最大层级，无有效值时为零
 * @example maxZIndex() // 1997
 */
export function maxZIndex(): number {
  const outer = parentDocument()
  return Math.max(0, maxZIndexIn(document), outer ? maxZIndexIn(outer) : 0)
}

/**
 * 取首个元素
 * @param elem 元素或其数组
 * @returns 命中的元素
 */
function pick(elem: unknown): HTMLElement | undefined {
  if (elem instanceof HTMLElement) return elem
  if (!isArray(elem)) return undefined
  const [first] = elem
  return first instanceof HTMLElement ? first : undefined
}

/**
 * 转换样式名
 * 小驼峰统一为短横线写法，自定义属性原样保留
 * @param name 样式名
 * @returns 短横线写法
 */
function hyphenate(name: string): string {
  if (name.startsWith('--')) return name
  return name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

/**
 * 探测文档内最大层叠层级
 * @param doc 目标文档
 * @returns 最大层级，无有效值时为零
 */
function maxZIndexIn(doc: Document): number {
  let max = 0
  for (const elem of doc.querySelectorAll('body *')) {
    const style = doc.defaultView?.getComputedStyle(elem)
    // 只有参与层叠定位的元素才计入
    if (!style || style.position === 'static') continue
    const zIndex = Number.parseInt(style.zIndex, 10)
    if (zIndex > max) max = zIndex
  }
  return max
}

/**
 * 取宿主文档
 * @returns 宿主文档，同窗或跨域时为空
 */
function parentDocument(): Document | undefined {
  try {
    const parent = window.parent
    return parent === window ? undefined : parent.document
  } catch {
    return undefined
  }
}
