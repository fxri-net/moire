/**
 * 请求客户端单测
 * 注入 fetch 替身，覆盖结果归一、地址拼接、请求体与钩子
 */

import { i18n } from '../i18n'
import { createHttp } from '../http/client'

/** 请求记录 */
interface Call {
  /** 请求地址 */
  url: string
  /** 请求配置 */
  init: RequestInit | undefined
}

/**
 * 构造响应替身
 * @param body 响应文本
 * @param status HTTP 状态码
 * @returns 仅含 status 与 text 的响应
 */
function respond(body: string, status = 200): Response {
  return { status, text: () => Promise.resolve(body) } as unknown as Response
}

/**
 * 取请求地址文本
 * @param input fetch 入参
 * @returns 地址文本
 */
function urlOf(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  return input.url
}

/**
 * 构造带请求记录的 fetch 替身
 * @param body 响应文本
 * @param status HTTP 状态码
 * @returns fetch 替身与请求记录
 */
function stubFetch(body: string, status = 200): { calls: Call[]; fetch: typeof fetch } {
  const calls: Call[] = []
  const fake: typeof fetch = (input, init) => {
    calls.push({ url: urlOf(input), init })
    return Promise.resolve(respond(body, status))
  }
  return { calls, fetch: fake }
}

beforeEach(() => {
  i18n.setLocale('zh-cn')
})

describe('结果归一', () => {
  it('业务码 200 视为成功并取 data', async () => {
    const body = { code: 200, msg: 'ok', data: { id: 1 } }
    const stub = stubFetch(JSON.stringify(body))
    const result = await createHttp({ fetch: stub.fetch }).request({ url: '/a' })
    expect(result).toEqual({ ok: true, code: 200, message: 'ok', data: { id: 1 }, raw: body })
  })

  it('业务码非 200 视为失败并取 msg', async () => {
    const stub = stubFetch(JSON.stringify({ code: -1, msg: '账号已存在' }))
    const result = await createHttp({ fetch: stub.fetch }).request({ url: '/a' })
    expect(result.ok).toBe(false)
    expect(result.code).toBe(-1)
    expect(result.message).toBe('账号已存在')
  })

  it('无 code 时取 HTTP 状态码', async () => {
    const okay = stubFetch('{"data":1}')
    expect((await createHttp({ fetch: okay.fetch }).request({ url: '/a' })).code).toBe(200)

    const failed = stubFetch('{"data":1}', 500)
    const result = await createHttp({ fetch: failed.fetch }).request({ url: '/a' })
    expect(result.ok).toBe(false)
    expect(result.code).toBe(500)
    expect(result.message).toBe('系统异常')
  })

  it('非 JSON 文本原样返回', async () => {
    const stub = stubFetch('<html>boom</html>', 502)
    const result = await createHttp({ fetch: stub.fetch }).request({ url: '/a' })
    expect(result.ok).toBe(false)
    expect(result.code).toBe(502)
    expect(result.raw).toBe('<html>boom</html>')
    expect(result.data).toBe('<html>boom</html>')
  })

  it('空响应体归一为 null', async () => {
    const stub = stubFetch('')
    const result = await createHttp({ fetch: stub.fetch }).request({ url: '/a' })
    expect(result.raw).toBeNull()
    expect(result.data).toBeNull()
    expect(result.ok).toBe(true)
  })

  it('网络异常时上报并抛出可展示文案', async () => {
    const errors: Error[] = []
    const client = createHttp({
      fetch: () => Promise.reject(new Error('down')),
      error: (error) => {
        errors.push(error)
      },
    })
    await expect(client.request({ url: '/a' })).rejects.toThrow('网络异常，请稍后重试')
    expect(errors).toHaveLength(1)
  })
})

describe('地址拼接', () => {
  it('拼入基础地址并追加查询参数', async () => {
    const stub = stubFetch('{}')
    await createHttp({ baseUrl: '/api/', fetch: stub.fetch }).request({ url: 'list', query: { page: 1 } })
    expect(stub.calls[0]?.url).toBe('/api/list?page=1')
  })

  it('已有查询串时用与号衔接', async () => {
    const stub = stubFetch('{}')
    await createHttp({ fetch: stub.fetch }).request({ url: '/list?page=1', query: { size: 10 } })
    expect(stub.calls[0]?.url).toBe('/list?page=1&size=10')
  })

  it('无查询参数时保留原地址', async () => {
    const stub = stubFetch('{}')
    await createHttp({ baseUrl: '/api', fetch: stub.fetch }).request({ url: '/list?page=1' })
    expect(stub.calls[0]?.url).toBe('/api/list?page=1')
  })

  it('绝对地址不拼基础地址', async () => {
    const stub = stubFetch('{}')
    await createHttp({ baseUrl: 'https://a.com', fetch: stub.fetch }).request({ url: 'https://b.com/x' })
    expect(stub.calls[0]?.url).toBe('https://b.com/x')
  })
})

describe('请求配置', () => {
  it('缺省为 GET 并带 JSON 接受头', async () => {
    const stub = stubFetch('{}')
    await createHttp({ fetch: stub.fetch }).request({ url: '/a' })
    const init = stub.calls[0]?.init
    expect(init?.method).toBe('GET')
    expect(new Headers(init?.headers).get('Accept')).toBe('application/json')
    expect(init?.body).toBeUndefined()
  })

  it('有请求体时按 JSON 提交并补内容类型', async () => {
    const stub = stubFetch('{}')
    await createHttp({ headers: { 'X-Trace': '1' }, fetch: stub.fetch }).request({
      url: '/a',
      method: 'POST',
      body: { id: 1 },
    })
    const init = stub.calls[0]?.init
    const headers = new Headers(init?.headers)
    expect(init?.method).toBe('POST')
    expect(init?.body).toBe('{"id":1}')
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(headers.get('X-Trace')).toBe('1')
  })

  it('同名请求头以单次请求为准', async () => {
    const stub = stubFetch('{}')
    await createHttp({ headers: { 'X-Trace': '1' }, fetch: stub.fetch }).request({
      url: '/a',
      headers: { 'X-Trace': '2' },
    })
    expect(new Headers(stub.calls[0]?.init?.headers).get('X-Trace')).toBe('2')
  })
})

describe('请求钩子', () => {
  it('发送前改写请求', async () => {
    const stub = stubFetch('{}')
    const client = createHttp({
      fetch: stub.fetch,
      request: (config) => ({ ...config, url: `${config.url}/v2` }),
    })
    await client.request({ url: '/a' })
    expect(stub.calls[0]?.url).toBe('/a/v2')
  })

  it('归一时改写结果', async () => {
    const stub = stubFetch('{"code":200,"data":1}')
    const client = createHttp({
      fetch: stub.fetch,
      response: (result) => ({ ...result, data: Number(result.data) * 2 }),
    })
    expect((await client.request({ url: '/a' })).data).toBe(2)
  })
})
