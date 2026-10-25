/**
 * 浏览器入口
 * 装配内核、内置插件与全局对象，业务侧统一从 window.moire 进入
 */

import { createUi } from '../adapters/layui'
import type { UiAdapter } from '../adapters/layui'
import { enums } from '../enums'
import { createFieldsPlugin } from '../fields'
import type { Fields, FieldsPlugin } from '../fields'
import { createHttp } from '../http'
import type { HttpClient, HttpRequest, HttpResult } from '../http'
import { i18n } from '../i18n'
import type { I18n } from '../i18n'
import { createKernel } from '../kernel'
import { mountGlobal } from '../kernel/global'
import type { Kernel, MoirePlugin } from '../kernel/types'
import { createToolsPlugin } from '../tools'
import type { Tools, ToolsPlugin } from '../tools'
import { version } from '../version'
import { createViewsPlugin } from '../views'
import type { Views, ViewsPlugin } from '../views'
import * as utils from '../utils'

/** 框架实例 */
export interface Moire extends Kernel {
  /** 枚举字典 */
  readonly enum: typeof enums
  /** 工具函数集合 */
  readonly utils: typeof utils
  /** 国际化实例 */
  readonly i18n: I18n
  /** 请求客户端 */
  readonly http: HttpClient
  /** 界面适配 */
  readonly ui: UiAdapter
  /** 字段能力 */
  readonly fields: Fields
  /** 视图能力 */
  readonly views: Views
  /** 工具能力 */
  readonly tools: Tools
  /** 注册插件，启动后立即装配 */
  use(plugin: MoirePlugin): Moire
  /** 按依赖顺序装配全部插件 */
  start(): Moire
}

/** 内核实例 */
const kernel = createKernel({ version })
/** 界面适配实例 */
const ui = createUi()
/** 请求客户端 */
const http = createHttp()
/** 字段插件 */
const fieldsPlugin: FieldsPlugin = createFieldsPlugin({ ui })
/** 视图插件 */
const viewsPlugin: ViewsPlugin = createViewsPlugin({ ui })
/** 工具插件 */
const toolsPlugin: ToolsPlugin = createToolsPlugin({
  ui,
  notify: kernel.context.notify,
  request: (input: HttpRequest): Promise<HttpResult> => http.request(input),
})

kernel.use(fieldsPlugin).use(viewsPlugin).use(toolsPlugin)

/**
 * 框架实例
 * 能力字段用取值器暴露，插件装配后始终取到最新实例
 */
const moire: Moire = {
  ...kernel,
  enum: enums,
  utils,
  i18n,
  http,
  ui,
  get fields() {
    return fieldsPlugin.fields
  },
  get views() {
    return viewsPlugin.views
  },
  get tools() {
    return toolsPlugin.tools
  },
  use: (plugin) => {
    kernel.use(plugin)
    return moire
  },
  start: () => {
    kernel.start()
    return moire
  },
}

declare global {
  /** 全局对象扩展 */
  interface Window {
    /** 框架实例，由入口挂载 */
    moire?: Moire
  }
}

mountGlobal(moire).start()
