<p align="center">
  <img src="./docs/public/logo.svg" width="128" alt="云纹框架">
</p>

# 云纹框架

[![CI](https://github.com/fxri-net/moire/actions/workflows/ci.yml/badge.svg)](https://github.com/fxri-net/moire/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/node-%E2%89%A520-brightgreen)](https://fxri-net.github.io/moire/getting-started.html)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue)](./LICENSE)

轻量级 JS 前端辅助框架：可以接入任意 JS 项目，内置枚举、工具、国际化、请求、字段与视图等常用能力。

> 国内网络建议优先 [Gitee 镜像](https://gitee.com/fxri/moire)（与 GitHub 同源同步）；问题反馈走 [GitHub Issues](https://github.com/fxri-net/moire/issues) 或 [Gitee Issues](https://gitee.com/fxri/moire/issues)。

> 定位：把各业务项目里反复重写的辅助代码收敛成一套可复用的能力。全部能力挂在单一实例 `window.moire` 上，按需取用；界面增强经适配层与业务解耦，缺失 UI 库时自动降级，核心能力不受影响。不绑定框架与构建工具，主流浏览器直接可用，不兼容 IE。

## ✨ 能力矩阵

| 能力     | 用途                                                              | 文档                                                                  |
| -------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| 枚举字典 | 合并模式、地址参数、时长单位、补位方向、批量选择等一律用具名 code | [枚举字典](https://fxri-net.github.io/moire/enums.html)               |
| 工具函数 | 类型判断、地址编解码、字符串补位、按路径取值等常用判断与转换      | [API 参考](https://fxri-net.github.io/moire/api/utils.html)           |
| 国际化   | 词条注册、变量插值、语言检测与本地持久化                          | [API 参考](https://fxri-net.github.io/moire/api/i18n.html)            |
| 请求封装 | 响应归一、业务码判定、错误回调，网络层与业务层失败分开处理        | [API 参考](https://fxri-net.github.io/moire/api/http.html)            |
| 字段声明 | 声明式建表、规则校验、回显与重置                                  | [API 参考](https://fxri-net.github.io/moire/api/fields.html)          |
| 视图装配 | 列表排序、分页、批量选择与容器化渲染                              | [API 参考](https://fxri-net.github.io/moire/api/views.html)           |
| 工具集   | 删除、导出、导入等常见动作，统一返回结果语义                      | [API 参考](https://fxri-net.github.io/moire/api/tools.html)           |
| 界面适配 | layui 单一适配实现，覆盖日期、上传、富文本、多选、排序与浮层层级  | [与 layui 适配](https://fxri-net.github.io/moire/adapters/layui.html) |

## 📚 文档

| 文档                                                                  | 适合谁                             |
| --------------------------------------------------------------------- | ---------------------------------- |
| [快速上手](https://fxri-net.github.io/moire/getting-started.html)     | 第一次接触，想 30 秒跑起来         |
| [架构总览](https://fxri-net.github.io/moire/architecture.html)        | 了解微内核、插件装配与适配层的分工 |
| [枚举字典](https://fxri-net.github.io/moire/enums.html)               | 查具名 code 与取值                 |
| [API 参考](https://fxri-net.github.io/moire/api/)                     | 查实例上的方法与选项               |
| [与 layui 适配](https://fxri-net.github.io/moire/adapters/layui.html) | 搞清界面增强的生效条件与降级行为   |
| [构建产物](https://fxri-net.github.io/moire/build.html)               | 查四类产物、构建链与验收命令       |
| [分发与接入](https://fxri-net.github.io/moire/distribution.html)      | 用版本标签把产物接入业务项目       |
| [发版流程](https://fxri-net.github.io/moire/release.html)             | 维护者发版与撰写发布说明           |
| [从 0.4 升级](https://fxri-net.github.io/moire/migration.html)        | 旧项目迁移的逐项对照               |
| [更新日志](https://fxri-net.github.io/moire/changelog.html)           | 查各版本变更内容                   |
| [FAQ](https://fxri-net.github.io/moire/faq.html)                      | 遇到问题先来这里找                 |
| [完整文档站](https://fxri-net.github.io/moire/)                       | 在线阅读体验                       |

## 📦 接入

```html
<!-- 直接引入产物：自动挂载到 window.moire 并启动 -->
<script src="./moire/moire.min.js"></script>
```

```js
// 现代构建工具：挂载与启动交由接入方决定
import { moire } from 'moire'

moire.start()
```

产物获取方式见[分发与接入](https://fxri-net.github.io/moire/distribution.html)，可选 UI 依赖与缺失时的降级规则见[与 layui 适配](https://fxri-net.github.io/moire/adapters/layui.html)。

## 🧩 示例

仓库 `examples` 下提供表单、列表与自定义插件三个最小示例，均只依赖产物、不要求界面库，说明见[快速上手](https://fxri-net.github.io/moire/getting-started.html)。

## ⚙️ 环境要求

- 运行：主流浏览器，不兼容 IE
- 可选界面库：layui ≥ 2.6.4、jQuery ≥ 1.9、LayX ≥ 2.5.4、Sortable ≥ 1.10.2、TinyMCE（缺失时自动降级）
- 构建：Node.js ≥ 20.19.0（详见[构建产物](https://fxri-net.github.io/moire/build.html)）

## 📄 版权信息

作者：唐启云 <tqy@fxri.net>

出品：方弦研究所

版权：Copyright © 2017-2026 唐启云. All rights reserved.

网站：[方弦研究信息网](https://fxri.net:444/)

协议：[Apache License 2.0](./LICENSE)

商标："方弦®"为第42类注册商标（注册号89648411），本开源许可不授予商标使用权，详见 [TRADEMARK.md](./TRADEMARK.md)

> 方弦研究所为唐启云个人项目品牌与出品方，非独立法人实体；本软件著作权归唐启云所有。

本项目包含的第三方源码和二进制文件之版权信息另行标注。
