/**
 * 枚举集合
 * 一律以 const 对象 + as const 表达，同名类型即成员联合，禁止数字枚举与无意义编码
 */
/**
 * 合并方向
 * 决定新值进入旧值时的取舍顺序
 */
export declare const MergeDirection: Readonly<{
    /** 赋空：只关心缺失，命中即按 missing 兜底，不写入新值 */
    readonly Blank: "blank";
    /** 覆盖：新值存在即写入，缺失时按 missing 兜底 */
    readonly Cover: "cover";
    /** 融合：旧值优先，仅缺失时采用新值 */
    readonly Fill: "fill";
}>;
/** 合并方向 */
export type MergeDirection = (typeof MergeDirection)[keyof typeof MergeDirection];
/**
 * 合并缺失兜底
 * 决定判定为缺失后写入什么
 */
export declare const MergeMissing: Readonly<{
    /** 空容器：写入空对象或空数组，形态由 normalize 决定 */
    readonly Empty: "empty";
    /** 忽略：缺失不处理，保留原状 */
    readonly Ignore: "ignore";
    /** 置空：写入 null */
    readonly Null: "null";
}>;
/** 合并缺失兜底 */
export type MergeMissing = (typeof MergeMissing)[keyof typeof MergeMissing];
/**
 * 合并空串归属
 * 决定空字符串算不算缺失
 */
export declare const MergeBlankAs: Readonly<{
    /** 缺失：空串与未定义同等对待 */
    readonly Missing: "missing";
    /** 有效值：空串按正常值参与合并 */
    readonly Value: "value";
}>;
/** 合并空串归属 */
export type MergeBlankAs = (typeof MergeBlankAs)[keyof typeof MergeBlankAs];
/**
 * 合并归一
 * 决定合并完成后对每个键做何种形态整理
 */
export declare const MergeNormalize: Readonly<{
    /** 解码：按 JSON 解码为数组或对象 */
    readonly Json: "json";
    /** 拆分：按分隔符拆成数组 */
    readonly List: "list";
    /** 不处理 */
    readonly None: "none";
}>;
/** 合并归一 */
export type MergeNormalize = (typeof MergeNormalize)[keyof typeof MergeNormalize];
/**
 * 地址模式
 * 决定地址参数的读写方向
 */
export declare const UrlMode: Readonly<{
    /** 组装：在当前地址上合并参数，返回相对地址 */
    readonly Build: "build";
    /** 追加：在指定地址上追加参数，返回完整地址 */
    readonly Append: "append";
    /** 读取：读取参数对象或单个参数值 */
    readonly Read: "read";
}>;
/** 地址模式 */
export type UrlMode = (typeof UrlMode)[keyof typeof UrlMode];
/**
 * 时间单位
 * 决定时长拆解的起点与展示粒度
 */
export declare const TimeUnit: Readonly<{
    /** 天 */
    readonly Day: "day";
    /** 小时 */
    readonly Hour: "hour";
    /** 毫秒 */
    readonly Millisecond: "millisecond";
    /** 分钟 */
    readonly Minute: "minute";
    /** 月：按 30 天折算 */
    readonly Month: "month";
    /** 秒 */
    readonly Second: "second";
    /** 年：按 12 月折算 */
    readonly Year: "year";
}>;
/** 时间单位 */
export type TimeUnit = (typeof TimeUnit)[keyof typeof TimeUnit];
/**
 * 填充方向
 * 决定补位字符加在哪一侧
 */
export declare const PadSide: Readonly<{
    /** 两侧：先左后右，余数落在右侧 */
    readonly Both: "both";
    /** 左对齐：补在右侧 */
    readonly Left: "left";
    /** 右对齐：补在左侧 */
    readonly Right: "right";
}>;
/** 填充方向 */
export type PadSide = (typeof PadSide)[keyof typeof PadSide];
/**
 * 选择动作
 * 决定批量选择控件的操作语义
 */
export declare const SelectAction: Readonly<{
    /** 全选：勾选全部可选项 */
    readonly All: "all";
    /** 反选：已选取消、未选勾选 */
    readonly Invert: "invert";
    /** 清空：取消全部已选项 */
    readonly None: "none";
}>;
/** 选择动作 */
export type SelectAction = (typeof SelectAction)[keyof typeof SelectAction];
/**
 * JSON 处理
 * 决定编解码方向
 */
export declare const JsonOp: Readonly<{
    /** 解码：字符串转结构，非字符串按数组归一 */
    readonly Decode: "decode";
    /** 编码：非 JSON 字符串转为 JSON 字符串 */
    readonly Encode: "encode";
}>;
/** JSON 处理 */
export type JsonOp = (typeof JsonOp)[keyof typeof JsonOp];
/**
 * 消息变体
 * 决定消息以何种形态呈现
 */
export declare const Variant: Readonly<{
    /** 提示：默认居中短消息，可自动消退 */
    readonly Notice: "notice";
    /** 气泡：附着在触发元素旁，适合表单校验 */
    readonly Tips: "tips";
    /** 通知：堆叠在屏幕角落，适合后台结果反馈 */
    readonly Toast: "toast";
}>;
/** 消息变体 */
export type Variant = (typeof Variant)[keyof typeof Variant];
/**
 * 字段阶段
 * 七步生命周期的固定顺序，前四步一次性，后三步可重复
 */
export declare const FieldStage: Readonly<{
    /** 初始化：归一描述与文案 */
    readonly Init: "init";
    /** 数据：整理候选数据 */
    readonly Data: "data";
    /** 部署：生成包装与控件 */
    readonly Deploy: "deploy";
    /** 完成：注册交互与增强 */
    readonly Done: "done";
    /** 输出：读取取值并按规则校验 */
    readonly Echo: "echo";
    /** 重置：写回初始值 */
    readonly Reset: "reset";
    /** 清理：清空控件 */
    readonly Clean: "clean";
}>;
/** 字段阶段 */
export type FieldStage = (typeof FieldStage)[keyof typeof FieldStage];
/**
 * 字段类型
 * 每个成员对应一个内置渲染器，键名与取值同名便于阅读
 */
export declare const FieldKind: Readonly<{
    /** 复选框 */
    readonly Checkbox: "checkbox";
    /** 日期选择 */
    readonly Date: "date";
    /** 日期文本 */
    readonly DateText: "dateText";
    /** 文件上传 */
    readonly File: "file";
    /** 隐藏域 */
    readonly Hidden: "hidden";
    /** 超文本展示 */
    readonly Html: "html";
    /** 单行输入 */
    readonly Input: "input";
    /** 密码输入 */
    readonly Password: "password";
    /** 富文本编辑 */
    readonly RichText: "richtext";
    /** 单选下拉 */
    readonly Select: "select";
    /** 已选展示 */
    readonly Selected: "selected";
    /** 多选下拉 */
    readonly Selects: "selects";
    /** 开关 */
    readonly Switch: "switch";
    /** 表格行集 */
    readonly Table: "table";
    /** 文本展示 */
    readonly Text: "text";
    /** 多行输入 */
    readonly Textarea: "textarea";
}>;
/** 字段类型 */
export type FieldKind = (typeof FieldKind)[keyof typeof FieldKind];
/**
 * 规则类型
 * 决定校验采用哪一种判定口径
 */
export declare const RuleKind: Readonly<{
    /** 长度：字符串长度、数组长度或对象键数 */
    readonly Length: "length";
    /** 正则：按给定表达式匹配 */
    readonly Pattern: "pattern";
    /** 范围：数值区间 */
    readonly Range: "range";
    /** 必填：不允许空白与空容器 */
    readonly Required: "required";
    /** 类型：取值形态 */
    readonly Type: "type";
}>;
/** 规则类型 */
export type RuleKind = (typeof RuleKind)[keyof typeof RuleKind];
/**
 * 取值类型
 * 校验与归一使用的形态口径
 */
export declare const ValueKind: Readonly<{
    /** 数组 */
    readonly Array: "array";
    /** 布尔值 */
    readonly Boolean: "boolean";
    /** 数字 */
    readonly Number: "number";
    /** 对象 */
    readonly Object: "object";
    /** 字符串 */
    readonly String: "string";
}>;
/** 取值类型 */
export type ValueKind = (typeof ValueKind)[keyof typeof ValueKind];
/**
 * 视图类型
 * 决定装配器面向表单还是列表
 */
export declare const ViewKind: Readonly<{
    /** 表单：字段集合的编辑形态 */
    readonly Form: "form";
    /** 列表：数据行的浏览形态 */
    readonly List: "list";
}>;
/** 视图类型 */
export type ViewKind = (typeof ViewKind)[keyof typeof ViewKind];
/**
 * 选择模式
 * 决定列表是否提供行选择以及可选数量
 */
export declare const SelectionMode: Readonly<{
    /** 多选 */
    readonly Multiple: "multiple";
    /** 不选：只读浏览 */
    readonly None: "none";
    /** 单选 */
    readonly Single: "single";
}>;
/** 选择模式 */
export type SelectionMode = (typeof SelectionMode)[keyof typeof SelectionMode];
/**
 * 排序方向
 * 决定字段取值的比较顺序
 */
export declare const OrderDirection: Readonly<{
    /** 升序 */
    readonly Asc: "asc";
    /** 降序 */
    readonly Desc: "desc";
}>;
/** 排序方向 */
export type OrderDirection = (typeof OrderDirection)[keyof typeof OrderDirection];
/**
 * 工具操作
 * 覆盖旧工具集的全部动作，替代散落的字符串事件名
 */
export declare const ToolAction: Readonly<{
    /** 删除：提交主键集合 */
    readonly Delete: "delete";
    /** 下载：打开下载地址 */
    readonly Download: "download";
    /** 导出：拼装全量查询地址 */
    readonly Export: "export";
    /** 导入：打开导入入口 */
    readonly Import: "import";
    /** 消息：按变体发出通知 */
    readonly Message: "message";
    /** 窗口：打开指定地址 */
    readonly Window: "window";
}>;
/** 工具操作 */
export type ToolAction = (typeof ToolAction)[keyof typeof ToolAction];
/**
 * 工具结果
 * 以结构化结果区分完成、失败、取消与跳过，禁止用 false 兼表多种语义
 */
export declare const ToolOutcome: Readonly<{
    /** 取消：用户在确认环节放弃 */
    readonly Cancelled: "cancelled";
    /** 完成：操作已执行 */
    readonly Done: "done";
    /** 失败：请求失败或缺少必要配置 */
    readonly Failed: "failed";
    /** 跳过：前置条件不成立，未发起操作 */
    readonly Skipped: "skipped";
}>;
/** 工具结果 */
export type ToolOutcome = (typeof ToolOutcome)[keyof typeof ToolOutcome];
/**
 * 枚举总表
 * 供 window.moire.enum 统一暴露，禁止逐项再挂全局
 */
export declare const enums: Readonly<{
    FieldKind: Readonly<{
        /** 复选框 */
        readonly Checkbox: "checkbox";
        /** 日期选择 */
        readonly Date: "date";
        /** 日期文本 */
        readonly DateText: "dateText";
        /** 文件上传 */
        readonly File: "file";
        /** 隐藏域 */
        readonly Hidden: "hidden";
        /** 超文本展示 */
        readonly Html: "html";
        /** 单行输入 */
        readonly Input: "input";
        /** 密码输入 */
        readonly Password: "password";
        /** 富文本编辑 */
        readonly RichText: "richtext";
        /** 单选下拉 */
        readonly Select: "select";
        /** 已选展示 */
        readonly Selected: "selected";
        /** 多选下拉 */
        readonly Selects: "selects";
        /** 开关 */
        readonly Switch: "switch";
        /** 表格行集 */
        readonly Table: "table";
        /** 文本展示 */
        readonly Text: "text";
        /** 多行输入 */
        readonly Textarea: "textarea";
    }>;
    FieldStage: Readonly<{
        /** 初始化：归一描述与文案 */
        readonly Init: "init";
        /** 数据：整理候选数据 */
        readonly Data: "data";
        /** 部署：生成包装与控件 */
        readonly Deploy: "deploy";
        /** 完成：注册交互与增强 */
        readonly Done: "done";
        /** 输出：读取取值并按规则校验 */
        readonly Echo: "echo";
        /** 重置：写回初始值 */
        readonly Reset: "reset";
        /** 清理：清空控件 */
        readonly Clean: "clean";
    }>;
    JsonOp: Readonly<{
        /** 解码：字符串转结构，非字符串按数组归一 */
        readonly Decode: "decode";
        /** 编码：非 JSON 字符串转为 JSON 字符串 */
        readonly Encode: "encode";
    }>;
    MergeBlankAs: Readonly<{
        /** 缺失：空串与未定义同等对待 */
        readonly Missing: "missing";
        /** 有效值：空串按正常值参与合并 */
        readonly Value: "value";
    }>;
    MergeDirection: Readonly<{
        /** 赋空：只关心缺失，命中即按 missing 兜底，不写入新值 */
        readonly Blank: "blank";
        /** 覆盖：新值存在即写入，缺失时按 missing 兜底 */
        readonly Cover: "cover";
        /** 融合：旧值优先，仅缺失时采用新值 */
        readonly Fill: "fill";
    }>;
    MergeMissing: Readonly<{
        /** 空容器：写入空对象或空数组，形态由 normalize 决定 */
        readonly Empty: "empty";
        /** 忽略：缺失不处理，保留原状 */
        readonly Ignore: "ignore";
        /** 置空：写入 null */
        readonly Null: "null";
    }>;
    MergeNormalize: Readonly<{
        /** 解码：按 JSON 解码为数组或对象 */
        readonly Json: "json";
        /** 拆分：按分隔符拆成数组 */
        readonly List: "list";
        /** 不处理 */
        readonly None: "none";
    }>;
    OrderDirection: Readonly<{
        /** 升序 */
        readonly Asc: "asc";
        /** 降序 */
        readonly Desc: "desc";
    }>;
    PadSide: Readonly<{
        /** 两侧：先左后右，余数落在右侧 */
        readonly Both: "both";
        /** 左对齐：补在右侧 */
        readonly Left: "left";
        /** 右对齐：补在左侧 */
        readonly Right: "right";
    }>;
    RuleKind: Readonly<{
        /** 长度：字符串长度、数组长度或对象键数 */
        readonly Length: "length";
        /** 正则：按给定表达式匹配 */
        readonly Pattern: "pattern";
        /** 范围：数值区间 */
        readonly Range: "range";
        /** 必填：不允许空白与空容器 */
        readonly Required: "required";
        /** 类型：取值形态 */
        readonly Type: "type";
    }>;
    SelectAction: Readonly<{
        /** 全选：勾选全部可选项 */
        readonly All: "all";
        /** 反选：已选取消、未选勾选 */
        readonly Invert: "invert";
        /** 清空：取消全部已选项 */
        readonly None: "none";
    }>;
    SelectionMode: Readonly<{
        /** 多选 */
        readonly Multiple: "multiple";
        /** 不选：只读浏览 */
        readonly None: "none";
        /** 单选 */
        readonly Single: "single";
    }>;
    TimeUnit: Readonly<{
        /** 天 */
        readonly Day: "day";
        /** 小时 */
        readonly Hour: "hour";
        /** 毫秒 */
        readonly Millisecond: "millisecond";
        /** 分钟 */
        readonly Minute: "minute";
        /** 月：按 30 天折算 */
        readonly Month: "month";
        /** 秒 */
        readonly Second: "second";
        /** 年：按 12 月折算 */
        readonly Year: "year";
    }>;
    ToolAction: Readonly<{
        /** 删除：提交主键集合 */
        readonly Delete: "delete";
        /** 下载：打开下载地址 */
        readonly Download: "download";
        /** 导出：拼装全量查询地址 */
        readonly Export: "export";
        /** 导入：打开导入入口 */
        readonly Import: "import";
        /** 消息：按变体发出通知 */
        readonly Message: "message";
        /** 窗口：打开指定地址 */
        readonly Window: "window";
    }>;
    ToolOutcome: Readonly<{
        /** 取消：用户在确认环节放弃 */
        readonly Cancelled: "cancelled";
        /** 完成：操作已执行 */
        readonly Done: "done";
        /** 失败：请求失败或缺少必要配置 */
        readonly Failed: "failed";
        /** 跳过：前置条件不成立，未发起操作 */
        readonly Skipped: "skipped";
    }>;
    UrlMode: Readonly<{
        /** 组装：在当前地址上合并参数，返回相对地址 */
        readonly Build: "build";
        /** 追加：在指定地址上追加参数，返回完整地址 */
        readonly Append: "append";
        /** 读取：读取参数对象或单个参数值 */
        readonly Read: "read";
    }>;
    ValueKind: Readonly<{
        /** 数组 */
        readonly Array: "array";
        /** 布尔值 */
        readonly Boolean: "boolean";
        /** 数字 */
        readonly Number: "number";
        /** 对象 */
        readonly Object: "object";
        /** 字符串 */
        readonly String: "string";
    }>;
    Variant: Readonly<{
        /** 提示：默认居中短消息，可自动消退 */
        readonly Notice: "notice";
        /** 气泡：附着在触发元素旁，适合表单校验 */
        readonly Tips: "tips";
        /** 通知：堆叠在屏幕角落，适合后台结果反馈 */
        readonly Toast: "toast";
    }>;
    ViewKind: Readonly<{
        /** 表单：字段集合的编辑形态 */
        readonly Form: "form";
        /** 列表：数据行的浏览形态 */
        readonly List: "list";
    }>;
}>;
/**
 * 分支穷尽校验
 * 用于 switch 的 default 分支，新增成员时由类型检查暴露遗漏
 * @param value 未命中的成员
 * @param scope 枚举名，便于定位报错来源
 * @returns 永不返回
 * @example assertNever(direction, 'MergeDirection')
 */
export declare function assertNever(value: never, scope?: string): never;
