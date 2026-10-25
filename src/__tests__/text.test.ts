/**
 * 文本工具单测
 * 拆分、组合、JSON 归一、查询串编解码与填充去重
 */

import { JsonOp, PadSide } from '../enums'
import { explode, implode, json, replace, strDecode, strEncode, strPad, unique } from '../utils/text'

describe('explode', () => {
  it('按分隔符拆分并统一转为字符串', () => {
    expect(explode(',', 'a,b')).toEqual(['a', 'b'])
    expect(explode(',', ['a', 1])).toEqual(['a', '1'])
    expect(explode(',', 12)).toEqual(['12'])
  })

  it('空值按单个空串返回', () => {
    expect(explode(',', null)).toEqual([''])
    expect(explode(',', undefined)).toEqual([''])
  })

  it('limit 正数从头保留并并回剩余段', () => {
    expect(explode(',', 'a,b,c,d', { limit: 2 })).toEqual(['a', 'b,c,d'])
    expect(explode(',', 'a,b', { limit: 3 })).toEqual(['a', 'b'])
  })

  it('limit 负数从尾保留，零表示不拆分', () => {
    expect(explode(',', 'a,b,c,d', { limit: -2 })).toEqual(['a', 'b'])
    expect(explode(',', 'a,b', { limit: 0 })).toEqual(['a,b'])
  })

  it('regular 为真时分隔符按正则解释', () => {
    expect(explode('\\d', 'a1b2c', { regular: true })).toEqual(['a', 'b', 'c'])
  })
})

describe('implode', () => {
  it('对象按值组合，数组直接连接', () => {
    expect(implode('-', { a: 1, b: 2 })).toBe('1-2')
    expect(implode('-', ['a', 'b'])).toBe('a-b')
  })

  it('标量转字符串，空值返回空串', () => {
    expect(implode('-', 'x')).toBe('x')
    expect(implode('-', null)).toBe('')
  })
})

describe('json', () => {
  it('解码 JSON 字符串与查询串', () => {
    expect(json('[1,2]', JsonOp.Decode)).toEqual([1, 2])
    expect(json('a=1', JsonOp.Decode)).toEqual({ a: '1' })
  })

  it('解码时对象取值为数组，标量包成单元素数组', () => {
    expect(json({ a: 1 }, JsonOp.Decode)).toEqual([1])
    expect(json(3, JsonOp.Decode)).toEqual([3])
    expect(json(null, JsonOp.Decode)).toEqual([])
  })

  it('编码时已是 JSON 字符串则原样返回', () => {
    expect(json('[1]', JsonOp.Encode)).toBe('[1]')
    expect(json({ a: 1 }, JsonOp.Encode)).toBe('{"a":1}')
  })
})

describe('replace', () => {
  it('按全局正则替换', () => {
    expect(replace('^a', 'b', 'abc')).toBe('bbc')
    expect(replace('a', 'x', 'aba')).toBe('xbx')
  })
})

describe('strDecode', () => {
  it('支持多级键与数组追加', () => {
    expect(strDecode('a=1&b[]=2&b[]=3&c[d]=4')).toEqual({ a: '1', b: ['2', '3'], c: { d: '4' } })
  })

  it('解码百分号编码，非法编码按原文保留', () => {
    expect(strDecode('a=%E4%B8%AD')).toEqual({ a: '中' })
    expect(strDecode('a=%E4')).toEqual({ a: '%E4' })
  })

  it('非字符串与空串返回空对象', () => {
    expect(strDecode('')).toEqual({})
    expect(strDecode(null)).toEqual({})
  })

  it('忽略空片段，保留无值键', () => {
    expect(strDecode('a=1&&b')).toStrictEqual({ a: '1', b: undefined })
  })
})

describe('strEncode', () => {
  it('对象用方括号展开，数组用空方括号', () => {
    expect(strEncode({ a: 1, b: ['2'], c: { d: 3 } })).toBe('a=1&b[]=2&c[d]=3')
  })

  it('标量原样返回，空值返回空串', () => {
    expect(strEncode('a=1')).toBe('a=1')
    expect(strEncode(null)).toBe('')
    expect(strEncode({ a: null })).toBe('a=')
  })

  it('与 strDecode 互逆', () => {
    const source = { a: '1', b: ['2'], c: { d: '3' } }
    expect(strDecode(strEncode(source))).toEqual(source)
  })
})

describe('strPad', () => {
  it('缺省右对齐补在左侧', () => {
    expect(strPad(7, 3, { with: '0' })).toBe('007')
    expect(strPad(7, 3)).toBe('  7')
  })

  it('左对齐补在右侧，两侧填充余数落在右侧', () => {
    expect(strPad('7', 3, { side: PadSide.Left, with: '0' })).toBe('700')
    expect(strPad('7', 4, { side: PadSide.Both, with: '0' })).toBe('0700')
  })

  it('已达长度时原样返回', () => {
    expect(strPad('abcdef', 3)).toBe('abcdef')
  })
})

describe('unique', () => {
  it('按严格相等去重并保留首次出现顺序', () => {
    expect(unique([1, '1', 1, 2])).toEqual([1, '1', 2])
  })
})
