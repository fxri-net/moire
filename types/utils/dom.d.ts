/**
 * 元素工具
 * 行内样式读写与层叠层级探测
 */
/** 样式表 */
export type Styles = Record<string, string>;
/**
 * 读取或设置行内样式
 * 样式名同时兼容小驼峰与短横线写法
 * @param elem 目标元素，数组取首个
 * @param name 样式名或样式表
 * @param value 样式值，缺省时读取计算样式
 * @returns 读取时返回计算值，设置时无返回
 * @example css(elem, 'fontSize', '14px')
 */
export declare function css(elem: unknown, name: string | Styles, value?: string): string | undefined;
/**
 * 探测最大层叠层级
 * 同时兼顾宿主页面，跨域父窗口不可访问时自动跳过
 * @returns 最大层级，无有效值时为零
 * @example maxZIndex() // 1997
 */
export declare function maxZIndex(): number;
