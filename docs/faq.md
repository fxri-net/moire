# 常见问题

## 页面加载后 `window.moire` 是 undefined

先确认引入的是 IIFE 产物 `moire.min.js`。ESM 产物 `moire.esm.js` 只导出实例，不写全局、不自动启动，用 `<script>` 标签直接引它不会得到 `window.moire`。

```html
<!-- 传统页面：加载即挂载并启动 -->
<script src="./moire/moire.min.js"></script>
```

现代构建里改用导入式写法：

```js
import { moire } from 'moire'

moire.start()
```

## `import { createKernel } from 'moire'` 报没有导出成员

包产物只导出装好的默认实例 `moire` 与类型，工厂函数（`createKernel`、`createFieldsPlugin`、`createToolsPlugin` 等）和枚举常量都不是包的运行期导出：

```js
import { moire } from 'moire'
import type { MoirePlugin } from 'moire'

const { FieldKind, ToolAction } = moire.enum
```

需要替换装配方式时，在源码层另建入口，出厂产物不受影响。

## 界面增强完全没生效

先看 `moire.ui.enabled`：

```js
console.log(moire.ui.enabled)
```

它为 `false` 说明没探测到 `layui.form.render`。常见原因：

- layui 没加载，或只加载了 `layui.js` 没加载 `form` 模块。
- 脚本顺序颠倒：`moire.min.js` 先于 layui 执行。适配走的是运行期探测，库必须在框架使用前就绪。
- 用的不是 layui 2.x。

缺库不会报错，所有增强方法都安全降级为空操作，所以只能靠 `enabled` 与 `moire.ui` 的返回值判断，不能靠「有没有抛错」判断。

## 日期、上传、富文本、多选控件退化成普通控件

这是缺库时的既定降级，不是故障：

| 字段            | 缺少依赖时的表现                                         |
| --------------- | -------------------------------------------------------- |
| 日期 / 日期区间 | 普通文本框，取值仍是文本                                 |
| 文件            | 只展示已选值；只有配置了 `option.uploadUrl` 才走上传增强 |
| 富文本          | 普通多行文本域                                           |
| 多选            | 原生多选，读取回退为选中项                               |

接入方式见 [layui 适配](./adapters/layui)。

## 校验失败但页面没有提示

字段校验的结果有两条出口：`form.echo()` 的返回值，以及一条 `Variant.Tips` 通知。默认实例的通知只分发给订阅者，不会自己弹窗。需要界面提示时自行订阅：

```js
moire.context.subscribe((notice) => {
  moire.ui.notice(notice.message, { variant: notice.variant, target: notice.target })
})
```

不想依赖界面库时，也可以只读 `echo()` 的 `issues` 自行渲染。

## 动态插入的控件没有界面增强

字段增强在整表入文档后统一执行一次；列表渲染结束后会补一次 `formRender`。之后再由业务动态插入的节点不在其中，需要手动补：

```js
moire.ui.formRender()
```

## 提示或弹层被其他元素盖住

`moire.ui.zIndex()` 取当前文档与父文档（iframe 场景）里最大的 `z-index`，再与 0 取大；同源父文档可读，跨域时读不到。自定义浮层时把 `z-index` 设为它的返回值即可。

## 请求返回 `ok: false`，但 HTTP 状态是 200

`ok` 看的是业务码，不是 HTTP 状态：响应体里的 `code` 优先，缺失时才用 HTTP 状态码，且只有 `200` 算成功。

```js
const result = await moire.http.request({ url: '/api/list' })
// { ok, code, message, data, raw }
```

- `message` 依次取响应体的 `msg`、`message`，失败且都没给时用内置文案。
- `data` 取响应体的 `data`，没有该字段时回退到整个响应体。
- 非 JSON 响应原样以文本返回，不会因为解析失败丢掉服务端提示。

## 请求网络失败为什么是抛异常

网络层失败（断网、跨域被拦、请求被中止）统一抛出带内置文案的 `Error`，同时触发客户端的 `error` 回调；业务失败则正常返回 `ok: false` 的结果。这样调用方用 `try/catch` 处理「请求没发出去」，用返回值处理「服务端说不行」，两类问题不混在一起。

## 删除、导出、导入点了没反应

这三个动作都要求显式给出地址，缺地址直接返回 `Failed`，不会静默跳过：

- 未给 `url`：返回 `Failed`，`message` 取自 `tool.*.missing` 词条。
- 删除时未选行：返回 `Skipped`，提示先选择数据。
- 用户在确认框里取消：返回 `Cancelled`。
- 导出条数超过阈值（缺省 10 万条）时先弹确认。

结果里带 `outcome`，按它分支处理即可，不要只看有没有报错。

## 切换语言后自定义词条没变

`setLocale` 会把 `zh*` 归一为 `zh-cn`、`en*` 归一为 `en-us`，其余语言标识原样保留；而 `extend` 与构造选项 `extra` 的语言键**不做归一**。用 `extend('zh-CN', { ... })` 追加的词条落在 `zh-CN` 桶里，切到归一后的 `zh-cn` 自然取不到。追加时直接写目标语言：

```js
moire.i18n.extend('zh-cn', { 'form.saved': '已保存' })
```

## `dispose()` 之后还能重新启动吗

可以。`dispose` 逆序调用已装配插件的 `dispose`，清空装配记录并把启动标记复位；插件本身仍留在注册表里，再次 `start()` 会重新装配。单个插件卸载抛错同样只发通知，不影响其余插件。

## 构建时提示 Node 版本不满足

构建链依赖 Vite 7，要求 Node.js >= 20.19.0。运行产物本身没有这个限制，只影响本地构建与文档站。

## 为什么仓库里没有 `dist`

`dist` 是构建输出，不入主分支。正式产物推到 `dist` 孤儿分支，按 `vX.Y.Z` 标签交付，`manifest.json` 登记每个文件的字节数与 sha256。接入与校验方式见[分发与接入](./distribution)，维护者出包见[发版流程](./release)。

## 类型提示找不到

类型入口在 `dist/types/entries/esm.d.ts`，随产物一起分发。按[分发与接入](./distribution)把整个产物目录放好后，`import type { FormSchema } from 'moire'` 即可获得提示；只拷贝了两个 `.js` 文件时，类型声明自然缺失。
