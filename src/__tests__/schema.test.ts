/**
 * 声明校验单测
 * 必填、形态、范围、长度与正则约束，以及整表汇总口径
 */

import { FieldKind, RuleKind, ValueKind } from '../enums'
import { i18n } from '../i18n'
import type { FieldSchema, FormSchema } from '../schema'
import { validateField, validateForm } from '../schema'

/** 取中文词条 */
const translate = i18n.t

describe('字段校验', () => {
  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('必填拦截空白、空数组与空对象，零与假值放行', () => {
    const field: FieldSchema = { name: 'title', kind: FieldKind.Input, label: '标题', required: true }
    expect(validateField(field, '  ', translate)?.message).toBe('标题不能为空')
    expect(validateField(field, [], translate)?.message).toBe('标题不能为空')
    expect(validateField(field, {}, translate)?.message).toBe('标题不能为空')
    expect(validateField(field, 0, translate)).toBeUndefined()
    expect(validateField(field, false, translate)).toBeUndefined()
  })

  it('形态不符时给出期望类型', () => {
    const field: FieldSchema = { name: 'age', kind: FieldKind.Input, label: '年龄', rules: [{ kind: RuleKind.Type, value: ValueKind.Number }] }
    expect(validateField(field, '3', translate)?.message).toBe('年龄应为数字')
    expect(validateField(field, 3, translate)).toBeUndefined()
  })

  it('数值范围按闭区间判定，非数字单独提示', () => {
    const field: FieldSchema = { name: 'age', kind: FieldKind.Input, label: '年龄', rules: [{ kind: RuleKind.Range, min: 1, max: 9 }] }
    expect(validateField(field, 0, translate)?.message).toBe('年龄应在 1 到 9 之间')
    expect(validateField(field, 9, translate)).toBeUndefined()
    expect(validateField(field, 'x', translate)?.message).toBe('年龄应为数字')
  })

  it('单边界按最小或最大措辞提示', () => {
    const min: FieldSchema = { name: 'age', kind: FieldKind.Input, label: '年龄', rules: [{ kind: RuleKind.Range, min: 1 }] }
    const max: FieldSchema = { name: 'age', kind: FieldKind.Input, label: '年龄', rules: [{ kind: RuleKind.Range, max: 9 }] }
    expect(validateField(min, 0, translate)?.message).toBe('年龄不应小于 1')
    expect(validateField(max, 10, translate)?.message).toBe('年龄不应大于 9')
  })

  it('长度按字符数、元素数与键数度量', () => {
    const field: FieldSchema = { name: 'code', kind: FieldKind.Input, label: '编码', rules: [{ kind: RuleKind.Length, min: 2, max: 4 }] }
    expect(validateField(field, 'a', translate)?.message).toBe('编码长度应在 2 到 4 之间')
    expect(validateField(field, [1, 2, 3], translate)).toBeUndefined()
    expect(validateField(field, { a: 1 }, translate)?.message).toBe('编码长度应在 2 到 4 之间')
  })

  it('正则带全局标志时每次判定都从起点匹配', () => {
    const field: FieldSchema = {
      name: 'slug',
      kind: FieldKind.Input,
      label: '标识',
      rules: [{ kind: RuleKind.Pattern, value: /^mo/g }],
    }
    expect(validateField(field, 'moire', translate)).toBeUndefined()
    expect(validateField(field, 'moire', translate)).toBeUndefined()
    expect(validateField(field, 'xmoire', translate)?.message).toBe('标识格式不正确')
  })

  it('非必填规则遇到空值放行', () => {
    const field: FieldSchema = {
      name: 'age',
      kind: FieldKind.Input,
      label: '年龄',
      rules: [
        { kind: RuleKind.Type, value: ValueKind.Number },
        { kind: RuleKind.Range, min: 1, max: 9 },
      ],
    }
    expect(validateField(field, '', translate)).toBeUndefined()
    expect(validateField(field, undefined, translate)).toBeUndefined()
  })
})

describe('表单校验', () => {
  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('未提供的字段取声明初始值，问题按字段顺序汇总', () => {
    const schema: FormSchema = {
      fields: [
        { name: 'name', kind: FieldKind.Input, label: '名称', required: true },
        { name: 'age', kind: FieldKind.Input, label: '年龄', value: 'x', rules: [{ kind: RuleKind.Type, value: ValueKind.Number }] },
      ],
    }
    const result = validateForm(schema, {}, translate)
    expect(result.valid).toBe(false)
    expect(result.values).toEqual({ name: undefined, age: 'x' })
    expect(result.issues.map((issue) => issue.name)).toEqual(['name', 'age'])
  })

  it('全部通过时按字段名整理取值', () => {
    const schema: FormSchema = { fields: [{ name: 'name', kind: FieldKind.Input, required: true }] }
    expect(validateForm(schema, { name: '云纹' }, translate)).toEqual({ valid: true, values: { name: '云纹' }, issues: [] })
  })
})
