/**
 * 界面适配契约
 * 只声明能力与选项，不引用第三方类型，保证内核与界面库完全解耦
 */
import type { SelectAction, Variant } from '../../enums';
/** 提示选项 */
export interface NoticeOption {
    /** 呈现变体，缺省按提示消息展示 */
    variant?: Variant;
    /** 附着元素，气泡变体必填 */
    target?: Element;
    /** 停留毫秒，零表示不自动消退 */
    duration?: number;
}
/** 日期选项 */
export interface DateOption {
    /** 控件形态 */
    type?: 'date' | 'datetime' | 'time';
    /** 取值格式，沿用 laydate 的 format 记号 */
    format?: string;
    /** 是否区间选择 */
    range?: boolean;
}
/** 上传选项 */
export interface UploadOption {
    /** 接收地址 */
    url: string;
    /** 接收的文件类型 */
    accept?: string;
    /** 是否允许一次选多个 */
    multiple?: boolean;
    /** 上传成功回调，参数为服务端响应与文件原始名 */
    done?: (response: unknown, filename: string) => void;
}
/** 富文本选项 */
export interface RichOption {
    /** 编辑区高度 */
    height?: number;
    /** 界面语言 */
    lang?: string;
}
/** 排序选项 */
export interface SortableOption {
    /** 拖拽动画毫秒 */
    animation?: number;
    /** 可拖拽元素选择器 */
    filter?: string;
}
/**
 * 界面适配
 * 全部方法在缺少对应库时安全降级，不抛异常
 */
export interface UiAdapter {
    /** 是否探测到 layui */
    readonly enabled: boolean;
    /** 渲染日期控件 */
    dateRender(elem: Element, option?: DateOption): void;
    /** 渲染上传控件 */
    fileRender(elem: Element, option: UploadOption): void;
    /** 重渲染全量表单控件 */
    formRender(): void;
    /** 弹出提示，按可用能力依次降级 */
    notice(text: string, option?: NoticeOption): void;
    /** 读取富文本内容 */
    richRead(id: string): string | undefined;
    /** 渲染富文本 */
    richRender(elem: Element, option?: RichOption): void;
    /** 写入富文本内容 */
    richWrite(id: string, value: string): void;
    /** 为多选组件挂载批量动作 */
    selectsAct(name: string, actions: readonly SelectAction[]): void;
    /** 读取多选组件取值 */
    selectsRead(name: string): string[];
    /** 写入多选组件取值 */
    selectsWrite(name: string, values: readonly string[]): void;
    /** 渲染拖拽排序 */
    sortRender(scope: Element, option?: SortableOption): void;
    /** 取可用层叠层级 */
    zIndex(): number;
}
