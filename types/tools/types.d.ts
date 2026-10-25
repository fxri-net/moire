/**
 * 工具契约
 * 请求、上下文与结构化结果的约定，操作类型一律用具名枚举
 */
import type { UiAdapter } from '../adapters/layui';
import type { ToolAction, ToolOutcome, Variant } from '../enums';
import type { HttpRequest, HttpResult } from '../http';
import type { Translate } from '../i18n';
import type { MoirePlugin, Notify } from '../kernel/types';
import type { RowData } from '../schema';
import type { Params } from '../utils/object';
/** 工具请求 */
export interface ToolRequest {
    /** 操作类型 */
    action: ToolAction;
    /** 目标地址：删除、导出、下载、导入与跳转使用 */
    url?: string;
    /** 查询参数：导出时并入地址 */
    query?: Params;
    /** 数据行：删除时提供，缺省从 keys 取 */
    rows?: readonly RowData[];
    /** 主键字段名，缺省取 id */
    key?: string;
    /** 主键集合：直接指定待删除项，优先于 rows */
    keys?: readonly string[];
    /** 消息文本 */
    message?: string;
    /** 消息形态 */
    variant?: Variant;
    /** 导出确认阈值，缺省取内置上限 */
    limit?: number;
    /** 导出总条数，超过阈值时先确认 */
    total?: number;
}
/** 工具结果 */
export interface ToolResult {
    /** 结果类型 */
    outcome: ToolOutcome;
    /** 业务消息，失败与完成时给出 */
    message?: string;
    /** 业务数据 */
    data?: unknown;
}
/** 工具上下文 */
export interface ToolContext {
    /** 界面适配，用于消息降级呈现 */
    ui?: UiAdapter;
    /** 取词条，缺省取内置实例 */
    translate?: Translate;
    /** 发出通知，缺省转交界面适配 */
    notify?: Notify;
    /** 发起请求 */
    request: (input: HttpRequest) => Promise<HttpResult>;
    /** 请求确认，缺省用原生确认框 */
    confirm?: (message: string) => boolean;
    /** 打开地址，缺省用新窗口打开 */
    open?: (url: string) => void;
    /** 删除成功后的刷新回调 */
    reload?: () => void;
}
/** 工具能力 */
export interface Tools {
    /** 按请求执行工具操作 */
    run(request: ToolRequest): Promise<ToolResult>;
}
/** 工具插件 */
export interface ToolsPlugin extends MoirePlugin {
    /** 工具能力 */
    readonly tools: Tools;
}
