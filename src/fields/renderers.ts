/**
 * 内置渲染器
 * 每个字段类型一个渲染器，部署、读取、写入三段分离，控件缺失时安全退化
 */

import type { DateOption, RichOption, UploadOption } from '../adapters/layui'
import { FieldKind } from '../enums'
import type { ColumnSchema, RowData } from '../schema'
import { isArray, isObject, isString } from '../utils/type'
import type { FieldBuild, FieldRenderer } from './types'

/** 可读写取值的控件 */
type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

/** 取值存取键 */
const valueKey = 'data-moire-value'

/** 富文本编号，保证同一页面内控件标识唯一 */
let serial = 0

/** 复选框渲染器 */
const checkboxRenderer: FieldRenderer = {
  kind: FieldKind.Checkbox,
  deploy: (build) => createBox(build, 'moire-checkbox'),
  read: (_build, elem) => checkedOf(elem),
  write: (_build, elem, value) => {
    writeChecked(elem, value)
  },
}

/** 日期渲染器 */
const dateRenderer: FieldRenderer = {
  kind: FieldKind.Date,
  deploy: (build) => {
    const input = createInput(build, 'text', 'moire-date')
    build.ui.dateRender(input, dateOption(build, false))
    return input
  },
  read: (_build, elem) => readInput(elem),
  write: (_build, elem, value) => {
    writeInput(elem, value)
  },
}

/** 日期文本渲染器：区间选择，按文本展示起止两段 */
const dateTextRenderer: FieldRenderer = {
  kind: FieldKind.DateText,
  deploy: (build) => {
    const input = createInput(build, 'text', 'moire-date-text')
    build.ui.dateRender(input, dateOption(build, true))
    return input
  },
  read: (_build, elem) => readInput(elem),
  write: (_build, elem, value) => {
    writeInput(elem, value)
  },
}

/** 文件渲染器：给了接收地址就走上传，否则只展示已选值 */
const fileRenderer: FieldRenderer = {
  kind: FieldKind.File,
  deploy: (build) => {
    const root = makeElement('div', 'moire-file')
    root.setAttribute('data-moire-name', build.field.name)
    const pick = makeElement('button', 'moire-file-pick')
    pick.type = 'button'
    pick.textContent = build.translate('field.upload')
    pick.disabled = build.field.disabled === true
    const caption = makeElement('span', 'moire-file-name')
    root.append(pick, caption)
    const option = build.field.option
    const url = option?.uploadUrl
    if (option !== undefined && url !== undefined && url !== '') {
      const upload: UploadOption = {
        url,
        done: (response) => {
          storeValue(root, response)
          caption.textContent = cellOf(response)
        },
      }
      const accept = option.accept
      const multiple = option.multiple
      if (accept !== undefined) upload.accept = accept
      if (multiple !== undefined) upload.multiple = multiple
      build.ui.fileRender(pick, upload)
    }
    return root
  },
  read: (_build, elem) => storedOf(elem),
  write: (_build, elem, value) => {
    storeValue(elem, value)
    const caption = elem.querySelector('.moire-file-name')
    if (caption !== null) caption.textContent = cellOf(value)
  },
}

/** 隐藏域渲染器 */
const hiddenRenderer: FieldRenderer = {
  kind: FieldKind.Hidden,
  deploy: (build) => createInput(build, 'hidden', 'moire-hidden'),
  read: (_build, elem) => readInput(elem),
  write: (_build, elem, value) => {
    writeInput(elem, value)
  },
}

/** 超文本渲染器：写入即按标记解析，仅供展示型字段使用 */
const htmlRenderer: FieldRenderer = {
  kind: FieldKind.Html,
  deploy: () => makeElement('div', 'moire-html'),
  read: (_build, elem) => elem.innerHTML,
  write: (_build, elem, value) => {
    elem.innerHTML = cellOf(value)
  },
}

/** 单行输入渲染器 */
const inputRenderer: FieldRenderer = {
  kind: FieldKind.Input,
  deploy: (build) => createInput(build, 'text', 'moire-input'),
  read: (_build, elem) => readInput(elem),
  write: (_build, elem, value) => {
    writeInput(elem, value)
  },
}

/** 密码输入渲染器 */
const passwordRenderer: FieldRenderer = {
  kind: FieldKind.Password,
  deploy: (build) => createInput(build, 'password', 'moire-password'),
  read: (_build, elem) => readInput(elem),
  write: (_build, elem, value) => {
    writeInput(elem, value)
  },
}

/** 富文本渲染器：编辑区优先交给适配层，缺失时退化为多行文本 */
const richTextRenderer: FieldRenderer = {
  kind: FieldKind.RichText,
  deploy: (build) => {
    const area = makeElement('textarea', 'moire-richtext')
    area.name = build.field.name
    area.id = nextId(build.field.name)
    area.placeholder = build.placeholder
    area.disabled = build.field.disabled === true
    const option: RichOption = {}
    const height = build.field.option?.height
    if (height !== undefined) option.height = height
    build.ui.richRender(area, option)
    return area
  },
  read: (build, elem) => build.ui.richRead(elem.id) ?? readInput(elem),
  write: (build, elem, value) => {
    const text = cellOf(value)
    writeInput(elem, text)
    build.ui.richWrite(elem.id, text)
  },
}

/** 单选下拉渲染器 */
const selectRenderer: FieldRenderer = {
  kind: FieldKind.Select,
  deploy: (build) => {
    const select = makeElement('select', 'moire-select')
    select.name = build.field.name
    select.disabled = build.field.disabled === true
    fillOptions(select, build, true)
    return select
  },
  read: (_build, elem) => readInput(elem),
  write: (_build, elem, value) => {
    writeInput(elem, value)
  },
}

/** 已选展示渲染器：按候选项文案渲染标签，取值仍以数据为准 */
const selectedRenderer: FieldRenderer = {
  kind: FieldKind.Selected,
  deploy: (build) => {
    const root = makeElement('div', 'moire-selected')
    root.setAttribute('data-moire-name', build.field.name)
    return root
  },
  read: (_build, elem) => normalizeList(storedOf(elem)),
  write: (build, elem, value) => {
    const values = normalizeList(value)
    const labels = new Map(build.choices.map((choice) => [choice.value, choice.label] as const))
    storeValue(elem, values)
    elem.replaceChildren(...values.map((item) => chipOf(labels.get(item) ?? item)))
  },
}

/** 多选下拉渲染器：适配层可用时同步其取值，否则退回原生多选 */
const selectsRenderer: FieldRenderer = {
  kind: FieldKind.Selects,
  deploy: (build) => {
    const root = makeElement('div', 'moire-selects')
    root.setAttribute('data-moire-name', build.field.name)
    const select = makeElement('select', 'moire-selects-native')
    select.name = build.field.name
    select.multiple = true
    select.disabled = build.field.disabled === true
    fillOptions(select, build, false)
    root.append(select)
    build.ui.selectsAct(build.field.name, build.field.option?.actions ?? [])
    return root
  },
  read: (build, elem) => {
    const enhanced = build.ui.selectsRead(build.field.name)
    if (enhanced.length > 0) return enhanced
    const select = findSelect(elem)
    return select === undefined ? [] : Array.from(select.selectedOptions, (option) => option.value)
  },
  write: (build, elem, value) => {
    const values = normalizeList(value)
    const select = findSelect(elem)
    if (select !== undefined) {
      for (const option of Array.from(select.options)) option.selected = values.includes(option.value)
    }
    build.ui.selectsWrite(build.field.name, values)
  },
}

/** 开关渲染器 */
const switchRenderer: FieldRenderer = {
  kind: FieldKind.Switch,
  deploy: (build) => createBox(build, 'moire-switch'),
  read: (_build, elem) => checkedOf(elem),
  write: (_build, elem, value) => {
    writeChecked(elem, value)
  },
}

/** 表格渲染器：行集整体作为取值，按列声明铺表格 */
const tableRenderer: FieldRenderer = {
  kind: FieldKind.Table,
  deploy: (build) => {
    const root = makeElement('div', 'moire-table')
    root.setAttribute('data-moire-name', build.field.name)
    const table = makeElement('table', 'moire-table-grid')
    table.append(headOf(columnsOf(build)))
    table.append(makeElement('tbody'))
    root.append(table)
    return root
  },
  read: (_build, elem) => rowsOf(elem),
  write: (build, elem, value) => {
    storeValue(elem, rowsOfValue(value))
    paintRows(build, elem)
  },
}

/** 文本渲染器：只读展示 */
const textRenderer: FieldRenderer = {
  kind: FieldKind.Text,
  deploy: () => makeElement('span', 'moire-text'),
  read: (_build, elem) => elem.textContent,
  write: (_build, elem, value) => {
    elem.textContent = cellOf(value)
  },
}

/** 多行输入渲染器 */
const textareaRenderer: FieldRenderer = {
  kind: FieldKind.Textarea,
  deploy: (build) => {
    const area = makeElement('textarea', 'moire-textarea')
    area.name = build.field.name
    area.placeholder = build.placeholder
    area.disabled = build.field.disabled === true
    return area
  },
  read: (_build, elem) => readInput(elem),
  write: (_build, elem, value) => {
    writeInput(elem, value)
  },
}

/**
 * 转换展示文本
 * 空值给空串，字符串原样返回，其余按 JSON 序列化，避免展示出 [object Object]
 * @param value 待展示值
 * @returns 展示文本
 */
function cellOf(value: unknown): string {
  if (value === null || value === undefined) return ''
  return isString(value) ? value : JSON.stringify(value)
}

/**
 * 读取勾选状态
 * @param elem 控件包装
 * @returns 已勾选时为 true
 */
function checkedOf(elem: Element): boolean {
  const control = findControl(elem)
  return control !== undefined && control instanceof HTMLInputElement && control.checked
}

/**
 * 生成标签
 * @param label 标签文本
 * @returns 标签元素
 */
function chipOf(label: string): Element {
  const chip = makeElement('span', 'moire-selected-item')
  chip.textContent = label
  return chip
}

/**
 * 取表格列声明
 * @param build 构建上下文
 * @returns 列声明，缺省为空
 */
function columnsOf(build: FieldBuild): readonly ColumnSchema[] {
  return build.field.option?.columns ?? []
}

/**
 * 生成勾选类输入
 * @param build 构建上下文
 * @param className 样式类名
 * @returns 复选框元素
 */
function createBox(build: FieldBuild, className: string): HTMLInputElement {
  const input = makeElement('input', className)
  input.type = 'checkbox'
  input.name = build.field.name
  input.disabled = build.field.disabled === true
  return input
}

/**
 * 生成单行输入
 * @param build 构建上下文
 * @param type 输入类型
 * @param className 样式类名
 * @returns 输入元素
 */
function createInput(build: FieldBuild, type: string, className: string): HTMLInputElement {
  const input = makeElement('input', className)
  input.type = type
  input.name = build.field.name
  input.placeholder = build.placeholder
  input.disabled = build.field.disabled === true
  return input
}

/**
 * 创建内置渲染器
 * 顺序与字段类型枚举一致，便于对照
 * @returns 渲染器列表
 * @example createRenderers().map((item) => item.kind)
 */
export function createRenderers(): FieldRenderer[] {
  return [
    checkboxRenderer,
    dateRenderer,
    dateTextRenderer,
    fileRenderer,
    hiddenRenderer,
    htmlRenderer,
    inputRenderer,
    passwordRenderer,
    richTextRenderer,
    selectRenderer,
    selectedRenderer,
    selectsRenderer,
    switchRenderer,
    tableRenderer,
    textRenderer,
    textareaRenderer,
  ]
}

/**
 * 汇总日期选项
 * @param build 构建上下文
 * @param range 缺省是否区间选择
 * @returns 日期选项
 */
function dateOption(build: FieldBuild, range: boolean): DateOption {
  const option = build.field.option
  const config: DateOption = { range: option?.range ?? range }
  const dateType = option?.dateType
  const format = option?.format
  if (dateType !== undefined) config.type = dateType
  if (format !== undefined) config.format = format
  return config
}

/**
 * 填充候选项
 * @param select 下拉控件
 * @param build 构建上下文
 * @param blank 是否补一项空值占位
 * @returns 无返回
 */
function fillOptions(select: HTMLSelectElement, build: FieldBuild, blank: boolean): void {
  const options: HTMLOptionElement[] = []
  if (blank) options.push(optionOf('', build.translate('field.empty'), false))
  for (const choice of build.choices) options.push(optionOf(choice.value, choice.label, choice.disabled === true))
  select.replaceChildren(...options)
}

/**
 * 取可读写控件
 * @param elem 控件包装
 * @returns 控件，缺失时为空
 */
function findControl(elem: Element): Control | undefined {
  if (isControl(elem)) return elem
  const found = elem.querySelector('input, textarea, select')
  return isControl(found) ? found : undefined
}

/**
 * 取下拉控件
 * @param elem 控件包装
 * @returns 下拉控件，缺失时为空
 */
function findSelect(elem: Element): HTMLSelectElement | undefined {
  const found = elem instanceof HTMLSelectElement ? elem : elem.querySelector('select')
  return found instanceof HTMLSelectElement ? found : undefined
}

/**
 * 生成表头
 * @param columns 列声明
 * @returns 表头元素
 */
function headOf(columns: readonly ColumnSchema[]): Element {
  const head = makeElement('thead')
  const row = makeElement('tr')
  for (const column of columns) {
    const cell = makeElement('th')
    cell.textContent = column.title ?? column.name
    if (column.width !== undefined) cell.style.width = `${String(column.width)}px`
    row.append(cell)
  }
  head.append(row)
  return head
}

/**
 * 判断是否为可读写控件
 * @param data 待判定值
 * @returns 为控件时为 true
 */
function isControl(data: unknown): data is Control {
  return data instanceof HTMLInputElement || data instanceof HTMLTextAreaElement || data instanceof HTMLSelectElement
}

/**
 * 生成元素
 * @param tag 标签名
 * @param className 样式类名
 * @returns 元素
 */
function makeElement<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
  const elem = document.createElement(tag)
  if (className !== undefined) elem.className = className
  return elem
}

/**
 * 生成控件标识
 * @param name 字段名
 * @returns 页面内唯一标识
 */
function nextId(name: string): string {
  serial += 1
  return `moire-${name}-${String(serial)}`
}

/**
 * 归一列表取值
 * 数组取字符串项，字符串按逗号拆分，其余视为空
 * @param value 待归一键值
 * @returns 字符串列表
 */
function normalizeList(value: unknown): string[] {
  if (isArray(value)) return value.filter(isString)
  if (isString(value) && value !== '') return value.split(',')
  return []
}

/**
 * 生成选项
 * @param value 取值
 * @param label 展示文本
 * @param disabled 是否禁用
 * @returns 选项元素
 */
function optionOf(value: string, label: string, disabled: boolean): HTMLOptionElement {
  const option = makeElement('option')
  option.value = value
  option.textContent = label
  option.disabled = disabled
  return option
}

/**
 * 重铺表格内容
 * @param build 构建上下文
 * @param elem 控件包装
 * @returns 无返回
 */
function paintRows(build: FieldBuild, elem: Element): void {
  const body = elem.querySelector('tbody')
  if (body === null) return
  const columns = columnsOf(build)
  body.replaceChildren(...rowsOf(elem).map((row) => rowOf(columns, row)))
}

/**
 * 读取单行输入
 * @param elem 控件包装
 * @returns 控件取值，缺失控件时为空串
 */
function readInput(elem: Element): string {
  const control = findControl(elem)
  return control === undefined ? '' : control.value
}

/**
 * 生成表格行
 * @param columns 列声明
 * @param row 行数据
 * @returns 行元素
 */
function rowOf(columns: readonly ColumnSchema[], row: RowData): Element {
  const line = makeElement('tr', 'moire-table-row')
  for (const column of columns) {
    const cell = makeElement('td')
    cell.textContent = cellOf(row[column.name])
    line.append(cell)
  }
  return line
}

/**
 * 取表格行集
 * @param elem 控件包装
 * @returns 行数据列表
 */
function rowsOf(elem: Element): RowData[] {
  return rowsOfValue(storedOf(elem))
}

/**
 * 归一表格行集
 * @param value 待归一值
 * @returns 行数据列表，非数组与对象项被丢弃
 */
function rowsOfValue(value: unknown): RowData[] {
  if (!isArray(value)) return []
  return value.filter(isObject)
}

/**
 * 写入取值
 * @param elem 控件包装
 * @param value 待写值
 * @returns 无返回
 */
function storeValue(elem: Element, value: unknown): void {
  elem.setAttribute(valueKey, JSON.stringify(value ?? null))
}

/**
 * 读取取值
 * @param elem 控件包装
 * @returns 取值，未写入时为空；非法 JSON 原样返回
 */
function storedOf(elem: Element): unknown {
  const raw = elem.getAttribute(valueKey)
  if (raw === null) return undefined
  try {
    return JSON.parse(raw) as unknown
  } catch {
    return raw
  }
}

/**
 * 写入勾选状态
 * @param elem 控件包装
 * @param value 待写值，布尔值、数字与字符串形式都按真值归一
 * @returns 无返回
 */
function writeChecked(elem: Element, value: unknown): void {
  const control = findControl(elem)
  if (control !== undefined && control instanceof HTMLInputElement) {
    control.checked = value === true || value === 1 || value === 'true' || value === '1'
  }
}

/**
 * 写入单行输入
 * @param elem 控件包装
 * @param value 待写值，空值写空串
 * @returns 无返回
 */
function writeInput(elem: Element, value: unknown): void {
  const control = findControl(elem)
  if (control !== undefined) control.value = cellOf(value)
}
