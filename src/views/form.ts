/**
 * 表单装配
 * 归一字段计划并校验重名，渲染委托字段层建表
 */

import { ViewKind } from '../enums'
import type { Fields } from '../fields'
import type { Translate } from '../i18n'
import type { FieldSchema, FormSchema } from '../schema'
import type { FormAssembler, FormAssembly, FormFieldPlan } from './types'

/**
 * 装配表单
 * @param schema 表单声明
 * @param translate 取词条函数
 * @returns 表单装配结果
 * @example assembleForm({ fields: [{ name: 'title', kind: FieldKind.Input }] }, i18n.t)
 */
export function assembleForm(schema: FormSchema, translate: Translate): FormAssembly {
  return {
    fields: planFields(schema.fields, translate),
    schema,
    ...(schema.name === undefined ? {} : { name: schema.name }),
  }
}

/**
 * 创建表单装配器
 * 字段能力缺失时仍可装配，渲染阶段才报错，便于先取结构后接字段层
 * @param fields 字段能力
 * @param translate 取词条函数
 * @returns 表单装配器
 * @example const form = createFormAssembler(fields, i18n.t)
 */
export function createFormAssembler(fields: Fields | undefined, translate: Translate): FormAssembler {
  return {
    kind: ViewKind.Form,
    assemble: (schema) => assembleForm(schema, translate),
    render: (assembly, target) => renderForm(assembly, fields, translate, target),
  }
}

/**
 * 归一字段计划
 * 标签缺省取字段名，重复声明直接报错
 * @param fields 字段声明
 * @param translate 取词条函数
 * @returns 字段计划
 */
function planFields(fields: readonly FieldSchema[], translate: Translate): readonly FormFieldPlan[] {
  const names = new Set<string>()
  return fields.map((field) => {
    if (names.has(field.name)) throw new Error(translate('field.duplicate', { name: field.name }))
    names.add(field.name)
    return { name: field.name, label: field.label ?? field.name, kind: field.kind, required: field.required === true }
  })
}

/**
 * 渲染表单
 * 直接复用字段层的表单实例，字段排布与校验规则不在视图层重复实现
 * @param assembly 表单装配结果
 * @param fields 字段能力
 * @param translate 取词条函数
 * @param target 挂载目标
 * @returns 表单根元素
 */
function renderForm(assembly: FormAssembly, fields: Fields | undefined, translate: Translate, target?: Element): Element {
  if (fields === undefined) throw new Error(translate('view.fields'))
  return fields.createForm(assembly.schema, target).elem
}
