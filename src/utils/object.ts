/**
 * 对象工具
 * 深层覆盖、参数正交合并与字段路径读写
 */

import { JsonOp, MergeBlankAs, MergeDirection, MergeMissing, MergeNormalize, assertNever } from '../enums'
import { explode, json } from './text'
import { isAorO, isArray, isBlank, isNumeric, isObject, isSet, isString } from './type'

/** 参数表 */
export type Params = Record<string, unknown>

/** 合并选项 */
export interface MergeOptions {
  /** 原地写入目标对象，缺省为真 */
  mutate?: boolean
  /** 合并方向，缺省融合 */
  direction?: MergeDirection
  /** 缺失兜底，缺省忽略 */
  missing?: MergeMissing
  /** 空串归属，缺省视为有效值 */
  blankAs?: MergeBlankAs
  /** 合并后归一，缺省不处理 */
  normalize?: MergeNormalize
  /** 列表归一使用的分隔符，缺省逗号 */
  separator?: string
}

/** 合并上下文 */
interface MergeContext {
  /** 目标侧当前值 */
  current: unknown
  /** 来源侧新值 */
  incoming: unknown
  /** 目标侧是否缺失，含空串判定 */
  absent: boolean
  /** 来源侧是否缺失，含空串判定 */
  incomingAbsent: boolean
  /** 缺失兜底 */
  missing: MergeMissing
  /** 归一方向 */
  normalize: MergeNormalize
  /** 列表分隔符 */
  separator: string
}

/** 跳过写入标记 */
const SKIP = Symbol('skip')

/**
 * 深层覆盖
 * 来源值优先，双方都是容器且未到深度上限时继续下钻
 * @param target 目标值，容器时原地写入
 * @param source 来源值
 * @param limit 下钻深度，负数不限，0 表示只合当前层
 * @returns 合并结果，目标为容器时即为目标本身
 * @example cover({ a: 1 }, { a: 2, b: 3 }) // { a: 2, b: 3 }
 */
export function cover(target: unknown, source: unknown, limit = -1): unknown {
  // 每下钻一层消耗一层深度
  const depth = limit > 0 ? limit - 1 : limit
  if (!isAorO(target)) return source
  if (!isAorO(source)) return target
  const echo = target as Params
  for (const [key, value] of Object.entries(source)) {
    const current = echo[key]
    if (!isSet(current)) {
      echo[key] = value
    } else if (isAorO(value) && depth !== 0) {
      echo[key] = cover(current, value, depth)
    } else {
      echo[key] = value
    }
  }
  return echo
}

/**
 * 读取字段
 * 逐级取值，任一级缺失或为空串即返回空串，避免调用方到处判空
 * @param data 数据源
 * @param field 字段路径，按 joint 分隔
 * @param joint 路径分隔符，缺省 -_，即可同时用 - 与 _
 * @returns 末级取值，缺失时为空串
 * @example fieldRead({ a: { b: 1 } }, 'a-b') // 1
 */
export function fieldRead(data: unknown, field: string, joint = '-_'): unknown {
  let current = data
  for (const segment of splitField(joint, field)) {
    const next = isAorO(current) ? (current as Params)[segment] : undefined
    if (isBlank(next)) return ''
    current = next
  }
  return current
}

/**
 * 写入字段
 * 与 fieldRead 互逆，逐级包成嵌套对象
 * @param field 字段路径，按 joint 分隔
 * @param value 末级取值
 * @param joint 路径分隔符，缺省 -_
 * @returns 嵌套对象
 * @example fieldWrite('a-b', 1) // { a: { b: 1 } }
 */
export function fieldWrite(field: string, value: unknown, joint = '-_'): Params {
  const echo = splitField(joint, field)
    .reverse()
    .reduce<unknown>((carry, key) => ({ [key]: carry }), value)
  return isObject(echo) ? echo : {}
}

/**
 * 拆分字段路径
 * 分隔符按字符集解释，'-_' 表示连字符与下划线都可作层级分隔
 * @param joint 路径分隔符
 * @param field 字段路径
 * @returns 层级列表
 */
function splitField(joint: string, field: string): string[] {
  if (joint === '') return [field]
  const escaped = joint.replace(/[\\^$.*+?()[\]{}|-]/g, '\\$&')
  return explode(`[${escaped}]`, field, { regular: true })
}

/**
 * 合并多值
 * 首个数值入参视为下钻深度；未给深度时对全部入参从右向左归并
 * @param args 深度与待合并值
 * @returns 合并结果
 * @example mergeAll(1, { a: 1 }, { a: 2 }) // { a: 2 }
 */
export function mergeAll(...args: unknown[]): unknown {
  const [first, ...rest] = args
  const limited = isNumeric(first)
  const limit = limited ? Number(first) : -1
  const list = limited ? rest : args
  if (list.length === 0) return undefined
  if (list.length === 1) return list[0]
  const head = list[0]
  const tail = list.slice(1)
  const merged = tail.length === 1 ? tail[0] : mergeAll(limit, ...tail)
  return cover(head, merged, limit)
}

/**
 * 合并参数
 * 由方向、缺失兜底、空串归属、归一四维正交组合，取代原先的组合式模式码
 * @param target 目标参数，原地写入时为可写对象
 * @param source 来源，赋空方向下作为键名清单，其余方向下作为键值对
 * @param options 合并选项
 * @returns 合并结果，原地写入时即为目标本身
 * @example mergeParams({ a: 1 }, { a: 2, b: 3 }) // { a: 1, b: 3 }
 */
export function mergeParams(target: Params, source: unknown, options: MergeOptions = {}): Params {
  const mutate = options.mutate ?? true
  const direction = options.direction ?? MergeDirection.Fill
  const missing = options.missing ?? MergeMissing.Ignore
  const blankAs = options.blankAs ?? MergeBlankAs.Value
  const normalize = options.normalize ?? MergeNormalize.None
  const separator = options.separator ?? ','
  const echo = mutate ? target : {}
  for (const [key, incoming] of pairOf(source, direction)) {
    const context: MergeContext = {
      current: target[key],
      incoming,
      absent: false,
      incomingAbsent: false,
      missing,
      normalize,
      separator,
    }
    // 空串是否等同缺失由 blankAs 决定
    context.absent = !isSet(context.current) || (blankAs === MergeBlankAs.Missing && context.current === '')
    context.incomingAbsent = !isSet(incoming) || (blankAs === MergeBlankAs.Missing && incoming === '')
    const next = resolve(direction, context)
    if (next !== SKIP) echo[key] = next
  }
  return echo
}

/**
 * 按方向解析单个键的结果
 * @param direction 合并方向
 * @param context 合并上下文
 * @returns 写入值，或跳过标记
 */
function resolve(direction: MergeDirection, context: MergeContext): unknown {
  switch (direction) {
    case MergeDirection.Fill:
      // 旧值优先，缺失时才采用新值
      if (context.absent) {
        return context.incomingAbsent ? fallbackOf(context) : normalizeOf(context.incoming, context)
      }
      return normalizeOf(context.current, context)
    case MergeDirection.Cover:
      // 新值优先，新值缺失时旧值缺失才兜底
      if (!context.incomingAbsent) return normalizeOf(context.incoming, context)
      return context.absent ? fallbackOf(context) : SKIP
    case MergeDirection.Blank:
      // 只关心旧值是否缺失，从不写入新值
      if (context.absent) return fallbackOf(context)
      return normalizeOf(context.current, context)
    default:
      return assertNever(direction, 'MergeDirection')
  }
}

/**
 * 计算缺失兜底值
 * @param context 合并上下文
 * @returns 兜底值，或跳过标记
 */
function fallbackOf(context: MergeContext): unknown {
  switch (context.missing) {
    case MergeMissing.Ignore:
      return SKIP
    case MergeMissing.Null:
      // 置空仍走归一，使 JSON 字段归一后保持数组形态
      return normalizeOf(null, context)
    case MergeMissing.Empty:
      // 空容器形态跟随归一，列表归一给数组，其余给对象
      return context.normalize === MergeNormalize.List ? [] : {}
    default:
      return assertNever(context.missing, 'MergeMissing')
  }
}

/**
 * 对单值施加归一
 * @param value 待归一值
 * @param context 合并上下文
 * @returns 归一结果
 */
function normalizeOf(value: unknown, context: MergeContext): unknown {
  switch (context.normalize) {
    case MergeNormalize.None:
      return value
    case MergeNormalize.Json:
      return json(value, JsonOp.Decode)
    case MergeNormalize.List:
      if (isString(value) || isNumeric(value)) return explode(context.separator, value)
      return isArray(value) ? value : []
    default:
      return assertNever(context.normalize, 'MergeNormalize')
  }
}

/**
 * 取出待处理的键值对
 * 赋空方向把来源当作键名清单，其余方向按键值对处理
 * @param source 来源
 * @param direction 合并方向
 * @returns 键值对列表
 */
function pairOf(source: unknown, direction: MergeDirection): Array<[string, unknown]> {
  if (direction === MergeDirection.Blank) {
    const names = isArray(source) ? source : isObject(source) ? Object.values(source) : []
    return names.map((name): [string, unknown] => [String(name), undefined])
  }
  if (isObject(source)) return Object.entries(source)
  if (isArray(source)) return source.map((item, index): [string, unknown] => [String(index), item])
  return []
}
