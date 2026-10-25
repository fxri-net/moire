/**
 * 界面适配
 * layui、jQuery、layx、tinymce、Sortable 的唯一出口，缺失时安全降级
 */

import { SelectAction, Variant, assertNever } from '../../enums'
import { maxZIndex } from '../../utils/dom'
import { isArray, isString } from '../../utils/type'
import type { DateOption, NoticeOption, RichOption, SortableOption, UiAdapter, UploadOption } from './types'

/** 通用成员方法 */
type Member = (...args: unknown[]) => unknown

/** 探测结果 */
interface Probe {
  /** 日期控件 */
  date: unknown
  /** 表单控件 */
  form: unknown
  /** 弹层 */
  layer: unknown
  /** 窗口库 */
  layx: unknown
  /** jQuery */
  query: unknown
  /** 富文本 */
  rich: unknown
  /** 多选下拉 */
  selects: unknown
  /** 拖拽库 */
  sort: unknown
  /** 上传控件 */
  upload: unknown
}

/**
 * 创建界面适配
 * @param source 全局来源，缺省取 globalThis
 * @returns 界面适配实例
 * @example createUi().notice('已保存')
 */
export function createUi(source: unknown = globalThis): UiAdapter {
  const probe = probeSource(source)

  /** 渲染日期控件 */
  const dateRender = (elem: Element, option: DateOption = {}): void => {
    const config: Record<string, unknown> = { elem }
    if (option.format !== undefined) config['format'] = option.format
    if (option.range !== undefined) config['range'] = option.range
    if (option.type !== undefined) config['type'] = option.type
    invoke(probe.date, 'render', config)
  }

  /** 渲染上传控件 */
  const fileRender = (elem: Element, option: UploadOption): void => {
    const done = option.done
    const config: Record<string, unknown> = {
      elem,
      url: option.url,
      // 回调签名为（响应、序号、上传对象），序号无用故用不定参接住
      done: (...args: unknown[]) => {
        const [response, , upload] = args
        const filename = memberOf(upload, 'name')
        done?.(response, isString(filename) ? filename : '')
      },
    }
    if (option.accept !== undefined) config['accept'] = option.accept
    if (option.multiple !== undefined) config['multiple'] = option.multiple
    invoke(probe.upload, 'render', config)
  }

  /** 重渲染全量表单控件 */
  const formRender = (): void => {
    invoke(probe.form, 'render')
  }

  /** 弹出提示 */
  const notice = (text: string, option: NoticeOption = {}): void => {
    const duration = option.duration ?? 2000
    if (option.variant === Variant.Tips && option.target) {
      if (methodOf(probe.layer, 'tips')) {
        invoke(probe.layer, 'tips', text, option.target, { time: duration, tipsMore: true })
        return
      }
    }
    if (methodOf(probe.layer, 'msg')) {
      invoke(probe.layer, 'msg', text, { time: duration })
      return
    }
    const toast = methodOf(probe.query, 'toast')
    if (toast) {
      toast({ text, hideAfter: duration, position: 'top-right', stack: 3 })
      return
    }
    if (methodOf(probe.layx, 'msg')) {
      invoke(probe.layx, 'msg', text)
      return
    }
    console.warn(text)
  }

  /** 读取富文本内容 */
  const richRead = (id: string): string | undefined => {
    const content = invoke(invoke(probe.rich, 'get', id), 'getContent')
    return isString(content) ? content : undefined
  }

  /** 渲染富文本 */
  const richRender = (elem: Element, option: RichOption = {}): void => {
    const config: Record<string, unknown> = { target: elem }
    if (option.height !== undefined) config['height'] = option.height
    if (option.lang !== undefined) config['language'] = option.lang
    invoke(probe.rich, 'init', config)
  }

  /** 写入富文本内容 */
  const richWrite = (id: string, value: string): void => {
    invoke(invoke(probe.rich, 'get', id), 'setContent', value)
  }

  /** 为多选组件挂载批量动作 */
  const selectsAct = (name: string, actions: readonly SelectAction[]): void => {
    if (actions.length === 0) return
    invoke(probe.selects, 'btns', name, actions.map(actionButton), { show: 'name', space: '6px' })
  }

  /** 读取多选组件取值 */
  const selectsRead = (name: string): string[] => {
    const value = invoke(probe.selects, 'value', name, 'valStr')
    if (isArray(value)) return value.filter(isString)
    return isString(value) && value !== '' ? [value] : []
  }

  /** 写入多选组件取值 */
  const selectsWrite = (name: string, values: readonly string[]): void => {
    invoke(probe.selects, 'value', name, Array.from(values))
  }

  /** 渲染拖拽排序 */
  const sortRender = (scope: Element, option: SortableOption = {}): void => {
    if (typeof probe.sort !== 'function') return
    const config: Record<string, unknown> = {}
    if (option.animation !== undefined) config['animation'] = option.animation
    if (option.filter !== undefined) config['filter'] = option.filter
    Reflect.construct(probe.sort, [scope, config])
  }

  return {
    enabled: methodOf(probe.form, 'render') !== undefined,
    dateRender,
    fileRender,
    formRender,
    notice,
    richRead,
    richRender,
    richWrite,
    selectsAct,
    selectsRead,
    selectsWrite,
    sortRender,
    zIndex: maxZIndex,
  }
}

/**
 * 转换选择动作
 * layui 的批量按钮只认自身字符串，集中映射避免散落
 * @param action 选择动作
 * @returns layui 按钮名
 */
function actionButton(action: SelectAction): string {
  switch (action) {
    case SelectAction.All:
      return 'select'
    case SelectAction.Invert:
      return 'reverse'
    case SelectAction.None:
      return 'remove'
    default:
      return assertNever(action, 'SelectAction')
  }
}

/**
 * 调用成员方法
 * 界面库的方法都以闭包持有内部状态，脱开宿主直接调用不会丢失上下文
 * @param target 容器
 * @param key 成员名
 * @param args 调用参数
 * @returns 调用结果，方法缺失时为空
 */
function invoke(target: unknown, key: string, ...args: unknown[]): unknown {
  const method = methodOf(target, key)
  return method ? method(...args) : undefined
}

/**
 * 判断是否可作为容器取值
 * 函数同为容器，jQuery 与部分库直接把能力挂在函数对象上
 * @param data 待判定值
 * @returns 可取值时为 true
 */
function isContainer(data: unknown): data is Record<string, unknown> {
  return (typeof data === 'object' && data !== null) || typeof data === 'function'
}

/**
 * 取容器成员
 * @param target 容器
 * @param key 成员名
 * @returns 成员值，容器无效时为空
 */
function memberOf(target: unknown, key: string): unknown {
  return isContainer(target) ? target[key] : undefined
}

/**
 * 取成员方法
 * @param target 容器
 * @param key 成员名
 * @returns 方法，缺失时为空
 */
function methodOf(target: unknown, key: string): Member | undefined {
  const value = memberOf(target, key)
  return typeof value === 'function' ? (value as Member) : undefined
}

/**
 * 探测第三方能力
 * @param source 全局来源
 * @returns 探测结果，缺失项为空
 */
function probeSource(source: unknown): Probe {
  const root = isContainer(source) ? source : {}
  const layui = memberOf(root, 'layui')
  return {
    date: memberOf(layui, 'laydate'),
    form: memberOf(layui, 'form'),
    layer: memberOf(layui, 'layer'),
    layx: memberOf(root, 'layx'),
    query: memberOf(root, 'jQuery') ?? memberOf(root, '$'),
    rich: memberOf(root, 'tinymce'),
    selects: memberOf(layui, 'formSelects'),
    sort: memberOf(root, 'Sortable'),
    upload: memberOf(layui, 'upload'),
  }
}

export type { DateOption, NoticeOption, RichOption, SortableOption, UiAdapter, UploadOption } from './types'

/** 默认实例 */
export const ui = createUi()
