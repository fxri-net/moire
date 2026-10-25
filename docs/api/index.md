# API 总览

框架对外只有一个实例 `moire`：IIFE 产物把它挂到 `window.moire` 并自动启动，ESM 产物只导出实例与类型，由接入方自行决定挂载与启动时机。

```js
// IIFE：脚本加载后即可用
const { fields, tools, enum: enums } = window.moire
```

```ts
// ESM：显式启动
import { moire } from 'moire'

moire.start()
```

## 实例成员

| 成员          | 类型                             | 说明                                                |
| ------------- | -------------------------------- | --------------------------------------------------- |
| `version`     | `string`                         | 框架版本                                            |
| `context`     | `MoireContext`                   | 插件上下文：`version`、`notify`、`subscribe`、`get` |
| `enum`        | `typeof enums`                   | 19 组具名枚举，见[枚举字典](../enums)               |
| `utils`       | `typeof utils`                   | 判定、对象、文本、时间、地址、DOM、文件工具         |
| `i18n`        | `I18n`                           | 词条取值、片段组合与语言切换                        |
| `http`        | `HttpClient`                     | 基于 `fetch` 的请求客户端                           |
| `ui`          | `UiAdapter`                      | 界面适配，未接入界面库时安全降级                    |
| `fields`      | `Fields`                         | 字段渲染器注册与表单实例创建                        |
| `views`       | `Views`                          | 列表与表单的装配器                                  |
| `tools`       | `Tools`                          | 删除、导出、下载、导入、消息、窗口                  |
| `use(plugin)` | `(plugin: MoirePlugin) => Moire` | 注册插件；启动后注册会立即装配                      |
| `start()`     | `() => Moire`                    | 按依赖顺序装配全部插件，重复调用无副作用            |
| `dispose()`   | `() => void`                     | 逆序卸载已装配插件                                  |

## 命名空间对照

| 命名空间 | 职责                                    | 参考页               |
| -------- | --------------------------------------- | -------------------- |
| 内核     | 插件注册、拓扑装配、通知分发、逆序卸载  | [内核](./kernel)     |
| 工具函数 | 类型判定、深层覆盖、查询串、时间与 DOM  | [工具函数](./utils)  |
| 声明     | 表单与列表的统一 schema、校验规则       | [声明契约](./schema) |
| 字段     | 16 种内置控件、七阶段生命周期、校验回显 | [字段能力](./fields) |
| 视图     | 列表/表单的纯装配与薄渲染               | [视图能力](./views)  |
| 工具     | 结构化结果的批量操作                    | [工具能力](./tools)  |
| 请求     | 查询串拼接、JSON 提交、业务码归一       | [请求客户端](./http) |
| 国际化   | 键化文案、具名插值、语言收敛            | [国际化](./i18n)     |
| 界面适配 | 唯一触碰第三方界面库的边界              | [界面适配](./ui)     |

## 插件形态

任何能力都以插件形式接入内核，插件只需实现 `name` 与 `setup`。

```ts
import type { MoirePlugin } from 'moire'

export const auditPlugin: MoirePlugin = {
  name: 'audit',
  // 依赖的插件会先装配
  depends: ['tools'],
  setup(context) {
    context.subscribe((notice) => {
      // 统一收集框架发出的通知
      console.info('[audit]', notice.message)
    })
  },
  dispose() {
    // 逆序卸载时调用
  },
}
```

```ts
moire.use(auditPlugin).start()
```

::: tip 装配失败不会中断启动
单个插件的 `setup` 抛错只产生一条通知，其余插件继续装配。需要严格失败时，在业务侧自行校验前置条件。
:::
