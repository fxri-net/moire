/**
 * 视图单测
 * 列表装配的分页、排序、空数据、选择与渲染，表单装配的字段计划与渲染委托
 */

import { FieldKind, OrderDirection, SelectionMode, ViewKind } from '../enums'
import { createFields } from '../fields'
import { i18n } from '../i18n'
import type { ColumnSchema, FieldSchema, RowData } from '../schema'
import { assembleForm, assembleList, createFormAssembler, createListAssembler, readSelection } from '../views'

/** 构造递增行数据 */
function rowsOf(count: number): RowData[] {
  return Array.from({ length: count }, (_item, index) => ({ id: index + 1, name: `行 ${String(index + 1)}` }))
}

/** 列表列声明 */
const columns: readonly ColumnSchema[] = [{ name: 'id' }, { name: 'name', title: '名称' }]

describe('列表装配', () => {
  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('按单页条数切片并计算页码', () => {
    const assembly = assembleList({ columns, rows: rowsOf(25), limit: 10 }, { page: 2 })
    expect(assembly.rows.map((row) => row.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    expect(assembly.page).toEqual({ page: 2, limit: 10, total: 25, pages: 3 })
  })

  it('页码越界时钳制到合法区间', () => {
    expect(assembleList({ columns, rows: rowsOf(25), limit: 10 }, { page: 99 }).page.page).toBe(3)
    expect(assembleList({ columns, rows: rowsOf(25), limit: 10 }, { page: 0 }).page.page).toBe(1)
  })

  it('查询覆盖声明的单页条数', () => {
    const assembly = assembleList({ columns, rows: rowsOf(5), limit: 2 }, { limit: 3 })
    expect(assembly.rows).toHaveLength(3)
    expect(assembly.page.limit).toBe(3)
  })

  it('无数据时固定第 1 页并给出缺省选择与主键', () => {
    const assembly = assembleList({ columns })
    expect(assembly.rows).toEqual([])
    expect(assembly.page).toEqual({ page: 1, limit: 10, total: 0, pages: 1 })
    expect(assembly.selection).toBe(SelectionMode.None)
    expect(assembly.key).toBe('id')
  })

  it('多键排序按子句顺序逐级比较', () => {
    const rows: readonly RowData[] = [
      { id: 1, group: 'b', score: 1 },
      { id: 2, group: 'a', score: 2 },
      { id: 3, group: 'a', score: 1 },
    ]
    const order = [
      { name: 'group', direction: OrderDirection.Asc },
      { name: 'score', direction: OrderDirection.Desc },
    ] as const
    expect(assembleList({ columns, rows }, { order }).rows.map((row) => row.id)).toEqual([2, 3, 1])
  })

  it('升序把空值排在最后', () => {
    const rows: readonly RowData[] = [
      { id: 1, score: 3 },
      { id: 2, score: undefined },
      { id: 3, score: 5 },
    ]
    const order = [{ name: 'score', direction: OrderDirection.Asc }] as const
    expect(assembleList({ columns, rows }, { order }).rows.map((row) => row.id)).toEqual([1, 3, 2])
  })

  it('降序按单个子句取反', () => {
    const rows: readonly RowData[] = [
      { id: 1, score: 3 },
      { id: 2, score: 5 },
      { id: 3, score: 1 },
    ]
    const order = [{ name: 'score', direction: OrderDirection.Desc }] as const
    expect(assembleList({ columns, rows }, { order }).rows.map((row) => row.id)).toEqual([2, 1, 3])
  })

  it('排序键相等时保留原始顺序', () => {
    const rows: readonly RowData[] = [
      { id: 2, group: 'a' },
      { id: 1, group: 'a' },
    ]
    const order = [{ name: 'group', direction: OrderDirection.Asc }] as const
    expect(assembleList({ columns, rows }, { order }).rows.map((row) => row.id)).toEqual([2, 1])
  })
})

describe('列表渲染', () => {
  const list = createListAssembler(undefined, i18n.t)

  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('装配器声明视图类型', () => {
    expect(list.kind).toBe(ViewKind.List)
  })

  it('输出表头、表体与表尾', () => {
    const root = list.render(list.assemble({ columns, rows: rowsOf(25), limit: 10 }, { page: 2 }))
    expect(root.className).toBe('moire-list')
    expect(root.querySelectorAll('tbody tr')).toHaveLength(10)
    expect(root.querySelector('.moire-list-total')?.textContent).toBe('共 25 条')
    expect(root.querySelector('.moire-list-page')?.textContent).toBe('第 2 / 3 页')
  })

  it('无数据时输出整行空态', () => {
    const root = list.render(list.assemble({ columns }))
    const cell = root.querySelector('.moire-list-empty')
    expect(cell?.textContent).toBe('暂无数据')
    expect(cell?.getAttribute('colspan')).toBe('2')
  })

  it('候选项按展示文本映射', () => {
    const root = list.render(
      list.assemble({
        columns: [{ name: 'status', choices: [{ value: '1', label: '启用' }] }],
        rows: [{ status: '1' }, { status: '2' }],
      }),
    )
    const texts = Array.from(root.querySelectorAll('tbody tr')).map((row) => row.textContent)
    expect(texts).toEqual(['启用', '2'])
  })

  it('多选渲染全选开关并读取选中主键', () => {
    const root = list.render(list.assemble({ name: 'user', columns, rows: rowsOf(3), selection: SelectionMode.Multiple }))
    const inputs = root.querySelectorAll<HTMLInputElement>('[data-moire-row]')
    expect(inputs).toHaveLength(3)
    expect(inputs[0]?.type).toBe('checkbox')
    const all = root.querySelector<HTMLInputElement>('[data-moire-select-all]')
    if (all === null) throw new Error('未找到全选开关')
    all.checked = true
    all.dispatchEvent(new Event('change'))
    expect(readSelection(root)).toEqual(['1', '2', '3'])
    const first = inputs[0]
    if (first === undefined) throw new Error('未找到行选择控件')
    first.checked = false
    expect(readSelection(root)).toEqual(['2', '3'])
  })

  it('单选渲染同名单选控件', () => {
    const root = list.render(list.assemble({ columns, rows: rowsOf(2), selection: SelectionMode.Single }))
    const inputs = root.querySelectorAll<HTMLInputElement>('[data-moire-row]')
    expect(inputs).toHaveLength(2)
    expect(inputs[0]?.type).toBe('radio')
    expect(inputs[0]?.name).toBe('moire-row-list')
  })
})

describe('表单装配', () => {
  const fields: readonly FieldSchema[] = [
    { name: 'title', kind: FieldKind.Input, label: '标题', required: true },
    { name: 'remark', kind: FieldKind.Textarea },
  ]

  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('字段计划按声明归一', () => {
    const assembly = assembleForm({ name: 'user', fields }, i18n.t)
    expect(assembly.name).toBe('user')
    expect(assembly.fields).toEqual([
      { name: 'title', label: '标题', kind: FieldKind.Input, required: true },
      { name: 'remark', label: 'remark', kind: FieldKind.Textarea, required: false },
    ])
  })

  it('字段重名直接报错', () => {
    const duplicate: FieldSchema = { name: 'title', kind: FieldKind.Input }
    expect(() => assembleForm({ fields: [duplicate, duplicate] }, i18n.t)).toThrow('字段 title 重复声明')
  })

  it('缺少字段能力时仍可装配，渲染才报错', () => {
    const form = createFormAssembler(undefined, i18n.t)
    const assembly = form.assemble({ fields })
    expect(form.kind).toBe(ViewKind.Form)
    expect(assembly.fields).toHaveLength(2)
    expect(() => form.render(assembly)).toThrow('视图渲染需要先装配字段能力')
  })

  it('渲染委托字段层建表', () => {
    const form = createFormAssembler(createFields(), i18n.t)
    const container = document.createElement('div')
    const elem = form.render(form.assemble({ name: 'user', fields }), container)
    expect(elem.getAttribute('data-moire-form')).toBe('user')
    expect(container.querySelector('.moire-form')).toBe(elem)
    expect(elem.querySelectorAll('[data-moire-field]')).toHaveLength(2)
  })
})
