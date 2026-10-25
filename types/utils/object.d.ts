/**
 * 对象工具
 * 深层覆盖、参数正交合并与字段路径读写
 */
import { MergeBlankAs, MergeDirection, MergeMissing, MergeNormalize } from '../enums';
/** 参数表 */
export type Params = Record<string, unknown>;
/** 合并选项 */
export interface MergeOptions {
    /** 原地写入目标对象，缺省为真 */
    mutate?: boolean;
    /** 合并方向，缺省融合 */
    direction?: MergeDirection;
    /** 缺失兜底，缺省忽略 */
    missing?: MergeMissing;
    /** 空串归属，缺省视为有效值 */
    blankAs?: MergeBlankAs;
    /** 合并后归一，缺省不处理 */
    normalize?: MergeNormalize;
    /** 列表归一使用的分隔符，缺省逗号 */
    separator?: string;
}
/**
 * 深层覆盖
 * 来源值优先，双方都是容器且未到深度上限时继续下钻
 * @param target 目标值，容器时原地写入
 * @param source 来源值
 * @param limit 下钻深度，负数不限，0 表示只合当前层
 * @returns 合并结果，目标为容器时即为目标本身
 * @example cover({ a: 1 }, { a: 2, b: 3 }) // { a: 2, b: 3 }
 */
export declare function cover(target: unknown, source: unknown, limit?: number): unknown;
/**
 * 读取字段
 * 逐级取值，任一级缺失或为空串即返回空串，避免调用方到处判空
 * @param data 数据源
 * @param field 字段路径，按 joint 分隔
 * @param joint 路径分隔符，缺省 -_，即可同时用 - 与 _
 * @returns 末级取值，缺失时为空串
 * @example fieldRead({ a: { b: 1 } }, 'a-b') // 1
 */
export declare function fieldRead(data: unknown, field: string, joint?: string): unknown;
/**
 * 写入字段
 * 与 fieldRead 互逆，逐级包成嵌套对象
 * @param field 字段路径，按 joint 分隔
 * @param value 末级取值
 * @param joint 路径分隔符，缺省 -_
 * @returns 嵌套对象
 * @example fieldWrite('a-b', 1) // { a: { b: 1 } }
 */
export declare function fieldWrite(field: string, value: unknown, joint?: string): Params;
/**
 * 合并多值
 * 首个数值入参视为下钻深度；未给深度时对全部入参从右向左归并
 * @param args 深度与待合并值
 * @returns 合并结果
 * @example mergeAll(1, { a: 1 }, { a: 2 }) // { a: 2 }
 */
export declare function mergeAll(...args: unknown[]): unknown;
/**
 * 合并参数
 * 由方向、缺失兜底、空串归属、归一四维正交组合，取代原先的组合式模式码
 * @param target 目标参数，原地写入时为可写对象
 * @param source 来源，赋空方向下作为键名清单，其余方向下作为键值对
 * @param options 合并选项
 * @returns 合并结果，原地写入时即为目标本身
 * @example mergeParams({ a: 1 }, { a: 2, b: 3 }) // { a: 1, b: 3 }
 */
export declare function mergeParams(target: Params, source: unknown, options?: MergeOptions): Params;
