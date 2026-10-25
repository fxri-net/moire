/**
 * 内置词条
 * 键名按领域点分，值一律为可直接展示的文本
 */

/** 词条集合 */
export type Messages = Record<string, string>

/** 内置语言 */
export const locales = ['zh-cn', 'en-us'] as const

/** 内置语言 */
export type Locale = (typeof locales)[number]

/** 词条总表 */
export const messages: Record<Locale, Messages> = {
  'zh-cn': {
    /** 组合分隔符：中文不加空格 */
    'separator.join': '',
    /** 毫秒 */
    'time.unit.millisecond': '毫秒',
    /** 秒 */
    'time.unit.second': '秒',
    /** 分 */
    'time.unit.minute': '分',
    /** 时 */
    'time.unit.hour': '时',
    /** 天 */
    'time.unit.day': '天',
    /** 月 */
    'time.unit.month': '月',
    /** 年 */
    'time.unit.year': '年',
    /** 服务端业务异常 */
    'http.failed': '系统异常',
    /** 网络异常 */
    'http.network': '网络异常，请稍后重试',
    /** 插件装配失败 */
    'kernel.plugin.failed': '插件 {name} 装配失败：{message}',
    /** 插件依赖缺失 */
    'kernel.plugin.missing': '插件 {name} 依赖的 {depends} 未注册',
    /** 插件重复注册 */
    'kernel.plugin.exists': '插件 {name} 已注册，不可重复注册',
    /** 插件循环依赖 */
    'kernel.plugin.cycle': '插件 {name} 存在循环依赖',
  },
  'en-us': {
    /** 组合分隔符：英文以空格分词 */
    'separator.join': ' ',
    /** 毫秒 */
    'time.unit.millisecond': 'ms',
    /** 秒 */
    'time.unit.second': 's',
    /** 分 */
    'time.unit.minute': 'm',
    /** 时 */
    'time.unit.hour': 'h',
    /** 天 */
    'time.unit.day': 'd',
    /** 月 */
    'time.unit.month': 'mo',
    /** 年 */
    'time.unit.year': 'y',
    /** 服务端业务异常 */
    'http.failed': 'System error',
    /** 网络异常 */
    'http.network': 'Network error, please try again later',
    /** 插件装配失败 */
    'kernel.plugin.failed': 'Failed to set up plugin {name}: {message}',
    /** 插件依赖缺失 */
    'kernel.plugin.missing': 'Plugin {name} requires unregistered {depends}',
    /** 插件重复注册 */
    'kernel.plugin.exists': 'Plugin {name} is already registered',
    /** 插件循环依赖 */
    'kernel.plugin.cycle': 'Plugin {name} has a circular dependency',
  },
}
