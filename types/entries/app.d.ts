/**
 * 框架实例
 * 装配内核、内置插件与公开能力，不挂载全局、不自动启动
 */
import type { UiAdapter } from '../adapters/layui';
import { enums } from '../enums';
import type { Fields } from '../fields';
import type { HttpClient } from '../http';
import type { I18n } from '../i18n';
import type { Kernel, MoirePlugin } from '../kernel/types';
import type { Tools } from '../tools';
import type { Views } from '../views';
import * as utils from '../utils';
/** 框架实例 */
export interface Moire extends Kernel {
    /** 枚举字典 */
    readonly enum: typeof enums;
    /** 工具函数集合 */
    readonly utils: typeof utils;
    /** 国际化实例 */
    readonly i18n: I18n;
    /** 请求客户端 */
    readonly http: HttpClient;
    /** 界面适配 */
    readonly ui: UiAdapter;
    /** 字段能力 */
    readonly fields: Fields;
    /** 视图能力 */
    readonly views: Views;
    /** 工具能力 */
    readonly tools: Tools;
    /** 注册插件，启动后立即装配 */
    use(plugin: MoirePlugin): Moire;
    /** 按依赖顺序装配全部插件 */
    start(): Moire;
}
/**
 * 框架实例
 * 能力字段用取值器暴露，插件装配后始终取到最新实例
 */
export declare const moire: Moire;
declare global {
    /** 全局对象扩展 */
    interface Window {
        /** 框架实例，由入口挂载 */
        moire?: Moire;
    }
}
