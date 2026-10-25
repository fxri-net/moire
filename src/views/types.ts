/**
 * 视图契约
 * 声明到装配结果的映射约定，装配阶段不依赖 DOM，渲染阶段只调适配层
 */

import type { UiAdapter } from '../adapters/layui'
import type { FieldKind, OrderDirection, SelectionMode, ViewKind } from '../enums'
import type { Fields } from '../fields'
import type { Translate } from '../i18n'
import type { MoirePlugin } from '../kernel/types'
import type { FieldChoice, FormSchema, ListSchema, RowData } from '../schema'

/** 排序子句 */
export interface OrderClause {
  /** 排序字段名 */
  name: string
  /** 排序方向 */
  direction: OrderDirection
}

/** 列表查询 */
export interface ListQuery {
  /** 页码，缺省首页 */
  page?: number
  /** 单页条数，缺省取声明值 */
  limit?: number
  /** 排序子句，按给出顺序逐级比较 */
  order?: readonly OrderClause[]
}

/** 分页信息 */
export interface ListPage {
  /** 当前页码，已钳制在合法区间 */
  page: number
  /** 单页条数 */
  limit: number
  /** 总条数 */
  total: number
  /** 总页数，无数据时为 1 */
  pages: number
}

/** 视图列 */
export interface ViewColumn {
  /** 字段名 */
  name: string
  /** 列标题，已按字段名兜底 */
  title: string
  /** 列宽 */
  width?: number
  /** 渲染类型，已按文本兜底 */
  kind: FieldKind
  /** 占位提示 */
  placeholder?: string
  /** 候选项 */
  choices?: readonly FieldChoice[]
}

/** 列表装配结果 */
export interface ListAssembly {
  /** 列表名 */
  name?: string
  /** 归一后的列 */
  columns: readonly ViewColumn[]
  /** 当前页数据 */
  rows: readonly RowData[]
  /** 分页信息 */
  page: ListPage
  /** 选择模式 */
  selection: SelectionMode
  /** 行主键字段名 */
  key: string
  /** 生效的排序子句 */
  order: readonly OrderClause[]
}

/** 表单字段计划 */
export interface FormFieldPlan {
  /** 字段名 */
  name: string
  /** 标签，已按字段名兜底 */
  label: string
  /** 渲染类型 */
  kind: FieldKind
  /** 是否必填 */
  required: boolean
}

/** 表单装配结果 */
export interface FormAssembly {
  /** 表单名 */
  name?: string
  /** 归一后的字段计划 */
  fields: readonly FormFieldPlan[]
  /** 原始声明，供字段层直接建表 */
  schema: FormSchema
}

/** 视图装配器 */
export interface ViewAssembler<TSchema, TResult, TQuery = undefined> {
  /** 视图类型 */
  readonly kind: ViewKind
  /** 纯装配：只做归一、排序与切片，不产生 DOM */
  assemble(schema: TSchema, query?: TQuery): TResult
  /** 薄渲染：只做 DOM 组装与适配层增强 */
  render(assembly: TResult, target?: Element): Element
}

/** 列表装配器 */
export type ListAssembler = ViewAssembler<ListSchema, ListAssembly, ListQuery>

/** 表单装配器 */
export type FormAssembler = ViewAssembler<FormSchema, FormAssembly>

/** 视图选项 */
export interface ViewsOptions {
  /** 界面适配，缺省不做控件增强 */
  ui?: UiAdapter
  /** 取词条，缺省取内置实例 */
  translate?: Translate
  /** 字段能力，表单渲染必需 */
  fields?: Fields
}

/** 视图能力 */
export interface Views {
  /** 列表装配器 */
  readonly list: ListAssembler
  /** 表单装配器 */
  readonly form: FormAssembler
}

/** 视图插件 */
export interface ViewsPlugin extends MoirePlugin {
  /** 视图能力 */
  readonly views: Views
}
