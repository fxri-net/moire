/**
 * 文本工具
 * 字符串拆分、组合、JSON 归一与查询串编解码
 */

import { JsonOp, PadSide, assertNever } from '../enums'
import { isAorO, isArray, isJson, isNumeric, isObject, isSet, isString } from './type'

/** 查询串容器 */
type Query = Record<string, unknown>

/** 拆分选项 */
export interface ExplodeOptions {
  /** 保留段数：正数从头保留、负数从尾保留、0 表示不拆分 */
  limit?: number
  /** 分隔符按正则表达式解释 */
  regular?: boolean
}

/** 填充选项 */
export interface PadOptions {
  /** 填充方向，缺省右侧对齐 */
  side?: PadSide
  /** 填充字符，缺省空格 */
  with?: string
}

/**
 * 拆分字符串
 * 数字化入参先转字符串再拆，空值按单个空串返回，避免调用方到处判空
 * @param separator 分隔符，regular 为真时按正则解释
 * @param data 待拆分数据
 * @param options 拆分选项
 * @returns 拆分结果，元素一律为字符串
 * @example explode('?', '/a?b=1', { limit: 2 }) // ['/a', 'b=1']
 */
export function explode(separator: string, data: unknown, options: ExplodeOptions = {}): string[] {
  // 数组与对象直接按元素转换，避免被当成字符串拆开
  if (isArray(data)) return data.map((item) => String(item))
  if (!isSet(data)) return ['']
  if (!isString(data) && !isNumeric(data)) return [String(data)]

  const text = String(data)
  const parts = text.split(options.regular === true ? new RegExp(separator, 'g') : separator)
  const limit = options.limit
  if (limit === undefined) return parts
  if (limit === 0) return [text]
  if (limit > 0) {
    // 超出段数的部分并回最后一段，首段优先
    if (parts.length <= limit) return parts
    const head = parts.slice(0, limit - 1)
    const tail = parts.slice(limit - 1).join(separator)
    return [...head, tail]
  }
  // 负数表示从尾部保留
  return parts.slice(0, limit)
}

/**
 * 组合字符串
 * @param separator 分隔符
 * @param data 待组合数据，对象按值组合
 * @returns 组合结果
 * @example implode('-', ['a', 'b']) // 'a-b'
 */
export function implode(separator: string, data: unknown): string {
  if (isObject(data)) return Object.values(data).join(separator)
  if (isArray(data)) return data.join(separator)
  return isSet(data) ? String(data) : ''
}

/**
 * 归一 JSON
 * 编码时已是 JSON 字符串则原样返回；解码时字符串按查询串或 JSON 解析，标量包成单元素数组
 * @param data 待处理数据
 * @param op 处理方向
 * @returns 处理结果
 * @example json('[1,2]', JsonOp.Decode) // [1, 2]
 */
export function json(data: unknown, op: JsonOp): unknown {
  switch (op) {
    case JsonOp.Encode:
      return isJson(data) ? data : JSON.stringify(data)
    case JsonOp.Decode: {
      if (isString(data) && isJson(data)) return JSON.parse(data)
      if (isObject(data)) return Object.values(data)
      if (isString(data)) return strDecode(data)
      if (isArray(data)) return data
      return isSet(data) ? [data] : []
    }
    default:
      return assertNever(op, 'JsonOp')
  }
}

/**
 * 替换字符串
 * @param pattern 正则表达式原文，统一按全局匹配
 * @param replacement 替换内容，支持 $1 等分组引用
 * @param value 待替换数据，非字符串先转字符串
 * @returns 替换结果
 * @example replace('^a', 'b', 'abc') // 'bbc'
 */
export function replace(pattern: string, replacement: string, value: unknown): string {
  return String(value).replace(new RegExp(pattern, 'g'), replacement)
}

/**
 * 解码查询串
 * 支持 a[b][]=1 形式的多级结构，同一层的 [] 按出现顺序追加
 * @param data 查询串，可带前导问号以外任意文本
 * @returns 解析后的参数对象
 * @example strDecode('a=1&b[]=2') // { a: '1', b: ['2'] }
 */
export function strDecode(data: unknown): Query {
  const echo: Query = {}
  if (!isString(data) || data === '') return echo

  for (const pair of data.split('&')) {
    if (pair === '') continue
    const index = pair.indexOf('=')
    const rawKey = index < 0 ? pair : pair.slice(0, index)
    const rawValue = index < 0 ? undefined : pair.slice(index + 1)
    // 键与值都缺的片段视为噪声
    if (rawKey === '' && !isSet(rawValue)) continue
    const segments = splitPath(safeDecode(rawKey))
    if (segments.length === 0) continue
    writePath(
      segments,
      rawValue === undefined ? undefined : safeDecode(rawValue),
      () => echo,
      () => undefined,
    )
  }
  return echo
}

/**
 * 编码查询串
 * 对象按键名展开为 [key]，数组展开为 []，便于服务端按同名规则还原
 * @param data 参数对象
 * @returns 查询串，不含前导问号
 * @example strEncode({ a: 1, b: ['2'] }) // 'a=1&b[]=2'
 */
export function strEncode(data: unknown): string {
  if (!isAorO(data)) return isSet(data) ? String(data) : ''
  const echo: string[] = []
  for (const [key, value] of Object.entries(data)) {
    for (const part of encodeValue(value)) echo.push(`${key}${part}`)
  }
  return echo.join('&')
}

/**
 * 填充字符串
 * @param value 原字符串，非字符串先转字符串
 * @param length 目标长度，不足时原样返回
 * @param options 填充选项
 * @returns 填充结果
 * @example strPad(7, 3, { with: '0' }) // '007'
 */
export function strPad(value: string | number | null | undefined, length: number, options: PadOptions = {}): string {
  const text = String(value ?? '')
  const filler = options.with ?? ' '
  const side = options.side ?? PadSide.Right
  switch (side) {
    case PadSide.Left:
      // 左对齐：补在右侧
      return text.padEnd(length, filler)
    case PadSide.Right:
      return text.padStart(length, filler)
    case PadSide.Both: {
      // 先按余数的一半补左侧，再补齐右侧
      const half = text.padStart(Math.floor((length - text.length) / 2) + text.length, filler)
      return half.padEnd(length, filler)
    }
    default:
      return assertNever(side, 'PadSide')
  }
}

/**
 * 数组去重
 * @param values 待去重数组，按严格相等判断
 * @returns 去重后的新数组，保留首次出现的顺序
 * @example unique([1, '1', 1]) // [1, '1']
 */
export function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)]
}

/**
 * 递归编码单个值
 * 标量以等号开头，便于上层直接拼接键名
 * @param value 待编码值
 * @returns 编码片段
 */
function encodeValue(value: unknown): string[] {
  if (!isAorO(value)) {
    return [`=${encodeURIComponent(isSet(value) ? String(value) : '')}`]
  }
  const echo: string[] = []
  // 数组用空方括号，对象用实际键名
  const prefix = isObject(value) ? undefined : '[]'
  for (const [key, item] of Object.entries(value)) {
    for (const part of encodeValue(item)) {
      echo.push(`${prefix ?? `[${key}]`}${part}`)
    }
  }
  return echo
}

/**
 * 拆分键路径
 * a[b][] 拆为 a、b、空串三级，空串代表数组追加
 * @param key 已解码的键名
 * @returns 层级列表
 */
function splitPath(key: string): string[] {
  const segments: string[] = []
  const head = /^[^[]*/.exec(key)?.[0] ?? ''
  if (head !== '') segments.push(head)
  for (const match of key.matchAll(/\[([^\]]*)\]/g)) segments.push(match[1] ?? '')
  return segments
}

/**
 * 解码单个片段
 * 非法百分号编码按原文保留，避免整条查询串解析中断
 * @param value 原始片段
 * @returns 解码结果
 */
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * 写入层级路径
 * 通过读写回调在父容器上落位，遇到类型不符时就地换容器
 * @param segments 层级列表
 * @param value 写入值
 * @param read 读取当前容器
 * @param write 回写新容器
 */
function writePath(segments: readonly string[], value: unknown, read: () => unknown, write: (next: unknown) => void): void {
  const [segment = '', ...rest] = segments
  if (segment === '') {
    // 数组追加：非数组时先换成数组
    const current = read()
    const list = isArray(current) ? current : []
    if (!isArray(current)) write(list)
    if (rest.length === 0) {
      list.push(value)
      return
    }
    const child = createContainer(rest)
    list.push(child)
    writePath(
      rest,
      value,
      () => child,
      (next) => {
        list[list.length - 1] = next
      },
    )
    return
  }
  const current = read()
  const record = isObject(current) ? current : {}
  if (!isObject(current)) write(record)
  if (rest.length === 0) {
    record[segment] = value
    return
  }
  writePath(
    rest,
    value,
    () => record[segment],
    (next) => {
      record[segment] = next
    },
  )
}

/**
 * 按下一层级推断容器形态
 * @param rest 剩余层级
 * @returns 空对象或空数组
 */
function createContainer(rest: readonly string[]): Query | unknown[] {
  return rest[0] === '' ? [] : {}
}
