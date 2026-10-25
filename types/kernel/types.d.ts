/**
 * 内核契约
 * 插件装配、通知与上下文取值的类型约定
 */
import type { Variant } from '../enums';
/** 通知载荷 */
export interface Notice {
    /** 消息文本 */
    message: string;
    /** 呈现形态，缺省按提示处理 */
    variant?: Variant;
    /** 关联元素，气泡形态使用 */
    target?: Element;
}
/** 通知函数 */
export type Notify = (notice: Notice) => void;
/** 通知订阅者 */
export type NoticeListener = (notice: Notice) => void;
/** 插件上下文 */
export interface MoireContext {
    /** 框架版本 */
    readonly version: string;
    /** 发出通知 */
    readonly notify: Notify;
    /** 订阅通知，返回退订函数 */
    subscribe(listener: NoticeListener): () => void;
    /** 取已注册插件实例 */
    get(name: string): MoirePlugin | undefined;
}
/** 插件契约 */
export interface MoirePlugin {
    /** 插件名，全局唯一 */
    readonly name: string;
    /** 插件版本 */
    readonly version?: string;
    /** 依赖的插件名，装配顺序按依赖拓扑确定 */
    readonly depends?: readonly string[];
    /** 装配 */
    setup(context: MoireContext): void;
    /** 卸载 */
    dispose?(): void;
}
/** 内核选项 */
export interface KernelOptions {
    /** 框架版本 */
    version?: string;
    /** 通知实现，缺省仅分发给订阅者 */
    notify?: Notify;
}
/** 内核 */
export interface Kernel {
    /** 框架版本 */
    readonly version: string;
    /** 插件上下文 */
    readonly context: MoireContext;
    /** 注册插件，重名时报错 */
    use(plugin: MoirePlugin): Kernel;
    /** 按依赖顺序装配全部插件 */
    start(): Kernel;
    /** 逆序卸载，先装配后卸载 */
    dispose(): void;
}
