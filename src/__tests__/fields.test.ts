/**
 * 字段单测
 * 七步生命周期、内置渲染器的渲染与回显、表单汇总与提示
 */

import type { UiAdapter } from '../adapters/layui'
import { FieldKind, FieldStage } from '../enums'
import { createFields, createFieldsPlugin, fieldStages } from '../fields'
import { i18n } from '../i18n'
import { createKernel } from '../kernel/kernel'
import type { FieldSchema, FormSchema } from '../schema'

/**
 * 构造记录调用的界面适配
 * @param calls 调用记录
 * @returns 界面适配
 */
function stubUi(calls: string[]): UiAdapter {
  return {
    enabled: true,
    dateRender: (_elem, option) => {
      calls.push(`dateRender:${option?.type ?? 'date'}:${String(option?.range)}`)
    },
    fileRender: (_elem, option) => {
      calls.push(`fileRender:${option.url}`)
    },
    formRender: () => {
      calls.push('formRender')
    },
    notice: (text) => {
      calls.push(`notice:${text}`)
    },
    richRead: () => '适配层内容',
    richRender: (elem) => {
      calls.push(`richRender:${elem.id}`)
    },
    richWrite: (id, value) => {
      calls.push(`richWrite:${id}:${value}`)
    },
    selectsAct: (name) => {
      calls.push(`selectsAct:${name}`)
    },
    selectsRead: () => [],
    selectsWrite: (name) => {
      calls.push(`selectsWrite:${name}`)
    },
    sortRender: () => {
      calls.push('sortRender')
    },
    zIndex: () => 1,
  }
}

/**
 * 取包装内的输入控件
 * @param elem 字段包装
 * @returns 输入元素
 */
function inputOf(elem: Element | undefined): HTMLInputElement {
  const input = elem?.querySelector('input')
  if (!(input instanceof HTMLInputElement)) throw new Error('未找到输入控件')
  return input
}

/**
 * 取包装内的下拉控件
 * @param elem 字段包装
 * @returns 下拉元素
 */
function selectOf(elem: Element | undefined): HTMLSelectElement {
  const select = elem?.querySelector('select')
  if (!(select instanceof HTMLSelectElement)) throw new Error('未找到下拉控件')
  return select
}

describe('字段生命周期', () => {
  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('七步按固定顺序推进，一次性阶段不重复执行', () => {
    const field = createFields().create({ name: 'title', kind: FieldKind.Input })
    field.init().init().data().data().deploy().deploy().done().done()
    field.echo()
    field.reset().clean()
    expect(field.stages).toEqual(fieldStages)
    expect(fieldStages).toEqual([FieldStage.Init, FieldStage.Data, FieldStage.Deploy, FieldStage.Done, FieldStage.Echo, FieldStage.Reset, FieldStage.Clean])
  })

  it('输出、重置与清理可重复执行', () => {
    const field = createFields().create({ name: 'title', kind: FieldKind.Input, value: '云纹' })
    expect(field.echo()).toEqual({ valid: true, value: '云纹' })
    expect(field.echo()).toEqual({ valid: true, value: '云纹' })
    expect(field.stages.filter((stage) => stage === FieldStage.Echo)).toHaveLength(2)
  })

  it('内置渲染器覆盖全部字段类型', () => {
    expect([...createFields().renderers.keys()]).toHaveLength(16)
  })
})

describe('内置渲染器', () => {
  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('输入类按标签与占位提示铺开，回显取控件取值', () => {
    const field = createFields().create({ name: 'title', kind: FieldKind.Input, label: '标题' })
    field.deploy()
    expect(field.elem?.querySelector('.moire-field-label')?.textContent).toBe('标题')
    const input = inputOf(field.elem)
    expect(input.placeholder).toBe('请输入标题')
    input.value = '云纹'
    expect(field.read()).toBe('云纹')
  })

  it('密码与多行输入共用输入语义，占位提示一致', () => {
    const fields = createFields()
    const password = fields.create({ name: 'secret', kind: FieldKind.Password, label: '口令' })
    const textarea = fields.create({ name: 'remark', kind: FieldKind.Textarea, label: '备注' })
    expect(inputOf(password.deploy().elem).type).toBe('password')
    expect(textarea.deploy().elem?.querySelector('textarea')?.placeholder).toBe('请输入备注')
  })

  it('隐藏字段不渲染标签且不占位', () => {
    const field = createFields().create({ name: 'id', kind: FieldKind.Hidden, hidden: true, value: '7' })
    field.deploy()
    expect(field.elem?.hasAttribute('hidden')).toBe(true)
    expect(field.elem?.querySelector('.moire-field-label')).toBeNull()
    expect(field.read()).toBe('7')
  })

  it('下拉先补空值占位再铺候选项，初始值即选中项', () => {
    const field = createFields().create({
      name: 'state',
      kind: FieldKind.Select,
      value: 'on',
      option: {
        choices: [
          { value: 'on', label: '启用' },
          { value: 'off', label: '停用', disabled: true },
        ],
      },
    })
    field.deploy()
    const select = selectOf(field.elem)
    expect(select.options).toHaveLength(3)
    expect(select.options[0]?.textContent).toBe('请选择')
    expect(select.options[2]?.disabled).toBe(true)
    expect(field.read()).toBe('on')
  })

  it('勾选类字段清空写回假值，重置写回初始值', () => {
    const field = createFields().create({ name: 'active', kind: FieldKind.Switch, value: true })
    expect(field.read()).toBe(true)
    field.clean()
    expect(field.read()).toBe(false)
    field.reset()
    expect(field.read()).toBe(true)
    const legacy = createFields().create({ name: 'agree', kind: FieldKind.Checkbox, value: '1' })
    expect(legacy.read()).toBe(true)
  })

  it('展示类字段写入即渲染文本', () => {
    const fields = createFields()
    const text = fields.create({ name: 'summary', kind: FieldKind.Text, value: '云纹' })
    const html = fields.create({ name: 'banner', kind: FieldKind.Html, value: '<b>云纹</b>' })
    expect(text.read()).toBe('云纹')
    expect(html.read()).toBe('<b>云纹</b>')
    expect(text.elem?.querySelector('.moire-field-label')?.textContent).toBe('summary')
  })

  it('已选字段按候选项文案渲染标签，取值仍为原始值', () => {
    const field = createFields().create({
      name: 'tags',
      kind: FieldKind.Selected,
      value: ['a', 'b'],
      option: {
        choices: [
          { value: 'a', label: '甲' },
          { value: 'b', label: '乙' },
        ],
      },
    })
    field.deploy()
    const chips = Array.from(field.elem?.querySelectorAll('.moire-selected-item') ?? [])
    expect(chips.map((chip) => chip.textContent)).toEqual(['甲', '乙'])
    expect(field.read()).toEqual(['a', 'b'])
  })

  it('多选字段读写原生多选控件', () => {
    const field = createFields().create({
      name: 'cities',
      kind: FieldKind.Selects,
      value: ['sh', 'bj'],
      option: {
        choices: [
          { value: 'sh', label: '上海' },
          { value: 'bj', label: '北京' },
          { value: 'gz', label: '广州' },
        ],
      },
    })
    expect(field.read()).toEqual(['sh', 'bj'])
    field.clean()
    expect(field.read()).toEqual([])
  })

  it('表格字段按列声明铺表并原样读回行集', () => {
    const rows = [{ name: '云纹', age: 3 }]
    const field = createFields().create({
      name: 'rows',
      kind: FieldKind.Table,
      value: rows,
      option: { columns: [{ name: 'name', title: '名称' }, { name: 'age' }] },
    })
    field.deploy()
    expect(Array.from(field.elem?.querySelectorAll('th') ?? []).map((cell) => cell.textContent)).toEqual(['名称', 'age'])
    expect(Array.from(field.elem?.querySelectorAll('td') ?? []).map((cell) => cell.textContent)).toEqual(['云纹', '3'])
    expect(field.read()).toEqual(rows)
    field.clean()
    expect(field.read()).toEqual([])
  })

  it('日期、富文本与文件在适配层可用时交给其增强', () => {
    const calls: string[] = []
    const fields = createFields({ ui: stubUi(calls) })
    const date = fields.create({ name: 'day', kind: FieldKind.Date, option: { dateType: 'datetime' } })
    const span = fields.create({ name: 'span', kind: FieldKind.DateText })
    const rich = fields.create({ name: 'body', kind: FieldKind.RichText, value: '云纹' })
    const file = fields.create({ name: 'avatar', kind: FieldKind.File, option: { uploadUrl: '/upload', accept: 'image/*' } })
    date.deploy()
    span.deploy()
    rich.deploy()
    file.deploy()
    expect(calls.slice(0, 2)).toEqual(['dateRender:datetime:false', 'dateRender:date:true'])
    // 富文本标识带页面内递增序号，按实际生成的标识核对写入
    const rendered = calls[2] ?? ''
    expect(rendered).toMatch(/^richRender:moire-body-\d+$/)
    expect(calls[3]).toBe(`richWrite:${rendered.replace('richRender:', '')}:云纹`)
    expect(calls[4]).toBe('fileRender:/upload')
    expect(rich.read()).toBe('适配层内容')
    expect(file.elem?.querySelector('.moire-file-pick')?.textContent).toBe('选择文件')
  })

  it('富文本在缺少适配层时退化为多行文本', () => {
    const field = createFields().create({ name: 'body', kind: FieldKind.RichText, value: '云纹' })
    expect(field.read()).toBe('云纹')
  })

  it('多选在适配层给出取值时以其为准', () => {
    const calls: string[] = []
    const ui = stubUi(calls)
    const field = createFields({ ui: { ...ui, selectsRead: () => ['gz'] } }).create({
      name: 'cities',
      kind: FieldKind.Selects,
      option: { choices: [{ value: 'sh', label: '上海' }], actions: ['all'] },
    })
    field.deploy()
    expect(field.read()).toEqual(['gz'])
    expect(calls).toEqual(['selectsAct:cities', 'selectsWrite:cities'])
  })
})

describe('字段装配', () => {
  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('未注册类型与重复字段名在创建时报错', () => {
    const fields = createFields()
    const ghost: FieldSchema = { name: 'x', kind: 'ghost' as unknown as FieldKind }
    expect(() => fields.create(ghost)).toThrow('未注册的字段类型：ghost')
    const schema: FormSchema = {
      fields: [
        { name: 'a', kind: FieldKind.Input },
        { name: 'a', kind: FieldKind.Input },
      ],
    }
    expect(() => fields.createForm(schema)).toThrow('字段 a 重复声明')
  })

  it('注册自定义渲染器后覆盖同名类型', () => {
    const field = createFields()
      .register({
        kind: FieldKind.Input,
        deploy: () => document.createElement('span'),
        read: () => '自定义取值',
        write: () => undefined,
      })
      .create({ name: 'title', kind: FieldKind.Input })
    expect(field.read()).toBe('自定义取值')
  })

  it('表单汇总取值与校验问题，未通过项逐条提示', () => {
    const notices: string[] = []
    const fields = createFields({
      notify: (notice) => {
        notices.push(notice.message)
      },
    })
    const schema: FormSchema = {
      name: 'search',
      fields: [
        { name: 'keyword', kind: FieldKind.Input, label: '关键字', required: true },
        { name: 'page', kind: FieldKind.Input, value: '1' },
      ],
    }
    const form = fields.createForm(schema, document.body)
    expect(form.elem.getAttribute('data-moire-form')).toBe('search')
    expect(document.body.contains(form.elem)).toBe(true)
    const failed = form.echo()
    expect(failed.valid).toBe(false)
    expect(failed.issues.map((issue) => issue.name)).toEqual(['keyword'])
    expect(notices).toEqual(['关键字不能为空'])
    expect(form.values()).toEqual({ keyword: '', page: '1' })
    const [keyword] = Array.from(form.elem.querySelectorAll('input'))
    if (keyword instanceof HTMLInputElement) keyword.value = '云纹'
    expect(form.echo()).toEqual({ valid: true, values: { keyword: '云纹', page: '1' }, issues: [] })
    form.clean()
    expect(form.values()).toEqual({ keyword: '', page: '' })
    form.reset()
    expect(form.values()).toEqual({ keyword: '', page: '1' })
  })

  it('插件装配后校验提示改走内核通知', () => {
    const notices: string[] = []
    const plugin = createFieldsPlugin()
    createKernel({
      notify: (notice) => {
        notices.push(notice.message)
      },
    })
      .use(plugin)
      .start()
    plugin.fields.create({ name: 'title', kind: FieldKind.Input, label: '标题', required: true }).echo()
    expect(notices).toEqual(['标题不能为空'])
  })
})
