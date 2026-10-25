# 从 0.4 升级到 1.0

1.0 是破坏性版本，迁移成本集中在四处：

- **产物收敛**：不再由入口脚本逐个 `document.write` 加载子文件，改为单个产物。
- **全局收敛**：`fxApp` / `fxBase` / `fxLocal` / `fxSession` / `fxView` 五个全局命名空间合并为 `window.moire`。
- **调用方式**：链式铺数据的部署器、按链条取值的访问器，改为 schema 声明加字段/视图实例。
- **编码改枚举**：`'1.1.2'`、`'1.2.4'` 这类数字模式码与 `fxy-type="1"` 这类数字属性，全部改为具名枚举成员。

::: tip 本页的枚举写法
下文出现的枚举成员（`MergeDirection`、`UrlMode`、`PadSide`、`SelectAction` 等）都取自 `moire.enum`，为聚焦对照关系省略了前缀。成员全表见[枚举字典](./enums)。
:::

## 产物与引用

产物形态与引入方式见[构建产物](./build)，此处只列与迁移直接相关的差异：

| 产物                   | 与 0.4 的差异                                            |
| ---------------------- | -------------------------------------------------------- |
| `dist/moire.min.js`    | 单个 IIFE 产物，加载即挂载 `window.moire` 并启动         |
| `dist/moire.esm.js`    | 新增 ESM 入口，不写全局、不自动启动                      |
| `dist/types/**/*.d.ts` | 新增类型声明                                             |
| `dist/manifest.json`   | 新增产物清单，登记版本、源码提交、构建时间与逐文件校验和 |

旧版入口脚本与 `moire.plugin.min.js` 一并退场，页面只需引一个运行时产物。

## 一、全局命名空间收敛

| 旧入口      | 新落点                                                                           |
| ----------- | -------------------------------------------------------------------------------- |
| `fxApp`     | `moire`（实例自身）、`moire.version`、`moire.context`                            |
| `fxBase`    | `moire.utils`、`moire.http`、`moire.i18n`                                        |
| `fxLocal`   | 不再内置，直接用 `localStorage`                                                  |
| `fxSession` | 不再内置，直接用 `sessionStorage`                                                |
| `fxView`    | `moire.fields`、`moire.views`、`moire.tools`、`moire.ui`、`moire.context.notify` |

`fxBase` 各子命名空间的落点：

| 旧命名空间      | 旧职责                       | 新落点                                                                         |
| --------------- | ---------------------------- | ------------------------------------------------------------------------------ |
| `fxBase.base`   | 模具、模板、语言、JSON、填充 | `moire.utils` 的 `explode` / `implode` / `json` / `strPad`，`moire.i18n`       |
| `fxBase.text`   | 字符串编解码、拆分、替换     | `moire.utils` 的 `strEncode` / `strDecode` / `explode` / `implode` / `replace` |
| `fxBase.param`  | 覆盖、合并、模式码、URL      | `moire.utils` 的 `mergeParams` / `mergeAll` / `cover` / `url`                  |
| `fxBase.data`   | 字段路径读写                 | `moire.utils` 的 `fieldRead` / `fieldWrite`                                    |
| `fxBase.dom`    | 样式、最大层级               | `moire.utils` 的 `css` / `maxZIndex`                                           |
| `fxBase.file`   | 后缀名、类方法梳理           | `moire.utils` 的 `pathExt` / `classMethod`                                     |
| `fxBase.math`   | 随机数                       | 无对应封装，直接用 `Math`                                                      |
| `fxBase.client` | IE 版本探测                  | 无对应封装，1.0 不支持 IE                                                      |

`fxLocal` / `fxSession` 旧实现就是 `localStorage` / `sessionStorage` 的 JSON 序列化薄封装，1.0 不再内置：

```js
// 旧
fxLocal.set('draft', { title: 'a' })
const draft = fxLocal.get('draft')

// 新
localStorage.setItem('draft', JSON.stringify({ title: 'a' }))
const draft = JSON.parse(localStorage.getItem('draft') ?? 'null')
```

## 二、部署器与访问器

旧 `fxView.machine.deployer` 沿链条把值铺进容器对象，无返回值；旧 `fxView.machine.caller` 沿链条逐级取值。二者都由字段路径工具直接替代，不再需要隐式的链条约定。

```js
// 旧：沿链条铺数据，逗号表示同级分支
fxView.machine.deployer(['base,data', 'field'], value)
// 旧：沿链条取值
fxView.machine.caller(['user', 'base', 'token'], null, fxApp)
```

```js
// 新：路径拼接显式可见，再用 mergeParams 合并
const patch = {}
for (const key of ['base', 'data']) {
  mergeParams(patch, fieldWrite(`${key}.field`, value, '.'))
}
mergeParams(target, patch)
// 新：路径分隔符按需指定，缺省为 -_
fieldRead(app, 'user.base.token', '.')
```

旧 `fxView` 下的 `material` / `mould` / `custom` / `deploy` / `shelf` / `store` / `cache` 是模具与部署的运行时容器，1.0 由声明式装配取代：

| 旧用法                                      | 新写法                                                         |
| ------------------------------------------- | -------------------------------------------------------------- |
| `fxView.custom[key] = fn` 注册自定义视图    | 注册字段渲染器 `moire.fields.register(renderer)`，或注册插件   |
| `fxView.material` / `mould` 取模板与模具    | `FormSchema` / `ListSchema` 描述结构，`moire.views` 装配与渲染 |
| `fxView.shelf` / `store` / `cache` 存运行态 | 业务侧自持状态，框架不再集中托管                               |

## 三、合并模式码

旧 `define(param, mode)` 用 13 个数字码表达「目标 / 来源 / 方向 / 空串 / 缺失 / 归一」的组合；1.0 拆成 `mergeParams(target, source, options)` 的五个正交选项：

| 选项        | 取值                                             |
| ----------- | ------------------------------------------------ |
| `mutate`    | `true`（缺省，原地写入）/ `false`（新建对象）    |
| `direction` | `MergeDirection.Fill`（缺省）/ `Cover` / `Blank` |
| `missing`   | `MergeMissing.Ignore`（缺省）/ `Null` / `Empty`  |
| `blankAs`   | `MergeBlankAs.Value`（缺省）/ `Missing`          |
| `normalize` | `MergeNormalize.None`（缺省）/ `Json` / `List`   |

逐行对照（`param` 为 `[目标, 来源]`）：

| 旧模式码 | 旧语义                             | 新写法                                                                                                                        |
| -------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `1.1.1`  | 覆盖-融合-值不存在                 | `mergeParams(target, source)`                                                                                                 |
| `1.1.2`  | 融合，空串一并视为缺失             | `mergeParams(target, source, { blankAs: MergeBlankAs.Missing })`                                                              |
| `1.1.3`  | 融合后对全部键做 JSON 解码         | `mergeParams(target, source, { normalize: MergeNormalize.Json })`                                                             |
| `1.2.1`  | 赋空，不存在置 `null`              | `mergeParams(target, keys, { direction: MergeDirection.Blank, missing: MergeMissing.Null })`                                  |
| `1.2.2`  | 赋空，不存在或空串置 `null`        | 上一行加 `{ blankAs: MergeBlankAs.Missing }`                                                                                  |
| `1.2.3`  | 赋空，不存在置 `null` 后 JSON 解码 | `mergeParams(target, keys, { direction: MergeDirection.Blank, missing: MergeMissing.Null, normalize: MergeNormalize.Json })`  |
| `1.2.4`  | 赋空，字符串拆数组                 | `mergeParams(target, keys, { direction: MergeDirection.Blank, missing: MergeMissing.Empty, normalize: MergeNormalize.List })` |
| `1.3.1`  | 倒融合，来源有值即覆盖             | `mergeParams(target, source, { direction: MergeDirection.Cover })`                                                            |
| `1.3.2`  | 倒融合，来源缺失或空串置 `null`    | `mergeParams(target, source, { direction: MergeDirection.Cover, missing: MergeMissing.Null, blankAs: MergeBlankAs.Missing })` |
| `2.1.1`  | 新建-融合                          | `mergeParams(target, source, { mutate: false })`                                                                              |
| `2.1.2`  | 新建-融合，空串视为缺失            | `mergeParams(target, source, { mutate: false, blankAs: MergeBlankAs.Missing })`                                               |
| `2.2.1`  | 新建-赋空，不存在置 `null`         | `mergeParams(target, keys, { mutate: false, direction: MergeDirection.Blank, missing: MergeMissing.Null })`                   |
| `2.2.2`  | 新建-赋空，不存在或空串置 `null`   | 上一行加 `{ blankAs: MergeBlankAs.Missing }`                                                                                  |

> ⚠️ `1.2.4` 有一处行为差异：旧实现把「缺失」与「既非字符串也非数组」的值都置为 `{}`，新实现统一给 `[]`。业务侧若依赖对象形态做 `in` 判断或 `Object.keys`，需要改为按数组处理。

> ⚠️ 旧 `1.2.x` / `2.2.x` 的「来源」是键名清单（数组，或对象时取其值），新写法里 `keys` 沿用同一约定，不需额外转换。

## 四、其余数字码

### 地址参数

旧 `fxBase.param.url` 的三个 `type` 对应 `moire.utils.url` 的 `UrlMode`：

| 旧 `type`   | 旧语义                                   | 新写法                                      |
| ----------- | ---------------------------------------- | ------------------------------------------- |
| `'1.1'`     | 先读当前页参数再组装，`url` 缺省当前路径 | `url({ mode: UrlMode.Build, url, param })`  |
| `'1.2'`     | 只并入给定参数，`url` 缺省当前路径       | `url({ mode: UrlMode.Append, url, param })` |
| `'2.1'`     | 读取当前地址参数，`name` 给定时返回单值  | `url({ mode: UrlMode.Read, url, name })`    |
| 未给 `type` | 返回 `undefined`                         | 缺省为 `UrlMode.Read`，返回参数对象         |

> ⚠️ 未给模式时旧实现返回 `undefined`，新实现按读取处理；原先依赖「无模式即空」的判断需要显式改写。

### 时长拆解

旧 `fxBase.base.ftime(value, type)`：

| 旧 `type` | 旧语义     | 新写法                                            |
| --------- | ---------- | ------------------------------------------------- |
| `'1.1'`   | 入参按秒   | `timeSpan(value)`                                 |
| `'1.2'`   | 入参按毫秒 | `timeSpan(value, { from: TimeUnit.Millisecond })` |

新实现由 `i18n` 提供单位名，不再拼 `sec` / `minute` 之类的固定英文。

### 字符串填充

旧 `fxBase.text.strPad(value, length, padString, padType)` 的 `padType` 对应 `PadSide`：

| 旧 `padType` | 旧语义 | 新写法                                           |
| ------------ | ------ | ------------------------------------------------ |
| `'0'`        | 补左侧 | `strPad(value, length, { side: PadSide.Right })` |
| `'1'`        | 补右侧 | `strPad(value, length, { side: PadSide.Left })`  |
| `'2'`        | 两侧   | `strPad(value, length, { side: PadSide.Both })`  |

> ⚠️ 默认值方向相反：旧实现缺省 `'1'`（补右侧），新实现缺省 `PadSide.Right`（补左侧，即数字补零对齐）。原先把 `padType` 省略的调用，需要显式传 `PadSide.Left` 才能保持补右侧。

### 批量选择

旧 `<a fxy-type="1|2|3">` 的三个数字码改为 `SelectAction`，并通过字段选项 `option.actions` 声明，由字段渲染器统一生成控件：

| 旧属性         | 新写法                        |
| -------------- | ----------------------------- |
| `fxy-type="1"` | `SelectAction.All`（全选）    |
| `fxy-type="2"` | `SelectAction.None`（清空）   |
| `fxy-type="3"` | `SelectAction.Invert`（反选） |

```js
// 旧：由页面拼 fxy-type 的锚点，框架监听点击
// 新：在字段声明里给出动作
{
  name: 'team',
  kind: moire.enum.FieldKind.Selects,
  option: { actions: [moire.enum.SelectAction.All, moire.enum.SelectAction.None, moire.enum.SelectAction.Invert] },
}
```

## 五、属性与前缀

| 旧属性 / 约定               | 旧语义                               | 新落点                                       |
| --------------------------- | ------------------------------------ | -------------------------------------------- |
| `fxy-type`                  | 批量选择动作码                       | `option.actions` + `SelectAction`            |
| `fxy-href`                  | 点击后 `location.replace` 到目标地址 | 业务侧自行事件委托，框架不再劫持链接         |
| `fxy-edit`                  | 表格单元格双击进入编辑的开关标记     | 框架不再内置单元格编辑，由渲染器或业务侧实现 |
| `moire-type` / `moire-cell` | 模板与模具的占位属性                 | `FormSchema` / `ListSchema` 声明             |

1.0 的 DOM 契约统一用 `data-moire-*` 前缀，可在适配层之外稳定依赖：

| 属性                    | 所在元素   | 含义           |
| ----------------------- | ---------- | -------------- |
| `data-moire-row`        | 行选择控件 | 该行的选择状态 |
| `data-moire-row-key`    | 行元素     | 行主键         |
| `data-moire-select-all` | 全选控件   | 整表全选       |

## 六、迁移检查清单

- [ ] 页面只引 `moire.min.js`，删除对旧子文件与 `moire.plugin.min.js` 的引用。
- [ ] 旧五个全局命名空间的引用全部改到 `window.moire` 下的对应能力。
- [ ] `define` 的 13 个模式码逐个替换为 `mergeParams` 选项，重点核对 `1.2.4` 的数组形态。
- [ ] `url` / `ftime` / `strPad` 的数字码逐个替换为 `UrlMode` / `TimeUnit` / `PadSide`，重点核对 `strPad` 的默认方向。
- [ ] 页面中 `fxy-*` 属性清理完毕；选择动作改走 `option.actions`。
- [ ] 旧 `deployer` / `caller` 的调用点改为 `fieldWrite` + `mergeParams` 与 `fieldRead`。
- [ ] 跑通 `pnpm verify` 与业务侧自身的用例。

示例工程与验收命令见[快速上手](./getting-started)。
