/**
 * 浏览器入口
 * 装配内核并挂到全局，业务侧统一从 window.moire 进入
 */

import { createKernel } from '../kernel'
import { mountGlobal } from '../kernel/global'
import { version } from '../version'

mountGlobal(createKernel({ version }))
