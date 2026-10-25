/**
 * 内置渲染器
 * 每个字段类型一个渲染器，部署、读取、写入三段分离，控件缺失时安全退化
 */
import type { FieldRenderer } from './types';
/**
 * 创建内置渲染器
 * 顺序与字段类型枚举一致，便于对照
 * @returns 渲染器列表
 * @example createRenderers().map((item) => item.kind)
 */
export declare function createRenderers(): FieldRenderer[];
