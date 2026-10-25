/**
 * 时间工具单测
 * 格式化按本地时区取证，避免断言依赖运行机器的时区偏移
 */

import { TimeUnit } from '../enums'
import { i18n } from '../i18n'
import { timeFormat, timeSpan, timeValue } from '../utils/time'

describe('timeFormat', () => {
  it('按本地时区输出到秒', () => {
    expect(timeFormat(new Date(2024, 0, 2, 3, 4, 5))).toBe('2024-01-02 03:04:05')
  })

  it('可选保留毫秒', () => {
    expect(timeFormat(new Date(2024, 0, 2, 3, 4, 5, 678), { millisecond: true })).toBe('2024-01-02 03:04:05.678')
  })

  it('无法解析时返回空串', () => {
    expect(timeFormat('not-a-date')).toBe('')
  })
})

describe('timeValue', () => {
  it('秒级时间戳按位宽补成毫秒', () => {
    expect(timeValue(1729756800)).toBe(1729756800000)
  })

  it('毫秒级时间戳原样返回', () => {
    expect(timeValue(1729756800000)).toBe(1729756800000)
  })

  it('空值取当前时间，非法值返回 NaN', () => {
    expect(timeValue('')).toBeGreaterThan(0)
    expect(timeValue('not-a-date')).toBeNaN()
  })
})

describe('timeSpan', () => {
  beforeEach(() => {
    i18n.setLocale('zh-cn')
  })

  it('默认按秒解释并逐级取整', () => {
    expect(timeSpan(3725)).toBe('1时2分5秒')
  })

  it('零值项不展示', () => {
    expect(timeSpan(3600)).toBe('1时')
    expect(timeSpan(0)).toBe('')
  })

  it('负时长统一前置符号', () => {
    expect(timeSpan(-3725)).toBe('-1时2分5秒')
  })

  it('可按指定单位解释入参', () => {
    expect(timeSpan(90, { from: TimeUnit.Minute })).toBe('1时30分')
    expect(timeSpan(1500, { from: TimeUnit.Millisecond })).toBe('1秒500毫秒')
  })

  it('非数值返回空串', () => {
    expect(timeSpan('abc')).toBe('')
  })
})
