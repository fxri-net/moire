/**
 * 工具装配
 * 删除、导出、下载、导入、消息与窗口统一走结构化结果，不以外观上的 false 兼表多种语义
 */

import type { UiAdapter } from '../adapters/layui'
import { ToolAction, ToolOutcome, UrlMode, Variant, assertNever } from '../enums'
import type { Translate } from '../i18n'
import { i18n } from '../i18n'
import type { Notify } from '../kernel/types'
import { url as buildUrl } from '../utils/url'
import type { ToolContext, ToolRequest, ToolResult, Tools, ToolsPlugin } from './types'

/** 导出确认阈值：超过该条数先让用户确认 */
const EXPORT_LIMIT = 100000

/**
 * 取目标地址
 * 空串与缺失同等对待，避免把空地址当合法入口
 * @param request 工具请求
 * @returns 目标地址
 */
function addressOf(request: ToolRequest): string | undefined {
  return request.url === undefined || request.url === '' ? undefined : request.url
}

/**
 * 创建工具能力
 * @param context 工具上下文
 * @returns 工具能力
 * @example createTools({ request }).run({ action: ToolAction.Download, url: '/api/export' })
 */
export function createTools(context: ToolContext): Tools {
  const translate = context.translate ?? i18n.t
  const notify = context.notify ?? notifyViaUi(context.ui)
  const confirm = context.confirm ?? ((message: string) => window.confirm(message))
  const open =
    context.open ??
    ((target: string) => {
      window.open(target)
    })

  /**
   * 导出
   * 拼装全量查询地址后交给浏览器下载，条数超过阈值时先确认
   */
  const exportRows = (request: ToolRequest): ToolResult => {
    const target = addressOf(request)
    if (target === undefined) return missingOf(translate, 'tool.export.missing')
    const total = request.total ?? 0
    if (total > (request.limit ?? EXPORT_LIMIT) && !confirm(translate('tool.confirm.export', { total }))) return { outcome: ToolOutcome.Cancelled }
    const address = buildUrl({ mode: UrlMode.Append, url: target, param: { ...request.query, page: 1, limit: -1 } })
    // 追加模式必定返回地址字符串，兜底只为收窄联合类型
    open(typeof address === 'string' ? address : target)
    return { outcome: ToolOutcome.Done }
  }

  /**
   * 跳转
   * 下载与导入共用，只校验地址是否配置
   */
  const jump = (request: ToolRequest, key: string): ToolResult => {
    const target = addressOf(request)
    if (target === undefined) return missingOf(translate, key)
    open(target)
    return { outcome: ToolOutcome.Done }
  }

  /**
   * 消息
   * 空消息直接跳过，避免弹出无内容提示
   */
  const messageOf = (request: ToolRequest): ToolResult => {
    const text = request.message ?? ''
    if (text === '') return { outcome: ToolOutcome.Skipped, message: translate('tool.message.empty') }
    notify({ message: text, ...(request.variant === undefined ? {} : { variant: request.variant }) })
    return { outcome: ToolOutcome.Done, message: text }
  }

  /**
   * 删除
   * 主键集合以 POST 提交，成功后刷新列表
   */
  const remove = async (request: ToolRequest): Promise<ToolResult> => {
    const target = addressOf(request)
    if (target === undefined) return missingOf(translate, 'tool.delete.missing')
    const keys = keysOf(request)
    if (keys.length === 0) return { outcome: ToolOutcome.Skipped, message: translate('tool.select.empty') }
    if (!confirm(translate('tool.confirm.delete'))) return { outcome: ToolOutcome.Cancelled }
    const result = await context.request({ url: target, method: 'POST', body: { data: { [request.key ?? 'id']: keys } } })
    if (!result.ok) {
      const message = result.message === '' ? translate('http.failed') : result.message
      notify({ message, variant: Variant.Notice })
      return { outcome: ToolOutcome.Failed, message }
    }
    const message = translate('tool.delete.done')
    notify({ message, variant: Variant.Notice })
    context.reload?.()
    return { outcome: ToolOutcome.Done, message, data: result.data }
  }

  /**
   * 执行工具操作
   * 未覆盖的操作类型由 assertNever 在编译期兜住
   */
  const run = async (request: ToolRequest): Promise<ToolResult> => {
    switch (request.action) {
      case ToolAction.Delete:
        return remove(request)
      case ToolAction.Download:
        return jump(request, 'tool.download.missing')
      case ToolAction.Export:
        return exportRows(request)
      case ToolAction.Import:
        return jump(request, 'tool.import.missing')
      case ToolAction.Message:
        return messageOf(request)
      case ToolAction.Window:
        return jump(request, 'tool.window.missing')
      default:
        return assertNever(request.action, 'ToolAction')
    }
  }

  return { run }
}

/**
 * 创建工具插件
 * 工具按请求即时执行，装配阶段不持有额外状态
 * @param context 工具上下文
 * @returns 工具插件
 * @example createKernel().use(createToolsPlugin({ request })).start()
 */
export function createToolsPlugin(context: ToolContext): ToolsPlugin {
  return {
    name: 'tools',
    tools: createTools(context),
    setup: () => {
      // 工具按请求即时执行，装配阶段无需初始化
    },
  }
}

/**
 * 从请求中取主键集合
 * 显式 keys 优先，其次按主键字段从数据行提取，空值一律忽略
 * @param request 工具请求
 * @returns 主键集合
 */
function keysOf(request: ToolRequest): readonly string[] {
  if (request.keys !== undefined && request.keys.length > 0) return request.keys
  const key = request.key ?? 'id'
  const keys: string[] = []
  for (const row of request.rows ?? []) {
    const text = textOf(row[key])
    if (text !== '') keys.push(text)
  }
  return keys
}

/**
 * 生成失败结果
 * @param translate 取词条函数
 * @param key 词条键
 * @returns 工具结果
 */
function missingOf(translate: Translate, key: string): ToolResult {
  return { outcome: ToolOutcome.Failed, message: translate(key) }
}

/**
 * 以界面适配呈现通知
 * 未接入界面库时静默，不影响工具本身的返回结果
 * @param ui 界面适配
 * @returns 通知函数
 */
function notifyViaUi(ui: UiAdapter | undefined): Notify {
  return (notice) => {
    if (ui === undefined) return
    ui.notice(notice.message, {
      ...(notice.variant === undefined ? {} : { variant: notice.variant }),
      ...(notice.target === undefined ? {} : { target: notice.target }),
    })
  }
}

/**
 * 归一主键文本
 * 主键只取标量，容器形态按 JSON 展示，空值统一为空串
 * @param value 原始取值
 * @returns 主键文本
 */
function textOf(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value)
  if (typeof value === 'object') return JSON.stringify(value)
  return ''
}
