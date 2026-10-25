/**
 * 视图层：列表、搜索、新增、编辑、详情
 */
import type { Views, ViewsOptions, ViewsPlugin } from './types';
export * from './form';
export * from './list';
export * from './types';
/**
 * 创建视图能力
 * @param options 视图选项
 * @returns 视图能力
 * @example createViews({ fields, ui }).list.assemble(schema, { page: 2 })
 */
export declare function createViews(options?: ViewsOptions): Views;
/**
 * 创建视图插件
 * 装配时从内核取字段能力重建装配器，业务无需重复传入字段实例
 * @param options 视图选项
 * @returns 视图插件
 * @example createKernel().use(createFieldsPlugin()).use(createViewsPlugin()).start()
 */
export declare function createViewsPlugin(options?: ViewsOptions): ViewsPlugin;
