/**
 * 字段装配
 * 把声明、渲染器与界面适配组装成字段实例与表单实例，七步生命周期按需推进
 */
import { FieldStage } from '../enums';
import type { Fields, FieldsOptions, FieldsPlugin } from './types';
/** 字段阶段顺序：前四步一次性，后三步可重复 */
export declare const fieldStages: readonly FieldStage[];
/**
 * 创建字段能力
 * 内置渲染器先全部注册，业务可按类型覆盖
 * @param options 字段选项
 * @returns 字段能力
 * @example createFields({ ui }).createForm(schema, document.body).echo()
 */
export declare function createFields(options?: FieldsOptions): Fields;
/**
 * 创建字段插件
 * 装配时接管内核通知，校验提示随内核统一下发
 * @param options 字段选项
 * @returns 字段插件
 * @example createKernel().use(createFieldsPlugin({ ui })).start()
 */
export declare function createFieldsPlugin(options?: FieldsOptions): FieldsPlugin;
