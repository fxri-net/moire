/**
 * 请求客户端
 * 基于 fetch 的轻量封装，统一查询串拼接、JSON 提交与业务码归一
 */

import { i18n } from '../i18n'
import { strEncode } from '../utils/text'
import { isNumeric, isObject, isSet, isString } from '../utils/type'
import type { HttpClient, HttpOptions, HttpRequest, HttpResult } from './types'

/** 成功业务码 */
const OK_CODE = 200

/**
 * 创建请求客户端
 * @param options 客户端选项
 * @returns 请求客户端
 * @example createHttp({ baseUrl: '/api' }).request({ url: '/list', method: 'POST' })
 */
export function createHttp(options: HttpOptions = {}): HttpClient {
  const send: typeof fetch = options.fetch ?? ((input, init) => fetch(input, init))
  return {
    request: async <T = unknown>(input: HttpRequest): Promise<HttpResult<T>> => {
      let config = withDefaults(input, options)
      if (options.request) config = await options.request(config)
      let raw: unknown
      let status: number
      try {
        const response = await send(config.url, toInit(config))
        status = response.status
        raw = await readPayload(response)
      } catch {
        // 网络层失败统一给出可展示文案，细节由调用方按需记录
        const failure = new Error(i18n.t('http.network'))
        options.error?.(failure)
        throw failure
      }
      let result = normalize(raw, status)
      if (options.response) result = await options.response(result)
      return result as HttpResult<T>
    },
  }
}

/**
 * 并入基础地址、固定请求头与查询参数
 * @param input 原始请求
 * @param options 客户端选项
 * @returns 补全后的请求
 */
function withDefaults(input: HttpRequest, options: HttpOptions): HttpRequest {
  const echo: HttpRequest = { ...input }
  if (options.baseUrl !== undefined && options.baseUrl !== '') echo.url = joinUrl(options.baseUrl, input.url)
  if (isSet(input.query)) echo.url = appendQuery(echo.url, input.query)
  const headers = { ...options.headers, ...input.headers }
  if (Object.keys(headers).length > 0) echo.headers = headers
  return echo
}

/**
 * 拼接查询参数
 * @param target 目标地址
 * @param query 查询参数
 * @returns 完整地址
 */
function appendQuery(target: string, query: unknown): string {
  const encoded = strEncode(query)
  if (encoded === '') return target
  return `${target}${target.includes('?') ? '&' : '?'}${encoded}`
}

/**
 * 拼接地址
 * @param base 基础地址
 * @param path 相对地址或绝对地址
 * @returns 完整地址
 */
function joinUrl(base: string, path: string): string {
  // 绝对地址不再拼基础地址
  if (/^[a-z][\d+.a-z-]*:/i.test(path)) return path
  const left = base.endsWith('/') ? base.slice(0, -1) : base
  return `${left}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * 归一响应
 * @param raw 原始响应体
 * @param status HTTP 状态码
 * @returns 归一结果
 */
function normalize(raw: unknown, status: number): HttpResult {
  const record = isObject(raw) ? raw : {}
  const code = isNumeric(record['code']) ? Number(record['code']) : status
  return {
    ok: code === OK_CODE,
    code,
    message: messageOf(record, code),
    data: isSet(record['data']) ? record['data'] : raw,
    raw,
  }
}

/**
 * 取业务消息
 * @param record 响应体
 * @param code 业务码
 * @returns 业务消息，失败且未给消息时用内置文案
 */
function messageOf(record: Record<string, unknown>, code: number): string {
  for (const key of ['msg', 'message']) {
    const value = record[key]
    if (isString(value) && value !== '') return value
  }
  return code === OK_CODE ? '' : i18n.t('http.failed')
}

/**
 * 读取响应体
 * 非 JSON 响应原样返回文本，避免解析异常吞掉服务端提示
 * @param response 响应对象
 * @returns 解析结果
 */
async function readPayload(response: Response): Promise<unknown> {
  const text = await response.text()
  if (text === '') return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

/**
 * 转换为 fetch 入参
 * @param config 请求配置
 * @returns fetch 入参
 */
function toInit(config: HttpRequest): RequestInit {
  const headers: Record<string, string> = { Accept: 'application/json', ...config.headers }
  const init: RequestInit = { method: config.method ?? 'GET', headers }
  if (isSet(config.body)) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
    init.body = JSON.stringify(config.body)
  }
  if (config.signal) init.signal = config.signal
  return init
}
