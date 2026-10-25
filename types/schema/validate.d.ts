/**
 * 声明校验
 * 按字段声明的规则逐条判定，返回首个未通过项的可展示文案
 */
import type { Translate } from '../i18n';
import type { FieldSchema, FormSchema, RowData, ValidationIssue, ValidationResult } from './types';
/**
 * 校验单个字段
 * @param field 字段声明
 * @param value 待校验值
 * @param translate 取词条函数
 * @returns 首个问题，全部通过时为 undefined
 * @example validateField({ name: 'age', kind: FieldKind.Input, required: true }, '', i18n.t)
 */
export declare function validateField(field: FieldSchema, value: unknown, translate: Translate): ValidationIssue | undefined;
/**
 * 校验整张表单
 * 未提供的字段取声明里的初始值，结果按字段顺序整理
 * @param schema 表单声明
 * @param values 待校验取值，按字段名索引
 * @param translate 取词条函数
 * @returns 校验结果
 * @example validateForm(schema, { name: 'mo' }, i18n.t).valid
 */
export declare function validateForm(schema: FormSchema, values: RowData, translate: Translate): ValidationResult;
