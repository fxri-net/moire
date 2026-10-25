/**
 * 时间工具
 * 时间格式化、时间戳归一与时长拆解
 */
import { TimeUnit } from '../enums';
/** 格式化选项 */
export interface TimeFormatOptions {
    /** 是否保留毫秒，缺省不保留 */
    millisecond?: boolean;
}
/** 时长拆解选项 */
export interface TimeSpanOptions {
    /** 入参单位，缺省按秒 */
    from?: TimeUnit;
}
/**
 * 格式化时间
 * 按本地时区输出，避免旧实现固定加八小时的写法在异地时区失真
 * @param value 时间戳、日期字符串或日期对象，缺省取当前时间
 * @param options 格式化选项
 * @returns 格式化文本，无法解析时为空串
 * @example timeFormat(0) // '1970-01-01 08:00:00'
 */
export declare function timeFormat(value?: unknown, options?: TimeFormatOptions): string;
/**
 * 拆解时长
 * 由入参单位向上逐级取整，零值项不展示，单位名随语言变化
 * @param value 时长数值，按 from 指定的单位解释
 * @param options 时长拆解选项
 * @returns 组合后的时长文本，零时长为空串
 * @example timeSpan(3725) // '1时2分5秒'
 */
export declare function timeSpan(value: unknown, options?: TimeSpanOptions): string;
/**
 * 取毫秒时间戳
 * 数字入参按位宽区分秒与毫秒，字符串与日期对象交给日期解析
 * @param value 时间戳、日期字符串或日期对象，缺省取当前时间
 * @returns 毫秒时间戳，无法解析时为 NaN
 * @example timeValue(1729756800) // 1729756800000
 */
export declare function timeValue(value?: unknown): number;
