/**
 * 类型判定
 * 保持旧 isXxx 家族的判定口径，统一收口到一处，避免各模块各写一套
 */

/**
 * 判断是否为数组或普通对象
 * @param data 待判定值
 * @returns 是数组或普通对象时为 true
 * @example isAorO({}) // true
 */
export function isAorO(data: unknown): data is Record<string, unknown> | unknown[] {
  return isArray(data) || isObject(data)
}

/**
 * 判断是否为数组
 * @param data 待判定值
 * @returns 是数组时为 true
 * @example isArray([]) // true
 */
export function isArray(data: unknown): data is unknown[] {
  return Array.isArray(data)
}

/**
 * 判断是否为空白
 * 只把 null、undefined 与空字符串视为空白，0 与 false 不算
 * @param data 待判定值
 * @returns 为空白时为 true
 * @example isBlank('') // true
 */
export function isBlank(data: unknown): boolean {
  return !isSet(data) || data === ''
}

/**
 * 判断是否为 DOM 元素
 * window 与 document 一并视为可操作元素，便于 DOM 工具透传
 * @param data 待判定值
 * @returns 为元素时为 true
 * @example isElement(document.body) // true
 */
export function isElement(data: unknown): boolean {
  return data instanceof Element || data === window || data === document
}

/**
 * 判断是否为空值
 * 口径沿用旧实现：null、undefined、假值、空串、空数组、空对象都算空
 * @param data 待判定值
 * @returns 为空时为 true
 * @example isEmpty(0) // true
 */
export function isEmpty(data: unknown): boolean {
  switch (Object.prototype.toString.call(data)) {
    case '[object Null]':
    case '[object Undefined]':
      return true
    case '[object Boolean]':
    case '[object Number]':
      return !data
    case '[object String]': {
      // 纯数字字符串按数值零判断，其余按长度判断
      const text = String(data)
      const number = Number.parseInt(text, 10)
      return String(number) === text ? number === 0 : text.length === 0
    }
    case '[object Array]':
      return (data as readonly unknown[]).length === 0
    case '[object Object]':
      return Object.keys(data as object).length === 0
    default:
      return false
  }
}

/**
 * 判断是否为邮箱
 * @param data 待判定值
 * @returns 匹配邮箱格式时为 true
 * @example isEmail('a@b.com') // true
 */
export function isEmail(data: unknown): boolean {
  return typeof data === 'string' && /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(data)
}

/**
 * 判断是否为函数
 * @param data 待判定值
 * @returns 为函数时为 true
 * @example isFunction(() => {}) // true
 */
export function isFunction(data: unknown): boolean {
  return typeof data === 'function'
}

/**
 * 判断是否为 JSON 对象字符串
 * 只认可解析出对象或数组的字符串，避免把 '123' 当成 JSON
 * @param data 待判定值
 * @returns 可解析为对象或数组时为 true
 * @example isJson('{"a":1}') // true
 */
export function isJson(data: unknown): boolean {
  if (typeof data !== 'string') return false
  try {
    const parsed: unknown = JSON.parse(data)
    return typeof parsed === 'object' && parsed !== null
  } catch {
    return false
  }
}

/**
 * 判断是否为手机号
 * @param data 待判定值
 * @returns 匹配大陆手机号格式时为 true
 * @example isMobile('13800138000') // true
 */
export function isMobile(data: unknown): boolean {
  return typeof data === 'string' && /^1\d{10}$/.test(data)
}

/**
 * 判断是否为金额
 * 最多两位小数，不接受负号与千分位
 * @param data 待判定值
 * @returns 匹配金额格式时为 true
 * @example isMoney('12.50') // true
 */
export function isMoney(data: unknown): boolean {
  return typeof data === 'string' && /^(([1-9]\d*)|\d)(\.\d{1,2})?$/.test(data)
}

/**
 * 判断是否为 null
 * @param data 待判定值
 * @returns 为 null 时为 true
 * @example isNull(null) // true
 */
export function isNull(data: unknown): boolean {
  return data === null
}

/**
 * 判断是否为数字或数字字符串
 * 用数值全等判断，'1.0' 与 1 都算，'1a' 与 '' 都不算
 * @param data 待判定值
 * @returns 可无损转为数字时为 true
 * @example isNumeric('1.0') // true
 */
export function isNumeric(data: unknown): boolean {
  if (typeof data !== 'string' && typeof data !== 'number') return false
  const number = Number(data)
  return Number.parseFloat(String(data)) === number && !Number.isNaN(number)
}

/**
 * 判断是否为普通对象
 * 只认可字面量对象、Object.create(null) 与跨窗口对象，排除数组、Date、类实例
 * @param data 待判定值
 * @returns 为普通对象时为 true
 * @example isObject({}) // true
 */
export function isObject(data: unknown): data is Record<string, unknown> {
  if (Object.prototype.toString.call(data) !== '[object Object]') return false
  const proto: unknown = Object.getPrototypeOf(data)
  return proto === null || proto === Object.prototype
}

/**
 * 判断是否为已设置值
 * 与 isBlank 互补，null 与 undefined 之外都算已设置
 * @param data 待判定值
 * @returns 非 null 且非 undefined 时为 true
 * @example isSet(0) // true
 */
export function isSet(data: unknown): boolean {
  return data !== null && data !== undefined
}

/**
 * 判断是否为字符串
 * @param data 待判定值
 * @returns 为字符串时为 true
 * @example isString('') // true
 */
export function isString(data: unknown): data is string {
  return typeof data === 'string'
}

/**
 * 判断是否为 undefined
 * @param data 待判定值
 * @returns 为 undefined 时为 true
 * @example isUndefined(undefined) // true
 */
export function isUndefined(data: unknown): boolean {
  return data === undefined
}
