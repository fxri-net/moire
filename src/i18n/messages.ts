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
    /** 字段重复声明 */
    'field.duplicate': '字段 {name} 重复声明',
    /** 选项空值占位 */
    'field.empty': '请选择',
    /** 选择类占位提示 */
    'field.placeholder.choice': '请选择{label}',
    /** 输入类占位提示 */
    'field.placeholder.input': '请输入{label}',
    /** 上传按钮文案 */
    'field.upload': '选择文件',
    /** 字段类型未注册 */
    'field.unknown': '未注册的字段类型：{kind}',
    /** 列表空态 */
    'list.empty': '暂无数据',
    /** 列表选择列表头 */
    'list.column.selection': '选择',
    /** 列表页码 */
    'list.page': '第 {page} / {pages} 页',
    /** 列表总条数 */
    'list.total': '共 {total} 条',
    /** 必填未填 */
    'schema.required': '{label}不能为空',
    /** 形态不符 */
    'schema.type': '{label}应为{type}',
    /** 不是数字 */
    'schema.number': '{label}应为数字',
    /** 正则不匹配 */
    'schema.pattern': '{label}格式不正确',
    /** 长度无法度量 */
    'schema.length': '{label}长度不符合要求',
    /** 长度区间 */
    'schema.length.between': '{label}长度应在 {min} 到 {max} 之间',
    /** 长度下限 */
    'schema.length.min': '{label}长度不应少于 {min}',
    /** 长度上限 */
    'schema.length.max': '{label}长度不应多于 {max}',
    /** 数值区间 */
    'schema.range.between': '{label}应在 {min} 到 {max} 之间',
    /** 数值下限 */
    'schema.range.min': '{label}不应小于 {min}',
    /** 数值上限 */
    'schema.range.max': '{label}不应大于 {max}',
    /** 取值类型：数组 */
    'schema.value.array': '数组',
    /** 取值类型：布尔值 */
    'schema.value.boolean': '布尔值',
    /** 取值类型：数字 */
    'schema.value.number': '数字',
    /** 取值类型：对象 */
    'schema.value.object': '对象',
    /** 取值类型：字符串 */
    'schema.value.string': '字符串',
    /** 删除确认 */
    'tool.confirm.delete': '是否确认删除？',
    /** 导出确认 */
    'tool.confirm.export': '共 {total} 条数据，导出可能耗时较长，是否继续？',
    /** 删除成功 */
    'tool.delete.done': '删除成功',
    /** 删除地址缺失 */
    'tool.delete.missing': '未配置删除地址',
    /** 下载地址缺失 */
    'tool.download.missing': '未配置下载地址',
    /** 导出地址缺失 */
    'tool.export.missing': '未配置导出地址',
    /** 导入地址缺失 */
    'tool.import.missing': '未配置导入地址',
    /** 消息内容为空 */
    'tool.message.empty': '消息内容不能为空',
    /** 未选择数据 */
    'tool.select.empty': '请先选择数据',
    /** 跳转地址缺失 */
    'tool.window.missing': '未配置跳转地址',
    /** 视图缺少字段能力 */
    'view.fields': '视图渲染需要先装配字段能力',
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
    /** 字段重复声明 */
    'field.duplicate': 'Duplicate field {name}',
    /** 选项空值占位 */
    'field.empty': 'Please select',
    /** 选择类占位提示 */
    'field.placeholder.choice': 'Select {label}',
    /** 输入类占位提示 */
    'field.placeholder.input': 'Enter {label}',
    /** 上传按钮文案 */
    'field.upload': 'Choose file',
    /** 字段类型未注册 */
    'field.unknown': 'Unknown field kind: {kind}',
    /** 列表空态 */
    'list.empty': 'No data',
    /** 列表选择列表头 */
    'list.column.selection': 'Select',
    /** 列表页码 */
    'list.page': 'Page {page} of {pages}',
    /** 列表总条数 */
    'list.total': '{total} in total',
    /** 必填未填 */
    'schema.required': '{label} is required',
    /** 形态不符 */
    'schema.type': '{label} should be {type}',
    /** 不是数字 */
    'schema.number': '{label} should be a number',
    /** 正则不匹配 */
    'schema.pattern': '{label} has an invalid format',
    /** 长度无法度量 */
    'schema.length': '{label} has an invalid length',
    /** 长度区间 */
    'schema.length.between': '{label} length should be between {min} and {max}',
    /** 长度下限 */
    'schema.length.min': '{label} length should be at least {min}',
    /** 长度上限 */
    'schema.length.max': '{label} length should be at most {max}',
    /** 数值区间 */
    'schema.range.between': '{label} should be between {min} and {max}',
    /** 数值下限 */
    'schema.range.min': '{label} should be at least {min}',
    /** 数值上限 */
    'schema.range.max': '{label} should be at most {max}',
    /** 取值类型：数组 */
    'schema.value.array': 'an array',
    /** 取值类型：布尔值 */
    'schema.value.boolean': 'a boolean',
    /** 取值类型：数字 */
    'schema.value.number': 'a number',
    /** 取值类型：对象 */
    'schema.value.object': 'an object',
    /** 取值类型：字符串 */
    'schema.value.string': 'a string',
    /** 删除确认 */
    'tool.confirm.delete': 'Confirm deletion?',
    /** 导出确认 */
    'tool.confirm.export': '{total} rows will be exported and may take a while. Continue?',
    /** 删除成功 */
    'tool.delete.done': 'Deleted',
    /** 删除地址缺失 */
    'tool.delete.missing': 'Delete endpoint is not configured',
    /** 下载地址缺失 */
    'tool.download.missing': 'Download endpoint is not configured',
    /** 导出地址缺失 */
    'tool.export.missing': 'Export endpoint is not configured',
    /** 导入地址缺失 */
    'tool.import.missing': 'Import endpoint is not configured',
    /** 消息内容为空 */
    'tool.message.empty': 'Message cannot be empty',
    /** 未选择数据 */
    'tool.select.empty': 'Select rows first',
    /** 跳转地址缺失 */
    'tool.window.missing': 'Target address is not configured',
    /** 视图缺少字段能力 */
    'view.fields': 'Rendering views requires the fields capability',
  },
}
