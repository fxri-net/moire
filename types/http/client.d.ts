/**
 * 请求客户端
 * 基于 fetch 的轻量封装，统一查询串拼接、JSON 提交与业务码归一
 */
import type { HttpClient, HttpOptions } from './types';
/**
 * 创建请求客户端
 * @param options 客户端选项
 * @returns 请求客户端
 * @example createHttp({ baseUrl: '/api' }).request({ url: '/list', method: 'POST' })
 */
export declare function createHttp(options?: HttpOptions): HttpClient;
