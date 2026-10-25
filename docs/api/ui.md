# 界面适配

界面适配是框架唯一触碰第三方界面库的地方。契约只声明能力与选项，不引用任何第三方类型，因此内核、字段、视图、工具都不需要知道 layui、jQuery、layx 的存在。

```js
moire.ui.enabled // 是否探测到 layui

moire.ui.notice('已保存')
moire.ui.notice('账号不能为空', { variant: moire.enum.Variant.Tips, target: input })
moire.ui.zIndex() // 当前页面可用的最高层级
```

## 探测来源

`createUi(source)` 从全局对象按名探测九个来源，缺一个就少一项能力，不影响其余能力。

| 全局                | 提供的能力                                  |
| ------------------- | ------------------------------------------- |
| `layui.laydate`     | `dateRender`                                |
| `layui.form`        | `formRender`、`enabled`                     |
| `layui.layer`       | `notice` 的提示与气泡                       |
| `layui.formSelects` | `selectsAct`、`selectsRead`、`selectsWrite` |
| `layui.upload`      | `fileRender`                                |
| `layx`              | `notice` 的窗口库降级                       |
| `jQuery` / `$`      | `notice` 的 toast 降级                      |
| `tinymce`           | `richRender`、`richRead`、`richWrite`       |
| `Sortable`          | `sortRender`                                |

`enabled` 的判定标准是 `layui.form.render` 存在，即只装了 laydate 或 layer 的页面依然算未启用 layui 表单能力。

## 成员

| 成员           | 签名                                               | 说明                         |
| -------------- | -------------------------------------------------- | ---------------------------- |
| `enabled`      | `readonly boolean`                                 | 是否探测到 layui 表单能力    |
| `dateRender`   | `(elem, option?: DateOption) => void`              | 渲染日期控件                 |
| `fileRender`   | `(elem, option: UploadOption) => void`             | 渲染上传控件                 |
| `formRender`   | `() => void`                                       | 重渲染全量表单控件           |
| `notice`       | `(text, option?: NoticeOption) => void`            | 弹出提示，按可用能力依次降级 |
| `richRead`     | `(id: string) => string \| undefined`              | 读取富文本内容               |
| `richRender`   | `(elem, option?: RichOption) => void`              | 渲染富文本                   |
| `richWrite`    | `(id: string, value: string) => void`              | 写入富文本内容               |
| `selectsAct`   | `(name, actions: readonly SelectAction[]) => void` | 为多选组件挂载批量动作       |
| `selectsRead`  | `(name: string) => string[]`                       | 读取多选组件取值             |
| `selectsWrite` | `(name, values: readonly string[]) => void`        | 写入多选组件取值             |
| `sortRender`   | `(scope, option?: SortableOption) => void`         | 渲染拖拽排序                 |
| `zIndex`       | `() => number`                                     | 取可用层叠层级               |

## 选项

### NoticeOption

| 字段       | 类型      | 缺省     | 说明                                                 |
| ---------- | --------- | -------- | ---------------------------------------------------- |
| `variant`  | `Variant` | `notice` | `notice` 居中文案、`tips` 附着气泡、`toast` 角落堆叠 |
| `target`   | `Element` | —        | 附着元素，气泡变体必填                               |
| `duration` | `number`  | `2000`   | 停留毫秒，`0` 表示不自动消退                         |

### DateOption

| 字段     | 类型                             | 说明                                  |
| -------- | -------------------------------- | ------------------------------------- |
| `type`   | `'date' \| 'datetime' \| 'time'` | 控件形态                              |
| `format` | `string`                         | 取值格式，沿用 laydate 的 format 记号 |
| `range`  | `boolean`                        | 是否区间选择                          |

### UploadOption

| 字段       | 类型                           | 说明                                       |
| ---------- | ------------------------------ | ------------------------------------------ |
| `url`      | `string`                       | 接收地址，必填                             |
| `accept`   | `string`                       | 接收的文件类型                             |
| `multiple` | `boolean`                      | 是否允许一次选多个                         |
| `done`     | `(response, filename) => void` | 上传成功回调，参数为服务端响应与文件原始名 |

### RichOption

| 字段     | 类型     | 说明       |
| -------- | -------- | ---------- |
| `height` | `number` | 编辑区高度 |
| `lang`   | `string` | 界面语言   |

### SortableOption

| 字段        | 类型     | 说明             |
| ----------- | -------- | ---------------- |
| `animation` | `number` | 拖拽动画毫秒     |
| `filter`    | `string` | 可拖拽元素选择器 |

## 提示降级

`notice` 按可用能力从上到下尝试，命中即止，全部缺失时退化为 `console.warn`。

1. `variant` 为 `tips` 且给了 `target`，走 `layer.tips`；
2. `layer.msg`，按 `duration` 自动消退；
3. `jQuery.toast`，右上角堆叠最多 3 条；
4. `layx.msg`；
5. `console.warn`。

## 安全降级

::: warning 缺库不报错
所有方法在缺少对应库时静默返回，不抛异常。它们返回 `void` 或空值，因此调用方无法用返回值判断能力是否生效；需要区分时先读 `enabled`，或直接探测具体库。
:::

只有 `sortRender` 会检查 `Sortable` 是否为构造函数，其余能力缺失时连参数组装都不会发生。`notice` 之外的方法都不做文案降级——缺少界面库时控件不会被增强，字段层仍渲染原生控件，业务逻辑照常运行。

## 层级

`zIndex()` 取当前文档与父文档（iframe 场景）中出现过的最大 `z-index`，再与 `0` 取较大值，供弹层、下拉等自建浮层避让。它只读样式，不修改任何元素。
