# 工具函数

`moire.utils` 汇总七组无状态工具，全部为纯函数（DOM 与时间默认值除外），不依赖内核实例。

```js
const { utils, enum: enums } = window.moire

utils.isNumeric('1.0') // true
utils.timeFormat(0) // '1970-01-01 08:00:00'
utils.url({ mode: enums.UrlMode.Append, url: '/list', param: { page: 1 } }) // '/list?page=1'
```

## 类型判定

| 函数                | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| `isAorO(data)`      | 数组或普通对象                                               |
| `isArray(data)`     | 数组                                                         |
| `isBlank(data)`     | 仅 `null`、`undefined`、空串为真，`0` 与 `false` 不算        |
| `isElement(data)`   | 元素，`window` 与 `document` 一并计入                        |
| `isEmpty(data)`     | 旧口径：假值、空串、空数组、空对象；纯数字字符串按数值零判断 |
| `isEmail(data)`     | 邮箱格式                                                     |
| `isFunction(data)`  | 函数                                                         |
| `isJson(data)`      | 可解析为对象或数组的字符串（`'123'` 不算）                   |
| `isMobile(data)`    | 大陆手机号                                                   |
| `isMoney(data)`     | 金额，最多两位小数，不接受负号与千分位                       |
| `isNull(data)`      | `null`                                                       |
| `isNumeric(data)`   | 数字或可无损转换的数字字符串（`'1.0'` 算，`'1a'` 不算）      |
| `isObject(data)`    | 普通对象，排除数组、`Date`、类实例                           |
| `isSet(data)`       | 非 `null` 且非 `undefined`，与 `isBlank` 互补                |
| `isString(data)`    | 字符串                                                       |
| `isUndefined(data)` | `undefined`                                                  |

## 对象

### cover

深层覆盖，来源值优先；双方都是容器且未到深度上限时继续下钻。

```js
cover({ a: 1, nested: { x: 1 } }, { a: 2, nested: { y: 2 } })
// { a: 2, nested: { x: 1, y: 2 } }
```

| 参数     | 类型      | 缺省 | 说明                               |
| -------- | --------- | ---- | ---------------------------------- |
| `target` | `unknown` | —    | 目标值，容器时原地写入             |
| `source` | `unknown` | —    | 来源值                             |
| `limit`  | `number`  | `-1` | 下钻深度，负数不限，`0` 只合当前层 |

### fieldRead / fieldWrite

按路径读写嵌套字段，路径分隔符缺省为 `-_`（连字符与下划线都可作层级）。

```js
fieldRead({ a: { b: 1 } }, 'a-b') // 1
fieldRead({ a: { b: 1 } }, 'a.c') // ''
fieldWrite('a-b', 1) // { a: { b: 1 } }
```

`fieldRead` 任一级缺失或为空串即返回空串，调用方无需逐级判空。

### mergeAll

从右向左归并，首个数值入参视为下钻深度。

```js
mergeAll({ a: 1 }, { a: 2 }, { b: 3 }) // { a: 2, b: 3 }
mergeAll(1, { a: 1, n: { x: 1 } }, { n: { y: 2 } }) // 只合到第一层
```

### mergeParams

参数合并的正交入口：方向、缺失兜底、空串归属、归一四个维度自由组合，取代旧版的组合式模式码。

| 选项        | 类型             | 缺省     | 说明             |
| ----------- | ---------------- | -------- | ---------------- |
| `mutate`    | `boolean`        | `true`   | 原地写入目标对象 |
| `direction` | `MergeDirection` | `fill`   | 合并方向         |
| `missing`   | `MergeMissing`   | `ignore` | 缺失兜底         |
| `blankAs`   | `MergeBlankAs`   | `value`  | 空串归属         |
| `normalize` | `MergeNormalize` | `none`   | 合并后归一       |
| `separator` | `string`         | `','`    | 列表归一的分隔符 |

```js
// 融合：旧值优先，缺失取新值
mergeParams({ a: 1 }, { a: 2, b: 3 }) // { a: 1, b: 3 }

// 覆盖 + 缺失置空 + 空串视为缺失
mergeParams({ a: '' }, { a: 'x' }, { direction: 'cover', missing: 'null', blankAs: 'missing' })

// 赋空：来源作为键名清单，命中即按 missing 兜底
mergeParams({ a: 1, b: 2 }, ['a'], { direction: 'blank', missing: 'null' }) // { a: null, b: 2 }
```

::: tip 归一与兜底的联动
`missing: 'empty'` 写入的空容器形态跟随 `normalize`：`list` 归一给空数组，其余给空对象。`missing: 'null'` 同样会走归一，使 JSON 字段保持数组形态。
:::

## 文本

### explode / implode

```js
explode('?', '/a?b=1', { limit: 2 }) // ['/a', 'b=1']
explode('[\\-_]', 'a-b_c', { regular: true }) // ['a', 'b', 'c']
implode('-', ['a', 'b']) // 'a-b'
implode(',', { x: 1, y: 2 }) // '1,2'
```

| 选项      | 类型      | 缺省    | 说明                                   |
| --------- | --------- | ------- | -------------------------------------- |
| `limit`   | `number`  | 不限    | 正数从头保留、负数从尾保留、`0` 不拆分 |
| `regular` | `boolean` | `false` | 分隔符按正则解释                       |

数组与对象入参按元素转换，不会把容器当成字符串拆开。

### json

```js
json('[1,2]', enums.JsonOp.Decode) // [1, 2]
json({ a: 1 }, enums.JsonOp.Decode) // [1]（对象按值归一）
json('a=1&b[]=2', enums.JsonOp.Decode) // 走查询串解码
json({ a: 1 }, enums.JsonOp.Encode) // '{"a":1}'
```

解码时已是 JSON 字符串则解析，普通字符串按查询串解码，标量包成单元素数组，空值给空数组。

### replace

```js
replace('^a', 'b', 'abc') // 'bbc'，统一按全局匹配
```

### strDecode / strEncode

查询串与参数对象互转，支持 `a[b][]=1` 的多级结构。

```js
strDecode('a=1&b[]=2&c[d]=3') // { a: '1', b: ['2'], c: { d: '3' } }
strEncode({ a: 1, b: ['2'], c: { d: 3 } }) // 'a=1&b[]=2&c[d]=3'
```

编码结果不含前导 `?`；解码时非法百分号编码按原文保留，不中断整条查询串。

### strPad

| 选项   | 类型      | 缺省    | 说明                                       |
| ------ | --------- | ------- | ------------------------------------------ |
| `side` | `PadSide` | `right` | `left` 右补、`right` 左补、`both` 先左后右 |
| `with` | `string`  | `' '`   | 填充字符                                   |

```js
strPad(7, 3, { with: '0' }) // '007'
strPad('ab', 6, { with: '.', side: 'left' }) // 'ab....'
```

### unique

```js
unique([1, '1', 1]) // [1, '1']，严格相等去重并保留首次出现顺序
```

## 时间

### timeFormat

按本地时区输出，不做固定时区偏移。

| 参数                  | 类型      | 缺省     | 说明                        |
| --------------------- | --------- | -------- | --------------------------- |
| `value`               | `unknown` | 当前时间 | 时间戳、日期字符串或 `Date` |
| `options.millisecond` | `boolean` | `false`  | 是否保留毫秒                |

```js
timeFormat(0) // '1970-01-01 08:00:00'（东八区）
timeFormat(Date.now(), { millisecond: true }) // '2026-10-25 09:30:00.123'
timeFormat('bad') // ''
```

### timeSpan

由入参单位向上逐级取整，零值项不展示，单位名随语言变化。

| 参数           | 类型       | 缺省     | 说明                     |
| -------------- | ---------- | -------- | ------------------------ |
| `value`        | `unknown`  | —        | 时长数值，非数值返回空串 |
| `options.from` | `TimeUnit` | `second` | 入参单位                 |

```js
timeSpan(3725) // '1时2分5秒'
timeSpan(90, { from: enums.TimeUnit.Minute }) // '1时30分'
timeSpan(0) // ''
```

月按 30 天、年按 12 月折算；负时长先取绝对值，最后统一加负号。

### timeValue

```js
timeValue(1729756800) // 1729756800000，十位及以内视为秒级
timeValue('2026-10-25') // 该日零点的时间戳
timeValue() // Date.now()
```

无法解析时返回 `NaN`。

## 地址

### url

| 选项     | 类型               | 缺省     | 说明                      |
| -------- | ------------------ | -------- | ------------------------- |
| `mode`   | `UrlMode`          | `read`   | 组装、追加或读取          |
| `url`    | `string`           | 当前页面 | 目标地址                  |
| `name`   | `string`           | —        | 读取模式下只返回该参数值  |
| `param`  | `object \| string` | `{}`     | 待合并参数，可为查询串    |
| `window` | `Window`           | 当前窗口 | 取址窗口，iframe 场景使用 |

```js
// 组装：显式参数优先于当前地址已有参数，返回相对地址
url({ mode: enums.UrlMode.Build, param: { page: 2 } })

// 追加：在指定地址上并入参数，返回完整地址
url({ mode: enums.UrlMode.Append, url: '/list', param: { page: 1, limit: -1 } })

// 读取：返回参数对象，给了 name 则只返回该值
url({ mode: enums.UrlMode.Read, url: '/list?page=2' }) // { page: '2' }
url({ mode: enums.UrlMode.Read, url: '/list?page=2', name: 'page' }) // '2'
```

## 元素

### css

样式名兼容小驼峰与短横线写法，自定义属性（`--x`）原样保留。

```js
css(elem, 'fontSize', '14px')
css(elem, { color: 'red', fontSize: '14px' })
css(elem, 'font-size') // 读取计算样式
```

### maxZIndex

探测当前文档与同源宿主文档的最大层叠层级，跨域父窗口自动跳过，无有效值时为零。弹出层需要压过宿主页面时使用。

## 文件

### classMethod

值为空的键名视为方法名，其余键值对视为参数。

```js
classMethod({ id: 1, save: null }) // { param: { id: 1 }, method: ['save'] }
```

### pathExt

```js
pathExt('a/b.min.js') // 'js'
pathExt('a/b') // ''
```
