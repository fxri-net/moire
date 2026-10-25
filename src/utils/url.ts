/**
 * 地址工具
 * 查询参数的组装、追加与读取
 */

import { UrlMode } from '../enums'
import type { Params } from './object'
import { explode, strDecode, strEncode } from './text'
import { isObject, isString } from './type'

/** 地址选项 */
export interface UrlOptions {
  /** 地址模式，缺省读取 */
  mode?: UrlMode
  /** 目标地址，缺省取当前页面 */
  url?: string
  /** 读取模式下的参数名，给定时只返回该参数值 */
  name?: string
  /** 待合并的参数，可为查询串 */
  param?: unknown
  /** 取址窗口，缺省当前窗口 */
  window?: Window
}

/**
 * 组装、追加或读取地址参数
 * @param options 地址选项
 * @returns 组装与追加返回地址字符串，读取返回参数对象或单个参数值
 * @example url({ mode: UrlMode.Append, param: { page: 1 } }) // '/list?page=1'
 */
export function url(options: UrlOptions = {}): string | Params | undefined {
  const context = options.window ?? window
  const incoming = paramOf(options.param)
  switch (options.mode ?? UrlMode.Read) {
    case UrlMode.Build: {
      // 组装：显式参数优先于当前地址已有参数
      const merged = { ...strDecode(splitQuery(context.location.href).query), ...incoming }
      return appendUrl(options.url ?? context.location.pathname, merged)
    }
    case UrlMode.Append:
      return appendUrl(options.url ?? context.location.pathname, incoming)
    case UrlMode.Read: {
      const merged = { ...strDecode(splitQuery(options.url ?? context.location.href).query), ...incoming }
      if (options.name !== undefined && options.name !== '') return merged[options.name] as string | Params | undefined
      return merged
    }
    default:
      return undefined
  }
}

/**
 * 归一参数入参
 * 查询串解码为参数对象，对象直接采用，其余视为无参数
 * @param param 参数入参
 * @returns 参数对象
 */
function paramOf(param: unknown): Params {
  if (isString(param)) return strDecode(param)
  return isObject(param) ? param : {}
}

/**
 * 把参数拼到地址上
 * @param target 目标地址，可已带查询串
 * @param params 待并入参数
 * @returns 完整地址
 */
function appendUrl(target: string, params: Params): string {
  const { path, query } = splitQuery(target)
  const encoded = strEncode({ ...strDecode(query), ...params })
  return encoded === '' ? path : `${path}?${encoded}`
}

/**
 * 拆分地址与查询串
 * @param target 目标地址
 * @returns 路径与查询串
 */
function splitQuery(target: string): { path: string; query: string } {
  const [path = '', query = ''] = explode('?', target, { limit: 2 })
  return { path, query }
}
