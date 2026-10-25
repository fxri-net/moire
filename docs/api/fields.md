# 字段能力

字段层把「声明 + 渲染器 + 界面适配」组装成字段实例与表单实例。没接入界面库时控件仍可读写与校验，只是失去日历、富文本、拖拽等增强。

```js
const form = moire.fields.createForm(
  {
    fields: [
      { name: 'title', kind: 'input', label: '标题', required: true },
      { name: 'state', kind: 'select', label: '状态', option: { choices: [{ value: '1', label: '启用' }] } },
    ],
  },
  document.querySelector('#app'),
)

const { valid, values, issues } = form.echo()
```

## Fields

| 成员         | 类型                                                     | 说明                             |
| ------------ | -------------------------------------------------------- | -------------------------------- |
| `renderers`  | `ReadonlyMap<FieldKind, FieldRenderer>`                  | 已注册渲染器，按字段类型索引     |
| `create`     | `(field: FieldSchema) => FieldInstance`                  | 创建字段实例，未注册类型直接抛错 |
| `createForm` | `(schema: FormSchema, target?: Element) => FormInstance` | 创建表单实例，目标给定时挂入其中 |
| `register`   | `(renderer: FieldRenderer) => Fields`                    | 注册渲染器，同类型覆盖           |
| `setNotify`  | `(notify: Notify) => Fields`                             | 替换通知实现                     |

## 内置渲染器

16 种类型全部内置，键名与[字段类型](../enums#fieldkind-字段类型)一致。

| 类型       | 控件       | 取值形态    | 依赖界面库                   |
| ---------- | ---------- | ----------- | ---------------------------- |
| `input`    | 单行输入   | 字符串      | 否                           |
| `password` | 密码输入   | 字符串      | 否                           |
| `textarea` | 多行输入   | 字符串      | 否                           |
| `switch`   | 开关       | 布尔值      | 否                           |
| `checkbox` | 复选框     | 布尔值      | 否                           |
| `select`   | 单选下拉   | 字符串      | 否                           |
| `selects`  | 多选下拉   | 字符串数组  | 是（批量动作与取值走适配层） |
| `selected` | 已选展示   | 字符串数组  | 否                           |
| `table`    | 表格行集   | 行数据数组  | 否                           |
| `date`     | 日期选择   | 字符串      | 是（缺省退回原生输入）       |
| `dateText` | 日期文本   | 字符串      | 否                           |
| `file`     | 文件上传   | 字符串      | 是（缺省退回原生文件框）     |
| `richtext` | 富文本编辑 | HTML 字符串 | 是（缺省退回多行输入）       |
| `text`     | 文本展示   | 字符串      | 否                           |
| `html`     | 超文本展示 | HTML 字符串 | 否                           |
| `hidden`   | 隐藏域     | 字符串      | 否                           |

## FieldInstance

七阶段生命周期的顺序固定：`init → data → deploy → done → echo → reset → clean`。前四步只执行一次，后三步每次调用都生效。

| 成员       | 类型                    | 说明                                          |
| ---------- | ----------------------- | --------------------------------------------- |
| `field`    | `FieldSchema`           | 字段声明                                      |
| `renderer` | `FieldRenderer`         | 命中的渲染器                                  |
| `elem`     | `Element \| undefined`  | 控件包装，未部署时为空                        |
| `stages`   | `readonly FieldStage[]` | 已执行阶段，按调用顺序记录                    |
| `init()`   | `FieldInstance`         | 初始化                                        |
| `data()`   | `FieldInstance`         | 整理候选数据                                  |
| `deploy()` | `FieldInstance`         | 部署控件，重复调用复用已有结果                |
| `done()`   | `FieldInstance`         | 入文档后的增强                                |
| `echo()`   | `EchoResult`            | 读取取值并按规则校验                          |
| `read()`   | `unknown`               | 读取取值，不做校验                            |
| `reset()`  | `FieldInstance`         | 写回声明里的初始值                            |
| `clean()`  | `FieldInstance`         | 清空：布尔给 `false`，列表给 `[]`，其余给空串 |

```ts
interface EchoResult {
  /** 是否通过校验 */
  valid: boolean
  /** 字段取值 */
  value: unknown
  /** 首个问题，通过时为空 */
  issue?: ValidationIssue
}
```

`echo()` 只返回首个问题，并通过通知通道以气泡形态提示到字段旁。

## FormInstance

| 成员       | 类型                       | 说明                             |
| ---------- | -------------------------- | -------------------------------- |
| `schema`   | `FormSchema`               | 表单声明                         |
| `elem`     | `Element`                  | 表单包装                         |
| `fields`   | `readonly FieldInstance[]` | 字段实例，顺序同声明             |
| `echo()`   | `ValidationResult`         | 整表回显并校验，未通过项逐条提示 |
| `values()` | `RowData`                  | 取当前取值，不做校验             |
| `reset()`  | `FormInstance`             | 全部字段写回初始值               |
| `clean()`  | `FormInstance`             | 全部字段清空                     |

::: warning 字段名必须唯一
`createForm` 遇到重复 `name` 直接抛错，避免两个控件争抢同一个键。表单增强在整表入文档后统一执行，否则适配层拿不到完整结构。
:::

## 自定义渲染器

渲染器只需实现四个方法，`done` 可选。

```ts
import type { FieldRenderer } from 'moire'

// 同类型覆盖：把 input 换成取色控件
const colorRenderer: FieldRenderer = {
  kind: 'input',
  deploy: ({ field }) => {
    const input = document.createElement('input')
    input.type = 'color'
    input.dataset['moireField'] = field.name
    return input
  },
  read: (_build, elem) => (elem as HTMLInputElement).value,
  write: (_build, elem, value) => {
    ;(elem as HTMLInputElement).value = String(value ?? '')
  },
}

moire.fields.register(colorRenderer)
```

`deploy` 返回的是**控件根**，包装与标签由字段层生成；`done` 拿到的则是包含包装的元素，供适配层增强使用。

## 插件形态

单独创建字段能力时用 `createFields`，接内核时用 `createFieldsPlugin`；后者在 `setup` 阶段接管内核通知。两者都是源码内部的装配入口，默认实例已内置字段插件，包产物不再单独导出。

```ts
// 源码层装配
const fieldsPlugin = createFieldsPlugin({ ui })
kernel.use(fieldsPlugin).start()
```
