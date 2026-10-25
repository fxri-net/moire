/**
 * 界面适配
 * layui、jQuery、layx、tinymce、Sortable 的唯一出口，缺失时安全降级
 */
import type { UiAdapter } from './types';
/**
 * 创建界面适配
 * @param source 全局来源，缺省取 globalThis
 * @returns 界面适配实例
 * @example createUi().notice('已保存')
 */
export declare function createUi(source?: unknown): UiAdapter;
export type { DateOption, NoticeOption, RichOption, SortableOption, UiAdapter, UploadOption } from './types';
/** 默认实例 */
export declare const ui: UiAdapter;
