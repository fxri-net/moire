# 枚举字典

云纹框架不使用数字枚举，也不接受散落的字符串字面量。全部 19 组枚举以 `Object.freeze({ ... } as const)` 定义，值即语义，运行时统一从 `moire.enum` 取用。

```js
const { FieldKind, ToolOutcome } = moire.enum

FieldKind.Select // 'select'
ToolOutcome.Done // 'done'
```

::: tip 为什么不做数字枚举
数字成员在日志、接口与配置里不可读，也无法从取值反推含义。具名取值让「存进去的值」本身就是可解释的，跨进程传递时不需要额外映射表。
:::

## 合并与归一

控制 `utils.mergeParams` 的合并口径，四个维度可以自由组合。

### MergeDirection 合并方向

决定新值进入旧值时的取舍顺序。

| 成员    | 取值    | 说明                                                  |
| ------- | ------- | ----------------------------------------------------- |
| `Blank` | `blank` | 赋空：只关心缺失，命中即按 `missing` 兜底，不写入新值 |
| `Cover` | `cover` | 覆盖：新值存在即写入，缺失时按 `missing` 兜底         |
| `Fill`  | `fill`  | 融合：旧值优先，仅缺失时采用新值                      |

### MergeMissing 合并缺失兜底

决定判定为缺失后写入什么。

| 成员     | 取值     | 说明                                                |
| -------- | -------- | --------------------------------------------------- |
| `Empty`  | `empty`  | 空容器：写入空对象或空数组，形态由 `normalize` 决定 |
| `Ignore` | `ignore` | 忽略：缺失不处理，保留原状                          |
| `Null`   | `null`   | 置空：写入 `null`                                   |

### MergeBlankAs 合并空串归属

决定空字符串算不算缺失。

| 成员      | 取值      | 说明                         |
| --------- | --------- | ---------------------------- |
| `Missing` | `missing` | 缺失：空串与未定义同等对待   |
| `Value`   | `value`   | 有效值：空串按正常值参与合并 |

### MergeNormalize 合并归一

决定合并完成后对每个键做何种形态整理。

| 成员   | 取值   | 说明                           |
| ------ | ------ | ------------------------------ |
| `Json` | `json` | 解码：按 JSON 解码为数组或对象 |
| `List` | `list` | 拆分：按分隔符拆成数组         |
| `None` | `none` | 不处理                         |

### JsonOp JSON 处理

决定编解码方向，配合 `utils.text.json` 使用。

| 成员     | 取值     | 说明                                   |
| -------- | -------- | -------------------------------------- |
| `Decode` | `decode` | 解码：字符串转结构，非字符串按数组归一 |
| `Encode` | `encode` | 编码：非 JSON 字符串转为 JSON 字符串   |

## 工具与文本

### UrlMode 地址模式

决定地址参数的读写方向，配合 `utils.url` 使用。

| 成员     | 取值     | 说明                                     |
| -------- | -------- | ---------------------------------------- |
| `Build`  | `build`  | 组装：在当前地址上合并参数，返回相对地址 |
| `Append` | `append` | 追加：在指定地址上追加参数，返回完整地址 |
| `Read`   | `read`   | 读取：读取参数对象或单个参数值           |

### TimeUnit 时间单位

决定时长拆解的起点与展示粒度。

| 成员          | 取值          | 说明             |
| ------------- | ------------- | ---------------- |
| `Day`         | `day`         | 天               |
| `Hour`        | `hour`        | 小时             |
| `Millisecond` | `millisecond` | 毫秒             |
| `Minute`      | `minute`      | 分钟             |
| `Month`       | `month`       | 月：按 30 天折算 |
| `Second`      | `second`      | 秒               |
| `Year`        | `year`        | 年：按 12 月折算 |

### PadSide 填充方向

决定补位字符加在哪一侧。

| 成员    | 取值    | 说明                         |
| ------- | ------- | ---------------------------- |
| `Both`  | `both`  | 两侧：先左后右，余数落在右侧 |
| `Left`  | `left`  | 左对齐：补在右侧             |
| `Right` | `right` | 右对齐：补在左侧             |

### Variant 消息变体

决定消息以何种形态呈现。

| 成员     | 取值     | 说明                                   |
| -------- | -------- | -------------------------------------- |
| `Notice` | `notice` | 提示：默认居中短消息，可自动消退       |
| `Tips`   | `tips`   | 气泡：附着在触发元素旁，适合表单校验   |
| `Toast`  | `toast`  | 通知：堆叠在屏幕角落，适合后台结果反馈 |

## 字段与校验

### FieldKind 字段类型

每个成员对应一个内置渲染器，键名与取值同名便于阅读。

| 成员       | 取值       | 说明       |
| ---------- | ---------- | ---------- |
| `Checkbox` | `checkbox` | 复选框     |
| `Date`     | `date`     | 日期选择   |
| `DateText` | `dateText` | 日期文本   |
| `File`     | `file`     | 文件上传   |
| `Hidden`   | `hidden`   | 隐藏域     |
| `Html`     | `html`     | 超文本展示 |
| `Input`    | `input`    | 单行输入   |
| `Password` | `password` | 密码输入   |
| `RichText` | `richtext` | 富文本编辑 |
| `Select`   | `select`   | 单选下拉   |
| `Selected` | `selected` | 已选展示   |
| `Selects`  | `selects`  | 多选下拉   |
| `Switch`   | `switch`   | 开关       |
| `Table`    | `table`    | 表格行集   |
| `Text`     | `text`     | 文本展示   |
| `Textarea` | `textarea` | 多行输入   |

### FieldStage 字段阶段

七步生命周期的固定顺序，前四步一次性，后三步可重复。

| 成员     | 取值     | 说明                       |
| -------- | -------- | -------------------------- |
| `Init`   | `init`   | 初始化：归一描述与文案     |
| `Data`   | `data`   | 数据：整理候选数据         |
| `Deploy` | `deploy` | 部署：生成包装与控件       |
| `Done`   | `done`   | 完成：注册交互与增强       |
| `Echo`   | `echo`   | 输出：读取取值并按规则校验 |
| `Reset`  | `reset`  | 重置：写回初始值           |
| `Clean`  | `clean`  | 清理：清空控件             |

### RuleKind 规则类型

决定校验采用哪一种判定口径。

| 成员       | 取值       | 说明                                 |
| ---------- | ---------- | ------------------------------------ |
| `Length`   | `length`   | 长度：字符串长度、数组长度或对象键数 |
| `Pattern`  | `pattern`  | 正则：按给定表达式匹配               |
| `Range`    | `range`    | 范围：数值区间                       |
| `Required` | `required` | 必填：不允许空白与空容器             |
| `Type`     | `type`     | 类型：取值形态                       |

### ValueKind 取值类型

校验与归一使用的形态口径。

| 成员      | 取值      | 说明   |
| --------- | --------- | ------ |
| `Array`   | `array`   | 数组   |
| `Boolean` | `boolean` | 布尔值 |
| `Number`  | `number`  | 数字   |
| `Object`  | `object`  | 对象   |
| `String`  | `string`  | 字符串 |

## 视图与选择

### ViewKind 视图类型

决定装配器面向表单还是列表。

| 成员   | 取值   | 说明                     |
| ------ | ------ | ------------------------ |
| `Form` | `form` | 表单：字段集合的编辑形态 |
| `List` | `list` | 列表：数据行的浏览形态   |

### SelectionMode 选择模式

决定列表是否提供行选择以及可选数量。

| 成员       | 取值       | 说明           |
| ---------- | ---------- | -------------- |
| `Multiple` | `multiple` | 多选           |
| `None`     | `none`     | 不选：只读浏览 |
| `Single`   | `single`   | 单选           |

### SelectAction 选择动作

决定批量选择控件的操作语义。

| 成员     | 取值     | 说明                     |
| -------- | -------- | ------------------------ |
| `All`    | `all`    | 全选：勾选全部可选项     |
| `Invert` | `invert` | 反选：已选取消、未选勾选 |
| `None`   | `none`   | 清空：取消全部已选项     |

### OrderDirection 排序方向

决定字段取值的比较顺序。

| 成员   | 取值   | 说明 |
| ------ | ------ | ---- |
| `Asc`  | `asc`  | 升序 |
| `Desc` | `desc` | 降序 |

## 工具能力

### ToolAction 工具操作

覆盖旧工具集的全部动作，替代散落的字符串事件名。

| 成员       | 取值       | 说明                   |
| ---------- | ---------- | ---------------------- |
| `Delete`   | `delete`   | 删除：提交主键集合     |
| `Download` | `download` | 下载：打开下载地址     |
| `Export`   | `export`   | 导出：拼装全量查询地址 |
| `Import`   | `import`   | 导入：打开导入入口     |
| `Message`  | `message`  | 消息：按变体发出通知   |
| `Window`   | `window`   | 窗口：打开指定地址     |

### ToolOutcome 工具结果

以结构化结果区分完成、失败、取消与跳过，禁止用 `false` 兼表多种语义。

| 成员        | 取值        | 说明                             |
| ----------- | ----------- | -------------------------------- |
| `Cancelled` | `cancelled` | 取消：用户在确认环节放弃         |
| `Done`      | `done`      | 完成：操作已执行                 |
| `Failed`    | `failed`    | 失败：请求失败或缺少必要配置     |
| `Skipped`   | `skipped`   | 跳过：前置条件不成立，未发起操作 |

## 分支穷尽校验

框架源码里的 `assertNever` 专供 `switch` 的 `default` 分支：入参收窄为 `never`，新增枚举成员后类型检查立刻报出遗漏。它属于源码内部工具，不随包产物导出；插件里需要同样的保护时，把未命中值赋给 `never` 即可。

```ts
import type { MergeDirection } from 'moire'

function describe(direction: MergeDirection): string {
  switch (direction) {
    case 'blank':
      return '赋空'
    case 'cover':
      return '覆盖'
    case 'fill':
      return '融合'
    default: {
      // 枚举新增成员时，这里无法赋值，编译期直接报错
      const missing: never = direction
      return missing
    }
  }
}
```
