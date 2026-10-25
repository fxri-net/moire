/**
 * 时间工具
 * 时间格式化、时间戳归一与时长拆解
 */

import { TimeUnit } from '../enums'
import { i18n } from '../i18n'
import { strPad } from './text'
import { isNumeric, isSet, isString } from './type'

/** 格式化选项 */
export interface TimeFormatOptions {
  /** 是否保留毫秒，缺省不保留 */
  millisecond?: boolean
}

/** 时长拆解选项 */
export interface TimeSpanOptions {
  /** 入参单位，缺省按秒 */
  from?: TimeUnit
}

/** 单位由小到大的顺序 */
const UNIT_ORDER: readonly TimeUnit[] = [TimeUnit.Millisecond, TimeUnit.Second, TimeUnit.Minute, TimeUnit.Hour, TimeUnit.Day, TimeUnit.Month, TimeUnit.Year]

/** 各单位折算的毫秒数，月按 30 天、年按 12 月 */
const UNIT_SIZE: Record<TimeUnit, number> = {
  [TimeUnit.Millisecond]: 1,
  [TimeUnit.Second]: 1000,
  [TimeUnit.Minute]: 60 * 1000,
  [TimeUnit.Hour]: 60 * 60 * 1000,
  [TimeUnit.Day]: 24 * 60 * 60 * 1000,
  [TimeUnit.Month]: 30 * 24 * 60 * 60 * 1000,
  [TimeUnit.Year]: 12 * 30 * 24 * 60 * 60 * 1000,
}

/**
 * 格式化时间
 * 按本地时区输出，避免旧实现固定加八小时的写法在异地时区失真
 * @param value 时间戳、日期字符串或日期对象，缺省取当前时间
 * @param options 格式化选项
 * @returns 格式化文本，无法解析时为空串
 * @example timeFormat(0) // '1970-01-01 08:00:00'
 */
export function timeFormat(value?: unknown, options: TimeFormatOptions = {}): string {
  const date = toDate(value)
  if (!date) return ''
  const day = `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  const clock = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  return options.millisecond === true ? `${day} ${clock}.${pad(date.getMilliseconds(), 3)}` : `${day} ${clock}`
}

/**
 * 拆解时长
 * 由入参单位向上逐级取整，零值项不展示，单位名随语言变化
 * @param value 时长数值，按 from 指定的单位解释
 * @param options 时长拆解选项
 * @returns 组合后的时长文本，零时长为空串
 * @example timeSpan(3725) // '1时2分5秒'
 */
export function timeSpan(value: unknown, options: TimeSpanOptions = {}): string {
  if (!isNumeric(value)) return ''
  const total = Number(value)
  if (total === 0) return ''
  const from = options.from ?? TimeUnit.Second
  const start = UNIT_ORDER.indexOf(from)
  const units = UNIT_ORDER.slice(start).reverse()
  const parts: string[] = []
  // 负时长先取绝对值，最后统一加符号，避免逐级取整时符号错位
  let rest = Math.abs(total) * UNIT_SIZE[from]
  for (const unit of units) {
    const size = UNIT_SIZE[unit]
    const count = Math.floor(rest / size)
    rest %= size
    if (count === 0) continue
    parts.push(String(count), i18n.t(`time.unit.${unit}`))
  }
  if (parts.length === 0) return ''
  const text = i18n.join(parts)
  return total < 0 ? `-${text}` : text
}

/**
 * 取毫秒时间戳
 * 数字入参按位宽区分秒与毫秒，字符串与日期对象交给日期解析
 * @param value 时间戳、日期字符串或日期对象，缺省取当前时间
 * @returns 毫秒时间戳，无法解析时为 NaN
 * @example timeValue(1729756800) // 1729756800000
 */
export function timeValue(value?: unknown): number {
  if (!isSet(value) || value === '') return Date.now()
  if (isNumeric(value)) {
    const timestamp = Number(value)
    // 十位及以内视为秒级时间戳
    const digits = String(Math.trunc(Math.abs(timestamp))).length
    return digits <= 10 ? timestamp * 1000 : timestamp
  }
  const date = toDate(value)
  return date ? date.getTime() : Number.NaN
}

/**
 * 补零
 * @param value 数值
 * @param length 目标位数
 * @returns 补零后的文本
 */
function pad(value: number, length = 2): string {
  return strPad(value, length, { with: '0' })
}

/**
 * 归一日期对象
 * @param value 时间戳、日期字符串或日期对象
 * @returns 日期对象，无法解析时为空
 */
function toDate(value?: unknown): Date | undefined {
  if (!isSet(value) || value === '') return new Date()
  let date: Date | undefined
  if (value instanceof Date) date = new Date(value.getTime())
  else if (isNumeric(value)) date = new Date(Number(value))
  else if (isString(value)) date = new Date(value)
  return date && !Number.isNaN(date.getTime()) ? date : undefined
}
