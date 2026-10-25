# layui 适配

适配层是框架与第三方界面库之间唯一的接缝。字段、视图、工具都只依赖 [`UiAdapter`](../api/ui) 契约，不认识 layui；换掉界面库只需重写这一层，业务代码与 schema 不用动。

## 接入前提

适配按全局名探测，不依赖模块系统，因此 layui 等库用 `<script>` 引入即可，无需改造打包方式。

| 能力   | 需要的全局          | 说明                                           |
| ------ | ------------------- | ---------------------------------------------- |
| 日期   | `layui.laydate`     | layui 内置模块                                 |
| 表单   | `layui.form`        | 决定 `enabled` 的判定                          |
| 提示   | `layui.layer`       | 内置模块                                       |
| 上传   | `layui.upload`      | 内置模块                                       |
| 多选   | `layui.formSelects` | 需额外引入 formSelects 扩展，非 layui 核心模块 |
| 富文本 | `tinymce`           | 独立库                                         |
| 拖拽   | `Sortable`          | 独立库                                         |
| 通知   | `jQuery` / `$`      | 仅用于 `toast` 降级的最后一级                  |
| 窗口   | `layx`              | 可选，`layer` 缺失时兜底                       |

```html
<script src="/vendor/layui/layui.js"></script>
<script src="/vendor/formSelects/formSelects-v4.js"></script>
<script src="/vendor/tinymce/tinymce.min.js"></script>
<script src="/vendor/Sortable.min.js"></script>
```

::: tip 判断是否生效
`moire.ui.enabled` 为真表示 `layui.form.render` 可用。只引了 laydate 或 layer 的页面依然算未启用，此时字段层输出原生控件，业务逻辑照常运行。
:::

## 字段与能力对应

16 种内置字段里只有 4 种会用到界面库，其余都是原生控件，不引入任何库也能工作。

| 字段类型   | 用到的能力                                    | 缺库时的形态                                      |
| ---------- | --------------------------------------------- | ------------------------------------------------- |
| `date`     | `dateRender`                                  | 原生文本框，手工输入日期                          |
| `dateText` | `dateRender`（区间）                          | 原生文本框，手工输入起止                          |
| `file`     | `fileRender`                                  | 按钮只展示已选值；配置了 `uploadUrl` 才有上传行为 |
| `richText` | `richRender` / `richRead` / `richWrite`       | 退化为多行文本框                                  |
| `selects`  | `selectsAct` / `selectsRead` / `selectsWrite` | 退化为原生多选下拉，批量按钮不出现                |
| 其余 11 种 | 无                                            | 始终为原生控件                                    |

`selects` 的读写会优先取适配层的值；适配层返回空数组时回退读原生 `select` 的选中项，因此缺库与增强失败都不会丢值。

::: warning `file` 只在配置了 `uploadUrl` 时增强
没有接收地址时，字段只渲染按钮与文件名占位，点击不会上传。这是有意的：`file` 既可以当上传控件，也可以当只读的附件展示位。
:::

## 由业务主动调用的能力

`formRender`、`sortRender`、`zIndex` 不在框架的默认流程里，供业务按需调用。

| 能力         | 典型场景                                        |
| ------------ | ----------------------------------------------- |
| `formRender` | 动态插入或替换控件后，让 layui 重新接管全量表单 |
| `sortRender` | 列表或自定义容器的拖拽排序                      |
| `zIndex`     | 自建下拉、浮层避让现有弹层的层级                |

```js
// 动态追加一段表单后重新渲染
moire.ui.formRender()

// 让容器可拖拽排序
moire.ui.sortRender(document.querySelector('#steps'), { animation: 150, filter: '.moire-step' })

// 自建浮层的起始层级
const z = moire.ui.zIndex() + 1
```

字段增强只作用于自身控件，不会替你重渲染整张表单；同一个容器里混入手工编写的 layui 控件时，插入后自行调一次 `formRender`。

## 提示的降级链

`notice` 每次调用都重新判断可用能力，不缓存探测结果，因此后加载的库在下一次提示时就能生效。降级顺序见[界面适配](../api/ui#提示降级)。

```js
// 表单校验常用：附着在字段旁的气泡
moire.ui.notice('账号不能为空', {
  variant: moire.enum.Variant.Tips,
  target: document.querySelector('[data-moire-field="account"]'),
})
```

`Variant.Tips` 未给 `target` 时会自动落到居中提示，不会抛错。

## 替换界面库

新适配器只需实现 `UiAdapter` 的 13 个成员，再把实例交给字段、视图、工具插件即可。契约不引用第三方类型，因此适配器内部怎么写都行。

```ts
import type { UiAdapter } from 'moire'

const silentUi: UiAdapter = {
  enabled: false,
  dateRender() {},
  fileRender() {},
  formRender() {},
  notice(text) {
    console.info(text)
  },
  richRead: () => undefined,
  richRender() {},
  richWrite() {},
  selectsAct() {},
  selectsRead: () => [],
  selectsWrite() {},
  sortRender() {},
  // 无界面库时从 0 起算
  zIndex: () => 0,
}
```

包产物只导出装配好的 `moire`，替换适配器需要在源码层另建入口（`createFieldsPlugin`、`createToolsPlugin` 都接受 `ui`）。

## 版本与范围

适配层只覆盖 layui 2.x 的 `laydate`、`form`、`layer`、`upload` 与 formSelects 扩展，不处理 layui 的表格、导航等组件——表格由[视图能力](../api/views)自绘，不依赖 layui table。
