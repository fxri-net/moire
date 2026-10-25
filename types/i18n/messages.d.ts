/**
 * 内置词条
 * 键名按领域点分，值一律为可直接展示的文本
 */
/** 词条集合 */
export type Messages = Record<string, string>;
/** 内置语言 */
export declare const locales: readonly ["zh-cn", "en-us"];
/** 内置语言 */
export type Locale = (typeof locales)[number];
/** 词条总表 */
export declare const messages: Record<Locale, Messages>;
