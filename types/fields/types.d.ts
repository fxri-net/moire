/**
 * 字段契约
 * 渲染器、字段实例与表单实例的约定，不依赖具体界面库实现
 */
import type { UiAdapter } from '../adapters/layui';
import type { FieldKind, FieldStage } from '../enums';
import type { Translate } from '../i18n';
import type { MoirePlugin, Notify } from '../kernel/types';
import type { FieldChoice, FieldSchema, FormSchema, RowData, ValidationIssue, ValidationResult } from '../schema';
/** 字段构建上下文 */
export interface FieldBuild {
    /** 字段声明 */
    readonly field: FieldSchema;
    /** 归一的候选项 */
    readonly choices: readonly FieldChoice[];
    /** 归一的占位提示 */
    readonly placeholder: string;
    /** 界面适配 */
    readonly ui: UiAdapter;
    /** 取词条 */
    readonly translate: Translate;
}
/** 字段渲染器 */
export interface FieldRenderer {
    /** 对应的字段类型 */
    readonly kind: FieldKind;
    /** 部署：生成控件根 */
    deploy(build: FieldBuild): Element;
    /** 完成：控件入文档后的增强，缺省不做额外处理 */
    done?(build: FieldBuild, elem: Element): void;
    /** 读取：从控件取回取值 */
    read(build: FieldBuild, elem: Element): unknown;
    /** 写入：把取值写进控件 */
    write(build: FieldBuild, elem: Element, value: unknown): void;
}
/** 回显结果 */
export interface EchoResult {
    /** 是否通过校验 */
    readonly valid: boolean;
    /** 字段取值 */
    readonly value: unknown;
    /** 首个问题，通过时为空 */
    readonly issue?: ValidationIssue;
}
/** 字段实例 */
export interface FieldInstance {
    /** 字段声明 */
    readonly field: FieldSchema;
    /** 渲染器 */
    readonly renderer: FieldRenderer;
    /** 控件包装，未部署时为空 */
    readonly elem: Element | undefined;
    /** 已执行阶段，按调用顺序记录 */
    readonly stages: readonly FieldStage[];
    /** 初始化，重复调用不重复执行 */
    init(): FieldInstance;
    /** 整理数据，重复调用不重复执行 */
    data(): FieldInstance;
    /** 部署控件，重复调用不重复执行 */
    deploy(): FieldInstance;
    /** 完成增强，重复调用不重复执行 */
    done(): FieldInstance;
    /** 读取取值并按规则校验 */
    echo(): EchoResult;
    /** 读取取值，不做校验 */
    read(): unknown;
    /** 写回声明里的初始值 */
    reset(): FieldInstance;
    /** 清空控件 */
    clean(): FieldInstance;
}
/** 表单实例 */
export interface FormInstance {
    /** 表单声明 */
    readonly schema: FormSchema;
    /** 表单包装 */
    readonly elem: Element;
    /** 字段实例，顺序同声明 */
    readonly fields: readonly FieldInstance[];
    /** 整表回显并校验，未通过项逐条提示 */
    echo(): ValidationResult;
    /** 取当前取值，不做校验 */
    values(): RowData;
    /** 写回初始值 */
    reset(): FormInstance;
    /** 清空控件 */
    clean(): FormInstance;
}
/** 字段选项 */
export interface FieldsOptions {
    /** 界面适配，缺省不做控件增强 */
    ui?: UiAdapter;
    /** 取词条，缺省取内置实例 */
    translate?: Translate;
    /** 发出通知，缺省不提示 */
    notify?: Notify;
}
/** 字段能力 */
export interface Fields {
    /** 已注册渲染器，按字段类型索引 */
    readonly renderers: ReadonlyMap<FieldKind, FieldRenderer>;
    /** 创建字段实例 */
    create(field: FieldSchema): FieldInstance;
    /** 创建表单实例，目标给定时挂入其中 */
    createForm(schema: FormSchema, target?: Element): FormInstance;
    /** 注册渲染器，同类型覆盖 */
    register(renderer: FieldRenderer): Fields;
    /** 替换通知实现 */
    setNotify(notify: Notify): Fields;
}
/** 字段插件 */
export interface FieldsPlugin extends MoirePlugin {
    /** 字段能力 */
    readonly fields: Fields;
}
