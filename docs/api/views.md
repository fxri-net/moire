# 视图能力

视图层只做两件事：把声明**装配**成结构，把结构**渲染**成 DOM。装配是纯函数，不碰 DOM；渲染只调界面适配，不重新计算业务。

```js
const assembly = moire.views.list.assemble(
  { columns: [{ name: 'id' }, { name: 'nick' }], rows, limit: 20 },
  { page: 2, order: [{ name: 'id', direction: 'desc' }] },
)

const elem = moire.views.list.render(assembly, document.querySelector('#app'))
```

## Views

| 成员   | 类型            | 说明                         |
| ------ | --------------- | ---------------------------- |
| `list` | `ListAssembler` | 列表装配器，`kind` 为 `list` |
| `form` | `FormAssembler` | 表单装配器，`kind` 为 `form` |

两个装配器结构一致：

| 成员       | 签名                             | 说明                             |
| ---------- | -------------------------------- | -------------------------------- |
| `kind`     | `ViewKind`                       | 视图类型                         |
| `assemble` | `(schema, query?) => assembly`   | 只做归一、排序与切片，不产生 DOM |
| `render`   | `(assembly, target?) => Element` | 只做 DOM 组装与适配层增强        |

## 列表

### ListQuery

| 字段    | 类型                     | 缺省          | 说明                               |
| ------- | ------------------------ | ------------- | ---------------------------------- |
| `page`  | `number`                 | `1`           | 页码，越界时钳制到合法区间         |
| `limit` | `number`                 | 声明值或 `10` | 单页条数，不足 `1` 的值按 `1` 处理 |
| `order` | `readonly OrderClause[]` | `[]`          | 排序子句，按顺序逐级比较           |

```ts
interface OrderClause {
  /** 排序字段名 */
  name: string
  /** 排序方向 */
  direction: OrderDirection
}
```

### ListAssembly

| 字段        | 类型                     | 说明                                        |
| ----------- | ------------------------ | ------------------------------------------- |
| `columns`   | `readonly ViewColumn[]`  | 归一后的列，标题与类型已兜底                |
| `rows`      | `readonly RowData[]`     | 当前页数据                                  |
| `page`      | `ListPage`               | 分页信息：`page`、`limit`、`total`、`pages` |
| `selection` | `SelectionMode`          | 选择模式，缺省 `none`                       |
| `key`       | `string`                 | 行主键字段名，缺省 `id`                     |
| `order`     | `readonly OrderClause[]` | 生效的排序子句                              |
| `name`      | `string`                 | 列表名，未声明时省略                        |

装配规则：

- 列的标题缺省取字段名，渲染类型缺省为 `text`。
- 排序为空值视为最大，数字按数值比较，其余按展示文本比较；键相等时保留原始顺序。
- 空数据固定为第 1 页、总页数为 1。

### 渲染产物

| 选择器 / 属性                                                    | 说明                   |
| ---------------------------------------------------------------- | ---------------------- |
| `.moire-list`                                                    | 列表根                 |
| `.moire-table`                                                   | 表格                   |
| `.moire-list-select`                                             | 选择列                 |
| `.moire-list-empty`                                              | 空态单元格             |
| `.moire-list-summary` / `.moire-list-total` / `.moire-list-page` | 表尾汇总               |
| `[data-moire-list]`                                              | 列表名                 |
| `[data-moire-row]`                                               | 行选择控件             |
| `[data-moire-row-key]`                                           | 行主键，写在 `<tr>` 上 |
| `[data-moire-select-all]`                                        | 多选模式的全选开关     |

多选模式提供全选框，单选与不选只占位或不占位；表尾始终给出总数与页码，按需用样式隐藏即可。

```js
// 取已勾选行的主键
const keys = [...elem.querySelectorAll('[data-moire-row]:checked')].map((input) => input.value)
```

## 表单

### FormAssembly

| 字段     | 类型                       | 说明                                                  |
| -------- | -------------------------- | ----------------------------------------------------- |
| `name`   | `string`                   | 表单名，未声明时省略                                  |
| `fields` | `readonly FormFieldPlan[]` | 归一后的字段计划：`name`、`label`、`kind`、`required` |
| `schema` | `FormSchema`               | 原始声明，渲染时直接交给字段层                        |

渲染由字段层的 `createForm` 完成，字段排布、校验规则都不在视图层重复实现。

::: warning 字段重名在装配阶段就报错
`assemble` 即校验字段名唯一性，不需要等到渲染。装配阶段允许缺少字段能力，直到 `render` 才报错，便于先取结构后接字段层。
:::

## 装配与渲染分离的收益

- 装配结果可序列化、可缓存、可在 Node 侧单测，不需要 DOM 环境。
- 业务可以只取 `assembly.page` 做分页控件，不必渲染整张表。
- 界面库替换只影响适配层与渲染产物，装配逻辑不变。
