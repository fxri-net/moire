/**
 * 文件工具
 * 类方法拆解与路径后缀解析
 */
import type { Params } from './object';
/** 类方法拆解结果 */
export interface ClassMethod {
    /** 有值项，按原键名保留 */
    param: Params;
    /** 空值项的键名，按出现顺序保留 */
    method: string[];
}
/**
 * 拆解类方法
 * 值为空的键名视为方法名，其余键值对视为参数
 * @param object 待拆解对象
 * @returns 参数与方法名
 * @example classMethod({ id: 1, save: null }) // { param: { id: 1 }, method: ['save'] }
 */
export declare function classMethod(object: unknown): ClassMethod;
/**
 * 取路径后缀名
 * @param path 路径，可含查询串
 * @returns 后缀名，无后缀时为空串
 * @example pathExt('a/b.min.js') // 'js'
 */
export declare function pathExt(path: string): string;
