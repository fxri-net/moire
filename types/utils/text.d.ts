/**
 * 文本工具
 * 字符串拆分、组合、JSON 归一与查询串编解码
 */
import { JsonOp, PadSide } from '../enums';
/** 查询串容器 */
type Query = Record<string, unknown>;
/** 拆分选项 */
export interface ExplodeOptions {
    /** 保留段数：正数从头保留、负数从尾保留、0 表示不拆分 */
    limit?: number;
    /** 分隔符按正则表达式解释 */
    regular?: boolean;
}
/** 填充选项 */
export interface PadOptions {
    /** 填充方向，缺省右侧对齐 */
    side?: PadSide;
    /** 填充字符，缺省空格 */
    with?: string;
}
/**
 * 拆分字符串
 * 数字化入参先转字符串再拆，空值按单个空串返回，避免调用方到处判空
 * @param separator 分隔符，regular 为真时按正则解释
 * @param data 待拆分数据
 * @param options 拆分选项
 * @returns 拆分结果，元素一律为字符串
 * @example explode('?', '/a?b=1', { limit: 2 }) // ['/a', 'b=1']
 */
export declare function explode(separator: string, data: unknown, options?: ExplodeOptions): string[];
/**
 * 组合字符串
 * @param separator 分隔符
 * @param data 待组合数据，对象按值组合
 * @returns 组合结果
 * @example implode('-', ['a', 'b']) // 'a-b'
 */
export declare function implode(separator: string, data: unknown): string;
/**
 * 归一 JSON
 * 编码时已是 JSON 字符串则原样返回；解码时字符串按查询串或 JSON 解析，标量包成单元素数组
 * @param data 待处理数据
 * @param op 处理方向
 * @returns 处理结果
 * @example json('[1,2]', JsonOp.Decode) // [1, 2]
 */
export declare function json(data: unknown, op: JsonOp): unknown;
/**
 * 替换字符串
 * @param pattern 正则表达式原文，统一按全局匹配
 * @param replacement 替换内容，支持 $1 等分组引用
 * @param value 待替换数据，非字符串先转字符串
 * @returns 替换结果
 * @example replace('^a', 'b', 'abc') // 'bbc'
 */
export declare function replace(pattern: string, replacement: string, value: unknown): string;
/**
 * 解码查询串
 * 支持 a[b][]=1 形式的多级结构，同一层的 [] 按出现顺序追加
 * @param data 查询串，可带前导问号以外任意文本
 * @returns 解析后的参数对象
 * @example strDecode('a=1&b[]=2') // { a: '1', b: ['2'] }
 */
export declare function strDecode(data: unknown): Query;
/**
 * 编码查询串
 * 对象按键名展开为 [key]，数组展开为 []，便于服务端按同名规则还原
 * @param data 参数对象
 * @returns 查询串，不含前导问号
 * @example strEncode({ a: 1, b: ['2'] }) // 'a=1&b[]=2'
 */
export declare function strEncode(data: unknown): string;
/**
 * 填充字符串
 * @param value 原字符串，非字符串先转字符串
 * @param length 目标长度，不足时原样返回
 * @param options 填充选项
 * @returns 填充结果
 * @example strPad(7, 3, { with: '0' }) // '007'
 */
export declare function strPad(value: string | number | null | undefined, length: number, options?: PadOptions): string;
/**
 * 数组去重
 * @param values 待去重数组，按严格相等判断
 * @returns 去重后的新数组，保留首次出现的顺序
 * @example unique([1, '1', 1]) // [1, '1']
 */
export declare function unique<T>(values: readonly T[]): T[];
export {};
