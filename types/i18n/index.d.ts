/**
 * 国际化
 * 键化文案、具名插值与片段组合
 */
import type { Messages } from './messages';
export type { Locale, Messages } from './messages';
/** 插值参数 */
export type Interpolation = Record<string, string | number>;
/** 取词条函数 */
export type Translate = (key: string, params?: Interpolation) => string;
/** 国际化选项 */
export interface I18nOptions {
    /** 初始语言，缺省取文档或浏览器语言 */
    locale?: string;
    /** 追加词条，按语言合并进内置词条 */
    extra?: Record<string, Messages>;
}
/** 国际化实例 */
export interface I18n {
    /** 当前语言 */
    readonly locale: string;
    /** 取词条并按名插值，未命中时回退到第一语言再回退到键名 */
    t: Translate;
    /** 组合片段，分隔符随语言变化 */
    join(parts: readonly string[]): string;
    /** 切换语言 */
    setLocale(locale: string): void;
    /** 追加词条 */
    extend(locale: string, extra: Messages): void;
}
/**
 * 创建国际化实例
 * 每个实例持有独立词条副本，避免业务追加词条时相互污染
 * @param options 国际化选项
 * @returns 国际化实例
 * @example createI18n({ locale: 'en-us' }).t('http.failed') // 'System error'
 */
export declare function createI18n(options?: I18nOptions): I18n;
/** 默认实例 */
export declare const i18n: I18n;
