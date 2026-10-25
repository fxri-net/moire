/**
 * 浏览器入口
 * 挂载全局并启动，业务侧统一从 window.moire 进入
 */

import { mountGlobal } from '../kernel/global'
import { moire } from './app'

mountGlobal(moire).start()
