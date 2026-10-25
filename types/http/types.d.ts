/**
 * 请求契约
 * 请求配置、归一结果与钩子的类型约定
 */
import type { Params } from '../utils/object';
/** 请求方法 */
export type HttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
/** 请求配置 */
export interface HttpRequest {
    /** 请求地址，可相对 baseUrl */
    url: string;
    /** 请求方法，缺省 GET */
    method?: HttpMethod;
    /** 查询参数，按查询串规则拼接 */
    query?: Params;
    /** 请求体，按 JSON 提交 */
    body?: unknown;
    /** 附加请求头 */
    headers?: Record<string, string>;
    /** 取消信号 */
    signal?: AbortSignal;
}
/** 归一结果 */
export interface HttpResult<T = unknown> {
    /** 业务是否成功 */
    ok: boolean;
    /** 业务码，响应体无 code 时取 HTTP 状态码 */
    code: number;
    /** 业务消息，成功且无消息时为空串 */
    message: string;
    /** 业务数据，响应体无 data 时为原始响应 */
    data: T;
    /** 原始响应体 */
    raw: unknown;
}
/** 请求钩子 */
export interface HttpHooks {
    /** 发送前改写请求 */
    request?(request: HttpRequest): HttpRequest | Promise<HttpRequest>;
    /** 归一时改写结果 */
    response?(result: HttpResult): HttpResult | Promise<HttpResult>;
    /** 网络异常回调 */
    error?(error: Error): void;
}
/** 请求客户端 */
export interface HttpClient {
    /** 发送请求并归一结果 */
    request<T = unknown>(request: HttpRequest): Promise<HttpResult<T>>;
}
/** 客户端选项 */
export interface HttpOptions extends HttpHooks {
    /** 基础地址，拼在相对地址前 */
    baseUrl?: string;
    /** 固定请求头 */
    headers?: Record<string, string>;
    /** 请求实现，缺省用全局 fetch，便于测试替换 */
    fetch?: typeof fetch;
}
