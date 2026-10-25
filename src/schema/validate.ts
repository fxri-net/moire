/**
 * 声明校验
 * 按字段声明的规则逐条判定，返回首个未通过项的可展示文案
 */

import { RuleKind, ValueKind, assertNever } from '../enums'
import type { Translate } from '../i18n'
import { isArray, isNumeric, isObject, isString } from '../utils/type'
import type { FieldSchema, FormSchema, Rule, RowData, ValidationIssue, ValidationResult } from './types'

/**
 * 判定单条规则
 * 非必填规则遇到空值一律放行，避免未填字段叠加多条提示
 * @param rule 规则
 * @param value 待判定值
 * @param label 字段标签
 * @param translate 取词条函数
 * @returns 未通过时的文案，通过时为 undefined
 */
function check(rule: Rule, value: unknown, label: string, translate: Translate): string | undefined {
  switch (rule.kind) {
    case RuleKind.Required:
      return isAbsent(value) ? translate('schema.required', { label }) : undefined
    case RuleKind.Type:
      // 空值交给必填规则判定，未填的非必填字段不再叠加形态提示
      if (isAbsent(value)) return undefined
      return matchesValue(value, rule.value) ? undefined : translate('schema.type', { label, type: translate(`schema.value.${rule.value}`) })
    case RuleKind.Range: {
      if (isAbsent(value)) return undefined
      if (!isNumeric(value)) return translate('schema.number', { label })
      return within(Number(value), rule.min, rule.max, 'range', label, translate)
    }
    case RuleKind.Length: {
      if (isAbsent(value)) return undefined
      const size = measure(value)
      if (size === undefined) return translate('schema.length', { label })
      return within(size, rule.min, rule.max, 'length', label, translate)
    }
    case RuleKind.Pattern: {
      if (isAbsent(value)) return undefined
      // 带 g 标志的表达式会记忆上次匹配位置，判定前先复位
      rule.value.lastIndex = 0
      return rule.value.test(String(value)) ? undefined : translate('schema.pattern', { label })
    }
    default:
      return assertNever(rule, 'RuleKind')
  }
}

/**
 * 汇集字段规则
 * 必填标记等价于在规则最前追加一条必填规则，已显式声明时不重复追加
 * @param field 字段声明
 * @returns 按判定顺序排列的规则
 */
function collectRules(field: FieldSchema): Rule[] {
  const rules = field.rules === undefined ? [] : [...field.rules]
  if (field.required === true && !rules.some((rule) => rule.kind === RuleKind.Required)) {
    rules.unshift({ kind: RuleKind.Required })
  }
  return rules
}

/**
 * 判断是否为空值
 * 空串、纯空白、空数组与空对象都算空，零与假值不算
 * @param value 待判定值
 * @returns 为空时为 true
 */
function isAbsent(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (isString(value)) return value.trim() === ''
  if (isArray(value)) return value.length === 0
  if (isObject(value)) return Object.keys(value).length === 0
  return false
}

/**
 * 判断取值形态
 * @param value 待判定值
 * @param kind 期望形态
 * @returns 相符时为 true
 */
function matchesValue(value: unknown, kind: ValueKind): boolean {
  switch (kind) {
    case ValueKind.Array:
      return isArray(value)
    case ValueKind.Boolean:
      return typeof value === 'boolean'
    case ValueKind.Number:
      return typeof value === 'number' && !Number.isNaN(value)
    case ValueKind.Object:
      return isObject(value)
    case ValueKind.String:
      return isString(value)
    default:
      return assertNever(kind, 'ValueKind')
  }
}

/**
 * 度量长度
 * 字符串取字符数，数组取元素数，对象取键数，其余不可度量
 * @param value 待度量值
 * @returns 长度，不可度量时为 undefined
 */
function measure(value: unknown): number | undefined {
  if (isString(value)) return value.length
  if (isArray(value)) return value.length
  if (isObject(value)) return Object.keys(value).length
  return undefined
}

/**
 * 校验单个字段
 * @param field 字段声明
 * @param value 待校验值
 * @param translate 取词条函数
 * @returns 首个问题，全部通过时为 undefined
 * @example validateField({ name: 'age', kind: FieldKind.Input, required: true }, '', i18n.t)
 */
export function validateField(field: FieldSchema, value: unknown, translate: Translate): ValidationIssue | undefined {
  const label = field.label ?? field.name
  for (const rule of collectRules(field)) {
    const message = check(rule, value, label, translate)
    if (message !== undefined) return { name: field.name, kind: rule.kind, message }
  }
  return undefined
}

/**
 * 校验整张表单
 * 未提供的字段取声明里的初始值，结果按字段顺序整理
 * @param schema 表单声明
 * @param values 待校验取值，按字段名索引
 * @param translate 取词条函数
 * @returns 校验结果
 * @example validateForm(schema, { name: 'mo' }, i18n.t).valid
 */
export function validateForm(schema: FormSchema, values: RowData, translate: Translate): ValidationResult {
  const echo: RowData = {}
  const issues: ValidationIssue[] = []
  for (const field of schema.fields) {
    const provided = values[field.name]
    const value = provided === undefined ? field.value : provided
    echo[field.name] = value
    const issue = validateField(field, value, translate)
    if (issue !== undefined) issues.push(issue)
  }
  return { valid: issues.length === 0, values: echo, issues }
}

/**
 * 判定数值区间
 * 上下界都缺省时视为不约束
 * @param value 待判定数值
 * @param min 下界，含边界
 * @param max 上界，含边界
 * @param scope 词条前缀，区分数值与长度
 * @param label 字段标签
 * @param translate 取词条函数
 * @returns 未通过时的文案，通过时为 undefined
 */
function within(
  value: number,
  min: number | undefined,
  max: number | undefined,
  scope: 'length' | 'range',
  label: string,
  translate: Translate,
): string | undefined {
  const hasMin = min !== undefined
  const hasMax = max !== undefined
  if (!hasMin && !hasMax) return undefined
  if (hasMin && hasMax && (value < min || value > max)) {
    return translate(`schema.${scope}.between`, { label, min, max })
  }
  if (hasMin && value < min) return translate(`schema.${scope}.min`, { label, min })
  if (hasMax && value > max) return translate(`schema.${scope}.max`, { label, max })
  return undefined
}
