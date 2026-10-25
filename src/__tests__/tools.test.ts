/**
 * 工具单测
 * 删除、导出、下载、导入、消息与跳转的结构化结果与失败分支
 */

import { ToolAction, ToolOutcome, Variant } from '../enums'
import type { HttpRequest, HttpResult } from '../http'
import { i18n } from '../i18n'
import { createTools } from '../tools'

/**
 * 构造请求结果
 * @param ok 业务是否成功
 * @param message 业务消息
 * @returns 请求结果
 */
function resultOf(ok = true, message = ''): HttpResult {
  return { ok, code: 200, message, data: undefined, raw: undefined }
}

/**
 * 构造记录调用的工具上下文
 * @param options 确认答复与请求结果
 * @returns 工具能力与调用记录
 */
function stubContext(options: { answer?: boolean; result?: HttpResult } = {}) {
  const requests: HttpRequest[] = []
  const notices: string[] = []
  const confirms: string[] = []
  const opened: string[] = []
  let reloads = 0
  const tools = createTools({
    request: (input) => {
      requests.push(input)
      return Promise.resolve(options.result ?? resultOf())
    },
    confirm: (message) => {
      confirms.push(message)
      return options.answer ?? true
    },
    notify: (notice) => {
      notices.push(notice.message)
    },
    open: (target) => {
      opened.push(target)
    },
    reload: () => {
      reloads += 1
    },
  })
  return { tools, requests, notices, confirms, opened, reloads: () => reloads }
}

describe('删除', () => {
  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('按主键集合提交并刷新', async () => {
    const stub = stubContext()
    const result = await stub.tools.run({ action: ToolAction.Delete, url: '/api/user/delete', rows: [{ id: 1 }, { id: 2 }, { id: '' }] })
    expect(result).toMatchObject({ outcome: ToolOutcome.Done, message: '删除成功' })
    expect(stub.requests).toEqual([{ url: '/api/user/delete', method: 'POST', body: { data: { id: ['1', '2'] } } }])
    expect(stub.confirms).toEqual(['是否确认删除？'])
    expect(stub.notices).toEqual(['删除成功'])
    expect(stub.reloads()).toBe(1)
  })

  it('显式主键优先于数据行', async () => {
    const stub = stubContext()
    await stub.tools.run({ action: ToolAction.Delete, url: '/api/user/delete', keys: ['7'], rows: [{ id: 8 }] })
    expect(stub.requests[0]?.body).toEqual({ data: { id: ['7'] } })
  })

  it('按指定主键字段提取', async () => {
    const stub = stubContext()
    await stub.tools.run({ action: ToolAction.Delete, url: '/api/user/delete', key: 'uid', rows: [{ uid: 'a' }] })
    expect(stub.requests[0]?.body).toEqual({ data: { uid: ['a'] } })
  })

  it('确认取消时不发起请求', async () => {
    const stub = stubContext({ answer: false })
    const result = await stub.tools.run({ action: ToolAction.Delete, url: '/api/user/delete', keys: ['1'] })
    expect(result.outcome).toBe(ToolOutcome.Cancelled)
    expect(stub.requests).toHaveLength(0)
    expect(stub.reloads()).toBe(0)
  })

  it('未选择数据时跳过', async () => {
    const stub = stubContext()
    const result = await stub.tools.run({ action: ToolAction.Delete, url: '/api/user/delete', rows: [{ id: '' }] })
    expect(result).toEqual({ outcome: ToolOutcome.Skipped, message: '请先选择数据' })
    expect(stub.confirms).toHaveLength(0)
  })

  it('缺少删除地址时失败', async () => {
    const stub = stubContext()
    expect(await stub.tools.run({ action: ToolAction.Delete })).toEqual({ outcome: ToolOutcome.Failed, message: '未配置删除地址' })
    expect(stub.requests).toHaveLength(0)
  })

  it('请求失败时返回失败结果并提示', async () => {
    const stub = stubContext({ result: resultOf(false, '无权限') })
    const result = await stub.tools.run({ action: ToolAction.Delete, url: '/api/user/delete', keys: ['1'] })
    expect(result).toEqual({ outcome: ToolOutcome.Failed, message: '无权限' })
    expect(stub.notices).toEqual(['无权限'])
    expect(stub.reloads()).toBe(0)
  })

  it('失败且无消息时回落到系统异常', async () => {
    const stub = stubContext({ result: resultOf(false) })
    expect(await stub.tools.run({ action: ToolAction.Delete, url: '/api/user/delete', keys: ['1'] })).toEqual({
      outcome: ToolOutcome.Failed,
      message: '系统异常',
    })
  })
})

describe('导出', () => {
  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('拼装全量查询地址后打开', async () => {
    const stub = stubContext()
    const result = await stub.tools.run({ action: ToolAction.Export, url: '/api/export', query: { status: 1 }, total: 5 })
    expect(result.outcome).toBe(ToolOutcome.Done)
    expect(stub.opened).toEqual(['/api/export?status=1&page=1&limit=-1'])
    expect(stub.confirms).toHaveLength(0)
  })

  it('超过阈值时先确认', async () => {
    const stub = stubContext({ answer: false })
    const result = await stub.tools.run({ action: ToolAction.Export, url: '/api/export', total: 100001 })
    expect(result.outcome).toBe(ToolOutcome.Cancelled)
    expect(stub.confirms).toEqual(['共 100001 条数据，导出可能耗时较长，是否继续？'])
    expect(stub.opened).toHaveLength(0)
  })

  it('自定义阈值按严格大于判断', async () => {
    const stub = stubContext()
    await stub.tools.run({ action: ToolAction.Export, url: '/api/export', total: 10, limit: 10 })
    expect(stub.confirms).toHaveLength(0)
  })

  it('缺少导出地址时失败', async () => {
    const stub = stubContext()
    expect(await stub.tools.run({ action: ToolAction.Export })).toEqual({ outcome: ToolOutcome.Failed, message: '未配置导出地址' })
  })
})

describe('跳转类工具', () => {
  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('下载、导入与跳转按地址打开', async () => {
    const stub = stubContext()
    await stub.tools.run({ action: ToolAction.Download, url: '/api/download' })
    await stub.tools.run({ action: ToolAction.Import, url: '/api/import' })
    await stub.tools.run({ action: ToolAction.Window, url: '/user/1' })
    expect(stub.opened).toEqual(['/api/download', '/api/import', '/user/1'])
  })

  it('缺少地址时按各自词条失败', async () => {
    const stub = stubContext()
    expect(await stub.tools.run({ action: ToolAction.Download })).toEqual({ outcome: ToolOutcome.Failed, message: '未配置下载地址' })
    expect(await stub.tools.run({ action: ToolAction.Import })).toEqual({ outcome: ToolOutcome.Failed, message: '未配置导入地址' })
    expect(await stub.tools.run({ action: ToolAction.Window })).toEqual({ outcome: ToolOutcome.Failed, message: '未配置跳转地址' })
  })
})

describe('消息', () => {
  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('按文本发出通知', async () => {
    const stub = stubContext()
    const result = await stub.tools.run({ action: ToolAction.Message, message: '保存成功', variant: Variant.Notice })
    expect(result).toEqual({ outcome: ToolOutcome.Done, message: '保存成功' })
    expect(stub.notices).toEqual(['保存成功'])
  })

  it('空消息跳过', async () => {
    const stub = stubContext()
    expect(await stub.tools.run({ action: ToolAction.Message })).toEqual({ outcome: ToolOutcome.Skipped, message: '消息内容不能为空' })
    expect(stub.notices).toHaveLength(0)
  })
})

describe('未覆盖动作', () => {
  it('由穷尽守卫抛出', async () => {
    const stub = stubContext()
    await expect(stub.tools.run({ action: 'strange' as never })).rejects.toThrow('ToolAction 出现未覆盖的成员：strange')
  })
})
