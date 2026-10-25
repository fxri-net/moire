# 工具能力

工具能力把六种后台常见操作收敛到一个入口，统一返回结构化结果。调用方判断 `outcome`，不用猜 `false` 到底表示失败、取消还是没选中。

```js
const { tools, enum: enums } = window.moire

const result = await tools.run({
  action: enums.ToolAction.Delete,
  url: '/api/users/delete',
  key: 'id',
  rows: [{ id: 1 }, { id: 2 }],
})

if (result.outcome === enums.ToolOutcome.Done) refresh()
```

## Tools

| 成员  | 签名                                            | 说明               |
| ----- | ----------------------------------------------- | ------------------ |
| `run` | `(request: ToolRequest) => Promise<ToolResult>` | 按请求执行工具操作 |

## ToolRequest

| 字段      | 类型                 | 适用动作                     | 说明                         |
| --------- | -------------------- | ---------------------------- | ---------------------------- |
| `action`  | `ToolAction`         | 全部                         | 操作类型                     |
| `url`     | `string`             | 删除、导出、下载、导入、窗口 | 目标地址，空串与缺失同等对待 |
| `query`   | `Params`             | 导出                         | 并入导出地址的查询参数       |
| `rows`    | `readonly RowData[]` | 删除                         | 数据行，缺省从 `keys` 取     |
| `key`     | `string`             | 删除                         | 主键字段名，缺省 `id`        |
| `keys`    | `readonly string[]`  | 删除                         | 主键集合，优先于 `rows`      |
| `message` | `string`             | 消息                         | 消息文本                     |
| `variant` | `Variant`            | 消息                         | 消息形态                     |
| `limit`   | `number`             | 导出                         | 确认阈值，缺省 `100000`      |
| `total`   | `number`             | 导出                         | 总条数，超过阈值时先确认     |

## ToolResult

| 字段      | 类型          | 说明                                        |
| --------- | ------------- | ------------------------------------------- |
| `outcome` | `ToolOutcome` | `done` / `failed` / `cancelled` / `skipped` |
| `message` | `string`      | 业务消息，失败与完成时给出                  |
| `data`    | `unknown`     | 业务数据，删除成功时为响应数据              |

## 各动作的行为

| 动作       | 前置校验                         | 执行                                           | 结果                                        |
| ---------- | -------------------------------- | ---------------------------------------------- | ------------------------------------------- |
| `delete`   | 地址必填；主键集合非空；用户确认 | `POST` 提交 `{ data: { [key]: keys } }`        | 成功通知并调用 `reload`；失败给出服务端消息 |
| `export`   | 地址必填；超过阈值先确认         | 拼装 `{ ...query, page: 1, limit: -1 }` 后打开 | 直接标记完成，实际下载由浏览器接管          |
| `download` | 地址必填                         | 打开地址                                       | 完成                                        |
| `import`   | 地址必填                         | 打开地址                                       | 完成                                        |
| `window`   | 地址必填                         | 打开地址                                       | 完成                                        |
| `message`  | 消息非空                         | 走通知通道                                     | 空消息直接 `skipped`                        |

::: warning 删除后的刷新需要显式注入
默认实例没有注入 `reload`，删除成功后列表不会自动刷新。需要框架回调时，自建插件把刷新函数传进 `createToolsPlugin`。
:::

## 上下文注入

`createToolsPlugin` 接受 `ToolContext`，缺省实现均可替换。它属源码内部的装配入口，默认实例已内置工具插件，包产物不再单独导出。

| 字段        | 类型                                          | 缺省             | 说明                 |
| ----------- | --------------------------------------------- | ---------------- | -------------------- |
| `request`   | `(input: HttpRequest) => Promise<HttpResult>` | 必填             | 发起请求             |
| `ui`        | `UiAdapter`                                   | —                | 消息降级呈现         |
| `translate` | `Translate`                                   | 内置实例         | 取词条               |
| `notify`    | `Notify`                                      | 转交界面适配     | 发出通知             |
| `confirm`   | `(message: string) => boolean`                | `window.confirm` | 请求确认             |
| `open`      | `(url: string) => void`                       | `window.open`    | 打开地址             |
| `reload`    | `() => void`                                  | 无               | 删除成功后的刷新回调 |

```ts
// 源码层装配
const toolsPlugin = createToolsPlugin({
  ui,
  notify: context.notify,
  request: (input) => http.request(input),
  reload: () => {
    const assembly = moire.views.list.assemble(schema, { page })
    moire.views.list.render(assembly, target)
  },
})
kernel.use(toolsPlugin)
```

::: tip 与其他能力的关系
`Tools` 只依赖 `request`，不依赖字段与视图。删除操作以主键集合为准，行数据只是主键的载体，因此完全可以脱离表格单独使用。
:::
