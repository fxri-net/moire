/**
 * 枚举单测
 * 校验取值语义、运行期冻结与分支穷尽守卫
 */

import { JsonOp, MergeDirection, MergeMissing, MergeNormalize, PadSide, TimeUnit, UrlMode, assertNever, enums } from '../enums'

describe('枚举集合', () => {
  it('成员取值为可读的具名 code', () => {
    expect(MergeDirection.Fill).toBe('fill')
    expect(MergeDirection.Cover).toBe('cover')
    expect(MergeDirection.Blank).toBe('blank')
    expect(MergeMissing.Empty).toBe('empty')
    expect(MergeNormalize.Json).toBe('json')
    expect(UrlMode.Append).toBe('append')
    expect(PadSide.Both).toBe('both')
    expect(TimeUnit.Millisecond).toBe('millisecond')
    expect(JsonOp.Encode).toBe('encode')
  })

  it('枚举对象一律冻结，运行期写入无效', () => {
    for (const value of Object.values(enums)) {
      expect(Object.isFrozen(value)).toBe(true)
      expect(Reflect.set(value, 'Fill', 'changed')).toBe(false)
    }
    expect(MergeDirection.Fill).toBe('fill')
  })

  it('总表覆盖全部枚举且键名不重复', () => {
    const names = [
      'FieldKind',
      'FieldStage',
      'JsonOp',
      'MergeBlankAs',
      'MergeDirection',
      'MergeMissing',
      'MergeNormalize',
      'OrderDirection',
      'PadSide',
      'RuleKind',
      'SelectAction',
      'SelectionMode',
      'TimeUnit',
      'ToolAction',
      'ToolOutcome',
      'UrlMode',
      'ValueKind',
      'Variant',
      'ViewKind',
    ]
    expect(Object.keys(enums)).toEqual(names)
    expect(new Set(names).size).toBe(names.length)
  })
})

describe('分支穷尽校验', () => {
  it('命中未覆盖成员时抛出带作用域的错误', () => {
    expect(() => assertNever('strange' as never, 'MergeDirection')).toThrow('MergeDirection 出现未覆盖的成员：strange')
  })

  it('缺省作用域为枚举', () => {
    expect(() => assertNever('unknown' as never)).toThrow('枚举 出现未覆盖的成员：unknown')
  })
})
