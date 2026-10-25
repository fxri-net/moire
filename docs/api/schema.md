# 声明契约

表单与列表共用一套 schema 描述，只声明「有什么」，不声明「长什么样」。字段层负责控件，视图层负责装配与渲染，界面库细节由适配层吸收。

```js
const { FieldKind, RuleKind, SelectionMode, ValueKind } = moire.enum
```

下文示例里的枚举成员都取自 `moire.enum`，为聚焦声明结构省略了前缀；类型可从包入口按需引入。

```ts
import type { FormSchema, ListSchema } from 'moire'
```

## FieldSchema

| 字段          | 类型              | 必填 | 说明                                                |
| ------------- | ----------------- | ---- | --------------------------------------------------- |
| `name`        | `string`          | 是   | 字段名，表单内唯一，重复声明在装配时报错            |
| `kind`        | `FieldKind`       | 是   | 渲染类型，见[枚举字典](../enums#fieldkind-字段类型) |
| `label`       | `string`          | 否   | 标签，缺省取字段名                                  |
| `value`       | `unknown`         | 否   | 初始值，`reset` 写回的就是它                        |
| `placeholder` | `string`          | 否   | 占位提示                                            |
| `required`    | `boolean`         | 否   | 等价于在规则前追加必填                              |
| `disabled`    | `boolean`         | 否   | 是否禁用                                            |
| `hidden`      | `boolean`         | 否   | 是否隐藏                                            |
| `rules`       | `readonly Rule[]` | 否   | 校验规则，按声明顺序逐条判定                        |
| `option`      | `FieldOption`     | 否   | 类型专属选项                                        |

```ts
const title: FieldSchema = {
  name: 'title',
  kind: FieldKind.Input,
  label: '标题',
  required: true,
  rules: [{ kind: RuleKind.Length, min: 2, max: 40 }],
  placeholder: '请输入标题',
}
```

## FieldOption

| 选项        | 类型                             | 适用类型                                    | 说明               |
| ----------- | -------------------------------- | ------------------------------------------- | ------------------ |
| `choices`   | `readonly FieldChoice[]`         | `select`、`selected`、`selects`、`checkbox` | 候选项             |
| `columns`   | `readonly ColumnSchema[]`        | `table`                                     | 表格列             |
| `actions`   | `readonly SelectAction[]`        | `selects`                                   | 批量动作按钮       |
| `dateType`  | `'date' \| 'datetime' \| 'time'` | `date`                                      | 控件形态           |
| `format`    | `string`                         | `date`、`dateText`                          | 取值格式           |
| `range`     | `boolean`                        | `date`                                      | 是否区间           |
| `multiple`  | `boolean`                        | `file`                                      | 是否允许一次选多个 |
| `uploadUrl` | `string`                         | `file`                                      | 上传接收地址       |
| `accept`    | `string`                         | `file`                                      | 接收的文件类型     |
| `height`    | `number`                         | `richtext`                                  | 编辑区高度         |

### FieldChoice

| 字段       | 类型      | 必填 | 说明     |
| ---------- | --------- | ---- | -------- |
| `value`    | `string`  | 是   | 取值     |
| `label`    | `string`  | 是   | 展示文本 |
| `disabled` | `boolean` | 否   | 是否禁用 |

## 校验规则

规则是判别联合，以 `kind` 区分，五种形态互不重叠。

| 规则 | 结构                                 | 说明                                                |
| ---- | ------------------------------------ | --------------------------------------------------- |
| 必填 | `{ kind: 'required' }`               | 不允许空白与空容器                                  |
| 类型 | `{ kind: 'type', value: ValueKind }` | 取值形态，见[取值类型](../enums#valuekind-取值类型) |
| 范围 | `{ kind: 'range', min?, max? }`      | 数值区间，含边界                                    |
| 长度 | `{ kind: 'length', min?, max? }`     | 字符串长度、数组长度或对象键数                      |
| 正则 | `{ kind: 'pattern', value: RegExp }` | 按表达式匹配                                        |

```ts
const amount: FieldSchema = {
  name: 'amount',
  kind: FieldKind.Input,
  rules: [{ kind: RuleKind.Required }, { kind: RuleKind.Type, value: ValueKind.Number }, { kind: RuleKind.Range, min: 0, max: 999999.99 }],
}
```

## ValidationResult

`echo()` 的返回值，问题列表顺序同字段顺序。

| 字段     | 类型                         | 说明               |
| -------- | ---------------------------- | ------------------ |
| `valid`  | `boolean`                    | 是否全部通过       |
| `values` | `RowData`                    | 按字段名整理的取值 |
| `issues` | `readonly ValidationIssue[]` | 问题列表           |

```ts
interface ValidationIssue {
  /** 字段名 */
  name: string
  /** 触发规则的类型 */
  kind: RuleKind
  /** 展示文案 */
  message: string
}
```

## ColumnSchema

| 字段          | 类型                     | 必填 | 说明                     |
| ------------- | ------------------------ | ---- | ------------------------ |
| `name`        | `string`                 | 是   | 字段名                   |
| `title`       | `string`                 | 否   | 列标题，缺省取字段名     |
| `width`       | `number`                 | 否   | 列宽                     |
| `readonly`    | `boolean`                | 否   | 是否只读                 |
| `placeholder` | `string`                 | 否   | 占位提示                 |
| `kind`        | `FieldKind`              | 否   | 渲染类型，缺省按文本展示 |
| `choices`     | `readonly FieldChoice[]` | 否   | 候选项，展示时映射为标签 |

## FormSchema

| 字段      | 类型                      | 必填 | 说明                         |
| --------- | ------------------------- | ---- | ---------------------------- |
| `name`    | `string`                  | 否   | 表单名                       |
| `fields`  | `readonly FieldSchema[]`  | 是   | 字段列表                     |
| `columns` | `readonly ColumnSchema[]` | 否   | 表格列，供表格形态的表单使用 |

## ListSchema

| 字段        | 类型                      | 必填 | 说明                    |
| ----------- | ------------------------- | ---- | ----------------------- |
| `name`      | `string`                  | 否   | 列表名                  |
| `columns`   | `readonly ColumnSchema[]` | 是   | 列列表                  |
| `rows`      | `readonly RowData[]`      | 否   | 行数据，缺省为空        |
| `limit`     | `number`                  | 否   | 单页条数，缺省 `10`     |
| `selection` | `SelectionMode`           | 否   | 选择模式，缺省 `none`   |
| `key`       | `string`                  | 否   | 行主键字段名，缺省 `id` |

```ts
const users: ListSchema = {
  name: 'users',
  columns: [
    { name: 'id', title: '编号', width: 80 },
    { name: 'nick', title: '昵称' },
    { name: 'state', title: '状态', choices: [{ value: '1', label: '启用' }] },
  ],
  rows: await loadUsers(),
  limit: 20,
  selection: SelectionMode.Multiple,
}
```

::: tip 声明里没有样式
schema 不承载类名、宽度百分比、颜色等表现信息。需要定制外观时，在渲染结果上叠加自己的样式，而不是往声明里塞界面库参数。
:::
