/**
 * 工具装配
 * 删除、导出、下载、导入、消息与窗口统一走结构化结果，不以外观上的 false 兼表多种语义
 */
import type { ToolContext, Tools, ToolsPlugin } from './types';
/**
 * 创建工具能力
 * @param context 工具上下文
 * @returns 工具能力
 * @example createTools({ request }).run({ action: ToolAction.Download, url: '/api/export' })
 */
export declare function createTools(context: ToolContext): Tools;
/**
 * 创建工具插件
 * 工具按请求即时执行，装配阶段不持有额外状态
 * @param context 工具上下文
 * @returns 工具插件
 * @example createKernel().use(createToolsPlugin({ request })).start()
 */
export declare function createToolsPlugin(context: ToolContext): ToolsPlugin;
