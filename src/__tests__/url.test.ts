/**
 * 地址工具单测
 * 组装、追加与读取三种模式的正反例
 */

import { UrlMode } from '../enums'
import { url } from '../utils/url'

/**
 * 构造取址窗口替身
 * @param href 完整地址
 * @returns 仅含 location 的窗口
 */
function fakeWindow(href: string): Window {
  return { location: { href, pathname: new URL(href).pathname } } as unknown as Window
}

describe('url 读取', () => {
  it('缺省读取当前地址的全部参数', () => {
    expect(url({ window: fakeWindow('http://a.com/list?page=1&tags[]=x') })).toEqual({ page: '1', tags: ['x'] })
  })

  it('给定参数名时只返回该值', () => {
    expect(url({ window: fakeWindow('http://a.com/list?page=1'), name: 'page' })).toBe('1')
  })

  it('参数名无对应值时返回 undefined', () => {
    expect(url({ window: fakeWindow('http://a.com/list'), name: 'none' })).toBeUndefined()
  })

  it('显式参数优先于地址已有参数', () => {
    expect(url({ window: fakeWindow('http://a.com/list?page=1'), name: 'page', param: 'page=2' })).toBe('2')
  })
})

describe('url 组装', () => {
  it('在当前路径上合并参数，显式参数覆盖同名参数', () => {
    const options = { mode: UrlMode.Build, param: { page: 1, size: 10 } }
    expect(url({ ...options, window: fakeWindow('http://a.com/list?page=2') })).toBe('/list?page=1&size=10')
  })

  it('无参数时保留原查询串', () => {
    expect(url({ mode: UrlMode.Build, window: fakeWindow('http://a.com/list?page=2') })).toBe('/list?page=2')
  })
})

describe('url 追加', () => {
  it('向指定地址追加参数', () => {
    expect(url({ mode: UrlMode.Append, url: '/x', param: { a: 1 } })).toBe('/x?a=1')
  })

  it('已有查询串时用与号衔接', () => {
    expect(url({ mode: UrlMode.Append, url: '/x?y=2', param: { a: 1 } })).toBe('/x?y=2&a=1')
  })

  it('无参数时原样返回地址', () => {
    expect(url({ mode: UrlMode.Append, url: '/x?y=2' })).toBe('/x?y=2')
  })
})
