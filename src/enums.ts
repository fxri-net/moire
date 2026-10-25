/**
 * 枚举集合
 * 一律以 const 对象 + as const 表达，同名类型即成员联合，禁止数字枚举与无意义编码
 */

/**
 * 合并方向
 * 决定新值进入旧值时的取舍顺序
 */
export const MergeDirection = Object.freeze({
  /** 赋空：只关心缺失，命中即按 missing 兜底，不写入新值 */
  Blank: 'blank',
  /** 覆盖：新值存在即写入，缺失时按 missing 兜底 */
  Cover: 'cover',
  /** 融合：旧值优先，仅缺失时采用新值 */
  Fill: 'fill',
} as const)

/** 合并方向 */
export type MergeDirection = (typeof MergeDirection)[keyof typeof MergeDirection]

/**
 * 合并缺失兜底
 * 决定判定为缺失后写入什么
 */
export const MergeMissing = Object.freeze({
  /** 空容器：写入空对象或空数组，形态由 normalize 决定 */
  Empty: 'empty',
  /** 忽略：缺失不处理，保留原状 */
  Ignore: 'ignore',
  /** 置空：写入 null */
  Null: 'null',
} as const)

/** 合并缺失兜底 */
export type MergeMissing = (typeof MergeMissing)[keyof typeof MergeMissing]

/**
 * 合并空串归属
 * 决定空字符串算不算缺失
 */
export const MergeBlankAs = Object.freeze({
  /** 缺失：空串与未定义同等对待 */
  Missing: 'missing',
  /** 有效值：空串按正常值参与合并 */
  Value: 'value',
} as const)

/** 合并空串归属 */
export type MergeBlankAs = (typeof MergeBlankAs)[keyof typeof MergeBlankAs]

/**
 * 合并归一
 * 决定合并完成后对每个键做何种形态整理
 */
export const MergeNormalize = Object.freeze({
  /** 解码：按 JSON 解码为数组或对象 */
  Json: 'json',
  /** 拆分：按分隔符拆成数组 */
  List: 'list',
  /** 不处理 */
  None: 'none',
} as const)

/** 合并归一 */
export type MergeNormalize = (typeof MergeNormalize)[keyof typeof MergeNormalize]

/**
 * 地址模式
 * 决定地址参数的读写方向
 */
export const UrlMode = Object.freeze({
  /** 组装：在当前地址上合并参数，返回相对地址 */
  Build: 'build',
  /** 追加：在指定地址上追加参数，返回完整地址 */
  Append: 'append',
  /** 读取：读取参数对象或单个参数值 */
  Read: 'read',
} as const)

/** 地址模式 */
export type UrlMode = (typeof UrlMode)[keyof typeof UrlMode]

/**
 * 时间单位
 * 决定时长拆解的起点与展示粒度
 */
export const TimeUnit = Object.freeze({
  /** 天 */
  Day: 'day',
  /** 小时 */
  Hour: 'hour',
  /** 毫秒 */
  Millisecond: 'millisecond',
  /** 分钟 */
  Minute: 'minute',
  /** 月：按 30 天折算 */
  Month: 'month',
  /** 秒 */
  Second: 'second',
  /** 年：按 12 月折算 */
  Year: 'year',
} as const)

/** 时间单位 */
export type TimeUnit = (typeof TimeUnit)[keyof typeof TimeUnit]

/**
 * 填充方向
 * 决定补位字符加在哪一侧
 */
export const PadSide = Object.freeze({
  /** 两侧：先左后右，余数落在右侧 */
  Both: 'both',
  /** 左对齐：补在右侧 */
  Left: 'left',
  /** 右对齐：补在左侧 */
  Right: 'right',
} as const)

/** 填充方向 */
export type PadSide = (typeof PadSide)[keyof typeof PadSide]

/**
 * 选择动作
 * 决定批量选择控件的操作语义
 */
export const SelectAction = Object.freeze({
  /** 全选：勾选全部可选项 */
  All: 'all',
  /** 反选：已选取消、未选勾选 */
  Invert: 'invert',
  /** 清空：取消全部已选项 */
  None: 'none',
} as const)

/** 选择动作 */
export type SelectAction = (typeof SelectAction)[keyof typeof SelectAction]

/**
 * JSON 处理
 * 决定编解码方向
 */
export const JsonOp = Object.freeze({
  /** 解码：字符串转结构，非字符串按数组归一 */
  Decode: 'decode',
  /** 编码：非 JSON 字符串转为 JSON 字符串 */
  Encode: 'encode',
} as const)

/** JSON 处理 */
export type JsonOp = (typeof JsonOp)[keyof typeof JsonOp]

/**
 * 消息变体
 * 决定消息以何种形态呈现
 */
export const Variant = Object.freeze({
  /** 提示：默认居中短消息，可自动消退 */
  Notice: 'notice',
  /** 气泡：附着在触发元素旁，适合表单校验 */
  Tips: 'tips',
  /** 通知：堆叠在屏幕角落，适合后台结果反馈 */
  Toast: 'toast',
} as const)

/** 消息变体 */
export type Variant = (typeof Variant)[keyof typeof Variant]

/**
 * 枚举总表
 * 供 window.moire.enum 统一暴露，禁止逐项再挂全局
 */
export const enums = Object.freeze({
  JsonOp,
  MergeBlankAs,
  MergeDirection,
  MergeMissing,
  MergeNormalize,
  PadSide,
  SelectAction,
  TimeUnit,
  UrlMode,
  Variant,
})

/**
 * 分支穷尽校验
 * 用于 switch 的 default 分支，新增成员时由类型检查暴露遗漏
 * @param value 未命中的成员
 * @param scope 枚举名，便于定位报错来源
 * @returns 永不返回
 * @example assertNever(direction, 'MergeDirection')
 */
export function assertNever(value: never, scope = '枚举'): never {
  throw new Error(`${scope} 出现未覆盖的成员：${String(value)}`)
}
