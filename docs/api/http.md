# 请求客户端

请求能力是 `fetch` 的薄封装：拼接查询串、按 JSON 提交、把业务码归一成统一结果。它不内置拦截器链，也不做重试。

```js
const result = await moire.http.request({
  url: '/api/users',
  query: { page: 1, limit: 20 },
})

result.ok // 业务码为 200 时为 true
result.data // 响应体的 data，没有则为原始响应
```

## HttpClient

| 成员      | 签名                                                  | 说明               |
| --------- | ----------------------------------------------------- | ------------------ |
| `request` | `<T>(request: HttpRequest) => Promise<HttpResult<T>>` | 发送请求并归一结果 |

## HttpRequest

| 字段      | 类型                     | 缺省  | 说明                                |
| --------- | ------------------------ | ----- | ----------------------------------- |
| `url`     | `string`                 | —     | 请求地址，可相对 `baseUrl`          |
| `method`  | `HttpMethod`             | `GET` | `DELETE`/`GET`/`PATCH`/`POST`/`PUT` |
| `query`   | `Params`                 | —     | 查询参数，按查询串规则拼接          |
| `body`    | `unknown`                | —     | 请求体，按 JSON 提交                |
| `headers` | `Record<string, string>` | —     | 附加请求头，覆盖固定头              |
| `signal`  | `AbortSignal`            | —     | 取消信号                            |

请求头缺省带 `Accept: application/json`；有请求体时补齐 `Content-Type: application/json`。

## HttpResult

| 字段      | 类型      | 说明                                                                        |
| --------- | --------- | --------------------------------------------------------------------------- |
| `ok`      | `boolean` | 业务码为 `200` 时为真                                                       |
| `code`    | `number`  | 响应体的 `code`，缺失时取 HTTP 状态码                                       |
| `message` | `string`  | 响应体的 `msg` 或 `message`；成功且无消息时为空串，失败且无消息时用内置文案 |
| `data`    | `T`       | 响应体的 `data`，缺失时为原始响应                                           |
| `raw`     | `unknown` | 原始响应体                                                                  |

非 JSON 响应原样返回文本，不会因为解析失败吞掉服务端提示。

::: warning 网络异常会抛出
连接失败、超时、被中断等网络层错误统一抛出携带内置文案的 `Error`，不会返回 `ok: false` 的结果。业务侧用 `try/catch` 处理网络层异常，用 `ok` 处理业务层失败。
:::

## createHttp

单独创建客户端时使用，全部选项可缺省。包产物只导出装配好的 `moire`，需要替换请求实现时在源码层另建入口。

| 选项       | 类型                                               | 说明                                   |
| ---------- | -------------------------------------------------- | -------------------------------------- |
| `baseUrl`  | `string`                                           | 基础地址，拼在相对地址前；绝对地址不拼 |
| `headers`  | `Record<string, string>`                           | 固定请求头                             |
| `fetch`    | `typeof fetch`                                     | 请求实现，便于测试替换                 |
| `request`  | `(request) => HttpRequest \| Promise<HttpRequest>` | 发送前改写请求                         |
| `response` | `(result) => HttpResult \| Promise<HttpResult>`    | 归一时改写结果                         |
| `error`    | `(error: Error) => void`                           | 网络异常回调                           |

```ts
// 源码层装配
const http = createHttp({
  baseUrl: '/api',
  headers: { 'X-Token': 'demo' },
  response: (result) => ({
    ...result,
    // 业务约定 code 为 0 也算成功
    ok: result.code === 0 || result.ok,
  }),
})

await http.request({ url: '/users', method: 'POST', body: { nick: '云纹' } })
```

## 与工具能力的关系

默认实例把 `http.request` 交给工具插件，删除等操作复用同一套请求与归一逻辑。替换请求实现时，两者会一起生效；只想改工具侧时，在源码层单独装配 `createToolsPlugin` 并注入自己的 `request`。
