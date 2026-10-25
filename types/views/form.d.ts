/**
 * 表单装配
 * 归一字段计划并校验重名，渲染委托字段层建表
 */
import type { Fields } from '../fields';
import type { Translate } from '../i18n';
import type { FormSchema } from '../schema';
import type { FormAssembler, FormAssembly } from './types';
/**
 * 装配表单
 * @param schema 表单声明
 * @param translate 取词条函数
 * @returns 表单装配结果
 * @example assembleForm({ fields: [{ name: 'title', kind: FieldKind.Input }] }, i18n.t)
 */
export declare function assembleForm(schema: FormSchema, translate: Translate): FormAssembly;
/**
 * 创建表单装配器
 * 字段能力缺失时仍可装配，渲染阶段才报错，便于先取结构后接字段层
 * @param fields 字段能力
 * @param translate 取词条函数
 * @returns 表单装配器
 * @example const form = createFormAssembler(fields, i18n.t)
 */
export declare function createFormAssembler(fields: Fields | undefined, translate: Translate): FormAssembler;
