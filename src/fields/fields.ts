/**
 * 字段装配
 * 把声明、渲染器与界面适配组装成字段实例与表单实例，七步生命周期按需推进
 */

import type { UiAdapter } from '../adapters/layui'
import { FieldKind, FieldStage, Variant } from '../enums'
import { i18n } from '../i18n'
import type { Translate } from '../i18n'
import type { MoireContext, Notify } from '../kernel/types'
import type { FieldSchema, FormSchema, RowData, ValidationIssue, ValidationResult } from '../schema'
import { validateField } from '../schema'
import { createRenderers } from './renderers'
import type { EchoResult, FieldBuild, FieldInstance, FieldRenderer, Fields, FieldsOptions, FieldsPlugin, FormInstance } from './types'

/** 布尔类字段：清空时写 false */
const booleanKinds: readonly FieldKind[] = Object.freeze([FieldKind.Checkbox, FieldKind.Switch])

/** 选项类字段：占位提示按选择口径给词 */
const choiceKinds: readonly FieldKind[] = Object.freeze([FieldKind.Select, FieldKind.Selects])

/** 字段阶段顺序：前四步一次性，后三步可重复 */
export const fieldStages: readonly FieldStage[] = Object.freeze([
  FieldStage.Init,
  FieldStage.Data,
  FieldStage.Deploy,
  FieldStage.Done,
  FieldStage.Echo,
  FieldStage.Reset,
  FieldStage.Clean,
])

/** 空界面适配：未接入界面库时全部能力空转，控件仍可读写 */
const inertUi: UiAdapter = {
  enabled: false,
  dateRender: () => undefined,
  fileRender: () => undefined,
  formRender: () => undefined,
  notice: () => undefined,
  richRead: () => undefined,
  richRender: () => undefined,
  richWrite: () => undefined,
  selectsAct: () => undefined,
  selectsRead: () => [],
  selectsWrite: () => undefined,
  sortRender: () => undefined,
  zIndex: () => 0,
}

/** 列表类字段：清空时写空数组 */
const listKinds: readonly FieldKind[] = Object.freeze([FieldKind.Selected, FieldKind.Selects, FieldKind.Table])

/** 静默通知：未接入通知时的缺省实现 */
const silentNotify: Notify = () => undefined

/**
 * 取清空值
 * 布尔类给 false，列表类给空数组，其余给空串
 * @param kind 字段类型
 * @returns 清空后的取值
 */
function blankOf(kind: FieldKind): unknown {
  if (booleanKinds.includes(kind)) return false
  if (listKinds.includes(kind)) return []
  return ''
}

/**
 * 生成构建上下文
 * 候选项与占位提示在此归一，渲染器拿到的都是可直接使用的形态
 * @param field 字段声明
 * @param ui 界面适配
 * @param translate 取词条函数
 * @returns 构建上下文
 */
function buildContext(field: FieldSchema, ui: UiAdapter, translate: Translate): FieldBuild {
  const label = field.label ?? field.name
  return {
    field,
    choices: field.option?.choices ?? [],
    placeholder: field.placeholder ?? defaultPlaceholder(field.kind, label, translate),
    ui,
    translate,
  }
}

/**
 * 生成字段包装
 * 隐藏字段不占位也不出标签，其余按标签与控件两段排布
 * @param build 构建上下文
 * @returns 包装元素
 */
function buildWrapper(build: FieldBuild): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'moire-field'
  wrapper.setAttribute('data-moire-field', build.field.name)
  if (build.field.hidden === true) {
    wrapper.hidden = true
    return wrapper
  }
  const label = document.createElement('label')
  label.className = 'moire-field-label'
  label.textContent = build.field.label ?? build.field.name
  wrapper.append(label)
  return wrapper
}

/**
 * 创建字段实例
 * 前四步只执行一次，输出、重置与清理每次调用都生效
 * @param renderer 渲染器
 * @param build 构建上下文
 * @param notify 发出通知
 * @returns 字段实例
 */
function createField(renderer: FieldRenderer, build: FieldBuild, notify: Notify): FieldInstance {
  const passed = new Set<FieldStage>()
  const stages: FieldStage[] = []
  let mounted: { wrapper: HTMLElement; node: Element } | undefined

  /** 记录一次性阶段，返回是否首次执行 */
  const enter = (stage: FieldStage): boolean => {
    if (passed.has(stage)) return false
    passed.add(stage)
    stages.push(stage)
    return true
  }

  /** 推进初始化 */
  const init = (): void => {
    enter(FieldStage.Init)
  }

  /** 推进数据整理 */
  const data = (): void => {
    init()
    enter(FieldStage.Data)
  }

  /** 部署控件，重复调用复用已有结果；读写始终作用于控件本身，包装只负责排布 */
  const mount = (): { wrapper: HTMLElement; node: Element } => {
    if (mounted !== undefined) return mounted
    data()
    enter(FieldStage.Deploy)
    const wrapper = buildWrapper(build)
    const node = renderer.deploy(build)
    wrapper.append(node)
    renderer.write(build, node, build.field.value)
    mounted = { wrapper, node }
    return mounted
  }

  /** 完成增强，重复调用不重复执行 */
  const done = (): HTMLElement => {
    const { wrapper } = mount()
    if (enter(FieldStage.Done)) renderer.done?.(build, wrapper)
    return wrapper
  }

  const instance: FieldInstance = {
    field: build.field,
    renderer,
    get elem() {
      return mounted?.wrapper
    },
    get stages() {
      return stages
    },
    init: () => {
      init()
      return instance
    },
    data: () => {
      data()
      return instance
    },
    deploy: () => {
      mount()
      return instance
    },
    done: () => {
      done()
      return instance
    },
    echo: (): EchoResult => {
      const wrapper = done()
      stages.push(FieldStage.Echo)
      const value = renderer.read(build, mount().node)
      const issue = validateField(build.field, value, build.translate)
      if (issue !== undefined) notify({ message: issue.message, variant: Variant.Tips, target: wrapper })
      return issue === undefined ? { valid: true, value } : { valid: false, value, issue }
    },
    read: () => renderer.read(build, mount().node),
    reset: () => {
      stages.push(FieldStage.Reset)
      renderer.write(build, mount().node, build.field.value)
      return instance
    },
    clean: () => {
      stages.push(FieldStage.Clean)
      renderer.write(build, mount().node, blankOf(build.field.kind))
      return instance
    },
  }
  return instance
}

/**
 * 创建字段能力
 * 内置渲染器先全部注册，业务可按类型覆盖
 * @param options 字段选项
 * @returns 字段能力
 * @example createFields({ ui }).createForm(schema, document.body).echo()
 */
export function createFields(options: FieldsOptions = {}): Fields {
  const registry = new Map<FieldKind, FieldRenderer>()
  for (const renderer of createRenderers()) registry.set(renderer.kind, renderer)
  const ui = options.ui ?? inertUi
  const translate = options.translate ?? i18n.t
  let notify: Notify = options.notify ?? silentNotify

  /** 转发通知，始终取用最新的通知实现 */
  const emit: Notify = (notice) => {
    notify(notice)
  }

  /** 取渲染器，未注册时报错 */
  const rendererOf = (kind: FieldKind): FieldRenderer => {
    const renderer = registry.get(kind)
    if (renderer === undefined) throw new Error(translate('field.unknown', { kind }))
    return renderer
  }

  /** 创建字段实例 */
  const create = (field: FieldSchema): FieldInstance => createField(rendererOf(field.kind), buildContext(field, ui, translate), emit)

  /** 创建表单实例 */
  const createForm = (schema: FormSchema, target?: Element): FormInstance => {
    const root = document.createElement('div')
    root.className = 'moire-form'
    if (schema.name !== undefined) root.setAttribute('data-moire-form', schema.name)
    const names = new Set<string>()
    const list: FieldInstance[] = []
    for (const field of schema.fields) {
      if (names.has(field.name)) throw new Error(translate('field.duplicate', { name: field.name }))
      names.add(field.name)
      const instance = create(field).deploy()
      if (instance.elem !== undefined) root.append(instance.elem)
      list.push(instance)
    }
    if (target !== undefined) target.append(root)
    // 增强需在整表入文档后统一执行，否则适配层拿不到完整结构
    for (const instance of list) instance.done()
    const form: FormInstance = {
      schema,
      elem: root,
      fields: list,
      echo: (): ValidationResult => {
        const values: RowData = {}
        const issues: ValidationIssue[] = []
        for (const instance of list) {
          const result = instance.echo()
          values[instance.field.name] = result.value
          if (result.issue !== undefined) issues.push(result.issue)
        }
        return { valid: issues.length === 0, values, issues }
      },
      values: (): RowData => {
        const values: RowData = {}
        for (const instance of list) values[instance.field.name] = instance.read()
        return values
      },
      reset: () => {
        for (const instance of list) instance.reset()
        return form
      },
      clean: () => {
        for (const instance of list) instance.clean()
        return form
      },
    }
    return form
  }

  const fields: Fields = {
    renderers: registry,
    create,
    createForm,
    register: (renderer) => {
      registry.set(renderer.kind, renderer)
      return fields
    },
    setNotify: (next) => {
      notify = next
      return fields
    },
  }
  return fields
}

/**
 * 创建字段插件
 * 装配时接管内核通知，校验提示随内核统一下发
 * @param options 字段选项
 * @returns 字段插件
 * @example createKernel().use(createFieldsPlugin({ ui })).start()
 */
export function createFieldsPlugin(options: FieldsOptions = {}): FieldsPlugin {
  const fields = createFields(options)
  return {
    name: 'fields',
    fields,
    setup: (context: MoireContext) => {
      fields.setNotify(context.notify)
    },
  }
}

/**
 * 取缺省占位提示
 * 选择类按选择口径给词，其余按输入口径给词
 * @param kind 字段类型
 * @param label 字段标签
 * @param translate 取词条函数
 * @returns 占位提示
 */
function defaultPlaceholder(kind: FieldKind, label: string, translate: Translate): string {
  const key = choiceKinds.includes(kind) ? 'field.placeholder.choice' : 'field.placeholder.input'
  return translate(key, { label })
}
