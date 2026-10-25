---
layout: home
# 首页无正文 h1，显式给 title 避免浏览器标签出现「云纹框架 - 云纹框架」重复
title: 轻量级 JS 前端辅助框架

hero:
  name: 云纹框架
  text: 轻量级 JS 前端辅助框架
  tagline: 微内核装配、具名枚举、schema 驱动的字段与视图。全部能力收敛到单一 window.moire，界面库经适配层隔离，缺失即降级。
  actions:
    - theme: brand
      text: 30 秒上手
      link: ./getting-started
    - theme: alt
      text: API 总览
      link: ./api/
    - theme: alt
      text: GitHub
      link: https://github.com/fxri-net/moire

features:
  - icon: 🧩
    title: 微内核装配
    details: 插件只需声明 name 与 depends，内核按依赖拓扑排序装配；单个插件装配失败只发通知，不连累其余能力。
  - icon: 🎯
    title: 单一全局对象
    details: 枚举、工具、国际化、请求、字段、视图与工具能力统一挂在 window.moire，不再散落多个全局命名空间。
  - icon: 🏷️
    title: 具名枚举
    details: 19 个 const 枚举以语义化 code 表达，旧版本的数字模式码与数字属性全部退场，switch 由类型检查保证穷尽。
  - icon: 🧱
    title: schema 驱动
    details: FormSchema 与 ListSchema 描述结构，装配阶段不碰 DOM；字段渲染器可注册替换，默认实现覆盖 16 种字段类型。
  - icon: 🛡️
    title: 界面库隔离
    details: layui / jQuery / LayX / TinyMCE / Sortable 只在适配层出现，运行期自动探测，缺失时安全降级。
  - icon: 📦
    title: 可校验交付
    details: 一次构建产出 IIFE、ESM、类型声明与 manifest.json 四类产物，逐文件登记字节数与 sha256。
---

## 30 秒上手

传统页面直接引入 IIFE 产物，加载即挂载 `window.moire` 并启动：

```html
<script src="./moire/moire.min.js"></script>
<script>
  // 能力都在同一实例上
  moire.utils.isString('a')
  const list = moire.views.list.assemble({ columns: [{ name: 'name', title: '名称' }] })
  moire.views.list.render(list, document.querySelector('#app'))
</script>
```

现代构建工具改用 ESM 产物，挂载与启动交由接入方决定：

```js
import { moire } from 'moire'

moire.start()
```

字段与视图按声明装配：

```js
const form = moire.fields.createForm(
  {
    fields: [
      { name: 'account', kind: moire.enum.FieldKind.Input, label: '账号', required: true },
      { name: 'password', kind: moire.enum.FieldKind.Password, label: '口令', required: true },
    ],
  },
  document.querySelector('#form'),
)

const { valid, values, issues } = form.echo()
```

详细步骤见[快速上手](./getting-started)。

## 能力矩阵

| 命名空间       | 提供什么                                                          | 详细参考                 |
| -------------- | ----------------------------------------------------------------- | ------------------------ |
| `moire.enum`   | 19 个具名枚举字典，覆盖合并、地址、时间、字段、规则、视图与工具   | [枚举字典](./enums)      |
| `moire.utils`  | 类型判定、对象合并、文本编解码、时间与地址、DOM 与文件共 30+ 函数 | [工具函数](./api/utils)  |
| `moire.i18n`   | 键化文案、具名插值、语言切换与词条追加                            | [国际化](./api/i18n)     |
| `moire.http`   | fetch 封装，响应归一到 `{ ok, code, message, data, raw }`         | [请求客户端](./api/http) |
| `moire.fields` | 16 种字段渲染器、字段实例七阶段生命周期、表单实例                 | [字段能力](./api/fields) |
| `moire.views`  | 列表纯装配（列归一 / 排序 / 分页 / 选择）与薄渲染                 | [视图能力](./api/views)  |
| `moire.tools`  | 删除、导出、下载、导入、消息与窗口，统一结构化结果                | [工具能力](./api/tools)  |
| `moire.ui`     | 界面适配，缺库时逐级降级                                          | [界面适配](./api/ui)     |

## 文档索引

| 文档                           | 适合谁                           |
| ------------------------------ | -------------------------------- |
| [快速上手](./getting-started)  | 第一次接入，想先跑起来           |
| [架构设计](./architecture)     | 想了解内核、插件、适配层如何分层 |
| [API 总览](./api/)             | 按模块查签名、选项与返回值       |
| [枚举字典](./enums)            | 查枚举成员与语义                 |
| [layui 适配](./adapters/layui) | 想启用界面增强或替换适配实现     |
| [构建产物](./build)            | 想知道 dist 里每个文件是什么     |
| [分发与接入](./distribution)   | 业务项目如何按版本拉取产物       |
| [发版流程](./release)          | 维护者如何出一次版本             |
| [迁移指南](./migration)        | 从 0.4 升级到 1.0                |
| [常见问题](./faq)              | 遇到问题先来这里找               |
| [更新日志](./changelog)        | 查各版本变更内容                 |

## 环境要求

- 运行环境：主流浏览器（不支持 IE）
- 构建环境：Node.js >= 20.19.0、pnpm 10
- 界面增强：可选，缺失时自动降级
