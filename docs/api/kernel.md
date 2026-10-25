# 内核

内核只做四件事：注册插件、按依赖排序、装配、逆序卸载。它不持有业务状态，也不认识任何界面库。

```ts
// 源码层装配：包产物只导出装配好的 moire，不单独导出工厂
const kernel = createKernel({ version: '1.0.0' })
kernel.use(pluginA).use(pluginB).start()
```

框架实例 `moire` 本身就是一个已注册三个内置插件的内核，通常直接使用实例即可，只有需要隔离装配时才单独创建内核。

## createKernel

| 参数      | 类型     | 缺省           | 说明                               |
| --------- | -------- | -------------- | ---------------------------------- |
| `version` | `string` | `'0.0.0'`      | 框架版本，透传到 `context.version` |
| `notify`  | `Notify` | 仅分发给订阅者 | 通知实现，可替换为全局消息渠道     |

返回 `Kernel`。

## Kernel

| 成员      | 签名                              | 说明                             |
| --------- | --------------------------------- | -------------------------------- |
| `version` | `string`                          | 创建时传入的版本                 |
| `context` | `MoireContext`                    | 传给每个插件的上下文             |
| `use`     | `(plugin: MoirePlugin) => Kernel` | 注册插件；重名直接抛错           |
| `start`   | `() => Kernel`                    | 按依赖拓扑装配，重复调用直接返回 |
| `dispose` | `() => void`                      | 逆序卸载，可重新 `start`         |

`use` 在 `start` 之前只做登记；`start` 之后再 `use` 会立即校验依赖并装配，便于运行期按需接入插件。

::: warning 依赖缺失会在启动后注册时抛错
启动后新增插件无法重排既有顺序，若 `depends` 中的插件尚未装配，`use` 直接抛错而不是静默失效。启动前的依赖缺失与成环由排序阶段统一拦截。
:::

## MoireContext

| 成员        | 类型                                         | 说明                   |
| ----------- | -------------------------------------------- | ---------------------- |
| `version`   | `string`                                     | 框架版本               |
| `notify`    | `(notice: Notice) => void`                   | 发出通知               |
| `subscribe` | `(listener: NoticeListener) => () => void`   | 订阅通知，返回退订函数 |
| `get`       | `(name: string) => MoirePlugin \| undefined` | 取已注册插件实例       |

```ts
const stop = moire.context.subscribe(({ message, variant }) => {
  channel.push({ message, variant })
})

// 不再需要时退订，避免监听堆积
stop()
```

## Notice

| 字段      | 类型      | 说明                     |
| --------- | --------- | ------------------------ |
| `message` | `string`  | 消息文本                 |
| `variant` | `Variant` | 呈现形态，缺省按提示处理 |
| `target`  | `Element` | 关联元素，气泡形态使用   |

## MoirePlugin

| 字段      | 类型                              | 必填 | 说明             |
| --------- | --------------------------------- | ---- | ---------------- |
| `name`    | `string`                          | 是   | 插件名，全局唯一 |
| `version` | `string`                          | 否   | 插件版本         |
| `depends` | `readonly string[]`               | 否   | 依赖的插件名     |
| `setup`   | `(context: MoireContext) => void` | 是   | 装配             |
| `dispose` | `() => void`                      | 否   | 卸载             |

排序规则：依赖先于被依赖者装配；同层保持注册顺序；缺依赖或成环在装配前拦截。

## 内置插件

| 插件     | 依赖     | 暴露能力       |
| -------- | -------- | -------------- |
| `fields` | 无       | `moire.fields` |
| `views`  | `fields` | `moire.views`  |
| `tools`  | 无       | `moire.tools`  |

`views` 依赖 `fields`，是因为表单渲染直接复用字段层的表单实例；工具能力按请求即时执行，装配阶段不持有状态，因此不声明依赖。
