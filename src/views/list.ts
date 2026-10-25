/**
 * 列表装配
 * 纯装配负责列归一、排序与分页切片，渲染只做 DOM 组装与适配层增强
 */

import type { UiAdapter } from '../adapters/layui'
import { FieldKind, OrderDirection, SelectionMode, ViewKind } from '../enums'
import type { Translate } from '../i18n'
import type { ColumnSchema, ListSchema, RowData } from '../schema'
import type { ListAssembler, ListAssembly, ListPage, ListQuery, OrderClause, ViewColumn } from './types'

/** 缺省单页条数 */
const DEFAULT_LIMIT = 10

/** 缺省主键字段 */
const DEFAULT_KEY = 'id'

/**
 * 装配列表
 * 先归一列与排序，再切片分页；页码越界时钳制到合法区间，空数据固定为第 1 页
 * @param schema 列表声明
 * @param query 列表查询
 * @returns 列表装配结果
 * @example assembleList({ columns: [{ name: 'id' }], rows, limit: 20 }, { page: 2 })
 */
export function assembleList(schema: ListSchema, query: ListQuery = {}): ListAssembly {
  const columns = normalizeColumns(schema.columns)
  const order = normalizeOrder(query.order ?? [])
  const rows = sortRows(schema.rows ?? [], order)
  const limit = positiveOf(query.limit, positiveOf(schema.limit, DEFAULT_LIMIT))
  const page = pageOf(rows.length, limit, query.page)
  const start = (page.page - 1) * page.limit
  return {
    columns,
    rows: rows.slice(start, start + page.limit),
    page,
    selection: schema.selection ?? SelectionMode.None,
    key: schema.key ?? DEFAULT_KEY,
    order,
    ...(schema.name === undefined ? {} : { name: schema.name }),
  }
}

/**
 * 生成表体
 * 无数据时输出整行空态提示，避免渲染出空骨架
 * @param assembly 列表装配结果
 * @param translate 取词条函数
 * @returns 表体
 */
function bodyOf(assembly: ListAssembly, translate: Translate): HTMLElement {
  const body = document.createElement('tbody')
  if (assembly.rows.length === 0) {
    const row = document.createElement('tr')
    const cell = document.createElement('td')
    cell.className = 'moire-list-empty'
    cell.colSpan = spanOf(assembly)
    cell.textContent = translate('list.empty')
    row.append(cell)
    body.append(row)
    return body
  }
  for (const data of assembly.rows) body.append(rowOf(assembly, data))
  return body
}

/**
 * 取单元格文本
 * 候选项按展示文本映射，其余按原值展示
 * @param column 视图列
 * @param data 行数据
 * @returns 展示文本
 */
function cellOf(column: ViewColumn, data: RowData): string {
  const value = data[column.name]
  if (column.choices !== undefined) {
    const choice = column.choices.find((item) => item.value === displayOf(value))
    if (choice !== undefined) return choice.label
  }
  return displayOf(value)
}

/**
 * 逐级比较两行
 * 前一个排序子句相等时继续比较下一个，降序在单个子句内取反
 * @param left 左侧行
 * @param right 右侧行
 * @param order 排序子句
 * @returns 比较结果
 */
function compareRows(left: RowData, right: RowData, order: readonly OrderClause[]): number {
  for (const clause of order) {
    const result = compareValue(left[clause.name], right[clause.name])
    if (result !== 0) return clause.direction === OrderDirection.Desc ? -result : result
  }
  return 0
}

/**
 * 比较两个取值
 * 数字按数值比较，空值视为最大值，其余按字符串比较
 * @param left 左侧取值
 * @param right 右侧取值
 * @returns 比较结果
 */
function compareValue(left: unknown, right: unknown): number {
  const leftBlank = left === undefined || left === null || left === ''
  const rightBlank = right === undefined || right === null || right === ''
  if (leftBlank || rightBlank) return Number(leftBlank) - Number(rightBlank)
  if (typeof left === 'number' && typeof right === 'number') return left - right
  const leftText = displayOf(left)
  const rightText = displayOf(right)
  if (leftText === rightText) return 0
  return leftText < rightText ? -1 : 1
}

/**
 * 创建列表装配器
 * @param ui 界面适配，缺省不做控件增强
 * @param translate 取词条函数
 * @returns 列表装配器
 * @example const list = createListAssembler(ui, i18n.t)
 */
export function createListAssembler(ui: UiAdapter | undefined, translate: Translate): ListAssembler {
  return {
    kind: ViewKind.List,
    assemble: assembleList,
    render: (assembly, target) => renderList(assembly, ui, translate, target),
  }
}

/**
 * 展示取值
 * 空值给空串，数组逐项拼接，对象按 JSON 展示
 * @param value 取值
 * @returns 展示文本
 */
function displayOf(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value)
  if (Array.isArray(value)) return value.map(displayOf).join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return ''
}

/**
 * 生成表尾
 * 汇总总条数与页码，便于业务侧按需隐藏
 * @param assembly 列表装配结果
 * @param translate 取词条函数
 * @returns 表尾
 */
function footOf(assembly: ListAssembly, translate: Translate): HTMLElement {
  const foot = document.createElement('tfoot')
  const row = document.createElement('tr')
  const cell = document.createElement('td')
  cell.className = 'moire-list-summary'
  cell.colSpan = spanOf(assembly)
  const total = document.createElement('span')
  total.className = 'moire-list-total'
  total.textContent = translate('list.total', { total: assembly.page.total })
  const page = document.createElement('span')
  page.className = 'moire-list-page'
  page.textContent = translate('list.page', { page: assembly.page.page, pages: assembly.page.pages })
  cell.append(total, page)
  row.append(cell)
  foot.append(row)
  return foot
}

/**
 * 生成表头
 * 多选模式提供全选开关，单选与不选只占位或不占位
 * @param assembly 列表装配结果
 * @param translate 取词条函数
 * @returns 表头
 */
function headOf(assembly: ListAssembly, translate: Translate): HTMLElement {
  const head = document.createElement('thead')
  const row = document.createElement('tr')
  if (assembly.selection !== SelectionMode.None) {
    const cell = document.createElement('th')
    cell.className = 'moire-list-select'
    cell.textContent = assembly.selection === SelectionMode.Multiple ? translate('list.column.selection') : ''
    if (assembly.selection === SelectionMode.Multiple) {
      const all = document.createElement('input')
      all.type = 'checkbox'
      all.setAttribute('data-moire-select-all', '')
      all.addEventListener('change', () => {
        const table = all.closest('table')
        if (table === null) return
        for (const input of table.querySelectorAll<HTMLInputElement>('[data-moire-row]')) input.checked = all.checked
      })
      cell.append(all)
    }
    row.append(cell)
  }
  for (const column of assembly.columns) {
    const cell = document.createElement('th')
    cell.textContent = column.title
    if (column.width !== undefined) cell.style.width = `${String(column.width)}px`
    row.append(cell)
  }
  head.append(row)
  return head
}

/**
 * 归一列声明
 * 标题缺省取字段名，渲染类型缺省按文本
 * @param columns 列声明
 * @returns 视图列
 */
function normalizeColumns(columns: readonly ColumnSchema[]): readonly ViewColumn[] {
  return columns.map((column) => ({
    name: column.name,
    title: column.title ?? column.name,
    kind: column.kind ?? FieldKind.Text,
    ...(column.width === undefined ? {} : { width: column.width }),
    ...(column.placeholder === undefined ? {} : { placeholder: column.placeholder }),
    ...(column.choices === undefined ? {} : { choices: column.choices }),
  }))
}

/**
 * 归一排序子句
 * 复制一份，避免调用方后续改动影响已装配结果
 * @param order 排序子句
 * @returns 归一后的排序子句
 */
function normalizeOrder(order: readonly OrderClause[]): readonly OrderClause[] {
  return order.map((clause) => ({ name: clause.name, direction: clause.direction }))
}

/**
 * 计算分页信息
 * @param total 总条数
 * @param limit 单页条数
 * @param requested 请求页码
 * @returns 分页信息
 */
function pageOf(total: number, limit: number, requested: number | undefined): ListPage {
  const pages = Math.max(1, Math.ceil(total / limit))
  return { page: Math.min(positiveOf(requested, 1), pages), limit, total, pages }
}

/**
 * 归一正整数
 * 非有限值回落到缺省值，其余向下取整并保证不小于 1
 * @param value 原始值
 * @param fallback 缺省值
 * @returns 正整数
 */
function positiveOf(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback
  return Math.max(1, Math.trunc(value))
}

/**
 * 读取选中行的主键
 * 只返回已勾选且主键非空的行，供工具层直接使用
 * @param elem 列表根元素
 * @returns 主键集合
 * @example readSelection(document.querySelector('.moire-list'))
 */
export function readSelection(elem: Element): readonly string[] {
  const values: string[] = []
  for (const input of elem.querySelectorAll<HTMLInputElement>('[data-moire-row]')) {
    if (input.checked && input.value !== '') values.push(input.value)
  }
  return values
}

/**
 * 渲染列表
 * 只做 DOM 组装与适配层增强，不承载任何装配逻辑
 * @param assembly 列表装配结果
 * @param ui 界面适配
 * @param translate 取词条函数
 * @param target 挂载目标
 * @returns 列表根元素
 */
function renderList(assembly: ListAssembly, ui: UiAdapter | undefined, translate: Translate, target?: Element): Element {
  const root = document.createElement('div')
  root.className = 'moire-list'
  if (assembly.name !== undefined) root.setAttribute('data-moire-list', assembly.name)
  const table = document.createElement('table')
  table.className = 'moire-table'
  table.append(headOf(assembly, translate), bodyOf(assembly, translate), footOf(assembly, translate))
  root.append(table)
  if (target !== undefined) target.append(root)
  // 增强在入文档后统一执行，与字段层保持同一时序
  ui?.formRender()
  return root
}

/**
 * 生成数据行
 * 行上记录主键，选中控件按选择模式取复选或单选
 * @param assembly 列表装配结果
 * @param data 行数据
 * @returns 表格行
 */
function rowOf(assembly: ListAssembly, data: RowData): HTMLElement {
  const row = document.createElement('tr')
  const key = displayOf(data[assembly.key])
  row.setAttribute('data-moire-row-key', key)
  if (assembly.selection !== SelectionMode.None) {
    const cell = document.createElement('td')
    cell.className = 'moire-list-select'
    const input = document.createElement('input')
    input.type = assembly.selection === SelectionMode.Multiple ? 'checkbox' : 'radio'
    input.name = `moire-row-${assembly.name ?? 'list'}`
    input.value = key
    input.setAttribute('data-moire-row', '')
    cell.append(input)
    row.append(cell)
  }
  for (const column of assembly.columns) {
    const cell = document.createElement('td')
    cell.textContent = cellOf(column, data)
    row.append(cell)
  }
  return row
}

/**
 * 计算列跨度
 * 选择列参与占位，空态与汇总行按同一跨度铺满
 * @param assembly 列表装配结果
 * @returns 列跨度
 */
function spanOf(assembly: ListAssembly): number {
  return assembly.columns.length + (assembly.selection === SelectionMode.None ? 0 : 1)
}

/**
 * 稳定排序
 * 排序键相等时保留原始顺序，多键排序由 compareRows 负责
 * @param rows 行数据
 * @param order 排序子句
 * @returns 排序后的行数据
 */
function sortRows(rows: readonly RowData[], order: readonly OrderClause[]): readonly RowData[] {
  if (order.length === 0) return rows
  return rows
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const result = compareRows(left.row, right.row, order)
      return result === 0 ? left.index - right.index : result
    })
    .map((item) => item.row)
}
