/**
 * 地址工具
 * 查询参数的组装、追加与读取
 */
import { UrlMode } from '../enums';
import type { Params } from './object';
/** 地址选项 */
export interface UrlOptions {
    /** 地址模式，缺省读取 */
    mode?: UrlMode;
    /** 目标地址，缺省取当前页面 */
    url?: string;
    /** 读取模式下的参数名，给定时只返回该参数值 */
    name?: string;
    /** 待合并的参数，可为查询串 */
    param?: unknown;
    /** 取址窗口，缺省当前窗口 */
    window?: Window;
}
/**
 * 组装、追加或读取地址参数
 * @param options 地址选项
 * @returns 组装与追加返回地址字符串，读取返回参数对象或单个参数值
 * @example url({ mode: UrlMode.Append, param: { page: 1 } }) // '/list?page=1'
 */
export declare function url(options?: UrlOptions): string | Params | undefined;
