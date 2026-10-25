/**
 * 声明契约
 * 表单与列表的统一描述，fields 与 views 共用，不依赖任何界面库
 */
import type { FieldKind, RuleKind, SelectAction, SelectionMode, ValueKind } from '../enums';
/** 候选项 */
export interface FieldChoice {
    /** 取值 */
    value: string;
    /** 展示文本 */
    label: string;
    /** 是否禁用 */
    disabled?: boolean;
}
/** 行数据 */
export type RowData = Record<string, unknown>;
/** 必填规则 */
export interface RequiredRule {
    /** 规则类型 */
    kind: typeof RuleKind.Required;
}
/** 类型规则 */
export interface TypeRule {
    /** 规则类型 */
    kind: typeof RuleKind.Type;
    /** 期望形态 */
    value: ValueKind;
}
/** 范围规则 */
export interface RangeRule {
    /** 规则类型 */
    kind: typeof RuleKind.Range;
    /** 下界，含边界 */
    min?: number;
    /** 上界，含边界 */
    max?: number;
}
/** 长度规则 */
export interface LengthRule {
    /** 规则类型 */
    kind: typeof RuleKind.Length;
    /** 最短长度，含边界 */
    min?: number;
    /** 最长长度，含边界 */
    max?: number;
}
/** 正则规则 */
export interface PatternRule {
    /** 规则类型 */
    kind: typeof RuleKind.Pattern;
    /** 匹配表达式 */
    value: RegExp;
}
/** 校验规则 */
export type Rule = RequiredRule | TypeRule | RangeRule | LengthRule | PatternRule;
/** 字段选项 */
export interface FieldOption {
    /** 候选项 */
    choices?: readonly FieldChoice[];
    /** 表格列，供表格类型的字段使用 */
    columns?: readonly ColumnSchema[];
    /** 多选组件的批量动作 */
    actions?: readonly SelectAction[];
    /** 日期控件形态 */
    dateType?: 'date' | 'datetime' | 'time';
    /** 日期取值格式 */
    format?: string;
    /** 日期是否区间 */
    range?: boolean;
    /** 上传是否允许一次选多个 */
    multiple?: boolean;
    /** 上传接收地址 */
    uploadUrl?: string;
    /** 上传接收的文件类型 */
    accept?: string;
    /** 富文本编辑区高度 */
    height?: number;
}
/** 列声明 */
export interface ColumnSchema {
    /** 字段名 */
    name: string;
    /** 列标题，缺省取字段标签 */
    title?: string;
    /** 列宽 */
    width?: number;
    /** 是否只读 */
    readonly?: boolean;
    /** 占位提示 */
    placeholder?: string;
    /** 渲染类型，缺省按文本展示 */
    kind?: FieldKind;
    /** 候选项 */
    choices?: readonly FieldChoice[];
}
/** 字段声明 */
export interface FieldSchema {
    /** 字段名，表单内唯一 */
    name: string;
    /** 渲染类型 */
    kind: FieldKind;
    /** 标签，缺省取字段名 */
    label?: string;
    /** 初始值 */
    value?: unknown;
    /** 占位提示 */
    placeholder?: string;
    /** 是否必填，等价于在规则前追加必填 */
    required?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否隐藏 */
    hidden?: boolean;
    /** 校验规则 */
    rules?: readonly Rule[];
    /** 类型专属选项 */
    option?: FieldOption;
}
/** 表单声明 */
export interface FormSchema {
    /** 表单名 */
    name?: string;
    /** 字段列表 */
    fields: readonly FieldSchema[];
    /** 表格列，供表格形态的表单使用 */
    columns?: readonly ColumnSchema[];
}
/** 列表声明 */
export interface ListSchema {
    /** 列表名 */
    name?: string;
    /** 列列表 */
    columns: readonly ColumnSchema[];
    /** 行数据 */
    rows?: readonly RowData[];
    /** 单页条数 */
    limit?: number;
    /** 选择模式，缺省不提供行选择 */
    selection?: SelectionMode;
    /** 行主键字段名，缺省取 id */
    key?: string;
}
/** 校验问题 */
export interface ValidationIssue {
    /** 字段名 */
    name: string;
    /** 触发规则的类型 */
    kind: RuleKind;
    /** 展示文案 */
    message: string;
}
/** 校验结果 */
export interface ValidationResult {
    /** 是否全部通过 */
    valid: boolean;
    /** 按字段名整理的取值 */
    values: RowData;
    /** 问题列表，顺序同字段顺序 */
    issues: readonly ValidationIssue[];
}
