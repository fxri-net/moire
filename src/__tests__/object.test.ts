/**
 * 对象工具单测
 * 13 个旧模式码与正交选项逐一等价，覆盖深层覆盖与字段读写
 */

import { MergeBlankAs, MergeDirection, MergeMissing, MergeNormalize } from '../enums'
import type { MergeOptions, Params } from '../utils/object'
import { cover, fieldRead, fieldWrite, mergeAll, mergeParams } from '../utils/object'

/** 旧码对照用例 */
interface MergeCase {
  /** 旧模式码 */
  code: string
  /** 正交选项 */
  options: MergeOptions
  /** 目标参数 */
  target: Params
  /** 来源 */
  source: unknown
  /** 期望结果 */
  expected: Params
}

/** 13 个旧模式码的正交映射 */
const cases: MergeCase[] = [
  {
    code: '1.1.1',
    options: { direction: MergeDirection.Fill, missing: MergeMissing.Ignore, blankAs: MergeBlankAs.Value },
    target: { a: 1, b: '', c: null },
    source: { a: 2, b: 'y', c: 'z', d: 'q' },
    expected: { a: 1, b: '', c: 'z', d: 'q' },
  },
  {
    code: '1.1.2',
    options: { direction: MergeDirection.Fill, missing: MergeMissing.Ignore, blankAs: MergeBlankAs.Missing },
    target: { a: 1, b: '', c: null },
    source: { a: 2, b: 'y', c: 'z', d: 'q' },
    expected: { a: 1, b: 'y', c: 'z', d: 'q' },
  },
  {
    code: '1.1.3',
    options: { direction: MergeDirection.Fill, missing: MergeMissing.Ignore, normalize: MergeNormalize.Json },
    target: { list: '[1,2]', text: '' },
    source: { list: '[9]', extra: '[3]' },
    expected: { list: [1, 2], text: '', extra: [3] },
  },
  {
    code: '1.2.1',
    options: { direction: MergeDirection.Blank, missing: MergeMissing.Null },
    target: { a: 1, b: '', c: null },
    source: ['b', 'd'],
    expected: { a: 1, b: '', c: null, d: null },
  },
  {
    code: '1.2.2',
    options: { direction: MergeDirection.Blank, missing: MergeMissing.Null, blankAs: MergeBlankAs.Missing },
    target: { a: 1, b: '', c: null },
    source: ['b', 'c'],
    expected: { a: 1, b: null, c: null },
  },
  {
    code: '1.2.3',
    options: { direction: MergeDirection.Blank, missing: MergeMissing.Null, normalize: MergeNormalize.Json },
    target: { list: '[1,2]', b: '' },
    source: ['list', 'missing'],
    expected: { list: [1, 2], b: '', missing: [] },
  },
  {
    code: '1.2.4',
    // 有意修正：旧实现缺失兜底为空对象，列表归一场景统一给空数组
    options: { direction: MergeDirection.Blank, missing: MergeMissing.Empty, blankAs: MergeBlankAs.Missing, normalize: MergeNormalize.List },
    target: { tags: 'a,b', b: '' },
    source: ['tags', 'b', 'other'],
    expected: { tags: ['a', 'b'], b: [], other: [] },
  },
  {
    code: '1.3.1',
    options: { direction: MergeDirection.Cover, missing: MergeMissing.Ignore, blankAs: MergeBlankAs.Value },
    target: { a: 1, b: '', c: null },
    source: { a: 2, b: 'y', c: 'z', d: 'q' },
    expected: { a: 2, b: 'y', c: 'z', d: 'q' },
  },
  {
    code: '1.3.2',
    options: { direction: MergeDirection.Cover, missing: MergeMissing.Null, blankAs: MergeBlankAs.Missing },
    target: { a: 1, b: '', c: null, d: 'keep' },
    source: { a: undefined, b: '', c: 'z', d: null },
    expected: { a: 1, b: null, c: 'z', d: 'keep' },
  },
  {
    code: '2.1.1',
    options: { mutate: false, direction: MergeDirection.Fill, missing: MergeMissing.Ignore, blankAs: MergeBlankAs.Value },
    target: { a: 1 },
    source: { a: 2, b: 3 },
    expected: { a: 1, b: 3 },
  },
  {
    code: '2.1.2',
    options: { mutate: false, direction: MergeDirection.Fill, missing: MergeMissing.Ignore, blankAs: MergeBlankAs.Missing },
    target: { a: '', b: 1 },
    source: { a: 'x', c: 'y' },
    expected: { a: 'x', c: 'y' },
  },
  {
    code: '2.2.1',
    options: { mutate: false, direction: MergeDirection.Blank, missing: MergeMissing.Null, blankAs: MergeBlankAs.Value },
    target: { a: 1, b: '' },
    source: ['b', 'c'],
    expected: { b: '', c: null },
  },
  {
    code: '2.2.2',
    options: { mutate: false, direction: MergeDirection.Blank, missing: MergeMissing.Null, blankAs: MergeBlankAs.Missing },
    target: { b: '' },
    source: ['b'],
    expected: { b: null },
  },
]

describe('mergeParams 旧码等价', () => {
  it.each(cases)('$code', ({ options, target, source, expected }) => {
    const before = structuredClone(target)
    const result = mergeParams(target, source, options)
    expect(result).toEqual(expected)
    // 首位为 2 时只产出来源键，原目标保持不变
    if (options.mutate === false) {
      expect(target).toEqual(before)
    } else {
      expect(target).toBe(result)
    }
  })

  it('缺省选项等同融合且原地写入', () => {
    const target = { a: 1 }
    expect(mergeParams(target, { a: 2, b: 3 })).toBe(target)
    expect(target).toEqual({ a: 1, b: 3 })
  })

  it('赋空方向可接受对象形式的键名清单', () => {
    expect(mergeParams({ a: 1 }, { x: 'a', y: 'b' }, { direction: MergeDirection.Blank, missing: MergeMissing.Null })).toEqual({
      a: 1,
      b: null,
    })
  })
})

describe('cover', () => {
  it('来源值覆盖目标值，容器时继续下钻', () => {
    expect(cover({ a: 1, c: { d: 1, e: 2 } }, { a: 2, b: 3, c: { d: 9 } })).toEqual({ a: 2, b: 3, c: { d: 9, e: 2 } })
  })

  it('深度为零时只合当前层', () => {
    expect(cover({ a: { b: 1 } }, { a: { c: 2 } }, 0)).toEqual({ a: { c: 2 } })
  })
})

describe('fieldRead', () => {
  it('逐级取值，缺失或空串返回空串', () => {
    expect(fieldRead({ a: { b: 1 } }, 'a-b')).toBe(1)
    expect(fieldRead({ a: { b: '' } }, 'a.b')).toBe('')
    expect(fieldRead({ a: {} }, 'a-b')).toBe('')
  })
})

describe('fieldWrite', () => {
  it('逐级包成嵌套对象', () => {
    expect(fieldWrite('a-b', 1)).toEqual({ a: { b: 1 } })
  })
})

describe('mergeAll', () => {
  it('首个数值入参视为下钻深度', () => {
    expect(mergeAll(1, { a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { c: 2 } })
    expect(mergeAll({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } })
  })

  it('未给深度时从右向左归并', () => {
    expect(mergeAll({ a: 1 }, { b: 2 }, { a: 3 })).toEqual({ a: 3, b: 2 })
  })

  it('无入参返回 undefined', () => {
    expect(mergeAll()).toBeUndefined()
  })
})
